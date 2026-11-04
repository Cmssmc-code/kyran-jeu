# Mission : routine « SEO & GEO quotidienne de KYRAN »

Routine Claude Code, **tous les jours à 00:00 (Europe/Paris)**, dans une session dédiée (dépôt attaché,
`_notes/memoire.md` § 14). Chaque run relit ce fichier sur `origin/main` : le modifier modifie le run suivant.

Demande du propriétaire (2026-10-19) : améliorer **chaque jour** le référencement de kyran-jeu.fr dans les
moteurs (Google, Bing) et dans les moteurs de réponse IA (GEO : ChatGPT, Perplexity, Gemini, Copilot, Claude,
Google AI Overviews). Chaque nuit : remettre à jour la base de connaissances (le dépôt change presque tous les
jours), condenser ce qui s'est passé sur 24 h, 48 h, 7 jours et 30 jours (site, dépôt, web, réseaux, qui parle de
KYRAN et comment), tenir à jour le tableau partagé, chercher les meilleures pratiques du moment, puis **agir** :
tous les droits sur la surface SEO (renommage, titres, méta, contenus, maillage, liens externes, données
structurées, `llms.txt`, sitemap, images de partage), **aucun droit sur les fonctions principales** (moteur du
jeu, paiement, serveur, sécurité : les signaler dans le rapport, ne jamais les modifier). L'objectif : progresser
de jour en jour, mesure à l'appui.

Lire avant tout : `CLAUDE.md`, `_notes/lecon.md` (en entier, il est court), `_notes/memoire.md` (§ 1 faits
canoniques, § 2 build, § 7 CI, § 14 routines), `docs/SEO-GEO.md`, [`seo/base-connaissances.md`](seo/base-connaissances.md),
[`seo/backlog.md`](seo/backlog.md), les trois dernières entrées de [`suivi-seo.md`](suivi-seo.md), le journal des
titres de `docs/SUIVI-BLOG-SEO.md` et la liste des PR ouvertes.

---

## Cadre d'exécution Trio (prioritaire sur les commandes du déroulé ci-dessous)

Depuis le 2026-11-03 cette routine tourne dans **Claude Trio sur le PC Windows de Corentin** (worktree réservé
`wt-routine-seo`, un run à minuit), plus dans une session cloud. Là où le déroulé dit autre chose, ceci l'emporte :

- Shell : Git Bash. Python s'appelle `python` (jamais `python3`). Environnement : `python -m venv .venv` puis
  `.venv/Scripts/python -m pip install -q -r scripts/requirements-seo.txt` (jamais `/tmp/seovenv`, `apt-get`,
  `pip --break-system-packages`). Chemins Windows : pas de `/opt/pw-browsers` ; Lighthouse : `npx -y lighthouse@12`
  avec le Chrome du PC si trouvé, sinon « non mesuré ».
- GitHub : `gh` (connecté), pas d'outils `mcp__github__*`. Règle du dépôt : PR vers `main`, fusion automatique quand « Contrôles du site » est verte (`CLAUDE.md`).
- Search Console / Bing / PageSpeed : branchés le 2026-11-04. Les scripts `seo-*.py` lisent seuls les clés de
  `.secrets/` (`scripts/seo_secrets.py`, détail `docs/MCP_SEO.md` § 3) ; les serveurs MCP `gsc` et
  `bing-webmaster` du `.mcp.json` aussi. À chaque run : `python scripts/seo-kpi-daily.py` puis
  `python scripts/seo-health.py --inspect 30 --psi` (environ 3 min, en arrière-plan). Si rien ne répond :
  « non mesuré », on le signale en tête du journal et on continue.
- Doc partagé : connecteur Claude Docs du compte (via ToolSearch). S'il est absent, le noter en tête du journal.
- Pas de `send_later` ni de `PushNotification` direct : une alerte tient dans le message final (Trio la relaie).
  Limite d'usage atteinte : commit « wip » sur la branche et arrêt, Trio relance la routine.
- Rien de visible : aucune fenêtre, aucun navigateur ouvert. Un run à la fois (le précédent a fini ou est cité).

## Ce qui est établi sur le SEO et le GEO (relevé du 2026-11-03, à réévaluer chaque mois)

À appliquer à chaque run ; sources à rouvrir le lundi (§ Bonnes pratiques) avant de s'y fier, car plusieurs chiffres
viennent de blogs de vendeurs d'outils et ne sont pas vérifiés.

1. **Google dit que le GEO reste du SEO** (guide Search Central sur les AI Overviews et le mode IA, mai 2026,
   d'après la presse spécialisée : à relire sur `developers.google.com/search`). Pas de balisage spécial pour les
   AI Overviews, `llms.txt` non requis par Google, et les règles anti-spam s'appliquent aussi aux réponses IA :
   **aucune manipulation** (texte caché, citations inventées, avis faux). On garde `llms.txt` pour les autres
   moteurs IA, sans en attendre un effet Google.
2. **Search Console a un rapport « performance IA générative »** (impressions seulement, depuis mai 2026) : le
   relever à chaque run dans les mesures s'il est exposé par le MCP ou l'API ; sinon le noter une fois dans
   « À décider » (relevé manuel par Corentin). C'est le seul vrai indicateur GEO de Google : il remplace le
   proxy « 0 sur 3 prompts » comme indicateur principal, qui reste un complément.
3. **Le SEO classique porte le GEO** : la grande majorité des pages citées par les AI Overviews sont déjà en
   top 10 Google, et la récupération de ChatGPT recoupe surtout les résultats de Bing. Donc : l'**index Bing** et
   les positions 8 à 20 restent la priorité, avant tout travail « spécial IA ».
4. **Ce qui augmente la citation par une IA** (étude de Princeton, KDD 2024, à relire dans le papier avant de
   citer un chiffre) : chiffres précis et datés, citations de sources dans le texte, définitions en tête de
   section (« X est … »), réponses courtes directement sous la question, tableaux comparatifs. À appliquer sur les
   pages visées par les requêtes de la base, **avec des faits vérifiés uniquement**.
5. **Fraîcheur réelle** : une page importante non revue depuis un trimestre perd en citations (étude AirOps à
   confirmer). Rafraîchir = changer un fait ou une donnée, puis `dateModified` et `lastmod` ; **jamais** une date
   modifiée sans changement de fond (pratique que Google sanctionne).
6. **Corroboration par des tiers** : les IA citent surtout Wikipedia, Reddit, les plateformes d'avis et la presse.
   Pour kyran-jeu.fr : mentions, fiches, avis sur des sites tiers, par des gestes propres (règle Netlinking), jamais
   de faux avis ni de profil créé pour un lien.

## Règle « un run sans action est une exception »

Les derniers runs concluent souvent « aucune modification de page » parce que la règle des 28 jours bloque la
piste la plus évidente. Cette règle protège les **titres et descriptions** seulement. Chaque run doit donc livrer
**au moins une amélioration vérifiable** prise dans cette rotation, dans l'ordre, en sautant ce qui est déjà fait :

1. Page en position 8 à 20 : section « réponse directe » en tête (2 à 3 phrases, chiffre daté, source) et FAQ visible
   alignée sur la requête réelle ; maillage avec ancre exacte depuis 2 pages fortes.
2. Page clé dont les faits ont plus de 90 jours : relecture contre la source, correction, `dateModified`.
3. Page orpheline ou hors index : liens entrants depuis des pages indexées, inspection d'URL.
4. Données structurées : valider (`npm run check:jsonld` ou équivalent), compléter `sameAs`, `Organization`,
   `FAQPage` seulement quand la FAQ est visible sur la page.
5. Un test GEO sur une requête **nouvelle** (pas seulement les prompts fixes) : qui est cité, pourquoi, quel
   manque sur nos pages (donnée, tableau, définition) ; le comblement va au backlog ou dans le run.
6. Netlinking : un message préparé, ou un lien obtenu vérifié.

Si malgré tout aucune action n'est faite, le journal dit laquelle des six a été examinée et pourquoi elle est
écartée (preuve), jamais « rien à faire ». Exemples pour KYRAN : bloc « réponse directe » sur Tarot africain, Whist 22, Rikiki ; dossier marché et palmarès du blog comme sources de chiffres datés.

---

## Livrables de chaque run

1. **Doc partagé « KYRAN — Pilotage SEO & GEO »** (Claude Docs) :
   `https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee` (doc `5d4cf936-dfeb-4516-bb57-2141b081edee`,
   onglet `23dc016e-d0bc`, corps `2febbbaa-b7f7`, graphique hebdomadaire = widget `27b6773b-8b8e`). Une ligne en
   tête du tableau de bord, la veille condensée remplacée, une ligne en tête du journal des actions, le backlog et
   les sections dont un fait a changé.
2. **Base de connaissances du dépôt** : `_notes/seo/base-connaissances.md` corrigée là où un fait a changé,
   `_notes/seo/kpi-quotidiens.csv` et `kpi-technique.csv` mis à jour par les scripts, `mouvements.json`,
   `_notes/seo/backlog.md`, `_notes/outreach/cibles.md` (netlinking) et `_notes/geo-tests.md` (GEO) à jour.
3. **Améliorations SEO/GEO fusionnées dans `main`** (PR, CI « Contrôles du site » verte, fusion par la routine,
   règle de `CLAUDE.md`) et vérifiées en ligne.
4. **Journal** : entrée en tête de [`suivi-seo.md`](suivi-seo.md) ; tout titre ou description changé va aussi dans
   le journal des titres de `docs/SUIVI-BLOG-SEO.md` (source unique de la règle des 28 jours).
5. **Message final** de la session en style caveman (`CLAUDE.md`).
6. **Retrouvable par toute IA** : `_notes/seo/README.md` (index du dossier) reste exact ; si un fichier du dossier
   change de nom ou de rôle, mettre à jour l'index et la section « SEO & GEO : où tout trouver » de `CLAUDE.md`,
   `AGENTS.md` et `.github/copilot-instructions.md`.

---

## Règles d'or (non négociables)

1. **Aucun chiffre ni fait inventé.** Chaque KPI vient d'une API ou d'une page ouverte ; chaque fait écrit sur le
   site suit l'anti-invention de `docs/BLOG-PASSES.md` et les faits canoniques de `_notes/memoire.md` § 1 (jamais
   « 55 cartes », « février 2026 », « sans élimination », « sans hasard »). Une mesure impossible s'écrit
   « non mesuré » avec la raison.
2. **Périmètre.** On modifie seulement la surface SEO (tableau ci-dessous). Un défaut dans une fonction principale
   va dans `seo/backlog.md` § « Hors périmètre » et dans le rapport, avec la preuve et le correctif proposé, **sans
   toucher au code**.
3. **Build et fichiers générés.** Une page générée se corrige dans sa source (`scripts/content/`, générateurs),
   jamais dans le HTML produit ; après toute modification : `npm run build`, puis `npm test`, et commit des
   fichiers régénérés (la CI vérifie que le build est à jour). Jamais d'édition à la main de
   `scripts/lastmod-manifest.json` ni des `?v=`.
4. **Règle des 28 jours.** Un `<title>`, `metaTitle` ou une description ne se réécrit pas moins de 28 jours après
   son dernier changement (journal de `docs/SUIVI-BLOG-SEO.md` et `git log -1 --format=%ad --date=short -G
   'metaTitle|<title>' -- <fichier>`). Mesurer avant. Au plus **3 titres ou descriptions par run**. Chaque
   changement : hypothèse, requête visée, date de réévaluation (J+28) dans le journal des titres.
5. **Blog : la routine blog en est propriétaire** (lun/mer/ven 13:50 depuis le 30/10/2026, `docs/BLOG-PASSES.md`). Ne jamais créer
   d'article ; ne pas toucher un article qu'une PR ouverte modifie ; proposer des sujets dans la liste « En
   attente » de `docs/BLOG-PASSES.md` (une ligne, requête et source GSC). Améliorer un article **publié** est
   permis dans sa source `scripts/content/blog/<slug>.mjs` (méta sous la règle 4, maillage, FAQ, fait corrigé), en
   respectant `scripts/content/README.md` et les vérifications de liens BGG et Wikipédia (`lecon.md`, 04/10).
6. **Netlinking propre.** Jamais de lien acheté, d'échange en masse, de faux avis, de commentaire ou de profil
   créé pour un lien, ni de compte créé au nom du propriétaire. Contacter un site est permis (autorisation du
   propriétaire, 2026-10-19) : au plus **2 messages préparés par run**, personnalisés, vers une adresse éditoriale
   publique ou un formulaire de contact. **Pas d'envoi par la routine** (décision du propriétaire, 2026-10-20 : pas
   de Gmail) : chaque message est mis, prêt à copier, dans la section Netlinking du doc partagé ; Corentin l'envoie
   s'il le souhaite, signé « Corentin Sence, auteur de KYRAN », **jamais depuis une adresse Majordia** (`lecon.md`,
   03/10). Modèles : `_notes/outreach/modeles-mails.md`. Une seule relance, pas avant 14 jours ; chaque run reporte
   dans `_notes/outreach/cibles.md` ce que Corentin a noté (envois, réponses, liens obtenus).
7. **Prix, port, pays de livraison, Stripe, avis Amazon** : jamais modifiés ; tout écart vu entre le site et la
   page Stripe → « À décider » et alerte (`lecon.md`, 12/10).
8. **Secrets** : jamais affichés ni écrits (nom de variable seulement). Rapport sans donnée personnelle.
9. **Décisions du propriétaire** (prix, offre, pages légales, suppression de page, design, mesure d'audience) :
   ne pas trancher, les écrire dans « À décider ».
10. **Un run à la fois.** Si le run précédent de cette session n'est pas fini, le terminer d'abord ou dire
    pourquoi. Les PR du run sont fusionnées **avant 05:00** (la routine Surveillance démarre à 05:07 ; horaires
    revus le 30/10/2026 : blog lun/mer/ven 13:50, ventes mardi 15:47).
11. **Budget : 2 h 30.** Priorité : site cassé ou désindexé > chute brutale > gains rapides (CTR en page 1,
    positions 8 à 20, pages hors index) > GEO > netlinking > dette. Mieux vaut 3 actions finies, fusionnées et
    vérifiées que 8 commencées.
12. **Ne pas sur-réagir.** Aucune action sur une variation d'un seul jour ; aucun titre changé pendant une mise à
    jour de classement Google en cours ; une donnée « provisoire » sert à l'alerte, jamais seule à la décision.
13. Le dépôt doit rester **public** (GitHub Pages gratuit) ; après la fusion, `curl -sI https://kyran-jeu.fr/`
    répond 200 (`lecon.md`, 08/10).
14. Limite d'utilisation Claude atteinte : commit « wip » sur la branche, `send_later` à la remise à zéro + 5 min,
    reprise sans attendre le propriétaire.

### Périmètre

| Modifiable (surface SEO/GEO) | Interdit (signaler seulement) |
|---|---|
| Pages racine indexables, hors zones `data-ssr` et hors application : `<title>`, description, og/twitter, H1 et Hn, textes, FAQ, JSON-LD (sauf prix et livraison de l'Offer), liens internes | Moteur du jeu : `dojo/engine.js`, `ai.js`, `lessons.js`, `app.js`, `dojo.css`, `dojo/img/` |
| `commander.html` : textes et méta seulement | Paiement : liens `buy.stripe.com`, `?ref=`, constantes Stripe et Amazon de `components.js`, `scripts/lib/product.mjs`, prix, port, pays, `priceValidUntil`, `merci.html`, CGV et pages légales |
| Blog publié : `scripts/content/blog/*.mjs` (règle 5), `roster.json` (redirections), `games.json` (faits sourcés), `scripts/lib/game-links.mjs` (liens vérifiés) | Infrastructure : `server/`, `worker/`, `error-reporter.js`, `scripts/apply-csp.mjs`, `admin-emails.*`, `scripts/auto-heal-worker.mjs`, `.github/`, `.mcp.json`, `.claude/`, `CNAME`, `BingSiteAuth.xml`, la clé IndexNow, `package*.json`, `vendor/` |
| Textes de `llms*.txt` et du plan du site dans `scripts/generate-seo.mjs` ; `scripts/lib/site-urls.mjs` ; listes de liens de `components.js` (navigation, pied de page) ; `robots.txt` (ajouts seulement, jamais bloquer un robot de recherche) | Design (`style.css`, `css/`, `hero-visual.js`, `js/motion.js`) : seulement une image plus légère ou un attribut `loading`/`fetchpriority`, avec capture Playwright avant / après à 390 et 1280 px ; sinon « À décider » |
| Images de partage (`og:image`) : nouvelles images WebP/JPEG 1200 × 630 tirées des visuels existants | Avis Amazon (`reviews-data.*`), faits canoniques du jeu |
| `seo-keywords.json`, `docs/SUIVI-BLOG-SEO.md` (journal des titres), `docs/rapports/`, `_notes/` (dont `NETLINKING_ANNUAIRES.md` à corriger) | Données Stripe : lecture seule si un outil existe, jamais d'écriture |

---

## Déroulé d'un run

### 0. Préparation (10 min)

```bash
git fetch origin --prune && git checkout -B claude/seo-$(TZ=Europe/Paris date +%F) origin/main
date -u; git log -1 --oneline origin/main
python3 -m venv /tmp/seovenv && /tmp/seovenv/bin/pip install -q -r scripts/requirements-seo.txt
npm ci --no-audit --no-fund   # en arrière-plan
```

- Outils : `ToolSearch` pour `WebSearch`, `WebFetch`, `mcp__github__*` (PR : `create_pull_request`,
  `pull_request_read`, `merge_pull_request`), les outils Claude Docs (`read`, `update`, `batch`, `guide` ; préfixe
  technique `mcp__<uuid>__` dans la session dédiée : chercher par nom d'outil, jamais par `mcp__Claude_Docs__`),
  Railway (`get-logs`, projet
  `kyran-webhook`), et s'ils existent `mcp__gsc__*` / `mcp__bing-webmaster__*` (souvent lents au démarrage : les
  scripts suffisent). Avant le premier appel au doc partagé : skill `anthropic-skills:docs` s'il est listé, sinon
  `guide(items=["topic.index"])`.
- PR ouvertes (`mcp__github__list_pull_requests`) : les fichiers qu'elles touchent attendent le run suivant.

### 1. Base de connaissances (20 min)

- `git log --since="24 hours ago" --stat origin/main`, puis 48 h et 7 j (`--oneline`) : pages ajoutées, renommées
  ou redirigées, articles publiés ou rafraîchis, décisions dans `_notes/` et `docs/` (`BLOG-PASSES.md`,
  `VENTES-PASSES.md`, `rapports/`).
- Reporter dans `seo/base-connaissances.md` **seulement ce qui a changé** (daté). Moins de 400 lignes.
- Toute nouvelle page indexable des dernières 24 h : titre, description, H1, canonical, JSON-LD, sitemap,
  `llms.txt`, liens entrants ; corriger dans le run ou noter au backlog.

### 2. Mesures (25 min)

Les données les plus fraîches d'abord : Search Console donne la veille en `dataState: all` (provisoire) et
l'heure par heure sur 10 jours avec ~10 h de retard ; l'inspection d'URL et le site en direct sont en temps réel ;
Bing a ~2 jours de retard. Indicateurs, sources et seuils : `seo/base-connaissances.md` § 6.

```bash
/tmp/seovenv/bin/python scripts/seo-kpi-daily.py                    # CSV quotidien, 24 h horaires, mouvements
/tmp/seovenv/bin/python scripts/seo-health.py --sample 0 --inspect 30 # tout le sitemap + inspection Google
```

- **Search Console** (`sc-domain:kyran-jeu.fr`) : jour, 7 j, 28 j, dernières 24 h contre J-7, pages et requêtes en
  hausse ou en baisse (`seo/mouvements.json`) ; requêtes en position 8 à 20 ; clics de marque (« kyran ») ; sitemaps.
- **Indexation** : inspection des pages clés et d'une rotation (quota 2 000/jour), plus toute URL publiée ou
  modifiée en 48 h ; suivre les pages hors index du backlog.
- **Bing** (`https://kyran-jeu.fr/`) : trafic et index par le script ; `GetCrawlIssues`, `GetQueryStats`,
  `GetPageStats` ; le lundi `GetLinkCounts` / `GetUrlLinks` (liens entrants).
- **Site en direct** (`seo-health.py`) : codes HTTP, canonical, titres, descriptions, H1, JSON-LD, `og:image`, TTFB,
  `robots.txt`, `llms.txt`. Les contrôles du dépôt complètent : `npm run check:site`, `npm run test:seo`,
  `npm run check:jsonld`.
- **Performance** : `--psi` à chaque run (clé dans `.secrets/pagespeed-api-key.txt`) ; si PageSpeed ne répond pas, le lundi, Lighthouse en local
  (`CHROME_PATH=/opt/pw-browsers/chromium npx -y lighthouse@12 <url> --only-categories=performance,seo
  --output=json --quiet --chrome-flags="--headless=new --no-sandbox"`) sur l'accueil et `tarot-africain.html`.
- **Robots d'IA** : GitHub Pages ne donne pas de journaux et aucun proxy Cloudflare n'est devant le site (le
  relevé `seo-cloudflare-bots.py` de Majordia ne s'applique pas) : « non mesuré ».
- **Ventes** : journaux Railway du projet `kyran-webhook` (événements `checkout.session.completed`), nombre par
  jour seulement ; sinon « non mesuré ». Jamais de nom ni d'e-mail de client.
- **Effet du travail SEO récent** : pour chaque page modifiée sur `main` depuis 14 jours, clics, impressions et
  position 7 jours avant et après la date du commit (Search Console, dimension `page`) ; « trop tôt » sous 7 jours.

### 3. Veille (25 min)

Condenser en quatre horizons : **24 h, 48 h, 7 jours, 30 jours**.

- **Marque** : WebSearch « KYRAN jeu de cartes », « Kyran Maître des Mystiques », « kyran-jeu.fr » ; Ludovox,
  BoardGameGeek (`api.geekdo.com/api/geekitems?objectid=480678&objecttype=thing`), Trictrac, MyLudo, Okkazeo, Philibert,
  Amazon (note et nombre d'avis), YouTube, Instagram @kyran.jeu, Reddit, forums. Chaque mention nouvelle : URL,
  date, ton, lien ou non → `seo/base-connaissances.md` § Mentions.
- **SERP** : les requêtes cibles de la base (§ 3) : qui est en tête, où est KYRAN, changement depuis le dernier
  relevé.
- **Concurrents et marché** : nouveaux jeux de plis, sélections « meilleurs jeux de cartes », actualité des
  éditeurs et revendeurs, saison (Noël : date limite d'expédition, guides cadeaux).
- **Moteurs** : Google Search Status Dashboard, Search Central blog, Bing Webmaster blog, annonces des moteurs IA.
- **GEO** : 3 prompts de `_notes/geo-tests.md` chaque nuit (tous le lundi) via WebSearch (approximation du moteur
  de Claude) : C, M ou —, et qui est cité à la place.

### 4. Bonnes pratiques (le lundi, 15 min ; sinon sur annonce majeure)

Sources officielles (Search Central, Bing Webmaster, OpenAI, Perplexity, Anthropic, schema.org, web.dev) et études
chiffrées récentes ; mise à jour de la section du doc et de la base, avec date et URL.

### 5. Diagnostic et choix des actions (15 min)

Opportunités notées (impact × confiance ÷ effort), **3 à 5** retenues :

1. **Incident** : page clé hors index, sitemap en erreur, 404, canonical faux, `noindex` par erreur, site non
   publié, chute de plus de 30 % sur 7 j.
2. **Pages hors index** : liens internes depuis les pages fortes, contenu propre, inspection.
3. **CTR** : page 1, CTR < 2 %, au moins 100 impressions sur 28 j → titre et description (règle 4).
4. **Positions 8 à 20** : contenu qui répond à la requête réelle, FAQ visible, maillage avec ancre exacte.
5. **Cannibalisation** : `seo-keywords.json` et Search Console ; une page par requête.
6. **GEO** : KYRAN nommé dans la phrase-réponse des pages Tarot africain, Whist 22, Rikiki ; faits datés ;
   cohérence de l'entité (`sameAs`, Wikidata, BGG).
7. **Netlinking** : `_notes/outreach/cibles.md` (§ 7).
8. **Dette** : images de partage, liens cassés, docs fausses.

### 6. Exécution (60 à 90 min)

- Branche `claude/seo-<date>` ; un commit par action (`seo: <quoi> (<page>)`), terminé par les lignes
  d'attribution de la session.
- `npm run build`, `npm test` (et `npm run check:site`) verts ; fichiers générés commités.
- PR vers `main` (titre `SEO : <résumé> (run du AAAA-MM-JJ)`, corps : actions, mesure attendue, date de
  réévaluation) ; attendre « Contrôles du site » sur le dernier commit (boucle `until` avec `pull_request_read`,
  pas de `sleep` isolé long) ; CI rouge : corriger et repousser (3 tours au plus, sinon PR laissée ouverte avec la
  raison) ; verte, sans conflit ni commentaire ouvert : passer prête et fusionner (règle de `CLAUDE.md`).
- Après la fusion : `pages.yml` publie (relancer `gh workflow run pages.yml` si un push par `GITHUB_TOKEN` l'a
  empêché), la page en ligne montre le changement (`curl` + recherche du texte), `curl -sI https://kyran-jeu.fr/`
  en 200 ; IndexNow part avec `indexnow.yml`.
- Chaque correction notable ou erreur évitée → entrée en tête de `_notes/lecon.md`.

### 7. Netlinking et présence externe (15 min)

- Envois et réponses notés par Corentin (doc partagé, `_notes/outreach/cibles.md`) → statuts à jour ; liens
  obtenus vérifiés en ligne puis notés avec la date.
- 1 à 2 messages personnalisés prêts à copier dans le doc (règle 6, pas d'envoi par la routine), ressource gratuite à l'appui (feuille de score PDF, initiation,
  comparatif des jeux de plis, synthèse « cartes et cerveau », exemplaire de test).
- **BoardGamesFlix : ne plus y passer** (fiche réglée par Corentin, décision du 21/10/2026) : ni relevé, ni demande,
  ni texte à préparer ; les liens du site vers BoardGamesFlix restent tels quels.
- Présence propriétaire (BGG, Trictrac, MyLudo, Wikidata, Merchant Center) : textes et étapes à faire par Corentin,
  ne rien créer soi-même.

### 8. Rapport (15 min)

**a) Doc partagé** (IDs plus haut ; outils absents : « Doc partagé non mis à jour : connecteur Claude Docs
absent » en tête du journal et du message final) :

1. `read` du doc depuis le `rev` noté au run précédent (`suivi-seo.md`) : les modifications et commentaires du
   propriétaire priment ; y répondre dans le fil ou les appliquer.
2. Tableau de bord : une ligne **en tête** (Run, Google clics 7 j (variation), impressions 7 j (variation), CTR
   28 j, position 28 j, Bing clics 7 j, impressions 7 j, pages dans l'index Bing, citations IA (proxy, sur N
   prompts), actions livrées, verdict). Le lundi, ajouter la semaine écoulée au graphique (lignes du widget).
3. Veille condensée : **remplacer** par celle du jour (24 h, 48 h, 7 j, 30 j ; 3 à 6 puces par horizon).
4. Journal des actions : une ligne **en tête** par action (date, page, action, pourquoi, PR, mesure à J+28).
5. Autres sections : modifier seulement ce qui a changé ; mettre à jour la date du chapeau.

**b) Dépôt** : entrée en tête de `suivi-seo.md` (date, verdict, KPI, veille en 5 lignes, actions + PR, à décider,
hors périmètre, `rev` du doc), fichiers `_notes/seo/` : dans la PR du run, ou PR « docs(seo): journal du run »
si aucune action.

**c) Alerte** : site non publié, page clé désindexée ou chute > 50 % → `PushNotification` si l'outil existe.

**d) Message final** (caveman) : mesuré, fait (PR), en ligne, reste, à décider.

---

## Leçons du chantier « SEO intense » du 19/10/2026

- **Ne jamais additionner les lignes requête × page** pour chiffrer une requête : les ancres `#…` comptent chacune leurs impressions. Pour une requête, interroger la dimension `query` seule (le rapport du 18/10 avait ainsi 1 134 impressions au lieu de 221).
- **Inspecter aussi les URL hors sitemap** (redirections `meta refresh` de `roster.json`, `/blog/index.html`) : une redirection n'est prise en compte qu'à la réexploration ; une page « Détectée, non indexée » ne se règle pas par des liens internes quand elle en a déjà 50, mais par une demande d'indexation.
- **IndexNow part avant la mise en ligne** (30 runs sur 30) : ne pas compter sur lui pour une page neuve ; soumettre aussi par l'API Bing après la fin de `pages.yml`.
- **Lighthouse local** : ajouter `--proxy-server=$HTTPS_PROXY` aux `--chrome-flags` dans le cloud ; 3 passes, garder la médiane ; regarder l'élément LCP réel (`largest-contentful-paint-element`, `lcp-discovery-insight`) avant de toucher au CSS.
- **Une fois par mois**, audit complet A à K (crawl, performance, données structurées, indexation, Bing/IA, contenu, boutique, conformité, infra, autorité, critique de complétude) avec vérification contradictoire de chaque constat ; consigne et format dans `docs/rapports/seo-intense-2026-10-19.md`.
- **Vérifier ce que publie `pages.yml`** : `curl -s -o /dev/null -w '%{http_code}' https://kyran-jeu.fr/_notes/seo/kpi-quotidiens.csv` doit répondre 404.

## Réévaluation des actions passées

Chaque run relit le journal : toute action arrivée à J+14 ou J+28 est mesurée (même requête, même page, même
durée avant/après) et marquée **gagné**, **neutre** ou **perdu** (doc et `suivi-seo.md`). Ce qui marche va dans
`seo/base-connaissances.md` § « Ce qui marche sur kyran-jeu.fr » ; ce qui échoue n'est pas refait à l'identique.
