import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from hvx_a import *
random.seed(11)
OR='#FF7A12'
art=bg(OR)
CX,CY=700,610
# bandes motifs africains gravés crème haut et bas
for y,flip in ((38,1),(1042,-1)):
    art+=f'<rect x="-10" y="{y-34}" width="1940" height="68" fill="{INK}"/>'
    art+=zigline(0,1920,y,12,64,CREAM,4)
    for x in range(30,1920,60):
        art+=f'<polygon points="{x},{y-6} {x+8},{y+2} {x},{y+10} {x-8},{y+2}" fill="{SAF}"/>'
# rayons de l'affiche : secteurs alternés plus clairs
for i in range(28):
    a0=2*math.pi*i/28; a1=2*math.pi*(i+.5)/28
    pts=f'{CX},{CY} '+' '.join(f'{CX+2600*math.cos(a):.0f},{CY+2600*math.sin(a):.0f}' for a in (a0,a1))
    art+=f'<polygon points="{pts}" fill="#FF9B2E" opacity=".75"/>'
# explosion (étoile irrégulière) en couches
def burst(cx,cy,r,n,jit,rot=0,seed=1):
    rnd=random.Random(seed); pts=[]
    for i in range(n*2):
        rr=r*(1 if i%2==0 else .62)*(1+rnd.uniform(-jit,jit))
        a=rot+math.pi*i/n
        pts.append(f'{cx+rr*math.cos(a):.1f},{cy+rr*math.sin(a):.1f}')
    return ' '.join(pts)
art+=f'<polygon points="{burst(CX+10,CY+14,760,17,.16,.1,5)}" fill="{INK}" opacity=".35"/>'
art+=f'<polygon points="{burst(CX,CY,760,17,.16,.1,5)}" fill="{INK}" stroke="{INK}" stroke-width="22" stroke-linejoin="round"/>'
art+=f'<polygon points="{burst(CX,CY,735,17,.16,.1,5)}" fill="{RED}"/>'
art+=f'<polygon points="{burst(CX,CY,600,15,.14,.25,8)}" fill="#FF5A1F" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
art+=f'<polygon points="{burst(CX,CY,470,13,.12,.4,2)}" fill="{SAF}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
art+=f'<polygon points="{burst(CX,CY,360,11,.1,.6,9)}" fill="{CREAM}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
# zigzags gravés crème dans l'anneau rouge
for k in range(34):
    a=2*math.pi*k/34
    x=CX+650*math.cos(a); y=CY+650*math.sin(a)
    art+=f'<g transform="translate({x:.0f},{y:.0f}) rotate({math.degrees(a)})"><polygon points="-14,0 0,-9 14,0 0,9" fill="none" stroke="{CREAM}" stroke-width="4"/></g>'
# flammes / traînées vers la droite derrière les boîtes
def streak(x,y,L,w,rot,col):
    return f'<g transform="translate({x},{y}) rotate({rot})"><path d="M0,0 L{-L},{-w} Q{-L*.8},0 {-L},{w} Z" fill="{col}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/></g>'
for (x,y,L,w,r,c) in [(1300,300,420,34,-8,RED),(1700,430,360,28,-12,SAF),(1280,560,460,30,4,SAF),(1760,760,400,34,10,RED),(1420,860,420,28,12,CREAM),(1660,170,330,26,-6,RED)]:
    art+=streak(x,y,L,w,r,c)
# étincelles : étoiles à quatre branches
def spark(x,y,s,col):
    return f'<polygon points="{x},{y-s} {x+s*.28},{y-s*.28} {x+s},{y} {x+s*.28},{y+s*.28} {x},{y+s} {x-s*.28},{y+s*.28} {x-s},{y} {x-s*.28},{y-s*.28}" fill="{col}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
for (x,y,s,c) in [(1010,110,30,CREAM),(1830,300,26,SAF),(1530,540,22,CREAM),(980,1000,28,SAF),(1860,560,20,CREAM),(300,120,26,SAF),(110,330,22,CREAM),(120,880,28,SAF),(1110,420,18,CREAM),(1580,960,22,CREAM)]:
    art+=spark(x,y,s,c)
layers=[('r',art)]
# boîtes
ims=''
ims+=img('exploding-kittens',620,690,560,rot=-5)
H=320
ims+=img('coup',1250,290,H,rot=-7)
ims+=img('bang',1610,300,H,rot=6)
ims+=img('uno',1150,790,H,rot=8)
ims+=img('jungle-speed',1440,800,H,rot=-6)
ims+=img('saboteur',1715,790,H,rot=7)
layers.append(('p',ims))
# chat noir en silhouette, bondit de la boîte
def cat(col=INK,ex=0):
    W=lambda w:w+ex
    s=''
    s+=f'<path d="M-95,-8 C-160,-30 -190,-110 -140,-165 C-118,-188 -84,-176 -80,-150" fill="none" stroke="{col}" stroke-width="{W(18)}" stroke-linecap="round"/>'
    s+=f'<path d="M-62,14 C-110,30 -150,52 -196,60" fill="none" stroke="{col}" stroke-width="{W(22)}" stroke-linecap="round"/>'
    s+=f'<path d="M-48,26 C-96,50 -126,86 -170,104" fill="none" stroke="{col}" stroke-width="{W(22)}" stroke-linecap="round"/>'
    s+=f'<path d="M70,6 C120,-8 160,-34 206,-52" fill="none" stroke="{col}" stroke-width="{W(20)}" stroke-linecap="round"/>'
    s+=f'<path d="M60,22 C110,24 160,16 212,6" fill="none" stroke="{col}" stroke-width="{W(20)}" stroke-linecap="round"/>'
    s+=f'<path d="M-100,6 C-100,-40 -40,-52 20,-46 C80,-42 110,-30 112,0 C110,34 60,50 0,50 C-60,50 -100,40 -100,6Z" fill="{col}" stroke="{col}" stroke-width="{ex}" stroke-linejoin="round"/>'
    s+=f'<ellipse cx="124" cy="-18" rx="{44+ex/2}" ry="{38+ex/2}" fill="{col}"/>'
    s+=f'<path d="M92,-44 L98,-102 L134,-54Z" fill="{col}" stroke="{col}" stroke-width="{6+ex}" stroke-linejoin="round"/>'
    s+=f'<path d="M130,-52 L166,-96 L168,-34Z" fill="{col}" stroke="{col}" stroke-width="{6+ex}" stroke-linejoin="round"/>'
    return s
def cat_details():
    s=f'<path d="M102,-54 L103,-82 L120,-58Z" fill="{TERRA}"/><path d="M144,-56 L158,-80 L158,-48Z" fill="{TERRA}"/>'
    for ex_ in (118,146):
        s+=f'<path d="M{ex_-9},-18 Q{ex_},-32 {ex_+10},-16 Q{ex_},-10 {ex_-9},-18Z" fill="{SAFH}"/><ellipse cx="{ex_+1}" cy="-19" rx="2.5" ry="7" fill="{INK}"/>'
    for dy,a in [(0,-6),(8,6)]:
        s+=f'<line x1="156" y1="{-2+dy}" x2="204" y2="{-2+dy+a*3}" stroke="{CREAM}" stroke-width="3" stroke-linecap="round"/>'
    s+=f'<path d="M-70,-26 C-30,-38 30,-36 60,-26" fill="none" stroke="{CREAM}" stroke-width="4" opacity=".5" stroke-linecap="round"/>'
    return s
catg=f'<g transform="translate(790,318) rotate(-12) scale(1.3)">{cat(CREAM,12)}{cat()}{cat_details()}</g>'
layers.append(('r',catg))
render_layers('jeux-comme-exploding-kittens',layers)
