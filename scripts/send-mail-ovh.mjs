import tls from 'tls';

// Script autonome d'envoi d'email via SMTP OVH (contact@kyran-jeu.fr)
const SMTP_HOST = 'ssl0.ovh.net';
const SMTP_PORT = 465;
const SENDER_EMAIL = 'contact@kyran-jeu.fr';

export function sendMail({ user = SENDER_EMAIL, pass, to, subject, text }) {
  return new Promise((resolve, reject) => {
    if (!pass) return reject(new Error('Mot de passe SMTP requis'));
    if (!to) return reject(new Error('Destinataire requis'));

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
        const mailContent = [
          `From: "KYRAN" <${user}>`,
          `To: <${to}>`,
          `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=UTF-8',
          'Content-Transfer-Encoding: 8bit',
          '',
          text,
          '.',
          ''
        ].join('\r\n');
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
  const passIdx = args.indexOf('--pass');
  const toIdx = args.indexOf('--to');
  const subjIdx = args.indexOf('--subject');
  const bodyIdx = args.indexOf('--body');

  const pass = passIdx !== -1 ? args[passIdx + 1] : process.env.OVH_MAIL_PASSWORD;
  const to = toIdx !== -1 ? args[toIdx + 1] : null;
  const subject = subjIdx !== -1 ? args[subjIdx + 1] : 'Message de KYRAN';
  const text = bodyIdx !== -1 ? args[bodyIdx + 1] : 'Bonjour,\n\nCeci est un message de test envoyé depuis contact@kyran-jeu.fr.';

  if (!pass || !to) {
    console.log('Usage: node scripts/send-mail-ovh.mjs --pass VOTRE_MOT_DE_PASSE --to CLIENT_EMAIL --subject "Sujet" --body "Texte"');
    process.exit(1);
  }

  sendMail({ pass, to, subject, text })
    .then(() => console.log('✅ Email envoyé avec succès à', to))
    .catch((err) => {
      console.error('❌ Erreur envoi email :', err.message);
      process.exit(1);
    });
}
