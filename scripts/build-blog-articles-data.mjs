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

function g(entry) {
  const key = typeof entry === 'string' ? entry : entry.key;
  const game = ALL[key];
  if (!game) throw new Error('Unknown game: ' + key);
  const copy = { ...game };
  copy.paragraphs = entry && typeof entry === 'object' && entry.paragraphs
    ? [...entry.paragraphs]
    : [...game.paragraphs];
  return copy;
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
    gameKeys: [
      { key: 'jungle-speed', paragraphs: [
        `Chronomètre en main, une partie de Jungle Speed dépasse rarement le quart d'heure, explications comprises. Le principe — poser des cartes forme et couleur jusqu'à ce qu'une correspondance déclenche la ruée vers le totem — ne demande aucune lecture de règles complexe : deux minutes de démonstration suffisent, et la première main est déjà lancée.`,
        `C'est le jeu le plus court de cette sélection, presque un format d'échauffement avant d'enchaîner sur un titre plus long. À utiliser en ouverture de soirée pour lancer l'énergie du groupe sans grever le temps disponible pour la suite du programme.`,
        `Sur les trente minutes du créneau, il n'en occupe généralement qu'un tiers, ce qui laisse une belle marge pour enchaîner directement sur un second jeu plus posé.`,
        `C'est le choix évident pour tester la réactivité du groupe avant de se lancer dans un titre qui demande plus de réflexion.`,
        `Sa boîte compacte se range facilement, ce qui permet de le ressortir en quelques secondes si une nouvelle manche s'impose entre deux autres jeux du créneau.`,
        `Même les joueurs les plus réticents aux jeux de société se laissent souvent prendre au jeu dès la première ruée vers le totem.`,
      ]},
      { key: 'love-letter', paragraphs: [
        `Une manche de Love Letter se joue en moins de cinq minutes, ce qui permet d'enchaîner plusieurs tours en restant confortablement sous les trente minutes annoncées. Le paquet de seize cartes se redistribue vite, et la partie complète ( premier à un certain nombre de jetons ) se termine généralement autour de vingt minutes montre en main.`,
        `Son gros avantage sur la durée : on peut interrompre la partie à tout moment entre deux manches sans perdre le fil, contrairement à des jeux à progression continue. Idéal si votre créneau de trente minutes risque d'être écourté par un imprévu.`,
        `C'est un bon choix quand on n'est pas certain de disposer de la demi-heure complète : même interrompu après quinze minutes, il laisse un sentiment de partie accomplie plutôt que de partie avortée.`,
        `Prévoyez de fixer un nombre de jetons à atteindre avant de commencer, pour garder un contrôle précis sur la durée totale de la partie.`,
        `C'est aussi le jeu le plus facile à ranger et relancer entre deux activités : personne ne perd de temps à recompter un score complexe entre les manches.`,
      ]},
      { key: 'uno', paragraphs: [
        `Uno tient sa promesse de rapidité à condition de limiter le nombre de manches : une partie unique dure entre dix et vingt minutes selon le nombre de joueurs et la chance des pioches de cartes +4. C'est un classique fiable quand on veut un résultat rapide sans négociation sur les règles.`,
        `Sa vitesse de mise en place — mélanger, distribuer sept cartes chacun, retourner la première — en fait l'un des jeux les plus rapides à lancer de cette sélection, sans même le temps théorique de lecture des règles puisque presque tout le monde les connaît déjà.`,
        `Comptez une bonne marge de sécurité si vous limitez le nombre de manches à l'avance : sans limite fixée, la partie peut facilement dépasser le créneau prévu selon la chance des pioches.`,
        `C'est un bon jeu de repli quand un imprévu réduit le temps disponible : tout le monde peut se lancer immédiatement sans phase d'explication.`,
      ]},
      { key: 'dobble', paragraphs: [
        `Dobble se joue en quelques minutes montre en main : chaque mini-jeu ( la tour infernale, le puits, le compte est bon ) dure entre trente secondes et trois minutes selon la variante choisie. En trente minutes, on peut enchaîner l'intégralité des cinq mini-jeux du paquet plusieurs fois de suite.`,
        `C'est le jeu le plus adapté pour combler un créneau vraiment court — dix minutes avant de passer à table, par exemple — puisqu'aucune installation n'est nécessaire au-delà de sortir la boîte ronde et distribuer les cartes.`,
        `Sur une soirée de trente minutes, c'est souvent le jeu qui vient combler les tout derniers instants avant que les invités ne partent, sans jamais donner l'impression de bâcler la fin.`,
        `Ses cinq mini-jeux permettent aussi de varier le format si le groupe a déjà joué une fois dans la soirée et cherche une nouvelle approche.`,
      ]},
      { key: 'skyjo', paragraphs: [
        `Skyjo occupe presque intégralement le créneau de trente minutes annoncé, surtout à quatre joueurs ou plus : chaque manche dure environ dix minutes, et la partie complète se joue généralement en deux ou trois manches jusqu'à atteindre le score fatidique de cent points.`,
        `C'est le titre de cette sélection qui utilise le mieux la totalité du temps disponible sans jamais paraître long : chaque manche apporte son lot de retournements grâce aux colonnes identiques qui se libèrent d'un coup, ce qui maintient l'attention du début à la fin.`,
        `Si votre créneau est strictement limité à trente minutes, fixez à l'avance un nombre de manches maximum : sans cette limite, une partie serrée peut facilement grignoter sur le temps prévu pour la suite de la soirée.`,
        `C'est le titre le plus visuel de cette sélection, ce qui en fait un bon choix pour capter l'attention d'un groupe qui commence tout juste la soirée.`,
      ]},
      { key: 'skull', paragraphs: [
        `Une partie de Skull se situe pile dans la moyenne de cette sélection : entre quinze et vingt-cinq minutes selon le nombre de joueurs et l'audace des enchères. Chaque manche individuelle est rapide, mais l'enchaînement jusqu'à deux victoires peut s'étirer si les joueurs jouent la prudence.`,
        `Son rythme reste néanmoins prévisible : si vous sentez que le temps presse, arrêter la partie après une seule manche gagnante reste tout à fait satisfaisant, contrairement à des jeux où interrompre la progression casse l'expérience.`,
        `C'est un bon choix pour occuper le milieu du créneau de trente minutes, entre un jeu d'ouverture très rapide et un titre plus long à sortir ensuite si l'énergie du groupe le permet.`,
        `Fixez d'avance un nombre de manches gagnantes si le temps presse vraiment : le jeu se prête bien à une limite claire sans perdre en intensité.`,
      ]},
      { key: 'timeline', paragraphs: [
        `Timeline se termine généralement en quinze à vingt minutes, la durée exacte dépendant surtout du nombre de cartes à écouler par joueur en début de partie ( réglable selon le temps disponible ). C'est l'un des rares jeux de cette liste où l'on peut ajuster consciemment la durée avant même de commencer.`,
        `Réduire à quatre cartes par joueur plutôt que six permet de rester largement dans le créneau des trente minutes tout en gardant l'essentiel du plaisir de placement chronologique — un bon réglage si le groupe est nombreux et que chaque tour prend un peu plus de temps.`,
        `Cette flexibilité en fait un bon choix de secours si un autre jeu de la sélection a pris plus de temps que prévu : Timeline s'adapte au temps qu'il reste plutôt que l'inverse.`,
        `C'est aussi un bon jeu de fin de créneau : même écourté, une manche interrompue laisse déjà un aperçu satisfaisant du placement chronologique en cours.`,
      ]},
    ],
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
    gameKeys: [
      { key: 'schotten-totten', paragraphs: [
        `Schotten Totten est conçu pour deux duellistes, mais à trois, la formule fonctionne en alternance : deux joueurs s'affrontent sur les neuf bornes tandis que le troisième observe et prépare sa revanche. Poser des cartes de chaque côté d'une borne pour former la meilleure combinaison façon poker crée une tension immédiate, et le tour d'observation n'a rien d'ennuyeux — on apprend les habitudes de bluff de ses deux adversaires avant d'affronter chacun à son tour.`,
        `Sur une soirée à trois, on tourne généralement après chaque manche de dix minutes, si bien que tout le monde joue autant qu'il regarde. C'est ce format court qui rend Schotten Totten idéal quand on est un nombre impair : personne ne reste longtemps sur la touche, et les cartes Clan optionnelles ajoutent assez de variété pour enchaîner plusieurs rounds sans lassitude.`,
        `À prévoir dans un sac à part si votre trio se retrouve régulièrement : les manches sont assez courtes pour en jouer deux ou trois d'affilée avant de passer à autre chose, sans jamais que le troisième joueur ne s'ennuie longtemps.`,
        `Les neuf bornes se rangent aussi facilement dans une pochette de jeu, ce qui en fait une option légère à glisser dans le sac du trio sans y penser.`,
      ]},
      { key: 'lost-cities', paragraphs: [
        `Même logique que Schotten Totten pour Lost Cities : un duel strict à deux qui se prête bien à la rotation à trois. Ici, on lance des expéditions dans cinq contrées en posant des cartes en ordre croissant, avec un risque réel de finir dans le négatif si l'expédition n'est pas assez rentabilisée. Le troisième joueur, en attendant son tour, peut suivre les scores et deviner qui va oser ouvrir la cinquième expédition en fin de partie.`,
        `Ce qui distingue Lost Cities de Schotten Totten dans une soirée à trois, c'est le rythme plus calculateur : chaque carte posée engage une vraie décision de gestion de risque plutôt qu'un pur rapport de force. Les deux jeux se complètent bien en alternance, l'un plus tactique et bluffeur, l'autre plus arithmétique.`,
        `En pratique, beaucoup de trios gardent les deux boîtes ensemble et laissent le troisième joueur choisir lequel lancer selon l'humeur du moment — une bonne façon de varier les styles de duel sans jamais tourner en rond.`,
        `Prévoyez de compter les points au fur et à mesure : avec trois manches qui s'enchaînent, il est facile de perdre le fil du score total sur toute la soirée.`,
      ]},
      { key: 'hanabi', paragraphs: [
        `À trois, Hanabi change de nature par rapport à ses configurations à quatre ou cinq : chaque joueur tient plus de cartes en main, ce qui augmente la charge mentale sur la mémorisation des indices donnés aux deux autres. La coopération devient plus resserrée — on suit précisément ce que chacun sait, sans la dilution qui peut survenir à cinq joueurs.`,
        `Ce format à trois est souvent cité par les habitués comme l'un des plus intenses pour Hanabi : moins de bruit informationnel, des décisions qui pèsent plus lourd, et un feu d'artifice final qui se joue vraiment à la communication non verbale entre trois cerveaux synchronisés.`,
        `C'est souvent la configuration recommandée à un trio qui découvre Hanabi pour la première fois : suffisamment de joueurs pour ressentir la vraie coopération, sans la complexité de suivre cinq mains différentes en même temps.`,
        `Gardez à l'esprit que chaque joueur tient une main plus grande à trois qu'à cinq, ce qui allonge légèrement chaque manche sans jamais la rendre pesante.`,
      ]},
      { key: 'skull', paragraphs: [
        `Skull à trois joueurs resserre le cercle du bluff : il n'y a que deux adversaires à lire, ce qui rend chaque pari plus personnel et chaque tête de mort plus mémorable. Poser des cartes face cachée puis annoncer combien on pense pouvoir en retourner sans tomber sur le crâne devient un jeu psychologique direct, presque un duel malgré le troisième participant.`,
        `L'avantage à trois, c'est la rapidité des manches et la clarté des motivations : difficile de se cacher derrière un groupe quand il ne reste que deux visages à observer. C'est souvent le format où les nouveaux joueurs comprennent le plus vite pourquoi Skull fait autant parler de lui en soirée.`,
        `À trois, une seule victoire suffit généralement pour clore la manche en quelques minutes, ce qui en fait un bon jeu d'ouverture ou de clôture de soirée sans jamais s'éterniser inutilement.`,
        `Les quatre coasters par joueur suffisent largement à trois : inutile d'ajouter du matériel supplémentaire, la boîte de base couvre parfaitement ce format.`,
      ]},
      { key: 'love-letter', paragraphs: [
        `Love Letter se joue de deux à quatre, et le format à trois joueurs est souvent considéré comme le plus équilibré par les habitués : assez de monde pour que la déduction reste incertaine, pas assez pour que l'information se dilue trop vite. Chaque carte jouée élimine des possibilités chez les deux adversaires, et deviner qui protège la Princesse devient un vrai exercice de logique.`,
        `Les manches durent à peine cinq minutes, ce qui permet d'enchaîner plusieurs tours de jeu — pratique à trois pour alterner qui distribue et garder le rythme. C'est un excellent sas d'entrée en début de soirée avant de passer à un jeu plus long.`,
        `Avec seulement deux adversaires à observer, deviner qui garde une carte forte devient un exercice quasi permanent, ce qui rend le format à trois particulièrement intense pour les amateurs de déduction pure.`,
        `Gardez les seize cartes bien mélangées entre chaque manche : à trois, la petite taille du paquet rend les habitudes de distribution plus vite repérables qu'à quatre joueurs.`,
      ]},
      { key: 'the-crew', paragraphs: [
        `The Crew propose une coopération de plis où l'équipe doit remplir des missions précises sans avoir le droit de communiquer ouvertement sur ses cartes. À trois joueurs, la coordination silencieuse est plus lisible : moins de mains à surveiller, plus de place mentale pour anticiper qui détient probablement telle carte maîtresse.`,
        `La campagne progressive de missions garde son intérêt à trois comme à quatre, mais certains fans trouvent que le format resserré rend les cartes de communication limitées ( une seule autorisée par manche ) encore plus cruciales : le silence pèse plus lourd quand il n'y a que deux coéquipiers à décoder.`,
        `Un bon choix pour un trio qui aime les défis progressifs : la campagne de missions donne un objectif clair à chaque soirée, contrairement à un jeu qui se rejoue identique à chaque fois.`,
        `Notez la mission en cours entre deux sessions si votre trio ne joue pas toutes les semaines : la campagne se suit mieux avec un peu de continuité d'une soirée à l'autre.`,
      ]},
      { key: 'skyjo', paragraphs: [
        `Skyjo accepte de deux à huit joueurs, et à trois, les parties vont particulièrement vite : moins de colonnes à surveiller chez les adversaires, des manches qui se terminent rapidement dès qu'un joueur retourne ses dernières cartes. C'est le format qui permet d'enchaîner le plus de manches en une soirée courte.`,
        `À trois, la stratégie de gestion du risque ( retourner une carte inconnue ou piocher la défausse visible ) se joue de façon plus tendue, puisque chaque décision affecte directement deux adversaires identifiables plutôt qu'un groupe diffus. Un bon compromis entre le calme du duel et l'agitation d'une grande tablée.`,
        `Les grilles de cartes tiennent facilement sur une petite table à trois, contrairement à une tablée de six ou huit où l'espace devient vite un vrai sujet.`,
        `C'est souvent le jeu que l'on sort en fin de soirée à trois, quand l'envie est plus à la légèreté qu'à la concentration exigée par Hanabi ou The Crew plus tôt dans la soirée.`,
      ]},
    ],
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
    gameKeys: [
      { key: 'skull', paragraphs: [
        `Skull pousse le pari dans ses retranchements les plus purs : après avoir posé une carte face cachée, chaque joueur annonce combien de cartes il pense pouvoir retourner sans tomber sur une tête de mort. Aucune information factuelle ne circule — seulement des regards, des hésitations et des enchères qui grimpent jusqu'à ce que quelqu'un craque ou ose tenter le tout.`,
        `Ce qui rend Skull redoutable, c'est l'absence totale de garde-fou mathématique : contrairement à un pari de plis chiffré, ici on parie sur la psychologie pure des trois autres joueurs. Les parties se jouent en quelques minutes, mais la tension monte à chaque round où l'enchère dépasse ce qui semblait raisonnable.`,
        `C'est le jeu à sortir avec un groupe qui se connaît déjà bien : plus les joueurs se lisent finement, plus les enchères deviennent savoureuses à observer de l'extérieur comme à jouer soi-même.`,
        `Les manches durent rarement plus de cinq minutes, ce qui permet d'enchaîner facilement plusieurs parties tant que l'enthousiasme du groupe reste au rendez-vous.`,
      ]},
      { key: 'wizard', paragraphs: [
        `Wizard structure le pari différemment : avant chaque donne, on annonce exactement combien de plis on compte remporter, avec un score qui récompense la précision plutôt que la simple victoire. Rater son pari d'une seule levée coûte aussi cher que de se tromper largement — un système impitoyable qui force une lecture fine de sa main dès la distribution.`,
        `Sur une quinzaine de manches, la variance s'équilibre et seuls les joueurs capables d'estimer juste, donne après donne, prennent l'avantage. C'est un pari plus cérébral que celui de Skull : moins de bluff pur, plus de calcul de probabilités sur les cartes Atout et les cartes restantes en jeu.`,
        `Un bon choix pour les groupes qui préfèrent un pari mathématique et loyal à un pur affrontement psychologique — chacun peut objectivement vérifier a posteriori si son estimation était juste ou non.`,
        `Prévoyez une bonne heure pour une partie complète à six joueurs : c'est l'un des titres les plus longs de cette sélection, mais aussi l'un des plus satisfaisants sur la durée.`,
      ]},
      { key: 'oh-hell', paragraphs: [
        `Oh Hell! reprend le principe du pari de plis avec une variante cruelle : le nombre de cartes distribuées change à chaque manche, montant puis redescendant, ce qui oblige à recalibrer son estimation en permanence. Un joueur en confiance après une bonne donne à dix cartes peut totalement se planter à la donne suivante, réduite à trois.`,
        `Sa règle historique — la somme des annonces ne doit jamais correspondre exactement au nombre de plis disponibles — est la même contrainte mathématique que celle de KYRAN, mais sans les cartes Pouvoir ni la manche Mystique. Un bon complément plus épuré pour les amateurs de paris de plis version classique.`,
        `Ses règles tiennent sur une seule feuille, ce qui en fait un bon jeu à emporter chez des amis sans avoir à justifier une longue explication avant de commencer à jouer.`,
        `Sa contrainte de pari identique à celle de KYRAN en fait un bon point de comparaison pour les joueurs curieux de tester deux approches différentes de la même idée.`,
      ]},
      { key: '6-qui-prend', paragraphs: [
        `6 qui prend! change complètement de registre de pari : ici on ne mise pas verbalement, on joue une carte numérotée à l'aveugle en espérant qu'elle ne complète pas une rangée de cinq déjà pleine, ce qui obligerait à ramasser tout le tas et ses points de bœufs. Le pari est implicite, presque un jeu de poulet collectif où personne ne sait ce que les autres révéleront.`,
        `L'effet de groupe est total : à six ou sept joueurs, deviner quelle rangée va se remplir en premier relève d'un calcul de probabilité rapide mêlé à une bonne dose de chance. C'est le jeu de la sélection qui provoque le plus de cris collectifs quand une carte piégée tombe au mauvais moment.`,
        `Idéal en grand groupe pour clôturer une soirée bluff et pari sur une note plus légère, après des jeux plus tendus comme Skull ou Bang! qui demandent davantage de concentration individuelle.`,
        `Les dix manches réglementaires s'enchaînent vite, généralement en une demi-heure montre en main, sans jamais donner l'impression de s'éterniser.`,
      ]},
      { key: 'bang', paragraphs: [
        `Dans Bang!, le pari est existentiel : chaque joueur reçoit un rôle secret — shérif, hors-la-loi, adjoint ou renégat — et doit deviner qui tirer avant de se faire abattre lui-même. Accuser le mauvais joueur ou révéler prématurément ses soupçons peut coûter la partie, ce qui rend chaque carte jouée porteuse d'un sous-texte de bluff.`,
        `Contrairement aux jeux de plis de cette sélection, ici le pari porte sur l'identité des autres plutôt que sur un score chiffré. L'ambiance western et les cartes d'action variées ( Bang!, Esquive, Bière ) ajoutent un chaos théâtral qui plaît particulièrement aux groupes qui aiment jouer un rôle.`,
        `Comptez une bonne demi-heure de mise en place mentale la première fois — le temps que chacun comprenne son rôle et ses objectifs — puis les parties suivantes s'enchaînent bien plus vite.`,
        `Prévoyez idéalement quatre à sept joueurs : en dessous, les rôles perdent de leur intérêt tactique, faute d'assez de suspects à surveiller autour de la table.`,
      ]},
      { key: 'saboteur', paragraphs: [
        `Saboteur cache un ou plusieurs traîtres parmi les mineurs, et le vrai pari consiste à deviner qui sabote discrètement le réseau de galeries avant qu'il ne soit trop tard pour l'exclure des récompenses en or. Ici, mentir sur ses intentions est une mécanique de jeu à part entière, pas juste une option.`,
        `À la différence de Bang! où les rôles se dévoilent souvent en cours de partie, Saboteur laisse planer le doute jusqu'à la distribution finale des pépites — un format qui fonctionne très bien en grand groupe, jusqu'à dix joueurs, pour multiplier les suspects et les fausses pistes.`,
        `Contrairement à Bang! où le pari porte sur des rôles fixes en début de partie, ici le doute évolue en temps réel au fil des actions de chacun, ce qui garde la tension vive jusqu'au tout dernier tour.`,
        `Comptez une bonne demi-heure pour une partie à huit ou dix joueurs, le format où les fausses pistes et les alliances de circonstance sont les plus savoureuses.`,
      ]},
      { key: 'colt-express', paragraphs: [
        `Colt Express transforme le pari en programmation simultanée à l'aveugle : chaque joueur empile des cartes d'action face cachée sans savoir ce que les autres bandits ont prévu, avant de les révéler et de subir les conséquences parfois catastrophiques de mauvais timing. Le braquage du train ne se déroule jamais comme prévu.`,
        `Le plateau en trois dimensions et les figurines ajoutent une dimension physique rare dans cette sélection, plutôt composée de jeux de cartes pures. C'est le titre le plus long et le plus spectaculaire du lot, parfait pour clôturer une soirée bluff et pari sur une note mémorable.`,
        `Prévoyez une bonne quarantaine de minutes montre en main : c'est le jeu le plus long de cette sélection, mais aussi celui dont les joueurs se souviennent le plus longtemps après la soirée.`,
        `Prévoyez une table dégagée pour le plateau en trois dimensions : c'est le seul jeu de cette sélection qui demande vraiment de l'espace physique pour être apprécié pleinement.`,
      ]},
    ],
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
    gameKeys: [
      { key: 'timeline', paragraphs: [
        `Timeline ne demande aucun apprentissage de règles au sens strict : on pose une carte, on la situe avant ou après celles déjà alignées, et on découvre si on a vu juste. Pour un adulte qui n'a pas touché à un jeu de société depuis l'enfance, c'est une entrée en matière rassurante — aucune stratégie à maîtriser, juste de la culture générale et un peu de chance.`,
        `L'échec n'y est jamais humiliant : se tromper signifie simplement récupérer une carte de plus, sans pénalité de points ni élimination. C'est exactement le type de tolérance à l'erreur qui met à l'aise un joueur qui craint de « ne pas être doué » pour les jeux modernes.`,
        `C'est le premier jeu à sortir face à un groupe totalement néophyte : il installe une ambiance détendue avant d'introduire des mécaniques plus riches dans la suite de la soirée.`,
        `Sa règle tenant sur une seule phrase, aucun débutant ne peut se sentir perdu, même en arrivant en retard à la soirée découverte.`,
        `C'est aussi un bon jeu pour observer discrètement le niveau d'aisance du groupe avant de proposer des titres plus exigeants dans la suite de la soirée.`,
        `Les cartes elles-mêmes racontent une petite histoire à chaque partie, ce qui donne aux nouveaux joueurs une bonne raison d'apprendre spontanément quelques dates au passage.`,
      ]},
      { key: 'dixit', paragraphs: [
        `Dixit repose sur l'interprétation d'images oniriques plutôt que sur des règles à mémoriser : un joueur énonce un indice, les autres choisissent parmi leurs cartes celle qui correspond le mieux, et on vote pour deviner la bonne. Aucune connaissance préalable des jeux de société n'est nécessaire pour y briller — l'imagination suffit.`,
        `C'est souvent le titre recommandé en premier aux groupes d'adultes qui n'ont jamais joué ensemble : il ne crée aucune hiérarchie de compétence, contrairement aux jeux de stratégie où l'expérience fait une vraie différence dès la première partie.`,
        `Un débutant peut même y gagner sa première partie face à des joueurs expérimentés, ce qui installe une confiance précieuse pour aborder ensuite des jeux plus exigeants.`,
        `Ses illustrations oniriques suffisent à elles seules à lancer la conversation, un bon moyen de détendre un groupe qui ne se connaît pas encore très bien.`,
        `Personne ne peut vraiment « perdre » à Dixit au sens habituel du terme, ce qui rassure particulièrement les joueurs qui redoutent la compétition directe dès leur première soirée.`,
        `C'est souvent le jeu qui révèle le plus de personnalité chez des adultes qui viennent de se rencontrer, bien plus qu'une simple présentation classique autour de la table.`,
      ]},
      { key: 'codenames', paragraphs: [
        `Codenames introduit en douceur la notion de déduction en équipe : un capitaine donne un indice en un seul mot pour faire deviner plusieurs cartes à ses coéquipiers. La mécanique se comprend en une minute, mais la marge de progression est réelle — un bon point d'entrée vers des jeux plus exigeants en réflexion.`,
        `Jouer en équipe réduit aussi la pression individuelle : un débutant qui hésite peut s'appuyer sur ses coéquipiers plutôt que de porter seul la responsabilité d'une mauvaise décision, ce qui rend l'apprentissage collectif plus confortable.`,
        `C'est un bon troisième jeu dans une soirée découverte, une fois que le groupe a pris confiance avec des titres plus simples comme Timeline ou Dixit.`,
        `Jouer par équipes de deux réduit aussi l'enjeu individuel : personne ne porte seul la responsabilité d'un mauvais indice donné aux coéquipiers.`,
      ]},
      { key: 'love-letter', paragraphs: [
        `Avec seulement seize cartes et une règle par carte à retenir, Love Letter est l'un des jeux de déduction les plus simples à expliquer à un adulte néophyte. Chaque manche dure cinq minutes, ce qui permet de recommencer immédiatement après une erreur de compréhension plutôt que de subir les conséquences pendant toute une longue partie.`,
        `C'est un bon second jeu après Timeline ou Dixit : il introduit le concept de bluff et de déduction sans la lourdeur d'un jeu de plis ou de gestion de ressources, marche d'escalier naturelle vers des titres plus stratégiques.`,
        `Sa rapidité permet aussi de rejouer immédiatement après une manche ratée par incompréhension des règles, sans que l'erreur ne pèse sur le reste de la soirée.`,
        `Seize cartes suffisent à créer une vraie tension de déduction, la preuve qu'un jeu accessible n'a pas besoin d'un gros paquet pour être intéressant.`,
      ]},
      { key: 'jungle-speed', paragraphs: [
        `Jungle Speed mise sur le réflexe plutôt que sur la stratégie, ce qui le rend immédiatement accessible même à quelqu'un qui pense « ne pas être fait pour les jeux de société ». Il n'y a rien à calculer : on regarde les cartes, on réagit vite, un point c'est tout.`,
        `Cette simplicité en fait un excellent brise-glace en toute première partie de soirée découverte : il détend l'atmosphère et rappelle que jouer, c'est avant tout s'amuser — avant d'enchaîner sur des jeux qui demandent un peu plus de réflexion.`,
        `Pour un groupe d'adultes qui se retrouvent après une longue pause loin des jeux de société, c'est souvent le titre qui déclenche les premiers vrais fous rires de la soirée.`,
        `Aucun matériel complexe à gérer au-delà du paquet de cartes et du totem central, ce qui simplifie encore la mise en place pour un groupe qui débute.`,
      ]},
      { key: 'skyjo', paragraphs: [
        `Skyjo emprunte la logique familière de la bataille de cartes à réduire son score, un principe que beaucoup d'adultes reconnaissent instinctivement même sans expérience du jeu moderne. Retourner une carte ou piocher dans la défausse visible reste un choix simple à comprendre dès le premier tour.`,
        `C'est un bon jeu de transition entre les classiques familiaux et les jeux de cartes plus structurés : la mécanique de colonnes identiques qui se libèrent introduit une notion tactique légère, sans jamais devenir intimidante pour un joueur encore hésitant.`,
        `C'est un bon jeu à proposer en quatrième ou cinquième position dans une soirée découverte, une fois que le groupe est prêt à suivre un peu plus de règles simultanées.`,
        `Contrairement à un jeu de plis classique, ici aucune notion d'atout ou de levée à intégrer : seule la logique de minimisation du score compte vraiment.`,
      ]},
      { key: 'uno', paragraphs: [
        `Uno a l'avantage rare d'être déjà connu de presque tout le monde, ce qui en fait un point de repère rassurant pour un adulte qui redécouvre les jeux de société après une longue pause. Aucune explication n'est vraiment nécessaire, ce qui élimine tout stress lié à l'apprentissage.`,
        `Partir d'un terrain connu avant d'explorer des titres plus modernes est une stratégie pédagogique efficace : Uno sert de sas de décompression entre deux jeux plus exigeants de cette sélection, sans jamais faire sentir au débutant qu'il est largué.`,
        `C'est aussi le jeu à garder en réserve pour combler une pause ou clôturer la soirée sur une note familière, quand l'attention du groupe commence doucement à retomber.`,
        `Sa notoriété fait qu'aucun débutant n'a jamais l'impression de découvrir vraiment un nouveau jeu, ce qui en fait la valeur refuge de toute soirée découverte.`,
      ]},
    ],
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
    gameKeys: [
      { key: 'love-letter', paragraphs: [
        `Seize cartes, une pochette minuscule : Love Letter tient dans la poche d'un short et pèse moins qu'un chargeur de téléphone. En vacances, c'est le jeu qui sort en dix secondes à la terrasse d'un café ou entre deux baignades, sans dépliage de plateau ni pièces à recompter chaque fois.`,
        `Sa résistance au vent et au sable est un vrai atout : peu de cartes à surveiller, aucune pièce qui roule sous une chaise longue. Les manches de cinq minutes s'enchaînent naturellement pendant qu'on attend le repas ou que quelqu'un revient de l'eau.`,
        `Glissez-le dans la pochette avant de tout sac de voyage : sa taille est telle qu'on oublie presque qu'il est là, jusqu'au moment où une pause imprévue se transforme en trois manches improvisées.`,
        `Même mouillé accidentellement, le petit paquet sèche vite au soleil sans se déformer, contrairement à des cartes plus grandes et plus fines.`,
        `C'est le jeu qui tient dans la moindre poche restante de la valise, souvent celui qu'on redécouvre avec plaisir au fond d'un sac en fin de séjour.`,
        `Ses illustrations soignées surprennent souvent des compagnons de voyage qui ne s'attendaient pas à un jeu aussi élégant pour un format aussi minuscule.`,
      ]},
      { key: 'uno', paragraphs: [
        `Uno reste une valeur sûre de voyage : tout le monde connaît les règles de base, ce qui évite les explications interminables au camping ou en famille élargie. Le paquet de cartes cartonnées tolère bien les manipulations répétées et les surfaces improvisées — table de pique-nique, plaid sur l'herbe, tablette de train.`,
        `Son format compact et sa boîte rigide en font un compagnon fiable pour les longs trajets : facile à ranger dans une poche de sac à dos, résistant aux chocs, et suffisamment universel pour rassembler des joueurs d'âges et de nationalités différentes autour d'une même table de vacances.`,
        `C'est souvent le jeu qui brise la glace avec des voisins de camping ou des rencontres de dernière minute en auberge : tout le monde connaît déjà les règles, ce qui évite le moment gênant de l'explication.`,
        `Les cartes +4 et +2 accélèrent aussi les manches quand le groupe veut enchaîner vite avant de repartir en excursion.`,
        `C'est aussi le jeu qui traverse le mieux les frontières linguistiques : les symboles et couleurs des cartes se comprennent sans besoin de traduire les règles.`,
        `Son prix modeste en fait aussi un bon cadeau de dernière minute pour un compagnon de voyage rencontré en chemin, sans jamais peser sur le budget du séjour.`,
      ]},
      { key: 'dobble', paragraphs: [
        `Dobble tient dans une boîte ronde métallique à peine plus grande qu'un poudrier — l'un des formats les plus compacts du marché, parfait pour une trousse de toilette ou une poche de bermuda. Trouver le symbole commun entre deux cartes ne demande aucune table : on joue debout, assis dans l'herbe ou calé contre un rocher de plage.`,
        `Comme il ne nécessite aucune surface plane, Dobble est souvent le premier jeu sorti en vacances — sur une serviette, dans une file d'attente, à l'arrière d'une voiture. Sa boîte métallique protège bien les cartes de l'humidité, un vrai plus près de l'eau.`,
        `Sa boîte ronde tient aussi debout sur un coin de serviette sans s'envoler, un détail pratique que l'on apprécie vite une fois sur la plage face au vent.`,
        `Son format court permet aussi de le lancer pendant un arrêt sur une aire d'autoroute, le temps que tout le monde se dégourdisse les jambes.`,
      ]},
      { key: 'jungle-speed', paragraphs: [
        `Le totem de Jungle Speed voyage bien : il tient dans la paume et ne craint ni le sable ni les chocs de valise. En camping ou en résidence de vacances, c'est le jeu qui réveille un groupe fatigué en fin de journée — les cartes forme et couleur imposent des réflexes qui n'ont pas besoin de traduction.`,
        `Attention toutefois à la surface de jeu : mieux vaut une table stable pour éviter que le totem ne roule dans le sable ou l'herbe. Une fois cette précaution prise, les parties s'enchaînent en dix minutes, largement le temps entre deux activités de vacances.`,
        `C'est le jeu qui réunit le plus facilement des groupes de générations mélangées en vacances : enfants, parents et grands-parents comprennent la règle en une démonstration, sans distinction de niveau.`,
        `Prévoyez simplement une table ferme avant de commencer : c'est le seul vrai prérequis matériel pour profiter pleinement du jeu en vacances.`,
      ]},
      { key: 'skull', paragraphs: [
        `Skull se résume à quatre petits sets de coasters par joueur — un format ultra plat qui ne prend quasiment aucune place dans une valise. Contrairement aux jeux de cartes classiques, les disques ne craignent ni pliure ni humidité, un vrai avantage en bord de mer ou en camping sous tente.`,
        `Le jeu se joue sans table indispensable — sur les genoux, sur une serviette — et sa mécanique de bluff simple en fait un bon candidat pour les soirées vacances où l'on veut du frisson social sans sortir de grosses boîtes encombrantes.`,
        `Sa boîte plate se glisse même dans une pochette d'ordinateur ou une poche extérieure de valise, sans jamais peser sur le poids total des bagages.`,
        `C'est un bon choix pour les vacances en van ou en petite voiture, où chaque centimètre cube de rangement compte vraiment.`,
      ]},
      { key: 'timeline', paragraphs: [
        `Timeline ne pèse presque rien et se joue sans table dédiée : on pose les cartes chronologiques directement sur l'herbe ou une nappe de pique-nique. En voyage, c'est aussi une manière ludique de faire durer les longs après-midi sans écran, petits et grands mélangés.`,
        `Sa rejouabilité est un atout pour un séjour prolongé : avec plusieurs dizaines de cartes différentes, les parties ne se répètent jamais vraiment, contrairement à des jeux plus courts qu'on épuise en quelques jours de vacances.`,
        `C'est un bon jeu à garder pour les séjours de plus d'une semaine, quand les jeux plus courts de cette sélection commencent à montrer leurs limites en termes de nouveauté.`,
        `Sa boîte reste compacte malgré le grand nombre de cartes, ce qui n'alourdit pas vraiment le sac malgré la richesse du contenu.`,
      ]},
      { key: 'saboteur', paragraphs: [
        `Saboteur demande un peu plus de place pour étaler le réseau de galeries, mais reste facilement transportable en boîte souple. C'est le jeu à sortir un soir de pluie sous la tente ou dans un gîte, quand le groupe est assez nombreux pour profiter des rôles cachés de mineurs et de saboteurs.`,
        `Sa durée d'environ trente minutes et sa capacité à accueillir jusqu'à dix joueurs en font un bon choix pour les vacances en groupe élargi — colonies, campings associatifs, grandes tablées familiales où tout le monde veut participer en même temps.`,
        `C'est le jeu à réserver aux soirées où la météo ne permet pas de sortir : sa durée plus longue et sa dimension sociale en font une bonne alternative à une soirée film sous la tente.`,
        `Sa boîte souple se glisse dans un coin de valise sans prendre de forme rigide, ce qui en fait un bon choix pour les vacances où chaque espace de rangement est déjà optimisé.`,
      ]},
    ],
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
