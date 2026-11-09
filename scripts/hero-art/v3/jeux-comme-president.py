"""Image d'en-tête de « jeux-comme-president » : un trône en bois sculpté vu de face, une
couronne posée sur son coussin, une corbeille tressée où tombent des cartes lancées en arc,
le tout sur une natte tressée devant un mur de bogolan brun. Les six boîtes officielles
de l'article (Tichu, Scout, Gang of Four, Odin, Le Grand Dalmuti, Panda Spin) sont posées
sur la natte. La moitié gauche reste calme pour le titre. Aucun chiffre, aucun texte ajouté.

Usage : KYRAN_ASSETS=<dossier des PNG détourés> python scripts/hero-art/v3/jeux-comme-president.py <sortie.svg>
Les PNG sont obtenus depuis les URL de scripts/hero-art/assets-provenance/<id>.json
(fond blanc retiré par remplissage depuis les bords).
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from kyran_art import INK, SAF, SAFH, TERRA, CREAM, RED, ORANGE, GREEN, BLUE, VIOLET, svg, zig, card_back
import assets
assets.W = os.environ.get('KYRAN_ASSETS', assets.W)
from assets import img, size

OUT = sys.argv[1] if len(sys.argv) > 1 else 'jeux-comme-president.svg'
MUD = '#4A2C20'; MUDL = '#6B4231'; MUDD = '#3A2219'
WOOD = '#C98A3C'; WOODD = '#9C6326'; WOODL = '#DDA35A'


def rect(x, y, w, h, fill, stroke=INK, sw=5, rx=0, extra=''):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def path(d, fill='none', stroke=INK, sw=5, extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'


body = ''
# --- mur de bogolan brun : bandes de motifs crème, discrets à gauche --------------
FLOOR = 800
body += rect(-10, -10, 1940, FLOOR + 20, MUD, sw=0)
for j in range(7):
    y0 = 20 + j * 118
    op = '.32'
    # bande de zigzags
    body += path(f'M-20,{y0} ' + ' '.join(f'L{x},{y0 + (26 if (x // 52) % 2 else 0)}' for x in range(0, 1981, 52)),
                 stroke=CREAM, sw=4, extra=f'opacity="{op}"')
    # rangée de points et de croix alternés
    for i in range(20):
        x = 40 + i * 100 + (j % 2) * 50; y = y0 + 70
        if (i + j) % 2:
            body += f'<circle cx="{x}" cy="{y}" r="7" fill="{CREAM}" opacity="{op}"/>'
        else:
            body += path(f'M{x-11},{y-11} L{x+11},{y+11} M{x+11},{y-11} L{x-11},{y+11}', stroke=CREAM, sw=4, extra=f'opacity="{op}"')
# soleil gravé derrière le trône
SX, SY = 1250, 330
body += f'<circle cx="{SX}" cy="{SY}" r="300" fill="{MUDL}"/>'
body += zig(SX, SY, 300, 250, 34, stroke=SAFH, sw=6)
for r in (230, 200):
    body += f'<circle cx="{SX}" cy="{SY}" r="{r}" fill="none" stroke="{CREAM}" stroke-width="3" stroke-dasharray="10 12" opacity=".6"/>'

# --- natte tressée au sol ---------------------------------------------------------
body += path(f'M-20,{FLOOR} L1940,{FLOOR} L1940,1100 L-20,1100 Z', fill=SAF, sw=0)
body += path(f'M-20,{FLOOR} L1940,{FLOOR}', stroke=INK, sw=6)
for k in range(7):
    y = FLOOR + 22 + k * 40
    body += path(f'M-20,{y} ' + ' '.join(f'l40,{-10 if (i + k) % 2 else 10}' for i in range(50)), stroke=WOODD, sw=4, extra='opacity=".75"')
body += rect(-20, FLOOR + 6, 1960, 14, TERRA, sw=0)

# --- trône ------------------------------------------------------------------------
TX = 1250
th = ''
th += f'<ellipse cx="{TX}" cy="{FLOOR+52}" rx="250" ry="24" fill="{INK}" opacity=".3"/>'
# dossier
th += path(f'M{TX-140},620 L{TX-140},250 Q{TX-140},150 {TX},130 Q{TX+140},150 {TX+140},250 L{TX+140},620 Z', fill=TERRA, sw=7)
th += path(f'M{TX-105},610 L{TX-105},265 Q{TX-105},190 {TX},175 Q{TX+105},190 {TX+105},265 L{TX+105},610 Z', fill=SAF, sw=5)
th += zig(TX, 330, 74, 52, 12, fill=TERRA, stroke=INK, sw=4)
th += f'<circle cx="{TX}" cy="330" r="34" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
th += f'<polygon points="{TX},306 {TX+18},330 {TX},354 {TX-18},330" fill="{INK}"/>'
for k in range(5):
    y = 440 + k * 34
    th += path(f'M{TX-82},{y} ' + ' '.join(f'l{164/8:.1f},{-12 if i % 2 else 12}' for i in range(8)), stroke=INK, sw=4)
# montants et pommeaux
for sx in (-1, 1):
    x = TX + sx * 160
    th += rect(x - 22, 230, 44, 630, WOODD, sw=6, rx=8)
    for k in range(6):
        th += f'<line x1="{x-22}" y1="{300+k*90}" x2="{x+22}" y2="{300+k*90}" stroke="{INK}" stroke-width="4"/>'
    th += f'<circle cx="{x}" cy="212" r="30" fill="{SAFH}" stroke="{INK}" stroke-width="6"/>'
    th += f'<circle cx="{x}" cy="212" r="12" fill="{TERRA}" stroke="{INK}" stroke-width="3"/>'
# assise
th += rect(TX - 200, 610, 400, 54, WOOD, sw=7, rx=6)
th += rect(TX - 200, 664, 400, 70, TERRA, sw=6)
for k in range(9):
    x = TX - 178 + k * 44.5
    th += f'<polygon points="{x},{672} {x+20},{726} {x-20},{726}" fill="{[SAFH, CREAM][k % 2]}" stroke="{INK}" stroke-width="3"/>'
# pieds avant
for sx in (-1, 1):
    x = TX + sx * 178
    th += rect(x - 18, 734, 36, 128, WOODD, sw=6, rx=6)
# coussin
th += path(f'M{TX-150},612 Q{TX-160},560 {TX-110},556 L{TX+110},556 Q{TX+160},560 {TX+150},612 Z', fill=RED, sw=6)
th += path(f'M{TX-120},584 L{TX+120},584', stroke=CREAM, sw=4, extra='stroke-dasharray="10 9" opacity=".85"')
for sx in (-1, 1):
    th += f'<circle cx="{TX+sx*152}" cy="606" r="9" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
# couronne posée sur le coussin
CY = 548
cr = path(f'M{TX-78},{CY} L{TX-92},{CY-96} L{TX-46},{CY-52} L{TX},{CY-112} L{TX+46},{CY-52} L{TX+92},{CY-96} L{TX+78},{CY} Z', fill=SAFH, sw=6)
cr += rect(TX - 82, CY - 14, 164, 26, SAF, sw=5, rx=6)
for x, c in ((TX - 50, RED), (TX, GREEN), (TX + 50, BLUE)):
    cr += f'<polygon points="{x},{CY-9} {x+9},{CY-1} {x},{CY+7} {x-9},{CY-1}" fill="{c}" stroke="{INK}" stroke-width="2.5"/>'
for x, y in ((TX - 92, CY - 96), (TX, CY - 112), (TX + 92, CY - 96)):
    cr += f'<circle cx="{x}" cy="{y}" r="11" fill="{CREAM}" stroke="{INK}" stroke-width="4"/>'
th += cr
body += th

# --- cartes lancées en arc vers la corbeille --------------------------------------
BX, BTOP = 1690, 690
colors = [RED, ORANGE, GREEN, BLUE, VIOLET, SAF]
arc = ''
# trajectoire pointillée
arc += path(f'M1455,175 Q1700,90 {BX-10},{BTOP-40}', stroke=CREAM, sw=4, extra='stroke-dasharray="4 16" opacity=".8"')
for k, t in enumerate((0.0, 0.2, 0.4, 0.6, 0.8, 0.96)):
    x = (1 - t) ** 2 * 1455 + 2 * (1 - t) * t * 1700 + t ** 2 * (BX - 10)
    y = (1 - t) ** 2 * 175 + 2 * (1 - t) * t * 90 + t ** 2 * (BTOP - 40)
    rot = -40 + k * 34
    arc += f'<g transform="translate({x:.0f},{y:.0f}) rotate({rot})">{card_back(70, 100, colors[k])}</g>'
body += arc

# --- corbeille tressée -----------------------------------------------------------
bk = f'<ellipse cx="{BX}" cy="{FLOOR+62}" rx="160" ry="20" fill="{INK}" opacity=".3"/>'
# cartes qui dépassent du bord
for k, (dx, rot, c) in enumerate(((-70, -18, BLUE), (-20, 6, ORANGE), (40, -8, GREEN), (85, 20, VIOLET))):
    bk += f'<g transform="translate({BX+dx},{BTOP-10}) rotate({rot})">{card_back(66, 96, c)}</g>'
bk += path(f'M{BX-150},{BTOP} L{BX-118},{FLOOR+58} L{BX+118},{FLOOR+58} L{BX+150},{BTOP} Z', fill=WOODL, sw=7)
for k in range(5):
    y = BTOP + 18 + k * 33
    bk += path(f'M{BX-146+k*6},{y} ' + ' '.join(f'l{(292-k*12)/10:.1f},{-8 if (i + k) % 2 else 8}' for i in range(10)), stroke=WOODD, sw=5)
for k in range(7):
    x = BX - 120 + k * 40
    bk += path(f'M{x},{BTOP+6} L{x*0.86+BX*0.14:.1f},{FLOOR+52}', stroke=TERRA, sw=4, extra='opacity=".8"')
bk += f'<ellipse cx="{BX}" cy="{BTOP}" rx="152" ry="22" fill="none" stroke="{INK}" stroke-width="8"/>'
bk += f'<ellipse cx="{BX}" cy="{BTOP}" rx="152" ry="22" fill="none" stroke="{SAFH}" stroke-width="3"/>'
body += bk

# --- boîtes officielles posées sur la natte ---------------------------------------
PLACES = [  # id, cx, cy, hauteur, rotation
    ('tichu', 880, 868, 270, -3),
    ('scout', 1040, 880, 250, 3),
    ('odin', 1478, 878, 250, 2),
    ('panda-spin', 1822, 900, 250, -3),
    ('gang-of-four', 1268, 958, 190, -2),
    ('grand-dalmuti', 1648, 956, 200, 4),
]
# les visuels officiels restent hors du filtre de bords irréguliers et du grain :
# aucune déformation, seulement mise à l'échelle et légère rotation
boxes = ''.join(img(i, cx, cy, h, rot) for i, cx, cy, h, rot in PLACES)
svgtxt = svg(body, seed=11)
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
