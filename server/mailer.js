/**
 * Envoi des emails KYRAN, toujours depuis une adresse KYRAN.
 *
 * Expéditeurs autorisés : une adresse @kyran-jeu.fr (défaut contact@kyran-jeu.fr) ou
 * kyran.jeu@gmail.com. Toute autre adresse configurée (ex. un domaine d'un autre produit)
 * est remplacée par contact@kyran-jeu.fr.
 *
 * Transport (EMAIL_TRANSPORT=resend|smtp pour forcer) :
 *  1. API Resend si RESEND_API_KEY est défini (exige le domaine kyran-jeu.fr vérifié dans Resend).
 *     Prioritaire : Railway bloque le SMTP sortant hors offre Pro ;
 *  2. sinon SMTP si SMTP_PASSWORD (ou OVH_SMTP_PASSWORD) est défini : boîte OVH ssl0.ovh.net pour
 *     @kyran-jeu.fr, smtp.gmail.com (mot de passe d'application) pour kyran.jeu@gmail.com.
 */
import net from 'net';
import tls from 'tls';
import crypto from 'crypto';

export const DEFAULT_SENDER = 'contact@kyran-jeu.fr';
const GMAIL_SENDER = 'kyran.jeu@gmail.com';

export function isAllowedSender(email) {
  const e = String(email || '').trim().toLowerCase();
  return /^[a-z0-9._%+-]+@kyran-jeu\.fr$/.test(e) || e === GMAIL_SENDER;
}

/** Adresse d'expédition effective : jamais une adresse hors KYRAN. */
export function resolveSender(configured) {
  const e = String(configured || '').trim().toLowerCase();
  if (!e) return DEFAULT_SENDER;
  if (isAllowedSender(e)) return e;
  console.warn(`⚠️ SENDER_EMAIL « ${e} » refusé (pas une adresse KYRAN) : envoi depuis ${DEFAULT_SENDER}.`);
  return DEFAULT_SENDER;
}

function defaultSmtpHost(sender) {
  return sender === GMAIL_SENDER ? 'smtp.gmail.com' : 'ssl0.ovh.net';
}

function encodeHeader(value) {
  const s = String(value).replace(/[\r\n]+/g, ' ');
  return /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`;
}

function base64Body(text) {
  return Buffer.from(String(text), 'utf8').toString('base64').replace(/.{1,76}/g, '$&\r\n');
}

function assertAddress(addr) {
  if (!/^[^\s<>@,;:"]+@[^\s<>@,;:"]+$/.test(String(addr))) throw new Error(`Adresse invalide : ${addr}`);
}

/** Message MIME multipart (texte + HTML), corps en base64 (lignes courtes, pas de dot-stuffing nécessaire). */
export function buildMimeMessage({ fromName, from, to, replyTo, subject, text, html }) {
  const boundary = `=_kyran_${crypto.randomBytes(12).toString('hex')}`;
  const headers = [
    `From: ${encodeHeader(fromName)} <${from}>`,
    `To: ${to.map(a => `<${a}>`).join(', ')}`,
    replyTo ? `Reply-To: <${replyTo}>` : null,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@kyran-jeu.fr>`,
    'MIME-Version: 1.0'
  ].filter(Boolean);
  const plain = text || 'Ce message est au format HTML.';
  if (!html) {
    return [...headers, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', base64Body(plain)].join('\r\n');
  }
  return [
    ...headers,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64Body(plain),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64Body(html),
    `--${boundary}--`,
    ''
  ].join('\r\n');
}

/**
 * Client SMTP minimal (AUTH LOGIN), sans dépendance. `secure: false` (TCP en clair) ne sert
 * qu'aux tests locaux.
 */
export function smtpSend({ host, port = 465, secure = true, user, pass, from, to, message, timeoutMs = 10000 }) {
  return new Promise((resolve, reject) => {
    for (const a of [from, ...to]) assertAddress(a);
    const socket = secure
      ? tls.connect({ host, port, servername: host })
      : net.connect({ host, port });
    socket.setEncoding('utf8');
    socket.setTimeout(timeoutMs, () => fail(new Error('SMTP : délai dépassé')));

    const commands = [
      { expect: [220], send: () => 'EHLO kyran-jeu.fr' },
      { expect: [250], send: () => 'AUTH LOGIN' },
      { expect: [334], send: () => Buffer.from(user).toString('base64'), secret: true },
      { expect: [334], send: () => Buffer.from(pass).toString('base64'), secret: true },
      { expect: [235], send: () => `MAIL FROM:<${from}>` },
      ...to.map(rcpt => ({ expect: [250], send: () => `RCPT TO:<${rcpt}>` })),
      { expect: [250, 251], send: () => 'DATA' },
      { expect: [354], send: () => `${message.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..')}\r\n.` },
      { expect: [250], send: () => 'QUIT', last: true }
    ];
    let step = 0;
    let buffer = '';
    let done = false;

    function fail(err) {
      if (done) return;
      done = true;
      socket.destroy();
      reject(err);
    }

    socket.on('data', chunk => {
      buffer += chunk;
      // Réponse complète : dernière ligne « NNN texte » (les lignes « NNN-… » annoncent la suite)
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).replace(/\r$/, '');
        buffer = buffer.slice(idx + 1);
        if (/^\d{3}-/.test(line)) continue;
        const code = parseInt(line.slice(0, 3), 10);
        const cmd = commands[step];
        if (!cmd) return;
        if (!cmd.expect.includes(code)) {
          return fail(new Error(`SMTP : réponse inattendue à l'étape ${step} : ${cmd.secret ? code : line}`));
        }
        socket.write(`${cmd.send()}\r\n`);
        step += 1;
        if (cmd.last) {
          done = true;
          socket.end();
          return resolve({ id: line.slice(4).trim() || 'smtp' });
        }
      }
    });
    socket.on('error', fail);
    socket.on('close', () => fail(new Error('SMTP : connexion fermée prématurément')));
  });
}

/** Crée la fonction d'envoi à partir de l'environnement. */
export function createMailer(env = process.env) {
  const sender = resolveSender(env.SENDER_EMAIL);
  const senderName = env.SENDER_NAME || 'KYRAN';
  const replyTo = env.REPLY_TO_EMAIL || DEFAULT_SENDER;
  const smtpPass = env.SMTP_PASSWORD || env.OVH_SMTP_PASSWORD || '';
  const resendKey = env.RESEND_API_KEY || '';
  const forced = ['resend', 'smtp'].includes(env.EMAIL_TRANSPORT) ? env.EMAIL_TRANSPORT : '';
  const transport = forced === 'smtp' && smtpPass ? 'smtp'
    : forced === 'resend' && resendKey ? 'resend'
      : resendKey ? 'resend' : smtpPass ? 'smtp' : 'none';

  async function viaResend({ to, subject, html, text }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `${senderName} <${sender}>`, to, reply_to: replyTo, subject, html, text: text || undefined }),
        signal: controller.signal
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(`Erreur Resend (${res.status}): ${json.message || JSON.stringify(json)}`);
      return json;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function viaSmtp({ to, subject, html, text }) {
    const message = buildMimeMessage({ fromName: senderName, from: sender, to, replyTo, subject, text, html });
    return smtpSend({
      host: env.SMTP_HOST || defaultSmtpHost(sender),
      port: parseInt(env.SMTP_PORT || '465', 10),
      secure: env.SMTP_SECURE !== 'false',
      user: env.SMTP_USER || sender,
      pass: smtpPass,
      from: sender,
      to,
      message
    });
  }

  async function sendEmail({ to, subject, html, text }) {
    const recipients = Array.isArray(to) ? to : [to];
    if (transport === 'none') {
      console.warn('⚠️ Ni SMTP_PASSWORD ni RESEND_API_KEY : simulation envoi à :', recipients);
      return { simulated: true };
    }
    console.log(`✉️ Envoi email (${transport}, depuis ${sender}) à ${recipients.join(', ')}...`);
    const result = transport === 'smtp'
      ? await viaSmtp({ to: recipients, subject, html, text })
      : await viaResend({ to: recipients, subject, html, text });
    console.log(`✅ Email délivré à ${recipients.join(', ')} (${transport} ID: ${result.id})`);
    return result;
  }

  return { sendEmail, sender, senderName, replyTo, transport };
}
