"""Image d'en-tête de « prix-jeux-de-cartes-releve » : une balance de Roberval sur un
comptoir, les boîtes officielles de Dixit et de Trio sur un plateau, des piles de
pièces sur l'autre, une pièce qui tombe, une loupe posée devant ; The Mind, Flip 7,
Uno et Dobble à droite. La moitié gauche reste calme pour le titre. Aucun chiffre, aucun texte.

Usage : KYRAN_ASSETS=<dossier des PNG détourés> python scripts/hero-art/v3/prix-jeux-de-cartes-releve.py <sortie.svg>
Les PNG sont obtenus depuis les URL de scripts/hero-art/assets-provenance/<id>.json
(fond blanc retiré par remplissage depuis les bords).
"""
import os, sys, random
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from kyran_art import INK, SAF, SAFH, TERRA, CREAM, RED, ORANGE, GREEN, BLUE, VIOLET, svg, zig
import assets
assets.W = os.environ.get('KYRAN_ASSETS', assets.W)
from assets import img, size

random.seed(23)
OUT = sys.argv[1] if len(sys.argv) > 1 else 'prix-jeux-de-cartes-releve.svg'
TEAL = '#1F6F78'; TEALD = '#185A62'; TEALL = '#2E8C96'
WOOD = '#C98A3C'; WOODD = '#9C6326'


def rect(x, y, w, h, fill, stroke=INK, sw=5, rx=0, extra=''):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def path(d, fill='none', stroke=INK, sw=5, extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'


body = ''
# --- mur bleu-vert gravé ---------------------------------------------------------
body += rect(-10, -10, 1940, 860, TEAL, sw=0)
for j in range(9):
    y = 40 + j * 92
    body += path(f'M-20,{y} ' + ' '.join(f'L{x},{y + (22 if (x // 48) % 2 else 0)}' for x in range(0, 1981, 48)),
                 stroke=TEALL, sw=4, extra='opacity=".75"')
for j in range(9):
    for i in range(21):
        x = 24 + i * 96 + (j % 2) * 48; y = 86 + j * 92
        body += f'<circle cx="{x}" cy="{y}" r="5" fill="{TEALD}"/>'
# grand soleil gravé derrière la balance (teinte du mur, pour détacher les plateaux)
SX, SY = 1150, 300
body += zig(SX, SY, 300, 240, 30, stroke=SAFH, sw=6)
body += f'<circle cx="{SX}" cy="{SY}" r="225" fill="{TEALD}" stroke="{INK}" stroke-width="6"/>'
body += f'<circle cx="{SX}" cy="{SY}" r="185" fill="none" stroke="{CREAM}" stroke-width="4" stroke-dasharray="10 12"/>'
body += f'<circle cx="{SX}" cy="{SY}" r="130" fill="none" stroke="{SAFH}" stroke-width="5"/>'
body += zig(SX, SY, 92, 64, 14, stroke=ORANGE, sw=5)

# --- comptoir : plateau en bois vu de face, puis façade gravée ----------------------
TOP = 830; EDGE = 965
body += rect(-20, TOP - 26, 1960, EDGE - TOP + 26, WOOD, sw=6)
for k, yy in enumerate((TOP + 20, TOP + 62, TOP + 104)):
    body += path(f'M-20,{yy} ' + ' '.join(f'q80,{-8 if (i + k) % 2 else 8} 160,0' for i in range(13)), stroke=WOODD, sw=3, extra='opacity=".7"')
body += rect(-20, EDGE, 1960, 140, TERRA, sw=6)
for i in range(0, 1960, 140):
    body += zig(i + 70, EDGE + 62, 34, 20, 8, stroke=CREAM, sw=3)
for yy in (EDGE + 18, EDGE + 106):
    body += path(f'M-20,{yy} ' + ' '.join(f'L{x},{yy + (14 if (x // 40) % 2 else 0)}' for x in range(0, 1981, 40)), stroke=SAFH, sw=4)

# --- balance de Roberval ---------------------------------------------------------
CX = 1150; PL = 925; PR = 1375; PY = 560
bal = ''
# ombre portée
bal += f'<ellipse cx="{CX}" cy="{TOP-6}" rx="330" ry="22" fill="{INK}" opacity=".28"/>'
# socle
bal += path(f'M{CX-300},{TOP-12} L{CX-250},{PY+110} L{CX+250},{PY+110} L{CX+300},{TOP-12} Z', fill=CREAM, sw=7)
bal += path(f'M{CX-270},{TOP-40} L{CX+270},{TOP-40}', stroke=TERRA, sw=10)
for k in range(9):
    x = CX - 200 + k * 50
    bal += f'<polygon points="{x},{TOP-80} {x+18},{TOP-62} {x},{TOP-44} {x-18},{TOP-62}" fill="{[RED, ORANGE, SAF, GREEN, BLUE, VIOLET, TERRA, RED, ORANGE][k]}" stroke="{INK}" stroke-width="3"/>'
# fenêtre de l'aiguille (graduations sans chiffres)
bal += path(f'M{CX-90},{PY+190} A100,100 0 0 1 {CX+90},{PY+190} Z', fill=INK, sw=4)
for k in range(-4, 5):
    import math
    a = math.radians(-90 + k * 16)
    x0 = CX + 78 * math.cos(a); y0 = PY + 190 + 78 * math.sin(a)
    x1 = CX + 64 * math.cos(a); y1 = PY + 190 + 64 * math.sin(a)
    bal += f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{CREAM}" stroke-width="{4 if k == 0 else 2.5}"/>'
bal += f'<line x1="{CX}" y1="{PY+190}" x2="{CX}" y2="{PY+108}" stroke="{RED}" stroke-width="6" stroke-linecap="round"/>'
bal += f'<circle cx="{CX}" cy="{PY+190}" r="9" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
# fléau (capot) et colonnes
bal += path(f'M{PL-30},{PY+112} L{PL+10},{PY+70} L{PR-10},{PY+70} L{PR+30},{PY+112} Z', fill=WOOD, sw=6)
bal += rect(PL - 22, PY + 18, 44, 70, WOODD, sw=5, rx=6)
bal += rect(PR - 22, PY + 18, 44, 70, WOODD, sw=5, rx=6)
bal += f'<circle cx="{CX}" cy="{PY+88}" r="16" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
# plateaux
for px in (PL, PR):
    bal += f'<ellipse cx="{px}" cy="{PY+26}" rx="200" ry="34" fill="{SAF}" stroke="{INK}" stroke-width="6"/>'
    bal += f'<ellipse cx="{px}" cy="{PY+14}" rx="196" ry="30" fill="{SAFH}" stroke="{INK}" stroke-width="5"/>'
    bal += f'<ellipse cx="{px}" cy="{PY+14}" rx="150" ry="20" fill="none" stroke="{CREAM}" stroke-width="3" stroke-dasharray="9 8"/>'
body += bal


# --- pièces empilées sur le plateau droit ----------------------------------------
def coin_stack(x, base_y, n, r=46):
    s = f'<ellipse cx="{x+4}" cy="{base_y+6}" rx="{r+6}" ry="{r*0.36+3}" fill="{INK}" opacity=".25"/>'
    for k in range(n):
        y = base_y - k * 15
        s += path(f'M{x-r},{y} L{x-r},{y-12} A{r},{r*0.36} 0 0 1 {x+r},{y-12} L{x+r},{y} A{r},{r*0.36} 0 0 1 {x-r},{y} Z', fill=SAF, sw=4)
        s += f'<ellipse cx="{x}" cy="{y-12}" rx="{r}" ry="{r*0.36:.1f}" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
    top = base_y - (n - 1) * 15 - 12
    s += f'<ellipse cx="{x}" cy="{top}" rx="{r*0.66:.1f}" ry="{r*0.24:.1f}" fill="none" stroke="{INK}" stroke-width="2.5"/>'
    s += f'<polygon points="{x},{top-9} {x+16},{top} {x},{top+9} {x-16},{top}" fill="{INK}"/>'
    return s


coins = coin_stack(PR - 95, PY + 22, 7) + coin_stack(PR + 10, PY + 30, 10) + coin_stack(PR + 110, PY + 20, 5)
# une pièce debout, penchée
coins += f'<g transform="translate({PR+10},{PY-240}) rotate(-14)"><circle r="40" fill="{SAFH}" stroke="{INK}" stroke-width="5"/><circle r="27" fill="none" stroke="{INK}" stroke-width="3"/><polygon points="0,-15 11,0 0,15 -11,0" fill="{INK}"/></g>'
coins += path(f'M{PR+10},{PY-340} v34 M{PR-14},{PY-326} v22 M{PR+34},{PY-326} v22', stroke=CREAM, sw=5, extra='opacity=".85"')
body += coins

# --- boîtes officielles ----------------------------------------------------------
PLACES = [  # id, cx, cy, hauteur, rotation (arrière puis avant)
    ('dixit', PL - 60, PY - 110, 250, -3),
    ('trio', PL + 95, PY - 85, 205, 4),
    ('flip-7', 1795, TOP - 160, 330, 3),
    ('the-mind', 1640, TOP - 130, 270, -3),
    ('uno', 1500, EDGE - 112, 225, -4),
    ('dobble', 1735, EDGE - 62, 140, -5),
]
boxes = ''
for i, cx, cy, h, rot in PLACES:
    boxes += img(i, cx, cy, h, rot)
body += boxes

# --- loupe posée sur le comptoir -------------------------------------------------
lx, ly = 860, EDGE - 40
lou = f'<g transform="translate({lx},{ly}) rotate(-24)">'
lou += f'<ellipse cx="8" cy="18" rx="150" ry="40" fill="{INK}" opacity=".25"/>'
lou += rect(80, -18, 190, 36, INK, sw=0, rx=18) + rect(90, -11, 170, 22, WOODD, sw=0, rx=11)
lou += f'<circle r="92" fill="{CREAM}" fill-opacity=".35" stroke="{INK}" stroke-width="16"/>'
lou += f'<circle r="92" fill="none" stroke="{SAFH}" stroke-width="5"/>'
lou += path('M-50,-40 A64,64 0 0 1 -6,-64', stroke=CREAM, sw=8, extra='opacity=".9"')
lou += '</g>'
body += lou

svgtxt = svg(body, seed=9)
open(OUT, 'w', encoding='utf-8').write(svgtxt)


# --- contrôles géométriques -------------------------------------------------------
def bb(i, cx, cy, h):
    w0, h0 = size(i); w = h * w0 / h0
    return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)


B = {p[0]: bb(*p[:4]) for p in PLACES}
for k, (x0, y0, x1, y1) in B.items():
    assert x0 >= -5 and y0 >= 0 and x1 <= 1925 and y1 <= 1080, (k, 'hors cadre', x0, y0, x1, y1)
    print(f'{k:13s} {x0:.0f},{y0:.0f} -> {x1:.0f},{y1:.0f}')
print('écrit', OUT)
