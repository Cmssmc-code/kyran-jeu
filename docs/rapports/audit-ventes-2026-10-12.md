# Audit commercial KYRAN — 12 octobre 2026

Pourquoi KYRAN se vend peu, et ce qu'on peut y faire. Sources : Google Search Console et Bing
Webmaster (serveurs MCP), page de paiement Stripe ouverte en lecture (sans achat), captures du site
en mobile et ordinateur, fiche Amazon, YouTube, Ludovox, Philibert, et une étude de marché web
(concurrents, canaux, influenceurs). Le nombre de ventes n'a pas pu être lu : le compte Stripe
accessible est celui de Majordia, et les alertes de vente KYRAN ne sont pas dans la boîte consultée.

## 1. Le diagnostic en une phrase

**Le problème principal n'est pas le site, c'est que personne ne rencontre le jeu.** Le site reçoit
environ 3 visites par jour depuis Google, presque toutes sur des articles « jeux comme Skyjo /
Codenames / Dixit » dont les lecteurs ne cherchent pas KYRAN. Aucun média, aucune boutique, aucun
salon ne le montre ; la fiche BoardGameGeek, toute récente, n'a encore ni note ni partie enregistrée. Un jeu de cartes inconnu à 10 € se vend quand on y a joué ou vu jouer : c'est là
que l'effort doit aller.

## 2. Les chiffres

| Indicateur | Valeur | Lecture |
|---|---|---|
| Clics Google, 1er juillet → 11 octobre | ≈ 300 (≈ 3 par jour) | Très faible pour vendre |
| Clics sur la page d'accueil depuis Google | 13 en 3 mois | Le jeu n'est presque jamais cherché |
| Clics sur `/commander.html` depuis Google | 0 | Aucune requête d'achat |
| Requête « kyran » | 7 clics, 271 impressions, position 5,8 | Le nom n'est pas une marque connue ; « Kyran » est aussi un personnage de jeu vidéo |
| Pages qui amènent le plus de trafic | `jeux-comme-skyjo` (83), `jeux-comme-codenames` (48), `jeux-comme-dixit` (35), `tarot-africain` (30) | Trafic d'information, intention d'achat faible |
| Liens entrants (Google et Bing) | 0 | Aucun site ne parle du jeu |
| Avis Amazon | 33, note 4,7/5, une partie via Vine | Seule preuve sociale réelle |
| Ludochrono (Ludovox) | ≈ 1 900 vues | Bonne vidéo, peu exploitée |
| Chaîne YouTube | 1 vidéo, ≈ 100 vues | Inactive |
| BoardGameGeek | Fiche récente ([480678](https://boardgamegeek.com/boardgame/480678/kyran)), pas encore indexée par Google, sans note ni partie enregistrée | À faire vivre (notes, photos, parties) |
| Philibert, Tric Trac | Absent | Un acheteur français qui vérifie ne trouve rien |
| Page Communauté | 0 publication Instagram synchronisée | Le secret Instagram semble absent : le workflow passe au vert sans rien faire |

## 3. Les causes, par ordre d'importance

1. **Notoriété nulle.** Aucun prescripteur tiers (média, influenceur, boutique, ludothèque). Le blog
   attire des lecteurs de Skyjo ou de Codenames, pas des acheteurs de KYRAN.
2. **Aucun canal physique.** Un jeu à 10 € s'achète par impulsion à une table de démonstration, en
   boutique ou sur un marché de Noël. KYRAN n'est présent nulle part.
3. **Une niche saturée et un message générique.** « Jeu de plis, de bluff et de paris » décrit
   aussi Skull King, Wizard ou le Tarot Africain, qui est gratuit. Les jeux qui gagnent (Flip 7,
   Skyjo, Trio) tiennent en une promesse de cinq mots. Le moment le plus mémorable de KYRAN, la
   dernière manche jouée la carte sur le front, n'était pas mis en avant.
4. **Des incohérences de prix qui coûtent des ventes** (corrigées le 12 octobre pour le site) :
   - la page Stripe facture **3,99 €** de port alors que le site annonçait 2,99 € : le client voyait
     le total monter au moment de payer, le pire moment pour une surprise ;
   - la quantité choisie sur le site n'était pas transmise à Stripe (`?quantity=` est ignoré) ;
   - « 17,99 € » barré et « au lieu de 17,99 € » évoquaient une réduction alors que la boutique n'a
     jamais vendu à ce prix, ce qui expose à la règle du prix de référence
     (art. L112-1-1 du code de la consommation) ; l'économie affichée (8 €) oubliait le port.
5. **Amazon trop cher face aux leaders.** À 17,99 €, KYRAN y coûte plus que Flip 7, Skyjo ou Trio
   (13 à 15 €) sans leur notoriété. La fiche affiche des jeux concurrents en carrousel.
6. **Des fiches à corriger chez Stripe** : la description du produit sur la page de paiement dit
   encore « 55 cartes vernies, livret de règles officielles », deux affirmations fausses (45 cartes de
   jeu + 30 cartes Vie, règles sur 7 cartes). Stripe ne livre que la France, la Belgique, le
   Luxembourg, Monaco et la Suisse, alors que le site et les CGV promettent aussi l'Allemagne,
   l'Italie, l'Espagne, Andorre et le Royaume-Uni.
7. **Le premier écran mobile ne montrait pas le jeu** (74 % des visites Google sont sur mobile) :
   la boîte n'apparaissait qu'au deuxième écran, après le bouton d'achat. Corrigé.
8. **Image de marque** : le dépôt GitHub est public (il doit l'être pour GitHub Pages) et des PR y
   portent la mention « publié sans relecture humaine ». Peu de gens iront voir, mais un journaliste
   qui cherche « KYRAN » peut tomber dessus.

## 4. Ce qui est déjà bien

- Le site est rapide (PageSpeed mobile 97), propre, sans erreur d'indexation, avec un vrai tunnel
  d'achat (prix direct, Stripe, Apple Pay, Amazon Pay, retours gratuits).
- 33 avis Amazon à 4,7/5 : c'est une base réelle.
- L'univers graphique (Crea by Floh, singe, motifs africains et caribéens) est original dans un
  rayon dominé par les pirates et les sorciers. C'est un atout de différenciation à raconter.
- L'Initiation en ligne (`/minijeu.html`) permet d'essayer le jeu gratuitement : rare chez un
  auto-éditeur, à pousser auprès des médias.

## 5. Les concurrents et leur leçon

| Jeu | Prix | Promesse | Ce qu'on en retient |
|---|---|---|---|
| Flip 7 | 13,50–15 € | « Stop ou encore ? » | Une règle en 30 secondes, n°1 des ventes 2025 |
| Skyjo | 13–20 € | Le score le plus bas gagne | Bouche-à-oreille familial, grande distribution |
| Skull King | 20–25 € | Pari sur ses plis, pirates et pouvoirs | **Concurrent le plus direct** de KYRAN |
| Wizard | 12–15 € | Le classique du pari sur les plis | Ancien, connu des joueurs de cartes |
| Trio | ≈ 12 € | Trouve les brelans | Simplicité, boîte de poche |

Leçon : KYRAN est **moins cher que Skull King** et plus moderne que Wizard. Son argument n'est pas
« un jeu de plis de plus » mais **« le pari impossible : à chaque manche, quelqu'un se trompe »**, et
la manche finale carte sur le front, très filmable.

## 6. Ce que Claude a fait le 12 octobre (PR #46)

- Frais de port alignés sur Stripe (3,99 €) partout : récapitulatif, FAQ, données structurées, flux
  Google Merchant.
- Quantité : message clair pour la choisir sur la page Stripe ; mention du port unique (deux boîtes
  pour 3,99 € de port : argument cadeau).
- Prix Amazon présenté comme comparaison, plus de faux prix barré ; économie corrigée à 4 €.
- Accueil mobile : le jeu visible dès le premier écran ; nouvelle accroche.
- Message de Noël automatique sur la page de commande (du 1er novembre au 24 décembre, date limite
  conseillée le 16 décembre), sans mise à jour manuelle.
- Plan d'action (ci-dessous), kit de démarchage prêt à l'emploi (`docs/VENTES-KIT.md`) et passe
  hebdomadaire automatique dédiée aux ventes (`docs/VENTES-PASSES.md`).

## 7. Plan d'action

### Ce que seul le propriétaire peut faire (classé par rapport impact / effort)

Chaque action renvoie, si besoin, au texte prêt à copier dans `docs/VENTES-KIT.md`.

| # | Action | Quand | Effort | Impact |
|---|---|---|---|---|
| 1 | **Stripe** : corriger la description du produit (§ 1 du kit), décider du port (2,99 € ou 3,99 €), ajouter les pays promis ou les retirer des CGV | Cette semaine | 10 min | Fort (confiance au paiement) |
| 2 | **Amazon** : baisser à 12,90–14,90 €, reprendre le titre et les puces (§ 2 du kit), renommer le vendeur « KYRAN » | Cette semaine | 30 min | Fort |
| 3 | **Service presse avant le 31 octobre** : 20 à 30 boîtes envoyées à des micro-influenceurs et médias (§ 3 et § 4 du kit). Un contenu publié après le 25 novembre arrive trop tard pour Noël | 14 → 31 oct. | 3 jours, 150–300 € | Très fort |
| 4 | **Marchés de Noël et salons d'artisans** du 20 novembre au 20 décembre : table de démo, parties de 10 minutes, offre « 2 boîtes = 18 € » en main propre | Réserver dès maintenant | Week-ends | Très fort (ventes directes) |
| 5 | **Boutiques ludiques et bars à jeux** proches : 5–6 boîtes en dépôt ou en ferme, une boîte de démo offerte (§ 5 du kit) | Octobre–novembre | 2 jours | Moyen à fort |
| 6 | **CSE et cadeaux d'entreprise** : prix dégressif dès 20 boîtes (§ 6 du kit). Les budgets se bouclent en novembre | Avant fin octobre | 1 jour | Une commande = un mois de ventes |
| 7 | **Vidéos courtes** (Reels, TikTok, Shorts) : 3 par semaine jusqu'à Noël, en filmant la manche carte sur le front et les retournements des Pouvoirs (idées au § 7 du kit) | Dès maintenant | 2–3 h/semaine | Fort |
| 8 | **Fiches gratuites** Tric Trac, Okkazeo ; faire vivre la fiche BoardGameGeek (photos, règle, demander aux premiers joueurs de noter et d'enregistrer leurs parties) ; demande de référencement Philibert Marketplace | Novembre | 1 jour | Crédibilité, premiers liens entrants |
| 9 | **Carte « avis » dans chaque boîte** : demander un avis Amazon contre une variante à 2 joueurs en PDF (critique fréquente). Objectif 100 avis en février | Prochain lot | 50 € d'impression | Moyen |
| 10 | **Instagram** : rétablir le secret `INSTAGRAM_ACCESS_TOKEN` pour que la page Communauté se remplisse | Quand possible | 15 min | Faible à moyen |
| 11 | **Google Merchant Center** : associer le compte et soumettre `google-merchant-feed.xml` (fiches produit gratuites dans Google Shopping, trafic d'achat) | Cette semaine | 30 min | Moyen |
| 12 | **FIJ Cannes, 26–28 février 2027** : y aller en visiteur professionnel avec 20 boîtes et les chiffres de Noël pour rencontrer distributeurs et éditeurs | Janvier | 2–3 jours | Fort à moyen terme |

### Ce que Claude fait sans intervention

- **Passe « ventes » hebdomadaire** (`docs/VENTES-PASSES.md`, routine du mardi) :
  - vérifier que le prix et le port affichés correspondent à la page Stripe ;
  - lire les requêtes Search Console à intention d'achat (cadeau, acheter, prix) ;
  - améliorer un point de conversion par semaine (texte, preuve sociale, page cadeau) ;
  - tenir à jour le tableau de suivi de ce plan.
- **Passes blog** (lundi, mercredi, vendredi) : elles continuent. La priorité passe aux sujets
  d'achat (cadeaux, Noël, jeux à moins de 15 €) plutôt qu'aux listes « jeux comme X ».
- **Auto-Heal** : il continue de corriger les erreurs de production.

### Ce qu'il faut arrêter ou réduire

- Produire en masse des articles « jeux comme X » : ils apportent du trafic, presque jamais d'achat.
- Peaufiner le site au détriment du terrain : chaque heure passée à une table de démo rapporte plus
  qu'une heure de SEO à ce stade.

### Objectif réaliste

150 à 300 boîtes d'ici Noël, à condition de lancer les actions 3 à 6. Le site seul, sans trafic
nouveau, n'en vendra que quelques dizaines.
