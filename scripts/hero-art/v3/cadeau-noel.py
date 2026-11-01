import sys;sys.path.insert(0,'/tmp/claude-0/vec')
from hv3 import *
random.seed(5)
FLOOR=995
bg=''
bg+=latt(0,0,1920,990,90,CREAM,.07,2.5)
# wall wainscot
bg+=R(0,760,1920,235,'#0E2A1E')+zigband(0,742,1920,22,'#0E2A1E',64)
bg+=R(0,FLOOR,1920,85,'#3A2719')
for i in range(0,1920,160): bg+=f'<line x1="{i}" y1="{FLOOR}" x2="{i-30}" y2="1080" stroke="#241608" stroke-width="3"/>'
# flocons
for i in range(70):
    x=random.randint(20,1900);y=random.randint(20,740)
    bg+=flake(x,y,random.choice([8,11,14]),.28)
# window
wx,wy,ww,wh=900,110,230,470
bg+=R(wx-18,wy-18,ww+36,wh+36,'#6B3F24',rx=14)
bg+=f'<path d="M{wx},{wy+wh} L{wx},{wy+ww/2} A{ww/2},{ww/2} 0 0 1 {wx+ww},{wy+ww/2} L{wx+ww},{wy+wh} Z" fill="#0B1D38"/>'
bg+=C(wx+ww*0.68,wy+120,34,'#F6E7B5')+C(wx+ww*0.68+14,wy+112,30,'#0B1D38')
for i in range(26):
    bg+=C(random.randint(wx+14,wx+ww-14),random.randint(wy+60,wy+wh-60),random.choice([3,4,5]),CREAM,op=.85)
for (x,y) in [(wx+50,wy+200),(wx+150,wy+300),(wx+90,wy+390)]: bg+=flake(x,y,14,.9)
bg+=R(wx,wy+wh-70,ww,70,'#EAF1F5')  # neige sur le rebord
bg+=P(f'M{wx},{wy+wh-70} q30,-22 60,0 q35,-26 70,0 q30,-18 60,0 q20,-14 40,0 V{wy+wh-60} H{wx} Z','#EAF1F5')
bg+=R(wx+ww/2-4,wy,8,wh,'#6B3F24')+R(wx,wy+250,ww,8,'#6B3F24')
bg+=f'<path d="M{wx},{wy+wh} L{wx},{wy+ww/2} A{ww/2},{ww/2} 0 0 1 {wx+ww},{wy+ww/2} L{wx+ww},{wy+wh}" fill="none" stroke="#6B3F24" stroke-width="12"/>'
# tenture africaine
kx,ky,kw,kh=1210,150,250,430
bg+=R(kx-8,ky-30,kw+16,16,'#6B3F24',rx=6)+f'<line x1="{kx+30}" y1="{ky-14}" x2="{kx+30}" y2="{ky}" stroke="#6B3F24" stroke-width="5"/>'
bg+=R(kx,ky-14,kw,kh,TERRA)+R(kx+14,ky,kw-28,kh-28,SAF)
bg+=R(kx+28,ky+14,kw-56,kh-56,TERRA)
for j in range(5):
    yy=ky+36+j*72
    bg+=zigband(kx+36,yy,kw-72,34,CREAM if j%2==0 else INK,6)
    bg+=loz_row(kx+36,yy+40,kw-72,22,SAFH if j%2==0 else CREAM,5)
bg+=''.join(R(kx+8+i*(kw-16)/9,ky+kh-16,10,34,SAF) for i in range(10))
# guirlande lumineuse
gl='M-10,60 '
pts=[]
for i in range(11):
    gl+=f'Q{i*190+95},{150 if i%2==0 else 140} {(i+1)*190},60 '
bg+=P(gl,'none','#0A1F15',4)
for i in range(30):
    x=40+i*63;y=60+ (math.sin((x%190)/190*math.pi))*(88 if True else 0)*0.0
    pass
# cheminée
sx0,sx1=100,790
bg+=R(sx0,372,sx1-sx0,FLOOR-372,'#7A6A5C')
for r in range(0,12):
    y=372+r*52
    bg+=f'<line x1="{sx0}" y1="{y}" x2="{sx1}" y2="{y}" stroke="#4E4137" stroke-width="3"/>'
    for c in range(0,9):
        x=sx0+(c*80+(40 if r%2 else 0))
        if sx0<x<sx1: bg+=f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+52}" stroke="#4E4137" stroke-width="3"/>'
fx0,fx1,fy=240,650,FLOOR
bg+=f'<path d="M{fx0},{fy} V690 Q{fx0},600 {(fx0+fx1)/2},600 Q{fx1},600 {fx1},690 V{fy} Z" fill="#160D08" stroke="#3A2E26" stroke-width="14"/>'
bg+=f'<path d="M{fx0+20},{fy} V700 Q{fx0+20},630 {(fx0+fx1)/2},630 Q{fx1-20},630 {fx1-20},700 V{fy} Z" fill="url(#glow)"/>'
bg+=R(fx0+30,fy-34,fx1-fx0-60,26,'#4A2A15',rx=12)+R(fx0+60,fy-62,fx1-fx0-120,26,'#5A331A',rx=12)
bg+=flame(445,fy-50,250,200)+flame(380,fy-50,160,110)+flame(515,fy-50,175,120)
# manteau
bg+=R(60,330,sx1-60+0,44,'#6B3F24',rx=8)+zigband(66,338,sx1-72,28,CREAM,38,.9)
# guirlande
g=f'M70,372 '
for i in range(8): g+=f'Q{70+i*90+45},{420 if i%2==0 else 410} {70+(i+1)*90},372 '
bg+=P(g,'none','#1F7A3E',16)
for i in range(9): bg+=C(70+i*90,374,8,RED if i%2 else SAF)
bg+='<ellipse cx="445" cy="1000" rx="520" ry="70" fill="url(#glow)"/>'
for (x,y) in [(420,640),(500,600),(380,700),(540,680)]: bg+=C(x,y,4,SAFH,op=.9)
# tapis
bg+=R(280,FLOOR+22,1280,40,TERRA,rx=16)+zigband(300,FLOOR+30,1240,22,CREAM,70,.8)
fg=''
# ampoules
for i in range(11):
    for k in range(1,5):
        if i==9 and k==4: continue
        t=k/5;x0=i*190-10+ (i and 10 or 0);x=i*190+t*190;y=60+ (4*t*(1-t))*(80 if i%2==0 else 70)
        c=[RED,SAFH,BLUE,GREEN,ORANGE][(i*4+k)%5]
        fg+=C(x,y+8,11,c,INK,2)+C(x-3,y+4,3,CREAM,op=.8)
# boîtes sur le manteau
for i,(a,x,rot) in enumerate([('codenames',210,-2),('the-crew',430,2),('hanabi',650,-2)]):
    h=262
    fg+=shadow(x,332,170,.3)+img(a,x,330-h/2,h,rot)
# bas
cols=[RED,SAF,BLUE,VIOLET,GREEN,ORANGE]
def stocking(x,y,col,k):
    s=f'<g transform="translate({x},{y})">'
    s+=C(30,-6,10,'none',SAFH,4)
    s+=P('M-35,0 L35,0 L35,128 C35,165 72,172 92,190 C112,208 100,238 70,238 C38,238 -6,228 -20,196 C-30,172 -35,150 -35,128 Z',col,INK,4)
    s+=zigband(-33,56,66,22,CREAM,4,.95)
    s+=P('M-35,200 C-30,215 -10,230 22,236 C40,236 56,228 40,208 C20,214 -10,206 -20,196 Z',CREAM,op=.9)
    s+=P('M50,196 C70,198 98,200 92,190 C80,176 60,178 50,196Z',CREAM,op=.0)
    s+=R(-40,-8,80,34,CREAM,rx=10,stroke=INK,sw=3)
    for i in range(5): s+=C(-28+i*14,9,3.5,[RED,GREEN][i%2])
    return s+'</g>'
for i in range(6):
    fg+=stocking(142+i*108,392,cols[i],i)
# sapin (de côté, coupé par le bord droit)
tx=1830
def tier(top,base,w,col):
    pts=[(tx,top)]
    n=5
    pts.append((tx-w,base))
    for k in range(1,n+1):
        pts.append((tx-w+ (k*(2*w)/n)-(w/n if k<n else 0), base-26 if k%2==0 else base+4))
    pts.append((tx+w,base)); 
    return poly([(tx,top),(tx-w,base-8),(tx-w*0.6,base+10),(tx-w*0.25,base-10),(tx,base+10),(tx+w,base-8),(tx+w,base-9)],col,'#0A1F15',4)
fg+=R(tx-30,900,60,100,'#5A331A')
tre=[(130,380,150),(300,570,215),(470,750,280),(640,935,345)]
for k,(a,b,w) in enumerate(tre):
    fg+=tier(a,b,w,['#1E7A3E','#17693A','#1E7A3E','#17693A'][k])
    fg+=P(f'M{tx-w*0.8},{b-6} Q{tx-w*0.4},{b-70} {tx},{b-24} T{tx+w},{b-70}','none',CREAM,6,.9)
for (x,y,c) in [(1700,420,RED),(1760,600,SAF),(1640,760,BLUE),(1720,860,RED),(1790,740,SAF),(1760,470,VIOLET),(1800,330,ORANGE),(1790,260,RED),(1650,590,GREEN),(1700,700,SAF)]:
    fg+=C(x,y,15,c,INK,3)+C(x-5,y-5,4,CREAM,op=.8)
fg+=poly([(tx-4,95+0),(tx+14,128),(tx+52,128),(tx+22,150),(tx+34,188),(tx-4,164),(tx-42,188),(tx-30,150),(tx-60,128),(tx-22,128)],SAF,INK,4)
# paquets cadeaux au pied
def gift(x,y,w,h,col,rib):
    return R(x,y,w,h,col,rx=4,stroke=INK,sw=3)+R(x+w/2-9,y,18,h,rib)+R(x,y+h*0.35,w,16,rib,op=0)+P(f'M{x+w/2},{y} q-34,-34 -40,-6 q6,12 40,6 q34,6 40,-6 q-6,-28 -40,6',rib,INK,2)
fg+=gift(1560,925,90,70,RED,SAFH)+gift(1680,945,110,50,BLUE,CREAM)+gift(1840,930,90,65,VIOLET,SAFH)
# boîtes au pied
for a,x,rot in [('dixit',958,-1.2),('timeline',1202,1.0),('lost-cities',1448,-1.0)]:
    h=245
    fg+=shadow(x,FLOOR+2,h*0.95,.38)+img(a,x,FLOOR-h/2,h,rot)
# neige tombante au premier plan + monticule
for i in range(36):
    fg+=C(random.randint(10,1900),random.randint(10,1070),random.choice([3,4,5]),CREAM,op=.55)
render('cadeau-noel',bg,fg,SAPIN)
