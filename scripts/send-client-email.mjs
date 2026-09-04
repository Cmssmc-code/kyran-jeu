import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

let env = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [k, ...v] = trimmed.split('=');
      env[k.trim()] = v.join('=').trim();
    }
  }
}

const args = process.argv.slice(2);
function getArg(key, fallback = null) {
  const idx = args.indexOf(key);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const to = getArg('--to');
const customerName = getArg('--name', '');
const subject = getArg('--subject', 'Message concernant votre jeu KYRAN');
const message = getArg('--message', '');
const actionText = getArg('--action-text', null);
const actionUrl = getArg('--action-url', null);

if (!to || !message) {
  console.log('⚡ Envoi d\'email officiel KYRAN au client');
  console.log('\nUsage:');
  console.log('  node scripts/send-client-email.mjs --to client@email.com --message "Votre message ici" [--name "Alexandre"] [--subject "Sujet"] [--action-text "Bouton"] [--action-url "https://..."]');
  console.log('\nExemple:');
  console.log('  node scripts/send-client-email.mjs --to client@gmail.com --name "Marie" --subject "Mise à jour commande" --message "Votre colis est bien en cours de préparation. Il sera déposé demain matin en bureau de poste."');
  process.exit(1);
}

const serverUrl = process.env.KYRAN_WEBHOOK_URL || 'https://kyran-webhook-production.up.railway.app';
const secret = process.env.ADMIN_SECRET || 'kyran_secret_2026';

async function send() {
  console.log(`✉️ Envoi de l'email à ${to}...`);

  const res = await fetch(`${serverUrl}/api/send-custom-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secret}`
    },
    body: JSON.stringify({
      to,
      customerName,
      subject,
      message,
      actionText,
      actionUrl
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erreur HTTP ${res.status}`);
  }

  console.log(`✅ Email officiel KYRAN envoyé avec succès à ${to} (ID: ${data.id}) !`);
}

send().catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
