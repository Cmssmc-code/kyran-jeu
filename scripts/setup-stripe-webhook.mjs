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

const stripeKey = env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('❌ Erreur: STRIPE_SECRET_KEY manquant dans .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0];
const targetUrl = args[1];

async function stripeRequest(endpoint, method = 'GET', data = null) {
  const url = `https://api.stripe.com/v1${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  if (data) {
    options.body = new URLSearchParams(data).toString();
  }
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || `Erreur HTTP ${res.status}`);
  }
  return json;
}

async function main() {
  console.log('⚡ Stripe KYRAN Webhook Manager');

  if (command === 'list' || !command) {
    console.log('🔍 Consultation des endpoints de webhook configurés...');
    const result = await stripeRequest('/webhook_endpoints');
    if (result.data.length === 0) {
      console.log('ℹ️ Aucun endpoint webhook configuré sur ce compte Stripe.');
      console.log('\nPour en créer un :');
      console.log('  node scripts/setup-stripe-webhook.mjs create https://votre-worker.workers.dev');
    } else {
      console.log(`✅ ${result.data.length} endpoint(s) trouvé(s) :`);
      result.data.forEach(wh => {
        console.log(`- ID: ${wh.id}`);
        console.log(`  URL: ${wh.url}`);
        console.log(`  Statut: ${wh.status}`);
        console.log(`  Événements: ${wh.enabled_events.join(', ')}`);
      });
    }
    return;
  }

  if (command === 'create') {
    if (!targetUrl || !targetUrl.startsWith('http')) {
      console.error('❌ URL valide requise : node scripts/setup-stripe-webhook.mjs create https://votre-worker.workers.dev');
      process.exit(1);
    }

    console.log(`🚀 Création du webhook vers : ${targetUrl}...`);
    const params = {
      'url': targetUrl,
      'description': 'Webhook KYRAN - Emails automatiques commandes et remboursements',
      'enabled_events[0]': 'checkout.session.completed',
      'enabled_events[1]': 'charge.refunded'
    };

    const endpoint = await stripeRequest('/webhook_endpoints', 'POST', params);
    console.log('✅ Webhook créé avec succès !');
    console.log(`- Webhook ID : ${endpoint.id}`);
    console.log(`- Secret de signature (STRIPE_WEBHOOK_SECRET) : ${endpoint.secret}`);
    console.log('\n📌 Prochaine étape :');
    console.log(`1. Ajouter ce secret dans le Cloudflare Worker :`);
    console.log(`   npx wrangler secret put STRIPE_WEBHOOK_SECRET`);
    console.log(`   (Entrez la valeur : ${endpoint.secret})`);
    return;
  }

  if (command === 'delete') {
    const webhookId = args[1];
    if (!webhookId) {
      console.error('❌ Webhook ID requis : node scripts/setup-stripe-webhook.mjs delete we_xxx');
      process.exit(1);
    }
    console.log(`🗑️ Suppression du webhook ${webhookId}...`);
    await stripeRequest(`/webhook_endpoints/${webhookId}`, 'DELETE');
    console.log('✅ Webhook supprimé avec succès.');
    return;
  }

  console.log('Usage:');
  console.log('  node scripts/setup-stripe-webhook.mjs list');
  console.log('  node scripts/setup-stripe-webhook.mjs create <URL_WORKER>');
  console.log('  node scripts/setup-stripe-webhook.mjs delete <WEBHOOK_ID>');
}

main().catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
