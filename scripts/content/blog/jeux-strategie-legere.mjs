export default {
  slug: 'jeux-strategie-legere',
  title: 'Jeux de cartes de stratégie légère : de vraies décisions, des règles courtes',
  shortTitle: 'Stratégie légère en cartes',
  metaTitle: 'Jeux de stratégie légère : 8 cartes avec de vrais choix',
  description: 'Lost Cities, Schotten Totten, Parade, Oh Hell!, KYRAN : 8 jeux de cartes classés par profondeur et par part de chance, avec des règles qui tiennent en dix minutes.',
  category: 'Cartes',
  date: '2026-06-18',
  heroTitle: 'Jeux de <span class="accent">stratégie légère</span>',
  heroSubtitle: 'Des décisions qui comptent et une règle qui s\'explique en dix minutes : huit jeux de cartes classés.',
  heroImage: '/blog/images/star-realms.jpg',
  heroCaption: 'Star Realms, stratégie compacte et nerveuse.',
  intro: `<p>Un jeu de stratégie légère se reconnaît à deux critères : on l'explique en moins de dix minutes, et chaque tour oblige à choisir entre plusieurs options qui ont des conséquences. Pour les meilleurs rapports entre profondeur et règles, retenez <strong>Lost Cities</strong> (duel, trois minutes d'explication), <strong>Parade</strong> (de 2 à 6 joueurs, une règle contre-intuitive mais brève) et <strong>Hanabi</strong> (coopératif, la profondeur vient des conventions). Les trois jeux de plis à paris de la liste (Oh Hell!, Wizard, KYRAN) montrent qu'un simple jeu de cartes peut déjà demander de la stratégie. Chaque fiche situe le jeu sur deux échelles : la durée d'apprentissage et la part de chance. Pour des jeux où l'on choisit une carte avant de la passer, voyez aussi notre page sur le <a class="text-link" href="/blog/jeux-draft-encheres.html">draft et les enchères</a>.</p>`,
  criteria: {
    heading: 'Comment mesurer la profondeur d\'un jeu léger ?',
    html: `<p>On confond souvent « léger » et « simple ». Un jeu léger a peu de règles, mais pas forcément peu de décisions : les plus réussis offrent le maximum de choix par minute d'explication. Trois repères aident à comparer.</p>
<h3>La durée d'apprentissage</h3>
<p>Lost Cities et Oh Hell! s'expliquent en trois minutes si l'on connaît déjà un jeu de plis ; Schotten Totten, Parade et Hanabi demandent environ cinq minutes ; KYRAN ou Wizard, un peu plus à cause de leurs cartes spéciales ; Star Realms, le plus long, réclame la lecture du texte des cartes. Ces durées sont des estimations éditoriales, pas des mesures, mais elles suffisent à classer les jeux entre eux.</p>
<h3>D'où vient la chance ?</h3>
<p>Il existe trois sources de hasard, avec des effets très différents sur la stratégie. La <strong>donne</strong> (Oh Hell!, Wizard, KYRAN) se joue avant la première carte : on ne peut que bien estimer ce qu'on a reçu. La <strong>pioche</strong> (Lost Cities, Schotten Totten, Star Realms, Parade) se renouvelle à chaque tour et laisse des occasions de corriger. L'<strong>ordre du paquet</strong> de Hanabi peut ruiner une partie sans que personne ne soit fautif. Un joueur qui cherche à maîtriser préférera la pioche, un joueur qui aime les imprévus la donne.</p>
<h3>Trois tests pour savoir si un jeu a de la profondeur</h3>
<ul>
<li><strong>Peut-on perdre par sa faute ?</strong> Si les erreurs se repèrent après coup (« j'aurais dû garder ce 7 »), le jeu enseigne quelque chose.</li>
<li><strong>Un joueur expérimenté gagne-t-il régulièrement ?</strong> Si oui, il y a une compétence à acquérir ; si le hasard égalise tout, on est face à un jeu d'ambiance (Uno par exemple).</li>
<li><strong>Les décisions changent-elles d'une partie à l'autre ?</strong> Un jeu où l'on refait les mêmes choix à chaque fois s'épuise en quelques soirées.</li>
</ul>
<p>Autre point de méthode : le nombre de joueurs. Trois duels de la liste (Lost Cities, Schotten Totten, Star Realms) ne se jouent qu'à deux, tandis que Parade, Hanabi et les jeux de plis couvrent de 2 à 7 joueurs. Si vous cherchez de la stratégie pour un couple, la sélection de <a class="text-link" href="/blog/jeux-duo-couples.html">jeux de cartes à deux</a> approfondit cette moitié du choix.</p>`
  },
  games: [
    {
      id: 'lost-cities',
      type: 'Duel, gestion de risque',
      pick: 'Pour deux joueurs qui veulent un maximum de choix pour un minimum de règles',
      paragraphs: [
        `Lost Cities se résume en une phrase : chaque couleur se construit en ordre croissant, et chaque expédition lancée coûte 20 points avant de rapporter. Poser un 5 interdit pour toujours les 2, 3 et 4 de la même couleur de votre côté. Cette irréversibilité fait toute la profondeur : chaque carte jouée engage l'avenir, avec très peu d'explications à donner.`,
        `La chance est celle de la pioche, mais la défausse la corrige : on peut piocher une carte visible plutôt qu'au hasard, ce qui permet de rattraper un mauvais tirage. Limite évidente, le jeu ne se joue qu'à deux, et l'écart d'expérience se creuse vite. Il récompense surtout les joueurs capables de renoncer à une expédition quand la pioche ne tient pas ses promesses.`
      ]
    },
    {
      id: 'schotten-totten',
      type: 'Duel, formations',
      pick: 'Pour les amateurs de combinaisons de poker avec peu de hasard',
      paragraphs: [
        `Neuf bornes, trois cartes par côté et par borne, une main de six cartes : le matériel est minimal et le décompte se retient en pensant à un poker simplifié (suite de couleur, brelan, couleur, suite, total). Ce qui apporte la profondeur, c'est la revendication : on peut s'emparer d'une borne avant qu'elle soit complète, à condition de démontrer que les cartes encore disponibles ne permettent plus à l'adversaire de faire mieux.`,
        `La chance reste modérée, car le calcul des cartes restantes est possible. Le niveau se creuse donc entre le joueur qui compte et celui qui joue au feeling. Défaut : le jeu n'a de sens qu'à deux, et ses parties finissent par se ressembler une fois les formations maîtrisées.`
      ]
    },
    {
      id: 'parade',
      type: 'Collection inversée',
      pick: 'Pour les joueurs qui aiment une règle contre-intuitive mais courte',
      paragraphs: [
        `Dans Parade, on ne cherche pas à ramasser des cartes : on cherche à en ramasser le moins possible. À son tour, on place une carte au bout du défilé, on épargne les cartes les plus proches (autant que le chiffre de la carte jouée), puis on ramasse parmi les autres celles de même couleur ou de valeur inférieure ou égale. Le paradoxe est amusant : poser un 10 ne ramasse rien tant que le défilé compte dix cartes ou moins, alors qu'un 0 n'épargne aucune carte.`,
        `Le décompte final récompense la majorité dans une couleur : celui qui en détient le plus ne compte qu'un point par carte au lieu de leur valeur. Les premières parties se jouent surtout à la peur de se faire piéger par le comptage, la mécanique se maîtrise ensuite. Parade accepte de 2 à 6 joueurs, ce qui en fait une des stratégies légères les plus flexibles de la liste.`
      ]
    },
    {
      id: 'hanabi',
      type: 'Coopératif, déduction',
      pick: 'Pour ceux qui aiment déduire plutôt que bluffer',
      paragraphs: [
        `Hanabi s'explique en cinq minutes : huit jetons d'indice, trois jetons d'erreur, cinq couleurs à monter de 1 à 5. La profondeur ne vient pas des règles mais des conventions que le groupe se donne. Que signifie un indice sur la dernière carte de la main ? Quelle défausse est sûre ? À niveau égal, deux tables n'y jouent pas du tout de la même façon.`,
        `La chance se trouve dans l'ordre du paquet, qui peut gâcher une partie sans fautif. Autre limite : sans véritable compétition, l'enjeu est un score sur 25 et l'envie de s'améliorer. Un groupe qui veut un vainqueur sera déçu ; un groupe qui aime progresser ensemble y trouvera, de 2 à 5 joueurs, une stratégie durable.`
      ]
    },
    {
      id: 'oh-hell',
      type: 'Plis et paris',
      pick: 'Pour jouer de la stratégie avec un simple jeu de 52 cartes',
      paragraphs: [
        `Oh Hell! se joue avec un jeu de 52 cartes classique, et ne demande que de connaître le principe d'un jeu de plis (suivre la couleur, jouer atout). Chacun annonce combien de plis il va réaliser ; dans la version classique, le dernier à parler n'a pas le droit de choisir le chiffre qui équilibrerait le total. L'ensemble s'explique en quelques minutes à qui a déjà joué à la belote ou au whist.`,
        `La profondeur réside dans les choix de carte : garder un as pour un pli sûr, ou s'en débarrasser pour ne pas dépasser son annonce. La chance est surtout celle de la donne, atténuée par la répétition des manches. Défaut : les règles locales varient d'une table à l'autre, et il faut s'accorder sur la version avant de jouer.`
      ]
    },
    {
      id: 'kyran',
      type: 'Plis et paris',
      pick: 'Pour une table de 3 à 6 qui aime jouer avec des vies visibles',
      paragraphs: [
        `KYRAN appartient à la même famille que le Tarot Africain et Oh Hell!, avec trois particularités qui touchent la stratégie. Rater son pari coûte autant de cartes Vie que l'écart : se tromper de trois fait trois fois plus mal que se tromper d'un seul pli, ce qui incite à prendre un risque raisonnable avec une mauvaise main. Les cartes Pouvoir permettent d'espionner ou de forcer un coup, et la manche Mystique se joue à une carte sur le front.`,
        `Comme les cartes Vie sont visibles de tous, on joue aussi sur l'état de la table : un joueur proche de la dernière vie se met à jouer sur le fil. La chance est celle de la donne ; la profondeur reste celle d'un bon jeu de plis, pas d'un jeu de combinatoire. Les <a class="text-link" href="/regle.html">règles</a> se lisent en cinq minutes, et l’<a class="text-link" href="/minijeu.html">Initiation gratuite</a> permet d'essayer le pari sans ouvrir la boîte.`
      ]
    },
    {
      id: 'wizard',
      type: 'Plis et enchères',
      pick: 'Pour ceux qui préfèrent des annonces libres, sans contrainte artificielle',
      paragraphs: [
        `Wizard ne s'embarrasse d'aucune contrainte sur les annonces : chacun annonce le nombre de plis qu'il veut, et la difficulté de tenir sa promesse fait la stratégie. Les huit cartes spéciales (quatre Magiciens, quatre Bouffons) servent d'outils de contrôle : garantir un pli, ou en perdre un à volonté. On décide en quelque sorte d'un contrat après avoir vu sa main.`,
        `L'atout change à chaque manche, ce qui renouvelle les calculs : un même roi n'a pas la même valeur d'une manche à l'autre. Défaut : la longueur. Entre 10 manches à six joueurs et 20 à trois, les écarts de niveau mettent du temps à se refléter dans le score. Notre page sur les <a class="text-link" href="/blog/alternatives-wizard.html">alternatives à Wizard</a> compare ce jeu à ses voisins.`
      ]
    },
    {
      id: 'star-realms',
      type: 'Deck-building, duel',
      pick: 'Pour deux joueurs prêts à passer dix minutes sur les règles',
      paragraphs: [
        `Star Realms clôt la sélection parce qu'il flirte avec la limite de ce que « léger » peut contenir : la règle de base tient en une page, mais le texte de chaque carte ajoute de l'information à lire à chaque tour. On construit son paquet à partir d'un petit tas de départ, on achète dans une rangée commune de cinq cartes, on enchaîne les bonus de faction.`,
        `Les décisions sont denses : acheter, attaquer une base, soigner, accélérer. La chance tient à la pioche et à la rangée, mais on rectifie ses erreurs en cours de route. Défauts : la boîte indique 12 ans et plus, le jeu ne se joue qu'à deux, et l'analyse s'allonge quand le paquet grossit. Au classement de la profondeur par minute de règles, il arrive dernier ; au classement de la variété des situations, premier.`
      ]
    }
  ],
  verdict: {
    heading: 'Notre avis tranché',
    html: `<p>Pour le meilleur rapport entre profondeur et règles, <strong>Lost Cities</strong> l'emporte à deux joueurs et <strong>Parade</strong> au-delà : peu d'explications, des décisions réelles, et des parties qu'on recommence. Si votre table connaît les jeux de plis, <strong>KYRAN</strong> et Oh Hell! offrent des paris rapides à mettre en place, le premier avec des vies visibles, le second avec un simple jeu de 52 cartes. Star Realms et Wizard sont des choix honnêtes mais plus exigeants : ne les proposez pas à des joueurs qui veulent seulement un jeu d'apéro.</p>`
  },
  conclusion: `<p>Le meilleur indicateur de profondeur est simple : après la première partie, quelqu'un demande-t-il à rejouer pour tester une autre approche ? Si oui, le jeu est à la bonne taille. Pour élargir, parcourez notre comparatif des <a class="text-link" href="/blog/jeux-plis-comparatif.html">jeux de plis</a>, qui détaille la famille de Oh Hell!, Wizard et KYRAN.</p>`,
  faq: [
    {
      q: 'Qu\'est-ce qu\'un jeu de stratégie légère ?',
      a: `C'est un jeu dont les règles s'expliquent en moins de dix minutes et dont les tours obligent à de vrais choix. Les parties durent généralement entre 15 et 45 minutes. Lost Cities, Schotten Totten et Parade en sont de bons exemples en cartes.`
    },
    {
      q: 'Quel jeu de stratégie légère pour deux joueurs ?',
      a: `Lost Cities, Schotten Totten et Star Realms sont conçus pour deux. Lost Cities a les règles les plus courtes, Schotten Totten mise sur les combinaisons, Star Realms sur la construction d'un paquet, mais il réclame davantage de lecture.`
    },
    {
      q: 'Quel jeu de stratégie légère à partir de trois joueurs ?',
      a: `Parade accepte de 2 à 6 joueurs, Hanabi de 2 à 5, Oh Hell! de 3 à 7, Wizard et KYRAN de 3 à 6. Les trois derniers sont des jeux de plis à paris ; Hanabi est coopératif ; Parade est un jeu de collection inversée.`
    },
    {
      q: 'Existe-t-il un jeu de réflexion en cartes avec peu de hasard ?',
      a: `Aucun jeu de cartes n'est sans hasard, puisqu'il y a toujours une donne ou une pioche. Schotten Totten et Lost Cities sont les plus maîtrisables : le comptage des cartes restantes permet d'anticiper. Dans les jeux de plis, la donne pèse davantage.`
    },
    {
      q: 'Par quel jeu de stratégie légère commencer quand on débute ?',
      a: `Lost Cities si vous êtes deux, Parade si vous êtes plus nombreux, car leurs règles tiennent en quelques minutes. Pour un groupe qui connaît déjà la belote ou le whist, un jeu de plis à paris comme Oh Hell! ou KYRAN sera plus familier.`
    },
    {
      q: 'Oh Hell!, Wizard ou KYRAN : lequel choisir ?',
      a: `Oh Hell! si vous avez un jeu de 52 cartes et aucun matériel supplémentaire. Wizard pour des annonces libres et beaucoup de manches. KYRAN pour des vies visibles, des pouvoirs et des parties d'environ 30 minutes, de 3 à 6 joueurs. Notre <a class="text-link" href="/blog/jeux-plis-comparatif.html">comparatif des jeux de plis</a> détaille les différences.`
    }
  ],
  related: ['jeux-plis-comparatif', 'jeux-duo-couples', 'jeux-draft-encheres']
};
