/*
 * « Quel pli gagne ? » (quel-pli-gagne.html) : 3 plis de KYRAN, 4 cartes posées ; le joueur
 * touche la carte qui remporte le pli, puis la réponse et la règle s'affichent.
 *
 * Plis écrits par le game designer (documents/idees/quel-pli-gagne-plis-2026-11-26.md) ; chaque
 * gagnant est vérifié avec le moteur de l'Initiation (bestPlay de dojo/engine.js) par
 * scripts/test/pli.test.mjs.
 * Aucune donnée de joueur : rien n'est envoyé ni gardé (pas de stockage).
 * L'interface ne démarre que dans une page qui contient #pli.
 */
import { cardById, POWERS } from './engine.js?v=617bc536b5';

/**
 * Format d'un pli :
 *   cartes  4 poses dans l'ordre : { id, valeur? } ; id du moteur (n1 à n36, m, p<valeur>) ;
 *           valeur seulement pour la Mystique (0 ou 37, choisie par celui qui la pose)
 *   gagnant index (0 à 3) de la carte qui remporte le pli
 *   regle   la règle, en mots simples
 */
export const PLIS = [
  {
    titre: 'Pli 1 : le 31 qui se croit tranquille',
    cartes: [{ id: 'n31' }, { id: 'n36' }, { id: 'n8' }, { id: 'n17' }],
    gagnant: 1,
    regle: 'On ne regarde que le nombre : la plus grande carte gagne. Pas de couleur à suivre, pas d’atout. Le 36 remporte le pli.'
  },
  {
    titre: 'Pli 2 : le 36 est-il imbattable ?',
    cartes: [{ id: 'n36' }, { id: 'n29' }, { id: 'n12' }, { id: 'm', valeur: 37 }],
    gagnant: 3,
    regle: 'La carte Mystique vaut 0 ou 37, au choix de celui qui la pose. Ici elle vaut 37 : elle bat même le 36. Posée à 0, c’est le 36 qui aurait gagné.'
  },
  {
    titre: 'Pli 3 : égalité à 11',
    cartes: [{ id: 'n11' }, { id: 'n9' }, { id: 'n5' }, { id: 'p11' }],
    gagnant: 3,
    regle: 'La plus grande carte gagne. Si deux cartes ont le même nombre, la carte spéciale (la carte Pouvoir) gagne, même posée en dernier : la Clairvoyance Antique bat le 11.'
  }
];

/** Poses au format du moteur (pour bestPlay). */
export function posesDuPli(pli) {
  return pli.cartes.map((c, i) => {
    const card = cardById(c.id);
    return { pid: i, card, value: card.kind === 'mystique' ? c.valeur : card.value, order: i };
  });
}

/** Repère d'achat transmis à Stripe (client_reference_id). */
export const REF_ACHAT = 'quel-pli';
export const LIEN_ACHAT = '/commander.html?ref=' + REF_ACHAT;

// ── Interface ──────────────────────────────────────────────────────────────

const CARD_DIR = '/dojo/img/cartes/';
const rang = i => (i + 1) + (i === 0 ? 're' : 'e');

function cardImage(card) {
  if (card.kind === 'mystique') return CARD_DIR + 'carte-37.webp';
  if (card.kind === 'power') return `${CARD_DIR}pouvoir-${card.power}-${card.value}.webp`;
  return `${CARD_DIR}carte-${card.value}.webp`;
}

function cardName(c) {
  const card = cardById(c.id);
  if (card.kind === 'mystique') return 'carte Mystique, posée à ' + c.valeur;
  if (card.kind === 'power') return `${POWERS[card.power].name}, carte Pouvoir de valeur ${card.value}`;
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

function carteBouton(c, i, onChoix) {
  const card = cardById(c.id);
  const img = h('img', { src: cardImage(card), alt: '', width: 200, height: 297, decoding: 'async', draggable: 'false' });
  const visuel = h('span', { class: 'av-carte est-' + card.kind }, [
    img,
    h('span', { class: 'av-carte-repli', 'aria-hidden': 'true', text: card.kind === 'mystique' ? 'M' : String(card.value) })
  ]);
  img.addEventListener('error', () => visuel.classList.add('sans-image'));
  const notes = [h('span', { class: 'pli-note', text: rang(i) + ' posée' })];
  if (card.kind === 'mystique') notes.push(h('span', { class: 'pli-valeur', text: 'vaut 37' }));
  if (card.kind === 'power') notes.push(h('span', { class: 'pli-valeur', text: 'Pouvoir 11' }));
  const btn = h('button', { type: 'button', class: 'pli-carte', 'aria-label': `${rang(i)} carte posée : ${cardName(c)}` }, [visuel, ...notes]);
  btn.addEventListener('click', () => onChoix(i));
  return btn;
}

function demarrer(racine) {
  let n = 0;
  let score = 0;

  function afficher() {
    racine.replaceChildren();
    racine.setAttribute('aria-busy', 'false');
    if (n >= PLIS.length) return fin();
    const pli = PLIS[n];
    const verdict = h('div', { class: 'av-verdict', 'aria-live': 'polite' });
    const boutons = pli.cartes.map((c, i) => carteBouton(c, i, repondre));
    racine.append(h('div', { class: 'av-defi' }, [
      h('p', { class: 'av-meta', text: `Pli ${n + 1} sur ${PLIS.length} · score ${score}` }),
      h('h2', { class: 'av-titre', text: pli.titre }),
      h('p', { class: 'av-question', text: 'Quelle carte remporte le pli ? Touche-la.' }),
      h('div', { class: 'pli-table' }, boutons),
      verdict
    ]));

    function repondre(choix) {
      const ok = choix === pli.gagnant;
      if (ok) score++;
      boutons.forEach((b, i) => {
        b.disabled = true;
        if (i === pli.gagnant) b.classList.add('est-gagnant');
        else if (i === choix) b.classList.add('est-rate');
      });
      const suite = h('button', { type: 'button', class: 'btn btn-primary', text: n + 1 < PLIS.length ? 'Pli suivant' : 'Voir mon score' });
      suite.addEventListener('click', () => { n++; afficher(); racine.scrollIntoView({ block: 'start' }); });
      verdict.append(
        h('p', { class: 'av-resultat ' + (ok ? 'est-ok' : 'est-ko'), text: ok ? 'Bien vu !' : `Raté : c’est la ${rang(pli.gagnant)} carte, entourée en vert.` }),
        h('p', { class: 'av-explication', text: pli.regle }),
        h('div', { class: 'av-actions' }, suite)
      );
      suite.focus();
    }
  }

  function fin() {
    const rejouer = h('button', { type: 'button', class: 'btn btn-secondary', text: 'Rejouer les 3 plis' });
    rejouer.addEventListener('click', () => { n = 0; score = 0; afficher(); });
    racine.append(h('div', { class: 'av-defi' }, [
      h('h2', { class: 'av-titre', text: `Ton score : ${score} sur ${PLIS.length}` }),
      h('p', { text: score === PLIS.length ? 'Sans faute. Prêt pour une vraie manche ?' : 'Les pièges sont là pour ça. Une vraie manche t’attend dans l’Initiation.' }),
      h('div', { class: 'av-actions' }, [
        h('a', { class: 'btn btn-primary', href: '/minijeu.html', text: 'Jouer une manche dans l’Initiation' }),
        h('a', { class: 'btn btn-secondary', href: LIEN_ACHAT, text: 'Acheter le jeu KYRAN (9,99 €)' }),
        rejouer
      ])
    ]));
  }

  afficher();
}

if (typeof document !== 'undefined') {
  const racine = document.getElementById('pli');
  if (racine) demarrer(racine);
}
