// Parties entre amis (salle.html) : interface du client. Le serveur est le seul juge : ce fichier
// n'affiche que la vue reçue (déjà filtrée côté serveur) et envoie des intentions (parier, jouer).
// Aucune règle du jeu n'est calculée ici, sauf le pari interdit du dernier parieur (confort :
// le serveur le refuse de toute façon). Bokonon et conseils : absents de la salle.
const API = 'https://kyran-webhook-production.up.railway.app';
const STRIPE = 'https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00';
const CARTES = '/dojo/img/cartes/';
const CLE = 'kyran-salle';
const MAX_ECHECS_FLUX = 6;

const $ = sel => document.querySelector(sel);
const racine = $('#salle');
let session = null; // { code, jeton }
let etat = null;
let source = null;
let echecsFlux = 0;
let ferme = null; // raison de fermeture
let erreur = '';
let finiSignale = false;
let coupDepuis = 0;
let dernierPending = '';
let attente = false;
const choix = { vies: 5, niveau: 'adepte', ordinateurs: 0 };

function track(nom, params) {
  try { if (typeof window.gtag === 'function') window.gtag('event', nom, params || {}); } catch (e) { /* analytique facultative */ }
}

function h(tag, attrs, ...enfants) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const e of enfants.flat()) if (e != null && e !== false) el.append(e.nodeType ? e : document.createTextNode(String(e)));
  return el;
}

// ── Réseau ───────────────────────────────────────────────────────────────

async function appel(chemin, corps) {
  const rep = await fetch(API + chemin, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps || {}) });
  let data = {};
  try { data = await rep.json(); } catch (e) { /* corps vide */ }
  if (!rep.ok) {
    const err = new Error(data.error || (rep.status === 503 ? 'Les parties entre amis ne sont pas ouvertes pour le moment.' : 'Le serveur ne répond pas, réessayez.'));
    err.statut = rep.status;
    throw err;
  }
  return data;
}

function sauver() {
  try { if (session) sessionStorage.setItem(CLE, JSON.stringify(session)); else sessionStorage.removeItem(CLE); } catch (e) { /* stockage indisponible */ }
}

function lireSauvegarde() {
  try { const v = JSON.parse(sessionStorage.getItem(CLE) || 'null'); return v && v.code && v.jeton ? v : null; } catch (e) { return null; }
}

async function ouvrirFlux() {
  if (!session || ferme) return;
  if (source) { source.close(); source = null; }
  try {
    const { billet } = await appel('/salle/billet', { jeton: session.jeton });
    source = new EventSource(`${API}/salle/flux?billet=${encodeURIComponent(billet)}`);
  } catch (e) {
    return reessayerFlux(e);
  }
  source.addEventListener('etat', ev => {
    echecsFlux = 0;
    try { recevoir(JSON.parse(ev.data)); } catch (e) { /* message illisible : ignoré */ }
  });
  source.addEventListener('fermee', ev => {
    let raison = '';
    try { raison = JSON.parse(ev.data).raison; } catch (e) { /* rien */ }
    fermerSalle(raison);
  });
  // Un billet ne sert qu'une fois : en cas de coupure, on en demande un nouveau.
  source.onerror = () => { if (source) { source.close(); source = null; } reessayerFlux(); };
}

function reessayerFlux(e) {
  if (ferme) return;
  if (e && e.statut === 403) return fermerSalle('inconnue');
  echecsFlux++;
  if (echecsFlux > MAX_ECHECS_FLUX) { erreur = 'Connexion perdue. Rechargez la page pour revenir dans la salle.'; dessiner(); return; }
  setTimeout(ouvrirFlux, Math.min(1000 * echecsFlux, 5000));
}

function fermerSalle(raison) {
  ferme = raison || 'fin';
  if (source) { source.close(); source = null; }
  session = null;
  sauver();
  dessiner();
}

function recevoir(e) {
  const pend = e.vue && e.vue.pending ? `${e.vue.pending.type}:${e.vue.pending.pid}:${e.vue.roundNo}` : '';
  if (pend !== dernierPending) { dernierPending = pend; coupDepuis = Date.now(); }
  etat = e;
  erreur = '';
  if (e.vue && e.vue.pending && e.vue.pending.gameOver && !finiSignale) { finiSignale = true; track('salle_partie_finie', { joueurs: e.sieges.length }); }
  dessiner();
}

async function envoyer(chemin, corps) {
  if (attente) return;
  attente = true;
  erreur = '';
  try {
    await appel(chemin, { jeton: session.jeton, ...corps });
  } catch (e) {
    erreur = e.message;
    if (e.statut === 403) return fermerSalle('inconnue');
  } finally {
    attente = false;
    dessiner();
  }
}

const agir = action => envoyer('/salle/action', { action });

// ── Écrans ───────────────────────────────────────────────────────────────

const codeUrl = () => (location.hash || '').replace('#', '').toUpperCase();

async function creerOuRejoindre(code) {
  const champ = $('#sl-pseudo');
  const pseudo = champ ? champ.value.trim() : '';
  if (!pseudo) { erreur = 'Choisissez un pseudo.'; return dessiner(); }
  try { localStorage.setItem('kyran-pseudo', pseudo); } catch (e) { /* rien */ }
  attente = true;
  erreur = '';
  try {
    const r = code ? await appel('/salle/rejoindre', { code, pseudo }) : await appel('/salle/creer', { pseudo });
    if (!code) track('salle_creee');
    session = { code: r.code, jeton: r.jeton };
    sauver();
    location.hash = r.code;
    ferme = null;
    finiSignale = false;
    attente = false;
    await ouvrirFlux();
  } catch (e) {
    attente = false;
    erreur = e.message;
    dessiner();
  }
}

function ecranAccueil() {
  const code = codeUrl();
  let pseudo = '';
  try { pseudo = localStorage.getItem('kyran-pseudo') || ''; } catch (e) { /* rien */ }
  return h('div', { class: 'sl-bloc' },
    h('h2', { text: code ? `Rejoindre la salle ${code}` : 'Jouer entre amis' }),
    h('p', { text: code ? 'Choisissez un pseudo pour entrer dans la salle.' : 'Créez une salle, partagez le lien : jusqu’à 6 joueurs, une partie complète, aucun compte.' }),
    h('label', { for: 'sl-pseudo', text: 'Votre pseudo' }),
    h('input', { id: 'sl-pseudo', maxlength: '20', autocomplete: 'nickname', value: pseudo, onkeydown: ev => { if (ev.key === 'Enter') creerOuRejoindre(code); } }),
    h('button', { class: 'sl-btn sl-btn--ok', type: 'button', disabled: attente, onclick: () => creerOuRejoindre(code), text: code ? 'Rejoindre' : 'Créer une salle' }),
    code ? h('p', { class: 'sl-note' }, h('a', { href: '/salle.html', text: 'Créer une autre salle' })) : null
  );
}

function ecranSalon() {
  const hote = etat.moi === etat.hote;
  const lien = `${location.origin}/salle.html#${etat.code}`;
  const sel = (cle, label, options) => h('label', { class: 'sl-champ' }, label,
    h('select', { onchange: ev => { choix[cle] = cle === 'niveau' ? ev.target.value : Number(ev.target.value); } },
      options.map(([v, t]) => h('option', { value: v, selected: v === choix[cle], text: t }))));
  return h('div', { class: 'sl-bloc' },
    h('h2', { text: `Salle ${etat.code}` }),
    h('p', { text: 'Envoyez ce lien à vos amis (3 joueurs au moins ; l’ordinateur complète si besoin) :' }),
    h('input', { class: 'sl-lien', readonly: true, value: lien, 'aria-label': 'Lien de la salle', onfocus: ev => ev.target.select() }),
    h('button', { class: 'sl-btn', type: 'button', text: 'Copier le lien', onclick: ev => { const b = ev.target; if (navigator.clipboard) navigator.clipboard.writeText(lien).then(() => { b.textContent = 'Lien copié'; }, () => {}); } }),
    h('h3', { text: `Joueurs (${etat.sieges.length}/6)` }),
    h('ul', { class: 'sl-joueurs' }, etat.sieges.map(s => h('li', { text: s.pseudo + (s.pid === etat.hote ? ' · hôte' : '') + (s.pid === etat.moi ? ' · vous' : '') }))),
    hote
      ? h('div', null,
        sel('vies', 'Vies', [[3, '3 vies (express)'], [5, '5 vies'], [7, '7 vies (expert)']]),
        sel('niveau', 'Niveau des ordinateurs', [['novice', 'Novice'], ['adepte', 'Adepte']]),
        sel('ordinateurs', 'Ordinateurs en plus', [[0, 'Aucun'], [1, '1'], [2, '2'], [3, '3']]),
        h('button', { class: 'sl-btn sl-btn--ok', type: 'button', disabled: attente, text: 'Lancer la partie', onclick: () => envoyer('/salle/lancer', { options: { vies: choix.vies, niveau: choix.niveau, ordinateurs: choix.ordinateurs } }) }))
      : h('p', { class: 'sl-note', text: 'En attente de l’hôte…' })
  );
}

function carteEl(c, onclick) {
  let src = CARTES + 'dos.webp';
  let nom = 'carte face cachée';
  if (c) {
    src = c.kind === 'mystique' ? CARTES + 'carte-37.webp' : c.kind === 'power' ? `${CARTES}pouvoir-${c.power}-${c.value}.webp` : `${CARTES}carte-${c.value}.webp`;
    nom = c.kind === 'mystique' ? 'carte Mystique' : c.kind === 'power' ? `pouvoir ${c.power}, valeur ${c.value}` : `carte ${c.value}`;
  }
  const img = h('img', { src, alt: nom, width: '200', height: '297', decoding: 'async', draggable: 'false' });
  if (onclick) return h('button', { class: 'sl-carte sl-carte--bouton', type: 'button', 'aria-label': 'Jouer la ' + nom, onclick, disabled: attente }, img);
  return h('div', { class: 'sl-carte' }, img);
}

const nomDe = pid => (etat.sieges[pid] ? etat.sieges[pid].pseudo : '?');

function pariInterdit(v) {
  const r = v.round;
  if (!r || r.mystic || r.betIdx !== r.betOrder.length - 1) return null;
  const autres = v.players.filter(p => p.id !== v.me && r.participants.includes(p.id)).reduce((s, p) => s + (p.bet || 0), 0);
  const x = r.cards - autres;
  return x >= 0 ? x : null;
}

function panneauDecision(v) {
  const p = v.pending;
  if (!p) return null;
  const moi = etat.moi;
  if (p.type === 'reveal' || p.type === 'next') {
    return h('div', { class: 'sl-decision' },
      h('p', { text: p.type === 'reveal' ? 'Tous les paris sont faits.' : 'Pli terminé.' }),
      h('button', { class: 'sl-btn sl-btn--ok', type: 'button', disabled: attente, text: p.type === 'reveal' ? 'Révéler' : 'Suivant', onclick: () => agir({ type: p.type }) }));
  }
  if (p.pid !== moi) return h('p', { class: 'sl-attend', text: `C’est à ${nomDe(p.pid)} de jouer…` });
  if (p.type === 'bet') {
    const r = v.round;
    const interdit = pariInterdit(v);
    const valeurs = r.mystic ? [0, 1] : Array.from({ length: r.cards + 1 }, (_, i) => i);
    return h('div', { class: 'sl-decision' },
      h('p', { text: r.mystic ? 'Manche Mystique : ta carte est cachée. Gagneras-tu le pli (1) ou non (0) ?' : `Ton pari : combien de plis sur ${r.cards} ?` }),
      h('div', { class: 'sl-paris' }, valeurs.map(b => h('button', { class: 'sl-btn', type: 'button', disabled: attente || b === interdit, title: b === interdit ? 'Interdit : le total des paris ne peut pas égaler le nombre de plis' : null, text: String(b), onclick: () => agir({ type: 'bet', value: b }) }))));
  }
  if (p.type === 'play') return h('div', { class: 'sl-decision' }, h('p', { text: 'À toi : choisis une carte de ta main.' }));
  if (p.type === 'mysticValue') {
    return h('div', { class: 'sl-decision' }, h('p', { text: 'Valeur de ta Mystique : 37 gagne le pli, 0 le perd.' }),
      h('div', { class: 'sl-paris' }, [0, 37].map(x => h('button', { class: 'sl-btn', type: 'button', disabled: attente, text: String(x), onclick: () => agir({ type: 'mysticValue', value: x }) }))));
  }
  if (p.type === 'target') {
    return h('div', { class: 'sl-decision' }, h('p', { text: 'Choisis une cible pour ce pouvoir :' }),
      h('div', { class: 'sl-paris' },
        (p.options || []).map(t => h('button', { class: 'sl-btn', type: 'button', disabled: attente, text: nomDe(t), onclick: () => agir({ type: 'target', target: t }) })),
        p.optional ? h('button', { class: 'sl-btn', type: 'button', disabled: attente, text: 'Personne', onclick: () => agir({ type: 'target', target: null }) }) : null));
  }
  return null;
}

function ecranFin(v) {
  const gagnants = (v.winners || []).map(nomDe);
  return h('div', { class: 'sl-fin' },
    h('p', { class: 'sl-gagnant', text: gagnants.length > 1 ? `Victoire partagée : ${gagnants.join(', ')}` : `${gagnants[0] || 'Quelqu’un'} remporte la partie !` }),
    h('p', { text: 'Une partie complète par salle. Le jeu physique se joue de 3 à 6 joueurs, 30 minutes, dès 8 ans.' }),
    h('a', { class: 'sl-btn sl-btn--ok sl-btn--grand', href: STRIPE, target: '_blank', rel: 'noopener noreferrer', text: 'Commander la boîte · 9,99 €', onclick: () => track('salle_cta_click') }),
    h('p', { class: 'sl-note' }, h('a', { href: '/salle.html', onclick: () => { session = null; sauver(); }, text: 'Nouvelle salle' })));
}

function ecranJeu() {
  const v = etat.vue;
  const moi = etat.moi;
  const pend = v.pending;
  const r = v.round;
  const fini = !!(pend && pend.gameOver) || (v.winners && v.winners.length > 0);
  const monJoueur = v.players[moi];
  const jeuMain = !fini && pend && pend.type === 'play' && pend.pid === moi;
  const titre = fini ? 'Partie terminée' : r ? (r.tiebreak ? 'Départage' : r.mystic ? `Manche ${v.roundNo} · Mystique` : `Manche ${v.roundNo} · ${r.cards} carte${r.cards > 1 ? 's' : ''}`) : 'Partie';
  const posees = v.trick && v.trick.plays ? v.trick.plays : [];
  const main = monJoueur && monJoueur.hand ? monJoueur.hand : [];
  return h('div', { class: 'sl-bloc' },
    h('h2', { text: titre }),
    h('ul', { class: 'sl-scores' }, v.players.map(p => h('li', { class: pend && p.id === pend.pid ? 'sl-actif' : '' },
      h('strong', { text: p.name + (p.id === moi ? ' (vous)' : '') }),
      ` · ${p.lives} vie${p.lives > 1 ? 's' : ''}`,
      p.bet != null ? ` · pari ${p.bet}` : '',
      r && p.bet != null ? ` · ${p.tricks} pli${p.tricks > 1 ? 's' : ''}` : '',
      r && r.mystic && p.id !== moi && p.hand && p.hand.length ? h('span', { class: 'sl-mystique' }, carteEl(p.hand[0])) : null))),
    posees.length ? h('div', { class: 'sl-table', 'aria-label': 'Cartes posées' }, posees.map(j => h('figure', null, carteEl(j.card), h('figcaption', { text: nomDe(j.pid) + (j.card && j.card.kind === 'mystique' && j.value != null ? ` (${j.value})` : '') })))) : null,
    fini ? ecranFin(v) : panneauDecision(v),
    main.length && !(r && r.mystic) ? h('div', { class: 'sl-main' }, main.map(c => carteEl(c, jeuMain ? () => agir({ type: 'play', cardId: c.id }) : null))) : null,
    !fini && pend && pend.pid != null ? h('p', { class: 'sl-note', id: 'sl-minuteur', text: '60 s par coup' }) : null
  );
}

function ecranFerme() {
  const textes = { erreur: 'Une erreur est survenue : la salle a été fermée.', abandon: 'La salle était inactive depuis trop longtemps.', 'sans-humain': 'Plus personne n’était dans la salle.', finie: 'La partie est terminée et la salle a fermé.', duree: 'La salle a atteint sa durée maximale.', inconnue: 'Cette salle n’existe plus.', arret: 'Le serveur redémarre, la salle est fermée.' };
  return h('div', { class: 'sl-bloc' },
    h('h2', { text: 'Salle fermée' }),
    h('p', { text: textes[ferme] || 'La salle est fermée.' }),
    h('p', null, h('a', { class: 'sl-btn sl-btn--ok', href: '/salle.html', text: 'Nouvelle salle' })));
}

function dessiner() {
  const champ = $('#sl-pseudo');
  const valeur = champ ? champ.value : '';
  const avaitFocus = champ && document.activeElement === champ;
  let ecran;
  if (ferme) ecran = ecranFerme();
  else if (!session || !etat) ecran = ecranAccueil();
  else if (etat.statut === 'attente') ecran = ecranSalon();
  else ecran = ecranJeu();
  racine.replaceChildren(ecran, erreur ? h('p', { class: 'sl-erreur', role: 'alert', text: erreur }) : null);
  racine.dataset.etat = ferme ? 'fermee' : !session || !etat ? 'accueil' : etat.statut;
  const nouveau = $('#sl-pseudo');
  if (nouveau && valeur) nouveau.value = valeur;
  if (nouveau && avaitFocus) nouveau.focus();
}

setInterval(() => {
  const m = $('#sl-minuteur');
  if (m && coupDepuis) m.textContent = `${Math.max(0, 60 - Math.floor((Date.now() - coupDepuis) / 1000))} s pour ce coup`;
}, 1000);

async function demarrer() {
  const s = lireSauvegarde();
  const code = codeUrl();
  if (s && (!code || code === s.code)) {
    session = s;
    try {
      recevoir(await appel('/salle/etat', { jeton: s.jeton }));
      await ouvrirFlux();
      return;
    } catch (e) {
      session = null;
      sauver();
    }
  }
  dessiner();
}

window.addEventListener('hashchange', () => { if (!session) dessiner(); });
demarrer();
