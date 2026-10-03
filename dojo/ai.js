/*
 * Initiation KYRAN — adversaires ordinateur et conseils du Bokonon (devin du Fa).
 *
 * Les adversaires ne trichent pas : ils ne voient que leur main, les cartes posées, les paris
 * et ce que la Clairvoyance leur a montré. Le niveau Maître simule des centaines de fins de
 * manche (Monte-Carlo) pour choisir pari et carte ; les mêmes calculs alimentent les conseils
 * expliqués au joueur.
 */
import { POWERS, handRank, legalBets, unseenFor, yetToPlay, bestPlay, cardLabel, colorOf } from './engine.js?v=617bc536b5';

export const PERSONAS = [
  { key: 'griot', name: 'Griot', emoji: '🪘', bias: 0, chaos: 0, motto: 'gardien des récits, il calcule et parie juste' },
  { key: 'amazone', name: 'Amazone', emoji: '⚔️', bias: 0.35, chaos: 0, motto: 'guerrière du Danxomè, elle vise toujours haut' },
  { key: 'cameleon', name: 'Caméléon', emoji: '🦎', bias: -0.1, chaos: 0.05, motto: 'rusé, il change de couleur et adore perdre exprès' },
  { key: 'anansi', name: 'Anansi', emoji: '🕷️', bias: 0, chaos: 0.2, motto: 'l’araignée des contes, imprévisible et bluffeuse' },
  { key: 'guerisseuse', name: 'Guérisseuse', emoji: '🌿', bias: -0.35, chaos: 0, motto: 'connaisseuse des plantes, prudente, elle parie bas' }
];

export const LEVELS = {
  novice: { label: 'Apprenti', sims: 0, mistake: 0.3, betNoise: 1 },
  adepte: { label: 'Initié', sims: 60, mistake: 0.08, betNoise: 0.35 },
  maitre: { label: 'Maître', sims: 220, mistake: 0, betNoise: 0 }
};

// ── Outils ─────────────────────────────────────────────────────────────────

const beats = (value, kind, best) =>
  !best || value > best.value || (value === best.value && kind !== 'number' && best.kind === 'number');

/** Probabilité qu'aucune des `m` cartes tirées parmi `u` (dont `h` plus fortes) ne batte la carte. */
export function noneHigher(u, h, m) {
  if (m <= 0) return 1;
  if (h <= 0) return 1;
  if (m > u - h) return 0;
  let p = 1;
  for (let i = 0; i < m; i++) p *= (u - h - i) / (u - i);
  return p;
}

/** Chance qu'une carte remporte un pli qu'elle ouvre, face aux cartes inconnues des adversaires. */
export function leadWinChance(card, unseen, othersCards) {
  if (card.kind === 'mystique') return 1;
  const r = handRank(card);
  const h = unseen.filter(c => handRank(c) > r).length;
  return noneHigher(unseen.length, h, othersCards);
}


/** Estimation rapide d'un pari à partir d'une main (pour les paris adverses inconnus). */
function quickBet(hand, unseenCount, othersCards) {
  let e = 0;
  for (const c of hand) {
    if (c.kind === 'mystique') { e += 0.5; continue; }
    const r = handRank(c);
    // Proportion approximative de cartes plus fortes dans le paquet (41 à 45 cartes)
    const h = Math.max(0, Math.round((37.5 - r) * unseenCount / 41));
    e += noneHigher(unseenCount, h, othersCards);
  }
  return Math.round(e);
}

// ── Politique heuristique (adversaires Initié/Apprenti et simulations) ─────

/**
 * Choisit une carte : renvoie { idx, value }. `best` = meilleure carte posée ({ value, kind }) ou null.
 */
export function heuristicPick(hand, need, best, after) {
  const left = hand.length;
  let mIdx = -1;
  const idxs = [];
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].kind === 'mystique') mIdx = i;
    else idxs.push(i);
  }
  idxs.sort((a, b) => handRank(hand[a]) - handRank(hand[b]));
  const lowest = idxs[0];
  const highest = idxs[idxs.length - 1];
  const M = v => ({ idx: mIdx, value: v });
  const N = i => ({ idx: i, value: hand[i].value });
  if (!idxs.length) return M(need > 0 ? 37 : 0);

  if (need <= 0) {
    if (best) {
      let under = -1;
      for (const i of idxs) if (!beats(hand[i].value, hand[i].kind, best)) under = i;
      if (under >= 0) return N(under);
      if (mIdx >= 0) return M(0);
      return N(lowest);
    }
    if (mIdx >= 0 && hand[lowest].value > 12) return M(0);
    return N(lowest);
  }
  if (need >= left) {
    if (mIdx >= 0) return M(37);
    return N(highest);
  }
  const ratio = need / left;
  if (best && after === 0) {
    for (const i of idxs) if (beats(hand[i].value, hand[i].kind, best)) return N(i);
    if (mIdx >= 0 && ratio >= 0.5) return M(37);
    return N(lowest);
  }
  if (!best) {
    if (ratio >= 0.5) {
      if (hand[highest].value >= 28) return N(highest);
      if (mIdx >= 0) return M(37);
      return N(highest);
    }
    if (hand[highest].value >= 33 && ratio >= 0.34) return N(highest);
    return N(lowest);
  }
  if (ratio >= 0.4) {
    for (const i of idxs) if (hand[i].value >= 27 && beats(hand[i].value, hand[i].kind, best)) return N(i);
    if (mIdx >= 0 && ratio >= 0.6) return M(37);
  }
  return N(lowest);
}

// ── Simulation Monte-Carlo ─────────────────────────────────────────────────

/** Distribue au hasard les cartes inconnues aux adversaires (en respectant la Clairvoyance). */
function determinize(state, pid, rng) {
  const r = state.round;
  const me = state.players[pid];
  const unseen = unseenFor(state, pid);
  const known = new Map();
  for (const pk of me.peeks) {
    if (unseen.some(c => c.id === pk.card.id)) known.set(pk.card.id, pk.target);
  }
  const pool = unseen.filter(c => !known.has(c.id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const hands = [];
  for (const id of r.participants) {
    if (id === pid) { hands[id] = me.hand.slice(); continue; }
    const size = state.players[id].hand.length;
    const h = [];
    for (const [cid, t] of known) if (t === id && h.length < size) h.push(unseen.find(c => c.id === cid));
    while (h.length < size) h.push(pool.pop());
    hands[id] = h;
  }
  return { hands, unseenCount: unseen.length };
}

/** Joue la fin de manche ; `first` impose la première décision de `pid`. Renvoie les plis finaux. */
function rollout(state, pid, hands, bets, first) {
  const r = state.round;
  const ring = r.participants;
  const tricks = [];
  for (const id of ring) tricks[id] = state.players[id].tricks;
  let plays = [];
  let toPlay;
  if (state.trick) {
    plays = state.trick.plays.map(p => ({ pid: p.pid, value: p.value == null ? 0 : p.value, kind: p.card.kind }));
    toPlay = state.trick.order.filter(id => !state.trick.plays.some(p => p.pid === id));
  } else {
    toPlay = r.betOrder.slice();
  }
  let pending = first;
  for (let guard = 0; guard < 20; guard++) {
    while (toPlay.length) {
      const id = toPlay.shift();
      const hand = hands[id];
      if (!hand.length) continue;
      let best = null;
      for (const p of plays) if (beats(p.value, p.kind, best)) best = p;
      let choice;
      if (pending && id === pid) { choice = pending; pending = null; }
      else choice = heuristicPick(hand, bets[id] - tricks[id], best, toPlay.length);
      const card = hand[choice.idx];
      hand.splice(choice.idx, 1);
      plays.push({ pid: id, value: choice.value, kind: card.kind });
    }
    let win = null;
    for (const p of plays) if (beats(p.value, p.kind, win)) win = p;
    tricks[win.pid]++;
    if (!ring.some(id => hands[id].length)) break;
    plays = [];
    const k = ring.indexOf(win.pid);
    toPlay = ring.slice(k).concat(ring.slice(0, k));
  }
  return tricks;
}

function makeSimRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function currentBets(state, pid, hands, unseenCount, myBet) {
  const r = state.round;
  const bets = [];
  const others = r.participants.length - 1;
  for (const id of r.participants) {
    if (id === pid) bets[id] = myBet;
    else if (state.players[id].bet != null) bets[id] = state.players[id].bet;
    else bets[id] = quickBet(hands[id], unseenCount, r.cards * others);
  }
  return bets;
}

/**
 * Évalue chaque pari possible : vies perdues moyennes et chance de pari exact.
 * Renvoie [{ bet, loss, exact, legal }].
 */
export function evaluateBets(state, pid, sims = 200, seed = 1) {
  const r = state.round;
  const rng = makeSimRng(seed + r.no * 977 + pid * 131);
  const legal = legalBets(state, pid);
  const out = [];
  for (let b = 0; b <= r.cards; b++) out.push({ bet: b, loss: 0, exact: 0, legal: legal.includes(b) });
  for (let s = 0; s < sims; s++) {
    const det = determinize(state, pid, rng);
    for (const o of out) {
      const hands = det.hands.map(h => (h ? h.slice() : h));
      const bets = currentBets(state, pid, hands, det.unseenCount, o.bet);
      const tricks = rollout(state, pid, hands, bets, null);
      const d = Math.abs(tricks[pid] - o.bet);
      o.loss += d;
      if (d === 0) o.exact++;
    }
  }
  for (const o of out) { o.loss /= sims; o.exact /= sims; }
  return out;
}

/** Coups possibles (la Mystique compte deux fois : 0 et 37). */
export function candidateMoves(hand) {
  const moves = [];
  hand.forEach((c, idx) => {
    if (c.kind === 'mystique') {
      moves.push({ idx, cardId: c.id, value: 0 });
      moves.push({ idx, cardId: c.id, value: 37 });
    } else moves.push({ idx, cardId: c.id, value: c.value });
  });
  return moves;
}

/** Évalue chaque carte jouable : vies perdues moyennes et chance de réussir son pari. */
export function evaluateMoves(state, pid, sims = 160, seed = 1) {
  const r = state.round;
  const me = state.players[pid];
  const rng = makeSimRng(seed + r.no * 7919 + r.trickNo * 104729 + pid * 13 + (state.trick ? state.trick.plays.length : 0));
  const moves = candidateMoves(me.hand).map(m => ({ ...m, loss: 0, exact: 0 }));
  for (let s = 0; s < sims; s++) {
    const det = determinize(state, pid, rng);
    const bets = [];
    for (const id of r.participants) bets[id] = state.players[id].bet;
    for (const m of moves) {
      const hands = det.hands.map(h => (h ? h.slice() : h));
      const tricks = rollout(state, pid, hands, bets, { idx: m.idx, value: m.value });
      const d = Math.abs(tricks[pid] - me.bet);
      m.loss += d;
      if (d === 0) m.exact++;
    }
  }
  for (const m of moves) { m.loss /= sims; m.exact /= sims; }
  return moves;
}

// ── Manche Mystique : pari à l'aveugle ─────────────────────────────────────

/** Chance que la carte invisible de `pid` remporte le pli, d'après les cartes visibles. */
export function mysticOdds(state, pid) {
  const r = state.round;
  const visible = [];
  let mysticHolder = null;
  for (const id of r.participants) {
    if (id === pid) continue;
    const c = state.players[id].hand[0];
    if (c.kind === 'mystique') mysticHolder = id;
    else visible.push({ pid: id, card: c });
  }
  const pool = unseenFor(state, pid);
  let target = null;
  for (const v of visible) if (!target || beats(v.card.value, v.card.kind, target)) target = { value: v.card.value, kind: v.card.kind };
  let mysticNote = null;
  if (mysticHolder != null) {
    const b = state.players[mysticHolder].bet;
    if (b === 1) { target = { value: 37, kind: 'mystique' }; mysticNote = 'win'; }
    else if (b === 0) mysticNote = 'lose';
    else mysticNote = 'unknown';
  }
  const mine = pool.filter(c => c.kind !== 'mystique');
  const hasM = pool.some(c => c.kind === 'mystique');
  let higher = mine.filter(c => beats(c.value, c.kind, target)).length;
  let pWin = pool.length ? higher / pool.length : 0;
  // Mystique adverse dont le pari est inconnu : on la suppose gagnante une fois sur deux
  if (mysticNote === 'unknown') pWin *= 0.5;
  const pM = hasM && pool.length ? 1 / pool.length : 0;
  return { pool: pool.length, higher, pWin, pMystique: pM, target, mysticHolder, mysticNote, visible };
}

// ── Choix des adversaires ──────────────────────────────────────────────────

function personaOf(player) {
  return PERSONAS.find(p => p.key === player.persona) || PERSONAS[0];
}

function levelOf(player) {
  return LEVELS[player.level] || LEVELS.adepte;
}

/** Décision d'un adversaire ordinateur pour la décision en attente. */
export function decide(state, rng = Math.random) {
  const pend = state.pending;
  if (pend.type === 'reveal') return { type: 'reveal' };
  if (pend.type === 'next') return { type: 'next' };
  const pid = pend.pid;
  const p = state.players[pid];
  const lvl = levelOf(p);
  const persona = personaOf(p);
  const chaos = persona.chaos + lvl.mistake;

  if (pend.type === 'bet') {
    const legal = legalBets(state, pid);
    if (state.round.mystic) {
      const o = mysticOdds(state, pid);
      let want = o.pWin + persona.bias * 0.3 >= 0.5 ? 1 : 0;
      if (rng() < chaos * 0.5) want = 1 - want;
      return { type: 'bet', pid, value: legal.includes(want) ? want : legal[0] };
    }
    let value;
    if (!lvl.sims) {
      const unseen = unseenFor(state, pid);
      const others = (state.round.participants.length - 1) * state.round.cards;
      const e = p.hand.reduce((s, c) => s + leadWinChance(c, unseen, others), 0);
      value = Math.round(e + persona.bias + (rng() * 2 - 1) * lvl.betNoise);
    } else {
      const evals = evaluateBets(state, pid, lvl.sims, Math.floor(rng() * 1e6));
      let best = null;
      for (const e of evals) {
        if (!e.legal) continue;
        const score = -e.loss + e.exact * 0.15 + persona.bias * 0.12 * e.bet + (rng() - 0.5) * lvl.betNoise * 0.3;
        if (!best || score > best.score) best = { bet: e.bet, score };
      }
      value = best.bet;
    }
    value = Math.max(0, Math.min(state.round.cards, value));
    if (!legal.includes(value)) {
      value = legal.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a), legal[0]);
    }
    return { type: 'bet', pid, value };
  }

  if (pend.type === 'play') {
    const hand = p.hand;
    let move;
    if (rng() < chaos) {
      const moves = candidateMoves(hand);
      move = moves[Math.floor(rng() * moves.length)];
    } else if (lvl.sims >= 100) {
      const evals = evaluateMoves(state, pid, Math.round(lvl.sims * 0.7), Math.floor(rng() * 1e6));
      move = evals.reduce((a, b) => (b.loss < a.loss - 1e-9 || (Math.abs(b.loss - a.loss) < 1e-9 && b.exact > a.exact) ? b : a));
    } else {
      const best = currentBest(state);
      const after = yetToPlay(state, pid).length;
      const pick = heuristicPick(hand, p.bet - p.tricks, best, after);
      move = { cardId: hand[pick.idx].id, value: pick.value };
    }
    const card = hand.find(c => c.id === move.cardId);
    return { type: 'play', pid, cardId: move.cardId, mysticValue: card.kind === 'mystique' ? move.value : undefined };
  }

  if (pend.type === 'mysticValue') {
    return { type: 'mysticValue', pid, value: p.bet - p.tricks > 0 ? 37 : 0 };
  }

  if (pend.type === 'target') {
    return { type: 'target', pid, target: chooseTarget(state, pid, pend).target };
  }
  throw new Error('Décision inconnue : ' + pend.type);
}

function currentBest(state) {
  if (!state.trick) return null;
  const b = bestPlay(state.trick.plays);
  return b ? { value: b.value, kind: b.card.kind } : null;
}

/** Cible d'un pouvoir + explication. */
export function chooseTarget(state, pid, pend) {
  const me = state.players[pid];
  const wantWin = me.bet - me.tricks > 0;
  const needOf = id => state.players[id].bet - state.players[id].tricks;
  const name = id => state.players[id].name;
  const opts = pend.options;
  const byNeed = (desc) => opts.slice().sort((a, b) => (desc ? needOf(b) - needOf(a) : needOf(a) - needOf(b)))[0];

  if (pend.power === 'voile') {
    const mine = state.trick.plays.find(pl => pl.pid === pid);
    const others = state.trick.plays.filter(pl => opts.includes(pl.pid));
    if (wantWin) {
      const top = others.reduce((a, b) => (b.value > a.value ? b : a));
      if (top.value > mine.value) return { target: top.pid, why: `Tu veux ce pli : prends la valeur ${top.value} de ${name(top.pid)}.` };
      return { target: null, why: 'Aucune carte posée ne vaut plus que la tienne : garde ta valeur.' };
    }
    const low = others.reduce((a, b) => (b.value < a.value ? b : a));
    if (low.value < mine.value) return { target: low.pid, why: `Tu veux perdre ce pli : échange avec le ${low.value} de ${name(low.pid)}.` };
    return { target: null, why: 'Ta valeur est déjà la plus basse : n’échange pas.' };
  }
  if (pend.power === 'clairvoyance') {
    const toPlay = yetToPlay(state, pid).filter(id => opts.includes(id));
    const t = toPlay.length ? toPlay[0] : byNeed(true);
    return { target: t, why: toPlay.length ? `${name(t)} joue juste après toi : découvre sa meilleure carte.` : `${name(t)} vise encore des plis : découvre sa meilleure carte.` };
  }
  if (pend.power === 'benediction') {
    if (wantWin) {
      const t = byNeed(true);
      return { target: t, why: `${name(t)} cherche des plis : impose-lui de jouer sa plus faible carte maintenant.` };
    }
    const t = byNeed(false);
    return { target: t, why: `${name(t)} joue déjà petit : sa plus faible carte change peu le pli.` };
  }
  // Sceau du Destin : carte tirée au hasard
  if (wantWin) {
    const t = byNeed(true);
    return { target: t, why: `${name(t)} veut gagner des plis : une carte au hasard brouille ses plans.` };
  }
  const t = byNeed(false);
  return { target: t, why: `${name(t)} veut jouer petit : une carte au hasard peut te passer au-dessus.` };
}

// ── Conseils du Bokonon ────────────────────────────────────────────────────

const pct = x => Math.round(x * 100) + ' %';

function strengthWord(p) {
  if (p >= 0.8) return 'quasi sûre';
  if (p >= 0.55) return 'forte';
  if (p >= 0.3) return 'incertaine';
  if (p >= 0.1) return 'faible';
  return 'perdante';
}

export function cardShort(card) {
  if (card.kind === 'mystique') return 'Mystique';
  if (card.kind === 'power') return POWERS[card.power].name.split(' ')[0] + ' ' + card.value;
  return String(card.value);
}

/** Force de chaque carte de la main (chance de gagner un pli qu'elle ouvre). */
export function handStrengths(state, pid) {
  const r = state.round;
  const unseen = unseenFor(state, pid);
  const others = r.participants.filter(id => id !== pid).reduce((s, id) => s + state.players[id].hand.length, 0);
  return state.players[pid].hand.map(c => ({ card: c, p: leadWinChance(c, unseen, others) }));
}

/** Conseil de pari : { bet, evals, text }. */
export function adviseBet(state, pid) {
  const r = state.round;
  if (r.mystic) {
    const o = mysticOdds(state, pid);
    const legal = legalBets(state, pid);
    let bet = o.pWin >= 0.5 ? 1 : 0;
    let text;
    const targetTxt = o.target ? (o.target.kind === 'mystique' ? 'la Mystique jouée à 37' : 'le ' + o.target.value) : 'rien';
    if (o.mysticNote === 'win') text = 'La Mystique adverse vaudra 37 (son porteur a parié 1) : personne ne peut la battre. Parie 0.';
    else {
      text = `Carte à battre : ${targetTxt}. Ta carte est l’une des ${o.pool} cartes que tu ne vois pas ; ${o.higher} la battent, soit ${pct(o.pWin)} de chances de gagner.`;
      if (o.mysticNote === 'unknown') text += ' La Mystique adverse peut encore valoir 37 : prudence.';
      text += bet ? ' Parie 1.' : ' Parie 0.';
    }
    if (!legal.includes(bet)) {
      text += ` Mais la règle d’or t’interdit ${bet} : tu dois annoncer ${legal[0]}.`;
      bet = legal[0];
    }
    if (o.pMystique) text += ' Et si c’est la Mystique sur ton front, ton pari sera réussi quoi qu’il arrive.';
    return { bet, text, odds: o };
  }
  const evals = evaluateBets(state, pid, 260, 4242);
  const legalEvals = evals.filter(e => e.legal);
  const best = legalEvals.reduce((a, b) => (b.loss < a.loss - 1e-9 || (Math.abs(b.loss - a.loss) < 1e-9 && b.exact > a.exact) ? b : a));
  const strengths = handStrengths(state, pid).slice().sort((a, b) => handRank(b.card) - handRank(a.card));
  const parts = strengths.map(s => {
    if (s.card.kind === 'mystique') return '<b>Mystique</b> (joker : 1 pli si tu veux)';
    return `<b>${cardShort(s.card)}</b> ${strengthWord(s.p)}`;
  });
  let text = `Ta main : ${parts.join(', ')}. J’ai consulté le Fa et simulé la manche : <b>parie ${best.bet}</b> (pari exact ${pct(best.exact)}).`;
  const top = evals.reduce((a, b) => (b.loss < a.loss ? b : a));
  if (!top.legal) text += ` Sans la règle d’or, ${top.bet} aurait été idéal.`;
  return { bet: best.bet, evals, strengths, text };
}

/** Conseil de jeu : { cardId, value, evals, text }. */
export function advisePlay(state, pid) {
  const me = state.players[pid];
  const need = me.bet - me.tricks;
  const evals = evaluateMoves(state, pid, 200, 777);
  const best = evals.reduce((a, b) => (b.loss < a.loss - 1e-9 || (Math.abs(b.loss - a.loss) < 1e-9 && b.exact > a.exact) ? b : a));
  const card = me.hand.find(c => c.id === best.cardId);
  const table = currentBest(state);
  const after = yetToPlay(state, pid).length;
  const label = card.kind === 'mystique' ? `la Mystique à ${best.value}` : cardLabel(card);
  let why;
  if (need <= 0) {
    why = need < 0
      ? `Tu as déjà dépassé ton pari : évite tout nouveau pli.`
      : `Ton compte est bon (${me.tricks}/${me.bet}) : il faut perdre tous les plis restants.`;
    if (card.kind === 'mystique') why += ' La Mystique jouée à 0 perd à coup sûr.';
    else if (table && !beats(best.value, card.kind, table)) why += ` ${cap(label)} passe sous le ${table.value} : tu te débarrasses d’une carte dangereuse sans prendre le pli.`;
    else why += ` Joue ${label}, ta carte la moins risquée.`;
  } else if (need >= me.hand.length) {
    why = `Il te faut encore ${need} pli${need > 1 ? 's' : ''} sur ${me.hand.length} : chaque carte doit gagner. Joue ${label}.`;
  } else if (table && beats(best.value, card.kind, table)) {
    why = after === 0
      ? `Tu joues en dernier : ${label} suffit pour battre le ${table.value}. Garde tes cartes plus fortes.`
      : `${cap(label)} bat le ${table.value} ; il reste ${after} joueur${after > 1 ? 's' : ''} après toi.`;
  } else if (table) {
    why = `Tu cherches encore ${need} pli${need > 1 ? 's' : ''}, mais celui-ci est mal parti : sacrifie ${label} et garde tes atouts.`;
  } else {
    why = best.value >= 25 || card.kind === 'mystique'
      ? `Tu ouvres : ${label} a de bonnes chances de tenir le pli.`
      : `Tu ouvres : ${label} ne coûte pas grand-chose, garde tes fortes pour plus tard.`;
  }
  if (card.kind === 'power') why += ' ' + powerTip(state, pid, card.power);
  return { cardId: best.cardId, value: best.value, evals, text: why + ` (réussite simulée : ${pct(best.exact)})` };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Rappel de l'effet d'un pouvoir selon la position dans le pli. */
export function powerTip(state, pid, power) {
  const def = POWERS[power];
  const toPlay = yetToPlay(state, pid).length;
  const plays = state.trick ? state.trick.plays.length : 0;
  if (def.cancel === 'last' && toPlay === 0) return `Attention : tu joues en dernier, l’effet du ${def.name} sera annulé.`;
  if (def.cancel === 'first' && plays === 0) return `Attention : tu ouvres le pli, l’effet du ${def.name} sera annulé.`;
  return `Effet : ${def.text}`;
}

/** Conseil de valeur pour la Mystique. */
export function adviseMystic(state, pid) {
  const me = state.players[pid];
  const need = me.bet - me.tricks;
  if (need > 0) return { value: 37, text: `Il te manque ${need} pli${need > 1 ? 's' : ''} : joue-la à 37, elle prend le pli (sauf Voile du Néant).` };
  return { value: 0, text: 'Ton compte est bon : joue-la à 0, elle perd à coup sûr.' };
}

export function colorName(card) {
  return card.kind === 'number' ? colorOf(card.value).name : null;
}

