const BLOG_CATEGORIES = ['Tous', 'Apéro', 'Famille', 'Cadeaux', 'Alternatives', 'Cartes', 'Soirée'];

const BLOG_ITEMS = [
  {
    slug: 'jeux-comme-skyjo',
    title: '10 jeux de société comme Skyjo',
    category: 'Alternatives',
    date: '2026-05-01',
    readMinutes: 10,
    excerpt: 'Vous adorez Skyjo ? Découvrez dix jeux de cartes et de société pour varier vos soirées sans perdre en simplicité.',
    image: '/blog/images/skyjo.jpg',
    seoQuery: 'alternative skyjo, jeu comme skyjo',
    kyranPosition: 4,
    related: ['jeux-cartes-pas-chers', 'meilleurs-jeux-apero', 'jeux-30-minutes']
  },
  {
    slug: 'meilleurs-jeux-apero',
    title: 'Les meilleurs jeux de cartes pour apéro',
    category: 'Apéro',
    date: '2026-05-03',
    readMinutes: 9,
    excerpt: 'Huit jeux de cartes testés en conditions réelles d\'apéro : durée, ambiance et facilité d\'explication.',
    image: '/blog/images/jungle-speed.jpg',
    seoQuery: 'jeu apéro cartes, jeu de cartes apéro',
    kyranPosition: 6,
    related: ['jeux-soiree-amis', 'jeux-30-minutes', 'jeux-cartes-pas-chers']
  },
  {
    slug: 'jeux-soiree-amis',
    title: 'Meilleurs jeux entre amis pour une soirée',
    category: 'Soirée',
    date: '2026-05-05',
    readMinutes: 10,
    excerpt: 'De la table animée au groupe calme : huit jeux pour une soirée entre amis qui ne traîne pas en longueur.',
    image: '/blog/images/codenames.jpg',
    seoQuery: 'jeu soirée amis, jeu entre amis',
    kyranPosition: 3,
    related: ['meilleurs-jeux-apero', 'jeux-bluff-pari', 'jeux-debutants-adultes']
  },
  {
    slug: 'jeux-famille',
    title: 'Jeux de société en famille (8 ans et +)',
    category: 'Famille',
    date: '2026-05-07',
    readMinutes: 9,
    excerpt: 'Huit jeux où adultes et enfants jouent sur un pied d\'égalité — sans règles interminables ni frustration.',
    image: '/blog/images/dixit.jpg',
    seoQuery: 'jeu famille société, jeu en famille',
    kyranPosition: 5,
    related: ['jeux-debutants-adultes', 'jeux-3-joueurs', 'cadeau-noel']
  },
  {
    slug: 'cadeau-anniversaire',
    title: 'Jeux à offrir pour un anniversaire',
    category: 'Cadeaux',
    date: '2026-05-09',
    readMinutes: 9,
    excerpt: 'Huit idées cadeau jeu de société pour un anniversaire : du petit budget au cadeau qui marque.',
    image: '/blog/images/love-letter.jpg',
    seoQuery: 'jeu cadeau anniversaire, offrir jeu société',
    kyranPosition: 7,
    related: ['cadeau-noel', 'jeux-cartes-pas-chers', 'jeux-vacances-voyage']
  },
  {
    slug: 'cadeau-noel',
    title: 'Idées jeux de société pour Noël',
    category: 'Cadeaux',
    date: '2026-05-11',
    readMinutes: 10,
    excerpt: 'Sélection de jeux à glisser sous le sapin : conviviaux, beaux en boîte et jouables le soir même.',
    image: '/blog/images/hanabi.jpg',
    seoQuery: 'jeu cadeau noël, idée cadeau jeu société',
    kyranPosition: 4,
    related: ['cadeau-anniversaire', 'jeux-famille', 'jeux-debutants-adultes']
  },
  {
    slug: 'jeux-cartes-pas-chers',
    title: 'Jeux de cartes pas chers (moins de 20 €)',
    category: 'Cartes',
    date: '2026-05-13',
    readMinutes: 9,
    excerpt: 'Huit jeux de cartes à petit prix qui valent bien plus que leur étiquette — qualité, rejouabilité et fun garanti.',
    image: '/blog/images/uno.jpg',
    seoQuery: 'jeu de cartes pas cher, jeux cartes petit budget',
    kyranPosition: 3,
    related: ['jeux-comme-skyjo', 'alternatives-uno', 'jeux-vacances-voyage']
  },
  {
    slug: 'alternatives-wizard',
    title: 'Alternatives à Wizard pour fans de plis',
    category: 'Alternatives',
    date: '2026-05-15',
    readMinutes: 10,
    excerpt: 'Vous connaissez Wizard par cœur ? Voici huit jeux de plis et de pari pour renouveler vos parties.',
    image: '/blog/images/wizard.jpg',
    seoQuery: 'alternative wizard, jeu comme wizard',
    kyranPosition: 2,
    related: ['jeux-plis-comparatif', 'jeux-bluff-pari', 'comparatif-jeux-plis']
  },
  {
    slug: 'alternatives-uno',
    title: 'Jeux à essayer si vous aimez Uno',
    category: 'Alternatives',
    date: '2026-05-17',
    readMinutes: 9,
    excerpt: 'Uno vous a lassé ? Huit alternatives rapides, colorées et interactives pour vos prochaines soirées.',
    image: '/blog/images/uno.jpg',
    seoQuery: 'alternative uno, jeu comme uno',
    kyranPosition: 8,
    related: ['jeux-cartes-pas-chers', 'jeux-30-minutes', 'jeux-debutants-adultes']
  },
  {
    slug: 'jeux-30-minutes',
    title: 'Jeux rapides en 30 minutes ou moins',
    category: 'Soirée',
    date: '2026-05-19',
    readMinutes: 9,
    excerpt: 'Pas le temps pour une épopée de trois heures ? Huit jeux qui tiennent la promesse d\'une demi-heure max.',
    image: '/blog/images/skyjo.jpg',
    seoQuery: 'jeu 30 minutes, jeu rapide société',
    kyranPosition: 5,
    related: ['meilleurs-jeux-apero', 'jeux-comme-skyjo', 'jeux-vacances-voyage']
  },
  {
    slug: 'jeux-3-joueurs',
    title: 'Meilleurs jeux de société à 3 joueurs',
    category: 'Soirée',
    date: '2026-05-21',
    readMinutes: 9,
    excerpt: 'À trois autour de la table, le choix se réduit vite. Huit jeux qui brillent vraiment à ce format.',
    image: '/blog/images/schotten-totten.jpg',
    seoQuery: 'jeu 3 joueurs, meilleur jeu trois joueurs',
    kyranPosition: 4,
    related: ['jeux-famille', 'jeux-plis-comparatif', 'alternatives-wizard']
  },
  {
    slug: 'jeux-bluff-pari',
    title: 'Jeux de bluff et de pari à table',
    category: 'Cartes',
    date: '2026-05-23',
    readMinutes: 10,
    excerpt: 'Quand mentir devient une stratégie : huit jeux où le pari et le bluff créent une tension incomparable.',
    image: '/boite-recto-kyran.png',
    seoQuery: 'jeu bluff pari, jeu de pari cartes',
    kyranPosition: 1,
    related: ['alternatives-wizard', 'jeux-plis-comparatif', 'jeux-soiree-amis']
  },
  {
    slug: 'jeux-debutants-adultes',
    title: 'Jeux de société pour débutants adultes',
    category: 'Famille',
    date: '2026-05-25',
    readMinutes: 9,
    excerpt: 'Vous découvrez les jeux modernes ? Huit titres accessibles pour entrer dans le hobby sans intimidation.',
    image: '/blog/images/timeline.jpg',
    seoQuery: 'jeu débutant société, premier jeu société adulte',
    kyranPosition: 6,
    related: ['jeux-famille', 'meilleurs-jeux-apero', 'alternatives-uno']
  },
  {
    slug: 'jeux-vacances-voyage',
    title: 'Jeux compacts à emporter en vacances',
    category: 'Cartes',
    date: '2026-05-27',
    readMinutes: 9,
    excerpt: 'Petit format, gros fun : huit jeux qui tiennent dans un sac de voyage sans sacrifier l\'expérience.',
    image: '/blog/images/love-letter.jpg',
    seoQuery: 'jeu voyage compact, jeu vacances',
    kyranPosition: 5,
    related: ['jeux-cartes-pas-chers', 'jeux-30-minutes', 'cadeau-anniversaire']
  },
  {
    slug: 'jeux-plis-comparatif',
    title: 'Guide des jeux de plis : lequel choisir ?',
    category: 'Alternatives',
    date: '2026-05-29',
    readMinutes: 10,
    excerpt: 'Wizard, Oh Hell, 6 qui prend, KYRAN… Comparatif honnête de huit jeux de plis pour trouver votre match.',
    image: '/blog/images/wizard.jpg',
    seoQuery: 'jeu de plis comparatif, comparatif jeux plis',
    kyranPosition: 3,
    related: ['alternatives-wizard', 'jeux-bluff-pari', 'comparatif-jeux-plis']
  },
  {
    slug: 'jeux-comme-dixit',
    title: '10 jeux comme Dixit pour varier vos soirées',
    category: 'Alternatives',
    date: '2026-06-02',
    readMinutes: 11,
    excerpt: 'Vous adorez Dixit ? Dix alternatives créatives et conviviales, plus KYRAN en bonus.',
    image: '/blog/images/dixit.jpg',
    seoQuery: 'alternative dixit, jeu comme dixit',
    kyranPosition: 5,
    related: ['jeux-comme-codenames', 'jeux-famille', 'jeux-debutants-adultes']
  },
  {
    slug: 'jeux-comme-codenames',
    title: '8 jeux comme Codenames à essayer',
    category: 'Alternatives',
    date: '2026-06-04',
    readMinutes: 9,
    excerpt: 'Indices, équipes et déduction : huit alternatives à Codenames pour vos soirées.',
    image: '/blog/images/codenames.jpg',
    seoQuery: 'alternative codenames, jeu comme codenames',
    kyranPosition: 4,
    related: ['jeux-comme-dixit', 'jeux-ambiance-party', 'jeux-soiree-amis']
  },
  {
    slug: 'jeux-comme-hanabi',
    title: '8 jeux comme Hanabi en coopératif malin',
    category: 'Alternatives',
    date: '2026-06-06',
    readMinutes: 10,
    excerpt: 'Communication, mémoire et coopération : huit jeux proches de Hanabi.',
    image: '/blog/images/hanabi.jpg',
    seoQuery: 'alternative hanabi, jeu comme hanabi',
    kyranPosition: 3,
    related: ['jeux-coop-cartes', 'jeux-comme-dixit', 'jeux-memoire-concentration']
  },
  {
    slug: 'jeux-coop-cartes',
    title: '8 jeux coopératifs de cartes à découvrir',
    category: 'Famille',
    date: '2026-06-08',
    readMinutes: 9,
    excerpt: 'Jouer ensemble plutôt que les uns contre les autres : huit coop cartes accessibles.',
    image: '/blog/images/the-crew.jpg',
    seoQuery: 'jeux coopératifs cartes, jeux coop société',
    kyranPosition: 6,
    related: ['jeux-comme-hanabi', 'jeux-famille', 'jeux-sans-elimination']
  },
  {
    slug: 'jeux-duo-couples',
    title: '8 jeux de cartes pour duo et couples',
    category: 'Soirée',
    date: '2026-06-10',
    readMinutes: 9,
    excerpt: 'Duels et coop à deux : huit jeux pensés pour les soirées en duo.',
    image: '/blog/images/lost-cities.jpg',
    seoQuery: 'jeux à deux, jeux couple cartes',
    kyranPosition: 5,
    related: ['jeux-3-joueurs', 'jeux-strategie-legere', 'jeux-vacances-voyage']
  },
  {
    slug: 'jeux-grands-groupes',
    title: '8 jeux de cartes pour grands groupes',
    category: 'Apéro',
    date: '2026-06-12',
    readMinutes: 9,
    excerpt: 'Six, huit, dix joueurs : huit jeux qui tiennent la cadence sans exclure personne.',
    image: '/blog/images/6-qui-prend.jpg',
    seoQuery: 'jeux grands groupes, jeux 8 joueurs',
    kyranPosition: 7,
    related: ['meilleurs-jeux-apero', 'jeux-ambiance-party', 'jeux-soiree-amis']
  },
  {
    slug: 'jeux-sans-elimination',
    title: '8 jeux sans élimination frustrante',
    category: 'Famille',
    date: '2026-06-14',
    readMinutes: 9,
    excerpt: 'Tout le monde joue jusqu\'à la fin : huit titres conviviaux sans élimination précoce.',
    image: '/blog/images/skyjo.jpg',
    seoQuery: 'jeux sans élimination, jeux inclusifs',
    kyranPosition: 4,
    related: ['jeux-famille', 'jeux-coop-cartes', 'jeux-debutants-adultes']
  },
  {
    slug: 'jeux-ete-terrasse',
    title: '8 jeux de cartes pour l\'été en terrasse',
    category: 'Apéro',
    date: '2026-06-16',
    readMinutes: 8,
    excerpt: 'Courts, visuels, faciles à lancer dehors : la sélection terrasse/été.',
    image: '/blog/images/jungle-speed.jpg',
    seoQuery: 'jeux été terrasse, jeux dehors cartes',
    kyranPosition: 3,
    related: ['jeux-vacances-voyage', 'meilleurs-jeux-apero', 'jeux-30-minutes']
  },
  {
    slug: 'jeux-strategie-legere',
    title: '8 jeux de stratégie légère en cartes',
    category: 'Cartes',
    date: '2026-06-18',
    readMinutes: 9,
    excerpt: 'Réfléchir sans se prendre la tête : huit jeux stratégiques mais accessibles.',
    image: '/blog/images/star-realms.jpg',
    seoQuery: 'jeux stratégie légère, jeux réflexion cartes',
    kyranPosition: 2,
    related: ['jeux-draft-encheres', 'jeux-bluff-pari', 'jeux-plis-comparatif']
  },
  {
    slug: 'jeux-ambiance-party',
    title: '8 jeux ambiance party qui marchent vraiment',
    category: 'Soirée',
    date: '2026-06-20',
    readMinutes: 9,
    excerpt: 'Rythme, interaction et fous rires : huit party games testés en soirée.',
    image: '/blog/images/dobble.jpg',
    seoQuery: 'jeux party, jeux ambiance soirée',
    kyranPosition: 6,
    related: ['jeux-soiree-amis', 'jeux-grands-groupes', 'jeux-comme-codenames']
  },
  {
    slug: 'jeux-comme-skull',
    title: '8 jeux comme Skull pour fans de bluff',
    category: 'Alternatives',
    date: '2026-06-22',
    readMinutes: 9,
    excerpt: 'Bluff, tension et lectures psychologiques : huit alternatives à Skull.',
    image: '/blog/images/skull.jpg',
    seoQuery: 'alternative skull, jeu comme skull',
    kyranPosition: 1,
    related: ['jeux-bluff-pari', 'jeux-trahison-cachee', 'jeux-comme-codenames']
  },
  {
    slug: 'jeux-draft-encheres',
    title: '8 jeux de draft et enchères en cartes',
    category: 'Cartes',
    date: '2026-06-24',
    readMinutes: 10,
    excerpt: 'Draft malin et enchères tendues : huit jeux pour amateurs de choix tactiques.',
    image: '/blog/images/for-sale.jpg',
    seoQuery: 'jeux draft cartes, jeux enchères',
    kyranPosition: 5,
    related: ['jeux-strategie-legere', 'jeux-cartes-pas-chers', 'jeux-comme-skyjo']
  },
  {
    slug: 'jeux-trahison-cachee',
    title: '8 jeux de trahison cachée et bluff',
    category: 'Soirée',
    date: '2026-06-26',
    readMinutes: 10,
    excerpt: 'Rôles secrets et accusations : huit jeux pour groupes qui aiment la tension sociale.',
    image: '/blog/images/saboteur.jpg',
    seoQuery: 'jeux trahison, jeux rôles cachés',
    kyranPosition: 4,
    related: ['jeux-comme-skull', 'jeux-bluff-pari', 'jeux-soiree-amis']
  },
  {
    slug: 'jeux-classiques-modernes',
    title: '8 classiques modernes du jeu de cartes',
    category: 'Cartes',
    date: '2026-06-28',
    readMinutes: 8,
    excerpt: 'Incontournables toujours efficaces : huit classiques modernes pour toute ludothèque.',
    image: '/blog/images/uno.jpg',
    seoQuery: 'jeux classiques modernes, monopoly deal',
    kyranPosition: 3,
    related: ['alternatives-uno', 'jeux-cartes-pas-chers', 'jeux-debutants-adultes']
  },
  {
    slug: 'jeux-memoire-concentration',
    title: '8 jeux de mémoire et concentration',
    category: 'Famille',
    date: '2026-06-30',
    readMinutes: 9,
    excerpt: 'Attention et mémoire sans ennui : huit jeux dynamiques et rejouables.',
    image: '/blog/images/the-mind.jpg',
    seoQuery: 'jeux mémoire, jeux concentration cartes',
    kyranPosition: 7,
    related: ['jeux-comme-hanabi', 'jeux-famille', 'jeux-sans-elimination']
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
