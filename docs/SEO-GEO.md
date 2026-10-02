# SEO / GEO — fonctionnement et suivi

Ce document décrit comment le site est construit pour le référencement (Google, Bing) et pour les
réponses des assistants IA (ChatGPT, Copilot, Perplexity, Gemini, Claude), et ce qu'il reste à faire à la main.
Il suit l'audit d'octobre 2026 (`rapport-seo-geo-kyran`).

## 1. Construire le site

```bash
npm ci
npm run build        # articles, redirections, blog-data.js, sitemap, llms.txt, rendu statique, CSP
npm test             # JSON-LD, articles du blog, cohérence du site, tests de sécurité
```

`npm run build` est déterministe : relancé sans modification, il ne change rien (la CI le vérifie).
Toujours commiter le résultat du build avec les sources.

| Étape | Script | Produit |
|---|---|---|
| 1 | `generate-blog.mjs` | `blog/<slug>.html` à partir de `scripts/content/blog/<slug>.mjs` |
| 2 | `generate-redirects.mjs` | pages de redirection (`roster.json` → `redirects`) |
| 3 | `generate-blog-infra.mjs` | `blog-data.js`, `blog/feed.xml`, `blog/index.html` |
| 4 | `generate-seo.mjs` | `sitemap.xml`, `llms.txt`, `llms-full.txt`, `plan-du-site.html`, version des assets |
| 5 | `prerender.mjs` | HTML statique des composants `<kyran-*>` et des avis |
| 6 | `apply-csp.mjs` | balises CSP / referrer |

Images : `node scripts/optimize-images.mjs` (WebP des images du blog) après l'ajout d'une image.

## 2. Ajouter ou modifier un article

1. Faits d'un jeu (joueurs, durée, âge, prix, image) : `scripts/content/games.json`.
2. Article : `scripts/content/blog/<slug>.mjs` (format et règles de rédaction : `scripts/content/README.md`).
3. Ajouter le slug dans `scripts/content/roster.json` (`generated`).
4. `node scripts/validate-articles.mjs <slug>` — refuse les phrases communes à deux articles, les liens
   vers des pages fusionnées, les articles sans critères, sans avis tranché, sans FAQ propre.
5. `npm run build`, puis commiter.

Règle d'or : aucun paragraphe ne doit exister dans deux articles. Le contrôle de page
`node scripts/check-duplicates.mjs` mesure le recouvrement réel entre pages publiées (seuil d'erreur : 20 %).

Fusionner ou supprimer un article : ajouter l'ancienne URL dans `roster.json` → `redirects`
(GitHub Pages ne gère pas les 301 : une page `meta refresh` + canonique est générée).

## 3. Dates de modification

`sitemap.xml` (`<lastmod>`) et les `dateModified` JSON-LD viennent de `scripts/lastmod-manifest.json` :
la date ne change que si le contenu utile de la page change (les numéros de version d'assets, l'en-tête
et le pied de page rendus statiquement n'y comptent pas). Ne modifiez pas ce fichier à la main.

## 4. IndexNow (Bing, Copilot)

- Clé : fichier `<clé>.txt` à la racine (publique par conception).
- `.github/workflows/indexnow.yml` envoie à chaque push sur `main` les pages HTML modifiées, après avoir
  attendu que la clé soit en ligne. Lancement manuel possible (« Run workflow ») pour renvoyer tout le sitemap.
- Test local : `node scripts/indexnow.mjs --all --dry-run`.

## 5. CI

`.github/workflows/ci.yml` : JSON-LD valide partout, validation des articles, cohérence du site
(canoniques, liens internes, sitemap, redirections, robots.txt, llms.txt), build à jour, tests de sécurité.

## 6. À faire à la main (Corentin)

Après déploiement :

- **Search Console** : inspecter `/`, puis « Demander une indexation » pour `/`, `/tarot-africain.html`,
  `/tarot-africain-a-3-joueurs.html`, `/whist-22.html`, `/regle.html`, `/commander.html`, `/a-propos.html`
  et les articles réécrits (environ 10 par jour). Relancer « Valider la correction » sur « Explorée, actuellement
  non indexée ». Supprimer l'ancien sitemap en cache si besoin et le re-soumettre.
- **Search Console → Pages** : les anciennes URL fusionnées apparaîtront en « Page avec redirection » : normal.
- **Bing Webmaster Tools** : vérifier que les envois IndexNow arrivent (rapport IndexNow) ; re-soumettre le sitemap.
- **GitHub → Settings → Pages** : si la publication est en mode « GitHub Actions », le workflow `pages.yml`
  publie sur `main` ; sinon le site est servi directement depuis la branche.

Hors code (indispensable pour viser la première place — le site n'a aucun lien entrant) :

1. Fiches de référence : BoardGameGeek (voir `NETLINKING_ANNUAIRES.md`), Tric Trac, Wikidata (élément « KYRAN »,
   jeu de cartes, auteur, date de sortie), Philibert / Ludum si distribution. Ajouter ensuite ces URL au
   `sameAs` de l'Organisation dans `index.html` et dans `a-propos.html`.
2. Tests et avis : lien vers le site dans la description de la vidéo Ludochrono ; envoyer des boîtes à
   Gus & Co, Vin d'jeu, Un Monde de Jeux, comptes Instagram / TikTok jeux.
3. Communautés : Reddit (r/jeuxdesociete, r/boardgames), forums Tric Trac, groupes Facebook — participation honnête.
4. Presse locale, festivals, concours (As d'Or, Double 6, etc.).
5. Amazon : davantage d'avis vérifiés.
6. Google Merchant Center : brancher `google-merchant-feed.xml` (onglet Shopping proposé par la Search Console).
7. Google Business Profile si une adresse professionnelle peut être affichée.
8. YouTube : vidéos « Comment jouer à KYRAN en 3 minutes » et « Règles du Tarot Africain en vidéo », avec
   lien vers le site. La chaîne officielle (https://www.youtube.com/@Kyran-jeu) est déjà dans les `sameAs`.

## 7. Décisions du propriétaire et points restants

Tranchés (2 octobre 2026) :

| Sujet | Décision appliquée |
|---|---|
| Nombre de cartes | D'après la carte de règles : 36 Nombre + 1 Mystique + 8 Pouvoir (45 cartes de jeu) + 30 Vie + cartes de règles. « 55 cartes » retiré partout (site, CGV, flux Merchant, barre de stats). Le nombre de cartes de règles n'est pas écrit (7 sur l'ancienne page, 4 sur l'annonce Amazon) : à confirmer si vous voulez le publier. |
| Avis « Amélie » | Citation supprimée de l'accueil. Les citations de Toto et Patrick sont maintenant des extraits exacts de leurs avis. |
| Retours | Retours gratuits confirmés : CGV (art. 6), page commander, FAQ et JSON-LD alignés (`FreeReturn`). |
| Livraison | France métropolitaine et pays limitrophes : Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne, Monaco, Andorre, Royaume-Uni (liste du flux Merchant). CGV, JSON-LD, page commander et FAQ alignés. |
| Prix | 9,99 € sur kyran-jeu.fr (confirmé). |
| Flux Merchant | « Dès 10 ans » corrigé en « Dès 8 ans ». |
| Kbis | Cohérent avec les mentions légales (SIREN 840 817 548, RCS Nanterre). Activité commencée le 10/09/2025 : ajoutée dans `llms.txt` et au JSON-LD de l'Organisation (`foundingDate`). Le domicile du Kbis n'est pas republié. |

Restent ouverts :

| Sujet | Constat | Action |
|---|---|---|
| Liens externes | Recherche web faite le 2 octobre 2026 : aucune fiche Etsy, BoardGameGeek, Tric Trac, aucun blog ni test indexé. Seuls l'annonce Amazon, la chaîne YouTube (@Kyran-jeu) et la vidéo Ludovox existent. Amazon n'a pas pu être consulté (robot check) : avis et fiche non récupérés. | Créer les fiches (voir § 6) puis me donner les URL pour le `sameAs`. |
| Etsy | Une boutique Etsy a été évoquée : aucune n'est trouvable publiquement. | Fournir l'URL de la boutique si elle existe. |
| Date de sortie | Dossier de presse : février 2026 ; Kbis : activité depuis septembre 2025. | Confirmer la date exacte pour Wikidata et BGG. |
| `priceValidUntil` | 2026-12-31 dans les offres JSON-LD. | À renouveler avant cette date. |
| Origine du Tarot Africain | Aucune source sur le site : les pages restent prudentes. | Fournir une source si vous voulez répondre précisément à « tarot africain origine ». |
| Fabrication | Un avis Amazon parle d'un jeu « imaginé en Guadeloupe et fabriqué en Chine ». Le site ne le dit pas. | À confirmer si vous voulez l'écrire dans « À propos ». |
| Page « À propos » | Pas de photo ni d'histoire de création dans les sources. | Ajouter une photo, le récit de création, un profil personnel (`sameAs` de la Person). |
| Références scientifiques | Deux références erronées de l'article sur le cerveau ont été corrigées (Altschul & Deary 2020 ; Dartigues et al. 2013). | Faire relire par une personne qualifiée avant d'insister sur les allégations de santé. |
