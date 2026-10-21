# Mission : routine « Surveillance & réparation KYRAN » (quotidienne)

- **Quand :** tous les jours à **05:07 (Europe/Paris)**, routine Claude Code `trig_01Dw3TeebMHnAaihXuQnjntu`
  (l'ancienne routine « Santé », renommée et déplacée à 05:07 le 2026-10-21).
- **Où :** elle réveille la **session dédiée** `session_01T9bSGDeknHi8e94Rgo2ufR`, dépôt `Cmssmc-code/kyran-jeu`
  attaché. Sa consigne figée renvoie à `_notes/sante-routine-mission.md`, qui renvoie ici : ce fichier fait foi, et
  ses livrables remplacent ceux de la consigne (plus de `suivi-sante.md`).
- **Connecteurs : aucun garanti.** La routine n'a aucun connecteur attaché (`mcp_connections` vide) : Railway,
  Resend, Gmail et Stripe peuvent tous manquer. Chercher chaque outil avec `ToolSearch` au début du passage et
  noter dans le rapport ce qui est présent. Replis prévus partout (voir « Sans connecteur » ci-dessous). Le
  connecteur Stripe de claude.ai pointe sur un autre compte : ne jamais l'utiliser ici.
- **Fait foi :** ce fichier, relu sur `origin/main` à chaque passage. Le modifier modifie le passage suivant.

### Sans connecteur : replis

| Besoin | Avec connecteur | Sans connecteur |
|---|---|---|
| Journal d'incidents, clôtures | — (toujours par le workflow) | workflow `auto-heal-incidents.yml` via `gh api` (jeton OIDC, aucun secret) |
| Serveur Railway | `list-deployments`, `get-logs`, métriques | `curl …/health` + temps de réponse ; dernier commit `server/` comparé à la `version` de `/health` ; journaux, 5xx, CPU/mémoire « non vérifiés : connecteur Railway absent » |
| Rapport e-mail | Resend (domaine vérifié) puis Gmail | voie serveur : `auto-heal-incidents.yml` action `report` (`contact@kyran-jeu.fr` → kyran.jeu@gmail.com, destinataire codé en dur, testé) |
| Stripe | lecture `acct_1UBHzpPe2ed8eDFC` | page du Payment Link ouverte avec Playwright sans payer ; « Stripe non vérifié » pour le reste |
| GitHub | `gh api` (REST) marche dans la session (constaté le 2026-10-21, même si `gh auth status` dit le jeton invalide) | `mcp__github__*` si présent |

Remplace depuis le 2026-10-21 la routine « Santé quotidienne » (`_notes/sante-routine-mission.md`, minuit) et la
passe horaire GitHub Actions « Hourly Auto-Heal » (`.github/workflows/auto-heal-hourly.yml`, désormais manuelle :
elle échouait à chaque passage faute d'auth Anthropic). Une routine Claude n'a pas besoin de clé Anthropic :
c'est elle qui répare désormais les incidents de production.

Lire avant tout, dans l'ordre : `CLAUDE.md`, `AGENTS.md`, `_notes/lecon.md` (en entier), `_notes/memoire.md`
(§ 2 architecture, § 3 serveur, § 7 workflows, § 8 Auto-Heal, § 14 routines), `docs/AUTO-HEAL.md`, les deux
dernières entrées de [`suivi-surveillance.md`](suivi-surveillance.md) (points ouverts à suivre en priorité).

---

## Règles d'or (non négociables)

1. **Aucun constat inventé.** Chaque ligne du rapport a sa preuve : commande et sortie, code HTTP, ligne de log,
   run de workflow, capture Playwright. Jamais « tout va bien » sans le contrôle qui le montre. Un contrôle
   impossible (connecteur absent, hôte bloqué) s'écrit « non vérifié » avec la raison.
2. **Paiement intouchable.** Prix (9,99 €), port (2,99 €), pays de livraison, Payment Link
   (`STRIPE_CHECKOUT_URL` de `components.js`, `plink_1UBIC0Pe2ed8eDFCuudRl3Nq`), produit Stripe
   (`prod_VBfXBJYQzElac4`), redirection vers `merci.html`, remboursements, avis Amazon : jamais modifiés. Stripe en
   lecture seule, compte `acct_1UBHzpPe2ed8eDFC` seulement. Un écart site / page Stripe → « Décision du
   propriétaire » (`lecon.md`, 12/10).
3. **Le dépôt reste public** (GitHub Pages gratuit, `lecon.md`, 08/10) : visibilité et réglages Pages en lecture
   seule ; seule réparation permise sur Pages : relancer `pages.yml`.
4. **Routines sœurs.** Blog : routine lun/mer/ven 06:50 (`docs/BLOG-PASSES.md`) ; ne jamais créer d'article ni
   toucher une PR `claude/blog-*` vivante ; un défaut d'article publié se corrige dans sa source
   (`scripts/content/README.md`). SEO : routine de minuit (`_notes/seo-routine-mission.md`) ; ne pas toucher
   `_notes/seo/`, titres, descriptions, `seo-keywords.json` ; un défaut SEO non bloquant va dans « Pour la routine
   SEO » du rapport. Ventes : routine du mardi 06:47 (`docs/VENTES-PASSES.md`). Une page en erreur, un sitemap
   invalide ou un site désindexé reste une panne à réparer ici.
5. **PR fusionnées avant 06:30** (blog à 06:50, ventes le mardi à 06:47). `git fetch origin main` et fusion de
   `main` avant chaque push ; conflit sur `_notes/lecon.md` ou `_notes/memoire.md` résolu en gardant les deux
   entrées.
6. **Un seul passage à la fois :** si `suivi-surveillance.md` porte une entrée d'aujourd'hui « en cours » vieille de
   moins de 4 h, s'arrêter et le dire.
7. **Décisions du propriétaire** : prix, offre, pages légales, suppression de page ou de fonction, design, mesure
   d'audience, envois d'e-mails à des tiers, secrets et comptes externes (Anthropic, Resend, Instagram) → ne pas
   trancher ; les écrire dans « Décision du propriétaire » avec les étapes exactes.

---

## A. Recherche poussée, chaque jour, tout couvrir (≈ 1 h 30)

Préparation :

```bash
git fetch origin --prune && git checkout -B claude/surveillance-$(TZ=Europe/Paris date +%F) origin/main
date -u; git log -1 --oneline origin/main
npm ci --no-audit --no-fund   # en arrière-plan ; Node 22
```

Outils : `ToolSearch` (`select:<nom>`) pour Railway (`list-deployments`, `get-logs`, `get-service-config`,
`http-error-rate`, `http-response-time`, `get-service-metrics`, `list-variables`), Resend, Gmail, `WebSearch`,
`WebFetch`, `PushNotification` (s'il existe). Les outils d'un connecteur peuvent apparaître sous un préfixe
technique (`mcp__<uuid>__get-logs`) : chercher par nom d'outil. GitHub : `gh api` (REST ; **GraphQL interdit**).

Chaque problème trouvé s'écrit avec : **preuve**, **gravité** (bloquant / gênant / mineur / bruit), **cause
probable**.

### A1. Journal d'incidents du serveur (en premier)

- **Lecture :** lancer le workflow `auto-heal-incidents.yml` (action `list`), puis lire le journal du job.
  **Un appel à la fois** : attendre la fin du run (`status` `completed`) avant d'en lancer un autre (le
  2026-10-21, trois clôtures lancées en rafale ont été annulées par la file d'attente ; corrigé, mais vérifier
  toujours la conclusion de chaque run) :

  ```bash
  gh api -X POST repos/Cmssmc-code/kyran-jeu/actions/workflows/auto-heal-incidents.yml/dispatches \
    -f ref=main -f 'inputs[action]=list'
  sleep 20; RUN=$(gh api "repos/Cmssmc-code/kyran-jeu/actions/workflows/auto-heal-incidents.yml/runs?per_page=1" --jq '.workflow_runs[0].id')
  JOB=$(gh api repos/Cmssmc-code/kyran-jeu/actions/runs/$RUN/jobs --jq '.jobs[0].id')
  gh api repos/Cmssmc-code/kyran-jeu/actions/jobs/$JOB/logs | sed 's/^[0-9TZ:.-]* //' > /tmp/incidents.log
  ```

  **C'est la seule voie** : le workflow s'authentifie auprès du serveur par son jeton OIDC GitHub (aucun secret).
  `X-Cron-Secret` n'est **pas** utilisable par la routine : le connecteur Railway rend les variables avec
  `valuesRedacted: true` (noms seulement, OAuth), et `CRON_SECRET` n'existe d'ailleurs pas sur Railway (constaté le
  2026-10-21). Ne jamais créer ni changer cette variable.
- La route ne rend que les incidents **en attente** (`pending`, moins de 3 tentatives), triés par nombre
  d'occurrences. Pour les nouveaux et les récurrents : journaux Railway 7 jours filtrés sur `[AutoHeal]`
  (`Nouvel incident JS-…/SRV-…`), comparés au rapport de la veille.
- Workflow en échec ou serveur injoignable : journaux Railway `[AutoHeal]` seulement, « journal non lu » dans le
  rapport, et c'est un problème gênant à traiter.
- Champs utiles : `id` (UUID, pour la clôture), `display_code`, `message`, `stack`, `file`/`line`, `pages`,
  `assetVersion` (version du site chez le visiteur : une version ancienne = onglet resté ouvert), `browser` /
  `platform` (version courte, pour les vieux navigateurs).

### A2. Serveur Railway `kyran-webhook`

Projet `365539aa-a674-49b3-845f-b0793b952dbd`, environnement `production`
(`2346a967-c9f6-4920-bbc9-9d0955e62922`), service `kyran-webhook` (`8cb1b665-67fd-4592-950f-7ba78fff4d8d`),
URL `https://kyran-webhook-production.up.railway.app`.

- Panne Railway possible : `https://status.railway.com/` (`WebFetch`) ; le 2026-10-21, « builds paused » : aucun
  déploiement créé pour 4 pushs sur `main`, serveur resté en ligne sur l'ancienne version. Dans ce cas : noter,
  ne pas clôturer les incidents dont le correctif est dans `server/`, revérifier en fin de passage.
- `list-deployments` : un push qui ne touche pas `server/` donne `SKIPPED` (normal). Le dernier `SUCCESS` doit
  porter le dernier commit qui touche `server/` (`git log -1 --format=%H origin/main -- server/`, ou le commit de
  fusion qui le contient). `CRASHED` / `FAILED` / `SUCCESS` trop ancien → `get-deployment-diagnosis`, réparation.
- `get-service-config` : racine `/server`, `watchPatterns` `/server/**`, `node server.js`, healthcheck `/health`,
  1 réplique `us-east4`, volume `kyran-incidents` sur `/data`. Toute dérive se signale.
- `get-logs` 24 h, filtres `error`, `warn`, `unhandled`, `uncaught`, `timeout`, `ECONN`, `5\d\d` : regrouper par
  message. **Un avertissement à chaque démarrage = bug** (à corriger, pas à ignorer).
- `http-error-rate` (5xx > 1 % → enquête), `http-response-time` (p95 en nette hausse sur la veille → enquête),
  `get-service-metrics` CPU / mémoire 24 h (mémoire qui monte sans redescendre = fuite).
- `curl -s -w '%{http_code} %{time_total}' …/health` : `status` `ok`, `hasWebhookSecret` `true`, `adminEnabled`
  `true`, `emailTransport` `resend` ; temps de réponse noté.
- Redéployer ou redémarrer un service `CRASHED` / `FAILED` est permis. Jamais supprimer un service, un volume, un
  domaine ou une variable ; une variable ne change que si la cause est prouvée, nom seulement dans les écrits.

### A3. Workflows GitHub

`gh api "repos/Cmssmc-code/kyran-jeu/actions/runs?created=>$(date -u -d '24 hours ago' +%FT%TZ)&per_page=100"` :

- `ci.yml` (« Contrôles du site ») vert sur la tête de `main` ;
- `pages.yml` vert et son journal **sans** « publication ignorée » ; `seo-config.js` en ligne porte le même
  `ASSET_VERSION` que `main` ;
- `indexnow.yml` vert ; `instagram.yml` (planifié `17 5 * * *`, GitHub le lance souvent vers 9-10 h UTC) vert la
  veille ; issue ouverte « Synchronisation Instagram : action requise » → la signaler ;
- **tout schedule mort à signaler** : un workflow à `schedule:` sans run depuis plus de 48 h, ou rouge deux jours de
  suite. `auto-heal-hourly.yml` et `update-reviews.yml` sont manuels : ne pas les lancer (sauf `smoke_test` si le
  propriétaire annonce avoir réparé l'auth Anthropic).

### A4. Site en ligne (Playwright)

`playwright-core` + Chromium préinstallé (`executablePath: '/opt/pw-browsers/chromium'`, module dans
`/opt/node-tools/node_modules/playwright-core`) ; **jamais `playwright install`**.

- **Toutes les pages du sitemap**, en desktop 1280 px et mobile 390 px, avec ouverture des menus, des `details` et
  des accordéons, défilement jusqu'en bas : erreurs console (CSP comprises), `pageerror`, requêtes en échec, réponses
  4xx/5xx, images cassées, **débordement horizontal**. Liens de toutes les pages : internes en GET, externes en
  HEAD puis GET (un 403 d'un site qui bloque les robots, BGG par exemple, est du bruit, à noter comme tel).
- Codes HTTP : une URL inconnue répond 404 avec `404.html` ; `https://www.kyran-jeu.fr/` et `http://kyran-jeu.fr/`
  redirigent vers `https://kyran-jeu.fr/` ; `robots.txt`, `sitemap.xml`, `llms.txt`, `blog/feed.xml` en 200 ;
  `_notes/`, `docs/`, `.claude/`, `.mcp.json` en 404 (`lecon.md`, 19/10).
- **Parcours critiques, lecture seule, aucun formulaire rempli :**
  - accueil, `/regle.html` : chargés sans erreur, éventail de cartes et menu mobile fonctionnels ;
  - `/commander.html` → bouton d'achat → **page Stripe du Payment Link ouverte SANS payer** : prix unitaire
    9,99 € et port 2,99 € lus sur la page Stripe et comparés à ceux du site (écart → décision du propriétaire) ;
  - initiation `/minijeu.html` : modules `dojo/` chargés (aucun 404 sur `?v=`), une partie démarre, une carte se
    joue sans erreur ;
  - blog : `/blog/`, l'article le plus récent (200, dans `sitemap.xml` et `blog/feed.xml`).
- TLS : **pas `openssl s_client`** (le proxy de la session présente son propre certificat, échéance = J+30) ;
  lire les journaux Certificate Transparency :
  `curl -s "https://api.certspotter.com/v1/issuances?domain=kyran-jeu.fr&include_subdomains=true&expand=dns_names"`
  et `…?domain=up.railway.app&expand=dns_names` (dernier `not_after`) ; alerte sous 21 jours. Réponse en objet
  (limite de débit) : attendre 5 s et relancer.

### A5. Stripe, e-mails, dépendances

- Stripe (`acct_1UBHzpPe2ed8eDFC` seulement ; vérifier `account_id` avant toute lecture) : erreurs et webhooks en
  échec en lecture seule si un outil le permet ; sinon journaux Railway filtrés sur `stripe`, `webhook`,
  `signature`, `checkout.session.completed`, `charge.refunded`, et « Stripe non vérifié : connecteur absent ».
- E-mails : erreurs d'envoi dans les journaux Railway (`resend`, `smtp`, `mailer`, `Email`) ; une vente sans e-mail
  client ou sans alerte admin est bloquante.
- `npm audit --omit=dev --audit-level=high` puis `npm audit` (racine ; `server/` n'a pas de dépendance).
- Sur `origin/main` : `npm run build` puis `git status --porcelain` (aucun diff hors `scripts/lastmod-manifest.json`),
  puis `npm test` vert.
- Branches et PR ouvertes avec des commits absents de `main` : les signaler (règle C7).

### A6. Veille (15 min)

`WebSearch` / `WebFetch`, changelogs et dépréciations des 7 derniers jours : GitHub Pages et Actions
(github.blog/changelog), Railway (railway.com/changelog), Node.js (versions, fin de vie de Node 22), Resend, API
Stripe (versions, dépréciations Payment Links / webhooks), Instagram Graph API (jetons, versions), Cloudflare
Workers. Pour chacun : ce qui change, si KYRAN est touché, **la source (URL)**. Rien de neuf → « rien de neuf »
avec la source consultée.

---

## B. Réparation (≈ 1 h 30)

- Ordre : **bloquant > gênant > mineur**. Mieux vaut 3 réparations finies et vérifiées que 8 commencées ; le
  reste va dans « Points ouverts ».
- **La cause, pas le symptôme.** Une fausse alerte (bruit : robot, extension, script tiers, coupure réseau du
  visiteur, vieux navigateur non pris en charge, onglet resté ouvert sur une ancienne version) se corrige par un
  **filtre précis** dans `isBenignClientError` (`server/incidents.js`) ou dans `error-reporter.js`, avec un test
  dans `server/test/auto-heal.test.mjs` (ou `scripts/test/error-reporter.test.mjs`) ; jamais en masquant une vraie
  panne.
- Correctif dans la **source** (`scripts/content/`, générateurs, `components.js`, `server/`, `dojo/`…), jamais dans
  un HTML généré ; jamais d'édition à la main de `scripts/lastmod-manifest.json` ni des `?v=`.
- `npm run build` puis `npm test` verts, fichiers générés commités.
- Branche `claude/surveillance-<AAAA-MM-JJ>`, un commit par réparation (`fix(<zone>): <quoi>`) terminé par les
  lignes d'attribution de la session. PR `Surveillance : <résumé> (passage du AAAA-MM-JJ)`, corps : constat
  (preuve), cause, correctif, test, vérification prévue. **Fusion dès « Contrôles du site » vert** sur le dernier
  commit, sans conflit ni commentaire ouvert (règle `CLAUDE.md`) :
  `gh api -X PUT repos/Cmssmc-code/kyran-jeu/pulls/<n>/merge -f merge_method=merge`. Jamais `--force`, jamais
  `--no-verify`.
- **Vérification en ligne** après fusion : `pages.yml` vert sans « publication ignorée », la page corrigée rejouée
  (Playwright ou `curl` + texte) ; pour `server/`, déploiement Railway `SUCCESS` sur le nouveau SHA et `/health` en
  `ok`. Échec → correctif ou **revert immédiat** (PR de revert, même règle de fusion).
- **Clôture des incidents** (après vérification en ligne seulement), par le workflow `auto-heal-incidents.yml` :

  ```bash
  W=repos/Cmssmc-code/kyran-jeu/actions/workflows/auto-heal-incidents.yml/dispatches
  gh api -X POST $W -f ref=main -f 'inputs[action]=resolve' -f 'inputs[incident_id]=<uuid>' \
    -f 'inputs[commit_sha]=<sha de fusion>' -f 'inputs[reason]=<résumé, 300 car.>'
  gh api -X POST $W -f ref=main -f 'inputs[action]=ignore' -f 'inputs[incident_id]=<uuid>' -f 'inputs[reason]=<pourquoi>'
  gh api -X POST $W -f ref=main -f 'inputs[action]=fail'   -f 'inputs[incident_id]=<uuid>' -f 'inputs[reason]=<pourquoi>'
  ```

  Contrat serveur (`server/server.js`, `routeAutoHeal`) : `POST /api/auto-heal/incidents/resolve`
  `{incidentId, commitSha, resolutionSummary, report}`, `…/fail` et `…/ignore` `{incidentId, reason, report}` ;
  transitions seulement depuis `pending` (404 sinon) ; correctif dans `server/` → clôture seulement après
  déploiement Railway `SUCCESS` du SHA (sinon l'incident reste `pending` jusqu'au passage suivant) ; `fail` compte une tentative, l'incident passe `failed` à la
  3ᵉ. Un run de workflow rouge = clôture non faite : lire son journal.
- **3 tentatives au plus par problème** (un `fail` par tentative ratée) ; ensuite « Décision du propriétaire ».
- Chaque correctif notable → entrée en tête de `_notes/lecon.md`, titre `### AAAA-MM-JJ — [Auto-Heal] <code ou
  sujet> — <résumé>`, puces **Symptôme**, **Cause**, **Correctif** ; une règle devenue fausse se corrige dans le même
  commit.

---

## C. Garde-fous

1. **Aucun e-mail ni message à des tiers** (clients, joueurs, prospects, presse). Ne jamais appeler
   `POST /api/shipping`, `/api/send-custom-email`, `/api/auto-heal/test-email`, `/api/auto-heal/daily-report`, ni un
   script `send-*` / `pitch:presse` ; aucun webhook Stripe de test. **Seul destinataire du rapport :
   kyran.jeu@gmail.com.**
2. Jamais toucher prix, port, Payment Link, produit Stripe, redirection `merci.html`, remboursements.
3. **Aucune donnée inventée** (règle d'or 1).
4. **Aucun secret** commité, écrit dans un rapport, un journal, une PR ou un prompt (noms de variables seulement).
   Rapport sans donnée personnelle (ni e-mail, nom, adresse de client, ni numéro de suivi).
5. Le dépôt reste public.
6. **Jamais d'adresse ni de mention Majordia** dans un écrit KYRAN (rapport, PR, commit, e-mail, page).
7. **Ne pas toucher à une branche dont le dernier commit a moins de 3 h** (une session y travaille peut-être) ; au-
   delà, chercher sa session (`Claude-Session:` du commit, `mcp__claude-code-remote__get_session`) : vivante → la
   signaler ; terminée et travail fini → relecture adverse, CI, fusion ; inachevé → le signaler. Aucune branche ne
   se supprime depuis le cloud.
8. **Budget : 4 h.** Au-delà, rapport avec ce qui reste.
9. Limite d'utilisation Claude atteinte : commit « wip » sur la branche, `send_later` à la remise à zéro + 5 min,
   reprise sans attendre le propriétaire (`lecon.md`).
10. Ne crée ni ne supprime aucune routine.

---

## D. Rapport quotidien, **toujours envoyé**, même sans rien à signaler

**Un seul e-mail HTML par jour**, à **kyran.jeu@gmail.com**, objet exact
**« KYRAN — surveillance & réparation du JJ/MM »**. Sobre, lisible sur mobile (une colonne, 600 px max, styles en
ligne, pas d'image, tableaux simples), sans secret ni donnée personnelle. Contenu :

1. **État global en 3 lignes**, chacune avec une pastille 🟢 vert / 🟠 orange / 🔴 rouge : site et paiement ;
   serveur et incidents ; workflows, code et veille.
2. **Ce qui a été cherché et la couverture** (pages × tailles d'écran, liens, journaux, incidents lus, contrôles non
   faits et pourquoi).
3. **Problèmes par gravité** (bloquant, gênant, mineur, bruit) avec preuve et cause probable.
4. **Réparations** : PR (lien), SHA fusionné, vérification en ligne, incidents clôturés (codes).
5. **Échecs et décisions du propriétaire** (étapes exactes).
6. **Veille** avec sources (liens).
7. **Comparaison avec la veille** (nouveau, résolu, toujours ouvert).

**Envoi** (dans cet ordre ; la voie utilisée est **dite dans le rapport et le journal**) :

1. **Resend** (`mcp__Resend__send-email` ou outil Resend équivalent) **si le connecteur est connecté et** le domaine
   `kyran-jeu.fr` **vérifié** dans son compte (outil Resend de liste des domaines, statut `verified`). Expéditeur
   `KYRAN <contact@kyran-jeu.fr>`.
2. **Sinon Gmail** si le connecteur est présent (`mcp__Gmail__send_message`, compte Gmail personnel du propriétaire),
   `to` = `kyran.jeu@gmail.com` seulement, corps en `htmlBody` (+ `body` texte). Constaté le 2026-10-21 : connecteur
   Resend non connecté (« connect_incomplete », aucun outil `mcp__Resend__*`) → voie Gmail. Avant l'envoi, vérifier
   que l'expéditeur du connecteur n'est pas une adresse d'un autre produit (sinon passer à 3).
3. Sinon (cas normal dans la session dédiée, sans connecteur), **serveur KYRAN** : route
   `POST /api/auto-heal/routine-report` (`contact@kyran-jeu.fr` par le Resend du serveur, destinataire
   kyran.jeu@gmail.com **codé en dur**, objet imposé, un seul rapport par jour ; test
   `server/test/auto-heal.test.mjs`), appelée par le workflow OIDC :

   ```bash
   gh api -X POST repos/Cmssmc-code/kyran-jeu/actions/workflows/auto-heal-incidents.yml/dispatches \
     -f ref=main -f 'inputs[action]=report' -f "inputs[report_subject]=KYRAN — surveillance & réparation du $(TZ=Europe/Paris date +%d/%m)" \
     -F 'inputs[report_html]=@/tmp/rapport.html'
   ```

   (corps HTML ≤ 60 000 caractères ; run vert avec `"sent":true` = envoyé ; `already_sent_today` = ne pas renvoyer).
4. Rien de possible : **ne jamais envoyer depuis une adresse d'un autre produit**. Écrire **« Rapport email non
   envoyé : <raison exacte> »** en tête de l'entrée du journal, notification `PushNotification` si l'outil existe,
   et le mettre dans « Décision du propriétaire ».

Un seul envoi par jour, toutes voies confondues.

**Écrits dans le dépôt** (dans la PR du passage, ou PR `docs(surveillance): journal du AAAA-MM-JJ` si aucune
réparation ; fusion avant 06:30) :

- **Rapport complet** : `docs/rapports/surveillance/AAAA-MM-JJ.md` (mêmes rubriques que l'e-mail, preuves en
  détail, SHA de `main` contrôlé, heure de début et durée). Les `.md` ne sont pas publiés (`pages.yml`).
- **Journal** : entrée en tête de [`suivi-surveillance.md`](suivi-surveillance.md) : date, état global, tableau
  court, réparations (PR), incidents clôturés, rapport envoyé ou non (et par quelle voie), points ouverts, lien
  vers le rapport complet.

Message final de la session : style caveman (`CLAUDE.md`) : vérifié, cassé, réparé (PR), reste.
