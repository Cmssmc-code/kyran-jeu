# Google Merchant Center : fiche produit KYRAN

Ce document explique le flux produit du site et ce que le propriétaire doit faire lui-même
dans Merchant Center. Mis à jour le 13 octobre 2026.

## 1. Le flux

- URL publique : **https://kyran-jeu.fr/google-merchant-feed.xml** (RSS 2.0, espace de noms `g:`).
  C'est l'URL déjà annoncée dans `robots.txt` ; elle ne change pas.
- Généré par `scripts/generate-merchant-feed.mjs`, étape de `npm run build`. Ne pas éditer le
  fichier XML à la main : la CI vérifie qu'il est à jour (`scripts/test/merchant-feed.test.mjs`).
- Les valeurs viennent de `scripts/lib/product.mjs`, qui cite la source de chacune
  (`commander.html`, `cgv.html`, `mentions-legales.html`). Un changement de prix ou de port se
  fait d'abord sur Stripe, puis dans `product.mjs`, puis dans les pages
  (`docs/VENTES-PASSES.md`, étape 2).
- `google-merchant-feed.tsv` est la même fiche au format texte, générée en même temps (sans
  `product_detail`). Soumettre **un seul** des deux fichiers : le XML.
- Les deux fichiers ont été réécrits le 13 octobre 2026. L'ancienne version contenait des
  valeurs fausses : port de 3,99 € annoncé dans les dix pays, catégorie `1088` (inexistante
  dans la taxonomie Google), délais de préparation et de transport plus courts que les CGV,
  `age_group: all_ages` (valeur non reconnue), étiquette « Top Vente », couleur et matière
  non sourcées.

### Prérequis avant toute soumission : le port sur Stripe

Le port France est fixé à **2,99 € par commande** (décision du propriétaire du 13 octobre 2026),
soit 12,98 € pour une boîte. Le 13 octobre 2026, le Payment Link Stripe facturait encore
**3,99 €**. Merchant Center compare le flux à la page de paiement : tant que Stripe facture
3,99 €, la fiche sera refusée pour prix de livraison incorrect.

1. Dans Stripe, changer le tarif de livraison France du Payment Link à 2,99 €.
2. Ouvrir la vraie page de paiement (sans payer) et vérifier : 9,99 € + 2,99 € = 12,98 € pour
   une boîte, port inchangé pour plusieurs boîtes (`docs/VENTES-PASSES.md`, étape 2).
3. Seulement ensuite, soumettre le flux.

### Contenu du flux

| Attribut | Valeur | Source |
|---|---|---|
| `id` | `KYRAN-01` | SKU du JSON-LD |
| `title`, `description` | Texte factuel, sans superlatif ni mention de livraison | règles du jeu, CGV art. 2 |
| `link` | `https://kyran-jeu.fr/` | l'accueil affiche le prix, le port, le stock et le bouton d'achat |
| `image_link` | `boite-recto-kyran.jpg` (1048 × 1500) | boîte seule, sans texte ajouté |
| `additional_image_link` | `kyran-cartes-table.jpg`, `jeu-kyran-ami.webp` | `kyran-cartes-pouvoirs.jpg` est exclue (texte promotionnel incrusté) |
| `availability` | `in_stock` | « En stock » sur l'accueil |
| `price` | `9.99 EUR` | `commander.html`, CGV art. 3 |
| `brand` | `KYRAN` | |
| `gtin` | `3770040368015` | `mentions-legales.html` (« Code-barres officiel (GS1) »), CGV art. 2 ; clé EAN-13 valide |
| `condition` | `new` | |
| `google_product_category` | `1247` (Jeux et jouets > Jeux > Jeux de cartes) | taxonomie Google fr-FR |
| `product_weight`, `product_length/width/height` | 175 g ; 11,5 × 8,5 × 2,8 cm | CGV art. 2 |
| `min/max_handling_time` | 1 à 2 jours ouvrés | CGV art. 5 (« 24 à 48 heures ouvrées ») |
| `shipping` | France : 2,99 EUR par commande, 2 à 4 jours ouvrés | décision du 2026-10-13, CGV art. 3 et 5 |
| `product_detail` | joueurs, durée, âge, langue, contenu, auteur, illustrateur | |

Le port des autres pays (BE, LU, CH, MC : seuls pays acceptés par la page Stripe le 13 octobre 2026) n'est **pas** dans le flux : il est
calculé par Stripe au paiement et le site n'en donne pas le montant. Un prix inventé ferait
refuser la fiche (écart entre le flux et la page de paiement).

Points à vérifier par le propriétaire :

- **GTIN** : comparer `3770040368015` au code-barres imprimé sur la boîte (c'est le code des
  mentions légales et des CGV ; `NETLINKING_ANNUAIRES.md` a été aligné dessus le 2026-10-13). Si la boîte n'a pas de code-barres GS1, retirer `gtin` du générateur et
  y écrire `identifier_exists` à `no` à la place.
- **Prix** : tant que le prix ou le port changent sur Stripe, le flux doit être mis à jour le
  même jour.

## 2. Soumettre le flux

1. Ouvrir https://merchants.google.com avec le compte Google qui gère la Search Console de
   kyran-jeu.fr. Créer le compte marchand : pays France, nom de la boutique « KYRAN ».
2. **Site web** (Paramètres > Informations sur l'entreprise > Site web) : saisir
   `https://kyran-jeu.fr`, puis **valider et revendiquer** le domaine. Le plus simple : passer
   par la Search Console, où le domaine est déjà validé. Sinon, la balise méta se pose dans
   `seo-config.js` (`googleSiteVerification`), puis `npm run build`.
3. **Produits > Sources de données > Ajouter une source > Fichier** : choisir « Extraire un
   fichier depuis une URL » (*Scheduled fetch*), URL
   `https://kyran-jeu.fr/google-merchant-feed.xml`, fréquence quotidienne, langue français,
   pays de vente France.
4. Lancer une première extraction, puis lire l'onglet **Diagnostic**. Corriger chaque alerte dans
   `scripts/lib/product.mjs`, jamais dans le XML.
5. Activer les **fiches gratuites** (programme « Surfaces Google ») ; les annonces payantes ne
   sont pas nécessaires.

## 3. À remplir dans le compte (le flux ne peut pas le faire)

- **Livraison** (Paramètres > Expédition et retours > Livraison) :
  - France : 2,99 € par commande (une fois Stripe aligné), préparation 1 à 2 jours ouvrés, transit 2 à 4 jours ouvrés,
    jours ouvrés du lundi au vendredi, heure limite de commande à choisir.
  - Autres pays desservis : créer un service par pays **seulement** avec le tarif réellement
    facturé par Stripe (à relever sur la page de paiement avec une adresse du pays, sans payer).
    Transit 3 à 6 jours ouvrés (CGV art. 5). Pour la Suisse (hors zone
    euro), vérifier dans Merchant Center les conditions de devise avant d'activer ce pays.
- **Retours** (Paramètres > Expédition et retours > Retours), d'après CGV art. 6 :
  - délai : 14 jours après la réception ;
  - frais de retour : **gratuits** (pris en charge par le vendeur) ;
  - méthode : par courrier, après contact à contact@kyran-jeu.fr ;
  - remboursement intégral, frais d'expédition initiaux compris, sous 14 jours ;
  - état : article complet, en état d'origine ;
  - lien de la politique : `https://kyran-jeu.fr/cgv.html#art6`.
- **Coordonnées et informations légales** : adresse et téléphone de l'entreprise (identiques à
  `mentions-legales.html`), adresse de service client `contact@kyran-jeu.fr`.
- **TVA** : aucun réglage pour la France (prix TTC, TVA non applicable, art. 293 B du CGI).

## 4. Avis et notes

La note Amazon (4,7 / 5 sur 33 évaluations, relevé du 13 octobre 2026) ne doit pas être
envoyée à Google comme donnée structurée du site : les consignes « Review snippet » de Google
disent « Don't aggregate reviews or ratings from other websites ». Elle peut rester affichée en
texte, avec sa source et sa date. Merchant Center ne prend pas non plus de note dans le flux
produit : les notes produit passent par un programme séparé (*Product Ratings*), avec ses
propres conditions d'accès.

## 5. Après la mise en ligne

- Vérifier dans Merchant Center que la fiche est « Approuvée » pour la France.
- Renouveler `priceValidUntil` (2026-12-31) dans le JSON-LD des pages avant cette date.
- Ajouter la date de première soumission à `_notes/memoire.md` § 2.
