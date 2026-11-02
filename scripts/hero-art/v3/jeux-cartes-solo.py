"""Image d'en-tête de « jeux-cartes-solo » : banquette sous une fenêtre à l'aube,
une patience étalée sur le coussin, une tasse fumante et les boîtes officielles
de Vendredi, Onirim, The Game, Palm Island et Megalopolis.

Usage : KYRAN_ASSETS=<dossier des PNG détourés> python scripts/hero-art/v3/jeux-cartes-solo.py <sortie.svg>
Les PNG sont obtenus depuis les URL de scripts/hero-art/assets-provenance/<id>.json
(fond blanc retiré par remplissage depuis les bords).
"""
import os, sys, math, random
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.dirname(HERE))
from kyran_art import INK, SAF, SAFH, TERRA, CREAM, RED, ORANGE, GREEN, BLUE, VIOLET, card_back, svg, zig
import assets
assets.W = os.environ.get('KYRAN_ASSETS', assets.W)
from assets import img, size

random.seed(11)
OUT = sys.argv[1] if len(sys.argv) > 1 else 'jeux-cartes-solo.svg'

def rect(x, y, w, h, fill, stroke=INK, sw=5, rx=0, extra=''):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'

def path(d, fill='none', stroke=INK, sw=5, extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'

body = ''
# --- mur : motif de losanges gravés -------------------------------------------
for j in range(12):
    for i in range(22):
        x = 40 + i * 90 + (j % 2) * 45; y = 30 + j * 70
        body += f'<polygon points="{x},{y-12} {x+12},{y} {x},{y+12} {x-12},{y}" fill="none" stroke="{SAF}" stroke-width="2.5" opacity=".35"/>'

# --- fenêtre cintrée à l'aube ----------------------------------------------------
WX, WY, WW, WH = 150, 70, 860, 640
arch = f'M{WX},{WY+WH} L{WX},{WY+WW/2} A{WW/2},{WW/2} 0 0 1 {WX+WW},{WY+WW/2} L{WX+WW},{WY+WH} Z'
body += f'<clipPath id="win"><path d="{arch}"/></clipPath>'
body += '<defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">' \
        f'<stop offset="0" stop-color="{VIOLET}" stop-opacity=".55"/><stop offset=".45" stop-color="{ORANGE}" stop-opacity=".75"/>' \
        f'<stop offset="1" stop-color="{SAFH}"/></linearGradient></defs>'
sky = f'<rect x="{WX}" y="{WY}" width="{WW}" height="{WH}" fill="url(#dawn)"/>'
sx, sy = WX + WW * 0.58, WY + WH - 150
sky += f'<circle cx="{sx}" cy="{sy}" r="120" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
sky += zig(sx, sy, 175, 150, 18, stroke=CREAM, sw=4)
for k in range(4):
    y = WY + 120 + k * 46
    sky += path(f'M{WX+60+k*70},{y} q60,-22 120,0 t120,0', stroke=CREAM, sw=4, extra='opacity=".7"')
sky += path(f'M{WX},{WY+WH-110} C{WX+200},{WY+WH-210} {WX+330},{WY+WH-90} {WX+520},{WY+WH-160} '
            f'C{WX+660},{WY+WH-210} {WX+760},{WY+WH-120} {WX+WW},{WY+WH-170} L{WX+WW},{WY+WH} L{WX},{WY+WH} Z',
            fill=TERRA, sw=4)
sky += path(f'M{WX},{WY+WH-50} C{WX+240},{WY+WH-120} {WX+480},{WY+WH-30} {WX+WW},{WY+WH-90} L{WX+WW},{WY+WH} L{WX},{WY+WH} Z',
            fill=GREEN, sw=4)
for i in range(7):
    x = WX + 70 + i * 120; y = WY + WH - 70 - (i % 3) * 18
    sky += f'<g transform="translate({x},{y})"><rect x="-3" y="0" width="6" height="34" fill="{INK}"/><polygon points="0,-44 20,4 -20,4" fill="{INK}"/></g>'
body += f'<g clip-path="url(#win)">{sky}</g>'
# huisserie et croisillons
body += path(arch, stroke=INK, sw=16)
body += path(arch, stroke=SAFH, sw=5)
body += f'<g clip-path="url(#win)"><line x1="{WX+WW/2}" y1="{WY}" x2="{WX+WW/2}" y2="{WY+WH}" stroke="{INK}" stroke-width="12"/>' \
        f'<line x1="{WX}" y1="{WY+WW/2}" x2="{WX+WW}" y2="{WY+WW/2}" stroke="{INK}" stroke-width="12"/></g>'
# rideau noué à gauche
body += path(f'M{WX-70},{WY-20} C{WX-30},{WY+200} {WX+40},{WY+330} {WX+10},{WY+440} C{WX-10},{WY+520} {WX-40},{WY+600} {WX-90},{WY+700} L{WX-120},{WY+700} L{WX-120},{WY-20} Z',
             fill=TERRA, sw=5)
for k in range(5):
    body += path(f'M{WX-100+k*14},{WY} C{WX-80+k*18},{WY+200} {WX-40+k*14},{WY+340} {WX-60+k*10},{WY+440}', stroke=SAFH, sw=3, extra='opacity=".7"')
body += rect(WX - 40, WY + 420, 70, 30, SAF, sw=4, rx=12)
# tringle
body += rect(WX - 140, WY - 34, WW + 280, 18, INK, sw=0, rx=9)
body += f'<circle cx="{WX-150}" cy="{WY-25}" r="20" fill="{SAFH}" stroke="{INK}" stroke-width="4"/><circle cx="{WX+WW+150}" cy="{WY-25}" r="20" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'

# --- banquette et coussin --------------------------------------------------------
SEAT_Y = 760
body += rect(-20, SEAT_Y - 30, 1960, 60, '#C98A3C', sw=6, rx=8)
body += rect(-20, SEAT_Y + 30, 1960, 340, TERRA, sw=6)
for i in range(0, 1960, 120):
    body += zig(i + 60, SEAT_Y + 190, 34, 20, 8, stroke=CREAM, sw=3)
body += path(f'M-20,{SEAT_Y+110} ' + ' '.join(f'L{x},{SEAT_Y+110+(16 if (x//40)%2 else 0)}' for x in range(0, 1981, 40)), stroke=SAFH, sw=4)
body += path(f'M-20,{SEAT_Y+270} ' + ' '.join(f'L{x},{SEAT_Y+270+(16 if (x//40)%2 else 0)}' for x in range(0, 1981, 40)), stroke=SAFH, sw=4)

# --- patience étalée (sept colonnes en cascade) ----------------------------------
COLS = [RED, ORANGE, SAF, GREEN, BLUE, VIOLET, TERRA]
cw, ch = 96, 136
px0, py0 = 210, SEAT_Y + 40
pat = ''
for c in range(7):
    x = px0 + c * 118
    for r in range(c + 1):
        y = py0 + r * 26
        pat += f'<g transform="translate({x},{y}) rotate({random.uniform(-2,2):.1f})">{card_back(cw, ch, COLS[(c + r) % 7])}</g>'
# pioche et défausse au-dessus de la cascade, sur le rebord
pat += f'<g transform="translate({px0},{SEAT_Y-60}) rotate(-4)">{card_back(cw*.8, ch*.8, INK)}</g>'
body += f'<g transform="translate(0,0)">{pat}</g>'

# --- tasse fumante ---------------------------------------------------------------
mx, my = 1050, SEAT_Y - 40
body += path(f'M{mx+60},{my-60} q46,0 46,40 q0,40 -46,40', stroke=INK, sw=12)
body += path(f'M{mx-60},{my-100} L{mx+60},{my-100} L{mx+52},{my+10} Q{mx},{my+30} {mx-52},{my+10} Z', fill=BLUE, sw=5)
body += zig(mx, my - 45, 26, 16, 7, stroke=CREAM, sw=3)
body += f'<ellipse cx="{mx}" cy="{my+18}" rx="90" ry="16" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
for k in (-24, 4, 32):
    body += path(f'M{mx+k},{my-120} q-18,-30 0,-60 q18,-30 0,-60', stroke=INK, sw=4, extra='opacity=".55"')

# --- boîtes officielles ----------------------------------------------------------
PLACES = [  # id, cx, cy, hauteur, rotation (arrière puis avant)
    ('onirim', 1330, 575, 370, -2),
    ('vendredi', 1665, 600, 330, 3),
    ('the-game', 1235, 830, 320, -3),
    ('palm-island', 1500, 845, 290, 2),
    ('megalopolis', 1745, 925, 160, -6),
]
boxes = ''
for i, cx, cy, h, rot in PLACES:
    boxes += img(i, cx, cy, h, rot)
body += boxes

svgtxt = svg(body, seed=5)
open(OUT, 'w', encoding='utf-8').write(svgtxt)

# --- contrôles géométriques (pas de relecture visuelle possible) -----------------
def bb(i, cx, cy, h):
    w0, h0 = size(i); w = h * w0 / h0
    return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)
B = {p[0]: bb(*p[:4]) for p in PLACES}
for k, (x0, y0, x1, y1) in B.items():
    assert x0 >= 0 and y0 >= 0 and x1 <= 1920 and y1 <= 1080, (k, 'hors cadre')
for a in B:
    ax0, ay0, ax1, ay1 = B[a]; area = (ax1 - ax0) * (ay1 - ay0); cov = 0
    for b in B:
        if a == b: continue
        bx0, by0, bx1, by1 = B[b]
        cov += max(0, min(ax1, bx1) - max(ax0, bx0)) * max(0, min(ay1, by1) - max(ay0, by0))
    print(f'{a:12s} boîte {ax1-ax0:.0f}x{ay1-ay0:.0f} recouvrement max {100*cov/area:.0f} %')
print('écrit', OUT)
