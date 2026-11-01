import sys,math,random; sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img
BG='#2A1558'; HAT='#5A37A8'; HATD='#3F2380'; INT='#120833'
def star(x,y,r,fill=CREAM,rot=0):
    pts=[]
    for i in range(8):
        a=math.pi/4*i-math.pi/2; rr=r if i%2==0 else r*.28
        pts.append(f'{x+rr*math.cos(a):.1f},{y+rr*math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" transform="rotate({rot} {x} {y})" stroke-linejoin="round"/>'
def moon(x,y,r,fill=SAFH):
    return f'<path d="M{x},{y-r} A{r},{r} 0 1 0 {x+r*.9},{y+r*.45} A{r*.78},{r*.78} 0 1 1 {x},{y-r}Z" fill="{fill}"/>'
def page(deco,imgs=''):
    s=svg('',seed=3)
    s=s.replace(f'<rect width="1920" height="1080" fill="{CREAM}"/>',f'<rect width="1920" height="1080" fill="{BG}"/>')
    s=s.replace('<g filter="url(#rough)"></g>',f'<g filter="url(#rough)">{deco}</g><g>{imgs}</g>')
    return s
# --- chapeau couché (local), ouverture à x=0, pointe vers la gauche
L=800
def yc(x): return -((abs(x)/L)**2.1)*380
def hh(x): return 238*(1-abs(x)/L)**0.95+3
xs=[-i*L/60 for i in range(61)]
up=[(x,yc(x)-hh(x)) for x in xs]; lo=[(x,yc(x)+hh(x)) for x in reversed(xs)]
cone=' '.join(f'{x:.1f},{y:.1f}' for x,y in up+lo)
def hat():
    o=f'<polygon points="{cone}" fill="{HAT}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
    o+=f'<clipPath id="cc"><polygon points="{cone}"/></clipPath><g clip-path="url(#cc)">'
    # ombre bas du cône
    lp=' '.join(f'{x:.1f},{y:.1f}' for x,y in [(x,yc(x)+hh(x)*.25) for x in xs]+[(x,yc(x)+hh(x)) for x in reversed(xs)])
    o+=f'<polygon points="{lp}" fill="{HATD}" opacity=".6"/>'
    # bande safran (bandeau de chapeau)
    h=hh(-170); o+=f'<ellipse cx="-170" cy="{yc(-170)}" rx="{h*.26:.1f}" ry="{h:.1f}" fill="{SAF}" stroke="{INK}" stroke-width="5"/>'
    o+=f'<rect x="-170" y="{yc(-120)-hh(-120)}" width="60" height="{2*hh(-120)}" fill="{SAF}"/>'
    # zigzag dans le bandeau
    for x in (-150,):
        pass
    for x,sw in ((-125,5),(-170,5),(-400,5),(-436,5)):
        h=hh(x); o+=f'<ellipse cx="{x}" cy="{yc(x)}" rx="{h*.26:.1f}" ry="{h:.1f}" fill="none" stroke="{INK if x>-300 else CREAM}" stroke-width="{sw}"/>'
    # triangles (dents) dans le bandeau
    xm=-146;h=hh(xm)
    for k in range(6):
        yy=yc(xm)-h*0.8+k*(h*1.6/5)
        o+=f'<polygon points="{xm-14:.1f},{yy-13:.1f} {xm+14:.1f},{yy:.1f} {xm-14:.1f},{yy+13:.1f}" fill="{TERRA}" stroke="{INK}" stroke-width="2.5"/>'
    xm=-290;h=hh(xm)
    for k in range(7):
        yy=yc(xm)-h*0.8+k*(h*1.6/6)
        o+=f'<polygon points="{xm-60:.1f},{yy-14:.1f} {xm+60:.1f},{yy:.1f} {xm-60:.1f},{yy+14:.1f}" fill="{CREAM}" opacity=".95"/>'
    xm=-520;h=hh(xm)
    for k,fy in enumerate((-.5,0,.5)):
        cy=yc(xm)+fy*h; r=h*.17
        o+=f'<polygon points="{xm},{cy-r*1.2:.1f} {xm+r*.8:.1f},{cy:.1f} {xm},{cy+r*1.2:.1f} {xm-r*.8:.1f},{cy:.1f}" fill="none" stroke="{CREAM}" stroke-width="4"/><circle cx="{xm}" cy="{cy:.1f}" r="4" fill="{CREAM}"/>'
    o+=star(-640,yc(-640),22,SAFH)+star(-720,yc(-720),14,CREAM)+star(-350,yc(-350)-hh(-350)*.55,18,SAFH)+star(-350,yc(-350)+hh(-350)*.55,18,SAFH)
    o+=moon(-600,yc(-600)-8,26,SAFH)
    o+='</g>'
    # rebord (bord) : anneau
    o+=f'<ellipse cx="0" cy="0" rx="112" ry="318" fill="{HATD}" stroke="{INK}" stroke-width="7"/>'
    o+=f'<ellipse cx="0" cy="0" rx="94" ry="298" fill="none" stroke="{SAF}" stroke-width="9"/>'
    for i in range(34):
        a=2*math.pi*i/34
        o+=f'<circle cx="{84*math.cos(a)*.93:.1f}" cy="{297*math.sin(a):.1f}" r="0" fill="{CREAM}"/>'
    o+=f'<ellipse cx="0" cy="0" rx="62" ry="236" fill="{INT}" stroke="{INK}" stroke-width="5"/>'
    # étoiles de l'intérieur
    rnd=random.Random(5)
    for i in range(14):
        a=rnd.uniform(0,6.28); r=rnd.uniform(.1,.85)
        o+=star(62*r*math.cos(a)*.9,236*r*math.sin(a),rnd.uniform(5,11),CREAM)
    return o
HX,HY,ROT=930,800,-28
pv=(HX,HY)
bgd=''
rng=random.Random(11)
# fond : étoiles dispersées + bandes africaines basses
for i in range(70):
    x=rng.uniform(20,1900); y=rng.uniform(20,1060)
    bgd+=star(x,y,rng.choice([6,8,10,14]),rng.choice([CREAM,SAFH,'#B9A2F0']),rng.uniform(0,45))
for k,c in enumerate(('#3A1F78','#341A6C')):
    pass
# bandes zigzag en bas
bgd+=f'<rect x="0" y="990" width="1920" height="90" fill="#1B0C3F"/>'
bgd+=f'<polyline points="{" ".join(f"{i*40},{1016+(16 if i%2 else -16)}" for i in range(0,49))}" fill="none" stroke="{SAF}" stroke-width="6" stroke-linejoin="round"/>'
bgd+=f'<polyline points="{" ".join(f"{i*40},{1050+(10 if i%2 else -10)}" for i in range(0,49))}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round" opacity=".8"/>'
# grand soleil gravé derrière les boîtes
bgd+=zig(1230,470,420,330,18,stroke='#4B2C97',sw=6)+zig(1230,470,300,230,14,stroke='#4B2C97',sw=5)
# ombre du chapeau
bgd+=f'<ellipse cx="{HX-380}" cy="965" rx="560" ry="26" fill="#0D0526" opacity=".6"/>'
bgd+=f'<g transform="translate({HX},{HY}) rotate({ROT})">{hat()}</g>'
# cartes (dos) qui jaillissent du chapeau, puis boîtes
import math as M
cards=''
cols=[TERRA,SAF,VIOLET,RED,GREEN,BLUE,ORANGE]
PX,PY=1000,800
rng2=random.Random(4)
for i in range(16):
    a=rng2.uniform(-62,74); r=rng2.uniform(150,330)
    x=PX+r*M.sin(M.radians(a)); y=PY-r*M.cos(M.radians(a))
    cards+=f'<g transform="translate({x:.0f},{y:.0f}) rotate({a*0.9+rng2.uniform(-18,18):.0f})">{card_back(84,122,cols[i%7])}</g>'
games=['oh-hell','the-crew','6-qui-prend','skull','parade','kyran']
ang=[-52,-30,-8,14,36,58]
bx=''
H=360;R=540
for g,a in zip(games,ang):
    x=PX+R*M.sin(M.radians(a)); y=PY-R*M.cos(M.radians(a))
    bx+=img(g,x,y,H,a*0.8)
svgtxt=page(bgd+cards,bx)
open('/tmp/claude-0/vec/alternatives-wizard.svg','w').write(svgtxt)
