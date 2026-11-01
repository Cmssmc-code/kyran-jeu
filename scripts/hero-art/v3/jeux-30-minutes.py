import sys,math,random
sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img
LEMON='#F6E255'; LEMON2='#EFD535'
def page(bg,art,fg,bgc,w=1920,h=1080):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><filter id="rough" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .13  0 0 0 .07 0"/></filter></defs>
<rect width="{w}" height="{h}" fill="{bgc}"/>
<g filter="url(#rough)">{bg}{art}</g>{fg}
<rect width="{w}" height="{h}" filter="url(#grain)"/></svg>'''
rnd=random.Random(5)
cx=960; T=105; N=435; B=765
bg=''
# bandes diagonales
for i in range(-3,9):
    x=i*330
    bg+=f'<polygon points="{x},0 {x+150},0 {x+150-520},1080 {x-520},1080" fill="{LEMON2}"/>'
# zigzag larges de part et d'autre
for y,op in ((250,.9),(520,.9)):
    pass
# cartes en vol rapide (gauche/droite)
cols=[RED,BLUE,GREEN,ORANGE,VIOLET,TERRA]
def flying(x,y,rot,c,w=70,h=100):
    return f'<g transform="translate({x},{y}) rotate({rot})">{card_back(w,h,c)}</g>'
def trail(x,y,L,rot=0):
    s=''
    for k in range(3):
        yy=y+(k-1)*16
        s+=f'<line x1="{x-L-k*20}" y1="{yy}" x2="{x-12}" y2="{yy}" stroke="{INK}" stroke-width="5" stroke-linecap="round" opacity="{.55-k*.12}"/>'
    return s
for side in (-1,1):
    for k,(dx,y,rot) in enumerate(((430,200,-14),(560,380,10),(380,560,-22),(520,720,16))):
        x=cx+side*dx
        c=cols[(k*2+(0 if side<0 else 1))%6]
        bg+=f'<g transform="translate({x},{y}) scale({side},1)">{trail(-40,0,90+k*14)}</g>' if False else ''
        bg+=f'<g transform="translate({x},{y})"><g transform="scale({-side},1)"><g transform="translate(0,0)">{trail(-48,0,110+k*12)}</g></g></g>'
        bg+=flying(x,y,rot*side,c, 74,106)
# arcs de rythme derrière le sablier (traits fins, pas de disque)
bg+=''.join(f'<path d="M{cx-330-i*26},{T+120+i*14} Q{cx-330-i*26-40},{(T+B)/2} {cx-330-i*26},{B-120-i*14}" fill="none" stroke="{INK}" stroke-width="3" opacity="{.35-i*.06}"/>' for i in range(4))
bg+=''.join(f'<path d="M{cx+330+i*26},{T+120+i*14} Q{cx+330+i*26+40},{(T+B)/2} {cx+330+i*26},{B-120-i*14}" fill="none" stroke="{INK}" stroke-width="3" opacity="{.35-i*.06}"/>' for i in range(4))
for sx in (-1,1):
    for k in range(6):
        yy=120+k*110
        bg+=f'<polygon points="{cx+sx*(800+(k%2)*40)},{yy-22} {cx+sx*(800+(k%2)*40)+14},{yy} {cx+sx*(800+(k%2)*40)},{yy+22} {cx+sx*(800+(k%2)*40)-14},{yy}" fill="{TERRA}" opacity=".85"/>'
        bg+=f'<circle cx="{cx+sx*(880+(k%2)*30)}" cy="{yy+50}" r="6" fill="{INK}" opacity=".6"/>'
# --- sablier
def glass_path():
    return (f'M{cx-195},{T} C{cx-195},{T+190} {cx-22},{N-70} {cx-16},{N} '
            f'C{cx-22},{N+70} {cx-195},{B-190} {cx-195},{B} L{cx+195},{B} '
            f'C{cx+195},{B-190} {cx+22},{N+70} {cx+16},{N} C{cx+22},{N-70} {cx+195},{T+190} {cx+195},{T} Z')
gp=glass_path()
a=f'<ellipse cx="{cx+14}" cy="{805+14}" rx="330" ry="22" fill="{INK}" opacity=".25"/>'
a+=f'<defs><clipPath id="gl"><path d="{gp}"/></clipPath></defs>'
# intérieur du verre
a+=f'<path d="{gp}" fill="{CREAM}" opacity=".7"/>'
a+='<g clip-path="url(#gl)">'
# sable haut
sand=f'M{cx-210},{T+150} L{cx-60},{T+150} L{cx},{T+185} L{cx+60},{T+150} L{cx+210},{T+150} L{cx+210},{N+10} L{cx-210},{N+10}Z'
a+=f'<path d="{sand}" fill="{SAF}"/>'
for i in range(160):
    x=cx+rnd.uniform(-180,180); y=rnd.uniform(T+170,N-10)
    a+=f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rnd.choice([2,2.5,3])}" fill="{TERRA}" opacity=".5"/>'
# filet de sable au col
a+=f'<rect x="{cx-5}" y="{N-30}" width="10" height="70" fill="{SAF}"/>'
# tas de cartes en bas
heap=[]
for row in range(5):
    nn=9-row
    for k in range(nn):
        x=cx+(k-(nn-1)/2)*58+rnd.uniform(-10,10); y=B-34-row*38+rnd.uniform(-6,6)
        heap.append((x,y,rnd.uniform(-40,40),cols[(row+k)%6]))
for x,y,r,c in heap:
    a+=f'<g transform="translate({x:.0f},{y:.0f}) rotate({r:.0f})">{card_back(58,82,c)}</g>'
a+='</g>'
# flux : sable puis cartes
for k,(y,r,c) in enumerate(((N+45,18,RED),(N+105,-25,BLUE),(N+165,30,GREEN),(N+222,-12,ORANGE))):
    s=1.0-0.0*k
    a+=f'<g transform="translate({cx+(-1)**k*9},{y}) rotate({r})">{card_back(44,62,c)}</g>'
# grains qui tombent
for k in range(7):
    a+=f'<circle cx="{cx+rnd.uniform(-5,5):.0f}" cy="{N+20+k*8}" r="3" fill="{SAF}"/>'
# cartes qui se forment dans le bulbe haut (sable -> cartes)
for k,(dx,dy,r,c) in enumerate(((-90,60,-30,TERRA),(-30,95,12,VIOLET),(40,70,-8,BLUE),(100,105,28,GREEN),(0,140,-20,RED))):
    pass
# contour verre et reflets
a+=f'<path d="{gp}" fill="none" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>'
a+=f'<path d="M{cx-165},{T+25} C{cx-168},{T+160} {cx-90},{N-110} {cx-60},{N-70}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".75"/>'
a+=f'<path d="M{cx-165},{B-25} C{cx-168},{B-120} {cx-120},{B-190} {cx-92},{B-225}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".6"/>'
# cartes qui émergent du sable : transformation (haut du sable)
for k,(dx,r,c) in enumerate(((-110,-24,RED),(-40,10,BLUE),(35,-8,GREEN),(105,22,ORANGE))):
    a+=f'<g transform="translate({cx+dx},{T+142-(0 if k%2 else 22)}) rotate({r})">{card_back(56,80,c)}</g>'
# structure : plateaux et piliers
def plate(y):
    s=f'<rect x="{cx-270}" y="{y}" width="540" height="42" rx="12" fill="{TERRA}" stroke="{INK}" stroke-width="6"/>'
    pts=' '.join(f'{cx-250+i*20},{y+21+(9 if i%2 else -9)}' for i in range(26))
    s+=f'<polyline points="{pts}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    return s
for sx in (-1,1):
    px=cx+sx*232
    a+=f'<rect x="{px-17}" y="{T-40+42}" width="34" height="{B-T+38}" rx="8" fill="{TERRA}" stroke="{INK}" stroke-width="6"/>'
    for k in range(9):
        yy=T+40+k*70
        a+=f'<polygon points="{px},{yy-20} {px+10},{yy} {px},{yy+20} {px-10},{yy}" fill="{CREAM}"/>'
    a+=f'<circle cx="{px}" cy="{T-46}" r="19" fill="{SAF}" stroke="{INK}" stroke-width="6"/><circle cx="{px}" cy="{B+84}" r="0" fill="none"/>'
a+=plate(T-40)+plate(B)
# étagère
sh=f'<rect x="0" y="805" width="1920" height="275" fill="{TERRA}"/><rect x="0" y="805" width="1920" height="16" fill="{INK}"/>'
pts=' '.join(f'{i*30},{838+(10 if i%2 else -10)}' for i in range(66))
sh+=f'<polyline points="{pts}" fill="none" stroke="{CREAM}" stroke-width="5" stroke-linejoin="round"/>'
for i in range(33):
    sh+=f'<circle cx="{15+i*60}" cy="{1045}" r="5" fill="{CREAM}" opacity=".7"/>'
sh+=''.join(f'<line x1="0" y1="{y}" x2="1920" y2="{y}" stroke="{INK}" stroke-width="2" opacity=".25"/>' for y in (880,960,1020))
# boîtes
ids=['love-letter','coup','jungle-speed','sushi-go','kyran','the-mind','no-thanks','skyjo','skull']
from assets import size
H=248
ws=[H*size(i)[0]/size(i)[1] for i in ids]
gap=(1920-120-sum(ws))/(len(ids)-1)
x=60; fg=''
rots=[-2,1.5,-1,2,0,-1.5,1,-2,1.5]
for i,idd in enumerate(ids):
    w=ws[i]
    fg+=img(idd,x+w/2,1066-H/2-10+(0 if i%2 else -6),H,rot=rots[i])
    x+=w+gap
svgtxt=page(bg,a+sh,fg,LEMON)
open('/tmp/claude-0/vec/jeux-30-minutes.svg','w').write(svgtxt)
