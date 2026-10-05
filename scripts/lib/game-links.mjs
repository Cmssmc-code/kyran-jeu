/**
 * Liens externes vérifiés par jeu (BGG, Wikipédia, boutique).
 * bgg : identifiant contrôlé avec api.geekdo.com/api/geekitems?objectid=<id> (nom + auteur).
 * wiki : article français s'il existe, sinon anglais (sitelinks Wikidata), réponse 200 ;
 *   pas de clé wiki quand aucun article n'existe. Dernier contrôle : 4 octobre 2026.
 * Utilisé par generate-blog.mjs pour liens et JSON-LD.
 */
export const GAME_LINKS = {
  skyjo: {
    bgg: 'https://boardgamegeek.com/boardgame/204135/skyjo',
    wiki: 'https://fr.wikipedia.org/wiki/Skyjo',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=skyjo',
    designer: 'Alexander Bernhardt',
    year: 2015,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'love-letter': {
    bgg: 'https://boardgamegeek.com/boardgame/129622/love-letter',
    wiki: 'https://fr.wikipedia.org/wiki/Love_Letter_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=love+letter',
    designer: 'Seiji Kanai',
    year: 2012,
    imageCredit: 'Visuel de la boîte — Z-Man Games (via Philibert)'
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
    year: 2026,
    imageCredit: 'KYRAN — jeu officiel'
  },
  'lost-cities': {
    bgg: 'https://boardgamegeek.com/boardgame/50/lost-cities',
    wiki: 'https://en.wikipedia.org/wiki/Lost_Cities',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=lost+cities',
    designer: 'Reiner Knizia',
    year: 1999,
    imageCredit: 'Photo — zizou man (Flickr), CC BY 2.0, via Wikimedia Commons'
  },
  timeline: {
    bgg: 'https://boardgamegeek.com/boardgame/257284/timeline-classic',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=timeline+classic',
    designer: 'Frédéric Henry',
    year: 2011,
    imageCredit: 'Visuel de la boîte — Zygomatic / Asmodee (via Philibert)'
  },
  dobble: {
    bgg: 'https://boardgamegeek.com/boardgame/63268/spot-it',
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
    imageCredit: 'Photo — Nicosmos, Wikimedia Commons, CC BY-SA 3.0'
  },
  uno: {
    bgg: 'https://boardgamegeek.com/boardgame/2223/uno',
    wiki: 'https://fr.wikipedia.org/wiki/Uno',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=uno',
    designer: 'Merle Robbins',
    year: 1971,
    imageCredit: 'Logo — Mattel, Wikimedia Commons (domaine public)'
  },
  saboteur: {
    bgg: 'https://boardgamegeek.com/boardgame/9220/saboteur',
    wiki: 'https://fr.wikipedia.org/wiki/Saboteur_(jeu_de_soci%C3%A9t%C3%A9)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=saboteur',
    designer: 'Frédéric Moyersoen',
    year: 2004,
    imageCredit: 'Photo — Philibert / Gigamic'
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
    bgg: 'https://boardgamegeek.com/boardgame/92415/skull',
    wiki: 'https://en.wikipedia.org/wiki/Skull_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=skull',
    designer: 'Hervé Marly',
    year: 2011,
    imageCredit: 'Photo — Asmodee'
  },
  bang: {
    bgg: 'https://boardgamegeek.com/boardgame/3955/bang',
    wiki: 'https://fr.wikipedia.org/wiki/Bang!_(jeu_de_cartes)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=bang',
    designer: 'Emiliano Sciarra',
    year: 2002,
    imageCredit: 'Photo — dV Giochi'
  },
  dixit: {
    bgg: 'https://boardgamegeek.com/boardgame/39856/dixit',
    wiki: 'https://fr.wikipedia.org/wiki/Dixit_(jeu)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=dixit',
    designer: 'Jean-Louis Roubira',
    year: 2008
  },
  wizard: {
    bgg: 'https://boardgamegeek.com/boardgame/1465/wizard',
    wiki: 'https://en.wikipedia.org/wiki/Wizard_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=wizard',
    designer: 'Ken Fisher',
    year: 1984,
    imageCredit: 'Logo — Ken Fisher, vectorisé par TheWanderingTraders, Wikimedia Commons, CC BY-SA 4.0'
  },
  'colt-express': {
    bgg: 'https://boardgamegeek.com/boardgame/158899/colt-express',
    wiki: 'https://fr.wikipedia.org/wiki/Colt_Express',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=colt+express',
    designer: 'Christophe Raimbault',
    year: 2014,
    imageCredit: 'Visuel promotionnel (illustration) — Ludonaute'
  },
  'the-crew': {
    bgg: 'https://boardgamegeek.com/boardgame/284083/the-crew-the-quest-for-planet-nine',
    wiki: 'https://fr.wikipedia.org/wiki/The_Crew_:_en_qu%C3%AAte_de_la_neuvi%C3%A8me_plan%C3%A8te',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+crew',
    designer: 'Thomas Sing',
    year: 2019,
    imageCredit: 'Photo — KOSMOS'
  },
  'oh-hell': {
    bgg: 'https://boardgamegeek.com/boardgame/1116/oh-hell',
    wiki: 'https://fr.wikipedia.org/wiki/Ascenseur_(jeu_de_cartes)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=oh+hell',
    designer: 'Traditionnel',
    year: null,
    imageCredit: 'Photo — Newwhist, Wikimedia Commons, CC BY-SA 4.0'
  },
  '6-qui-prend': {
    bgg: 'https://boardgamegeek.com/boardgame/432/take-5',
    wiki: 'https://fr.wikipedia.org/wiki/6_qui_prend_!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=6+qui+prend',
    designer: 'Wolfgang Kramer',
    year: 1994,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  parade: {
    bgg: 'https://boardgamegeek.com/boardgame/56692/parade',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=parade+z-man',
    designer: 'Naoki Homma',
    year: 2007,
    imageCredit: 'Photo — Z-Man Games'
  },
  'schotten-totten': {
    bgg: 'https://boardgamegeek.com/boardgame/372/schotten-totten',
    wiki: 'https://fr.wikipedia.org/wiki/Schotten-Totten',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=schotten+totten',
    designer: 'Reiner Knizia',
    year: 1999,
    imageCredit: 'Photo — PS Games'
  },
  'sushi-go': {
    bgg: 'https://boardgamegeek.com/boardgame/133473/sushi-go',
    wiki: 'https://en.wikipedia.org/wiki/Sushi_Go!',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=sushi+go',
    designer: 'Phil Walker-Harding',
    year: 2013,
    imageCredit: 'Visuel de la boîte (édition française) — éditeur'
  },
  'the-mind': {
    bgg: 'https://boardgamegeek.com/boardgame/244992/the-mind',
    wiki: 'https://fr.wikipedia.org/wiki/The_Mind',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+mind',
    designer: 'Wolfgang Warsch',
    year: 2018
  },
  coup: {
    bgg: 'https://boardgamegeek.com/boardgame/131357/coup',
    wiki: 'https://en.wikipedia.org/wiki/Coup_(card_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=coup',
    designer: 'Rikki Tahta',
    year: 2012
    // Pas d'image : aucune photo libre de Coup trouvée ; l'ancienne (une planche de loterie
    // ancienne venue d'une recherche Commons) n'avait rien à voir avec le jeu.
  },
  'just-one': {
    bgg: 'https://boardgamegeek.com/boardgame/254640/just-one',
    wiki: 'https://fr.wikipedia.org/wiki/Just_One',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=just+one',
    designer: 'Ludovic Roudy et Bruno Sautter',
    year: 2018
  },
  'star-realms': {
    bgg: 'https://boardgamegeek.com/boardgame/147020/star-realms',
    wiki: 'https://fr.wikipedia.org/wiki/Star_Realms',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=star+realms',
    designer: 'Darwin Kastle et Robert Dougherty',
    year: 2014,
    imageCredit: 'Photo — Wikimedia Commons'
  },
  'no-thanks': {
    bgg: 'https://boardgamegeek.com/boardgame/12942/no-thanks',
    wiki: 'https://en.wikipedia.org/wiki/No_Thanks!_(game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=no+thanks',
    designer: 'Thorsten Gimmler',
    year: 2004,
    imageCredit: 'Photo — CMYK (édition Magenta), Wikimedia Commons'
  },
  'letter-jam': {
    bgg: 'https://boardgamegeek.com/boardgame/275467/letter-jam',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=letter+jam',
    designer: 'Ondra Skoupý',
    year: 2019,
    imageCredit: 'Visuel de la boîte (édition française) — Czech Games Edition / IELLO'
  },
  'for-sale': {
    bgg: 'https://boardgamegeek.com/boardgame/172/for-sale',
    wiki: 'https://en.wikipedia.org/wiki/For_Sale_(board_game)',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=for+sale',
    designer: 'Stefan Dorra',
    year: 1997
  },
  'monopoly-deal': {
    bgg: 'https://boardgamegeek.com/boardgame/40398/monopoly-deal-card-game',
    wiki: 'https://en.wikipedia.org/wiki/Monopoly_Deal',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=monopoly+deal',
    designer: 'Katharine Chapman',
    year: 2008,
    imageCredit: 'Visuel de la boîte (édition française) — Hasbro Gaming'
  },
  llama: {
    bgg: 'https://boardgamegeek.com/boardgame/266083/llama',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=llama+jeu',
    designer: 'Reiner Knizia',
    year: 2019
  },
  'the-game': {
    bgg: 'https://boardgamegeek.com/boardgame/173090/the-game',
    shop: 'https://www.philibertnet.com/fr/recherche?controller=search&search_query=the+game+cartes',
    designer: 'Steffen Benndorf',
    year: 2015,
    imageCredit: 'Photo — Philibert / Oya'
  }
};

/** FAQ générique par catégorie d'article */
