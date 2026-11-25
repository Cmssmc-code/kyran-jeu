const SITE = 'https://kyran-jeu.fr';
const MINIJEU = `${SITE}/minijeu.html`;
const REGLE = `${SITE}/regle.html`;
const CADEAU = `${SITE}/idee-cadeau.html`;
const COMMANDER = `${SITE}/commander.html`;
const PLI = `${SITE}/quel-pli-gagne.html`;
const a = (href, t) => `<a class="text-link" href="${href}">${t}</a>`;

export default {
  slug: 'initiation-kyran-fetes',
  format: 'essai',
  title: 'S’entraîner à KYRAN avant le repas de Noël : l’Initiation en sept rites',
  shortTitle: 'L’Initiation avant Noël',
  metaTitle: 'S’entraîner à KYRAN avant Noël : l’Initiation en sept rites',
  description: 'Comment arriver au repas de Noël en connaissant déjà les règles de KYRAN : les sept rites de l’Initiation en ligne, dans l’ordre, avec ce que chacun apprend.',
  category: 'Famille',
  date: '2026-11-26',
  heroTitle: 'S’entraîner à KYRAN <span class="accent">avant le repas de Noël</span>',
  heroSubtitle: 'Sept rites en ligne pour connaître le pli, le pari et les cartes Pouvoir avant d’ouvrir la boîte devant toute la famille.',
  heroImage: '/blog/images/cadeau-noel.jpg',
  heroCaption: 'Illustration créée pour KYRAN : une cheminée de Noël, six bas suspendus et des boîtes de jeux près du sapin.',
  intro: `<p><strong>Le plus gênant, le soir de Noël, c’est d’être celui qui doit expliquer un jeu qu’il n’a jamais essayé.</strong> Pour KYRAN, il existe un moyen simple de s’en dispenser : l’Initiation, une série de sept courts rites jouables dans le navigateur, guidés par un devin du Fa, qui mènent d’un premier pli à une vraie partie contre trois adversaires pilotés par l’ordinateur. Cette page détaille ce que chaque rite apprend, dans quel ordre les passer, et comment s’y prendre pour que la tablée suive dès la première partie. Tout ce qui est décrit ici a été relevé sur la page de l’Initiation et dans la règle publiée sur ce site.</p>`,
  keyPoints: {
    html: `<ul><li>L’Initiation compte sept rites : le pli, le pari, la règle d’or, la carte Mystique, les cartes Pouvoir, la manche Mystique et l’épreuve des Anciens (${a(MINIJEU, 'page de l’Initiation')}).</li><li>Elle se termine par une vraie partie contre trois adversaires, avec toutes les règles.</li><li>Le principe du pari se vérifie en un quart d’heure environ, d’après la page de l’Initiation.</li><li>KYRAN se joue de 3 à 6 joueurs, dès 8 ans, avec des parties de 30 minutes au plus, à 9,99 € (${a(COMMANDER, 'page d’achat')}).</li><li>Pour une livraison avant Noël, la commande en ligne doit partir avant le 16 décembre (${a(CADEAU, 'idée cadeau')}).</li></ul>`
  },
  headings: {
    conclusion: 'Le soir où l’on ouvre la boîte',
    faq: 'S’entraîner avant Noël : vos questions',
    related: 'Pour préparer le reste des fêtes'
  },
  sections: [
    {
      id: 'pourquoi-s-entrainer',
      heading: 'Pourquoi s’entraîner avant la première partie',
      html: `<p>Un jeu de plis demande de retenir peu de choses, mais dans le bon ordre. Celui qui a déjà joué sait que la plus forte carte emporte le pli, que le gagnant ouvre le suivant et qu’il faut annoncer ses plis avant de jouer. Celui qui n’a jamais joué entend tout cela d’un bloc, et c’est là que la tablée décroche, surtout quand elle réunit des enfants dès 8 ans et des adultes pressés d’aller au dessert.</p><p>L’idée de l’Initiation est de déplacer cet effort. Plutôt que d’expliquer les règles aux invités, celui qui offre ou reçoit la boîte les apprend seul, à son rythme, en jouant de vraies mains plutôt qu’en lisant un texte. Au moment de la première partie, il connaît les situations qui posent problème et peut les montrer sur les cartes. C’est exactement la méthode du tour à cartes découvertes, mais avec un devin qui vous a déjà fait pratiquer chaque règle une fois.</p><p>Ce n’est pas un tutoriel qu’il faudrait subir : la page de l’Initiation annonce qu’il suffit d’un quart d’heure environ pour savoir si le principe du pari vous plaît, et pour arriver à la première partie en connaissant déjà toutes les règles. Chaque rite réussi ajoute une perle à un collier d’initié, ce qui donne un but concret à chaque étape et fait avancer sans hésiter.</p>`
    },
    {
      id: 'rites-un-a-trois',
      heading: 'Les trois premiers rites : le pli, le pari, la règle d’or',
      html: `<p>Le premier rite s’appelle « Le pli » et tient en une phrase : la carte la plus forte remporte le pli. On y lit un pli complet, on voit que son propriétaire ouvre le suivant, et c’est tout. Il ne faut rien retenir d’autre, ce qui rassure les débutants et rappelle aux joueurs de belote ou de tarot que ce mécanisme leur est familier.</p><p>Le deuxième, « Le pari », ajoute ce qui distingue KYRAN d’un jeu de plis ordinaire : chacun annonce le nombre exact de plis qu’il va gagner. Le texte du rite le résume ainsi : l’enjeu n’est pas de gagner le plus possible, mais de prévoir. Un joueur qui annonce deux plis et en réalise deux a bien joué, même s’il ne les gagne pas tous. C’est le moment le plus important de l’Initiation, car c’est celui qui décide si le jeu plaît.</p><p>Le troisième, « La règle d’or », traite d’une contrainte qui revient à chaque donne : le dernier à parier ne peut pas tomber juste sur le total. Celui qui parle en dernier doit donc éviter un chiffre précis, et le rite montre une réponse classique, parier zéro et perdre exprès, que le rite lui-même présente comme une vraie arme. Mieux vaut avoir vu cette situation en s’exerçant qu’au milieu d’une partie à six.</p><p>À ce stade, vous avez les trois idées qui suffisent à jouer une première donne avec des débutants. Les rites suivants ajoutent des cartes spéciales, qu’il est inutile de présenter d’un coup : vous pourrez les sortir au fil des parties, comme le conseille la méthode en quatre temps de ${a('/blog/apprendre-jeu-cartes-fetes.html', 'l’article sur l’apprentissage en famille')}.</p>`
    },
    {
      id: 'rites-quatre-a-six',
      heading: 'Les rites quatre à six : Mystique, Pouvoir et manche à l’aveugle',
      html: `<p>Le quatrième rite présente la carte Mystique, le joker du jeu : elle vaut 0 ou 37, au choix de celui qui la joue. Le choix est le seul endroit du jeu où l’on décide de la valeur d’une carte, et le rite vous fait choisir dans un cas précis, avec des conseils du Bokonon, le devin qui guide l’ensemble de l’Initiation. Une fois vue, la Mystique devient la carte qu’on guette à la table.</p><p>Le cinquième, « Les cartes Pouvoir », réunit quatre pouvoirs qui renversent un pli : Clairvoyance, Bénédiction, Sceau et Voile. Le rite les fait jouer un par un, ce qui évite de réciter une liste que personne ne retient. C’est utile à connaître avant la partie, parce que ces cartes provoquent les éclats de rire et les protestations qui font l’ambiance d’une soirée.</p><p>Le sixième, « La manche Mystique », retourne la situation : on pose une carte sur son front, on voit celles des autres et jamais la sienne. Le joueur parie donc à l’aveugle en lisant le jeu des autres, et le rite conclut en parlant d’instinct du Mystique. C’est une manche particulière, plus facile à comprendre en la jouant qu’en l’entendant décrite à table. Si vous la connaissez avant la soirée, vous pouvez la proposer en dessert, quand tout le monde sait déjà jouer.</p><p>Ces trois rites sont ceux qu’il vaut mieux ne pas improviser devant un public. Si le temps manque avant Noël, passez au moins les deux premiers, puis la carte Mystique, et gardez le reste pour la veille.</p>`
    },
    {
      id: 'epreuve-des-anciens',
      heading: 'Le septième rite : une vraie partie contre trois Maîtres',
      html: `<p>L’épreuve des Anciens est la dernière marche : une vraie partie, avec toutes les règles, contre trois adversaires de niveau Maître pilotés par l’ordinateur. Les autres rites se jouent contre des adversaires de niveau adepte, plus indulgents. Celui-ci ne triche pas pour vous, et la page indique que chaque partie est différente : si vous perdez, vous pouvez retenter votre chance, la donne n’étant jamais la même.</p><p>Gagner contre les Maîtres n’est pas l’objectif. Ce qui compte, c’est d’avoir joué une partie entière, de la première annonce au dernier pli, avant de s’asseoir devant les invités. Vous aurez rencontré chacune des situations de la règle, compté vos plis, subi un pouvoir ou deux, et vous saurez dire à la table où l’on va chercher la réponse quand un doute apparaît.</p><p>Une fois les sept rites passés, la partie libre de l’Initiation vous oppose à l’ordinateur avec toutes les règles et à trois niveaux de difficulté, ce qui permet de continuer à s’exercer les jours suivants. Vous pouvez aussi relire ${a(REGLE, 'la règle complète')} en ligne, dont le contenu est le même que celui de la boîte, pour vérifier un détail avant la soirée.</p><p>Pour entretenir l’habitude de lire un pli, le petit jeu ${a(PLI, '« Quel pli gagne ? »')} propose des situations isolées à résoudre en quelques secondes, utile pour s’échauffer ou pour occuper un enfant pendant que le repas finit de cuire.</p>`
    },
    {
      id: 'organiser-la-soiree',
      heading: 'Comment arriver au repas avec une partie déjà prête',
      html: `<p>Pour que l’entraînement serve vraiment, il vaut mieux le placer au bon endroit dans le calendrier. La commande de KYRAN doit partir avant le 16 décembre pour arriver avant Noël ; l’Initiation, elle, ne dépend d’aucune livraison et peut se faire dès maintenant. Si vous offrez la boîte, vous pouvez même indiquer son adresse au destinataire dans la carte, pour qu’il s’y exerce avant de l’ouvrir.</p><p>Le jour même, une méthode simple suffit. Annoncez d’abord le but en une phrase : on annonce le nombre de plis qu’on va gagner, puis on essaie de tomber juste. Jouez ensuite une donne à cartes découvertes, en commentant à voix haute chaque pli, comme dans l’Initiation. N’introduisez les cartes Pouvoir qu’à la deuxième manche, une à la fois, quand les joueurs ont compris le pari. La boîte annonce 30 minutes au plus par partie, ce qui laisse de la place à une seconde manche avant le dessert.</p><p>KYRAN se joue de 3 à 6 joueurs, dès 8 ans, et coûte 9,99 € sur ce site.</p>`
    }
  ],
  sources: [
    { label: 'KYRAN, page de l’Initiation (sept rites)', url: MINIJEU, note: 'noms des rites, durée d’un quart d’heure, adversaires adeptes et Maîtres' },
    { label: 'KYRAN, règle complète en ligne', url: REGLE, note: 'règle du jeu, pli, pari, cartes Pouvoir' },
    { label: 'KYRAN, idée cadeau et dates de livraison', url: CADEAU, note: 'commande avant le 16 décembre, délais de livraison' },
    { label: 'KYRAN, page d’achat', url: COMMANDER, note: '9,99 €, nombre de joueurs, âge' },
    { label: 'KYRAN, mini-jeu « Quel pli gagne ? »', url: PLI, note: 'situations de pli à résoudre' }
  ],
  conclusion: `<p>Un jeu bien appris se rejoue, et c’est ce qui compte une fois les fêtes passées. Commencez par ${a(MINIJEU, 'l’Initiation')}, lisez ${a(REGLE, 'la règle complète')} si un détail vous échappe, puis retrouvez les dates de commande sur la page ${a(CADEAU, 'idée cadeau')}. Pour KYRAN, la commande doit partir avant le 16 décembre depuis ${a(COMMANDER, 'la page d’achat')}.</p>`,
  faq: [
    {
      q: 'Combien de temps faut-il pour passer l’Initiation de KYRAN ?',
      a: 'La page de l’Initiation annonce environ un quart d’heure pour vérifier que le principe du pari vous plaît et arriver à la première partie en connaissant les règles. Les sept rites peuvent aussi se répartir sur plusieurs soirs.'
    },
    {
      q: 'Peut-on faire jouer un enfant de 8 ans à l’Initiation ?',
      a: 'KYRAN est conseillé dès 8 ans. Les premiers rites ne demandent que de comparer des cartes et d’annoncer un nombre de plis, ce qu’un enfant de cet âge peut faire seul ou accompagné d’un adulte qui lit les consignes.'
    },
    {
      q: 'Faut-il avoir acheté la boîte pour s’entraîner ?',
      a: 'Non. L’Initiation se joue en ligne, depuis un navigateur, avant même la commande. Elle permet donc de savoir si le jeu plaît à la famille avant d’acheter, et de gagner du temps le jour de la première partie.'
    },
    {
      q: 'Jusqu’à quand commander KYRAN pour Noël ?',
      a: 'Pour qu’il arrive avant Noël, la commande en ligne doit partir au plus tard le 16 décembre. L’expédition se fait sous 24 à 48 heures ouvrées, puis la livraison prend 2 à 4 jours ouvrés en France.'
    }
  ],
  related: ['apprendre-jeu-cartes-fetes', 'cadeau-noel', 'jeux-cartes-reveillon']
};
