#!/usr/bin/env python3
"""Historique quotidien des KPI de référencement (lecture seule) : Google Search Console + Bing Webmaster.

Met à jour `_notes/seo/kpi-quotidiens.csv` : une ligne par jour de données (pas par run). Google est lu en
`dataState: all`, donc avec les données fraîches de la veille (incomplètes, `google_provisoire` = 1) ; les
derniers jours sont relus à chaque appel jusqu'à ce que Google les consolide. Affiche aussi :
- les dernières 24 heures complètes (données horaires de Search Console, environ 10 h de décalage) comparées aux
  mêmes heures une semaine plus tôt ;
- les pages et requêtes qui montent ou baissent le plus (7 jours contre les 7 jours précédents), écrites dans
  `_notes/seo/mouvements.json`.
Utilisé par la routine SEO quotidienne de KYRAN (`_notes/seo-routine-mission.md`).

Usage (racine du dépôt) :
  pip install -r scripts/requirements-seo.txt
  python3 scripts/seo-kpi-daily.py                 # relit les 30 derniers jours et affiche le résumé
  python3 scripts/seo-kpi-daily.py --days 90       # reconstruit 90 jours

Identifiants (jamais affichés) : GSC_SERVICE_ACCOUNT_JSON (JSON brut ou base64) ou
GOOGLE_APPLICATION_CREDENTIALS ; BING_WEBMASTER_API_KEY. Une source absente laisse ses colonnes vides.
"""

from __future__ import annotations

import argparse
import base64
import csv
import datetime as dt
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from zoneinfo import ZoneInfo

GSC_SITE = "sc-domain:kyran-jeu.fr"
BING_SITE = "https://kyran-jeu.fr/"
NOTES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "_notes", "seo")
CSV_PATH = os.path.join(NOTES, "kpi-quotidiens.csv")
MOVERS_PATH = os.path.join(NOTES, "mouvements.json")
FIELDS = [
    "date",
    "google_clics",
    "google_impressions",
    "google_ctr",
    "google_position",
    "google_provisoire",
    "bing_clics",
    "bing_impressions",
    "bing_pages_index",
    "bing_erreurs_crawl",
]


def gsc_service():
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "").strip()
    path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")
    if not raw and not (path and os.path.exists(path)):
        print("Google Search Console : non mesuré (identifiants absents)", file=sys.stderr)
        return None
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    if raw:
        info = json.loads(raw if raw.startswith("{") else base64.b64decode(raw))
        creds = service_account.Credentials.from_service_account_info(info, scopes=scopes)
    else:
        creds = service_account.Credentials.from_service_account_file(path, scopes=scopes)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def gsc_query(svc, body: dict) -> dict:
    return svc.searchanalytics().query(siteUrl=GSC_SITE, body=body).execute()


def gsc_rows(svc, days: int) -> dict[str, dict[str, str]]:
    end = dt.date.today()
    body = {
        "startDate": str(end - dt.timedelta(days=days)),
        "endDate": str(end),
        "dimensions": ["date"],
        "dataState": "all",
        "rowLimit": 1000,
    }
    res = gsc_query(svc, body)
    first_incomplete = (res.get("metadata") or {}).get("firstIncompleteDate", "9999-12-31")
    out = {}
    for r in res.get("rows", []):
        day = r["keys"][0]
        if not r["impressions"] and day >= first_incomplete:
            continue  # jour en cours encore vide
        out[day] = {
            "google_clics": str(int(r["clicks"])),
            "google_impressions": str(int(r["impressions"])),
            "google_ctr": f"{r['ctr']:.4f}",
            "google_position": f"{r['position']:.1f}",
            "google_provisoire": "1" if day >= first_incomplete else "",
        }
    return out


def gsc_last_24h(svc) -> str:
    """Dernières 24 heures complètes contre les mêmes heures 7 jours plus tôt (données horaires)."""
    end = dt.date.today()
    body = {
        "startDate": str(end - dt.timedelta(days=9)),
        "endDate": str(end),
        "dimensions": ["hour"],
        "dataState": "hourly_all",
        "rowLimit": 1000,
    }
    res = gsc_query(svc, body)
    rows = sorted(res.get("rows", []), key=lambda r: r["keys"][0])
    incomplete = (res.get("metadata") or {}).get("firstIncompleteHour")
    if incomplete:
        rows = [r for r in rows if r["keys"][0] < incomplete]
    if not rows:
        return "Google 24 h : non mesuré (pas de données horaires)"
    hours = {dt.datetime.fromisoformat(r["keys"][0]): r for r in rows}
    last = max(hours)
    window = [last - dt.timedelta(hours=h) for h in range(24)]
    before = [h - dt.timedelta(days=7) for h in window]
    pick = lambda hs, k: sum(hours[h][k] for h in hs if h in hours)
    c1, i1 = pick(window, "clicks"), pick(window, "impressions")
    c0, i0 = pick(before, "clicks"), pick(before, "impressions")
    paris = (last + dt.timedelta(hours=1)).astimezone(ZoneInfo("Europe/Paris"))
    return (
        f"Google 24 h (jusqu'à {paris:%d/%m %H:%M} heure de Paris) : {c1:.0f} clics, {i1:.0f} impressions ; "
        f"mêmes heures 7 j plus tôt : {c0:.0f} clics, {i0:.0f} impressions"
    )


def gsc_movers(svc, dimension: str, min_impressions: int = 20, top: int = 10) -> dict[str, list[dict]]:
    """Plus fortes hausses et baisses (7 jours contre les 7 jours précédents), données fraîches comprises."""
    end = dt.date.today()

    def period(start: dt.date, stop: dt.date) -> dict[str, dict]:
        body = {
            "startDate": str(start),
            "endDate": str(stop),
            "dimensions": [dimension],
            "dataState": "all",
            "rowLimit": 2500,
        }
        return {r["keys"][0]: r for r in gsc_query(svc, body).get("rows", [])}

    now = period(end - dt.timedelta(days=7), end)
    prev = period(end - dt.timedelta(days=14), end - dt.timedelta(days=8))
    moves = []
    for key in set(now) | set(prev):
        a, b = now.get(key, {}), prev.get(key, {})
        if max(a.get("impressions", 0), b.get("impressions", 0)) < min_impressions:
            continue
        moves.append({
            dimension: key,
            "clics": int(a.get("clicks", 0)),
            "clics_avant": int(b.get("clicks", 0)),
            "impressions": int(a.get("impressions", 0)),
            "impressions_avant": int(b.get("impressions", 0)),
            "position": round(a["position"], 1) if a else None,
            "position_avant": round(b["position"], 1) if b else None,
        })
    score = lambda m: (m["clics"] - m["clics_avant"]) * 20 + (m["impressions"] - m["impressions_avant"])
    moves.sort(key=score)
    ups = [m for m in reversed(moves) if score(m) > 0][:top]
    downs = [m for m in moves if score(m) < 0][:top]
    return {"hausses": ups, "baisses": downs}


def bing_call(method: str) -> list[dict]:
    key = os.environ.get("BING_WEBMASTER_API_KEY", "").strip()
    if not key:
        return []
    url = (
        f"https://ssl.bing.com/webmaster/api.svc/json/{method}"
        f"?siteUrl={urllib.parse.quote(BING_SITE, safe='')}&apikey={urllib.parse.quote(key)}"
    )
    with urllib.request.urlopen(url, timeout=60) as resp:
        return json.load(resp).get("d", []) or []


def bing_date(value: str) -> str:
    ms = int(re.search(r"-?\d+", value).group())
    return dt.datetime.fromtimestamp(ms / 1000, dt.timezone.utc).date().isoformat()


def bing_rows(since: str) -> dict[str, dict[str, str]]:
    if not os.environ.get("BING_WEBMASTER_API_KEY", "").strip():
        print("Bing Webmaster : non mesuré (clé absente)", file=sys.stderr)
        return {}
    out: dict[str, dict[str, str]] = {}
    for r in bing_call("GetRankAndTrafficStats"):
        day = bing_date(r["Date"])
        if day >= since:
            out.setdefault(day, {}).update({"bing_clics": str(r["Clicks"]), "bing_impressions": str(r["Impressions"])})
    for r in bing_call("GetCrawlStats"):
        day = bing_date(r["Date"])
        if day >= since:
            out.setdefault(day, {}).update(
                {"bing_pages_index": str(r["InIndex"]), "bing_erreurs_crawl": str(r["CrawlErrors"])}
            )
    return out


def total(rows: list[dict[str, str]], field: str) -> float:
    return sum(float(r[field]) for r in rows if r.get(field))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--days", type=int, default=30, help="jours relus (défaut 30)")
    parser.add_argument("--csv", default=CSV_PATH)
    args = parser.parse_args()

    since = str(dt.date.today() - dt.timedelta(days=args.days))
    table: dict[str, dict[str, str]] = {}
    if os.path.exists(args.csv):
        with open(args.csv, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                table[row["date"]] = row
    svc = gsc_service()
    google = gsc_rows(svc, args.days) if svc else {}
    for day, row in table.items():  # une ligne provisoire relue et devenue définitive perd son drapeau
        if day in google:
            row["google_provisoire"] = ""
    for source in (google, bing_rows(since)):
        for day, values in source.items():
            table.setdefault(day, {"date": day}).update(values)

    os.makedirs(os.path.dirname(args.csv), exist_ok=True)
    rows = [table[d] for d in sorted(table)]
    with open(args.csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in FIELDS})

    google_rows = [r for r in rows if r.get("google_impressions")]
    bing = [r for r in rows if r.get("bing_impressions")]
    delta = lambda a, b: f"{(a - b) / b * 100:+.0f} %" if b else "n/a"
    for label, data, prefix in (("Google", google_rows, "google"), ("Bing", bing, "bing")):
        if len(data) < 14:
            continue
        last, prev = data[-7:], data[-14:-7]
        c1, c0 = total(last, f"{prefix}_clics"), total(prev, f"{prefix}_clics")
        i1, i0 = total(last, f"{prefix}_impressions"), total(prev, f"{prefix}_impressions")
        note = " (dernier jour provisoire)" if last[-1].get("google_provisoire") and prefix == "google" else ""
        print(
            f"{label} 7 j ({last[0]['date']} → {last[-1]['date']}{note}) : {c1:.0f} clics ({delta(c1, c0)}), "
            f"{i1:.0f} impressions ({delta(i1, i0)})"
        )
    if len(google_rows) >= 28:
        last28 = google_rows[-28:]
        clics, impr = total(last28, "google_clics"), total(last28, "google_impressions")
        pos = sum(float(r["google_position"]) * float(r["google_impressions"]) for r in last28) / impr if impr else 0
        print(f"Google 28 j : {clics:.0f} clics, {impr:.0f} impressions, CTR {clics / impr * 100:.2f} %, position {pos:.1f}")
    indexed = [r for r in rows if r.get("bing_pages_index")]
    if indexed:
        print(f"Bing pages dans l'index ({indexed[-1]['date']}) : {indexed[-1]['bing_pages_index']}")
    if svc:
        print(gsc_last_24h(svc))
        movers = {"date": dt.date.today().isoformat(), "pages": gsc_movers(svc, "page"),
                  "requetes": gsc_movers(svc, "query")}
        with open(MOVERS_PATH, "w", encoding="utf-8") as f:
            json.dump(movers, f, ensure_ascii=False, indent=1)
        for label, key in (("Pages", "pages"), ("Requêtes", "requetes")):
            dim = "page" if key == "pages" else "query"
            for sens in ("hausses", "baisses"):
                items = movers[key][sens][:5]
                if items:
                    print(f"{label} en {sens[:-1]} (7 j / 7 j avant) :")
                for m in items:
                    print(
                        f"  {m[dim]} : {m['clics_avant']} → {m['clics']} clics, "
                        f"{m['impressions_avant']} → {m['impressions']} impr., position {m['position_avant']} → {m['position']}"
                    )
        print(f"Mouvements : {os.path.relpath(MOVERS_PATH)}")
    print(f"Fichier : {os.path.relpath(args.csv)} ({len(rows)} jours)")


if __name__ == "__main__":
    main()
