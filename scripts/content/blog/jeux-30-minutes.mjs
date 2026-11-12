export default {
  slug: `jeux-30-minutes`,
  title: `Jeux de cartes de 30 minutes ou moins : 9 parties express`,
  shortTitle: `Jeux de 30 minutes ou moins`,
  metaTitle: `Meilleurs jeux de cartes rapides (moins de 30 min) : 9 choix`,
  description: `Les meilleurs jeux de cartes rapides, en moins de 30 minutes : neuf jeux rangés en trois créneaux (15, 20, 30 min), nombre de joueurs et pièges de durée.`,
  category: `Soirée`,
  date: `2026-05-19`,
  heroTitle: `Jeux de cartes en <span class="accent">30 minutes ou moins</span>`,
  heroSubtitle: `La durée de la boîte n’est qu’une partie du temps réel : neuf jeux rangés en trois créneaux, avec ce qui les allonge ou les raccourcit.`,
  heroImage: "/blog/images/jeux-30-minutes.jpg",
  heroCaption: "Illustration créée pour KYRAN, avec les visuels officiels de Love Letter (© Z-Man Games / Asmodee), Coup (© Ferti Games), Jungle Speed (© Asmodee / Zygomatic), Sushi Go! (© Cocktail Games), KYRAN (© KYRAN), The Mind (© Oya / Nürnberger-Spielkarten-Verlag), No Thanks! (© Gigamic / AMIGO), Skyjo (© Magilano) et Skull (© Asmodee / Space Cowboys) : un grand sablier dont le sable se change en cartes, au-dessus de neuf boîtes de jeux alignées.",
  intro: `<p>Une partie annoncée pour vingt minutes dure rarement exactement vingt minutes : il faut sortir les cartes, expliquer, jouer, puis ranger. Cette sélection part de ce temps réel. Neuf jeux de cartes y sont rangés en <strong>trois créneaux</strong>, selon la durée indiquée sur leur boîte : un quart d’heure, une vingtaine de minutes, une demi-heure pleine. Pour chacun, nous indiquons ce qui allonge ou raccourcit vraiment la partie : le nombre de joueurs, la condition de fin, l’attente entre deux tours. De quoi remplir une pause déjeuner, une soirée de semaine ou un enchaînement de plusieurs jeux courts à la place d’un seul long. Pour jouer dans le train ou à la plage, voyez les <a class="text-link" href="/blog/jeux-vacances-voyage.html">jeux de vacances</a> ; pour un budget précis, nos <a class="text-link" href="/blog/cadeau-anniversaire.html">jeux de cartes triés par prix</a>.</p>`,
  criteria: {
    heading: `Comment mesurer la vraie durée d’un jeu court ?`,
    html: `<p>La durée imprimée sur la boîte désigne la partie, pas la soirée. Pour savoir ce qu’un jeu coûtera en temps, additionnez cinq éléments : l’installation, l’explication, la partie, la revanche éventuelle et le rangement.</p>
<h3>Durée affichée, durée vécue</h3>
<ul>
<li><strong>L’explication.</strong> Elle pèse surtout la première fois. Une règle qui tient en une phrase (Jungle Speed, No Thanks!) coûte peu ; un jeu à pouvoirs ou à plusieurs types de cartes demande davantage, et la première partie se joue avec les règles ouvertes sur la table.</li>
<li><strong>Le nombre de joueurs.</strong> Dans un jeu où l’on joue chacun son tour, chaque personne en plus rallonge la partie (Skyjo, Skull). Dans un jeu où tout le monde reste actif en même temps (Sushi Go!, Jungle Speed), la durée bouge moins.</li>
<li><strong>La condition de fin.</strong> Certains jeux ont une fin garantie, paquet épuisé ou nombre de manches fixé d’avance ; d’autres s’arrêtent à un score à atteindre ou à un échec, et leur durée varie davantage.</li>
<li><strong>L’attente.</strong> Les jeux avec élimination laissent des joueurs inoccupés. Sur quinze minutes, cela passe inaperçu ; sur trente, on commence à s’ennuyer.</li>
</ul>
<h3>Enchaîner plutôt qu’étirer</h3>
<p>Pour une soirée de deux heures, trois jeux de vingt minutes valent mieux qu’un seul long : on change d’ambiance, on laisse arriver les retardataires entre deux parties et celui qui a perdu prend sa revanche rapidement. L’ordre compte : commencez par un jeu où tout le monde reste actif, passez à un jeu de déduction ou de bluff, terminez sur un jeu qui relâche la tension. Fixez aussi une heure de fin à l’avance, car les jeux rapides ont tendance à s’éterniser sous prétexte d’« une dernière ».</p>
<h3>Les pièges de la durée annoncée</h3>
<ul>
<li>La durée correspond à une configuration moyenne : à la borne haute du nombre de joueurs, elle s’allonge toujours.</li>
<li>Un jeu à score cible, comme Skyjo, dépend du nombre de manches jouées avant que quelqu’un atteigne le seuil.</li>
<li>La première partie dure plus que les suivantes ; ne jugez pas un jeu sur sa seule partie d’initiation.</li>
</ul>`
  },
  layout: {
    groups: [
      {
        heading: `Un quart d’heure : quatre jeux pour un créneau serré`,
        html: `<p>Ces quatre jeux sont annoncés entre quinze et vingt minutes selon les fiches (Love Letter à vingt minutes chez Ludum et Esprit Jeu, les autres à quinze). Ce qui les sépare, c’est la façon dont ce quart d’heure résiste au nombre de joueurs et à la première explication : un jeu où tout le monde agit en même temps ne bouge presque pas, un jeu à élimination accélère vers la fin.</p>`,
        ids: [`love-letter`, `coup`, `jungle-speed`, `sushi-go`]
      },
      {
        heading: `Une vingtaine de minutes : un paquet qui borne, un niveau qui tranche`,
        html: `<p>Deux jeux annoncés à une vingtaine de minutes, pour des raisons opposées : la durée de No Thanks! est fixée par son paquet, celle de The Mind par la réussite ou l’échec de l’équipe. Le premier se prévoit presque exactement, le second réserve des surprises dans les deux sens.</p>`,
        ids: [`the-mind`, `no-thanks`]
      },
      {
        heading: `Une demi-heure pleine : trois jeux à réserver`,
        html: `<p>Les trois derniers occupent toute la demi-heure, et parfois davantage. Leur fin dépend d’un seuil de points, de défis réussis ou de vies perdues, jamais d’un nombre de tours fixé à l’avance : on les lance quand le créneau est sûr, pas entre deux rendez-vous.</p>`,
        ids: [`skyjo`, `skull`, `kyran`]
      }
    ]
  },
  headings: {
    compare: `Le chronomètre des neuf jeux`,
    conclusion: `Choisir selon le créneau disponible`,
    faq: `Questions sur la durée des parties`,
    related: `D’autres formats pour les soirées courtes`
  },
  games: [
    {
      id: `love-letter`,
      subtitle: `manches de quelques minutes`,
      type: `Déduction`,
      pick: `Pour deux à quatre joueurs qui veulent jouer entre deux obligations`,
      paragraphs: [
        `Avec un petit paquet, une manche de Love Letter se règle en quelques minutes : chacun n’a qu’une carte en main, on en pioche une, on en joue une, et le paquet fond vite. La partie complète enchaîne plusieurs manches : Ludum et Esprit Jeu l’annoncent à environ vingt minutes pour l’édition actuelle, et le nombre de jetons à atteindre varie avec le nombre de joueurs. C’est le jeu idéal quand on ignore de combien de temps on dispose.`,
        `Cette souplesse est son atout face au chronomètre : on peut s’arrêter après n’importe quelle manche et désigner le vainqueur au nombre de jetons. Sa limite, dans l’édition classique à seize cartes, est le plafond de quatre joueurs (l’édition Z-Man de 2025 monte à six), et la chance de pioche peut décider d’une manche en deux tours, ce qui agace les amateurs de contrôle. L’âge indiqué diffère selon les fiches : dès 8 ans chez Ludum, à partir de 14 ans chez Esprit Jeu (relevé du 12 novembre 2026).`
      ]
    },
    {
      id: `coup`,
      subtitle: `la partie qui s’accélère avec les éliminations`,
      type: `Bluff et élimination`,
      pick: `Pour deux à six joueurs qui acceptent d’être éliminés`,
      paragraphs: [
        `Dans Coup, chaque joueur cache deux cartes de personnages et prétend en posséder les pouvoirs ; si on le met au défi et qu’il a menti, il perd une carte. Les éliminations accélèrent la partie à mesure qu’elle avance : une fois les premiers joueurs tombés, les derniers joueurs s’affrontent avec moins de cartes à bluffer, ce qui explique une durée d’environ quinze minutes.`,
        `Le revers du format court, c’est l’attente. Le premier éliminé doit patienter, et à six joueurs elle se fait sentir. Mieux vaut réserver Coup aux groupes de trois à cinq, ou enchaîner les parties pour que celui qui est tombé en premier rejoue vite.`
      ]
    },
    {
      id: `jungle-speed`,
      subtitle: `aucune attente, aucune lecture`,
      type: `Réflexe`,
      pick: `Pour deux à dix joueurs, quand le temps manque`,
      paragraphs: [
        `Jungle Speed ne laisse personne attendre : chacun révèle ses cartes à tour de rôle et surveille la table, si bien que la durée reste courte (quinze minutes chez Esprit Jeu, moins de vingt chez Ludum pour l’édition Eco), de deux à dix joueurs. La règle de base se transmet en une phrase : même symbole, on attrape le totem.`,
        `Le temps gagné à l’explication se perd parfois à l’arbitrage : qui a saisi le totem en premier ? Les contestations sont courantes, et il vaut mieux convenir d’une règle de départage avant la première carte. Le jeu convient à un groupe sans envie de réfléchir, moins à un joueur qui cherche de la stratégie. L’âge minimum est de sept ans.`
      ]
    },
    {
      id: `sushi-go`,
      subtitle: `une durée connue d’avance`,
      type: `Draft de cartes`,
      pick: `Pour deux à cinq joueurs qui veulent une durée fixe`,
      paragraphs: [
        `Sushi Go! a une durée très prévisible : trois manches, et dans chacune on choisit une carte, on la pose face cachée, puis on transmet sa main au voisin, jusqu’à ce qu’il n’y ait plus de cartes. Tout le monde choisit en même temps, donc le temps par tour ne dépend presque pas du nombre de joueurs. Le jeu est annoncé à environ quinze minutes.`,
        `Le temps se perd à l’explication : il existe plusieurs types de cartes à valoriser (tempura, sashimi, makis, nigiri, wasabi, puddings), et la première partie sert surtout à les comprendre. Les puddings ne comptent qu’en fin de partie, après trois manches, ce qui oblige à les garder de côté d’une manche à l’autre. Comptez sur un carnet ou une carte résumé pour la première fois, et sur un âge minimum de huit ans.`
      ]
    },
    {
      id: `the-mind`,
      subtitle: `un échec raccourcit la soirée`,
      type: `Coopératif silencieux`,
      pick: `Pour deux à quatre joueurs qui veulent un défi bref`,
      paragraphs: [
        `La durée de The Mind est la moins prévisible de la liste : on pose des cartes numérotées de 1 à 100 en ordre croissant, sans parler, et la partie s’arrête à la réussite du dernier niveau ou à l’épuisement des vies. Un mauvais départ la raccourcit, une série réussie l’allonge. Prévoyez environ vingt minutes, avec deux à quatre joueurs.`,
        `Son avantage pour un soir pressé : il n’exige ni installation compliquée ni explication longue, et l’on peut interrompre la partie à la fin de n’importe quel niveau. Son inconvénient, c’est qu’il suppose un groupe calme : au milieu d’une conversation animée, le silence ne tient pas. L’âge recommandé est de huit ans, et le jeu perd son sel si on le joue en dînant.`
      ]
    },
    {
      id: `no-thanks`,
      subtitle: `un paquet de 24 cartes borne la durée`,
      type: `Prise de risque`,
      pick: `Pour trois à sept joueurs, sans préparation ni calcul lourd`,
      paragraphs: [
        `Le matériel de No Thanks! borne la durée : les cartes vont de 3 à 35, neuf sont écartées avant le début, et il en reste donc vingt-quatre à distribuer. Chaque tour tient en une décision, prendre la carte exposée ou payer un jeton pour passer. Une vingtaine de minutes suffisent pour une table de trois à sept joueurs.`,
        `À sept, le jeu reste fluide, puisque chaque décision prend quelques secondes, et le nombre de jetons de départ diminue quand la table grandit, ce qui garde la partie dans les temps. La lenteur éventuelle vient plutôt de ceux qui comptent leurs jetons à voix haute. Pour une soirée en semaine, c’est l’un des jeux les plus simples à lancer, dès huit ans.`
      ]
    },
    {
      id: `skyjo`,
      subtitle: `la durée dépend du seuil`,
      type: `Défausse et score`,
      pick: `Pour jouer jusqu’à huit, en acceptant une durée variable`,
      paragraphs: [
        `Skyjo s’arrête quand un joueur atteint 100 points, et non après un nombre de tours fixe : une manche est brève, mais on en enchaîne plusieurs. Les fiches ne s’accordent pas : « entre 20 et 40 minutes » dans l’en-tête de la fiche Ludum, qui écrit « environ 30 minutes » dans une réponse et « 30 à 40 minutes » dans une autre. La demi-heure vaut pour une table moyenne ; à huit joueurs, comptez davantage.`,
        `Si le temps est compté, deux solutions : convenir d’un seuil plus bas avant de commencer, ou limiter le nombre de manches et départager au score cumulé. La règle se comprend en regardant faire, mais prévoyez de quoi noter les points, car l’addition mentale ralentit le décompte. Skyjo se joue de deux à huit personnes, dès huit ans.`
      ]
    },
    {
      id: `skull`,
      subtitle: `la durée dépend de l’audace`,
      type: `Bluff`,
      pick: `Pour trois à six joueurs avec une demi-heure devant soi`,
      paragraphs: [
        `Skull assume sa demi-heure : la partie s’arrête quand un joueur réussit deux défis, ou quand tous les autres ont perdu toutes leurs cartes. Une table qui surenchérit vite finit tôt ; une table qui temporise la prolonge. Aucun plateau, aucune installation : trois fleurs et un crâne par joueur, de trois à six joueurs.`,
        `Il ne convient aux soirées express que si l’on a déjà joué : la première partie est ralentie par les questions sur l’ordre des enchères et sur les cartes à retourner. À six joueurs, le tour de table s’allonge aussi. Dans l’idéal, fixez avant de commencer l’heure à laquelle vous arrêterez de jouer, et réservez-le aux joueurs de dix ans et plus.`
      ]
    },
    {
      id: `kyran`,
      subtitle: `des manches de plus en plus courtes`,
      type: `Plis et paris`,
      pick: `Pour trois à six joueurs, une vraie partie en une demi-heure`,
      paragraphs: [
        `Dans KYRAN, la partie démarre avec sept cartes en main et diminue manche après manche : sept, six, cinq, quatre, trois, deux, puis la manche Mystique, jouée avec une seule carte posée sur le front. Moins il y a de cartes, plus la manche est courte, et la dernière tient en un seul pli. Ce compte à rebours, KYRAN l’hérite du <a class="text-link" href="/tarot-africain.html">Tarot Africain</a>, qui retire lui aussi une carte à chaque manche jusqu’à la carte unique sur le front.`,
        `Le cycle peut s’interrompre avant la fin : la partie s’arrête dès qu’un joueur a perdu toutes ses cartes Vie, ce qui plafonne la durée sans la rendre certaine. Pour gagner du temps à la première partie, la variante d’initiation, sans Pouvoir ni Mystique, allège l’explication, et la vidéo de cinq minutes sur la <a class="text-link" href="/regle.html">page des règles</a> se regarde avant la soirée. De trois à six joueurs, dès huit ans ; il ne se joue pas à deux.`
      ]
    }
  ],
  extraSections: [
    {
      id: 'durees-annoncees',
      heading: 'Durées annoncées : ce que disent les fiches de boutique',
      html: `<p>Une même boîte n’affiche pas toujours la même durée d’une boutique à l’autre. Nous avons ouvert, le 12 novembre 2026, les fiches de six des neuf jeux chez Ludum, Esprit Jeu et Play-in, et relevé ce qu’elles écrivent, sans les lisser.</p>
<table>
<thead><tr><th>Jeu</th><th>Durée annoncée</th><th>Joueurs</th><th>Âge</th><th>Fiche lue</th></tr></thead>
<tbody>
<tr><td>Love Letter (édition actuelle)</td><td>20 min (Ludum et Esprit Jeu)</td><td>2 à 6</td><td>dès 8 ans (Ludum) ; 14 ans et plus (Esprit Jeu)</td><td><a class="text-link" href="https://www.ludum.fr/jeux-d-ambiance-en-famille/love-letter-298" rel="noopener">Ludum</a>, <a class="text-link" href="https://www.espritjeu.com/jeu-d-ambiance/love-letter.html" rel="noopener">Esprit Jeu</a></td></tr>
<tr><td>Jungle Speed (édition Eco)</td><td>15 min (Esprit Jeu) ; moins de 20 min (Ludum)</td><td>2 à 10</td><td>dès 7 ans</td><td><a class="text-link" href="https://www.ludum.fr/jeux-d-ambiance-en-famille/jungle-speed-eco-1232" rel="noopener">Ludum</a>, <a class="text-link" href="https://www.espritjeu.com/jeux-ambiance/jungle-speed.html" rel="noopener">Esprit Jeu</a></td></tr>
<tr><td>Sushi Go!</td><td>15 min</td><td>2 à 5</td><td>dès 8 ans</td><td><a class="text-link" href="https://www.play-in.com/fr/produit/201609/sushi-go" rel="noopener">Play-in</a></td></tr>
<tr><td>The Mind</td><td>20 min (Esprit Jeu et Ludum, qui précise « 15 à 20 minutes » dans le texte)</td><td>2 à 4</td><td>dès 8 ans</td><td><a class="text-link" href="https://www.ludum.fr/jeux-d-ambiance-en-famille/the-mind-227" rel="noopener">Ludum</a>, <a class="text-link" href="https://www.espritjeu.com/jeux-d-ambiance/the-mind.html" rel="noopener">Esprit Jeu</a></td></tr>
<tr><td>Non merci ! (No Thanks!)</td><td>20 min</td><td>3 à 7</td><td>dès 8 ans</td><td><a class="text-link" href="https://www.ludum.fr/jeux-d-ambiance-en-famille/non-merci-6250" rel="noopener">Ludum</a></td></tr>
<tr><td>Skyjo</td><td>« Entre 20 et 40 min » (en-tête) ; « environ 30 minutes » et « 30 à 40 minutes » (texte)</td><td>2 à 8</td><td>dès 8 ans</td><td><a class="text-link" href="https://www.ludum.fr/jeux-d-ambiance-en-famille/skyjo-1206" rel="noopener">Ludum</a></td></tr>
</tbody>
</table>
<p>Trois enseignements. D’abord, les écarts sont réels : Love Letter a gagné cinq minutes dans les fiches actuelles par rapport à la durée que nous reprenions d’une ancienne fiche, et son âge minimum varie de 8 à 14 ans selon la boutique. Ensuite, deux jeux sur six, Love Letter et Skyjo, donnent une durée de partie complète et non de manche : la fourchette s’explique par le nombre de manches. Enfin, les durées de Sushi Go! et de Non merci ! sont fixées par le matériel (trois manches, un paquet borné), alors que celles de Skyjo ou de The Mind dépendent du déroulement.</p>
<p><strong>Limites.</strong> Coup, Skull et KYRAN ne figurent pas dans ce relevé : nous n’avons pas retrouvé de fiche de boutique lisible pour Coup et Skull ce jour-là, et les caractéristiques de KYRAN sont celles de la règle du jeu. Ces durées sont celles que les vendeurs affichent, pas des parties chronométrées. En cas de doute, la boîte et la règle de l’éditeur font foi.</p>`
    }
  ],
  verdict: {
    heading: `Le jeu court à garder sous la main`,
    html: `<p>Si vous ne deviez en retenir qu’un : No Thanks!. Son paquet de vingt-quatre cartes borne la durée, sa règle tient en deux phrases et il accueille de trois à sept joueurs sans ralentir de façon notable. Dans le créneau du quart d’heure, Love Letter est plus court encore à deux ou trois, et Jungle Speed tient une table de dix. Dans celui de la demi-heure, méfiez-vous de Skull et de Skyjo quand l’heure de fin est ferme : ce sont eux dont la durée varie le plus selon la table. KYRAN convient quand on veut une vraie partie avec un pari à chaque manche, à condition de réserver trente minutes pleines.</p>`
  },
  conclusion: `<p>Mesurez votre créneau avant de choisir : un quart d’heure autorise un jeu où tout le monde reste actif ou à manches courtes, vingt minutes un jeu dont le paquet fixe la fin, une demi-heure un jeu de score, de bluff ou de plis. Gardez sous la main deux jeux de créneaux différents pour ajuster la soirée selon l’humeur et le nombre de présents. Avant d’inviter, vérifiez dans le tableau la borne haute de joueurs : c’est elle qui décide si le créneau prévu tiendra.</p>`,
  faq: [
    {
      q: `Quel jeu de cartes se joue en 15 minutes ?`,
      a: `Selon les fiches de boutique relevées le 12 novembre 2026, Jungle Speed (Esprit Jeu) et Sushi Go! (Play-in) sont annoncés à quinze minutes ; Love Letter passe à vingt minutes chez Ludum et Esprit Jeu, et Coup, non recontrôlé cette fois, était annoncé autour de quinze minutes dans la version précédente de cet article. Ils se jouent de deux à cinq ou dix joueurs selon le titre ; vérifiez donc la borne haute avant d’inviter plus de quatre personnes.`
    },
    {
      q: `Pourquoi une partie dure-t-elle plus longtemps que la durée indiquée sur la boîte ?`,
      a: `Parce que la durée affichée compte la partie seule, sans l’explication ni l’installation. Elle correspond aussi à un nombre moyen de joueurs : à la borne haute, elle s’allonge. La première partie est en outre plus lente, le temps de consulter les règles.`
    },
    {
      q: `Quel jeu rapide choisir pour jouer à deux ?`,
      a: `Love Letter, Coup, Sushi Go!, The Mind (deux à quatre joueurs), Skyjo et Jungle Speed se jouent à deux. No Thanks!, Skull et KYRAN exigent au moins trois joueurs. Pour d’autres duels, la page des <a class="text-link" href="/blog/jeux-duo-couples.html">jeux pour couples</a> propose des idées.`
    },
    {
      q: `Quel jeu de moins de 30 minutes pour une grande tablée ?`,
      a: `Jungle Speed accueille jusqu’à dix joueurs et dure environ un quart d’heure ; Skyjo monte à huit, mais sa durée augmente avec la table. Au-delà de dix personnes, scindez le groupe en deux parties parallèles plutôt que d’étirer une seule partie.`
    },
    {
      q: `Comment enchaîner plusieurs jeux courts sur une soirée ?`,
      a: `Commencez par un jeu actif et facile, comme Jungle Speed ou Sushi Go!, continuez avec un jeu de déduction ou de bluff, puis finissez sur un jeu plus calme. Fixez l’heure de fin à l’avance pour que le dernier jeu ne devienne pas une troisième partie.`
    }
  ],
  related: [`jeux-vacances-voyage`, `jeux-soiree-amis`, `meilleurs-jeux-apero`]
};
