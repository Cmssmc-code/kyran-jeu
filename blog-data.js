/* Fichier généré par scripts/generate-blog-infra.mjs — ne pas modifier à la main. */
const BLOG_CATEGORIES = ["Tous","Apéro","Famille","Cadeaux","Alternatives","Cartes","Soirée"];

const BLOG_ITEMS = [
  {
    "slug": "jeux-comme-skyjo",
    "title": "10 jeux comme Skyjo : les meilleures alternatives en 2026",
    "category": "Alternatives",
    "date": "2026-05-01",
    "readMinutes": 12,
    "excerpt": "Jeu style Skyjo, jeux similaires, règles alternatives : 10 jeux classés selon ce que vous aimiez dans Skyjo, plus 5 variantes pour relancer la boîte.",
    "image": "/blog/images/skyjo.jpg",
    "webp": "/blog/images/skyjo.webp",
    "gameCount": 10,
    "related": [
      "alternatives-uno",
      "jeux-sans-elimination",
      "jeux-plis-comparatif"
    ]
  },
  {
    "slug": "meilleurs-jeux-apero",
    "title": "Meilleurs jeux de cartes pour l’apéro : 8 choix selon la table",
    "category": "Apéro",
    "date": "2026-05-03",
    "readMinutes": 10,
    "excerpt": "Quels jeux de cartes sortir à l’apéro ? 8 jeux pour tables encombrées de verres, invités qui arrivent par vagues et règles expliquées en deux minutes.",
    "image": "/blog/images/jungle-speed.jpg",
    "webp": "/blog/images/jungle-speed.webp",
    "gameCount": 8,
    "related": [
      "jeux-soiree-amis",
      "jeux-grands-groupes",
      "jeux-vacances-voyage"
    ]
  },
  {
    "slug": "jeux-soiree-amis",
    "title": "Jeux entre amis : 10 jeux de cartes et d’ambiance pour votre soirée",
    "category": "Soirée",
    "date": "2026-05-05",
    "readMinutes": 12,
    "excerpt": "Quel jeu choisir pour une soirée entre amis ? 10 jeux classés selon le groupe (calme, bruyant, compétitif, mixte) et la durée, avec leurs défauts.",
    "image": "/blog/images/codenames.jpg",
    "webp": "/blog/images/codenames.webp",
    "gameCount": 10,
    "related": [
      "jeux-grands-groupes",
      "jeux-bluff-pari",
      "jeux-debutants-adultes"
    ]
  },
  {
    "slug": "jeux-3-joueurs",
    "title": "Meilleurs jeux de cartes à 3 joueurs : lesquels marchent vraiment à trois",
    "category": "Soirée",
    "date": "2026-05-21",
    "readMinutes": 11,
    "excerpt": "Quel jeu faire à trois ? The Crew, Love Letter et Hanabi en tête, plus cinq autres choix, et les duels à laisser de côté. Ce qui change à trois, jeu par jeu.",
    "image": "/blog/images/the-crew.jpg",
    "webp": "/blog/images/the-crew.webp",
    "gameCount": 8,
    "related": [
      "jeux-coop-cartes",
      "jeux-cartes-4-joueurs",
      "jeux-plis-comparatif"
    ]
  },
  {
    "slug": "science-jeux-de-cartes-cerveau",
    "title": "Jeux de cartes et cerveau : ce que dit la science",
    "category": "Cartes",
    "date": "2026-09-16",
    "readMinutes": 14,
    "excerpt": "Mémoire de travail, prévention cognitive et calcul bayésien : ce que les études médicales prouvent sur les jeux de plis comme KYRAN.",
    "image": "/kyran-cartes-table.webp",
    "gameCount": 0,
    "related": [
      "jeux-plis-comparatif",
      "jeux-memoire-concentration",
      "jeux-bluff-pari"
    ]
  },
  {
    "slug": "jeux-comme-dixit",
    "title": "10 jeux comme Dixit : alternatives créatives et indices malins",
    "category": "Alternatives",
    "date": "2026-06-02",
    "readMinutes": 11,
    "excerpt": "Alternative à Dixit : 10 jeux d’indices, de bluff et d’entente silencieuse, avec pour chacun ce qui rappelle Dixit, ce qui change et le bon nombre de joueurs.",
    "image": "/blog/images/dixit.jpg",
    "webp": "/blog/images/dixit.webp",
    "gameCount": 10,
    "related": [
      "jeux-comme-codenames",
      "jeux-coop-cartes",
      "jeux-bluff-pari"
    ]
  },
  {
    "slug": "jeux-comme-codenames",
    "title": "8 jeux comme Codenames : équipes, indices et déduction",
    "category": "Alternatives",
    "date": "2026-06-04",
    "readMinutes": 9,
    "excerpt": "Alternative à Codenames : 8 jeux d’indices à un mot, d’équipes cachées et de déduction verbale, avec le nombre de joueurs idéal pour chacun.",
    "image": "/blog/images/codenames.jpg",
    "webp": "/blog/images/codenames.webp",
    "gameCount": 8,
    "related": [
      "jeux-comme-dixit",
      "jeux-grands-groupes",
      "jeux-bluff-pari"
    ]
  },
  {
    "slug": "jeux-comme-6-qui-prend",
    "title": "8 jeux comme 6 qui prend ! pour les amateurs de rangées et de coups bas",
    "category": "Alternatives",
    "date": "2026-09-05",
    "readMinutes": 10,
    "excerpt": "Alternative à 6 qui prend : 8 jeux de rangées, de choix secrets et de pénalités, avec ce qu’on perd selon le nombre de joueurs, jusqu’à dix.",
    "image": "/blog/images/6-qui-prend.jpg",
    "webp": "/blog/images/6-qui-prend.webp",
    "gameCount": 8,
    "related": [
      "jeux-comme-skyjo",
      "jeux-grands-groupes",
      "jeux-plis-comparatif"
    ]
  },
  {
    "slug": "jeux-comme-exploding-kittens",
    "title": "8 jeux de cartes comme Exploding Kittens : pièges et coups de théâtre",
    "category": "Alternatives",
    "date": "2026-09-05",
    "readMinutes": 9,
    "excerpt": "Alternative à Exploding Kittens : 8 jeux à pièges, éliminations et coups de théâtre, avec l’âge, le nombre de joueurs et le ton de chacun.",
    "image": "/blog/images/bang.jpg",
    "webp": "/blog/images/bang.webp",
    "gameCount": 8,
    "related": [
      "jeux-bluff-pari",
      "jeux-soiree-amis",
      "meilleurs-jeux-apero"
    ]
  },
  {
    "slug": "alternatives-wizard",
    "title": "Alternatives à Wizard : 6 jeux de plis pour changer de rythme",
    "category": "Alternatives",
    "date": "2026-05-15",
    "readMinutes": 10,
    "excerpt": "Lassé de Wizard ? Six jeux de plis qui gardent l'annonce ou changent la donne : Oh Hell, KYRAN, The Crew, 6 qui prend !, Parade et Skull.",
    "image": "/blog/images/wizard.jpg",
    "webp": "/blog/images/wizard.webp",
    "gameCount": 6,
    "related": [
      "jeux-plis-comparatif",
      "jeux-bluff-pari",
      "jeux-coop-cartes"
    ]
  },
  {
    "slug": "alternatives-uno",
    "title": "Alternatives à Uno : 8 jeux de cartes rapides pour changer",
    "category": "Alternatives",
    "date": "2026-05-17",
    "readMinutes": 10,
    "excerpt": "Uno vous lasse ? Huit jeux de cartes rapides, du réflexe aux coups bas et au bluff : Jungle Speed, Llama, Skyjo, Saboteur, KYRAN et d'autres.",
    "image": "/blog/images/uno.jpg",
    "webp": "/blog/images/uno.webp",
    "gameCount": 8,
    "related": [
      "jeux-famille",
      "meilleurs-jeux-apero",
      "jeux-grands-groupes"
    ]
  },
  {
    "slug": "alternatives-belote-coinche",
    "title": "Alternatives à la belote et à la coinche : 6 jeux de plis modernes",
    "category": "Alternatives",
    "date": "2026-09-05",
    "readMinutes": 9,
    "excerpt": "Envie de varier de la belote ou de la coinche ? Six jeux de plis modernes pour 3 à 6 joueurs, avec atout, annonces ou coopération : comment choisir.",
    "image": "/blog/images/wizard.jpg",
    "webp": "/blog/images/wizard.webp",
    "gameCount": 6,
    "related": [
      "jeux-plis-comparatif",
      "alternatives-wizard",
      "jeux-cartes-4-joueurs"
    ]
  },
  {
    "slug": "jeux-plis-comparatif",
    "title": "Jeux de plis : le comparatif et le guide pour bien choisir",
    "category": "Alternatives",
    "date": "2026-05-29",
    "readMinutes": 9,
    "excerpt": "Un jeu de cartes où l'on annonce son nombre de plis ? Comparatif de six jeux de plis (Wizard, Oh Hell, KYRAN, The Crew…) et guide du vocabulaire.",
    "image": "/blog/images/wizard.jpg",
    "webp": "/blog/images/wizard.webp",
    "gameCount": 6,
    "related": [
      "alternatives-wizard",
      "alternatives-belote-coinche",
      "jeux-bluff-pari"
    ]
  },
  {
    "slug": "jeux-bluff-pari",
    "title": "Jeux de bluff, de pari et de rôles cachés : 8 jeux de cartes à tester",
    "category": "Cartes",
    "date": "2026-05-23",
    "readMinutes": 10,
    "excerpt": "Bluff pur, pari sur ses plis ou traîtres cachés : huit jeux de cartes pour chaque type de tension, de Skull et Coup à Saboteur, Bang! et KYRAN.",
    "image": "/boite-recto-kyran.jpg",
    "webp": "/boite-recto-kyran.webp",
    "gameCount": 8,
    "related": [
      "jeux-soiree-amis",
      "jeux-plis-comparatif",
      "jeux-sans-elimination"
    ]
  },
  {
    "slug": "jeux-brise-glace-afterwork",
    "title": "Jeux brise-glace pour afterwork et soirées d’équipe : 8 jeux de cartes",
    "category": "Soirée",
    "date": "2026-09-05",
    "readMinutes": 9,
    "excerpt": "Jeux brise-glace pour afterwork et soirées d’équipe : 8 jeux de cartes sans gêne, expliqués en trois minutes, classés du moins au plus exposant.",
    "image": "/blog/images/just-one.jpg",
    "webp": "/blog/images/just-one.webp",
    "gameCount": 8,
    "related": [
      "jeux-debutants-adultes",
      "jeux-30-minutes",
      "jeux-soiree-amis"
    ]
  },
  {
    "slug": "jeux-grands-groupes",
    "title": "Jeux pour grands groupes : 9 jeux de cartes de 7 à 10 joueurs et plus",
    "category": "Apéro",
    "date": "2026-06-12",
    "readMinutes": 10,
    "excerpt": "Quels jeux choisir à 8 joueurs ou plus ? 9 jeux de cartes qui passent à l’échelle, avec le plafond de joueurs de chacun et la limite de KYRAN (6).",
    "image": "/blog/images/6-qui-prend.jpg",
    "webp": "/blog/images/6-qui-prend.webp",
    "gameCount": 9,
    "related": [
      "jeux-soiree-amis",
      "meilleurs-jeux-apero",
      "jeux-cartes-6-joueurs"
    ]
  },
  {
    "slug": "cadeau-noel",
    "title": "Jeux de cartes à offrir à Noël : 8 idées selon le destinataire",
    "category": "Cadeaux",
    "date": "2026-05-11",
    "readMinutes": 11,
    "excerpt": "Quel jeu offrir à Noël ? Huit idées classées par destinataire (tablée familiale, ado, couple, collègue), avec durée de partie et budget.",
    "image": "/blog/images/hanabi.jpg",
    "webp": "/blog/images/hanabi.webp",
    "gameCount": 8,
    "related": [
      "cadeau-anniversaire",
      "jeux-famille",
      "jeux-duo-couples"
    ]
  },
  {
    "slug": "cadeau-anniversaire",
    "title": "Jeux de cartes à offrir pour un anniversaire : 8 idées selon le budget",
    "category": "Cadeaux",
    "date": "2026-05-09",
    "readMinutes": 10,
    "excerpt": "Quel jeu offrir pour un anniversaire ? Huit idées triées par budget, du petit cadeau à la cagnotte collective, jouables dès le soir même.",
    "image": "/blog/images/love-letter.jpg",
    "webp": "/blog/images/love-letter.webp",
    "gameCount": 8,
    "related": [
      "cadeau-noel",
      "jeux-soiree-amis",
      "jeux-cartes-pas-chers"
    ]
  },
  {
    "slug": "jeux-cartes-pas-chers",
    "title": "Jeux de cartes pas chers : 8 jeux à moins de 20 € qui se rejouent",
    "category": "Cartes",
    "date": "2026-05-13",
    "readMinutes": 10,
    "excerpt": "Huit jeux de cartes à moins de 20 €, jugés sur le rapport qualité-prix et la rejouabilité : prix, nombre de joueurs et défauts de chacun.",
    "image": "/blog/images/uno.jpg",
    "webp": "/blog/images/uno.webp",
    "gameCount": 8,
    "related": [
      "cadeau-anniversaire",
      "jeux-30-minutes",
      "alternatives-uno"
    ]
  },
  {
    "slug": "jeux-30-minutes",
    "title": "Jeux de cartes de 30 minutes ou moins : 9 parties express",
    "category": "Soirée",
    "date": "2026-05-19",
    "readMinutes": 10,
    "excerpt": "Neuf jeux de cartes de 15 à 30 minutes, triés par durée : explication, nombre de joueurs et enchaînement de manches pour des soirées express.",
    "image": "/blog/images/skyjo.jpg",
    "webp": "/blog/images/skyjo.webp",
    "gameCount": 9,
    "related": [
      "jeux-vacances-voyage",
      "jeux-soiree-amis",
      "jeux-brise-glace-afterwork"
    ]
  },
  {
    "slug": "jeux-vacances-voyage",
    "title": "Jeux de cartes pour les vacances et le voyage : 9 jeux à emporter",
    "category": "Cartes",
    "date": "2026-05-27",
    "readMinutes": 10,
    "excerpt": "Neuf jeux de cartes compacts pour la plage, le camping, la terrasse ou le train : encombrement, vent, parties reprises et jeux addictifs.",
    "image": "/blog/images/love-letter.jpg",
    "webp": "/blog/images/love-letter.webp",
    "gameCount": 9,
    "related": [
      "jeux-cartes-pas-chers",
      "jeux-30-minutes",
      "jeux-duo-couples"
    ]
  },
  {
    "slug": "jeux-famille",
    "title": "Jeux de société en famille : 8 jeux de cartes dès 8 ans",
    "category": "Famille",
    "date": "2026-05-07",
    "readMinutes": 11,
    "excerpt": "Dixit, Timeline, Dobble, Skyjo… 8 jeux de cartes où enfants et adultes jouent à armes égales, avec des parties qui finissent avant le coucher.",
    "image": "/blog/images/dixit.jpg",
    "webp": "/blog/images/dixit.webp",
    "gameCount": 8,
    "related": [
      "jeux-debutants-adultes",
      "jeux-30-minutes",
      "jeux-coop-cartes"
    ]
  },
  {
    "slug": "jeux-debutants-adultes",
    "title": "Jeux de société pour débutants adultes : par où commencer",
    "category": "Famille",
    "date": "2026-05-25",
    "readMinutes": 10,
    "excerpt": "Pli, pioche, défausse, draft : le jargon traduit, puis 8 jeux de cartes faciles rangés en trois étapes pour apprendre sans se sentir perdu.",
    "image": "/blog/images/timeline.jpg",
    "webp": "/blog/images/timeline.webp",
    "gameCount": 8,
    "related": [
      "jeux-famille",
      "jeux-cartes-adultes",
      "jeux-soiree-amis"
    ]
  },
  {
    "slug": "jeux-sans-elimination",
    "title": "Jeux de cartes sans élimination : 8 jeux où l’on joue jusqu’au bout",
    "category": "Famille",
    "date": "2026-06-14",
    "readMinutes": 9,
    "excerpt": "Personne ne regarde les autres jouer : 8 jeux de cartes sans joueur éliminé, avec pour chacun la condition exacte qui met fin à la partie.",
    "image": "/blog/images/skyjo.jpg",
    "webp": "/blog/images/skyjo.webp",
    "gameCount": 8,
    "related": [
      "jeux-famille",
      "jeux-coop-cartes",
      "jeux-comme-skyjo"
    ]
  },
  {
    "slug": "jeux-coop-cartes",
    "title": "Jeux de cartes coopératifs : Hanabi, The Crew et 5 autres",
    "category": "Famille",
    "date": "2026-06-08",
    "readMinutes": 10,
    "excerpt": "Hanabi, The Crew, The Mind, The Game, Letter Jam, Just One : 7 jeux de cartes coopératifs comparés selon la façon dont on a le droit de communiquer.",
    "image": "/blog/images/the-crew.jpg",
    "webp": "/blog/images/the-crew.webp",
    "gameCount": 7,
    "related": [
      "jeux-plis-comparatif",
      "jeux-memoire-concentration",
      "jeux-famille"
    ]
  },
  {
    "slug": "jeux-memoire-concentration",
    "title": "Jeux de cartes de mémoire et de concentration : 8 choix",
    "category": "Famille",
    "date": "2026-06-30",
    "readMinutes": 9,
    "excerpt": "Compter les cartes, retenir une défausse, tenir un rythme : 8 jeux de cartes qui sollicitent l’attention, classés selon ce qu’ils font retenir.",
    "image": "/blog/images/the-mind.jpg",
    "webp": "/blog/images/the-mind.webp",
    "gameCount": 8,
    "related": [
      "science-jeux-de-cartes-cerveau",
      "jeux-strategie-legere",
      "jeux-coop-cartes"
    ]
  },
  {
    "slug": "jeux-duo-couples",
    "title": "Jeux de cartes à deux : 8 idées pour un duo ou un couple",
    "category": "Soirée",
    "date": "2026-06-10",
    "readMinutes": 10,
    "excerpt": "Duel ou coopération ? Lost Cities, The Crew, Love Letter et cinq autres jeux de cartes pour deux, avec le format qui convient à une soirée calme en couple.",
    "image": "/blog/images/lost-cities.jpg",
    "webp": "/blog/images/lost-cities.webp",
    "gameCount": 8,
    "related": [
      "jeux-3-joueurs",
      "jeux-coop-cartes",
      "jeux-strategie-legere"
    ]
  },
  {
    "slug": "jeux-cartes-4-joueurs",
    "title": "Meilleurs jeux de cartes à 4 joueurs : en équipes ou chacun pour soi",
    "category": "Cartes",
    "date": "2026-09-05",
    "readMinutes": 10,
    "excerpt": "Deux contre deux ou chacun pour soi ? Codenames, The Crew, Wizard, KYRAN et quatre autres jeux de cartes pour une table de quatre, avec ce qui change à ce format.",
    "image": "/blog/images/love-letter.jpg",
    "webp": "/blog/images/love-letter.webp",
    "gameCount": 8,
    "related": [
      "jeux-3-joueurs",
      "jeux-cartes-5-joueurs",
      "alternatives-belote-coinche"
    ]
  },
  {
    "slug": "jeux-cartes-5-joueurs",
    "title": "Meilleurs jeux de cartes à 5 joueurs : ceux qui ne traînent pas",
    "category": "Cartes",
    "date": "2026-09-05",
    "readMinutes": 10,
    "excerpt": "À cinq, la table est impaire et les tours s'allongent. 6 qui prend !, For Sale, Saboteur, KYRAN : 8 jeux de cartes vraiment calibrés pour cinq joueurs.",
    "image": "/blog/images/skull.jpg",
    "webp": "/blog/images/skull.webp",
    "gameCount": 8,
    "related": [
      "jeux-cartes-4-joueurs",
      "jeux-cartes-6-joueurs",
      "jeux-bluff-pari"
    ]
  },
  {
    "slug": "jeux-strategie-legere",
    "title": "Jeux de cartes de stratégie légère : de vraies décisions, des règles courtes",
    "category": "Cartes",
    "date": "2026-06-18",
    "readMinutes": 10,
    "excerpt": "Lost Cities, Schotten Totten, Parade, Oh Hell!, KYRAN : 8 jeux de cartes classés par profondeur et par part de chance, avec des règles qui tiennent en dix minutes.",
    "image": "/blog/images/star-realms.jpg",
    "webp": "/blog/images/star-realms.webp",
    "gameCount": 8,
    "related": [
      "jeux-plis-comparatif",
      "jeux-duo-couples",
      "jeux-draft-encheres"
    ]
  },
  {
    "slug": "jeux-draft-encheres",
    "title": "Jeux de draft et d'enchères en cartes : choisir, passer, miser",
    "category": "Cartes",
    "date": "2026-06-24",
    "readMinutes": 9,
    "excerpt": "Sushi Go!, For Sale, No Thanks!, Skull, KYRAN : draft ou enchères, que change chaque mécanique ? Sept jeux de cartes comparés, des plus légers aux plus tendus.",
    "image": "/blog/images/for-sale.jpg",
    "webp": "/blog/images/for-sale.webp",
    "gameCount": 7,
    "related": [
      "jeux-strategie-legere",
      "jeux-plis-comparatif",
      "jeux-cartes-5-joueurs"
    ]
  },
  {
    "slug": "jeux-cartes-6-joueurs",
    "title": "Top 8 des jeux de cartes à 6 joueurs sans temps mort",
    "category": "Cartes",
    "date": "2026-09-11",
    "readMinutes": 13,
    "excerpt": "Finis les tours interminables : 8 jeux de cartes pour 6 joueurs alliant bluff, rapidité et fous rires.",
    "image": "/blog/images/6-qui-prend.jpg",
    "webp": "/blog/images/6-qui-prend.webp",
    "gameCount": 8,
    "related": [
      "jeux-cartes-5-joueurs",
      "jeux-cartes-4-joueurs",
      "meilleurs-jeux-apero"
    ]
  },
  {
    "slug": "jeux-cartes-adultes",
    "title": "Top 8 des meilleurs jeux de cartes pour adultes",
    "category": "Soirée",
    "date": "2026-09-11",
    "readMinutes": 14,
    "excerpt": "Tension psychologique, bluff, tactique et retournements : 8 jeux de cartes modernes pour adultes.",
    "image": "/blog/images/coup.jpg",
    "webp": "/blog/images/coup.webp",
    "gameCount": 8,
    "related": [
      "jeux-soiree-amis",
      "jeux-cartes-6-joueurs",
      "meilleurs-jeux-apero"
    ]
  }
];

function getBlogItem(slug) {
  return BLOG_ITEMS.find(function (item) { return item.slug === slug; });
}

function getBlogUrl(slug) {
  return '/blog/' + slug + '.html';
}

function getRelatedArticles(slug, limit) {
  var item = getBlogItem(slug);
  if (!item || !item.related) return BLOG_ITEMS.slice(0, limit || 3);
  return item.related.map(function (relSlug) {
    return getBlogItem(relSlug);
  }).filter(Boolean).slice(0, limit || 3);
}

function formatBlogDate(isoDate) {
  var parts = isoDate.split('-');
  var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}
