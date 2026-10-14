# Fiche Wikidata à créer : KYRAN (jeu de cartes)

> Préparée le 2026-10-14 (audit SEO/GEO, § G1). **À créer par Corentin** sur
> https://www.wikidata.org/wiki/Special:NewItem (compte Wikidata requis). Wikidata exige des
> sources indépendantes quand c'est possible : citer BoardGameGeek, Ludovox et BoardGamesFlix
> plutôt que le seul site officiel. Ne pas créer d'élément pour l'auteur sans source tierce.
>
> Une fois l'élément créé (identifiant `Q…`), l'ajouter aux `sameAs` du JSON-LD :
> `Organization` (index.html), `Product` #boardgame (commander.html) et `Game` #game (index.html),
> puis dans `llms.txt` (« Présence externe », `scripts/generate-seo.mjs`).

## Libellés

| Langue | Libellé | Description | Alias |
|---|---|---|---|
| fr | KYRAN | jeu de cartes de plis et de paris (2026) | Kyran, maître des mystiques ; KYRAN : Maître des Mystiques |
| en | KYRAN | 2026 trick-taking card game with exact bidding | Kyran |

## Déclarations

| Propriété | Valeur | Source à citer |
|---|---|---|
| nature de l'élément (P31) | jeu de cartes (Q142714) | https://boardgamegeek.com/boardgame/480678/kyran |
| genre (P136) | jeu de levées (Q1361226) | BGG (mécanique Trick-taking) |
| auteur (P50) | Corentin Sence (texte : P2093 « auteur sous forme de chaîne ») | BGG, https://ludovox.fr/ludochrono-kyran/ |
| éditeur (P123) | Corentin Sence / Kyran (chaîne, pas d'élément) | https://kyran-jeu.fr/mentions-legales.html |
| illustrateur (P110) | Crea by Floh (chaîne) | https://kyran-jeu.fr/a-propos.html |
| date de publication (P577) | 31 janvier 2026 | https://ludovox.fr/ludochrono-kyran/ (Ludochrono publié le même jour) |
| pays d'origine (P495) | France (Q142) | https://kyran-jeu.fr/mentions-legales.html |
| langue de l'œuvre (P407) | français (Q150) | site officiel |
| nombre minimal de joueurs (P1872) | 3 | BGG |
| nombre maximal de joueurs (P1873) | 6 | BGG |
| âge minimal recommandé (P2899) | 8 ans | BGG |
| durée de jeu (P2047) | 30 minutes | BGG |
| inspiré de (P941) | Ascenseur (jeu de cartes) (Q973596) — dont le Tarot Africain est une variante | https://fr.wikipedia.org/wiki/Ascenseur_(jeu_de_cartes) |
| site officiel (P856) | https://kyran-jeu.fr/ | — |
| identifiant BoardGameGeek (P2339) | 480678 | — |
| identifiant de chaîne YouTube (P2397) | à relever sur la chaîne @Kyran-jeu (identifiant `UC…`) | — |
| nom d'utilisateur Instagram (P2003) | kyran.jeu | — |

## À vérifier avant de créer

- Le numéro P/Q de « jeu de levées » et « jeu de cartes » (les rechercher dans Wikidata, ne
  pas recopier sans contrôle).
- Que BGG affiche bien 3–6 joueurs, 30 min, 8+ et l'année 2026 pour l'objet 480678
  (`https://api.geekdo.com/api/geekitems?objectid=480678&objecttype=thing`).
- Que les profils externes (YouTube @Kyran-jeu, Instagram, Etsy, Amazon, BGG, BoardGamesFlix)
  renvoient tous vers `https://kyran-jeu.fr/` dans leur bio ou leur description.
