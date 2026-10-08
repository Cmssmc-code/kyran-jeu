# MCP SEO : Google Search Console et Bing Webmaster Tools

Deux serveurs MCP communautaires sont déclarés dans [`.mcp.json`](../.mcp.json) pour que Claude Code lise
les données de référencement de `kyran-jeu.fr` : clics, impressions, positions, indexation, sitemaps et
erreurs d'exploration. Ce sont les mêmes lanceurs et les mêmes identifiants que sur Majordia
(`Cmssmc-code/Majordia`, `docs/MCP_SEO.md`) : un seul compte de service Google et une seule clé Bing
servent les deux sites.

| Serveur MCP | Lanceur | Paquet (version figée) | Identifiant |
|-------------|---------|------------------------|-------------|
| `gsc` | [`scripts/mcp/gsc.mjs`](../scripts/mcp/gsc.mjs) | npm `mcp-server-gsc@0.3.0` (ahonn) | Compte de service Google `claude-gsc@majordia-seo.iam.gserviceaccount.com`, portée `webmasters.readonly` |
| `bing-webmaster` | [`scripts/mcp/bing.mjs`](../scripts/mcp/bing.mjs) | `isiahw1/mcp-server-bing-webmaster`, commit du tag `v1.0.2`, via `uvx` | Clé API Bing Webmaster du compte qui gère `kyran-jeu.fr` et `majordia.fr` |

Le serveur GSC n'appelle que les API Google et reste en lecture seule. Le serveur Bing n'appelle que
`ssl.bing.com/webmaster/api.svc/json`. Il expose aussi des outils d'écriture (`remove_site`,
`submit_url`, `update_crawl_settings`…). Seuls les outils de lecture figurent dans la liste `allow` de
[`.claude/settings.json`](../.claude/settings.json) : Claude Code demande confirmation pour tout le reste.

Tant qu'un identifiant manque, le lanceur s'arrête avec un message explicite et le serveur apparaît
« failed to connect ». C'est sans effet sur le reste de la session.

Prérequis : Node 18+ pour GSC, et [`uv`](https://docs.astral.sh/uv/) pour Bing (installé par le hook de
session cloud [`.claude/hooks/session-start.sh`](../.claude/hooks/session-start.sh) s'il manque).

## 1. Google Search Console

### Donner l'accès au site Kyran (une fois, interface web uniquement)

Le compte de service existe déjà (projet Google Cloud `majordia-seo`). Il faut seulement l'ajouter à la
propriété Kyran : [Search Console](https://search.google.com/search-console) → propriété `kyran-jeu.fr` →
**Paramètres → Utilisateurs et autorisations → Ajouter un utilisateur** :

- e-mail : `claude-gsc@majordia-seo.iam.gserviceaccount.com` ;
- autorisation : **Restreint** (lecture).

Sans cette étape, `list_sites` ne renvoie que `sc-domain:majordia.fr` et les requêtes sur Kyran
échouent en 403.

### Fournir la clé au lanceur

Ordre de priorité :

1. `GOOGLE_APPLICATION_CREDENTIALS` : chemin vers le JSON ;
2. `GSC_SERVICE_ACCOUNT_JSON` : contenu du JSON, brut ou en base64. C'est la méthode pour
   **Claude Code cloud** : environnement → variables d'environnement (la même variable que pour
   Majordia, si les deux dépôts partagent l'environnement). Le lanceur écrit le fichier en `0600` dans
   le dossier temporaire ;
3. `.secrets/gsc-service-account.json` à la racine du dépôt, ignoré par git. Méthode recommandée sous
   Windows (copier le fichier de `Majordia/.secrets/`).

Kyran est une propriété domaine : dans les outils, elle s'écrit `sc-domain:kyran-jeu.fr` (accès
« Restreint » accordé le 8 octobre 2026). Le serveur accepte aussi `https://kyran-jeu.fr/` et le
convertit tout seul en `sc-domain:` après un refus d'accès.

Outils : `list_sites`, `search_analytics`, `enhanced_search_analytics` (jusqu'à 25 000 lignes, filtres
regex), `detect_quick_wins`, `index_inspect`, `list_sitemaps`, `get_sitemap`, `submit_sitemap`.
`submit_sitemap` échoue avec la portée lecture seule : c'est voulu, le sitemap est déclaré dans
l'interface Search Console.

## 2. Bing Webmaster Tools

`kyran-jeu.fr` est déjà vérifié dans le compte Bing Webmaster ([`BingSiteAuth.xml`](../BingSiteAuth.xml)) et
la clé API de ce compte couvre tous ses sites. Fournir la clé :

- `BING_WEBMASTER_API_KEY` en variable d'environnement (Claude Code cloud : environnement → variables) ;
- ou `.secrets/bing-webmaster-api-key.txt` (première ligne), ignoré par git.

Pour la révoquer : Bing Webmaster Tools → **Paramètres → Accès API → Clé API → Régénérer** (à reporter
ensuite dans Majordia aussi).

Dans les outils, le site s'écrit `https://kyran-jeu.fr/`. Outils principaux en lecture : `get_sites`,
`get_query_stats`, `get_page_stats`, `get_crawl_stats`, `get_crawl_issues`, `get_url_info`,
`get_link_counts`, `get_related_keywords`. La soumission d'URL reste gérée par IndexNow
([`scripts/indexnow.mjs`](../scripts/indexnow.mjs), [`SEO-GEO.md`](SEO-GEO.md) § 4).

## Vérifier

Nouvelle session Claude Code, puis `/mcp` : `gsc` et `bing-webmaster` doivent être **connected**.
Test : « liste mes sites Search Console et Bing ».

## Mettre à jour un serveur

Changer la version figée (`PACKAGE` dans `gsc.mjs`, commit `SOURCE` dans `bing.mjs`) après avoir relu
le diff du paquet amont, idéalement en même temps que Majordia. Ne jamais passer à `@latest` : un paquet
MCP s'exécute avec les identifiants SEO.
