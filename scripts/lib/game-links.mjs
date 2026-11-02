/**
 * Liens externes vérifiés par jeu (BGG, Wikipédia, boutique).
 * bgg : identifiant contrôlé avec api.geekdo.com/api/geekitems?objectid=<id> (nom + auteur).
 * wiki : article français s'il existe, sinon anglais (sitelinks Wikidata), réponse 200 ;
 *   pas de clé wiki quand aucun article n'existe. Dernier contrôle : 4 octobre 2026.
 * Utilisé par generate-blog.mjs pour liens et JSON-LD.
 */
export const GAME_LINKS = {
  'exploding-kittens': {
    bgg: 'https://boardgamegeek.com/boardgame/172225/exploding-kittens',
    wiki: 'https://fr.wikipedia.org/wiki/Exploding_Kittens',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=exploding+kittens',
    designer: 'Elan Lee, Matthew Inman et Shane Small',
    year: 2015,
    imageCredit: 'Visuel de la boîte — © Exploding Kittens'
  },
  cabo: {
    wiki: 'https://en.wikipedia.org/wiki/Cabo_(game)',
    shop: 'https://www.ludum.fr/jeux-de-strategie-en-famille/cabo-2557',
    designer: 'Mandy Henning et Melissa Limes',
    year: 2010,
    imageCredit: 'Visuel de la boîte — © Origames / Bézier Games'
  },
  'flip-7': {
    shop: 'https://www.ludum.fr/jeux-d-ambiance-en-famille/flip-7-8516',
    designer: 'Eric Olsen',
    year: 2025,
    imageCredit: 'Visuel de la boîte — © Catch Up Games / The OP Games'
  },
  trio: {
    shop: 'https://www.ludum.fr/jeux-d-ambiance-en-famille/trio-4542',
    year: 2023,
    imageCredit: 'Visuel de la boîte — © Cocktail Games'
  },
  dekal: {
    shop: 'https://www.ludum.fr/jeux-d-ambiance-en-famille/dekal-7670',
    designer: 'Claude Clément',
    year: 2024,
    imageCredit: 'Visuel de la boîte — © Gigamic'
  },
  cabanga: {
    shop: 'https://www.ludum.fr/jeux-d-ambiance-en-famille/cabanga-7055',
    designer: 'Michael Modler',
    year: 2024,
    imageCredit: 'Visuel de la boîte — © Gigamic / AMIGO'
  },
  papayoo: {
    shop: 'https://www.ludum.fr/jeu-dambiance/papayoo-1624',
    year: null,
    imageCredit: 'Visuel de la boîte — © Gigamic'
  },
  skyjo: {
    bgg: 'https://boardgamegeek.com/boardgame/204135/skyjo',
    wiki: 'https://fr.wikipedia.org/wiki/Skyjo',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=skyjo',
    designer: 'Alexander Bernhardt',
    year: 2015,
    imageCredit: 'Visuel de la boîte — © Magilano'
  },
  'love-letter': {
    bgg: 'https://boardgamegeek.com/boardgame/129622/love-letter',
    wiki: 'https://fr.wikipedia.org/wiki/Love_Letter_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=love+letter',
    designer: 'Seiji Kanai',
    year: 2012,
    imageCredit: 'Visuel de la boîte — © Z-Man Games / Asmodee'
  },
  hanabi: {
    bgg: 'https://boardgamegeek.com/boardgame/98778/hanabi',
    wiki: 'https://fr.wikipedia.org/wiki/Hanabi_(jeu)',
    shop: 'https://www.ludum.fr/jeu-dambiance/hanabi-496',
    designer: 'Antoine Bauza',
    year: 2010,
    imageCredit: 'Visuel de la boîte — © Cocktail Games / Abacusspiele'
  },
  kyran: {
    shop: 'https://www.amazon.fr/dp/B0G217LD87',
    rules: '/regle.html',
    dojo: '/minijeu.html',
    designer: 'Corentin Sence',
    year: 2026,
    imageCredit: 'KYRAN — jeu officiel'
  },
  'lost-cities': {
    bgg: 'https://boardgamegeek.com/boardgame/50/lost-cities',
    wiki: 'https://en.wikipedia.org/wiki/Lost_Cities',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=lost+cities',
    designer: 'Reiner Knizia',
    year: 1999,
    imageCredit: 'Visuel de la boîte — © Iello / Kosmos'
  },
  timeline: {
    bgg: 'https://boardgamegeek.com/boardgame/257284/timeline-classic',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=timeline+classic',
    designer: 'Frédéric Henry',
    year: 2011,
    imageCredit: 'Visuel de la boîte — © Asmodee'
  },
  dobble: {
    bgg: 'https://boardgamegeek.com/boardgame/63268/spot-it',
    wiki: 'https://fr.wikipedia.org/wiki/Dobble',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=dobble',
    designer: 'Denis Blanchot',
    year: 2009,
    imageCredit: 'Visuel de la boîte — © Asmodee / Zygomatic ; logo du jeu'
  },
  'jungle-speed': {
    bgg: 'https://boardgamegeek.com/boardgame/8098/jungle-speed',
    wiki: 'https://fr.wikipedia.org/wiki/Jungle_Speed',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=jungle+speed',
    designer: 'Thomas Vuarchex et Pierric Yakovenko',
    year: null,
    imageCredit: 'Visuel de la boîte — © Asmodee / Zygomatic ; logo du jeu'
  },
  uno: {
    bgg: 'https://boardgamegeek.com/boardgame/2223/uno',
    wiki: 'https://fr.wikipedia.org/wiki/Uno',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=uno',
    designer: 'Merle Robbins',
    year: 1971,
    imageCredit: 'Visuel de la boîte — © Mattel ; logo du jeu'
  },
  saboteur: {
    bgg: 'https://boardgamegeek.com/boardgame/9220/saboteur',
    wiki: 'https://fr.wikipedia.org/wiki/Saboteur_(jeu_de_soci%C3%A9t%C3%A9)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=saboteur',
    designer: 'Frédéric Moyersoen',
    year: 2004,
    imageCredit: 'Visuel de la boîte — © Gigamic'
  },
  codenames: {
    bgg: 'https://boardgamegeek.com/boardgame/178900/codenames',
    wiki: 'https://fr.wikipedia.org/wiki/Codenames',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=codenames',
    designer: 'Vlaada Chvátil',
    year: 2015,
    imageCredit: 'Visuel de la boîte — © Iello / Czech Games Edition'
  },
  skull: {
    bgg: 'https://boardgamegeek.com/boardgame/92415/skull',
    wiki: 'https://en.wikipedia.org/wiki/Skull_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=skull',
    designer: 'Hervé Marly',
    year: 2011,
    imageCredit: 'Visuel de la boîte — © Asmodee / Space Cowboys ; logo du jeu'
  },
  bang: {
    bgg: 'https://boardgamegeek.com/boardgame/3955/bang',
    wiki: 'https://fr.wikipedia.org/wiki/Bang!_(jeu_de_cartes)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=bang',
    designer: 'Emiliano Sciarra',
    year: 2002,
    imageCredit: 'Visuel de la boîte — © dV Giochi'
  },
  dixit: {
    bgg: 'https://boardgamegeek.com/boardgame/39856/dixit',
    wiki: 'https://fr.wikipedia.org/wiki/Dixit_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=dixit',
    designer: 'Jean-Louis Roubira',
    year: 2008,
    imageCredit: 'Visuel de la boîte — © Libellud'
  },
  wizard: {
    bgg: 'https://boardgamegeek.com/boardgame/1465/wizard',
    wiki: 'https://en.wikipedia.org/wiki/Wizard_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=wizard',
    designer: 'Ken Fisher',
    year: 1984,
    imageCredit: 'Visuel de la boîte — © AMIGO Spiel + Freizeit GmbH'
  },
  'colt-express': {
    bgg: 'https://boardgamegeek.com/boardgame/158899/colt-express',
    wiki: 'https://fr.wikipedia.org/wiki/Colt_Express',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=colt+express',
    designer: 'Christophe Raimbault',
    year: 2014,
    imageCredit: 'Visuel de la boîte — © Ludonaute ; logo du jeu'
  },
  'the-crew': {
    bgg: 'https://boardgamegeek.com/boardgame/284083/the-crew-the-quest-for-planet-nine',
    wiki: 'https://fr.wikipedia.org/wiki/The_Crew_:_en_qu%C3%AAte_de_la_neuvi%C3%A8me_plan%C3%A8te',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+crew',
    designer: 'Thomas Sing',
    year: 2019,
    imageCredit: 'Visuel de la boîte — © Iello / Kosmos'
  },
  // Ajoutés le 14 octobre 2026 : identifiants BGG contrôlés par api.geekdo.com, pages boutique en 200.
  'skull-king': {
    bgg: 'https://boardgamegeek.com/boardgame/150145/skull-king',
    shop: 'https://www.ludum.fr/jeux-de-strategie-en-famille/skull-king-505',
    designer: 'Brent et Jeffrey Beck',
    year: 2013,
    imageCredit: 'Visuel de la boîte — © Grandpa Beck\'s Games'
  },
  'cat-in-the-box': {
    bgg: 'https://boardgamegeek.com/boardgame/345972/cat-in-the-box-deluxe-edition',
    wiki: 'https://en.wikipedia.org/wiki/Cat_in_the_Box',
    shop: 'https://www.philibertnet.com/fr/matagot/125618-cat-in-the-box-3760372231705.html',
    designer: 'Muneyuki Yokouchi',
    year: 2020,
    imageCredit: 'Visuel de la boîte — © Matagot'
  },
  'pili-pili': {
    bgg: 'https://boardgamegeek.com/boardgame/453584/pili-pili',
    shop: 'https://www.philibertnet.com/fr/atm-gaming/158493-pili-pili-3770011991860.html',
    designer: 'Ben et JB',
    year: 2025,
    imageCredit: 'Visuel de la boîte — © ATM Gaming'
  },
  'oh-hell': {
    bgg: 'https://boardgamegeek.com/boardgame/1116/oh-hell',
    wiki: 'https://fr.wikipedia.org/wiki/Ascenseur_(jeu_de_cartes)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=oh+hell',
    designer: 'Traditionnel',
    year: null,
    imageCredit: 'Visuel de la boîte — © University Games'
  },
  '6-qui-prend': {
    bgg: 'https://boardgamegeek.com/boardgame/432/take-5',
    wiki: 'https://fr.wikipedia.org/wiki/6_qui_prend_!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=6+qui+prend',
    designer: 'Wolfgang Kramer',
    year: 1994,
    imageCredit: 'Visuel de la boîte — © Gigamic'
  },
  parade: {
    bgg: 'https://boardgamegeek.com/boardgame/56692/parade',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=parade+z-man',
    designer: 'Naoki Homma',
    year: 2007,
    imageCredit: 'Visuel de la boîte — © Z-Man Games / Filosofia (éd. FR)'
  },
  'schotten-totten': {
    bgg: 'https://boardgamegeek.com/boardgame/372/schotten-totten',
    wiki: 'https://fr.wikipedia.org/wiki/Schotten-Totten',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=schotten+totten',
    designer: 'Reiner Knizia',
    year: 1999,
    imageCredit: 'Visuel de la boîte — © Iello'
  },
  'sushi-go': {
    bgg: 'https://boardgamegeek.com/boardgame/133473/sushi-go',
    wiki: 'https://en.wikipedia.org/wiki/Sushi_Go!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=sushi+go',
    designer: 'Phil Walker-Harding',
    year: 2013,
    imageCredit: 'Visuel de la boîte — © Cocktail Games'
  },
  'the-mind': {
    bgg: 'https://boardgamegeek.com/boardgame/244992/the-mind',
    wiki: 'https://fr.wikipedia.org/wiki/The_Mind',
    shop: 'https://www.ludum.fr/jeux-d-ambiance-en-famille/the-mind-227',
    designer: 'Wolfgang Warsch',
    year: 2018,
    imageCredit: 'Visuel de la boîte — © Oya / Nürnberger-Spielkarten-Verlag'
  },
  coup: {
    bgg: 'https://boardgamegeek.com/boardgame/131357/coup',
    wiki: 'https://en.wikipedia.org/wiki/Coup_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=coup',
    designer: 'Rikki Tahta',
    year: 2012,
    imageCredit: 'Visuel de la boîte — © Ferti Games'
  },
  'just-one': {
    bgg: 'https://boardgamegeek.com/boardgame/254640/just-one',
    wiki: 'https://fr.wikipedia.org/wiki/Just_One',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=just+one',
    designer: 'Ludovic Roudy et Bruno Sautter',
    year: 2018,
    imageCredit: 'Visuel de la boîte — © Repos Production'
  },
  'star-realms': {
    bgg: 'https://boardgamegeek.com/boardgame/147020/star-realms',
    wiki: 'https://fr.wikipedia.org/wiki/Star_Realms',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=star+realms',
    designer: 'Darwin Kastle et Robert Dougherty',
    year: 2014,
    imageCredit: 'Visuel de la boîte — © White Wizard Games / IELLO ; logo du jeu'
  },
  'no-thanks': {
    bgg: 'https://boardgamegeek.com/boardgame/12942/no-thanks',
    wiki: 'https://en.wikipedia.org/wiki/No_Thanks!_(game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=no+thanks',
    designer: 'Thorsten Gimmler',
    year: 2004,
    imageCredit: 'Visuel de la boîte — © Gigamic / AMIGO'
  },
  'letter-jam': {
    bgg: 'https://boardgamegeek.com/boardgame/275467/letter-jam',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=letter+jam',
    designer: 'Ondra Skoupý',
    year: 2019,
    imageCredit: 'Visuel de la boîte — © Czech Games Edition'
  },
  'for-sale': {
    bgg: 'https://boardgamegeek.com/boardgame/172/for-sale',
    wiki: 'https://en.wikipedia.org/wiki/For_Sale_(board_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=for+sale',
    designer: 'Stefan Dorra',
    year: 1997,
    imageCredit: 'Visuel de la boîte — © Iello'
  },
  'monopoly-deal': {
    bgg: 'https://boardgamegeek.com/boardgame/40398/monopoly-deal-card-game',
    wiki: 'https://en.wikipedia.org/wiki/Monopoly_Deal',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=monopoly+deal',
    designer: 'Katharine Chapman',
    year: 2008,
    imageCredit: 'Visuel de la boîte — © Hasbro ; logo du jeu'
  },
  llama: {
    bgg: 'https://boardgamegeek.com/boardgame/266083/llama',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=llama+jeu',
    designer: 'Reiner Knizia',
    year: 2019,
    imageCredit: 'Visuel de la boîte — © Gigamic'
  },
  'the-game': {
    bgg: 'https://boardgamegeek.com/boardgame/173090/the-game',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+game+cartes',
    designer: 'Steffen Benndorf',
    year: 2015,
    imageCredit: 'Visuel de la boîte — © Oya'
  }
};

/** FAQ générique par catégorie d'article */
