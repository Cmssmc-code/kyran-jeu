# SEO & GEO de KYRAN : lire ce fichier en premier

Ce dossier contient tout ce qu'on sait du référencement de **kyran-jeu.fr** (jeu de cartes KYRAN) : dans Google
et Bing (SEO) et dans les moteurs de réponse IA comme ChatGPT, Perplexity, Gemini, Copilot ou Claude (GEO). Il est
tenu à jour chaque nuit à minuit (heure de Paris) par une routine Claude Code, et il sert à toute IA ou à toute
personne qui doit comprendre ou améliorer le référencement du site.

## Par où commencer

| Je veux… | Ouvrir |
|---|---|
| Comprendre l'état SEO/GEO en 2 minutes : le jeu, l'offre, les pages, les mots-clés, la technique, les concurrents, les mentions, le GEO, les règles | [`base-connaissances.md`](base-connaissances.md) |
| Savoir quoi faire ensuite, par priorité (et ce qui est hors périmètre) | [`backlog.md`](backlog.md) |
| Voir ce qui a été fait, nuit après nuit, et l'effet mesuré | [`../suivi-seo.md`](../suivi-seo.md) |
| Lire les chiffres jour par jour (Google, Bing) | [`kpi-quotidiens.csv`](kpi-quotidiens.csv) |
| Lire l'état technique du site en ligne, run après run | [`kpi-technique.csv`](kpi-technique.csv), détail du dernier relevé dans [`derniere-sante.json`](derniere-sante.json) |
| Voir les pages et requêtes qui montent ou baissent (7 jours contre 7 jours) | [`mouvements.json`](mouvements.json) |
| Suivre les liens entrants et les prises de contact | [`../outreach/cibles.md`](../outreach/cibles.md) (modèles : [`../outreach/modeles-mails.md`](../outreach/modeles-mails.md)) |
| Tester la présence dans les IA | [`../geo-tests.md`](../geo-tests.md) |
| Connaître la consigne exacte de la routine nocturne (droits, interdits, déroulé) | [`../seo-routine-mission.md`](../seo-routine-mission.md) |
| Vérifier quand un titre peut être réécrit (règle des 28 jours) | journal des titres de [`../../docs/SUIVI-BLOG-SEO.md`](../../docs/SUIVI-BLOG-SEO.md) |
| Comprendre la mécanique SEO du site (build, sitemap, IndexNow) | [`../../docs/SEO-GEO.md`](../../docs/SEO-GEO.md) |
| Lire la version partagée et lisible (tableau de bord, graphique, veille) | doc « KYRAN — Pilotage SEO & GEO » : https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee |

## Mesurer maintenant (lecture seule)

```bash
pip install -r scripts/requirements-seo.txt
python3 scripts/seo-kpi-daily.py                      # Google (veille provisoire + horaire) et Bing ; met à jour kpi-quotidiens.csv
python3 scripts/seo-health.py --sample 0 --inspect 20  # tout le sitemap + indexation Google ; met à jour kpi-technique.csv
npm run check:site && npm run test:seo                 # contrôles du dépôt
```

Identifiants lus dans l'environnement, jamais affichés : `GSC_SERVICE_ACCOUNT_JSON` (Search Console, propriété
`sc-domain:kyran-jeu.fr`) et `BING_WEBMASTER_API_KEY` (site `https://kyran-jeu.fr/`). Détail :
[`../../docs/MCP_SEO.md`](../../docs/MCP_SEO.md).

## Règles à respecter avant de toucher au SEO

1. Lire [`../lecon.md`](../lecon.md) et les faits canoniques du jeu ([`../memoire.md`](../memoire.md) § 1) : jamais
   « 55 cartes », « février 2026 », « sans élimination », « sans hasard ».
2. Une page générée se corrige dans sa source (`scripts/content/`, générateurs), puis `npm run build` et
   `npm test` ; les fichiers régénérés sont commités.
3. Un titre ou une description ne se réécrit pas moins de 28 jours après son dernier changement ; noter chaque
   changement dans le journal des titres de `docs/SUIVI-BLOG-SEO.md`.
4. Ne jamais modifier une fonction principale pour le SEO (moteur du jeu `dojo/`, paiement Stripe, prix, `server/`,
   `worker/`) : la signaler dans `backlog.md` § « Hors périmètre ».
5. Aucun chiffre inventé : chaque donnée vient d'une API ou d'une page ouverte.
6. Après un changement : mettre à jour `base-connaissances.md` si un fait a changé, et `../suivi-seo.md`.

## Qui tient ce dossier

- Routine « SEO & GEO quotidienne KYRAN (session dédiée) » (`trig_01MHUsZiM1JZiw1DHGHBhphi`), chaque nuit à
  00:00, session `session_01VsKUWwrZ4NnxRCubDJY5sX` ; détail dans [`../memoire.md`](../memoire.md) § 14.
- Toute session ou toute IA peut l'améliorer en suivant les règles ci-dessus.
