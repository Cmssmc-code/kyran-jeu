# Jeu entre amis par lien privé (multijoueur) — cahier des charges

Statut : **go du PDG (18/11/2026)**, décisions du directeur technique intégrées. Auteur : game design (data), 18/11/2026.
Calendrier : partie test entre nous le **25/11/2026**, version réduite (étapes 0 à 3, test « vue sans fuite », smoke à 3 clients). Charge, confidentialité et mobile : après le test.
Objectif : jouer à KYRAN en ligne avec 2 à 6 amis, sans compte, en partageant un lien. Les règles restent celles de `dojo/engine.js`.

## 1. Parcours joueur

1. L'hôte clique « Jouer entre amis » (page `salle.html`), choisit un pseudo : la salle est créée, le lien `https://kyran-jeu.fr/salle.html#CODE` s'affiche (le code est dans le fragment : il ne part dans aucun journal serveur).
2. Les amis ouvrent le lien, choisissent un pseudo et arrivent dans le salon. Jusqu'à 6 sièges.
3. L'hôte lance la partie (options : Vies 3, 5 ou 7 ; cartes Pouvoir oui/non). S'il y a moins de 3 humains, l'hôte complète avec des ordinateurs (Anansi, Griot… déjà dans `dojo/ai.js`). La boîte se joue à 3 au minimum, et **la simulation de 10 000 parties ne couvre pas 2 joueurs** (3 à 6 seulement).
4. Chacun voit sa main, les paris, les plis. Fin de partie : classement, puis bouton **« Commander la boîte »** mis en avant (lien Stripe actuel, nouvel onglet) et, en second, un petit lien « Nouvelle salle ». **Une seule partie complète par salle** : pas de « Rejouer ».
Événements GA (mesure) : `salle_creee`, `salle_partie_finie`, `salle_cta_click`.

## 2. Architecture

- **Serveur maître** : le Railway existant (`kyran-webhook`, racine `/server`, `node server.js`, **1 réplique**, volume `/data`). Sans nouvelle dépendance (Node natif : `http`, `crypto`).
- **Actions** : `POST` JSON. **Mises à jour** : flux SSE (`GET`, `text/event-stream`). Pas de WebSocket.
- **Le serveur est seul juge** : il détient l'état complet (`createGame` de `engine.js`) et applique `act()`. Le client n'envoie qu'une intention. `act()` lève déjà une erreur sur un coup illégal (pari interdit, carte absente, mauvais tour) et laisse l'état intact.
- **Isolation du paiement** : tout le code de salle vit dans `server/salles.js` et `server/vue.js`, chargés par **import dynamique** seulement si `MULTI_ACTIF=1` (absente = aucun module de salle en mémoire, le webhook n'y touche pas). Chaque route `/salle/*` et chaque minuterie est dans un `try/catch` : une erreur de salle ne fait jamais tomber le processus, elle appelle `recordServerIncident` puis ferme la salle. Un test le prouve (étape 2). Aucune route du webhook n'est modifiée.
- **Salles en mémoire** (`Map`). Un redémarrage du serveur (déploiement) perd les salles en cours : message clair « la salle n'existe plus », acceptable pour du jeu entre amis. Pas de base de données.
- **Moteur partagé** : `dojo/engine.js` et `dojo/ai.js` sont copiés dans `server/moteur/` par `scripts/sync-moteur.mjs` (lancé par `npm run build`, vérifié par la CI comme les autres fichiers générés). Raison, vérifiée dans la config Railway : la racine de déploiement est `/server`, donc `../dojo` n'existe pas dans le serveur déployé. La copie retire les `?v=…` des imports. Il faut aussi ajouter `/dojo/**` aux `watchPatterns` Railway (réglage gratuit), sinon un changement de règle ne redéploierait pas.
- **Hasard** : `seed` tirée par `crypto.randomInt` côté serveur, jamais envoyée (le défaut de `createGame` est `Math.random`).

### Interface réseau (préfixe `/salle`, CORS = `ALLOWED_ORIGINS` existant)

| Route | Rôle | Qui |
|---|---|---|
| `POST /salle/creer` | crée la salle, renvoie code + jeton | tout le monde |
| `POST /salle/rejoindre` | prend un siège, renvoie un jeton | tout le monde |
| `POST /salle/lancer` | démarre (options, ordinateurs) | hôte |
| `POST /salle/action` | `bet`, `play`, `mysticValue`, `target`, `reveal`, `next` | joueur assis |
| `POST /salle/billet` | billet à usage unique (30 s) pour le flux | joueur assis |
| `GET /salle/flux?billet=…` | flux SSE | joueur assis |
| `GET /salle/etat` | `{ actif }` : le site masque le bouton si coupé | tout le monde |

- Le **jeton joueur** (128 bits, `crypto.randomBytes`) est gardé dans `sessionStorage` et envoyé dans le corps des `POST`. Le **billet** évite de mettre le jeton dans l'URL du flux (les URL finissent dans les journaux).
- Le siège (`pid`) est **déduit du jeton**, jamais lu dans la requête : le `pid` envoyé par le client est ignoré.
- Chaque message SSE : `{ seq, vue, evenements }`. À chaque connexion ou reconnexion, le serveur envoie d'abord la vue complète (petite) : pas de rattrapage de deltas. `evenements` sert aux animations du client.
- Ping SSE toutes les 20 s (garde la connexion ouverte derrière le proxy Railway et détecte les coupures).

## 3. Fonction de vue par joueur (point le plus sensible)

`vueDe(state, pid)` produit un objet **de même forme que l'état local** que lit l'interface (pour réutiliser `dojo/app.js`), mais filtré. Règle : on construit la vue en **liste blanche** (on copie ce qui est public), on ne retire pas au cas par cas.

- Jamais envoyés : `rng`, `opts.seed`, `deckTemplate`, `opts.deals`, jetons, adresses IP.
- Mains : pour les autres joueurs, seulement le **nombre** de cartes.
- **Manche Mystique (1 carte)** : le joueur voit les cartes des **autres** mais **pas la sienne** (règle officielle, jeu à l'aveugle). Le départage (`tiebreak`) est aussi une manche à 1 carte : même filtre.
- `peeks` (information des pouvoirs) : seulement pour le joueur concerné.
- Public : Vies, paris, plis gagnés, cartes posées dans le pli en cours, historique des manches, qui doit jouer.
- Une carte posée est publique ; la valeur 0 ou 37 de la Mystique l'est dès qu'elle est choisie.
- Le **conseil du Bokonon est coupé** en salle (il lit des mains cachées et fausserait la partie entre amis). Option « conseils » possible plus tard.

## 4. Reconnexion, départs, ordinateur de remplacement

- Reconnexion : même jeton, même siège, vue complète renvoyée. Un rechargement de page ne fait rien perdre.
- Délai par décision : 60 s. À l'expiration, l'ordinateur joue **ce coup** à la place du joueur (`decide()` de `dojo/ai.js`).
- Joueur déconnecté (flux fermé) depuis plus de 45 s, ou 3 délais d'affilée : le siège passe « remplacé par l'ordi » et l'ordinateur joue tout de suite à son tour. Le joueur reprend son siège en revenant avec son jeton.
- L'hôte part : le rôle passe au plus ancien joueur humain connecté.
- Plus aucun humain connecté : la salle est supprimée après 10 min.
- **Charge** : `decide()` fait des simulations (jusqu'à 220 pour « Maître »). Le serveur est mono-processus et traite aussi le webhook Stripe. Les ordinateurs de salle jouent donc au niveau **Apprenti ou Initié** (simulations plafonnées), jamais Maître, et chaque décision est mesurée. Seuil à tenir : moins de 50 ms par décision.
- « Suivant » et « Révéler » (manche Mystique) : n'importe quel humain peut les envoyer ; le serveur le fait seul après 20 s si personne ne clique.

## 5. Expiration et limites anti-abus

| Limite | Valeur de départ |
|---|---|
| Salle en attente sans activité | 30 min |
| Salle en jeu sans humain connecté | 10 min |
| Partie finie | 10 min |
| Durée absolue d'une salle | 3 h |
| Salles ouvertes en même temps | 50 (`MULTI_MAX_SALLES`) |
| Flux SSE ouverts au total | 400 ; 2 par jeton |
| Créations de salle par IP | 6 par heure |
| Tentatives de rejoindre par IP | 20 par minute |
| Actions par jeton | 20 par 10 s |
| Taille d'un corps `POST` | 2 Ko |
| Pseudo | 1 à 20 caractères, sans balises, affiché avec `textContent` |

- Réutilise `rateLimited()` et `clientIp()` de `server/server.js`.
- Contrôle de l'en-tête `Origin` sur les `POST`. Pas de cookie (pas de CSRF).
- Code de salle : 6 caractères sans `0 O 1 I L` (31⁶ ≈ 887 millions de codes).
- Balayage des salles toutes les 60 s.
- **Aucune donnée personnelle conservée** : pas de compte, pas d'e-mail, pseudo gardé en mémoire le temps de la salle, IP seulement dans les compteurs de débit. La page confidentialité devra le dire en une phrase.

## 6. Coupure par variable

- `MULTI_ACTIF` : le multijoueur ne marche que si elle vaut `1`. **Absente = coupé** : au premier déploiement, tout est caché.
- Coupé : toutes les routes `/salle/*` répondent `503 { actif: false }`, le site lit `/salle/etat` et masque le bouton, les salles en cours sont fermées avec un message.
- Réglable sans code : variable Railway (redéploiement de quelques secondes). Éteint par défaut en prod. Pour le test du 25/11, le directeur technique active `MULTI_ACTIF=1` sur le créneau, puis la recoupe.
- Autres réglages : `MULTI_MAX_SALLES`, `MULTI_DELAI_COUP` (60 s).
- Tout incident de salle passe par `recordServerIncident` (déjà en place), sans pseudo ni contenu de main.

## 7. Fichiers touchés

Nouveaux :
- `server/salles.js` : salles, sièges, minuteries, balayage.
- `server/vue.js` : `vueDe()` (isolé pour être testé à part).
- `server/moteur/engine.js`, `server/moteur/ai.js` : copies générées.
- `scripts/sync-moteur.mjs`.
- `salle.html` (en **noindex**, hors menu et hors sitemap), `dojo/multi.js` (transport réseau), `dojo/multi.css` si besoin.
- `server/test/salles.test.mjs`, `server/test/vue.test.mjs`, `scripts/smoke-salle.mjs`.

Modifiés :
- `server/server.js` (876 lignes) : branchement des routes `/salle/*`, déléguées à `salles.js`.
- `dojo/app.js` (1 725 lignes) : séparer « d'où vient l'état » (local ou réseau) du dessin. **Risque principal du projet.** Un essai d'une demi-journée au début de l'étape 3 tranche : adaptateur sur `app.js`, ou petite interface dédiée à la salle.
- `package.json` (`build` appelle `sync-moteur`), `scripts/stamp-dojo.mjs` si la nouvelle page utilise des modules.
- CSP des pages concernées : `connect-src` contient déjà l'adresse Railway, rien à ouvrir.
- `docs/MACHINES-A-ETATS.md` (machine d'états de la salle) ; menu et sitemap seulement à l'ouverture publique.
- Réglage Railway : `watchPatterns` + variables `MULTI_*` (aucun coût).

## 8. Tests prévus

Unitaires (`node:test`, horloge injectée, sans réseau) :
1. **Vue sans fuite** : pour chaque siège et chaque étape d'une partie jouée, parcourir le JSON de la vue : aucun identifiant de carte d'un autre joueur, aucune `seed`/`rng`/`deckTemplate`. Vérifier la main cachée en manche Mystique et en départage.
2. Actions : mauvais jeton, mauvais tour, pari interdit (règle d'or), carte absente, action inconnue : refus, état inchangé.
3. Reconnexion : même jeton, vue identique ; billet SSE à usage unique, puis expiré.
4. Remplacement : délai de 60 s, déconnexion de 45 s, reprise du siège, transfert d'hôte.
5. Expiration et balayage ; plafonds (salles, SSE, IP, actions, taille) ; coupure `MULTI_ACTIF`.
6. `server/moteur/*` identique à `dojo/*` (empreinte), et `ai.js` importe bien le moteur copié.
7. Parties complètes côté serveur avec 3 à 6 sièges d'ordinateurs : 0 erreur, règle d'or jamais violée.

**Règle de chaque PR** : `npm test` (webhook et parcours d'achat compris) et `scripts/smoke-initiation.mjs` verts avant et après la fusion ; jamais de vrai paiement (mode test ou événements simulés). À écrire dans la description de chaque PR.

Intégration : un vrai serveur, 3 clients `http` + SSE, une partie entière. Navigateur : `scripts/smoke-salle.mjs` (Playwright, 3 contextes, une partie), à ajouter au test quotidien. Charge : 20 salles de 6 en parallèle, avec mesure du délai du webhook Stripe pendant ce temps.

## 9. Découpage (jours ouvrés après le « go »)

| Étape | Contenu | Jours |
|---|---|---|
| 0 | Décisions ci-dessous ; essai d'adaptation de `app.js` | 0,5 |
| 1 | `sync-moteur`, `vue.js` + test sans fuite, `salles.js` (création, sièges, `act`) | 2 |
| 2 | Routes, SSE, billets, minuteries, ordinateur de remplacement, limites, coupure | 2 |
| 3 | `salle.html` + `multi.js` : salon, lien, partie, reconnexion, fin de partie et « Commander la boîte » | 3 |
| 4 | Intégration, charge (20 salles), navigateur, mobile ; page confidentialité — **après le test du 25/11** | 1,5 |
| 5 | Déploiement coupé, essai à 3 vrais joueurs (dont Corentin), ouverture | 1 |

Total : environ **10 jours ouvrés**. Chaque étape : une PR, CI verte, fusion, vérification en ligne. Tout reste coupé jusqu'à l'étape 5.

## 10. Risques

- Redémarrage Railway = salles perdues (accepté ; éviter de déployer en soirée une fois ouvert).
- Une seule réplique : au-delà d'environ 50 salles il faudra autre chose (hors périmètre).
- Les ordinateurs de remplacement ralentissent le webhook Stripe s'ils sont trop gourmands : plafond de simulations + mesure (étape 4).
- L'ordinateur qui remplace n'a pas la force d'un humain, et l'équilibre des parties mixtes n'est pas simulé. À mesurer avec la simulation avant l'ouverture (parties de 3 à 6, niveaux Apprenti et Initié).
- Triche entre amis : l'état complet reste sur le serveur ; la vue en liste blanche est la seule défense.

## 11. Décisions (toutes prises)

1. Go du PDG : oui (18/11/2026).
2. 2 humains + 1 ordinateur : accepté.
3. Conseil du Bokonon coupé en salle : accepté.
4. Délai de 60 s par coup : accepté.
5. Une seule partie par salle, bouton « Commander la boîte » en fin de partie : décidé (condition du PDG).
6. Étape 0 (essai `app.js`, 18/11/2026) : **interface dédiée**, pas d'adaptateur. Constat : `app.js` fait tourner le moteur en local (`E.act` appelé 1 fois, `createGame` 1 fois), suppose que l'humain est toujours le siège 0 (une trentaine d'endroits : `pid === 0`, `players[0]`, `me.hand`), pilote les tours des ordinateurs et les conseils du Bokonon (`AI.adviseBet`, `advisePlay`…) et les leçons. L'adapter obligerait à toucher environ 70 endroits de l'écran de l'Initiation, le produit principal, pour un gain faible. Choix : `salle.html` + `dojo/multi.js` (environ 500 lignes) qui lit la vue du serveur, en réutilisant `engine.js` côté client pour `legalBets`, `forbiddenBet`, `cardLabel`, `POWERS` (calculables avec les seules données publiques de la vue, donc la vue garde `round.betOrder`, `round.cards`, `opts.goldenRule`), ainsi que `dojo.css` et les images des cartes. Aucune ligne de `app.js` n'est modifiée : l'Initiation ne peut pas être cassée.
