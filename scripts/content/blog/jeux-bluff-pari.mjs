export default {
  slug: 'jeux-bluff-pari',
  title: 'Jeux de bluff, de pari et de rôles cachés : 7 jeux de cartes rangés par famille',
  shortTitle: 'Jeux de bluff et de pari',
  metaTitle: 'Bluff, pari, rôles cachés : 7 jeux de cartes par famille',
  description: `Skull, Coup, Saboteur, Bang!, Wizard, KYRAN et For Sale : sept jeux de cartes rangés en trois familles, du mensonge en face au pari sur sa main.`,
  category: 'Cartes',
  date: '2026-05-23',
  heroTitle: 'Jeux de <span class="accent">bluff</span> et de pari',
  heroSubtitle: `Mentir en face, cacher son camp ou parier sur sa main : sept jeux, trois manières de faire douter la table.`,
  heroImage: '/boite-recto-kyran.jpg',
  heroCaption: 'KYRAN — paris, plis et manche Mystique.',
  layout: {
    groups: [
      {
        heading: 'Mentir en face : le bluff pur',
        html: `<p>Dans cette famille, le mensonge est une affirmation que n'importe qui peut contester sur-le-champ. Le défi se règle aussitôt, un disque ou un personnage perdu à la clé, d'où des parties courtes et nerveuses. Les deux jeux retenus font sortir des joueurs avant la fin : mieux vaut le savoir avant de les proposer.</p>`,
        ids: ['skull', 'coup']
      },
      {
        heading: 'Cacher son camp : les rôles secrets',
        html: `<p>Le mensonge ne porte plus sur une carte mais sur votre identité, et il tient toute la manche. C'est le registre des anciens « jeux de trahison » : soupçons, alliances de façade, accusations qui se retournent contre leur auteur. Il réclame des tables plus fournies que le bluff pur, et une bonne humeur à toute épreuve.</p>`,
        ids: ['saboteur', 'bang']
      },
      {
        heading: 'Parier sur sa main : annonces et enchères',
        html: `<p>Personne n'est tenu de mentir : chacun s'engage sur ce que sa main rapportera, en plis ou en chèques. Wizard et KYRAN appartiennent à la famille des jeux à annonce exacte de plis, celle du Tarot Africain, que beaucoup appellent <a class="text-link" href="/whist-22.html">Whist 22</a> ; les <a class="text-link" href="/tarot-africain.html">règles du Tarot Africain</a> en donnent la version la plus dépouillée, avec 22 cartes de tarot. For Sale transpose cet engagement aux enchères.</p>`,
        ids: ['wizard', 'kyran', 'for-sale']
      }
    ]
  },
  headings: {
    compare: 'Les sept jeux et leur famille en un coup d’œil',
    conclusion: 'Annoncer la couleur avant de bluffer',
    faq: 'Bluff, pari et rôles cachés : questions courantes',
    related: 'D’autres soirées à préparer'
  },
  intro: `<p>« Jeu de bluff » désigne en réalité trois plaisirs distincts. Certains jeux demandent d'affirmer une chose fausse en regardant la table dans les yeux (Skull, Coup). D'autres vous confient un rôle secret à tenir toute la manche (Saboteur, Bang!). Les derniers n'exigent aucun mensonge : vous vous engagez sur ce que votre main va rapporter, et la lecture des autres fait la différence (Wizard, KYRAN, For Sale). Se tromper de famille, c'est sortir un jeu que la table n'a aucune envie de jouer. Les sept titres ci-dessous sont donc regroupés par famille, avec pour chacun le nombre minimal de joueurs, le risque d'élimination et la durée. Cette page reprend aussi nos anciens guides des <strong>jeux comme Skull</strong> et des <strong>jeux de trahison cachée</strong>.</p>`,
  criteria: {
    heading: 'Joueurs, élimination, ton : trois filtres avant d’acheter',
    html: `<p>La famille se choisit vite ; c'est entre deux jeux d'une même famille que l'hésitation commence. Trois filtres pratiques évitent le jeu qui tombe à plat le soir venu.</p>
<h3>Combien serez-vous autour de la table ?</h3>
<p>Skull, Saboteur, Wizard, KYRAN et For Sale démarrent à trois. Coup accepte un duel, ce qui en fait le seul titre de la sélection jouable à deux. Bang! réclame au moins quatre joueurs, le minimum pour répartir un shérif, des hors-la-loi et un renégat. Vers le haut, Saboteur monte jusqu'à dix et Bang! jusqu'à sept, quand les autres plafonnent à six. Pour une tablée de huit, seul Saboteur suit.</p>
<h3>Que devient celui qui perd ?</h3>
<p>Skull, Coup et Bang! font sortir des joueurs avant la fin : sans disque, sans personnage ou sans point de vie, on regarde les autres terminer. Saboteur, Wizard et For Sale gardent tout le monde en jeu jusqu'au dernier tour. KYRAN occupe une place intermédiaire : le joueur qui perd sa dernière carte Vie est éliminé, mais la partie s'arrête au même instant, si bien que personne n'attend. Si l'attente est un sujet sensible chez vous, notre page consacrée aux <a class="text-link" href="/blog/jeux-sans-elimination.html">jeux de cartes sans élimination</a> traite la question en détail.</p>
<h3>Quel ton la soirée peut-elle supporter ?</h3>
<p>Les rôles cachés autorisent l'accusation : on désigne un voisin, on le soupçonne à voix haute, on se trompe. C'est drôle entre amis proches, plus délicat avec des collègues ou des invités qui se connaissent à peine. Le bluff pur reste ponctuel : un défi, une réponse, et l'on passe à la suite. Les jeux de pari sont les plus neutres, car on n'y juge jamais l'honnêteté d'une personne, seulement l'estimation qu'elle a faite de sa main. Prévoyez enfin deux parties : la première révèle jusqu'où chacun ose aller, la seconde permet d'en profiter.</p>`
  },
  games: [
    {
      id: 'skull',
      subtitle: 'quatre disques et une enchère',
      type: 'Bluff pur',
      pick: 'Pour trois à six joueurs prêts à se défier du regard',
      paragraphs: [
        `Skull tient dans quatre disques par joueur : trois fleurs et un crâne. Chacun empile des disques face cachée devant lui, puis quelqu'un annonce combien il pourra en retourner sans tomber sur un crâne. Les autres surenchérissent ou se retirent. Le dernier enchérisseur doit commencer par sa propre pile, ce qui rend coûteux le fait de miser haut quand on a soi-même caché son crâne.`,
        `Tout repose sur deux lectures : celle des piles (le crâne est-il dessous ou dessus ?) et celle de l'enchérisseur (veut-il gagner, ou seulement faire monter un rival ?). Chaque défi raté retire un disque, donc une possibilité de bluff pour la suite. Revers de cette mécanique : le joueur qui n'a plus de disque est éliminé et suit la fin de la partie depuis le bord de la table.`
      ]
    },
    {
      id: 'coup',
      subtitle: 'cinq personnages, deux en main',
      type: 'Bluff pur',
      pick: 'Pour un duel de mensonges, ou une table de six pressée',
      paragraphs: [
        `Coup confie à chaque joueur deux personnages face cachée parmi cinq : Duc, Assassin, Capitaine, Ambassadeur et Comtesse. À son tour, on revendique l'action d'un personnage, qu'on le détienne ou non : le Duc encaisse des pièces, l'Assassin paie pour faire perdre un personnage à un adversaire. N'importe qui peut crier au mensonge, et le perdant de la contestation, menteur démasqué ou accusateur trop prompt, retourne l'un de ses deux personnages.`,
        `C'est le bluff le plus frontal de la page, et le seul jouable à deux : environ un quart d'heure, dès 10 ans. Dire la vérité y devient parfois la meilleure ruse, puisqu'un contestataire qui se trompe se pénalise lui-même. Le défaut tient à l'effectif : à six, un joueur qui perd ses deux personnages dès les premiers tours peut attendre longtemps la partie suivante.`
      ]
    },
    {
      id: 'saboteur',
      subtitle: 'la galerie et le traître',
      type: 'Rôles cachés',
      pick: 'Pour une grande tablée qui aime soupçonner sans exclure personne',
      paragraphs: [
        `Saboteur répartit les joueurs en deux camps sans le dire : des chercheurs d'or qui prolongent une galerie vers le trésor, et un ou plusieurs saboteurs qui veulent la voir échouer. Les rôles sont tirés au hasard à chaque manche. Personne n'a besoin de mentir à voix haute au début : ce sont les cartes posées, une impasse ici, une lampe cassée là, qui finissent par trahir un camp.`,
        `C'est la porte d'entrée la plus douce vers les rôles cachés, pour une famille ou des invités hésitants : aucun joueur n'est éliminé, et celui dont l'outil est cassé continue de jouer ou de défausser. De 3 à 10 joueurs, environ 30 minutes, dès 8 ans. Le jeu prend de l'ampleur à partir de cinq, quand deux saboteurs peuvent se couvrir l'un l'autre.`
      ]
    },
    {
      id: 'bang',
      subtitle: 'shérif, hors-la-loi et renégat',
      type: 'Rôles cachés',
      pick: 'Pour quatre à sept joueurs qui aiment les duels et les alliances floues',
      paragraphs: [
        `Bang! habille les rôles cachés en western. Le shérif joue à visage découvert ; les hors-la-loi veulent sa peau, les adjoints le protègent sans pouvoir le prouver, et le renégat espère rester le dernier debout, ce qui l'oblige à changer d'allié au fil de la partie. Chaque personnage dispose d'un pouvoir propre et de points de vie, et l'on ne peut atteindre que les joueurs à portée de son arme.`,
        `La tension naît de l'incertitude sur les camps : tirer sur le mauvais voisin rend service à l'adversaire. Il faut au moins quatre joueurs, jusqu'à sept, pour environ 30 minutes annoncées, dès 8 ans. Le prix du genre est l'élimination : un joueur abattu suit la fin en spectateur. À une table qui supporte mal l'attente, Saboteur rendra le même service sans laisser personne de côté.`
      ]
    },
    {
      id: 'wizard',
      subtitle: 'promettre ses plis, sans contrainte de total',
      type: 'Pari sur ses plis',
      pick: 'Pour ceux qui préfèrent promettre plutôt que mentir',
      paragraphs: [
        `Wizard ne demande pas de mentir, seulement de promettre. À chaque manche, on annonce le nombre exact de plis qu'on remportera : un contrat tenu rapporte 20 points plus 10 par pli, un contrat manqué coûte 10 points par pli d'écart. Le bluff est indirect : une annonce basse fait comprendre aux voisins qu'on cherchera à se débarrasser de ses grosses cartes, et ils peuvent s'en servir.`,
        `Les quatre Magiciens gagnent le pli à coup sûr et les quatre Bouffons le perdent, deux outils précieux pour tenir une annonce. La règle de base ne limite pas le total des annonces, si bien qu'une manche peut se conclure sans qu'aucun joueur se trompe. Défaut : à trois, la partie compte vingt manches et s'étire nettement. Pour des jeux bâtis sur le même principe, voyez nos <a class="text-link" href="/blog/alternatives-wizard.html">alternatives à Wizard</a>.`
      ]
    },
    {
      id: 'kyran',
      subtitle: 'un total d’annonces qui ne tombe jamais juste',
      type: 'Pari et plis',
      pick: 'Pour bluffer par l’annonce, avec des vies visibles et une manche aveugle',
      paragraphs: [
        `KYRAN rend le pari obligatoire et y ajoute une contrainte : la somme des annonces ne peut jamais égaler le nombre de plis de la manche. Le dernier à parler se voit donc retirer un chiffre, parfois celui qu'il visait, et quelqu'un se trompera forcément. Chaque annonce devient une manœuvre : viser haut pour coincer son voisin, ou bas pour lui laisser le choix le plus inconfortable.`,
        `La sanction se lit sur la table : un pari raté coûte autant de cartes Vie que l'écart, et ces cartes restent visibles de tous. La manche Mystique pousse l'idée au bout, avec une seule carte posée sur le front, que l'on ne voit pas, et un pari de 1 ou 0 fondé sur les cartes des autres. Les Pouvoirs ajoutent quelques coups fourrés, comme la Clairvoyance Antique, qui révèle en secret la plus forte carte d'un adversaire.`,
        `Ce n'est pas un jeu de mensonge pur : une table qui veut se défier en face sera mieux servie par Coup. De 3 à 6 joueurs, jamais à deux, environ 30 minutes, dès 8 ans ; les <a class="text-link" href="/regle.html">règles de KYRAN</a> existent aussi en vidéo de cinq minutes.`
      ]
    },
    {
      id: 'for-sale',
      subtitle: 'acheter cher, revendre au bon moment',
      type: 'Enchères et pari',
      pick: 'Pour une table qui préfère les enchères aux grands discours',
      paragraphs: [
        `For Sale déplace le pari vers les enchères. Première phase : on achète des propriétés numérotées de 1 à 30 en surenchérissant ; celui qui passe prend la plus petite propriété encore en jeu et récupère la moitié de sa mise. Seconde phase : chacun pose une propriété face cachée, et la plus haute empoche le plus gros chèque du lot.`,
        `Le bluff y est muet. On fait monter une enchère pour forcer un rival à payer cher, on garde une grosse propriété pour le chèque qui comptera. Personne n'est éliminé, et la partie dure environ 30 minutes, de 3 à 6 joueurs, dès 10 ans. La limite tient à l'ambiance : peu de paroles, beaucoup de calcul, ce qui déçoit les tables venues pour se chambrer.`
      ]
    }
  ],
  extraSections: [
    {
      heading: 'Les jeux comme Skull : que choisir ensuite ?',
      html: `<p>Skull plaît pour trois raisons : un matériel réduit à quelques disques, une enchère publique et un bluff sanctionné sur-le-champ. La suite dépend de ce qui vous a le plus accroché.</p>
<ul>
<li><strong>L'enchère</strong> : For Sale garde la montée des mises et dédommage même celui qui passe ; KYRAN et Wizard reportent l'annonce sur des plis.</li>
<li><strong>Le défi en face</strong> : Coup est le plus proche, puisque toute affirmation peut y être contestée par n'importe quel joueur.</li>
<li><strong>La rapidité</strong> : Coup se boucle en un quart d'heure environ, deux fois moins que Skull.</li>
<li><strong>La lecture des visages</strong> : Saboteur étire ce plaisir sur toute une manche, sans enchère mais avec un traître à démasquer.</li>
</ul>
<p>Si c'est l'élimination qui vous a gêné dans Skull, tournez-vous vers Saboteur, Wizard ou For Sale, où chacun joue jusqu'au dernier tour.</p>`
    }
  ],
  verdict: {
    heading: 'Quel jeu de bluff pour quelle table ?',
    html: `<p>Pour une première soirée de bluff, prenez Skull : de trois à six joueurs, une règle qui s'explique en une minute, et la sensation du mensonge dès le premier tour. À deux ou pour des parties éclair, Coup. Au-delà de six joueurs, ou face à une table qui refuse l'élimination, Saboteur. Si votre groupe n'aime pas mentir mais adore s'engager, KYRAN : le chiffre interdit au dernier annonceur crée le bluff à votre place. Bang! demande plus de précautions : à réserver aux tables de cinq ou six joueurs qui acceptent qu'un éliminé attende la fin.</p>`
  },
  conclusion: `<p>Le bluff fonctionne quand chacun sait à quoi il s'expose. Dites avant la première carte si l'on va mentir, cacher son camp ou simplement parier, et précisez ce qui arrive à celui qui perd : spectateur, ou toujours dans la partie. Cette mise au point évite le malaise du joueur qui découvre en cours de route qu'il est le traître, ou qu'il va passer la fin de soirée sur le canapé.</p>`,
  faq: [
    {
      q: 'Quel jeu de bluff choisir à trois joueurs ?',
      a: `Skull, qui démarre à trois et donne tout de suite la sensation du bluff. Coup accepte aussi trois joueurs, pour des parties encore plus courtes. Saboteur se joue à trois, mais avec un seul saboteur au plus, le soupçon retombe vite : gardez-le pour les tables plus nombreuses.`
    },
    {
      q: 'Quel jeu ressemble le plus à Skull ?',
      a: `Coup, pour le défi lancé en face et la contestation immédiate. For Sale reprend la surenchère avec des cartes de valeur, et KYRAN transpose l'annonce aux plis. Si c'est la brièveté de Skull qui vous plaît, Coup est aussi le plus rapide de cette sélection.`
    },
    {
      q: 'Existe-t-il un jeu de rôles cachés où personne n’est éliminé ?',
      a: `Oui, Saboteur : un nain dont l'outil est cassé continue de jouer ou de défausser, et les rôles changent à chaque manche. Bang! et Coup, à l'inverse, font sortir des joueurs avant la fin de la partie.`
    },
    {
      q: 'Quels jeux de cartes se jouent en annonçant ses plis ?',
      a: `Wizard, KYRAN, Oh Hell! et le Tarot Africain reposent tous sur cette annonce exacte. KYRAN et le Tarot Africain interdisent au dernier joueur de boucler le total, ce qui garantit au moins une erreur par manche ; la règle de base de Wizard ne pose pas cette limite.`
    },
    {
      q: 'Peut-on aimer les jeux de bluff sans savoir mentir ?',
      a: `Oui. Dans Wizard, For Sale ou KYRAN, on ne prononce aucun mensonge : on s'engage, puis on tient parole ou non. Le bluff naît de ce que l'annonce laisse deviner aux autres, sans qu'il faille jouer la comédie.`
    }
  ],
  related: ['jeux-soiree-amis', 'jeux-plis-comparatif', 'jeux-sans-elimination']
};
