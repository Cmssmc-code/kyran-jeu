# Passes « ventes » hebdomadaires

Une passe par semaine, le mercredi (le mardi jusqu'au 2026-10-30). Depuis le regroupement des routines du
2026-10-30, c'est la routine du blog (« Blog KYRAN passes lun/mer/ven ») qui la fait : le mercredi,
`docs/BLOG-PASSES.md` l'envoie ici. Elle tourne dans une session qui a ce dépôt attaché (voir `_notes/memoire.md` § 14). La passe relit ce fichier sur
`origin/main` à chaque fois. Elle vise **une** amélioration mesurable des ventes, ou rien si rien ne
tient. Comme pour le blog, elle ouvre sa PR et la fusionne elle-même si la CI est verte, sans conflit
ni commentaire ouvert (`CLAUDE.md`).

Point de départ : [`docs/rapports/audit-ventes-2026-10-27.md`](rapports/audit-ventes-2026-10-27.md)
(diagnostic et plan les plus récents ; premier audit : [`audit-ventes-2026-10-12.md`](rapports/audit-ventes-2026-10-12.md)) et [`docs/VENTES-KIT.md`](VENTES-KIT.md) (textes de démarchage).

## Protocole

1. **S'orienter** : lire `CLAUDE.md`, `_notes/lecon.md`, l'audit, le journal ci-dessous et les PR
   ouvertes. Faire `git fetch origin main` avant d'écrire, puis à nouveau avant de pousser.
2. **Contrôle de cohérence du paiement** (à faire à chaque passe) : ouvrir en lecture le Payment
   Link Stripe (`https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00`) avec Playwright
   (`executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`), choisir l'euro, puis
   relever le prix, le port, les pays de livraison et la description. **Ne jamais remplir le
   formulaire ni payer.** Si un chiffre diffère de ce qu'affiche le site (`commander.html`, FAQ,
   JSON-LD, flux Google Merchant), le site s'aligne sur ce que Stripe facture réellement, et l'écart
   est noté dans le journal pour le propriétaire.
3. **Mesurer** avec le serveur MCP `gsc` (`sc-domain:kyran-jeu.fr`), sur les 28 derniers jours :
   - clics et impressions des pages `/`, `/commander.html` et `/blog/cadeau-*` ;
   - requêtes à intention d'achat (`kyran`, `acheter`, `cadeau`, `prix`, `noël`, `moins de`) ;
   - comparaison avec la ligne précédente du journal.
4. **Choisir une seule action**, la plus rentable du moment. Par ordre de préférence :
   - un écart de prix ou de faits sur une page de vente ;
   - un frein de conversion visible sur mobile (captures 390 × 844 de l'accueil et de la commande) ;
   - un texte de vente plus concret (accroche, preuve sociale, angle cadeau selon la saison) ;
   - une page ou une section qui répond à une requête d'achat repérée à l'étape 3 ;
   - la mise à jour d'un message saisonnier (Noël, fête des pères, vacances).
5. **Règles** :
   - Faits KYRAN : uniquement `_notes/memoire.md` § 1. Jamais « 55 cartes », « sans élimination » ni
     « sans hasard ».
   - Pas de faux prix barré ni de faux compte à rebours. Pas d'avis inventé. Pas de promesse de
     délai que l'expédition (24-48 h + 2 à 4 jours ouvrés) ne tient pas.
   - Ne pas changer un prix, une offre ou un pays de livraison : ce sont des décisions du
     propriétaire, à proposer dans le journal.
   - Ne pas envoyer d'email, de message ni de publication à des tiers.
6. **Contrôler** : `npm run build`, `npm test`, puis captures mobiles avant et après le changement.
7. **PR** : constat chiffré, changement, captures, et une ligne au journal ci-dessous. Fusion aux
   conditions de `CLAUDE.md`.

## Journal

| Date | Mesure (28 j) | Action | PR |
|---|---|---|---|
| 2026-10-12 | Google ≈ 3 clics/jour ; accueil 13 clics en 3 mois ; `/commander.html` 0 clic organique | Audit complet ; port aligné sur Stripe (3,99 €) ; quantité Stripe ; fin du prix barré ; accueil mobile ; message de Noël automatique | #46 |
| 2026-10-13 | 15 sept. → 12 oct. : ≈ 74 clics (2,6/jour). `/tarot-africain.html` 1re page (14 clics, 1 387 impr., pos. 7,6) ; `/` 4 clics, 133 impr. ; `/commander.html` 0 clic, 14 impr. ; `cadeau-noel` 1 clic, 4 impr. ; `cadeau-anniversaire` 0, 15 impr. ; « kyran » 3 clics, 57 impr., pos. 1,7. Stripe (lecture) : 9,99 € + 3,99 € = 13,98 €, conforme au site ; pays BE, FR, LU, MC, CH seulement (le site promet aussi DE, IT, ES, AD, UK) ; description « 55 cartes » toujours fausse | Encart KYRAN tôt dans `/tarot-africain.html` (pas de tarot ou six joueurs) au lieu du seul encart de fin de page ; page d'origine transmise à Stripe : `/commander.html?ref=…` → `client_reference_id` (à lire sur chaque paiement du tableau de bord Stripe : `tarot-africain-materiel`, `tarot-africain-kyran`) | #49 |
| 2026-10-20 | 22 sept. → 19 oct. : 113 clics (4/jour, contre 74), 5 240 impr. `/tarot-africain.html` 21 clics, 1 676 impr. (pos. 7,3) ; `/` 10 clics, 197 impr. ; `/commander.html` 0 clic, 32 impr. ; `cadeau-noel` 2 clics, 11 impr. (pos. 17,7) ; `cadeau-anniversaire` 0, 10 impr. ; « kyran » 7 clics, 63 impr. (pos. 2,8) ; aucune autre requête d'achat. Stripe (lecture) : 9,99 € + 2,99 € = 12,98 €, pays FR BE LU MC CH, description juste (45 cartes de jeu, 30 cartes Vie, 7 cartes de règles) : **conforme au site**. Mesure de #49 cassée : les deux `?ref=` de `/tarot-africain.html` perdus lors du rétablissement de l'encart (19/10) | Attribution réparée et étendue : `?ref=` rétablis sur `/tarot-africain.html` ; tous les liens d'achat des articles du blog (première source de trafic) portent `ref=blog-<article>-<debut\|fin\|cote\|fiche>` ; test `scripts/test/ventes-ref.test.mjs` pour ne plus les perdre | #82 |
| 2026-10-27 | 29 sept. → 26 oct. : 140 clics (5/jour, contre 113), 6 728 impr. `/tarot-africain.html` 30 clics, 2 305 impr. (pos. 7,0) ; `/` 12 clics, 232 impr. ; `/commander.html` 0 clic, 39 impr. ; `cadeau-noel` 2 clics, 18 impr. (pos. 14,4) ; `cadeau-anniversaire` 0, 9 impr. ; « kyran » 8 clics, 65 impr. (pos. 2,3) ; aucune autre requête d'achat. Stripe (lecture) : 9,99 € + 2,99 € = 12,98 €, pays FR BE LU MC CH, description juste : conforme au site. Mobile : aucun frein | `/idee-cadeau.html` (page de vente de Noël) : la règle « 6 jours ouvrés » devient une date concrète, « commandez avant le 16 décembre » et les dates de livraison du jour ; calcul partagé avec `/commander.html` dans `js/livraison.js` (testé) ; boutons d'achat avec `ref=idee-cadeau-haut` / `-bas` | #134 |

## En attente du propriétaire

Ces actions sont reprises de l'audit, § 7. Cocher une action quand elle est faite.

- [x] Stripe : description du produit, port (2,99 €) et pays de livraison alignés avec le site (vérifié le 2026-10-20).
- [ ] Amazon : prix entre 12,90 et 14,90 €, titre et puces du kit, nom du vendeur.
- [ ] Service presse : 20 à 30 boîtes envoyées avant le 31 octobre.
- [ ] Marchés de Noël et salons réservés pour la période du 20 novembre au 20 décembre.
- [ ] Boutiques et bars à jeux démarchés.
- [ ] CSE démarchés.
- [x] Fiche BoardGameGeek créée (https://boardgamegeek.com/boardgame/480678/kyran) ; reste à la faire vivre (notes, photos, parties).
- [ ] Fiches Tric Trac et Okkazeo ; Philibert Marketplace.
- [ ] Secret Instagram rétabli.
- [ ] Google Merchant Center associé, flux soumis.
