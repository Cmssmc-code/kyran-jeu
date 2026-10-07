export default {
  slug: 'jeux-draft-encheres',
  title: 'Jeux de draft et d\'enchères en cartes : choisir, passer, miser',
  shortTitle: 'Jeux de draft et d\'enchères',
  metaTitle: 'Jeux de draft et d\'enchères : 7 jeux de cartes à connaître',
  description: 'Sushi Go!, For Sale, No Thanks!, Skull, KYRAN : draft ou enchères, que change chaque mécanique ? Sept jeux de cartes comparés, des plus légers aux plus tendus.',
  category: 'Cartes',
  date: '2026-06-24',
  heroTitle: 'Jeux de <span class="accent">draft et enchères</span>',
  heroSubtitle: 'Choisir une carte et passer le reste, ou fixer son prix : sept jeux qui font de ces deux gestes le cœur de la partie.',
  heroImage: '/boite-recto-kyran.jpg',
  heroCaption: 'Boîte de KYRAN « Maître des Mystiques » : un singe orné au centre, entouré de motifs colorés.',
  intro: `<p>Le <strong>draft</strong> consiste à garder une carte de sa main et à passer les autres au voisin ; l'<strong>enchère</strong> consiste à fixer un prix, en pièces, en jetons ou en risque, pour obtenir quelque chose. Pour découvrir le premier, jouez à <strong>Sushi Go!</strong> : quinze minutes, de 2 à 5 joueurs. Pour la seconde, <strong>For Sale</strong> est l'entrée la plus claire, avec deux enchères différentes dans une même partie. <strong>No Thanks!</strong> en propose une version inversée où l'on paie pour ne pas prendre. Les quatre autres jeux de la sélection (Skull, Oh Hell!, KYRAN, Star Realms) en reprennent l'esprit sans en respecter la lettre : miser un bluff, parier sur ses propres plis ou acheter dans un marché partagé. Les paris de plis sont détaillés dans notre <a class="text-link" href="/blog/jeux-plis-comparatif.html">comparatif des jeux de plis</a>.</p>`,
  criteria: {
    heading: 'Draft ou enchères : ce que chaque mécanique change à table',
    html: `<p>Ces deux mécaniques répondent à la même question, comment répartir des cartes que tout le monde convoite, mais par des chemins opposés. Les confondre conduit à choisir un jeu qui ne correspond pas à l'humeur de la soirée.</p>
<h3>Le draft : choisir sans pouvoir négocier</h3>
<p>Dans un draft, la rareté est implicite : chaque carte prise est une carte que le voisin ne verra pas. On ne parle pas de prix, on parle de renoncement. L'information vient de ce que les autres laissent passer : si les tempuras ont disparu d'une main qui revient, quelqu'un en collectionne. L'interaction reste indirecte, ce qui convient aux joueurs qui détestent les confrontations. Le principal risque est la lenteur d'un joueur qui veut optimiser chaque choix, car le draft récompense la planification.</p>
<h3>Les enchères : fixer un prix, et accepter qu'il soit dépassé</h3>
<p>Dans une enchère, la rareté est explicite : le prix, qu'il soit payé en monnaie (For Sale), en jetons (No Thanks!) ou en risque (Skull), révèle ce que chacun pense d'une carte. La valeur n'existe pas en soi, elle se négocie. C'est un terrain à bluff, où l'on cherche aussi bien à faire monter l'adversaire qu'à le laisser s'épuiser. Les pièges sont connus : payer trop cher par entêtement, ou laisser un joueur en difficulté décider seul du gagnant. Une limite de temps raisonnable évite les marchandages qui s'éternisent.</p>
<h3>Une troisième famille : s'engager sur soi</h3>
<p>Dans les jeux de plis à paris (Oh Hell!, KYRAN), le pari est une enchère sans enjeu partagé : personne ne se dispute le même objet, chacun s'engage sur ce qu'il réalisera. On y retrouve la tension de l'enchère, sans la négociation.</p>
<ul>
<li><strong>Table qui aime planifier :</strong> préférez le draft.</li>
<li><strong>Table qui aime lire les autres :</strong> préférez les enchères ouvertes ou le bluff.</li>
<li><strong>Table qui aime le risque calculé :</strong> préférez les paris de plis.</li>
</ul>`
  },
  games: [
    {
      id: 'sushi-go',
      type: 'Draft pur',
      pick: 'Pour découvrir le draft en quinze minutes, de 2 à 5 joueurs',
      paragraphs: [
        `Sushi Go! montre le draft sous sa forme la plus simple : chacun garde une carte, passe le reste à son voisin, et recommence jusqu'à épuisement de la main. La taille de départ dépend du nombre de joueurs : dix cartes à deux, neuf à trois, huit à quatre, sept à cinq. Plus la table est grande, moins vous revoyez la main que vous avez ouverte : à cinq, elle ne vous revient qu'une fois, avec deux cartes.`,
        `L'apport du draft est ici l'information indirecte. Ce que vos voisins laissent passer vous renseigne sur leurs besoins, et ce qu'ils vous passent est un choix qu'ils ont renoncé à faire. Le jeu récompense l'attention plus que le calcul et se joue en trois manches. Son défaut tient à la même source : l'interaction se limite à ce que l'on laisse passer, et un joueur qui préfère négocier se sentira à l'étroit.`
      ]
    },
    {
      id: 'for-sale',
      type: 'Enchères en deux temps',
      pick: 'Pour apprendre les enchères en trente minutes, de 3 à 6 joueurs',
      paragraphs: [
        `For Sale propose deux enchères dans une seule partie. D'abord on achète des immeubles en misant des pièces, à voix haute et à tour de rôle ; celui qui renonce prend le plus petit immeuble du lot et ne paie que la moitié de sa mise. L'enchère devient un arbitrage : accepter un petit lot à moitié prix, ou tenter de décrocher le gros.`,
        `La seconde phase retire le prix de l'équation. Chacun choisit en secret un immeuble de sa collection, les choix se dévoilent ensemble, et le plus élevé touche le chèque le plus gros. La valeur de ce que vous jouez dépend alors de ce que les autres ont gardé. Le gagnant est celui qui possède le plus d'argent à la fin, qu'il vienne de pièces conservées ou de chèques encaissés. Défaut : la phase d'achat peut s'étirer si un joueur marchande trop longtemps.`
      ]
    },
    {
      id: 'no-thanks',
      type: 'Enchère inversée',
      pick: 'Pour une enchère à très petit règlement, de 3 à 7 joueurs',
      paragraphs: [
        `No Thanks! retourne l'enchère : personne ne veut la carte, qui vaut des points négatifs, et c'est le droit de passer que l'on paie, avec un jeton. À chaque tour, on dépose un jeton sur la carte pour la refuser, ou on la prend avec tous les jetons qui s'y sont accumulés. Plus elle tourne, plus elle devient attirante : toute la tension du jeu tient dans ce seuil.`,
        `Sa subtilité tient aux suites : une carte contiguë à l'une des vôtres ne coûte presque rien en points, et chacun le voit. Vous pouvez laisser les jetons s'accumuler dessus avant de la prendre, à condition que personne ne vous la souffle. Défaut : l'ordre du paquet pèse lourd, et neuf cartes retirées au hasard empêchent d'anticiper parfaitement. Pour une vingtaine de minutes, c'est un excellent apéritif.`
      ]
    },
    {
      id: 'skull',
      type: 'Enchère de bluff',
      pick: 'Pour miser sur la sincérité des autres, de 3 à 6 joueurs',
      paragraphs: [
        `Skull réduit l'enchère à sa forme la plus pure : on ne mise pas de l'argent, on mise une affirmation. Une fois les cartes posées, un joueur annonce combien de roses il saura retourner sans toucher un crâne ; les autres surenchérissent ou se couchent, et le plus haut prétendant doit tenir parole devant tout le monde.`,
        `Ici, le prix est le risque : monter trop haut, c'est se mettre à la merci d'un crâne que l'on ne maîtrise pas. L'enchère ne transfère aucune ressource, elle sert seulement à désigner qui prend le risque. Défaut : les joueurs éliminés regardent la suite, et la partie perd en richesse à trois, où les cartes en jeu sont trop peu nombreuses pour masquer les mensonges.`
      ]
    },
    {
      id: 'oh-hell',
      type: 'Paris de plis',
      pick: 'Pour parier sur ses propres plis avec un jeu de 52 cartes',
      paragraphs: [
        `Oh Hell! sort de l'enchère classique : on ne mise pas contre les autres, mais sur soi. Avant de jouer, chacun annonce le nombre de plis qu'il va réaliser, et la valeur de sa promesse dépend de sa main. Dans la version classique, le donneur n'a pas le droit d'annoncer le chiffre qui égaliserait le total, ce qui garantit qu'au moins un joueur échouera.`,
        `Le jeu se pratique de 3 à 7 joueurs avec un jeu de cartes ordinaire, sans matériel supplémentaire. Défaut : les règles de score varient d'une table à l'autre (certaines comptent un bonus fixe pour une annonce tenue, d'autres un point par pli), et il faut s'accorder avant de commencer pour éviter les discussions de fin de partie.`
      ]
    },
    {
      id: 'kyran',
      type: 'Paris de plis',
      pick: 'Pour parier sur ses plis avec des vies visibles et des pouvoirs',
      paragraphs: [
        `KYRAN fonctionne comme les jeux de paris de plis : avant de jouer, chacun annonce combien de plis il va gagner, ce qui revient à une enchère sur soi-même, sans monnaie. La contrainte du dernier à parler, qui ne peut pas faire coïncider le total des paris avec le nombre de plis, est la même que dans la version classique. Honnêtement, ce n'est donc pas elle qui distingue KYRAN d'Oh Hell!.`,
        `La différence est la sanction : au lieu de points, on perd autant de cartes Vie visibles que l'écart entre l'annonce et les plis gagnés. Chaque pari devient un pari sur sa propre survie, et la partie s'arrête dès qu'un joueur n'a plus de vie. Ajoutez les cartes Pouvoir et la manche Mystique. KYRAN n'est pas un jeu d'enchères au sens strict, puisque personne ne dispute le même objet ; il convient aux joueurs qui aiment la tension du pari. Les <a class="text-link" href="/regle.html">règles</a> et la <a class="text-link" href="/commander.html">boutique</a> sont en ligne, pour 3 à 6 joueurs et environ 30 minutes.`
      ]
    },
    {
      id: 'star-realms',
      type: 'Marché partagé',
      pick: 'Pour deux joueurs qui veulent un draft glissant au cœur d\'un duel',
      paragraphs: [
        `Star Realms n'est ni un draft ni une enchère, mais sa rangée commune de cinq cartes en reproduit le dilemme. Vous payez en ressources, la rangée se recharge depuis la pioche, et la carte que vous laissez passer sera peut-être celle que votre adversaire attend. C'est un marché où chaque achat est aussi un refus infligé à l'autre.`,
        `Le parallèle avec le draft tient à l'influence : ce que l'on ne prend pas oriente le jeu de l'adversaire. Le prix, lui, est fixé par la carte et non par l'enchère, ce qui rapproche davantage le jeu d'un marché que d'une salle des ventes. Défauts : il se joue à deux seulement, la boîte indique 12 ans et plus, et il convient mal à un premier contact avec ces mécaniques.`
      ]
    }
  ],
  verdict: {
    heading: 'Notre avis tranché',
    html: `<p>Si vous ne deviez en retenir qu'un, prenez <strong>For Sale</strong> : en une demi-heure, il fait pratiquer une enchère ouverte puis un choix secret, sans élimination. Pour goûter au draft, <strong>Sushi Go!</strong> est imbattable de simplicité. Pour la pression pure, No Thanks!. Quant à KYRAN, ne l'achetez pas en pensant à une salle des ventes : c'est un jeu de plis à paris, qui convient mieux à ceux qui aiment s'engager sur leur main. Star Realms, enfin, n'est pas le bon point d'entrée.</p>`
  },
  conclusion: `<p>Draft et enchères partagent l'idée que l'on joue autant avec les choix des autres qu'avec les siens. Pour explorer d'autres jeux à décisions, notre sélection de <a class="text-link" href="/blog/jeux-strategie-legere.html">stratégie légère</a> complète celle-ci, et la page des <a class="text-link" href="/blog/jeux-cartes-6-joueurs.html">jeux à cinq ou six joueurs</a> vous aide à choisir quand la table s'agrandit.</p>`,
  faq: [
    {
      q: 'Qu\'est-ce qu\'un jeu de draft en cartes ?',
      a: `C'est un jeu où chaque joueur choisit une carte dans sa main puis passe le reste à son voisin, jusqu'à ce qu'il n'en reste plus. Sushi Go! en est l'exemple le plus accessible. L'intérêt tient à la lecture des cartes que les autres vous laissent.`
    },
    {
      q: 'Quelle différence entre un jeu de draft et un jeu d\'enchères ?',
      a: `Dans un draft, on choisit gratuitement une carte parmi celles qui restent, et la rareté vient des choix des voisins. Dans une enchère, on fixe un prix (pièces, jetons ou risque) pour l'emporter. Le draft est silencieux, l'enchère implique de la négociation ou du bluff.`
    },
    {
      q: 'Combien de joueurs et de cartes dans Sushi Go! ?',
      a: `Sushi Go! se joue de 2 à 5 joueurs, en 15 minutes environ, dès 8 ans. On reçoit dix cartes à deux, neuf à trois, huit à quatre et sept à cinq, sur trois manches de draft.`
    },
    {
      q: 'Comment fonctionnent les enchères de For Sale ?',
      a: `Dans la première phase, on enchérit à tour de rôle pour un immeuble ; celui qui passe prend le plus petit du lot et ne paie que la moitié de sa mise. Dans la seconde, chacun vend ses immeubles contre des chèques, par choix simultané. L'argent total détermine le vainqueur.`
    },
    {
      q: 'Quel jeu d\'enchères pour débuter en famille ?',
      a: `No Thanks! (dès 8 ans, environ 20 minutes) est le plus simple : un seul choix par tour, payer ou prendre. For Sale (dès 10 ans) demande un peu plus de calcul. Pour un jeu de cartes plus léger encore, voyez nos <a class="text-link" href="/blog/jeux-famille.html">jeux de famille</a>.`
    },
    {
      q: 'KYRAN est-il un jeu d\'enchères ?',
      a: `Pas au sens strict. Chacun annonce combien de plis il va gagner, ce qui ressemble à une enchère sur soi-même, mais personne ne se dispute les mêmes cartes. Le jeu est plus proche d'Oh Hell! et du <a class="text-link" href="/tarot-africain.html">Tarot Africain</a>, avec des vies visibles en plus.`
    }
  ],
  related: ['jeux-strategie-legere', 'jeux-plis-comparatif', 'jeux-cartes-6-joueurs']
};
