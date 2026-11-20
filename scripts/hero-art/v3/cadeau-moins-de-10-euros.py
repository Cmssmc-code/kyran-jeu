"""Image d'en-tête de « cadeau-moins-de-10-euros » : une petite luge en bois tirée sur la neige
d'un village au crépuscule, chargée des six boîtes officielles de l'article (KYRAN, Megalopolis,
Monopoly Deal, Dobble, Timeline, Love Letter), debout côte à côte sur le plateau. Sa corde
traîne vers la gauche, où la place reste calme pour le titre. Ciel corail et safran, soleil
bas gravé, collines enneigées, sapins géométriques, maisons aux fenêtres allumées.
Aucun texte, aucun chiffre, aucun prix ajouté.

Usage : KYRAN_ASSETS=<dossier des PNG détourés> python scripts/hero-art/v3/cadeau-moins-de-10-euros.py <sortie.svg>
Les PNG sont obtenus depuis les URL de scripts/hero-art/assets-provenance/<id>.json
(fond blanc retiré par remplissage depuis les bords, puis rognage au contenu ; KYRAN vient de
/boite-recto-kyran.jpg du dépôt).
"""
import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from kyran_art import INK, SAF, SAFH, TERRA, CREAM, RED, ORANGE, GREEN, BLUE, VIOLET, svg, zig
import assets
assets.W = os.environ.get('KYRAN_ASSETS', assets.W)
from assets import img, size

OUT = sys.argv[1] if len(sys.argv) > 1 else 'cadeau-moins-de-10-euros.svg'
random.seed(10)
SNOW = '#F4F1EA'; SNOWS = '#C9C6D9'; SNOWD = '#A9A3C4'
WOOD = '#C98A3C'; WOODD = '#8E5824'; WOODL = '#DDA35A'
PINE = '#1F6B45'; PINED = '#174F34'


def rect(x, y, w, h, fill, stroke=INK, sw=5, rx=0, extra=''):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def path(d, fill='none', stroke=INK, sw=5, extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'


def pine(x, base, h, col=PINE):
    """Sapin géométrique à trois étages, avec des zigzags crème sur chaque étage."""
    s = rect(x - h * 0.05, base - h * 0.12, h * 0.1, h * 0.14, WOODD, sw=3)
    for k in range(3):
        top = base - h + k * h * 0.26
        bot = base - h * 0.1 - (2 - k) * h * 0.2
        w = h * (0.2 + k * 0.1)
        s += path(f'M{x},{top} L{x + w},{bot} L{x - w},{bot} Z', fill=[col, PINED][k % 2], sw=4)
        s += path(f'M{x - w * 0.6},{bot - 10} ' + ' '.join(f'l{w * 1.2 / 6:.1f},{-8 if i % 2 else 8}' for i in range(6)),
                  stroke=CREAM, sw=3, extra='opacity=".8"')
    return s


def house(x, base, w, h, wall, roof):
    s = rect(x, base - h, w, h, wall, sw=4)
    s += path(f'M{x - 14},{base - h} L{x + w / 2},{base - h - w * 0.45} L{x + w + 14},{base - h} Z', fill=roof, sw=4)
    s += path(f'M{x - 14},{base - h} L{x + w / 2},{base - h - w * 0.45} L{x + w + 14},{base - h} Q{x + w / 2},{base - h - 16} {x - 14},{base - h} Z',
              fill=SNOW, sw=3)
    s += rect(x + w * 0.2, base - h * 0.62, w * 0.24, h * 0.3, SAFH, sw=3)
    s += rect(x + w * 0.58, base - h * 0.62, w * 0.24, h * 0.3, SAFH, sw=3)
    s += rect(x + w * 0.4, base - h * 0.3, w * 0.2, h * 0.3, WOODD, sw=3)
    return s


body = ''
# --- ciel du crépuscule : bandes corail, safran clair ------------------------------
bands = ['#7A3B6B', '#A2456A', '#C95A5E', '#E07A55', '#EE9D52', '#F2C14E']
for k, c in enumerate(bands):
    body += rect(-20, -20 + k * 110, 1960, 140, c, sw=0)
# liserés en zigzag entre les bandes du ciel (motif de pagne)
for k in range(1, len(bands)):
    y = -20 + k * 110
    body += path(f'M-20,{y} ' + ' '.join(f'l40,{-9 if i % 2 else 9}' for i in range(50)),
                 stroke=CREAM, sw=3, extra='opacity=".45"')
# soleil bas, gravé d'arcs et de zigzags
SX, SY = 1330, 560
body += f'<circle cx="{SX}" cy="{SY}" r="250" fill="{SAFH}" opacity=".35"/>'
body += zig(SX, SY, 220, 190, 30, stroke=CREAM, sw=5)
body += f'<circle cx="{SX}" cy="{SY}" r="165" fill="{SAFH}" stroke="{INK}" stroke-width="5"/>'
for r in (130, 100, 70):
    body += f'<circle cx="{SX}" cy="{SY}" r="{r}" fill="none" stroke="{TERRA}" stroke-width="4" stroke-dasharray="12 10" opacity=".7"/>'
body += f'<circle cx="{SX}" cy="{SY}" r="34" fill="{ORANGE}" stroke="{INK}" stroke-width="4"/>'
# rangées de points dans le ciel (motif de tissu)
for j in range(3):
    for i in range(24):
        x = 30 + i * 82 + (j % 2) * 41; y = 60 + j * 70
        if abs(x - SX) < 280 and y > SY - 280:
            continue
        body += f'<circle cx="{x}" cy="{y}" r="5" fill="{CREAM}" opacity=".35"/>'

# --- collines lointaines et village ---------------------------------------------
body += path('M-20,640 Q300,560 640,620 T1300,600 T1940,610 L1940,1100 L-20,1100 Z', fill=SNOWS, sw=5)
body += house(1560, 640, 120, 92, TERRA, VIOLET)
body += house(1720, 628, 100, 80, SAF, TERRA)
body += house(260, 622, 104, 80, BLUE, TERRA)
body += house(420, 632, 90, 70, TERRA, INK)
for x, b, h in [(120, 640, 150), (610, 640, 120), (1080, 626, 130), (1880, 640, 160), (1450, 650, 110)]:
    body += pine(x, b, h)
# colline proche, neige
GROUND = 760
body += path(f'M-20,{GROUND - 40} Q500,{GROUND - 100} 980,{GROUND - 30} T1940,{GROUND - 50} L1940,1100 L-20,1100 Z', fill=SNOW, sw=5)
# ombres bleutées et sillons dans la neige
for k in range(5):
    y = GROUND + 30 + k * 62
    body += path(f'M-20,{y} Q480,{y - 22} 960,{y} T1940,{y}', stroke=SNOWS, sw=5, extra='opacity=".9"')
# rangée de chevrons dans la neige, à gauche, sous la place du titre
for i in range(9):
    x = 60 + i * 72
    body += path(f'M{x},{GROUND + 80} l18,-16 l18,16', stroke=SNOWD, sw=4, extra='opacity=".8"')
# traces de luge qui viennent de la gauche
for dy in (0, 26):
    body += path(f'M-20,{1000 + dy} C300,{990 + dy} 560,{990 + dy} 840,{984 + dy}', stroke=SNOWD, sw=6)

# --- luge en bois ----------------------------------------------------------------
L0, L1 = 790, 1900       # plateau
DECK = 900                # dessus du plateau
RUN = 990                 # patins
sl = ''
sl += f'<ellipse cx="{(L0 + L1) / 2}" cy="{RUN + 24}" rx="{(L1 - L0) / 2 + 40}" ry="22" fill="{SNOWD}" opacity=".8"/>'
# patins (avant relevé à gauche)
for dz, col in ((-10, WOODD), (0, TERRA)):
    sl += path(f'M{L1 + 10},{RUN + dz} L{L0 + 20},{RUN + dz} C{L0 - 60},{RUN + dz} {L0 - 90},{RUN - 40 + dz} {L0 - 70},{DECK - 50 + dz} '
               f'C{L0 - 58},{DECK - 80 + dz} {L0 - 20},{DECK - 70 + dz} {L0 - 30},{DECK - 40 + dz}',
               stroke=INK, sw=24)
    sl += path(f'M{L1 + 10},{RUN + dz} L{L0 + 20},{RUN + dz} C{L0 - 60},{RUN + dz} {L0 - 90},{RUN - 40 + dz} {L0 - 70},{DECK - 50 + dz} '
               f'C{L0 - 58},{DECK - 80 + dz} {L0 - 20},{DECK - 70 + dz} {L0 - 30},{DECK - 40 + dz}',
               stroke=col, sw=14)
# montants entre patins et plateau
for i in range(7):
    x = L0 + 40 + i * (L1 - L0 - 80) / 6
    sl += rect(x - 14, DECK + 20, 28, RUN - DECK - 26, WOOD, sw=4)
    sl += f'<circle cx="{x}" cy="{DECK + 50}" r="5" fill="{INK}"/>'
# plateau à lattes, bord décoré de zigzags et de losanges
sl += rect(L0, DECK, L1 - L0, 34, WOODL, sw=6, rx=6)
for i in range(1, 14):
    x = L0 + i * (L1 - L0) / 14
    sl += f'<line x1="{x:.1f}" y1="{DECK + 3}" x2="{x:.1f}" y2="{DECK + 31}" stroke="{WOODD}" stroke-width="3"/>'
sl += path(f'M{L0 + 16},{DECK + 17} ' + ' '.join(f'l{(L1 - L0 - 32) / 40:.2f},{-7 if i % 2 else 7}' for i in range(40)),
           stroke=TERRA, sw=3)
body += sl
# corde : de l'avant relevé, elle retombe et serpente sur la neige vers la gauche
rope = (f'M{L0 - 40},{DECK - 60} C{L0 - 120},{DECK - 20} {L0 - 160},{RUN + 20} {L0 - 260},{RUN + 30} '
        f'C{L0 - 360},{RUN + 40} {L0 - 330},{RUN - 30} {L0 - 430},{RUN - 10} C{L0 - 500},{RUN} {L0 - 520},{RUN + 40} {L0 - 470},{RUN + 52}')
body += path(rope, stroke=INK, sw=13) + path(rope, stroke=RED, sw=7) + path(rope, stroke=CREAM, sw=2, extra='stroke-dasharray="6 10"')
body += f'<circle cx="{L0 - 40}" cy="{DECK - 60}" r="11" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'

# flocons
for _ in range(90):
    x = random.randint(10, 1910); y = random.randint(10, 1060)
    if L0 - 20 < x < L1 + 20 and 560 < y < RUN + 30:
        continue
    body += f'<circle cx="{x}" cy="{y}" r="{random.choice([3, 4, 5, 6])}" fill="{CREAM}" opacity=".75"/>'

# --- les six boîtes officielles, debout sur le plateau --------------------------
ORDER = [('kyran', 215), ('love-letter', 225), ('timeline', 200), ('monopoly-deal', 205), ('dobble', 168), ('megalopolis', 150)]
GAP = 14
widths = [h * size(i)[0] / size(i)[1] for i, h in ORDER]
x = L0 + ((L1 - L0) - sum(widths) - GAP * (len(ORDER) - 1)) / 2
PLACES = []
rots = [-1.5, 1.2, -0.8, 1.0, 0, -1.0]
for (i, h), w, r in zip(ORDER, widths, rots):
    PLACES.append((i, x + w / 2, DECK - h / 2 + 2, h, r))
    x += w + GAP
# les visuels officiels restent hors du filtre de bords irréguliers et du grain :
# aucune déformation, seulement mise à l'échelle et légère rotation
boxes = ''.join(img(i, cx, cy, h, rot) for i, cx, cy, h, rot in PLACES)
svgtxt = svg(body, seed=10)
assert svgtxt.count('</svg>') == 1
svgtxt = svgtxt.replace('</svg>', boxes + '\n</svg>')
open(OUT, 'w', encoding='utf-8').write(svgtxt)


def bb(i, cx, cy, h):
    w0, h0 = size(i); w = h * w0 / h0
    return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)


for p in PLACES:
    x0, y0, x1, y1 = bb(*p[:4])
    assert x0 >= -5 and y0 >= 0 and x1 <= 1925 and y1 <= 1080, (p[0], 'hors cadre', x0, y0, x1, y1)
    print(f'{p[0]:14s} {x0:.0f},{y0:.0f} -> {x1:.0f},{y1:.0f}')
print('écrit', OUT)
