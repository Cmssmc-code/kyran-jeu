# Journal de la routine « Surveillance & réparation KYRAN »

Consigne : [`surveillance-reparation-routine-mission.md`](surveillance-reparation-routine-mission.md). Une entrée par
jour, la plus récente en haut. Rapport complet de chaque passage : `docs/rapports/surveillance/AAAA-MM-JJ.md`.
Historique de l'ancienne routine santé (jusqu'au 2026-10-21) : [`suivi-sante.md`](suivi-sante.md).

---

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
