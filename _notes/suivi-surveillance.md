# Journal de la routine « Surveillance & réparation KYRAN »

Consigne : [`surveillance-reparation-routine-mission.md`](surveillance-reparation-routine-mission.md). Une entrée par
jour, la plus récente en haut. Rapport complet de chaque passage : `docs/rapports/surveillance/AAAA-MM-JJ.md`.
Historique de l'ancienne routine santé (jusqu'au 2026-10-21) : [`suivi-sante.md`](suivi-sante.md).

---

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
