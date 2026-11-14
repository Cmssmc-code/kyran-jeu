# Image d'en-tête de « Skyjo et Magilano » : une grille de cartes dont une colonne de trois cartes identiques vient d'être retirée.
import sys,os
sys.path.insert(0,os.path.dirname(__file__))
from kyran_art import *
W,H=150,220;GX=26;GY=24
x0=700;y0=190
def face(color,zig_n=5):
    s=f'<rect x="{-W/2}" y="{-H/2}" width="{W}" height="{H}" rx="10" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
    s+=f'<rect x="{-W/2+10}" y="{-H/2+10}" width="{W-20}" height="{H-20}" rx="6" fill="none" stroke="{color}" stroke-width="4"/>'
    s+=f'<circle cx="0" cy="0" r="46" fill="{color}"/>'+zig(0,0,34,20,zig_n,fill='none',stroke=CREAM,sw=4)
    s+=f'<circle cx="{-W/2+26}" cy="{-H/2+28}" r="9" fill="{color}"/><circle cx="{W/2-26}" cy="{H/2-28}" r="9" fill="{color}"/>'
    return s
body=''
# table : bande de bois terracotta
body+=f'<rect x="560" y="120" width="1300" height="840" rx="28" fill="{TERRA}"/>'
body+=arcs(1210,540,60,420,38,stroke=CREAM,sw=3,op=.18)
body+=f'<rect x="560" y="120" width="1300" height="840" rx="28" fill="none" stroke="{INK}" stroke-width="6"/>'
# emplacement vide de la colonne retirée (colonne 3, en pointillés)
cols=[x0+110+i*(W+GX) for i in range(4)]
rows=[y0+110+j*(H+GY) for j in range(3)]
pattern={ (0,0):'b',(0,1):'f1',(0,2):'b',
          (1,0):'b',(1,1):'b',(1,2):'f2',
          (2,0):'x',(2,1):'x',(2,2):'x',
          (3,0):'f3',(3,1):'b',(3,2):'b'}
backs=[RED,BLUE,GREEN,ORANGE,VIOLET,SAF,BLUE,RED,GREEN]
bi=0
for (c,r),k in pattern.items():
    x,y=cols[c],rows[r]
    if k=='x':
        body+=f'<rect x="{x-W/2}" y="{y-H/2}" width="{W}" height="{H}" rx="10" fill="none" stroke="{CREAM}" stroke-width="4" stroke-dasharray="14 10" opacity=".8"/>'
        continue
    body+=f'<g transform="translate({x},{y})">'
    if k=='b': body+=card_back(W,H,backs[bi%len(backs)]);bi+=1
    elif k=='f1': body+=face(GREEN)
    elif k=='f2': body+=face(BLUE,6)
    else: body+=face(ORANGE,4)
    body+='</g>'
# pile de défausse : trois cartes identiques posées en escalier, à droite de la grille
for i,(dx,dy,rot) in enumerate([(0,0,-6),(26,18,0),(52,36,6)]):
    body+=f'<g transform="translate({1745-52+dx},{300+dy}) rotate({rot})">{face(VIOLET,7)}</g>'
body+=f'<g transform="translate(1745,760) rotate(-4)">{card_back(W,H,SAF)}</g>'
# pastilles : trois points safran en haut à gauche de la grille
print(svg(body))
