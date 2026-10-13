#!/usr/bin/env python3
"""
Génère les dérivés WebP allégés des images du site (miniatures, versions réduites,
cartes du mini-jeu). Les originaux ne sont jamais modifiés ni renommés : pages, flux
Merchant, JSON-LD et og:image peuvent les référencer.

Nécessite Pillow (pip install pillow). Les fichiers générés sont commités ; relancer
après le remplacement d'une image source.
Run: python3 scripts/derive-images.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
QUALITY = 80
made = 0


def load(src):
    im = Image.open(ROOT / src)
    im.load()
    if im.mode == 'P':
        im = im.convert('RGBA')
    elif im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    return im


def save(im, dest, quality=QUALITY):
    global made
    out = ROOT / dest
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, 'WEBP', quality=quality, method=6, alpha_quality=90)
    made += 1


def by_width(src, dest, width, quality=QUALITY):
    """Réduit à `width` px de large en gardant les proportions (jamais d'agrandissement)."""
    im = load(src)
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    save(im, dest, quality)


def thumb(src, dest, side=140, quality=QUALITY):
    """Miniature : le plus petit côté vaut `side` px (affichage en object-fit: cover)."""
    im = load(src)
    scale = side / min(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    save(im, dest, quality)


# Cartes Pouvoir et Mystique de l'accueil, de la règle et de la boutique (affichées à 75-150 px)
for name in ['carte-mystique'] + [f'carte-pouvoir-{p}' for p in (
        'benediction-20', 'benediction-9', 'clairvoyance-11', 'clairvoyance-23',
        'sceau-27', 'sceau-4', 'voile-3', 'voile-34')]:
    by_width(f'{name}.webp', f'{name}-300.webp', 300)

# Carte Nombre 1 de l'éventail de l'accueil
by_width('card-1.jpg', 'card-1.webp', 304)

# Grandes images affichées à ~380-500 px
for name in ('kyran-regles-estime', 'kyran-regles-joue', 'kyran-regles-tranche', 'kyran-cartes-table'):
    by_width(f'{name}.webp', f'{name}-760.webp', 760)
by_width('kyran-cartes-pouvoirs.webp', 'kyran-cartes-pouvoirs-880.webp', 880)
by_width('jeu-kyran-ami.webp', 'jeu-kyran-ami-560.webp', 560)
by_width('og-kyran.jpg', 'og-kyran-900.webp', 900)

# Logo (transparence conservée)
by_width('logo.png', 'logo-96.webp', 96, 85)
by_width('logo.png', 'logo-320.webp', 320, 85)

# Miniatures des galeries (140 px sur le petit côté)
for name in ('boite-recto-kyran', 'boite-verso-kyran', 'jeu-kyran-ami', 'kyran-cartes-table',
             'kyran-cartes-pouvoirs', 'kyran-regles-estime', 'kyran-regles-joue', 'kyran-regles-tranche'):
    thumb(f'{name}.webp', f'{name}-thumb.webp')

# Mini-jeu (minijeu.html) : cartes affichées à 96 px au plus → 200 px de large.
# card-3/11/20/27.jpg sont des cartes Pouvoir : on part des cartes Nombre recomposées.
CARDS = 'dojo/img/cartes'
for v in range(1, 38):
    src = f'dojo/img/nombre-{v}.jpg' if v in (3, 11, 20, 27) else f'card-{v}.jpg'
    by_width(src, f'{CARDS}/carte-{v}.webp', 200)
by_width('back.jpg', f'{CARDS}/dos.webp', 200)
for p in ('benediction-20', 'benediction-9', 'clairvoyance-11', 'clairvoyance-23',
          'sceau-27', 'sceau-4', 'voile-3', 'voile-34'):
    by_width(f'carte-pouvoir-{p}.webp', f'{CARDS}/pouvoir-{p}.webp', 200)

# Perles du collier d'initié
for c in ('bleue', 'jaune', 'mauve', 'mystique', 'orange', 'rouge', 'verte'):
    by_width(f'dojo/img/perle-{c}.png', f'dojo/img/perle-{c}.webp', 96, 85)

print(f'{made} image(s) générée(s).')
