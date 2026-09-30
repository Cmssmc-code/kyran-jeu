import tls from 'tls';

// Script autonome d'envoi d'email via SMTP OVH (contact@kyran-jeu.fr)
const SMTP_HOST = 'ssl0.ovh.net';
const SMTP_PORT = 465;
const SENDER_EMAIL = 'contact@kyran-jeu.fr';

// Empêche l'injection de commandes SMTP / d'en-têtes via des retours à la ligne
function assertSingleLine(value, label) {
  if (/[\r\n]/.test(String(value))) throw new Error(`${label} invalide (retour à la ligne interdit)`);
}

// « Dot-stuffing » SMTP : une ligne commençant par « . » terminerait le message
function dotStuff(body) {
  return String(body).replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');
}

export function sendMail({ user = SENDER_EMAIL, pass, to, subject, text, html }) {
  return new Promise((resolve, reject) => {
    if (!pass) return reject(new Error('Mot de passe SMTP requis'));
    if (!to) return reject(new Error('Destinataire requis'));
    try {
      assertSingleLine(to, 'Destinataire');
      assertSingleLine(user, 'Expéditeur');
      assertSingleLine(subject || '', 'Sujet');
    } catch (err) {
      return reject(err);
    }

    const socket = tls.connect(SMTP_PORT, SMTP_HOST, { servername: SMTP_HOST }, () => {});
    socket.setEncoding('utf8');

    let step = 0;

    socket.on('data', (data) => {
      const line = data.trim();
      if (step === 0 && line.startsWith('220')) {
        socket.write('EHLO kyran-jeu.fr\r\n');
        step = 1;
      } else if (step === 1 && line.includes('250')) {
        socket.write('AUTH LOGIN\r\n');
        step = 2;
      } else if (step === 2 && line.startsWith('334')) {
        socket.write(Buffer.from(user).toString('base64') + '\r\n');
        step = 3;
      } else if (step === 3 && line.startsWith('334')) {
        socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        step = 4;
      } else if (step === 4) {
        if (!line.startsWith('235')) {
          socket.end();
          return reject(new Error('Authentification SMTP échouée: ' + line));
        }
        socket.write(`MAIL FROM:<${user}>\r\n`);
        step = 5;
      } else if (step === 5 && line.startsWith('250')) {
        socket.write(`RCPT TO:<${to}>\r\n`);
        step = 6;
      } else if (step === 6 && line.startsWith('250')) {
        socket.write('DATA\r\n');
        step = 7;
      } else if (step === 7 && line.startsWith('354')) {
        const boundary = '----=_Part_' + Date.now().toString(16);
        let mailContent = '';

        if (html) {
          const plainText = text || 'Veuillez visualiser ce message dans client email compatible HTML.';
          mailContent = [
            `From: "KYRAN" <${user}>`,
            `To: <${to}>`,
            `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            dotStuff(plainText),
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            dotStuff(html),
            '',
            `--${boundary}--`,
            '.',
            ''
          ].join('\r\n');
        } else {
          mailContent = [
            `From: "KYRAN" <${user}>`,
            `To: <${to}>`,
            `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            dotStuff(text || ''),
            '.',
            ''
          ].join('\r\n');
        }

        socket.write(mailContent);
        step = 8;
      } else if (step === 8 && line.startsWith('250')) {
        socket.write('QUIT\r\n');
        socket.end();
        resolve({ success: true, messageId: line });
      }
    });

    socket.on('error', reject);
  });
}

// Exécution CLI si appelé directement
const isDirectRun = process.argv[1] && process.argv[1].endsWith('send-mail-ovh.mjs');
if (isDirectRun) {
  const args = process.argv.slice(2);
  const toIdx = args.indexOf('--to');
  const subjIdx = args.indexOf('--subject');
  const bodyIdx = args.indexOf('--body');

  // Mot de passe uniquement via variable d'environnement (jamais en argument de commande)
  const pass = process.env.OVH_SMTP_PASSWORD || process.env.OVH_MAIL_PASSWORD;
  const to = toIdx !== -1 ? args[toIdx + 1] : null;
  const subject = subjIdx !== -1 ? args[subjIdx + 1] : 'Message de KYRAN';
  const text = bodyIdx !== -1 ? args[bodyIdx + 1] : 'Bonjour,\n\nCeci est un message de test envoyé depuis contact@kyran-jeu.fr.';

  if (!pass || !to) {
    console.log('Usage: OVH_SMTP_PASSWORD=... node scripts/send-mail-ovh.mjs --to CLIENT_EMAIL --subject "Sujet" --body "Texte"');
    console.log('Astuce : `read -s OVH_SMTP_PASSWORD && export OVH_SMTP_PASSWORD` pour saisir le mot de passe sans l\'afficher.');
    process.exit(1);
  }

  sendMail({ pass, to, subject, text })
    .then(() => console.log('✅ Email envoyé avec succès à', to))
    .catch((err) => {
      console.error('❌ Erreur envoi email :', err.message);
      process.exit(1);
    });
}
