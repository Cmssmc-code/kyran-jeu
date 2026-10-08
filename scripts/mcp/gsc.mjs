#!/usr/bin/env node
// Lanceur MCP Google Search Console (paquet communautaire mcp-server-gsc, version figée).
// Identifiants (compte de service Google, portée webmasters.readonly), par ordre de priorité :
//   1. GOOGLE_APPLICATION_CREDENTIALS : chemin vers le JSON du compte de service ;
//   2. GSC_SERVICE_ACCOUNT_JSON : contenu du JSON (brut ou base64), pratique pour les secrets
//      d'environnement Claude Code cloud ; écrit dans un fichier temporaire en 0600 ;
//   3. .secrets/gsc-service-account.json à la racine du dépôt (ignoré par git).
// Doc : docs/MCP_SEO.md
import { spawn } from 'node:child_process';
import { existsSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = 'mcp-server-gsc@0.3.0';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function resolveCredentials() {
  const fromPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (fromPath && existsSync(fromPath)) return fromPath;

  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    const json = inline.startsWith('{') ? inline : Buffer.from(inline, 'base64').toString('utf8');
    JSON.parse(json); // échoue tôt si le secret est mal collé
    const file = join(tmpdir(), 'kyran-gsc-service-account.json');
    writeFileSync(file, json, { mode: 0o600 });
    chmodSync(file, 0o600);
    return file;
  }

  const local = join(repoRoot, '.secrets', 'gsc-service-account.json');
  if (existsSync(local)) return local;
  return null;
}

const credentials = resolveCredentials();
if (!credentials) {
  console.error(
    '[mcp gsc] Aucun identifiant : définir GSC_SERVICE_ACCOUNT_JSON, GOOGLE_APPLICATION_CREDENTIALS ' +
      'ou créer .secrets/gsc-service-account.json (voir docs/MCP_SEO.md).',
  );
  process.exit(1);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(npx, ['-y', PACKAGE], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: credentials },
});
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
child.on('exit', (code) => process.exit(code ?? 0));
