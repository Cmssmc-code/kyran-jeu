"""Trois illustrations d'en-tête du blog pour les articles des fêtes (26/11/2026).

Chaque article a désormais sa propre image (règle : un article = une image unique) :
  - jeux-cartes-reveillon      -> reveillon-minuit.svg   (l'horloge sonne minuit, la table de réveillon)
  - apprendre-jeu-cartes-fetes -> apprendre-tablee.svg   (la tablée vue de dessus, cinq paquets au centre)
  - initiation-kyran-fetes     -> initiation-sept-rites.svg (sept marches, une par rite)

Sans texte, sans logo, sans marque : dessin vectoriel dans la direction artistique KYRAN (kyran_art.py).
Usage : python scripts/hero-art/fetes-2026.py   (écrit les SVG à côté du script)
Export : node scripts/hero-art/render.js <slug>.svg <slug>.png, puis JPEG 1200 x 675 (qualité 82) dans blog/images/.
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kyran_art import *  # noqa: E402,F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
NAVY = '#16264A'
NAVY2 = '#22386B'
SKIN = ['#F1C9A5', '#C98B5B', '#8A5A3B', '#E8B48A', '#5E3B26', '#D9A073']


def star(x, y, s, fill=CREAM, op=1):
    p = f'M{x},{y - s} Q{x},{y} {x + s},{y} Q{x},{y} {x},{y + s} Q{x},{y} {x - s},{y} Q{x},{y} {x},{y - s}Z'
    return f'<path d="{p}" fill="{fill}" opacity="{op}"/>'


def streamer(x, y, dx, dy, color, sw=9):
    c1x, c1y = x + dx * 0.25 + 40, y + dy * 0.3
    c2x, c2y = x + dx * 0.75 - 40, y + dy * 0.7
    return (f'<path d="M{x},{y} C{c1x},{c1y} {c2x},{c2y} {x + dx},{y + dy}" fill="none" '
            f'stroke="{color}" stroke-width="{sw}" stroke-linecap="round"/>')


def garland(x0, x1, y, sag, n, colors):
    out = f'<path d="M{x0},{y} Q{(x0 + x1) / 2},{y + sag * 2} {x1},{y}" fill="none" stroke="{INK}" stroke-width="5"/>'
    for i in range(n + 1):
        t = i / n
        x = x0 + (x1 - x0) * t
        yy = y + 2 * sag * t * (1 - t) * 1.0
        out += f'<circle cx="{x:.1f}" cy="{yy + 14:.1f}" r="13" fill="{colors[i % len(colors)]}" stroke="{INK}" stroke-width="3"/>'
    return out


def pennants(x0, x1, y, sag, n, colors):
    out = f'<path d="M{x0},{y} Q{(x0 + x1) / 2},{y + sag * 2} {x1},{y}" fill="none" stroke="{INK}" stroke-width="5"/>'
    for i in range(n + 1):
        t = (i + .5) / (n + 1)
        x = x0 + (x1 - x0) * t
        yy = y + 2 * sag * t * (1 - t)
        out += (f'<polygon points="{x - 24:.1f},{yy:.1f} {x + 24:.1f},{yy:.1f} {x:.1f},{yy + 56:.1f}" '
                f'fill="{colors[i % len(colors)]}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
    return out


def flute(x, y, s=1.0, tilt=0):
    return (f'<g transform="translate({x},{y}) rotate({tilt}) scale({s})">'
            f'<path d="M-30,-150 L30,-150 L22,-30 Q0,0 -22,-30 Z" fill="{CREAM}" fill-opacity=".85" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M-27,-110 L27,-110 L22,-30 Q0,0 -22,-30 Z" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
            f'<rect x="-4" y="-2" width="8" height="48" fill="{CREAM}" stroke="{INK}" stroke-width="4"/>'
            f'<ellipse cx="0" cy="50" rx="34" ry="9" fill="{CREAM}" stroke="{INK}" stroke-width="4"/>'
            f'<circle cx="-8" cy="-70" r="4" fill="{CREAM}"/><circle cx="8" cy="-95" r="3.5" fill="{CREAM}"/>'
            f'<circle cx="0" cy="-48" r="3" fill="{CREAM}"/></g>')


def fir(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<rect x="-14" y="0" width="28" height="40" fill="{TERRA}" stroke="{INK}" stroke-width="4"/>'
            f'<polygon points="0,-210 80,-80 38,-80 110,30 -110,30 -38,-80 -80,-80" fill="{GREEN}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
            f'<polygon points="0,-232 12,-208 38,-204 18,-186 24,-160 0,-174 -24,-160 -18,-186 -38,-204 -12,-208" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
            f'<circle cx="-30" cy="-10" r="9" fill="{RED}"/><circle cx="34" cy="-30" r="9" fill="{SAFH}"/>'
            f'<circle cx="-6" cy="-70" r="9" fill="{BLUE}"/><circle cx="20" cy="-110" r="8" fill="{ORANGE}"/></g>')


def gift(x, y, w, h, color, ribbon):
    return (f'<g transform="translate({x},{y})"><rect x="{-w / 2}" y="{-h}" width="{w}" height="{h}" fill="{color}" stroke="{INK}" stroke-width="4"/>'
            f'<rect x="-8" y="{-h}" width="16" height="{h}" fill="{ribbon}" stroke="{INK}" stroke-width="3"/>'
            f'<rect x="{-w / 2}" y="{-h * 0.58}" width="{w}" height="14" fill="{ribbon}" stroke="{INK}" stroke-width="3"/>'
            f'<path d="M0,{-h} q-30,-34 -34,-8 q4,14 34,8 q30,6 34,-8 q-4,-26 -34,8z" fill="{ribbon}" stroke="{INK}" stroke-width="3"/></g>')


def fan_flat(px, py, rot, n, step, w, h, colors):
    out = f'<g transform="translate({px},{py}) rotate({rot})">'
    for i in range(n):
        a = (i - (n - 1) / 2) * step
        out += f'<g transform="rotate({a}) translate(0,{-h * 0.5})">{card_back(w, h, colors[i % len(colors)])}</g>'
    return out + '</g>'


# ---------------------------------------------------------------- Réveillon : minuit
def reveillon():
    rnd = random.Random(26)
    b = f'<rect width="1920" height="1080" fill="{NAVY}"/>'
    b += f'<rect y="0" width="1920" height="560" fill="{NAVY2}" opacity=".55"/>'
    for _ in range(46):
        b += star(rnd.randint(30, 1890), rnd.randint(30, 700), rnd.choice([8, 11, 14, 18]), CREAM, .85)
    # feux d'artifice
    for (cx, cy, r, col) in [(250, 290, 160, SAFH), (1690, 250, 190, RED), (430, 640, 90, BLUE), (1530, 600, 100, GREEN)]:
        b += zig(cx, cy, r, r * 0.55, 14, fill='none', stroke=col, sw=7)
        b += dots(cx, cy, r * 0.28, 10, 7, col)
        b += f'<circle cx="{cx}" cy="{cy}" r="10" fill="{col}"/>'
    # halo + horloge
    cx, cy, R = 960, 420, 330
    b += zig(cx, cy, R + 120, R + 70, 28, fill=SAFH, stroke=INK, sw=5)
    b += f'<circle cx="{cx}" cy="{cy}" r="{R + 28}" fill="{SAF}" stroke="{INK}" stroke-width="8"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="{CREAM}" stroke="{INK}" stroke-width="8"/>'
    b += dots(cx, cy, R - 38, 12, 11, INK)
    for i in range(60):
        a = math.pi * 2 * i / 60 - math.pi / 2
        if i % 5:
            b += f'<circle cx="{cx + (R - 38) * math.cos(a):.1f}" cy="{cy + (R - 38) * math.sin(a):.1f}" r="4" fill="{TERRA}"/>'
    b += zig(cx, cy, R - 95, R - 130, 12, fill='none', stroke=TERRA, sw=4)
    # à 12 h : losange de minuit
    b += f'<polygon points="{cx},{cy - R + 18} {cx + 22},{cy - R + 52} {cx},{cy - R + 86} {cx - 22},{cy - R + 52}" fill="{RED}" stroke="{INK}" stroke-width="4"/>'
    # aiguilles collées sur midi
    b += f'<polygon points="{cx - 20},{cy} {cx},{cy - 195} {cx + 20},{cy}" fill="{INK}"/>'
    b += f'<polygon points="{cx - 14},{cy} {cx},{cy - 250} {cx + 14},{cy}" fill="{TERRA}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="26" fill="{INK}"/><circle cx="{cx}" cy="{cy}" r="11" fill="{SAFH}"/>'
    # guirlande de lumières
    b += garland(-20, 1940, 70, 40, 24, [RED, SAFH, BLUE, GREEN, ORANGE, VIOLET])
    # serpentins et confettis
    for (x, y, dx, dy, c) in [(120, 120, 120, 520, RED), (330, 100, -60, 420, SAFH), (1560, 120, 100, 460, BLUE),
                              (1780, 110, -90, 560, GREEN), (700, 90, 60, 220, VIOLET), (1240, 90, -80, 230, ORANGE)]:
        b += streamer(x, y, dx, dy, c)
    cols = [RED, SAFH, BLUE, GREEN, ORANGE, VIOLET, CREAM]
    for _ in range(90):
        x, y = rnd.randint(20, 1900), rnd.randint(120, 800)
        if 560 < x < 1360 and y < 760:
            continue
        c = rnd.choice(cols)
        if rnd.random() < .5:
            b += f'<circle cx="{x}" cy="{y}" r="{rnd.choice([5, 7, 9])}" fill="{c}"/>'
        else:
            b += f'<rect x="{x}" y="{y}" width="18" height="9" rx="2" fill="{c}" transform="rotate({rnd.randint(0, 170)} {x} {y})"/>'
    # table de réveillon
    b += f'<rect x="0" y="830" width="1920" height="250" fill="{TERRA}" stroke="{INK}" stroke-width="6"/>'
    b += f'<rect x="0" y="830" width="1920" height="34" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
    for i in range(0, 1960, 46):
        b += f'<polygon points="{i},864 {i + 23},900 {i + 46},864" fill="{CREAM}"/>'
    for i in range(0, 1960, 92):
        b += f'<polygon points="{i + 46},960 {i + 70},990 {i + 46},1020 {i + 22},990" fill="none" stroke="{CREAM}" stroke-width="4"/>'
    # éventail de cartes et flûtes
    b += fan_flat(960, 960, 0, 7, 11, 130, 188, [RED, BLUE, GREEN, VIOLET, ORANGE, SAF, TERRA])
    b += flute(640, 920, 1.25, -4) + flute(1280, 920, 1.25, 4)
    b += flute(430, 940, 1.0, 8) + flute(1490, 940, 1.0, -8)
    return svg(b, seed=11)


# ---------------------------------------------------------------- Apprendre en famille : la tablée
def person(angle, R, skin, hair, sweater, kind):
    """Personne vue de dessus, assise face à la table (le centre est vers le bas du repère local)."""
    s = f'<g transform="rotate({angle}) translate(0,{-R})">'
    s += f'<ellipse cx="0" cy="-8" rx="128" ry="66" fill="{sweater}" stroke="{INK}" stroke-width="5"/>'
    s += f'<polygon points="-72,-30 -48,-8 -72,14" fill="{CREAM}" opacity=".9"/><polygon points="72,-30 48,-8 72,14" fill="{CREAM}" opacity=".9"/>'
    # bras vers la table
    s += f'<ellipse cx="-52" cy="52" rx="23" ry="48" fill="{sweater}" stroke="{INK}" stroke-width="4"/>'
    s += f'<ellipse cx="52" cy="52" rx="23" ry="48" fill="{sweater}" stroke="{INK}" stroke-width="4"/>'
    # tête
    s += f'<circle cx="0" cy="6" r="50" fill="{skin}" stroke="{INK}" stroke-width="5"/>'
    if kind == 'bun':
        s += f'<path d="M-50,6 A50,50 0 0 1 50,6 Q0,-8 -50,6Z" fill="{hair}" stroke="{INK}" stroke-width="4"/><circle cx="0" cy="-62" r="24" fill="{hair}" stroke="{INK}" stroke-width="4"/>'
    elif kind == 'curly':
        for i in range(7):
            a = math.pi + math.pi * i / 6
            s += f'<circle cx="{46 * math.cos(a):.1f}" cy="{8 + 46 * math.sin(a):.1f}" r="19" fill="{hair}" stroke="{INK}" stroke-width="3"/>'
        s += f'<path d="M-44,8 A44,44 0 0 1 44,8 Q0,-6 -44,8Z" fill="{hair}"/>'
    elif kind == 'long':
        s += f'<path d="M-56,40 Q-62,-48 0,-54 Q62,-48 56,40 Q36,-6 0,-8 Q-36,-6 -56,40Z" fill="{hair}" stroke="{INK}" stroke-width="4"/>'
    elif kind == 'bald':
        s += f'<path d="M-52,-10 Q-50,-30 -38,-34 Q-60,-12 -52,10Z M52,-10 Q50,-30 38,-34 Q60,-12 52,10Z" fill="{hair}" stroke="{INK}" stroke-width="3"/>'
        s += f'<circle cx="-18" cy="26" r="13" fill="none" stroke="{INK}" stroke-width="4"/><circle cx="18" cy="26" r="13" fill="none" stroke="{INK}" stroke-width="4"/>'
    elif kind == 'ponytail':
        s += f'<path d="M-50,6 A50,50 0 0 1 50,6 Q0,-12 -50,6Z" fill="{hair}" stroke="{INK}" stroke-width="4"/><ellipse cx="0" cy="-70" rx="16" ry="30" fill="{hair}" stroke="{INK}" stroke-width="4"/>'
    else:  # short
        s += f'<path d="M-50,10 A50,50 0 0 1 50,10 Q40,-14 0,-12 Q-40,-14 -50,10Z" fill="{hair}" stroke="{INK}" stroke-width="4"/>'
    return s + '</g>'


def tablee():
    b = f'<rect width="1920" height="1080" fill="{SAFH}"/>'
    # rayons
    rays = ''
    for i in range(24):
        a0 = math.pi * 2 * i / 24
        a1 = a0 + math.pi / 24
        rays += f'<polygon points="960,540 {960 + 1500 * math.cos(a0):.0f},{540 + 1500 * math.sin(a0):.0f} {960 + 1500 * math.cos(a1):.0f},{540 + 1500 * math.sin(a1):.0f}" fill="{SAF}" opacity=".55"/>'
    b += rays
    b += arcs(960, 540, 520, 900, 55, stroke=CREAM, sw=4, op=.5)
    # décors des fêtes
    b += pennants(-20, 1940, 40, 50, 22, [RED, BLUE, GREEN, VIOLET, ORANGE, CREAM])
    b += fir(210, 930, 1.35) + fir(1710, 930, 1.35) + fir(90, 990, 0.9) + fir(1830, 990, 0.9)
    b += gift(345, 1030, 120, 90, RED, SAFH) + gift(1575, 1030, 120, 90, BLUE, CREAM) + gift(470, 1040, 80, 62, VIOLET, SAFH)
    # table ronde
    cx, cy = 960, 545
    b += f'<circle cx="{cx + 10}" cy="{cy + 14}" r="340" fill="{INK}" opacity=".18"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="334" fill="{TERRA}" stroke="{INK}" stroke-width="8"/>'
    b += zig(cx, cy, 322, 290, 36, fill=CREAM, stroke=INK, sw=4)
    b += f'<circle cx="{cx}" cy="{cy}" r="284" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
    b += f'<circle cx="{cx}" cy="{cy}" r="262" fill="none" stroke="{CREAM}" stroke-width="3.5" stroke-dasharray="9 8"/>'
    b += dots(cx, cy, 215, 36, 4.5, CREAM)
    # personnes autour de la table
    people = [
        (0, SKIN[0], '#B7B2B0', '#3C78C8', 'bun'),
        (60, SKIN[2], '#231F22', '#2E9E57', 'short'),
        (120, SKIN[1], '#231F22', '#EE7D1F', 'curly'),
        (180, SKIN[3], '#6B3B1F', '#8E5BC6', 'ponytail'),
        (240, SKIN[4], '#231F22', '#E0303F', 'long'),
        (300, SKIN[0], '#D0CCCA', '#E6AB26', 'bald'),
    ]
    hands = ''
    pc = [RED, BLUE, GREEN, VIOLET, ORANGE, SAF]
    for i, (ang, skin, hair, sweater, kind) in enumerate(people):
        b += f'<g transform="translate({cx},{cy})">{person(ang, 435, skin, hair, sweater, kind)}</g>'
        hands += (f'<g transform="translate({cx},{cy}) rotate({ang}) translate(0,-300)">'
                  f'{fan_flat(0, 0, 180, 3, 14, 62, 90, [pc[i], pc[(i + 2) % 6], pc[(i + 4) % 6]])}</g>')
    b += hands
    # cinq paquets au centre
    deck_cols = [RED, BLUE, GREEN, VIOLET, ORANGE]
    for i, c in enumerate(deck_cols):
        a = math.pi * 2 * i / 5 - math.pi / 2
        x, y = cx + 112 * math.cos(a), cy + 112 * math.sin(a)
        rot = math.degrees(a) + 90
        b += f'<g transform="translate({x:.1f},{y:.1f}) rotate({rot + 8:.1f})">{card_back(70, 100, c)}</g>'
        b += f'<g transform="translate({x - 4:.1f},{y - 5:.1f}) rotate({rot:.1f})">{card_back(70, 100, c)}</g>'
    b += f'<circle cx="{cx}" cy="{cy}" r="44" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>' + spade(cx, cy - 4, 0.6)
    return svg(b, seed=5)


# ---------------------------------------------------------------- Initiation : sept rites
def initiation():
    rnd = random.Random(7)
    b = f'<rect width="1920" height="1080" fill="{TERRA}"/>'
    b += f'<rect width="1920" height="1080" fill="{INK}" opacity=".16"/>'
    for _ in range(36):
        b += star(rnd.randint(30, 1100), rnd.randint(30, 520), rnd.choice([7, 10, 13]), CREAM, .7)
    # soleil levant au sommet
    sx, sy = 1500, 300
    b += arcs(sx, sy, 330, 760, 60, stroke=CREAM, sw=4, op=.4)
    b += zig(sx, sy, 330, 250, 22, fill=SAFH, stroke=INK, sw=5)
    b += f'<circle cx="{sx}" cy="{sy}" r="215" fill="{SAF}" stroke="{INK}" stroke-width="7"/>'
    b += dots(sx, sy, 160, 18, 9, CREAM)
    b += zig(sx, sy, 110, 80, 12, fill='none', stroke=INK, sw=4)
    # escalier de sept marches
    cols = [RED, ORANGE, SAF, GREEN, BLUE, VIOLET, INK]
    sw_ = 215
    for i in range(7):
        x = 120 + i * sw_
        top = 905 - i * 95
        b += f'<rect x="{x}" y="{top}" width="{sw_ + 4}" height="{1080 - top + 20}" fill="{CREAM if i % 2 == 0 else SAFH}" stroke="{INK}" stroke-width="6"/>'
        b += f'<rect x="{x}" y="{top}" width="{sw_ + 4}" height="26" fill="{INK}" opacity=".18"/>'
        # frise sur la contremarche
        for k in range(0, sw_, 36):
            b += f'<polygon points="{x + k + 6},{top + 36} {x + k + 24},{top + 62} {x + k + 42},{top + 36}" fill="{cols[i] if cols[i] != INK else TERRA}" opacity=".9"/>'
        # i + 1 points : le numéro du rite
        for k in range(i + 1):
            b += f'<circle cx="{x + 28 + k * 26}" cy="{top + 104}" r="9" fill="{INK}"/>'
        # une carte posée sur la marche
        b += f'<g transform="translate({x + sw_ / 2},{top - 92}) rotate({-9 + i * 3})">{card_back(100, 150, cols[i])}</g>'
    # éventail final sur la dernière marche
    b += fan_flat(120 + 6 * sw_ + sw_ / 2, 335 - 28, 0, 5, 13, 110, 160, [RED, BLUE, GREEN, VIOLET, SAF])
    b += f'<g transform="translate({120 + 6 * sw_ + sw_ / 2},{190})">{card_face_spade(110, 160)}</g>'
    # fanions et petites étoiles en haut à gauche
    b += pennants(-20, 1000, 36, 36, 13, [SAFH, CREAM, RED, BLUE, GREEN, VIOLET])
    # petit sentier de pas (points) qui suit l'escalier
    for i in range(6):
        x = 120 + i * sw_ + sw_ - 8
        y = 905 - i * 95 - 22
        b += f'<circle cx="{x}" cy="{y}" r="9" fill="{CREAM}" opacity=".9"/>'
    return svg(b, seed=9)


if __name__ == '__main__':
    for name, fn in [('reveillon-minuit', reveillon), ('apprendre-tablee', tablee), ('initiation-sept-rites', initiation)]:
        with open(os.path.join(HERE, name + '.svg'), 'w', encoding='utf-8') as f:
            f.write(fn())
        print('écrit', name + '.svg')
