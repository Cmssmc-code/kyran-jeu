import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../moteur/engine.js';
import * as AI from '../moteur/ai.js';
import { vueDe, evenementsPour } from '../vue.js';

const CLES_INTERDITES = ['"rng"', '"seed"', '"deckTemplate"', '"deals"', '"undealt"', '"noLifeLoss"'];

function nouvelleParti(n, seed, extra = {}) {
  const personas = AI.PERSONAS.map(p => p.key);
  const players = Array.from({ length: n }, (_, i) => ({ name: 'J' + i, human: true, persona: personas[i % personas.length], level: 'novice' }));
  const state = E.createGame({ players, seed, ...extra });
  return state;
}

/** Identifiants de cartes que `pid` n'a PAS le droit de voir dans l'état courant. */
function cartesCachees(state, pid) {
  const hidden = new Set();
  const r = state.round;
  if (!r) return hidden;
  for (const p of state.players) {
    const visible = r.mystic ? p.id !== pid : p.id === pid;
    if (!visible) p.hand.forEach(c => hidden.add(c.id));
  }
  r.undealt.forEach(c => hidden.add(c.id));
  for (const k of state.players[pid].peeks) hidden.delete(k.card.id); // ce que la Clairvoyance a montré à ce joueur
  return hidden;
}

function verifierSansFuite(state) {
  for (const p of state.players) {
    const json = JSON.stringify(vueDe(state, p.id));
    for (const cle of CLES_INTERDITES) assert.ok(!json.includes(cle), `la vue de ${p.id} contient ${cle}`);
    for (const id of cartesCachees(state, p.id)) {
      assert.ok(!json.includes(`"id":"${id}"`), `la vue du siège ${p.id} révèle la carte ${id} (manche ${state.roundNo})`);
    }
  }
}

test('vue sans fuite : parties complètes de 3 à 6 joueurs, chaque siège, chaque étape', () => {
  let etapes = 0;
  for (const n of [3, 4, 5, 6]) {
    for (const seed of [11, 202]) {
      const state = nouvelleParti(n, seed);
      E.act(state, { type: 'start' });
      let garde = 0;
      while (state.pending && garde++ < 4000) {
        verifierSansFuite(state);
        etapes++;
        const pend = state.pending;
        const action = pend.type === 'reveal' || pend.type === 'next' ? { type: pend.type } : AI.decide(state, E.makeRng(garde));
        E.act(state, action);
      }
      assert.equal(state.phase, 'gameOver', `partie à ${n} joueurs terminée`);
    }
  }
  assert.ok(etapes > 400, `assez d'étapes contrôlées (${etapes})`);
});

test('manche Mystique : on voit les cartes des autres, jamais la sienne', () => {
  const state = nouvelleParti(4, 5, { rounds: [1] });
  E.act(state, { type: 'start' });
  assert.equal(state.round.mystic, true);
  for (const p of state.players) {
    const v = vueDe(state, p.id);
    assert.equal(v.players[p.id].hand, null, 'sa propre carte est cachée');
    assert.equal(v.players[p.id].handCount, 1);
    for (const q of state.players) {
      if (q.id === p.id) continue;
      assert.deepEqual(v.players[q.id].hand.map(c => c.id), q.hand.map(c => c.id), "la carte d'un autre est visible");
    }
  }
});

test('départage : même filtre que la manche Mystique, hors participants compris', () => {
  const state = nouvelleParti(4, 9);
  state.tiebreak = [0, 1, 2];
  E.act(state, { type: 'start' });
  assert.equal(state.round.tiebreak, true);
  assert.equal(state.round.mystic, true);
  verifierSansFuite(state);
  const v0 = vueDe(state, 0);
  assert.equal(v0.players[0].hand, null);
  assert.equal(v0.players[1].hand.length, 1);
  const v3 = vueDe(state, 3); // ne participe pas : il voit les trois cartes
  assert.ok(v3.players[3].hand === null || v3.players[3].hand.length === 0);
  assert.equal(v3.players[0].hand.length, 1);
});

test('manche normale : seule sa propre main est visible', () => {
  const state = nouvelleParti(4, 21, { rounds: [5] });
  E.act(state, { type: 'start' });
  const v = vueDe(state, 2);
  assert.equal(v.players[2].hand.length, 5);
  for (const i of [0, 1, 3]) {
    assert.equal(v.players[i].hand, null);
    assert.equal(v.players[i].handCount, 5);
  }
});

test('Clairvoyance : la carte vue n\'est montrée qu\'à celui qui l\'a jouée', () => {
  const state = nouvelleParti(4, 33, { rounds: [4] });
  E.act(state, { type: 'start' });
  const vue = state.players[1].hand[0];
  state.players[0].peeks = [{ target: 1, card: vue }];
  assert.equal(vueDe(state, 0).players[0].peeks[0].card.id, vue.id);
  const autre = JSON.stringify(vueDe(state, 2));
  assert.ok(!autre.includes(`"id":"${vue.id}"`));
  assert.deepEqual(vueDe(state, 2).players[0].peeks, []);
  const ev = [{ type: 'peek', pid: 0, target: 1, card: vue }];
  assert.equal(evenementsPour(ev, 0)[0].card.id, vue.id);
  assert.equal(evenementsPour(ev, 2)[0].card, undefined);
  assert.equal(evenementsPour(ev, 1)[0].card, undefined, 'la cible ne voit pas non plus la carte');
});

test('la vue est du JSON valide (cycles infinis, aucune valeur Infinity)', () => {
  const state = nouvelleParti(3, 1);
  E.act(state, { type: 'start' });
  const v = JSON.parse(JSON.stringify(vueDe(state, 0)));
  assert.equal(v.opts.cycles, null);
  assert.equal(v.me, 0);
});

test('événements : un type inconnu du moteur n\'est jamais transmis tel quel', () => {
  assert.deepEqual(evenementsPour([{ type: 'secret', hand: ['n1'] }], 0), []);
});
