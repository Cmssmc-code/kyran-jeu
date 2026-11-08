/*
 * Initiation KYRAN — état de l'interface, en une seule valeur.
 *
 * app.js porte plusieurs drapeaux (session, fenêtre ouverte, pause « Quitter ? », bouton
 * « Continuer » du Bokonon, tour du joueur, plantage). Cette fonction les réduit à un état
 * unique, publié sur #dojo[data-state] : le CSS, les tests et les agents (crawl Playwright de
 * la routine de surveillance) lisent cet attribut au lieu de deviner à partir du DOM.
 *
 *   lobby ──startSession──▶ auto ⇄ turn:<bet|play|mysticValue|target|reveal>
 *                            │  ⇄ coach   (le Bokonon attend « Continuer »)
 *                            │  ⇄ dialog  (bilan de manche, fin de partie, leçon)
 *                            │  ⇄ paused  (fenêtre « Quitter la partie ? »)
 *                            └──▶ crash   (erreur : seule sortie, retour à l'accueil)
 *   toute session ──exitToLobby / renderLobby──▶ lobby
 *
 * L'ordre des tests fixe la priorité quand plusieurs drapeaux sont levés en même temps.
 */
export const UI_STATES = Object.freeze(['lobby', 'auto', 'turn', 'coach', 'dialog', 'paused', 'crash']);

/** @returns {string} `lobby`, `crash`, `paused`, `dialog`, `coach`, `turn:<type>` ou `auto`. */
export function uiStateOf(sess, hasModal) {
  if (!sess) return 'lobby';
  if (sess.crashed) return 'crash';
  if (sess.pause) return 'paused';
  if (hasModal) return 'dialog';
  if (sess.coachHold) return 'coach';
  const pend = sess.state && sess.state.pending;
  if (sess.resolveHuman && pend) return 'turn:' + pend.type;
  return 'auto';
}
