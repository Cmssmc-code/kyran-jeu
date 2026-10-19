# Passes éditoriales du blog

Le blog reçoit trois passes par semaine (lundi, mercredi, vendredi). À 6 h 50, heure de Paris, la
routine « Blog KYRAN passes lun/mer/ven (session dédiée) » réveille la session « Blog KYRAN —
passes lun/mer/ven (session dédiée) », qui a ce dépôt attaché (voir `_notes/memoire.md` § 14). Chaque passe produit **un** article neuf ou **un**
rafraîchissement, ou rien si aucun sujet ne tient. Le propriétaire a choisi, le 4 octobre 2026, une
publication entièrement automatique, sans relecture humaine : la passe ouvre sa PR puis la fusionne
elle-même dès que toutes ces conditions sont réunies : CI verte sur le dernier commit, aucun conflit,
aucun commentaire de relecture ouvert, et chaque point incertain sourcé ou retiré de l'article. Sinon
la PR reste ouverte et dit pourquoi. Publication visée : 9 h 30 le jour de la passe.

Ce fichier est lu en premier par chaque passe. Mettez-le à jour dans la PR de la passe : une ligne au
journal, et la liste « En attente » si un sujet est traité ou découvert.

## Protocole

1. **S'orienter** : `CLAUDE.md`, `_notes/lecon.md`, `docs/SEO-GEO.md` (dont le § 9 : audit Search
   Console du 4 octobre 2026, ce sont les données réelles disponibles), `scripts/content/README.md`
   (structure propre à chaque article : `layout`, `headings`, `authorNote`), la liste des articles
   (`scripts/content/roster.json`, y compris `redirects`, et `seo-keywords.json`) et les **PR ouvertes**.
2. **Juste avant d'écrire, puis juste avant de pousser** : `git fetch origin main` et relisez la liste
   des PR ouvertes ou fusionnées du jour. Une autre session peut retravailler le même article en
   parallèle (voir « Pièges connus »).
3. **Choisir** : données réelles d'abord (§ 9 : pages « explorées / détectées, non indexées ») ;
   sinon rafraîchir un article vieillissant ou rédigé à la main ; un article neuf seulement pour une
   intention de recherche absente du blog.
   **Depuis l'audit commercial du 12 octobre 2026** (`docs/rapports/audit-ventes-2026-10-12.md`),
   à valeur égale, préférez les sujets à intention d'achat (cadeau, Noël, jeu à moins de 15 €, jeu
   pour un repas de famille) aux listes « jeux comme X », qui attirent du trafic sans acheteurs.
   **Variété (demandée par le propriétaire le 14 octobre 2026)** : les passes reprennent trop souvent les
   mêmes jeux. Relevé du 14 octobre sur 31 articles (`games.json` ne compte que 31 jeux, tous déjà
   utilisés) : KYRAN 29 articles (produit du site, c'est voulu, mais une ligne suffit), Skull 15,
   Love Letter 11, Skyjo 11, The Crew 10, No Thanks! 9, Coup 9. Règle : un article neuf ou rafraîchi ne
   reprend pas par défaut ces jeux ; il comporte **au moins deux jeux absents des trois derniers
   articles du journal** et, quand le sujet s'y prête, au moins un jeu absent de `games.json`, ajouté
   avec ses faits sourcés (joueurs, âge, durée, prix, auteur, image avec crédit, lien BGG contrôlé).
   Relancer le relevé avant de choisir :
   `grep -ho "id: \`[a-z0-9-]*\`" scripts/content/blog/*.mjs | sort | uniq -c | sort -rn`.
4. **Rechercher** : au moins 5 sources fiables réellement ouvertes (règles officielles en PDF, fiches
   éditeurs, Philibert…). Faits KYRAN : uniquement le dépôt. Aucun chiffre, prix, règle ou citation
   sans source liée.
5. **Rédiger** au format généré (`scripts/content/blog/<slug>.mjs`), avec une structure propre à
   l'article (le validateur signale le gabarit par défaut), sans jamais éditer le HTML généré.
   KYRAN : réponse honnête, jamais « sans élimination » ni « sans hasard ».
6. **Contrôler** : relecture adversariale de chaque fait, liens (200), `node scripts/validate-articles.mjs <slug>`,
   `npm run build`, `npm test`.
7. **PR** : sources, images (crédit + licence), section « À vérifier par le relecteur », résultat des
   tests ; puis fusion aux conditions ci-dessus. Personne ne relit : un fait sans source fiable est
   retiré avant la fusion, jamais laissé à un relecteur.
8. **Après la fusion** : vérifiez la page en ligne (kyran-jeu.fr/blog/<slug>.html, sitemap, flux).

## Pièges connus

- **Deux sessions sur le même article.** Le 4 octobre 2026, une passe a réécrit `jeux-cartes-6-joueurs`
  pendant que la PR #16 (audit Search Console) le fusionnait avec l'article à cinq joueurs et le
  faisait entrer dans `main`. La passe a dû abandonner sa version pour celle de `main` et n'y porter
  que ses corrections vérifiées. D'où l'étape 2 du protocole.
- Ne lancez pas le build avec `SITE_TODAY` dans le futur : `check-site` refuse un `lastmod` futur. Un
  rafraîchissement garde sa `date` de première publication ; `dateModified` prend la date du build.
- Un article rédigé à la main passe au format généré en déplaçant son slug de `handwritten` vers
  `generated` dans `roster.json` et en retirant son entrée de `handwritten.json` (même URL).
- Liens externes : peu nombreux (une référence par jeu depuis le § 9, plus les sources citées).
- BoardGameGeek bloque les accès automatiques (403) ; vérifiez un identifiant avec
  `https://api.geekdo.com/api/geekitems?objectid=<id>&objecttype=thing&subtype=boardgame`. Les PDF de
  règles des éditeurs (Gigamic, IELLO, Amigo, Ludonaute, Space Cowboys) répondent et se lisent avec
  `pdftotext`.
- Changer un prix dans `games.json` modifie tous les articles qui citent ce jeu : vérifiez d'abord
  qu'aucun texte d'article ne cite l'ancien prix (`grep` dans `scripts/content/blog/`).
- **Ce qu'une relecture adversariale a trouvé dans une passe publiée sans relecture** (#20, vérifiée
  le 5 octobre 2026) : un prix attribué à la mauvaise catégorie (Skull « ex aequo avec SOS Octopus »,
  qui avait l'As d'Or Enfant : citez le palmarès officiel, pas une liste) ; « conçu exclusivement
  pour deux » alors que la règle de Star Realms prévoit le multijoueur ; un pronom qui change le sens
  (« ces cartes » renvoyait aux cartes Vie perdues) ; KYRAN rangé parmi les jeux qui « éliminent
  avant la fin » ; une image de jeu jamais regardée (celle de Coup était une planche de loterie
  ancienne) et des crédits faux (« Photo — KOSMOS » sur une boîte PS Games, « Photo » sur un logo).
  Regardez chaque image avec l'outil de lecture et vérifiez son crédit sur la page Commons.
- `scripts/download-blog-images.mjs` ne se rabat plus sur une recherche Commons : sans fichier nommé ni
  image de la page Wikipédia, le jeu reste sans image, et sa fiche s'affiche sans figure.

## Journal

| Date | Type | Article | Mot-clé principal | PR |
|---|---|---|---|---|
| 2026-10-04 | Corrections sur l'article « 5 ou 6 joueurs » de #16 (la réécriture « 6 joueurs » de la passe a été abandonnée), liens des fiches, prix | `jeux-cartes-6-joueurs` | jeu de cartes 6 joueurs | [#18](https://github.com/Cmssmc-code/kyran-jeu/pull/18) |
| 2026-10-04 | Rafraîchissement : passage au format généré, fiche KYRAN corrigée (« 2024 » → sortie 31 janvier 2026), 7 jeux revérifiés (Love Letter retiré). **Sujet pris : ne pas le reprendre.** | `jeux-cartes-adultes` | jeu de cartes adulte | [#20](https://github.com/Cmssmc-code/kyran-jeu/pull/20) |
| 2026-10-05 | Rafraîchissement : faits des 8 jeux revérifiés, fiche KYRAN corrigée (manche Mystique), « Skyjo supprime la défausse » corrigé, Love Letter (édition actuelle), structure propre. **Sujet pris : ne pas le reprendre.** | `alternatives-uno` | alternatives à uno | [#22](https://github.com/Cmssmc-code/kyran-jeu/pull/22) |
| 2026-10-05 | Corrections après vérification adversariale de #20 (20 erreurs confirmées par deux contradicteurs indépendants) : As d'Or de Skull, image de Coup sans rapport avec le jeu (retirée), Star Realms « réservé à deux », élimination à KYRAN, variante de Wizard, crédits d'image ; descriptions JSON-LD coupées sur une fin de phrase | `jeux-cartes-adultes` | jeu de cartes adulte | (cette PR) |

| 2026-10-05 | Contrôle visuel des 31 images de jeux : 18 problèmes confirmés. Crédits corrigés (12 jeux) ; images retirées des fiches Just One (boîte de PS2), For Sale (photo de livre), Llama (autre jeu), Dixit (Dixit Jinx), The Mind (source inconnue). | toutes les fiches | — | (cette PR) |
| 2026-10-07 | Correction : images d'en-tête fausses remplacées par des visuels KYRAN du dépôt (`for-sale.jpg` = photo ancienne sans rapport, `dixit.jpg` = Dixit Jinx, `the-mind.jpg` = licence inconnue), légendes qui décrivent l'image. **Sujet pris : ne pas le reprendre.** | `jeux-draft-encheres`, `jeux-comme-dixit`, `jeux-famille`, `jeux-memoire-concentration` | — | (cette PR) |
| 2026-10-07 | Rattrapage du mercredi : rafraîchissement, Love Letter précisé (édition classique 16 cartes, 2 à 4 joueurs ; Z-Man 2025 21 cartes, 2 à 6 ; même réglage à trois : 5 faveurs, 1 carte écartée). Sources : 64 Ounce Games, Asmodee (Eco Box), regles-du-jeu.net, Opinionated Gamers, Play-in, Esprit Jeu. | `jeux-3-joueurs` | jeux de cartes 3 joueurs | (cette PR) |
| 2026-10-12 | Rafraîchissement : faits des 7 jeux revérifiés (Dobble, Coup, The Mind, Skyjo, No Thanks!, Love Letter, KYRAN du dépôt). Love Letter : deux éditions (16 cartes / 2 à 4 ; Z-Man 2025 : 21 cartes / 2 à 6), durée 15 à 20 min ; âge de Coup retiré du texte (13+ chez Indie Boards & Cards, 10+ chez d'autres revendeurs). Sources : Esprit Jeu (Dobble, Skyjo, Non Merci, Love Letter), Miniature Market (Coup), Play-in (The Mind, Love Letter), Asmodee (Love Letter), 64 Ounce Games. **Sujet pris : ne pas le reprendre.** | `jeux-vacances-voyage` | jeux de cartes vacances | (cette PR) |
| 2026-10-12 | Rafraîchissement (page « explorée, non indexée » depuis le 5 sept., rapport SEO/GEO du 11 oct.) : variante « plus ou moins 1 » de Wizard corrigée, The Crew 3-5 joueurs (variante à deux), prix d'Oh Hell retiré (non sourcé), « KYRAN héritier du Whist » corrigé (Whist ≠ Whist 22), vocabulaire et sources liées, structure propre. **Sujet pris : ne pas le reprendre.** | `jeux-plis-comparatif` | jeu de cartes où l'on annonce son nombre de plis | (cette PR) |
| 2026-10-12 | Article neuf (intention absente du blog : adolescents) : 6 jeux (Skull, Saboteur, Jungle Speed, 6 qui prend!, Skyjo, KYRAN), structure propre (3 groupes par ambiance, avis d'abord). Sources ouvertes : Esprit Jeu (Saboteur), Play-in (Skyjo ; 6 qui prend! édition 30 ans), Victory Point Games (Skull), Bonne Promo (Jungle Speed) ; âges divergents entre fiches, signalés dans le texte. **Sujet pris : ne pas le reprendre.** | `jeux-cartes-ados` | jeux de cartes pour ados | (cette PR) |
| 2026-10-12 | **Audit factuel de tout le blog** (10 relecteurs indépendants : 9 lots d'articles, `games.json` et liens ; sources ouvertes : règles Mattel et Skyjo en PDF, Pagat, Wikipédia, BGG via geekdo, Esprit Jeu, Play-in, 64 Ounce Games, Iello, Indie Boards & Cards, Stanford Center on Longevity). ~150 corrections : Wizard (le 13, premier Magicien seul gagnant, Fous), The Crew (3 à 5, variante à deux), Love Letter (deux éditions partout), Star Realms (variantes à plusieurs), gagnant de KYRAN (plus de vies), Timeline (égalité de fin de tour, 2 à 6), Oh Hell (prix retiré), Jungle Speed (auteur, année retirée), prix `games.json` (Dobble, Uno, Timeline, The Crew, Wizard…), âge de Coup (13+ éditeur), article science (le −15 % de démence n'est plus significatif après ajustement MMSE et dépression ; vitesse de traitement). Affirmations d'opinion non sourcées retirées. | tous les articles | — | (cette PR) |
| 2026-10-12 | Article neuf (intention absente du blog : seniors et grands-parents) : 6 jeux (Schotten Totten, No Thanks!, Uno, Skyjo, 6 qui prend!, KYRAN), structure propre (3 groupes selon la table), aucune promesse de santé. Sources ouvertes : Esprit Jeu (Schotten Totten, Uno), 64 Ounce Games (No Thanks!), notice Mattel et règle française de Skyjo (PDF lus), Play-in (Skyjo, 6 qui prend!). Relecture adversariale indépendante (17 constats) appliquée. **Sujet pris : ne pas le reprendre.** | `jeux-cartes-seniors` | jeux de cartes pour seniors | (cette PR) |
| 2026-10-14 | Rafraîchissement **Noël 2026** (priorité 0) : date limite du site (16 décembre, `commander.html`, CGV art. 5), prix revérifiés (Dixit 28,95 € et 3 à 8 joueurs ; Timeline Clutch Box 2 à 6 joueurs ; Codenames 21,50 € et fiches divergentes 2-8 / 4-8, 10 à 14 ans ; The Crew 16,50 € ; Hanabi 2 à 5), prix Amazon de KYRAN retiré, KYRAN présenté avec le lien commercial du site dit en clair. Sources ouvertes : Philibert (Dixit, Timeline, Lost Cities, The Crew, Hanabi), Asmodee Canada (Codenames CGE), Bonne Promo (Codenames IELLO 2025). **Sujet pris : ne pas le reprendre.** | `cadeau-noel` | cadeau noël jeu de cartes | (cette PR) |
| 2026-10-16 | Rafraîchissement (cluster « jeu style / type / comme skyjo », la plus forte demande Search Console du 16 septembre au 14 octobre) avec **variété** : The Mind et Sushi Go! remplacés par **Cabo** et **Papayoo** (nouveaux dans `games.json`). Cabo : 2 à 4 joueurs dans l'édition française Origames (Ludum), 2 à 5 pour l'édition d'origine et la 3e édition (Wikipédia), en rupture chez Ludum au 16 octobre ; Papayoo : 3 à 8, dès 7 ans, ~30 min, 14,90 € chez Philibert. Sources ouvertes : Ludum (Cabo), Wikipédia (Cabo), Esprit Jeu, Play-in et Philibert (Papayoo), Board Game Quest (Papayoo), regles-du-jeu.net (Papayoo). **Sujet pris : ne pas le reprendre.** | `jeux-comme-skyjo` | jeu comme skyjo | (cette PR) |
| 2026-10-19 | Rafraîchissement avec **variété** : **Exploding Kittens** ajouté (10e jeu, nouveau dans `games.json`) à l'article apéro ; Love Letter et les autres jeux de l'article déjà corrigés par l'audit du 12 octobre. EK : 2 à 5 joueurs, dès 7 ans (6 ans chez Play-in), ~15 min (10 à 20 selon Wikipédia), 18,95 € chez Philibert, Édition Festive 2 à 10 joueurs à 28,95 € ; BGG 172225 contrôlé par l'API geekdo (nom, trois auteurs, 2015). Sources ouvertes : Esprit Jeu, Philibert, Wikipédia, API geekdo, Play-in, Ludum. **Sujet pris : ne pas le reprendre.** | `meilleurs-jeux-apero` | jeux de cartes apéro | (cette PR) |

## En attente

Rafraîchissements repérés (par ordre de priorité) :

0. **Fait le 14 octobre 2026 pour `cadeau-noel` ; reste l'article neuf ci-dessous.** (Demande d'origine : rafraîchir `cadeau-noel` pour Noël 2026
   (intention d'achat, la seule page du blog qui vise un acheteur en novembre-décembre), avec KYRAN
   présenté honnêtement parmi les choix et la date limite de commande du site (16 décembre). Puis,
   si le sujet est absent du blog, un article « jeux de cartes à moins de 15 € à offrir ».
   Demandé par l'audit commercial du 12 octobre 2026.)
1. **Contenu de première main** demandé au propriétaire dans `docs/SEO-GEO.md` § 9 (photos de parties,
   retours de test, `authorNote`) : à intégrer dès qu'il est fourni, en commençant par les articles
   du « jour 1 ».
2. **Autres articles à revérifier** (relevé du 5 octobre 2026 lors de `alternatives-uno`) : Love Letter existe
   en deux éditions (classique 2012 : 16 cartes, 2 à 4 joueurs ; Z-Man 2025 : 21 cartes, 2 à 6 joueurs ;
   Philibert affiche « dès 14 ans », Z-Man 10+). `jeux-3-joueurs` est précisé (7 octobre) ; `games.json` affiche encore « 2 à 4 » et les autres articles
   qui parlent de « seize cartes » ou de « 2 à 4 joueurs » restent à préciser (`jeux-vacances-voyage` fait le 12 octobre ; restent `alternatives-uno`, `cadeau-anniversaire`, `jeux-30-minutes`, `jeux-cartes-4-joueurs`, `jeux-comme-skyjo`, `jeux-debutants-adultes`, `jeux-famille`, `meilleurs-jeux-apero`). Jungle Speed : année incertaine selon les
   sources (BGG 1997, Wikipédia 1991 ou 1996) : ne pas l'afficher sans source primaire.

3. **Jeux à ajouter à `games.json`** (variété, voir protocole § 3). Cabo et Papayoo ajoutés le 16 octobre ;
   Skull King, Cat in the Box et Pili Pili l'étaient déjà ; Exploding Kittens ajouté le 19 octobre.
   Candidats restants à rechercher, rien n'est sourcé à ce stade : Trio, Mille Bornes, Les Loups-Garous de
   Thiercelieux, The Fox in the Forest, Tichu. Dos (Mattel) : fiches contradictoires sur le nombre de
   joueurs (2 à 4 ou 2) et la condition de victoire ; lire la notice officielle Mattel (service.mattel.com,
   HNN01) avant de l'utiliser. Ne rien écrire sur eux sans fiche d'éditeur ou règle ouverte.

Liens externes des fiches de jeux (`scripts/lib/game-links.mjs`) : tous revérifiés le 4 octobre 2026
(#18 puis passe dédiée). Chaque identifiant BGG est contrôlé par l'API geekdo (nom et auteur), chaque
lien Wikipédia vient des sitelinks Wikidata (article français s'il existe, sinon anglais) et répond 200.
Timeline, Parade, Letter Jam, L.L.A.M.A. et The Game n'ont d'article ni en français ni en anglais :
pas de clé `wiki`. Les liens de l'article rédigé à la main `jeux-cartes-adultes` ont été corrigés de
la même façon.

Écarts relevés dans `games.json` le 4 octobre 2026 et non corrigés (des textes en dépendent) :

| Jeu | `games.json` | Source officielle ou boutique |
|---|---|---|
| Codenames | 2 à 8+, ~20 € | Nouvelle édition 2025 : 4 à 8, 14+ (Czech Games Edition, fiche Asmodee Canada) ; 2 à 8, dès 12 ans (IELLO, Bonne Promo, 14 octobre) ; 21,95 € chez Philibert ; `cadeau-anniversaire` dit « 15 à 20 € » |
| Dixit | 3 à 6 | Édition actuelle : 3 à 8 (Libellud) ; 3 à 6 pour l'édition de 2008 |
| Coup | 10+, ~14 € | 13+ (Indie Boards & Cards, relevé le 12 octobre sur Miniature Market ; Wikipédia 14+, Leisure Games 10+) ; VO 20,50 € chez Philibert ; la VF « Complots » (Ferti) est un autre produit (2 à 8 joueurs) |
| 6 qui prend ! | 10+ | 8+ sur les fiches Gigamic et Amigo actuelles ; 10 ans dans la règle française de 2012 et chez Philibert |
| Timeline | 2011 | La fiche BGG liée (« Timeline: Classic », Frédéric Henry) date de 2018 ; la série commence en 2010 (« Timeline: Inventions ») |
| Oh Hell! | auteur « Traditionnel » | Publié en JSON-LD comme `Person` nommée « Traditionnel » ; jeu traditionnel sans auteur |
| The Crew | ~15 € | 16,50 € chez Philibert, 18 € sur la boutique Iello (5 octobre 2026) ; avis partagé entre vérificateurs |
| Wizard | ~10 € | 15 € TTC chez Gigamic (édition française) ; 9,95 € est le prix de la VO allemande chez Philibert (12 octobre 2026) |
| The Crew | 2 à 5 | La boîte française annonce 3 à 5 (Iello) ; la variante à 2 joueurs est dans la règle, pages 19 et 20 |
| Parade | ~45 min, ~15 € | Éditeur français : Filosofia ; 20 à 40 min chez un revendeur, 45 min sur BGG ; pas de règle officielle ouverte |
| Oh Hell! | ~10 € | Aucune fiche d'éditeur ouverte : prix non sourcé, retiré de `jeux-plis-comparatif` |
