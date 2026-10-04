export default {
  slug: 'jeux-sans-elimination',
  title: 'Jeux de cartes sans élimination : 5 jeux où personne ne quitte la table',
  shortTitle: 'Jeux sans élimination',
  metaTitle: 'Jeux sans élimination : 5 jeux de cartes où tout le monde joue',
  description: 'Sushi Go!, Timeline, Hanabi, No Thanks!, Skyjo : cinq jeux de cartes où personne ne sort, la règle de fin de chacun, et un contre-exemple expliqué.',
  category: 'Famille',
  date: '2026-06-14',
  heroTitle: 'Jeux <span class="accent">sans élimination</span>',
  heroSubtitle: 'Cinq jeux où chacun garde ses cartes en main jusqu’au dernier tour, et un contre-exemple présenté franchement.',
  heroImage: '/blog/images/skyjo.jpg',
  heroCaption: 'Skyjo, un exemple populaire sans sortie précoce.',
  layout: {
    criteriaAfter: true,
    criteriaShort: 'Vérifier',
    compare: { position: 'after' },
    numbered: false
  },
  headings: {
    selection: 'Cinq jeux qui gardent toute la table, et un contre-exemple',
    compare: 'Durée, âge et effectif des six jeux',
    conclusion: 'Annoncer la fin avant la première donne',
    faq: 'Élimination, attente, retard : les cas concrets',
    related: 'D’autres façons de garder tout le monde à table'
  },
  intro: `<p>On cherche un jeu « sans élimination » pour une raison précise : éviter qu’un joueur passe la fin de soirée à regarder les autres. L’étiquette est pourtant trompeuse. Certains jeux font sortir un joueur pour de bon, d’autres le gardent en jeu sans le moindre espoir de victoire, d’autres encore arrêtent tout au moment exact où quelqu’un tombe. Cette page commence par ce que l’on vient chercher : cinq jeux de cartes où personne ne quitte la table, avec pour chacun la règle qui met fin à la partie. Elle ajoute un contre-exemple, KYRAN, notre propre jeu, pour montrer où passe la frontière. La méthode pour vérifier n’importe quelle boîte vient ensuite. Les jeux où l’on gagne ou perd en équipe ont leur page dédiée : nos <a class="text-link" href="/blog/jeux-coop-cartes.html">jeux de cartes coopératifs</a>.</p>`,
  criteria: {
    heading: 'Comment vérifier qu’un jeu ne laisse personne sur la touche',
    html: `<p>Les cinq jeux retenus ne l’ont pas été sur la foi d’une étiquette. Pour juger un autre titre de la même façon, ou trancher entre ceux de cette page, voici la grille qui a servi.</p>
<h3>Quatre situations à ne pas confondre</h3>
<ul>
<li><strong>Sortie définitive</strong> : le joueur quitte la partie et attend la fin, comme à Coup ou à Bang!. Ces titres figurent dans notre sélection de <a class="text-link" href="/blog/jeux-bluff-pari.html">jeux de bluff et de rôles cachés</a> ; ils n’ont pas leur place ici.</li>
<li><strong>Sortie qui clôt la partie</strong> : un joueur est éliminé, et la partie s’arrête avec lui. Personne n’attend, mais la soirée se termine bel et bien sur un éliminé. C’est le cas de KYRAN, notre contre-exemple. La frontière avec Skyjo paraît mince, puisque là aussi un joueur déclenche la fin ; la différence tient au vécu, perdre sa dernière vie n’ayant pas le même goût que franchir un seuil de points.</li>
<li><strong>Arrêt sur un seuil</strong> : personne ne sort, et un événement commun déclenche la fin : 100 points à Skyjo, pioche vide à No Thanks!, troisième erreur à Hanabi.</li>
<li><strong>Durée fixe</strong> : la partie compte un nombre de manches ou de tours connu d’avance, comme les trois manches de Sushi Go! ou le tour complet de Timeline.</li>
</ul>
<h3>Les questions à poser devant la boîte</h3>
<p>Comment la partie se termine-t-elle, et chacun le sait-il dès le départ ? Les tours sont-ils simultanés, comme dans un jeu de draft, ou faut-il attendre son tour, auquel cas une table de six ralentit tout le monde ? Un joueur loin derrière peut-il encore rattraper son retard ou gêner les meneurs ? Enfin, que devient celui qui n’a plus de ressources : est-il exclu, comme à Coup, ou seulement contraint, comme à No Thanks! ?</p>
<h3>L’élimination qui ne dit pas son nom</h3>
<p>Un jeu peut n’exclure personne et produire le même effet. Quand l’écart de score devient impossible à combler, le dernier continue à jouer pour la forme. Trois parades existent : préférer une durée fixe à un seuil, choisir un jeu où un bonus final rebat les cartes, comme les desserts de Sushi Go!, ou passer à la coopération, où l’équipe gagne ou perd d’un bloc. Ces réglages pèsent plus encore à une table où se mêlent les générations, sujet de notre guide des <a class="text-link" href="/blog/jeux-famille.html">jeux de société en famille</a>.</p>`
  },
  games: [
    {
      id: 'sushi-go',
      type: 'Draft simultané',
      pick: 'Pour une table où personne ne veut attendre son tour',
      paragraphs: [
        `Sushi Go! supprime l’attente à la racine : tout le monde choisit en même temps une carte dans sa main, la pose face cachée, puis passe le reste à son voisin. Il n’existe donc aucun tour adverse à regarder, et aucun moyen de sortir de la partie. Les trois manches se jouent jusqu’à la dernière carte pour chacun, et le décompte des desserts n’intervient qu’à la toute fin.`,
        `Pour le joueur distancé, ces desserts sont une vraie bouée : celui qui en garde le plus marque un bonus, celui qui en a le moins subit une pénalité, et l’écart se resserre au dernier moment. Le défaut est ailleurs : un débutant ne voit pas ce que collectionnent ses voisins et laisse passer les bonnes cartes. Jouable de deux à cinq, en un quart d’heure environ, dès 8 ans.`
      ]
    },
    {
      id: 'timeline',
      type: 'Fin au tour complet',
      pick: 'Pour finir à égalité de tours, même après une mauvaise passe',
      paragraphs: [
        `Timeline aurait pu s’arrêter dès qu’un joueur pose sa dernière carte ; sa règle préfère achever le tour de table, pour que chacun ait joué autant de fois que le premier. Une date mal placée ne fait sortir personne non plus : la carte est défaussée, le joueur en reçoit une autre et reste dans la course, simplement un peu plus loin du but.`,
        `La limite tient à une forme d’impuissance : celui qui accumule les erreurs garde une main aussi garnie qu’au départ, sans rien perdre, mais sans approcher de la victoire. À cinq joueurs ou plus, les tours s’enchaînent assez vite pour que ce sentiment ne s’installe pas. Le jeu accepte de deux à huit joueurs, pour environ un quart d’heure, dès 8 ans.`
      ]
    },
    {
      id: 'hanabi',
      type: 'Coopératif',
      pick: 'Pour gagner ou perdre ensemble, sans perdant désigné',
      paragraphs: [
        `Hanabi règle la question par la coopération : il n’y a qu’un score, celui de l’équipe, donc personne à éliminer. Chaque joueur agit à chaque tour, qu’il donne un indice, défausse ou pose une carte, jusqu’à une fin commune : pioche épuisée, feu d’artifice complet ou troisième erreur de pose. Même un débutant reste un rouage indispensable du groupe du début à la fin.`,
        `Le risque change de nature : à la place de l’exclusion, la culpabilité. Celui qui commet deux erreurs coup sur coup peut précipiter l’échec de toute la table, et le ressentir vivement. Convenez avant de jouer qu’une erreur appartient au groupe. Comptez environ 25 minutes, de deux à cinq joueurs, dès 8 ans, pour une partie où le seul adversaire est le paquet.`
      ]
    },
    {
      id: 'no-thanks',
      type: 'Prendre ou payer',
      pick: 'Pour une décision nette à chaque tour, même sans un jeton',
      paragraphs: [
        `No Thanks! montre qu’on peut manquer de ressources sans être éliminé. À chaque tour, on paie un jeton pour refuser la carte retournée, ou on la prend avec les jetons accumulés dessus. Le joueur à court de jetons n’est pas exclu : il est seulement contraint de prendre la carte, ce qui le pénalise mais lui rapporte les jetons laissés par les autres.`,
        `La partie s’achève quand la pioche est vide, un événement que toute la table voit approcher. De trois à sept joueurs, environ vingt minutes, dès 8 ans. Le point faible apparaît à trois : les refus en série deviennent mécaniques, et le jeu ne gagne en tension qu’avec davantage de monde, quand plusieurs joueurs convoitent les mêmes suites de nombres.`
      ]
    },
    {
      id: 'skyjo',
      type: 'Score cumulé',
      pick: 'Pour une famille qui accepte un écart de points affiché',
      paragraphs: [
        `Skyjo garde tout le monde en jeu jusqu’au bout : chaque manche se joue en entier, et la partie ne s’arrête qu’au moment où un joueur atteint 100 points cumulés, le plus petit total l’emportant. Quand quelqu’un retourne sa douzième carte, les autres disposent encore d’un tour pour améliorer leur grille. Personne ne quitte la table, y compris celui qui collectionne les grosses valeurs.`,
        `Le défaut, pour l’angle de cette page, s’appelle l’élimination de fait. Avec soixante points de retard, le dernier sait que la partie est perdue bien avant qu’elle s’arrête. Deux réglages l’évitent : fixer un nombre de manches, ou abaisser le seuil de fin. Si la mécanique vous plaît, notre page sur les <a class="text-link" href="/blog/jeux-comme-skyjo.html">jeux comme Skyjo</a> recense des voisins directs.`
      ]
    },
    {
      id: 'kyran',
      type: 'Jeu à vies',
      pick: 'Contre-exemple : un jeu à vies qui supprime seulement l’attente',
      paragraphs: [
        `KYRAN figure ici comme contre-exemple, et il faut le dire franchement : c’est un jeu à vies, où chaque pari raté coûte des cartes Vie, et le joueur qui perd la dernière est bel et bien éliminé. Sa règle supprime seulement l’attente qui suit d’habitude : la partie s’arrête à cet instant pour toute la table, et celui qui garde le plus de vies l’emporte.`,
        `Ce mécanisme a un coût qu’aucune règle ne gomme. La partie se conclut sur la chute d’un joueur, désigné comme celui qui a lâché le premier, et elle peut priver de revanche un voisin qui comptait se refaire à la manche suivante. Une table qui redoute ce moment fera mieux de choisir l’un des cinq jeux précédents.`,
        `Pour une table que cela ne gêne pas, la partie dure environ 30 minutes, de 3 à 6 joueurs, dès 8 ans : des manches de 7 à 2 cartes, puis la manche Mystique, jouée avec une carte posée sur le front. Les <a class="text-link" href="/regle.html">règles de KYRAN</a> détaillent le décompte des vies.`
      ]
    }
  ],
  verdict: {
    heading: 'Le choix le plus sûr pour ne perdre personne',
    html: `<p>Le choix le plus sûr est Sushi Go! : tout le monde joue en même temps, la partie compte trois manches fixes et les desserts redonnent une chance au dernier jusqu’au décompte final. Timeline suit de près pour les grandes tablées, grâce à son tour complet. Hanabi convient aux groupes qui ne veulent désigner aucun perdant, Skyjo et No Thanks! aux familles qui acceptent un score affiché.</p><p>Écartez KYRAN si l’objectif est que personne ne tombe : c’est un jeu de plis à vies, où la partie s’achève justement sur un joueur éliminé.</p>`
  },
  conclusion: `<p>Une règle de fin annoncée à voix haute vaut toutes les étiquettes : « on joue trois manches », « on s’arrête à 60 points », « la pioche vide clôt la partie ». Un joueur en retard accepte bien mieux sa position quand il sait combien de temps elle va durer. Et si quelqu’un décroche malgré tout, regardez le nombre de joueurs avant d’accuser le jeu : une table trop chargée allonge l’attente entre deux tours.</p>`,
  faq: [
    {
      q: 'Quel jeu de cartes choisir pour que personne ne soit éliminé ?',
      a: 'Sushi Go! et Timeline sont les plus sûrs : chacun joue le même nombre de tours et la fin est connue d’avance. Hanabi supprime aussi tout perdant individuel. Skyjo et No Thanks! gardent tout le monde en jeu, avec un score qui peut décourager le dernier.'
    },
    {
      q: 'Un jeu coopératif peut-il éliminer un joueur ?',
      a: 'Dans un coopératif, l’équipe gagne ou perd d’un bloc, donc personne ne sort seul : à Hanabi, la troisième erreur arrête la partie pour toute la table. Le risque se déplace vers le reproche adressé à celui qui a commis l’erreur décisive, qu’il vaut mieux désamorcer avant de commencer.'
    },
    {
      q: 'Que faire quand un joueur de Skyjo a trop de retard ?',
      a: 'Fixer dès le départ un nombre de manches, ou abaisser le seuil de fin, garde l’espoir intact. La règle officielle reste à 100 points, mais ces aménagements se décident avant la première donne et évitent qu’un joueur continue sans perspective.'
    },
    {
      q: 'Pourquoi KYRAN figure-t-il ici comme contre-exemple ?',
      a: 'Parce qu’un joueur y perd toutes ses cartes Vie et se retrouve éliminé. La partie s’arrête aussitôt et celui qui garde le plus de vies gagne, donc personne n’attend ; mais la fin tombe toujours sur un joueur désigné, ce qu’une table sensible vivra mal.'
    },
    {
      q: 'Quels jeux sans élimination pour des enfants de 8 ans ?',
      a: 'Sushi Go!, Timeline, Skyjo, No Thanks! et Hanabi sont tous indiqués à partir de 8 ans. Pour un enfant qui supporte mal la défaite, Hanabi a l’avantage de faire gagner ou perdre toute la table ensemble, adultes compris.'
    }
  ],
  related: ['jeux-famille', 'jeux-coop-cartes', 'jeux-comme-skyjo']
};
