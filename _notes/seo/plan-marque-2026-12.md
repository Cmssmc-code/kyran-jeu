# Plan technique : requêtes de marque au 31/12/2026

Objectif (tâche t100) : n°1 sur Google, Bing et Brave pour « kyran jeu », « kyran jeu de cartes » et
« kyran jeu de pli » au 31/12/2026. Responsable de la partie technique : spécialiste SEO et GEO.
Rédigé le 27/11/2026. Aucun titre ni description de page dans ce plan (domaine de la directrice marketing,
règle des 28 jours).

## Position de départ (27/11/2026)

| Requête | Google | Bing |
|---|---|---|
| kyran jeu | 1 (direct) ; GSC : pas de ligne | 1 (direct) ; API, depuis 09/2025 : 8 impr., position 1,5 |
| kyran jeu de cartes | 1 (direct) ; GSC : pas de ligne | 1 (direct) ; API : aucune impr. récente |
| kyran jeu de pli | 1 (direct) ; GSC : pas de ligne | 1 (direct) ; API : 20 impr., position 9 (semaine du 20/11) |

- « Direct » : recherche réelle dans le navigateur de Trio le 27/11 après-midi, `hl=fr`, `gl=fr`, `pws=0` pour
  Google, `cc=FR` pour Bing ; résultat organique n°1 = `https://kyran-jeu.fr/` (Bing « kyran jeu de cartes » :
  `/jouer-en-ligne.html` en 1, l'accueil en 2).
- Search Console (28 j au 26/11) : seule la requête « kyran » ressort (78 impressions, 7 clics, position 2,3) ;
  les 3 requêtes visées sont trop rares et masquées par Google (requêtes anonymisées).
- Bing Webmaster (`GetQueryStats`, historique par semaine) : chiffres ci-dessus, très faibles volumes.
- Piège : le relevé du lundi note Bing « absent » sur les 3 requêtes (`curl-neutre`, 26/11). C'est faux :
  Bing ne sert pas ses résultats à `curl`. Relever Bing dans un vrai navigateur.

Conclusion : la cible est atteinte au départ. Le travail consiste à la tenir jusqu'au 31/12 et à occuper plus
de place sur la page (deuxième lien du site, fiche de connaissances, extraits enrichis).

## Actions

1. **Product : `priceValidUntil` expire le 31/12/2026.** Passer au 31/12/2027 avant le 15/12 (PR), sinon
   Google peut retirer prix et disponibilité de l'extrait. Vérifier ensuite les rapports « Extraits de produits »
   et « Fiches de marchand » de la Search Console (0 erreur attendue).
2. **sameAs du Product (`#game`)** : 13 liens, tous en ligne le 27/11 (Etsy et BoardGameGeek répondent 403 aux
   robots, normal). Manquent : la fiche Philibert, le compte TikTok @kyran.jeu et la page itch.io de
   l'Initiation, qui sortent tous dans les 10 premiers résultats. Les ajouter (PR avant le 05/12), après contrôle
   que chaque lien est en ligne.
3. **Organization** : 6 `sameAs` (réseaux et Wikidata). Ajouter TikTok. Contrôler que Wikidata Q141623753 porte
   bien le site officiel et les identifiants Instagram, BGG, Tric Trac (avant le 08/12).
4. **Bing et IndexNow** : le workflow `indexnow.yml` notifie Bing à chaque publication. Contrôle chaque semaine :
   0 erreur d'exploration (`GetCrawlIssues`), sitemap lu, accueil, `/regle.html` et `/jouer-en-ligne.html`
   indexés (`GetUrlInfo`).
5. **llms.txt et llms-full.txt** : présents ; la première phrase dit déjà « jeu de cartes de plis » et itch.io
   figure dans « Présence externe ». Y ajouter les liens directs de la fiche Philibert et du compte TikTok
   (avant le 08/12). Signaler à la directrice marketing que « 7 cartes de règles » (llms.txt) est à confirmer
   par le game designer (écart connu avec la fiche Amazon).
6. **Alertes** : toute alerte Search Console ou Bing traitée sous 48 h (PR, test des résultats enrichis,
   « Valider la correction »).
7. **Mesure** : relevé direct des 3 requêtes sur Google et Bing chaque lundi (navigateur, pas `curl`) ;
   point chiffré le 08/12 (point SEO) et le 31/12.
