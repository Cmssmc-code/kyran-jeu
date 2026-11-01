import sys;sys.path.insert(0,'/tmp/claude-0/vec')
from hv3 import *
from assets import size
random.seed(4)
NEON1='#FF5CC8';NEON2='#43E0E8'
bg=''
# mur : bandes gravées
bg+=R(0,0,1920,1080,'#4A0B3C')
for y in (90,640):
    bg+=zigband(0,y,1920,26,CREAM,64,.14)
bg+=latt(0,100,1920,630,120,CREAM,.09,3)
bg+=R(0,560,1920,500,'#3A0830')
# lueur
bg+='<ellipse cx="960" cy="470" rx="900" ry="380" fill="url(#glow)" opacity=".28"/>'
# néons
def neon(path,col,sw=10):
    return f'<path d="{path}" fill="none" stroke="{col}" stroke-width="{sw+14}" stroke-linecap="round" stroke-linejoin="round" opacity=".28"/><path d="{path}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/><path d="{path}" fill="none" stroke="#FFF" stroke-width="{sw/3:.1f}" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>'
bg+=neon('M110,150 L300,150 L205,255 Z M205,255 L205,340 M160,340 L250,340',NEON1)
bg+=C(240,172,0,'none')
_pts=[(1690+(70 if i%2==0 else 34)*math.cos(math.pi*i/8),210+(70 if i%2==0 else 34)*math.sin(math.pi*i/8)) for i in range(16)]
bg+=neon('M'+' L'.join(f'{x:.0f},{y:.0f}' for x,y in _pts)+' Z',NEON2,9)+neon('M1690,205 m-12,0 a12,12 0 1 0 24,0 a12,12 0 1 0 -24,0',NEON1,6)
# étagère du fond
SY=530
bg+=R(290,SY,1340,26,'#7A4A2A',rx=6,stroke=INK,sw=3)+zigband(300,SY+6,1320,14,SAFH,60,.8)
bg+=R(330,SY+26,18,40,'#5A331A')+R(1570,SY+26,18,40,'#5A331A')
# lampes suspendues
for x in (500,960,1420):
    bg+=f'<line x1="{x}" y1="0" x2="{x}" y2="150" stroke="{CREAM}" stroke-width="4" opacity=".7"/>'
    bg+=P(f'M{x-70},230 Q{x-60},160 {x},150 Q{x+60},160 {x+70},230 Z',SAF if x!=960 else TERRA,INK,4)+zigband(x-58,196,116,26,CREAM,6,.9)+C(x,250,70,'url(#glow)',op=.9)
# comptoir
CY=858
bg+=R(60,CY,1800,38,'#8A5A32',rx=10,stroke=INK,sw=4)+R(60,CY+38,1800,230,'#2C0A27',stroke=INK,sw=4)
for i in range(0,1800,150):
    x=60+i
    bg+=R(x+10,CY+54,130,196,'#3D0F35',rx=6,stroke=CREAM,sw=3,op=.9)
    bg+=zigband(x+24,CY+68,102,34,[CREAM,SAFH,'#FF8FD6'][(i//150)%3],4,.9)
    bg+=poly([(x+75,CY+112),(x+112,CY+152),(x+75,CY+192),(x+38,CY+152)],'none',[CREAM,SAFH,'#FF8FD6'][(i//150)%3],4)
    bg+=C(x+75,CY+152,7,[CREAM,SAFH,'#FF8FD6'][(i//150)%3])
bg+=R(60,CY+30,1800,10,SAFH,op=.9)
fg=''
def bottle(x,base,h,col):
    w=44
    s=P(f'M{x-w/2},{base} V{base-h*0.55} Q{x-w/2},{base-h*0.66} {x-9},{base-h*0.72} V{base-h*0.92} H{x+9} V{base-h*0.72} Q{x+w/2},{base-h*0.66} {x+w/2},{base-h*0.55} V{base} Z',col,INK,3)
    s+=R(x-11,base-h-8,22,12,INK,rx=3)+R(x-w/2+5,base-h*0.40,w-10,h*0.22,CREAM,rx=3,op=.95)+zigband(x-w/2+8,base-h*0.34,w-16,h*0.1,col,3,.9)
    s+=R(x-w/2+6,base-h*0.58,6,h*0.4,'#FFF',rx=3,op=.35)
    return s
cols=[GREEN,ORANGE,'#E0303F','#1D96DB','#E6AB26','#8B3FD0']
seq=[('b',0),('b',1),('g','jungle-speed'),('b',2),('g','love-letter'),('b',3),('b',4),('g','timeline'),('b',5),('g','exploding-kittens'),('b',0),('b',1)]
H=212
x=316
for t,v in seq:
    if t=='b':
        hh=[150,175,160,185,150,170][v%6]
        fg+=bottle(x+25,SY,hh,cols[v%6]);x+=60
    else:
        w=H*size(v)[0]/size(v)[1]
        fg+=shadow(x+w/2,SY+2,w,.35)+img(v,x+w/2,SY-H/2,H,[-1.2,1,-1,1.2][len([1 for a in seq[:seq.index((t,v))] if a[0]=='g'])]);x+=w+14
# verres
def martini(x,y,liq,pick=True):
    s=P(f'M{x-48},{y-120} L{x+48},{y-120} L{x},{y-58} Z',liq,CREAM,4)
    s+=P(f'M{x-48},{y-120} L{x+48},{y-120} L{x+34},{y-100} L{x-34},{y-100} Z','#FFF',op=.28)
    s+=f'<line x1="{x}" y1="{y-58}" x2="{x}" y2="{y-8}" stroke="{CREAM}" stroke-width="6"/><ellipse cx="{x}" cy="{y-5}" rx="36" ry="7" fill="none" stroke="{CREAM}" stroke-width="5"/>'
    if pick: s+=f'<line x1="{x-20}" y1="{y-152}" x2="{x+16}" y2="{y-84}" stroke="{INK}" stroke-width="4"/>'+C(x+4,y-96,12,'#6BAA2A',INK,3)+C(x+6,y-96,4,RED)
    return s
def tumbler(x,y,liq,slice_col):
    s=P(f'M{x-42},{y-130} L{x+42},{y-130} L{x+34},{y} L{x-34},{y} Z','#FFF',CREAM,4,.25)
    s+=P(f'M{x-39},{y-100} L{x+39},{y-100} L{x+32},{y-4} L{x-32},{y-4} Z',liq,op=.95)
    for (dx,dy) in [(-14,-72),(12,-52),(-8,-30)]: s+=R(x+dx-12,y+dy-12,24,24,'#FFF',rx=5,op=.5,stroke=CREAM,sw=2)
    s+=f'<line x1="{x+16}" y1="{y-160}" x2="{x+2}" y2="{y-20}" stroke="{NEON2}" stroke-width="7" stroke-linecap="round"/>'
    s+=P(f'M{x+44},{y-130} a26,26 0 0 1 -52,0 Z',slice_col,INK,3)
    return s
def coupe(x,y,liq):
    s=P(f'M{x-46},{y-100} Q{x-44},{y-56} {x},{y-52} Q{x+44},{y-56} {x+46},{y-100} Z',liq,CREAM,4)
    s+=f'<ellipse cx="{x}" cy="{y-100}" rx="46" ry="8" fill="#FFF" opacity=".35"/>'
    s+=f'<line x1="{x}" y1="{y-52}" x2="{x}" y2="{y-8}" stroke="{CREAM}" stroke-width="6"/><ellipse cx="{x}" cy="{y-5}" rx="34" ry="7" fill="none" stroke="{CREAM}" stroke-width="5"/>'
    s+=C(x+24,y-118,10,RED,INK,2)+P(f'M{x+24},{y-128} q8,-18 22,-20','none','#2E7D32',4)
    return s
def bowl(x,y):
    s=P(f'M{x-50},{y-40} Q{x-44},{y} {x},{y} Q{x+44},{y} {x+50},{y-40} Z',TERRA,INK,3)
    for dx,dy in [(-26,-46),(0,-52),(26,-46),(-12,-62),(14,-62)]:
        s+=C(x+dx,y+dy,14,'#6BAA2A',INK,3)+C(x+dx+3,y+dy,4,RED)
    return s
Hc=268
items=[('x','martini'),('g','dobble'),('g','uno'),('x','tumbler'),('g','just-one'),('g','coup'),('x','coupe'),('g','skull'),('x','bowl'),('x','tumbler2')]
wx={'martini':100,'tumbler':100,'coupe':100,'bowl':120,'tumbler2':100}
tot=sum((Hc*size(v)[0]/size(v)[1]) if t=='g' else wx[v] for t,v in items)
x0,x1=110,1810
gap=(x1-x0-tot)/(len(items)-1)
x=x0;gi=0
for t,v in items:
    if t=='g':
        w=Hc*size(v)[0]/size(v)[1]
        fg+=shadow(x+w/2,CY+2,w,.4)+img(v,x+w/2,CY-Hc/2,Hc,[-1,1.2,-1,1][gi%4]);gi+=1;x+=w+gap
    else:
        w=wx[v];cx=x+w/2
        fg+={'martini':lambda:martini(cx,CY,'#D8F06A'),'tumbler':lambda:tumbler(cx,CY,'#F2762E',ORANGE),'coupe':lambda:coupe(cx,CY,'#FF8FD6'),'bowl':lambda:bowl(cx,CY),'tumbler2':lambda:tumbler(cx,CY,'#E0303F',SAFH)}[v]()
        x+=w+gap
# tabourets
for x,c in [(260,TERRA),(620,BLUE),(980,GREEN),(1340,VIOLET),(1700,ORANGE)]:
    fg+=R(x-8,1010,16,80,'#CFC3AE')+f'<ellipse cx="{x}" cy="1010" rx="74" ry="20" fill="{c}" stroke="{INK}" stroke-width="4"/><ellipse cx="{x}" cy="1002" rx="74" ry="20" fill="{c}" stroke="{INK}" stroke-width="4"/>'+zig(x,1002,40,26,8,fill='none',stroke=CREAM,sw=0)
    fg+=f'<ellipse cx="{x}" cy="1002" rx="46" ry="10" fill="none" stroke="{CREAM}" stroke-width="3" stroke-dasharray="6 6"/>'
render('meilleurs-jeux-apero',bg,fg,FUCH)
