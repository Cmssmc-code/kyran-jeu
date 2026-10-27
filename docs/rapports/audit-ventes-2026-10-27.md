# Audit commercial KYRAN — 27 octobre 2026

Question du propriétaire : « pourquoi je ne vends aucun jeu, sur mon site surtout, mais aussi sur
Amazon et Etsy ? Depuis la mise en place du site : 0 vente. »

Suite de l'audit du 12 octobre ([`audit-ventes-2026-10-12.md`](audit-ventes-2026-10-12.md)). Quinze
jours plus tard, avec des chiffres plus complets (Search Console sur toute la vie du site, journaux
Railway, parcours d'achat refait en mobile et ordinateur, page Stripe ouverte sans payer, recherche
Amazon, recherche web sur la marque).

## 1. Le diagnostic en trois phrases

1. **Le site ne reçoit presque personne qui veut acheter un jeu** : 550 clics Google en 14 mois, dont
   plus de 80 % sur des pages qui parlent d'autres jeux (Tarot Africain, Skyjo, Codenames, Dixit).
   Avec ce trafic, 0 vente n'est pas une anomalie : c'est le résultat attendu.
2. **Personne ne connaît le jeu, donc personne ne le cherche** : « kyran jeu » a été tapé 2 fois sur
   Google en 14 mois ; aucun média, aucune boutique, aucun avis hors Amazon ; un moteur de recherche
   ne trouve rien sur « KYRAN jeu de cartes ».
3. **Le site, la page de commande et Stripe fonctionnent.** Le problème n'est ni technique ni de
   prix. Tout le temps investi dans le site, le SEO et les routines ne peut pas compenser l'absence
   de distribution et de bouche-à-oreille.

## 2. Ce qui a été vérifié aujourd'hui

| Contrôle | Résultat |
|---|---|
| Accueil, `/commander.html`, `/idee-cadeau.html` (390 × 844 et 1366 × 800) | Pages rapides (1 à 3 s), jeu visible dès le premier écran, prix clair, bouton d'achat collant en mobile |
| Page Stripe (lecture, sans payer) | En ligne ; 9,99 € + 2,99 € = 12,98 € ; Apple Pay, Link, Amazon Pay, carte ; description juste ; FR BE LU MC CH |
| Cohérence prix site / Stripe | Conforme |
| Journaux Railway `kyran-webhook` (rétention ≈ 1 semaine) | Aucun événement Stripe reçu, seulement des tests `curl` : confirme l'absence de paiement sur la période |
| Recherche Amazon « jeu de plis cartes » | KYRAN absent des 48 premiers résultats |
| Recherche web « KYRAN jeu de cartes Maître des Mystiques », « KYRAN Corentin Sence avis », Etsy | Aucun résultat pertinent |

## 3. Les chiffres qui expliquent tout

### 3.1 Trafic Google sur toute la vie du site (sept. 2025 → 26 oct. 2026)

| Mois | Clics | Impressions |
|---|---|---|
| sept. 2025 → mai 2026 (9 mois) | 117 | 995 |
| juin 2026 | 18 | 740 |
| juillet 2026 | 96 | 4 218 |
| août 2026 | 106 | 7 142 |
| septembre 2026 | 66 | 3 694 |
| octobre 2026 (26 jours) | 147 | 7 219 |
| **Total** | **550** | **24 008** |

Mobile 68 %, ordinateur 29 %. France 80 %, puis Guadeloupe, Belgique, Suisse, Canada.

### 3.2 D'où viennent les visiteurs

| Page d'arrivée | Clics | Intention du visiteur |
|---|---|---|
| `/` (accueil) | 125 | Cherche « kyran » : seule vraie intention KYRAN |
| `/blog/jeux-comme-skyjo.html` | 94 | Cherche un jeu comme Skyjo |
| `/blog/jeux-comme-codenames.html` | 60 | Cherche un jeu comme Codenames |
| `/tarot-africain.html` | 53 | Veut les règles du Tarot Africain, qui se joue **gratuitement** avec un jeu de tarot |
| `/blog/jeux-comme-dixit.html` | 47 | Cherche un jeu comme Dixit |
| `/regle.html` | 44 | Possède ou découvre KYRAN |
| 30 autres articles | ≈ 125 | Listes de jeux, information |
| `/commander.html` | **0** (46 impressions) | — |
| `/idee-cadeau.html` | **0** (2 impressions) | — |

### 3.3 Les requêtes

- « kyran » : 42 clics, 835 impressions, **position moyenne 6,7**. Le site n'est pas premier sur son
  propre nom : « Kyran » est un prénom (footballeurs, personnages de jeu vidéo).
- « kyran jeu » : **2 impressions en 14 mois**. « khyran », « kyrane », « kyrant » : quelques
  impressions, signe d'un nom qu'on ne sait pas écrire.
- Aucune requête d'achat (« acheter », « prix », « cadeau jeu de cartes ») ne mène au site.
- Le reste : « tarot africain », « jeu comme dixit », « jeu style skyjo »…

### 3.4 Le calcul qui rend 0 vente normal

Un site marchand convertit environ 1 à 3 % d'un trafic qui cherche le produit, et 0,1 à 0,3 % d'un
trafic venu lire autre chose. Ici :

- ≈ 170 visites à intention KYRAN (accueil + règles) × 1 à 3 % ≈ **2 à 5 ventes en 14 mois**, et une
  partie de ces visiteurs possède déjà le jeu (QR code de la boîte vers la règle) ;
- ≈ 380 visites « autres jeux » × 0,1 à 0,3 % ≈ **0 à 1 vente**.

Même avec une page de commande parfaite, le site seul ne pouvait vendre que quelques boîtes. Doubler
la conversion de zéro donne zéro : **le levier est le nombre de personnes qui rencontrent le jeu**.

## 4. Les causes, par ordre d'importance

### Cause 1 : personne ne rencontre le jeu (≈ 70 % du problème)

- Aucun prescripteur : pas de média, pas de critique, pas d'influenceur, pas de boutique, pas de
  ludothèque, pas de salon. Le Ludochrono de Ludovox (≈ 1 900 vues) est la seule exposition tierce.
- Aucun lien entrant vers le site (Google et Bing).
- Instagram et YouTube quasi inactifs ; la page Communauté est vide (jeton Instagram absent).
- Un jeu de cartes inconnu à 10 € s'achète **après y avoir joué ou vu quelqu'un y jouer** : en
  soirée chez des amis, à une table de démo, en boutique, dans une vidéo. Rien de cela n'existe
  encore pour KYRAN.
- Sur les 10 actions « propriétaire » du plan du 12 octobre, 1 seule a été faite (alignement Stripe)
  et la fiche BoardGameGeek créée. Service presse, marchés de Noël, boutiques, CSE, vidéos courtes,
  Merchant Center : **pas encore lancés**. Ce sont précisément les actions qui créent des ventes.

### Cause 2 : le trafic du site est le mauvais trafic (≈ 15 %)

- Le site s'est construit comme un site éditorial : 74 pages, 37 articles, routines SEO nocturnes,
  blog trois fois par semaine. Il attire des lecteurs de Skyjo, de Dixit ou du Tarot Africain qui
  repartent avec leur réponse.
- La page la plus vue de l'année, `/tarot-africain.html`, **apprend au visiteur à jouer gratuitement
  au jeu dont KYRAN s'inspire**. Elle peut faire connaître KYRAN, mais elle donne aussi la meilleure
  raison de ne pas l'acheter.
- Sur les 114 derniers commits, presque tous concernent la surveillance, le SEO et le blog ; un seul
  concerne directement la vente. Le temps passe dans la machine, pas devant des joueurs.

### Cause 3 : un positionnement qui ne donne pas envie d'acheter maintenant (≈ 10 %)

- « Jeu de cartes de plis, de bluff et de paris » : le mot « plis » ne parle qu'aux joueurs de
  belote ou de tarot. Pour les autres, la phrase ne dit pas pourquoi ce serait drôle.
- Ceux qui comprennent comparent à Skull King, Wizard ou au Tarot Africain. Un testeur Vine résume
  le risque : « il existe déjà beaucoup de jeux qui réinventent le tarot africain ». Le site le
  confirme lui-même (« KYRAN s'inspire du Tarot Africain »), plusieurs fois.
- La page de commande est très honnête, jusqu'à se desservir : elle met en avant un avis disant que
  le jeu « ne semble pas révolutionnaire ou particulièrement original », signale que les cartes de
  règles se confondent avec les cartes de jeu, et liste les cas où le jeu est « moins adapté ». C'est
  utile pour la confiance et le SEO, mais c'est le dernier écran avant de payer.
- Le nom « KYRAN » est un prénom courant, difficile à écrire et à trouver : le bouche-à-oreille
  oral (« tu connais Kyran ? ») mène souvent ailleurs sur Google.
- Le moment fort du jeu, la manche Mystique jouée la carte sur le front, est mentionné mais ne
  porte pas la promesse. C'est pourtant l'image qui se filme, se raconte et se partage.

### Cause 4 : les places de marché ne travaillent pas (≈ 5 %)

- **Amazon** : 17,99 €, plus cher que Flip 7, Skyjo ou Trio (13 à 15 €) qui ont la notoriété, et
  invisible dans la recherche « jeu de plis cartes ». Les 33 évaluations (4,7/5) sont un atout, mais
  sur les 8 avis avec texte, 4 viennent du programme Vine (testeurs gratuits) et le dernier achat
  vérifié commenté date du 3 juillet. Sans publicité Amazon (Sponsored Products) ni prix
  concurrentiel, Amazon ne montre pas un produit inconnu.
- **Etsy** : les acheteurs Etsy cherchent de l'artisanal et du personnalisé. Un jeu de cartes
  imprimé industriellement, sans photo en situation ni ventes, n'y remonte pas. Etsy ne crée pas de
  demande : il ne fait que servir ceux qui cherchent déjà.
- Les trois canaux de vente se partagent un trafic qui n'existe pas encore. Le site renvoie même
  ses rares visiteurs vers Amazon (28 mentions sur `/commander.html`) et Etsy.

### Ce qui n'est pas la cause

- Le prix direct (12,98 € livré) : moins cher que Skull King, aligné sur Wizard. Le baisser ne
  changera rien tant que personne ne voit le jeu.
- La technique : site rapide, indexé, sans erreur ; Stripe en ligne, paiements mobiles acceptés.
- La qualité du jeu : 4,7/5 et des avis cohérents (« simple », « on lance une partie tout de
  suite », « les cartes Pouvoir font la différence »).

## 5. Un point aveugle à corriger : on ne mesure rien

Le site n'a **aucune mesure d'audience** (choix RGPD). On ne sait donc pas combien de visiteurs
ouvrent `/commander.html`, cliquent sur « Commander » puis abandonnent sur Stripe. Deux sources
gratuites existent déjà :

- **Tableau de bord Stripe → Payment Links → ce lien** : nombre de sessions de paiement ouvertes et
  non payées, avec le `client_reference_id` (page d'origine, en place depuis le 13 octobre).
  À regarder par le propriétaire : si personne n'a jamais ouvert la page Stripe, la cause est 100 %
  le trafic ; si des sessions sont abandonnées, il y a aussi un frein au paiement.
- **Une mesure sans cookie** (GoatCounter ou Plausible, compatibles avec l'exemption de consentement
  de la CNIL si configurées comme telles) donnerait les visites par page sans bannière. Décision du
  propriétaire.

## 6. Plan d'action pour les 8 semaines avant Noël

Novembre et décembre font l'essentiel des ventes de jeux de l'année. Ordre de priorité, du plus
rentable au moins rentable.

| # | Action | Qui | Quand | Pourquoi |
|---|---|---|---|---|
| 1 | **Faire jouer** : 2 à 4 week-ends de marchés de Noël, salons d'artisans ou bars à jeux, avec une table de démo de 10 minutes et une offre en main propre (ex. 2 boîtes = 18 €) | Propriétaire | Réserver cette semaine, 20 nov. → 20 déc. | Canal qui convertit le mieux pour un jeu inconnu ; 20 à 40 boîtes par journée sont réalistes |
| 2 | **Dépôt en boutiques et bars à jeux** proches (5 à 6 boîtes + une boîte de démo offerte, texte au § 5 de `docs/VENTES-KIT.md`) | Propriétaire | Avant le 15 nov. | Le vendeur de la boutique devient prescripteur |
| 3 | **Envoyer 20 boîtes** à des créateurs de contenu jeux de société (TikTok, Instagram, YouTube, 2 000 à 50 000 abonnés), à des ludothèques et à des blogs (textes aux § 3 et 4 du kit) | Propriétaire | Cette semaine : au-delà du 25 nov., trop tard pour Noël | Seul moyen rapide de créer des recherches « kyran » |
| 4 | **CSE et cadeaux d'entreprise** : offre dégressive dès 20 boîtes (§ 6 du kit) | Propriétaire | Avant mi-novembre | Une commande = plus que toute l'année du site |
| 5 | **Vidéos courtes** : 3 par semaine, toujours la même idée simple — la manche Mystique carte sur le front, un pari raté, un Pouvoir qui retourne la manche (§ 7 du kit) | Propriétaire | Dès maintenant | Montrer le jeu, pas l'expliquer |
| 6 | **Amazon** : passer à 13,90–14,90 €, lancer une campagne Sponsored Products à petit budget (5 €/jour) sur « jeu de cartes apéro », « skull king », « jeu de plis », « cadeau jeu de cartes » | Propriétaire | Cette semaine | Amazon ne montre que ce qui se vend ou ce qui paie |
| 7 | **Google Merchant Center** : associer le compte et soumettre `google-merchant-feed.xml` (fiches gratuites dans Google Shopping) | Propriétaire | Cette semaine, 30 min | Seul trafic gratuit à intention d'achat accessible vite |
| 8 | **Lire le tableau de bord Stripe** (sessions ouvertes, `client_reference_id`) et décider d'une mesure sans cookie | Propriétaire | Cette semaine, 10 min | Savoir s'il existe un frein au paiement |
| 9 | **Carte « avis » dans chaque boîte vendue** et QR code vers la fiche Amazon / BoardGameGeek | Propriétaire | Prochain envoi | Transformer chaque acheteur en preuve sociale |
| 10 | **Reprendre la promesse** du site : partir de la manche Mystique et du « pari impossible » plutôt que de « jeu de plis » ; sur `/commander.html`, garder la transparence mais sortir les points faibles du chemin d'achat (dans la FAQ) | Claude (passe ventes) | Novembre | Améliore la conversion des visiteurs qui viendront grâce aux actions 1 à 7 |

### Ce qu'il faut arrêter ou réduire jusqu'à Noël

- Les nouveaux articles « jeux comme X » et les routines qui les produisent : ils n'apportent pas
  d'acheteurs. Le SEO est un investissement à 12-24 mois, pas un levier de ventes pour Noël.
- Le peaufinage du site. Il est prêt. Chaque heure passée devant des joueurs rapporte plus qu'une
  heure de code.

### Objectif réaliste

- Sans action terrain : 0 à 5 boîtes d'ici fin décembre, quel que soit le travail sur le site.
- Avec les actions 1 à 5 : 100 à 300 boîtes, et surtout les premières recherches « kyran jeu », les
  premiers avis hors Amazon et les premiers liens entrants, qui feront enfin travailler le site et
  le SEO en 2027.

## 7. Limites de cet audit

- Ventes Stripe non lues directement (pas de clé Stripe KYRAN dans la session) ; les journaux
  Railway ne couvrent qu'une semaine. Le « 0 vente » vient du propriétaire et est cohérent avec ces
  journaux.
- Fiche Amazon et boutique Etsy non lisibles depuis la session (protection anti-robot) : prix et
  avis Amazon repris du relevé du 19 octobre.
- Trafic hors Google (Instagram, direct, bouche-à-oreille) non mesurable faute d'outil d'audience.
