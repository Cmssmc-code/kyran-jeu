# Machines à états du site

Toutes les machines à états de kyran-jeu.fr, explicites ou portées par des drapeaux. Chaque
machine a **une seule source de vérité** et un diagramme en tête du fichier qui la porte :
modifier une transition, c'est modifier ce fichier et son test.

| Machine | Source de vérité | Test |
| --- | --- | --- |
| Partie (règles) | `dojo/engine.js` : `state.phase` + `state.pending`, transitions par `act()` | `scripts/test/dojo.test.mjs` |
| Interface de l'Initiation | `dojo/ui-state.js` : `uiStateOf()`, publié sur `#dojo[data-state]` | `scripts/test/dojo.test.mjs` |
| Événement Stripe (webhook Railway) | `server/stripeEvents.js` : `new → processing → done` | `server/test/stripe-events.test.mjs` |
| Incident Auto-Heal | `server/incidents.js` : `INCIDENT_STATUS`, transitions depuis `pending` seulement | `server/test/auto-heal.test.mjs` |

## Partie (`dojo/engine.js`)

`phase` : `idle → bet → play → roundEnd → (bet …) → gameOver`. La décision attendue est
`pending.type` (`bet`, `play`, `mysticValue`, `target`, `reveal`, `next`) ; `act()` refuse toute
action qui ne correspond pas à `pending` (type et joueur). C'est la machine de référence.

## Interface de l'Initiation (`dojo/ui-state.js`)

`app.js` garde ses drapeaux (`S`, `resolveHuman`, `coachHold`, `pause`, `crashed`, fenêtre
ouverte) mais chaque changement appelle `syncState()`, qui publie un état unique :

`lobby`, `auto` (adversaires, animations), `turn:<pending.type>` (au joueur), `coach` (le
Bokonon attend « Continuer »), `dialog` (bilan, fin de partie), `paused` (« Quitter ? »), `crash`.

- Tests navigateur et agents : attendre `#dojo[data-state="turn:play"]` plutôt qu'un délai.
- CSS : cibler `.dj[data-state^="turn:"]` plutôt que recalculer l'état.
- Nouveau drapeau dans `app.js` : l'ajouter à `uiStateOf()` et appeler `syncState()` quand il change.

## Événement Stripe (`server/stripeEvents.js`)

Un doublon reçu pendant `processing` reçoit **409** (Stripe relance plus tard) au lieu d'être
retraité : avant, deux livraisons simultanées envoyaient deux fois l'e-mail de commande. Un échec
oublie l'événement pour que la relance Stripe le retraite. Mémoire vive : un redémarrage du
serveur vide le journal (Stripe peut alors redélivrer un événement déjà traité).

La variante `worker/` (Cloudflare) n'a pas d'idempotence : elle ne doit pas être branchée en
même temps que Railway (voir l'en-tête de `worker/index.js`).

## Incident Auto-Heal (`server/incidents.js`)

`pending → auto_fixed | ignored` ; `pending → pending` (tentative + 1) puis `failed` à
`MAX_ATTEMPTS`. Les états terminaux rattachent les rechutes du même incident (6 h pour
`auto_fixed`, 7 j pour `ignored` et `failed`). Utiliser `INCIDENT_STATUS`, jamais les chaînes.
