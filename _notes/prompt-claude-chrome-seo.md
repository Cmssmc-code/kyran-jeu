# Prompt pour Claude dans Chrome : tâches SEO manuelles de KYRAN

> Préparé le 21/10/2026 par la routine SEO (`_notes/seo-routine-mission.md`). À coller tel quel dans Claude pour
> Chrome, connecté aux comptes de Corentin (Google, Bing, BoardGameGeek, Tric Trac, Wikidata, YouTube, GitHub).
> Textes complets à coller : `_notes/outreach/textes-fiches.md` (sur GitHub :
> https://github.com/Cmssmc-code/kyran-jeu/blob/main/_notes/outreach/textes-fiches.md). Quand une étape est faite,
> la routine nocturne la reporte dans `_notes/seo/backlog.md` ; il suffit de lui coller le rapport final dans le doc
> partagé (section Netlinking) ou dans la session.

---

## Le prompt

```text
Tu m'aides à finir, dans mon navigateur, les tâches de référencement de mon jeu de cartes KYRAN
(site https://kyran-jeu.fr). Je suis Corentin Sence, auteur et éditeur. Tu travailles dans mes comptes déjà
connectés. Fais les blocs dans l'ordre. Après chaque bloc, dis-moi en une ligne ce qui est fait et ce qui bloque.

RÈGLES
- Ne paie rien, ne crée aucun compte, ne modifie aucun prix, aucun réglage Stripe ni aucun paiement.
- Avant d'envoyer un formulaire de contact, un message ou une modification visible publiquement
  (fiche BGG, Tric Trac, Wikidata, Myludo, Okkazeo, YouTube), montre-moi le texte final et attends mon « ok ».
- Les demandes d'indexation, les lectures de rapports et les réglages de mes propres consoles : fais-les sans demander.
- Faits à utiliser, jamais d'autres : jeu de plis avec pari obligatoire et bluff ; 3 à 6 joueurs (pas à deux) ;
  dès 8 ans ; environ 30 minutes ; sorti le 31 janvier 2026 ; auteur et éditeur Corentin Sence ;
  illustrations Crea by Floh ; 36 cartes Nombre, 1 carte Mystique, 8 cartes Pouvoir (45 cartes de jeu),
  30 cartes Vie, 7 cartes de règles. N'écris jamais « 55 cartes », « février 2026 », « sans élimination »,
  « sans hasard », « jeu primé », « Player Elimination ».
- Textes prêts à coller : https://github.com/Cmssmc-code/kyran-jeu/blob/main/_notes/outreach/textes-fiches.md
  (ouvre-le, prends le texte de la section indiquée, sans le réécrire).
- Une page refuse ou demande quelque chose que tu ne sais pas : passe au bloc suivant et note-le.

BLOC 1 — Google Search Console, demandes d'indexation (propriété « sc-domain:kyran-jeu.fr »)
Pour chaque URL : colle-la dans la barre « Inspecter », attends le résultat, note le statut, puis clique
« Demander l'indexation ». Google limite à une dizaine par jour : arrête-toi au message de quota et dis-moi
lesquelles restent.
Priorité 1 (hors index) :
  https://kyran-jeu.fr/blog/
  https://kyran-jeu.fr/video-regles.html
  https://kyran-jeu.fr/a-propos.html
  https://kyran-jeu.fr/blog/cadeau-anniversaire.html
Priorité 2 (modifiées les 20 et 21/10, à faire relire) :
  https://kyran-jeu.fr/tarot-africain.html
  https://kyran-jeu.fr/regle.html
Priorité 3 (pas explorées depuis plus de 3 semaines) :
  https://kyran-jeu.fr/dossier-presse.html
  https://kyran-jeu.fr/jeu-apero.html
  https://kyran-jeu.fr/faq.html
  https://kyran-jeu.fr/blog/jeux-cartes-6-joueurs.html
  https://kyran-jeu.fr/blog/science-jeux-de-cartes-cerveau.html
  https://kyran-jeu.fr/blog/jeux-cartes-adultes.html
  https://kyran-jeu.fr/blog/jeux-debutants-adultes.html
  https://kyran-jeu.fr/blog/jeux-comme-exploding-kittens.html
  https://kyran-jeu.fr/blog/jeux-draft-encheres.html
  https://kyran-jeu.fr/blog/jeux-soiree-amis.html
  https://kyran-jeu.fr/tarot-africain-a-3-joueurs.html
  https://kyran-jeu.fr/minijeu.html

BLOC 2 — Google Search Console, relevés (lecture seule, recopie les chiffres)
a) Sécurité et actions manuelles > Actions manuelles : y a-t-il une action ? (oui / non + texte).
b) Paramètres > Statistiques d'exploration : total des demandes sur 90 jours, temps de réponse moyen,
   répartition par réponse (200, 301, 404…), et s'il y a une chute ou un pic autour du 18-22 août 2026.
c) Liens > Liens externes : nombre de sites qui renvoient vers kyran-jeu.fr, et les 5 premiers.
d) Si un rapport « IA générative » ou « AI Overviews » existe dans Performances : clics et impressions
   sur 3 mois, et les 5 pages les plus vues.
e) Paramètres > « Livraison et retours » (ou Paramètres > Shopping) : si le réglage existe, propose-moi :
   livraison France 2,99 € par commande, préparation 1 à 2 jours ouvrés, transit 2 à 4 jours ouvrés ;
   retours 14 jours après réception, retour gratuit (à la charge du vendeur), remboursement intégral,
   politique https://kyran-jeu.fr/cgv.html#art6. Montre-moi l'écran rempli avant d'enregistrer.

BLOC 3 — Bing Webmaster Tools (site https://kyran-jeu.fr/)
a) Rapport « AI Performance » (citations Copilot) : total des citations sur 3 mois, les 5 pages et les
   5 requêtes les plus citées.
b) Inspection d'URL pour https://kyran-jeu.fr/blog/ et https://kyran-jeu.fr/whist-22.html : statut ;
   si « non indexée », clique « Demander l'indexation ».
c) Backlinks : nombre de domaines référents.

BLOC 4 — BoardGameGeek, fiche https://boardgamegeek.com/boardgame/480678/kyran (compte Kyranjeu)
Section « 1. BoardGameGeek » du fichier de textes : Website = https://kyran-jeu.fr/ ; Alternate Name ;
Categories « Card Game » et « Bluffing » ; Mechanisms : garder « Predictive Bid », ajouter « Trick-taking » ;
Description : le texte anglais du fichier ; Videos : les 3 vidéos listées. Montre-moi avant de soumettre.

BLOC 5 — Tric Trac, https://trictrac.net/jeu-de-societe/kyran
Section « 2. Tric Trac » : ajoute les 4 ressources externes et la description longue. Montre-moi avant.

BLOC 6 — Wikidata, https://www.wikidata.org/wiki/Q141623753
Section « 4. Wikidata » : ajoute les identifiants (P2339 480678, P14915 kyran, P14579 95533), P136 genre
= Q1191150 (jeu de levées, PAS Q1361226), P495 France, P2899 8 ans, P2047 30 minutes, puis les références
(P854 URL + P813 date de consultation = aujourd'hui) sur les déclarations existantes. Ne crée aucun autre élément.
Montre-moi la liste avant d'enregistrer.

BLOC 7 — Demandes de correction et de lien (formulaires ; montre-moi chaque message avant l'envoi)
a) Lokidia Games https://www.lokidia-games.fr/contact : message de la section « 3. Lokidia ».
b) Ludovox https://ludovox.fr/contact/ : message de la section « 5. Ludovox ».
c) BoardGamesFlix https://boardgamesflix.com/contact : message de la section « 6. BoardGamesFlix ».
d) Myludo https://www.myludo.fr/#!/game/kyran-95533 « Proposer une modification » : section « 8. Myludo »,
   sans la ligne « prix » (je déciderai du prix affiché plus tard).
e) Okkazeo https://www.okkazeo.com/jeux/94411/kyran-maitre-des-mystiques « Modifier la fiche » :
   illustrateur Crea by Floh, éditeur « Kyran (auto-édition, Corentin Sence) », vidéo Ludochrono ;
   ne touche pas au prix ni aux liens existants.
f) Règles2jeux https://regles2jeux.fr/la-regle-du-tarot-africain/ : trouve une adresse ou un formulaire de
   contact public ; s'il y en a un, propose-moi ce message :
   « Bonjour, votre page "La règle du tarot africain" est l'une des plus claires sur le jeu. J'ai mis en ligne
   une feuille de score et une règle condensée au format A4, gratuites, avec le tableau des cartes par manche
   de 3 à 5 joueurs : https://kyran-jeu.fr/ressources-gratuites.html. Si elle peut servir à vos lecteurs, vous
   êtes libre d'y faire un lien. Et si vous voyez une erreur dans ma règle, je la corrige volontiers.
   Bonne journée, Corentin Sence, auteur de KYRAN — contact@kyran-jeu.fr »

BLOC 8 — YouTube (chaîne @Kyran-jeu)
Section « 9. YouTube » : description de la chaîne, 3 liens (site, règles, Instagram), première ligne de la
description de « KYRAN en 60 secondes ». Montre-moi avant d'enregistrer.

BLOC 9 — GitHub, vérification du domaine (sécurité du site)
github.com > Settings (de mon compte Cmssmc-code) > Pages > « Add a domain » : kyran-jeu.fr. Recopie-moi
l'enregistrement TXT demandé (nom et valeur). Ne touche à rien d'autre dans GitHub. Si j'ai un onglet OVH
ouvert (Zone DNS de kyran-jeu.fr), propose-moi d'ajouter ce TXT et attends mon ok ; puis reviens cliquer
« Verify ».

BLOC 10 — Clé PageSpeed (gratuite)
https://console.cloud.google.com : dans le projet Google Cloud existant (celui du compte de service
Search Console, s'il apparaît), active « PageSpeed Insights API », puis crée une clé API restreinte à cette API.
Ne me l'écris pas en clair dans le rapport : dis-moi seulement qu'elle est créée et où la trouver ; je la
mettrai moi-même en variable PAGESPEED_API_KEY dans l'environnement claude.ai.

RAPPORT FINAL
Un tableau : bloc · fait / en attente de ma validation / bloqué · détail (statuts d'indexation, chiffres
relevés, messages envoyés, ce qui reste). Puis la liste des URL d'indexation pas encore demandées
(quota), pour demain.
```

---

## Ce que le prompt laisse de côté (décisions de Corentin)

- `priceValidUntil` (31/12/2026) et prix 2027 ; prix affiché sur Okkazeo et Myludo.
- Merchant Center (`docs/MERCHANT.md`) : à brancher une fois les décisions prises.
- Pages légales (CGV, garanties, médiateur) : textes dans `docs/rapports/seo-intense-2026-10-19.md`.
- Auto-Heal : règle WIF de Majordia (`docs/AUTO-HEAL.md` § 5), hors SEO.
