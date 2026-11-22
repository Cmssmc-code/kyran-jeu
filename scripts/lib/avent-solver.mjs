/**
 * Calendrier de l'Avent KYRAN : vérification des défis par le moteur de l'Initiation.
 *
 * - validerDonne(defi) : la donne est jouable (joueurs, cartes, ids connus du paquet officiel
 *   pour ce nombre de joueurs, pas de doublon, mains complètes). Renvoie la liste des erreurs.
 * - resoudre(defi) : joue la donne dans tous les ordres possibles avec dojo/engine.js et renvoie
 *   { auMieux, min, max } pour le joueur 0 :
 *     auMieux : plis que tu fais en jouant au mieux, quand tous les autres jouent pour t'en faire
 *               perdre (minimax ; c'est la « réponse » des défis) ;
 *     min/max : fourchette si tout le monde, toi compris, joue n'importe comment.
 *   Tous les choix sont explorés : carte posée, valeur de la Mystique (0 ou 37), cible d'un
 *   Pouvoir (et refus du Voile du Néant). La carte tirée au hasard par le Sceau du Destin est
 *   comptée au pire pour toi.
 *
 * Utilisé par scripts/test/avent.test.mjs et scripts/avent-import.mjs (aucun DOM).
 */
import { createGame, act, legalBets, buildDeck } from '../../dojo/engine.js';

export function validerDonne(defi) {
  const erreurs = [];
  const { joueurs, cartes, donneur, mains } = defi;
  if (!Number.isInteger(joueurs) || joueurs < 3 || joueurs > 6) erreurs.push(`joueurs ${joueurs} (3 à 6)`);
  if (!Number.isInteger(cartes) || cartes < 2 || cartes > 7) erreurs.push(`cartes ${cartes} (2 à 7)`);
  if (!Number.isInteger(donneur) || donneur < 0 || donneur >= joueurs) erreurs.push(`donneur ${donneur}`);
  if (!Number.isInteger(defi.reponse) || defi.reponse < 0 || defi.reponse > cartes) erreurs.push(`réponse ${defi.reponse}`);
  const paquet = new Set(buildDeck({ playerCount: joueurs || 4 }).map(c => c.id));
  const vus = new Set();
  for (let pid = 0; pid < joueurs; pid++) {
    const main = (mains && mains[pid]) || [];
    if (main.length !== cartes) erreurs.push(`joueur ${pid} : ${main.length} cartes au lieu de ${cartes}`);
    for (const id of main) {
      if (!paquet.has(id)) erreurs.push(`joueur ${pid} : carte ${id} absente du paquet à ${joueurs} joueurs`);
      if (vus.has(id)) erreurs.push(`carte ${id} en double`);
      vus.add(id);
    }
  }
  if (mains && Object.keys(mains).some(k => Number(k) >= joueurs)) erreurs.push('main d’un joueur inexistant');
  return erreurs;
}

/** Partie du moteur prête à jouer la donne (paris posés). */
export function partieDuDefi(defi) {
  const players = Array.from({ length: defi.joueurs }, (_, i) => ({ name: i === 0 ? 'Toi' : 'Joueur ' + i }));
  const state = createGame({
    players,
    rounds: [defi.cartes],
    cycles: 1,
    dealer: defi.donneur,
    noLifeLoss: true,
    noTiebreak: true,
    seed: 1,
    deals: { 0: { dealer: defi.donneur, hands: defi.mains } }
  });
  act(state, { type: 'start' });
  // Les paris ne changent rien au jeu des cartes (hors manche Mystique, exclue) : premier pari permis.
  while (state.pending && state.pending.type === 'bet') {
    const pid = state.pending.pid;
    act(state, { type: 'bet', pid, value: legalBets(state, pid)[0] });
  }
  state.round.undealt = [];
  return state;
}

/**
 * Copie légère de l'état en cours de manche : seuls les champs que act() modifie sont dupliqués
 * (les objets carte ne sont jamais modifiés par le moteur ; le paquet restant est vidé par
 * partieDuDefi, il ne sert plus après la distribution).
 */
function cloner(s) {
  return {
    ...s,
    players: s.players.map(p => ({ ...p, hand: p.hand.slice(), peeks: p.peeks.slice(), stats: { ...p.stats } })),
    round: { ...s.round, played: s.round.played.slice() },
    trick: s.trick && { ...s.trick, plays: s.trick.plays.map(x => ({ ...x })) },
    pending: s.pending && { ...s.pending },
    history: s.history.slice()
  };
}

function cle(state) {
  const p = state.pending;
  const mains = state.players.map(pl => pl.hand.map(c => c.id).sort().join(',')).join('|');
  const pli = state.trick ? state.trick.leader + ':' + state.trick.plays.map(x => x.pid + x.card.id + '=' + x.value).join(',') : '';
  return [p.type, p.pid, p.power || '', (p.options || []).join(','), state.players[0].tricks, mains, pli].join('/');
}

/** Coups possibles : liste de { action, rng? } (rng fixe la carte tirée par le Sceau). */
function coups(state) {
  const p = state.pending;
  if (p.type === 'play') {
    const out = [];
    for (const c of state.players[p.pid].hand) {
      if (c.kind === 'mystique') {
        out.push({ action: { type: 'play', pid: p.pid, cardId: c.id, mysticValue: 0 } });
        out.push({ action: { type: 'play', pid: p.pid, cardId: c.id, mysticValue: 37 } });
      } else out.push({ action: { type: 'play', pid: p.pid, cardId: c.id } });
    }
    return out;
  }
  if (p.type === 'mysticValue') return [0, 37].map(value => ({ action: { type: 'mysticValue', pid: p.pid, value } }));
  if (p.type === 'target') {
    const cibles = p.optional ? [...p.options, null] : p.options;
    return cibles.map(target => ({ action: { type: 'target', pid: p.pid, target } }));
  }
  throw new Error('Décision inattendue : ' + p.type);
}

/** Tirages possibles du Sceau du Destin sur la cible (sinon un seul « tirage »). */
function tirages(state, coup) {
  const p = state.pending;
  if (p.type !== 'target' || p.power !== 'sceau' || coup.action.target == null) return [null];
  const n = state.players[coup.action.target].hand.length;
  return Array.from({ length: n }, (_, k) => () => (k + 0.5) / n);
}

export function resoudre(defi) {
  const memo = new Map();
  function visiter(state) {
    const p = state.pending;
    if (!p || p.type === 'next') {
      const t = state.players[0].tricks;
      return { auMieux: t, min: t, max: t };
    }
    const k = cle(state);
    if (memo.has(k)) return memo.get(k);
    const moi = p.pid === 0;
    let auMieux = moi ? -Infinity : Infinity;
    let min = Infinity;
    let max = -Infinity;
    for (const coup of coups(state)) {
      // Hasard du Sceau : compté au pire pour toi.
      let pire = Infinity;
      for (const tirage of tirages(state, coup)) {
        const suite = cloner(state);
        if (tirage) suite.rng = tirage;
        act(suite, coup.action);
        if (tirage) suite.rng = state.rng;
        const r = visiter(suite);
        pire = Math.min(pire, r.auMieux);
        min = Math.min(min, r.min);
        max = Math.max(max, r.max);
      }
      auMieux = moi ? Math.max(auMieux, pire) : Math.min(auMieux, pire);
    }
    const res = { auMieux, min, max };
    memo.set(k, res);
    return res;
  }
  return visiter(partieDuDefi(defi));
}
