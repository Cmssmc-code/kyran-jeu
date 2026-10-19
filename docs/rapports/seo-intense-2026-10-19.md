# Audit SEO intense de kyran-jeu.fr — 19 octobre 2026

Chantier mené en session cloud (sans navigateur : pas d'action dans l'interface Search Console). Sources : API Search
Console (performances au 17/10, inspection de 74 URL), API Bing Webmaster, crawl du site en ligne, Lighthouse 12.8.2 local
(mobile, médiane de 3), dépôt. Dix angles d'audit (A crawl, B performance, C données structurées, D indexation, E Bing /
IndexNow / IA, F contenu, G boutique, H confiance et conformité, I infra, J autorité), chacun vérifié par un relecteur
contradictoire. Rapport détaillé et suivi : Google Doc « Audit et plan SEO de kyran-jeu.fr (19 octobre 2026) ». Les actions
non faites sont reprises dans `_notes/seo/backlog.md`.

## 1. Base de référence

| Indicateur | Valeur | Source |
|---|---|---|
| Google 28 j (20/09 → 17/10) | 118 clics, 5 492 impressions, CTR 2,15 %, position 9,4 | GSC |
| Google 28 j précédents | 51 clics, 3 705 impressions, CTR 1,38 %, position 9,8 | GSC |
| Google 90 j | 307 clics, 17 083 impressions, CTR 1,80 %, position 8,7 | GSC |
| Marque « kyran » 28 j | 69 impressions, 8 clics, position 2,7 | GSC |
| Indexation (sitemap) | 44 / 50 ; 4 « détectées, non indexées » (/blog/, a-propos, communaute, video-regles), 2 « explorées, non indexées » | Inspection d'URL |
| Anciennes URL meta refresh encore indexées | 10 | Inspection d'URL |
| Résultats enrichis | Fils d'Ariane 53 URL ; produits et fiche marchand : accueil (version du 07/10) et commander ; vidéos 0 ; FAQ 0 | Inspection d'URL |
| Bing 28 j | 17 clics, 425 impressions ; 56 pages en index ; 0 lien entrant | API Bing |
| Lighthouse mobile | accueil 98 (LCP 2,3 s), commander 99, règle 99, Skyjo 97 (LCP 2,6 s), Tarot 99 | Lighthouse local |

Mesure à refaire à J+28 (16/11/2026) : mêmes requêtes, mêmes pages, même méthode.

## 2. Corrigé (PR #78)

- **B-1** Accueil : l'élément LCP est le motif décoratif /img/motif-wax.svg (fond CSS), découvert tard et non préchargé ; c'est la boîte qui est préchargée
- **C-3** Entité KYRAN : Wikidata Q141623753 absent ; sameAs qui mélangent fiches marchandes, réseaux et vidéos
- **F-1** Tarot Africain (1re page du site) : l'encart KYRAN du 13/10 (#49) a été perdu dans la fusion 49ab825 ; plus aucun lien vers /commander.html avant 91 % de la page
- **E-3** IndexNow envoie des pages noindex (plan du site, CGV, mentions, confidentialité, page imprimable)
- **E-4** llms-full.txt affirme que KYRAN « se termine par la manche Mystique » ; les effets des cartes Pouvoir manquent dans llms.txt et llms-full.txt
- **E-5** Nombre de cartes Pouvoir incohérent dans les passages les plus citables (« quatre cartes Pouvoir » sur / et /faq.html ; intertitre « Finale » sur /regle.html)
- **E-9** Wikidata Q141623753 absent de llms.txt ; l'entité n'a aucune référence ni identifiant BGG (confirme et précise backlog l. 12)
- **G-3** Accueil : « vous économisez 4 € » a été calculé avec l'ancien port de 3,99 € ; l'écart réel est de 5,01 €
- **H-6** CGV art. 9 : le lien vers la plateforme ODR est mort (fermée le 20/07/2025) et l'adresse du médiateur CM2C est périmée
- **I-2** pages.yml publie _notes/seo/*.json et *.csv : les KPI internes Search Console et Bing sont en ligne et indexables

## 3. Constats retenus (101, triés par priorité)

| Id | Prio | Lot | Type | Constat |
|---|---|---|---|---|
| D-1 | P1 | hors-code | chrome | 8 articles et 2 pages de vente jugés par Google sur une version périmée : 2 articles hors index, les autres indexés avec leur ancien contenu |
| D-5 | P1 | hors-code | chrome | Bing ne connaît pas 5 pages créées en octobre (idee-cadeau, video-regles, ressources-gratuites, regles-rikiki, skull-king) |
| E-1 | P1 | hors-code | chrome | Bing ne connaît pas 9 URL du sitemap et n'a rien stocké pour 6 autres, malgré IndexNow (HTTP 200) et le sitemap ; /tarot-africain.html pas réexplorée depuis le 06/10 |
| G-1 | P1 | hors-code | decision | Merchant Center toujours pas branché : aucune fiche gratuite, alors que le flux est prêt et que le prérequis Stripe est rempli |
| A-3 | P2 | contenu-maillage | code | Guides Dixit et Codenames (24 des 118 clics) liés par 3 pages seulement ; 4 autres guides par 2 |
| B-1 | P2 | performance | code (fait) | Accueil : l'élément LCP est le motif décoratif /img/motif-wax.svg (fond CSS), découvert tard et non préchargé ; c'est la boîte qui est préchargée |
| B-2 | P2 | performance | code | Articles : image du hero (élément LCP) servie en pleine taille, sans srcset (144 à 196 Ko sur 14 articles) ; 4 WebP plus lourds que leur JPEG |
| C-1 | P2 | donnees-structurees | code | priceValidUntil 2026-12-31 expire dans 73 jours ; avec validFrom, Google lit 9,99 € comme un prix promotionnel |
| C-3 | P2 | donnees-structurees | code (fait) | Entité KYRAN : Wikidata Q141623753 absent ; sameAs qui mélangent fiches marchandes, réseaux et vidéos |
| C-5 | P2 | donnees-structurees | code | Images d'Article : logo.png sur les pages Tarot et Whist, bannière de marque sur 4 articles qui parlent d'autres jeux |
| D-2 | P2 | outillage | code | La règle des 28 jours et les mesures de titres partent du commit, alors que Google n'a pas vu 23 des titres actuels |
| D-3 | P2 | hors-code | chrome | /video-regles.html, seule page de lecture vidéo, n'a jamais été explorée en 15 jours alors qu'elle est conforme |
| D-4 | P2 | contenu-maillage | code | /idee-cadeau.html, page de vente de Noël, ne reçoit aucun lien en contexte (ni article cadeau, ni accueil, ni commander) |
| D-10 | P2 | hors-code | chrome | /a-propos.html (page auteur) et /communaute.html jamais explorées, malgré le maillage |
| E-2 | P2 | outillage | code | IndexNow ne suit pas la publication réelle : ping avant le déploiement, rien après une relance manuelle de pages.yml, pas de rattrapage après échec |
| F-1 | P2 | contenu-maillage | code (fait) | Tarot Africain (1re page du site) : l'encart KYRAN du 13/10 (#49) a été perdu dans la fusion 49ab825 ; plus aucun lien vers /commander.html avant 91 % de la page |
| F-4 | P2 | contenu-maillage | code | Codenames : 1,8 % de CTR en position 6, contre 4,3-5,3 % pour Dixit et 6 joueurs ; 0 clic sur les requêtes « coopératif comme codenames » |
| G-2 | P2 | commander-confiance | code | docs/MERCHANT.md et product.mjs disent encore « Stripe facture 3,99 € » et « link = accueil » : la doc bloque G-1 sans raison |
| I-1 | P2 | hors-code | decision | Domaine personnalisé non vérifié sur GitHub : kyran-jeu.fr peut être pris par un tiers si Pages est dépublié |
| J-1 | P2 | hors-code | chrome | BoardGameGeek 480678 : champ Website vide, description fausse (manche Mystique « finale », « Four Power cards »), aucune catégorie, mécanique Trick-taking absente, 0 vidéo |
| J-2 | P2 | hors-code | chrome | Tric Trac : la fiche jeu existe (MAJ 18/10) mais « Ressources externes » est vide : aucun lien vers kyran-jeu.fr |
| J-3 | P2 | hors-code | chrome | Lokidia Games publie une fiche Kyran aux faits inventés (2 à 4 joueurs, 10 ans, 30-60 min) avec FAQ en JSON-LD, 3e résultat de « kyran jeu » |
| J-4 | P2 | hors-code | chrome | Wikidata Q141623753 : aucun identifiant externe (BGG, Tric Trac, Myludo), aucune référence ; le jeu n'est pas reconnu par WebSearch |
| J-7 | P2 | hors-code | chrome | BoardGamesFlix : auteur et illustratrice « (Non crédité) », aucun lien vers le site |
| A-1 | P3 | hors-code | chrome | /blog/ non indexé : Google garde l'ancien /blog/index.html (exploré le 24/09, canonique de l'époque) |
| A-2 | P3 | hors-code | chrome | 10 anciennes URL en meta refresh toujours indexées : 18 clics et 363 impressions sur 28 j (15 % des clics) |
| A-4 | P3 | indexabilite | code | Le flux RSS soumis comme sitemap donne une date de modification différente du sitemap pour 30 articles sur 33 |
| A-5 | P3 | indexabilite | code | Une retouche technique (CSS, defer) redate dans le sitemap les pages écrites à la main |
| A-6 | P3 | donnees-structurees | code | Dates contradictoires (visible, dateModified, lastmod) sur l'article science, /tarot-africain.html et /a-propos.html |
| A-7 | P3 | contenu-maillage | code | Images de partage : logo carré transparent sur 7 pages dont règles et Tarot, PNG de 1,96 Mo sur /commander.html |
| A-8 | P3 | contenu-maillage | code | Saut de niveau h2 → h4 sur /dossier-presse.html |
| A-9 | P3 | hors-code | decision | Le PDF de la règle du Tarot Africain est inconnu de Google : l'ajouter au sitemap ? |
| B-3 | P3 | performance | code | /commander.html : boite-recto-kyran.png (1,96 Mo) reste l'og:image, la twitter:image et la 1re image du Product JSON-LD, alors que le flux Merchant utilise le JPG de 198 Ko |
| B-4 | P3 | performance | code | logo.png (86 Ko) chargé comme filigrane CSS sur 16 des 50 pages du sitemap (dont /regle, /tarot-africain, /blog/) |
| B-5 | P3 | performance | code | Accueil et /idee-cadeau.html : cartes du hero en 300 px affichées à 67 px, sizes de la boîte faux (190 px déclarés, 117 px réels, d'où 144 Ko à DPR 3) ; autres images surdimensionnées (regle l.317, a-propos l.279) |
| B-6 | P3 | performance | code | /commander.html : image de la lightbox fermée chargée d'emblée (144 Ko), deux <video preload=metadata> ; incidents Auto-Heal JS-894824 et JS-0643A9 ouverts sur teaser-kyran.mp4 |
| B-7 | P3 | performance | code | Animation kmRise partant de opacity 0 sur le h1 et le chapeau de l'accueil : retarderait le LCP d'environ 1 s si le motif cessait d'être l'élément LCP ; le « animation: none » écrit pour ces éléments est annulé |
| B-8 | P3 | performance | decision | Accueil : animations infinies non composées (box-shadow, background-size, flottement), avec un fil principal à 10,5-12,1 s contre 1,7-2,3 s en mouvement réduit (TBT réel 382-619 ms) |
| B-9 | P3 | performance | decision | CSS bloquant commun style.css de 117 Ko (25,9 Ko gzip), non minifié, utilisé à 30-49 % par page |
| B-10 | P3 | hors-code | decision | Décision : CDN (Cloudflare) devant GitHub Pages ; gain de performance mesuré faible (Brotli −8 à −17 % de texte, −130 à −160 ms sur les visites de retour) |
| B-11 | P3 | outillage | code | Relevé Lighthouse de la routine : ne couvre pas les pages au-dessus de 2,5 s (articles), une seule passe, envoie des rapports d'erreurs à l'Auto-Heal |
| C-2 | P3 | donnees-structurees | code | HowTo sur /regle.html et /tarot-africain.html : retiré par Google, invisible sur la page, faux sur la manche Mystique |
| C-4 | P3 | donnees-structurees | code | 31 articles déclarent un « Game KYRAN » anonyme (sans @id), coupé de l'entité #game |
| C-6 | P3 | donnees-structurees | decision | Dates de publication inventées sur 23 articles (créés le 31/05, datés du 01/05 au 30/06) |
| C-7 | P3 | donnees-structurees | code | /blog/ : les 33 BlogPosting imbriqués reçoivent tous le dateModified du hub (2026-10-19) |
| C-8 | P3 | donnees-structurees | code | VideoObject : contentUrl pointe vers la page YouTube et non vers un fichier vidéo |
| C-9 | P3 | donnees-structurees | code | Product : image PNG de 1,96 Mo, visuel avec texte promotionnel, catégorie différente du flux Merchant |
| C-10 | P3 | donnees-structurees | code | Accueil : l'extrait produit disparaîtra à la prochaine exploration, sans perte mesurable ; ne pas remettre de Product ; corriger mainEntity |
| C-11 | P3 | donnees-structurees | code | Organization.legalName « KYRAN » inexact (vendeur : Corentin Sence EI) ; WebSite sans alternateName |
| C-12 | P3 | outillage | code | Empreinte lastmod : la balise error-reporter.js n'est pas neutralisée ; l'article écrit à la main a lastmod 14/10 mais dateModified 16/09 |
| C-13 | P3 | hors-code | decision | Les étoiles d'avis disparaissent (conforme) : seule voie légitime, des avis d'acheteurs collectés par le site |
| D-6 | P3 | outillage | code | IndexNow annonce chaque page nouvelle 9 à 12 s avant sa mise en ligne (5 cas sur 5) |
| D-7 | P3 | hors-code | chrome | Hub du blog indexé sous /blog/index.html ; /blog/ jamais explorée, puis « inconnue » |
| D-8 | P3 | outillage | code | L'inspection nocturne ne couvre qu'un échantillon de 20 URL, avec des doublons, et rate les pages hors index |
| D-9 | P3 | hors-code | decision | Donner au compte de service le niveau « Complet » pour que la routine resoumette sitemap.xml et feed.xml par API |
| D-11 | P3 | hors-code | decision | 10 anciennes URL redirigées toujours indexées (12 chez Bing) : ne pas dépenser de quota, faire indexer d'abord les cibles |
| E-3 | P3 | outillage | code (fait) | IndexNow envoie des pages noindex (plan du site, CGV, mentions, confidentialité, page imprimable) |
| E-4 | P3 | indexabilite | code (fait) | llms-full.txt affirme que KYRAN « se termine par la manche Mystique » ; les effets des cartes Pouvoir manquent dans llms.txt et llms-full.txt |
| E-5 | P3 | contenu-maillage | code (fait) | Nombre de cartes Pouvoir incohérent dans les passages les plus citables (« quatre cartes Pouvoir » sur / et /faq.html ; intertitre « Finale » sur /regle.html) |
| E-6 | P3 | contenu-maillage | code | L'accueil ne donne sa définition factuelle qu'au mot ~2 163 sur 2 531 |
| E-7 | P3 | contenu-maillage | code | Tarot Africain : KYRAN nommé pour la première fois au mot ~1 941 sur 4 361 (confirme et mesure backlog l. 17) |
| E-8 | P3 | hors-code | chrome | KYRAN absent de l'index utilisé par la recherche web de Claude (Brave), même sur la marque ; la mesure GEO de la routine lira toujours 0 |
| E-9 | P3 | indexabilite | code (fait) | Wikidata Q141623753 absent de llms.txt ; l'entité n'a aucune référence ni identifiant BGG (confirme et précise backlog l. 12) |
| E-10 | P3 | hors-code | chrome | Flux RSS du blog non déclaré à Bing |
| F-2 | P3 | contenu-maillage | code | Règles : 95 % des impressions visibles viennent de gens qui cherchent un jeu, mais l'offre et le comparatif n'arrivent qu'à 91-94 % de la page |
| F-3 | P3 | outillage | code | Les seuils CTR des routines (« < 2 % en page 1 », « tarot africain < 1 % après le 01/11 ») sont sous la courbe du site à position égale : ils pousseraient une 4e réécriture inutile du title Tarot |
| F-5 | P3 | contenu-maillage | code | Passe blog du 02/11 : réécrire alternatives-uno (texte exact), mais pas jeux-cartes-4-joueurs ni jeux-cartes-adultes, que la règle « CTR < 2 % » désignerait aussi |
| F-6 | P3 | contenu-maillage | code | Cannibalisation faible (Google a choisi sa page, les paires se lient déjà), mais seo-keywords.json contredit Google sur 9 requêtes |
| F-7 | P3 | contenu-maillage | decision | Demande sans page dédiée : le Whist classique (19 requêtes) ne vit que par la redirection /whist-moderne.html ; trois sujets à ne pas créer pour éviter la cannibalisation |
| F-9 | P3 | contenu-maillage | code | 6 articles au « gabarit par défaut » : restructurer seulement famille, grands groupes et draft, pas Dixit, Codenames ni 6 qui prend, qui performent |
| F-10 | P3 | contenu-maillage | code | Hygiène du maillage : ancre « vidéo de règles » envoyée vers /regle.html, libellés périmés dans l'article « science », /ressources-gratuites.html liée une seule fois en contexte |
| G-3 | P3 | commander-confiance | code (fait) | Accueil : « vous économisez 4 € » a été calculé avec l'ancien port de 3,99 € ; l'écart réel est de 5,01 € |
| G-4 | P3 | commander-confiance | decision | Hors de France, Stripe facture le même port de 2,99 € et annonce « 2-4 jours ouvrables » ; le site, les CGV et llms.txt disent « calculé selon l'adresse » et « 3 à 6 jours ouvrés » |
| G-5 | P3 | commander-confiance | code | La page de paiement Stripe affiche son image produit depuis https://kyran-jeu.fr/boite-recto-kyran.png : garder ce fichier quand on allège l'og:image |
| G-6 | P3 | outillage | code | Aucun test ne relie l'Offer JSON-LD de /commander.html (écrite à la main) à product.mjs et au flux Merchant |
| G-7 | P3 | commander-confiance | decision | Ni avis recueillis sur le site, ni appel à noter KYRAN sur BoardGameGeek (fiche à 0 note) dans le parcours après achat |
| G-8 | P3 | donnees-structurees | code | #organization ne déclare ni politique de retour ni politique de livraison, que Google lit au niveau de l'organisation pour le panneau marchand |
| G-9 | P3 | donnees-structurees | decision | Identité marchande : l'adresse et le téléphone, publics dans les mentions légales, manquent au JSON-LD ; le vendeur de l'Offer est une Person non reliée |
| H-1 | P3 | commander-confiance | decision | Instagram pose le cookie de traçage `mid` (13 mois) sur /communaute.html sans clic ni consentement |
| H-2 | P3 | commander-confiance | code | Identité légale incohérente : JSON-LD legalName « KYRAN », et la dénomination « Corentin Sence EI » n'apparaît nulle part |
| H-3 | P3 | commander-confiance | decision | Pas de fonction de rétractation en ligne, obligatoire depuis le 19/06/2026, et e-mail de confirmation sans les informations exigées par L. 221-13 |
| H-4 | P3 | commander-confiance | decision | La fiche /commander.html n'a pas de bloc « sécurité du produit » (RSGP art. 19) : pas d'adresse postale du fabricant ni d'avertissements ; preuves CE et EN 71 à confirmer |
| H-6 | P3 | commander-confiance | code (fait) | CGV art. 9 : le lien vers la plateforme ODR est mort (fermée le 20/07/2025) et l'adresse du médiateur CM2C est périmée |
| H-7 | P3 | hors-code | decision | Adhésion réelle au médiateur CM2C non vérifiable : désigner un médiateur sans convention est trompeur |
| H-8 | P3 | commander-confiance | code | CGV art. 7 : l'encadré obligatoire sur les garanties légales (D. 211-2) manque, et L. 217-3 y est faussement cité |
| H-9 | P3 | commander-confiance | code | La condition « jeu renvoyé en état d'origine, boîte non écornée, revendable neuf » est plus stricte que L. 221-23 |
| H-10 | P3 | commander-confiance | code | REP jouets : l'identifiant unique légal FR464679_12GNOH n'est pas affiché (le site montre 0136013) |
| H-11 | P3 | commander-confiance | code | Politique de confidentialité inexacte ou incomplète : journal d'erreurs et Anthropic non déclarés, OVH absent, Google Fonts périmé, YouTube incomplet, droit d'opposition manquant |
| H-12 | P3 | commander-confiance | code | CGV datées du « 2 septembre 2026 » malgré trois modifications de fond (02/10 et deux le 13/10) |
| H-13 | P3 | hors-code | chrome | Port vers BE, LU, MC et CH : montant inconnu du site, du JSON-LD et du flux Merchant |
| I-2 | P3 | outillage | code (fait) | pages.yml publie _notes/seo/*.json et *.csv : les KPI internes Search Console et Bing sont en ligne et indexables |
| I-3 | P3 | outillage | code | Chaque push redéploie tout le site, même sans fichier public : Last-Modified et ETag de toutes les pages changent et le cache CDN est vidé |
| I-4 | P3 | outillage | code | pages.yml termine en vert sans publier si l'API GitHub Pages ne répond pas |
| I-5 | P3 | outillage | code | Les publications relancées par GITHUB_TOKEN (Auto-Heal, avis Amazon) n'avertissent pas IndexNow |
| I-6 | P3 | hors-code | decision | « Vraies 301 » (question ouverte depuis le 08/10) : Google traite déjà les meta refresh comme des redirections, Cloudflare n'est pas justifié |
| J-5 | P3 | outillage | code | Notes du dépôt fausses sur la présence externe, dont un genre Wikidata qui est une plante (Q1361226) |
| J-6 | P3 | hors-code | chrome | Ludovox : le Ludochrono (31/01/2026) ne renvoie toujours pas au site, pas de fiche jeu |
| J-9 | P3 | hors-code | chrome | Okkazeo 94411 et Myludo 95533 : fiches existantes (Okkazeo a déjà un lien suivi vers le site) mais données à corriger |
| J-10 | P3 | hors-code | chrome | Chaîne YouTube @Kyran-jeu sans description ni lien ; vidéo du Pirate Ludique sans lien vers le site |
| J-11 | P3 | donnees-structurees | code | sameAs : fiche Tric Trac et pages d'auteur vérifiées (BGG designer 177920, artist 177921) non citées, au-delà de C-3 |
| J-12 | P3 | contenu-maillage | code | Espace presse sans visuels téléchargeables ni fiches de référence (BGG, Tric Trac, Wikidata) |

## 4. Écartés après vérification

- J-8 (refute) : Faits relus : index.html l. 596 (widget SSR) et reviews-data.json l. 25 affichent bien l'avis Vine de « Pauline » : « imaginé en Guadeloupe et fabriqué en Chine ». index.html l. 709 dit « créé et édité en France ». Le co…
- J-13 (deja-fait) : Le constat et l'action sont déjà dans _notes/seo/backlog.md l. 31 : « PR publiques visibles sur la marque \| Titres « audit SEO/GEO » dans la SERP de « KYRAN » \| Titres de PR neutres ; le dépôt reste public (Pages) \| Tout…
- C-14 (refute) : La doc ProfilePage (gdocs/profile-page.txt l.193-202) pose la condition : « The primary focus of the page must be a single person or organization ». Elle range parmi les cas non valides « The main home page of a store (u…
- F-8 (deja-fait) : Les faits sont exacts. `grep -l authorNote scripts/content/blog/*.mjs` = 0 ; `grep -l 'photos:'` = 0 ; blog/images/parties n'existe pas. a-propos.html l. 257 : avatar texte « CS » ; Person #corentin-sence sans image ni s…
- H-5 (refute) : Le constat repose sur une lecture erronée de la décision. docs/SEO-GEO.md:116 (§ 8, 02/10) : « Kbis : Cohérent avec les mentions légales (SIREN…). Activité commencée le 10/09/2025 : ajoutée dans llms.txt et au JSON-LD (f…

## 5. Non mené (quota épuisé), à reprendre

- K1 : chute du blog depuis le 22/08 (mise à jour anti-spam du 18-21/08) : requêtes communes, dates, hypothèse « contenu à grande échelle ».
- K2 : demande de recherche (Bing GetKeywordStats, suggestions Google), calendrier de Noël des pages cadeau.
- K3 : Tarot Africain face aux pages concurrentes de la SERP.
