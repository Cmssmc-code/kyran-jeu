export default {
  slug: 'jeux-plis-comparatif',
  title: 'Jeux de plis : le comparatif et le guide pour bien choisir',
  shortTitle: 'Comparatif des jeux de plis',
  metaTitle: 'Jeux de plis : le comparatif 2026 pour bien choisir',
  description: `Un jeu de cartes où l'on annonce son nombre de plis ? Comparatif de six jeux de plis (Wizard, Oh Hell, KYRAN, The Crew…) et guide du vocabulaire.`,
  category: 'Alternatives',
  date: '2026-05-29',
  heroTitle: 'Jeux de <span class="accent">plis</span> : le comparatif',
  heroSubtitle: `Annonce de plis, coopération, rangées : comprendre les mécanismes avant d'acheter.`,
  heroImage: '/blog/images/wizard.jpg',
  heroCaption: 'Wizard — point de départ du comparatif.',
  layout: {
    answerFirst: true,
    criteriaAfter: true,
    criteriaShort: 'Bien choisir',
    numbered: false,
    compare: { position: 'after' },
    groups: [
      {
        heading: 'Annoncer son nombre de plis',
        html: `<p>Trois jeux de cartes où l'on s'engage sur un nombre exact de plis avant de jouer. Ils partagent le même geste et diffèrent par le matériel, la durée et le prix d'une erreur.</p>`,
        ids: ['wizard', 'oh-hell', 'kyran']
      },
      {
        heading: 'Jouer les plis autrement',
        html: `<p>Ici, plus d'annonce individuelle : les plis servent une mission commune, ou disparaissent au profit de rangées à éviter.</p>`,
        ids: ['the-crew', '6-qui-prend', 'parade']
      }
    ]
  },
  headings: {
    compare: 'Les six jeux de plis côte à côte',
    conclusion: 'Choisir selon votre table',
    faq: 'Jeux de plis : questions fréquentes',
    related: 'À lire ensuite'
  },
  intro: `<p><strong>Oui, il existe des jeux de cartes où l'on annonce son nombre de plis.</strong> Avant de jouer, chacun s'engage sur le nombre de levées qu'il pense remporter, puis perd des points ou des vies s'il se trompe. Le Tarot Africain, Oh Hell, Wizard et KYRAN reposent sur ce principe. La famille des jeux de plis est pourtant plus large : elle compte des titres coopératifs comme The Crew et des cousins sans pli véritable comme 6 qui prend ! et Parade. Cette page compare six jeux, détaille ce qui sépare les jeux où l'on parie son nombre de plis, explique le vocabulaire du genre, puis revient sur les classiques sans fiche, dont le <a class="text-link" href="/tarot-africain.html">Tarot Africain</a> et le Whist.</p>`,
  criteria: {
    heading: 'Comment choisir son jeu de plis ?',
    html: `<p>Avant d'acheter une boîte, posez-vous les questions qui suivent, dans cet ordre : elles suffisent à écarter une bonne part des titres de ce comparatif pour une table donnée. Les termes techniques employés ici (entame, fournir, couper) sont définis dans le guide du vocabulaire, plus bas dans la page.</p>
<p>Premier critère, la place de l'annonce. Si votre envie est « combien de plis vais-je faire ? », restez dans la famille de l'annonce : Oh Hell avec un paquet classique, Wizard avec ses cartes spéciales, KYRAN avec une contrainte qui fait forcément une victime par manche. Dans toutes ces règles, le but est de réaliser exactement son annonce, même si la sanction d'un écart varie d'un barème à l'autre.</p>
<p>Deuxième critère, le lien avec les autres joueurs. Les jeux d'annonce sont individuels ; The Crew rend les plis coopératifs, avec des missions à remplir ensemble ; 6 qui prend ! et Parade retirent les plis, mais gardent l'idée d'éviter de ramasser.</p>
<p>Troisième critère, la taille de la table. Les jeux d'annonce démarrent à trois : Wizard de 3 à 6, KYRAN de 3 à 6, Oh Hell de 3 à 7. Pour jouer à deux, tournez-vous vers Parade, 6 qui prend ! ou The Crew, dont la boîte française annonce 3 à 5 joueurs mais dont les règles contiennent une variante à deux. Au-delà de sept joueurs, 6 qui prend ! (jusqu'à 10) est le seul de cette sélection à convenir.</p>
<p>Une dernière vérification porte sur la durée. Wizard demande de 40 minutes à une heure selon les sources et le nombre de manches choisi ; KYRAN s'arrête vers 30 minutes, et une mission de The Crew dure de 5 à 20 minutes selon l'éditeur.</p>
<p>Reste le matériel. Oh Hell se contente d'un paquet de 52 cartes, que l'on possède souvent déjà, et le Tarot Africain d'un jeu de tarot dont on ne garde que les atouts et l'Excuse ; Wizard et KYRAN demandent leur propre boîte. Les premiers obligent à fixer les règles soi-même ; les secondes fournissent une règle unique imprimée, utile quand les joueurs changent d'une soirée à l'autre.</p>`
  },
  games: [
    {
      id: 'wizard',
      subtitle: 'annonce et cartes spéciales',
      type: 'Plis à annonce',
      pick: 'Pour découvrir l\'annonce avec un paquet spécialisé, de 3 à 6',
      paragraphs: [
        `Wizard se joue avec soixante cartes : quatre couleurs de 1 à 13, quatre Zarbis (les Magiciens de la règle anglaise), dont le premier posé remporte le pli, et quatre Nazes (les Fous) qui ne l'emportent jamais, sauf dans un pli de seuls Nazes. Le nombre de cartes distribuées monte d'une unité à chaque manche jusqu'à épuisement du paquet, et le score récompense chaque annonce exacte de 20 points plus 10 par pli, avec une pénalité de 10 points par pli d'écart.`,
        `Dans ce comparatif, il se place au milieu : plus riche qu'Oh Hell grâce à ses cartes spéciales, plus long que KYRAN. Son défaut tient à la durée : la règle de Wizard prévoit 20 manches à trois joueurs et 10 à six, si bien qu'un joueur très en retard doit encore jouer longtemps. Pour un guide pensé pour ceux qui le connaissent déjà, voyez les <a class="text-link" href="/blog/alternatives-wizard.html">alternatives à Wizard</a>.`
      ]
    },
    {
      id: 'oh-hell',
      subtitle: 'annonce avec un paquet ordinaire',
      type: 'Plis à annonce',
      pick: 'Pour apprendre le principe avec 52 cartes ordinaires, de 3 à 7',
      paragraphs: [
        `Oh Hell contient toute l'idée en une phrase : on annonce son nombre de plis, on joue, on compare. Le paquet est un jeu classique de 52 cartes, la carte retournée fixe l'atout de la plupart des manches, et le nombre de cartes distribuées varie à chaque manche. Il permet d'apprendre le vocabulaire (fournir, couper, atout) sans se préoccuper de cartes spéciales.`,
        `Son revers est l'absence de règle unique : le sens de variation des mains, le barème des annonces exactes et l'interdiction faite au donneur de boucler le total changent d'une source à l'autre. Convenez-en avant la première donne. Il se joue de 3 à 7 joueurs, avec un jeu ordinaire, et la référence en ligne Pagat le recommande à quatre, cinq ou six. Il date des années 1930.`
      ]
    },
    {
      id: 'kyran',
      subtitle: 'annonce obligatoire, vies et pouvoirs',
      type: 'Plis à annonce',
      pick: 'Pour finir une partie en trente minutes, de 3 à 6',
      paragraphs: [
        `KYRAN rejoint la famille de l'annonce en ajoutant une contrainte : la somme des paris ne peut jamais valoir le nombre de plis de la manche, ce qui garantit une erreur à chaque donne. Les règles ne mentionnent ni atout ni obligation de suivre une couleur : la carte de plus forte valeur remporte le pli, une carte Pouvoir l'emportant à égalité avec un Nombre (de 1 à 36). De quatre à huit cartes Pouvoir, selon la taille de la table, viennent brouiller l'ordre habituel.`,
        `Les pertes se mesurent en cartes Vie, à hauteur de l'écart entre le pari et les plis gagnés ; le premier joueur à zéro met fin à la partie, et celui qui conserve le plus de vies l'emporte. Une manche à une carte posée sur le front, la manche Mystique, clôt le cycle. Environ 30 minutes, dès 8 ans, de 3 à 6 joueurs ; il ne se joue pas à deux. KYRAN reprend l'annonce contrainte des plis du <a class="text-link" href="/tarot-africain.html">Tarot Africain</a>, et les <a class="text-link" href="/regle.html">règles complètes</a> sont en ligne.`
      ]
    },
    {
      id: 'the-crew',
      subtitle: 'plis coopératifs, missions à réaliser',
      type: 'Plis coopératifs',
      pick: 'Pour jouer les plis sans rivalité, y compris à deux',
      paragraphs: [
        `The Crew conserve la mécanique du pli (fournir, couper avec les fusées, entame) pour l'utiliser sans annonce. Chaque mission distribue des cartes Tâche : un joueur doit remporter une carte précise dans un pli, parfois dans un ordre imposé. Tout le monde gagne ou perd en même temps.`,
        `La difficulté monte au fil des missions, et l'on ne peut parler de sa main que par un jeton de communication. La boîte française annonce 3 à 5 joueurs, avec une variante à deux dans la règle ; la <a class="text-link" href="https://www.iello.fr/jeux/the-crew/" rel="noopener">fiche d'Iello</a> annonce 3 à 5 joueurs et des missions de 5 à 20 minutes. Il permet d'apprendre à fournir et à lire les défausses, sans la moindre pénalité entre joueurs.`
      ]
    },
    {
      id: '6-qui-prend',
      subtitle: 'des rangées au lieu des plis',
      type: 'Rangées, sans annonce',
      pick: 'Pour les groupes jusqu\'à dix, sans annonce ni couleur',
      paragraphs: [
        `Ce n'est pas un jeu de plis au sens strict, puisqu'il n'y a ni couleur, ni atout, ni annonce. La parenté est lointaine : on cherche, comme dans un jeu de plis, à ne pas ramasser. Il accueille de 2 à 10 joueurs, ce qu'aucun jeu d'annonce de la liste n'approche.`,
        `Tout le monde pose une carte en même temps, et celui qui place la sixième carte d'une rangée de cinq la ramasse ; la partie dure environ 45 minutes et s'arrête quand un joueur atteint ou dépasse 66 têtes de bœuf. À recommander pour un groupe nombreux ; à éviter si l'envie du moment est d'annoncer ses plis. D'autres idées proches se trouvent dans les <a class="text-link" href="/blog/jeux-comme-6-qui-prend.html">jeux comme 6 qui prend !</a>.`
      ]
    },
    {
      id: 'parade',
      subtitle: 'la file à ramasser',
      type: 'File à éviter',
      pick: 'Pour les tables de 2 à 6 qui préfèrent éviter plutôt qu\'annoncer',
      paragraphs: [
        `Parade pose une carte à la fin d'une file, puis on ramasse certaines des cartes qui la précèdent selon la valeur jouée. Comme 6 qui prend !, c'est un jeu d'évitement. Contrairement aux jeux d'annonce, personne ne prédit rien : le jeu se joue sur le tempo, et la partie touche à sa fin quand un joueur a réuni les six couleurs ou que la pioche est épuisée : chacun joue alors une dernière carte avant le décompte.`,
        `Dans ce comparatif, c'est le moins proche d'un jeu de plis, mais il demande de bien choisir le moment de poser chaque carte. De 2 à 6 joueurs, environ 45 minutes selon BoardGameGeek. À garder si votre table aime calculer sans s'engager sur un chiffre.`
      ]
    }
  ],
  extraSections: [
    {
      id: 'parier-nombre-de-plis',
      heading: 'Jeux de cartes où l\'on parie son nombre de plis',
      html: `<p>Dans cette famille, tout se joue avant la première carte : chacun regarde sa main et déclare combien de plis il remportera, ni plus ni moins. Selon les tables, on parle d'annonce, de pari ou de contrat, mais le principe ne varie pas. Quatre jeux le portent, et ils se séparent sur deux points : ce que le dernier à parler a le droit d'annoncer, et ce que coûte une prévision ratée.</p>
<ul>
<li><strong>Oh Hell!</strong> : 52 cartes ordinaires et, le plus souvent, un atout désigné par une carte retournée. Selon la <a class="text-link" href="https://www.pagat.com/exact/ohhell.html" rel="noopener">référence en ligne Pagat</a>, le donneur, qui annonce en dernier, n'a pas le droit de choisir le chiffre qui ferait égaler le total des paris au nombre de plis (le « hook ») ; certaines tables jouent sans cette règle. C'est le point à trancher avant de distribuer.</li>
<li><strong>Wizard</strong> : la règle de base accepte que le total des annonces corresponde exactement aux plis disponibles. Une variante (« plus ou moins 1 », décrite dans l'édition anniversaire d'Amigo) interdit au dernier à parler d'équilibrer ce total. Zarbis et Nazes rendent chaque prévision plus fragile qu'avec un paquet ordinaire.</li>
<li><strong>Tarot Africain</strong> : les 22 cartes d'un tarot, et une interdiction faite au dernier annonceur : le total des annonces ne doit pas égaler le nombre de plis de la donne.</li>
<li><strong>KYRAN</strong> : la même interdiction, appliquée à toutes les manches, avec des cartes Vie en guise de score : chacun en perd autant que l'écart entre son pari et les plis réellement gagnés.</li>
</ul>
<p>Cette règle de la somme change la nature de la partie. Quand le total peut tomber juste, toute la table peut réussir en même temps ; quand il est interdit, le dernier à parler sait qu'au moins un joueur, lui peut-être, va rater, et son annonce devient un coup tactique autant qu'une prévision. Pour essayer ce principe avec un simple jeu de tarot, nos règles du <a class="text-link" href="/tarot-africain-a-3-joueurs.html">Tarot Africain à 3 joueurs</a> en donnent la version la plus resserrée.</p>`
    },
    {
      id: 'guide-jeux-de-plis',
      heading: 'Guide des jeux de plis : la définition et cinq termes à connaître',
      html: `<p>Un jeu de plis (ou de levées, voir la <a class="text-link" href="https://fr.wikipedia.org/wiki/Jeu_de_lev%C3%A9es" rel="noopener">définition de Wikipédia</a>) se joue par tours : chaque joueur pose une carte, une seule personne remporte l'ensemble, et, dans la plupart des règles, c'est elle qui ouvre le tour suivant. Presque tout se résume à cinq notions.</p>
<ul>
<li><strong>Pli ou levée</strong> : l'ensemble des cartes posées pendant un tour ; les deux mots s'emploient presque indifféremment. Il revient au joueur dont la carte est la plus forte.</li>
<li><strong>Entame</strong> : la première carte d'un pli, qui impose la couleur à suivre dans la plupart des jeux (pas à KYRAN, où seule la valeur compte).</li>
<li><strong>Fournir</strong> : jouer une carte de la couleur demandée quand on en possède. Cette contrainte rend le jeu lisible, car un joueur qui ne fournit pas révèle qu'il n'a plus la couleur.</li>
<li><strong>Atout et coupe</strong> : une couleur désignée qui bat toutes les autres. Faute de la couleur demandée, on peut couper avec un atout. Oh Hell et la plupart des manches de Wizard retournent une carte pour fixer l'atout.</li>
<li><strong>Annonce, pari ou contrat</strong> : l'engagement pris avant de jouer. Au Tarot Africain, à Oh Hell, à Wizard et à KYRAN, on annonce un nombre de plis ; à la belote, une équipe s'engage à faire plus de points que l'adversaire.</li>
</ul>`
    },
    {
      id: 'classiques-whist-tarot-africain',
      heading: 'Les classiques sans fiche : Whist, Tarot Africain, belote',
      html: `<p>Trois jeux traditionnels reviennent souvent dans les discussions sur les plis.</p>
<p>Le <strong>Whist</strong> se joue à quatre, en deux équipes de partenaires assis face à face, avec 52 cartes et une dernière carte distribuée retournée pour désigner l'atout. Il n'y a pas d'annonce : on cherche à gagner plus de plis que l'adversaire, et le jeu apparaît en Angleterre au début du XVIIe siècle selon <a class="text-link" href="https://fr.wikipedia.org/wiki/Whist" rel="noopener">Wikipédia</a>. Ne le confondez pas avec le <a class="text-link" href="/whist-22.html">Whist 22</a>, un autre nom du Tarot Africain.</p>
<p>Le <strong>Tarot Africain</strong> utilise les 22 atouts d'un tarot (21 atouts et l'Excuse) pour 3 à 5 joueurs selon <a class="text-link" href="https://fr.wikipedia.org/wiki/Ascenseur_(jeu_de_cartes)" rel="noopener">Wikipédia</a>, chacun annonçant le nombre de plis qu'il va faire ; la somme des annonces ne peut pas égaler le nombre de plis de la manche. Toutes les règles se trouvent dans le guide du <a class="text-link" href="/tarot-africain.html">Tarot Africain</a>.</p>
<p>La <strong>belote</strong> se joue à quatre, par deux, avec 32 cartes, et se distingue par la hiérarchie propre de l'atout (valet puis 9). Si vous venez de là, notre sélection des <a class="text-link" href="/blog/alternatives-belote-coinche.html">alternatives à la belote et à la coinche</a> propose des étapes plus douces.</p>`
    }
  ],
  verdict: {
    heading: 'Notre avis tranché',
    html: `<p>Pour découvrir le genre sans rien dépenser, Oh Hell avec un jeu de cartes ordinaire est la solution la plus économique. Si vous voulez une boîte prête à jouer, Wizard est un choix naturel pour 3 à 6 joueurs, et KYRAN celui qui tient en trente minutes. The Crew convient si votre table n'aime pas perdre entre amis. Parade et 6 qui prend ! sont de bons jeux, mais n'en faites pas votre premier achat si ce que vous cherchez, ce sont de vrais plis : ils n'en ont pas.</p>`
  },
  conclusion: `<p>Un jeu de plis se choisit moins sur sa réputation que sur trois paramètres : l'annonce, la taille de la table et la durée. Commencez par celui qui colle à votre groupe habituel, puis alternez avec une famille voisine pour changer de rythme. Pour aller plus loin dans le bluff, voyez les <a class="text-link" href="/blog/jeux-bluff-pari.html">jeux de bluff et de pari</a>.</p>`,
  faq: [
    {
      q: 'Quel jeu de cartes permet d\'annoncer son nombre de plis ?',
      a: `Plusieurs jeux reposent sur cette annonce : le Tarot Africain, Oh Hell, Wizard et KYRAN. Chaque joueur prédit le nombre exact de plis qu'il va remporter, puis perd des points ou des vies s'il s'est trompé, en plus comme en moins.`
    },
    {
      q: 'Qu\'est-ce qu\'un jeu de plis ?',
      a: `C'est un jeu de cartes joué par tours où chacun pose une carte et où la plus forte ramasse le tout : ce paquet s'appelle un pli, ou une levée. En général, le gagnant entame le tour suivant. Whist, belote, tarot, Wizard et KYRAN appartiennent à cette famille.`
    },
    {
      q: 'Faut-il un atout pour jouer aux plis ?',
      a: `Non. Wizard, Oh Hell et The Crew utilisent un atout, mais KYRAN n'en a pas : la carte de plus forte valeur l'emporte. 6 qui prend ! et Parade ne comportent ni atout ni véritable pli.`
    },
    {
      q: 'Quel jeu de plis pour débuter ?',
      a: `Oh Hell, parce qu'il se joue avec un paquet ordinaire et ne contient que les bases : fournir, couper, annoncer. Si vous préférez ne pas parier, The Crew apprend les mêmes réflexes en coopération.`
    },
    {
      q: 'Quel jeu de plis se joue à deux ?',
      a: `Parade et 6 qui prend ! acceptent deux joueurs, et The Crew propose une variante à deux dans ses règles. Les jeux d'annonce comme Wizard, Oh Hell et KYRAN demandent au moins trois joueurs.`
    },
    {
      q: 'Le dernier joueur peut-il annoncer n\'importe quel chiffre ?',
      a: `Pas à KYRAN ni, selon Pagat et Wikipédia, à Oh Hell et au Tarot Africain : il lui est interdit de choisir le chiffre qui ferait égaler la somme des annonces au nombre de plis, de sorte que quelqu'un se trompe forcément. Wizard ne l'impose qu'en variante.`
    }
  ],
  related: ['alternatives-wizard', 'alternatives-belote-coinche', 'jeux-bluff-pari']
};
