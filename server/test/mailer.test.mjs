// Tests de l'envoi d'emails : expéditeur toujours KYRAN, client SMTP (faux serveur local).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { resolveSender, isAllowedSender, buildMimeMessage, createMailer, DEFAULT_SENDER } from '../mailer.js';

test('expéditeur : uniquement une adresse KYRAN', () => {
  assert.equal(resolveSender(''), DEFAULT_SENDER);
  assert.equal(resolveSender('contact@majordia.fr'), DEFAULT_SENDER);
  assert.equal(resolveSender('noreply@evil.example'), DEFAULT_SENDER);
  assert.equal(resolveSender('Contact@Kyran-Jeu.fr'), 'contact@kyran-jeu.fr');
  assert.equal(resolveSender('kyran.jeu@gmail.com'), 'kyran.jeu@gmail.com');
  assert.equal(isAllowedSender('autre@gmail.com'), false);
  assert.equal(isAllowedSender('x@kyran-jeu.fr.evil.com'), false);
});

test('Resend : le champ from est une adresse KYRAN même si SENDER_EMAIL vise un autre domaine', async () => {
  const original = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'r1' }), { status: 200 });
  };
  try {
    const mailer = createMailer({ RESEND_API_KEY: 're_test', SENDER_EMAIL: 'contact@majordia.fr' });
    assert.equal(mailer.transport, 'resend');
    await mailer.sendEmail({ to: 'client@example.com', subject: 'Commande', html: '<p>ok</p>' });
    assert.equal(sent.from, 'KYRAN <contact@kyran-jeu.fr>');
    assert.doesNotMatch(JSON.stringify(sent), /majordia/);
  } finally {
    globalThis.fetch = original;
  }
});

test('MIME : en-têtes encodés, corps en base64, pas d\'injection d\'en-tête', () => {
  const msg = buildMimeMessage({
    fromName: 'KYRAN', from: 'contact@kyran-jeu.fr', to: ['a@b.fr'], replyTo: 'contact@kyran-jeu.fr',
    subject: 'Été\r\nBcc: x@evil.com', text: 'Bonjour', html: '<p>Été</p>'
  });
  assert.match(msg, /^From: KYRAN <contact@kyran-jeu\.fr>/m);
  assert.doesNotMatch(msg, /^Bcc:/m);
  assert.match(msg, /^Subject: =\?UTF-8\?B\?/m);
  assert.ok(msg.includes(Buffer.from('<p>Été</p>').toString('base64')));
});

test('SMTP : dialogue complet avec un faux serveur', async () => {
  const log = [];
  let data = '';
  const server = net.createServer(sock => {
    sock.setEncoding('utf8');
    let inData = false;
    sock.write('220 smtp.test ESMTP\r\n');
    sock.on('data', chunk => {
      for (const line of chunk.split('\r\n').filter((l, i, a) => i < a.length - 1 || l)) {
        if (inData) {
          if (line === '.') { inData = false; sock.write('250 2.0.0 Ok: queued as ABC\r\n'); } else data += `${line}\n`;
          continue;
        }
        log.push(line);
        if (line.startsWith('EHLO')) sock.write('250-smtp.test\r\n250-AUTH LOGIN\r\n250 8BITMIME\r\n');
        else if (line === 'AUTH LOGIN') sock.write('334 VXNlcm5hbWU6\r\n');
        else if (log.length === 3) sock.write('334 UGFzc3dvcmQ6\r\n');
        else if (log.length === 4) sock.write('235 2.7.0 Authentication successful\r\n');
        else if (line.startsWith('MAIL FROM') || line.startsWith('RCPT TO')) sock.write('250 OK\r\n');
        else if (line === 'DATA') { inData = true; sock.write('354 End data with <CR><LF>.<CR><LF>\r\n'); }
        else if (line === 'QUIT') { sock.write('221 Bye\r\n'); sock.end(); }
      }
    });
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try {
    const mailer = createMailer({
      SMTP_PASSWORD: 'secret', SMTP_HOST: '127.0.0.1', SMTP_PORT: String(server.address().port), SMTP_SECURE: 'false',
      SENDER_EMAIL: 'contact@majordia.fr', RESEND_API_KEY: 're_ignored'
    });
    assert.equal(mailer.transport, 'smtp');
    const res = await mailer.sendEmail({ to: ['a@b.fr', 'c@d.fr'], subject: 'Test', text: 'Bonjour', html: '<b>hi</b>' });
    assert.match(res.id, /queued as ABC/);
    assert.equal(log[1], 'AUTH LOGIN');
    assert.equal(Buffer.from(log[2], 'base64').toString(), 'contact@kyran-jeu.fr');
    assert.ok(log.includes('MAIL FROM:<contact@kyran-jeu.fr>'));
    assert.ok(log.includes('RCPT TO:<c@d.fr>'));
    assert.match(data, /^From: KYRAN <contact@kyran-jeu\.fr>/m);
  } finally {
    server.close();
  }
});
