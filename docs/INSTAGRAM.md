# Page Communauté — photos et vidéos de joueurs depuis Instagram

`/communaute.html` affiche les photos et vidéos prises par des joueurs de KYRAN et partagées avec le
compte [@kyran.jeu](https://www.instagram.com/kyran.jeu/) : republications, et publications créées par
un joueur en collaboration avec @kyran.jeu. Elle se met à jour chaque jour via
`.github/workflows/instagram.yml`.

## Deux sources, deux affichages

| Source | Comment elle arrive sur le site | Affichage |
|---|---|---|
| Publication **créée par @kyran.jeu** dont la légende crédite un joueur (`📸 @pseudo`…) | Automatique (API, chaque jour) | Fichiers hébergés sur le site (meilleur SEO) |
| Publication **créée par un joueur** en collaboration avec @kyran.jeu, ou repost natif | Liste manuelle `manual` de `scripts/content/communaute-reglages.json` | Intégration officielle d'Instagram (iframe affichée directement) ; ou fichiers hébergés si vous les ajoutez |

Pourquoi les collaborations ne sont pas automatiques (vérifié dans la documentation Meta, octobre 2026) :
l'endpoint `/me/media` ne renvoie que les publications dont @kyran.jeu est **propriétaire**. Une
collaboration appartient au joueur qui l'a créée. Meta propose bien un champ `collaborative_media`
(publications où le compte est collaborateur accepté), ainsi que `tags` et `business_discovery`, mais
**uniquement avec l'API « Facebook Login »** : Page Facebook reliée au compte Instagram, permissions
`instagram_basic` et `pages_read_engagement`, autre configuration de l'app. L'app « KYRAN site » utilise
l'API « Instagram Login » avec la seule permission `instagram_business_basic` : elle ne voit pas ces
publications. L'oEmbed d'Instagram ne donne plus de miniature depuis le 3 novembre 2025 et demande un
examen de l'app (App Review) : il n'est pas utilisé.

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

## Jeton : expiration et renouvellement

Un jeton longue durée vit **60 jours**. Le renouveler auprès de Meta renvoie un **nouveau** jeton
(valable 60 jours à compter du renouvellement) ; l'ancien continue de fonctionner jusqu'à sa propre
échéance. Un jeton renouvelé n'est donc utile que s'il est réenregistré dans le secret GitHub, ce que
le `GITHUB_TOKEN` d'un workflow ne peut pas faire.

`scripts/instagram-token.mjs` (première étape du workflow) suit l'âge du jeton dans
`scripts/content/instagram-jeton.json` : date d'enregistrement et empreinte SHA-256 tronquée du
jeton (irréversible, jamais le jeton lui-même). Remplacer le secret à la main est détecté
automatiquement (empreinte différente) et remet la date à zéro.

**Option recommandée — renouvellement automatique** (à faire une fois) :

1. GitHub → photo de profil → Settings → Developer settings → Personal access tokens →
   **Fine-grained tokens** → Generate new token.
2. Nom : `kyran-jeu secrets Instagram`. Expiration : la plus longue proposée.
   Repository access : **Only select repositories** → `Cmssmc-code/kyran-jeu`.
   Permissions → Repository permissions → **Secrets : Read and write**. Rien d'autre.
3. Generate token, copier.
4. Dépôt → Settings → Secrets and variables → Actions → New repository secret :
   nom `GH_SECRETS_TOKEN`, valeur = ce jeton GitHub.

Dès que le jeton Instagram a 30 jours, le workflow le renouvelle et réécrit lui-même
`INSTAGRAM_ACCESS_TOKEN` (le nouveau jeton est masqué dans les journaux et passé à `gh secret set` par
l'entrée standard). Il reste toujours au moins 30 jours de marge en cas d'échec.

**Sans `GH_SECRETS_TOKEN`** : aucun renouvellement. 10 jours avant l'expiration estimée, le workflow
ouvre une issue « Synchronisation Instagram : action requise » (une seule à la fois) et affiche un
avertissement. La même issue s'ouvre si la synchronisation échoue (« code 190 » = jeton expiré ou
révoqué). Procédure manuelle : générer un nouveau jeton (étape 3 de la mise en place), remplacer la
valeur du secret `INSTAGRAM_ACCESS_TOKEN`, relancer le workflow, fermer l'issue. Si le jeton GitHub
`GH_SECRETS_TOKEN` expire, l'écriture du secret échoue (avertissement) et l'alerte reprend le relais.

Variante « Facebook Login » (compte Instagram relié à une Page Facebook) : renseigner aussi le secret
`INSTAGRAM_USER_ID` (ID du compte Instagram professionnel) avec un jeton de l'API Graph Facebook.

En local : `INSTAGRAM_ACCESS_TOKEN=… npm run fetch:instagram -- --dry-run` (liste sans rien
télécharger), puis sans `--dry-run`, puis `npm run build`.

## Publications de joueurs en collaboration (liste manuelle)

Quand un joueur publie une photo ou un reel avec @kyran.jeu en collaborateur, ajoutez son lien et son
pseudo dans `scripts/content/communaute-reglages.json` → `manual` :

```json
"manual": [
  { "permalink": "https://www.instagram.com/reel/DV9BYIsjJgU/", "credit": "le.pirate.ludique" }
]
```

C'est tout : l'identifiant, la date (encodée dans le lien) et le type (post ou reel) sont déduits du
lien. Puis `npm run build` et commit (ou modification directe sur GitHub : le workflow du lendemain
reconstruit la page).

- **Sans fichier**, la carte affiche directement l'intégration officielle d'Instagram (iframe à
  chargement différé : elle se charge quand le visiteur fait défiler la page jusqu'à elle), avec le
  pseudo, la date, la description et un lien vers la publication. RGPD : l'iframe peut déposer des
  traceurs Meta dès l'affichage, sans consentement préalable ; la politique de confidentialité le
  mentionne. Si le joueur a désactivé les intégrations sur son compte, le lien vers Instagram reste disponible.
  Données structurées : `SocialMediaPosting` (auteur, date, lien).
- **Avec fichiers** (meilleur SEO : Google Images, vidéos, assistants IA) : demandez au joueur sa
  photo ou sa vidéo et son accord pour le site, déposez les fichiers dans `/communaute/`, puis ajoutez
  `media` à l'entrée (format plus bas). La carte devient une photo ou une vidéo hébergée.

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
- **Publication avec fichiers hébergés** (collaboration dont le joueur vous a envoyé les fichiers,
  repost natif, story enregistrée) : déposer les fichiers dans `/communaute/`, puis :

  ```json
  "manual": [
    {
      "permalink": "https://www.instagram.com/p/XXXXXXXX/",
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
| `scripts/instagram-token.mjs` | Âge du jeton, renouvellement, alerte |
| `scripts/content/instagram-jeton.json` | Date d'enregistrement et empreinte du jeton (généré) |
| `scripts/generate-community.mjs` | Génère `communaute.html` (étape de `npm run build`) |
| `scripts/lib/community.mjs` | Détection des crédits, textes, extrait de sitemap |
| `scripts/content/communaute.json` | Publications récupérées (généré, ne pas éditer) |
| `scripts/content/communaute-reglages.json` | Réglages manuels : masquer, corriger, collaborations (`manual`) |
| `communaute/` | Photos, vidéos et miniatures publiées |
| `css/communaute.css` | Styles de la galerie |
| `.github/workflows/instagram.yml` | Synchronisation quotidienne, renouvellement du jeton, alerte |
