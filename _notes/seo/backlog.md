# Backlog SEO & GEO : KYRAN

> Tenu par la routine SEO nocturne (`_notes/seo-routine-mission.md`). Une ligne par action, la plus prioritaire en
> haut ; une action faite passe dans le journal de `_notes/suivi-seo.md` avec sa PR et sa date de mesure.
> Priorités : P1 incident ou perte de trafic, P2 gain rapide, P3 GEO et autorité, P4 dette.

## Actions de la routine

| Prio | Sujet | Constat (preuve) | Action proposée | Ajouté le |
|---|---|---|---|---|
| P1 | Pages hors index | Inspection du 19/10 : `/blog/` « Découverte, non indexée », `meilleurs-jeux-apero` « Explorée, non indexée », `/a-propos.html` inconnue ; au 18/10 : `video-regles`, `jeux-comme-skull-king`, `ressources-gratuites`, `regles-rikiki` | Liens internes depuis les pages fortes (accueil, Tarot africain, Skyjo, Dixit), contenu propre vérifié, inspection chaque nuit | 2026-10-19 |
| P2 | Wikidata absent des `sameAs` | Q141623753 existe (site officiel renseigné) mais n'est cité nulle part sur le site | Ajouter l'URL Wikidata aux `sameAs` de `#organization`, `#game` et `#boardgame`, et à `llms.txt` (« Présence externe ») ; corriger `_notes/wikidata-kyran.md` | 2026-10-19 |
| P2 | Images de partage | `logo.png` 512 × 512 sur 10 pages (`tarot-africain`, `regle`, `faq`, `whist-22`, `tarot-africain-a-3-joueurs`…) ; PNG de 1,96 Mo sur `commander.html` | Images 1200 × 630 tirées des visuels existants, WebP/JPEG légers | 2026-10-19 |
| P2 | `jeux-3-joueurs` et `jeux-soiree-amis` | Positions 30,5 et 22,7 ; titres de 62 et 61 caractères ; `jeux-3-joueurs` = page la plus citée par Copilot | Contenu qui répond à la requête, maillage avec ancre exacte, titres raccourcis (règle des 28 jours) | 2026-10-19 |
| P2 | `regle.html` | « jeu de carte annonce nombre de plis » (37 impressions) arrive sur la page sans être ciblé | Section et ancre sur l'annonce du nombre de plis ; cible ajoutée à `seo-keywords.json` | 2026-10-19 |
| P2 | `seo-keywords.json` | 11 pages sans cible ; 9 requêtes partagées entre pages | Une cible par page, une page par requête | 2026-10-19 |
| P3 | GEO Tarot africain | Les AI Overviews reprennent `tarot-africain.html` sans nommer KYRAN | Phrase-réponse en tête qui nomme KYRAN comme héritier moderne ; faits datés | 2026-10-19 |
| P3 | Anciennes URL encore classées | `jeux-comme-hanabi`, `jeux-cartes-5-joueurs`, `jeux-comme-the-crew`, `jeux-trahison-cachee` : 17 clics sur 28 j ; ChatGPT cite `/comparatif-jeux-plis.html` | Plus aucun lien interne vers elles ; canonical et `meta refresh` vérifiés | 2026-10-19 |
| P3 | Docs fausses | `NETLINKING_ANNUAIRES.md` (pouvoirs inventés, « Player Elimination », fiche BGG « à créer ») ; `docs/SEO-GEO.md` § 8 (pays de livraison) | Corriger d'après `_notes/memoire.md` § 1 | 2026-10-19 |
| P4 | Performance | CSS bloquant ~700 ms en 4G lente ; images de l'accueil ~400 Ko sur mobile | Image plus légère, `fetchpriority` ; CSS : « À décider » (design) | 2026-10-19 |

## Hors périmètre : signalé, non modifié

| Sujet | Constat | Proposition | Qui |
|---|---|---|---|
| Mesure d'audience | GA4 vide (choix RGPD) | Outil sans cookie (Cloudflare Web Analytics, GoatCounter) | À décider |
| `priceValidUntil` | Expire le 31/12/2026 | Le prolonger avec le prix 2027 | À décider |
| Merchant Center | Flux généré, compte non branché (`docs/MERCHANT.md`) | Brancher le flux (fiches produit gratuites) | Corentin |
| BGG, Trictrac, MyLudo, Philibert | Fiche BGG vide, autres absentes | Fiches complètes | Corentin (comptes) |
| Articles au gabarit par défaut | 6 articles (6 qui prend, Codenames, Dixit, draft, famille, grands groupes) | Restructuration | Routine blog |
| PR publiques visibles sur la marque | Titres « audit SEO/GEO » dans la SERP de « KYRAN » | Titres de PR neutres ; le dépôt reste public (Pages) | Toutes les sessions |
