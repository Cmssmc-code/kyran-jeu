export default {
  slug: 'jeux-cartes-4-joueurs',
  title: 'Meilleurs jeux de cartes à 4 joueurs : en équipes ou chacun pour soi',
  shortTitle: 'Jeux de cartes à 4 joueurs',
  metaTitle: 'Jeux de cartes à 4 joueurs : 7 idées en équipe ou en solo',
  description: 'Deux contre deux, tous ensemble ou chacun pour soi ? Codenames, The Crew, Wizard, KYRAN et trois autres jeux de cartes pour une table de quatre.',
  category: 'Cartes',
  date: '2026-09-05',
  heroTitle: 'Jeux de cartes à <span class="accent">4 joueurs</span>',
  heroSubtitle: 'En équipe ou chacun pour soi : sept jeux pour la tablée la plus courante, et ce que le chiffre quatre change à chacun.',
  heroImage: '/blog/images/love-letter.jpg',
  heroCaption: 'Des cartes idéales pour une tablée de quatre convives.',
  layout: {
    criteriaShort: 'Le format à quatre',
    groups: [
      {
        heading: 'En équipe : deux contre deux, ou les quatre ensemble',
        html: `<p>Quatre est l'effectif des jeux à partenaires : celui de la belote, de la coinche et du Whist classique. Parmi les jeux récents, Codenames reprend le face-à-face entre deux binômes ; The Crew pousse la logique au bout en réunissant les quatre joueurs dans un seul équipage, face aux missions. Si c'est l'atout et le partenaire de la belote que vous cherchez, nos <a class="text-link" href="/blog/alternatives-belote-coinche.html">alternatives à la belote et à la coinche</a> les abordent en détail.</p>`,
        ids: ['codenames', 'the-crew']
      },
      {
        heading: 'Chacun pour soi : quatre rivaux, un seul gagnant',
        html: `<p>Sans équipe, chacun mesure son jeu à celui de trois adversaires. Les cinq titres retenus couvrent tout l'éventail : plis à annonce (Wizard, KYRAN), bluff (Skull), déduction express (Love Letter) et jeu de points pour mêler les âges (Skyjo). À quatre, aucun ne tourne à vide ; Love Letter y atteint son maximum, quand Wizard, KYRAN et Skull gardent encore de la marge jusqu'à six.</p>`,
        ids: ['wizard', 'kyran', 'skull', 'love-letter', 'skyjo']
      }
    ]
  },
  headings: {
    compare: 'Les sept jeux à quatre, en chiffres',
    conclusion: 'Un jeu en équipe, un jeu en solo',
    faq: 'Jouer aux cartes à quatre : questions pratiques',
    related: 'À trois, à six, ou autour de la belote'
  },
  intro: `<p>Quatre joueurs, ce sont deux couples d'amis, une famille autour de la table ou un groupe de collègues. Ce chiffre ouvre deux voies, et les sept jeux ci-dessous sont rangés selon celle qu'ils prennent. <strong>En équipe</strong> : Codenames oppose deux binômes, comme à la belote ; The Crew réunit les quatre joueurs dans un seul camp, avec un paquet de 40 cartes qui se partage ici sans reste. <strong>Chacun pour soi</strong> : Wizard et KYRAN pour les plis à annonce, Skull pour le bluff, Love Letter, dont quatre est le plafond, et Skyjo pour mêler les âges. Chaque fiche précise ce que le format à quatre change, et les cas où un autre jeu fait mieux.</p>`,
  criteria: {
    heading: 'Ce que le chiffre quatre change au choix',
    html: `<p>Quatre est le seul effectif où l'on peut former deux équipes égales sans bricolage, et celui où beaucoup de jeux répartissent leurs cartes sans reste : 52 cartes donnent 13 par main, 40 cartes en donnent 10, et les 60 cartes de Wizard s'étalent sur 15 manches pleines. Cette régularité facilite la vie de l'organisateur, mais elle ne garantit pas la qualité du jeu.</p>
<h3>Première décision : équipes ou solo ?</h3>
<p>Les jeux en équipes demandent de composer les binômes avec soin. Deux couples qui se retrouvent chacun face à son conjoint jouent souvent en connivence ; mélanger les paires change l'ambiance. Si les niveaux sont inégaux, placez l'habitué avec le débutant plutôt que contre lui. Les jeux solo (Wizard, KYRAN, Skull) évitent ce casse-tête mais exposent le débutant à la comparaison directe avec trois adversaires. Le coopératif, lui, supprime les camps : The Crew en est l'exemple le plus abouti à ce format.</p>
<h3>Ce qu'il faut regarder ensuite</h3>
<ul>
<li><strong>La durée d'un tour.</strong> À quatre, on attend trois autres joueurs. Un tour de dix secondes (Love Letter, Skyjo) ne gêne personne ; un tour de deux minutes (jeux d'optimisation) transforme les trois autres en spectateurs.</li>
<li><strong>Le plafond ou le plancher du jeu.</strong> Love Letter s'arrête à quatre, Skull, Wizard et KYRAN démarrent à trois, Codenames préfère les tables plus grandes. Un jeu à son maximum est tendu, un jeu à son minimum peut manquer de matière.</li>
<li><strong>L'élimination.</strong> Dans Skull ou Love Letter, un joueur sorti attend la fin de la manche ; à quatre, l'attente reste courte, mais elle se remarque dès que la manche s'éternise.</li>
<li><strong>L'écart d'âge et de niveau.</strong> Skyjo et KYRAN se jouent dès 8 ans ; Codenames, Love Letter, Skull, Wizard et The Crew sont indiqués à partir de 10 ans.</li>
</ul>
<p>Enfin, gardez en tête la fréquence de vos soirées : un jeu qu'on joue une fois par mois peut avoir des règles plus longues qu'un jeu d'apéro qu'on ressort chaque semaine. Si votre groupe grandit souvent, notre page sur les <a class="text-link" href="/blog/jeux-cartes-6-joueurs.html">jeux de cartes à 5 ou 6 joueurs</a> vous évite de racheter une boîte à chaque nouvel invité.</p>`
  },
  games: [
    {
      id: 'codenames',
      type: 'Équipes, indices',
      pick: 'Pour deux contre deux, avec un maître-espion par camp',
      paragraphs: [
        `Codenames à quatre se joue en deux équipes de deux : un maître-espion qui voit la grille-clé, un agent de terrain qui devine. Les 25 mots posés sur la table cachent huit ou neuf agents par camp, des passants innocents et un assassin. L'indice se résume à un mot et un chiffre, ce qui force à une précision de vocabulaire que les autres jeux de la liste n'exigent pas.`,
        `Défaut propre à ce format : l'agent de terrain décide seul, sans coéquipier avec qui débattre, et la partie dépend surtout de la finesse des indices. Atout : la composition des équipes (deux couples séparés, parent et enfant) donne la tonalité de la soirée. Codenames est annoncé jusqu'à huit joueurs et plus : c'est le jeu à ressortir quand la table s'agrandit.`
      ]
    },
    {
      id: 'the-crew',
      type: 'Plis coopératifs',
      pick: 'Pour quatre joueurs qui veulent affronter les missions ensemble',
      paragraphs: [
        `Quatre est le chiffre où le paquet de The Crew se partage sans reste : 40 cartes, dix par joueur, dix plis à chaque mission. Chaque mission distribue des tâches précises (par exemple ramasser une carte donnée dans un pli), et le commandant, qui détient la fusée 4, ouvre la partie. Personne n'a le droit de dire ce qu'il possède, sauf par un jeton de communication unique par joueur.`,
        `À quatre, davantage de mains peuvent remplir les tâches, mais le risque grandit aussi qu'un joueur gâche un pli pour tout le monde. Les premières missions, brèves, servent de classe de maître pour les débutants. C'est notre meilleur point d'entrée pour des plis sans rivalité ; en revanche, la table qui aime se défier trouvera le jeu un peu sage, puisque personne ne gagne contre personne.`
      ]
    },
    {
      id: 'wizard',
      type: 'Plis et enchères',
      pick: 'Pour quatre joueurs qui aiment compter et disposent de temps',
      paragraphs: [
        `À quatre, les 60 cartes de Wizard se répartissent sur 15 manches, d'une carte à quinze par main : un compromis entre les 20 manches d'une table de trois et les 10 d'une table de six. Un Magicien emporte le pli, un Bouffon le perd, et la carte retournée après la donne désigne l'atout. Chaque manche se conclut par un bonus fixe pour une annonce exacte et une pénalité proportionnelle à l'écart.`,
        `Aucune règle n'oblige à se tromper : les annonces des quatre joueurs peuvent toutes se réaliser, ce qui rend le jeu plus clément que KYRAN. Le revers est la longueur. Les 15 manches dépassent facilement les 45 minutes affichées sur la boîte si un joueur réfléchit longtemps avant chaque annonce, et mieux vaut convenir d'une limite de manches avant de commencer.`
      ]
    },
    {
      id: 'kyran',
      type: 'Plis et paris',
      pick: 'Pour quatre amis qui veulent des plis à paris en une demi-heure',
      paragraphs: [
        `À quatre, KYRAN garde le matériel resserré du format à trois : quatre pouvoirs et la carte Mystique mêlés aux 36 cartes Nombre. Dans la manche à sept cartes, 28 cartes sont distribuées pour sept plis, et les quatre annonces ne peuvent pas totaliser sept. Comme le donneur, qui parle en dernier, change à chaque manche, le rôle de celui qui doit ajuster tourne autour de la table.`,
        `Chaque joueur dispose de cinq cartes Vie visibles de tous, et la partie s'arrête dès que l'une des piles est épuisée : celui qui conserve le plus de vies l'emporte. Le jeu se joue chacun pour soi, sans équipes, ce qui le distingue de la belote. Si votre table connaît le <a class="text-link" href="/tarot-africain.html">Tarot Africain</a>, elle retrouvera le principe du pari en quelques minutes ; sinon, la <a class="text-link" href="/video-regles.html">vidéo des règles de KYRAN</a> les expose en cinq minutes.`
      ]
    },
    {
      id: 'skull',
      type: 'Bluff',
      pick: 'Pour quatre joueurs qui aiment bluffer sans règles lourdes',
      paragraphs: [
        `Skull prend de l'ampleur à quatre : seize cartes en jeu, soit trois roses et un crâne par joueur, de quoi laisser des zones d'ombre sans saturer la table. Chacun pose une carte face cachée, puis on enchérit sur le nombre de cartes qu'on peut retourner sans tomber sur un crâne. L'enchère est surtout un pari sur la sincérité des trois adversaires.`,
        `Le joueur qui relève le défi doit d'abord retourner ses propres cartes, ce qui l'empêche de bluffer sur sa propre pile. Deux défis réussis offrent la victoire. Défaut : les joueurs sans carte sont éliminés et attendent, un temps raisonnable à quatre, mais pénible si la manche traîne. Dans ce groupe, c'est le seul jeu dont le mensonge est le moteur, et non un simple à-côté.`
      ]
    },
    {
      id: 'love-letter',
      type: 'Déduction express',
      pick: 'Pour un apéro à quatre, entre deux jeux plus longs',
      paragraphs: [
        `Quatre est le plafond de Love Letter, et c'est là que la partie s'emballe : il suffit de quatre marques de faveur pour gagner, contre davantage en duel. Une manche s'éteint dès qu'il ne reste qu'un joueur en lice ou que la pioche est vide, et une élimination ne vous écarte que quelques minutes.`,
        `La décision centrale est le choix de la cible : un Garde ou un Baron peut éliminer un adversaire, mais l'attaque profite aux deux autres. La Comtesse, qu'il faut défausser en présence du Roi ou du Prince, ajoute un bluff discret. Défaut : le hasard de la pioche domine, ce qui convient à un apéro mais pas à une soirée de joueurs en quête de contrôle.`
      ]
    },
    {
      id: 'skyjo',
      type: 'Cartes à points',
      pick: 'Pour une tablée mêlant adultes et enfants, sans trop réfléchir',
      paragraphs: [
        `À quatre, Skyjo distribue douze cartes face cachée à chacun, en grille de trois rangées de quatre, parmi un paquet de 150 cartes allant de -2 à 12. On cherche le total le plus bas. Trois cartes identiques dans une colonne s'annulent, ce qui donne tout son intérêt au choix entre piocher et prendre la défausse.`,
        `La part de chance est élevée et les décisions se limitent à garder ou échanger, ce qui en fait un jeu idéal pour mêler enfants dès 8 ans et adultes. Il convient mal à ceux qui veulent un affrontement tactique. Le joueur qui retourne sa dernière carte met fin à la manche, mais voit son score doublé s'il n'a pas le total le plus bas : un petit piège qui mérite d'être connu avant la première partie.`
      ]
    }
  ],
  verdict: {
    heading: 'Le jeu à sortir quand vous êtes quatre',
    html: `<p>Une seule boîte pour une table de quatre ? <strong>The Crew</strong> : 40 cartes pour quatre mains de dix, une campagne qui se renouvelle et aucun perdant. Pour une table qui préfère le chacun pour soi, <strong>KYRAN</strong> rend une partie complète en une demi-heure, là où Wizard en demande souvent davantage ; Wizard reste préférable pour ceux qui aiment les longues soirées de calcul. Codenames fonctionne à quatre mais atteint son meilleur niveau à six ou huit, et Skyjo est le plus sûr dès que des enfants de huit ans s'installent à la table. Love Letter, enfin, sert d'entracte entre deux jeux plus longs plutôt que de plat principal.</p>`
  },
  conclusion: `<p>Une table de quatre accepte presque tout, ce qui rend le choix plus délicat qu'il n'y paraît : mieux vaut viser deux jeux complémentaires, l'un en équipe et l'autre chacun pour soi, que six boîtes que l'on n'ouvrira qu'une fois. Si l'un de vos invités déclare forfait, la page <a class="text-link" href="/blog/jeux-3-joueurs.html">jeux à 3 joueurs</a> vous aide à ajuster la soirée.</p>`,
  faq: [
    {
      q: 'Quel est le meilleur jeu de cartes à 4 joueurs ?',
      a: `The Crew est le plus adapté à quatre : 40 cartes, dix par joueur, des missions coopératives. Pour un jeu compétitif, KYRAN (30 minutes) ou Wizard (15 manches à quatre) sont les meilleurs choix ; Love Letter convient pour un quart d'heure.`
    },
    {
      q: 'Quel jeu de cartes à 4 joueurs en équipes de deux ?',
      a: `Codenames se joue à quatre en deux équipes de deux, avec un maître-espion par camp. Parmi les jeux de cartes classiques, la belote, la coinche et le Whist reposent sur des partenaires ; The Crew, lui, fait des quatre joueurs une seule équipe.`
    },
    {
      q: 'Quels jeux de cartes à 4 joueurs avec un jeu de 52 cartes ?',
      a: `Le Whist se joue à quatre en deux équipes avec 52 cartes, Oh Hell! sans équipes de 3 à 7 joueurs. Le Tarot Africain accepte lui aussi quatre joueurs, mais avec 22 cartes d'un jeu de tarot.`
    },
    {
      q: 'Quels jeux de cartes à 4 joueurs pour des enfants ?',
      a: `Skyjo et KYRAN se jouent dès 8 ans ; Codenames, Love Letter, Skull, Wizard et The Crew sont indiqués à partir de 10 ans. Pour un mélange d'âges, Skyjo demande le moins de réflexion, et la variante d'initiation de KYRAN, sans cartes Pouvoir ni Mystique, simplifie les premières manches.`
    },
    {
      q: 'Quel jeu de cartes à 4 joueurs dure moins de 20 minutes ?',
      a: `Love Letter et Codenames durent environ 15 minutes, une mission de The Crew environ 20. Skyjo, Skull et KYRAN demandent plutôt une demi-heure, Wizard 45 minutes ou davantage à quatre.`
    },
    {
      q: 'KYRAN se joue-t-il à quatre joueurs ?',
      a: `Oui, KYRAN se joue de 3 à 6 joueurs, et quatre est un effectif très confortable. On ne garde que quatre cartes Pouvoir et la carte Mystique, et les manches vont de sept à deux cartes avant la manche Mystique.`
    }
  ],
  related: ['jeux-3-joueurs', 'jeux-cartes-6-joueurs', 'alternatives-belote-coinche']
};
