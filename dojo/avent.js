/*
 * Calendrier de l'Avent KYRAN (avent.html) : 24 défis de plis, un par jour du 1er au 24 décembre.
 *
 * - Date de Paris (Intl, Europe/Paris) : une case s'ouvre le jour J et reste ouverte ensuite ;
 *   les jours futurs restent verrouillés, même demandés par ?jour=.
 * - Avant le 1er décembre : défi d'essai jouable et compte à rebours.
 * - Réponses gardées sur l'appareil (localStorage), partage (Web Share API ou presse-papiers),
 *   lien d'achat suivi (/commander.html?ref=avent, transmis à Stripe en client_reference_id).
 *
 * Les fonctions de date sont pures et exportées (scripts/test/avent.test.mjs) ; l'interface ne
 * démarre que dans une page qui contient #avent.
 */
import { cardById, POWERS } from './engine.js?v=617bc536b5';
import { defiDuJour } from './avent-defis.js?v=3a42ce9940';

export const ANNEE = 2026;
export const DERNIER_JOUR = 24;
export const URL_PAGE = 'https://kyran-jeu.fr/avent.html';
const CLE_STOCKAGE = 'kyran-avent-' + ANNEE;
const UN_JOUR = 86400000;

// ── Date de Paris et ouverture des cases (fonctions pures) ────────────────

/** Date du jour à Paris : { annee, mois, jour } (mois de 1 à 12). */
export function dateParis(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  const val = type => Number(parts.find(p => p.type === type).value);
  return { annee: val('year'), mois: val('month'), jour: val('day') };
}

/** Nombre de cases ouvertes à cette date (0 avant le 1er décembre, 24 à partir du 24). */
export function joursOuverts(d) {
  if (d.annee < ANNEE) return 0;
  if (d.annee > ANNEE) return DERNIER_JOUR;
  if (d.mois < 12) return 0;
  return Math.min(d.jour, DERNIER_JOUR);
}

/** Une case (1 à 24) peut-elle être ouverte à cette date ? */
export function caseOuverte(jour, d) {
  return Number.isInteger(jour) && jour >= 1 && jour <= DERNIER_JOUR && jour <= joursOuverts(d);
}

/** Jours restant avant le 1er décembre (0 dès l'ouverture). */
export function joursAvantOuverture(d) {
  const diff = Math.round((Date.UTC(ANNEE, 11, 1) - Date.UTC(d.annee, d.mois - 1, d.jour)) / UN_JOUR);
  return Math.max(0, diff);
}

/** Ouverture de la première case : 1er décembre à minuit, heure de Paris (UTC+1 en hiver). */
export const OUVERTURE_UTC = Date.UTC(ANNEE, 10, 30, 23);

/** Compte à rebours jusqu'à l'ouverture : { jours, heures, minutes } (null une fois ouvert). */
export function compteARebours(maintenant = Date.now()) {
  const reste = OUVERTURE_UTC - maintenant;
  if (reste <= 0) return null;
  const minutesTotal = Math.ceil(reste / 60000);
  return { jours: Math.floor(minutesTotal / 1440), heures: Math.floor((minutesTotal % 1440) / 60), minutes: minutesTotal % 60 };
}

/** Case à montrer à l'arrivée : celle demandée par ?jour= si elle est ouverte, sinon la dernière ouverte, sinon l'essai (0). */
export function caseAuDepart(demande, d) {
  const n = joursOuverts(d);
  if (caseOuverte(demande, d)) return demande;
  return n > 0 ? n : 0;
}

/** Lien direct vers le défi d'un jour (l'essai : la page seule). */
export function lienDuDefi(jour) {
  return jour >= 1 && jour <= DERNIER_JOUR ? URL_PAGE + '?jour=' + jour : URL_PAGE;
}

/** Texte à partager (le lien est passé à part). */
export function texteDePartage(jour, resultat) {
  const quoi = jour === 0 ? 'le défi d’essai' : 'le défi du ' + jour + ' décembre';
  const bilan = resultat == null ? '' : resultat ? ' Réussi !' : ' Raté, à toi de faire mieux !';
  return 'Calendrier de l’Avent KYRAN : ' + quoi + '. Combien de plis fais-tu ?' + bilan;
}

/** Repère d'achat transmis à Stripe (client_reference_id). */
export const REF_ACHAT = 'avent';
export const LIEN_ACHAT = '/commander.html?ref=' + REF_ACHAT;

// ── Interface ──────────────────────────────────────────────────────────────

const CARD_DIR = '/dojo/img/cartes/';

function cardImage(card) {
  if (card.kind === 'mystique') return CARD_DIR + 'carte-37.webp';
  if (card.kind === 'power') return `${CARD_DIR}pouvoir-${card.power}-${card.value}.webp`;
  return `${CARD_DIR}carte-${card.value}.webp`;
}

function cardName(card) {
  if (card.kind === 'mystique') return 'carte Mystique';
  if (card.kind === 'power') return `${POWERS[card.power].name}, valeur ${card.value}`;
  return `carte ${card.value}`;
}

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'text') el.textContent = v;
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(children)) if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return el;
}

function cardEl(id, back) {
  const card = back ? null : cardById(id);
  const el = h('div', { class: 'av-carte' + (back ? ' est-dos' : ' est-' + card.kind), role: 'img', 'aria-label': back ? 'carte face cachée' : cardName(card) });
  const img = h('img', { src: back ? CARD_DIR + 'dos.webp' : cardImage(card), alt: '', width: 200, height: 297, decoding: 'async', draggable: 'false' });
  img.addEventListener('error', () => el.classList.add('sans-image'));
  el.appendChild(img);
  if (!back) el.appendChild(h('span', { class: 'av-carte-repli', 'aria-hidden': 'true', text: card.kind === 'mystique' ? 'M' : String(card.value) }));
  return el;
}

function lireResultats() {
  try { return JSON.parse(localStorage.getItem(CLE_STOCKAGE)) || {}; } catch (e) { return {}; }
}

function garderResultat(jour, choix, ok) {
  const r = lireResultats();
  if (r[jour]) return;
  r[jour] = { choix, ok };
  try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(r)); } catch (e) { /* stockage indisponible : tant pis */ }
}

// Même numérotation que les explications : joueur 1 à ta gauche, puis dans le sens des aiguilles d'une montre.
const nomJoueur = (pid) => (pid === 0 ? 'Toi' : 'Joueur ' + pid);

function init(root) {
  const params = new URLSearchParams(location.search);
  const demande = Number(params.get('jour'));
  let today = dateParis();
  let actif = caseAuDepart(demande, today);

  const statut = h('p', { class: 'av-statut', 'aria-live': 'polite' });
  const grille = h('ol', { class: 'av-grille', 'aria-label': 'Les 24 cases du calendrier' });
  const panneau = h('section', { class: 'av-defi', id: 'avent-defi', 'aria-live': 'polite' });
  root.textContent = '';
  root.append(statut, grille, panneau);
  root.removeAttribute('aria-busy');

  function rendreStatut() {
    const n = joursOuverts(today);
    const rebours = n === 0 ? compteARebours() : null;
    if (rebours) {
      const pl = (v, mot) => v + ' ' + mot + (v > 1 ? 's' : '');
      statut.textContent = 'La première case s’ouvre le 1er décembre à minuit (heure de Paris), dans '
        + (rebours.jours ? pl(rebours.jours, 'jour') + ', ' : '') + pl(rebours.heures, 'heure') + ' et ' + pl(rebours.minutes, 'minute')
        + '. En attendant, fais le défi d’essai.';
    } else if (n === 0) {
      statut.textContent = 'La première case s’ouvre dans un instant.';
    } else if (n < DERNIER_JOUR) {
      statut.textContent = 'Aujourd’hui, la case ' + n + ' est ouverte. Une nouvelle case chaque jour à minuit, heure de Paris.';
    } else {
      statut.textContent = 'Les 24 cases sont ouvertes. Rattrape celles qui te manquent !';
    }
  }

  function rendreGrille() {
    const res = lireResultats();
    grille.textContent = '';
    if (joursOuverts(today) === 0) {
      const li = h('li', { class: 'av-case-li av-case-li--essai' });
      li.appendChild(caseBouton(0, true, res[0]));
      grille.appendChild(li);
    }
    for (let j = 1; j <= DERNIER_JOUR; j++) {
      const li = h('li', { class: 'av-case-li' });
      li.appendChild(caseBouton(j, caseOuverte(j, today), res[j]));
      grille.appendChild(li);
    }
  }

  function caseBouton(jour, ouverte, resultat) {
    const etat = !ouverte ? 'verrouillée' : resultat ? (resultat.ok ? 'réussie' : 'ratée') : 'ouverte';
    const label = (jour === 0 ? 'Défi d’essai' : 'Jour ' + jour) + ', case ' + etat;
    const btn = h('button', {
      type: 'button',
      class: 'av-case' + (ouverte ? ' est-ouverte' : ' est-verrouillee') + (resultat ? (resultat.ok ? ' est-reussie' : ' est-ratee') : '') + (jour === actif ? ' est-active' : ''),
      'aria-label': label,
      'aria-pressed': jour === actif ? 'true' : 'false',
      disabled: !ouverte
    }, [
      h('span', { class: 'av-case-num', text: jour === 0 ? 'Essai' : String(jour) }),
      h('span', { class: 'av-case-marque', 'aria-hidden': 'true', text: !ouverte ? '🔒' : resultat ? (resultat.ok ? '✓' : '✗') : '' })
    ]);
    if (ouverte) btn.addEventListener('click', () => choisir(jour, true));
    return btn;
  }

  function choisir(jour, defiler) {
    actif = jour;
    const url = new URL(location.href);
    if (jour === 0) url.searchParams.delete('jour'); else url.searchParams.set('jour', String(jour));
    try { history.replaceState(null, '', url.pathname + url.search + url.hash); } catch (e) { /* sans historique */ }
    rendreGrille();
    rendrePanneau();
    if (defiler && panneau.scrollIntoView) panneau.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function rendrePanneau() {
    panneau.textContent = '';
    const jour = actif;
    if (demande && !caseOuverte(demande, today) && demande >= 1 && demande <= DERNIER_JOUR && jour !== demande) {
      panneau.appendChild(h('p', { class: 'av-note', text: 'Patience : la case ' + demande + ' s’ouvre le ' + demande + ' décembre.' }));
    }
    const defi = defiDuJour(jour);
    panneau.appendChild(h('h2', { class: 'av-titre', text: jour === 0 ? 'Défi d’essai' : 'Jour ' + jour + ' : ' + jour + ' décembre' }));
    if (!defi) {
      panneau.appendChild(h('p', { class: 'av-bientot', text: 'Défi bientôt prêt. Reviens un peu plus tard !' }));
      return;
    }
    const ouvreur = (defi.donneur + 1) % defi.joueurs;
    panneau.appendChild(h('p', { class: 'av-meta', text: defi.joueurs + ' joueurs · ' + defi.cartes + ' cartes chacun · ' + (ouvreur === 0 ? 'tu ouvres le premier pli' : nomJoueur(ouvreur) + ' ouvre le premier pli') }));

    const table = h('div', { class: 'av-table' });
    for (let pid = 0; pid < defi.joueurs; pid++) {
      const main = h('div', { class: 'av-main' + (pid === 0 ? ' av-main--toi' : '') });
      const roles = [pid === defi.donneur ? 'donneur' : '', pid === ouvreur ? 'ouvre' : ''].filter(Boolean).join(', ');
      main.appendChild(h('p', { class: 'av-main-nom', text: (pid === 0 ? 'Ta main' : nomJoueur(pid)) + (roles ? ' (' + roles + ')' : '') }));
      const cartes = h('div', { class: 'av-cartes' });
      const ids = defi.mains[pid] || [];
      for (let k = 0; k < defi.cartes; k++) cartes.appendChild(cardEl(ids[k], !ids[k]));
      main.appendChild(cartes);
      table.appendChild(main);
    }
    panneau.appendChild(table);

    panneau.appendChild(h('p', { class: 'av-question', text: 'Combien de plis fais-tu ?' }));
    const choix = h('div', { class: 'av-choix', role: 'group', 'aria-label': 'Ta réponse' });
    const verdict = h('div', { class: 'av-verdict' });
    const deja = lireResultats()[jour];
    for (let b = 0; b <= defi.cartes; b++) {
      const btn = h('button', { type: 'button', class: 'btn btn-secondary av-rep', text: String(b), 'aria-label': b + (b > 1 ? ' plis' : ' pli') });
      btn.addEventListener('click', () => repondre(b));
      choix.appendChild(btn);
    }
    const actions = h('div', { class: 'av-actions' });
    const partager = h('button', { type: 'button', class: 'btn btn-secondary', text: 'Partager ce défi' });
    const info = h('p', { class: 'av-info', 'aria-live': 'polite' });
    partager.addEventListener('click', () => {
      const r = lireResultats()[jour];
      partagerDefi(texteDePartage(jour, r ? r.ok : null), lienDuDefi(jour), info);
    });
    actions.append(partager, h('a', { class: 'btn btn-primary', href: LIEN_ACHAT, text: 'Acheter le jeu KYRAN (9,99 €)' }));
    panneau.append(choix, verdict, actions, info);
    if (deja) montrerVerdict(deja.choix, deja.ok, true);

    function repondre(b) {
      const ok = b === defi.reponse;
      garderResultat(jour, b, ok);
      const r = lireResultats()[jour] || { choix: b, ok };
      montrerVerdict(r.choix, r.ok, r.choix !== b);
      rendreGrille();
    }

    function montrerVerdict(b, ok, ancien) {
      choix.querySelectorAll('button').forEach((btn, i) => {
        btn.disabled = true;
        btn.classList.toggle('est-choisi', i === b);
        btn.classList.toggle('est-bonne', i === defi.reponse);
      });
      verdict.textContent = '';
      verdict.appendChild(h('p', { class: 'av-resultat ' + (ok ? 'est-ok' : 'est-ko'), text: (ancien ? 'Ta réponse : ' + b + '. ' : '') + (ok ? 'Bonne réponse !' : 'Raté ! La bonne réponse est ' + defi.reponse + '.') }));
      verdict.appendChild(h('p', { class: 'av-explication', text: defi.explication }));
    }
  }

  rendreStatut();
  rendreGrille();
  rendrePanneau();

  // Passage de minuit (page restée ouverte) : la nouvelle case s'ouvre sans recharger.
  setInterval(() => {
    const d = dateParis();
    if (d.jour === today.jour && d.mois === today.mois && d.annee === today.annee) {
      if (joursOuverts(today) === 0) rendreStatut();
      return;
    }
    today = d;
    rendreStatut();
    rendreGrille();
  }, 60000);
}

async function partagerDefi(texte, lien, info) {
  info.textContent = '';
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Calendrier de l’Avent KYRAN', text: texte, url: lien });
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(lien);
    info.textContent = 'Lien du défi copié : colle-le où tu veux.';
  } catch (e) {
    info.textContent = 'Lien du défi : ' + lien;
  }
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('avent');
  if (root) init(root);
}
