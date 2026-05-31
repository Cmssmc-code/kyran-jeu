/**
 * Liens externes vérifiés par jeu (BGG, Wikipedia FR, boutique).
 * Utilisé par generate-blog.mjs pour liens et JSON-LD.
 */
export const GAME_LINKS = {
  skyjo: {
    bgg: 'https://boardgamegeek.com/boardgame/218915/skyjo',
    wiki: 'https://fr.wikipedia.org/wiki/Skyjo',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=skyjo',
    designer: 'Magilano',
    year: 2015,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'love-letter': {
    bgg: 'https://boardgamegeek.com/boardgame/129622/love-letter',
    wiki: 'https://fr.wikipedia.org/wiki/Love_Letter_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=love+letter',
    designer: 'Seiji Kanai',
    year: 2012,
    imageCredit: 'Photo — Philibert / AEG'
  },
  hanabi: {
    bgg: 'https://boardgamegeek.com/boardgame/98778/hanabi',
    wiki: 'https://fr.wikipedia.org/wiki/Hanabi_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=hanabi',
    designer: 'Antoine Bauza',
    year: 2010,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  kyran: {
    shop: 'https://www.amazon.fr/dp/B0G217LD87',
    rules: '/regle.html',
    dojo: '/minijeu.html',
    designer: 'Corentin Sence',
    year: 2024,
    imageCredit: 'KYRAN — jeu officiel'
  },
  'lost-cities': {
    bgg: 'https://boardgamegeek.com/boardgame/50/lost-cities',
    wiki: 'https://fr.wikipedia.org/wiki/Lost_Cities',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=lost+cities',
    designer: 'Reiner Knizia',
    year: 1999,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  timeline: {
    bgg: 'https://boardgamegeek.com/boardgame/257284/timeline-classic',
    wiki: 'https://fr.wikipedia.org/wiki/Timeline_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=timeline+classic',
    designer: 'Frédéric Henry',
    year: 2011,
    imageCredit: 'Photo — Philibert / éditeur'
  },
  dobble: {
    bgg: 'https://boardgamegeek.com/boardgame/63268/dobble',
    wiki: 'https://fr.wikipedia.org/wiki/Dobble',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=dobble',
    designer: 'Denis Blanchot',
    year: 2009,
    imageCredit: 'Photo — Philibert / Asmodee'
  },
  'jungle-speed': {
    bgg: 'https://boardgamegeek.com/boardgame/8098/jungle-speed',
    wiki: 'https://fr.wikipedia.org/wiki/Jungle_Speed',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=jungle+speed',
    designer: 'Thomas Vuarchex',
    year: 1991,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  uno: {
    bgg: 'https://boardgamegeek.com/boardgame/2223/uno',
    wiki: 'https://fr.wikipedia.org/wiki/Uno_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=uno',
    designer: 'Merle Robbins',
    year: 1971,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  saboteur: {
    bgg: 'https://boardgamegeek.com/boardgame/9220/saboteur',
    wiki: 'https://fr.wikipedia.org/wiki/Saboteur_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=saboteur',
    designer: 'Frédéric Moyersoen',
    year: 2004,
    imageCredit: 'Photo — Philibert / Amigo'
  },
  codenames: {
    bgg: 'https://boardgamegeek.com/boardgame/178900/codenames',
    wiki: 'https://fr.wikipedia.org/wiki/Codenames',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=codenames',
    designer: 'Vlaada Chvátil',
    year: 2015,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  skull: {
    bgg: 'https://boardgamegeek.com/boardgame/92491/skull',
    wiki: 'https://fr.wikipedia.org/wiki/Skull_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=skull',
    designer: 'Hervé Marly',
    year: 2011,
    imageCredit: 'Photo — Asmodee'
  },
  bang: {
    bgg: 'https://boardgamegeek.com/boardgame/3955/bang',
    wiki: 'https://fr.wikipedia.org/wiki/Bang!_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=bang',
    designer: 'Emiliano Sciarra',
    year: 2002,
    imageCredit: 'Photo — dV Giochi'
  },
  dixit: {
    bgg: 'https://boardgamegeek.com/boardgame/39853/dixit',
    wiki: 'https://fr.wikipedia.org/wiki/Dixit_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=dixit',
    designer: 'Jean-Louis Roubira',
    year: 2008,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  wizard: {
    bgg: 'https://boardgamegeek.com/boardgame/15257/wizard',
    wiki: 'https://en.wikipedia.org/wiki/Wizard_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=wizard',
    designer: 'Ken Fisher',
    year: 1984,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'colt-express': {
    bgg: 'https://boardgamegeek.com/boardgame/158098/colt-express',
    wiki: 'https://fr.wikipedia.org/wiki/Colt_Express',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=colt+express',
    designer: 'Christophe Raimbault',
    year: 2014,
    imageCredit: 'Photo — Ludonaute'
  },
  'the-crew': {
    bgg: 'https://boardgamegeek.com/boardgame/284083/the-crew-mission-deep-sea',
    wiki: 'https://fr.wikipedia.org/wiki/The_Crew',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+crew',
    designer: 'Thomas Sing',
    year: 2019,
    imageCredit: 'Photo — KOSMOS'
  },
  'oh-hell': {
    bgg: 'https://boardgamegeek.com/boardgame/21768/oh-hell',
    wiki: 'https://fr.wikipedia.org/wiki/Oh_hell',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=oh+hell',
    designer: 'Traditionnel',
    year: null,
    imageCredit: 'Illustration — cartes à jouer'
  },
  '6-qui-prend': {
    bgg: 'https://boardgamegeek.com/boardgame/432/take-6',
    wiki: 'https://fr.wikipedia.org/wiki/6_qui_prend!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=6+qui+prend',
    designer: 'Wolfgang Kramer',
    year: 1994,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  parade: {
    bgg: 'https://boardgamegeek.com/boardgame/93029/parade',
    wiki: 'https://fr.wikipedia.org/wiki/Parade_(jeu_de_cartes)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=parade+z-man',
    designer: 'Naoki Homma',
    year: 2007,
    imageCredit: 'Photo — Z-Man Games'
  },
  'schotten-totten': {
    bgg: 'https://boardgamegeek.com/boardgame/258/schotten-totten',
    wiki: 'https://fr.wikipedia.org/wiki/Schotten_Totten',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=schotten+totten',
    designer: 'Reiner Knizia',
    year: 1999,
    imageCredit: 'Photo — KOSMOS'
  },
  'sushi-go': {
    bgg: 'https://boardgamegeek.com/boardgame/133473/sushi-go',
    wiki: 'https://fr.wikipedia.org/wiki/Sushi_Go!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=sushi+go',
    designer: 'Phil Walker-Harding',
    year: 2013,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'the-mind': {
    bgg: 'https://boardgamegeek.com/boardgame/244992/the-mind',
    wiki: 'https://fr.wikipedia.org/wiki/The_Mind',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+mind',
    designer: 'Wolfgang Warsch',
    year: 2018,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  coup: {
    bgg: 'https://boardgamegeek.com/boardgame/131357/coup',
    wiki: 'https://fr.wikipedia.org/wiki/Coup_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=coup',
    designer: 'Rikki Tahta',
    year: 2012,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'just-one': {
    bgg: 'https://boardgamegeek.com/boardgame/254640/just-one',
    wiki: 'https://fr.wikipedia.org/wiki/Just_One',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=just+one',
    designer: 'Steven Du Vernet',
    year: 2018,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'star-realms': {
    bgg: 'https://boardgamegeek.com/boardgame/147020/star-realms',
    wiki: 'https://fr.wikipedia.org/wiki/Star_Realms',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=star+realms',
    designer: 'Robert Dougherty',
    year: 2014,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'no-thanks': {
    bgg: 'https://boardgamegeek.com/boardgame/12942/no-thanks',
    wiki: 'https://fr.wikipedia.org/wiki/No_Thanks!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=no+thanks',
    designer: 'Thorsten Gimmler',
    year: 2004,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'letter-jam': {
    bgg: 'https://boardgamegeek.com/boardgame/268864/letter-jam',
    wiki: 'https://fr.wikipedia.org/wiki/Letter_Jam',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=letter+jam',
    designer: 'Ondra Skoupý',
    year: 2019,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'for-sale': {
    bgg: 'https://boardgamegeek.com/boardgame/172/For-Sale',
    wiki: 'https://fr.wikipedia.org/wiki/For_Sale_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=for+sale',
    designer: 'Stefan Dorra',
    year: 1997,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'monopoly-deal': {
    bgg: 'https://boardgamegeek.com/boardgame/142379/monopoly-deal',
    wiki: 'https://fr.wikipedia.org/wiki/Monopoly_Deal',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=monopoly+deal',
    designer: 'Hasbro',
    year: 2014,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  llama: {
    bgg: 'https://boardgamegeek.com/boardgame/266083/llama',
    wiki: 'https://fr.wikipedia.org/wiki/Llama_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=llama+jeu',
    designer: 'Reiner Knizia',
    year: 2019,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'the-game': {
    bgg: 'https://boardgamegeek.com/boardgame/173090/the-game',
    wiki: 'https://fr.wikipedia.org/wiki/The_Game_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+game+cartes',
    designer: 'Steffen Benndorf',
    year: 2015,
    imageCredit: 'Photo — Philibert / Oya'
  }
};

/** FAQ générique par catégorie d'article */
export const ARTICLE_FAQ = {
  Alternatives: [
    { q: 'Comment choisir une alternative à un jeu qu\'on adore déjà ?', a: 'Identifiez ce qui vous plaît : durée, nombre de joueurs, niveau de chance ou d\'interaction. Testez d\'abord un titre proche, puis élargissez.' },
    { q: 'Faut-il acheter plusieurs jeux similaires ?', a: 'Un ou deux titres complémentaires suffisent souvent. Variez les mécaniques (plis, bluff, coop) plutôt que d\'empiler les clones.' }
  ],
  Apéro: [
    { q: 'Quel jeu de cartes pour un apéro de 6 personnes ?', a: 'Privilégiez des règles en 5 minutes, peu de setup et une durée sous 30 min : Jungle Speed, Uno, Skull ou KYRAN selon l\'ambiance.' },
    { q: 'Peut-on enchaîner plusieurs jeux en une soirée ?', a: 'Oui : commencez par un jeu d\'action rapide, enchaînez avec un pli ou un bluff, terminez par un titre plus calme si besoin.' }
  ],
  Famille: [
    { q: 'À partir de quel âge un enfant peut jouer à ces jeux ?', a: 'La plupart des titres listés conviennent dès 8 ans ; Dobble dès 6 ans. Vérifiez l\'âge sur la boîte et adaptez les règles si nécessaire.' }
  ],
  Cadeaux: [
    { q: 'Quel budget pour un jeu de société cadeau ?', a: 'Entre 12 et 20 €, vous trouvez d\'excellents jeux de cartes. Au-delà de 25 €, orientez-vous vers des titres avec matériel premium (Dixit, Colt Express).' }
  ],
  Cartes: [
    { q: 'Jeux de cartes pas chers : où acheter ?', a: 'Boutiques spécialisées (Philibert, Ludum), grandes surfaces culturelles ou Amazon. Comparez les promos avant Noël et les soldes.' }
  ],
  Soirée: [
    { q: 'Quel jeu choisir pour une soirée entre amis ?', a: 'Variez : un jeu d\'ambiance rapide (Jungle Speed, Codenames), puis un titre plus stratégique (Skull, KYRAN). Adaptez au niveau d\'énergie du groupe.' },
    { q: 'Combien de temps dure une soirée jeux réussie ?', a: 'Prévoyez 2–3 jeux de 20–40 min plutôt qu\'un marathon. Les articles KYRAN listent des durées réalistes par titre.' }
  ],
  'Stratégie': [
    { q: 'Qu\'est-ce qu\'un jeu de stratégie légère ?', a: 'Un titre avec de vraies décisions tactiques, des règles abordables en une dizaine de minutes et des parties sous 45 minutes.' },
    { q: 'Stratégie légère vs jeu expert : comment trancher ?', a: 'Si votre groupe veut réfléchir sans lire un manuel de 20 pages, restez sur la stratégie légère. Réservez l\'expert pour les soirées dédiées.' }
  ],
  Coop: [
    { q: 'Les jeux coopératifs conviennent-ils aux débutants ?', a: 'Oui, surtout Hanabi, The Mind ou The Game : tout le monde gagne ou perd ensemble, ce qui réduit la frustration des novices.' },
    { q: 'Comment éviter le « quarterbacking » en coop ?', a: 'Interdisez les ordres directs, limitez le temps de parole ou choisissez des jeux avec information cachée (Hanabi, Letter Jam).' }
  ]
};
