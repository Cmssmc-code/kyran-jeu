/*
 * Initiation KYRAN — les sept rites du collier d'initié.
 *
 * Chaque rite impose une donne (mains, donneur, paris et cartes des adversaires) pour que le
 * Bokonon, devin du Fa, puisse commenter précisément la situation. Les étapes `coach` se déclenchent une seule
 * fois, avant une décision du joueur (`on: 'bet' | 'play' | 'target' | 'mysticValue' | 'reveal'`)
 * ou après un événement (`on: 'start' | 'trickWon' | 'peek' | 'roundEnd'`). `allow*` restreint les
 * choix possibles ; `ack` attend que le joueur ait lu avant de continuer.
 */

const missed = s => s.players.filter(p => !p.human && p.bet !== p.tricks).map(p => p.name);
const missedText = s => {
  const m = missed(s);
  if (!m.length) return '';
  return m.length === 1 ? ` Remarque ${m[0]} : son pari est raté, ça lui coûte des Vies.` : ` ${m.join(' et ')} ratent leur pari et perdent des Vies.`;
};

const TABLE = [
  { name: 'Toi', human: true },
  { name: 'Griot', persona: 'griot', level: 'adepte' },
  { name: 'Amazone', persona: 'amazone', level: 'adepte' },
  { name: 'Caméléon', persona: 'cameleon', level: 'adepte' }
];

export const LESSONS = [
  {
    id: 'pli',
    bead: 'mauve',
    beadName: 'Perle mauve',
    title: 'Le pli',
    summary: 'La carte la plus forte remporte le pli.',
    intro: [
      'Chaque joueur pose une carte à tour de rôle : c’est un <b>pli</b>.',
      'La carte la plus forte l’emporte, et son propriétaire <b>ouvre le pli suivant</b>.',
      'Les cartes vont de 1 à 36 ; leur couleur aide à juger leur force, du mauve (1 à 6) au rouge (31 à 36).'
    ],
    showCards: ['n3', 'n10', 'n15', 'n22', 'n28', 'n34'],
    setup: {
      players: TABLE,
      rounds: [3],
      cycles: 1,
      powers: false,
      mystique: false,
      noLifeLoss: true,
      noTiebreak: true,
      deals: { 0: { dealer: 3, hands: { 0: ['n33', 'n21', 'n5'], 1: ['n28', 'n12', 'n2'], 2: ['n30', 'n17', 'n4'], 3: ['n14', 'n35', 'n1'] } } }
    },
    humanBet: 2,
    aiBets: { 1: 1, 2: 1, 3: 1 },
    aiPlays: { 1: ['n28', 'n12', 'n2'], 2: ['n30', 'n17', 'n4'], 3: ['n14', 'n35', 'n1'] },
    coach: [
      { on: 'start', ack: true, say: 'Voici ta main : un 33 rouge, un 21 jaune et un 5 mauve. Pour ce premier rite, je fais les annonces à ta place : on se concentre sur les plis.' },
      { on: 'play', trick: 1, allowCards: ['n33'], say: 'Tu ouvres le premier pli. Pose ton <b>33</b> : une carte rouge est très forte.' },
      { on: 'trickWon', trick: 1, ack: true, say: '33 bat 30, 28 et 14 : <b>tu remportes le pli</b>. Celui qui gagne un pli ouvre le suivant, donc c’est encore à toi.' },
      { on: 'play', trick: 2, allowCards: ['n21'], say: 'Ouvre avec ton <b>21</b>. Observe bien ce que jouent les autres.' },
      { on: 'trickWon', trick: 2, ack: true, say: 'Caméléon avait gardé un <b>35</b> : il remporte le pli et ouvre le suivant. Une carte jaune ne suffit pas toujours.' },
      { on: 'play', trick: 3, say: 'Caméléon a ouvert avec un 1. Il ne te reste que ton <b>5</b> : pose-le.' },
      { on: 'trickWon', trick: 3, ack: true, say: 'Ton 5 bat le 1, le 2 et le 4 ! Une petite carte gagne quand les autres jouent encore plus petit. Tu as remporté <b>2 plis</b>.' }
    ],
    success: () => ({ ok: true, text: 'Tu sais lire un pli : la plus forte carte gagne et son propriétaire ouvre le suivant.' })
  },
  {
    id: 'pari',
    bead: 'bleue',
    beadName: 'Perle bleue',
    title: 'Le pari',
    summary: 'Annonce le nombre exact de plis que tu vas gagner.',
    intro: [
      'Avant de jouer, chacun <b>annonce combien de plis il va gagner</b> : ni plus, ni moins.',
      'Chacun commence avec <b>5 Vies</b>. Un pari raté coûte autant de Vies que l’écart : parier 2 et gagner 0 plis fait perdre 2 Vies.',
      'Gagner trop de plis est donc aussi grave qu’en gagner trop peu.'
    ],
    showCards: ['n35', 'n14', 'n6'],
    setup: {
      players: TABLE,
      rounds: [3],
      cycles: 1,
      powers: false,
      mystique: false,
      noTiebreak: true,
      deals: { 0: { dealer: 3, hands: { 0: ['n35', 'n14', 'n6'], 1: ['n22', 'n9', 'n31'], 2: ['n27', 'n19', 'n3'], 3: ['n25', 'n12', 'n7'] } } }
    },
    aiBets: { 1: 1, 2: 1, 3: 1 },
    aiPlays: { 1: ['n22', 'n9', 'n31'], 2: ['n27', 'n19', 'n3'], 3: ['n25', 'n12', 'n7'] },
    coach: [
      { on: 'bet', say: 'Évalue ta main : le <b>35</b> rouge gagne presque toujours, le <b>14</b> vert rarement, le <b>6</b> mauve presque jamais. Combien de plis annonces-tu ? Le bouton Conseil détaille le calcul.' },
      { on: 'play', trick: 1, say: 'Ton pari est posé. Astuce : prends tôt le pli sûr avec ta carte forte, puis débarrasse-toi des autres.' },
      { on: 'trickWon', ack: true, when: s => s.players[0].bet === s.players[0].tricks && s.players[0].tricks > 0 && s.players[0].hand.length > 0, say: 'Ton compte est bon ! Désormais, chaque pli gagné te coûterait une Vie : joue tes cartes les plus faibles.' },
      { on: 'roundEnd', ack: true, say: s => (s.players[0].bet === s.players[0].tricks ? 'Pari exact : tu gardes tes 5 Vies.' + missedText(s) : 'L’écart entre ton pari et tes plis te coûte des Vies. Réessaie : vise le nombre exact.') }
    ],
    success: s => (s.players[0].bet === s.players[0].tricks
      ? { ok: true, text: 'Pari exact ! Tu as compris le cœur de KYRAN : prévoir, pas gagner le plus possible.' }
      : { ok: false, text: `Tu as parié ${s.players[0].bet} et gagné ${s.players[0].tricks} pli${s.players[0].tricks > 1 ? 's' : ''}. Avec cette main, 1 pli était le bon calcul.` })
  },
  {
    id: 'regle-or',
    bead: 'verte',
    beadName: 'Perle verte',
    title: 'La règle d’or',
    summary: 'Le dernier à parier ne peut pas tomber juste sur le total.',
    intro: [
      'La <b>somme des paris ne doit jamais égaler le nombre de plis</b> de la manche.',
      'C’est le dernier à parler, le donneur, qui doit ajuster son annonce. Ainsi, au moins un joueur ratera son pari.',
      'Ici, c’est toi qui distribues : tu parles en dernier.'
    ],
    showCards: ['n32', 'n18', 'n2'],
    setup: {
      players: TABLE,
      rounds: [3],
      cycles: 1,
      powers: false,
      mystique: false,
      noTiebreak: true,
      deals: { 0: { dealer: 0, hands: { 0: ['n32', 'n18', 'n2'], 1: ['n34', 'n15', 'n6'], 2: ['n20', 'n29', 'n11'], 3: ['n7', 'n26', 'n13'] } } }
    },
    aiBets: { 1: 1, 2: 1, 3: 0 },
    aiPlays: { 1: ['n34', 'n15', 'n6'], 2: ['n20', 'n29', 'n11'], 3: ['n7', 'n26', 'n13'] },
    coach: [
      { on: 'bet', say: 'Les autres ont annoncé 1 + 1 + 0 = 2 plis sur 3. Ton 32 vaut sans doute 1 pli… mais 2 + 1 ferait 3 : <b>la règle d’or t’interdit 1</b>. Parier 0 et perdre exprès est souvent plus sûr que viser 2.' },
      { on: 'play', trick: 1, say: s => (s.players[0].bet === 0 ? 'Griot a posé un 34 : glisse ton <b>32</b> dessous, il ne gagnera pas ce pli. C’est le moment de te débarrasser de ta carte dangereuse.' : 'Tu vises 2 plis : il faudra gagner avec ton 32 et ton 18.') },
      { on: 'play', trick: 2, when: s => s.players[0].bet === 0, say: 'Amazone a posé 29 : ton <b>18</b> passe dessous. Garde le 2 pour la fin, il ne risque rien.' },
      { on: 'roundEnd', ack: true, say: s => 'Avec la règle d’or, la somme des paris ne tombe jamais juste : quelqu’un rate forcément.' + (missed(s).length ? ` Cette fois : ${missed(s).join(', ')}.` : '') }
    ],
    success: s => (s.players[0].bet === s.players[0].tricks
      ? { ok: true, text: 'Tu as joué la contrainte du donneur : parier 0 et perdre exprès est une vraie arme.' }
      : { ok: false, text: 'Raté de peu. Parie 0 et glisse tes cartes sous celles des autres.' })
  },
  {
    id: 'mystique',
    bead: 'jaune',
    beadName: 'Perle jaune',
    title: 'La carte Mystique',
    summary: 'Le joker qui vaut 0 ou 37, au choix.',
    intro: [
      'La <b>Mystique</b> est la carte suprême : en la posant, tu choisis sa valeur.',
      'À <b>37</b>, elle bat toutes les cartes. À <b>0</b>, elle perd à coup sûr.',
      'C’est un joker parfait pour réussir… ou pour rater un pli volontairement.'
    ],
    showCards: ['m'],
    setup: {
      players: TABLE,
      rounds: [3],
      cycles: 1,
      powers: false,
      mystique: true,
      noTiebreak: true,
      deals: { 0: { dealer: 3, hands: { 0: ['m', 'n36', 'n8'], 1: ['n13', 'n2', 'n6'], 2: ['n24', 'n5', 'n28'], 3: ['n17', 'n7', 'n30'] } } }
    },
    aiBets: { 1: 0, 2: 1, 3: 2 },
    aiPlays: { 1: ['n13', 'n2', 'n6'], 2: ['n24', 'n5', 'n28'], 3: ['n17', 'n7', 'n30'] },
    coach: [
      { on: 'bet', allowBets: [1], say: 'Ton 36 gagnera un pli. La Mystique, elle, fera ce que tu veux. Annonce <b>1</b> : le 36 le gagnera, et la Mystique t’aidera à ne pas en prendre d’autre.' },
      { on: 'play', trick: 1, allowCards: ['n36'], say: 'Ouvre avec ton <b>36</b> : la seule carte capable de le battre, c’est la Mystique… et elle est dans ta main.' },
      { on: 'trickWon', trick: 1, ack: true, say: 'Pli gagné, ton compte est bon. Maintenant, il faut tout perdre.' },
      { on: 'play', trick: 2, allowCards: ['m'], say: 'J’ai lu leur jeu dans le Fa : sur ce pli, ils vont jouer petit et ton 8 risquerait de gagner. Joue la <b>Mystique</b>.' },
      { on: 'mysticValue', allowValues: [0], say: 'Choisis <b>0</b> : la Mystique devient la carte la plus faible et ne peut pas gagner.' },
      { on: 'trickWon', trick: 2, ack: true, say: 'Caméléon prend le pli avec un 7. À 37, la Mystique t’aurait offert un pli de trop.' },
      { on: 'roundEnd', ack: true, say: 'Pari tenu grâce au joker. Retiens : 37 pour gagner à coup sûr, 0 pour perdre à coup sûr.' }
    ],
    success: s => (s.players[0].bet === s.players[0].tricks
      ? { ok: true, text: 'La Mystique n’a plus de secret pour toi.' }
      : { ok: false, text: 'Réessaie en suivant les conseils du Bokonon.' })
  },
  {
    id: 'pouvoirs',
    bead: 'orange',
    beadName: 'Perle orange',
    title: 'Les cartes Pouvoir',
    summary: 'Quatre pouvoirs qui renversent un pli.',
    intro: [
      'Une carte Pouvoir a une valeur, comme une carte Nombre, et un <b>effet qui s’active dès qu’elle est posée</b>.',
      'En cas d’égalité de valeur, la carte Pouvoir l’emporte sur la carte Nombre.',
      'Attention au moment où tu la joues : certains effets sont annulés si tu ouvres le pli, d’autres si tu le fermes.'
    ],
    showCards: ['p11', 'p20', 'p27', 'p3'],
    setup: {
      players: TABLE,
      rounds: [4],
      cycles: 1,
      powers: true,
      mystique: false,
      noLifeLoss: true,
      noTiebreak: true,
      deals: { 0: { dealer: 3, hands: { 0: ['p11', 'p20', 'p27', 'p3'], 1: ['n6', 'n1', 'n30', 'n33'], 2: ['n35', 'n12', 'n29', 'n31'], 3: ['n10', 'n9', 'n28', 'n32'] } } }
    },
    humanBet: 2,
    aiBets: { 1: 1, 2: 1, 3: 1 },
    aiPlays: { 1: ['n6', 'n1', 'n30', 'n33'], 2: ['n35', 'n12', 'n29', 'n31'], 3: ['n10', 'n9', 'n28', 'n32'] },
    coach: [
      { on: 'start', ack: true, say: 'Ta main ne contient que des cartes Pouvoir. Je parie 2 pour toi : on va les essayer une par une.' },
      { on: 'play', trick: 1, allowCards: ['p11'], say: 'Ouvre avec la <b>Clairvoyance Antique</b> : tu regarderas en secret la meilleure carte d’un adversaire.' },
      { on: 'target', trick: 1, allowTargets: [2], say: 'Espionne <b>Amazone</b> : c’est elle qui semble la plus dangereuse.' },
      { on: 'peek', ack: true, say: 'Amazone cache un <b>35</b> : ta Clairvoyance (11) ne fera pas le poids. Ce genre d’information vaut de l’or pour la suite.' },
      { on: 'play', trick: 2, allowCards: ['p20'], say: 'Griot joue après toi. Pose la <b>Bénédiction des Ancêtres</b> (20) : il devra jouer sa plus faible carte. Si tu jouais en dernier, l’effet serait annulé.' },
      { on: 'target', trick: 2, say: 'Cible <b>Griot</b>, le seul joueur qui n’a pas encore joué.' },
      { on: 'trickWon', trick: 2, ack: true, say: 'Forcé de jouer son 1, Griot ne peut plus te battre : ton 20 remporte le pli.' },
      { on: 'play', trick: 3, allowCards: ['p27'], say: 'Tu ouvres. Pose le <b>Sceau du Destin</b> (27) : tu tires au hasard une carte d’un adversaire, qu’il doit jouer aussitôt.' },
      { on: 'trickWon', trick: 3, ack: true, say: 'Leurs dernières cartes étaient toutes au-dessus de 27. Le hasard du Sceau ne suffit pas toujours !' },
      { on: 'play', trick: 4, allowCards: ['p3'], say: 'Dernière carte : le <b>Voile du Néant</b> (3). Il échange sa valeur avec une carte déjà posée par un adversaire. Il est annulé si tu ouvres le pli : ici, ce n’est pas le cas.' },
      { on: 'target', trick: 4, say: 'Échange avec la carte <b>la plus forte</b> posée : ton 3 prendra sa valeur.' },
      { on: 'roundEnd', ack: true, say: 'Bravo : tu as utilisé les quatre pouvoirs. À la table, ils provoquent les plus beaux retournements.' }
    ],
    success: () => ({ ok: true, text: 'Clairvoyance, Bénédiction, Sceau et Voile : tu connais les quatre pouvoirs.' })
  },
  {
    id: 'manche-mystique',
    bead: 'rouge',
    beadName: 'Perle rouge',
    title: 'La manche Mystique',
    summary: 'Une carte sur le front : tu vois les autres, jamais la tienne.',
    intro: [
      'Dernière manche du cycle : <b>une seule carte</b>, tenue contre le front.',
      'Tu vois la carte de tous tes adversaires, <b>jamais la tienne</b>. Tu paries 1 (je gagne le pli) ou 0.',
      'Puis tout le monde abat sa carte en même temps. Les pouvoirs ne s’activent pas, et la Mystique vaut 37 si son porteur a parié 1, sinon 0.'
    ],
    showCards: ['m'],
    setup: {
      players: TABLE,
      rounds: [1],
      cycles: 1,
      powers: true,
      mystique: true,
      noTiebreak: true,
      deals: { 0: { dealer: 3, hands: { 0: ['n29'], 1: ['n8'], 2: ['n15'], 3: ['n12'] } } }
    },
    aiBets: { 1: 0, 2: 0, 3: 0 },
    coach: [
      { on: 'start', ack: true, say: 'Ta carte est face cachée : regarde plutôt celles de tes adversaires, au-dessus de leurs avatars : 8, 15 et 12.' },
      { on: 'bet', say: 'La plus forte carte visible est un 15. Parmi les cartes que tu ne vois pas, une grande majorité bat le 15 : tes chances de gagner sont bonnes. Le bouton Conseil te donne le calcul exact.' },
      { on: 'reveal', say: s => (s.players[0].bet === 1 && s.players[3].bet === 1 ? 'Les paris sont faits. Caméléon, dernier à parler, n’avait pas le droit d’annoncer 0 : avec la règle d’or, la somme des paris ne peut pas valoir 1. Révèle les cartes !' : 'Les paris sont faits. Révèle les cartes !') },
      { on: 'roundEnd', ack: true, say: s => (s.players[0].bet === s.players[0].tricks ? 'Tu avais un 29 : déduction parfaite.' : 'Tu avais un 29 : face à 8, 15 et 12, il fallait oser parier 1.') }
    ],
    success: s => (s.players[0].bet === s.players[0].tricks
      ? { ok: true, text: 'Tu as parié à l’aveugle en lisant le jeu des autres : l’instinct du Mystique.' }
      : { ok: false, text: 'Les cartes visibles étaient faibles : la tienne avait de bonnes chances d’être plus forte.' })
  },
  {
    id: 'epreuve',
    bead: 'mystique',
    beadName: 'Perle Mystique',
    title: 'L’épreuve des Anciens',
    summary: 'Une vraie partie, toutes règles, face à trois Maîtres.',
    intro: [
      'Partie complète : manches de <b>7 à 2 cartes</b>, puis la manche Mystique, avec les cartes Pouvoir et la Mystique.',
      'La partie s’arrête dès qu’un joueur perd sa dernière Vie. Celui qui a le plus de Vies devient <b>Maître des Mystiques</b>.',
      'Tes adversaires jouent au niveau Maître. Termine premier pour recevoir la perle Mystique.'
    ],
    showCards: ['n36', 'p27', 'm'],
    setup: {
      players: [
        { name: 'Toi', human: true },
        { name: 'Griot', persona: 'griot', level: 'maitre' },
        { name: 'Amazone', persona: 'amazone', level: 'maitre' },
        { name: 'Guérisseuse', persona: 'guerisseuse', level: 'maitre' }
      ],
      powers: true,
      mystique: true
    },
    free: true,
    coach: [],
    success: s => ((s.winners || []).includes(0)
      ? { ok: true, text: 'Tu as battu trois Maîtres : te voilà Maître des Mystiques.' }
      : { ok: false, text: 'Les Maîtres l’emportent cette fois. Chaque partie est différente : retente ta chance.' })
  }
];

/** Perle gagnée à chaque rite : motif des cartes Nombre de la même couleur, puis la Mystique. */
export const BEAD_IMAGES = {
  mauve: '/dojo/img/perle-mauve.png',
  bleue: '/dojo/img/perle-bleue.png',
  verte: '/dojo/img/perle-verte.png',
  jaune: '/dojo/img/perle-jaune.png',
  orange: '/dojo/img/perle-orange.png',
  rouge: '/dojo/img/perle-rouge.png',
  mystique: '/dojo/img/perle-mystique.png'
};
