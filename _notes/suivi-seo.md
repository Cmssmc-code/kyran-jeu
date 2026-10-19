# Suivi de la routine SEO & GEO de KYRAN

Journal de la routine nocturne (`_notes/seo-routine-mission.md`), entrée la plus récente en haut. Chaque entrée :
date, verdict (« En progrès », « Stable », « À surveiller », « Incident »), KPI, veille en 5 lignes, actions et
PR, effets mesurés, à décider, hors périmètre signalé, `rev` du doc partagé en fin de run.

Doc partagé : https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee ·
Base : [`seo/base-connaissances.md`](seo/base-connaissances.md) · Backlog : [`seo/backlog.md`](seo/backlog.md) ·
Journal des titres (règle des 28 jours) : [`../docs/SUIVI-BLOG-SEO.md`](../docs/SUIVI-BLOG-SEO.md).

## Entrées

### 2026-10-19 : état initial (mise en place, session interactive)

- **Verdict : En progrès.**
- **Google** (Search Console, `dataState: all`) : 7 j du 12 au 18/10 : 54 clics (+69 %), 2 003 impressions
  (+32 %) ; 28 j : 125 clics, 5 662 impressions, CTR 2,21 %, position 9,3. Dernières 24 h : 8 clics, 355
  impressions (303 une semaine plus tôt). Marque « kyran » : 1 → 6 clics sur 7 j.
- **Bing** : 7 j au 17/10 : 6 clics, 146 impressions (+23 %) ; 56 pages dans l'index.
- **Technique** (`seo-health.py`, 50 URL du sitemap) : 0 anomalie ; inspection Google : 17 URL sur 20 indexées,
  `/blog/` « Découverte, non indexée », `/a-propos.html` inconnue.
- **Veille** : règles du blog durcies le 19/10 ; refonte des 13-14/10 suivie de la meilleure semaine depuis
  juillet ; 0 lien entrant ; Wikidata Q141623753 existe mais n'est pas dans les `sameAs`.
- **Mis en place** : `_notes/seo/` (base, backlog, historique KPI sur 90 jours), `scripts/seo-kpi-daily.py`,
  `scripts/seo-health.py`, mission de la routine, doc partagé (rev 20), session dédiée
  `session_01VsKUWwrZ4NnxRCubDJY5sX`.
- **À décider** : mesure d'audience sans cookie ; `priceValidUntil` 2027 ; clé `PAGESPEED_API_KEY`.
- **Premier run** : 2026-10-20 à 00:00 ; priorité aux pages hors index et aux `sameAs` Wikidata.
