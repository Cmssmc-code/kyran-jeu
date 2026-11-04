"""Identifiants SEO locaux (PC, routine Claude Trio).

Une variable d'environnement définie garde la priorité. Sinon, la valeur est lue
dans le dossier ``.secrets/`` à la racine du dépôt (ignoré par git). Les valeurs
ne sont jamais affichées.

| Variable                   | Fichier ``.secrets/``          | Usage                                  |
|----------------------------|--------------------------------|----------------------------------------|
| ``GSC_SERVICE_ACCOUNT_JSON`` | ``gsc-service-account.json``   | Search Console (KPI, inspections, MCP) |
| ``BING_WEBMASTER_API_KEY``   | ``bing-webmaster-api-key.txt`` | Bing Webmaster (KPI, MCP)              |
| ``PAGESPEED_API_KEY``        | ``pagespeed-api-key.txt``      | ``seo-health.py --psi``                |

Détail et régénération : ``docs/MCP_SEO.md`` § « Secrets locaux ».
"""

import os
import sys

SECRETS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".secrets"
)

# variable -> (fichier, ne lire que la première ligne)
_FILES = {
    "GSC_SERVICE_ACCOUNT_JSON": ("gsc-service-account.json", False),
    "BING_WEBMASTER_API_KEY": ("bing-webmaster-api-key.txt", True),
    "PAGESPEED_API_KEY": ("pagespeed-api-key.txt", True),
}


def load() -> None:
    """Remplit les variables absentes depuis ``.secrets/``, sans rien afficher.

    Passe aussi la sortie en UTF-8 : sous Windows, la console cp1252 ne sait pas
    écrire les flèches et symboles des résumés (UnicodeEncodeError).
    """
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    for var, (name, first_line) in _FILES.items():
        if os.environ.get(var, "").strip():
            continue
        path = os.path.join(SECRETS_DIR, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as fh:
            value = fh.readline() if first_line else fh.read()
        value = value.strip()
        if value:
            os.environ[var] = value
