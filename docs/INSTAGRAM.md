# Page Communauté — photos et vidéos de joueurs depuis Instagram

`/communaute.html` affiche les photos et vidéos prises par des joueurs de KYRAN et republiées sur
le compte [@kyran.jeu](https://www.instagram.com/kyran.jeu/). Elle se met à jour toute seule, chaque
jour, via `.github/workflows/instagram.yml`.

## Pourquoi héberger les fichiers plutôt qu'intégrer Instagram

| | Intégration Instagram (embed) | Fichiers hébergés sur kyran-jeu.fr (choix retenu) |
|---|---|---|
| Google Images / vidéos | L'image est indexée sous instagram.com | Indexée sous kyran-jeu.fr, sitemap image et vidéo |
| Assistants IA (ChatGPT, Claude, Perplexity…) | Iframe chargée en JavaScript : rien à lire | Texte, crédits, légendes et JSON-LD en HTML statique |
| Données structurées | Aucune | `ImageObject` / `VideoObject` avec auteur, crédit, date, lien vers l'original |
| Vitesse (Core Web Vitals) | Script `embed.js` lourd, décalages de mise en page | Images dimensionnées, chargement différé, vidéos `preload="none"` |
| RGPD | Cookies Meta dès l'affichage : bandeau de consentement nécessaire | Aucun cookie ni appel à Meta côté visiteur (la CSP n'a pas changé) |
| Pérennité | Disparaît si l'API d'intégration change | Fichiers dans le dépôt |

## Fonctionnement

1. `scripts/fetch-instagram.mjs` lit les publications de @kyran.jeu avec l'API officielle de Meta.
2. Une publication est retenue si sa **légende crédite un autre compte** : `📸 @pseudo`, `🎥 @pseudo`,
   `Crédit : @pseudo`, `Photo de @pseudo`, `via @pseudo`, `Repost @pseudo`, `Merci à @pseudo`…
   Les publications sans crédit (contenus propres à KYRAN) sont ignorées.
3. Photos, vidéos, carrousels et miniatures sont téléchargés dans `/communaute/`, avec des noms de
   fichiers descriptifs (`kyran-2026-02-03-pseudo-123456.jpg`).
4. `npm run build` génère la page (`scripts/generate-community.mjs`), le sitemap (`image:image`,
   `video:video`), `llms.txt` et le plan du site, puis le workflow commite, relance la publication
   GitHub Pages et prévient IndexNow (Bing, Copilot).
5. Une publication supprimée d'Instagram disparaît du site au passage suivant (fichiers supprimés).

Tant qu'aucune publication de joueur n'est disponible, la page existe en `noindex` et reste hors sitemap.

## Mise en place (une seule fois)

Les libellés de l'interface Meta changent souvent : suivez l'esprit des étapes.

1. **Compte professionnel** : dans l'application Instagram, Paramètres → Type de compte et outils →
   passer @kyran.jeu en compte **professionnel** (Créateur ou Entreprise). Gratuit.
2. **Application Meta** : sur <https://developers.facebook.com/apps>, « Créer une app », cas
   d'utilisation **Instagram** (« Gérer les messages et le contenu sur Instagram »), type Entreprise.
3. Dans l'app : **Instagram → Configuration de l'API avec connexion Instagram** →
   « Générer des tokens d'accès » → ajouter le compte @kyran.jeu, se connecter, accepter.
   L'autorisation nécessaire est seulement `instagram_business_basic` (lecture de vos propres publications).
   L'app peut rester en mode développement : pas d'examen Meta pour lire votre propre compte.
4. Copier le **jeton** (longue durée, 60 jours).
5. **GitHub** → dépôt → Settings → Secrets and variables → Actions → New repository secret :
   nom `INSTAGRAM_ACCESS_TOKEN`, valeur = le jeton. Ne jamais le commiter ni le coller ailleurs.
6. GitHub → Actions → « Synchronisation Instagram » → **Run workflow** pour un premier passage.

Le workflow prolonge le jeton à chaque passage (quotidien), ce qui le garde valide. Si le journal du
workflow affiche « Meta a renvoyé un nouveau jeton », remplacez la valeur du secret. Si le jeton a
expiré (workflow en échec « API Instagram 400/190 »), regénérez-le (étape 3) et mettez à jour le secret.

Variante « Facebook Login » (compte Instagram relié à une Page Facebook) : renseigner aussi le secret
`INSTAGRAM_USER_ID` (ID du compte Instagram professionnel) avec un jeton de l'API Graph Facebook.

En local : `INSTAGRAM_ACCESS_TOKEN=… npm run fetch:instagram -- --dry-run` (liste sans rien
télécharger), puis sans `--dry-run`, puis `npm run build`.

## Au quotidien

- **Republier une photo de joueur** : dans la légende, créditer l'auteur (`📸 @pseudo`).
  Elle apparaît sur le site le lendemain matin (ou tout de suite avec « Run workflow »).
- **Droits** : une photo ou une vidéo appartient à son auteur. Avant de la republier, demandez-lui son
  accord pour Instagram **et** le site (un « Oui » en commentaire ou en message privé suffit, gardez-en
  une capture). La page indique comment demander un retrait.
- **Masquer une publication** (demande de retrait, photo floue…) : dans
  `scripts/content/communaute-reglages.json`, ajouter son ID (visible dans `communaute.json`) :

  ```json
  "overrides": {
    "17890000000123456": { "hide": true }
  }
  ```

  puis lancer le workflow (ou `npm run fetch:instagram && npm run build`) : les fichiers sont supprimés.
- **Corriger un crédit ou un texte** : `{ "credit": "pseudo", "alt": "Quatre amis jouent à KYRAN en terrasse", "caption": "…" }`.
  Un `alt` décrivant vraiment l'image est le meilleur gain SEO image : il remplace le texte automatique.
- **Forcer une publication sans crédit dans la légende** : `{ "include": true, "credit": "pseudo" }`.
- **Repost natif d'Instagram** (bouton « Republier ») et stories : l'API ne les renvoie pas. Les
  ajouter à la main dans `manual` après avoir déposé les fichiers dans `/communaute/` :

  ```json
  "manual": [
    {
      "id": "manuel-2026-03-12-lea",
      "permalink": "https://www.instagram.com/p/XXXXXXXX/",
      "date": "2026-03-12T20:00:00+01:00",
      "credit": "lea",
      "caption": "Soirée KYRAN à six joueurs.",
      "alt": "Six joueurs autour d'une table pendant une partie de KYRAN",
      "media": [
        { "type": "image", "src": "/communaute/kyran-2026-03-12-lea.jpg", "width": 1080, "height": 1350 },
        { "type": "video", "src": "/communaute/kyran-2026-03-12-lea.mp4", "poster": "/communaute/kyran-2026-03-12-lea-poster.jpg", "width": 1080, "height": 1920, "duration": 25 }
      ]
    }
  ]
  ```

## Fichiers

| Fichier | Rôle |
|---|---|
| `scripts/fetch-instagram.mjs` | Lecture de l'API, sélection, téléchargement |
| `scripts/generate-community.mjs` | Génère `communaute.html` (étape de `npm run build`) |
| `scripts/lib/community.mjs` | Détection des crédits, textes, extrait de sitemap |
| `scripts/content/communaute.json` | Publications récupérées (généré, ne pas éditer) |
| `scripts/content/communaute-reglages.json` | Réglages manuels (masquer, corriger, ajouter) |
| `communaute/` | Photos, vidéos et miniatures publiées |
| `css/communaute.css` | Styles de la galerie |
| `.github/workflows/instagram.yml` | Synchronisation quotidienne |
