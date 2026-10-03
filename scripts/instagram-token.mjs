#!/usr/bin/env node
/**
 * Suivi et renouvellement du jeton Instagram (secret GitHub INSTAGRAM_ACCESS_TOKEN).
 *
 * Un jeton longue durée vit 60 jours. Le renouveler (refresh_access_token) renvoie un NOUVEAU
 * jeton, valable 60 jours ; il ne sert à rien s'il n'est pas réécrit dans le secret. Donc :
 * - avec INSTAGRAM_ROTATION_FILE (le workflow le fournit quand le secret GH_SECRETS_TOKEN existe) :
 *   à partir de 30 jours d'âge, le jeton est renouvelé et le nouveau est écrit dans ce fichier
 *   (droits 600, masqué dans les journaux) ; le workflow le copie dans le secret ;
 * - sinon : aucun renouvellement, et une alerte est levée 10 jours avant l'expiration.
 *
 * L'âge du jeton est suivi dans scripts/content/instagram-jeton.json : date d'enregistrement et
 * empreinte SHA-256 tronquée (jamais le jeton). Un secret remplacé à la main est détecté par
 * son empreinte.
 *
 * Sorties GitHub Actions (GITHUB_OUTPUT) : rotated, alert, expires_on, days_left.
 * Usage : node scripts/instagram-token.mjs
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { trackToken, tokenStatus, TOKEN_ALERT_DAYS } from './lib/community.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATE_FILE = path.join(ROOT, 'scripts', 'content', 'instagram-jeton.json');

const token = (process.env.INSTAGRAM_ACCESS_TOKEN || '').trim();
const rotationFile = (process.env.INSTAGRAM_ROTATION_FILE || '').trim();
const useFacebookLogin = Boolean((process.env.INSTAGRAM_USER_ID || '').trim());
if (!token) {
  console.error('INSTAGRAM_ACCESS_TOKEN manquant (voir docs/INSTAGRAM.md).');
  process.exit(1);
}

const today = process.env.SITE_TODAY || new Date().toISOString().slice(0, 10);
const fingerprint = t => crypto.createHash('sha256').update(t).digest('hex').slice(0, 16);
const hide = s => String(s).split(token).join('***');

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

async function refresh() {
  const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error || !body.access_token) {
    const e = body.error || {};
    throw new Error(hide(`${res.status} ${e.message || res.statusText} (code ${e.code || '?'})`));
  }
  return body;
}

const previous = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : {};
let { state, changed, replaced } = trackToken(previous, fingerprint(token), today);
if (replaced) console.log('Nouveau jeton détecté dans le secret : date d\'enregistrement remise au ' + today + '.');

let status = tokenStatus(state, today);
let rotated = false;
if (status.rotateDue && rotationFile && !useFacebookLogin) {
  try {
    const r = await refresh();
    const fresh = r.access_token.trim();
    if (fresh === token) {
      console.log('Jeton prolongé par Meta (même valeur).');
    } else {
      console.log(`::add-mask::${fresh}`);
      fs.writeFileSync(rotationFile, fresh, { mode: 0o600 });
      rotated = true;
      console.log('Jeton renouvelé : le nouveau sera enregistré dans le secret INSTAGRAM_ACCESS_TOKEN.');
    }
    state = { empreinte: fingerprint(fresh), enregistreLe: today };
    changed = true;
    status = tokenStatus(state, today);
  } catch (e) {
    console.log(`::warning::Renouvellement du jeton Instagram impossible : ${e.message}`);
  }
} else if (status.rotateDue && !rotationFile) {
  console.log('Renouvellement automatique désactivé (secret GH_SECRETS_TOKEN absent, voir docs/INSTAGRAM.md).');
}

if (changed) fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');

console.log(`Jeton enregistré le ${state.enregistreLe} ; expiration estimée le ${status.expiresOn} (${status.daysLeft} jour(s)).`);
if (status.alert) {
  const msg = status.daysLeft > 0
    ? `Le jeton Instagram expire dans ${status.daysLeft} jour(s) (le ${status.expiresOn}) : renouvelez-le (docs/INSTAGRAM.md).`
    : `Le jeton Instagram a probablement expiré le ${status.expiresOn} : générez-en un nouveau (docs/INSTAGRAM.md).`;
  console.log(`::warning::${msg}`);
}

output('rotated', rotated);
output('alert', status.alert && !rotated);
output('expires_on', status.expiresOn);
output('days_left', status.daysLeft);
output('alert_days', TOKEN_ALERT_DAYS);
