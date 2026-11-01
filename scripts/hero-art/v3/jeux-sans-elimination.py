import sys,math
sys.path.insert(0,'/tmp/claude-0/vec')
from v3m4_lib import *
BG='#EF6B57'
DEEP='#D9503F';DEEP2='#C23F32'
# ---------- fond corail : bunting, tapis en losange gravé, rayons
bg=''
# rayons gravés derrière la gerbe de boîtes
for k in range(24):
    a=math.radians(k*15+7.5)
    r1,r2=190,520 if k%2 else 430
    x1,y1=960+r1*math.cos(a),250+r1*math.sin(a)*0.9
    x2,y2=960+r2*math.cos(a),250+r2*math.sin(a)*0.9
    bg+=f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{CREAM}" stroke-width="{7 if k%2 else 4}" stroke-linecap="round" opacity=".5"/>'
bg+=zig(960,250,470,380,20,fill='none',stroke=CREAM,sw=4).replace('<polygon','<polygon opacity=".35"')
# guirlande de fanions
cols=[RED,SAF,GREEN,BLUE,VIOLET,CREAM,ORANGE]
for (xa,xb,ya,yb,sag) in [(-20,980,24,60,40),(940,1940,60,24,40)]:
    n=14
    bg+=f'<path d="M{xa},{ya} Q{(xa+xb)/2},{(ya+yb)/2+sag*2} {xb},{yb}" fill="none" stroke="{INK}" stroke-width="3"/>'
    for i in range(n):
        t=(i+.5)/n
        x=(1-t)**2*xa+2*(1-t)*t*(xa+xb)/2+t*t*xb
        y=(1-t)**2*ya+2*(1-t)*t*((ya+yb)/2+sag*2)+t*t*yb
        bg+=f'<polygon points="{x-20:.0f},{y:.0f} {x+20:.0f},{y+4:.0f} {x:.0f},{y+54:.0f}" fill="{cols[i%7]}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
for (x,y,r1,r2,n) in [(250,470,150,104,12),(1680,470,150,104,12),(230,250,80,56,10),(1700,250,80,56,10)]:
    bg+=zig(x,y,r1,r2,n,fill='none',stroke=CREAM,sw=5).replace('<polygon','<polygon opacity=".6"')
    bg+=lozenge(x,y,r2*.4,r2*.4,fill=CREAM,stroke='none',sw=0,op=.7)
# tapis losange
RX,RY=880,205
rc=(960,900)
bg+=lozenge(*rc,RX,RY,fill=DEEP,stroke=INK,sw=4)
for k,(f,c,op) in enumerate(((.86,CREAM,.9),(.72,CREAM,.6),(.58,SAFH,.8),(.44,CREAM,.5))):
    bg+=lozenge(rc[0],rc[1],RX*f,RY*f,fill='none',stroke=c,sw=5 if k<3 else 3,op=op)
for i in range(-6,7):
    bg+=lozenge(rc[0]+i*110,rc[1],18,10,fill=CREAM,stroke='none',sw=0,op=.55)
# petits losanges flottants
import random
random.seed(5)
for _ in range(34):
    x=random.randint(30,1890);y=random.randint(130,720)
    if abs(x-960)<520 and y<480: continue
    r=random.choice((7,10,13))
    bg+=lozenge(x,y,r,r,fill=random.choice((CREAM,SAFH,'#FFB4A2')),stroke='none',sw=0,op=.55)
# ---------- anneau de cinq personnages qui se tiennent la main
cx,cy,rx,ry=960,850,360,118
angs=[270,342,54,126,198]
pos=[]
for a in angs:
    t=math.radians(a)
    s=.78+.2*(math.sin(t)+1)/2
    pos.append((cx+rx*math.cos(t),cy+ry*math.sin(t),s))
views=['front','left','back','back','right']
skins=[SKIN[1],SKIN[3],SKIN[0],SKIN[2],SKIN[4]]
robes=[VIOLET,GREEN,CREAM,'#1F63B5',SAF]
accs=[SAFH,CREAM,RED,SAFH,INK]
pst=[2,1,0,2,0]
hairs=[('bun','#2A1A12'),('afro','#1C1416'),('braids','#2A1A12'),('wrap',SAF),('afro','#3B2A22')]
n=5
W=[(p[0],p[1]-205*p[2]) for p in pos]
M=[((W[i][0]+W[(i+1)%n][0])/2,(W[i][1]+W[(i+1)%n][1])/2+8) for i in range(n)]
people=[]
order=sorted(range(n),key=lambda i:pos[i][1])
for i in order:
    x,f,s=pos[i]
    hands=[]
    for m in (M[i],M[(i-1)%n]):
        side=1 if m[0]>x else -1
        hands.append((side,m[0],m[1]))
    if views[i] in ('left','right'):
        hands=[(1,h[1],h[2]) for h in hands]
    hk,hc=hairs[i]
    people.append(stand(x,f,s,views[i] if views[i]!='right' else 'right',skins[i],robes[i],accs[i],pst[i],hk,hc,hands))
# mains jointes par-dessus : deux mains superposées, teintes différentes
joins=''
for i in range(n):
    j=(i+1)%n
    sa=(pos[i][2]+pos[j][2])/2
    joins+=f'<circle cx="{M[i][0]-6*sa:.1f}" cy="{M[i][1]:.1f}" r="{18*sa:.1f}" fill="{skins[i]}" stroke="{INK}" stroke-width="3"/>'
    joins+=f'<circle cx="{M[i][0]+6*sa:.1f}" cy="{M[i][1]+3:.1f}" r="{18*sa:.1f}" fill="{skins[j]}" stroke="{INK}" stroke-width="3"/>'
# gerbe de cinq boîtes au-dessus de l'anneau
boxes=''
for id_,x,y,h,r in [('sushi-go',575,290,240,-14),('timeline',760,232,245,-7),('hanabi',960,172,285,0),('no-thanks',1160,232,245,7),('skyjo',1350,290,250,14)]:
    boxes+=img(id_,x,y,h,r)
layers=[(bg,True),(''.join(people[:2]),False),(''.join(people[2:]),False),(joins,False),(boxes,False)]
open('/tmp/claude-0/vec/jeux-sans-elimination.svg','w').write(svg3(layers,BG))
