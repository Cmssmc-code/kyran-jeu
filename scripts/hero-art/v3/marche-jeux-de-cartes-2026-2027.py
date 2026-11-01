import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from h3lib import *
rng=random.Random(21)
BG='#E6CFA0'; GRID=shade(BG,-.13)
a=bgrect(BG)
# grille discrète (lignes)
for y in range(100,1000,100): a+=f'<line x1="-40" y1="{y}" x2="1960" y2="{y}" stroke="{GRID}" stroke-width="3"/>'
for x in range(0,1960,160): a+=f'<line x1="{x}" y1="-40" x2="{x}" y2="1000" stroke="{GRID}" stroke-width="2" opacity=".6"/>'
# sol décoré
a+=f'<rect x="-40" y="990" width="2000" height="140" fill="{TERRA}"/><rect x="-40" y="990" width="2000" height="10" fill="{INK}"/>'
a+=tri_band(-40,1960,1040,50,28,CREAM,5,.9)+diamonds(-40,1960,1015,50,6,SAFH,.95)+diamonds(-40,1960,1065,50,6,SAFH,.95)
ids=['flip-7','trio','skyjo','dekal','cabanga']
cols=[BLUE,GREEN,ORANGE,VIOLET,RED]
xs=[250,590,930,1270,1610]
SW=300; VHB=330; CT=790
for k,x in enumerate(xs):
    c=cols[k]
    # fond du stand et poteaux
    a+=f'<rect x="{x-SW/2+14}" y="360" width="{SW-28}" height="{CT-360}" fill="{shade(c,.6)}" stroke="{INK}" stroke-width="5"/>'
    a+=diamonds(x-SW/2+30,x+SW/2-30,400,6,7,c,.6)
    for px in (x-SW/2+4,x+SW/2-22): a+=f'<rect x="{px}" y="330" width="18" height="{960-330}" fill="{WD if False else "#6B4429"}" stroke="{INK}" stroke-width="5"/>'
    # comptoir
    a+=f'<rect x="{x-SW/2-8}" y="{CT}" width="{SW+16}" height="26" rx="4" fill="#B58559" stroke="{INK}" stroke-width="5"/>'
    a+=f'<rect x="{x-SW/2+6}" y="{CT+26}" width="{SW-12}" height="170" fill="#6B4429" stroke="{INK}" stroke-width="5"/>'
    a+=tri_band(x-SW/2+22,x+SW/2-22,CT+100,7,26,CREAM,5,.85)+diamonds(x-SW/2+22,x+SW/2-22,CT+150,7,7,c,1)
    # socle identique
    a+=f'<rect x="{x-115}" y="{CT-34}" width="230" height="34" rx="5" fill="{c}" stroke="{INK}" stroke-width="5"/>'
    # auvent rayé festonné
    a+=f'<polygon points="{x-SW/2-26},350 {x+SW/2+26},350 {x+SW/2+6},250 {x-SW/2-6},250" fill="{CREAM}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    n=6; w=(SW+52)/n
    for j in range(n):
        x0=x-SW/2-26+j*w
        if j%2==0: a+=f'<polygon points="{x0},350 {x0+w},350 {x-SW/2-6+(j+1)*(SW+12)/n},250 {x-SW/2-6+j*(SW+12)/n},250" fill="{c}"/>'
    a+=f'<polygon points="{x-SW/2-26},350 {x+SW/2+26},350 {x+SW/2+6},250 {x-SW/2-6},250" fill="none" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    for j in range(n):
        x0=x-SW/2-26+j*w
        a+=f'<path d="M{x0},350 q{w/2},46 {w},0" fill="{c if j%2==0 else CREAM}" stroke="{INK}" stroke-width="6"/>'
# flèche montante discrète au-dessus des auvents
a+=f'<path d="M120,215 C700,200 1300,150 1720,90" fill="none" stroke="{INK}" stroke-width="40" stroke-linecap="round"/><path d="M120,215 C700,200 1300,150 1720,90" fill="none" stroke="{SAF}" stroke-width="26" stroke-linecap="round"/><path d="M120,215 C700,200 1300,150 1720,90" fill="none" stroke="{CREAM}" stroke-width="4" stroke-dasharray="2 20" stroke-linecap="round"/>'
a+=f'<polygon points="1690,45 1850,70 1735,160" fill="{SAF}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>'
def coin(cx,cy,r):
    o=f'<ellipse cx="{cx+5}" cy="{cy+8}" rx="{r}" ry="{r}" fill="{INK}" opacity=".2"/><circle cx="{cx}" cy="{cy}" r="{r}" fill="{INK}"/><circle cx="{cx}" cy="{cy}" r="{r-5}" fill="{SAF}"/><circle cx="{cx}" cy="{cy}" r="{r*.78}" fill="none" stroke="{TERRA}" stroke-width="4"/>'
    return o+zig(cx,cy,r*.6,r*.4,8,stroke=INK,sw=3)+f'<circle cx="{cx}" cy="{cy}" r="{r*.13}" fill="{INK}"/>'
for cx in (110,1810): a+=coin(cx,930,44)
a+=coin(60,900,44) if False else ''
b=''
for k,(i,x) in enumerate(zip(ids,xs)):
    b+=vimg(i,x,CT-34-VHB/2,VHB)
open('/tmp/claude-0/vec/marche-jeux-de-cartes-2026-2027.svg','w').write(doc([(True,a),(False,b)],BG))
