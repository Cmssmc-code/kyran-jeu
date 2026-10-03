export default {
  slug: 'jeux-soiree-amis',
  title: 'Jeux entre amis : 10 jeux de cartes et d’ambiance pour votre soirée',
  shortTitle: 'Jeux entre amis',
  metaTitle: 'Jeux entre amis : 10 jeux selon votre groupe (2026)',
  description: 'Quel jeu choisir pour une soirée entre amis ? 10 jeux classés selon le groupe (calme, bruyant, compétitif, mixte) et la durée, avec leurs défauts.',
  category: 'Soirée',
  date: '2026-05-05',
  heroTitle: 'Jeux <span class="accent">entre amis</span>',
  heroSubtitle: 'Dix jeux triés par type de groupe et par durée de soirée, avec le point faible de chacun.',
  heroImage: '/blog/images/codenames.jpg',
  heroCaption: 'Codenames — déduction et fous rires en équipe.',
  intro: `<p>Pour choisir un jeu de soirée entre amis, trois réponses couvrent l’essentiel. <strong>Un groupe mixte de quatre à huit, avec des habitués et des occasionnels :</strong> Codenames ou Just One, qui pardonnent l’approximation. <strong>Un groupe qui aime bluffer et se chambrer :</strong> Skull ou Coup, deux jeux de mensonge qui se règlent en une demi-heure ou moins. <strong>Une petite tablée de trois à six qui veut une vraie partie à enjeu :</strong> KYRAN et ses paris de plis. Le reste dépend du bruit que vos invités supportent, de la place sur la table et de l’heure de fin de soirée, ce que détaillent les critères ci-dessous. Pour un format plus léger, voyez les <a class="text-link" href="/blog/meilleurs-jeux-apero.html">jeux de cartes d’apéro</a> ; au-delà de huit invités, la sélection <a class="text-link" href="/blog/jeux-grands-groupes.html">grands groupes</a> prend le relais.</p>`,
  criteria: {
    heading: 'Comment choisir un jeu selon le groupe et la durée de la soirée ?',
    html: `<p>La bonne question n’est pas « quel est le meilleur jeu ? » mais « qui est autour de la table, et qu’est-ce qu’il supporte ? ». Un jeu de bluff sauve une soirée avec des amis qui se chambrent depuis dix ans, et la ruine avec des invités qui détestent mentir. Quatre profils de groupe reviennent presque toujours, et chacun appelle une famille de jeux d’ambiance différente.</p>
<h3>Quatre groupes, quatre familles de jeux</h3>
<ul>
<li><strong>Le groupe calme</strong>, qui veut continuer à discuter pendant la partie : les jeux d’expression et d’imagination (Just One, Dixit) tolèrent les digressions, alors qu’un jeu de réflexe les interdit.</li>
<li><strong>Le groupe bruyant</strong> : Dobble, Skull et Coup absorbent l’énergie. Évitez tout ce qui réclame trente secondes de silence pour calculer.</li>
<li><strong>Le groupe compétitif</strong> : KYRAN, Coup ou Saboteur désignent un vainqueur sans ambiguïté, ce qu’un jeu coopératif ne fait pas. Certains veulent gagner contre quelqu’un, pas contre le paquet.</li>
<li><strong>Le groupe mixte</strong>, avec un passionné et deux joueurs occasionnels : choisissez un jeu où l’on peut se tromper sans conséquence, comme Codenames ou Just One, plutôt qu’un jeu où l’expérience écrase tout.</li>
</ul>
<h3>Régler la durée sur la soirée</h3>
<p>Une soirée de trois heures s’organise mieux autour de trois jeux que d’un seul : un échauffement d’un quart d’heure pendant que le groupe s’installe (Dobble, Coup), un jeu principal de trente à quarante minutes (Skull, KYRAN, Saboteur, Colt Express), puis un dernier jeu choisi par les invités, souvent une revanche. Dix minutes de règles sur un jeu de quarante minutes, c’est déjà un quart de la partie : si personne ne le connaît, prenez un jeu qui s’explique en trois minutes.</p>
<p>Trois pièges méritent d’être connus avant l’achat. L’élimination, d’abord : dans Bang!, un joueur sorti tôt regarde les autres jusqu’à la fin de la partie, alors que Coup limite la casse en tenant en un quart d’heure. Le vocabulaire, ensuite : Codenames et Just One reposent sur la langue et la culture communes, et pénalisent un ami dont le français n’est pas la langue maternelle. La plage annoncée, enfin : la boîte indique ce qui est jouable, pas ce qui est agréable ; Saboteur démarre à trois joueurs mais ne devient vraiment intéressant qu’à cinq ou six.</p>`
  },
  games: [
    {
      id: 'codenames',
      subtitle: 'le plus sûr pour un groupe mixte',
      type: 'Déduction par équipes',
      pick: 'Groupes mixtes de 4 à 8, des habitués aux novices',
      paragraphs: [
        `La grille de vingt-cinq mots se partage entre deux équipes, et un espion par camp souffle un indice d’un seul mot suivi d’un chiffre. Dans un groupe mixte, le rôle de devineur convient à un novice dès la première partie pendant qu’un habitué endosse celui d’espion : la table se coupe en deux équipes qui débattent, et l’ambiance se fabrique sans animateur.`,
        `Il y a un revers. À huit, les deux espions parlent à peine tandis que les six autres discutent, et un devineur effacé finit par approuver sans rien proposer. Les indices s’appuient aussi sur la culture commune, ce qui avantage les amis de longue date. Comptez un quart d’heure par manche : la revanche s’enchaîne sans étirer la soirée.`
      ]
    },
    {
      id: 'just-one',
      subtitle: 'quand personne ne doit perdre la face',
      type: 'Coopératif',
      pick: 'Groupes calmes, tablées mêlant novices et joueurs avertis',
      paragraphs: [
        `Un joueur cherche un mot mystère, les autres écrivent chacun un indice sur un chevalet, et les indices identiques sont retirés avant la lecture. Pour une soirée, tout l’intérêt vient de cette règle : plus les amis pensent de la même façon, plus ils s’annulent, et le fou rire naît quand trois personnes ont écrit exactement le mot évident.`,
        `Le jeu est coopératif, le groupe marque ensemble et aucun perdant n’est désigné, ce qui rassure les invités qui détestent être éliminés ou chronométrés. Les limites sont nettes : il faut au moins trois joueurs, la boîte plafonne à sept, et un joueur qui veut gagner contre quelqu’un restera sur sa faim. Une partie dure environ vingt minutes.`
      ]
    },
    {
      id: 'dixit',
      subtitle: 'pour la table qui aime raconter',
      type: 'Imagination',
      pick: 'Tablées de 3 à 6 qui préfèrent raconter plutôt que bluffer',
      paragraphs: [
        `Le conteur choisit une illustration dans sa main et la décrit par une phrase, un titre ou un bruitage ; les autres jouent la carte de leur main qui s’en rapproche le plus, puis tout le monde cherche l’originale. Le conteur ne marque que s’il n’est ni trop obscur ni trop évident, ce qui pousse chacun à dévoiler une association personnelle. C’est le jeu de la soirée tranquille, autour d’une table basse et d’un digestif.`,
        `Il respire mieux à partir de quatre ou cinq joueurs, quand le vote offre assez de leurres. Les illustrations et le plateau de score expliquent en partie son prix, environ 30 euros, le plus élevé de cette liste avec Colt Express. Dans un groupe bruyant ou compétitif, il tombe à plat : on y vient pour la conversation, pas pour le duel.`
      ]
    },
    {
      id: 'dobble',
      subtitle: 'pour échauffer une tablée bruyante',
      type: 'Réflexe',
      pick: 'Groupes bruyants, ouverture de soirée, mélange d’âges',
      paragraphs: [
        `Dobble sert d’ouverture : deux cartes quelconques de la boîte ne partagent jamais qu’un seul symbole, et il faut le nommer le premier. Une partie dure quelques minutes, chacun joue dès la règle lue, et un retardataire s’assoit au tour suivant sans rien avoir manqué. C’est la bonne pioche avant le jeu principal, tant que les invités arrivent encore.`,
        `Sa limite se lit en fin de soirée : sans stratégie ni bluff, on n’y joue pas une heure. Il avantage les yeux rapides plus que les amateurs de jeux de société, et la pression du temps peut agacer les joueurs posés. La boîte plafonne à huit joueurs, et à cette taille la table devient très sonore : prévenez les voisins.`
      ]
    },
    {
      id: 'skull',
      subtitle: 'le bluff dépouillé, à partir de quatre',
      type: 'Bluff',
      pick: 'Groupes qui aiment bluffer et se regarder dans les yeux',
      paragraphs: [
        `Chacun possède trois fleurs et un crâne, en pose un devant soi face cachée, puis les enchères montent sur le nombre de cartes qu’on se risque à retourner. Tout se joue dans le regard : l’ami qui hésite avant de poser, l’autre qui surenchérit trop vite. Une manche se règle en quelques minutes, et la partie se gagne en réussissant deux défis.`,
        `Skull prend son sel à partir de quatre joueurs ; à trois, les bluffs se lisent trop facilement. Défaut à connaître : un joueur qui perd toutes ses cartes sort de la partie, ce qui peut durer pour le premier éliminé à six. Comptez environ trente minutes, sur une table assez dégagée pour que chaque pile reste lisible.`
      ]
    },
    {
      id: 'coup',
      subtitle: 'quinze minutes d’accusations',
      type: 'Bluff express',
      pick: 'Bluffeurs de 4 à 6 qui veulent une partie courte',
      paragraphs: [
        `Chaque joueur détient deux cartes d’influence cachées (duc, assassin, capitaine, ambassadeur, comtesse) et annonce l’action de son personnage, vraie ou fausse : tant que personne ne conteste, elle passe. Le système fabrique des accusations en rafale, et la table se met à surveiller celui qui a pris l’air trop sûr de lui. La partie tient en un quart d’heure environ.`,
        `Le premier joueur qui perd ses deux cartes regarde la fin de la partie : quelques minutes à quatre, un peu plus à six. En contrepartie, une partie perdue se relance aussitôt. Pour quatre à six amis qui aiment accuser, c’est un meilleur compromis que Bang!, qui réclame plus de règles et plus de temps.`
      ]
    },
    {
      id: 'saboteur',
      subtitle: 'rôles cachés, de 5 à 10',
      type: 'Déduction sociale',
      pick: 'Tablées de 5 à 10 qui acceptent de se soupçonner',
      paragraphs: [
        `Saboteur répartit en secret des nains chercheurs d’or et des saboteurs ; tout le monde pose des cartes de chemin vers le trésor, mais les saboteurs bouchent les couloirs. La table se met à interpréter chaque geste : pourquoi cette impasse, pourquoi ce chariot cassé chez lui plutôt que chez un autre ? Ce qui amuse n’est pas le tunnel, ce sont les procès d’intention.`,
        `Les rôles cachés ne prennent leur intérêt qu’à partir de cinq joueurs ; à trois ou quatre, le saboteur est vite démasqué. Le jeu exige aussi de la place pour étaler le chemin, donc une vraie table plutôt qu’un salon bas. Une partie compte trois manches et dure environ trente minutes.`
      ]
    },
    {
      id: 'bang',
      subtitle: 'western et rôles secrets',
      type: 'Western, rôles secrets',
      pick: 'Groupes de 5 à 7 qui connaissent déjà le jeu ou apprennent vite',
      paragraphs: [
        `Shérif, adjoints, hors-la-loi et renégat : les rôles secrets décident qui doit éliminer qui, et chaque personnage a un pouvoir propre. À cinq ou six, la partie bascule vite et les alliances se renversent avant la fin. On vient chercher l’ambiance film de cow-boys, pas une confrontation propre et sage.`,
        `Il demande de l’aplomb. La première partie impose de lire beaucoup d’effets de cartes, et les joueurs éliminés attendent la fin. Le jeu commence à quatre, mais les rôles ne produisent leur effet qu’à cinq ou six. À réserver à une soirée où un ami connaît déjà le jeu et peut l’expliquer en dix minutes, plutôt qu’en lisant la notice devant les invités.`
      ]
    },
    {
      id: 'colt-express',
      subtitle: 'braquage de train et programmation',
      type: 'Programmation',
      pick: 'Groupes qui acceptent un jeu à installer et quarante minutes de rires',
      paragraphs: [
        `Chacun programme à l’avance des actions (se déplacer, tirer, frapper, voler) qui s’exécutent dans l’ordre, mêlées à celles des autres : le plan s’effondre dès qu’un voisin a joué avant. C’est l’effet comique recherché, voir son bandit se retrouver sur le toit alors qu’on visait l’intérieur du wagon, et ce rire se partage avec toute la table.`,
        `Le train en carton occupe de la place et demande quelques minutes de montage : à oublier sur un salon encombré de verres. La partie dure environ quarante minutes, le format le plus long de la liste, et le prix avoisine 30 euros. À prévoir pour une soirée où le groupe a décidé d’y jouer, pas pour un jeu improvisé.`
      ]
    },
    {
      id: 'kyran',
      subtitle: 'plis et paris pour 3 à 6',
      type: 'Plis et paris',
      pick: 'Tablées de 3 à 6 qui aiment parier et se chambrer',
      paragraphs: [
        `Avant chaque manche, chacun annonce à voix haute le nombre exact de plis qu’il va gagner, et la somme des paris n’a pas le droit d’égaler le nombre de plis : le dernier à parler ne peut pas boucler le compte. Pour une soirée entre amis, cela donne au moins un pari raté à chaque manche, payé en cartes Vie, donc des commentaires et des revanches réclamées.`,
        `La partie dure environ trente minutes. Les cartes Pouvoir et la manche Mystique, où l’on voit les cartes des autres mais pas la sienne, font monter le bruit au bout de chaque cycle. KYRAN ne se joue pas à deux et ne convient pas à une soirée de dix personnes. Pour l’apprendre avant les invités, la <a class="text-link" href="/regle.html">vidéo de règles</a> dure cinq minutes et l’<a class="text-link" href="/minijeu.html">Initiation gratuite</a> permet de s’entraîner seul.`,
        `Il s’agit d’un jeu de plis, donc un peu plus structuré que Codenames ou Dobble : prévoyez une première manche d’essai. Il descend du <a class="text-link" href="/tarot-africain.html">Tarot Africain</a>, ce qui parle aux amis qui ont déjà joué aux plis, et il coûte 9,99 € sur la <a class="text-link" href="/commander.html">boutique KYRAN</a>.`
      ]
    }
  ],
  verdict: {
    heading: 'Notre avis tranché',
    html: `<p>Si vous ne deviez garder qu’un jeu pour toutes vos soirées, ce serait Codenames : il passe de quatre à huit joueurs, accepte les novices et n’élimine personne. Pour des bluffeurs, Skull gagne à six et Coup à quatre. Pour une tablée de trois à six qui veut une vraie partie, KYRAN apporte davantage de calcul que la moyenne de cette liste, avec le pari obligatoire comme moteur. À éviter en première soirée : Bang! avec des invités qui découvrent, et Colt Express si la table est petite ou déjà couverte de verres. Gardez Dobble pour l’échauffement ; seul, il ne tient pas une soirée.</p>`
  },
  extraSections: [
    {
      heading: 'Trois programmes de soirée prêts à l’emploi',
      html: `<p>Pour ne rien improviser, voici trois enchaînements construits avec les jeux de la liste.</p>
<ul>
<li><strong>Deux heures, quatre à six amis :</strong> Dobble pour démarrer, Skull ou KYRAN comme jeu principal, puis une revanche de Coup.</li>
<li><strong>Soirée longue, six à huit amis :</strong> Just One pendant l’arrivée du dernier invité, Codenames en deux manches, Saboteur pour finir quand les esprits sont échauffés.</li>
<li><strong>Soirée calme, digestif et conversation :</strong> Dixit, puis Just One, sans chronomètre ni élimination.</li>
</ul>
<p>Rien n’oblige à tout jouer. Si la conversation prend, rangez les boîtes : un jeu qui a servi de prétexte a rempli son rôle.</p>`
    }
  ],
  conclusion: `<p>Choisissez d’après les gens, pas d’après la boîte : dans le doute, partez du jeu le plus tolérant et laissez le groupe réclamer plus de bluff ou plus de paris. Pour recevoir en plus petit comité, la page sur les <a class="text-link" href="/blog/meilleurs-jeux-apero.html">jeux d’apéro</a> propose des formats plus courts, et pour une équipe qui se connaît peu, la sélection <a class="text-link" href="/blog/jeux-brise-glace-afterwork.html">brise-glace</a> écarte les jeux trop exposants.</p>`,
  faq: [
    {
      q: 'Quel jeu choisir pour une soirée entre amis à quatre ?',
      a: 'À quatre, Skull, Coup, KYRAN et Codenames en deux équipes de deux fonctionnent bien. Just One marche aussi, mais avec trois rédacteurs d’indices les doublons s’annulent moins souvent. Évitez Bang!, dont les rôles ne produisent vraiment leur effet qu’à partir de cinq ou six joueurs.'
    },
    {
      q: 'Quels jeux entre amis s’expliquent en trois minutes ?',
      a: 'Dobble, Just One et Coup s’expliquent en quelques minutes, parfois en jouant une manche à blanc. Codenames demande un peu plus de temps pour le rôle d’espion. Les jeux de rôles cachés comme Bang! et les jeux de programmation comme Colt Express réclament nettement plus.'
    },
    {
      q: 'Quel jeu pour des amis qui n’aiment pas les jeux de société ?',
      a: 'Choisissez un jeu où l’on participe sans rien connaître : Just One, Dobble ou Codenames. Ils n’exigent ni stratégie ni lecture de règles longue, et personne n’y est éliminé. Évitez les jeux à rôles secrets ou à gros livret, qui donnent l’impression d’un examen.'
    },
    {
      q: 'Combien de jeux prévoir pour une soirée entre amis ?',
      a: 'Prévoyez trois jeux pour environ trois heures : un échauffement court, un jeu principal de trente à quarante minutes, et un jeu laissé au choix du groupe. Sortez-en un quatrième seulement si la discussion s’éteint ; sinon, rangez les boîtes sans regret.'
    },
    {
      q: 'Quel jeu entre amis quand on est plus de huit ?',
      a: 'Au-delà de huit, préférez les jeux simultanés ou par équipes : Codenames en grandes équipes, Jungle Speed, 6 qui prend ! ou Saboteur jusqu’à dix. KYRAN s’arrête à six joueurs. La page <a class="text-link" href="/blog/jeux-grands-groupes.html">jeux pour grands groupes</a> donne le plafond de chaque titre.'
    },
    {
      q: 'Quel est le meilleur jeu d’ambiance pour une soirée entre adultes ?',
      a: 'Codenames reste le choix le plus fiable pour quatre à huit adultes, parce qu’il mêle rires et réflexion sans élimination. Pour un groupe plus porté sur le bluff, Skull et Coup donnent l’ambiance la plus vive. Aucun n’exige d’avoir joué auparavant.'
    }
  ],
  related: ['jeux-grands-groupes', 'jeux-bluff-pari', 'jeux-debutants-adultes']
};
