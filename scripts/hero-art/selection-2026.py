"""Illustrations des articles « sélections » de fin 2026 (sans texte ni logo, 1920x1080).

Usage : python selection-2026.py  (écrit les SVG à côté du script ; le rendu JPG/WebP 1200x675 est
fait avec Chromium puis PIL, comme les autres images de blog/images/).
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kyran_art import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))


def star(x, y, s, fill=CREAM, op=1):
    pts = []
    for i in range(10):
        r = s if i % 2 == 0 else s * 0.42
        a = -math.pi / 2 + i * math.pi / 5
        pts.append(f'{x + r * math.cos(a):.1f},{y + r * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" opacity="{op}"/>'


def fan_flat(px, py, rot, n, step, w, h, colors):
    out = f'<g transform="translate({px},{py}) rotate({rot})">'
    for i in range(n):
        a = (i - (n - 1) / 2) * step
        out += f'<g transform="rotate({a}) translate(0,{-h * 0.5})">{card_back(w, h, colors[i % len(colors)])}</g>'
    return out + '</g>'


def laurel(cx, cy, r, color=GREEN):
    out = ''
    for side in (-1, 1):
        for i in range(9):
            a = math.radians(100 + i * 17)
            x = cx + side * r * math.cos(a) * -1
            y = cy + r * math.sin(a) - 40
            rot = side * (30 + i * 14)
            out += (f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="13" ry="34" fill="{color}" stroke="{INK}" stroke-width="4" '
                    f'transform="rotate({rot:.1f} {x:.1f} {y:.1f})"/>')
    return out


# ---------------------------------------------------------------- Meilleurs jeux 2026 : le podium
def podium():
    rnd = random.Random(2026)
    b = f'<rect width="1920" height="1080" fill="{SAF}"/>'
    b += arcs(960, 560, 200, 1100, 70, stroke=CREAM, sw=4, op=.4)
    b += zig(960, 430, 540, 440, 26, fill=SAFH, stroke=INK, sw=5)
    for _ in range(40):
        b += star(rnd.randint(40, 1880), rnd.randint(40, 760), rnd.choice([8, 12, 16]), CREAM, .8)
    cols = [RED, BLUE, GREEN, VIOLET, ORANGE]
    # éventails de cartes derrière le podium
    b += fan_flat(380, 880, -12, 7, 12, 150, 220, cols)
    b += fan_flat(1540, 880, 12, 7, 12, 150, 220, cols[::-1])
    # podium 2 - 1 - 3
    steps = [(620, 700, 330, BLUE, 2), (960, 600, 340, TERRA, 1), (1300, 770, 330, GREEN, 3)]
    for x, top, w, color, rank in steps:
        b += f'<rect x="{x - w / 2}" y="{top}" width="{w}" height="{1080 - top + 20}" fill="{CREAM}" stroke="{INK}" stroke-width="7"/>'
        b += f'<rect x="{x - w / 2}" y="{top}" width="{w}" height="30" fill="{color}" stroke="{INK}" stroke-width="5"/>'
        for k in range(rank):
            b += f'<circle cx="{x + (k - (rank - 1) / 2) * 56}" cy="{top + 110}" r="19" fill="{color}" stroke="{INK}" stroke-width="4"/>'
        for k in range(0, int(w) - 40, 44):
            b += f'<polygon points="{x - w / 2 + 24 + k},{top + 190} {x - w / 2 + 44 + k},{top + 222} {x - w / 2 + 64 + k},{top + 190}" fill="{color}" opacity=".85"/>'
    # une carte posée sur chaque marche
    for (x, top, w, color, rank), rot in zip(steps, (-8, 0, 8)):
        if rank == 1:
            continue
        b += f'<g transform="translate({x},{top - 110}) rotate({rot})">{card_back(150, 220, color)}</g>'
    # trophée sur la marche 1
    b += (f'<g transform="translate(960,{600 - 205})">'
          f'<path d="M-90,-40 Q-150,-40 -150,10 Q-150,70 -80,80" fill="none" stroke="{INK}" stroke-width="12"/>'
          f'<path d="M90,-40 Q150,-40 150,10 Q150,70 80,80" fill="none" stroke="{INK}" stroke-width="12"/>'
          f'<path d="M-100,-100 L100,-100 L84,70 Q0,140 -84,70 Z" fill="{SAFH}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>'
          f'<rect x="-14" y="110" width="28" height="60" fill="{SAF}" stroke="{INK}" stroke-width="6"/>'
          f'<rect x="-70" y="168" width="140" height="34" rx="6" fill="{TERRA}" stroke="{INK}" stroke-width="7"/>'
          f'{star(0, -20, 46, TERRA)}</g>')
    b += laurel(960, 250, 260)
    return svg(b, seed=11)


# ---------------------------------------------------------------- Idées cadeaux : la boîte ouverte
def cadeaux():
    rnd = random.Random(12)
    b = f'<rect width="1920" height="1080" fill="{VIOLET}"/>'
    b += f'<rect width="1920" height="1080" fill="{INK}" opacity=".12"/>'
    b += arcs(960, 640, 220, 1150, 70, stroke=CREAM, sw=4, op=.33)
    for _ in range(70):
        x, y = rnd.randint(30, 1890), rnd.randint(30, 700)
        c = rnd.choice([SAFH, CREAM, RED, ORANGE, BLUE, GREEN])
        if rnd.random() < .5:
            b += f'<rect x="{x}" y="{y}" width="26" height="12" rx="3" fill="{c}" transform="rotate({rnd.randint(0, 180)} {x} {y})"/>'
        else:
            b += star(x, y, rnd.choice([9, 13, 17]), c, .95)
    # éventail de cartes qui sort de la boîte
    b += fan_flat(960, 640, 0, 9, 15, 190, 280, [RED, ORANGE, SAF, GREEN, BLUE, VIOLET, TERRA, RED, GREEN])
    b += f'<g transform="translate(960,330)">{card_face_spade(190, 280)}</g>'
    # boîte
    b += f'<rect x="500" y="640" width="920" height="400" fill="{TERRA}" stroke="{INK}" stroke-width="9"/>'
    b += f'<rect x="440" y="590" width="1040" height="86" fill="{RED}" stroke="{INK}" stroke-width="9"/>'
    b += f'<rect x="920" y="590" width="80" height="450" fill="{SAFH}" stroke="{INK}" stroke-width="7"/>'
    for k in range(0, 920, 60):
        b += f'<polygon points="{505 + k},720 {535 + k},760 {565 + k},720" fill="{CREAM}" opacity=".7"/>'
        b += f'<polygon points="{505 + k},900 {535 + k},940 {565 + k},900" fill="{CREAM}" opacity=".7"/>'
    # noeud
    for s in (-1, 1):
        b += (f'<path d="M960,590 C{960 + s * 180},{590 - 200} {960 + s * 330},{590 - 20} 960,590 Z" '
              f'fill="{SAFH}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>')
    b += f'<circle cx="960" cy="590" r="40" fill="{SAF}" stroke="{INK}" stroke-width="8"/>'
    # petits paquets autour
    for x, y, w, h, c, r in [(240, 1040, 220, 190, GREEN, SAFH), (1700, 1040, 240, 230, BLUE, CREAM), (1560, 1040, 150, 130, ORANGE, INK)]:
        b += (f'<g transform="translate({x},{y})"><rect x="{-w / 2}" y="{-h}" width="{w}" height="{h}" fill="{c}" stroke="{INK}" stroke-width="7"/>'
              f'<rect x="-12" y="{-h}" width="24" height="{h}" fill="{r}" stroke="{INK}" stroke-width="5"/>'
              f'<path d="M0,{-h} q-40,-46 -46,-10 q6,20 46,10 q40,10 46,-10 q-6,-36 -46,10z" fill="{r}" stroke="{INK}" stroke-width="5"/></g>')
    return svg(b, seed=5)


# ---------------------------------------------------------------- Jeux pas chers : la tirelire
def tirelire():
    rnd = random.Random(31)
    b = f'<rect width="1920" height="1080" fill="{GREEN}"/>'
    b += f'<rect width="1920" height="1080" fill="{INK}" opacity=".1"/>'
    b += arcs(960, 560, 200, 1150, 70, stroke=CREAM, sw=4, op=.35)
    b += zig(960, 520, 520, 430, 24, fill=SAFH, stroke=INK, sw=5)
    # pièces qui tombent
    for i in range(14):
        x, y = rnd.randint(120, 1800), rnd.randint(40, 330)
        r = rnd.choice([34, 42, 50])
        b += (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SAF}" stroke="{INK}" stroke-width="6"/>'
              f'<circle cx="{x}" cy="{y}" r="{r * 0.62:.0f}" fill="none" stroke="{INK}" stroke-width="4" stroke-dasharray="8 6"/>')
    # cartes en éventail derrière le cochon
    b += fan_flat(960, 890, 0, 9, 14, 170, 250, [RED, BLUE, VIOLET, ORANGE, TERRA, RED, BLUE, VIOLET, ORANGE])
    # cochon tirelire
    px, py = 960, 640
    b += f'<g transform="translate({px},{py})">'
    b += f'<ellipse cx="0" cy="40" rx="330" ry="250" fill="{ORANGE}" stroke="{INK}" stroke-width="10"/>'
    b += f'<ellipse cx="-40" cy="10" rx="200" ry="120" fill="{SAFH}" opacity=".35"/>'
    for lx in (-190, -90, 120, 220):
        b += f'<rect x="{lx - 38}" y="200" width="76" height="110" rx="22" fill="{ORANGE}" stroke="{INK}" stroke-width="9"/>'
    # groin
    b += f'<ellipse cx="320" cy="60" rx="86" ry="74" fill="{SAFH}" stroke="{INK}" stroke-width="9"/>'
    b += f'<ellipse cx="300" cy="60" rx="12" ry="22" fill="{INK}"/><ellipse cx="344" cy="60" rx="12" ry="22" fill="{INK}"/>'
    # oreille, oeil, queue
    b += f'<polygon points="150,-130 240,-250 280,-100" fill="{RED}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    b += f'<circle cx="215" cy="-30" r="22" fill="{INK}"/><circle cx="222" cy="-38" r="7" fill="{CREAM}"/>'
    b += f'<path d="M-330,20 q-70,-50 -30,-110 q40,-40 20,40" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round"/>'
    # fente
    b += f'<rect x="-100" y="-190" width="200" height="26" rx="13" fill="{INK}"/>'
    # un 9,99 : points seulement (pas de texte) = pièce portée par une carte
    b += f'<g transform="translate(-10,-300) rotate(-14)">{card_face_spade(120, 175)}</g>'
    b += '</g>'
    # pile de pièces au sol
    for i, x in enumerate((300, 380, 460)):
        for k in range(3 + i):
            b += (f'<ellipse cx="{x}" cy="{1010 - k * 30}" rx="62" ry="22" fill="{SAF}" stroke="{INK}" stroke-width="6"/>')
    for i, x in enumerate((1500, 1590, 1680)):
        for k in range(5 - i):
            b += (f'<ellipse cx="{x}" cy="{1010 - k * 30}" rx="62" ry="22" fill="{SAF}" stroke="{INK}" stroke-width="6"/>')
    return svg(b, seed=14)


if __name__ == '__main__':
    for name, fn in [('meilleurs-jeux-2026-podium', podium), ('idees-cadeaux-boite', cadeaux), ('jeux-pas-chers-tirelire', tirelire)]:
        with open(os.path.join(HERE, name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(fn())
        print('écrit', name + '.svg')
