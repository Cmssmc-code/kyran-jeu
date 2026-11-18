# Partie test des parties entre amis : mardi 25/11

Objectif : prouver en vrai, avec 3 vrais navigateurs, qu'une partie entre amis va jusqu'au bout sans bug, sans fuite de cartes et sans toucher au paiement. Rien de ce test n'est public : `salle.html` est noindex, hors menu et hors sitemap, et `MULTI_ACTIF` reste éteint hors du créneau.

## Qui fait quoi

- **Gardien (directeur technique)** : allume et éteint `MULTI_ACTIF` sur Railway, surveille les logs et le journal d'incidents. Seul à toucher Railway.
- **Game designer (data)** : conduit le test, lance le smoke, note les mesures, rédige le compte rendu.
- **Corentin** : joue le siège 1 (PC) ; invité à la fin pour le bilan. Pas de paiement : on ne clique jamais « Commander la boîte » jusqu'au paiement, on s'arrête sur la page Stripe.

Les 3 navigateurs (joueurs humains, un siège chacun) :

1. **PC** : navigateur de Trio, profil `kyran`. Hôte, crée la salle.
2. **Téléphone** : navigateur de Trio sur le POCO (`tel_nav_*`). Rejoint par le lien.
3. **2e PC** (ThinkPad ou Huawei, un Chrome ordinaire, pas Claude in Chrome sur le ThinkPad) : rejoint par le lien.

L'hôte ajoute 1 ordinateur (niveau adepte) : 3 humains + 1 ordinateur = 4 sièges, 5 vies. Mode Audrey : si actif, tout reste en arrière-plan, sans fenêtre ni son ; sinon le reporter.

## Avant (J-1, mardi 24/11, avant 19 h)

- `git pull` sur main : la PR 264 est fusionnée, vérifier que `/salle.html` répond 200 et `noindex`.
- `node scripts/smoke-salle.mjs` avec le jeu éteint : doit répondre « Parties entre amis éteintes » (preuve que l'éteint renvoie 503) et sortir en code 0.
- Gardien : confirmer que la CI de main est verte (`npm test` webhook + purchase, `scripts/smoke-initiation.mjs`).
- Rappel : jamais de vrai paiement Stripe, aucune boîte offerte.

## Déroulé minute par minute (créneau de 40 min, par exemple 18 h 00 → 18 h 40)

- **T-10** : les 3 navigateurs sont ouverts sur `https://kyran-jeu.fr/salle.html`, sans rien cliquer. Noter la version `?v=` de `multi.js` chargée.
- **T+0** : le gardien met `MULTI_ACTIF=1` sur Railway et attend le redéploiement. Il écrit « allumé » à data.
- **T+2** : data lance `node scripts/smoke-salle.mjs` (jeu allumé). Attendu : tous les `ok`, dont « 3 jetons distincts », « aucune main adverse visible hors manche Mystique », « pas de graine ni de pioche dans la vue », « un non-hôte ne peut pas lancer ». Un échec = on coupe et on corrige.
- **T+5** : PC crée la salle (pseudo « Corentin »). Noter le code. Événement GA attendu : `salle_creee`.
- **T+7** : le téléphone et le 2e PC ouvrent le lien `salle.html#CODE`, saisissent un pseudo, rejoignent. Les 3 voient la liste des joueurs. Vérifier : le lien se copie, les pseudos s'affichent en texte (essayer un pseudo `<b>x</b>` : il doit s'afficher tel quel).
- **T+10** : l'hôte choisit 5 vies, 1 ordinateur adepte, lance. Les 4 sièges apparaissent, le non-hôte n'a pas de bouton « Lancer ».
- **T+10 à T+30** : la partie. Pendant ce temps :
  - chaque joueur vérifie qu'il ne voit **jamais** la main des autres (sauf manche Mystique, où on voit les cartes des autres mais pas la sienne) ;
  - au moins une fois, le dernier parieur essaie le pari interdit (le bouton est grisé ; le serveur refuse aussi) ;
  - au moins une fois, un joueur joue une carte à pouvoir (cible) et une carte Mystique si elle sort ;
  - **coupure 1** (T+15) : le téléphone passe en mode avion 10 s puis revient : il doit retrouver la salle seul ;
  - **coupure 2** (T+20) : le 2e PC recharge la page (F5) : il retrouve la partie (jeton en `sessionStorage`) ;
  - **absence** (T+24) : le 2e PC ne joue pas pendant 60 s : l'ordinateur joue à sa place après le délai ; noter le compte à rebours.
- **T+30** : fin de partie. Les 3 écrans affichent le gagnant et le bouton « Commander la boîte · 9,99 € ». Événement GA : `salle_partie_finie` (une fois par joueur).
- **T+32** : chacun clique **une fois** « Commander la boîte » : doit s'ouvrir dans un nouvel onglet sur la page Stripe habituelle. Fermer sans payer. Événement GA : `salle_cta_click`. Cliquer aussi « Nouvelle salle » : retour à l'accueil.
- **T+35** : le gardien lit le journal d'incidents et les logs (`[AutoHeal]`, préfixe salle). Attendu : zéro incident de salle.
- **T+38** : le gardien remet `MULTI_ACTIF` à vide (voir « Couper »).

## Ce qu'on mesure

| Mesure | Comment | Seuil de réussite |
|---|---|---|
| Parties finies | écran de fin sur les 3 navigateurs | 1 sur 1 (ou 2 sur 2 si 2e partie) |
| Bugs | liste des écarts, une ligne chacun, avec capture | 0 bloquant |
| Fuite de cartes | smoke + œil des 3 joueurs | 0 |
| Temps par coup | durée entre deux coups, notée à la main (le compte à rebours de 60 s est affiché) | aucun coup humain bloqué au-delà de 60 s |
| Reconnexion | coupures 1 et 2 | retour dans la partie en moins de 10 s |
| Remplacement | absence de 60 s | l'ordinateur joue, la partie continue |
| Clics « Commander » dans GA | Google Analytics, temps réel, événement `salle_cta_click` | 3 clics vus (un par joueur) |
| Événements GA | `salle_creee` = 1, `salle_partie_finie` = 3 | présents |
| Incidents serveur | journal d'incidents Railway | 0 |
| Paiement | webhook Stripe | aucun événement, aucune session créée |

GA peut mettre quelques minutes à afficher : lire « temps réel » pendant le test, puis re-vérifier le lendemain. Si un événement manque, le noter tel quel, sans l'inventer.

## Couper `MULTI_ACTIF` à la fin

1. Gardien : sur Railway, projet `kyran-webhook`, supprimer la variable `MULTI_ACTIF` (ou la mettre à vide), redéployer.
2. Vérifier : `curl -i https://kyran-webhook-production.up.railway.app/salle/statut` doit répondre **503** `{"actif":false}`. Les salles en mémoire disparaissent au redémarrage.
3. Vérifier que le webhook d'achat répond toujours (CI de main verte, et le site répond comme avant).
4. Gardien écrit « éteint, 503 vérifié » à data.
5. Si quelque chose va mal pendant le test (erreur de salle, lenteur du serveur, doute sur le paiement) : **couper tout de suite**, sans attendre la fin de la partie. Priorité absolue au paiement.

## Après

- Data écrit le compte rendu dans `_notes/partie-test-25-11-resultats.md` : mesures réelles, écarts, captures. Aucun chiffre non relevé.
- Les bugs deviennent des tâches au registre (problème), corrigés en PR avec CI verte avant tout nouvel allumage.
- Ensuite seulement, discussion avec le PDG : charge de 20 salles, page de confidentialité, mobile, ouverture au public.
- Si le test n'a pas lieu le 25/11 : le PDG fixe la nouvelle date, ce déroulé reste valable.
