# Journal de la routine « Santé quotidienne de KYRAN »

Consigne : [`sante-routine-mission.md`](sante-routine-mission.md). Une entrée par run, la plus récente en haut.
Rapport complet de chaque run : `docs/rapports/sante/AAAA-MM-JJ.md`.

---

## 2026-10-21 — run de la routine

Verdict : **Incident** (Auto-Heal toujours sans auth Anthropic, action du propriétaire ; tout le reste OK, aucune
réparation). Rapport complet : [`docs/rapports/sante/2026-10-21.md`](../docs/rapports/sante/2026-10-21.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 17 pages en 200, 50/50 URL du sitemap saines, Playwright 1280/390 px sans erreur ; TLS jusqu'au 14/12 |
| Initiation et boutique | OK | partie jouée ; Stripe 9,99 € + 2,99 € = 12,98 €, comme le site |
| Pages et workflows | OK | dépôt public ; Pages, CI, IndexNow et Instagram verts |
| Serveur Railway | OK | `/health` ok, config inchangée, 0 5xx sur 16 requêtes, aucun log en 24 h |
| Erreurs et Auto-Heal | Incident | 5 runs rouges en 24 h : WIF 401 puis `invalid x-api-key` |
| Code et CI | OK | build sans diff, `npm test` vert, `npm audit` 0 faille |
| Contenus | À surveiller | aucun article neuf depuis le 14/10 |

Points ouverts : auth Auto-Heal (propriétaire, `docs/AUTO-HEAL.md` § 5) puis 5 incidents ; blog à revoir le 22/10.

## 2026-10-20 — run de la routine

Verdict : **Incident** (Auto-Heal toujours sans auth Anthropic, action du propriétaire ; le reste va bien).
Rapport complet : [`docs/rapports/sante/2026-10-20.md`](../docs/rapports/sante/2026-10-20.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 17 pages en 200, 404 propre, 50/50 URL du sitemap saines (`seo-health.py`), Playwright 1280/390 px sans erreur ; TLS non vérifié (proxy) |
| Initiation et boutique | OK | partie lancée et carte jouée ; page Stripe 9,99 € + 2,99 € = 12,98 €, comme le site |
| Pages et workflows | OK | dépôt public, Pages publié sur `3c3c79d`, CI, IndexNow et Instagram verts |
| Serveur Railway | OK | `/health` ok ; config inchangée ; dernier `SUCCESS` couvre `server/` ; 0 5xx sur 26 requêtes |
| Erreurs et Auto-Heal | Incident | 4 runs rouges en 24 h : WIF 401 puis clé `invalid x-api-key` ; `JS-095C84` (`:is()` dans `js/motion.js`) corrigé |
| Code et CI | OK | build sans diff, `npm test` vert, `npm audit` 0 faille |
| Contenus | À surveiller | aucun article neuf depuis le 14/10 (routine blog) |

Réparation : `js/motion.js` sans `:is()` + test `client-js.test.mjs` (PR du run).
Points ouverts : auth Auto-Heal (propriétaire) puis 5 incidents en attente.

Suite du 20/10 : cause du refus WIF trouvée (règle de fédération de Majordia réutilisée, réparation dans
`docs/AUTO-HEAL.md` § 5) ; fausse alerte vidéo filtrée dans `error-reporter.js` ; TLS valide jusqu'au 14/12
(site) et 26/12 (Railway) ; PR #26 fermée ; branche `gallant-hamilton` déjà fusionnée (#65).

## 2026-10-19 — contrôle manuel (avant le premier run)

Verdict : **Incident** (Auto-Heal en panne depuis le 13/10, correctif livré, auth à refaire par le propriétaire).
Rapport complet : [`docs/rapports/sante/2026-10-19.md`](../docs/rapports/sante/2026-10-19.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Serveur Railway | OK | dernier `SUCCESS` sur `249dd83` (13/10), qui contient le dernier commit touchant `server/` (`1f0b02c`) ; pushs suivants `SKIPPED` (`watchPatterns` `/server/**`) ; 5xx 0 % (24 requêtes en 24 h) ; mémoire 0,06–0,10 Go sur 8 ; volume `/data` 0,03 Go |
| Erreurs et Auto-Heal | Incident | 30 derniers runs « Hourly Auto-Heal » rouges (14/10 → 19/10), dernier vert le 13/10 16:02 UTC : `invalid x-api-key` (secret `ANTHROPIC_API_KEY`) ; WIF refusé aussi (« Token exchange failed with status 401 ») au test sur branche |

Réparation : WIF d'abord, clé en repli (PR #76). `smoke_test` sur `main` après fusion : toujours 401 (WIF et clé).
Point ouvert : clé API ou règle de fédération à refaire par le propriétaire (étapes dans le rapport), puis
`smoke_test` à relancer. Session de la routine : connecteur Railway présent (outils `mcp__aa5c2fbf…__*`).

## 2026-10-19 — mise en place (avant le premier run)

Routine créée à la demande du propriétaire, portage de « Santé quotidienne de Majordia ». Relevé fait pendant la
mise en place (pas un run complet) :

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | `https://kyran-jeu.fr/` 200 (0,46 s), `sitemap.xml` 200, `https://www.kyran-jeu.fr/` 301 |
| Serveur Railway | OK | `/health` 200 : `status` ok, version 1.5.0, `emailTransport` resend, `hasWebhookSecret` true, `adminEnabled` true |
| Pages et workflows | OK | « Contrôles du site », Pages et IndexNow verts sur `e104028` (fusion de la PR #74) |

Points ouverts pour le premier run : tout le reste du déroulé (non vérifié ici).
