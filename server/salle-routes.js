/**
 * Routes HTTP des salles entre amis (/salle/*). Module ISOLÉ du paiement : chargé par
 * server.js seulement si MULTI_ACTIF=1 (import dynamique), il ne touche à aucune route du
 * webhook. Absent ou en erreur au chargement = salles coupées (503), le paiement continue.
 *
 * Règle d'or : aucune erreur d'une salle ne sort d'ici. Chaque route et chaque minuterie
 * est dans un try/catch ; une erreur inattendue est signalée (recordIncident), la salle
 * concernée est fermée et ses joueurs sont prévenus.
 */
import crypto from 'crypto';
import { createSalles, ErreurSalle } from './salles.js';
import { createTemps } from './salles-temps.js';

const MAX_CORPS = 2048; // 2 Ko
const BILLET_MS = 30_000;
const KEEPALIVE_TICKS = 20;
const MAX_FLUX_PAR_IP = 12;

/** Compteur à fenêtre glissante : `touche(cle)` renvoie false au-delà de `max` par `fenetreMs`. */
function limiteur(max, fenetreMs, now) {
  const m = new Map();
  return {
    touche(cle) {
      const t = now();
      const l = (m.get(cle) || []).filter(x => t - x < fenetreMs);
      if (l.length >= max) {
        m.set(cle, l);
        return false;
      }
      l.push(t);
      m.set(cle, l);
      return true;
    },
    purge() {
      const t = now();
      for (const [k, l] of m) if (!l.some(x => t - x < fenetreMs)) m.delete(k);
    }
  };
}

export function createSalleRoutes({
  recordIncident = () => {},
  allowedOrigins = [],
  now = Date.now,
  salles = createSalles({ now }),
  horloge = true // false dans les tests : ils appellent tick() eux-mêmes
} = {}) {
  const flux = new Map(); // code -> Set<{ res, jeton, ip }>
  const billets = new Map(); // billet -> { jeton, ip, exp }
  const fluxParIp = new Map();
  const limCreation = limiteur(6, 3_600_000, now);
  const limRejoindre = limiteur(20, 60_000, now);
  const limBillet = limiteur(30, 60_000, now);
  const limAction = limiteur(20, 10_000, now);
  let compteur = 0;

  function cors(req, res) {
    const origin = req.headers.origin;
    res.setHeader('Vary', 'Origin');
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '600');
    }
  }

  function json(res, statut, corps) {
    if (res.headersSent) return;
    const data = JSON.stringify(corps);
    res.writeHead(statut, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(data) });
    res.end(data);
  }

  function ecrire(res, texte) {
    try {
      res.write(texte);
    } catch {
      /* flux déjà fermé : la fermeture du socket nettoie */
    }
  }

  function envoyerEtat(f) {
    try {
      ecrire(f.res, `event: etat\ndata: ${JSON.stringify(salles.etat(f.jeton))}\n\n`);
    } catch {
      try {
        f.res.end();
      } catch {
        /* rien */
      }
    }
  }

  function diffuser(code) {
    const s = flux.get(code);
    if (s) for (const f of s) envoyerEtat(f);
  }

  function fermee(code, raison) {
    const s = flux.get(code);
    flux.delete(code);
    if (!s) return;
    for (const f of s) {
      ecrire(f.res, `event: fermee\ndata: ${JSON.stringify({ raison })}\n\n`);
      try {
        f.res.end();
      } catch {
        /* rien */
      }
    }
  }

  function signaler(err, code, chemin) {
    try {
      recordIncident(err, { path: chemin, errorCode: 'SALLE_ERREUR', details: { salle: code } });
    } catch {
      /* le signalement ne doit jamais faire tomber la salle ou le processus */
    }
  }

  const temps = createTemps({
    salles,
    now,
    onChange: diffuser,
    onClose: fermee,
    onErreur: (err, code) => signaler(err, code, '/salle/minuterie')
  });

  function tick() {
    try {
      temps.tick();
      compteur++;
      if (compteur % KEEPALIVE_TICKS === 0) for (const s of flux.values()) for (const f of s) ecrire(f.res, ': ka\n\n');
      if (compteur % 60 === 0) {
        for (const l of [limCreation, limRejoindre, limBillet, limAction]) l.purge();
        for (const [b, v] of billets) if (v.exp < now()) billets.delete(b);
      }
    } catch (err) {
      signaler(err, null, '/salle/minuterie');
    }
  }
  const minuterie = horloge ? setInterval(tick, 1000) : null;
  if (minuterie && minuterie.unref) minuterie.unref();

  function lireJson(req) {
    return new Promise((resolve, reject) => {
      let taille = 0;
      const morceaux = [];
      req.on('data', c => {
        taille += c.length;
        if (taille > MAX_CORPS) {
          if (taille - c.length <= MAX_CORPS) reject(new ErreurSalle(413, 'Message trop long'));
          morceaux.length = 0; // on ignore la suite sans couper la connexion : la réponse 413 doit partir
          return;
        }
        morceaux.push(c);
      });
      req.on('end', () => {
        try {
          const v = JSON.parse(Buffer.concat(morceaux).toString('utf8') || '{}');
          if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('forme');
          resolve(v);
        } catch {
          reject(new ErreurSalle(400, 'JSON invalide'));
        }
      });
      req.on('error', () => reject(new ErreurSalle(400, 'Requête interrompue')));
    });
  }

  function limite(l, cle, message = 'Trop de demandes, patientez un instant') {
    if (!l.touche(cle)) throw new ErreurSalle(429, message);
  }

  function ouvrirFlux(req, res, url, ip) {
    const billet = url.searchParams.get('billet') || '';
    const b = billets.get(billet);
    billets.delete(billet); // usage unique
    if (!b || b.exp < now()) throw new ErreurSalle(403, 'Billet invalide ou expiré');
    if ((fluxParIp.get(ip) || 0) >= MAX_FLUX_PAR_IP) throw new ErreurSalle(429, 'Trop de connexions ouvertes');
    const etat = salles.etat(b.jeton); // 403 si la salle a disparu
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    ecrire(res, 'retry: 3000\n\n');
    const f = { res, jeton: b.jeton, ip };
    if (!flux.has(etat.code)) flux.set(etat.code, new Set());
    flux.get(etat.code).add(f);
    fluxParIp.set(ip, (fluxParIp.get(ip) || 0) + 1);
    salles.connecter(b.jeton);
    envoyerEtat(f);
    diffuser(etat.code);
    req.on('close', () => {
      const s = flux.get(etat.code);
      if (s) {
        s.delete(f);
        if (!s.size) flux.delete(etat.code);
      }
      fluxParIp.set(ip, Math.max(0, (fluxParIp.get(ip) || 1) - 1));
      try {
        salles.deconnecter(b.jeton);
      } catch {
        /* salle déjà fermée */
      }
    });
  }

  async function route(req, res, pathname, url, ip, ctx) {
    if (req.method === 'GET' && pathname === '/salle/statut') return json(res, 200, { actif: true, salles: salles.nombre() });
    if (req.method === 'GET' && pathname === '/salle/flux') return ouvrirFlux(req, res, url, ip);
    if (req.method !== 'POST') throw new ErreurSalle(404, 'Introuvable');
    const corps = await lireJson(req);
    const jeton = typeof corps.jeton === 'string' ? corps.jeton : '';
    const reperer = () => {
      try {
        ctx.code = salles.etat(jeton).code;
      } catch {
        /* jeton inconnu : l'appel suivant répondra 403 */
      }
    };
    switch (pathname) {
      case '/salle/creer': {
        limite(limCreation, ip, 'Trop de salles créées depuis votre connexion, réessayez dans une heure');
        const r = salles.creer({ pseudo: corps.pseudo });
        return json(res, 200, r);
      }
      case '/salle/rejoindre': {
        limite(limRejoindre, ip);
        const r = salles.rejoindre({ code: corps.code, pseudo: corps.pseudo });
        ctx.code = r.code;
        diffuser(r.code);
        return json(res, 200, r);
      }
      case '/salle/lancer': {
        reperer();
        const r = salles.lancer({ jeton, options: corps.options && typeof corps.options === 'object' ? corps.options : {} });
        diffuser(ctx.code);
        return json(res, 200, { seq: r.seq });
      }
      case '/salle/action': {
        limite(limAction, jeton);
        reperer();
        const r = salles.agir({ jeton, action: corps.action });
        diffuser(ctx.code);
        return json(res, 200, { seq: r.seq });
      }
      case '/salle/etat': {
        reperer();
        return json(res, 200, salles.etat(jeton));
      }
      case '/salle/billet': {
        limite(limBillet, ip);
        salles.etat(jeton); // 403 si inconnu
        const billet = crypto.randomBytes(16).toString('hex');
        billets.set(billet, { jeton, exp: now() + BILLET_MS });
        return json(res, 200, { billet });
      }
      default:
        throw new ErreurSalle(404, 'Introuvable');
    }
  }

  /** Point d'entrée appelé par server.js pour tout chemin /salle/*. Ne rejette jamais. */
  async function handle(req, res, pathname, url, ip = 'inconnue') {
    cors(req, res);
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    const ctx = { code: null };
    try {
      await route(req, res, pathname, url, ip, ctx);
    } catch (err) {
      if (err instanceof ErreurSalle) return json(res, err.statut, { error: err.message });
      signaler(err, ctx.code, pathname);
      if (ctx.code) {
        try {
          salles.fermer(ctx.code);
        } finally {
          fermee(ctx.code, 'erreur');
        }
      }
      json(res, 500, { error: 'Erreur interne : la salle est fermée' });
    }
  }

  function stop() {
    if (minuterie) clearInterval(minuterie);
    for (const code of [...flux.keys()]) fermee(code, 'arret');
  }

  return { handle, tick, stop, salles };
}
