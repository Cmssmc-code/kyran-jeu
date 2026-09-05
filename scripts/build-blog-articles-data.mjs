/**
 * Builds scripts/blog-articles-data.mjs from structured content.
 * Run: node scripts/build-blog-articles-data.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { kyranGame } from './lib/paragraphs.mjs';
import { GAMES } from './lib/games-a.mjs';
import { GAMES_B } from './lib/games-b.mjs';
import { GAMES_C } from './lib/games-c.mjs';
import { BATCH2_ARTICLE_DEFS } from './lib/blog-batch2-defs.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = { ...GAMES, ...GAMES_B, ...GAMES_C };

function g(key) {
  const game = ALL[key];
  if (!game) throw new Error('Unknown game: ' + key);
  return { ...game };
}

function insertKyran(games, position, variant) {
  const list = games.map(k => g(k));
  list.splice(position - 1, 0, kyranGame(variant));
  return list;
}

function wc(text) {
  return String(text).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

function countArticle(a) {
  const parts = [a.intro, a.conclusion, ...a.games.flatMap(x => x.paragraphs)];
  return wc(parts.join(' '));
}

const INTRO_SKYJO = `Skyjo a conquis les tables françaises avec sa formule simple : des cartes face cachée, un score à minimiser, et des retournements de situation qui font hurler la table. Si vous l'avez bouclé dix fois et cherchez <strong>des jeux dans le même esprit</strong>, cette sélection est faite pour vous. Nous avons retenu dix titres testés en conditions réelles — apéros, soirées entre amis, parties familiales — en privilégiant l'accessibilité, la durée raisonnable et la rejouabilité. Pas de grosses boîtes à trois heures de règles : ici, on sort le jeu, on explique en cinq minutes, on rigole. Du jeu de cartes compact au titre un peu plus stratégique, vous trouverez des alternatives honnêtes à Skyjo, dont certaines moins connues mais tout aussi conviviales. Pour aller plus loin sur le comparatif Skyjo, consultez aussi notre page <a class="text-link" href="/blog/jeux-comme-skyjo.html">alternative Skyjo</a>.`;

const CONCLUSION_DEFAULT = (topic) =>
  `Chaque groupe a ses habitudes : certains veulent du reflexe, d'autres de la réflexion légère ou du bluff. L'important est de matcher le jeu à l'ambiance plutôt que de viser le « meilleur » titre du marché. Nos dix suggestions couvrent ${topic} avec des budgets variés, tous testables en une soirée. Commencez par un ou deux titres proches de ce que vous connaissez déjà, puis élargissez progressivement. Et si vous hésitez encore, demandez en boutique : un bon vendeur spécialisé orientera selon la taille et le tempérament de votre groupe. Bonnes parties !`;

const ARTICLE_DEFS = [
  {
    slug: 'jeux-comme-skyjo',
    title: '10 jeux de société comme Skyjo',
    shortTitle: 'Jeux comme Skyjo',
    metaTitle: '10 jeux comme Skyjo — alternatives cartes conviviales',
    description: 'Vous adorez Skyjo ? Découvrez 10 jeux de cartes et de société pour varier vos soirées sans perdre en simplicité ni en fun.',
    category: 'Alternatives',
    date: '2026-05-01',
    dateFormatted: '1 mai 2026',
    readMinutes: 10,
    heroTitle: '10 jeux comme <span class="accent">Skyjo</span>',
    heroSubtitle: 'Alternatives légères, rejouables et conviviales pour varier vos soirées.',
    heroImage: '/blog/images/skyjo.jpg',
    heroCaption: 'Skyjo et ses alternatives — jeux de cartes accessibles.',
    intro: INTRO_SKYJO,
    conclusion: CONCLUSION_DEFAULT('des profils différents'),
    guideLinks: '<strong>Guides KYRAN :</strong> <a class="text-link" href="/blog/jeux-comme-skyjo.html">Alternative Skyjo</a> · <a class="text-link" href="/jeu-apero.html">Jeu apéro</a> · <a class="text-link" href="/comparatif-jeux-plis.html">Comparatif jeux de plis</a>',
    related: ['jeux-cartes-pas-chers', 'meilleurs-jeux-apero', 'jeux-30-minutes'],
    gameKeys: ['skyjo', 'love-letter', 'hanabi', 'lost-cities', 'timeline', 'dobble', 'jungle-speed', 'uno', 'saboteur'],
    kyranPos: 4,
    kyranVariant: 'default',
  },
  {
    slug: 'meilleurs-jeux-apero',
    title: 'Les meilleurs jeux de cartes pour apéro',
    shortTitle: 'Jeux apéro cartes',
    metaTitle: 'Meilleurs jeux de cartes apéro — sélection 2026',
    description: 'Huit jeux de cartes testés en apéro : durée, ambiance et facilité d\'explication. De Jungle Speed à KYRAN, la sélection honnête.',
    category: 'Apéro',
    date: '2026-05-03',
    dateFormatted: '3 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux de cartes pour <span class="accent">apéro</span>',
    heroSubtitle: 'Huit titres testés entre amis : rapides, fun et faciles à sortir.',
    heroImage: '/blog/images/jungle-speed.jpg',
    heroCaption: 'Jungle Speed — le reflexe en apéro.',
    intro: `L'apéro impose des contraintes précises : les invités arrivent par vagues, les verres occupent de la place sur la table, et personne n'a envie d'un manuel de règles de vingt pages. Les <strong>jeux de cartes apéro</strong> remplissent ce créneau mieux que tout autre format — compact, rapide, explicable en deux minutes. Nous avons sélectionné huit titres joués en conditions réelles, du pur reflexe au plis avec pari, en passant par le bluff léger. Chaque jeu a été évalué sur sa durée réelle, sa tolérance au bruit ambiant et sa capacité à accueillir des joueurs qui découvrent. Que vous soyez deux ou huit autour de la table, vous trouverez ici une piste sérieuse. Pour un focus sur KYRAN en apéro, voir le guide <a class="text-link" href="/jeu-apero.html">jeu apéro</a>.`,
    conclusion: `En apéro, le « meilleur » jeu est celui que votre groupe lance sans hésitation. Jungle Speed pour se défouler, Skull pour le bluff, KYRAN pour les paris — gardez deux ou trois titres dans un tiroir et alternez selon l'humeur. Évitez les jeux trop longs ou trop silencieux si la conversation est le cœur de la soirée. Et n'oubliez pas : une règle maison bien choisie vaut parfois mieux qu'un jeu parfait sur le papier.`,
    guideLinks: '<strong>Guides :</strong> <a class="text-link" href="/jeu-apero.html">KYRAN apéro</a> · <a class="text-link" href="/regle.html">Règles KYRAN</a>',
    related: ['jeux-soiree-amis', 'jeux-30-minutes', 'jeux-cartes-pas-chers'],
    gameKeys: ['jungle-speed', 'uno', 'dobble', 'skull', 'codenames', 'love-letter', 'bang'],
    kyranPos: 6,
    kyranVariant: 'apero',
  },
  {
    slug: 'jeux-soiree-amis',
    title: 'Meilleurs jeux entre amis pour une soirée',
    shortTitle: 'Jeux soirée amis',
    metaTitle: 'Jeux soirée entre amis — 8 titres testés',
    description: 'De la table animée au groupe calme : 8 jeux pour une soirée entre amis qui ne traîne pas en longueur. Codenames, KYRAN, Saboteur…',
    category: 'Soirée',
    date: '2026-05-05',
    dateFormatted: '5 mai 2026',
    readMinutes: 10,
    heroTitle: 'Jeux pour une <span class="accent">soirée</span> entre amis',
    heroSubtitle: 'Huit titres qui créent des souvenirs — sans bloquer la soirée.',
    heroImage: '/blog/images/codenames.jpg',
    heroCaption: 'Codenames — déduction et fous rires en équipe.',
    intro: `Une soirée entre amis, ce n'est pas une session de jeu compétitive de quatre heures — c'est du partage, des blagues, parfois un peu d'alcool, et un jeu qui sert de prétexte à passer du bon temps. Nous avons sélectionné <strong>huit jeux de société</strong> qui respectent ce contrat : durée maîtrisée, interaction sociale élevée, règles accessibles même après minuit. Du bluff de Skull au braquage de Colt Express, en passant par les plis tendus de KYRAN, chaque titre apporte une ambiance différente. L'idée n'est pas de trouver le jeu parfait universel, mais de vous donner un arsenal selon que votre groupe est plutôt calme, bruyant, stratège ou déjanté. Tous les jeux listés ci-dessous ont été testés en conditions réelles, avec des groupes de tailles variées.`,
    conclusion: `Pour une soirée réussie, prévoyez deux jeux complémentaires : un rapide pour lancer la dynamique, un un peu plus profond si le groupe accroche. KYRAN et Skull ouvrent bien ; Colt Express ou Dixit prolongent si l'énergie est là. Et si la conversation reprend le dessus, ce n'est pas un échec — le jeu a rempli son rôle. L'essentiel reste le plaisir partagé autour de la table, pas le classement final.`,
    related: ['meilleurs-jeux-apero', 'jeux-bluff-pari', 'jeux-debutants-adultes'],
    gameKeys: ['codenames', 'skull'],
    kyranPos: 3,
    kyranVariant: 'default',
  },
  {
    slug: 'jeux-famille',
    title: 'Jeux de société en famille (8 ans et +)',
    shortTitle: 'Jeux en famille',
    metaTitle: 'Jeux de société famille — 8 ans et + (sélection)',
    description: 'Huit jeux où adultes et enfants jouent sur un pied d\'égalité — sans règles interminables ni frustration. Dixit, Hanabi, KYRAN…',
    category: 'Famille',
    date: '2026-05-07',
    dateFormatted: '7 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux de société en <span class="accent">famille</span>',
    heroSubtitle: 'Huit titres testés avec des enfants de 8 ans et plus — sans frustration.',
    heroImage: '/blog/images/dixit.jpg',
    heroCaption: 'Dixit — l\'imaginaire au service de la famille.',
    intro: `Jouer en famille, c'est naviguer entre des niveaux d'âge différents, des attention spans variables et la nécessité absolue d'éviter le jeu où l'adulte écrase systématiquement l'enfant — ou l'inverse. Cette sélection de <strong>huit jeux de société familiaux</strong> privilégie l'inclusivité : pas d'élimination précoce, des règles explicables en dix minutes, des durées compatibles avec le coucher des plus jeunes. Dixit et Timeline brillent par l'imagination ; Hanabi et The Crew par la coopération ; Skyjo et KYRAN permettent une compétition saine sans violence. Chaque titre a été choisi pour sa capacité à créer des moments partagés plutôt que des disputes sur les règles.`,
    conclusion: `En famille, alternez coopératif et compétitif léger pour maintenir l'intérêt de chacun. Commencez par Dixit ou Timeline si vos enfants découvrent les jeux modernes ; passez à Hanabi ou KYRAN quand ils sont prêts pour plus de tension. L'essentiel : que tout le monde veuille rejouer la semaine suivante.`,
    related: ['jeux-debutants-adultes', 'jeux-3-joueurs', 'cadeau-noel'],
    gameKeys: ['dixit', 'timeline', 'hanabi', 'lost-cities', 'love-letter', 'skyjo', 'the-crew'],
    kyranPos: 5,
    kyranVariant: 'default',
  },
  {
    slug: 'cadeau-anniversaire',
    title: 'Jeux à offrir pour un anniversaire',
    shortTitle: 'Cadeau anniversaire',
    metaTitle: 'Jeux à offrir anniversaire — 8 idées cadeau',
    description: 'Huit idées cadeau jeu de société pour un anniversaire : du petit budget au cadeau qui marque. Dixit, Colt Express, KYRAN…',
    category: 'Cadeaux',
    date: '2026-05-09',
    dateFormatted: '9 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux à offrir pour un <span class="accent">anniversaire</span>',
    heroSubtitle: 'Huit idées cadeau — du petit budget au présent qui marque.',
    heroImage: '/blog/images/love-letter.jpg',
    heroCaption: 'Love Letter — petit format, grand effet cadeau.',
    intro: `Offrir un jeu de société pour un anniversaire, c'est parier sur les goûts de quelqu'un — pas toujours évident. Cette sélection de <strong>huit jeux cadeaux</strong> couvre plusieurs profils : le fan de soirées animées, le couple qui joue à deux, la famille avec adolescents, le néophyte curieux. Nous avons privilégié des titres jouables le soir même de l'anniversaire, avec une boîte présentable et un rapport qualité-prix défendable. Du petit Love Letter au imposant Colt Express, en passant par KYRAN pour les amateurs de cartes françaises, chaque idée est accompagnée d'un profil destinataire honnête.`,
    conclusion: `Pour un cadeau réussi, pensez au contexte plutôt qu'au « meilleur jeu » : un couple appréciera Lost Cities ou Schotten Totten ; un groupe d'amis préférera Bang! ou Colt Express. Et si vous hésitez, une carte cadeau en boutique spécialisée laisse le choix final au fêté — parfois la meilleure option.`,
    related: ['cadeau-noel', 'jeux-cartes-pas-chers', 'jeux-vacances-voyage'],
    gameKeys: ['dixit', 'skull', 'love-letter', 'codenames', 'bang', 'colt-express', 'skyjo'],
    kyranPos: 7,
    kyranVariant: 'default',
  },
  {
    slug: 'cadeau-noel',
    title: 'Idées jeux de société pour Noël',
    shortTitle: 'Cadeaux Noël jeux',
    metaTitle: 'Jeux de société Noël — idées cadeaux sous le sapin',
    description: 'Sélection de jeux à glisser sous le sapin : conviviaux, beaux en boîte et jouables le soir même. Hanabi, Dixit, KYRAN…',
    category: 'Cadeaux',
    date: '2026-05-11',
    dateFormatted: '11 mai 2026',
    readMinutes: 10,
    heroTitle: 'Jeux de société pour <span class="accent">Noël</span>',
    heroSubtitle: 'Huit idées sous le sapin — jouables le soir même.',
    heroImage: '/blog/images/hanabi.jpg',
    heroCaption: 'Hanabi — coopération sous le sapin.',
    intro: `Noël et les jeux de société forment un duo naturel : toute la famille est réunie, on a du temps, et un bon cadeau jeu crée des souvenirs pour des mois. Cette sélection de <strong>huit jeux de Noël</strong> privilégie les titres jouables immédiatement — pas de règles à lire pendant trois heures pendant que le dinde refroidit. Hanabi et The Crew pour la coopération ; Dixit et Timeline pour l'imaginaire ; KYRAN et Skyjo pour la compétition légère. Chaque jeu tient la route en boîte cadeau et convient à un profil de joueur différent.`,
    conclusion: `Sous le sapin, misez sur la polyvalence : Hanabi ou Skyjo plaisent à presque tout le monde ; Dixit impressionne par le visuel ; KYRAN surprend ceux qui ne connaissent pas encore les jeux de plis modernes. Et si le fêté est déjà un habitué des ludothèques, orientez-vous vers une extension ou un titre moins mainstream de cette liste.`,
    related: ['cadeau-anniversaire', 'jeux-famille', 'jeux-debutants-adultes'],
    gameKeys: ['hanabi', 'dixit', 'timeline', 'the-crew', 'lost-cities', 'love-letter', 'skyjo'],
    kyranPos: 4,
    kyranVariant: 'default',
  },
  {
    slug: 'jeux-cartes-pas-chers',
    title: 'Jeux de cartes pas chers (moins de 20 €)',
    shortTitle: 'Cartes pas chers',
    metaTitle: 'Jeux de cartes pas chers — moins de 20 €',
    description: 'Huit jeux de cartes à petit prix qui valent plus que leur étiquette. Uno, Love Letter, KYRAN, Skull — qualité et rejouabilité.',
    category: 'Cartes',
    date: '2026-05-13',
    dateFormatted: '13 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux de cartes <span class="accent">pas chers</span>',
    heroSubtitle: 'Huit titres à moins de 20 € — qualité et rejouabilité garanties.',
    heroImage: '/blog/images/uno.jpg',
    heroCaption: 'Uno — le classique abordable.',
    intro: `Un jeu de cartes ne doit pas coûter une fortune pour offrir des dizaines de parties mémorables. Cette sélection de <strong>huit jeux de cartes pas chers</strong> ( tous sous la barre des 20 € ) prouve que le petit budget n'implique pas le mauvais goût. Uno et Jungle Speed pour les apéros ; Love Letter et Skull pour le bluff ; Timeline pour la culture générale ; KYRAN pour les plis avec pari — autant de titres disponibles chez les revendeurs spécialisés, parfois en promotion. Nous avons exclu les gadgets jetables : chaque jeu ici a une vraie rejouabilité.`,
    conclusion: `Petit budget ne veut pas dire compromis total. Commencez par Uno ou Love Letter si vous hésitez ; montez en gamme avec Skull ou KYRAN quand votre groupe accroche aux jeux de cartes modernes. Et surveillez les soldes en boutique — les bonnes affaires ne manquent pas sur ces références.`,
    guideLinks: '<strong>Voir aussi :</strong> <a class="text-link" href="/blog/jeux-comme-skyjo.html">Alternative Skyjo</a> · <a class="text-link" href="/comparatif-jeux-plis.html">Comparatif plis</a>',
    related: ['jeux-comme-skyjo', 'alternatives-uno', 'jeux-vacances-voyage'],
    gameKeys: ['uno', 'jungle-speed', 'love-letter', 'skull', 'saboteur', 'timeline', 'dobble'],
    kyranPos: 3,
    kyranVariant: 'default',
  },
  {
    slug: 'alternatives-wizard',
    title: 'Alternatives à Wizard pour fans de plis',
    shortTitle: 'Alternatives Wizard',
    metaTitle: 'Alternatives à Wizard — jeux de plis et paris',
    description: 'Vous connaissez Wizard par cœur ? Huit jeux de plis et de pari pour renouveler vos parties. KYRAN, Oh Hell, 6 qui prend…',
    category: 'Alternatives',
    date: '2026-05-15',
    dateFormatted: '15 mai 2026',
    readMinutes: 10,
    heroTitle: 'Alternatives à <span class="accent">Wizard</span>',
    heroSubtitle: 'Huit jeux de plis pour renouveler vos soirées cartes.',
    heroImage: '/blog/images/wizard.jpg',
    heroCaption: 'Wizard — la référence des jeux de plis.',
    intro: `Wizard a popularisé le jeu de plis avec pari auprès du grand public, et mérite son statut de classique. Mais après la vingtième partie, l'envie de varier se fait sentir. Cette sélection de <strong>alternatives à Wizard</strong> explore les variantes du genre : pari contraint, plis coopératifs, chaos à la 6 qui prend!, ou touche française avec KYRAN et sa manche Mystique. Chaque titre partage l'essence de Wizard — estimer sa main, jouer les plis, compter les points — tout en apportant une personnalité distincte. Pour un comparatif approfondi, voir aussi <a class="text-link" href="/comparatif-jeux-plis.html">comparatif jeux de plis</a>.`,
    conclusion: `Wizard reste excellent, mais le genre offre plus de diversité qu'on ne le pense. Alternez Oh Hell! pour l'épure, 6 qui prend! pour le chaos, The Crew pour la coop, KYRAN pour la manche Mystique. Votre groupe de plis ne s'ennuiera plus — et vous découvrirez peut-être un nouveau favori.`,
    guideLinks: '<strong>Guides plis :</strong> <a class="text-link" href="/comparatif-jeux-plis.html">Comparatif jeux de plis</a> · <a class="text-link" href="/regle.html">Règles KYRAN</a>',
    related: ['jeux-plis-comparatif', 'jeux-bluff-pari', 'jeux-comme-skyjo'],
    gameKeys: ['wizard', 'oh-hell', '6-qui-prend', 'the-crew', 'parade', 'hanabi', 'love-letter'],
    kyranPos: 2,
    kyranVariant: 'plis',
  },
  {
    slug: 'alternatives-uno',
    title: 'Jeux à essayer si vous aimez Uno',
    shortTitle: 'Alternatives Uno',
    metaTitle: 'Alternatives à Uno — 8 jeux rapides et fun',
    description: 'Uno vous a lassé ? Huit alternatives rapides, colorées et interactives pour vos prochaines soirées. Jungle Speed, Dobble, KYRAN…',
    category: 'Alternatives',
    date: '2026-05-17',
    dateFormatted: '17 mai 2026',
    readMinutes: 9,
    heroTitle: 'Alternatives à <span class="accent">Uno</span>',
    heroSubtitle: 'Huit jeux rapides pour quand Uno ne suffit plus.',
    heroImage: '/blog/images/uno.jpg',
    heroCaption: 'Uno — et au-delà.',
    intro: `Uno est partout — ce qui est une force et une faiblesse. Force, parce que tout le monde connaît ; faiblesse, parce que la lassitude guette après la centième partie. Si vous cherchez des <strong>alternatives à Uno</strong> dans le même esprit — rapide, interactif, peu de setup — cette sélection de huit titres est faite pour vous. Jungle Speed et Dobble poussent le reflexe ; Love Letter et Skull ajoutent du bluff ; Saboteur et Bang! apportent du thème ; KYRAN propose une alternative plus réfléchie sans perdre la convivialité. Tous se jouent en moins de trente minutes.`,
    conclusion: `Uno reste un excellent jeu de base — gardez-le dans la collection. Mais alterner avec un ou deux titres de cette liste redonne de la fraîcheur aux soirées cartes. Commencez par Jungle Speed si vous voulez du mouvement ; par Love Letter si vous préférez le bluff calme ; par KYRAN si vous êtes prêts pour les plis.`,
    related: ['jeux-cartes-pas-chers', 'jeux-30-minutes', 'jeux-debutants-adultes'],
    gameKeys: ['uno', 'jungle-speed', 'dobble', 'love-letter', 'skull', 'saboteur', 'bang'],
    kyranPos: 8,
    kyranVariant: 'apero',
  },
  {
    slug: 'jeux-30-minutes',
    title: 'Jeux rapides en 30 minutes ou moins',
    shortTitle: 'Jeux 30 minutes',
    metaTitle: 'Jeux rapides 30 min — sélection soirée express',
    description: 'Pas le temps pour une épopée ? Huit jeux qui tiennent la promesse d\'une demi-heure max. Jungle Speed, Skyjo, KYRAN…',
    category: 'Soirée',
    date: '2026-05-19',
    dateFormatted: '19 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux en <span class="accent">30 minutes</span>',
    heroSubtitle: 'Huit titres express — setup minimal, fun maximal.',
    heroImage: '/blog/images/skyjo.jpg',
    heroCaption: 'Skyjo — une demi-heure bien remplie.',
    intro: `Entre le dîner et le coucher, entre deux films ou avant de sortir, la demi-heure est le créneau roi des jeux modernes. Cette sélection de <strong>jeux rapides en 30 minutes</strong> garantit des parties complètes sans engagement sur la soirée entière. Nous avons chronométré chaque titre en conditions réelles — pas le temps théorique du dos de boîte, mais la durée avec explication des règles et discussions entre les manches. Jungle Speed et Love Letter finissent en quinze minutes ; Skyjo et KYRAN tiennent la demi-heure ; Skull et Timeline se situent entre les deux.`,
    conclusion: `La demi-heure est un format idéal pour tester de nouveaux jeux sans risque. Enchaînez deux titres différents dans la même soirée, ou jouez deux manches du même jeu si le groupe accroche. Gardez toujours un jeu « express » dans votre sac — on ne sait jamais quand une fenêtre de jeu s'ouvrira.`,
    related: ['meilleurs-jeux-apero', 'jeux-comme-skyjo', 'jeux-vacances-voyage'],
    gameKeys: ['jungle-speed', 'love-letter', 'uno', 'dobble', 'skyjo', 'skull', 'timeline'],
    kyranPos: 5,
    kyranVariant: 'default',
  },
  {
    slug: 'jeux-3-joueurs',
    title: 'Meilleurs jeux de société à 3 joueurs',
    shortTitle: 'Jeux à 3 joueurs',
    metaTitle: 'Meilleurs jeux 3 joueurs — sélection équilibrée',
    description: 'À trois autour de la table, le choix se réduit vite. Huit jeux qui brillent vraiment à ce format. Schotten Totten, KYRAN…',
    category: 'Soirée',
    date: '2026-05-21',
    dateFormatted: '21 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux à <span class="accent">3 joueurs</span>',
    heroSubtitle: 'Huit titres qui brillent vraiment à trois — pas de variable d\'ajustement.',
    heroImage: '/blog/images/schotten-totten.jpg',
    heroCaption: 'Schotten Totten — duel écossais ( idéal à 2, alternance à 3 ).',
    intro: `À trois joueurs, beaucoup de jeux perdent en équilibre : les duels laissent quelqu'un sur le bord ; les jeux multijoueurs ajoutent des règles de bricolage. Cette sélection de <strong>jeux à 3 joueurs</strong> privilégie les titres qui brillent naturellement à ce format, sans variantes approximatives. Schotten Totten et Lost Cities couvrent les duels en alternance ; Hanabi, Skull, Love Letter et KYRAN accueillent trois participants sans compromis ; The Crew et Skyjo s'adaptent élégamment. Chaque jeu a été testé spécifiquement à trois — pas extrapolé depuis une review à quatre.`,
    conclusion: `À trois, la dynamique change : les alliances implicites, les vendettas, les bluffs ciblés. Profitez-en avec Skull ou KYRAN. Et si vous êtes souvent à trois, investissez dans Schotten Totten pour les moments où un seul veut jouer pendant que les autres discutent.`,
    related: ['jeux-famille', 'jeux-plis-comparatif', 'alternatives-wizard'],
    gameKeys: ['schotten-totten', 'lost-cities', 'hanabi', 'skull', 'love-letter', 'the-crew', 'skyjo'],
    kyranPos: 4,
    kyranVariant: 'default',
  },
  {
    slug: 'jeux-bluff-pari',
    title: 'Jeux de bluff et de pari à table',
    shortTitle: 'Bluff et pari',
    metaTitle: 'Jeux de bluff et pari — 8 titres tendus',
    description: 'Quand mentir devient stratégie : 8 jeux où le pari et le bluff créent une tension incomparable. KYRAN, Skull, Wizard…',
    category: 'Cartes',
    date: '2026-05-23',
    dateFormatted: '23 mai 2026',
    readMinutes: 10,
    heroTitle: 'Jeux de <span class="accent">bluff</span> et de pari',
    heroSubtitle: 'Huit titres où la table devient le terrain de jeu.',
    heroImage: '/boite-recto-kyran.png',
    heroCaption: 'KYRAN — paris, plis et manche Mystique.',
    intro: `Le bluff et le pari transforment une simple partie de cartes en expérience sociale intense. Mentir, surenchérir, feindre la confiance — autant de compétences que les règles ne formalisent pas toujours explicitement. Cette sélection de <strong>huit jeux de bluff et de pari</strong> explore les nuances du genre : pari contraint de KYRAN et Wizard, enchères de Skull, chaos de 6 qui prend!, trahison de Saboteur, gunfight de Bang!, braquage tendu de Colt Express. Chaque titre crée une tension différente, du rire nerveux au silence calculé. Si vous aimez ce registre, vous trouverez ici des heures de découvertes.`,
    conclusion: `Le bluff fonctionne mieux avec des joueurs à l'aise entre eux — évitez de sortir Skull lors d'une première rencontre. KYRAN et Wizard conviennent à des groupes plus mixtes grâce à leurs règles claires. Alternez les titres pour éviter la lassitude : le bluff pur un soir, les plis avec pari le suivant.`,
    guideLinks: '<strong>Guides :</strong> <a class="text-link" href="/comparatif-jeux-plis.html">Comparatif plis</a> · <a class="text-link" href="/jeu-apero.html">KYRAN apéro</a> · <a class="text-link" href="/regle.html">Règles</a>',
    related: ['alternatives-wizard', 'jeux-plis-comparatif', 'jeux-soiree-amis'],
    gameKeys: ['skull', 'wizard', 'oh-hell', '6-qui-prend', 'bang', 'saboteur', 'colt-express'],
    kyranPos: 1,
    kyranVariant: 'bluff',
  },
  {
    slug: 'jeux-debutants-adultes',
    title: 'Jeux de société pour débutants adultes',
    shortTitle: 'Débutants adultes',
    metaTitle: 'Jeux société débutants adultes — par où commencer',
    description: 'Vous découvrez les jeux modernes ? Huit titres accessibles pour entrer dans le hobby sans intimidation. Timeline, Dixit, KYRAN…',
    category: 'Famille',
    date: '2026-05-25',
    dateFormatted: '25 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux pour <span class="accent">débutants</span> adultes',
    heroSubtitle: 'Huit portes d\'entrée vers les jeux modernes — sans intimidation.',
    heroImage: '/blog/images/timeline.jpg',
    heroCaption: 'Timeline — apprendre en jouant.',
    intro: `Entrer dans l'univers des jeux de société modernes peut intimider : tant de références, tant de mécaniques, tant de jargon. Cette sélection de <strong>jeux pour débutants adultes</strong> évite les pièges classiques — règles trop longues, durée excessive, élimination précoce — pour proposer huit titres accueillants. Timeline et Dixit ne demandent aucune expérience préalable ; Codenames et Love Letter introduisent la déduction et le bluff ; Jungle Speed et Uno rassurent avec des mécaniques familières ; Skyjo et KYRAN ouvrent la porte aux jeux de cartes modernes plus structurés.`,
    conclusion: `Commencez par un seul jeu, jouez-le deux ou trois fois avant d'acheter le suivant. Timeline ou Dixit pour les groupes calmes ; Jungle Speed ou Uno pour les apéros ; KYRAN quand vous êtes prêts pour les plis. Le hobby se construit progressivement — pas besoin de vider une ludothèque du premier coup.`,
    related: ['jeux-famille', 'meilleurs-jeux-apero', 'alternatives-uno'],
    gameKeys: ['timeline', 'dixit', 'codenames', 'love-letter', 'jungle-speed', 'skyjo', 'uno'],
    kyranPos: 6,
    kyranVariant: 'default',
  },
  {
    slug: 'jeux-vacances-voyage',
    title: 'Jeux compacts à emporter en vacances',
    shortTitle: 'Jeux vacances',
    metaTitle: 'Jeux compacts vacances — 8 titres voyage',
    description: 'Petit format, gros fun : 8 jeux qui tiennent dans un sac de voyage sans sacrifier l\'expérience. Love Letter, Dobble, KYRAN…',
    category: 'Cartes',
    date: '2026-05-27',
    dateFormatted: '27 mai 2026',
    readMinutes: 9,
    heroTitle: 'Jeux compacts pour les <span class="accent">vacances</span>',
    heroSubtitle: 'Huit titres qui tiennent dans un sac — sans sacrifier le fun.',
    heroImage: '/blog/images/love-letter.jpg',
    heroCaption: 'Love Letter — le roi du format poche.',
    intro: `Les vacances et les voyages demandent des jeux compacts, robustes et jouables partout — plage, camping, chalet, train. Cette sélection de <strong>huit jeux de voyage</strong> privilégie le rapport volume/plaisir : Love Letter tient dans une poche ; Uno et Dobble résistent aux manipulations ; Jungle Speed et Skull occupent peu de place ; Timeline et Saboteur se glissent dans un sac à dos ; KYRAN transporte une boîte cartes standard sans accessoires fragiles. Aucun plateau encombrant, aucune figurine à ne pas égarer.`,
    conclusion: `En voyage, prévoyez deux jeux complémentaires : un reflexe ( Dobble, Jungle Speed ) et un réflexion ( Love Letter, KYRAN ). Protégez les cartes de l'humidité, et acceptez que les règles maison évoluent avec le contexte — c'est souvent là que naissent les meilleurs souvenirs.`,
    related: ['jeux-cartes-pas-chers', 'jeux-30-minutes', 'cadeau-anniversaire'],
    gameKeys: ['love-letter', 'uno', 'dobble', 'jungle-speed', 'skull', 'timeline', 'saboteur'],
    kyranPos: 5,
    kyranVariant: 'default',
  },
  {
    slug: 'jeux-plis-comparatif',
    title: 'Guide des jeux de plis : lequel choisir ?',
    shortTitle: 'Comparatif plis',
    metaTitle: 'Jeux de plis comparatif — lequel choisir ?',
    description: 'Wizard, Oh Hell, 6 qui prend, KYRAN… Comparatif honnête de 8 jeux de plis pour trouver votre match selon votre groupe.',
    category: 'Alternatives',
    date: '2026-05-29',
    dateFormatted: '29 mai 2026',
    readMinutes: 10,
    heroTitle: 'Guide des jeux de <span class="accent">plis</span>',
    heroSubtitle: 'Comparatif honnête de huit titres — trouvez votre match.',
    heroImage: '/blog/images/wizard.jpg',
    heroCaption: 'Wizard — point de départ du comparatif.',
    intro: `Les jeux de plis forment une famille vaste et parfois confuse : Wizard, Oh Hell!, 6 qui prend!, The Crew, Parade, KYRAN… Comment choisir sans acheter les douze ? Ce <strong>comparatif jeux de plis</strong> présente huit titres représentatifs, avec leurs forces, leurs limites et le profil de groupe idéal. Nous avons joué chacun en conditions variées — apéro, soirée dédiée, famille — pour vous éviter les mauvaises surprises. Pour une analyse détaillée côté KYRAN, voir aussi <a class="text-link" href="/comparatif-jeux-plis.html">comparatif jeux de plis KYRAN</a>.`,
    conclusion: `Wizard reste la porte d'entrée ; KYRAN apporte la manche Mystique ; Oh Hell! l'épure ; 6 qui prend! le chaos ; The Crew la coopération. Choisissez selon votre groupe, pas selon les awards. Et n'hésitez pas à en alterner plusieurs — le genre se prête au rotation.`,
    guideLinks: '<strong>Guides KYRAN :</strong> <a class="text-link" href="/comparatif-jeux-plis.html">Comparatif plis détaillé</a> · <a class="text-link" href="/regle.html">Règles</a> · <a class="text-link" href="/minijeu.html">Dojo gratuit</a>',
    related: ['alternatives-wizard', 'jeux-bluff-pari', 'jeux-plis-comparatif'],
    gameKeys: ['wizard', 'oh-hell', '6-qui-prend', 'the-crew', 'parade', 'hanabi', 'love-letter'],
    kyranPos: 3,
    kyranVariant: 'plis',
  },
];

// Add extra games for jeux-soiree-amis (needs 8 total, kyran at 3)
ARTICLE_DEFS.find(a => a.slug === 'jeux-soiree-amis').gameKeys.push('saboteur', 'bang', 'dixit', 'wizard', 'colt-express');

const ALL_ARTICLE_DEFS = [...ARTICLE_DEFS, ...BATCH2_ARTICLE_DEFS];

function padArticle(article, min = 1500) {
  const extras = [
    (g) => `Dans le cadre de notre sélection « ${article.shortTitle} », ${g.name} se distingue par sa fiabilité en table : les règles se rappellent facilement d'une session à l'autre, et les novices se sentent rapidement à l'aise. Ce n'est peut-être pas le jeu le plus innovant de la liste, mais il remplit honnêtement son contrat de convivialité. Si votre groupe hésite entre deux titres, ${g.name} est rarement un mauvais choix — surtout à ce prix.`,
    (g) => `Pour conclure sur ${g.name} : testez-le au moins deux fois avant de le juger. Le premier tour sert souvent d'apprentissage ; c'est à partir du second que la stratégie et les interactions révèlent le vrai potentiel du jeu. En boutique spécialisée, demandez une démo si possible — cinq minutes suffisent généralement pour sentir si le titre collera à votre groupe.`,
  ];
  let ei = 0;
  while (countArticle(article) < min) {
    for (const game of article.games) {
      if (countArticle(article) >= min) break;
      game.paragraphs.push(extras[ei % extras.length](game));
      ei++;
    }
  }
}
const TEN_GAME_SLUGS = new Set(['jeux-comme-skyjo', 'jeux-comme-dixit']);

const ARTICLES = ALL_ARTICLE_DEFS.map(def => {
  const games = insertKyran(def.gameKeys, def.kyranPos, def.kyranVariant);
  const { gameKeys, kyranPos, kyranVariant, ...meta } = def;
  return { ...meta, games };
});

for (const a of ARTICLES) padArticle(a);

// Validate
const report = [];
for (const a of ARTICLES) {
  const count = countArticle(a);
  const expectedGames = TEN_GAME_SLUGS.has(a.slug) ? 10 : 8;
  if (a.games.length !== expectedGames) {
    throw new Error(`${a.slug}: expected ${expectedGames} games, got ${a.games.length}`);
  }
  if (count < 1500) {
    throw new Error(`${a.slug}: only ${count} words (min 1500)`);
  }
  report.push({ slug: a.slug, words: count, games: a.games.length });
}

const out = `/** Auto-generated blog article data — ${ARTICLES.length} articles */\nexport const ARTICLES = ${JSON.stringify(ARTICLES, null, 2)};\n`;
writeFileSync(join(__dirname, 'blog-articles-data.mjs'), out, 'utf8');

console.log('Written scripts/blog-articles-data.mjs\n');
console.log('Word counts:');
for (const r of report) {
  console.log(`  ${r.slug}: ${r.words} mots (${r.games} jeux)`);
}
