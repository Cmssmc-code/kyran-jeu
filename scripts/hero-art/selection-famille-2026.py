"""Illustrations des articles « Noël en famille » et « 10 à 12 ans » (sans texte ni logo, 1920x1080).

Usage : python selection-famille-2026.py  (écrit les SVG à côté du script ; rendu JPG/WebP 1200x675
avec Chromium puis PIL, comme les autres images de blog/images/).
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


# ---------------------------------------------------------------- Noël en famille : sapin et cartes sur la nappe
def sapin_table():
    rnd = random.Random(2711)
    b = f'<rect width="1920" height="1080" fill="{GREEN}"/>'
    b += f'<rect width="1920" height="1080" fill="{INK}" opacity=".18"/>'
    b += arcs(960, 520, 200, 1150, 70, stroke=CREAM, sw=4, op=.3)
    for _ in range(46):
        b += star(rnd.randint(30, 1890), rnd.randint(30, 520), rnd.choice([8, 12, 16]), CREAM, .85)
    # sapin : trois étages
    for i, (w, top, bot) in enumerate([(300, 110, 360), (420, 250, 520), (540, 400, 660)]):
        b += (f'<polygon points="960,{top} {960 - w},{bot} {960 + w},{bot}" fill="#1B7F3A" stroke="{INK}" stroke-width="8" '
              f'stroke-linejoin="round"/>')
        b += zig(960, (top + bot) / 2 + 40, w * 0.8, w * 0.62, 12, fill='none', stroke=SAFH, sw=4)
    b += f'<rect x="920" y="660" width="80" height="70" fill="{TERRA}" stroke="{INK}" stroke-width="7"/>'
    b += star(960, 100, 62, SAFH, 1)
    # boules
    for x, y, c in [(840, 330, RED), (1090, 300, BLUE), (760, 500, SAF), (1160, 520, RED), (900, 590, VIOLET),
                    (1030, 610, SAF), (690, 640, BLUE), (1240, 640, ORANGE), (960, 420, CREAM), (820, 220, ORANGE), (1100, 200, VIOLET)]:
        b += f'<circle cx="{x}" cy="{y}" r="26" fill="{c}" stroke="{INK}" stroke-width="5"/>'
        b += f'<circle cx="{x - 8}" cy="{y - 9}" r="6" fill="{CREAM}" opacity=".8"/>'
    # nappe + table
    b += f'<rect x="0" y="720" width="1920" height="360" fill="{TERRA}" stroke="{INK}" stroke-width="8"/>'
    b += zig(960, 900, 1500, 1380, 40, fill='none', stroke=SAFH, sw=4)
    b += f'<rect x="0" y="720" width="1920" height="26" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
    # éventails de cartes à gauche et à droite, pile au centre
    cols = [RED, BLUE, SAF, VIOLET, ORANGE]
    for px, py, rot in [(430, 930, -16), (1490, 930, 16)]:
        b += f'<g transform="translate({px},{py}) rotate({rot})">'
        for i in range(6):
            a = (i - 2.5) * 12
            b += f'<g transform="rotate({a}) translate(0,-110)">{card_back(150, 220, cols[i % 5])}</g>'
        b += '</g>'
    for i in range(4):
        b += f'<g transform="translate({930 + i * 14},{900 - i * 8}) rotate({-12 + i * 8})">{card_back(150, 220, cols[(i + 1) % 5])}</g>'
    # bougies
    for x in (210, 1710):
        b += f'<rect x="{x - 24}" y="800" width="48" height="150" fill="{CREAM}" stroke="{INK}" stroke-width="6"/>'
        b += f'<path d="M{x},730 q-26,36 0,66 q26,-30 0,-66 z" fill="{ORANGE}" stroke="{INK}" stroke-width="5"/>'
        b += f'<path d="M{x},755 q-10,18 0,32 q10,-14 0,-32 z" fill="{SAFH}"/>'
    return svg(b, seed=31)


# ---------------------------------------------------------------- 10 à 12 ans : le château de cartes
def chateau():
    rnd = random.Random(1012)
    b = f'<rect width="1920" height="1080" fill="{BLUE}"/>'
    b += f'<rect width="1920" height="1080" fill="{INK}" opacity=".16"/>'
    b += arcs(960, 560, 200, 1150, 70, stroke=CREAM, sw=4, op=.32)
    b += zig(960, 520, 560, 450, 28, fill=SAFH, stroke=INK, sw=5)
    cw, ch = 130, 195
    cols = [RED, VIOLET, GREEN, ORANGE, SAF, TERRA]
    ground = 930
    levels = [3, 2, 1]
    y = ground
    k = 0
    for lv, n in enumerate(levels):
        span = n * 190
        x0 = 960 - span / 2 + 95
        # cartes inclinées en V
        for i in range(n):
            cx = x0 + i * 190
            for s in (-1, 1):
                b += (f'<g transform="translate({cx + s * 44},{y - ch / 2}) rotate({s * 17})">'
                      f'{card_back(cw, ch, cols[k % len(cols)])}</g>')
                k += 1
        y -= ch * 0.86
        # carte horizontale posée sur l'étage
        if n > 1:
            b += (f'<g transform="translate(960,{y + 6}) rotate(90)">{card_back(cw, ch, cols[k % len(cols)])}</g>')
            k += 1
            y -= 24
    b += f'<g transform="translate(960,{y - 70}) rotate(8)">{card_face_spade(cw, ch)}</g>'
    # sol
    b += f'<rect x="0" y="{ground + 16}" width="1920" height="{1080 - ground - 16}" fill="{CREAM}" stroke="{INK}" stroke-width="7"/>'
    b += zig(960, 1010, 1500, 1400, 44, fill='none', stroke=TERRA, sw=3)
    # cartes tombées
    for x, yy, rot, c in [(330, 960, -25, GREEN), (1560, 975, 18, RED), (1700, 985, -8, VIOLET)]:
        b += f'<g transform="translate({x},{yy}) rotate({rot})">{card_back(130, 190, c)}</g>'
    for sx, sy, sz in [(380, 280, 44), (1520, 250, 50), (300, 640, 30), (1640, 600, 34), (700, 140, 26), (1250, 120, 28), (520, 520, 22), (1420, 470, 24)]:
        b += star(sx, sy, sz, CREAM if rnd.random() < .5 else SAFH, .95)
    return svg(b, seed=37)


if __name__ == '__main__':
    for name, fn in [('jeux-cartes-noel-en-famille', sapin_table), ('jeux-cartes-10-12-ans', chateau)]:
        with open(os.path.join(HERE, name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(fn())
        print('écrit', name + '.svg')
