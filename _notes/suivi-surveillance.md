# Journal de la routine « Surveillance & réparation KYRAN »

Consigne : [`surveillance-reparation-routine-mission.md`](surveillance-reparation-routine-mission.md). Une entrée par
jour, la plus récente en haut. Rapport complet de chaque passage : `docs/rapports/surveillance/AAAA-MM-JJ.md`.
Historique de l'ancienne routine santé (jusqu'au 2026-10-21) : [`suivi-sante.md`](suivi-sante.md).

---

## 2026-10-30 — passage planifié (04:08 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 41001905120, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-30.md`](../docs/rapports/surveillance/2026-10-30.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 55 URL × 1280/390 px sans erreur ; 355 liens, 0 interne cassé ; `myludo.fr` non vérifié (TLS coupé depuis la session, 2e jour) |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | Node v26.13.0, `/health` ok, 0 5xx |
| Incidents | 0 | aucun en attente, aucun nouveau |
| Workflows, code | OK | tout vert ; 0 faille |
| Versions | 1 mise à jour | wrangler 4.156.0, `compatibility_date` 2026-10-30 ; Node 27 alpha non retenu |

Mise à jour : PR #143. Points ouverts : rotation des secrets Railway (décision du propriétaire). Lien myludo.fr :
vérifié par le propriétaire dans son navigateur le 30/10, il marche ; compté comme bruit dans la mission (A4).

## 2026-10-29 — passage planifié (04:08 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 40816755525, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-29.md`](../docs/rapports/surveillance/2026-10-29.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 55 URL × 1280/390 px sans erreur ; 355 liens, 0 interne cassé |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | déployé en Node v26.13.0 (`bc9c544`), `/health` ok, 0 5xx |
| Incidents | 0 | aucun en attente, aucun nouveau |
| Workflows, code | OK | tout vert ; 0 faille |
| Versions | 2 mises à jour | Node 26.13.0 (ligne 26 en LTS), wrangler 4.155.0, `compatibility_date` 2026-10-29 |

Mise à jour : PR #140, vérifiée en ligne. Points ouverts : rotation des secrets Railway (décision du propriétaire).

## 2026-10-28 — passage planifié (04:07 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 40631189295, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-28.md`](../docs/rapports/surveillance/2026-10-28.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 55 URL × 1280/390 px sans erreur ; 354 liens, 0 interne cassé |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | v1.6.1, Node v26.12.1, 0 5xx ; 2 erreurs de visiteurs filtrées (aucun incident) |
| Incidents | 0 | aucun en attente, aucun nouveau |
| Workflows, code | OK | tout vert (1 CI annulée remplacée par un push suivant) ; 0 faille |
| Versions | 1 mise à jour | wrangler 4.154.0, `compatibility_date` 2026-10-28 |

Mise à jour : PR #136. Points ouverts : rotation des secrets Railway (décision du propriétaire).

## 2026-10-27 — passage planifié (04:07 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 40448649058, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-27.md`](../docs/rapports/surveillance/2026-10-27.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 55 URL × 1280/390 px sans erreur ; 352 liens, 0 interne cassé |
| Paiement, initiation | OK | Stripe en euros 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | v1.6.1, Node v26.12.1, 0 5xx ; 4xx = robots |
| Incidents | 0 | aucun en attente, aucun nouveau |
| Workflows, code | OK | tout vert ; 0 faille |
| Versions | 1 mise à jour | wrangler 4.153.0 (`overrides` undici retiré), `compatibility_date` 2026-10-27 |

Mise à jour : PR #132. Points ouverts : rotation des secrets Railway (décision du propriétaire).

## 2026-10-26 — passage planifié (04:07 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 40268145426, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-26.md`](../docs/rapports/surveillance/2026-10-26.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 54 URL × 1280/390 px sans erreur ; 340 liens, 0 interne cassé |
| Paiement, initiation | OK | Stripe en euros 9,99 € + 2,99 € = 12,98 € (affichée d'abord en CHF : devise automatique de Stripe) ; partie jouée |
| Serveur | OK | v1.6.1, Node v26.12.1, 0 5xx, aucun log d'erreur |
| Incidents | 0 | aucun en attente, aucun nouveau |
| Workflows, code | OK | tout vert ; 0 faille ; tout à jour |

Mise à jour : PR #127 (`compatibility_date` 2026-10-26). Points ouverts : rotation des secrets Railway (décision du
propriétaire).

## 2026-10-25 — passage planifié (04:07 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 40161252874, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-25.md`](../docs/rapports/surveillance/2026-10-25.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 54 URL × 1280/390 px sans erreur ; 340 liens, 0 interne cassé |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | v1.6.1, Node v26.12.1, 0 5xx, aucun log d'erreur |
| Incidents | 0 | aucun en attente, aucun nouveau |
| Workflows, code | OK | tout vert ; 0 faille ; tout à jour |

Mise à jour : PR #124 (`compatibility_date` 2026-10-25). Points ouverts : rotation des secrets Railway (décision du
propriétaire).

## 2026-10-24 — passage planifié (03:07 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (run 40057675840, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-24.md`](../docs/rapports/surveillance/2026-10-24.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 54 URL × 1280/390 px ; 1 × 503 passagère de Pages sur `css/a-propos.css` (200 ensuite) ; 340 liens, 0 interne cassé |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | `9220a04` déployé, `/health` 1.6.1, Node v26.12.1, 0 5xx |
| Incidents | 0 en attente | JS-C914F6 (Safari, transition de page sautée) filtré et clôturé |
| Workflows, code | OK | tout vert ; faille haute `undici` du Worker corrigée (`overrides` 7.30.1) |
| Versions | 2 mises à jour | SDK Anthropic 1.3.0, `compatibility_date` 2026-10-24 ; le reste à jour |

Réparations : PR #121, vérifiée en ligne. Points ouverts : rotation des secrets Railway (décision du propriétaire).

## 2026-10-23 — passage planifié (03:07 UTC)

État : 🟢 site et paiement · 🟢 serveur et incidents · 🟢 workflows, code et veille. Rapport email : **envoyé par la
voie serveur** (`auto-heal-incidents.yml` `report`, run 39894225608, `"sent":true`). Rapport complet :
[`docs/rapports/surveillance/2026-10-23.md`](../docs/rapports/surveillance/2026-10-23.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 53 URL × 1280/390 px sans erreur ; 335 liens, 0 interne cassé ; TLS → 14/12 |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | OK | déployé le 22/10 18:46 UTC puis le 23/10 03:16 UTC (`c199957`) : Node v26.12.1, `/health` 1.6.0, 0 5xx |
| Incidents | 0 en attente | JS-29330B et JS-11F231 clôturés (`resolve`, `f687d50`) |
| Workflows, code | OK | CI, Pages, IndexNow, Instagram verts ; 0 faille ; build sans diff, tests verts |
| Versions | 1 mise à jour | wrangler 4.152.0, `compatibility_date` 2026-10-23 ; le reste à jour |

Réparations : PR #117 (`VERSION` 1.6.0, wrangler, date du Worker), vérifiée en ligne.
Points ouverts : rotation des secrets Railway (décision du propriétaire).

## 2026-10-22 — passage planifié (03:08 UTC)

État : 🟢 site et paiement · 🟠 serveur et incidents (panne Railway, builds en pause : serveur toujours sur le build
du 13/10) · 🟢 workflows, code et veille. Rapport email : **envoyé par Resend** (`contact@kyran-jeu.fr` →
kyran.jeu@gmail.com, domaine `kyran-jeu.fr` vérifié). Rapport complet :
[`docs/rapports/surveillance/2026-10-22.md`](../docs/rapports/surveillance/2026-10-22.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 52 URL × 1280/390 px sans erreur ; 326 liens, 0 interne cassé ; TLS → 14/12 |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | À surveiller | `/health` ok, 0 5xx sur 43 requêtes ; builds Railway en pause, `server/` non déployé depuis le 13/10 |
| Incidents | 2 en attente | JS-29330B, JS-11F231 (aucun nouveau) : attendent le déploiement |
| Workflows, code | OK | CI, Pages, IndexNow, Instagram verts ; build sans diff, tests verts, 0 faille (racine et Worker) |
| Versions | 2 mises à jour | SDK Anthropic 1.0.0 → 1.1.0, `compatibility_date` du Worker → 2026-10-22 ; le reste est à jour |

Réparations : PR #110 (fusion `2fe9609`), vérifiée en ligne. Incidents clôturés : aucun.
Points ouverts : déployer `server/` dès le retour des builds Railway (Node 26.12.1 et ses correctifs de sécurité),
puis clôturer JS-29330B et JS-11F231, puis rotation des secrets Railway.

## 2026-10-22 — nuit : déploiement Railway tenté, builds toujours en pause

Session de mise à jour du 21/10 (PR #106, #107 : Node 26.12.1, SDK Anthropic 1.0, adresse Stripe
`collected_information`). Le propriétaire a demandé de déployer `server/` la nuit et de réessayer jusqu'au succès.

| Heure (UTC) | Constat |
|---|---|
| 00:30, 01:04, 01:35, 02:07, 02:38 | Builds Railway en pause (incident QH8L8B3E, dernier point 02:19 UTC : « still working to bring builds back online ») ; aucun déploiement pour `450abf6` ni `f90718c` ; `/health` ok sur l'ancienne version 1.5.0 (build du 13/10, Node 22) |

À faire par la routine dès que les builds reviennent :

1. Déployer le dernier commit de `main` sur le service `kyran-webhook`. Railway peut le rattraper seul ; sinon
   commit `server/` (version 1.6.0). Ne pas utiliser `create-deployment` (crée un nouveau service) ni `redeploy`
   (relance l'ancien build du 13/10).
2. Vérifier : log de démarrage `(Node v26.12.1)`, `/health` ok, webhook sans signature refusé (400). Si le serveur
   casse : rollback vers `b5934fae`.
3. Clôturer JS-29330B et JS-11F231 (`resolve`, commit `a7d5a9a`), l'un après l'autre.

Incident de sécurité Railway du 21/10 (blog.railway.com/p/security-disclosure-wednesday-october-21st : des
variables d'environnement ont pu être lues) : les 4 secrets du service (`RESEND_API_KEY`, `SMTP_PASSWORD`,
`STRIPE_WEBHOOK_SECRET`, `ADMIN_SECRET`) sont à changer. **Ne rien révoquer tant que les déploiements sont en pause**
(le serveur garderait l'ancien secret : e-mails de vente cassés). Propriétaire prévenu : il change lui-même le mot
de passe de sa boîte mail et le secret du webhook Stripe ; la clé Resend et `ADMIN_SECRET` attendent son accord.
Contrôle Resend du 22/10 00:32 UTC : aucun appel ni envoi inconnu (seuls l'appli Majordia et les outils MCP).

## 2026-10-21 — passage de test (13:47 UTC, lancé par le propriétaire)

État : 🟢 site et paiement · 🟠 serveur et incidents (panne Railway toujours en cours, correctifs `server/` du
matin non déployés) · 🟢 workflows et code. Rapport email : **non envoyé** (celui du jour est déjà parti par Gmail
le matin ; un seul envoi par jour). Rapport complet :
[`docs/rapports/surveillance/2026-10-21-test.md`](../docs/rapports/surveillance/2026-10-21-test.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 51 URL × 1280/390 px sans erreur ; 313 liens, 0 interne cassé (403/429 externes = robots) ; TLS → 14/12 |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée |
| Serveur | À surveiller | `/health` ok, 0 5xx sur 39 requêtes ; aucun déploiement Railway pour #89 à #93 (« builds paused ») |
| Incidents | 2 en attente | JS-29330B, JS-11F231 : non clôturés, attendent le déploiement de `a7d5a9a` |
| Workflows, code | OK | CI, Pages, IndexNow, Instagram verts ; build sans diff, tests verts, 0 faille |

Réparations : aucune. Points ouverts : quand les builds Railway reprennent, vérifier le déploiement de `server/`
(sinon commit de version 1.6.0 pour relancer), puis clôturer JS-29330B et JS-11F231.

Suivi de 19:54 UTC : builds Railway **toujours en pause** (status.railway.com : reprise par étapes, Enterprise
vers 20:30 UTC, puis Pro, Hobby, Free) ; `/health` encore en v1.5.0. Rien poussé, incidents non clôturés ; le
passage du 22/10 à 05:07 reprend ce point.

## 2026-10-21 — premier passage (validation de la mission)

État : 🟢 site et paiement · 🟠 serveur et incidents (panne Railway, 2 incidents en attente de déploiement) ·
🟢 workflows et code. Rapport email : **envoyé par Gmail** (compte du propriétaire, connecteur Resend non connecté).
Rapport complet : [`docs/rapports/surveillance/2026-10-21.md`](../docs/rapports/surveillance/2026-10-21.md).

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | 51 URL × 1280/390 px sans erreur, 0 débordement ; liens 403 = BGG/Etsy/doi (robots) ; TLS → 14/12 |
| Paiement, initiation | OK | Stripe 9,99 € + 2,99 € = 12,98 € ; partie jouée dans `/minijeu.html` |
| Serveur | À surveiller | `/health` ok, 0 5xx ; panne Railway « builds paused » : `f687d50` non déployé |
| Incidents | 11/13 clôturés | bruit réseau, vidéo, `:is()` ; JS-29330B et JS-11F231 attendent le déploiement |
| Workflows | OK | CI, Pages, IndexNow, Instagram verts ; Auto-Heal horaire retiré du planning |
| Code | OK | build sans diff, tests verts ; `undici` corrigé |

Réparations : PR #91 (mission, workflows, route `routine-report`), PR #92 (filtres fausses alertes), PR du rapport
(`undici`, workflow sans `concurrency`, mission corrigée).
Points ouverts : déploiement Railway de `f687d50` puis clôture de JS-29330B et JS-11F231 ; Node 24 avant avril 2027.
