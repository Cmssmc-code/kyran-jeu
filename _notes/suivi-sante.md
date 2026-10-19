# Journal de la routine « Santé quotidienne de KYRAN »

Consigne : [`sante-routine-mission.md`](sante-routine-mission.md). Une entrée par run, la plus récente en haut.
Rapport complet de chaque run : Google Drive, dossier « KYRAN - Santé », document `Santé KYRAN AAAA-MM-JJ`.

---

## 2026-10-19 — mise en place (avant le premier run)

Routine créée à la demande du propriétaire, portage de « Santé quotidienne de Majordia ». Relevé fait pendant la
mise en place (pas un run complet) :

| Domaine | État | Constat (preuve) |
|---|---|---|
| Site | OK | `https://kyran-jeu.fr/` 200 (0,46 s), `sitemap.xml` 200, `https://www.kyran-jeu.fr/` 301 |
| Serveur Railway | OK | `/health` 200 : `status` ok, version 1.5.0, `emailTransport` resend, `hasWebhookSecret` true, `adminEnabled` true |
| Pages et workflows | OK | « Contrôles du site », Pages et IndexNow verts sur `e104028` (fusion de la PR #74) |

Points ouverts pour le premier run : tout le reste du déroulé (non vérifié ici).
