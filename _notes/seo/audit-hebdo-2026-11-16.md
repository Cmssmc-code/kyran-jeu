# Audit hebdomadaire SEO & GEO : kyran-jeu.fr, lundi 2026-11-16

Rapport d'un sous-agent Opus (lecture seule), repris par la routine. Sources : Search Console (API, `dataState: all`,
02/10 → 15/11 contre 18/08 → 01/10), Bing Webmaster (requêtes jusqu'au 13/11, pages jusqu'au 06/11), dépôt, pages
concurrentes ouvertes le 16/11.

## Résumé

1. Google sur 45 jours : 280 clics contre 105, 13 049 impressions contre 6 435, CTR 2,15 % contre 1,63 %, position 8,7
   contre 9,5. `tarot-africain` porte la moitié de la hausse (56 clics, 4 078 impressions).
2. Plus gros réservoir : les requêtes « jeu de carte à 3 / à 4 ». `jeux-3-joueurs` est en positions 35 à 40 sur « à 3 »,
   `jeux-cartes-4-joueurs` approche la page 1 (8 à 12). Ni l'une ni l'autre ne traite les classiques (Belote, Rami,
   Président…) que regles-du-jeu.net couvre et que les IA citent.
3. Bonnes positions sans clic : `jeux-comme-codenames` sur « meilleur jeu coopératif comme Codenames » (68 impressions,
   position 6,3) ; « tarot africain à 3 / à 2 » (positions 3,8 et 5,5).
4. Seul vrai recul : `jeux-soiree-amis`, 850 → 252 impressions, « jeux entre amis » 117 → 1 (après trois titres en deux
   semaines, 08/10 et 14/10).
5. Bing : 0 lien entrant ; l'autorité externe reste la limite GEO (Ludum, BGA, regles-du-jeu.net cités à notre place).

## Les 8 actions classées par gain attendu

| # | Page (source) | Changement | Preuve | Titre/description | Statut |
|---|---|---|---|---|---|
| 1 | `jeux-3-joueurs` (`scripts/content/blog/jeux-3-joueurs.mjs`) | H2 « jeux classiques à 3 » avec tableau (Belote, Rami, Président, 99, Canasta, Oh Hell!) + FAQ « quel jeu classique à 3 » | « jeu de carte a 3 » 91 impressions, position 39,5 ; page 336 impressions, position 20,8 ; regles-du-jeu.net (24/10/2026) sans tableau ni FAQ | non touchés (dernier changement 14/10) | **fait le 16/11** |
| 2 | `jeux-cartes-4-joueurs` | « jeu de cartes à 4 » dans le `metaTitle` + bloc classiques + ancres variées | « jeu de carte a 4 » 53 impressions, position 10,7 ; Bing 4 clics, position 4,4 | titre modifiable (dernier changement 04/10), non retouché | **partiel le 16/11** : ancres variées (2 pages), titre laissé |
| 3 | `jeux-comme-codenames` | FAQ « meilleur jeu coopératif comme Codenames » + réponse en intro + 3 à 4 liens entrants | 68 impressions, position 6,3, 0 clic ; page n'a que 4 liens entrants | non touchés | à faire |
| 4 | `tarot-africain.html` | phrases-réponses chiffrées « à 3 » et « à 2 » en tête de section ; question « autre nom » dans `faq.html` | « tarot africain a 3 » 48 impressions position 3,8 ; « a 2 » 39, 5,5 ; chiffres BGA à rapprocher des règles de la page avant de les écrire | description verrouillée jusqu'au 08/12 | à faire |
| 5 | `jeux-soiree-amis` | « jeux entre amis » mot pour mot en intro et H2 ; 3 liens entrants avec cette ancre | 850 → 252 impressions, position 19,0 → 24,2 | non touchés volontairement (stabiliser) | à faire |
| 6 | pages liant `jeux-comme-skyjo` | 3 à 4 liens avec l'ancre « variantes de Skyjo » | « variante skyjo » 78 impressions, position 10,5 ; 13 liens entrants tous « jeux comme Skyjo » | titre verrouillé jusqu'au 08/12 | à faire |
| 7 | `jeux-cartes-6-joueurs` | H2/H3 « Jeux de cartes à 5 joueurs » à l'ancre `#criteres` + liens directs | ancienne URL `jeux-cartes-5-joueurs` : 12 clics, 273 impressions, position 5,2 | non touchés | à faire |
| 8 | `jeux-comme-6-qui-prend`, `jeux-comme-dixit`, `jeux-plis-comparatif` | 2 à 3 liens entrants chacune ; définition de « jeu de plis » en tête de `jeux-plis-comparatif` | 6 qui prend : 4 liens entrants, CTR 7 % ; « jeux de plis » position 27,8 ; Ludum sans définition | non touchés | à faire |

## Constats JSON-LD et maillage

- Blog : BlogPosting, FAQPage, ItemList, Game, Speakable, BreadcrumbList partout, `dateModified` du 01/11 au 14/11 : rien à corriger.
- Accueil et `regle` : pas de `dateModified` (sans enjeu fort).
- Maillage (liens dans `<main>`) : accueil 58, `regle` 58, `tarot-africain` 32 (ancre « Tarot Africain » ×34, sans variante), `jeux-bluff-pari` 18, `jeux-3-joueurs` 14, `jeux-soiree-amis` 14, `jeux-comme-skyjo` 13, `jeux-cartes-4-joueurs` 13, `alternatives-uno` 8, `jeux-comme-dixit` 5, `jeux-comme-codenames` 4, `jeux-comme-6-qui-prend` 4. Pas d'orpheline ; ancres trop uniformes.
- Pages page 1 à CTR faible : `faq` (0,93 %, 108 impressions), `jeux-coop-cartes` (0,98 %), `alternatives-uno` (1,18 %, 595), `jeux-cartes-seniors` (0 %, 53), `a-propos` (0 %, 52).

## Concurrents

- **Ludum** : volume de listes (40 jeux de plis, 100 à 3, 100 à 4), « (2026) » dans les titres ; ni tableau, ni définition, ni FAQ.
- **Board Game Arena** : partie jouable et preuve sociale (90 395 parties de Whist 22) ; pas d'autres noms ni de règles détaillées en français.
- **regles-du-jeu.net** : couverture des classiques par nombre de joueurs, mise à jour le 24/10/2026 ; pas de tableau ni de FAQ.
- Ce qui nous manque : couverture des classiques sur les pages « par nombre de joueurs » (actions 1, 2, 7) et autorité externe (0 lien Bing).
