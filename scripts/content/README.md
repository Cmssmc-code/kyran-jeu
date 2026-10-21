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

Facultatifs : `subtitle` dans un jeu (sous-titre), `extraSections: [{ id?, heading, html }]` pour une
section supplémentaire après la liste (ex. variantes de règles), `guideLinks` (HTML).

`id` (facultatif, sur une `extraSections` ou un `layout.groups`) fixe l'ancre de la section
(`[a-z0-9-]`, sinon `section-N` / `groupe-N`). Il sert de cible aux anciennes URL fusionnées :
`roster.json` → `redirects` peut viser `/blog/<slug>.html#<id>` (la canonique du stub reste sans
ancre). `check-site` vérifie que l'ancre existe : **ne pas renommer ni retirer un `id` visé**.

### Structure propre à chaque article (`layout`, `headings`)

Audit Search Console du 4 octobre 2026 : les articles non indexés partageaient tous le même gabarit
(mêmes H2, 8 jeux, ~33 liens externes). Chaque article doit avoir **sa** structure :

```js
layout: {
  answerFirst: true,        // l'avis tranché juste après l'intro (réponse directe)
  criteriaAfter: true,      // les critères de choix après la sélection (guide de lecture)
  criteriaShort: 'Méthode', // libellé court des critères dans la barre de navigation
  compare: false,           // pas de tableau ; ou { position: 'after' } (après les fiches)
  numbered: false,          // fiches sans numéro 01, 02…
  summaryBox: false,        // pas d'encadré « En bref »
  shopLinks: true,          // lien boutique (Philibert) au lieu de BoardGameGeek : guides d'achat
  groups: [                 // fiches regroupées sous des H2 thématiques (≥ 2 groupes,
    { heading: '…', html: '<p>…</p>', ids: ['the-crew', 'hanabi'] }, // chaque jeu une seule fois)
    { heading: '…', ids: ['love-letter', 'kyran'] }
  ]
},
headings: { selection: '…', compare: '…', conclusion: '…', faq: '…', related: '…' } // libellés H2
```

Varier aussi `verdict.heading`, `criteria.heading` et le nombre de jeux (5 à 10, pas 8 partout).
Chaque fiche tierce n'a qu'**un** lien externe (BoardGameGeek, ou la boutique avec `shopLinks`).

### Contenu de première main (fourni par l'auteur, jamais rédigé à sa place)

- `authorNote: { html, provided: 'AAAA-MM-JJ', date?, heading? }` : mot signé de l'auteur de KYRAN
  (bloc « Le mot de l'auteur »). `provided` = date à laquelle l'auteur a fourni le texte ; le
  validateur refuse un `authorNote` sans cette date.
- `photos: [{ src, alt, caption }]` : photos de parties réelles, fichiers hébergés sur le site
  (ex. `/blog/images/parties/<fichier>.jpg`), crédit dans `caption`.
- Retours de test chiffrés (durée mesurée, nombre de joueurs) : uniquement s'ils sont fournis par
  l'auteur, dans `authorNote` ou une `extraSections`, avec leur source.

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

## Format « essai » : articles qui ne sont pas des guides de jeux

Pour une étude, une histoire, une analyse, un décryptage de règles ou l'actualité du secteur
(voir `docs/BLOG-PASSES.md` § 3), ajoutez `format: 'essai'` : plus de `games`, `criteria` ni `verdict`.
Modèle de référence pour le ton et la rigueur : l'article rédigé à la main
`blog/science-jeux-de-cartes-cerveau.html` (références avec DOI, limites des études, aucune promesse).

```js
export default {
  slug: 'histoire-du-whist',
  format: 'essai',
  title, shortTitle, metaTitle, description, category, date, heroTitle, heroSubtitle, heroImage, heroCaption,
  intro: '<p>…</p>',                      // 70–200 mots, la réponse d'abord
  keyPoints: { heading?: 'En bref', html: '<ul><li>…</li></ul>' },   // 3 à 5 points sourcés
  sections: [                             // 4 à 10 sections, ≥ 150 mots chacune ; <h3> autorisé
    { id?: 'origines', heading: '…', html: '<p>…</p>' }
  ],
  photos: [{ src: '/blog/images/…', alt: '…', caption: '… (auteur, licence, lien)' }],  // 1 à 4, créditées
  sources: [{ label: 'Auteur, titre, revue (année)', url: 'https://…', note?: 'ce que la source établit' }],  // ≥ 5
  conclusion: '<p>…</p>',                 // 35–160 mots
  faq: [{ q: '… ?', a: '…' }],            // 4 à 6
  related: ['slug-1', 'slug-2', 'slug-3'],
  headings: { sources?, conclusion?, faq?, related? }   // libellés de section facultatifs
};
```

### Jeu de données ouvert (`dataset`) : devenir une source citable

Un article « essai » peut publier ses propres données, consolidées et vérifiées, pour que moteurs de
recherche et IA les citent (voir `docs/BLOG-PASSES.md` § 3). Fichiers sous `data/<slug>/` (CSV UTF-8 ou JSON),
déclarés dans l'article :

```js
dataset: {
  description: '…',                       // ce que contient le jeu de données
  methodology: '…',                       // comment les valeurs ont été relevées, contrôlées, calculées
  update: 'mensuelle',                    // fréquence de mise à jour
  license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  lastVerified: '2026-10-21',             // date du dernier contrôle (≥ la plus récente ligne)
  files: [{ path: '/data/<slug>/jeux.csv', format: 'csv', description: '…' }]
}
```

Règle d'exactitude, vérifiée par `validate-articles.mjs` : **chaque ligne porte `source_url` (https) et
`verifie_le` (AAAA-MM-JJ, jamais dans le futur)**, 5 lignes au moins, colonnes cohérentes. Une valeur qu'on
n'a pas pu contrôler ne s'écrit pas : on laisse la case vide et on le dit dans la méthode. Le build ajoute à la page
un bloc « Les données, en accès libre » (fichiers, méthode, licence, date, citation) et un nœud JSON-LD `Dataset`.
Une passe de rafraîchissement met à jour les lignes (nouvelle `verifie_le`) plutôt que d'en écrire de nouvelles.

Règles : 1 500 mots minimum ; au moins 3 liens internes et 4 liens externes vers les sources dans le texte ;
les sources de la liste ont été réellement ouvertes ; les limites de ce qu'on peut conclure sont dites.
`node scripts/validate-articles.mjs <slug>` applique ces contrôles ; le build produit page, sitemap, flux et
`llms.txt` comme pour les autres articles. Pas d'encart « Notre jeu » en tête, seulement en fin d'article.

## KYRAN — faits canoniques (source : /regle.html)

- Jeu de plis avec **pari obligatoire**, 3 à 6 joueurs, environ 30 minutes, dès 8 ans. Auteur et
  éditeur : Corentin Sence. Illustrations : Crea by Floh. Édition française.
- Matériel : 36 cartes Nombre (1 à 36), 1 carte Mystique, 8 cartes Pouvoir, 30 cartes Vie
  (5 par joueur, 1 à 5 étoiles), 7 cartes de règles (confirmé par l'éditeur). Cartes toilées, boîte rigide. Sortie : 31 janvier 2026.
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
- Prix : 9,99 € sur kyran-jeu.fr (`/commander.html`), 17,99 € sur Amazon. Initiation gratuite : `/minijeu.html`.
  Règles vidéo : Ludochrono (5 min) sur la page de lecture `/video-regles.html`.
- Il **ne se joue pas à deux**.
- Héritier du Tarot Africain / Whist : `/tarot-africain.html`.
- Ne jamais écrire que KYRAN est « sans élimination » (le premier joueur à zéro vie met fin à la partie),
  ni qu'il se joue « sans hasard » (la donne compte), ni inventer des pouvoirs.
