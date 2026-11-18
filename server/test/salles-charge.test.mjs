// Parties entre amis : charge (20 salles de 3 joueurs en même temps) et confidentialité de tout ce
// que le serveur envoie (réponses /salle/etat et flux SSE), par HTTP sur un serveur local.
// Rien n'est lancé sur la production : ces tests tournent dans la CI (« npm run test:security »).
//
// Horloge : les limites anti-abus (20 actions / 10 s par jeton, etc.) sont comptées avec une
// horloge 50 fois plus rapide (un billet de flux, valable un temps court, doit encore l’être), sinon une CI rapide dépasserait « 20 coups en 10 s » avec des
// joueurs automatiques qui ne réfléchissent pas. Les minuteries (60 s par coup) ne tournent pas
// ici (horloge: false) : elles ont leurs propres tests dans salle-routes.test.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import * as E from '../moteur/engine.js';
import * as AI from '../moteur/ai.js';
import { createSalleRoutes } from '../salle-routes.js';

const ACCELERE = () => Date.now() * 50;

async function demarrer() {
  const incidents = [];
  const routes = createSalleRoutes({
    recordIncident: (err, meta) => incidents.push({ message: err.message, ...meta }),
    allowedOrigins: [],
    horloge: false,
    now: ACCELERE
  });
  const srv = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    routes.handle(req, res, url.pathname, url, req.headers['x-test-ip'] || '1.1.1.1');
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const mesures = [];
  const erreurs = [];
  const post = async (chemin, corps, ip) => {
    const t0 = performance.now();
    const r = await fetch(base + chemin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-ip': ip },
      body: JSON.stringify(corps)
    });
    const data = await r.json();
    mesures.push(performance.now() - t0);
    if (!r.ok) erreurs.push(`${chemin} → ${r.status} ${data.error || ''}`);
    return data;
  };
  const fin = () => {
    routes.stop();
    srv.closeAllConnections();
    srv.close();
  };
  return { routes, base, post, mesures, erreurs, incidents, fin };
}

/** Flux SSE d'un joueur : garde le dernier état reçu et tout le texte brut reçu. */
async function ouvrirFlux(s, jeton, ip, onEtat) {
  const { billet } = await s.post('/salle/billet', { jeton }, ip);
  const ctl = new AbortController();
  const rep = await fetch(`${s.base}/salle/flux?billet=${billet}`, { signal: ctl.signal, headers: { 'x-test-ip': ip } });
  assert.equal(rep.status, 200);
  const flux = { brut: '', dernier: null, recus: 0, ctl };
  const dec = new TextDecoder();
  let tampon = '';
  (async () => {
    try {
      const lecteur = rep.body.getReader();
      for (;;) {
        const { value, done } = await lecteur.read();
        if (done) break;
        const texte = dec.decode(value);
        flux.brut += texte;
        tampon += texte;
        let i;
        while ((i = tampon.indexOf('\n\n')) >= 0) {
          const bloc = tampon.slice(0, i);
          tampon = tampon.slice(i + 2);
          const m = /^event: etat\ndata: (.*)$/s.exec(bloc);
          if (m) {
            flux.dernier = JSON.parse(m[1]);
            flux.recus++;
            if (onEtat) onEtat(flux.dernier);
          }
        }
      }
    } catch {
      /* flux coupé à la fin du test */
    }
  })();
  return flux;
}

/** Action du moteur choisie par l'ordinateur pour la décision en attente (test seulement : lit l'état complet). */
function actionAuto(state, rng) {
  const pend = state.pending;
  return pend.type === 'reveal' || pend.type === 'next' ? { type: pend.type } : AI.decide(state, rng);
}

// ---------- Confidentialité ----------

const CLES_ETAT = ['code', 'statut', 'moi', 'hote', 'seq', 'sieges', 'vue'];
const CLES_VUE = ['me', 'phase', 'roundNo', 'dealer', 'opts', 'pending', 'players', 'round', 'trick', 'history', 'tiebreak', 'winners'];
const CLES_JOUEUR = ['id', 'name', 'human', 'persona', 'level', 'lives', 'bet', 'tricks', 'handCount', 'hand', 'peeks', 'stats'];
const CLES_MANCHE = ['no', 'cards', 'mystic', 'tiebreak', 'participants', 'dealer', 'betOrder', 'betIdx', 'trickNo', 'played'];
const CLES_INTERDITES = ['"rng"', '"seed"', '"deckTemplate"', '"deals"', '"undealt"', '"noLifeLoss"', '"deck"'];

const memes = (cles, objet, quoi) => assert.deepEqual(Object.keys(objet).sort(), [...cles].sort(), quoi);

/** Cartes que `pid` n'a pas le droit de voir : mains cachées et pioche (cartes non distribuées). */
function cartesInterdites(state, pid) {
  const cachees = new Set();
  const r = state.round;
  if (!r) return cachees;
  for (const p of state.players) {
    const visible = r.mystic ? p.id !== pid : p.id === pid;
    if (!visible) p.hand.forEach(c => cachees.add(c.id));
  }
  r.undealt.forEach(c => cachees.add(c.id));
  for (const k of state.players[pid].peeks) cachees.delete(k.card.id); // montrée à lui seul par la Clairvoyance
  return cachees;
}

/**
 * Un état reçu par le joueur `pid` : mêmes champs que la liste blanche, aucune clé interne, aucune
 * carte cachée ni de la pioche, aucun jeton. `etatSerein` est l'état complet du serveur à cet instant.
 */
function verifierEtat(etat, etatSerein, pid, jetons, quoi) {
  verifierStructure(etat, pid, jetons, quoi);
  if (!etat.vue) return;
  const texte = JSON.stringify(etat);
  for (const id of cartesInterdites(etatSerein, pid)) {
    assert.ok(!texte.includes(`"id":"${id}"`), `${quoi} : le siège ${pid} reçoit la carte cachée ${id}`);
  }
}

/** Contrôles qui ne demandent pas l'état du serveur : champs, mains des autres, clés internes, jetons. */
function verifierStructure(etat, pid, jetons, quoi) {
  memes(CLES_ETAT, etat, `${quoi} : champs de l'état`);
  assert.equal(etat.moi, pid, `${quoi} : l'état est bien celui du siège ${pid}`);
  const texte = JSON.stringify(etat);
  for (const cle of CLES_INTERDITES) assert.ok(!texte.includes(cle), `${quoi} : contient ${cle}`);
  for (const j of jetons) assert.ok(!texte.includes(j), `${quoi} : un jeton circule dans l'état`);
  if (!etat.vue) return;
  memes(CLES_VUE, etat.vue, `${quoi} : champs de la vue`);
  for (const p of etat.vue.players) {
    memes(CLES_JOUEUR, p, `${quoi} : champs d'un joueur`);
    if (p.id !== pid && !etat.vue.round?.mystic) assert.equal(p.hand, null, `${quoi} : main du siège ${p.id} visible par ${pid}`);
  }
  if (etat.vue.round) memes(CLES_MANCHE, etat.vue.round, `${quoi} : champs de la manche`);
}

test('confidentialité : chaque état reçu par HTTP et par flux SSE, de 3 à 6 sièges, pouvoirs et Mystique', async () => {
  const s = await demarrer();
  let verifies = 0;
  let evenementsSse = 0;
  try {
    let ipN = 0;
    for (const [humains, ordis, pouvoirs] of [[3, 0, true], [3, 1, true], [4, 2, false], [3, 3, true]]) {
      const ip = `10.1.0.${++ipN}`;
      const hote = await s.post('/salle/creer', { pseudo: 'Hote' }, ip);
      const joueurs = [hote];
      for (let i = 1; i < humains; i++) joueurs.push(await s.post('/salle/rejoindre', { code: hote.code, pseudo: 'J' + i }, ip));
      const jetons = joueurs.map(j => j.jeton);
      const flux = [];
      for (const j of joueurs) {
        flux.push(await ouvrirFlux(s, j.jeton, ip, etat => {
          verifierStructure(etat, j.pid, jetons, `SSE siège ${j.pid}`);
          evenementsSse++;
        }));
      }
      await s.post('/salle/lancer', { jeton: hote.jeton, options: { niveau: 'novice', ordinateurs: ordis, vies: 3, pouvoirs } }, ip);
      const salle = s.routes.salles._interne.salleDe(hote.code);
      const rng = E.makeRng(7 + ipN);
      for (let garde = 0; salle.state.pending && salle.statut === 'jeu' && garde < 6000; garde++) {
        const etatSerein = salle.state;
        // ce que chaque humain reçoit par /salle/etat
        for (const j of joueurs) {
          const etat = await s.post('/salle/etat', { jeton: j.jeton }, ip);
          verifierEtat(etat, etatSerein, j.pid, jetons, `HTTP partie ${humains}+${ordis}, pas ${garde}`);
          verifies++;
        }
        const pend = salle.state.pending;
        const siegeOrdi = pend.pid != null && !salle.sieges[pend.pid].humain;
        if (siegeOrdi) {
          s.routes.salles.avancer(hote.code);
          continue;
        }
        const action = actionAuto(salle.state, rng);
        const jeton = pend.pid != null ? jetons[pend.pid] : jetons[0];
        await s.post('/salle/action', { jeton, action }, ip);
      }
      assert.equal(salle.statut, 'finie', `partie ${humains}+${ordis} terminée`);
      // dernier état de chaque flux : le texte brut reçu pendant toute la partie ne contient aucune clé interne ni jeton
      await new Promise(r => setTimeout(r, 100));
      flux.forEach((f, i) => {
        assert.ok(f.recus > 10, `flux ${i} : ${f.recus} états reçus`);
        for (const cle of CLES_INTERDITES) assert.ok(!f.brut.includes(cle), `flux ${i} contient ${cle}`);
        for (const j of jetons) assert.ok(!f.brut.includes(j), `flux ${i} : un jeton circule`);
        verifierEtat(f.dernier, salle.state, i, jetons, `SSE dernier état, flux ${i}`);
        verifies++;
        f.ctl.abort();
      });
    }
    assert.deepEqual(s.erreurs, [], 'aucune erreur de réponse');
    assert.deepEqual(s.incidents, [], 'aucun incident serveur');
    assert.ok(verifies > 400, `assez d'états contrôlés (${verifies})`);
    console.log(`[confidentialité] ${verifies} états HTTP et derniers états SSE contrôlés contre l'état du serveur, ${evenementsSse} états SSE contrôlés en structure, 0 fuite`);
  } finally {
    s.fin();
  }
});

// ---------- Charge ----------

const SALLES = 20;
const JOUEURS = 3;

test(`charge : ${SALLES} salles de ${JOUEURS} joueurs en même temps, parties jouées jusqu'au bout`, async () => {
  const s = await demarrer();
  const mo = o => Math.round((o / 1024 / 1024) * 10) / 10;
  const avant = process.memoryUsage();
  let flux = [];
  try {
    const t0 = performance.now();
    const resultats = await Promise.all(
      Array.from({ length: SALLES }, async (_, n) => {
        const ip = `10.2.${Math.floor(n / 200)}.${n % 200}`;
        const hote = await s.post('/salle/creer', { pseudo: 'Hote' + n }, ip);
        const joueurs = [hote];
        for (let i = 1; i < JOUEURS; i++) joueurs.push(await s.post('/salle/rejoindre', { code: hote.code, pseudo: 'J' + n + '_' + i }, ip));
        for (const j of joueurs) flux.push(await ouvrirFlux(s, j.jeton, ip));
        await s.post('/salle/lancer', { jeton: hote.jeton, options: { niveau: 'novice', vies: 3 } }, ip);
        const salle = s.routes.salles._interne.salleDe(hote.code);
        const rng = E.makeRng(100 + n);
        let coups = 0;
        while (salle.statut === 'jeu' && salle.state.pending && coups < 6000) {
          const pend = salle.state.pending;
          const jeton = pend.pid != null ? joueurs[pend.pid].jeton : hote.jeton;
          await s.post('/salle/action', { jeton, action: actionAuto(salle.state, rng) }, ip);
          coups++;
        }
        return { statut: salle.statut, coups };
      })
    );
    const duree = performance.now() - t0;
    await new Promise(r => setTimeout(r, 200));
    const apres = process.memoryUsage();
    const m = s.mesures;
    const moyenne = m.reduce((a, b) => a + b, 0) / m.length;
    const max = Math.max(...m);
    const coupsTotal = resultats.reduce((a, r) => a + r.coups, 0);
    const recus = flux.reduce((a, f) => a + f.recus, 0);
    const resume =
      `[charge] ${SALLES} salles x ${JOUEURS} joueurs, ${m.length} requêtes en ${(duree / 1000).toFixed(1)} s, ` +
      `${coupsTotal} coups, ${recus} états reçus par SSE (${flux.length} flux) | ` +
      `réponse moyenne ${moyenne.toFixed(1)} ms, maximale ${max.toFixed(1)} ms | ` +
      `mémoire du processus : ${mo(avant.rss)} Mo avant, ${mo(apres.rss)} Mo après (tas ${mo(apres.heapUsed)} Mo) | ` +
      `erreurs ${s.erreurs.length}, incidents ${s.incidents.length}`;
    console.log(resume);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Charge des parties entre amis\n\n${resume}\n\n`);

    assert.deepEqual(s.erreurs, [], '0 erreur de réponse');
    assert.deepEqual(s.incidents, [], '0 incident serveur');
    assert.ok(resultats.every(r => r.statut === 'finie'), `les ${SALLES} parties sont finies (${JSON.stringify(resultats.map(r => r.statut))})`);
    assert.equal(s.routes.salles.nombre(), SALLES);
    // Garde-fous larges (pas des objectifs) : une dérive énorme doit faire échouer la CI.
    assert.ok(max < 5000, `réponse maximale ${max.toFixed(0)} ms`);
    assert.ok(apres.rss < 600 * 1024 * 1024, `mémoire ${mo(apres.rss)} Mo`);
  } finally {
    flux.forEach(f => f.ctl.abort());
    s.fin();
  }
});
