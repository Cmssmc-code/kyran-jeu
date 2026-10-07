export default {
  slug: 'jeux-memoire-concentration',
  title: 'Jeux de cartes de mémoire et de concentration : 6 jeux classés par effort',
  shortTitle: 'Jeux de mémoire et attention',
  metaTitle: 'Jeux de mémoire et de concentration : 6 jeux de cartes',
  description: 'Retenir une défausse, tenir un rythme, déduire ce qui reste : 6 jeux de cartes rangés selon l’effort mental qu’ils demandent, sans promesse médicale.',
  category: 'Famille',
  date: '2026-06-30',
  layout: {
    compare: false,
    numbered: false,
    summaryBox: false,
    groups: [
      {
        heading: 'Retenir ce qui a quitté la table',
        html: `<p>Dans ces deux jeux, l’information utile ne reste pas sous les yeux : une carte recouverte dans la défausse, un indice donné il y a trois tours. Celui qui s’en souvient décide mieux. Celui qui oublie n’est pas condamné pour autant, car la pioche à Skyjo et les partenaires à Hanabi rattrapent une partie des trous.</p>`,
        ids: ['skyjo', 'hanabi']
      },
      {
        heading: 'Tenir son attention de bout en bout',
        html: `<p>Ici, presque rien n’est à mémoriser : tout l’effort porte sur la vigilance, rapide et visuelle à Dobble, lente et partagée à The Mind. Ces deux jeux fatiguent autrement que les précédents, et gagnent à être sortis quand la table est encore fraîche.</p>`,
        ids: ['dobble', 'the-mind']
      },
      {
        heading: 'Compter et déduire ce qui reste en jeu',
        html: `<p>Les deux derniers jeux demandent de reconstituer une information cachée à partir de ce qui est sorti : des cartes retirées sans être montrées, des jetons tenus secrets, des cartes fortes déjà tombées. C’est l’effort le plus proche du comptage que pratiquent les amateurs de jeux de plis traditionnels.</p>`,
        ids: ['no-thanks', 'kyran']
      }
    ]
  },
  headings: {
    conclusion: 'Varier les efforts plutôt que les cumuler',
    faq: 'Mémoire, attention, comptage : vos questions',
    related: 'Pour creuser la science, la stratégie ou la coopération'
  },
  heroTitle: 'Jeux de <span class="accent">mémoire</span> et d’attention',
  heroSubtitle: 'Retenir ce qui a disparu, rester attentif, déduire ce qui reste : six jeux rangés selon l’effort qu’ils demandent vraiment à la table.',
  heroImage: '/kyran-cartes-table.webp',
  heroCaption: 'Des cartes Nombre de KYRAN étalées autour de la boîte du jeu.',
  intro: `<p>Un jeu « de mémoire » n’est pas toujours celui qu’on croit. Autour d’une table de cartes, trois efforts se mélangent : <strong>retenir</strong> ce qui a quitté la table (une défausse recouverte, un indice reçu), <strong>rester attentif</strong> à ce qui se passe maintenant (un symbole, un rythme) et <strong>déduire</strong> ce qui reste en jeu (des cartes écartées, des plis encore à prendre). Plutôt qu’un classement unique, cette page range six jeux en trois familles, selon l’effort qui domine. Elle décrit ce qu’un jeu demande à la table, rien de plus : pour ce que la recherche établit, et surtout ce qu’elle ne permet pas de conclure, sur les cartes et le cerveau, lisez notre <a class="text-link" href="/blog/science-jeux-de-cartes-cerveau.html">synthèse des études sur les jeux de cartes et le cerveau</a>.</p>`,
  criteria: {
    heading: 'Trois efforts mentaux qu’il vaut mieux distinguer',
    html: `<p>Un jeu de cartes sollicite la mémoire de manière très inégale. Le repère le plus utile consiste à se demander ce que vous devez garder en tête d’un tour à l’autre, et ce que la table affiche à votre place.</p>
<h3>Les trois familles de cette page</h3>
<ul>
<li><strong>Retenir</strong> : garder en tête une information qui a disparu de la table, comme les cartes recouvertes dans la défausse de Skyjo ou les indices déjà reçus à Hanabi.</li>
<li><strong>Rester attentif</strong> : maintenir une vigilance continue sur un flux, comme les symboles de Dobble ou le rythme commun de The Mind. Rien n’y est à mémoriser longtemps, mais un instant d’inattention coûte la manche.</li>
<li><strong>Déduire</strong> : reconstituer ce qui reste à partir de ce qui est sorti, comme les cartes écartées en début de partie à No Thanks! ou les cartes fortes déjà tombées à KYRAN.</li>
</ul>
<h3>Ce qui disparaît de la table fait la différence</h3>
<p>Un jeu dont l’information reste affichée en permanence sollicite surtout l’attention ; un jeu dont l’information s’efface sollicite la mémoire. Skyjo recouvre sa défausse, No Thanks! écarte des cartes sans les montrer, et à KYRAN chaque pli remporté quitte le centre de la table : dans ces trois jeux, se souvenir de ce qui a disparu pèse directement sur les décisions. Dobble, à l’inverse, met tout ce qu’il faut sous les yeux, et le défi tient à la vitesse de repérage.</p>
<h3>Rendre un jeu plus exigeant sans changer la règle</h3>
<p>Une habitude simple suffit : avant de jouer, annoncer à voix haute ce que l’on pense qu’il reste (le nombre de petites valeurs en pioche, de cartes fortes en circulation, de plis encore à gagner), puis vérifier en fin de manche. L’écart entre l’estimation et la réalité montre la mémoire à l’œuvre, sans rien ajouter à la boîte. À l’inverse, pour alléger une partie avec un novice, convenez que la défausse peut être consultée à tout moment.</p>
<h3>Ce que ces jeux ne promettent pas</h3>
<p>Jouer aux cartes ne remplace aucun suivi médical et ne garantit aucun bénéfice cognitif. La seule affirmation honnête est descriptive : tel jeu demande de retenir telle information, tel autre de rester attentif sans relâche. Pour des parties qui font réfléchir sans être austères, voyez aussi les <a class="text-link" href="/blog/jeux-strategie-legere.html">jeux de stratégie légère</a>.</p>`
  },
  games: [
    {
      id: 'skyjo',
      type: 'Mémoire de défausse',
      pick: 'Pour s’entraîner à retenir quelles valeurs ont déjà été jouées',
      paragraphs: [
        `Dans Skyjo, la mémoire sert à savoir ce qui reste : avec un paquet de cartes de -2 à 12, la valeur d’un 12 ou d’un 0 repéré dans la défausse change de statut à mesure que la partie avance. Retenir qui a déjà défaussé quoi permet d’estimer si la pioche contient encore des petites valeurs, utile avant de décider de retourner une carte cachée ou de tirer.`,
        `Le second effort relève plutôt de l’attention : les grilles des voisins sont visibles, et repérer qui est en train de réunir trois cartes identiques dans une colonne évite de lui offrir la dernière en défausse. La dépense mentale reste douce et le hasard compense : un novice peut gagner, ce qui en fait le jeu de la page le plus simple à proposer à une table de niveaux mélangés.`
      ]
    },
    {
      id: 'hanabi',
      type: 'Déduction par indices',
      pick: 'Pour mémoriser ce que l’on sait déjà de ses propres cartes',
      paragraphs: [
        `À Hanabi, la mémoire porte sur soi-même : chaque indice reçu (« ces deux cartes sont des 3 ») doit rester attaché à la bonne carte alors que la main se renouvelle et que les cartes bougent. Les joueurs retiennent aussi les informations déjà données à leurs partenaires, pour ne pas gaspiller un jeton d’indice sur un fait déjà connu de tous.`,
        `Le jeu ajoute un compte collectif : quelles cartes sont déjà défaussées, donc quelle couleur ne pourra plus atteindre 5. Défaut : les trous de mémoire d’un joueur pénalisent toute l’équipe, et le plaisir s’éteint si l’on cherche à tout retenir seul. Décaler légèrement une carte déjà désignée aide à s’en souvenir ; mieux vaut convenir avant la partie si la table accepte ce pense-bête.`
      ]
    },
    {
      id: 'dobble',
      type: 'Attention visuelle',
      pick: 'Pour des reprises d’attention de quelques secondes, sans règle à retenir',
      paragraphs: [
        `Dobble sollicite la vigilance visuelle plutôt que la mémoire : sur deux cartes, un seul symbole est commun, jamais plus, jamais moins, ce qui fixe la tâche à une recherche ciblée sous pression de temps. Les symboles changent de taille et d’orientation d’une carte à l’autre, ce qui force à reconnaître une forme et non à la retrouver au même endroit.`,
        `Aucune mémoire ne se joue dans la version de base : il n’y a pas de carte passée à retenir, seulement la suivante à déchiffrer. L’effort est bref mais intense, et c’est le seul jeu de la page accessible dès 6 ans. Défaut : la vitesse favorise toujours le même profil de joueurs, et après plusieurs parties sur la même table, un joueur déjà rodé gagne souvent.`
      ]
    },
    {
      id: 'the-mind',
      type: 'Concentration collective',
      pick: 'Pour une table qui accepte le silence total pendant la partie',
      paragraphs: [
        `The Mind demande une attention d’un autre genre : tenir la durée d’une montée de nombres sans parler. Chacun garde en tête sa plus petite carte et estime le temps qu’il faut laisser passer avant de la poser, en observant le rythme de l’équipe. Le jeu se rapproche d’un exercice d’attention commune plus que d’une mémoire des cartes.`,
        `Le vrai défaut apparaît quand les niveaux grimpent : l’écart entre les cartes devient difficile à juger et la partie dépend de l’état d’esprit du jour. La fatigue ou le bruit voisin la ruinent. C’est pourquoi il trouve sa place en début de soirée, avant les jeux de comptage, plutôt qu’en dernière partie quand l’attention de chacun s’effiloche.`
      ]
    },
    {
      id: 'no-thanks',
      type: 'Comptage de cartes',
      pick: 'Pour compter ce qui manque et estimer les jetons des autres',
      paragraphs: [
        `Neuf cartes sur trente-trois sont retirées au hasard au début de la partie, sans être montrées. Cette incertitude oblige à raisonner : cette suite que vous attendez est-elle encore possible, ou une carte clé a-t-elle été écartée ? Retenir qui a pris quelle carte permet de savoir si une suite reste à portée d’un adversaire.`,
        `Deuxième mémoire : les jetons. Ils restent cachés dans la main de chacun, donc compter les dépenses d’un adversaire donne une idée de ce qui lui reste, et de sa capacité à refuser encore. C’est le jeu de la page où la déduction est la plus nue : aucun effet spécial, seulement des nombres et des jetons. Son défaut est la répétition de longues séries de refus à petit effectif.`
      ]
    },
    {
      id: 'kyran',
      type: 'Plis et paris',
      pick: 'Pour suivre les cartes fortes tombées et ajuster son pari',
      paragraphs: [
        `Un bon pari à KYRAN s’appuie sur ce qui est déjà tombé : après quelques plis, retenir quelles cartes fortes ont été jouées permet de savoir s’il en reste en circulation pour vous priver d’un pli. Les manches de 7 à 2 cartes font varier la charge : à 7 cartes, la mémoire est mise à contribution ; à 2 cartes, c’est le calcul qui prend le relais.`,
        `La déduction reste prudente, car tout le paquet n’est jamais distribué : à trois joueurs et sept cartes chacun, un peu plus de la moitié des cartes seulement est en jeu, et l’absence d’une carte forte ne prouve rien. La manche Mystique change encore d’effort : une seule carte tenue contre le front, visible de tous sauf de son porteur, qui parie 1 ou 0 selon ce qu’il voit chez les autres.`,
        `Défaut : les cartes Pouvoir à valeurs doubles, comme le Sceau du Destin (27 ou 4), ajoutent des exceptions à retenir. La variante d’initiation les retire, pour un comptage plus pur. Pour s’exercer au pari sur les plis avant d’ouvrir la boîte, l’<a class="text-link" href="/minijeu.html">Initiation gratuite en ligne</a> reprend le principe pas à pas.`
      ]
    }
  ],
  verdict: {
    heading: 'Quel jeu choisir selon l’effort recherché',
    html: `<p>Pour solliciter la mémoire sans y passer la soirée, prenez <strong>No Thanks!</strong> : en une vingtaine de minutes, il oblige à tenir compte de neuf cartes invisibles, à estimer les jetons des autres et à trancher à chaque tour. <strong>Skyjo</strong> reste la meilleure option pour une table mixte, parce que le hasard y protège les distraits, et <strong>Hanabi</strong> celle d’une équipe qui veut retenir ensemble. Si c’est l’attention que vous cherchez plutôt que le souvenir, Dobble et The Mind sont plus justes, chacun à son tempo. KYRAN, enfin, s’adresse à ceux qui aiment suivre les cartes fortes et parier sur leurs plis ; sa variante d’initiation, sans pouvoirs, garde le comptage et retire les exceptions.</p>`
  },
  conclusion: `<p>Alterner les efforts vaut mieux que s’acharner sur un seul : une partie de vigilance rapide, puis un jeu de comptage plus posé, renouvelle ce que la table doit garder en tête. Les trois familles de cette page se combinent d’ailleurs dans une même soirée, de la plus nerveuse à la plus calme. Et rien n’interdit de jouer sans compter ni retenir, pour le seul plaisir : ces six jeux fonctionnent aussi comme cela.</p>`,
  faq: [
    {
      q: 'Quel jeu de cartes pour faire travailler la mémoire ?',
      a: 'Skyjo et No Thanks! sont les plus accessibles : ils obligent à retenir ce qui a disparu de la table (cartes recouvertes dans la défausse, cartes écartées au départ). Hanabi ajoute une mémoire partagée des indices reçus. Ce sont des jeux d’effort léger, pas des exercices programmés.'
    },
    {
      q: 'Quels jeux de cartes demandent de compter les cartes ?',
      a: 'No Thanks! (neuf cartes écartées au hasard) et KYRAN (cartes fortes déjà jouées, paquet jamais distribué en entier) sont les plus orientés comptage. Skyjo et Hanabi y ajoutent un suivi de ce qui a été défaussé ou indiqué.'
    },
    {
      q: 'Quelle différence entre un jeu de mémoire et un jeu d’attention ?',
      a: 'Un jeu de mémoire demande de garder une information qui n’est plus visible, comme une défausse recouverte à Skyjo. Un jeu d’attention laisse tout sous les yeux mais exige de ne rien rater, comme les symboles de Dobble ou le tempo silencieux de The Mind.'
    },
    {
      q: 'Existe-t-il un jeu de mémoire pour jouer en famille avec des enfants ?',
      a: 'Dobble convient dès 6 ans et sollicite l’attention visuelle ; Skyjo, Hanabi et The Mind sont annoncés dès 8 ans. Skyjo oblige à retenir la défausse, Hanabi les indices. Pour une sélection pensée pour toute la famille, consultez nos <a class="text-link" href="/blog/jeux-famille.html">jeux de société en famille</a>.'
    },
    {
      q: 'Les jeux de cartes protègent-ils la mémoire ?',
      a: `Cette page décrit seulement l’effort que demande chaque jeu, pas ses effets sur la santé, et aucun jeu ne peut garantir un bénéfice. Pour savoir ce que les études établissent et ce qu’elles ne permettent pas de conclure, lisez <a class="text-link" href="/blog/science-jeux-de-cartes-cerveau.html">l’article consacré aux jeux de cartes et au cerveau</a>.`
    }
  ],
  related: ['science-jeux-de-cartes-cerveau', 'jeux-strategie-legere', 'jeux-coop-cartes']
};
