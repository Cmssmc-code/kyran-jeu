// Tests du Dojo (minijeu.html) : moteur de règles, adversaires ordinateur et leçons scénarisées.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDeck, createGame, act, legalBets, forbiddenBet, bestPlay, cardById, handRank, unseenFor
} from '../../dojo/engine.js';
import { decide, adviseBet, advisePlay, mysticOdds, PERSONAS } from '../../dojo/ai.js';
import { LESSONS } from '../../dojo/lessons.js';

const TABLE4 = [{ name: 'Toi', human: true }, { name: 'A' }, { name: 'B' }, { name: 'C' }];

/** Fait jouer `decide` pour tout le monde jusqu'à la fin de la partie. */
function autoplay(state, limit = 5000) {
  const events = act(state, { type: 'start' });
  for (let i = 0; state.phase !== 'gameOver'; i++) {
    if (i > limit) throw new Error('partie sans fin');
    events.push(...act(state, decide(state, Math.random)));
  }
  return events;
}

test('paquet officiel : 4 pouvoirs à 3-4 joueurs, 8 à 5-6, plus la Mystique', () => {
  const d4 = buildDeck({ playerCount: 4 });
  assert.equal(d4.length, 41);
  assert.deepEqual(d4.filter(c => c.kind === 'power').map(c => c.value).sort((a, b) => a - b), [3, 11, 20, 27]);
  assert.equal(buildDeck({ playerCount: 6 }).length, 45);
  assert.equal(buildDeck({ playerCount: 4, powers: false, mystique: false }).length, 36);
  assert.equal(new Set(d4.map(c => c.id)).size, d4.length);
});

test('sans cartes Pouvoir à 6 joueurs, la partie commence à 6 cartes', () => {
  const players = Array.from({ length: 6 }, (_, i) => ({ name: 'P' + i }));
  const s = createGame({ players, powers: false, mystique: true });
  assert.deepEqual(s.opts.rounds, [6, 5, 4, 3, 2, 1]);
});

test('règle d’or : le donneur ne peut pas faire tomber la somme sur le nombre de plis', () => {
  const s = createGame({ players: TABLE4, rounds: [5], cycles: 1, dealer: 0, seed: 3 });
  act(s, { type: 'start' });
  act(s, { type: 'bet', pid: 1, value: 1 });
  act(s, { type: 'bet', pid: 2, value: 2 });
  act(s, { type: 'bet', pid: 3, value: 1 });
  assert.equal(s.pending.pid, 0);
  assert.equal(forbiddenBet(s, 0), 1);
  assert.deepEqual(legalBets(s, 0), [0, 2, 3, 4, 5]);
  assert.throws(() => act(s, { type: 'bet', pid: 0, value: 1 }), /interdit/);
  act(s, { type: 'bet', pid: 0, value: 0 });
  assert.equal(s.phase, 'play');
  assert.equal(s.pending.pid, 1, 'le joueur à gauche du donneur ouvre');
});

test('une carte Pouvoir bat la carte Nombre de même valeur', () => {
  const plays = [
    { pid: 0, card: cardById('n27'), value: 27 },
    { pid: 1, card: cardById('p27'), value: 27 },
    { pid: 2, card: cardById('n12'), value: 12 }
  ];
  assert.equal(bestPlay(plays).pid, 1);
  assert.ok(handRank(cardById('m')) > handRank(cardById('n36')));
});

function scripted(hands, opts = {}) {
  const s = createGame({ players: TABLE4, rounds: [hands[0].length], cycles: 1, dealer: 3, seed: 7, noTiebreak: true, deals: { 0: { hands } }, ...opts });
  act(s, { type: 'start' });
  return s;
}

test('Mystique hors manche Mystique : le joueur choisit 0 ou 37', () => {
  const s = scripted({ 0: ['m', 'n2'], 1: ['n30', 'n1'], 2: ['n31', 'n3'], 3: ['n32', 'n4'] });
  for (const pid of [0, 1, 2, 3]) act(s, { type: 'bet', pid, value: pid === 0 ? 1 : 0 });
  act(s, { type: 'play', pid: 0, cardId: 'm' });
  assert.equal(s.pending.type, 'mysticValue');
  act(s, { type: 'mysticValue', pid: 0, value: 37 });
  act(s, { type: 'play', pid: 1, cardId: 'n30' });
  act(s, { type: 'play', pid: 2, cardId: 'n31' });
  const ev = act(s, { type: 'play', pid: 3, cardId: 'n32' });
  assert.equal(ev.find(e => e.type === 'trickWon').pid, 0);
});

test('Bénédiction des Ancêtres : la cible joue aussitôt sa plus faible carte', () => {
  const s = scripted({ 0: ['p20', 'n2'], 1: ['n1', 'n30'], 2: ['n5', 'n31'], 3: ['n6', 'n32'] });
  for (const pid of [0, 1, 2, 3]) act(s, { type: 'bet', pid, value: 0 });
  act(s, { type: 'play', pid: 0, cardId: 'p20' });
  assert.deepEqual(s.pending, { type: 'target', pid: 0, power: 'benediction', options: [1, 2, 3], optional: false });
  const ev = act(s, { type: 'target', pid: 0, target: 2 });
  assert.equal(ev.find(e => e.type === 'force').card.id, 'n5');
  assert.equal(s.pending.pid, 1, 'le joueur forcé est sauté');
  act(s, { type: 'play', pid: 1, cardId: 'n1' });
  assert.equal(s.pending.pid, 3);
});

test('Sceau et Bénédiction sont annulés en dernier, Voile en premier', () => {
  const s = scripted({ 0: ['p3', 'n2'], 1: ['n1', 'n30'], 2: ['n5', 'n31'], 3: ['p27', 'n32'] });
  for (const pid of [0, 1, 2, 3]) act(s, { type: 'bet', pid, value: 0 });
  let ev = act(s, { type: 'play', pid: 0, cardId: 'p3' });
  assert.equal(ev.find(e => e.type === 'powerCancelled').reason, 'first');
  act(s, { type: 'play', pid: 1, cardId: 'n30' });
  act(s, { type: 'play', pid: 2, cardId: 'n31' });
  ev = act(s, { type: 'play', pid: 3, cardId: 'p27' });
  assert.equal(ev.find(e => e.type === 'powerCancelled').reason, 'last');
  assert.equal(ev.find(e => e.type === 'trickWon').pid, 2);
});

test('Voile du Néant : échange facultatif de valeurs', () => {
  const s = scripted({ 0: ['n10', 'n2'], 1: ['p3', 'n1'], 2: ['n31', 'n5'], 3: ['n6', 'n32'] });
  for (const pid of [0, 1, 2, 3]) act(s, { type: 'bet', pid, value: 0 });
  act(s, { type: 'play', pid: 0, cardId: 'n10' });
  act(s, { type: 'play', pid: 1, cardId: 'p3' });
  assert.equal(s.pending.optional, true);
  assert.deepEqual(s.pending.options, [0]);
  act(s, { type: 'target', pid: 1, target: 0 });
  act(s, { type: 'play', pid: 2, cardId: 'n5' });
  const ev = act(s, { type: 'play', pid: 3, cardId: 'n6' });
  assert.equal(ev.find(e => e.type === 'trickWon').pid, 1, 'le Voile prend la valeur 10');
});

test('Clairvoyance : révèle la meilleure carte de la cible', () => {
  const s = scripted({ 0: ['p11', 'n2'], 1: ['n1', 'm'], 2: ['n5', 'n31'], 3: ['n6', 'n32'] });
  for (const pid of [0, 1, 2, 3]) act(s, { type: 'bet', pid, value: 0 });
  act(s, { type: 'play', pid: 0, cardId: 'p11' });
  const ev = act(s, { type: 'target', pid: 0, target: 1 });
  assert.equal(ev.find(e => e.type === 'peek').card.id, 'm');
  assert.equal(s.players[0].peeks.length, 1);
});

test('manche Mystique : révélation simultanée, Mystique à 37 si son porteur a parié 1', () => {
  const s = scripted({ 0: ['m'], 1: ['n36'], 2: ['n5'], 3: ['n6'] });
  assert.equal(s.round.mystic, true);
  act(s, { type: 'bet', pid: 0, value: 1 });
  act(s, { type: 'bet', pid: 1, value: 1 });
  act(s, { type: 'bet', pid: 2, value: 0 });
  act(s, { type: 'bet', pid: 3, value: 0 });
  assert.equal(s.pending.type, 'reveal');
  const ev = act(s, { type: 'reveal' });
  assert.equal(ev.find(e => e.type === 'trickWon').pid, 0);
  const res = ev.find(e => e.type === 'roundEnd').results;
  assert.equal(res.find(r => r.pid === 1).lost, 1);
});

test('fin de partie à la première élimination, ex æquo départagés', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const s = createGame({ players: TABLE4.map((p, i) => ({ name: 'P' + i, level: 'novice' })), seed, lives: 2 });
    autoplay(s);
    assert.ok(s.winners.length >= 1);
    const max = Math.max(...s.players.map(p => p.lives));
    for (const w of s.winners) assert.equal(s.players[w].lives, max);
    assert.ok(s.players.some(p => p.lives === 0) || s.history.some(h => h.tiebreak));
  }
});

test('des centaines de parties de 3 à 6 joueurs se terminent sans erreur', () => {
  const levels = ['novice', 'adepte', 'maitre'];
  for (let g = 0; g < 36; g++) {
    const n = 3 + (g % 4);
    const players = Array.from({ length: n }, (_, i) => ({ name: 'P' + i, persona: PERSONAS[i % 5].key, level: levels[(g + i) % 3] }));
    const s = createGame({ players, seed: 100 + g, cycles: 1, powers: g % 3 !== 0, mystique: g % 5 !== 0 });
    const events = autoplay(s);
    assert.equal(events.filter(e => e.type === 'gameOver').length, 1);
    for (const p of s.players) assert.ok(p.lives >= 0 && p.lives <= 5);
  }
});

test('l’IA ne voit pas les cartes cachées et le Sensei conseille un pari autorisé', () => {
  const s = createGame({ players: TABLE4, rounds: [5], cycles: 1, dealer: 0, seed: 11 });
  act(s, { type: 'start' });
  const unseen = unseenFor(s, 1).map(c => c.id);
  for (const c of s.players[1].hand) assert.ok(!unseen.includes(c.id));
  for (const c of s.players[2].hand) assert.ok(unseen.includes(c.id));
  while (s.pending.pid !== 0) act(s, decide(s));
  const adv = adviseBet(s, 0);
  assert.ok(legalBets(s, 0).includes(adv.bet));
  assert.match(adv.text, /parie/);
  act(s, { type: 'bet', pid: 0, value: adv.bet });
  while (s.pending.type !== 'play' || s.pending.pid !== 0) act(s, decide(s));
  const play = advisePlay(s, 0);
  assert.ok(s.players[0].hand.some(c => c.id === play.cardId));
});

test('manche Mystique : chances calculées sur les cartes invisibles', () => {
  const s = scripted({ 0: ['n29'], 1: ['n8'], 2: ['n15'], 3: ['n12'] });
  const o = mysticOdds(s, 0);
  assert.equal(o.pool, 41 - 3);
  assert.equal(o.target.value, 15);
  assert.ok(o.pWin > 0.5);
});

test('chaque leçon se déroule selon son scénario quand on suit le Sensei', () => {
  for (const L of LESSONS.filter(l => !l.free)) {
    const s = createGame({ ...L.setup, seed: 5 });
    act(s, { type: 'start' });
    const fired = new Set();
    let guard = 0;
    while (s.phase !== 'gameOver') {
      if (++guard > 500) throw new Error(L.id + ' : boucle');
      const pend = s.pending;
      if (pend.type === 'next') { act(s, { type: 'next' }); continue; }
      const human = pend.pid === 0 || pend.type === 'reveal';
      const trick = s.trick ? s.trick.no : 0;
      const step = human && L.coach.find((c, i) => !fired.has(i) && c.on === pend.type && (c.trick == null || c.trick === trick) && (!c.when || c.when(s)) && fired.add(i));
      let action;
      if (human) {
        if (pend.type === 'bet') {
          const want = step && step.allowBets ? step.allowBets[0] : L.humanBet != null ? L.humanBet : adviseBet(s, 0).bet;
          action = { type: 'bet', pid: 0, value: legalBets(s, 0).includes(want) ? want : legalBets(s, 0)[0] };
        } else if (pend.type === 'play') {
          const id = step && step.allowCards ? step.allowCards[0] : advisePlay(s, 0).cardId;
          action = { type: 'play', pid: 0, cardId: id };
        } else if (pend.type === 'mysticValue') action = { type: 'mysticValue', pid: 0, value: step && step.allowValues ? step.allowValues[0] : 37 };
        else if (pend.type === 'target') action = { type: 'target', pid: 0, target: step && step.allowTargets ? step.allowTargets[0] : decide(s).target };
        else action = { type: 'reveal' };
      } else if (pend.type === 'bet' && L.aiBets && legalBets(s, pend.pid).includes(L.aiBets[pend.pid])) {
        action = { type: 'bet', pid: pend.pid, value: L.aiBets[pend.pid] };
      } else if (pend.type === 'play' && L.aiPlays) {
        const hand = s.players[pend.pid].hand;
        const id = L.aiPlays[pend.pid].find(c => hand.some(x => x.id === c));
        action = { type: 'play', pid: pend.pid, cardId: id };
      } else action = decide(s);
      act(s, action);
    }
    const res = L.success(s);
    assert.ok(res.ok, `${L.id} : ${res.text}`);
    for (const step of L.coach) {
      if (typeof step.say === 'function') assert.equal(typeof step.say(s), 'string');
    }
  }
});
