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
const customerName = getArg('--name', 'Cher joueur');
const orderId = getArg('--order', '');
const carrier = getArg('--carrier', 'La Poste (Courrier Suivi)');
const trackingNumber = getArg('--tracking', '');
const trackingUrl = getArg('--url', trackingNumber ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}` : '');
const estimatedDelivery = getArg('--delay', '2 à 4 jours ouvrés');

if (!to) {
  console.log('Usage: node scripts/send-shipping-email.mjs --to client@email.com [--name "Jean"] [--tracking "1L123456789"] [--order "cs_123"] [--carrier "La Poste"]');
  process.exit(1);
}

async function send() {
  console.log(`🚀 Déclenchement de l'email d'expédition pour ${to} (Suivi: ${trackingNumber || 'aucun'})...`);

  const serverUrl = process.env.KYRAN_WEBHOOK_URL || 'https://kyran-webhook-production.up.railway.app';
  const secret = process.env.ADMIN_SECRET || 'kyran_secret_2026';

  const res = await fetch(`${serverUrl}/api/shipping`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secret}`
    },
    body: JSON.stringify({
      customerEmail: to,
      customerName,
      orderId,
      carrier,
      trackingNumber,
      trackingUrl,
      estimatedDelivery
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erreur HTTP ${res.status}`);
  }

  console.log(`✅ Email d'expédition délivré avec succès à ${to} !`);
}

send().catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
