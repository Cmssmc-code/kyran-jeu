/**
 * Salles de jeu entre amis (lien privé). Module ISOLÉ du paiement : il n'est chargé (import
 * dynamique) que si MULTI_ACTIF=1 et ne touche aucune route du webhook.
 *
 * Étape 1 : logique pure, sans réseau ni minuterie (l'horloge et le hasard sont injectables
 * pour les tests). Les routes, le flux SSE, les minuteries et le remplacement automatique
 * des joueurs absents viennent à l'étape 2.
 *
 * Le serveur est seul juge : il détient l'état complet (moteur partagé, server/moteur/) et
 * applique les actions. Le siège est déduit du jeton, jamais lu dans la requête.
 */
import crypto from 'crypto';
import * as E from './moteur/engine.js';
import * as AI from './moteur/ai.js';
import { vueDe, evenementsPour } from './vue.js';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // 31 caractères, sans 0 O 1 I L
export const LONGUEUR_CODE = 6;
export const MAX_SIEGES = 6;
export const MIN_JOUEURS = 3;
export const NIVEAUX = ['novice', 'adepte']; // jamais « maitre » : trop de calcul pour le serveur du webhook
export const VIES = [3, 5, 7];

/** Erreur attendue d'une salle : `statut` est le code HTTP que la route (étape 2) renverra. */
export class ErreurSalle extends Error {
  constructor(statut, message) {
    super(message);
    this.statut = statut;
  }
}

/** Pseudo : 1 à 20 caractères, sans balises ni caractères de contrôle. */
export function pseudoValide(brut) {
  if (typeof brut !== 'string') throw new ErreurSalle(400, 'Pseudo invalide');
  const p = brut.replace(/\s+/g, ' ').trim();
  if (p.length < 1 || p.length > 20 || /[<>&"'`\u0000-\u001f\u007f‪-‮⁦-⁩]/.test(p)) {
    throw new ErreurSalle(400, 'Pseudo invalide (1 à 20 caractères, sans < > & ni guillemets)');
  }
  return p;
}

/** Reconstruit une action sûre à partir de l'entrée du client : liste blanche, types vérifiés. */
export function actionPropre(brut, pid) {
  if (!brut || typeof brut !== 'object' || typeof brut.type !== 'string') throw new ErreurSalle(400, 'Action invalide');
  switch (brut.type) {
    case 'bet':
      if (!Number.isInteger(brut.value)) throw new ErreurSalle(400, 'Pari invalide');
      return { type: 'bet', pid, value: brut.value };
    case 'play':
      if (typeof brut.cardId !== 'string' || brut.cardId.length > 4) throw new ErreurSalle(400, 'Carte invalide');
      return { type: 'play', pid, cardId: brut.cardId, ...(brut.mysticValue === 0 || brut.mysticValue === 37 ? { mysticValue: brut.mysticValue } : {}) };
    case 'mysticValue':
      if (brut.value !== 0 && brut.value !== 37) throw new ErreurSalle(400, 'La Mystique vaut 0 ou 37');
      return { type: 'mysticValue', pid, value: brut.value };
    case 'target':
      if (brut.target != null && !Number.isInteger(brut.target)) throw new ErreurSalle(400, 'Cible invalide');
      return { type: 'target', pid, target: brut.target == null ? null : brut.target };
    case 'reveal':
    case 'next':
      return { type: brut.type };
    default:
      throw new ErreurSalle(400, 'Action inconnue');
  }
}

export function createSalles({
  now = Date.now,
  randomInt = crypto.randomInt,
  randomBytes = crypto.randomBytes,
  maxSalles = 50
} = {}) {
  const salles = new Map(); // code -> salle
  const jetons = new Map(); // jeton -> { code, pid }

  const rng = () => randomInt(2 ** 32) / 2 ** 32;

  function nouveauCode() {
    for (let essai = 0; essai < 20; essai++) {
      let code = '';
      for (let i = 0; i < LONGUEUR_CODE; i++) code += ALPHABET[randomInt(ALPHABET.length)];
      if (!salles.has(code)) return code;
    }
    throw new ErreurSalle(503, 'Impossible de créer une salle, réessayez');
  }

  function asseoir(salle, pseudo) {
    if (salle.statut !== 'attente') throw new ErreurSalle(409, 'La partie a déjà commencé');
    if (salle.sieges.length >= MAX_SIEGES) throw new ErreurSalle(409, 'La salle est pleine');
    if (salle.sieges.some(s => s.pseudo.toLowerCase() === pseudo.toLowerCase())) throw new ErreurSalle(409, 'Ce pseudo est déjà pris dans la salle');
    const pid = salle.sieges.length;
    const jeton = randomBytes(16).toString('hex'); // 128 bits
    salle.sieges.push({ pid, pseudo, humain: true, remplace: false, flux: 0, decoDepuis: now(), delais: 0 });
    jetons.set(jeton, { code: salle.code, pid });
    salle.activite = now();
    return { jeton, pid };
  }

  function parJeton(jeton) {
    const ref = typeof jeton === 'string' ? jetons.get(jeton) : null;
    const salle = ref && salles.get(ref.code);
    if (!ref || !salle) throw new ErreurSalle(403, 'Jeton inconnu ou salle fermée');
    return { salle, pid: ref.pid };
  }

  function salleDe(code) {
    const salle = typeof code === 'string' ? salles.get(code.toUpperCase()) : null;
    if (!salle) throw new ErreurSalle(404, "Cette salle n'existe plus");
    return salle;
  }

  function creer({ pseudo }) {
    const p = pseudoValide(pseudo);
    if (salles.size >= maxSalles) throw new ErreurSalle(503, 'Toutes les salles sont occupées, réessayez dans quelques minutes');
    const salle = { code: nouveauCode(), creee: now(), activite: now(), statut: 'attente', hote: 0, sieges: [], state: null, seq: 0, niveau: 'adepte', maxDecisionMs: 0 };
    salles.set(salle.code, salle);
    const { jeton, pid } = asseoir(salle, p);
    return { code: salle.code, jeton, pid };
  }

  function rejoindre({ code, pseudo }) {
    const p = pseudoValide(pseudo);
    const salle = salleDe(code);
    const { jeton, pid } = asseoir(salle, p);
    return { code: salle.code, jeton, pid };
  }

  /** Options : { vies: 3|5|7, pouvoirs: bool, ordinateurs: 0..n (complète au moins à 3), niveau } */
  function lancer({ jeton, options = {} }) {
    const { salle, pid } = parJeton(jeton);
    if (pid !== salle.hote) throw new ErreurSalle(403, "Seul l'hôte lance la partie");
    if (salle.statut !== 'attente') throw new ErreurSalle(409, 'La partie a déjà commencé');
    const vies = options.vies == null ? 5 : options.vies;
    if (!VIES.includes(vies)) throw new ErreurSalle(400, 'Vies : 3, 5 ou 7');
    const niveau = options.niveau == null ? 'adepte' : options.niveau;
    if (!NIVEAUX.includes(niveau)) throw new ErreurSalle(400, 'Niveau des ordinateurs : novice ou adepte');
    const humains = salle.sieges.length;
    const extra = options.ordinateurs == null ? 0 : options.ordinateurs;
    if (!Number.isInteger(extra) || extra < 0) throw new ErreurSalle(400, "Nombre d'ordinateurs invalide");
    const total = Math.min(MAX_SIEGES, Math.max(MIN_JOUEURS, humains + extra));
    const personas = AI.PERSONAS.slice();
    for (let i = personas.length - 1; i > 0; i--) { // mélange de Fisher-Yates
      const j = Math.floor(rng() * (i + 1));
      [personas[i], personas[j]] = [personas[j], personas[i]];
    }
    const joueurs = salle.sieges.map(s => ({ name: s.pseudo, human: true, level: niveau })); // niveau utilisé si un humain est remplacé
    const ordis = [];
    for (let i = joueurs.length; i < total; i++) {
      const persona = personas[(i - humains) % personas.length];
      joueurs.push({ name: persona.name, persona: persona.key, level: niveau });
      ordis.push({ pid: i, pseudo: persona.name, humain: false, remplace: false });
    }
    const pouvoirs = options.pouvoirs !== false;
    const state = E.createGame({ players: joueurs, lives: vies, powers: pouvoirs, mystique: pouvoirs, seed: randomInt(2 ** 32) });
    salle.sieges.push(...ordis); // sièges ajoutés seulement si createGame a réussi
    salle.niveau = niveau;
    salle.dernierCoup = now();
    salle.state = state;
    const evenements = E.act(salle.state, { type: 'start' });
    salle.statut = 'jeu';
    salle.seq++;
    salle.activite = now();
    return { seq: salle.seq, evenements: evenementsPour(evenements, pid) };
  }

  function appliquer(salle, action) {
    let evenements;
    try {
      evenements = E.act(salle.state, action);
    } catch (err) {
      throw new ErreurSalle(409, err.message); // coup illégal : l'état reste intact (le moteur le garantit)
    }
    salle.seq++;
    salle.activite = salle.dernierCoup = now();
    if (salle.state.phase === 'gameOver') salle.statut = 'finie';
    return evenements;
  }

  /** Action d'un joueur assis. Le `pid` envoyé est ignoré : il vient du jeton. */
  function agir({ jeton, action }) {
    const { salle, pid } = parJeton(jeton);
    if (salle.statut !== 'jeu') throw new ErreurSalle(409, "La partie n'est pas en cours");
    const evenements = appliquer(salle, actionPropre(action, pid));
    const siege = salle.sieges[pid];
    siege.delais = 0; // un humain qui joue reprend sa place
    siege.remplace = false;
    return { seq: salle.seq, evenements: evenementsPour(evenements, pid) };
  }

  /** Salon, partie ou fin : ce que le joueur du jeton a le droit de voir. */
  function etat(jeton) {
    const { salle, pid } = parJeton(jeton);
    salle.activite = now();
    return {
      code: salle.code,
      statut: salle.statut,
      moi: pid,
      hote: salle.hote,
      seq: salle.seq,
      sieges: salle.sieges.map(s => ({ pid: s.pid, pseudo: s.pseudo, humain: s.humain, remplace: s.remplace })),
      vue: salle.state ? vueDe(salle.state, pid) : null
    };
  }

  /** Siège piloté par l'ordinateur : vrai ordinateur, ou humain remplacé. */
  const estOrdi = (salle, pid) => !salle.sieges[pid].humain || salle.sieges[pid].remplace;

  function remplacer(code, pid, oui = true) {
    const salle = salleDe(code);
    if (!salle.sieges[pid] || !salle.sieges[pid].humain) throw new ErreurSalle(400, 'Siège inconnu ou déjà un ordinateur');
    salle.sieges[pid].remplace = !!oui;
  }

  /**
   * Joue UNE décision en attente pour un siège piloté par l'ordinateur, ou le « Suivant » /
   * « Révéler » automatique. Renvoie les événements bruts (le moteur) ou null s'il faut
   * attendre un humain. Les délais et le déclenchement viennent de l'étape 2.
   */
  function avancer(code, { force = false } = {}) {
    const salle = salleDe(code);
    if (salle.statut !== 'jeu') return null;
    const pend = salle.state.pending;
    if (!pend) return null;
    let action;
    if (pend.type === 'reveal' || pend.type === 'next') action = { type: pend.type };
    else if (estOrdi(salle, pend.pid) || force) {
      if (!estOrdi(salle, pend.pid)) { // délai dépassé : l'ordinateur joue ce coup, 3 délais d'affilée = remplacement
        const sg = salle.sieges[pend.pid];
        if (++sg.delais >= 3) sg.remplace = true;
      }
      const debut = process.hrtime.bigint();
      action = AI.decide(salle.state, rng);
      const ms = Number(process.hrtime.bigint() - debut) / 1e6;
      if (ms > salle.maxDecisionMs) salle.maxDecisionMs = ms;
    } else return null;
    return appliquer(salle, action);
  }

  /** Un flux (page ouverte) s'ouvre ou se ferme pour le siège du jeton. */
  function connecter(jeton) {
    const { salle, pid } = parJeton(jeton);
    const sg = salle.sieges[pid];
    sg.flux++;
    sg.decoDepuis = null;
    if (salle.statut === 'jeu' && sg.remplace) sg.remplace = false; // de retour : il reprend la main
    salle.activite = now();
  }

  function deconnecter(jeton) {
    const ref = jetons.get(jeton);
    const salle = ref && salles.get(ref.code);
    if (!salle) return;
    const sg = salle.sieges[ref.pid];
    sg.flux = Math.max(0, sg.flux - 1);
    if (sg.flux === 0) sg.decoDepuis = now();
  }

  function fermer(code) {
    if (!salles.delete(code)) return;
    for (const [jeton, ref] of jetons) if (ref.code === code) jetons.delete(jeton);
  }

  return {
    creer,
    rejoindre,
    lancer,
    agir,
    etat,
    avancer,
    remplacer,
    connecter,
    deconnecter,
    fermer,
    nombre: () => salles.size,
    // Pour les tests et l'étape 2 (balayage, minuteries) : jamais exposé au réseau tel quel.
    _interne: { salles, jetons, salleDe }
  };
}
