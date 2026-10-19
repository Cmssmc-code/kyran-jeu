#!/usr/bin/env python3
"""Indicateurs techniques SEO du site en ligne, mesurés sans intervention humaine (lecture seule).

Lit le sitemap, tire un échantillon d'URL et contrôle pour chacune : code HTTP, temps de réponse, poids du HTML,
`noindex`, canonical auto-référent, titre, méta description, H1, `hreflang`, JSON-LD (syntaxe), `og:image`.
Vérifie aussi `robots.txt` (robots de recherche IA autorisés), `llms.txt`, et en option l'indexation Google
(inspection d'URL Search Console) et PageSpeed Insights (mobile, données terrain CrUX quand elles existent).
Ajoute une ligne à `_notes/seo/kpi-technique.csv` et écrit le détail des anomalies en JSON.

Utilisé par la routine SEO quotidienne (`_notes/seo-routine-mission.md`). Bibliothèque standard seulement ;
l'inspection d'URL demande `pip install -r scripts/requirements-seo.txt` et `GSC_SERVICE_ACCOUNT_JSON`.

Usage (racine du dépôt) :
  python3 scripts/seo-health.py --sample 0              # tout le sitemap (une cinquantaine d'URL)
  python3 scripts/seo-health.py --sample 0              # toutes les URL du sitemap
  python3 scripts/seo-health.py --inspect 15 --psi      # + 15 inspections d'URL Google + PageSpeed
  python3 scripts/seo-health.py --no-csv --details /tmp/anomalies.json
"""

from __future__ import annotations

import argparse
import base64
import csv
import datetime as dt
import gzip
import html.parser
import json
import os
import random
import re
import statistics
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SITE = "https://kyran-jeu.fr"
GSC_SITE = "sc-domain:kyran-jeu.fr"
KEY_PATHS = ["/", "/regle.html", "/tarot-africain.html", "/commander.html", "/blog/", "/minijeu.html",
             "/faq.html", "/idee-cadeau.html"]
MULTILINGUAL = False
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "_notes", "seo", "kpi-technique.csv")
UA = "Mozilla/5.0 (compatible; KyranSeoHealth/1.0; +https://kyran-jeu.fr)"
AI_SEARCH_BOTS = ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "bingbot", "Googlebot", "Applebot"]
FIELDS = [
    "date", "urls_sitemap", "urls_testees", "http_200", "redirections", "http_4xx", "http_5xx", "erreurs_reseau",
    "noindex_dans_sitemap", "canonical_faux", "titre_absent", "titre_trop_long", "description_absente",
    "description_hors_limites", "h1_pas_unique", "hreflang_absent", "jsonld_invalide", "og_image_absente",
    "ttfb_median_ms", "html_median_ko", "robots_ok", "robots_ia_bloques", "llms_txt_ok",
    "gsc_inspectees", "gsc_indexees", "psi_perf_mobile_accueil", "crux_lcp_p75_ms", "crux_inp_p75_ms",
    "crux_cls_p75",
]


def fetch(url: str, timeout: int = 25) -> tuple[int, bytes, dict[str, str], float, str]:
    """Code, corps, en-têtes, durée (s) et URL finale ; ne suit pas les redirections (on les compte)."""

    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *args, **kwargs):  # noqa: D401 - signature imposée
            return None

    opener = urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    start = time.monotonic()
    try:
        with opener.open(req, timeout=timeout) as resp:
            body = resp.read()
            headers = {k.lower(): v for k, v in resp.headers.items()}
            if headers.get("content-encoding") == "gzip":
                body = gzip.decompress(body)
            return resp.status, body, headers, time.monotonic() - start, resp.geturl()
    except urllib.error.HTTPError as err:
        headers = {k.lower(): v for k, v in (err.headers or {}).items()}
        return err.code, b"", headers, time.monotonic() - start, url


class PageParser(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self._in_title = False
        self._title_done = False
        self._svg = 0
        self.description = None
        self.robots = ""
        self.canonical = None
        self.hreflangs: list[str] = []
        self.h1 = 0
        self.og_image = None
        self.jsonld: list[str] = []
        self._in_jsonld = False
        self._buf: list[str] = []

    def handle_starttag(self, tag, attrs):
        a = {k.lower(): (v or "") for k, v in attrs}
        if tag == "svg":
            self._svg += 1
        elif tag == "title" and not self._svg and not self._title_done:
            self._in_title = True
        elif tag == "meta":
            name = (a.get("name") or a.get("property") or "").lower()
            if name == "description":
                self.description = a.get("content", "")
            elif name == "robots":
                self.robots = a.get("content", "").lower()
            elif name == "og:image":
                self.og_image = a.get("content")
        elif tag == "link":
            rel = a.get("rel", "").lower()
            if rel == "canonical":
                self.canonical = a.get("href")
            elif rel == "alternate" and a.get("hreflang"):
                self.hreflangs.append(a["hreflang"])
        elif tag == "h1":
            self.h1 += 1
        elif tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self._in_jsonld = True
            self._buf = []

    def handle_endtag(self, tag):
        if tag == "svg":
            self._svg = max(self._svg - 1, 0)
        elif tag == "title" and self._in_title:
            self._in_title = False
            self._title_done = True
        elif tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            self.jsonld.append("".join(self._buf))

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        elif self._in_jsonld:
            self._buf.append(data)


def sitemap_urls(site: str) -> list[str]:
    seen: set[str] = set()
    urls: list[str] = []
    queue = [f"{site}/sitemap.xml"]
    while queue:
        sm = queue.pop(0)
        if sm in seen:
            continue
        seen.add(sm)
        code, body, _, _, _ = fetch(sm)
        if code != 200:
            print(f"sitemap {sm} : HTTP {code}", file=sys.stderr)
            continue
        locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", body.decode("utf-8", "replace"))
        if b"<sitemapindex" in body:
            queue.extend(locs)
        else:
            urls.extend(u for u in locs if not re.search(r"\.(jpe?g|png|webp|gif|mp4|pdf)$", u, re.I))
    return list(dict.fromkeys(urls))


def norm(url: str) -> str:
    return url.rstrip("/") or url


def check_page(url: str) -> dict:
    code, body, headers, secs, _ = fetch(url)
    res = {"url": url, "code": code, "ms": round(secs * 1000), "issues": []}
    if code in (301, 302, 307, 308):
        res["issues"].append(f"redirection {code} vers {headers.get('location')}")
        return res
    if code != 200:
        res["issues"].append(f"HTTP {code}")
        return res
    res["ko"] = round(len(body) / 1024)
    p = PageParser()
    try:
        p.feed(body.decode("utf-8", "replace"))
    except Exception as exc:  # HTML cassé : on garde ce qui a été lu
        res["issues"].append(f"HTML illisible ({exc})")
    robots = f"{p.robots} {headers.get('x-robots-tag', '').lower()}"
    if "noindex" in robots:
        res["issues"].append("noindex dans le sitemap")
    if not p.canonical:
        res["issues"].append("canonical absent")
    elif norm(urllib.parse.urljoin(url, p.canonical)) != norm(url):
        res["issues"].append(f"canonical vers {p.canonical}")
    title = " ".join(p.title.split())
    if not title:
        res["issues"].append("titre absent")
    elif len(title) > 65:
        res["issues"].append(f"titre de {len(title)} caractères")
    if p.description is None or not p.description.strip():
        res["issues"].append("description absente")
    elif not 70 <= len(p.description.strip()) <= 160:
        res["issues"].append(f"description de {len(p.description.strip())} caractères")
    if p.h1 != 1:
        res["issues"].append(f"{p.h1} H1")
    # Une page traduite (préfixe de langue) doit porter ses hreflang ; une page FR peut être FR seulement.
    translated = re.match(r"^/(en|de|es|it|nl)(/|$)", urllib.parse.urlsplit(url).path)
    if MULTILINGUAL and translated and not p.hreflangs and "noindex" not in robots:
        res["issues"].append("hreflang absent")
    for block in p.jsonld:
        try:
            json.loads(block)
        except ValueError:
            res["issues"].append("JSON-LD invalide")
            break
    if not p.og_image:
        res["issues"].append("og:image absente")
    res["title"] = title
    return res


def robots_check(site: str) -> tuple[bool, list[str]]:
    code, body, _, _, _ = fetch(f"{site}/robots.txt")
    if code != 200:
        return False, []
    blocked = []
    groups: dict[str, list[str]] = {}
    agents: list[str] = []
    last_was_agent = False
    for raw in body.decode("utf-8", "replace").splitlines():
        line = raw.split("#", 1)[0].strip()
        if ":" not in line:
            continue
        key, val = (s.strip() for s in line.split(":", 1))
        key = key.lower()
        if key == "user-agent":
            if not last_was_agent:
                agents = []
            agents.append(val.lower())
            groups.setdefault(val.lower(), [])
            last_was_agent = True
        else:
            last_was_agent = False
            if key == "disallow":
                for agent in agents:
                    groups.setdefault(agent, []).append(val)
    for bot in AI_SEARCH_BOTS:
        rules = groups.get(bot.lower(), groups.get("*", []))
        if "/" in rules:
            blocked.append(bot)
    return True, blocked


def gsc_inspect(urls: list[str]) -> tuple[int, int, list[dict]]:
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw or not urls:
        return 0, 0, []
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("Inspection d'URL : pip install -r scripts/requirements-seo.txt", file=sys.stderr)
        return 0, 0, []
    info = json.loads(raw if raw.startswith("{") else base64.b64decode(raw))
    creds = service_account.Credentials.from_service_account_info(
        info, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
    )
    svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    done, indexed, details = 0, 0, []
    for url in urls:
        try:
            res = svc.urlInspection().index().inspect(body={"inspectionUrl": url, "siteUrl": GSC_SITE}).execute()
        except Exception as exc:
            details.append({"url": url, "erreur": str(exc)[:160]})
            continue
        status = res.get("inspectionResult", {}).get("indexStatusResult", {})
        done += 1
        verdict = status.get("verdict")
        indexed += verdict == "PASS"
        details.append({
            "url": url,
            "verdict": verdict,
            "couverture": status.get("coverageState"),
            "derniere_exploration": status.get("lastCrawlTime"),
            "canonical_google": status.get("googleCanonical"),
        })
    return done, indexed, details


def pagespeed(url: str) -> dict:
    api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + urllib.parse.urlencode(
        {"url": url, "strategy": "mobile", "category": "performance"}
    )
    key = os.environ.get("PAGESPEED_API_KEY", "").strip()
    if key:
        api += "&key=" + urllib.parse.quote(key)
    data = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(api, timeout=120) as resp:
                data = json.load(resp)
            break
        except urllib.error.HTTPError as exc:
            if exc.code != 429 or attempt == 2:
                return {"erreur": f"{exc} (sans PAGESPEED_API_KEY, le quota anonyme est souvent épuisé)"}
            time.sleep(20 * (attempt + 1))
        except Exception as exc:
            return {"erreur": str(exc)[:160]}
    metrics = (data.get("loadingExperience") or {}).get("metrics", {})
    score = ((data.get("lighthouseResult") or {}).get("categories", {}).get("performance") or {}).get("score")
    pick = lambda k: (metrics.get(k) or {}).get("percentile")
    cls = pick("CUMULATIVE_LAYOUT_SHIFT_SCORE")
    return {
        "perf": round(score * 100) if score is not None else "",
        "lcp": pick("LARGEST_CONTENTFUL_PAINT_MS") or "",
        "inp": pick("INTERACTION_TO_NEXT_PAINT") or "",
        "cls": round(cls / 100, 2) if cls is not None else "",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--site", default=SITE)
    parser.add_argument("--sample", type=int, default=60, help="URL tirées au hasard (0 = toutes)")
    parser.add_argument("--inspect", type=int, default=0, help="inspections d'URL Search Console")
    parser.add_argument("--psi", action="store_true", help="PageSpeed Insights mobile sur l'accueil")
    parser.add_argument("--no-csv", action="store_true")
    parser.add_argument("--details", default=os.path.join(ROOT, "_notes", "seo", "derniere-sante.json"))
    parser.add_argument("--seed", type=int, default=None)
    args = parser.parse_args()
    site = args.site.rstrip("/")

    urls = sitemap_urls(site)
    rng = random.Random(args.seed)
    keys = [site + p if p != "/" else site + "/" for p in KEY_PATHS]
    pool = [u for u in urls if u not in keys]
    sample = pool if args.sample == 0 or args.sample >= len(pool) else rng.sample(pool, args.sample)
    targets = list(dict.fromkeys(keys + sample))

    results = []
    for url in targets:
        try:
            results.append(check_page(url))
        except Exception as exc:
            results.append({"url": url, "code": 0, "issues": [f"réseau : {str(exc)[:120]}"]})
        time.sleep(0.2)

    def count(pred) -> int:
        return sum(1 for r in results if pred(r))

    def has(prefix: str):
        return lambda r: any(i.startswith(prefix) for i in r["issues"])

    robots_ok, blocked = robots_check(site)
    llms_code = fetch(f"{site}/llms.txt")[0]
    inspected, indexed, inspect_details = gsc_inspect(
        keys + rng.sample(urls, min(max(args.inspect - len(keys), 0), len(urls))) if args.inspect else []
    )
    psi = pagespeed(site + "/") if args.psi else {}

    ok = [r for r in results if r["code"] == 200]
    row = {
        "date": dt.date.today().isoformat(),
        "urls_sitemap": len(urls),
        "urls_testees": len(results),
        "http_200": len(ok),
        "redirections": count(lambda r: r["code"] in (301, 302, 307, 308)),
        "http_4xx": count(lambda r: 400 <= r["code"] < 500),
        "http_5xx": count(lambda r: r["code"] >= 500),
        "erreurs_reseau": count(lambda r: r["code"] == 0),
        "noindex_dans_sitemap": count(has("noindex")),
        "canonical_faux": count(lambda r: any(i.startswith("canonical") for i in r["issues"])),
        "titre_absent": count(has("titre absent")),
        "titre_trop_long": count(lambda r: any(re.match(r"titre de \d+", i) for i in r["issues"])),
        "description_absente": count(has("description absente")),
        "description_hors_limites": count(lambda r: any(re.match(r"description de \d+", i) for i in r["issues"])),
        "h1_pas_unique": count(lambda r: any(i.endswith(" H1") for i in r["issues"])),
        "hreflang_absent": count(has("hreflang absent")),
        "jsonld_invalide": count(has("JSON-LD invalide")),
        "og_image_absente": count(has("og:image absente")),
        "ttfb_median_ms": round(statistics.median([r["ms"] for r in ok])) if ok else "",
        "html_median_ko": round(statistics.median([r["ko"] for r in ok])) if ok else "",
        "robots_ok": int(robots_ok),
        "robots_ia_bloques": " ".join(blocked),
        "llms_txt_ok": int(llms_code == 200),
        "gsc_inspectees": inspected if args.inspect else "",
        "gsc_indexees": indexed if args.inspect else "",
        "psi_perf_mobile_accueil": psi.get("perf", ""),
        "crux_lcp_p75_ms": psi.get("lcp", ""),
        "crux_inp_p75_ms": psi.get("inp", ""),
        "crux_cls_p75": psi.get("cls", ""),
    }

    if not args.no_csv:
        os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
        new = not os.path.exists(CSV_PATH)
        with open(CSV_PATH, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDS, lineterminator="\n")
            if new:
                writer.writeheader()
            writer.writerow(row)
    anomalies = [{"url": r["url"], "code": r["code"], "problemes": r["issues"]} for r in results if r["issues"]]
    if args.details:
        with open(args.details, "w", encoding="utf-8") as f:
            json.dump({"date": row["date"], "resume": row, "anomalies": anomalies, "inspection": inspect_details,
                       "pagespeed": psi}, f, ensure_ascii=False, indent=1)

    for key in FIELDS:
        print(f"{key} : {row[key]}")
    print(f"Anomalies : {len(anomalies)} page(s) ; détail : {os.path.relpath(args.details) if args.details else '-'}")
    for a in anomalies[:15]:
        print(f"  {a['code']} {a['url']} : {', '.join(a['problemes'])}")


if __name__ == "__main__":
    main()
