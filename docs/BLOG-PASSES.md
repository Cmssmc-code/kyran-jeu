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
   **[Remplacé le 21 octobre 2026 par la priorité aux contenus de référence ci-dessous.] Depuis l'audit commercial du 12 octobre 2026** (`docs/rapports/audit-ventes-2026-10-12.md`),
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
   **Au moins un article neuf par semaine (demandé par le propriétaire le 19 octobre 2026)** : sur les
   trois passes de la semaine (lun/mer/ven), **au moins une** crée un **nouvel article**, pas un
   rafraîchissement. Avant de choisir le type, relire le journal : si les passes de la semaine en
   cours (lundi à vendredi) ne comptent encore aucun article neuf, la passe du vendredi en écrit un
   obligatoirement, et dès le mercredi si le lundi était déjà un rafraîchissement et qu'un sujet
   tient. **Aucune exception** (précisé par le propriétaire le 19 octobre 2026) : il y a toujours un
   sujet, il suffit de chercher assez loin. Ne jamais rafraîchir à la place.
   **Sujets : voir large, en macro** (même précision). Un article neuf n'est pas forcément un guide
   « quels jeux de cartes / de société pour… » ni un comparatif. Le champ couvre les jeux de cartes
   et de société dans leur globalité : études et enquêtes (pratiques de jeu, marché, bienfaits du
   jeu, chiffres publics), actualité des éditeurs, fournisseurs, revendeurs et boutiques (sorties,
   salons, nouveautés, évolutions de gamme), histoire et culture du jeu, règles et vie à la table,
   conseils d'usage. Même exigence de sérieux : sources fiables réellement ouvertes, aucun chiffre
   ni citation sans source liée, KYRAN mentionné seulement quand il a sa place.
   **But du blog, précisé par le propriétaire le 21 octobre 2026 : devenir une source de référence** pour
   le SEO et le GEO, c'est-à-dire des pages que d'autres sites et les IA citent parce qu'elles contiennent
   des **données et des consolidations que l'on ne trouve pas ailleurs**, toujours vérifiées, **100 % exactes**.
   Les guides ne sont pas ce chemin (voir plus bas). Priorité aux **contenus de référence**, publiés en
   format « essai » avec un jeu de données ouvert (`dataset`, voir `scripts/content/README.md`) :
   - **base ouverte de fiches de jeux de cartes** : joueurs, âge, durée, éditeur, auteur, année, prix constaté
     (date et revendeur), tout relevé sur la fiche de l'éditeur ou d'un revendeur ouverte le jour même ;
     chaque passe vérifie et ajoute des jeux, jamais de valeur reprise de `games.json` sans nouveau contrôle ;
   - **relevé de prix** de jeux de cartes dans au moins trois boutiques, avec date, répété à intervalles
     réguliers (une série dans le temps qu'aucun autre site ne publie) ;
   - **palmarès consolidés** (As d'Or, Spiel des Jahres…) lus sur les sites officiels des prix ;
   - **règles comparées** relevées dans les règles officielles (conditions de fin de partie, nombre de
     joueurs, mécaniques), chaque ligne renvoyant à la règle ;
   - **chiffres du marché** réunis de plusieurs sources publiques, avec leurs périmètres et leurs écarts ;
   - **calendrier des salons et sorties** relevé sur les sites des organisateurs et des éditeurs ;
   - **analyses calculées** (probabilités d'une donne) avec le script de calcul publié dans le dépôt.
   Règles : une ligne sans `source_url` et sans date de contrôle ne se publie pas ; une valeur douteuse se
   laisse vide ; les données se mettent à jour par les passes de rafraîchissement (nouvelle date de contrôle) ;
   les écarts entre sources sont montrés, pas lissés. **Les guides d'achat saisonniers neufs (Noël, Pâques,
   fêtes des mères ou des pères, rentrée…) sont abandonnés** : on ne rafraîchit que `cadeau-noel`, déjà publié.
   **Fini les guides à la chaîne (demandé par le propriétaire le 21 octobre 2026).** Les guides
   comparatifs et guides d'achat (« N jeux pour… », « jeux comme X », « meilleurs jeux de… », idées
   cadeau, tableaux comparatifs) passent **au plus une fois toutes les deux semaines** : avant d'en
   choisir un, relire le journal ; si un guide neuf date de moins de 14 jours, on écrit autre chose.
   Le rafraîchissement d'un guide existant ne compte pas dans cette limite. Les autres passes
   utilisent le **format « essai »** (`format: 'essai'`, voir `scripts/content/README.md`), avec le même
   sérieux que l'article `science-jeux-de-cartes-cerveau` (références vérifiées avec DOI quand ce sont des
   études, limites dites, aucune promesse) et ces angles, à alterner :
   - **études et vulgarisation** (psychologie, cognition, lien social, générations, bien-être), seulement
     à partir d'articles scientifiques réellement ouverts ; jamais de promesse de santé ;
   - **histoire et origines** d'un jeu, d'un type de cartes ou d'une mécanique (plis, paris, pioche) ;
   - **règles en profondeur** : cas litigieux, erreurs fréquentes, variantes officielles d'un jeu ;
   - **analyses chiffrées** : probabilités ou combinatoire d'une donne, calculées à partir des règles
     officielles, méthode et formule indiquées, calcul refait et vérifié ;
   - **actualité du secteur** : marché, éditeurs, salons, prix, sorties, avec les chiffres publics des sources ;
   - **vie à la table** : étiquette, parties mixtes (âges, niveaux), organisation d'une soirée, règles de maison ;
   - **coulisses de KYRAN**, **portrait ou entretien** : seulement avec un contenu fourni par le propriétaire.
   Dans le journal, la colonne « Type » indique « Guide », « Essai » ou « Rafraîchissement ».
   **Un article « Majordia » environ une fois par mois** (demandé par le propriétaire le 21 octobre 2026).
   Majordia (majordia.fr) est l'autre site du propriétaire : un livret d'accueil digital pour les hôtes
   Airbnb et les petites conciergeries. Environ une fois par mois, une passe d'article **neuf** (le
   vendredi de préférence) traite un sujet de **séjour en location ou en gîte** utile à un lecteur de
   jeux de cartes, et y cite Majordia là où cela aide le lecteur. Avant de choisir : `grep -l "majordia.fr"
   scripts/content/blog/*.mjs` et le tableau « Angles Majordia » de « En attente » ; s'il y a déjà un
   article du mois en cours qui cite Majordia, on n'en écrit pas un second. Règles :
   - **Un angle utile et différent à chaque fois**, avec sa propre intention de recherche : jamais deux
     articles sur la même idée (liste et statut dans « Angles Majordia » ; ajouter chaque nouvel angle).
   - **Majordia cité au plus une fois dans le corps**, par un lien vers la page utile (par exemple
     `https://www.majordia.fr/livret-accueil-digital` pour « les règles de la maison (bruit, heures) sont
     souvent dans le livret d'accueil du logement »), jamais en conclusion promotionnelle. Quand le sujet
     n'en a pas besoin (cadeau pour un hôte), on peut ne pas le citer : on n'en force pas la mention.
   - **Transparence** : écrire, à l'endroit de la mention, que Majordia est un autre site de l'auteur de KYRAN.
   - **Faits sur Majordia vérifiés sur majordia.fr le jour de la passe** (WebFetch) et réduits à ce qui est
     stable : livret propre à chaque logement, ouvert par un QR code, sans application ni compte pour le
     voyageur, en six langues ; règles de la maison, Wi-Fi, guide local ; livret gratuit sans inscription
     (formule « Essentiel »). **Aucun prix, aucune promotion, aucun chiffre de gain** : le 21 octobre 2026,
     les prix de la page tarifs de Majordia se contredisaient (4,05 € ou 4,50 € par mois). Ne jamais
     modifier le dépôt Majordia depuis cette routine.
   - **KYRAN présenté honnêtement** parmi les choix (3 à 6 joueurs, dès 8 ans, environ 30 minutes, ne se
     joue pas à deux), avec ses limites ; central seulement quand l'angle est l'achat d'un jeu (cadeau).
   - Mêmes exigences que tout article neuf (1 500 mots, photos créditées, sources lues, aucune donnée inventée).
4. **Rechercher** : au moins 5 sources fiables réellement ouvertes (règles officielles en PDF, fiches
   éditeurs, Philibert, études, communiqués d'éditeurs, presse spécialisée…). Faits KYRAN : uniquement
   le dépôt. Aucun chiffre, prix, règle ou citation sans source liée.
   **Même rigueur que le blog Majordia** (demandé par le propriétaire le 19 octobre 2026 ;
   référence : `_notes/blog-routine-mission.md` du dépôt Majordia). Règles anti-invention, non
   négociables :
   - interdit d'inventer un chiffre, une statistique, une citation, une étude, un nom ou une URL ;
   - chaque chiffre porte valeur, année, source nommée et lien cliquable vers la page **réellement lue**
     (jamais un extrait de moteur de recherche) ; une page illisible ne se remplace pas par un site
     commercial : on retire l'affirmation ou on écrit que la page n'a pas pu être lue ;
   - un calcul propre n'est permis qu'à partir de chiffres sourcés, avec la méthode indiquée ;
   - une citation est mot pour mot, avec auteur, fonction, source et lien, sinon on reformule sans
     guillemets ;
   - source introuvable ou douteuse : supprimer l'affirmation ; trop de manques : changer de sujet ;
   - pour chaque donnée, noter valeur, année, source, URL et passage exact (dans la PR).
5. **Rédiger** au format généré (`scripts/content/blog/<slug>.mjs`), avec une structure propre à
   l'article (le validateur signale le gabarit par défaut), sans jamais éditer le HTML généré.
   KYRAN : réponse honnête, jamais « sans élimination » ni « sans hasard ».
   **Exigences de fond (toujours)** :
   - **1 500 mots minimum** (visée 1 800 à 2 500), le validateur le vérifie ;
   - **des photos** : une image d'en-tête et 2 à 4 images dans le texte, en lien direct avec le sujet,
     libres de droits (Wikimedia Commons avec licence vérifiée sur la page du fichier, ou visuels du
     dépôt), chacune avec texte alternatif descriptif et crédit (auteur, lien, licence) ; jamais de
     logo, d'illustration ou de photo protégés ; regardez chaque image avec l'outil de lecture ;
   - **des sources** : au moins 5 sources distinctes réellement ouvertes, 4 à 8 liens externes vers
     elles dans le corps, chacun vérifié (HTTP 200) ;
   - **GEO** : chaque section commence par une réponse autonome de 1 à 2 phrases ; une définition en
     une phrase ; chiffres datés et sourcés dans la phrase même ; tableaux ou listes numérotées quand
     ils servent ; un résumé « à retenir » ; une FAQ ;
   - **SEO** : le mot-clé principal s'écrit comme les gens le tapent et ouvre `metaTitle` ; une seule
     intention par page (contrôler la cannibalisation avec `seo-keywords.json`, les serveurs MCP `gsc`
     et `bing-webmaster`, `docs/MCP_SEO.md`) ; `description` qui promet seulement ce que la page
     apporte ; 4 à 8 liens internes vers des pages existantes, en chemin canonique ;
   - **ton** : un joueur qui parle à un autre joueur, vouvoiement, sans remplissage ni tournures
     génériques d'IA, sans jargon inutile ;
   - **dynamisme** : un angle, une idée propre, des exemples concrets de table de jeu, pas une liste
     de fiches interchangeables ; l'envie de l'écrire doit se sentir ;
   - mention « Dernière vérification des sources : <date> ».
   **Maillage entrant** : à chaque article neuf, ajouter 1 à 3 liens vers lui depuis des articles
   proches (dans le corps du texte, jamais en fin de page), et vérifier qu'il n'est pas orphelin.
6. **Contrôler** : relecture adversariale de chaque fait, liens (200), `node scripts/validate-articles.mjs <slug>`,
   `npm run build`, `npm test`.
7. **PR** : sources, images (crédit + licence), section « À vérifier par le relecteur », résultat des
   tests ; puis fusion aux conditions ci-dessus. Personne ne relit : un fait sans source fiable est
   retiré avant la fusion, jamais laissé à un relecteur.
8. **Après la fusion** : vérifiez la page en ligne (kyran-jeu.fr/blog/<slug>.html, sitemap, flux).
9. **Suivi SEO du lundi** (demandé par le propriétaire le 19 octobre 2026, calqué sur l'étape 9 de la
   mission Majordia). Le lundi, en plus de l'article ou du rafraîchissement, dans la même PR :
   1. **Mesurer** (lecture seule) avec les serveurs MCP `gsc` (propriété `sc-domain:kyran-jeu.fr`) et
      `bing-webmaster` (`docs/MCP_SEO.md`) : clics, impressions, CTR et position par page sur 28 jours,
      requêtes principales par page. N'appelez jamais leurs outils d'écriture. Si un serveur ne se
      connecte pas, écrivez « non mesuré » ; n'inventez aucun chiffre.
   2. **Pistes CTR** (page 1, CTR inférieur à 2 %) : pour **au plus 3** pages de blog dont le dernier
      changement de titre a plus de 28 jours (`git log -1 --format=%ad --date=short -G 'metaTitle|description' -- scripts/content/blog/<slug>.mjs`
      et le journal de `docs/SUIVI-BLOG-SEO.md`), réécrivez `metaTitle` et `description` seulement :
      partez de la requête n° 1 de la page, mot-clé écrit comme on le tape, bénéfice concret ensuite,
      promesse que la page tient. Ne changez ni le H1 ni le corps.
   3. **Pistes classement** (position supérieure à 15) : le titre n'y peut rien. Ajoutez 2 à 3 liens
      internes vers la page, avec une ancre qui contient sa requête, depuis des articles proches ; si la
      page est trop mince face à la requête, notez-la comme sujet d'enrichissement dans « En attente ».
   4. **Pages explorées ou détectées mais non indexées** (`index_inspect`) : les lister, et traiter
      d'abord celles-là (voir § 9 de `docs/SEO-GEO.md`).
   5. **Consigner** dans `docs/SUIVI-BLOG-SEO.md` : une ligne au journal des titres par titre changé, avec
      sa date de réévaluation à J+28, et un bilan en haut (pages et clusters publiés sur 7 jours, clics,
      impressions, CTR, position sur 28 jours comparés au bilan précédent, actions menées, trois sujets
      proposés à partir des requêtes réelles). Ces trois sujets alimentent le choix de l'article neuf.
   6. Même règle de fusion que le reste ; un titre déjà changé depuis moins de 28 jours ne se retouche pas.

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
| 2026-10-21 | **Article neuf Majordia** (demandé par le propriétaire « dès demain ») : week-end entre amis en gîte, 7 jeux de cartes par moment de la soirée (Papayoo, Skull King, Skyjo, Just One, Flip 7, KYRAN, Jungle Speed). Majordia cité **une seule fois** (livret d'accueil, page vérifiée le jour même), avec la mention « un autre site de l'auteur de KYRAN », sans prix. Sources lues : Ludum (Papayoo, Just One, Skull King, Flip 7), Esprit Jeu (Jungle Speed), Service-public F612 (tapage nocturne 22 h-7 h, amende jusqu'à 450 €), majordia.fr (livret d'accueil digital). Images : seulement celles du dépôt (Jungle Speed, Skyjo). | `jeux-cartes-week-end-gite` | week-end entre amis gîte jeux de cartes | (cette PR) |
| 2026-10-21 | **Article neuf** (sujet « macro », demandé le 19 octobre) : marché français des jeux de cartes ; **recentré le jour même sur 2026-2027 à la demande du propriétaire** (slug d'abord `marche-jeux-de-cartes-2025`, redirigé). Ajouts : cartes stratégiques +18 % au S1 2026 (L'Express Franchise, 14 oct. 2026, Circana), perspectives 2026 de Circana, sélection Asmodee S1 2026, sorties annoncées (page Ludum **sponsorisée** du 18 sept. 2026), aucune prévision chiffrée 2027 trouvée. Communiqué Circana/FFJP/FCJPE du 14 janvier 2026 (+7,1 %, 4,7 Md€, « cartes stratégiques » +78 % = cartes à collectionner, pas jeux de table), périmètres divergents (1,1 Md€ / 1 017 M€ / 624 M€), cinq best-sellers de boutiques (Flip 7, Trio, Skyjo, Dékal, Cabanga). Sources lues : communiqué Circana (PDF), Ludiquement, Ludum (4 fiches), Gus & Co, L'Éclaireur Fnac, Esprit Jeu. Jeux ajoutés à `games.json` : Flip 7, Trio, Dékal, Cabanga. Pas de photo des nouveaux jeux (Commons sans fichier ni licence vérifiés) : seule l'image de Skyjo, déjà créditée. | `marche-jeux-de-cartes-2026-2027` | marché jeu de cartes 2026 2027 | (cette PR) |

## En attente

Rafraîchissements repérés (par ordre de priorité) :

0. **Fait le 14 octobre 2026 pour `cadeau-noel` ; l'article neuf « jeux de cartes à moins de 15 € à offrir » est ABANDONNÉ (guide d'achat, décision du 21 octobre 2026).** (Demande d'origine : rafraîchir `cadeau-noel` pour Noël 2026
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
   Candidats restants à rechercher, rien n'est sourcé à ce stade : (Trio ajouté le 21 octobre), Mille Bornes, Les Loups-Garous de
   Thiercelieux, The Fox in the Forest, Tichu. Dos (Mattel) : fiches contradictoires sur le nombre de
   joueurs (2 à 4 ou 2) et la condition de victoire ; lire la notice officielle Mattel (service.mattel.com,
   HNN01) avant de l'utiliser. Ne rien écrire sur eux sans fiche d'éditeur ou règle ouverte.

4. **Sujets « macro » à creuser** (idées, rien n'est sourcé) : palmarès As d'Or 2026 du Festival de Cannes
   (vainqueurs lus sur palaisdesfestivals.com : Toy Battle, The Island of the Mookies, Zenith, Civolution) et
   ce qu'ils disent des jeux de cartes ; résultats du Spiel des Jahres 2026 ; calendrier des salons et
   sorties d'éditeurs de l'automne ; études sur le jeu et le bien-être (sources scientifiques seulement).
   Une photo libre de droits par article reste à trouver (Commons limite les requêtes : espacer d'une minute).

5. **Angles Majordia** (un par mois, voir protocole § 3 ; propositions du propriétaire, 21 octobre 2026) :

   | Statut | Angle | Intention | Remarques |
   |---|---|---|---|
   | **fait le 21 octobre 2026** (`jeux-cartes-week-end-gite`) | « Week-end entre amis en gîte : 7 jeux de cartes pour les soirées » | activités week-end gîte entre amis (différent de `jeux-vacances-voyage`, rangé par moyen de transport) | KYRAN parmi les choix ; Majordia une fois : règles de la maison (bruit, heures) dans le livret d'accueil |
   | à faire | « Cadeau pour un propriétaire de gîte ou un hôte Airbnb : un jeu à laisser dans le logement » | intention d'achat, priorité du blog | KYRAN au centre ; Majordia pas nécessaire |
   | à faire | « Jeux de cartes pour une réunion de famille en location (des grands-parents aux ados) » | réunion de famille en location | KYRAN dès 8 ans, 6 joueurs au plus : à présenter avec ses limites |

   Premier angle écrit le 21 octobre 2026 ; prochain article Majordia : pas avant fin novembre (un par mois).

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
