/**
 * Vue d'une partie pour un joueur (parties entre amis).
 *
 * Point le plus sensible du multijoueur : le serveur détient l'état complet, le joueur ne doit
 * recevoir que ce qu'il a le droit de voir. La vue est construite en LISTE BLANCHE : on copie
 * champ par champ ce qui est public, on ne retire jamais « au cas par cas » (un champ ajouté
 * plus tard au moteur ne fuit donc pas).
 *
 * Jamais envoyés : rng, opts.seed, deckTemplate, opts.deals, round.undealt (cartes non
 * distribuées), mains des autres joueurs.
 * Manche Mystique (une seule carte, départage compris) : on voit les cartes des AUTRES, jamais la sienne.
 * Clairvoyance (peeks) : seulement pour le joueur qui l'a jouée.
 */

const carte = c => (c ? { id: c.id, kind: c.kind, value: c.value, ...(c.power ? { power: c.power } : {}) } : null);
const cartes = list => (list || []).map(carte);

function jeu(p) {
  return { pid: p.pid, card: carte(p.card), value: p.value, forced: !!p.forced, order: p.order };
}

function decision(pend) {
  if (!pend) return null;
  const out = { type: pend.type };
  if (pend.pid != null) out.pid = pend.pid;
  if (pend.power) out.power = pend.power;
  if (pend.options) out.options = pend.options.slice();
  if (pend.optional != null) out.optional = !!pend.optional;
  if (pend.gameOver != null) out.gameOver = !!pend.gameOver;
  if (pend.tiebreak != null) out.tiebreak = !!pend.tiebreak;
  return out;
}

/** La main de `p` est-elle visible par `pid` ? */
function mainVisible(state, p, pid) {
  const mystic = !!(state.round && state.round.mystic);
  if (mystic) return p.id !== pid; // jeu à l'aveugle : on voit les autres, pas soi
  return p.id === pid;
}

export function vueDe(state, pid) {
  const o = state.opts;
  const r = state.round;
  const t = state.trick;
  return {
    me: pid,
    phase: state.phase,
    roundNo: state.roundNo,
    dealer: state.dealer,
    opts: {
      lives: o.lives,
      rounds: o.rounds.slice(),
      cycles: Number.isFinite(o.cycles) ? o.cycles : null, // Infinity n'existe pas en JSON
      powers: !!o.powers,
      mystique: !!o.mystique,
      goldenRule: !!o.goldenRule
    },
    pending: decision(state.pending),
    players: state.players.map(p => ({
      id: p.id,
      name: p.name,
      human: !!p.human,
      persona: p.persona,
      level: p.level,
      lives: p.lives,
      bet: p.bet,
      tricks: p.tricks,
      handCount: p.hand.length,
      hand: mainVisible(state, p, pid) ? cartes(p.hand) : null,
      peeks: p.id === pid ? p.peeks.map(k => ({ target: k.target, card: carte(k.card) })) : [],
      stats: { bets: p.stats.bets, exact: p.stats.exact }
    })),
    round: r && {
      no: r.no,
      cards: r.cards,
      mystic: !!r.mystic,
      tiebreak: !!r.tiebreak,
      participants: r.participants.slice(),
      dealer: r.dealer,
      betOrder: r.betOrder.slice(),
      betIdx: r.betIdx,
      trickNo: r.trickNo,
      played: cartes(r.played)
    },
    trick: t && { no: t.no, leader: t.leader, order: t.order.slice(), plays: t.plays.map(jeu) },
    history: state.history.map(h => ({
      roundNo: h.roundNo,
      cards: h.cards,
      mystic: !!h.mystic,
      tiebreak: !!h.tiebreak,
      results: h.results.map(x => ({ pid: x.pid, bet: x.bet, tricks: x.tricks, diff: x.diff, lost: x.lost, lives: x.lives }))
    })),
    tiebreak: state.tiebreak ? state.tiebreak.slice() : null,
    winners: state.winners ? state.winners.slice() : null
  };
}

/**
 * Événements d'une action, filtrés pour `pid` (animations du client). Les événements du moteur
 * ne montrent que des cartes déjà publiques (cartes posées), sauf la Clairvoyance : la carte
 * vue n'est donnée qu'à celui qui l'a jouée. Liste blanche des types.
 */
export function evenementsPour(events, pid) {
  const out = [];
  for (const ev of events) {
    switch (ev.type) {
      case 'peek':
        out.push(ev.pid === pid ? { type: 'peek', pid: ev.pid, target: ev.target, card: carte(ev.card) } : { type: 'peek', pid: ev.pid, target: ev.target });
        break;
      case 'play':
        out.push({ type: 'play', pid: ev.pid, card: carte(ev.card), forced: !!ev.forced, value: ev.value });
        break;
      case 'force':
        out.push({ type: 'force', pid: ev.pid, power: ev.power, target: ev.target, card: carte(ev.card) });
        break;
      case 'trickWon':
        out.push({ type: 'trickWon', pid: ev.pid, trickNo: ev.trickNo, card: carte(ev.card), value: ev.value, plays: ev.plays.map(jeu) });
        break;
      case 'reveal':
        out.push({ type: 'reveal', plays: ev.plays.map(jeu) });
        break;
      case 'swap':
        out.push({ type: 'swap', pid: ev.pid, target: ev.target, mine: ev.mine, theirs: ev.theirs, mineCard: carte(ev.mineCard), theirsCard: carte(ev.theirsCard) });
        break;
      case 'roundStart':
        out.push({ type: 'roundStart', roundNo: ev.roundNo, cards: ev.cards, mystic: !!ev.mystic, dealer: ev.dealer, tiebreak: !!ev.tiebreak });
        break;
      case 'roundEnd':
        out.push({ type: 'roundEnd', roundNo: ev.roundNo, results: ev.results.map(x => ({ pid: x.pid, bet: x.bet, tricks: x.tricks, diff: x.diff, lost: x.lost, lives: x.lives })) });
        break;
      case 'bet':
        out.push({ type: 'bet', pid: ev.pid, value: ev.value });
        break;
      case 'mysticValue':
        out.push({ type: 'mysticValue', pid: ev.pid, value: ev.value });
        break;
      case 'tiebreak':
        out.push({ type: 'tiebreak', players: ev.players.slice() });
        break;
      case 'gameOver':
        out.push({ type: 'gameOver', winners: ev.winners.slice() });
        break;
      case 'betsDone':
        out.push({ type: 'betsDone' });
        break;
      case 'trickStart':
        out.push({ type: 'trickStart', trickNo: ev.trickNo, leader: ev.leader });
        break;
      case 'powerCancelled':
        out.push({ type: 'powerCancelled', pid: ev.pid, power: ev.power, reason: ev.reason });
        break;
      case 'powerNoTarget':
      case 'powerDeclined':
        out.push({ type: ev.type, pid: ev.pid, power: ev.power });
        break;
      default:
        break; // type inconnu : jamais transmis tel quel
    }
  }
  return out;
}
