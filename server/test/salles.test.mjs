import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as E from '../moteur/engine.js';
import { createSalles, ErreurSalle, pseudoValide, actionPropre } from '../salles.js';
import { moteurPour } from '../../scripts/sync-moteur.mjs';
import { readLf } from '../../scripts/lib/lf.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const refus = (fn, statut) =>
  assert.throws(fn, err => err instanceof ErreurSalle && (statut == null || err.statut === statut), `refus attendu (${statut})`);

function salleDe3() {
  const s = createSalles();
  const a = s.creer({ pseudo: 'Ana' });
  const b = s.rejoindre({ code: a.code, pseudo: 'Ben' });
  const c = s.rejoindre({ code: a.code, pseudo: 'Cléo' });
  s.lancer({ jeton: a.jeton, options: { niveau: 'novice' } });
  return { s, joueurs: [a, b, c], code: a.code };
}

const jetonDuTour = (s, joueurs) => joueurs.find(j => s.etat(j.jeton).vue.pending.pid === j.pid);

test('moteur du serveur : copies identiques à dojo/ (sans ?v=) et ai.js importe le moteur copié', () => {
  for (const name of ['engine.js', 'ai.js']) {
    const attendu = moteurPour(name, readLf(path.join(ROOT, 'dojo', name)));
    assert.equal(readLf(path.join(ROOT, 'server', 'moteur', name)), attendu, `${name} : lancer « npm run build »`);
  }
  const ai = fs.readFileSync(path.join(ROOT, 'server', 'moteur', 'ai.js'), 'utf8');
  assert.match(ai, /from '\.\/engine\.js'/);
  assert.ok(!ai.includes('?v='));
});

test('création : code sans caractères ambigus, jeton de 128 bits, hôte au siège 0', () => {
  const s = createSalles();
  const r = s.creer({ pseudo: 'Ana' });
  assert.match(r.code, /^[2-9A-HJKMNP-Z]{6}$/);
  assert.match(r.jeton, /^[0-9a-f]{32}$/);
  assert.equal(r.pid, 0);
  const e = s.etat(r.jeton);
  assert.equal(e.statut, 'attente');
  assert.equal(e.hote, 0);
  assert.equal(e.vue, null);
  const r2 = s.creer({ pseudo: 'Ana' });
  assert.notEqual(r2.jeton, r.jeton);
  assert.notEqual(r2.code, r.code);
});

test('pseudo : 1 à 20 caractères, sans balises, unique dans la salle', () => {
  for (const mauvais of ['', '   ', 'x'.repeat(21), '<b>', 'a&b', 'a"b', "a'b", 'a‮b', 'a\u0007b', 42, null, undefined]) {
    assert.throws(() => pseudoValide(mauvais), ErreurSalle, String(mauvais));
  }
  assert.equal(pseudoValide('  Zoé   la  Rapide '), 'Zoé la Rapide');
  const s = createSalles();
  const a = s.creer({ pseudo: 'Ana' });
  refus(() => s.rejoindre({ code: a.code, pseudo: 'ana' }), 409);
});

test('rejoindre : salle inconnue, pleine, ou partie commencée', () => {
  const s = createSalles();
  refus(() => s.rejoindre({ code: 'ZZZZZZ', pseudo: 'Bob' }), 404);
  refus(() => s.rejoindre({ code: undefined, pseudo: 'Bob' }), 404);
  const a = s.creer({ pseudo: 'Ana' });
  for (let i = 1; i < 6; i++) s.rejoindre({ code: a.code, pseudo: 'J' + i });
  refus(() => s.rejoindre({ code: a.code, pseudo: 'Trop' }), 409);
  s.lancer({ jeton: a.jeton, options: { niveau: 'novice' } });
  refus(() => s.rejoindre({ code: a.code, pseudo: 'Tard' }), 409);
});

test('lancer : seul l\'hôte ; 1 ou 2 humains complétés à 3 par des ordinateurs ; options vérifiées', () => {
  const s = createSalles();
  const a = s.creer({ pseudo: 'Ana' });
  const b = s.rejoindre({ code: a.code, pseudo: 'Ben' });
  refus(() => s.lancer({ jeton: b.jeton }), 403);
  refus(() => s.lancer({ jeton: a.jeton, options: { vies: 4 } }), 400);
  refus(() => s.lancer({ jeton: a.jeton, options: { niveau: 'maitre' } }), 400);
  refus(() => s.lancer({ jeton: a.jeton, options: { ordinateurs: -1 } }), 400);
  refus(() => s.lancer({ jeton: 'nimporte' }), 403);
  s.lancer({ jeton: a.jeton, options: { vies: 7, niveau: 'novice' } });
  const e = s.etat(a.jeton);
  assert.equal(e.sieges.length, 3);
  assert.deepEqual(e.sieges.map(x => x.humain), [true, true, false]);
  assert.equal(e.vue.players[0].lives, 7);
  refus(() => s.lancer({ jeton: a.jeton }), 409);
  const seul = createSalles();
  const c = seul.creer({ pseudo: 'Solo' });
  seul.lancer({ jeton: c.jeton, options: { niveau: 'novice', ordinateurs: 9 } });
  assert.equal(seul.etat(c.jeton).sieges.length, 6, 'plafonné à 6 sièges');
});

test('la vue de chaque joueur ne contient que sa main', () => {
  const { s, joueurs } = salleDe3();
  for (const j of joueurs) {
    const e = s.etat(j.jeton);
    assert.equal(e.moi, j.pid);
    assert.equal(e.vue.players[j.pid].hand.length, 7);
    for (const q of e.vue.players) if (q.id !== j.pid) assert.equal(q.hand, null);
    assert.ok(!JSON.stringify(e).includes('"seed"'));
  }
});

test('reconnexion : même jeton, même vue', () => {
  const { s, joueurs } = salleDe3();
  const a = JSON.stringify(s.etat(joueurs[1].jeton));
  assert.equal(JSON.stringify(s.etat(joueurs[1].jeton)), a);
});

test('actions refusées : état inchangé (mauvais jeton, mauvais tour, pari interdit, carte absente, action inconnue)', () => {
  const { s, code, joueurs } = salleDe3();
  const instantane = () => JSON.stringify(s._interne.salleDe(code).state.players.map(p => [p.bet, p.hand.map(c => c.id)]));
  const avant = instantane();
  const seq = s.etat(joueurs[0].jeton).seq;
  const tour = jetonDuTour(s, joueurs);
  const pasTour = joueurs.find(j => j !== tour);
  refus(() => s.agir({ jeton: 'faux', action: { type: 'bet', value: 1 } }), 403);
  refus(() => s.agir({ jeton: pasTour.jeton, action: { type: 'bet', value: 1 } }), 409);
  // le pid envoyé est ignoré : se faire passer pour le joueur dont c'est le tour ne marche pas
  refus(() => s.agir({ jeton: pasTour.jeton, action: { type: 'bet', pid: tour.pid, value: 1 } }), 409);
  refus(() => s.agir({ jeton: tour.jeton, action: { type: 'bet', value: 99 } }), 409);
  refus(() => s.agir({ jeton: tour.jeton, action: { type: 'bet', value: 1.5 } }), 400);
  refus(() => s.agir({ jeton: tour.jeton, action: { type: 'play', cardId: 'n1' } }), 409);
  refus(() => s.agir({ jeton: tour.jeton, action: { type: 'start' } }), 400);
  refus(() => s.agir({ jeton: tour.jeton, action: { type: 'triche' } }), 400);
  refus(() => s.agir({ jeton: tour.jeton, action: null }), 400);
  assert.equal(instantane(), avant);
  assert.equal(s.etat(joueurs[0].jeton).seq, seq);
});

test('règle d\'or : le dernier à parler ne peut pas annoncer le pari interdit', () => {
  const { s, code, joueurs } = salleDe3();
  const salle = s._interne.salleDe(code);
  const ordre = salle.state.round.betOrder;
  const parPid = pid => joueurs.find(j => j.pid === pid);
  s.agir({ jeton: parPid(ordre[0]).jeton, action: { type: 'bet', value: 0 } });
  s.agir({ jeton: parPid(ordre[1]).jeton, action: { type: 'bet', value: 0 } });
  const interdit = E.forbiddenBet(salle.state, ordre[2]);
  assert.equal(interdit, salle.state.round.cards);
  refus(() => s.agir({ jeton: parPid(ordre[2]).jeton, action: { type: 'bet', value: interdit } }), 409);
  s.agir({ jeton: parPid(ordre[2]).jeton, action: { type: 'bet', value: interdit - 1 } });
  assert.equal(salle.state.phase, 'play');
});

test('actionPropre : liste blanche, le pid vient toujours du jeton', () => {
  assert.deepEqual(actionPropre({ type: 'bet', pid: 5, value: 2, extra: 'x' }, 1), { type: 'bet', pid: 1, value: 2 });
  assert.deepEqual(actionPropre({ type: 'play', cardId: 'n12', mysticValue: 37 }, 2), { type: 'play', pid: 2, cardId: 'n12', mysticValue: 37 });
  assert.deepEqual(actionPropre({ type: 'play', cardId: 'm', mysticValue: 5 }, 2), { type: 'play', pid: 2, cardId: 'm' });
  assert.deepEqual(actionPropre({ type: 'target', target: null }, 0), { type: 'target', pid: 0, target: null });
  assert.deepEqual(actionPropre({ type: 'next', pid: 3 }, 0), { type: 'next' });
  assert.throws(() => actionPropre({ type: 'play', cardId: 'n12345' }, 0), ErreurSalle);
});

test('plafond de salles, fermeture : les jetons deviennent inutilisables', () => {
  const s = createSalles({ maxSalles: 2 });
  const a = s.creer({ pseudo: 'A' });
  s.creer({ pseudo: 'B' });
  refus(() => s.creer({ pseudo: 'C' }), 503);
  s.fermer(a.code);
  assert.equal(s.nombre(), 1);
  refus(() => s.etat(a.jeton), 403);
  s.creer({ pseudo: 'C' });
});

test('parties complètes côté serveur, 3 à 6 sièges, règle d\'or jamais violée', () => {
  for (const n of [3, 4, 5, 6]) {
    for (const pouvoirs of [true, false]) {
      const s = createSalles();
      const a = s.creer({ pseudo: 'Hôte' });
      s.lancer({ jeton: a.jeton, options: { niveau: 'novice', ordinateurs: n - 1, pouvoirs } });
      s.remplacer(a.code, 0); // tous les sièges jouent seuls
      let paris = [];
      let manches = 1; // la première manche démarre dans lancer()
      for (let i = 0; i < 6000 && s.etat(a.jeton).statut === 'jeu'; i++) {
        const evs = s.avancer(a.code);
        assert.ok(evs, 'une décision est toujours disponible quand tous les sièges sont des ordinateurs');
        for (const ev of evs) {
          if (ev.type === 'roundStart') { paris = []; manches++; }
          if (ev.type === 'bet') paris.push(ev.value);
          if (ev.type === 'betsDone') {
            const st = s._interne.salleDe(a.code).state;
            assert.equal(paris.length, st.round.participants.length);
            assert.notEqual(paris.reduce((x, y) => x + y, 0), st.round.cards, 'la somme des paris ne doit jamais égaler le nombre de cartes');
          }
        }
      }
      const e = s.etat(a.jeton);
      assert.equal(e.statut, 'finie', `${n} sièges, pouvoirs ${pouvoirs}`);
      assert.ok(e.vue.winners && e.vue.winners.length >= 1, `vainqueur présent (${JSON.stringify(e.vue.winners)})`);
      // La partie s'arrête à la première élimination : elle peut finir dès la 1re manche (~2 % des cas).
      assert.ok(manches >= 1 && e.vue.players.some(p => p.lives <= 0), `un joueur éliminé à la fin (${manches} manche(s))`);
      refus(() => s.agir({ jeton: a.jeton, action: { type: 'next' } }), 409);
    }
  }
});

test('un humain en attente bloque l\'ordinateur ; remplacé, l\'ordinateur joue à sa place', () => {
  const { s, code, joueurs } = salleDe3();
  const salle = s._interne.salleDe(code);
  const tour = salle.state.pending.pid;
  assert.equal(s.avancer(code), null, 'un humain doit jouer');
  s.remplacer(code, tour);
  assert.ok(s.avancer(code), "l'ordinateur joue pour le siège remplacé");
  s.remplacer(code, tour, false);
  refus(() => s.remplacer(code, 99), 400);
  assert.ok(joueurs.length === 3);
});
