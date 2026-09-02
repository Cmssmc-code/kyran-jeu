import tls from 'tls';

const email = process.argv[2] || 'contact@kyran-jeu.fr';
const password = process.argv[3];

if (!password) {
  console.log('Usage: node scripts/test-smtp.mjs <email> <password>');
  console.log('Exemple: node scripts/test-smtp.mjs contact@kyran-jeu.fr MonMotDePasse123');
  process.exit(1);
}

const socket = tls.connect(465, 'ssl0.ovh.net', { servername: 'ssl0.ovh.net' }, () => {
  console.log('Connexion TLS à ssl0.ovh.net:465 établie.');
});

let step = 0;
socket.setEncoding('utf8');

socket.on('data', (data) => {
  const line = data.trim();
  // console.log('S:', line);
  if (step === 0 && line.startsWith('220')) {
    socket.write('EHLO kyran-jeu.fr\r\n');
    step = 1;
  } else if (step === 1 && line.includes('250')) {
    socket.write('AUTH LOGIN\r\n');
    step = 2;
  } else if (step === 2 && line.startsWith('334')) {
    socket.write(Buffer.from(email).toString('base64') + '\r\n');
    step = 3;
  } else if (step === 3 && line.startsWith('334')) {
    socket.write(Buffer.from(password).toString('base64') + '\r\n');
    step = 4;
  } else if (step === 4) {
    if (line.startsWith('235')) {
      console.log('\n✅ SUCCÈS : Identifiants SMTP OVH 100% VALIDES !');
      console.log('Vous pouvez saisir ce mot de passe dans Gmail en toute confiance.');
      socket.write('QUIT\r\n');
      socket.end();
      process.exit(0);
    } else {
      console.error('\n❌ ÉCHEC AUTHENTIFICATION : Mot de passe incorrect pour', email);
      console.error('Réponse serveur OVH :', line);
      socket.write('QUIT\r\n');
      socket.end();
      process.exit(1);
    }
  }
});

socket.on('error', (err) => {
  console.error('Erreur connexion :', err.message);
  process.exit(1);
});
