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
    "title": "Meilleurs jeux de cartes pour l’apéro et l’afterwork : 9 choix selon la table",
    "category": "Apéro",
    "date": "2026-05-03",
    "readMinutes": 13,
    "excerpt": "Quels jeux de cartes sortir à l’apéro ou en afterwork ? 9 jeux brise-glace pour tables encombrées, arrivées par vagues et collègues qui se connaissent peu.",
    "image": "/blog/images/jungle-speed.jpg",
    "webp": "/blog/images/jungle-speed.webp",
    "gameCount": 9,
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
    "excerpt": "Quel jeu faire à trois ? The Crew, Hanabi et The Mind pour coopérer, Love Letter, KYRAN et Sushi Go! pour s'affronter, et que faire des jeux à deux.",
    "image": "/blog/images/the-crew.jpg",
    "webp": "/blog/images/the-crew.webp",
    "gameCount": 6,
    "related": [
      "jeux-duo-couples",
      "jeux-cartes-4-joueurs",
      "jeux-cartes-6-joueurs"
    ]
  },
  {
    "slug": "science-jeux-de-cartes-cerveau",
    "title": "Jeux de cartes et cerveau : ce que disent les études",
    "category": "Cartes",
    "date": "2026-09-16",
    "readMinutes": 14,
    "excerpt": "Mémoire de travail, fonctions exécutives, cohortes PAQUID et Lothian : ce que les études observent sur les jeux de cartes, et ce qu’elles ne prouvent pas.",
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
    "image": "/kyran-cartes-pouvoirs.webp",
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
    "title": "6 jeux de cartes comme Exploding Kittens : pièges et coups de théâtre",
    "category": "Alternatives",
    "date": "2026-09-05",
    "readMinutes": 8,
    "excerpt": "Alternative à Exploding Kittens : 6 jeux à pièges, éliminations et coups de théâtre, avec l’âge, le nombre de joueurs et le ton de chacun.",
    "image": "/blog/images/bang.jpg",
    "webp": "/blog/images/bang.webp",
    "gameCount": 6,
    "related": [
      "jeux-bluff-pari",
      "jeux-soiree-amis",
      "jeux-sans-elimination"
    ]
  },
  {
    "slug": "alternatives-wizard",
    "title": "Alternatives à Wizard : 6 jeux qui gardent l’annonce, ou autre chose",
    "category": "Alternatives",
    "date": "2026-05-15",
    "readMinutes": 11,
    "excerpt": "Jeu comme Wizard : Oh Hell et KYRAN gardent l'annonce de plis ; The Crew, Skull, 6 qui prend ! et Parade gardent le pli, le pari ou la main.",
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
    "readMinutes": 11,
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
    "excerpt": "Envie de varier de la belote ou de la coinche ? Six jeux de plis modernes, de l'atout retourné au duel, puis un guide pour choisir selon ce qui vous manquerait.",
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
    "title": "Jeux de bluff, de pari et de rôles cachés : 7 jeux de cartes rangés par famille",
    "category": "Cartes",
    "date": "2026-05-23",
    "readMinutes": 11,
    "excerpt": "Skull, Coup, Saboteur, Bang!, Wizard, KYRAN et For Sale : sept jeux de cartes rangés en trois familles, du mensonge en face au pari sur sa main.",
    "image": "/boite-recto-kyran.jpg",
    "webp": "/boite-recto-kyran.webp",
    "gameCount": 7,
    "related": [
      "jeux-soiree-amis",
      "jeux-plis-comparatif",
      "jeux-sans-elimination"
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
    "title": "Jeux de cartes à offrir à Noël : 7 idées selon le destinataire",
    "category": "Cadeaux",
    "date": "2026-05-11",
    "readMinutes": 11,
    "excerpt": "Quel jeu offrir à Noël ? Sept idées rangées par destinataire (tablée du réveillon, couple, ado, amateur de cartes), avec durée de partie et budget.",
    "image": "/blog/images/hanabi.jpg",
    "webp": "/blog/images/hanabi.webp",
    "gameCount": 7,
    "related": [
      "cadeau-anniversaire",
      "jeux-duo-couples",
      "jeux-famille"
    ]
  },
  {
    "slug": "cadeau-anniversaire",
    "title": "Jeux de cartes à offrir pour un anniversaire : 9 idées, du petit prix au cadeau marquant",
    "category": "Cadeaux",
    "date": "2026-05-09",
    "readMinutes": 14,
    "excerpt": "Quel jeu de cartes offrir pour un anniversaire ? 9 idées classées par budget, des jeux pas chers à moins de 15 € au cadeau marquant, jouables le soir même.",
    "image": "/blog/images/love-letter.jpg",
    "webp": "/blog/images/love-letter.webp",
    "gameCount": 9,
    "related": [
      "cadeau-noel",
      "jeux-soiree-amis",
      "jeux-famille"
    ]
  },
  {
    "slug": "jeux-30-minutes",
    "title": "Jeux de cartes de 30 minutes ou moins : 9 parties express",
    "category": "Soirée",
    "date": "2026-05-19",
    "readMinutes": 11,
    "excerpt": "Neuf jeux de cartes rangés en trois créneaux, 15, 20 ou 30 minutes : explication, nombre de joueurs et ce qui fait déborder la partie.",
    "image": "/blog/images/skyjo.jpg",
    "webp": "/blog/images/skyjo.webp",
    "gameCount": 9,
    "related": [
      "jeux-vacances-voyage",
      "jeux-soiree-amis",
      "meilleurs-jeux-apero"
    ]
  },
  {
    "slug": "jeux-vacances-voyage",
    "title": "Jeux de cartes pour les vacances et le voyage : 7 jeux à emporter",
    "category": "Cartes",
    "date": "2026-05-27",
    "readMinutes": 11,
    "excerpt": "Sept jeux de cartes rangés par situation : tablette de train, serviette de plage, terrasse ou table de gîte, avec ce que le vent et les pauses leur font.",
    "image": "/blog/images/love-letter.jpg",
    "webp": "/blog/images/love-letter.webp",
    "gameCount": 7,
    "related": [
      "cadeau-anniversaire",
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
    "image": "/kyran-cartes-table.webp",
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
    "readMinutes": 9,
    "excerpt": "Jamais joué à un jeu moderne ? La réponse d’abord, puis cinq jeux de cartes rangés en escalier, de Timeline au pari sur les plis, jargon traduit.",
    "image": "/blog/images/timeline.jpg",
    "webp": "/blog/images/timeline.webp",
    "gameCount": 5,
    "related": [
      "jeux-famille",
      "jeux-cartes-adultes",
      "jeux-soiree-amis"
    ]
  },
  {
    "slug": "jeux-sans-elimination",
    "title": "Jeux de cartes sans élimination : 5 jeux où personne ne quitte la table",
    "category": "Famille",
    "date": "2026-06-14",
    "readMinutes": 8,
    "excerpt": "Sushi Go!, Timeline, Hanabi, No Thanks!, Skyjo : cinq jeux de cartes où personne ne sort, la règle de fin de chacun, et comment vérifier une autre boîte.",
    "image": "/blog/images/skyjo.jpg",
    "webp": "/blog/images/skyjo.webp",
    "gameCount": 5,
    "related": [
      "jeux-famille",
      "jeux-coop-cartes",
      "jeux-comme-skyjo"
    ]
  },
  {
    "slug": "jeux-coop-cartes",
    "title": "Jeux de cartes coopératifs : de Hanabi à The Crew, cinq façons de jouer ensemble",
    "category": "Famille",
    "date": "2026-06-08",
    "readMinutes": 8,
    "excerpt": "Hanabi, The Crew, The Mind, The Game, Letter Jam : cinq jeux de cartes coopératifs classés selon la parole permise, et lequel acheter en premier.",
    "image": "/blog/images/the-crew.jpg",
    "webp": "/blog/images/the-crew.webp",
    "gameCount": 6,
    "related": [
      "jeux-plis-comparatif",
      "jeux-memoire-concentration",
      "jeux-famille"
    ]
  },
  {
    "slug": "jeux-memoire-concentration",
    "title": "Jeux de cartes de mémoire et de concentration : 6 jeux classés par effort",
    "category": "Famille",
    "date": "2026-06-30",
    "readMinutes": 10,
    "excerpt": "Retenir une défausse, tenir un rythme, déduire ce qui reste : 6 jeux de cartes rangés selon l’effort mental qu’ils demandent, sans promesse médicale.",
    "image": "/kyran-cartes-table.webp",
    "gameCount": 6,
    "related": [
      "science-jeux-de-cartes-cerveau",
      "jeux-strategie-legere",
      "jeux-coop-cartes"
    ]
  },
  {
    "slug": "jeux-duo-couples",
    "title": "Jeux de cartes à deux : 7 idées pour un duo ou un couple",
    "category": "Soirée",
    "date": "2026-06-10",
    "readMinutes": 10,
    "excerpt": "Duel ou coopération ? Lost Cities, The Crew, Love Letter et quatre autres jeux de cartes pour deux, puis un guide pour choisir selon votre couple.",
    "image": "/blog/images/lost-cities.jpg",
    "webp": "/blog/images/lost-cities.webp",
    "gameCount": 7,
    "related": [
      "jeux-3-joueurs",
      "jeux-coop-cartes",
      "jeux-vacances-voyage"
    ]
  },
  {
    "slug": "jeux-cartes-4-joueurs",
    "title": "Meilleurs jeux de cartes à 4 joueurs : en équipes ou chacun pour soi",
    "category": "Cartes",
    "date": "2026-09-05",
    "readMinutes": 10,
    "excerpt": "Deux contre deux, tous ensemble ou chacun pour soi ? Codenames, The Crew, Wizard, KYRAN et trois autres jeux de cartes pour une table de quatre.",
    "image": "/blog/images/love-letter.jpg",
    "webp": "/blog/images/love-letter.webp",
    "gameCount": 7,
    "related": [
      "jeux-3-joueurs",
      "jeux-cartes-6-joueurs",
      "alternatives-belote-coinche"
    ]
  },
  {
    "slug": "jeux-cartes-6-joueurs",
    "title": "Jeux de cartes à 5 ou 6 joueurs : 8 jeux sans temps mort",
    "category": "Cartes",
    "date": "2026-09-11",
    "readMinutes": 13,
    "excerpt": "Jeux de cartes à 5 ou 6 joueurs : For Sale, 6 qui prend !, Codenames, Skull, KYRAN… 8 jeux où personne n'attend, et ce qui change entre cinq et six.",
    "image": "/blog/images/6-qui-prend.jpg",
    "webp": "/blog/images/6-qui-prend.webp",
    "gameCount": 8,
    "related": [
      "jeux-cartes-4-joueurs",
      "jeux-3-joueurs",
      "jeux-grands-groupes"
    ]
  },
  {
    "slug": "jeux-strategie-legere",
    "title": "Jeux de cartes de stratégie légère : de vraies décisions, des règles courtes",
    "category": "Cartes",
    "date": "2026-06-18",
    "readMinutes": 10,
    "excerpt": "Lost Cities, Schotten Totten, Parade, Star Realms, Oh Hell!, Wizard, KYRAN : sept jeux de cartes rangés par mécanique, avec la part de chance de chacun.",
    "image": "/blog/images/star-realms.jpg",
    "webp": "/blog/images/star-realms.webp",
    "gameCount": 7,
    "related": [
      "jeux-debutants-adultes",
      "jeux-plis-comparatif",
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
    "image": "/boite-recto-kyran.jpg",
    "webp": "/boite-recto-kyran.webp",
    "gameCount": 7,
    "related": [
      "jeux-strategie-legere",
      "jeux-plis-comparatif",
      "jeux-cartes-6-joueurs"
    ]
  },
  {
    "slug": "jeux-cartes-adultes",
    "title": "Jeux de cartes pour adultes : 7 jeux sans humour gras, classés par ce que la table attend",
    "category": "Soirée",
    "date": "2026-09-11",
    "readMinutes": 10,
    "excerpt": "Sept jeux de cartes pour adultes, sans humour gras : parier, bluffer, coopérer ou s'affronter à deux. Joueurs, durée et défauts de chacun.",
    "image": "/kyran-cartes-table.webp",
    "gameCount": 7,
    "related": [
      "jeux-bluff-pari",
      "jeux-soiree-amis",
      "jeux-duo-couples"
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
