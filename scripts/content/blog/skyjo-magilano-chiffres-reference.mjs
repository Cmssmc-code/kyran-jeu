const NO = 'https://www.nouvelobs.com/economie/20241221.OBS98112/il-y-a-un-truc-super-addictif-comment-skyjo-est-devenu-la-nouvelle-star-des-jeux-de-societe.html';
const REGLE = 'https://cdn.shopify.com/s/files/1/0354/4137/7413/files/skyjo-regle-du-jeu.pdf';
const MAG = 'https://www.magilano.com/en';
const IMPRESSUM = 'https://www.magilano.com/en/pages/impressum';
const WPFR = 'https://fr.wikipedia.org/wiki/Skyjo';
const WPDE = 'https://de.wikipedia.org/wiki/Skyjo';
const BGG = 'https://api.geekdo.com/api/geekitems?objectid=204135&objecttype=thing&subtype=boardgame';
const BGGA = 'https://api.geekdo.com/api/geekitems?objectid=301242&objecttype=thing&subtype=boardgame';
const NUM = 'https://www.numerama.com/pop-culture/1473936-skyjo.html';
const TEAM = 'https://teammates.fr/jeux-de-cartes/oubliez-le-uno-maintenant-il-y-a-skyjo/';
const RDJ = 'https://www.regles-du-jeu.net/?p=7868';
const a = (href, t) => `<a class="text-link" href="${href}">${t}</a>`;

const cartes = [['−2', 5], ['−1', 10], ['0', 15], ...Array.from({ length: 12 }, (_, i) => [String(i + 1), 10])];
const tableCartes = `<div class="compare-table-wrap"><table class="compare-table"><caption>Les 150 cartes de Skyjo : valeur, exemplaires et part du paquet (effectifs relevés sur Wikipédia)</caption><thead><tr><th scope="col">Valeur</th><th scope="col">Exemplaires</th><th scope="col">Part du paquet</th></tr></thead><tbody>${cartes.map(([v, n]) => `<tr><th scope="row">${v}</th><td>${n}</td><td>${(n / 1.5).toFixed(2).replace('.', ',')} %</td></tr>`).join('')}</tbody></table></div>`;

const tableGamme = `<div class="compare-table-wrap"><table class="compare-table"><caption>La gamme Skyjo sur la boutique de l’éditeur, relevée le 14 novembre 2026</caption><thead><tr><th scope="col">Jeu</th><th scope="col">Joueurs</th><th scope="col">Âge</th><th scope="col">Prix sur magilano.com</th></tr></thead><tbody><tr><th scope="row">Skyjo</th><td>2 à 8</td><td>dès 8 ans</td><td>19,95 €</td></tr><tr><th scope="row">Skyjo Action</th><td>2 à 8</td><td>dès 8 ans</td><td>19,95 €</td></tr><tr><th scope="row">Skyjo Junior</th><td>2 à 5</td><td>dès 4 ans</td><td>16,95 €</td></tr><tr><th scope="row">Skyjo Voyage</th><td>2 à 4</td><td>dès 8 ans</td><td>16,95 €</td></tr></tbody></table></div>`;

export default {
  slug: 'skyjo-magilano-chiffres-reference',
  format: 'essai',
  title: 'Skyjo et Magilano : dates, ventes et règle exacte, vérifiées dans les sources',
  shortTitle: 'Skyjo et Magilano, les chiffres',
  metaTitle: 'Magilano, éditeur de Skyjo : histoire, ventes et règle vérifiées',
  description: 'Qui est Magilano, quand Skyjo est sorti, combien s’en est vendu en France, ce que dit la règle officielle sur le doublement des points : chiffres sourcés.',
  category: 'Cartes',
  date: '2026-11-14',
  heroTitle: 'Skyjo et Magilano : <span class="accent">ce que les sources établissent</span>',
  heroSubtitle: 'Un éditeur qui est aussi l’auteur, une sortie en 2015, une distribution française en 2019, 150 cartes dont on peut calculer les probabilités.',
  heroImage: '/blog/images/skyjo-magilano-chiffres-reference.jpg',
  heroCaption: 'Illustration créée pour KYRAN : une grille de neuf cartes dont trois face visible, un emplacement vide en pointillés, une pile de trois cartes violettes identiques et une carte face cachée en safran.',
  intro: `<p><strong>Magilano est la maison d’édition d’Alexander Bernhardt, l’auteur de Skyjo, qui y a publié son jeu de cartes en 2015.</strong> D’après ${a(NO, 'Le Nouvel Obs')}, le jeu s’est vendu à plus de trois millions d’exemplaires en France depuis que Blackrock Games le distribue, c’est-à-dire depuis 2019. Entre ces deux dates, les sources se contredisent parfois, et la règle est souvent mal citée. Cet article rassemble ce que l’on peut vérifier : la fiche de l’éditeur, la règle officielle lue en PDF, la fiche BoardGameGeek, la presse, puis un calcul exact sur la composition du paquet. Chaque ligne des fichiers de données renvoie à sa source, et les écarts entre sources sont montrés plutôt que lissés.</p>`,
  keyPoints: {
    html: `<ul><li>Skyjo sort en 2015 chez Magilano, l’éditeur d’Alexander Bernhardt, pour 2 à 8 joueurs et 15 à 45 minutes (fiche ${a(BGG, 'BoardGameGeek')}).</li><li>Blackrock Games découvre le jeu en 2017 et le distribue en France depuis 2019 ; plus de 3 millions d’exemplaires vendus en France selon ${a(NO, 'Le Nouvel Obs')} (21 décembre 2024).</li><li>Le paquet compte 150 cartes de −2 à 12 : valeur moyenne de 5,07 points, et trois cartes tirées au hasard sont identiques 1 fois sur 272.</li><li>Le doublement des points de celui qui ferme la manche ne vaut que pour les points positifs, et s’applique s’il n’a pas, strictement, le plus petit total (${a(REGLE, 'règle officielle')}).</li></ul>`
  },
  sections: [
    {
      id: 'qui-est-magilano',
      heading: 'Qui est Magilano : un éditeur qui est aussi l’auteur',
      html: `<p>Magilano est une maison d’édition allemande qui repose sur une seule personne : Alexander Bernhardt. ${a(IMPRESSUM, 'Les mentions légales du site')} indiquent « Magilano, Alexander Bernhardt », avec une adresse à Hachenburg, en Allemagne. ${a(WPDE, 'Wikipédia en allemand')} présente Skyjo comme un jeu de cet auteur publié en 2015 chez Magilano, et ${a(BGG, 'BoardGameGeek')} crédite Alexander Bernhardt comme auteur et illustrateur, avec Magilano comme éditeur principal. ${a(NUM, 'Numerama')} le dit à sa façon : Skyjo est « un jeu d’Alexander Bernhardt, illustré (façon de parler) par lui-même ».</p><p>Ce modèle d’auteur-éditeur compte pour comprendre le succès du jeu. Selon ${a(NO, 'Le Nouvel Obs')}, c’est un distributeur français, Blackrock Games, qui a repéré Skyjo sur internet en 2017, en a commandé une boîte pour l’essayer avec son équipe, puis a pris contact avec l’auteur. Le jeu n’a donc pas été lancé en France par une grande structure éditoriale, mais par un distributeur qui l’a découvert en le commandant.</p><p>Le pied de page du site de l’éditeur porte la mention « © 2016-2026 Magilano » : la marque commerciale existe donc au moins depuis 2016. BoardGameGeek liste aussi, pour la même fiche, d’autres éditeurs correspondant à des éditions localisées.</p>`
    },
    {
      id: 'gamme',
      heading: 'La gamme actuelle : quatre jeux, quatre prix',
      html: `<p>La boutique de l’éditeur présente quatre jeux dans la gamme Skyjo : le jeu de base, Skyjo Action, Skyjo Junior et Skyjo Voyage. Le tableau reprend les joueurs, l’âge et le prix affichés sur ${a(MAG, 'la page d’accueil de magilano.com')} le 14 novembre 2026.</p>${tableGamme}<p>Skyjo Action est sorti en 2019 selon ${a(BGGA, 'BoardGameGeek')} (2 à 8 joueurs, 30 minutes, dès 8 ans). ${a(NO, 'Le Nouvel Obs')} résume la différence : cette édition ajoute des cartes joker et des cartes action, qui permettent plus d’interactions entre les joueurs. Le journal décrit aussi une édition Junior dès 4 ans, et annonçait en décembre 2024 une édition Voyage, plus petite et facile à transporter, pour le printemps 2025 ; elle figure aujourd’hui au catalogue de l’éditeur.</p><p>Un écart de prix mérite d’être signalé. Sur le site de l’éditeur, le jeu de base est affiché à 19,95 €. Dans le ${a('/blog/prix-jeux-de-cartes-releve.html', 'relevé de prix de KYRAN du 6 novembre 2026')}, la même boîte était à 14,90 € chez Ludum et chez Philibert. Les deux chiffres étaient exacts le jour où ils ont été lus ; ils ne se comparent pas sans tenir compte des frais de port et de la boutique.</p>`
    },
    {
      id: 'distribution-france',
      heading: 'Comment Skyjo est arrivé en France : 2017, 2019, 2022',
      html: `<p>Selon ${a(NO, 'Le Nouvel Obs')}, Yoann Laurent, fondateur de Blackrock Games, découvre Skyjo sur internet en 2017 et passe commande pour l’essayer avec son équipe. La distribution française commence en 2019, date que le journal donne pour le point de départ du chiffre de ventes. La règle officielle porte d’ailleurs une mention de distribution dans les pays francophones par Blackrock Games : vous pouvez la lire dans ${a(REGLE, 'le PDF de règles de Magilano')}.</p><p>La suite tient, d’après le porte-parole de JouéClub cité par le journal, à deux facteurs : le confinement, qui a relancé la demande de jeux de société chez les adolescents et les adultes, puis des ventes qui « s’emballent » dès 2022. La porte-parole de Blackrock Games, Lola Chassonnerie, explique de son côté que le jeu s’est passé de campagne de publicité : le bouche-à-oreille a fait presque tout le travail.</p><p>Ce récit est celui des acteurs commerciaux, rapporté par un journal ; ce n’est pas une mesure indépendante. Il a l’intérêt d’être précis sur les dates, et il explique pourquoi un jeu sorti en 2015 en Allemagne n’est devenu un phénomène français qu’à partir de 2019, puis surtout de 2022. Pour les autres jeux qui occupent le même rayon, voyez ${a('/blog/jeux-comme-skyjo.html', 'notre sélection de jeux comme Skyjo')}.</p>`
    },
    {
      id: 'ventes',
      heading: 'Les chiffres de vente : ce qu’ils disent et ce qu’ils ne disent pas',
      html: `<p>Trois chiffres reviennent, tous tirés du même article du ${a(NO, 'Nouvel Obs')} du 21 décembre 2024 : plus de 3 millions d’exemplaires vendus en France depuis 2019, 730 000 exemplaires vendus chez JouéClub sur l’année 2023, et 750 000 boîtes vendues chez JouéClub à la fin de novembre 2024. Le premier chiffre couvre le marché français depuis 2019 ; les deux autres concernent une seule enseigne et ne s’additionnent donc pas au premier comme s’ils étaient indépendants. Le journal ne précise pas, dans le passage lu, la source du total de 3 millions : c’est une limite à garder en tête avant de le reprendre.</p><p>Le même article cite une étude de Circana, réalisée pour la Fédération française des industries jouet-puériculture et la Fédération des commerces spécialistes des jouets, publiée le 14 janvier, selon laquelle Skyjo a été le jeu de société le plus vendu à Noël. Nous n’avons pas ouvert cette étude : le fait est attribué au journal, pas vérifié à la source. Notre ${a('/blog/marche-jeux-de-cartes-2026-2027.html', 'dossier sur le marché des jeux de cartes 2026-2027')} traite d’autres chiffres de marché et de leurs périmètres.</p><p>Une page du blog ${a(RDJ, 'Règles du Jeu.net')} avance de son côté une croissance de 27 % et une place parmi les jeux de cartes les plus vendus, sans source primaire visible dans la page lue : nous ne reprenons pas ces chiffres.</p>`
    },
    {
      id: 'cartes-calculees',
      heading: 'Les 150 cartes : ce que le calcul permet de dire',
      html: `<p>Le paquet de Skyjo compte 150 cartes de −2 à 12. ${a(WPFR, 'Wikipédia en français')} et ${a(WPDE, 'Wikipédia en allemand')} donnent la répartition suivante : 10 exemplaires de chaque valeur de −1 et de 1 à 12, 15 exemplaires du 0 et 5 exemplaires du −2. Le PDF de règles lu ne reproduit pas ce détail en texte ; la répartition est donc attribuée à Wikipédia, et le fichier CSV le dit.</p>${tableCartes}<p>À partir de ces effectifs, un script publié dans le dépôt du site (<code>scripts/analyses/skyjo-cartes.mjs</code>) calcule des valeurs exactes :</p><ul><li>La somme de toutes les cartes est de 760 points, soit une valeur moyenne de 5,07 points par carte. Une grille de douze cartes inconnues vaut donc en moyenne 60,8 points avant le moindre échange.</li><li>Une carte tirée au hasard est négative dans 10 % des cas (15 cartes sur 150) et nulle ou négative dans 20 % des cas. Le −2 représente 3,33 % du paquet (5 cartes sur 150).</li><li>Trois cartes tirées au hasard sont identiques avec une probabilité de 2 025 sur 551 300, soit environ 0,37 %, ou une chance sur 272.</li><li>À huit joueurs, la donne de 12 cartes chacun et la première carte de défausse en posent 97 sur 150 (8 × 12 + 1).</li></ul><p>Ces valeurs décrivent le paquet, pas une partie : elles ne disent rien de la stratégie, qui consiste à remplacer ses grosses cartes et à décider quand fermer la manche. Elles expliquent seulement pourquoi les colonnes de trois cartes identiques sont rares au départ et se fabriquent surtout au fil des échanges. Une colonne de trois 12 retirée économise 36 points ; une colonne de trois −2, que la règle impose aussi de retirer, en coûte 6.</p>`
    },
    {
      id: 'regle-doublement',
      heading: 'La règle du doublement, lue dans le livret officiel',
      html: `<p>Le joueur qui retourne sa dernière carte et ferme la manche doit avoir, strictement, le plus petit total, sinon ses points sont doublés. C’est ce que dit ${a(REGLE, 'le livret de règles de Magilano')} : si le joueur qui a terminé la manche « n’a pas obtenu, strictement, le plus petit nombre de points de cette manche, alors la somme de ses points pour cette manche est doublée ». L’exemple du livret le montre : le joueur A termine avec 10 points, le joueur B a 24 points et le joueur C a aussi 10 points ; A n’a pas, strictement, le plus petit total, et ses points passent donc à 20. Une égalité avec le meilleur total suffit à subir le doublement.</p><p>Le livret précise juste après : « cette règle ne s’applique qu’aux points positifs ». Un total négatif n’est donc jamais doublé. ${a(RDJ, 'Règles du Jeu.net')} consacre une page à cette erreur de score ; nous avons préféré lire directement la version française publiée par l’éditeur, qui est explicite.</p><p>Trois autres détails du même livret sont souvent mal appliqués à la table. Lorsqu’une colonne de trois cartes identiques se forme après un échange, les trois cartes vont sur la défausse, après la carte échangée. Le joueur qui commence est celui dont les deux cartes retournées font la plus grande somme, pas le plus jeune. Enfin, la partie s’arrête dès qu’un joueur atteint 100 points ou plus, et c’est le plus petit score qui gagne.</p>`
    },
    {
      id: 'ecarts',
      heading: 'Les écarts entre sources, et ce que nous ne tranchons pas',
      html: `<p>Une source de référence doit montrer où les sources divergent. Voici les écarts relevés le 14 novembre 2026.</p><ul><li><strong>L’année de sortie.</strong> BoardGameGeek et Wikipédia disent 2015 ; la page de Règles du Jeu.net lue indique 2019. La lecture qui concilie les sources : 2015 pour la sortie du jeu, 2019 pour la distribution française et pour Skyjo Action.</li><li><strong>Le nom de l’éditeur.</strong> ${a(NUM, 'Numerama')} écrit « Magilone » : le site officiel, la règle et BoardGameGeek disent Magilano.</li><li><strong>La disposition des cartes.</strong> ${a(TEAM, 'Les Teammates')} décrivent « 3 rangées de 4 cartes » et Numerama un « carré » ; la grille de douze cartes est la même, lue dans un sens ou dans l’autre.</li><li><strong>Le prix.</strong> 14 € dans l’article des Teammates du 15 mars 2022, 14,90 € chez Philibert dans l’article de Numerama, 14,90 € relevé le 6 novembre 2026 chez Ludum et Philibert, 19,95 € sur la boutique de l’éditeur. Les dates et les boutiques diffèrent : ce sont des prix datés, pas une évolution.</li></ul><p>Ce que ces sources ne permettent pas de dire : combien de boîtes se sont vendues hors de France, quel est le chiffre d’affaires de Magilano, combien de joueurs réguliers compte le jeu. ${a(TEAM, 'Les Teammates')} rapportent seulement une table où l’âge des joueurs allait de 7 à 72 ans, et jugent qu’il faut être à l’aise avec le calcul mental. Ce sont des avis de joueurs, pas des mesures.</p>`
    },
    {
      id: 'a-la-table',
      heading: 'À la table : ce que ces chiffres changent pour un acheteur',
      html: `<p>Pour un acheteur, trois choses se dégagent. La famille compte quatre jeux ; le jeu de base suffit pour découvrir la règle, et Skyjo Action ajoute des cartes spéciales à ceux qui veulent plus d’interactions. Le prix varie de plus de 5 € selon la boutique, donc comparer avant d’acheter a un vrai effet pour ce jeu précis : notre ${a('/blog/prix-jeux-de-cartes-releve.html', 'relevé des prix')} donne les chiffres du 6 novembre 2026. Enfin, une partie dure de 15 à 45 minutes selon BoardGameGeek, une durée utile pour les soirées et les trajets, que traitent notre guide des ${a('/blog/jeux-30-minutes.html', 'jeux de 30 minutes')} et celui des ${a('/blog/jeux-vacances-voyage.html', 'jeux de cartes de vacances')}.</p><p>Skyjo est un jeu d’échange de cartes visibles et cachées, sans plis ni paris. ${a('/', 'KYRAN')}, le jeu de cartes édité par ce site, est un jeu de plis à paris pour 3 à 6 joueurs, d’environ 30 minutes, dès 8 ans ; il ne se joue pas à deux, et ne remplace pas Skyjo pour une table de huit ou pour des enfants de 4 ans. Les deux jeux se rejoignent par la prise de risque : dans l’un on décide quand fermer la manche, dans l’autre on annonce son nombre de plis.</p>`
    }
  ],
  sources: [
    { label: 'Magilano, page d’accueil de la boutique (EN) : gamme et prix', url: MAG, note: 'quatre jeux, joueurs, âge et prix relevés le 14 novembre 2026' },
    { label: 'Magilano, mentions légales', url: IMPRESSUM, note: 'éditeur : Alexander Bernhardt, Hachenburg (Allemagne)' },
    { label: 'Magilano, règle du jeu de Skyjo (PDF, version française)', url: REGLE, note: 'colonne de trois cartes identiques, doublement, 100 points, distribution par Blackrock Games' },
    { label: 'BoardGameGeek (API geekdo), fiche de Skyjo', url: BGG, note: '2015, 2 à 8 joueurs, 15 à 45 min, dès 8 ans, auteur, illustrateur et éditeurs' },
    { label: 'BoardGameGeek (API geekdo), fiche de Skyjo Action', url: BGGA, note: '2019, 2 à 8 joueurs, 30 min, dès 8 ans' },
    { label: 'Le Nouvel Obs, « Il y a un truc super addictif : comment Skyjo est devenu la nouvelle star des jeux de société » (21 décembre 2024)', url: NO, note: 'Blackrock Games 2017 et 2019, plus de 3 millions d’exemplaires, JouéClub 730 000 et 750 000, gamme' },
    { label: 'Wikipédia en français, « Skyjo »', url: WPFR, note: 'répartition des 150 cartes' },
    { label: 'Wikipédia en allemand, « Skyjo »', url: WPDE, note: 'répartition des 150 cartes, 2015, Magilano' },
    { label: 'Numerama, « Le jeu de société Skyjo est aussi vilain qu’il est fédérateur »', url: NUM, note: 'présentation du jeu ; écrit « Magilone » pour Magilano' },
    { label: 'Les Teammates, « Oubliez le Uno, maintenant il y a Skyjo ! » (15 mars 2022)', url: TEAM, note: 'avis de joueurs, trois rangées de quatre, prix de 14 €' },
    { label: 'Règles du Jeu.net, page sur Skyjo', url: RDJ, note: 'règle du doublement ; date de sortie divergente ; chiffres de croissance non repris' }
  ],
  dataset: {
    description: 'Deux fichiers : la répartition des 150 cartes de Skyjo (15 lignes) et une chronologie sourcée de Skyjo et de Magilano avec les chiffres de vente et le catalogue de l’éditeur (13 lignes).',
    methodology: 'Les pages de l’éditeur, la règle officielle en PDF, les fiches BoardGameGeek (API geekdo) et les articles de presse ont été téléchargées et lues le 14 novembre 2026. Chaque ligne cite la source où la valeur figure. La répartition des cartes est reprise de Wikipédia, car le PDF de règles ne la donne pas en texte. Les probabilités de l’article sont calculées par le script scripts/analyses/skyjo-cartes.mjs ; elles ne figurent pas dans les fichiers. Une valeur introuvable ou contradictoire est écartée.',
    update: 'à chaque rafraîchissement de l’article',
    license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/deed.fr' },
    lastVerified: '2026-11-14',
    files: [
      { path: '/donnees/skyjo-magilano-chiffres-reference/cartes.csv', format: 'csv', description: '15 lignes : valeur, exemplaires, part du paquet, points cumulés, source, date de contrôle' },
      { path: '/donnees/skyjo-magilano-chiffres-reference/jalons.csv', format: 'csv', description: '13 lignes : jalons, chiffres de vente et catalogue de l’éditeur, avec source et date de contrôle' }
    ]
  },
  conclusion: `<p>Skyjo est le jeu d’un auteur-éditeur, sorti en 2015, distribué en France depuis 2019 et devenu un grand succès à partir de 2022. Ses chiffres de vente viennent surtout d’un article de presse qui rapporte les déclarations de ses distributeurs, et la règle du doublement se lit sans ambiguïté dans le livret officiel. Les fichiers de ce dossier sont réutilisables sous licence CC BY 4.0, en citant KYRAN et la date du 14 novembre 2026.</p><p>Dernière vérification des sources : 14 novembre 2026.</p>`,
  faq: [
    { q: 'Qui a créé Skyjo et qui l’édite ?', a: 'Alexander Bernhardt est l’auteur et l’illustrateur de Skyjo, publié en 2015 par Magilano, sa maison d’édition (BoardGameGeek, Wikipédia en allemand, mentions légales de magilano.com).' },
    { q: 'Combien de Skyjo ont été vendus en France ?', a: 'Le Nouvel Obs, le 21 décembre 2024, écrit « plus de 3 millions d’exemplaires » depuis 2019, et 750 000 boîtes vendues chez JouéClub à la fin de novembre 2024. Le journal ne détaille pas, dans le passage lu, la source du total.' },
    { q: 'Combien de cartes compte Skyjo et quelle est la valeur moyenne ?', a: 'Le paquet compte 150 cartes de −2 à 12 (effectifs relevés sur Wikipédia). La somme est de 760 points, soit 5,07 points par carte en moyenne.' },
    { q: 'Les points négatifs sont-ils doublés quand on ferme la manche sans gagner ?', a: 'Non. Le livret officiel précise que le doublement ne s’applique qu’aux points positifs. Il s’applique si le joueur n’a pas, strictement, le plus petit total : une égalité avec le meilleur total suffit.' },
    { q: 'Skyjo est-il sorti en 2015 ou en 2019 ?', a: 'BoardGameGeek et Wikipédia disent 2015 pour la sortie du jeu. 2019 est l’année de la distribution française par Blackrock Games et de la sortie de Skyjo Action.' }
  ],
  related: ['jeux-comme-skyjo', 'prix-jeux-de-cartes-releve', 'marche-jeux-de-cartes-2026-2027']
};
