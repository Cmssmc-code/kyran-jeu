#!/usr/bin/env node
/**
 * Worker d'auto-remédiation horaire KYRAN (GitHub Actions → Claude via Anthropic WIF).
 * Portage du worker Majordia (scripts/auto-heal-worker.mts) pour le site statique + serveur Railway.
 *
 * Boucle par incident :
 *  1. rafraîchit le jeton OIDC GitHub (fichier lu par le SDK Anthropic pour l'échange WIF) ;
 *  2. lance un agent Claude outillé (lecture / recherche / édition bornées au dépôt) ;
 *  3. valide indépendamment (chemins interdits, syntaxe JS, `npm run build`, `npm test`) ;
 *  4. commit + push sur main (rebase + retry), puis marque l'incident résolu côté serveur.
 * Tout échec → reset dur sur origin/main + incident marqué en échec (3 tentatives max côté serveur).
 *
 * Variables : API_PUBLIC_URL (serveur Railway), ANTHROPIC_FEDERATION_RULE_ID, ANTHROPIC_ORGANIZATION_ID,
 * ANTHROPIC_SERVICE_ACCOUNT_ID, ANTHROPIC_WORKSPACE_ID (WIF, lus par le SDK) ou ANTHROPIC_API_KEY,
 * ANTHROPIC_MODEL (défaut claude-opus-5-5), AUTO_HEAL_EFFORT (défaut medium),
 * AUTO_HEAL_MAX_INCIDENTS (défaut 5), AUTO_HEAL_MAX_ITERATIONS (défaut 30),
 * AUTO_HEAL_BRANCH (défaut main), AUTO_HEAL_DRY_RUN=1 (aucun push ni appel resolve/fail/ignore),
 * CRON_SECRET (facultatif : sinon authentification auprès du serveur par jeton OIDC GitHub).
 */
import Anthropic from '@anthropic-ai/sdk';
import { betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const REPO_ROOT = process.cwd();
const BRANCH = process.env.AUTO_HEAL_BRANCH?.trim() || 'main';
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || 'claude-opus-5-5';
const EFFORT = process.env.AUTO_HEAL_EFFORT?.trim() || 'medium';
const MAX_INCIDENTS = clampInt(process.env.AUTO_HEAL_MAX_INCIDENTS, 5, 1, 20);
const MAX_ITERATIONS = clampInt(process.env.AUTO_HEAL_MAX_ITERATIONS, 30, 5, 80);
const DRY_RUN = process.env.AUTO_HEAL_DRY_RUN === '1';
const USE_FALLBACKS = process.env.AUTO_HEAL_FALLBACKS !== '0';
const OIDC_AUDIENCE_SERVER = 'kyran-auto-heal';
const LECON_FILE = '_notes/lecon.md';
const LECON_MARKER = '<!-- auto-heal:entries -->';

/** Erreur d'infrastructure (auth WIF, quota API, panne Anthropic) : on arrête la passe sans pénaliser l'incident. */
class InfraError extends Error {}

/** Chemins que l'agent ne doit jamais modifier (ni la validation laisser passer). */
export const FORBIDDEN_EDIT_PATTERNS = [
  /^\.github\//,
  /^scripts\/auto-heal-worker\.mjs$/,
  /^server\/githubOidc\.js$/,
  /(^|\/)\.env/,
  /(^|\/)\.dev\.vars/,
  /(^|\/)package(-lock)?\.json$/,
  /(^|\/)node_modules\//,
  /^_notes\//,
  /^CNAME$/,
  /^vendor\//,
  /^worker\/wrangler\.toml$/,
  /^scripts\/setup-stripe-webhook\.mjs$/,
  /^google-merchant-feed\./,
  /(^|\/)(BingSiteAuth\.xml|[0-9a-f]{32}\.txt)$/
];
/** Chemins que l'agent ne peut même pas lire (secrets potentiels). */
export const FORBIDDEN_READ_PATTERNS = [
  /(^|\/)\.env(?!\.example$)/,
  /(^|\/)\.dev\.vars/,
  /(^|\/)node_modules\//,
  /^\.git\//
];
/** Fichiers régénérés par `npm run build` : modifiés par la validation, autorisés dans le commit. */
const GENERATED_OK = new Set(['scripts/lastmod-manifest.json']);

function clampInt(raw, fallback, min, max) {
  const n = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: opts.cwd ?? REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: opts.timeoutMs ?? 10 * 60_000,
    maxBuffer: 64 * 1024 * 1024
  });
}

function errorOutput(err) {
  return `${err?.stdout ?? ''}\n${err?.stderr ?? ''}`.trim() || err?.message || String(err);
}

function tail(text, max) {
  return text.length <= max ? text : `…(tronqué)…\n${text.slice(-max)}`;
}

/** Normalise un chemin relatif au dépôt ; null si hors dépôt. */
export function repoPath(p, root = REPO_ROOT) {
  const abs = resolve(root, String(p).replace(/^\/+/, ''));
  const rel = relative(root, abs);
  if (rel.startsWith('..') || rel.includes(`..${sep}`)) return null;
  return rel.split(sep).join('/');
}

export function isForbiddenEdit(rel) {
  return FORBIDDEN_EDIT_PATTERNS.some(re => re.test(rel));
}

export function isForbiddenRead(rel) {
  return FORBIDDEN_READ_PATTERNS.some(re => re.test(rel));
}

export function redactSecrets(text) {
  return String(text)
    .replace(/Bearer\s+[A-Za-z0-9_\-.=]+/gi, 'Bearer [REDACTED]')
    .replace(/\b(password|passwd|token|secret|api[_-]?key|authorization|cookie)(["']?\s*[:=]\s*["']?)[^"'\s,}]+/gi, '$1$2[REDACTED]')
    .replace(/\b(sk|rk|pk)_(live|test)_[A-Za-z0-9]+/g, '[STRIPE_KEY_REDACTED]')
    .replace(/\bwhsec_[A-Za-z0-9]+/g, '[WHSEC_REDACTED]')
    .replace(/\bre_[A-Za-z0-9_]{16,}/g, '[RESEND_KEY_REDACTED]')
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/g, '[JWT_REDACTED]')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/gi, m => (/@kyran-jeu\.fr$/i.test(m) ? m : '[EMAIL]'));
}

// ---------------------------------------------------------------------------
// GitHub OIDC : jeton pour Anthropic (WIF) et pour le serveur KYRAN
// ---------------------------------------------------------------------------

async function githubOidcToken(audience) {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const reqToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!url || !reqToken) return null;
  const res = await fetch(`${url}&audience=${encodeURIComponent(audience)}`, {
    headers: { Authorization: `Bearer ${reqToken}` }
  });
  if (!res.ok) throw new InfraError(`OIDC GitHub HTTP ${res.status}`);
  const { value } = await res.json();
  if (!value) throw new InfraError('OIDC GitHub : jeton vide');
  return value;
}

const identityTokenFile = join(mkdtempSync(join(tmpdir(), 'auto-heal-')), 'oidc.jwt');

async function refreshAnthropicIdentityToken() {
  // Clé API fournie (secret ANTHROPIC_API_KEY) : le SDK l'utilise directement.
  if (process.env.ANTHROPIC_API_KEY) return;
  const value = await githubOidcToken('https://api.anthropic.com');
  if (!value) return; // hors GitHub Actions : profil local / ANTHROPIC_IDENTITY_TOKEN
  writeFileSync(identityTokenFile, value, { encoding: 'utf8', mode: 0o600 });
  process.env.ANTHROPIC_IDENTITY_TOKEN_FILE = identityTokenFile;
}

/**
 * Client Anthropic. Avec une clé API non rattachée à un workspace (secret ANTHROPIC_API_KEY),
 * l'API exige l'en-tête anthropic-workspace-id : on le prend dans ANTHROPIC_WORKSPACE_ID.
 */
function anthropicClient(maxRetries) {
  const workspace = process.env.ANTHROPIC_WORKSPACE_ID?.trim();
  const defaultHeaders = process.env.ANTHROPIC_API_KEY && workspace ? { 'anthropic-workspace-id': workspace } : undefined;
  return new Anthropic({ maxRetries, defaultHeaders });
}

// ---------------------------------------------------------------------------
// API du serveur KYRAN (Railway)
// ---------------------------------------------------------------------------

const apiBase = (process.env.API_PUBLIC_URL ?? '').trim().replace(/\/+$/, '');
const cronSecret = (process.env.CRON_SECRET ?? '').trim();

async function api(path, body) {
  const headers = body ? { 'Content-Type': 'application/json' } : {};
  if (cronSecret) headers['X-Cron-Secret'] = cronSecret;
  else {
    const token = await githubOidcToken(OIDC_AUDIENCE_SERVER);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${apiBase}${path}`, {
    method: body ? 'POST' : 'GET',
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${path} : ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function reportOutcome(kind, body) {
  if (DRY_RUN) {
    console.log(`[AutoHeal][dry-run] ${kind}`, body);
    return;
  }
  try {
    await api(`/api/auto-heal/incidents/${kind}`, body);
  } catch (err) {
    console.error(`[AutoHeal] Impossible de notifier ${kind} :`, String(err));
  }
}

// ---------------------------------------------------------------------------
// Outils de l'agent
// ---------------------------------------------------------------------------

function buildTools(editedFiles) {
  const readFile = betaTool({
    name: 'read_file',
    description:
      'Lit un fichier du dépôt (chemin relatif à la racine). Renvoie les lignes numérotées. Utilise start_line/end_line pour les gros fichiers (max 400 lignes par appel).',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        start_line: { type: 'integer', minimum: 1 },
        end_line: { type: 'integer', minimum: 1 }
      },
      required: ['path'],
      additionalProperties: false
    },
    run: async ({ path, start_line, end_line }) => {
      const rel = repoPath(path);
      if (!rel || isForbiddenRead(rel)) return 'ERREUR : chemin interdit ou hors dépôt.';
      const abs = join(REPO_ROOT, rel);
      if (!existsSync(abs) || !statSync(abs).isFile()) return `ERREUR : fichier introuvable (${rel}).`;
      const lines = readFileSync(abs, 'utf8').split('\n');
      const start = Math.max(1, start_line ?? 1);
      const end = Math.min(lines.length, end_line ?? start + 399, start + 399);
      const body = lines.slice(start - 1, end).map((l, i) => `${start + i}\t${l.length > 2000 ? `${l.slice(0, 2000)}…` : l}`).join('\n');
      return `${rel} (lignes ${start}-${end} sur ${lines.length})\n${body}`;
    }
  });

  const listDir = betaTool({
    name: 'list_dir',
    description: 'Liste le contenu d\'un dossier du dépôt (non récursif).',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string' } },
      required: ['path'],
      additionalProperties: false
    },
    run: async ({ path }) => {
      const rel = repoPath(path || '.');
      if (rel === null || isForbiddenRead(rel)) return 'ERREUR : chemin interdit ou hors dépôt.';
      const abs = join(REPO_ROOT, rel);
      if (!existsSync(abs) || !statSync(abs).isDirectory()) return `ERREUR : dossier introuvable (${rel}).`;
      return readdirSync(abs, { withFileTypes: true })
        .filter(d => d.name !== 'node_modules' && d.name !== '.git')
        .map(d => (d.isDirectory() ? `${d.name}/` : d.name))
        .slice(0, 300)
        .join('\n');
    }
  });

  const searchCode = betaTool({
    name: 'search_code',
    description:
      'Recherche une expression régulière (syntaxe grep -E) dans les fichiers suivis par git. Optionnellement restreinte à un chemin/glob (ex. \'server\', \'scripts/content\', \'*.js\'). Renvoie au plus 80 correspondances fichier:ligne:texte.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string' },
        path: { type: 'string' },
        ignore_case: { type: 'boolean' }
      },
      required: ['pattern'],
      additionalProperties: false
    },
    run: async ({ pattern, path, ignore_case }) => {
      const args = ['grep', '-n', '-E', '-I', '--no-color'];
      if (ignore_case) args.push('-i');
      args.push('-e', pattern, '--');
      if (path) {
        const rel = repoPath(path.replace(/\*.*$/, '')) ?? '';
        if (rel && isForbiddenRead(rel)) return 'ERREUR : chemin interdit.';
        args.push(path);
      }
      args.push(':(exclude)package-lock.json', ':(exclude)**/*.min.js', ':(exclude)vendor/**', ':(exclude).env*');
      try {
        const out = sh('git', args, { timeoutMs: 60_000 });
        const lines = out.split('\n').filter(Boolean);
        const shown = lines.slice(0, 80).map(l => (l.length > 300 ? `${l.slice(0, 300)}…` : l));
        return `${shown.join('\n')}${lines.length > 80 ? `\n… ${lines.length - 80} autres résultats (affine le motif)` : ''}`;
      } catch (err) {
        if (err?.status === 1) return 'Aucun résultat.';
        return `ERREUR : ${tail(errorOutput(err), 500)}`;
      }
    }
  });

  const editFile = betaTool({
    name: 'edit_file',
    description:
      'Remplace exactement old_string par new_string dans un fichier existant du dépôt. old_string doit apparaître une seule fois (copie-le à l\'identique depuis read_file, sans les numéros de ligne). Pour créer un nouveau fichier, passe old_string vide et create=true.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        old_string: { type: 'string' },
        new_string: { type: 'string' },
        create: { type: 'boolean' }
      },
      required: ['path', 'old_string', 'new_string'],
      additionalProperties: false
    },
    run: async ({ path, old_string, new_string, create }) => {
      const rel = repoPath(path);
      if (!rel || isForbiddenEdit(rel) || isForbiddenRead(rel)) {
        return 'REFUSÉ : ce chemin est hors du périmètre autorisé (CI, package.json, .env, authentification Auto-Heal, _notes, vendor…).';
      }
      const abs = join(REPO_ROOT, rel);
      if (create) {
        if (existsSync(abs)) return 'ERREUR : le fichier existe déjà, utilise un remplacement.';
        writeFileSync(abs, new_string, 'utf8');
        editedFiles.add(rel);
        return `Créé : ${rel}`;
      }
      if (!existsSync(abs)) return `ERREUR : fichier introuvable (${rel}).`;
      const content = readFileSync(abs, 'utf8');
      if (!old_string) return 'ERREUR : old_string vide.';
      const count = content.split(old_string).length - 1;
      if (count === 0) return 'ERREUR : old_string introuvable. Relis le fichier et copie le bloc exact.';
      if (count > 1) return `ERREUR : old_string apparaît ${count} fois ; ajoute du contexte pour le rendre unique.`;
      writeFileSync(abs, content.replace(old_string, () => new_string), 'utf8');
      editedFiles.add(rel);
      return `Modifié : ${rel}`;
    }
  });

  const runChecks = betaTool({
    name: 'run_checks',
    description:
      'Lance les vérifications sur les modifications en cours : syntaxe JS, `npm run build` (régénère pages, sitemap, CSP) puis `npm test` (JSON-LD, blog, cohérence du site, doublons, tests unitaires et de sécurité). À appeler avant de conclure « fixed ». Renvoie OK ou les erreurs.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    run: async () => {
      const result = validateWorkingTree();
      return result.ok ? `OK\n${result.log}` : `ÉCHEC\n${tail(result.log, 6000)}`;
    }
  });

  return [readFile, listDir, searchCode, editFile, runChecks];
}

// ---------------------------------------------------------------------------
// Validation indépendante
// ---------------------------------------------------------------------------

function changedFiles() {
  return sh('git', ['status', '--porcelain', '--untracked-files=all'])
    .split('\n')
    .filter(Boolean)
    .map(l => l.slice(3).replace(/^"|"$/g, '').split(' -> ').pop().trim())
    .filter(Boolean);
}

function validateWorkingTree() {
  const before = changedFiles();
  if (before.length === 0) return { ok: false, log: 'Aucune modification.', files: before };
  const logs = [];

  const forbidden = before.filter(f => isForbiddenEdit(f) && !GENERATED_OK.has(f));
  if (forbidden.length) return { ok: false, log: `Fichiers interdits modifiés : ${forbidden.join(', ')}`, files: before };

  for (const f of before.filter(f => /\.(m?js)$/.test(f) && existsSync(join(REPO_ROOT, f)))) {
    try {
      sh(process.execPath, ['--check', f], { timeoutMs: 60_000 });
    } catch (err) {
      return { ok: false, log: `✘ syntaxe ${f}\n${tail(errorOutput(err), 3000)}`, files: before };
    }
  }
  logs.push('✔ syntaxe JS');

  const steps = [
    { label: 'npm run build', args: ['run', 'build'] },
    { label: 'npm test', args: ['test'] }
  ];
  for (const step of steps) {
    try {
      sh('npm', step.args, { timeoutMs: 15 * 60_000 });
      logs.push(`✔ ${step.label}`);
    } catch (err) {
      logs.push(`✘ ${step.label}\n${tail(errorOutput(err), 5000)}`);
      return { ok: false, log: logs.join('\n'), files: changedFiles() };
    }
  }

  // Le build ne doit pas avoir réécrit un fichier interdit (ex. modification d'une page générée perdue).
  const files = changedFiles();
  const forbiddenAfter = files.filter(f => isForbiddenEdit(f) && !GENERATED_OK.has(f));
  if (forbiddenAfter.length) return { ok: false, log: `Fichiers interdits modifiés : ${forbiddenAfter.join(', ')}`, files };
  if (!files.length) return { ok: false, log: 'Aucune modification après build (page générée éditée au lieu de sa source ?).', files };
  return { ok: true, log: logs.join('\n'), files };
}

function resetToRemote() {
  sh('git', ['fetch', 'origin', BRANCH]);
  sh('git', ['reset', '--hard', `origin/${BRANCH}`]);
  sh('git', ['clean', '-fd']);
}

// ---------------------------------------------------------------------------
// Agent
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `Tu es l'agent d'auto-remédiation du site KYRAN (kyran-jeu.fr), un jeu de cartes vendu en ligne.

Le dépôt :
- Site statique publié sur GitHub Pages : pages HTML à la racine (index.html, regle.html, commander.html, minijeu.html…), scripts navigateur (components.js, blog.js, reviews.js, hero-visual.js, error-reporter.js), style.css et css/.
- Pages et fichiers GÉNÉRÉS par \`npm run build\` (scripts/build.mjs) : articles blog/*.html (source : scripts/content/ et scripts/generate-blog.mjs), redirections, sitemap.xml, llms*.txt, plan-du-site.html, communaute.html, rendu statique des composants (scripts/prerender.mjs), CSP en <meta> + balise error-reporter (scripts/apply-csp.mjs). Ne modifie jamais un fichier généré directement : corrige sa source, la validation relance le build.
- Serveur Node sans dépendance déployé sur Railway (server/server.js, server/templates.js, server/incidents.js) : webhook Stripe → emails Resend, API d'administration, remontée des erreurs.
- worker/ : variante Cloudflare Worker du webhook (non déployée automatiquement).

Tu reçois un incident de production (agrégé) et tu dois le corriger à la racine avec le changement le plus petit possible, sans intervention humaine. Ton correctif sera vérifié (build + tests) puis poussé directement sur main et mis en ligne.

Méthode :
- Commence par _notes/lecon.md (search_code dessus avec des mots-clés de l'incident) : des causes y sont peut-être déjà documentées.
- Localise le code avec search_code / read_file. Erreur navigateur : le champ file / la stack donnent l'URL du script (ex. https://kyran-jeu.fr/components.js?v=… → components.js) ; le script peut aussi être en ligne dans la page HTML indiquée.
- Ressource introuvable (RESOURCE_LOAD_FAILED) : corrige le lien cassé dans la source (ou la page si elle n'est pas générée), ne crée pas de faux fichier.
- Corrige avec edit_file, puis appelle run_checks et corrige jusqu'à obtenir OK.
- Si l'erreur n'est pas un bug du site (robot, extension de navigateur, script tiers, coupure réseau du visiteur, vieux navigateur non pris en charge, onglet resté ouvert sur une ancienne version) : le bon correctif est d'éviter la fausse alerte à la source, en ajoutant un filtre précis dans isBenignClientError (server/incidents.js) ou dans error-reporter.js — jamais de masquer une vraie panne.
- Si la cause est externe et non corrigeable dans le code (panne Resend / Stripe / Railway ponctuelle, donnée isolée), conclus "ignore".
- Si tu ne trouves pas de correctif sûr, conclus "cannot_fix" : ne tente jamais un correctif spéculatif.

Interdits absolus (les outils refuseront de toute façon) : workflows CI (.github), package.json / lockfile, fichiers .env, authentification Auto-Heal (server/githubOidc.js), _notes/, vendor/, CNAME, fichiers de vérification des moteurs de recherche. Ne touche jamais à la vérification de signature Stripe, à l'authentification d'administration (ADMIN_SECRET), aux prix ou aux liens de paiement. Ne supprime aucun test, n'affaiblis aucune assertion, ne désactive aucune vérification de sécurité.

Ta réponse finale (après avoir fini d'utiliser les outils) doit être UNIQUEMENT un objet JSON, sans texte autour :
{"status":"fixed"|"ignore"|"cannot_fix","analysis":"cause racine en 2 phrases max","summary":"résumé du correctif, 80 caractères max","explanation":"pour le propriétaire du site, non développeur : ce que le visiteur ou le client vivait (page, action bloquée, qui était touché) puis ce qui a été changé ou pourquoi rien n'a été changé ; 2 à 4 phrases simples, sans jargon","lecon":"(si fixed) entrée anti-récidive en 3 puces markdown : - **Symptôme :** … - **Cause :** … - **Correctif :** …"}`;

export function buildIncidentPrompt(incident) {
  const details = incident.details ?? {};
  const keep = ['file', 'line', 'column', 'browser', 'pageUrl', 'assetVersion', 'eventType', 'method'];
  const compact = {};
  for (const k of keep) {
    const v = details[k];
    if (v !== undefined && v !== null && v !== '') compact[k] = v;
  }
  const stack = String(incident.stack ?? '')
    .split('\n')
    .filter((l, i) => i === 0 || !/node_modules|node:internal|node:async_hooks/.test(l))
    .slice(0, 25)
    .join('\n')
    .slice(0, 4000);
  const previous = incident.resolution_attempts
    ? `\nTentatives précédentes : ${incident.resolution_attempts} (dernier échec : ${incident.resolution_summary ?? '-'}). Évite de reproduire la même approche.`
    : '';
  return redactSecrets(`Incident de production à corriger :
- Source : ${incident.source === 'client' ? 'navigateur d\'un visiteur (site statique)' : 'serveur Railway (server/server.js)'}
- Code : ${incident.error_code ?? 'NON_SPÉCIFIÉ'} (référence ${incident.display_code ?? '-'})
- HTTP : ${incident.http_status ?? 'N/A'}
- Page(s) : ${(incident.pages ?? [incident.path]).join(', ')}
- Occurrences : ${incident.occurrences} (du ${incident.first_seen_at} au ${incident.last_seen_at})
- Message : ${String(incident.message ?? '-').slice(0, 1500)}
- Stack :
${stack || '(aucune)'}
- Détails : ${JSON.stringify(compact).slice(0, 3000)}${previous}`);
}

export function parseVerdict(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (!['fixed', 'ignore', 'cannot_fix'].includes(parsed.status)) return null;
    return {
      status: parsed.status,
      analysis: String(parsed.analysis ?? '').slice(0, 600),
      summary: String(parsed.summary ?? '').replace(/\s+/g, ' ').slice(0, 120),
      explanation: String(parsed.explanation ?? '').slice(0, 1200),
      lecon: parsed.lecon ? String(parsed.lecon).slice(0, 2000) : undefined
    };
  } catch {
    return null;
  }
}

async function runAgent(incident, editedFiles) {
  await refreshAnthropicIdentityToken();
  const client = anthropicClient(4);

  const runner = client.beta.messages.toolRunner({
    model: MODEL,
    max_tokens: 32000,
    max_iterations: MAX_ITERATIONS,
    stream: true,
    ...(USE_FALLBACKS ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' } : {}),
    output_config: { effort: EFFORT },
    cache_control: { type: 'ephemeral' },
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    tools: buildTools(editedFiles),
    messages: [{ role: 'user', content: buildIncidentPrompt(incident) }]
  });

  let inTok = 0;
  let outTok = 0;
  let cacheRead = 0;
  let last = null;
  try {
    for await (const stream of runner) {
      const message = await stream.finalMessage();
      last = message;
      inTok += message.usage.input_tokens ?? 0;
      outTok += message.usage.output_tokens ?? 0;
      cacheRead += message.usage.cache_read_input_tokens ?? 0;
      for (const block of message.content) {
        if (block.type === 'tool_use') {
          const input = JSON.stringify(block.input);
          console.log(`  ↳ ${block.name} ${input.length > 160 ? `${input.slice(0, 160)}…` : input}`);
        }
      }
      if (message.stop_reason === 'pause_turn') runner.pushMessages({ role: 'assistant', content: message.content });
    }
  } catch (err) {
    // Auth, quota, surcharge ou requête invalide : problème d'infra, pas de l'incident.
    if (err instanceof Anthropic.APIError && (err.status === undefined || [400, 401, 403, 429].includes(err.status) || err.status >= 500)) {
      throw new InfraError(`Anthropic API ${err.status ?? 'réseau'} : ${err.message}`);
    }
    if (err instanceof Anthropic.APIConnectionError || err?.name === 'WorkloadIdentityError') {
      throw new InfraError(`Anthropic indisponible : ${String(err)}`);
    }
    throw err;
  }
  console.log(`[AutoHeal] Tokens — entrée : ${inTok}, cache lu : ${cacheRead}, sortie : ${outTok}`);

  if (!last) throw new Error('Aucune réponse de l\'agent');
  if (last.stop_reason === 'refusal') {
    return { status: 'cannot_fix', analysis: 'Requête refusée par le modèle.', summary: 'refus modèle', explanation: '' };
  }
  const text = last.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
  const verdict = parseVerdict(text);
  if (!verdict) throw new Error(`Réponse finale non exploitable (stop_reason=${last.stop_reason})`);
  return verdict;
}

// ---------------------------------------------------------------------------
// Git
// ---------------------------------------------------------------------------

export function insertLecon(text, entry) {
  const idx = text.indexOf(LECON_MARKER);
  if (idx < 0) return null;
  const at = idx + LECON_MARKER.length;
  return `${text.slice(0, at)}\n\n${entry.trim()}\n${text.slice(at)}`;
}

function appendLecon(incident, verdict) {
  if (!verdict.lecon) return;
  const leconPath = join(REPO_ROOT, LECON_FILE);
  if (!existsSync(leconPath)) return;
  const code = incident.error_code ?? incident.display_code ?? 'incident';
  const entry = `### ${new Date().toISOString().slice(0, 10)} — [Auto-Heal] ${incident.display_code ?? code} — ${verdict.summary}\n\n${verdict.lecon.trim()}\n`;
  const next = insertLecon(readFileSync(leconPath, 'utf8'), entry);
  if (next) writeFileSync(leconPath, next, 'utf8');
}

function commitAndPush(incident, verdict) {
  const code = incident.display_code ?? incident.error_code ?? 'incident';
  const subject = `fix(auto-heal): ${code} — ${verdict.summary}`.replace(/[\r\n]+/g, ' ').slice(0, 100);
  const body = `${verdict.analysis}\n\nIncident: ${incident.id} (${incident.occurrences} occurrence(s), ${incident.path ?? '-'})`;
  sh('git', ['add', '-A']);
  sh('git', ['commit', '-m', subject, '-m', body]);
  if (DRY_RUN) return sh('git', ['rev-parse', 'HEAD']).trim();

  let lastErr = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      sh('git', ['pull', '--rebase', 'origin', BRANCH]);
      sh('git', ['push', 'origin', `HEAD:${BRANCH}`]);
      return sh('git', ['rev-parse', 'HEAD']).trim();
    } catch (err) {
      lastErr = err;
      console.warn(`[AutoHeal] Push tentative ${attempt} échouée : ${tail(errorOutput(err), 400)}`);
      try { sh('git', ['rebase', '--abort']); } catch { /* pas de rebase en cours */ }
    }
  }
  throw new Error(`Push impossible : ${tail(errorOutput(lastErr), 400)}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/** Vérifie la chaîne d'auth (OIDC GitHub → WIF → API Anthropic, et OIDC → serveur KYRAN) sans génération facturée. */
async function smokeTest() {
  await refreshAnthropicIdentityToken();
  const client = anthropicClient(2);
  const model = await client.models.retrieve(MODEL);
  console.log(`[AutoHeal] Smoke test Anthropic OK : modèle ${model.id} accessible.`);
  if (apiBase) {
    const data = await api('/api/auto-heal/incidents?limit=1');
    console.log(`[AutoHeal] Smoke test serveur OK : ${data.incidents?.length ?? 0} incident(s) en attente, quota ${data.count24h}/${data.max24h}.`);
  }
}

async function main() {
  if (process.env.AUTO_HEAL_SMOKE === '1') {
    await smokeTest();
    return;
  }
  if (!apiBase) {
    console.error('[AutoHeal] API_PUBLIC_URL manquant.');
    process.exit(1);
  }
  if (changedFiles().length) {
    console.error('[AutoHeal] Working tree non propre au démarrage, arrêt.');
    process.exit(1);
  }
  sh('git', ['config', 'user.name', 'KYRAN Auto-Heal']);
  sh('git', ['config', 'user.email', 'auto-heal@kyran-jeu.fr']);

  const data = await api(`/api/auto-heal/incidents?limit=${MAX_INCIDENTS}`);
  if (data.quotaReached) {
    console.log(`[AutoHeal] Quota 24h atteint (${data.count24h}/${data.max24h}).`);
    return;
  }
  const incidents = data.incidents ?? [];
  const budget = Math.max(0, (data.max24h ?? 30) - (data.count24h ?? 0));
  console.log(`[AutoHeal] ${incidents.length} incident(s) — quota restant ${budget} — modèle ${MODEL} (effort ${EFFORT})${DRY_RUN ? ' — DRY RUN' : ''}`);

  let fixed = 0;
  for (const incident of incidents) {
    if (fixed >= budget) break;
    console.log(`\n=== ${incident.id} · ${incident.source} · ${incident.display_code} · ${incident.path ?? '-'} (${incident.occurrences}x)`);
    const editedFiles = new Set();
    try {
      const verdict = await runAgent(incident, editedFiles);
      console.log(`[AutoHeal] Verdict ${verdict.status} : ${verdict.analysis}`);
      const report = { explanation: verdict.explanation, analysis: verdict.analysis };

      if (verdict.status !== 'fixed') {
        resetToRemote();
        if (verdict.status === 'ignore') {
          await reportOutcome('ignore', { incidentId: incident.id, reason: `${verdict.summary} — ${verdict.analysis}`.slice(0, 500), report });
        } else {
          await reportOutcome('fail', { incidentId: incident.id, reason: `cannot_fix — ${verdict.analysis}`.slice(0, 500), report });
        }
        continue;
      }

      const validation = validateWorkingTree();
      console.log(validation.log);
      if (!validation.ok) {
        resetToRemote();
        await reportOutcome('fail', {
          incidentId: incident.id,
          reason: `validation — ${tail(validation.log, 400)}`,
          report: { ...report, files: validation.files }
        });
        continue;
      }

      appendLecon(incident, verdict);
      const sha = commitAndPush(incident, verdict);
      // Fichiers corrigés par l'agent (les pages régénérées par le build ne sont pas listées).
      const files = editedFiles.size ? [...editedFiles] : validation.files.slice(0, 30);
      console.log(`[AutoHeal] ✅ Poussé sur ${BRANCH} : ${sha} (${files.join(', ')} ; ${validation.files.length} fichier(s) au total)`);
      await reportOutcome('resolve', {
        incidentId: incident.id,
        commitSha: sha,
        resolutionSummary: verdict.summary,
        report: { ...report, files }
      });
      fixed++;
      if (DRY_RUN) resetToRemote();
    } catch (err) {
      console.error(`[AutoHeal] Erreur sur ${incident.id} : ${String(err)}`);
      try {
        resetToRemote();
      } catch {
        process.exit(1);
      }
      // Échec visible dans GitHub Actions ; l'incident reste en attente pour la passe suivante.
      if (err instanceof InfraError) process.exit(1);
      await reportOutcome('fail', { incidentId: incident.id, reason: String(err).slice(0, 500) });
    }
  }
  console.log(`\n[AutoHeal] Passe terminée : ${fixed} correctif(s) déployé(s).`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch(err => {
    console.error('[AutoHeal] Erreur fatale :', err);
    process.exit(1);
  });
}
