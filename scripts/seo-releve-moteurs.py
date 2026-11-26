#!/usr/bin/env python3
"""Relevé neutre des positions de kyran-jeu.fr sur DuckDuckGo (index Bing).

Requêtes sans cookie, sans compte ni historique, publicités exclues (règle du relevé, 26/11/2026).
DuckDuckGo : version HTML, résultats `result__a` hors annonces (`result--ad`). Il sert de mesure neutre
de l'index Bing : bing.com interrogé sans cookie renvoie des résultats sans rapport (essai du 26/11).
Brave refuse les requêtes sans navigateur (captcha) : il est relevé à part, voir releve-moteurs.md.

Usage : python scripts/seo-releve-moteurs.py "requête 1" "requête 2" ...
        python scripts/seo-releve-moteurs.py --fichier liste.txt   (une requête par ligne)
Sortie : CSV date,moteur,requete,position,page,source sur la sortie standard ;
position = rang du premier résultat kyran-jeu.fr dans les 10 premiers, « absent » sinon,
« erreur » si la page n'a pas pu être lue.
"""
import argparse
import datetime
import html
import re
import sys
import time
import urllib.parse
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0 Safari/537.36")
DOMAINE = "kyran-jeu.fr"


def lire(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def liens_ddg(page):
    liens = []
    for bloc in re.split(r'<div class="result ', page)[1:]:
        if bloc.startswith("results_links_deep result--ad") or "result--ad" in bloc[:200]:
            continue
        m = re.search(r'class="result__a" href="([^"]+)"', bloc)
        if not m:
            continue
        href = html.unescape(m.group(1))
        cible = urllib.parse.parse_qs(urllib.parse.urlparse(href).query).get("uddg")
        liens.append(cible[0] if cible else href)
    return liens


def position(liens):
    for i, lien in enumerate(liens[:10], 1):
        hote = urllib.parse.urlparse(lien).netloc.lower()
        if hote == DOMAINE or hote.endswith("." + DOMAINE):
            return str(i), urllib.parse.urlparse(lien).path or "/"
    return "absent", ""


MOTEURS = {
    "duckduckgo": ("https://html.duckduckgo.com/html/?q={q}&kl=fr-fr", liens_ddg),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("requetes", nargs="*")
    ap.add_argument("--fichier")
    args = ap.parse_args()
    requetes = list(args.requetes)
    if args.fichier:
        with open(args.fichier, encoding="utf-8") as f:
            requetes += [l.strip() for l in f if l.strip()]
    if not requetes:
        ap.error("aucune requête")
    jour = datetime.date.today().isoformat()
    out = sys.stdout
    out.write("date,moteur,requete,position,page,source\n")
    for q in requetes:
        for moteur, (modele, extraire) in MOTEURS.items():
            try:
                pos, page = position(extraire(lire(modele.format(q=urllib.parse.quote_plus(q)))))
            except Exception as e:  # page illisible : on le dit, sans inventer de position
                print(f"{moteur} « {q} » : {e}", file=sys.stderr)
                pos, page = "erreur", ""
            out.write(f"{jour},{moteur},{q},{pos},{page},curl-neutre\n")
            out.flush()
            time.sleep(2)


if __name__ == "__main__":
    main()
