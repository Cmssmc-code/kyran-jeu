/*
 * Dojo KYRAN — moteur de règles (sans DOM).
 *
 * Applique les règles officielles de regle.html : paris avec règle d'or, plis, cartes Pouvoir,
 * carte Mystique (0 ou 37), manche Mystique à l'aveugle, perte de Vies, fin de partie à la
 * première élimination et départage des ex æquo par une ultime manche Mystique.
 *
 * Machine à états : l'état expose une décision en attente (state.pending) ; l'interface et l'IA
 * répondent avec act(state, action), qui renvoie la liste des événements produits (pour animer).
 */

export const POWERS = {
  clairvoyance: {
    key: 'clairvoyance',
    name: 'Clairvoyance Antique',
    values: [11, 23],
    cancel: null,
    text: 'Regarde secrètement la carte la plus forte du joueur de ton choix.'
  },
  sceau: {
    key: 'sceau',
    name: 'Sceau du Destin',
    values: [27, 4],
    cancel: 'last',
    text: 'Pioche une carte au hasard dans la main d’un joueur, qu’il doit jouer immédiatement.'
  },
  benediction: {
    key: 'benediction',
    name: 'Bénédiction des Ancêtres',
    values: [20, 9],
    cancel: 'last',
    text: 'Cible un joueur qui doit immédiatement jouer sa carte la plus faible.'
  },
  voile: {
    key: 'voile',
    name: 'Voile du Néant',
    values: [3, 34],
    cancel: 'first',
    text: 'Échange, si tu le souhaites, la valeur de ta carte avec une carte déjà posée par un adversaire.'
  }
};

export const DEFAULT_ROUNDS = [7, 6, 5, 4, 3, 2, 1];

const COLORS = [
  { max: 6, name: 'mauve', hex: '#a78bfa' },
  { max: 12, name: 'bleu', hex: '#60a5fa' },
  { max: 18, name: 'vert', hex: '#4ade80' },
  { max: 24, name: 'jaune', hex: '#facc15' },
  { max: 30, name: 'orange', hex: '#fb923c' },
  { max: 36, name: 'rouge', hex: '#f87171' }
];

/** Couleur d'une carte Nombre (repère visuel des cartes physiques). */
export function colorOf(value) {
  return COLORS.find(c => value <= c.max) || COLORS[COLORS.length - 1];
}

// ── Cartes ─────────────────────────────────────────────────────────────────

export function numberCard(v) {
  return { id: 'n' + v, kind: 'number', value: v };
}

export function mystiqueCard() {
  return { id: 'm', kind: 'mystique', value: 37 };
}

export function powerCard(key, v) {
  return { id: 'p' + v, kind: 'power', power: key, value: v };
}

/** Carte à partir de son identifiant ('n17', 'p27', 'm'). */
export function cardById(id) {
  if (id === 'm') return mystiqueCard();
  const v = Number(id.slice(1));
  if (id[0] === 'n' && v >= 1 && v <= 36) return numberCard(v);
  if (id[0] === 'p') {
    const def = Object.values(POWERS).find(p => p.values.includes(v));
    if (def) return powerCard(def.key, v);
  }
  throw new Error('Carte inconnue : ' + id);
}

/** Nom lisible d'une carte. */
export function cardLabel(card) {
  if (card.kind === 'mystique') return 'la Mystique';
  if (card.kind === 'power') return POWERS[card.power].name + ' (' + card.value + ')';
  return 'le ' + card.value;
}

/**
 * Rang d'une carte en main : la Mystique est la plus forte du jeu, une carte Pouvoir bat la
 * carte Nombre de même valeur. Sert à la Clairvoyance (« la plus forte ») et à la Bénédiction
 * (« la plus faible »).
 */
export function handRank(card) {
  if (card.kind === 'mystique') return 37.5;
  return card.value + (card.kind === 'power' ? 0.5 : 0);
}

/** Paquet de la partie : cartes Pouvoir selon le nombre de joueurs (règle officielle). */
export function buildDeck({ playerCount = 4, powers = true, mystique = true } = {}) {
  const deck = [];
  for (let v = 1; v <= 36; v++) deck.push(numberCard(v));
  if (mystique) deck.push(mystiqueCard());
  if (powers) {
    for (const def of Object.values(POWERS)) {
      // 3 et 4 joueurs : une carte par pouvoir (11, 27, 20, 3) ; 5 et 6 joueurs : toutes.
      const values = playerCount >= 5 ? def.values : [def.values[0]];
      for (const v of values) deck.push(powerCard(def.key, v));
    }
  }
  return deck;
}

// ── Hasard reproductible ───────────────────────────────────────────────────

export function makeRng(seed) {
  let a = (seed >>> 0) || 0x9e3779b9;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Partie ─────────────────────────────────────────────────────────────────

/**
 * Crée une partie.
 * opts.players : [{ name, human?, persona?, level? }] (3 à 6, dans le sens des aiguilles d'une montre)
 * opts.lives (5), opts.rounds ([7..1]), opts.cycles (Infinity), opts.powers, opts.mystique,
 * opts.goldenRule, opts.dealer (index ; hasard sinon), opts.seed, opts.deals ({ [roundNo]: { hands } }),
 * opts.noLifeLoss (leçons sans enjeu).
 */
export function createGame(opts) {
  const o = {
    lives: 5,
    rounds: DEFAULT_ROUNDS,
    cycles: Infinity,
    powers: true,
    mystique: true,
    goldenRule: true,
    noLifeLoss: false,
    deals: {},
    seed: (Math.random() * 2 ** 32) >>> 0,
    ...opts
  };
  const n = o.players.length;
  if (n < 2 || n > 6) throw new Error('Une partie se joue de 3 à 6 joueurs');
  const rng = makeRng(o.seed);
  const deckTemplate = buildDeck({ playerCount: Math.max(n, 3), powers: o.powers, mystique: o.mystique });
  // Sans cartes Pouvoir, le paquet ne suffit pas toujours pour 7 cartes chacun : on retire les
  // manches trop longues (ex. 6 joueurs et 37 cartes : la partie commence à 6 cartes).
  const maxCards = Math.floor(deckTemplate.length / n);
  if (o.rounds.some(c => c > maxCards)) o.rounds = o.rounds.filter(c => c <= maxCards);
  const state = {
    opts: o,
    rng,
    deckTemplate,
    players: o.players.map((p, i) => ({
      id: i,
      name: p.name,
      human: !!p.human,
      persona: p.persona || null,
      level: p.level || null,
      lives: o.lives,
      hand: [],
      bet: null,
      tricks: 0,
      peeks: [],
      stats: { bets: 0, exact: 0 }
    })),
    roundNo: -1,
    dealer: o.dealer != null ? o.dealer : Math.floor(rng() * n),
    phase: 'idle',
    pending: null,
    round: null,
    trick: null,
    history: [],
    tiebreak: null,
    winners: null
  };
  return state;
}

const next = (state, from, ids) => {
  const n = state.players.length;
  for (let k = 1; k <= n; k++) {
    const id = (from + k) % n;
    if (ids.includes(id)) return id;
  }
  return from;
};

/** Ordre de parole à partir du joueur à gauche de `from`, `from` en dernier. */
function orderAfter(state, from, ids) {
  const n = state.players.length;
  const out = [];
  for (let k = 1; k <= n; k++) {
    const id = (from + k) % n;
    if (ids.includes(id)) out.push(id);
  }
  return out;
}

/** Ordre de jeu à partir de `leader` inclus. */
function orderFrom(state, leader, ids) {
  const n = state.players.length;
  const out = [];
  for (let k = 0; k < n; k++) {
    const id = (leader + k) % n;
    if (ids.includes(id)) out.push(id);
  }
  return out;
}

/** Nombre de cartes de la manche numéro `no` (cycle 7 → 2 puis manche Mystique). */
export function cardsForRound(opts, no) {
  return opts.rounds[no % opts.rounds.length];
}

/** Distribue la manche suivante. Renvoie les événements. */
export function startRound(state) {
  const events = [];
  const all = state.players.map(p => p.id);
  const participants = state.tiebreak ? state.tiebreak.slice() : all;
  state.roundNo++;
  if (state.roundNo > 0) state.dealer = next(state, state.dealer, all);
  const cards = state.tiebreak ? 1 : cardsForRound(state.opts, state.roundNo);
  const mystic = cards === 1;

  const deck = shuffle(state.deckTemplate.map(c => ({ ...c })), state.rng);
  const script = state.opts.deals[state.roundNo] || null;
  if (script && script.dealer != null) state.dealer = script.dealer;

  for (const p of state.players) {
    p.hand = [];
    p.bet = null;
    p.tricks = 0;
    p.peeks = [];
  }
  // Mains imposées (leçons) puis distribution du reste
  if (script && script.hands) {
    for (const [pid, ids] of Object.entries(script.hands)) {
      for (const id of ids) {
        const idx = deck.findIndex(c => c.id === id);
        if (idx < 0) throw new Error('Carte imposée absente du paquet : ' + id);
        state.players[pid].hand.push(deck.splice(idx, 1)[0]);
      }
    }
  }
  for (const pid of participants) {
    const p = state.players[pid];
    while (p.hand.length < cards) p.hand.push(deck.pop());
    p.hand.sort((a, b) => handRank(a) - handRank(b));
  }

  const betOrder = orderAfter(state, state.dealer, participants);
  state.round = {
    no: state.roundNo,
    cards,
    mystic,
    tiebreak: !!state.tiebreak,
    participants,
    dealer: state.dealer,
    betOrder,
    betIdx: 0,
    trickNo: 0,
    played: [],
    undealt: deck
  };
  state.trick = null;
  state.phase = 'bet';
  state.pending = { type: 'bet', pid: betOrder[0] };
  events.push({ type: 'roundStart', roundNo: state.roundNo, cards, mystic, dealer: state.dealer, tiebreak: !!state.tiebreak });
  return events;
}

/** Paris autorisés pour `pid` (règle d'or pour le dernier à parler). */
export function legalBets(state, pid) {
  const r = state.round;
  const bets = [];
  for (let b = 0; b <= r.cards; b++) bets.push(b);
  if (!state.opts.goldenRule) return bets;
  const isLast = r.betOrder[r.betOrder.length - 1] === pid;
  if (!isLast || r.betOrder.length < 2) return bets;
  const sum = r.betOrder.reduce((s, id) => s + (id === pid ? 0 : state.players[id].bet || 0), 0);
  const forbidden = r.cards - sum;
  return bets.filter(b => b !== forbidden);
}

/** Pari interdit par la règle d'or pour `pid` (ou null). */
export function forbiddenBet(state, pid) {
  const legal = legalBets(state, pid);
  for (let b = 0; b <= state.round.cards; b++) if (!legal.includes(b)) return b;
  return null;
}

function startTrick(state, leader, events) {
  const r = state.round;
  r.trickNo++;
  state.trick = { no: r.trickNo, leader, order: orderFrom(state, leader, r.participants), plays: [] };
  events.push({ type: 'trickStart', trickNo: r.trickNo, leader });
  advance(state, events);
}

const hasPlayed = (state, pid) => state.trick.plays.some(p => p.pid === pid);

/** Joueurs qui n'ont pas encore posé de carte dans le pli en cours. */
export function yetToPlay(state, exceptPid) {
  if (!state.trick) return [];
  return state.trick.order.filter(id => id !== exceptPid && !hasPlayed(state, id));
}

function advance(state, events) {
  const nextPid = state.trick.order.find(id => !hasPlayed(state, id));
  if (nextPid == null) return resolveTrick(state, events);
  state.pending = { type: 'play', pid: nextPid };
}

/** Meilleure carte d'une liste de poses : valeur, puis Pouvoir/Mystique sur Nombre, puis antériorité. */
export function bestPlay(plays) {
  let best = null;
  for (const p of plays) {
    if (p.value == null) continue;
    if (!best) { best = p; continue; }
    if (p.value > best.value) best = p;
    else if (p.value === best.value && p.card.kind !== 'number' && best.card.kind === 'number') best = p;
  }
  return best;
}

function resolveTrick(state, events) {
  const r = state.round;
  const t = state.trick;
  const win = bestPlay(t.plays);
  state.players[win.pid].tricks++;
  r.played.push(...t.plays.map(p => p.card));
  events.push({ type: 'trickWon', pid: win.pid, trickNo: t.no, card: win.card, value: win.value, plays: t.plays.map(p => ({ ...p })) });
  const remaining = r.participants.some(id => state.players[id].hand.length > 0);
  if (remaining) startTrick(state, win.pid, events);
  else endRound(state, events);
}

function placeCard(state, pid, card, forced, events, mysticValue) {
  const play = { pid, card, value: card.kind === 'mystique' ? null : card.value, forced: !!forced, order: state.trick.plays.length };
  state.trick.plays.push(play);
  events.push({ type: 'play', pid, card, forced: !!forced, value: play.value });
  if (card.kind === 'mystique') {
    if (mysticValue === 0 || mysticValue === 37) return setMysticValue(state, pid, mysticValue, events);
    state.pending = { type: 'mysticValue', pid };
    return;
  }
  afterPlace(state, play, events);
}

function setMysticValue(state, pid, value, events) {
  const play = state.trick.plays.find(p => p.pid === pid);
  play.value = value;
  events.push({ type: 'mysticValue', pid, value });
  afterPlace(state, play, events);
}

/** Cibles possibles d'un pouvoir pour le joueur `pid` (null = effet annulé). */
export function powerOptions(state, pid, power) {
  const def = POWERS[power];
  const t = state.trick;
  const toPlay = yetToPlay(state, pid);
  if (def.cancel === 'last' && toPlay.length === 0) return null;
  if (def.cancel === 'first' && t.plays.length <= 1) return null;
  if (power === 'sceau' || power === 'benediction') return toPlay;
  if (power === 'clairvoyance') return state.round.participants.filter(id => id !== pid && state.players[id].hand.length > 0);
  if (power === 'voile') return t.plays.filter(p => p.pid !== pid).map(p => p.pid);
  return [];
}

function afterPlace(state, play, events) {
  if (play.card.kind === 'power' && !state.round.mystic) {
    const power = play.card.power;
    const options = powerOptions(state, play.pid, power);
    if (options === null) {
      events.push({ type: 'powerCancelled', pid: play.pid, power, reason: POWERS[power].cancel });
    } else if (options.length === 0) {
      events.push({ type: 'powerNoTarget', pid: play.pid, power });
    } else {
      state.pending = { type: 'target', pid: play.pid, power, options, optional: power === 'voile' };
      return;
    }
  }
  advance(state, events);
}

function applyTarget(state, pid, power, target, events) {
  if (power === 'voile') {
    if (target == null) {
      events.push({ type: 'powerDeclined', pid, power });
      return advance(state, events);
    }
    const mine = state.trick.plays.find(p => p.pid === pid);
    const theirs = state.trick.plays.find(p => p.pid === target);
    const a = mine.value;
    mine.value = theirs.value;
    theirs.value = a;
    events.push({ type: 'swap', pid, target, mine: mine.value, theirs: theirs.value, mineCard: mine.card, theirsCard: theirs.card });
    return advance(state, events);
  }
  const victim = state.players[target];
  if (power === 'clairvoyance') {
    const best = victim.hand.reduce((b, c) => (handRank(c) > handRank(b) ? c : b), victim.hand[0]);
    state.players[pid].peeks.push({ target, card: best });
    events.push({ type: 'peek', pid, target, card: best });
    return advance(state, events);
  }
  let idx;
  if (power === 'sceau') idx = Math.floor(state.rng() * victim.hand.length);
  else {
    idx = 0;
    victim.hand.forEach((c, i) => { if (handRank(c) < handRank(victim.hand[idx])) idx = i; });
  }
  const card = victim.hand.splice(idx, 1)[0];
  events.push({ type: 'force', pid, power, target, card });
  placeCard(state, target, card, true, events);
}

function reveal(state, events) {
  const r = state.round;
  const order = orderAfter(state, r.dealer, r.participants);
  r.trickNo = 1;
  state.trick = { no: 1, leader: order[0], order, plays: [] };
  for (const pid of order) {
    const p = state.players[pid];
    const card = p.hand.pop();
    const value = card.kind === 'mystique' ? (p.bet === 1 ? 37 : 0) : card.value;
    state.trick.plays.push({ pid, card, value, forced: false, order: state.trick.plays.length });
  }
  events.push({ type: 'reveal', plays: state.trick.plays.map(p => ({ ...p })) });
  resolveTrick(state, events);
}

function endRound(state, events) {
  const r = state.round;
  const results = r.participants.map(id => {
    const p = state.players[id];
    const diff = Math.abs(p.bet - p.tricks);
    const lost = state.opts.noLifeLoss ? 0 : Math.min(diff, p.lives);
    p.lives -= lost;
    p.stats.bets++;
    if (diff === 0) p.stats.exact++;
    return { pid: id, bet: p.bet, tricks: p.tricks, diff, lost, lives: p.lives };
  });
  state.history.push({ roundNo: r.no, cards: r.cards, mystic: r.mystic, tiebreak: r.tiebreak, results });
  events.push({ type: 'roundEnd', roundNo: r.no, results });

  let over = false;
  let tied = null;
  const ids = state.players.map(p => p.id);
  if (state.tiebreak) {
    // Départage : ceux qui réussissent leur pari l'emportent ; si tous réussissent ou tous
    // échouent, on rejoue entre les mêmes joueurs.
    const pool = state.tiebreak;
    const ok = results.filter(x => x.diff === 0).map(x => x.pid);
    tied = ok.length && ok.length < pool.length ? ok : pool;
    state.tiebreakCount = (state.tiebreakCount || 0) + 1;
    over = true;
  } else {
    const eliminated = ids.some(id => state.players[id].lives <= 0);
    const lastRound = Number.isFinite(state.opts.cycles) && state.roundNo + 1 >= state.opts.rounds.length * state.opts.cycles;
    if (eliminated || lastRound) {
      over = true;
      const max = Math.max(...ids.map(id => state.players[id].lives));
      tied = ids.filter(id => state.players[id].lives === max);
    }
  }
  // Le départage se joue entre survivants : si tous les ex æquo sont à 0 Vie, victoire partagée.
  const survivors = tied && tied.some(id => state.players[id].lives > 0);
  if (over && tied.length > 1 && (survivors || state.tiebreak) && (state.tiebreakCount || 0) < 8 && !state.opts.noTiebreak) {
    state.tiebreak = tied;
    events.push({ type: 'tiebreak', players: tied });
    state.phase = 'roundEnd';
    state.pending = { type: 'next', gameOver: false, tiebreak: true };
    return;
  }
  if (over) {
    state.winners = tied;
    state.tiebreak = null;
    state.phase = 'roundEnd';
    state.pending = { type: 'next', gameOver: true };
    events.push({ type: 'gameOver', winners: tied });
    return;
  }
  state.phase = 'roundEnd';
  state.pending = { type: 'next', gameOver: false };
}

/**
 * Applique une action et renvoie les événements.
 * { type:'bet', pid, value } | { type:'play', pid, cardId, mysticValue? } |
 * { type:'mysticValue', pid, value } | { type:'target', pid, target } |
 * { type:'reveal' } | { type:'next' } | { type:'start' }
 */
export function act(state, action) {
  const events = [];
  const pend = state.pending;
  if (action.type === 'start') {
    if (state.phase !== 'idle') throw new Error('Partie déjà commencée');
    return startRound(state);
  }
  if (!pend) throw new Error('Aucune décision attendue');
  if (pend.type !== action.type) throw new Error(`Action ${action.type} inattendue (attendu : ${pend.type})`);
  if (pend.pid != null && action.pid !== pend.pid) throw new Error(`Ce n'est pas au joueur ${action.pid} de jouer`);
  state.pending = null;

  switch (action.type) {
    case 'bet': {
      if (!legalBets(state, action.pid).includes(action.value)) {
        state.pending = pend;
        throw new Error('Pari interdit : ' + action.value);
      }
      const r = state.round;
      state.players[action.pid].bet = action.value;
      events.push({ type: 'bet', pid: action.pid, value: action.value });
      r.betIdx++;
      if (r.betIdx < r.betOrder.length) {
        state.pending = { type: 'bet', pid: r.betOrder[r.betIdx] };
      } else {
        state.phase = 'play';
        events.push({ type: 'betsDone' });
        if (r.mystic) state.pending = { type: 'reveal' };
        else startTrick(state, r.betOrder[0], events);
      }
      break;
    }
    case 'play': {
      const p = state.players[action.pid];
      const idx = p.hand.findIndex(c => c.id === action.cardId);
      if (idx < 0) {
        state.pending = pend;
        throw new Error('Carte absente de la main : ' + action.cardId);
      }
      const card = p.hand.splice(idx, 1)[0];
      placeCard(state, action.pid, card, false, events, action.mysticValue);
      break;
    }
    case 'mysticValue': {
      if (action.value !== 0 && action.value !== 37) {
        state.pending = pend;
        throw new Error('La Mystique vaut 0 ou 37');
      }
      setMysticValue(state, action.pid, action.value, events);
      break;
    }
    case 'target': {
      const ok = pend.options.includes(action.target) || (pend.optional && action.target == null);
      if (!ok) {
        state.pending = pend;
        throw new Error('Cible invalide');
      }
      applyTarget(state, action.pid, pend.power, action.target, events);
      break;
    }
    case 'reveal':
      reveal(state, events);
      break;
    case 'next':
      if (pend.gameOver) {
        state.phase = 'gameOver';
        state.pending = null;
      } else {
        events.push(...startRound(state));
      }
      break;
    default:
      state.pending = pend;
      throw new Error('Action inconnue : ' + action.type);
  }
  return events;
}

/** Cartes encore invisibles pour `pid` (ni dans sa main, ni posées dans cette manche). */
export function unseenFor(state, pid) {
  const r = state.round;
  const seen = new Set();
  const me = state.players[pid];
  if (!r.mystic) me.hand.forEach(c => seen.add(c.id));
  else r.participants.forEach(id => { if (id !== pid) state.players[id].hand.forEach(c => seen.add(c.id)); });
  r.played.forEach(c => seen.add(c.id));
  if (state.trick) state.trick.plays.forEach(p => seen.add(p.card.id));
  return state.deckTemplate.filter(c => !seen.has(c.id));
}
