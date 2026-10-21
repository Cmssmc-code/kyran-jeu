# Prompt pour Claude dans Chrome : tâches SEO manuelles de KYRAN

> Préparé le 21/10/2026 par la routine SEO (`_notes/seo-routine-mission.md`), mis à jour le même jour après
> vérification de l'état réel (API Search Console, Bing, BoardGameGeek, Wikidata, pages publiques).
> Autonomie accordée par Corentin le 21/10/2026, **à condition de vérifier avant chaque action que ce n'est pas déjà
> fait** (plusieurs tâches l'ont été à la main). À coller tel quel dans Claude pour Chrome, connecté aux comptes de
> Corentin. Textes complets : `_notes/outreach/textes-fiches.md`. Le rapport final se colle dans le doc partagé ;
> la routine nocturne met ensuite `_notes/seo/backlog.md` à jour.

## Déjà fait (vérifié le 21/10/2026, retiré du prompt)

| Tâche | Preuve |
|---|---|
| BoardGameGeek : fiche réglée par Corentin (21/10), plus rien à y faire | décision de Corentin |
| Chaîne YouTube @Kyran-jeu : description et liens (site, règles, Instagram) | page « À propos » de la chaîne |
| BoardGamesFlix : auteur et illustratrice crédités | page publique de la fiche |
| Bing : `/blog/` et `whist-22` connues et soumises (API, 20/10) ; 0 lien entrant (API) | Bing Webmaster API |
| Pages déjà indexées et explorées récemment : accueil (21/10), `regle`, `tarot-africain`, `idee-cadeau`, `ressources-gratuites` (18/10) | inspection d'URL |

## Le prompt

```text
Tu finis, dans mon navigateur, les tâches de référencement de mon jeu de cartes KYRAN (https://kyran-jeu.fr).
Je suis Corentin Sence, auteur et éditeur. Tu travailles dans mes comptes déjà connectés.
Tu agis en autonomie totale, sans me demander d'accord, À UNE CONDITION : vérifier avant chaque action.
Plusieurs tâches ont déjà été faites à la main : ne refais jamais une chose déjà faite.

VÉRIFIER AVANT D'AGIR (à chaque étape, sans exception)
1. Déjà fait ? Ouvre la page, la fiche ou le réglage et lis ce qui s'y trouve. Si l'information est déjà là
   (même formulée autrement) ou si la demande a déjà été faite, n'y touche pas : note « déjà fait ».
   Pour un message à un site : cherche d'abord dans mes e-mails envoyés (contact@kyran-jeu.fr et ma boîte
   Gmail si elle est ouverte) un message déjà envoyé à ce site ; s'il existe, n'envoie rien.
2. Juste ? Chaque fait que tu écris est dans la liste « Faits » ci-dessous ou dans le fichier de textes ;
   chaque lien s'ouvre sans erreur et montre bien KYRAN ou la ressource annoncée ; chaque identifiant
   ouvre le bon jeu.
3. Bonne cible ? Bon site, bonne fiche (KYRAN, Maître des Mystiques, pas un homonyme), bon champ,
   mon compte (jamais un compte Majordia).
4. Les trois contrôles sont bons : agis (enregistre, soumets, envoie). Un contrôle échoue ou tu doutes :
   n'agis pas, note pourquoi, passe à la suite.
5. Après l'action : recharge et vérifie que le changement est là, ou que l'envoi est confirmé.

RÈGLES
- Ne paie rien, ne crée aucun compte, ne modifie aucun prix, aucun réglage Stripe ni aucun paiement.
- Ne supprime rien d'existant (fiche, lien, déclaration, vidéo, enregistrement DNS) : tu ajoutes ou tu corriges.
- Un seul message par site, aucune relance. Signature : « Corentin Sence, auteur de KYRAN — contact@kyran-jeu.fr ».
- Faits, jamais d'autres : jeu de plis avec pari obligatoire et bluff ; 3 à 6 joueurs (pas à deux) ; dès 8 ans ;
  environ 30 minutes ; sorti le 31 janvier 2026 ; auteur et éditeur Corentin Sence ; illustrations Crea by Floh ;
  36 cartes Nombre, 1 carte Mystique, 8 cartes Pouvoir (45 cartes de jeu), 30 cartes Vie, 7 cartes de règles.
  N'écris jamais « 55 cartes », « février 2026 », « sans élimination », « sans hasard », « jeu primé »,
  « Player Elimination ».
- Textes prêts à coller : https://github.com/Cmssmc-code/kyran-jeu/blob/main/_notes/outreach/textes-fiches.md
  (prends le texte de la section indiquée, sans le réécrire).
- Partout où un champ, une ressource ou un message le permet (fiche, liens externes, formulaire), ajoute aussi
  les règles en PDF de mon site : https://kyran-jeu.fr/regle-kyran.pdf (une page A4 illustrée), si elles n'y sont pas déjà.
- Une page refuse, plante ou demande quelque chose d'inconnu : passe au bloc suivant et note-le.
- Après chaque bloc, une ligne : fait / déjà fait / bloqué.

BLOC 1 — Google Search Console, demandes d'indexation (propriété « sc-domain:kyran-jeu.fr »)
Pour chaque URL : « Inspecter l'URL ». Ne demande l'indexation QUE si la page est « non indexée », ou si sa
« Dernière exploration » est antérieure à la date indiquée. Google limite à une dizaine par jour : arrête-toi
au message de quota et liste celles qui restent.
État relevé le 21/10 (vérifie quand même : il a pu changer) :
Priorité 1, hors index :
  https://kyran-jeu.fr/blog/                         (Découverte, non indexée)
  https://kyran-jeu.fr/video-regles.html             (Découverte, non indexée)
  https://kyran-jeu.fr/a-propos.html                 (Découverte, non indexée)
  https://kyran-jeu.fr/blog/cadeau-anniversaire.html (Explorée le 29/08, non indexée)
Priorité 2, indexées mais modifiées après leur dernière exploration (demander si exploration avant le 21/10) :
  https://kyran-jeu.fr/tarot-africain.html           (explorée le 18/10, modifiée les 20 et 21/10)
  https://kyran-jeu.fr/regle.html                    (explorée le 18/10, modifiée le 20/10)
Priorité 3, indexées mais pas explorées depuis plus de 3 semaines (demander si exploration avant le 30/09) :
  https://kyran-jeu.fr/dossier-presse.html           (02/09)
  https://kyran-jeu.fr/jeu-apero.html                (05/09)
  https://kyran-jeu.fr/blog/jeux-cartes-6-joueurs.html          (17/09)
  https://kyran-jeu.fr/blog/science-jeux-de-cartes-cerveau.html (17/09)
  https://kyran-jeu.fr/blog/jeux-cartes-adultes.html            (17/09)
  https://kyran-jeu.fr/blog/jeux-debutants-adultes.html         (22/09)
  https://kyran-jeu.fr/blog/jeux-comme-exploding-kittens.html   (22/09)
  https://kyran-jeu.fr/blog/jeux-draft-encheres.html            (27/09)
  https://kyran-jeu.fr/blog/jeux-soiree-amis.html               (28/09)

BLOC 2 — Google Search Console, relevés (lecture seule, recopie les chiffres)
a) Sécurité et actions manuelles > Actions manuelles : y en a-t-il une ? (oui / non + texte).
b) Paramètres > Statistiques d'exploration : demandes sur 90 jours, temps de réponse moyen, répartition par
   réponse (200, 301, 404…), et chute ou pic éventuel autour du 18-22 août 2026.
c) Liens > Liens externes : nombre de sites qui renvoient vers kyran-jeu.fr, et les 5 premiers.
d) Si un rapport « IA générative » / « AI Overviews » existe dans Performances : clics et impressions sur
   3 mois, et les 5 pages les plus vues.
e) Paramètres > « Livraison et retours » (ou Shopping) : s'il existe et n'est pas déjà rempli, remplis-le :
   livraison France 2,99 € par commande, préparation 1 à 2 jours ouvrés, transit 2 à 4 jours ouvrés ;
   retours 14 jours après réception, retour gratuit (à la charge du vendeur), remboursement intégral,
   politique https://kyran-jeu.fr/cgv.html#art6. S'il est déjà rempli autrement : n'y touche pas, recopie-le.

BLOC 3 — Bing Webmaster Tools (site https://kyran-jeu.fr/), lecture seule
Rapport « AI Performance » (citations Copilot) : total sur 3 mois, les 5 pages et les 5 requêtes les plus citées.

BLOC 4 — (BoardGameGeek : rien à faire, réglé par Corentin le 21/10. Ne va pas sur BGG.)

BLOC 5 — Tric Trac, https://trictrac.net/jeu-de-societe/kyran
Relevé le 21/10 : aucun lien vers kyran-jeu.fr sur la fiche. Section « 2. Tric Trac » : ajoute les ressources
externes qui manquent (dont le PDF des règles) et la description longue si la description de la communauté est vide.

BLOC 6 — Wikidata, https://www.wikidata.org/wiki/Q141623753
Relevé le 21/10 (dernière modification le 02/10) : 7 déclarations, 0 référence, aucun identifiant externe.
Section « 4. Wikidata » : ajoute ce qui manque : P2339 480678, P14915 kyran, P14579 95533, P136 genre
= Q1191150 (jeu de levées, PAS Q1361226), P495 France, P2899 8 ans, P2047 30 minutes ; puis les références
(P854 URL + P813 date de consultation = aujourd'hui) sur les déclarations existantes. Ne crée aucun autre élément.

BLOC 7 — Demandes de correction et de lien
a) Lokidia Games https://www.lokidia-games.fr/contact : la fiche https://www.lokidia-games.fr/jeu/kyran affiche
   encore « maîtres élémentaires », « 2 à 4 joueurs », « 10 ans » (relevé le 21/10). Si c'est toujours le cas,
   envoie le message de la section « 3. Lokidia ».
b) Ludovox https://ludovox.fr/contact/ : l'article https://ludovox.fr/ludochrono-kyran/ n'a toujours aucun lien
   vers kyran-jeu.fr (21/10). Si c'est toujours le cas, envoie le message de la section « 5. Ludovox ».
c) BoardGamesFlix https://boardgamesflix.com/contact : auteur et illustratrice sont DÉJÀ corrigés ; il manque
   seulement le lien vers https://kyran-jeu.fr/. S'il manque toujours, envoie ce message court :
   « Bonjour, merci d'avoir crédité Corentin Sence et Crea by Floh sur la fiche https://boardgamesflix.com/boardgames/kyran.
   Pourriez-vous y ajouter le site officiel de l'éditeur, https://kyran-jeu.fr/ (règles : https://kyran-jeu.fr/regle.html) ?
   Le lien Okkazeo de la fiche pointe vers une recherche ; la fiche du jeu existe :
   https://www.okkazeo.com/jeux/94411/kyran-maitre-des-mystiques. Merci, Corentin Sence, auteur de KYRAN — contact@kyran-jeu.fr »
d) Myludo https://www.myludo.fr/#!/game/kyran-95533 : si l'année affiche encore 2025 ou si l'illustratrice
   manque, « Proposer une modification » avec la section « 8. Myludo », SANS la ligne « prix ».
e) Okkazeo https://www.okkazeo.com/jeux/94411/kyran-maitre-des-mystiques : si l'illustrateur ou l'éditeur
   manquent, « Modifier la fiche » : illustrateur Crea by Floh, éditeur « Kyran (auto-édition, Corentin Sence) »,
   vidéo Ludochrono ; ne touche ni au prix ni aux liens existants. (Page non lisible depuis mon serveur : vérifie.)
f) Règles2jeux https://regles2jeux.fr/la-regle-du-tarot-africain/ : si la page ne cite pas déjà kyran-jeu.fr,
   cherche une adresse ou un formulaire de contact public ; s'il y en a un, envoie :
   « Bonjour, votre page "La règle du tarot africain" est l'une des plus claires sur le jeu. J'ai mis en ligne
   une feuille de score et une règle condensée au format A4, gratuites, avec le tableau des cartes par manche
   de 3 à 5 joueurs : https://kyran-jeu.fr/ressources-gratuites.html. Si elle peut servir à vos lecteurs, vous
   êtes libre d'y faire un lien. Et si vous voyez une erreur dans ma règle, je la corrige volontiers.
   Bonne journée, Corentin Sence, auteur de KYRAN — contact@kyran-jeu.fr »

BLOC 8 — YouTube
La description et les liens de la chaîne @Kyran-jeu sont DÉJÀ faits (21/10) : n'y touche pas.
a) Vidéo « KYRAN en 60 secondes » (https://www.youtube.com/watch?v=y0YVn-lZMAc) : si sa description ne
   commence pas déjà par un lien vers kyran-jeu.fr, ajoute en première ligne :
   « Règles complètes et initiation gratuite : https://kyran-jeu.fr/regle.html »
b) Vidéo du Pirate Ludique (https://www.youtube.com/watch?v=5W0KNuoPUt4) : sa description n'a pas de lien
   vers kyran-jeu.fr. Si je n'ai pas déjà commenté sous la vidéo, poste le commentaire de la section
   « 9. YouTube » (un seul).

BLOC 9 — GitHub, vérification du domaine
github.com > Settings (compte Cmssmc-code) > Pages > Verified domains. Si kyran-jeu.fr y est déjà « Verified » :
rien à faire. Sinon : « Add a domain » kyran-jeu.fr, recopie l'enregistrement TXT demandé ; si l'espace OVH
(Zone DNS de kyran-jeu.fr) est ouvert, ajoute ce TXT s'il n'existe pas déjà (ajout seulement, ne modifie ni ne
supprime aucun autre enregistrement), puis clique « Verify » (réessaie en fin de session si la propagation
n'est pas faite).

BLOC 10 — Clé PageSpeed (gratuite)
https://console.cloud.google.com : si une clé restreinte à « PageSpeed Insights API » existe déjà, ne crée rien.
Sinon, dans le projet du compte de service Search Console (s'il apparaît), active « PageSpeed Insights API » et
crée une clé restreinte à cette API. N'écris jamais la clé en clair dans le rapport : dis seulement où la trouver.

RAPPORT FINAL
Un tableau : bloc · fait / déjà fait / bloqué · détail (statuts d'indexation, chiffres relevés, messages
envoyés avec date et destinataire, ce qui reste). Puis les URL d'indexation pas encore demandées (quota), pour demain.
```

## Ce que le prompt laisse de côté (décisions de Corentin)

- `priceValidUntil` (31/12/2026) et prix 2027 ; prix affiché sur Okkazeo et Myludo.
- Merchant Center (`docs/MERCHANT.md`) : à brancher une fois les décisions prises.
- Pages légales (CGV, garanties, médiateur) : textes dans `docs/rapports/seo-intense-2026-10-19.md`.
- Auto-Heal : règle WIF de Majordia (`docs/AUTO-HEAL.md` § 5), hors SEO.
