/**
 * Vérification d'un jeton OIDC GitHub Actions (JWT RS256), sans dépendance.
 *
 * Le workflow Auto-Heal s'authentifie auprès de ce serveur avec son jeton OIDC :
 * aucun secret partagé à stocker côté GitHub ni côté Railway. Seuls les jetons émis
 * pour le dépôt attendu, avec l'audience attendue, sont acceptés.
 */
import crypto from 'crypto';

export const GITHUB_ISSUER = 'https://token.actions.githubusercontent.com';
const JWKS_URL = `${GITHUB_ISSUER}/.well-known/jwks`;
const JWKS_TTL_MS = 60 * 60 * 1000;
const CLOCK_SKEW_S = 60;

let jwksCache = { at: 0, keys: [] };

function b64urlJson(part) {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

async function fetchJwks(force = false) {
  if (!force && jwksCache.keys.length && Date.now() - jwksCache.at < JWKS_TTL_MS) return jwksCache.keys;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(JWKS_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`JWKS HTTP ${res.status}`);
    const body = await res.json();
    jwksCache = { at: Date.now(), keys: Array.isArray(body.keys) ? body.keys : [] };
    return jwksCache.keys;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Renvoie les claims si le jeton est valide pour `repository` et `audience`, sinon null.
 * `getKeys` est injectable pour les tests.
 */
export async function verifyGithubOidcToken(token, { repository, audience, getKeys = fetchJwks, now = Date.now() } = {}) {
  if (typeof token !== 'string' || token.length > 8192) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  let header;
  let claims;
  try {
    header = b64urlJson(parts[0]);
    claims = b64urlJson(parts[1]);
  } catch {
    return null;
  }
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;

  let keys = await getKeys(false);
  let jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) {
    // Rotation de clés côté GitHub : on recharge une fois.
    keys = await getKeys(true);
    jwk = keys.find(k => k.kid === header.kid);
  }
  if (!jwk) return null;

  let valid = false;
  try {
    const key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
    valid = crypto.verify(
      'RSA-SHA256',
      Buffer.from(`${parts[0]}.${parts[1]}`),
      key,
      Buffer.from(parts[2], 'base64url')
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  const nowS = Math.floor(now / 1000);
  if (claims.iss !== GITHUB_ISSUER) return null;
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.includes(audience)) return null;
  if (typeof claims.exp !== 'number' || claims.exp + CLOCK_SKEW_S < nowS) return null;
  if (typeof claims.nbf === 'number' && claims.nbf - CLOCK_SKEW_S > nowS) return null;
  if (String(claims.repository || '').toLowerCase() !== String(repository).toLowerCase()) return null;
  return claims;
}
