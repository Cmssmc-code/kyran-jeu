export default {
  slug: `jeux-cartes-ados`,
  title: `Jeux de cartes pour ados : 6 jeux qui tiennent une soirée entre amis`,
  shortTitle: `Jeux de cartes pour ados`,
  metaTitle: `Jeux de cartes pour ados : 6 jeux de 3 à 10 joueurs`,
  description: `Six jeux de cartes pour adolescents, choisis selon l’ambiance qu’ils créent (bluff, réflexes, paris) et non selon l’âge imprimé sur la boîte.`,
  category: `Soirée`,
  date: `2026-10-12`,
  heroTitle: `Jeux de cartes <span class="accent">pour ados</span>`,
  heroSubtitle: `Bluff, réflexes, paris : six jeux choisis pour l’ambiance qu’ils créent autour de la table, pas pour l’âge écrit sur la boîte.`,
  heroImage: `/blog/images/skull.jpg`,
  heroCaption: `Skull — le bluff réduit à une carte posée face cachée.`,
  intro: `<p>Trouver un jeu de cartes pour des adolescents, c’est viser deux cibles à la fois : un jeu assez rapide pour survivre à l’attention d’un groupe d’amis, et assez fin pour ne pas passer pour un jeu d’enfant. Cette page retient <strong>six jeux de cartes</strong> pour la dynamique qu’ils créent autour de la table (mensonge, course, prise de risque, paris) plutôt que pour un âge imprimé sur une boîte. Cet âge varie d’ailleurs d’un revendeur à l’autre pour plusieurs d’entre eux, et il ne dit rien de l’effet réel sur une bande de quinze ans. Tous se jouent sans écran et sans plateau. Pour un public mêlant petits et grands, voyez plutôt les <a class="text-link" href="/blog/jeux-famille.html">jeux de cartes en famille</a> ; pour une soirée entre adultes, les <a class="text-link" href="/blog/jeux-soiree-amis.html">jeux de cartes à sortir entre amis</a>.</p>`,
  criteria: {
    heading: `Ce qui fait tenir un jeu de cartes face à des ados`,
    html: `<p>Un groupe d’adolescents pardonne mal trois choses : l’attente, les règles qu’il faut dix minutes pour expliquer, et l’impression qu’on lui fait jouer à un jeu « pour petits ». Les six jeux retenus répondent à ces trois points, auxquels s’ajoute un quatrième, plus discret : la place laissée à l’humour et au chambrage entre joueurs.</p>
<h3>L’attente et les règles</h3>
<ul>
<li><strong>Une règle qui se dit en une phrase.</strong> « Pose une carte, annonce combien tu peux en retourner » (Skull), « le premier qui attrape le totem quand deux symboles sont identiques » (Jungle Speed) : un jeu dont on résume le geste principal en quelques mots se lance avant que l’attention retombe.</li>
<li><strong>Peu de temps mort.</strong> Dans 6 qui prend!, tout le monde choisit sa carte en même temps ; dans Jungle Speed, tout le monde regarde la table en permanence. Ces deux jeux laissent peu de place à l’ennui du joueur qui attend son tour.</li>
<li><strong>Tout le monde joue jusqu’au bout de la manche.</strong> Skyjo, 6 qui prend! et KYRAN font jouer chacun jusqu’à la fin de la manche. Vérifiez toujours ce qui arrive au joueur qui perd tôt : celui qui regarde les autres finir est celui qui sort son téléphone.</li>
</ul>
<h3>Le regard des autres</h3>
<p>Un ado ne supporte pas d’être traité en enfant, et l’étiquette d’âge d’une boîte pèse parfois plus que le jeu. Un jeu de bluff comme Skull ou Saboteur offre un terrain adulte : on y mène les autres en bateau, on s’accuse, on rit de s’être fait avoir. Les jeux de cartes à scores comme Skyjo ou les jeux de plis comme KYRAN attirent, eux, ceux qui aiment calculer ce que feront les autres. Le bon choix dépend donc du groupe : plutôt bavard, plutôt agité, ou plutôt calculateur.</p>
<h3>Le nombre de joueurs</h3>
<p>Une bande d’amis dépasse vite les quatre joueurs. Saboteur (3 à 10), Jungle Speed (2 à 10) et 6 qui prend! (2 à 10) absorbent une grande tablée sans changer de jeu ; Skull, plafonné à six, et KYRAN, qui ne se joue pas à deux, conviennent à un groupe plus resserré. Choisissez le jeu en fonction de ceux qui viendront, pas de ceux que vous espérez.</p>
<h3>Ce que dit l’étiquette d’âge</h3>
<p>Les âges publiés pour un même jeu diffèrent selon l’édition et le revendeur : Skull est donné dès 13 ans chez un vendeur américain, dès 10 ans ailleurs ; 6 qui prend! dès 8 ans sur une fiche de grande distribution, dès 10 ans sur celle de l’édition des trente ans. Ces écarts rappellent qu’il s’agit d’un minimum de compréhension, jamais d’une promesse d’intérêt pour un adolescent.</p>`
  },
  layout: {
    answerFirst: true,
    criteriaAfter: true,
    criteriaShort: `Méthode`,
    compare: false,
    numbered: false,
    groups: [
      {
        id: 'bande-qui-parle',
        heading: `Pour la bande qui aime se chambrer`,
        html: `<p>Ces deux jeux se gagnent à la parole : regards, accusations, fausses assurances. Ils fonctionnent d’autant mieux que le groupe se connaît déjà et ne craint pas de se faire traiter de menteur.</p>`,
        ids: [`skull`, `saboteur`]
      },
      {
        id: 'bande-agitee',
        heading: `Pour la bande qui ne tient pas en place`,
        html: `<p>Ici, on réagit plus qu’on ne discute : réflexe pour l’un, anticipation simultanée pour l’autre. Ils conviennent aux grandes tablées, quand un jeu de parole s’éparpille.</p>`,
        ids: [`jungle-speed`, `6-qui-prend`]
      },
      {
        id: 'bande-calculatrice',
        heading: `Pour ceux qui aiment calculer`,
        html: `<p>Deux jeux où l’on compte, où l’on estime le risque et où l’on regrette longuement une carte mal choisie. Leurs parties sont plus posées, mais tout aussi rejouables.</p>`,
        ids: [`skyjo`, `kyran`]
      }
    ]
  },
  headings: {
    selection: `Six jeux, selon l’humeur de la bande`,
    conclusion: `Comment lancer la première partie`,
    faq: `Questions de parents et d’organisateurs`,
    related: `Pour aller plus loin`
  },
  games: [
    {
      id: `skull`,
      subtitle: `le bluff le plus simple à expliquer`,
      type: `Bluff`,
      pick: `Pour une bande de trois à six qui aime mentir en regardant l’autre`,
      paragraphs: [
        `Skull tient dans un geste : chacun pose une carte face cachée devant soi, puis ajoute des cartes ou annonce combien il pense pouvoir en retourner sans tomber sur un crâne. D’après la fiche de Victory Point, un joueur qui retourne le crâne d’un adversaire perd une de ses propres cartes ; on gagne en gardant ses cartes jusqu’au bout. Cette simplicité explique qu’un groupe d’adolescents saisisse le principe en une manche.`,
        `Le jeu se joue au regard et à l’aplomb : impossible d’y bluffer correctement en regardant son téléphone. En contrepartie, il demande trois joueurs au minimum, six au maximum, et il gagne à être joué avec une table pleine. L’âge indiqué varie : 13 ans chez ce vendeur, 10 ans sur d’autres fiches.`
      ]
    },
    {
      id: `saboteur`,
      subtitle: `le soupçon pour toute une tablée`,
      type: `Rôles cachés`,
      pick: `Pour trois à dix joueurs, quand la discussion fait le jeu`,
      paragraphs: [
        `Dans Saboteur, chaque joueur incarne en secret un chercheur d’or ou un saboteur sans connaître le camp des autres. Toute la partie repose donc sur le soupçon : qui joue vraiment pour l’équipe, qui la ralentit en douce. La boîte métal contient 110 cartes et le jeu est annoncé pour trois à dix joueurs, soit la plus large capacité d’accueil de cette sélection, à égalité avec Jungle Speed et 6 qui prend!.`,
        `Son intérêt tient surtout à la parole : un groupe silencieux n’y trouvera presque rien à jouer. L’âge minimum affiché est de huit ans selon la fiche d’Esprit Jeu, ce qui rend le jeu accessible à des fratries d’âges mélangés, mais les accusations et la mauvaise foi qu’il déclenche le rendent tout aussi convaincant pour des adolescents entre eux.`
      ]
    },
    {
      id: `jungle-speed`,
      subtitle: `la course au totem qui réveille la table`,
      type: `Réflexe`,
      pick: `Pour une bande agitée, de deux à dix, qui préfère les mains aux discours`,
      paragraphs: [
        `Jungle Speed se résume à une course : chaque joueur retourne ses cartes en même temps au signal, et dès que deux symboles identiques apparaissent, le premier à attraper le totem en bois l’emporte ; l’attraper au mauvais moment fait perdre des cartes. La fiche de Bonne Promo annonce 80 cartes, un totem en bois et environ quinze minutes de partie, pour deux à dix joueurs.`,
        `C’est le jeu de cette liste qui supporte le mieux l’agitation d’une grande tablée et le bruit d’un groupe qui s’échauffe. Il a aussi ses limites : les mains se bousculent, le totem tombe, et le bruit gêne tout voisin qui dort ou travaille. Les revendeurs indiquent sept ans minimum, parfois huit selon les éditions : c’est un jeu d’ambiance, pas un jeu de réflexion.`
      ]
    },
    {
      id: `6-qui-prend`,
      subtitle: `l’anticipation à dix joueurs`,
      type: `Choix simultané`,
      pick: `Pour les grandes tablées où personne ne doit attendre son tour`,
      paragraphs: [
        `Dans 6 qui prend!, tous les joueurs reçoivent dix cartes puis choisissent chacun une carte à jouer, en même temps, avant de les révéler : elles se rangent dans des lignes, et celui qui pose la sixième carte d’une ligne ramasse les cinq autres, qui valent autant de bœufs de pénalité. Le but est d’en ramasser le moins possible. Personne n’attend son tour, ce qui évite le défaut classique des jeux de cartes à dix.`,
        `Le jeu tient à la lecture des autres : il faut deviner dans quelle ligne tomberont les cartes adverses, et les choix simultanés réservent des surprises. Compter 45 minutes pour la partie, d’après la fiche de Play-in pour l’édition des trente ans, qui l’annonce dès dix ans et de deux à dix joueurs ; une fiche Auchan indique huit ans minimum pour une autre édition.`
      ]
    },
    {
      id: `skyjo`,
      subtitle: `le score à minimiser, sans élimination`,
      type: `Score et risque`,
      pick: `Pour les groupes de deux à huit qui aiment tenter un coup risqué`,
      paragraphs: [
        `Chaque joueur de Skyjo commence avec une grille de douze cartes face cachée, en retourne deux, puis cherche à réduire le total de sa grille à chaque tour en piochant. Dès qu’un joueur a toutes ses cartes visibles, la manche s’arrête et les cartes cachées des autres sont révélées pour compter les points : le plus faible total gagne, selon la fiche de Play-in.`,
        `Les retournements de situation sont la raison de son succès chez les adolescents : on mène, on s’effondre sur une manche, on se venge à la suivante. La partie dure environ une demi-heure, de deux à huit joueurs, dès huit ans. Contrepartie : douze cartes devant chaque joueur occupent beaucoup de place, et la partie réclame une grande table, voire un coin de tapis, dès que le groupe dépasse cinq ou six personnes.`
      ]
    },
    {
      id: `kyran`,
      subtitle: `le pari obligatoire sur le nombre de plis`,
      type: `Plis et paris`,
      pick: `Pour trois à six joueurs qui veulent un jeu qu’on maîtrise avec le temps`,
      paragraphs: [
        `KYRAN s’adresse à un groupe qui aime prévoir. À chaque manche, chaque joueur annonce le nombre exact de plis qu’il compte remporter, et la somme des paris ne peut jamais être égale au nombre de plis : au moins un joueur se trompera donc à chaque manche, et perdra autant de cartes Vie que l’écart entre son pari et ses plis. Les manches vont de 7 cartes à 2, puis une manche Mystique à une carte posée sur le front, qu’on ne voit pas mais que tous les autres voient.`,
        `Le jeu se joue de trois à six, pour une demi-heure environ, dès huit ans, et <strong>ne se joue pas à deux</strong>. La partie s’arrête dès qu’un joueur a perdu toutes ses vies, ce qui n’en fait pas un jeu où personne ne perd : celui qui reste en dernier gagne. Apprenez les paris avant de réunir la bande avec l’<a class="text-link" href="/minijeu.html">initiation gratuite</a> ou lisez les <a class="text-link" href="/regle.html">règles de KYRAN</a>. La boîte coûte 9,99 € sur <a class="text-link" href="/commander.html">la boutique du jeu</a>.`
      ]
    }
  ],
  verdict: {
    heading: `Notre avis tranché`,
    html: `<p>Pour une soirée d’ados, le meilleur choix dépend moins de l’âge que de la bande. <strong>Skull</strong> si le groupe aime se chambrer et compte entre trois et six personnes ; <strong>Saboteur</strong> dès que l’on dépasse six, puisqu’il accueille jusqu’à dix joueurs ; <strong>Jungle Speed</strong> pour une bande qui s’agite et préfère les mains aux discours. Pour des joueurs qui aiment calculer, <strong>Skyjo</strong> est plus accessible, et <strong>KYRAN</strong> plus exigeant, avec ses paris à tenir sur les plis. Un seul jeu pour tous les cas n’existe pas : tenez-en deux de styles différents.</p>`
  },
  conclusion: `<p>Commencez par un jeu court dont la règle tient en une phrase, puis gardez le plus exigeant pour la deuxième partie. Posez la boîte sur la table avant l’arrivée du groupe plutôt que de la proposer au milieu de la soirée : un jeu déjà sorti se lance plus facilement qu’un jeu qu’il faut convaincre. Laissez les adolescents choisir entre deux options plutôt que de décider pour eux.</p>`,
  faq: [
    {
      q: `Quel jeu de cartes pour des ados en soirée ?`,
      a: `Skull ou Saboteur pour une bande qui aime bluffer et se chambrer, Jungle Speed pour une bande qui s’agite, Skyjo pour ceux qui préfèrent jouer posément. Le bon choix tient plus à l’ambiance du groupe qu’à l’âge indiqué sur la boîte.`
    },
    {
      q: `Quel jeu de cartes pour dix ados autour d’une table ?`,
      a: `Saboteur (3 à 10 joueurs), Jungle Speed (2 à 10) et 6 qui prend! (2 à 10) absorbent une grande tablée sans règle particulière. Skull s’arrête à six joueurs et Skyjo à huit : ils conviennent à un groupe plus resserré.`
    },
    {
      q: `À partir de quel âge ces jeux conviennent-ils ?`,
      a: `Les fiches annoncent entre 7 et 13 ans selon le jeu, l’édition et le revendeur : Skull 13+ chez un vendeur, 10+ ailleurs ; 6 qui prend! 8+ ou 10+ ; Jungle Speed 7+ ; Saboteur et Skyjo 8+. Ce sont des minimums de compréhension, pas un âge de plaisir.`
    },
    {
      q: `Existe-t-il un jeu de cartes pour ados sans élimination ?`,
      a: `Skyjo et 6 qui prend! font jouer tout le monde jusqu’au bout, partie comprise. KYRAN fait aussi jouer chacun jusqu’à la fin de chaque manche, mais la partie s’arrête dès qu’un joueur a perdu toutes ses vies : il ne s’agit donc pas d’un jeu sans perdant.`
    },
    {
      q: `KYRAN convient-il à des adolescents ?`,
      a: `Oui, dès huit ans, de trois à six joueurs, en une demi-heure environ. Il demande d’anticiper les plis des autres, ce qui plaît aux joueurs qui aiment calculer. Il ne se joue pas à deux : prévoyez au moins trois personnes.`
    }
  ],
  extraSections: [
    {
      id: `sources`,
      heading: `Sources consultées`,
      html: `<p>Les nombres de joueurs, âges et durées citées viennent de fiches de revendeurs, consultées le 12 octobre 2026 : <a class="text-link" href="https://www.espritjeu.com/jeux-ambiance/saboteur.html" rel="nofollow noopener" target="_blank">Esprit Jeu (Saboteur)</a>, <a class="text-link" href="https://www.play-in.com/fr/produit/264994/skyjo" rel="nofollow noopener" target="_blank">Play-in (Skyjo)</a>, <a class="text-link" href="https://www.play-in.com/produit/526587-6_qui_prend_-_Edition_speciale_30_ans" rel="nofollow noopener" target="_blank">Play-in (6 qui prend!, édition 30 ans)</a>, <a class="text-link" href="https://victorypointlgs.com/products/skull" rel="nofollow noopener" target="_blank">Victory Point Games (Skull)</a> et <a class="text-link" href="https://www.bonne-promo.com/prix/3261/jungle-speed-asmodee" rel="nofollow noopener" target="_blank">Bonne Promo (Jungle Speed)</a>. Les fiches divergent sur l’âge de plusieurs jeux : vérifiez celui de l’édition que vous achetez. Les faits de KYRAN viennent de la <a class="text-link" href="/regle.html">page des règles</a>.</p>`
    }
  ],
  related: [`jeux-famille`, `jeux-soiree-amis`, `jeux-grands-groupes`]
};
