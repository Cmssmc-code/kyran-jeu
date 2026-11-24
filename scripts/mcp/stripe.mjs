#!/usr/bin/env node
// Lanceur MCP Stripe du compte KYRAN (paquet officiel @stripe/mcp, version figée).
// Clé lue, par ordre de priorité, sans jamais l'afficher :
//   1. variable d'environnement STRIPE_SECRET_KEY ;
//   2. ligne STRIPE_SECRET_KEY= du fichier .env à la racine du dépôt (ignoré par git).
// Évite que le serveur s'arrête quand Claude Code est lancé sans avoir exporté la variable.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = '@stripe/mcp@0.3.4';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function resolveKey() {
  const fromEnv = process.env.STRIPE_SECRET_KEY?.trim();
  if (fromEnv) return fromEnv;
  const envFile = join(repoRoot, '.env');
  if (!existsSync(envFile)) return null;
  const line = readFileSync(envFile, 'utf8').split(/\r?\n/).find((l) => l.startsWith('STRIPE_SECRET_KEY='));
  return line ? line.slice('STRIPE_SECRET_KEY='.length).trim().replace(/^["']|["']$/g, '') || null : null;
}

const key = resolveKey();
if (!key || !/^(sk|rk)_(live|test)_[A-Za-z0-9]+$/.test(key)) {
  console.error('[mcp stripe] Clé absente ou mal formée : définir STRIPE_SECRET_KEY (variable ou fichier .env).');
  process.exit(1);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(npx, ['-y', PACKAGE, `--api-key=${key}`], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
child.on('exit', (code) => process.exit(code ?? 0));
