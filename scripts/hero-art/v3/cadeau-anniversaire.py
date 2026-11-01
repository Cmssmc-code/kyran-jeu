import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from h3lib import *
rng=random.Random(4)
BG='#F2A184'
cols=[RED,SAF,BLUE,GREEN,VIOLET,ORANGE,TERRA]
# --- couche 1 : fond, nappe, guirlande, ballons, intérieur de la boîte
a=bgrect(BG)
# papier peint : grands losanges tonaux
for r in range(0,9):
    for c in range(0,14):
        x=c*160+(80 if r%2 else 0); y=r*100+40
        a+=f'<polygon points="{x},{y-26} {x+22},{y} {x},{y+26} {x-22},{y}" fill="{shade(BG,-.07)}"/>'
# nappe
a+=f'<rect x="-40" y="850" width="2000" height="260" fill="{TERRA}"/>'
a+=f'<rect x="-40" y="850" width="2000" height="14" fill="{INK}"/>'
a+=tri_band(-40,1960,935,50,26,CREAM,5,.8)+tri_band(-40,1960,1010,50,26,SAFH,5,.7)
a+=diamonds(-40,1960,975,50,6,CREAM,.8)
# guirlande de fanions
def bunting(p0,p1,p2,n,off=0):
    s=f'<path d="M{p0[0]},{p0[1]} Q{p1[0]},{p1[1]} {p2[0]},{p2[1]}" fill="none" stroke="{INK}" stroke-width="5"/>'
    for i in range(1,n):
        t=i/n; x=(1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0]; y=(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]
        dx=2*(1-t)*(p1[0]-p0[0])+2*t*(p2[0]-p1[0]); dy=2*(1-t)*(p1[1]-p0[1])+2*t*(p2[1]-p1[1])
        ang=math.degrees(math.atan2(dy,dx)); c=cols[(i+off)%len(cols)]
        s+=f'<g transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})"><polygon points="-34,0 34,0 0,86" fill="{c}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
        s+=f'<polygon points="-18,10 18,10 0,50" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/><circle cx="0" cy="66" r="5" fill="{CREAM}"/></g>'
    return s
a+=bunting((-30,30),(480,240),(960,70),13,0)+bunting((960,70),(1440,240),(1950,30),13,3)
# ballons
def balloon(x,y,c,r=62,tx=0,ty=0):
    s=f'<path d="M{x},{y+r*1.25} C{x+30},{y+r*1.9} {x-30},{y+r*2.4} {tx},{ty}" fill="none" stroke="{INK}" stroke-width="3.5"/>'
    s+=f'<path d="M{x},{y-r} C{x+r*1.1},{y-r} {x+r*1.1},{y+r*1.05} {x},{y+r*1.2} C{x-r*1.1},{y+r*1.05} {x-r*1.1},{y-r} {x},{y-r}Z" fill="{c}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    s+=f'<polygon points="{x-9},{y+r*1.3} {x+9},{y+r*1.3} {x},{y+r*1.15}" fill="{INK}"/>'
    s+=f'<path d="M{x-r*.5},{y-r*.4} q6,-22 26,-28" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>'
    s+=f'<path d="M{x-r*.55},{y+r*.1} q{r*.55},{r*.5} {r*1.1},0" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".6"/>'
    return s
a+=balloon(135,360,BLUE,tx=470,ty=700)+balloon(255,300,SAFH,tx=500,ty=700)+balloon(1790,380,VIOLET,tx=1450,ty=700)+balloon(1665,310,GREEN,tx=1420,ty=700)
# intérieur sombre
a+=f'<rect x="440" y="610" width="1040" height="100" fill="{shade(VIOLET,-.45)}"/>'
# confettis
for _ in range(110):
    x=rng.uniform(0,1920); y=rng.uniform(150,850)
    if 380<x<1540 and y>230: continue
    c=rng.choice(cols+[CREAM]); k=rng.random()
    if k<.5: a+=f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rng.uniform(5,9):.1f}" fill="{c}"/>'
    else: a+=f'<rect x="{x:.0f}" y="{y:.0f}" width="{rng.uniform(10,18):.0f}" height="6" rx="2" fill="{c}" transform="rotate({rng.uniform(0,180):.0f} {x:.0f} {y:.0f})"/>'
# --- couche 2 : les boîtes officielles (non rugueuses), deux rangées dans la boîte
back=['codenames','dixit','love-letter','skull','bang']
front=['dobble','kyran','skyjo','colt-express']
VH={'codenames':330,'dixit':330,'kyran':350,'skull':340,'bang':330,'dobble':330,'love-letter':350,'skyjo':340,'colt-express':320}
def row(ids,x0,x1,yc,bow,rotk,sag):
    ws=[vw(i,VH[i]) for i in ids]; gap=(x1-x0-sum(ws))/(len(ids)-1); x=x0; o=[]
    for i,w in zip(ids,ws):
        cx=x+w/2; dx=cx-960
        o.append(vimg(i,cx,yc+dx*dx*sag,VH[i],rot=dx*rotk)); x+=w+gap
    return o
b=''.join(row(back,350,1590,395,0,.014,.00012)+row(front,320,1620,545,0,.016,.00014))
# --- couche 3 : boîte-cadeau devant
c=''
bx0,bx1=450,1470
c+=f'<rect x="{bx0+14}" y="722" width="{bx1-bx0}" height="400" fill="{INK}" opacity=".25"/>'
c+=f'<rect x="{bx0+10}" y="700" width="{bx1-bx0-20}" height="400" fill="{VIOLET}" stroke="{INK}" stroke-width="6"/>'
c+=diamonds(bx0+30,bx1-30,790,16,13,CREAM,.9)+tri_band(bx0+30,bx1-30,880,24,26,CREAM,5,.8)+diamonds(bx0+30,bx1-30,960,16,13,SAFH,.9)+tri_band(bx0+30,bx1-30,1040,24,26,CREAM,5,.8)
c+=f'<rect x="{bx0-10}" y="668" width="{bx1-bx0+20}" height="62" rx="8" fill="{BLUE}" stroke="{INK}" stroke-width="6"/>'
c+=diamonds(bx0+10,bx1-10,699,30,9,CREAM,.95)
# ruban
c+=f'<rect x="900" y="668" width="120" height="62" fill="{SAF}" stroke="{INK}" stroke-width="5"/><rect x="905" y="730" width="110" height="370" fill="{SAF}" stroke="{INK}" stroke-width="5"/>'
c+=f'<path d="M960,780 C980,730 1080,690 1110,730 C1140,775 1040,800 960,780Z M960,780 C940,730 840,690 810,730 C780,775 880,800 960,780Z" fill="{SAFH}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
c+=f'<path d="M830,745 Q880,730 930,775 M1090,745 Q1040,730 990,775" fill="none" stroke="{TERRA}" stroke-width="4"/>'
c+=f'<path d="M960,785 C930,850 900,880 870,900 M960,785 C990,850 1020,880 1050,900" fill="none" stroke="{INK}" stroke-width="22" stroke-linecap="round"/><path d="M960,785 C930,850 900,880 870,900 M960,785 C990,850 1020,880 1050,900" fill="none" stroke="{SAF}" stroke-width="13" stroke-linecap="round"/>'
c+=f'<circle cx="960" cy="782" r="26" fill="{SAF}" stroke="{INK}" stroke-width="5"/>'
# couvercle posé sur la nappe, à droite
lx,ly=1700,935
c+=f'<rect x="{lx-150+10}" y="{ly-60+14}" width="300" height="150" fill="{INK}" opacity=".25"/>'
c+=f'<rect x="{lx-140}" y="{ly-50}" width="280" height="130" rx="6" fill="{BLUE}" stroke="{INK}" stroke-width="6"/>'
c+=f'<rect x="{lx-155}" y="{ly-78}" width="310" height="44" rx="8" fill="{shade(BLUE,.15)}" stroke="{INK}" stroke-width="6"/>'
c+=diamonds(lx-140,lx+140,ly-56,12,7,CREAM,.95)+tri_band(lx-130,lx+130,ly+50,10,22,CREAM,4,.85)+diamonds(lx-130,lx+130,ly+10,9,7,SAFH,.95)
c+=f'<rect x="{lx-28}" y="{ly-78}" width="56" height="44" fill="{SAF}" stroke="{INK}" stroke-width="5"/><rect x="{lx-26}" y="{ly-34}" width="52" height="114" fill="{SAF}" stroke="{INK}" stroke-width="5"/>'
# gâteau à gauche
px,py=225,935
c+=f'<ellipse cx="{px+6}" cy="{py+14}" rx="190" ry="40" fill="{INK}" opacity=".3"/><ellipse cx="{px}" cy="{py}" rx="185" ry="38" fill="{CREAM}" stroke="{INK}" stroke-width="5"/><ellipse cx="{px}" cy="{py}" rx="150" ry="28" fill="none" stroke="{BLUE}" stroke-width="4"/>'
c+=f'<path d="M{px-130},{py-6} L{px-130},{py-90} Q{px},{py-120} {px+130},{py-90} L{px+130},{py-6} Q{px},{py+22} {px-130},{py-6}Z" fill="{SAF}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
c+=f'<path d="M{px-130},{py-50} Q{px},{py-20} {px+130},{py-50}" fill="none" stroke="{TERRA}" stroke-width="12"/>'
c+=f'<path d="M{px-135},{py-90} Q{px-120},{py-60} {px-105},{py-85} Q{px-85},{py-50} {px-65},{py-82} Q{px-45},{py-55} {px-25},{py-80} Q{px-5},{py-45} {px+15},{py-80} Q{px+35},{py-52} {px+55},{py-82} Q{px+75},{py-50} {px+95},{py-84} Q{px+115},{py-60} {px+135},{py-90} Q{px},{py-125} {px-135},{py-90}Z" fill="{PINK}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
c+=f'<ellipse cx="{px}" cy="{py-98}" rx="100" ry="18" fill="{CREAM}" stroke="{INK}" stroke-width="4" opacity=".0"/>'
for k,(dx,col) in enumerate(((-55,RED),(0,BLUE),(55,GREEN))):
    c+=f'<rect x="{px+dx-7}" y="{py-185}" width="14" height="70" rx="3" fill="{col}" stroke="{INK}" stroke-width="4"/><path d="M{px+dx-5},{py-165} l14,-8 M{px+dx-5},{py-145} l14,-8" stroke="{CREAM}" stroke-width="4"/>'
    c+=f'<path d="M{px+dx},{py-192} C{px+dx+16},{py-212} {px+dx+10},{py-232} {px+dx},{py-246} C{px+dx-10},{py-232} {px+dx-16},{py-212} {px+dx},{py-192}Z" fill="{ORANGE}" stroke="{INK}" stroke-width="4"/><path d="M{px+dx},{py-198} C{px+dx+7},{py-210} {px+dx+4},{py-222} {px+dx},{py-230} C{px+dx-4},{py-222} {px+dx-7},{py-210} {px+dx},{py-198}Z" fill="{SAFH}"/>'
c+=f'<circle cx="{px+95}" cy="{py-108}" r="16" fill="{RED}" stroke="{INK}" stroke-width="4"/>'
open('/tmp/claude-0/vec/cadeau-anniversaire.svg','w').write(doc([(True,a),(False,b),(True,c)],BG))
