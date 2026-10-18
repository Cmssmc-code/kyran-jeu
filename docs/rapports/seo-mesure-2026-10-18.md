# Mesure SEO du 18 octobre 2026 et corrections

Suite du rapport `audit-seo-geo-2026-10-13.md` (§ 6, point 2 : « 18 octobre, mesurer le CTR des titles
du 8 octobre ; appliquer les propositions si le Tarot Africain reste sous 2 % »). Données Google Search
Console (API, propriété `sc-domain:kyran-jeu.fr`), Bing Webmaster (API) et inspection d'URL du jour.

## 1. Mesure

### Google, 30 jours (18 sept. → 17 oct.)

| Page | Clics | Impr. | CTR | Pos. |
|---|---|---|---|---|
| /tarot-africain.html | 20 | 1 698 | 1,2 % | 7,4 |
| /blog/jeux-comme-skyjo.html | 10 | 666 | 1,5 % | 8,9 |
| /blog/jeux-soiree-amis.html | 2 | 412 | 0,5 % | 22,5 |
| /blog/jeux-comme-codenames.html | 5 | 402 | 1,2 % | 6,1 |
| /blog/jeux-comme-dixit.html | 17 | 397 | 4,3 % | 6,2 |
| /regle.html | 3 | 252 | 1,2 % | 7,7 |
| / | 10 | 202 | 5,0 % | 4,0 |
| /blog/jeux-cartes-4-joueurs.html | 3 | 189 | 1,6 % | 9,5 |

### Depuis les titles du 8-11 octobre (9 → 17 oct.)

| Page | Clics | Impr. | CTR | Pos. |
|---|---|---|---|---|
| /tarot-africain.html | 10 | 589 | 1,7 % | 6,9 |
| /blog/jeux-comme-skyjo.html | 5 | 230 | 2,2 % | 8,7 |
| /blog/jeux-comme-codenames.html | 1 | 112 | 0,9 % | 6,6 |
| /blog/jeux-comme-dixit.html | 9 | 122 | 7,4 % | 7,9 |

Requêtes du Tarot Africain sur la même période : « tarot africain » 1 134 impressions, **CTR 0,2 %,
position 10,3** ; « tarot africain règle » 184 impr., pos. 5,8 ; « le tarot africain » 47 ;
« tarot africain regles » 44 ; « taro africain » 21 ; **« tarot africain en ligne » 15 (aucune réponse
sur la page)** ; « tarot africain a 3 » 13 ; « tarot mexicain » 8 (pos. 1).

Marque : « kyran » 45 impr., CTR 13,3 %, position 3,5 (5,6 le 13 oct.).

Verdict : le Tarot Africain reste sous 2 % et Codenames baisse ; Skyjo et Dixit progressent.

### Indexation (inspection du 18 oct.)

| URL | État |
|---|---|
| /tarot-africain.html, /regle.html, /commander.html, /whist-22.html, /tarot-africain-a-3-joueurs.html, jeux-comme-codenames, jeux-soiree-amis | Indexées |
| /idee-cadeau.html, /video-regles.html, /blog/jeux-comme-skull-king.html | Détectées, non indexées |
| /ressources-gratuites.html, /regles-rikiki.html, /regle-tarot-africain-imprimable.html | Inconnues de Google |

Sitemap lu le 14 oct. (47 URL soumises, 50 aujourd'hui). `/commander.html` n'a pas été explorée depuis
le 17 septembre, `/regle.html` depuis le 24 septembre.

### Bing (cumul)

Trafic marginal : jeux-comme-skyjo 9 clics / 106 impr., accueil 2 / 40, Tarot Africain 0 / 34.
Aucun problème d'exploration.

## 2. Corrections de ce commit

| Fichier | Avant | Après | Raison |
|---|---|---|---|
| `tarot-africain.html` (title, og, twitter, `site-urls.mjs`) | Tarot Africain : règles simples, 3 à 5 joueurs + feuille PDF | Tarot Africain (Whist 22) : règles + feuille de score PDF (57) | CTR 0,2 % sur la requête principale ; répond à « autre nom » |
| `tarot-africain.html` (description + JSON-LD) | 22 cartes, chacun parie ses plis… | Le Tarot Africain, ou Whist 22, se joue de 3 à 5 avec 22 cartes de tarot : chacun parie ses plis au pli près. Règle pas à pas, exemple et feuille PDF. (150) | mot-clé en tête |
| `tarot-africain.html` (réponses rapides) | — | « Où jouer au Tarot Africain en ligne ? » → Board Game Arena (vérifié le 18 oct. : « Tarot africain », navigateur, sans téléchargement) | requête « tarot africain en ligne » sans réponse |
| `regle.html` (title, og, twitter) | Règles de KYRAN en 5 min + vidéo : pariez le nombre de plis | Jeu de cartes où l'on annonce ses plis : règles de KYRAN (56) | requêtes génériques « jeu de carte annonce / pari nombre de plis » (pos. 5 à 10), la marque est encore peu cherchée |
| `regle.html` (description) | Annoncez le nombre exact… | Chacun annonce le nombre exact de plis qu'il fera, mais le total des paris ne tombe jamais juste : règles de KYRAN en 5 min, en vidéo, 3 à 6 joueurs. (149) | idem |
| `jeux-comme-codenames.mjs` | … (2026) (62) | sans « (2026) » (55) | troncature, CTR 0,9 % |

Prochaine mesure : **1er novembre 2026** (14 jours), mêmes requêtes. Si « tarot africain » reste sous
1 % en position 7-10, le frein est l'autorité (liens entrants), pas le snippet.

## 3. Non fait ici, volontairement

- `jeux-soiree-amis` (position 20 à 30 sur « jeux entre amis ») : problème de contenu et d'autorité,
  à traiter par une passe blog (`docs/BLOG-PASSES.md`), pas par les balises.
- Articles au gabarit par défaut signalés par `validate:blog` (6 qui prend, Codenames, Dixit, draft,
  famille, grands groupes) : refonte de structure par les passes blog.
- PageSpeed Insights : quota de l'API épuisé le 18 oct. ; à relancer à la main.
- Actions manuelles (Search Console, Wikidata, Tric Trac, liens entrants) : voir le rapport Drive.
