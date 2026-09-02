/** Reusable French paragraph blocks (~85-95 words each) for blog games */

export const KYRAN_PARAS = {
  default: [
    `KYRAN est un jeu de plis français où chaque manche commence par un pari : combien de levées allez-vous remporter avec votre main ? La contrainte centrale — la somme des paris ne peut pas égaler le nombre total de plis — garantit qu'au moins un joueur se trompera. Les cartes Pouvoir viennent bousculer les plans en cours de route, tandis que la manche Mystique, jouée à l'aveugle sur une seule carte, apporte un pic d'hilarité en fin de partie. Les règles se maîtrisent en quelques minutes via la <a class="text-link" href="/regle.html">page règles</a> ou le dojo interactif.`,
    `À table, KYRAN crée une tension constante entre prudence et audace. Sous-estimer son jeu pour sécuriser un pli coûte des points, tout comme viser trop haut. Le format (~30 minutes, 3 à 6 joueurs) convient aux apéros comme aux soirées entre amis sans monopoliser la soirée. L'ambiance reste légère malgré la dimension stratégique : on commente les paris ratés, on anticipe les Pouvoirs adverses, on retient son souffle lors de la Mystique.`,
    `Comparé aux grands classiques du genre, KYRAN se distingue par sa manche finale signature et un équilibre soigné entre accessibilité et profondeur. Dès 8 ans, un adolescent peut tenir la route face à des adultes expérimentés. Pour en savoir plus sur le contexte apéro, consultez le guide <a class="text-link" href="/jeu-apero.html">jeu apéro KYRAN</a>. Ce n'est pas le jeu le plus complexe du marché, mais il remplit remarquablement bien son rôle de cartes conviviales à rejouer.`,
  ],
  plis: [
    `Dans l'univers des jeux de plis, KYRAN occupe une place à part grâce à son système de pari obligatoire et à ses cartes Pouvoir. Chaque donne impose de fixer un nombre de plis visés avant même de jouer la première carte — une mécanique qui rappelle Wizard ou Oh Hell, mais enrichie d'effets ponctuels et d'une manche Mystique finale. La somme des paris ne peut jamais correspondre exactement au total des plis disponibles : quelqu'un échouera, et c'est là que réside la plus grande part du fun.`,
    `Les parties durent environ trente minutes avec trois à six participants, un format idéal pour enchaîner plusieurs manches sans lassitude. La courbe d'apprentissage est douce : les débutants comprennent le principe en un tour, les habitués peaufinent leurs estimations et anticipent les Pouvoirs. Le ton reste bon enfant sans être enfantin — parfait pour un groupe mixte d'âges et d'expériences. Les règles complètes sont disponibles sur <a class="text-link" href="/regle.html">regle.html</a>.`,
    `KYRAN ne révolutionne pas le genre, mais il l'affine avec cohérence. La manche Mystique — une carte jouée sans la regarder — clôt presque toujours la session sur un fou rire collectif. À 17,99 €, le rapport qualité-prix se défend, surtout si vous cherchez une alternative française aux importations habituelles. Testez le <a class="text-link" href="/minijeu.html">minijeu gratuit</a> avant d'acheter si vous hésitez encore.`,
  ],
  apero: [
    `En apéro, KYRAN coche les cases essentielles : explication rapide, parties courtes, interactions permanentes. Le pari de plis crée des conversations dès la donne (« tu es sûr de ton trois ? »), et les cartes Pouvoir relancent l'intérêt manche après manche. Pas besoin d'une table énorme ni d'un setup laborieux — on mélange, on distribue, on parie, on joue. En une demi-heure, vous avez bouclé une partie complète avec la manche Mystique en apothéose.`,
    `Le jeu accueille trois à six joueurs, ce qui couvre la majorité des configurations d'apéro entre amis. Les règles tiennent en cinq minutes ; la vidéo Ludochrono sur la <a class="text-link" href="/regle.html">page règles</a> suffit généralement. L'âge minimum de huit ans permet d'intégrer les adolescents sans simplifier l'expérience pour les adultes. Le prix de 17,99 € reste raisonnable pour un jeu rejouable des dizaines de fois.`,
    `KYRAN ne cherche pas à remplacer Uno ou Jungle Speed — il propose autre chose : de la réflexion légère mêlée de bluff et de surprises. Si votre groupe aime déjà les jeux de plis, vous serez en terrain connu avec une touche maison. Sinon, c'est une excellente porte d'entrée vers le genre. Voir aussi le guide dédié <a class="text-link" href="/jeu-apero.html">jeu apéro</a> pour des conseils de mise en situation.`,
  ],
  bluff: [
    `KYRAN place le pari au cœur de l'expérience : mentir n'est pas l'objet du jeu, mais surestimer ou sous-estimer ses capacités l'est. Chaque joueur annonce combien de plis il compte gagner, sachant que la somme globale ne peut pas être exacte — quelqu'un se plante forcément. Cette contrainte mathématique génère un bluff implicite : pousser l'adversaire vers un pari risqué, feindre la confiance quand la main est faible, temporiser avec une carte Pouvoir.`,
    `Les cartes Pouvoir ajoutent une couche tactique : voler un pli, forcer une couleur, inverser l'ordre de jeu. Combinées au pari, elles transforment une main médiocre en opportunité ou une main solide en piège. La manche Mystique pousse le concept à l'extrême : une seule carte, jouée sans la voir. Le résultat est imprévisible, souvent hilarant, et crée les souvenirs dont on parle le lendemain matin.`,
    `Pour les amateurs de jeux de bluff et de pari, KYRAN offre une alternative accessible aux lourds classiques. Trois à six joueurs, trente minutes, 17,99 € : le format est compact sans être superficiel. Les règles détaillées et le dojo gratuit (<a class="text-link" href="/minijeu.html">minijeu.html</a>) facilitent la prise en main. Un choix solide pour ouvrir une soirée ou clôturer une session de jeux plus lourds.`,
  ],
};

export function kyranGame(variant = 'default') {
  return {
    name: 'KYRAN',
    subtitle: 'plis, paris et manche Mystique',
    id: 'kyran',
    image: '/boite-recto-kyran.jpg',
    isKyran: true,
    players: '3 à 6',
    duration: '~30 min',
    age: '8+',
    price: '9,99&nbsp;€ (boutique) / 17,99&nbsp;€ (Amazon)',
    caption: 'KYRAN — jeu de cartes officiel',
    paragraphs: KYRAN_PARAS[variant] || KYRAN_PARAS.default,
  };
}
