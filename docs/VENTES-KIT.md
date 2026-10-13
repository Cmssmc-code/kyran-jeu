# Kit de vente KYRAN

Textes prêts à copier pour les actions du plan
([`docs/rapports/audit-ventes-2026-10-12.md`](rapports/audit-ventes-2026-10-12.md) § 7).
Tous les faits viennent de `_notes/memoire.md` § 1 ; ne rien ajouter qui n'y figure pas
(pas de « 55 cartes », pas de « sans élimination », pas de « sans hasard »).

L'accroche, à reprendre partout : **« Le pari impossible : à chaque manche, quelqu'un se trompe. »**
Image à associer : la manche finale, chacun la carte sur le front.

---

## 1. Stripe : description du produit (page de paiement)

Tableau de bord Stripe → Catalogue de produits → KYRAN — Jeu de cartes → Modifier la description.

> Jeu de cartes de plis et de paris pour 3 à 6 joueurs, dès 8 ans, environ 30 minutes.
> 45 cartes de jeu toilées, 30 cartes Vie, 7 cartes de règles, boîte rigide.

Points à vérifier dans le même écran :

- **Frais de port** : décision du 2026-10-13 : 2,99 € par commande, comme sur Etsy. Le site
  affiche 2,99 €. Vérifier que la page Stripe facture bien 2,99 € (et non plus 3,99 €).
- **Pays de livraison** : Stripe n'accepte que France, Belgique, Luxembourg, Monaco et Suisse. Le
  site et les CGV citent aussi l'Allemagne, l'Italie, l'Espagne, Andorre et le Royaume-Uni. Ajouter
  ces pays dans Stripe, ou demander à Claude de les retirer des pages.

## 2. Amazon : fiche produit

**Prix conseillé** : 12,90 à 14,90 €, sous Flip 7 et Skyjo, tout en restant au-dessus du prix
direct du site.

**Nom du vendeur** : « KYRAN » plutôt que « Kyran - Maître des Mystiques ».

**Titre**

> KYRAN – Jeu de cartes de plis et de paris – 3 à 6 joueurs, dès 8 ans, 30 min – Bluff, cartes
> Pouvoir et manche finale carte sur le front – Idée cadeau famille et amis

**Puces**

1. LE PARI IMPOSSIBLE : chacun annonce le nombre exact de plis qu'il va gagner, mais le total des
   paris ne tombe jamais juste. À chaque manche, quelqu'un se trompe.
2. MANCHE FINALE CARTE SUR LE FRONT : à une carte, on voit celles des autres, jamais la sienne. Fous
   rires garantis.
3. 4 CARTES POUVOIR + LA MYSTIQUE : Sceau du Destin, Clairvoyance, Bénédiction, Voile du Néant, qui
   peuvent renverser un pli.
4. RÈGLES EN 2 MINUTES, PARTIE EN 30 : de 3 à 6 joueurs, dès 8 ans. Variante d'initiation sans
   Pouvoirs pour la première partie. Règle vidéo et initiation gratuite sur kyran-jeu.fr.
5. FORMAT DE POCHE : 45 cartes toilées + 30 cartes Vie, boîte rigide de 175 g. Conçu et édité en
   France, illustrations Crea by Floh.

**Première image** : la boîte, avec à côté une main qui tient une carte sur le front.

## 3. Email aux médias et influenceurs

**Objet :** KYRAN, le jeu de plis où quelqu'un se trompe à chaque manche (boîte offerte)

Modèle validé par le propriétaire le 13 octobre 2026, à réutiliser tel quel pour tous les
prochains emails. Seule la deuxième phrase change d'une personne à l'autre : elle doit prouver
qu'on connaît son travail (un test, une vidéo, un épisode précis).

```text
Bonjour [Prénom],

Je vous écris parce que [accroche personnalisée : votre vidéo sur… / votre test de…].
[Une phrase qui relie ce contenu à KYRAN.]

Je suis Corentin Sence, auteur et éditeur de KYRAN, un petit jeu de cartes sorti le 31 janvier 2026.

Le principe tient en une phrase : chacun parie sur le nombre exact de plis qu'il va gagner, mais
le total des paris ne peut jamais tomber juste. Quelqu'un se trompe donc à chaque manche. Les
manches passent de 7 cartes à 2, puis la dernière se joue la carte sur le front : on voit celles
des autres, jamais la sienne. Quatre cartes Pouvoir peuvent renverser un pli.

3 à 6 joueurs · dès 8 ans · environ 30 min
45 cartes toilées + 30 cartes Vie, boîte de poche
9,99 € · illustrations Crea by Floh
Inspiré du Tarot Africain (Whist 22)

Je serais ravi de vous envoyer un exemplaire, sans aucune obligation de publication.

Pour vous faire une idée avant :
- la règle en vidéo : https://kyran-jeu.fr/video-regles.html (Ludochrono de Ludovox, 5 min)
- l'initiation jouable en ligne : https://kyran-jeu.fr/minijeu.html, gratuite
- le dossier de presse et les visuels : https://kyran-jeu.fr/dossier-presse.html
- la fiche BoardGameGeek : https://boardgamegeek.com/boardgame/480678/kyran

À quelle adresse puis-je vous l'envoyer ?

Belle journée,

Corentin Sence
Auteur et éditeur de KYRAN
contact@kyran-jeu.fr · https://kyran-jeu.fr · @kyran.jeu
```

Mise en forme de la version HTML (brouillon Gmail) :

- Police Arial 15 px, interligne 1,55, texte `#1c1917`, largeur maximale 600 px.
- En gras : « KYRAN » dans la présentation, la phrase « chacun parie… tomber juste », « la carte
  sur le front », « 9,99 € », l'offre « sans aucune obligation… » et la question finale.
- Les quatre lignes de faits dans un encadré : simple trait gauche de 3 px `#d97706`, texte 14 px.
  Pas d'image ni de fond coloré : Gmail les supprime des brouillons.
- Liens cliquables sur le texte (pas d'URL nue), couleur `#b45309`, soulignés. Liens vers le site
  avec `?utm_source=presse&utm_medium=email&utm_campaign=sp-2026` (influenceurs :
  `utm_source=influence`). La signature lie l'email (`mailto:`), le site et Instagram.
- Toujours joindre aussi la version texte brut ci-dessus.
- Pour un influenceur hors jeux de société (famille, étudiants, colocation), remplacer « sans
  aucune obligation de publication » par « sans aucune obligation d'en parler » et ajouter une
  phrase sur son public (soirée en famille, apéro entre colocs…).

Conseils :

- Joindre la règle en PDF, en exportant la page `/regle.html`. Attention : `regle-tarot-africain.pdf`
  est la règle du Tarot Africain, pas celle de KYRAN.
- Un email par personne, avec une phrase qui prouve qu'on connaît son travail.
- Relancer une seule fois, 7 jours plus tard.
- Ne pas écrire pendant un gros salon.

**Message privé Instagram / TikTok (version courte)**

> Bonjour ! Je suis l'auteur de KYRAN, un petit jeu de plis où quelqu'un se trompe à chaque manche
> (la dernière se joue la carte sur le front 😄). Je peux vous envoyer une boîte, sans obligation.
> Ça vous tente ?

## 4. Cibles à contacter

Liste vérifiée le 12 octobre 2026 : chaque adresse a été lue sur le site du média. Les adresses de
`scripts/presse-outreach.json` ne sont pas fiables : plusieurs médias de ce fichier sont introuvables
(Un Dé Dans La Tomate, Le Labo des Jeux, Carnet des Jeux, Pixel Aventuriers…).

**Brouillons Gmail prêts** (boîte corentin.sence@gmail.com, dossier Brouillons, créés le 12 octobre 2026) :

| Média | Adresse | Accroche utilisée |
|---|---|---|
| Undécent | contact@undecent.fr | Test de Charuma, jeu de plis |
| Vin d'jeu | fswatsh@gmail.com | Flip 7 – Vengeance |
| Jeudice | contact@jeudice.fr | Express Clans, veille jeux de plis |
| Partie Prise | contact@partieprise.fr | Test de Pili Pili (un avis Amazon compare KYRAN à Pili Pili) |
| Mr Boardgames | contact@mr-boardgames.com | Test de Yami, jeu de plis |
| Carnet des Geekeries | contact@carnetdesgeekeries.com | Avis sur des jeux d'auteurs |
| Proxi-Jeux (podcast) | contact@proxi-jeux.fr | Épisode avec Fliptoons |
| Ludovox | contact@ludovox.fr | Suite du Ludochrono : test écrit ou concours avant Noël |

**Formulaire seulement** : copier l'email du § 3.

- [Akoa Tujou](https://akoatujou.fr/contact/) : très bonne cible, avec un dossier sur les jeux de
  plis à sortir d'ici la fin de l'année. Ce média ne publie pas d'articles sponsorisés, seulement des
  jeux testés.
- [Ludiquement](https://ludiquement.fr/contact/).
- [Jedisjeux](https://www.jedisjeux.net/contact).

**À ne pas démarcher** :

- Gus&Co : le média achète lui-même les jeux qu'il teste et refuse ceux des éditeurs, ainsi que les
  communiqués de presse.
- Plateau Marmots : la page contact est polluée par du texte de casino (site peut-être compromis) et
  le public visé est trop jeune.

### Influenceurs France et Belgique, de 5 000 à 50 000 abonnés (recherche du 13 octobre 2026)

Seulement des créateurs installés en France ou en Belgique, pays livrés par Stripe. Comptes actifs
en 2026, abonnés relevés le 13 octobre sur YouTube et TikTok, pays lu sur la chaîne, la bio ou les
vidéos. Instagram bloque la lecture automatique : vérifier à la main le compte Instagram de chacun
avant l'envoi (il peut dépasser 50 000). Les adresses ne figurent pas ici, car ce sont des adresses
personnelles : elles sont dans les brouillons Gmail. Lien suivi : `utm_source=influence`.

**Brouillon Gmail prêt (19)**, modèle du § 3 :

| Créateur | Pays | Plateforme et abonnés | Univers | Accroche |
|---|---|---|---|---|
| Dis, on joue ? (Coralie) | 🇧🇪 / 🇫🇷 | YouTube 16,8 k · Instagram ≈ 44 k | Jeux, pour débutants | « Les meilleurs jeux de 2026 » |
| Jeu DésCouvre | 🇫🇷 | YouTube 15,7 k | Tests de jeux | Tests posés et neutres |
| Objectif dés Jeux | 🇫🇷 | YouTube 5,7 k | Papa qui teste avec ses 2 enfants | « 10 jeux validés par mes enfants » |
| Un Monde de jeux (Martin Vidberg) | 🇫🇷 | YouTube 40,4 k + blog | Jeux | Petits jeux de toutes tailles |
| Eva Antoine | 🇫🇷 Paris | TikTok 35 k · YouTube 8,3 k | Étudiante en droit | Soirées entre amis |
| Lyysx | 🇫🇷 Bordeaux | TikTok 24,3 k · YouTube 14,3 k | Étudiante, vacances entre amis | Jeu de poche pour les vacances |
| Solea | 🇫🇷 Paris | YouTube 6,1 k | Vie étudiante | Pause entre deux révisions |
| Dee's Universe | 🇫🇷 (probable) | YouTube 10,3 k | La vingtaine | Soirées entre amis |
| Lolaaa Plz | pays non trouvé | YouTube 5 k | Rentrée étudiante | Premières soirées de l'année |
| Mams'elle Hibou | 🇫🇷 | YouTube 5,8 k | Famille recomposée, 4 filles | Déjà des vidéos jeux en famille |
| À nous 6 (Emeline) | 🇫🇷 | YouTube 5,4 k | 4 garçons, instruction en famille | Compter et anticiper |
| So It's Me (Sofia) | 🇫🇷 (originaire de Mayotte) | TikTok 48,9 k · YouTube 19,2 k | 4 filles dont des ados | Petits et grands dès 8 ans |
| Tania Mum of 4 | pays non trouvé | TikTok 38,2 k · YouTube 11,1 k | 4 filles, défis en famille | Un défi à chaque manche |
| Famille Radifaz | pays non trouvé | YouTube 41,5 k · TikTok 53,7 k | Sketchs de famille | Fou rire quand on se trompe |
| coucoumae | 🇧🇪 Bruxelles | YouTube 25,8 k | Étudiante, vlogs cosy | Vlog « cookies, café & jeux de société » |
| Leïla (@Nasalya_love) | 🇧🇪 | YouTube 47,9 k | Maman de 4, idées d'activités | Soirées en famille |
| Vince (via BeInfluence) | 🇧🇪 | TikTok 13,1 k · Instagram 34,5 k | Streamer Twitch | Streams CAP48 |
| Kenza (@kenzalamaizi) | 🇧🇪 Mons | TikTok 25,2 k | Loisirs cosy | Soirée tranquille entre amis |
| Léa Caps | 🇧🇪 Bruxelles | YouTube 20,2 k | Vie de jeune adulte | Quotidien à Bruxelles |

**Message privé seulement** (pas d'adresse publique), version courte du § 3 :

| Créateur | Pays | Plateforme et abonnés | Univers |
|---|---|---|---|
| Penelope Gaming | 🇫🇷 | YouTube 13,5 k (Instagram @penelope_gaming) | Jeux ; refuse les partenariats payants, exemplaire offert seulement |
| Nixx | 🇫🇷 | YouTube 7,8 k | Jeux, financement participatif |
| TU JOUES OU QUOI !!! | 🇫🇷 | YouTube 9,2 k | Nouveautés et prototypes |
| Marine (@marinedugrenier) | 🇫🇷 Paris | TikTok 30,9 k | Jeux de société, coautrice de BINGMO |
| Les Chroniques des Meeples | 🇫🇷 Seine-Maritime | Instagram ≈ 10 k (non vérifié) | Jeux |
| Tatiana dot Game | 🇧🇪 | YouTube 11,4 k · Instagram ≈ 15 k | Jeux méconnus |
| Des jeux en cravate | 🇧🇪 | YouTube 9,6 k | Jeux, plutôt experts |
| Njoy Games | 🇧🇪 Mons | TikTok 15,1 k | Bar à jeux : aussi un revendeur possible |
| Emmaa dbr | 🇫🇷 | TikTok 31,3 k · YouTube 9 k | Lifestyle jeune |
| lea (@leavtrl) | 🇫🇷 Paris | YouTube 9,5 k | « Une semaine à la fac » |
| ines (@inesprst) | 🇫🇷 Paris | YouTube 35,3 k | Vie étudiante |
| Emma Mty | 🇫🇷 ou 🇧🇪 | YouTube 9,2 k · Instagram 16 k | Lycéenne ; vérifier l'âge, accord parental si mineure |
| Em' (@emydeale) | 🇧🇪 Liège | TikTok 10 k | Vie étudiante à Liège, soirée kot |
| Such a Girl (Géraldine) | 🇧🇪 Bruxelles | TikTok 17,7 k · YouTube 19,4 k | Bons plans sorties |
| Tony & Nao | 🇫🇷 (probable) | YouTube 27,3 k | Jeune couple |
| Béa Maman Nature | 🇫🇷 (probable) | YouTube 13,2 k | Famille nombreuse, déjà une vidéo jeux de société |
| Une Maman Loutre | 🇫🇷 (probable) | Blog + Instagram (formulaire) | Teste des jeux pour enfants de 8 ans |

Retirés car installés hors de France et de Belgique : tsoonumy (Montréal), LYDIE (Istanbul),
Les Colocs Podcast (Canada) et les chaînes québécoises.

**Autres comptes Instagram** : aucune adresse n'a été vérifiée. Passer par un message privé (§ 3, version courte),
en visant des comptes de 2 000 à 30 000 abonnés trouvés avec #jeudesociete et #jeudecartes. Seul
[Le Renard Ludique](https://www.youtube.com/@renardludique/about) a été identifié sur YouTube : son
email pro est caché derrière un bouton.

## 5. Email aux boutiques ludiques et bars à jeux

**Objet :** Jeu de cartes d'auteur local à 9,99 € : dépôt ou achat, boîte de démo offerte

> Bonjour,
>
> Je suis Corentin Sence, auteur et éditeur de KYRAN, un jeu de cartes de plis et de paris pour 3 à
> 6 joueurs, dès 8 ans, en 30 minutes. Il est noté 4,7/5 sur Amazon (33 avis).
>
> Je cherche quelques boutiques pour le proposer avant Noël. Prix public conseillé : 9,99 à 12,90 €.
> Je peux vous le laisser en dépôt-vente ou vous le vendre [prix HT à fixer, environ 5,50 €] par 6
> boîtes, avec une boîte de démonstration offerte. Je peux aussi venir animer une soirée de
> découverte.
>
> Puis-je passer vous le montrer ? Une partie prend dix minutes.
>
> Corentin Sence — KYRAN — contact@kyran-jeu.fr — https://kyran-jeu.fr

## 6. Email aux CSE et entreprises (cadeaux de fin d'année)

**Objet :** Un cadeau de fin d'année à moins de 10 € : le jeu de cartes KYRAN

> Bonjour,
>
> Pour vos cadeaux de fin d'année (salariés, enfants des salariés, clients), je vous propose KYRAN,
> un jeu de cartes conçu et édité en France. Il se joue de 3 à 6, dès 8 ans, en 30 minutes, et il
> tient dans une boîte de poche de 175 g. Il est noté 4,7/5 sur Amazon.
>
> Tarif dégressif [à fixer, par exemple 8,50 € dès 20 boîtes et 7,50 € dès 50], livraison groupée
> offerte en France métropolitaine.
>
> Je peux vous envoyer un exemplaire de démonstration.
>
> Corentin Sence — KYRAN — contact@kyran-jeu.fr

## 7. Idées de vidéos courtes (Reels, TikTok, Shorts)

Format vertical, 15 à 30 secondes, sous-titré, avec le jeu visible dans la première seconde.

1. **« Le pari impossible »** : quatre joueurs annoncent leurs plis, le dernier ne peut pas dire le
   chiffre qui boucle. Texte à l'écran : « Ici, quelqu'un perd forcément. »
2. **La manche carte sur le front** : plan serré sur les visages, réaction au moment où chacun
   découvre sa carte.
3. **Retournement** : un Voile du Néant échange une valeur et vole le pli au dernier moment.
4. **Unboxing de poche** : la boîte sort d'une poche de manteau. « 175 g, 45 cartes + 30 cartes Vie, 9,99 €. »
5. **« Règles en 30 secondes »** : voix off rapide plus démonstration.
6. **Avant Noël** : « Le cadeau à moins de 15 € qui fera crier toute la table au réveillon. »

Lien en bio : `https://kyran-jeu.fr/commander.html?utm_source=instagram&utm_medium=social`.
