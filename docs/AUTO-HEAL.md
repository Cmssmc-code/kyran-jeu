# Auto-Heal — remontée et correction automatique des erreurs de production

Portage, pour kyran-jeu.fr, d'un pipeline Auto-Heal existant (journal d'incidents → agent Claude qui
corrige, teste et pousse).

> **Depuis le 2026-10-21, la réparation passe par la routine Claude quotidienne « Surveillance &
> réparation »** (05:07, Europe/Paris), mission
> [`_notes/surveillance-reparation-routine-mission.md`](../_notes/surveillance-reparation-routine-mission.md).
> La passe horaire GitHub Actions (§ 4 et § 5) n'est plus planifiée : elle échouait à chaque passage faute
> d'auth Anthropic. La remontée des erreurs (§ 1) et le journal (§ 2) ne changent pas.

## Vue d'ensemble

```
Navigateur (kyran-jeu.fr)                 Serveur Railway (kyran-webhook)            Routine Claude (05:07) + GitHub Actions
error-reporter.js ── POST /api/client-error ──► isBenignClientError (filtre)       routine « Surveillance & réparation »
                                              │                                      │ 1. auto-heal-incidents.yml list (OIDC)
server.js : webhook Stripe, notification ───►  IncidentStore (/data/incidents.json) ◄─┤ 2. diagnostic + correctif en PR
de vente, exceptions → recordServerIncident     agrégation par empreinte             │ 3. npm run build + npm test, CI verte, fusion
                                                                                     │ 4. vérification en ligne (Pages, Railway)
                                              ◄── resolve / fail / ignore ───────────┤ 5. auto-heal-incidents.yml resolve|fail|ignore
                                              ◄── routine-report (1 par jour) ───────┘
                                              email depuis contact@kyran-jeu.fr → kyran.jeu@gmail.com (destinataire fixé dans le code)
```

## 1. Remontée des erreurs

- **Navigateur** : `error-reporter.js`, inséré en tête de chaque page publique par
  `scripts/apply-csp.mjs` (donc par `npm run build`). Il capte les erreurs JS, les promesses rejetées
  et les ressources du site introuvables (image, script, CSS), 5 rapports max par page, uniquement
  sur kyran-jeu.fr, sans cookie ni donnée saisie. Envoi en `sendBeacon` (`text/plain`, pas de
  pré-vérification CORS). La CSP `connect-src` autorise le serveur Railway.
- **Serveur** : `recordServerIncident` dans `server/server.js` pour les échecs de traitement d'un
  événement Stripe (500), l'échec de la notification de vente à l'administrateur, toute erreur
  inattendue d'une route, `uncaughtException` et `unhandledRejection`.
- **Filtre des fausses alertes** (`isBenignClientError`, `server/incidents.js`) : robots, extensions
  de navigateur, scripts tiers, « Script error. », coupures réseau du visiteur, lecture vidéo bloquée…
  C'est là que l'agent ajoute un filtre quand une alerte n'est pas un bug.

## 2. Journal d'incidents (`server/incidents.js`)

Pas de base de données : fichier JSON sur le volume Railway monté sur `/data`
(`INCIDENTS_FILE` pour changer le chemin ; à défaut `./data/incidents.json`). Écriture atomique.

- Empreinte : `client|code|message normalisé|fichier` (une même erreur sur plusieurs pages = un incident)
  ou `api|code|chemin|statut`. Référence lisible `JS-XXXXXX` / `SRV-XXXXXX`.
- Une nouvelle occurrence est rattachée à l'incident existant s'il est en attente, ignoré ou abandonné
  depuis moins de 7 jours, ou corrigé depuis moins de 6 h.
- Statuts : `pending` → `auto_fixed` | `ignored` | `failed` (après 3 tentatives). Transitions
  uniquement depuis `pending`. Quota : 30 correctifs par 24 h. Rétention : 30 jours, 500 incidents.

## 3. API Auto-Heal (serveur)

| Route | Rôle |
| --- | --- |
| `POST /api/client-error` | Public (origines `ALLOWED_ORIGINS`, 20/h/IP, 16 Ko max) |
| `GET /api/auto-heal/incidents?limit=5` | Incidents en attente + quota |
| `POST /api/auto-heal/incidents/resolve` | `{ incidentId, commitSha, resolutionSummary, report }` |
| `POST /api/auto-heal/incidents/fail` | `{ incidentId, reason, report }` (3 tentatives max) |
| `POST /api/auto-heal/incidents/ignore` | `{ incidentId, reason, report }` |
| `GET /api/auto-heal/daily-report` | Email 24 h, seulement si au moins un correctif ou un abandon ; une fois par 20 h. **Plus appelé** : son seul appelant était l'étape « Daily report » de la passe horaire planifiée, retirée le 2026-10-21 (un seul email par jour, celui de la routine) |
| `POST /api/auto-heal/routine-report` | `{ subject, html, text? }` : rapport de la routine, objet « KYRAN — surveillance & réparation du JJ/MM », destinataire fixe kyran.jeu@gmail.com, un seul par jour |

Authentification : **jeton OIDC GitHub Actions** (audience `kyran-auto-heal`, dépôt
`Cmssmc-code/kyran-jeu`) vérifié par `server/githubOidc.js` — aucun secret à partager entre GitHub et
Railway. Repli manuel : en-tête `X-Cron-Secret` si la variable Railway `CRON_SECRET` (32 caractères
min.) est définie — elle ne l'est pas (2026-10-21), et le connecteur Railway de Claude ne rend que les
noms des variables. La routine passe donc par le workflow `auto-heal-incidents.yml` (OIDC, ci-dessous).
Tout workflow du dépôt peut obtenir ce jeton (le serveur ne vérifie que le dépôt et l'audience). Destinataires du rapport : `AUTO_HEAL_REPORT_EMAILS` (kyran.jeu@gmail.com sur Railway),
sinon `ADMIN_NOTIFICATION_EMAILS`.

Expéditeur de **tous** les emails KYRAN (`server/mailer.js`) : une adresse `@kyran-jeu.fr` (défaut
`contact@kyran-jeu.fr`) ou `kyran.jeu@gmail.com`, jamais l'adresse d'un autre produit — toute autre
valeur de `SENDER_EMAIL` est remplacée par `contact@kyran-jeu.fr`. Transport : Resend si `RESEND_API_KEY`
est défini (domaine `kyran-jeu.fr` vérifié dans Resend requis), sinon SMTP via `SMTP_PASSWORD` (boîte OVH
`ssl0.ovh.net`, ou `smtp.gmail.com` pour l'adresse Gmail). Railway bloque le SMTP sortant hors offre Pro :
`EMAIL_TRANSPORT=smtp` ne sert qu'en offre Pro ou hors Railway. Test d'envoi : workflow « Hourly
Auto-Heal » lancé à la main avec `test_email`.

## 4. Agent (`scripts/auto-heal-worker.mjs`)

Même conception que Majordia : SDK `@anthropic-ai/sdk` (tool runner), outils `read_file`, `list_dir`,
`search_code`, `edit_file`, `run_checks` bornés au dépôt, chemins interdits (CI, `package*.json`,
`.env`, auth Auto-Heal, `_notes/`, `vendor/`, CNAME…), secrets et emails clients masqués dans le prompt,
`execFileSync` partout (jamais de chaîne shell avec du texte du modèle).

Validation indépendante avant tout push : syntaxe JS, `npm run build` (régénère pages, sitemap, CSP)
puis `npm test` (JSON-LD, blog, cohérence du site, doublons, tests unitaires et de sécurité).
Échec → `git reset --hard origin/main` + incident marqué en échec. Erreur d'infrastructure
(auth WIF, quota, panne Anthropic) → job en échec sans pénaliser l'incident.

Chaque correctif ajoute une entrée dans [`_notes/lecon.md`](../_notes/lecon.md), consulté par l'agent
avant chaque correctif.

## 5. Workflows

### `.github/workflows/auto-heal-incidents.yml` (lancé par la routine)

Lancement manuel par l'API GitHub (`gh api -X POST …/actions/workflows/auto-heal-incidents.yml/dispatches`),
entrée `action` :

- `list` : incidents en attente + quota, affichés dans le journal du job (champs utiles au diagnostic ; ni
  navigateur complet ni URL avec paramètres, car les journaux d'Actions d'un dépôt public sont publics) ;
- `resolve` (`incident_id`, `commit_sha`, `reason`), `fail` et `ignore` (`incident_id`, `reason`) ;
- `report` (`report_subject`, `report_html`) : rapport quotidien de la routine, envoyé par le serveur.

Commandes exactes : mission, § A1, B et D.

### `.github/workflows/auto-heal-hourly.yml` (manuel seulement)

**Plus de passe horaire depuis le 2026-10-21** : le `schedule:` est retiré, la routine Claude fait la
réparation. Le workflow reste en lancement manuel (`smoke_test`, `dry_run`, `test_email`) pour le jour où
l'auth Anthropic ci-dessous sera réparée ; son étape « Daily report » est retirée.

- Ancien fonctionnement : toutes les heures à :17, vérification rapide (0 token) des incidents en attente, puis agent si besoin.
- Auth Anthropic : Workload Identity Federation (mêmes identifiants que Majordia, surchargeables par
  les variables de dépôt `ANTHROPIC_FEDERATION_RULE_ID`, `ANTHROPIC_SERVICE_ACCOUNT_ID`,
  `ANTHROPIC_WORKSPACE_ID`) ; repli : secret `ANTHROPIC_API_KEY`.
  La règle `fdrl_01YA6haXm2AP2TpbNaE5qwjq` vient de Majordia (`Cmssmc-code/Majordia`) : tant qu'elle
  n'accepte pas aussi le jeton OIDC de `Cmssmc-code/kyran-jeu` (sujet `repo:Cmssmc-code/kyran-jeu:ref:refs/heads/main`,
  audience `https://api.anthropic.com`), l'échange WIF répond 401 « Authentication failed ». Deux réparations
  possibles dans la console Anthropic (page Workload identity, qui montre aussi le journal des refus) : ajouter
  ce sujet à la règle, ou créer une règle propre à KYRAN et mettre son identifiant dans la variable de dépôt
  `ANTHROPIC_FEDERATION_RULE_ID` (aucun changement de code). Puis lancer le workflow avec `smoke_test`.
- Lancement manuel : `smoke_test` (vérifie l'auth Anthropic et serveur sans générer), `dry_run`.
- Après un correctif poussé avec `GITHUB_TOKEN` : relance de `ci.yml` et `pages.yml` ; Railway
  redéploie le serveur tout seul (dossier `server/`).
- `main` protégée : secret facultatif `AUTO_HEAL_PUSH_TOKEN`.

## Diagnostic

```bash
# Incidents en attente, sans secret (journal du job à lire ensuite)
gh api -X POST repos/Cmssmc-code/kyran-jeu/actions/workflows/auto-heal-incidents.yml/dispatches -f ref=main -f 'inputs[action]=list'
# Avec CRON_SECRET défini sur Railway (ce n'est pas le cas au 2026-10-21)
curl -s -H "X-Cron-Secret: $CRON_SECRET" https://kyran-webhook-production.up.railway.app/api/auto-heal/incidents?limit=20
# Logs serveur : préfixe [AutoHeal] dans les logs Railway (projet kyran-webhook)
```
