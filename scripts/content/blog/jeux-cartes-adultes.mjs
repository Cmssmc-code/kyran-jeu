export default {
  slug: 'jeux-cartes-adultes',
  title: 'Jeux de cartes pour adultes : 7 jeux sans humour gras, classés par ce que la table attend',
  shortTitle: 'Jeux de cartes adultes',
  metaTitle: 'Jeux de cartes pour adultes : 7 choix selon la table',
  description: `Sept jeux de cartes pour adultes, sans humour gras : parier, bluffer, coopérer ou s'affronter à deux. Joueurs, durée et défauts de chacun.`,
  category: 'Soirée',
  date: '2026-09-11',
  heroTitle: 'Jeux de cartes pour <span class="accent">adultes</span>',
  heroSubtitle: `Parier, mentir, coopérer en silence ou s'affronter à deux : sept jeux qui respectent l'intelligence de la table.`,
  heroImage: '/kyran-cartes-table.webp',
  heroCaption: 'KYRAN, jeu de plis à pari obligatoire (3 à 6 joueurs).',
  layout: {
    answerFirst: true,
    criteriaAfter: true,
    criteriaShort: 'Méthode',
    numbered: false,
    compare: { position: 'after' },
    groups: [
      {
        heading: 'Parier sur sa main et lire les autres',
        html: `<p>Ici, la tension vient d'un engagement public : on annonce combien de plis on va gagner, puis il faut tenir parole. Pas de comédie à jouer, mais une table qui observe vos hésitations. Ces jeux conviennent aux adultes qui connaissent déjà la belote ou le tarot.</p>`,
        ids: ['kyran', 'wizard']
      },
      {
        heading: 'Mentir en face',
        html: `<p>Le bluff pur : une affirmation fausse, un défi, une sanction immédiate. Les parties sont brèves, mais les deux jeux retenus éliminent des joueurs avant la fin, ce qu'il vaut mieux annoncer avant de commencer.</p>`,
        ids: ['coup', 'skull']
      },
      {
        heading: 'Coopérer sans parler',
        html: `<p>Pour une table qui préfère gagner ensemble : un jeu de plis où la communication est volontairement presque nulle.</p>`,
        ids: ['the-crew']
      },
      {
        heading: 'Se mesurer à deux',
        html: `<p>Les deux jeux de cette partie sont conçus exclusivement pour un duel, ce qui les rend précieux quand la soirée se joue à deux et que KYRAN, lui, ne se joue pas à deux.</p>`,
        ids: ['schotten-totten', 'star-realms']
      }
    ]
  },
  headings: {
    selection: 'Sept jeux pour sept envies d’adultes',
    compare: 'Les sept jeux côte à côte',
    conclusion: 'Choisir sans se tromper de soirée',
    faq: 'Jeux de cartes adultes : vos questions',
    related: 'Pour aller plus loin'
  },
  intro: `<p>Un « jeu de cartes pour adultes » n'a pas besoin d'être grivois : il suffit qu'il traite la table en adultes, avec des décisions qui comptent, des parties de moins d'une heure et une règle qu'on explique en cinq minutes. Cette sélection s'appuie sur ce critère. Pour parier sur ses plis à trois ou plus, prenez <a class="text-link" href="/regle.html">KYRAN</a> ou Wizard ; pour mentir, Coup ou Skull ; pour coopérer, The Crew ; à deux, Schotten Totten ou Star Realms. Les règles et durées viennent des fiches d'éditeurs consultées le 4 octobre 2026, et chaque jeu a un défaut annoncé.</p>`,
  criteria: {
    heading: 'Comment ces sept jeux ont été retenus',
    html: `<p>Le mot « adulte » prête à confusion : il désigne tantôt des jeux à boire, tantôt des jeux d'expert. Nous nous situons entre les deux, avec des jeux modernes ou classiques qui récompensent la réflexion et la lecture des autres plutôt que l'humour gras. Quatre critères ont servi à trier.</p>
<h3>Une règle qui tient en quelques minutes</h3>
<p>Une soirée entre adultes commence souvent par une explication à des gens qui n'ont pas joué depuis longtemps. Tous les jeux de la liste se lancent sans manuel de quarante pages : la difficulté vient des choix, pas du vocabulaire. Seul The Crew demande de lire quelques pages pour la mise en route, avec ses 50 missions qui introduisent les règles peu à peu.</p>
<h3>Le bon nombre de joueurs</h3>
<p>C'est le critère qui écarte le plus de jeux. Skull, Wizard et KYRAN démarrent à trois ; Coup accepte un duel ; Schotten Totten et Star Realms sont réservés à deux. Vérifiez le nombre de joueurs avant de vous laisser séduire par un titre : un jeu à trois minimum ne sauve pas une soirée en tête-à-tête.</p>
<h3>Ce qui arrive à celui qui perd</h3>
<p>Entre adultes, l'attente est un vrai sujet : personne n'aime regarder les autres jouer. Coup et Skull éliminent des joueurs avant la fin ; KYRAN aussi, mais la partie s'arrête dès que le premier joueur n'a plus de vie. Wizard, The Crew et les duels gardent chacun dans la partie jusqu'au bout.</p>
<h3>Le ton de la soirée</h3>
<p>Le bluff pur peut piquer entre collègues ; le pari sur sa main est plus neutre, car on ne juge pas l'honnêteté des gens, seulement leur estimation. Les jeux coopératifs ne créent aucune rivalité. Si vous hésitez, commencez par le pari ou la coopération.</p>
<h3>Ce que nous n'avons pas pu mesurer</h3>
<p>Les durées sont celles des éditeurs. Elles varient selon la table, en particulier à Wizard, dont la partie compte 20 manches à trois joueurs et seulement 10 à six selon la règle d'Amigo. Les avis tranchés ci-dessous portent sur les mécaniques, pas sur un test chronométré.</p>`
  },
  games: [
    {
      id: 'kyran',
      subtitle: 'un pari obligatoire et une manche aveugle',
      type: 'Plis et paris',
      pick: 'Pour trois à six adultes qui aiment annoncer leurs plis',
      paragraphs: [
        `Chaque manche, chaque joueur annonce le nombre exact de plis qu'il va gagner. La somme des paris ne peut jamais égaler le nombre de plis : le dernier à parler ne peut pas « boucler », donc au moins un joueur se trompe à chaque manche. Un pari raté coûte autant de cartes Vie que l'écart ; ces cartes restent visibles de tous.`,
        `Les manches passent de sept à deux cartes, puis la manche Mystique se joue avec une seule carte posée sur le front : on voit celles des autres, pas la sienne, et l'on parie 1 ou 0. Quatre pouvoirs, comme la Clairvoyance Antique qui révèle en secret la plus forte carte d'un joueur, viennent perturber les plans.`,
        `Défauts assumés : KYRAN ne se joue pas à deux, la donne pèse sur chaque manche, et la partie s'arrête dès qu'un joueur n'a plus de vie. Il tient en une boîte de 11,5 × 8,5 × 2,8 cm. Comptez 30 minutes, dès 8 ans ; l'<a class="text-link" href="/minijeu.html">Initiation</a> permet d'essayer sans rien acheter.`
      ]
    },
    {
      id: 'wizard',
      subtitle: 'le barème qui punit les écarts',
      type: 'Prédiction de plis',
      pick: 'Pour les calculateurs patients, de trois à six',
      paragraphs: [
        `Wizard contient 60 cartes et fait annoncer, à chaque manche, le nombre de plis que l'on va réaliser. Selon la <a class="text-link" href="https://blog.amigo-spiele.de/content/ap/rule/06900-FR-AmigoRule.pdf" rel="noopener">règle d'Amigo</a>, l'annonce tenue rapporte 20 points plus 10 par pli ; chaque pli d'écart, en plus ou en moins, coûte 10 points. Le barème punit donc autant l'optimisme que la prudence excessive.`,
        `La règle de base ne limite pas le total des annonces ; elle propose en variante de l'interdire pour le dernier joueur à parler, comme KYRAN le fait d'office. Autre point à connaître : la partie compte 20 manches à trois joueurs et 10 à six, un écart qui change fortement la durée de la soirée. Pour des jeux sur le même principe, voyez nos <a class="text-link" href="/blog/alternatives-wizard.html">alternatives à Wizard</a>.`
      ]
    },
    {
      id: 'coup',
      subtitle: 'cinq personnages, deux vies',
      type: 'Bluff pur',
      pick: 'Pour une soirée courte, de deux à six joueurs',
      paragraphs: [
        `Chaque joueur reçoit deux personnages face cachée et revendique à son tour l'action de l'un d'eux, qu'il l'ait ou non. N'importe qui peut contester : si le joueur a menti, il perd une influence ; s'il disait vrai, c'est le contestataire qui en perd une. Quand les deux sont retournées, on est éliminé.`,
        `Coup se joue de deux à six joueurs en quinze minutes environ, ce qui le rend idéal quand la soirée est courte. Son défaut est symétrique : à six, un joueur éliminé tôt attend la fin de la partie. L'âge conseillé varie selon les fiches (13 ans chez l'éditeur américain, 10 ans chez Philibert) ; vérifiez celle de l'édition que vous achetez.`
      ]
    },
    {
      id: 'skull',
      subtitle: 'trois fleurs, un crâne',
      type: 'Bluff et enchères',
      pick: 'Pour trois à six adultes qui se connaissent bien',
      paragraphs: [
        `Chaque joueur dispose de quatre disques : trois fleurs et un crâne. On en pose un face cachée, puis l'on annonce combien de disques on pourra retourner sans tomber sur un crâne. Le joueur qui lance le défi doit commencer par retourner ses propres disques : on ne peut pas faire monter la mise gratuitement.`,
        `Le jeu a reçu l'As d'Or Jeu de l'année en 2011, ex aequo avec SOS Octopus selon la <a class="text-link" href="https://fr.wikipedia.org/wiki/As_d%27or_Jeu_de_l%27ann%C3%A9e" rel="noopener">liste de Wikipédia</a>. Il se joue en 30 minutes environ selon la <a class="text-link" href="https://www.spacecowboys-games.com/fr/game/skull/" rel="noopener">fiche de Space Cowboys</a>, de 3 à 6 joueurs. Défaut : le challenger qui échoue perd un disque ; sans disque, il est éliminé et suit la fin de la partie en spectateur.`
      ]
    },
    {
      id: 'the-crew',
      subtitle: 'cinquante missions, presque aucun mot',
      type: 'Plis coopératifs',
      pick: 'Pour trois à cinq adultes qui veulent gagner ensemble',
      paragraphs: [
        `The Crew transforme le jeu de plis en aventure coopérative : l'équipage doit accomplir 50 missions de plus en plus périlleuses, en se coordonnant sans parler de sa main. Chaque joueur dispose d'un jeton Radio, utilisable une seule fois par mission et jamais pendant un pli, pour donner une indication minimale.`,
        `Il a reçu le Kennerspiel des Jahres 2020 et l'As d'Or Expert 2021. La <a class="text-link" href="https://www.iello.fr/jeux/the-crew/" rel="noopener">fiche d'Iello</a> annonce 3 à 5 joueurs, dès 10 ans ; une variante à deux figure dans les règles. Attendez-vous à rejouer plusieurs fois la même mission : l'échec fait partie du jeu, et une table qui supporte mal de perdre ensemble risque de se lasser.`
      ]
    },
    {
      id: 'schotten-totten',
      subtitle: 'neuf bornes, un duel',
      type: 'Duel de combinaisons',
      pick: 'Pour un duel tactique entre deux adultes',
      paragraphs: [
        `Reiner Knizia a conçu Schotten Totten en 1999 : deux joueurs se disputent neuf bornes en posant jusqu'à trois cartes Clan de chaque côté. On l'emporte en contrôlant cinq bornes, ou trois bornes adjacentes. On pioche jusqu'à six cartes, et le classement des combinaisons va de la suite couleur à la simple somme.`,
        `La finesse tient au tempo : poser trop tôt informe l'adversaire, attendre laisse les bornes lui échapper. Une borne peut être revendiquée avant sa dernière carte si l'adversaire ne peut plus la battre avec les cartes déjà posées. Défaut : le jeu ne se joue qu'à deux, et une part de hasard subsiste dans la pioche.`
      ]
    },
    {
      id: 'star-realms',
      subtitle: 'un deck de départ de dix vaisseaux',
      type: 'Deckbuilding en duel',
      pick: 'Pour deux joueurs qui aiment optimiser',
      paragraphs: [
        `Star Realms oppose deux joueurs, chacun avec 50 points d'Influence et un deck de départ composé de huit Éclaireurs et deux Vipers. À chaque tour, on achète de nouveaux vaisseaux parmi quatre factions : Blob, Fédération du Commerce, Techno-Culte et Empire Galactique. Jouer plusieurs cartes de la même faction active des capacités d'alliance.`,
        `Le jeu est édité en français par Iello depuis 2016. Ses créateurs, Darwin Kastle et Rob Dougherty, figurent au Hall of Fame de Magic, selon Wikipédia. Défaut : comme dans tout deckbuilding, la partie s'accélère après quelques tours et peut basculer sur un enchaînement favorable, ce qui frustre les joueurs qui préfèrent le contrôle.`
      ]
    }
  ],
  verdict: {
    heading: 'Notre avis tranché',
    html: `<p>Pour une soirée à trois ou plus et des adultes qui aiment réfléchir, KYRAN et Wizard restent nos deux premiers choix : ils reposent sur le pari, pas sur le mensonge. KYRAN est plus court et plus nerveux ; Wizard offre un barème en points et dure plus longtemps. Pour mentir, Coup bat Skull sur la rapidité. À deux, Schotten Totten est le plus accessible. Si vous cherchez un jeu qui ne laisse personne sur le côté, The Crew est le plus sûr, tant que la table accepte de perdre ensemble.</p>`
  },
  conclusion: `<p>Un bon jeu pour adultes ne se reconnaît pas à son thème, mais à ce qu'il demande à la table : parier, mentir, coopérer ou affronter un seul adversaire. Choisissez d'abord le nombre de joueurs et le ton de la soirée, ensuite le titre. Pour tester KYRAN avant de décider, l'<a class="text-link" href="/minijeu.html">Initiation</a> est gratuite ; la boîte est à 9,99 € sur la <a class="text-link" href="/commander.html">boutique officielle</a>. Pour d'autres idées, voyez nos <a class="text-link" href="/blog/jeux-soiree-amis.html">jeux entre amis</a> et nos <a class="text-link" href="/blog/jeux-duo-couples.html">jeux à deux</a>.</p>`,
  faq: [
    {
      q: 'Qu’est-ce qu’un bon jeu de cartes pour adultes ?',
      a: `C'est un jeu qui traite la table en adultes : des décisions qui comptent, une règle expliquée en quelques minutes et des parties de moins d'une heure. Le thème importe peu ; l'humour gras n'est pas nécessaire, et les jeux de bluff ou de pari conviennent très bien.`
    },
    {
      q: 'Quel jeu de cartes pour adultes choisir à trois joueurs ?',
      a: `Skull, Wizard et KYRAN démarrent à trois joueurs. Coup accepte aussi trois joueurs. À trois, Wizard compte 20 manches selon la règle d'Amigo, donc prévoyez du temps ; KYRAN et Skull se bouclent plus vite. Notre page sur les <a class="text-link" href="/blog/jeux-3-joueurs.html">jeux à trois joueurs</a> détaille d'autres options.`
    },
    {
      q: 'Existe-t-il des jeux de cartes adultes pour deux ?',
      a: `Oui : Schotten Totten et Star Realms sont conçus pour deux joueurs, et Coup accepte un duel. KYRAN, lui, ne se joue pas à deux. Pour davantage de choix, consultez notre sélection de jeux à deux.`
    },
    {
      q: 'Quel jeu de cartes adulte coopératif choisir ?',
      a: `The Crew : un jeu de plis coopératif de 50 missions, où la communication est réduite à un jeton Radio par joueur et par mission. La boîte française annonce 3 à 5 joueurs. Voir aussi nos <a class="text-link" href="/blog/jeux-coop-cartes.html">jeux de cartes coopératifs</a>.`
    },
    {
      q: 'Les jeux de bluff conviennent-ils à une soirée entre collègues ?',
      a: `Oui, à condition de choisir le bon bluff. Les jeux de pari sur ses plis, comme KYRAN ou Wizard, jugent une estimation, pas l'honnêteté d'une personne. Le bluff pur, comme Coup, convient mieux à des amis qui se chambrent volontiers.`
    }
  ],
  related: ['jeux-bluff-pari', 'jeux-soiree-amis', 'jeux-duo-couples']
};
