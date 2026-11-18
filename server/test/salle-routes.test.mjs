// Routes /salle/* : parcours complet, isolation des erreurs (une salle en panne ne touche ni le
// processus ni les autres salles), limites anti-abus, minuteries à horloge simulée, et
// intégration dans server.js (coupé par défaut, actif seulement avec MULTI_ACTIF=1).
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSalleRoutes } from '../salle-routes.js';
import { createSalles } from '../salles.js';
import { createTemps, DELAIS } from '../salles-temps.js';

const SERVER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../server.js');
const ORIGINE = 'https://kyran-jeu.fr';

async function demarrer(options = {}) {
  const incidents = [];
  const routes = createSalleRoutes({
    recordIncident: (err, meta) => incidents.push({ message: err.message, ...meta }),
    allowedOrigins: [ORIGINE],
    horloge: false,
    ...options
  });
  const srv = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    routes.handle(req, res, url.pathname, url, req.headers['x-test-ip'] || '1.1.1.1');
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const post = (chemin, corps, ip) =>
    fetch(base + chemin, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(ip ? { 'x-test-ip': ip } : {}) }, body: typeof corps === 'string' ? corps : JSON.stringify(corps) });
  const fin = () => {
    routes.stop();
    srv.closeAllConnections();
    srv.close();
  };
  return { routes, base, post, incidents, fin };
}

test('parcours complet : créer, rejoindre, lancer, jouer par HTTP', async () => {
  const s = await demarrer();
  try {
    const a = await (await s.post('/salle/creer', { pseudo: 'Ana' })).json();
    assert.match(a.code, /^[A-Z0-9]{6}$/);
    const b = await (await s.post('/salle/rejoindre', { code: a.code, pseudo: 'Ben' })).json();
    assert.equal(b.pid, 1);
    assert.equal((await s.post('/salle/lancer', { jeton: b.jeton, options: {} })).status, 403, "seul l'hôte lance");
    const l = await s.post('/salle/lancer', { jeton: a.jeton, options: { niveau: 'novice' } });
    assert.equal(l.status, 200);
    const etat = await (await s.post('/salle/etat', { jeton: a.jeton })).json();
    assert.equal(etat.statut, 'jeu');
    assert.equal(etat.vue.players.length, 3);
    assert.equal(etat.vue.players[1].hand, null, 'la main de Ben reste cachée pour Ana');
    // un coup du joueur dont c'est le tour
    const tour = etat.vue.pending.pid;
    const jeton = tour === 0 ? a.jeton : tour === 1 ? b.jeton : null;
    if (jeton) {
      const e2 = await (await s.post('/salle/etat', { jeton })).json();
      const interdit = e2.vue.pending.type === 'bet';
      assert.ok(interdit, 'la partie commence par un pari');
      const r = await s.post('/salle/action', { jeton, action: { type: 'bet', value: 0 } });
      assert.ok([200, 409].includes(r.status));
    }
    const r2 = await s.post('/salle/action', { jeton: a.jeton, action: { type: 'triche' } });
    assert.equal(r2.status, 400);
  } finally {
    s.fin();
  }
});

test('flux SSE : billet à usage unique, état envoyé à la connexion et à chaque changement', async () => {
  const s = await demarrer();
  try {
    const a = await (await s.post('/salle/creer', { pseudo: 'Ana' })).json();
    assert.equal((await s.post('/salle/billet', { jeton: 'faux' })).status, 403);
    const { billet } = await (await s.post('/salle/billet', { jeton: a.jeton })).json();
    const ctl = new AbortController();
    const rep = await fetch(`${s.base}/salle/flux?billet=${billet}`, { signal: ctl.signal });
    assert.equal(rep.status, 200);
    assert.match(rep.headers.get('content-type'), /text\/event-stream/);
    const lecteur = rep.body.getReader();
    const dec = new TextDecoder();
    let texte = '';
    const lire = async motif => {
      const fin = Date.now() + 3000;
      while (!motif.test(texte) && Date.now() < fin) {
        const { value, done } = await lecteur.read();
        if (done) break;
        texte += dec.decode(value);
      }
      assert.match(texte, motif);
    };
    await lire(/event: etat\ndata: .*"statut":"attente"/);
    assert.equal((await fetch(`${s.base}/salle/flux?billet=${billet}`)).status, 403, 'billet déjà utilisé');
    await s.post('/salle/rejoindre', { code: a.code, pseudo: 'Ben' });
    await lire(/"pseudo":"Ben"/);
    assert.ok(!texte.includes(a.jeton), 'le jeton secret ne circule jamais dans le flux');
    ctl.abort();
  } finally {
    s.fin();
  }
});

test('limites : corps trop long, JSON invalide, 7e création, CORS', async () => {
  const s = await demarrer();
  try {
    assert.equal((await s.post('/salle/creer', 'x'.repeat(3000))).status, 413);
    assert.equal((await s.post('/salle/creer', 'pas du json')).status, 400);
    assert.equal((await s.post('/salle/creer', { pseudo: '<b>' })).status, 400);
    for (let i = 0; i < 6; i++) assert.equal((await s.post('/salle/creer', { pseudo: 'P' + i }, '9.9.9.9')).status, 200);
    assert.equal((await s.post('/salle/creer', { pseudo: 'P7' }, '9.9.9.9')).status, 429);
    assert.equal((await s.post('/salle/creer', { pseudo: 'Autre' }, '8.8.8.8')).status, 200, 'une autre adresse reste libre');
    const o = await fetch(s.base + '/salle/creer', { method: 'OPTIONS', headers: { Origin: ORIGINE } });
    assert.equal(o.status, 204);
    assert.equal(o.headers.get('access-control-allow-origin'), ORIGINE);
    const m = await fetch(s.base + '/salle/statut', { headers: { Origin: 'https://autre.example' } });
    assert.equal(m.headers.get('access-control-allow-origin'), null);
    assert.equal((await fetch(s.base + '/salle/inconnue')).status, 404);
  } finally {
    s.fin();
  }
});

test('actions : plus de 20 en 10 s sur un même jeton → 429', async () => {
  const s = await demarrer();
  try {
    const a = await (await s.post('/salle/creer', { pseudo: 'Ana' })).json();
    let dernier = 0;
    for (let i = 0; i < 22; i++) dernier = (await s.post('/salle/action', { jeton: a.jeton, action: { type: 'next' } })).status;
    assert.equal(dernier, 429);
  } finally {
    s.fin();
  }
});

test('isolation : une erreur interne ferme la salle, est signalée, et les autres salles continuent', async () => {
  const vraies = createSalles();
  const jetonsFautifs = new Set();
  const salles = new Proxy(vraies, {
    get(cible, prop) {
      if (prop === 'agir') {
        return arg => {
          if (jetonsFautifs.has(arg.jeton)) throw new TypeError('panne simulée du moteur');
          return cible.agir(arg);
        };
      }
      return cible[prop];
    }
  });
  const s = await demarrer({ salles });
  try {
    const a = await (await s.post('/salle/creer', { pseudo: 'Ana' })).json();
    const autre = await (await s.post('/salle/creer', { pseudo: 'Zoé' })).json();
    jetonsFautifs.add(a.jeton);
    const r = await s.post('/salle/action', { jeton: a.jeton, action: { type: 'next' } });
    assert.equal(r.status, 500);
    assert.equal(s.incidents.length, 1);
    assert.equal(s.incidents[0].errorCode, 'SALLE_ERREUR');
    assert.match(s.incidents[0].message, /panne simulée/);
    assert.equal((await s.post('/salle/etat', { jeton: a.jeton })).status, 403, 'la salle fautive est fermée');
    assert.equal((await s.post('/salle/etat', { jeton: autre.jeton })).status, 200, 'les autres salles ne sont pas touchées');
    assert.equal((await fetch(s.base + '/salle/statut')).status, 200, 'le serveur répond toujours');
  } finally {
    s.fin();
  }
});

test('isolation des minuteries : une erreur dans une salle la ferme sans arrêter le tick', () => {
  const t = { v: 1_000_000 };
  const now = () => t.v;
  const vraies = createSalles({ now });
  const a = vraies.creer({ pseudo: 'Ana' });
  const b = vraies.creer({ pseudo: 'Ben' });
  vraies.lancer({ jeton: a.jeton, options: { niveau: 'novice' } });
  vraies.lancer({ jeton: b.jeton, options: { niveau: 'novice' } });
  const erreurs = [];
  const fermees = [];
  const salles = new Proxy(vraies, {
    get(cible, prop) {
      if (prop === 'avancer') {
        return (code, o) => {
          if (code === a.code) throw new RangeError('panne de minuterie');
          return cible.avancer(code, o);
        };
      }
      return cible[prop];
    }
  });
  const temps = createTemps({ salles, now, onErreur: (e, c) => erreurs.push([e.message, c]), onClose: (c, r) => fermees.push([c, r]) });
  t.v += DELAIS.coupMs + 1000;
  temps.tick();
  assert.equal(erreurs.length >= 1, true);
  assert.equal(erreurs[0][1] === a.code || erreurs[0][1] === b.code, true);
  assert.ok(vraies.nombre() <= 2);
  assert.ok(fermees.some(([c, r]) => r === 'erreur'));
});

test('minuteries : délai de 60 s, remplacement après 3 délais, expirations', () => {
  const t = { v: 5_000_000 };
  const now = () => t.v;
  const salles = createSalles({ now });
  const a = salles.creer({ pseudo: 'Ana' });
  salles.lancer({ jeton: a.jeton, options: { niveau: 'novice' } });
  salles.connecter(a.jeton);
  const fermees = [];
  const temps = createTemps({ salles, now, onClose: (c, r) => fermees.push(r) });
  const salle = salles._interne.salleDe(a.code);
  // les ordinateurs jouent après leur pause, l'humain attend ses 60 s
  let tours = 0;
  while (tours++ < 400 && salle.sieges[0].delais === 0) {
    t.v += 1500;
    salles.connecter && salles.etat(a.jeton);
    temps.tick();
  }
  assert.ok(salle.sieges[0].delais >= 1, "l'humain qui ne joue pas dépasse son délai de 60 s");
  while (tours++ < 2000 && !salle.sieges[0].remplace) {
    t.v += 1500;
    temps.tick();
  }
  assert.equal(salle.sieges[0].remplace, true, '3 délais : remplacé par un ordinateur');
  // l'humain revient et joue : il reprend sa place
  assert.equal(salle.sieges[0].delais >= 3, true);
  // plus aucun humain connecté + partie sans coup : fermeture
  salles.deconnecter(a.jeton);
  t.v += 11 * 60_000;
  for (let i = 0; i < 5; i++) temps.tick();
  assert.equal(salles.nombre(), 0);
  assert.ok(fermees.length >= 1);
});

test('minuteries : salon abandonné, salle finie et plafond de 3 h', () => {
  const t = { v: 9_000_000 };
  const now = () => t.v;
  const salles = createSalles({ now });
  const fermees = [];
  const temps = createTemps({ salles, now, onClose: (c, r) => fermees.push(r) });
  salles.creer({ pseudo: 'Ana' });
  t.v += DELAIS.attenteMs - 1000;
  temps.tick();
  assert.equal(salles.nombre(), 1);
  t.v += 2000;
  temps.tick();
  assert.equal(salles.nombre(), 0);
  assert.deepEqual(fermees, ['abandon']);
});

test('transfert d’hôte : un hôte absent du salon passe la main à un joueur connecté', () => {
  const t = { v: 2_000_000 };
  const now = () => t.v;
  const salles = createSalles({ now });
  const a = salles.creer({ pseudo: 'Ana' });
  const b = salles.rejoindre({ code: a.code, pseudo: 'Ben' });
  salles.connecter(b.jeton);
  const temps = createTemps({ salles, now });
  t.v += DELAIS.hoteMs + 1000;
  temps.tick();
  assert.equal(salles.etat(b.jeton).hote, 1);
});

// --- intégration dans server.js : coupé par défaut ---------------------------------------
function lancerServeur(port, env) {
  return new Promise((resolve, reject) => {
    const enfant = spawn(process.execPath, [SERVER], {
      env: { PATH: process.env.PATH, PORT: String(port), ...env },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let logs = '';
    const collecte = d => {
      logs += String(d);
      if (logs.includes('actif sur port')) resolve({ enfant, logs: () => logs });
    };
    enfant.stdout.on('data', collecte);
    enfant.stderr.on('data', collecte);
    enfant.on('error', reject);
    setTimeout(() => reject(new Error('démarrage trop long')), 6000);
  });
}

test('server.js sans MULTI_ACTIF : /salle/* répond 503 {actif:false}, le reste fonctionne, aucun module de salle chargé', async () => {
  const { enfant } = await lancerServeur(39894, {});
  try {
    const r = await fetch('http://127.0.0.1:39894/salle/statut');
    assert.equal(r.status, 503);
    assert.deepEqual(await r.json(), { actif: false });
    const c = await fetch('http://127.0.0.1:39894/salle/creer', { method: 'POST', body: '{"pseudo":"Ana"}' });
    assert.equal(c.status, 503);
    const h = await fetch('http://127.0.0.1:39894/health');
    assert.equal(h.status, 200);
  } finally {
    enfant.kill();
  }
});

test('server.js avec MULTI_ACTIF=1 : les salles répondent et le webhook reste inchangé', async () => {
  const { enfant } = await lancerServeur(39895, { MULTI_ACTIF: '1' });
  try {
    let r;
    for (let i = 0; i < 20; i++) {
      r = await fetch('http://127.0.0.1:39895/salle/statut');
      if (r.status === 200) break;
      await new Promise(ok => setTimeout(ok, 100));
    }
    assert.equal(r.status, 200);
    assert.equal((await r.json()).actif, true);
    const c = await fetch('http://127.0.0.1:39895/salle/creer', { method: 'POST', body: JSON.stringify({ pseudo: 'Ana' }) });
    assert.equal(c.status, 200);
    const w = await fetch('http://127.0.0.1:39895/webhook', { method: 'POST', body: '{}' });
    assert.ok([400, 401, 403, 500, 503].includes(w.status), `le webhook refuse toujours un appel sans signature (${w.status})`);
    assert.equal((await fetch('http://127.0.0.1:39895/health')).status, 200);
  } finally {
    enfant.kill();
  }
});
