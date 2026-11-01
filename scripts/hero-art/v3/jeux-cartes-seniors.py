import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from h3lib import *
rng=random.Random(8)
BG='#BCDCA6'; WOOD='#8A5A3C'; WOODL='#B07C52'; WIC='#D2A15C'; WICD='#8E5F2C'; HEDGE='#7DB36C'; HEDGED='#5E9A57'
a=bgrect(BG)
# haie au fond
a+=f'<rect x="-40" y="470" width="2000" height="420" fill="{HEDGED}"/>'
for _ in range(210):
    x=rng.uniform(-20,1940); y=rng.uniform(440,860); r=rng.uniform(34,66)
    a+=f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="{rng.choice([HEDGE,HEDGED,shade(HEDGE,.12)])}"/>'
for _ in range(60):
    x=rng.uniform(100,1820); y=rng.uniform(520,830)
    a+=flower(x,y,rng.uniform(9,14),rng.choice([PINK,CREAM,SAFH,'#E88BA8']))
# sol : terrasse en dalles
a+=f'<rect x="-40" y="850" width="2000" height="260" fill="#E3CFA6"/><rect x="-40" y="850" width="2000" height="10" fill="{INK}" opacity=".7"/>'
for k,y in enumerate((850,905,970,1040)):
    a+=f'<line x1="-40" y1="{y}" x2="1960" y2="{y}" stroke="{WICD}" stroke-width="3" opacity=".5"/>'
    off=0 if k%2==0 else 90
    nxt=(905,970,1040,1110)[k]
    for x in range(-100+off,2000,180):
        a+=f'<line x1="{x}" y1="{y}" x2="{x-12}" y2="{nxt}" stroke="{WICD}" stroke-width="3" opacity=".5"/>'
# tonnelle : poteaux, poutres, lattes
for px in (20,1830):
    a+=f'<rect x="{px}" y="40" width="70" height="880" fill="{WOOD}" stroke="{INK}" stroke-width="5"/>'
    a+=f'<rect x="{px+12}" y="60" width="10" height="840" fill="{WOODL}" opacity=".6"/>'
    a+=''.join(f'<polygon points="{px+35},{y-12} {px+47},{y} {px+35},{y+12} {px+23},{y}" fill="{CREAM}" opacity=".8"/>' for y in range(150,880,90))
a+=f'<rect x="-40" y="30" width="2000" height="80" fill="{WOOD}" stroke="{INK}" stroke-width="5"/>'
a+=f'<rect x="-40" y="42" width="2000" height="10" fill="{WOODL}" opacity=".7"/>'
for x in range(40,1920,120):
    a+=f'<rect x="{x}" y="108" width="40" height="46" fill="{WOOD}" stroke="{INK}" stroke-width="4"/>'
a+=diamonds(-20,1940,78,60,8,CREAM,.8)
# vigne et glycine
for x in range(-20,1960,56):
    y=112+rng.uniform(0,30); a+=leaf(x,y,rng.uniform(40,60),rng.uniform(30,150),rng.choice([GREEN,'#2F8F4E',HEDGE]))
for x in range(60,1900,95):
    L=rng.uniform(110,260); y0=150
    a+=f'<path d="M{x},{y0} C{x+22},{y0+L*.4} {x-18},{y0+L*.7} {x+6},{y0+L}" fill="none" stroke="{INK}" stroke-width="4"/>'
    for j in range(6):
        t=j/5; yy=y0+L*t; xx=x+ (8*math.sin(t*6))
        a+=leaf(xx,yy,34,rng.choice([20,160]),GREEN)
    col=rng.choice([VIOLET,'#9B7BD0','#C99AD8'])
    for j in range(7):
        a+=f'<ellipse cx="{x+6+rng.uniform(-14,14):.0f}" cy="{y0+L+ j*14:.0f}" rx="{13-j}" ry="14" fill="{col}" stroke="{INK}" stroke-width="2.5"/>'
# fauteuil en osier (face à droite)
def chair():
    s=''
    def rail(d,w=26):
        return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w+10}" stroke-linecap="round" stroke-linejoin="round"/><path d="{d}" fill="none" stroke="{WIC}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
    # pieds
    s+=rail('M-170,-110 L-196,0',24)+rail('M95,-110 L112,0',24)
    # dossier
    s+=f'<g transform="rotate(-7 -160 -170)"><rect x="-205" y="-480" width="100" height="320" rx="50" fill="{WIC}" stroke="{INK}" stroke-width="6"/>'
    for y in range(-440,-170,26): s+=f'<path d="M-195,{y} q40,12 80,0" fill="none" stroke="{WICD}" stroke-width="3.5" opacity=".8"/>'
    s+=f'<rect x="-190" y="-455" width="70" height="260" rx="34" fill="none" stroke="{WICD}" stroke-width="4"/>'
    s+='</g>'
    # assise osier
    s+=f'<rect x="-205" y="-200" width="340" height="80" rx="26" fill="{WIC}" stroke="{INK}" stroke-width="6"/>'
    for x in range(-180,120,30): s+=f'<path d="M{x},-190 q8,30 0,62" fill="none" stroke="{WICD}" stroke-width="3.5" opacity=".8"/>'
    # accoudoir
    s+=rail('M-150,-330 L60,-330 Q100,-330 100,-290 L100,-200',26)
    s+=f'<path d="M-150,-330 L60,-330" stroke="{WICD}" stroke-width="3" stroke-dasharray="10 8"/>'
    # coussins
    s+=f'<rect x="-165" y="-420" width="62" height="210" rx="30" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
    s+=''.join(f'<polygon points="-134,{y-10} -124,{y} -134,{y+10} -144,{y}" fill="{CREAM}"/>' for y in range(-390,-230,32))
    s+=f'<rect x="-175" y="-246" width="290" height="58" rx="26" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
    s+=tri_band(-150,90,-216,10,16,CREAM,4,.9)
    return s
a+=f'<ellipse cx="318" cy="965" rx="210" ry="22" fill="{INK}" opacity=".18"/><ellipse cx="1602" cy="965" rx="210" ry="22" fill="{INK}" opacity=".18"/>'
a+=f'<g transform="translate(330,965)">{chair()}</g>'
a+=f'<g transform="translate(1590,965) scale(-1,1)">{chair()}</g>'
# table ronde nappe
tx,ty,rx,ry=960,832,470,58
a+=f'<ellipse cx="{tx+10}" cy="1010" rx="{rx-10}" ry="40" fill="{INK}" opacity=".25"/>'
sk=f'M{tx-rx},{ty} L{tx-rx+16},990 '
n=14; wdt=2*(rx-16)/n
for i in range(n): sk+=f'q{wdt/2},{-4+46} {wdt},0 '
sk+=f'L{tx+rx},{ty} Z'
a+=f'<path d="{sk}" fill="{SAF}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
a+=tri_band(tx-rx+30,tx+rx-30,930,26,26,CREAM,5,.95)+diamonds(tx-rx+30,tx+rx-30,893,26,7,TERRA,.95)+diamonds(tx-rx+30,tx+rx-30,968,26,6,TERRA,.95)
a+=f'<ellipse cx="{tx}" cy="{ty}" rx="{rx}" ry="{ry}" fill="{CREAM}" stroke="{INK}" stroke-width="6"/><ellipse cx="{tx}" cy="{ty+4}" rx="{rx-34}" ry="{ry-17}" fill="none" stroke="{TERRA}" stroke-width="4" stroke-dasharray="14 10"/>'
# pot de géraniums et arrosoir (au sol)
px,py=0,0
pot=''
pot+=f'<path d="M{px-58},{py-95} L{px+58},{py-95} L{px+44},{py} L{px-44},{py}Z" fill="{TERRA}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/><rect x="{px-66}" y="{py-118}" width="132" height="30" rx="6" fill="{shade(TERRA,.15)}" stroke="{INK}" stroke-width="5"/>'
pot+=tri_band(px-40,px+40,py-40,4,14,CREAM,4)
for k in range(5):
    pot+=leaf(px+rng.uniform(-30,30),py-118,rng.uniform(42,60),rng.uniform(-170,-10),GREEN)
for fx,fy in ((-34,-176),(0,-196),(34,-174),(-12,-150),(22,-146)):
    pot+=flower(px+fx,py+fy,16,RED,SAFH)
wx,wy=0,0
can=''
can+=f'<ellipse cx="{wx+4}" cy="{wy+8}" rx="95" ry="14" fill="{INK}" opacity=".25"/>'
can+=f'<path d="M{wx-70},{wy-120} L{wx+60},{wy-120} L{wx+72},{wy} L{wx-82},{wy}Z" fill="{BLUE}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
can+=f'<path d="M{wx+60},{wy-90} L{wx+170},{wy-190} L{wx+190},{wy-175} L{wx+80},{wy-60}Z" fill="{BLUE}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/><path d="M{wx+170},{wy-200} l28,22 l-16,22 l-32,-10Z" fill="{shade(BLUE,.2)}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
can+=f'<path d="M{wx-70},{wy-100} C{wx-130},{wy-170} {wx-70},{wy-230} {wx+10},{wy-170}" fill="none" stroke="{INK}" stroke-width="16" stroke-linecap="round"/><path d="M{wx-70},{wy-100} C{wx-130},{wy-170} {wx-70},{wy-230} {wx+10},{wy-170}" fill="none" stroke="{BLUE}" stroke-width="7" stroke-linecap="round"/>'
can+=tri_band(wx-60,wx+60,wy-50,6,14,CREAM,4)
a+=f'<g transform="translate(1630,1038) scale(.85)">{pot}</g>'
a+=f'<g transform="translate(330,1060) scale(.78)">{can}</g>'
# --- boîtes sur la table
VH={'schotten-totten':370,'kyran':300,'skyjo':370,'no-thanks':280,'uno':380,'6-qui-prend':280}
def row(ids,x0,x1,base,rots):
    ws=[vw(i,VH[i]) for i in ids]; gap=(x1-x0-sum(ws))/(len(ids)-1); x=x0; o=[]
    for i,w,r in zip(ids,ws,rots):
        o.append(vimg(i,x+w/2,base-VH[i]/2,VH[i],rot=r)); x+=w+gap
    return o
b=''.join(row(['schotten-totten','uno','skyjo'],560,1360,795,[-4,0,4])+row(['no-thanks','kyran','6-qui-prend'],640,1280,872,[-4,1,4]))
# --- devant : tasses, lunettes
c=''
def cup(x,y,col):
    s=f'<ellipse cx="{x+4}" cy="{y+10}" rx="70" ry="16" fill="{INK}" opacity=".25"/><ellipse cx="{x}" cy="{y+6}" rx="66" ry="16" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
    s+=f'<path d="M{x-42},{y-48} L{x+42},{y-48} L{x+34},{y+4} Q{x},{y+16} {x-34},{y+4}Z" fill="{col}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    s+=f'<path d="M{x+40},{y-38} q34,-4 24,22 q-8,14 -32,10" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    s+=f'<ellipse cx="{x}" cy="{y-48}" rx="42" ry="9" fill="{shade(col,-.45)}" stroke="{INK}" stroke-width="4"/>'
    s+=f'<path d="M{x-28},{y-70} q-12,-18 0,-34 q12,-16 0,-30 M{x+4},{y-72} q-12,-18 0,-34 q12,-16 0,-30" fill="none" stroke="{CREAM}" stroke-width="5" stroke-linecap="round" opacity=".9"/>'
    s+=f'<path d="M{x-30},{y-26} L{x+30},{y-26}" stroke="{CREAM}" stroke-width="4"/>'
    return s
c+=cup(585,872,TERRA)+cup(1335,872,BLUE)
# lunettes
gx,gy=300,712
c+=f'<g transform="rotate(-4 {gx} {gy})"><circle cx="{gx-46}" cy="{gy}" r="30" fill="#fff" fill-opacity=".45" stroke="{INK}" stroke-width="6"/><circle cx="{gx+46}" cy="{gy}" r="30" fill="#fff" fill-opacity=".45" stroke="{INK}" stroke-width="6"/><path d="M{gx-16},{gy-6} q16,-12 32,0" fill="none" stroke="{INK}" stroke-width="6"/><path d="M{gx-76},{gy-4} L{gx-120},{gy-16} M{gx+76},{gy-4} L{gx+120},{gy-16}" stroke="{INK}" stroke-width="6" stroke-linecap="round"/><path d="M{gx-62},{gy-16} q8,-8 18,-4" stroke="#fff" stroke-width="4" fill="none"/></g>'
# papillons
def butterfly(x,y,col,rot):
    return f'<g transform="translate({x},{y}) rotate({rot})"><path d="M0,0 C-30,-40 -62,-16 -40,10 C-22,20 -8,12 0,0Z M0,0 C30,-40 62,-16 40,10 C22,20 8,12 0,0Z" fill="{col}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><path d="M0,-4 L0,24" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><circle cx="-18" cy="-6" r="6" fill="{CREAM}"/><circle cx="18" cy="-6" r="6" fill="{CREAM}"/></g>'
c+=butterfly(430,350,ORANGE,-18)+butterfly(1500,300,BLUE,14)
open('/tmp/claude-0/vec/jeux-cartes-seniors.svg','w').write(doc([(True,a),(False,b),(True,c)],BG))
