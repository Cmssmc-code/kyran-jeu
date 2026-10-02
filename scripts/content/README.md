# Contenu éditorial du blog KYRAN

Chaque article généré est un module ES dans `scripts/content/blog/<slug>.mjs` (export par défaut).
`scripts/generate-blog.mjs` le transforme en `blog/<slug>.html`.
Les faits des jeux tiers (joueurs, durée, âge, prix, image) viennent de `scripts/content/games.json` :
ne les recopiez pas dans l'article.

Valider un article : `node scripts/validate-articles.mjs <slug>` (ou sans argument pour tous).

## Pourquoi cette structure

Audit SEO d'octobre 2026 : ~90 % des phrases étaient communes à plusieurs articles. Google a
classé 30 articles « explorée / détectée, non indexée ». Règle d'or : **aucun paragraphe, aucune
phrase longue ne doit exister dans deux articles**. Chaque fiche jeu est réécrite pour l'angle de
l'article (pourquoi ce jeu à 3 joueurs, pourquoi en terrasse, pourquoi pour un couple…).

## Modèle de données

```js
export default {
  slug: 'jeux-3-joueurs',                  // = nom du fichier
  title: 'Meilleurs jeux de cartes à 3 joueurs',      // titre long (H1 en texte, JSON-LD headline)
  shortTitle: 'Jeux à 3 joueurs',          // ≤ 32 caractères (cartes, navigation)
  metaTitle: 'Jeux à 3 joueurs : 7 jeux qui tiennent la route', // 40–65 caractères, sans « officiel »
  description: '…',                        // 110–160 caractères, promesse concrète
  category: 'Soirée',                      // Apéro | Famille | Cadeaux | Alternatives | Cartes | Soirée
  date: '2026-05-21',                      // date de première publication (fournie dans le brief)
  heroTitle: 'Jeux à <span class="accent">3 joueurs</span>',
  heroSubtitle: '…',
  heroImage: '/blog/images/schotten-totten.jpg',   // une image existante de /blog/images
  heroCaption: '…',
  intro: '<p>…</p>',                       // 80–180 mots, HTML autorisé : <strong>, <a class="text-link">
  criteria: {                              // OBLIGATOIRE, ≥ 300 mots, affiché AVANT la liste
    heading: 'Comment choisir un jeu à trois ?',
    html: '<p>…</p><h3>…</h3><ul><li>…</li></ul>'
  },
  games: [                                 // 5 à 10 jeux selon le sujet (pas 8 partout)
    {
      id: 'skull',                         // clé de games.json, ou 'kyran'
      type: 'Bluff',                       // ≤ 24 caractères, colonne « Type » du tableau
      pick: 'Pour les tables qui aiment bluffer', // ≤ 14 mots, ligne « Pour qui ? »
      paragraphs: ['…', '…'],              // 2 ou 3 paragraphes de 45–110 mots, propres à CET article
    },
  ],
  verdict: {                               // OBLIGATOIRE : avis tranché, 70–150 mots
    heading: 'Notre avis tranché',
    html: '<p>Si vous ne deviez en garder qu’un : …</p>'
  },
  conclusion: '<p>…</p>',                  // 40–120 mots, ne répète pas le verdict
  faq: [                                   // 4 à 6 questions, propres à l'article, réponses 25–70 mots
    { q: '…', a: '…' },
  ],
  related: ['jeux-famille', 'jeux-plis-comparatif', 'alternatives-wizard'], // 3 slugs existants
};
```

Facultatifs : `subtitle` dans un jeu (sous-titre), `extraSections: [{ heading, html }]` pour une
section supplémentaire après la liste (ex. variantes de règles), `guideLinks` (HTML).

Générés automatiquement (ne pas écrire) : tableau comparatif, sommaire, temps de lecture,
`dateModified`, JSON-LD, bloc « À lire aussi », liens BGG / Philibert.

## Contraintes de rédaction

- Français naturel, ton éditorial direct, tutoiement interdit, pas d'emoji.
- **Chaque paragraphe part de l'angle de l'article** : un détail concret (nombre de joueurs idéal,
  mécanique qui compte pour ce besoin, point faible assumé). Pas de phrase générique réutilisable
  ailleurs (« règles simples, explicables en 5 minutes », « un classique incontournable »…).
- Pas de remplissage : si un jeu n'a rien de spécifique à dire pour l'angle, ne le mettez pas.
- Soyez honnête : mentionnez un défaut réel quand il y en a un. Avis tranché ≠ publicité.
- Ne prétendez pas avoir « testé en conditions réelles » ni ne racontez d'anecdotes inventées.
  Parlez de mécaniques, de formats, de ce qu'on peut vérifier. Pas de chiffres inventés
  (ventes, notes, études). Les prix sont ceux de `games.json` (« environ »).
- Ne changez pas les faits de `games.json` (joueurs, durée, âge) ; ne les contredisez pas dans le texte.
- Au moins **3 liens contextuels** dans le texte (intro, critères, fiches, verdict, FAQ) vers :
  `/regle.html`, `/tarot-africain.html`, `/commander.html`, `/minijeu.html`, `/jeu-apero.html`
  ou un autre article du blog (`/blog/<slug>.html`, slug du roster). Format :
  `<a class="text-link" href="/regle.html">règles de KYRAN</a>`. Jamais vers `/blog/index.html` (utiliser `/blog/`).
- Slugs supprimés (fusionnés) : ne jamais les citer en lien — voir `roster.json` (`redirects`).
- Aucune balise `<h1>`/`<h2>` dans les champs HTML ; `<h3>` autorisé dans `criteria.html`.
- Pas de style en ligne, pas d'attribut `onclick`, pas de script.

## KYRAN — faits canoniques (source : /regle.html)

- Jeu de plis avec **pari obligatoire**, 3 à 6 joueurs, environ 30 minutes, dès 8 ans. Auteur et
  éditeur : Corentin Sence. Illustrations : Crea by Floh. Édition française.
- Matériel : 36 cartes Nombre (1 à 36), 1 carte Mystique, 8 cartes Pouvoir, 30 cartes Vie
  (5 par joueur, 1 à 5 étoiles), 7 cartes de règles. Cartes toilées, boîte rigide.
- Chaque manche : on annonce le nombre exact de plis qu'on va gagner. **La somme des paris ne peut
  jamais égaler le nombre de plis** : le dernier à parler ne peut pas « boucler » ; au moins un joueur
  se trompera donc à chaque manche.
- Pari raté : on perd autant de cartes Vie que l'écart entre pari et plis gagnés. Pari juste : rien.
- Manches : 7 → 6 → 5 → 4 → 3 → 2 cartes, puis **manche Mystique** à 1 carte posée sur le front
  (on voit celles des autres, pas la sienne ; on parie 1 ou 0). Le cycle recommence ensuite à 7.
- Fin : dès qu'un joueur a perdu toutes ses vies ; le plus de vies restantes gagne (« Maître des Mystiques »).
- Pouvoirs (valeurs doubles) : Sceau du Destin 27/4 (force un joueur à jouer une carte tirée au hasard
  dans sa main), Clairvoyance Antique 11/23 (regarder en secret la plus forte carte d'un joueur),
  Bénédiction des Ancêtres 20/9 (un joueur doit jouer immédiatement sa plus faible carte),
  Voile du Néant 3/34 (échanger la valeur de sa carte avec une carte déjà posée ce tour).
  Mystique : 0 ou 37 au choix. À 3-4 joueurs, 4 pouvoirs + Mystique seulement ; à 5-6, tout.
- Variante d'initiation : sans cartes Pouvoir ni Mystique.
- Prix : 9,99 € sur kyran-jeu.fr (`/commander.html`), 17,99 € sur Amazon. Dojo gratuit : `/minijeu.html`.
  Règles vidéo : Ludochrono (5 min) sur `/regle.html#video`.
- Il **ne se joue pas à deux**.
- Héritier du Tarot Africain / Whist : `/tarot-africain.html`.
- Ne jamais écrire que KYRAN est « sans élimination » (le premier joueur à zéro vie met fin à la partie),
  ni qu'il se joue « sans hasard » (la donne compte), ni inventer des pouvoirs.
