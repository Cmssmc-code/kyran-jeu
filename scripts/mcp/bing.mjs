#!/usr/bin/env node
// Lanceur MCP Bing Webmaster Tools (projet communautaire isiahw1/mcp-server-bing-webmaster,
// figé sur le commit du tag v1.0.2, exécuté via uvx qui installe ses dépendances Python).
// Clé API : BING_WEBMASTER_API_KEY (env), sinon 1re ligne de .secrets/bing-webmaster-api-key.txt.
// Le serveur expose aussi des outils d'écriture : hors liste « allow » de .claude/settings.json,
// Claude Code demande confirmation à chaque appel.
// Doc : docs/MCP_SEO.md
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE =
  'git+https://github.com/isiahw1/mcp-server-bing-webmaster@e2415f2e2dc4fae9582169e8695259ab47f24cf6';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

let apiKey = process.env.BING_WEBMASTER_API_KEY?.trim();
const localKey = join(repoRoot, '.secrets', 'bing-webmaster-api-key.txt');
if (!apiKey && existsSync(localKey)) apiKey = readFileSync(localKey, 'utf8').split(/\r?\n/)[0].trim();
if (!apiKey) {
  console.error(
    '[mcp bing] Aucune clé : définir BING_WEBMASTER_API_KEY ou créer .secrets/bing-webmaster-api-key.txt ' +
      '(voir docs/MCP_SEO.md).',
  );
  process.exit(1);
}

// mcp<2 : le serveur importe FastMCP, renommé dans le SDK Python 2.x.
const child = spawn('uvx', ['--from', SOURCE, '--with', 'mcp[cli]<2', 'mcp-server-bing-webmaster'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, BING_WEBMASTER_API_KEY: apiKey },
});
child.on('error', () => {
  console.error('[mcp bing] uvx introuvable : installer uv (https://docs.astral.sh/uv/).');
  process.exit(1);
});
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
child.on('exit', (code) => process.exit(code ?? 0));
