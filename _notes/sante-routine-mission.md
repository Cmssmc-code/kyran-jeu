# Mission : routine « Santé quotidienne de KYRAN »

Routine Claude Code, **tous les jours à 00:00 (Europe/Paris)**, dans une session dédiée (dépôt attaché,
`_notes/memoire.md` § 14). Chaque run relit ce fichier sur `origin/main` : le modifier modifie le run suivant.
Portage de la routine « Santé quotidienne de Majordia » (dépôt `Cmssmc-code/Majordia`,
`_notes/sante-routine-mission.md`), adaptée à l'architecture de KYRAN.

Demande du propriétaire (2026-10-19) : vérifier chaque nuit la santé générale de **kyran-jeu.fr** (site statique
GitHub Pages, serveur webhook Railway `kyran-webhook`, paiement Stripe, e-mails, Auto-Heal, workflows GitHub,
initiation jouable, blog), **tout réparer directement si quelque chose ne va pas**, et écrire le rapport **dans le
dépôt** (décision du propriétaire, 2026-10-19 : ni Google Drive ni Gmail), lisible par tous les agents.

Lire avant tout : `CLAUDE.md`, `AGENTS.md`, `_notes/lecon.md` (en entier, il est court), `_notes/memoire.md`
(§ 2 architecture et build, § 3 serveur, § 7 workflows, § 8 Auto-Heal, § 14 routines), `docs/AUTO-HEAL.md` et les
deux dernières entrées de [`suivi-sante.md`](suivi-sante.md) (points ouverts à suivre en priorité).

---

## Règles d'or (non négociables)

1. **Aucun constat inventé.** Chaque ligne du rapport a sa preuve : commande et sortie, code HTTP, ligne de log,
   run de workflow, capture Playwright. Jamais « tout va bien » sans le contrôle qui le montre. Un contrôle
   impossible (connecteur absent, hôte bloqué, secret absent) s'écrit « non vérifié » avec la raison.
2. **Réparer = cause racine + test de non-régression + build + tests + PR fusionnée + vérification en ligne.**
   Correctif dans la source (`scripts/content/`, générateurs, `components.js`, `server/`…), jamais dans un HTML
   généré. `npm run build` puis `npm test` verts, fichiers générés commités (la CI vérifie que le build est à
   jour ; jamais d'édition à la main de `scripts/lastmod-manifest.json` ni des `?v=`). PR vers `main`, attendre
   « Contrôles du site » vert sur le dernier commit, sans conflit ni commentaire ouvert, puis passer prête et
   fusionner (règle de `CLAUDE.md`). Jamais `--force`, jamais `--no-verify`. Après la fusion : `pages.yml` vert
   **sans** la notice « publication ignorée », la page corrigée en ligne (`curl` + recherche du texte) ; pour
   `server/`, déploiement Railway `SUCCESS` sur le nouveau SHA et `/health` en `ok`.
3. **Paiement intouchable.** Prix, port, pays de livraison, Payment Link (`STRIPE_CHECKOUT_URL` de
   `components.js`), redirection vers `merci.html`, produit Stripe, avis Amazon : jamais modifiés. Stripe en
   lecture seule ; la page de paiement s'ouvre avec Playwright **sans payer**. Un écart entre le site et la page
   Stripe → « À décider » et alerte (`lecon.md`, 12/10).
4. **Aucun e-mail envoyé.** Ne jamais appeler `POST /api/shipping`, `/api/send-custom-email`,
   `/api/auto-heal/test-email`, `/api/auto-heal/daily-report`, ni un script `send-*` ; aucun webhook Stripe de
   test. Le journal d'incidents (`server/incidents.js`, volume `/data`) se lit, il ne se modifie que par le
   pipeline Auto-Heal.
5. **Railway** (projet `kyran-webhook`) : redéployer ou redémarrer un service `CRASHED` / `FAILED` est autorisé.
   Jamais supprimer un service, un volume, un domaine ou une variable. Une variable ne change que si la cause est
   prouvée ; sa valeur n'apparaît jamais dans un rapport, un journal, un commit ou un message (nom seulement).
6. **Le dépôt reste public** (GitHub Pages gratuit, `lecon.md`, 08/10) : visibilité et réglages Pages en lecture
   seule ; seule réparation permise sur Pages : relancer `pages.yml`.
7. **Ne pas marcher sur une session vivante.** Une branche ou une PR avec des commits absents de `main` : chercher
   sa session (`Claude-Session:` du commit, `mcp__claude-code-remote__get_session`). Session `RUNNING` ou
   bloquée depuis moins de 6 h → la signaler seulement. Session terminée, en échec, disparue ou bloquée depuis plus
   de 6 h, travail fini → relecture adverse, correctifs, CI, fusion. Travail inachevé ou décision produit → le
   signaler. Aucune branche ne se supprime depuis le cloud.
8. **Routines sœurs.** Le blog appartient à la routine blog (lun/mer/ven 06:50, `docs/BLOG-PASSES.md`) : ne jamais
   créer d'article, ne pas toucher une PR `claude/blog-*` vivante ; un défaut d'un article publié se corrige dans
   sa source selon `scripts/content/README.md`. Le référencement appartient à la routine SEO (minuit aussi,
   `_notes/seo-routine-mission.md`) : ne pas toucher `_notes/seo/`, titres, descriptions ni `seo-keywords.json` ;
   un défaut SEO non bloquant va dans `_notes/seo/backlog.md` via le rapport (« Pour la routine SEO »). Une page
   en erreur, un sitemap invalide ou un site désindexé reste une panne à réparer ici. Les ventes appartiennent à la
   routine du mardi (`docs/VENTES-PASSES.md`).
9. **Décisions du propriétaire** : prix, offre, pages légales (CGV, mentions, confidentialité), suppression de
   page ou de fonction, design, mesure d'audience, envois d'e-mails → ne pas trancher ; les écrire dans
   « À décider » du rapport.
10. **Un seul run à la fois** : si `suivi-sante.md` porte une entrée d'aujourd'hui « en cours » vieille de moins de
    4 h, s'arrêter et le dire. Les PR du run sont fusionnées **avant 06:30** (routine blog à 06:50, ventes le
    mardi à 06:47) ; la routine SEO tourne à la même heure : branche à soi, `git fetch origin main` et fusion de
    `main` avant chaque push, conflit sur `_notes/lecon.md` ou `_notes/memoire.md` résolu en gardant les deux
    entrées.
11. **Budget : 3 h.** Priorité : site ou paiement cassé > webhook Stripe et e-mails de commande > sécurité >
    fonction cassée pour des joueurs (initiation, boutique, blog) > workflows planifiés > dette. Mieux vaut
    3 réparations finies et vérifiées que 8 commencées ; le reste va dans « Points ouverts ».
12. Limite d'utilisation Claude atteinte : commit « wip » sur la branche, `send_later` à la remise à zéro + 5 min,
    reprise sans attendre le propriétaire.
13. Rapport sans secret ni donnée personnelle (pas d'e-mail, de nom ni d'adresse de client, pas de numéro de
    suivi) ; jamais d'adresse Majordia dans un écrit KYRAN (`lecon.md`, 03/10).

---

## Déroulé d'un run

### 0. Préparation (10 min)

```bash
git fetch origin --prune && git checkout -B claude/sante-$(TZ=Europe/Paris date +%F) origin/main
date -u; git log -1 --oneline origin/main
npm ci --no-audit --no-fund   # en arrière-plan (Node 22 requis pour node --test)
```

- SHA de référence « il y a 24 h » : `git rev-list -1 --before="24 hours ago" origin/main`.
- Outils : `ToolSearch` pour `mcp__github__*` (PR, runs et journaux de workflows, `actions_run_trigger`, issues),
  Railway (`list-deployments`, `describe-environment`, `get-service-config`, `get-logs`, `http-error-rate`,
  `http-response-time`, `get-service-metrics`), `PushNotification`. Dans la session dédiée, les outils des
  connecteurs peuvent apparaître sous un préfixe technique (`mcp__<uuid>__get-logs`) : chercher par nom d'outil
  (constaté le 2026-10-19 : Railway y est `mcp__aa5c2fbf-8870-4e28-ac33-9f9f6b7f85ff__<outil>`). Railway absent de la session : la partie serveur se limite à `/health`
  et s'écrit « Railway non vérifié : connecteur absent ». Ni Gmail ni Google Drive : inutiles ici.
- Playwright : Chromium préinstallé, `executablePath: '/opt/pw-browsers/chromium'` ; ne pas lancer
  `playwright install`.

### 1. Site en direct (20 min)

- Codes HTTP et durées (`curl -o /dev/null -w "%{http_code} %{time_total}"`) de `/`, `/regle.html`,
  `/commander.html`, `/merci.html`, `/faq.html`, `/a-propos.html`, `/dossier-presse.html`, `/minijeu.html`,
  `/communaute.html`, `/ressources-gratuites.html`, `/video-regles.html`, `/jeu-apero.html`, `/blog/`, l'article
  le plus récent, `/cgv.html`, `/mentions-legales.html`, `/confidentialite.html` : 200 attendu. Une URL inconnue
  répond 404 avec la page `404.html`. `https://www.kyran-jeu.fr/` et `http://kyran-jeu.fr/` redirigent vers
  `https://kyran-jeu.fr/`.
- Tout le sitemap : `python3 scripts/seo-health.py --sample 0 --no-csv --details /tmp/sante-site.json` (statut,
  `noindex`, canonique, JSON-LD) ; `--no-csv` pour ne pas écrire dans `_notes/seo/` (fichiers de la routine SEO).
  `robots.txt`, `sitemap.xml`, `llms.txt`, `blog/feed.xml` en 200 et valides ; les anciennes URL de redirection
  (`alternative-skyjo.html`, `comparatif-jeux-plis.html`, `whist-moderne.html`) pointent vers une page en 200.
- Fraîcheur : `curl -s https://kyran-jeu.fr/seo-config.js` porte le même `ASSET_VERSION` que `main` (sinon Pages
  n'a pas publié le dernier commit).
- Certificats TLS de `kyran-jeu.fr`, `www.kyran-jeu.fr`, `kyran-webhook-production.up.railway.app`
  (`openssl s_client -servername … | openssl x509 -noout -enddate`) : alerte sous 21 jours.
- Playwright, 1280 px et 390 px, sur `/`, `/regle.html`, `/commander.html`, `/minijeu.html`, `/blog/`, l'article
  le plus récent et `/communaute.html` : erreurs console (CSP comprises), `pageerror`, requêtes 4xx/5xx vers
  `kyran-jeu.fr`, images cassées, débordement horizontal à 390 px. Ne remplir aucun formulaire.
- Initiation (`/minijeu.html`) : les modules de `dojo/` se chargent (aucun 404 sur `?v=`), une partie démarre
  et une carte se joue sans erreur.
- Boutique : le bouton de `/commander.html` mène à la page Stripe du Payment Link ; ouvrir la page Stripe en
  lecture (sans payer) et comparer prix unitaire, port et total avec ce qu'annonce le site (règle d'or 3).

### 2. GitHub Pages et workflows (10 min)

- Dépôt toujours public ; dernier `pages.yml` sur `main` vert et son journal **sans** « publication ignorée ».
- Runs des 24 h (`mcp__github__actions_list`) : `ci.yml` (« Contrôles du site ») vert sur la tête de `main` ;
  `indexnow.yml` vert ; `instagram.yml` (vers 7 h) vert ; issue ouverte « Synchronisation Instagram : action
  requise » → la signaler (jeton à renouveler par le propriétaire si le renouvellement automatique échoue).
  Un run rouge → journal du job (`get_job_logs`), cause racine, réparation.
- `update-reviews.yml` est manuel (captchas Amazon) : ne pas le lancer.

### 3. Serveur Railway `kyran-webhook` (10 min)

Projet `365539aa-a674-49b3-845f-b0793b952dbd`, environnement `production` (`2346a967-…`), service
`kyran-webhook` (`8cb1b665-…`), URL `https://kyran-webhook-production.up.railway.app`.

- `curl -s https://kyran-webhook-production.up.railway.app/health` : `status` `ok`, `hasWebhookSecret` `true`,
  `adminEnabled` `true`, `emailTransport` attendu (`resend`).
- Configuration relevée le 2026-10-19 (`get-service-config`) : racine `/server`, `watchPatterns` `/server/**`,
  démarrage `node server.js`, healthcheck `/health`, 1 réplique en `us-east4`, volume `kyran-incidents` (500 Mo)
  sur `/data`. Toute dérive de cette configuration se signale.
- `list-deployments` : un push qui ne touche pas `server/` donne un déploiement `SKIPPED` (normal). Le dernier
  `SUCCESS` doit porter le SHA du dernier commit qui touche `server/` (`git log -1 --format=%H origin/main --
  server/`). `CRASHED` / `FAILED`, ou `SUCCESS` plus ancien que ce commit → `get-deployment-diagnosis`, journaux de
  build, réparation.
- `get-logs` sur 24 h, par mot-clé (`error`, `warn`, `[AutoHeal]`, `uncaught`, `unhandled`) : regrouper par
  message ; un avertissement répété à chaque démarrage est un bug.
- `http-error-rate` et `http-response-time` sur 24 h : 5xx > 1 % ou p95 en nette hausse par rapport au run
  précédent → enquête. `get-service-metrics` : mémoire, CPU, redémarrages. Volume `/data` présent (journal
  d'incidents).

### 4. Paiements et e-mails (10 min)

- Journaux Railway 24 h filtrés sur `stripe`, `webhook`, `signature`, `checkout.session.completed`,
  `charge.refunded` : webhooks refusés (signature, corps), événements en 500, notification de vente en échec.
- E-mails : erreurs d'envoi (`resend`, `smtp`, `mailer`) ; expéditeur toujours `@kyran-jeu.fr`.
- Une vente sans e-mail client ou sans alerte admin est un incident de priorité 2 (règle d'or 11).
- Worker Cloudflare (`worker/`) : variante ; son URL n'est pas dans le dépôt. Sans URL ni outil Cloudflare :
  « non vérifié ».

### 5. Erreurs applicatives et Auto-Heal (15 min)

- Workflow « Hourly Auto-Heal » (`auto-heal-hourly.yml`) sur 24 h : GitHub saute souvent des créneaux planifiés
  (quelques passages par jour sont normaux, aucun en 24 h ne l'est) ; job `check` vert ; job `heal` vert quand il
  tourne. Un run rouge = pipeline aveugle : priorité haute, lire le journal du job (`get_job_logs`). En cas de
  doute sur l'auth, lancer le test sans génération facturée : `actions_run_trigger` `run_workflow`,
  `auto-heal-hourly.yml`, `ref` `main`, entrée `smoke_test: true` (attention : sur une autre branche que `main`, la
  fédération d'identité Anthropic peut refuser le jeton). Auth Anthropic : WIF d'abord, secret `ANTHROPIC_API_KEY`
  en repli seulement (`lecon.md`, 19/10). Les deux refusés → secret ou règle de fédération à refaire par le
  propriétaire : « À décider » avec les étapes, et alerte.
- Incidents : le relevé `GET /api/auto-heal/incidents` exige le jeton OIDC du workflow ou `CRON_SECRET`, absents
  de la session ; lire donc les journaux du job `check` (incidents en attente, quota) et les logs Railway
  `[AutoHeal]`. Incident `failed` (3 tentatives) ou en attente depuis plus de 24 h → cause racine et correctif
  ici. Une fausse alerte se corrige par un filtre précis dans `isBenignClientError` (`server/incidents.js`),
  avec test, jamais en masquant une vraie panne.
- Commits Auto-Heal des 24 h (auteur `auto-heal@kyran-jeu.fr`) : relecture adverse de chaque correctif (vraie
  cause ? régression ? entrée dans `lecon.md` ?).

### 6. Dépôt et code (30 min, en arrière-plan pendant les étapes 1 à 5)

- Sur `origin/main` : `npm run build` puis `git status --porcelain` (aucun diff, hors
  `scripts/lastmod-manifest.json`), puis `npm test` vert. Échec → cause racine et correctif (une CI rouge sur
  `main` est un incident).
- `git log --since="24 hours ago" --stat origin/main` : relecture adverse des changements hors blog et SEO
  (serveur, `components.js`, `dojo/`, CSP, workflows).
- `npm audit --omit=dev --audit-level=high` (racine ; `server/` n'a pas de dépendance) : faille haute ou critique
  → correctif ou « À décider ».
- Branches poussées en 24 h avec des commits absents de `main` et PR ouvertes : règle d'or 7.
- Issues ouvertes ou modifiées en 24 h (`mcp__github__search_issues`) : traiter ce qui nous revient, signaler
  le reste.

### 7. Contenus (5 min)

- Blog : la dernière passe (lun/mer/ven) a fusionné sa PR ou dit pourquoi ; l'article publié est en 200, dans
  `sitemap.xml` et `blog/feed.xml` ; aucune PR `claude/blog-*` ouverte depuis plus de 2 jours.
- Routine SEO de la nuit précédente : sa PR fusionnée ou restée ouverte avec une raison ; rien d'autre ici.
- Page `/communaute.html` : médias Instagram affichés (pas d'image cassée).

### 8. Réparer

- Problèmes indépendants nombreux : `Workflow` (un agent par problème, worktree isolé, relecture adverse de chaque
  correctif), puis intégration, build, tests, PR. Sinon, correctifs en direct.
- Branche `claude/sante-<date>`, un commit par réparation (`fix(<zone>): <quoi>`), terminé par les lignes
  d'attribution de la session. PR `Santé : <résumé> (run du AAAA-MM-JJ)`, corps : constat (preuve), cause,
  correctif, test, vérification prévue. CI rouge : corriger et repousser (3 tours au plus, sinon PR laissée ouverte
  avec la raison) ; verte : fusion (règle d'or 2) puis vérification en ligne.
- Chaque correctif notable → entrée en tête de `_notes/lecon.md` (format du fichier) ; une règle devenue fausse
  se corrige dans le même commit.

### 9. Rapport (15 min)

**a) Rapport complet dans le dépôt.** Un fichier par run : `docs/rapports/sante/AAAA-MM-JJ.md` (les `.md` ne sont
pas publiés sur le site, `pages.yml`). Contenu, en français simple :

1. Verdict en une ligne : **OK**, **À surveiller** ou **Incident** (+ ce qui est encore cassé).
2. Tableau `Domaine | État | Constat (preuve) | Action` : Site, Pages et workflows, Serveur Railway, Paiements et
   e-mails, Erreurs et Auto-Heal, Code et CI, Contenus.
3. Réparations : quoi, pourquoi, PR, vérification en ligne.
4. À décider par le propriétaire.
5. Pour la routine SEO (défauts SEO non bloquants vus pendant le run).
6. Points ouverts des runs précédents et leur suivi.
7. SHA de `main` contrôlé, heure de début et durée du run.

**b) Journal du dépôt.** Entrée en tête de [`suivi-sante.md`](suivi-sante.md) : date, verdict, tableau court,
réparations (PR), points ouverts, lien vers le rapport complet. Rapport et journal dans la PR du run, ou PR
`docs(sante): journal du run AAAA-MM-JJ` si aucune réparation ; build, tests, fusion avant 06:30.

**c) Alerte.** Incident encore ouvert à la fin du run (site ou paiement cassé, webhook Stripe en échec, sécurité) :
notification au propriétaire si l'outil `PushNotification` existe dans la session.

**d) Message final** de la session : style caveman (`CLAUDE.md`) : vérifié, cassé, réparé (PR), reste.
