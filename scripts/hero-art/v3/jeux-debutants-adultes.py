import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from h4common import *
random.seed(8)
PINK='#F8D5DF'; PINKD='#EDB4C6'; PINKL='#FCE8EE'
bg=''
dx,dy=1540,560
# grand soleil leve derriere la porte
dx,dy=1540,560
for i in range(18):
    a=math.pi+i*math.pi/17
    bg+=f'<polygon points="{dx},{dy-100} {dx+1100*math.cos(a-0.04):.0f},{dy-100+1100*math.sin(a-0.04):.0f} {dx+1100*math.cos(a+0.04):.0f},{dy-100+1100*math.sin(a+0.04):.0f}" fill="{SAFH}" opacity=".35"/>'
# collines et nuages graves
bg+=path('M-20,700 C200,560 420,640 640,560 C860,480 1000,560 1200,470 C1400,390 1700,430 1940,380 L1940,1100 L-20,1100 Z',fill=PINKD,stroke=INK,sw=4)
for i in range(7):
    bg+=path(f'M{60+i*120},{700-i*14+ (i%2)*8} q40,-20 80,0',stroke=CREAM,sw=4,extra='opacity=".8"')
def cloud(x,y,s):
    g=f'<g transform="translate({x},{y}) scale({s})">'
    g+=path('M-120,40 C-170,40 -170,-20 -120,-20 C-120,-80 -50,-90 -20,-50 C10,-100 90,-80 90,-20 C150,-20 150,40 100,40 Z',fill=PINKL,stroke=INK,sw=5)
    g+=path('M-90,12 h160',stroke=PINKD,sw=5)+path('M-60,-8 h100',stroke=PINKD,sw=5)
    return g+'</g>'
bg+=cloud(300,130,1.3)+cloud(760,260,1)+cloud(1020,100,.9)
# escalier : marches faites de cartes empilees
steps=[(30,880),(330,795),(630,710),(930,625)]
def stairblock(x,top,w,floor=1100):
    s=rect(x,top,w,floor-top,CREAM,sw=5)
    # tranches de cartes (lignes)
    for yy in range(int(top)+24,floor,22):
        s+=f'<line x1="{x+6}" y1="{yy}" x2="{x+w-6}" y2="{yy}" stroke="{INK}" stroke-width="2.5" opacity=".35"/>'
    s+=rect(x,top,w,22,TERRA,sw=5)
    s+=''.join(f'<polygon points="{x+14+i*(w-28)/9:.0f},{top+6} {x+14+(i+.5)*(w-28)/9:.0f},{top+16} {x+14+(i+1)*(w-28)/9:.0f},{top+6}" fill="{CREAM}"/>' for i in range(9))
    return s
for x,top in steps:
    bg+=stairblock(x,top,300)
# bandeaux de couleur sur contremarches
cols=[RED,BLUE,GREEN,VIOLET]
for i,(x,top) in enumerate(steps):
    bg+=f'<rect x="{x+20}" y="{top+44}" width="260" height="34" fill="{cols[i]}" stroke="{INK}" stroke-width="3.5"/>'
    for k in range(10):
        bg+=f'<polygon points="{x+30+k*25},{top+61} {x+42+k*25},{top+50} {x+54+k*25},{top+61} {x+42+k*25},{top+72}" fill="{CREAM}"/>'
for i,(x,top) in enumerate(steps):
    for j,k in enumerate('shdc'[i:]+'shdc'[:i]):
        if top+150+j*90<1050:
            bg+=suit(k,x+150,top+150+j*90,.7)
# plateforme
bg+=stairblock(1230,540,700)
# porte ouverte lumineuse
w2,h2=170,400
dtop=540-h2-40
arch=f'M{dx-w2},540 L{dx-w2},{dtop+w2} A{w2},{w2} 0 0 1 {dx+w2},{dtop+w2} L{dx+w2},540 Z'
bg+=path(arch,fill=INK,stroke=INK,sw=6,extra='transform="translate(10,12)" opacity=".25"')
bg+=path(f'M{dx-w2-24},540 L{dx-w2-24},{dtop+w2} A{w2+24},{w2+24} 0 0 1 {dx+w2+24},{dtop+w2} L{dx+w2+24},540 Z',fill=TERRA,stroke=INK,sw=6)
bg+=path(arch,fill='#FFF4C2',stroke=INK,sw=5)
# lumiere interieure : rayons
bg+=f'<defs><clipPath id="dc"><path d="{arch}"/></clipPath><radialGradient id="gl" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="{SAFH}"/></radialGradient></defs>'
bg+=f'<g clip-path="url(#dc)"><rect x="{dx-w2}" y="{dtop}" width="{2*w2}" height="{540-dtop}" fill="url(#gl)"/>'
for i in range(9):
    a=-math.pi+ (i+.5)*math.pi/9
    bg+=f'<polygon points="{dx},{dtop+250} {dx+400*math.cos(a-.07):.0f},{dtop+250+400*math.sin(a-.07):.0f} {dx+400*math.cos(a+.07):.0f},{dtop+250+400*math.sin(a+.07):.0f}" fill="{CREAM}" opacity=".7"/>'
# colline + soleil dans l'ouverture
bg+=f'<circle cx="{dx}" cy="{dtop+250}" r="46" fill="{ORANGE}" stroke="{INK}" stroke-width="4"/>'
bg+=path(f'M{dx-w2},{540-70} C{dx-80},{540-120} {dx+60},{540-60} {dx+w2},{540-110} L{dx+w2},540 L{dx-w2},540 Z',fill=GREEN,stroke=INK,sw=4)+'</g>'
# battant ouvert (perspective) a gauche
bg+=f'<polygon points="{dx-w2},{dtop+w2*0.9} {dx-w2-120},{dtop+w2*0.9-40} {dx-w2-120},{540+30} {dx-w2},540" fill="{RED}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
bg+=f'<polygon points="{dx-w2-14},{dtop+w2*0.9-8} {dx-w2-100},{dtop+w2*0.9-38} {dx-w2-100},{540+8} {dx-w2-14},{540-26}" fill="none" stroke="{CREAM}" stroke-width="3"/>'
for k in range(4):
    yy=dtop+w2*0.9+40+k*52
    bg+=f'<polygon points="{dx-w2-92},{yy-40} {dx-w2-62},{yy-10-16} {dx-w2-32},{yy-14+8} {dx-w2-62},{yy+10}" fill="{SAFH}" stroke="{INK}" stroke-width="2.5" opacity=".95"/>'
bg+=f'<circle cx="{dx-w2-24}" cy="{dtop+w2*0.9+170}" r="8" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
# tapis de lumiere au sol
bg+=f'<polygon points="{dx-w2+20},540 {dx+w2-20},540 {dx+w2+200},560 {dx-w2-200},560" fill="#FFF4C2" opacity=".0"/>'
bg+=f'<path d="M{dx-w2},540 L{dx-w2-260},540 M{dx+w2},540 L{dx+w2+260},540" stroke="{INK}" stroke-width="0"/>'
# cartes volantes / etincelles
for (x,y,r,c,k) in [(1000,300,-18,TERRA,'s'),(1130,200,14,RED,'h'),(880,420,10,BLUE,'d'),(1760,170,-12,VIOLET,'c')]:
    bg+=f'<g transform="translate({x},{y}) rotate({r}) scale(.55)">{cface(120,170,k,border=c)}</g>'
for i in range(26):
    x=random.randint(860,1900); y=random.randint(30,500)
    if (x-dx)**2/260**2+(y-300)**2/260**2<1: continue
    bg+=f'<polygon points="{x},{y-14} {x+4},{y-4} {x+14},{y} {x+4},{y+4} {x},{y+14} {x-4},{y+4} {x-14},{y} {x-4},{y-4}" fill="{SAFH}" stroke="{INK}" stroke-width="2"/>'
# fleche gravee sur la plateforme : motifs
for i in range(14):
    xx=1250+i*48
    bg+=f'<polygon points="{xx},{640} {xx+24},{610} {xx+48},{640} {xx+24},{670}" fill="none" stroke="{INK}" stroke-width="3" opacity=".5"/>'
# plante en pot sur la plateforme + paillasson
px=1810
bg+=f'<path d="M{px-46},470 L{px+46},470 L{px+34},540 L{px-34},540 Z" fill="{TERRA}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/><rect x="{px-52}" y="456" width="104" height="22" rx="6" fill="#CF5A3A" stroke="{INK}" stroke-width="5"/>'
for a_,l_ in [(-40,120),(-15,150),(10,140),(35,115)]:
    ex=px+l_*math.sin(math.radians(a_)); ey=460-l_*math.cos(math.radians(a_))
    bg+=path(f'M{px},460 Q{px+(ex-px)*0.2},{ey+40} {ex},{ey}',stroke=INK,sw=5)
    bg+=f'<path d="M{ex},{ey} C{ex-28},{ey-10} {ex-26},{ey-60} {ex},{ey-72} C{ex+26},{ey-60} {ex+28},{ey-10} {ex},{ey} Z" fill="{GREEN}" stroke="{INK}" stroke-width="4" transform="rotate({a_} {ex} {ey})"/>'
bg+=f'<rect x="{dx-120}" y="528" width="240" height="14" rx="6" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'+''.join(f'<line x1="{dx-110+i*20}" y1="531" x2="{dx-110+i*20}" y2="539" stroke="{INK}" stroke-width="3"/>' for i in range(12))
# boites sur les marches
fg=''
H=300
order=[('timeline',180,880,-2),('uno',480,795,2),('skyjo',780,710,-2),('love-letter',1080,625,2)]
from assets import size
for id,x,top,r in order:
    h=H if id!='timeline' else 280
    fg+=img(id,x,top-h/2+10,h,r)
build('jeux-debutants-adultes',PINK,bg,fg)
