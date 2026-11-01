import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from h4common import *
random.seed(11)
SAFD='#CF8E14'; SAFL='#F4C84E'
bg=''
# rayons de soleil (cales) derriere la medaille
cx,cy=1290,260
for i in range(28):
    a0=i*2*math.pi/28; a1=a0+math.pi/28
    R=1700
    bg+=f'<polygon points="{cx},{cy} {cx+R*math.cos(a0):.0f},{cy+R*math.sin(a0):.0f} {cx+R*math.cos(a1):.0f},{cy+R*math.sin(a1):.0f}" fill="{SAFL if i%2 else SAFD}" opacity=".55"/>'
# guirlande de fanions en haut a gauche
def bunting(x0,y0,x1,y1,sag,n):
    s=''
    pts=[]
    for i in range(n+1):
        t=i/n; x=x0+(x1-x0)*t; y=y0+(y1-y0)*t+sag*4*t*(1-t); pts.append((x,y))
    s+=path('M'+' L'.join(f'{x:.0f},{y:.0f}' for x,y in pts),stroke=INK,sw=4)
    cols=[RED,CREAM,GREEN,BLUE,TERRA,VIOLET,ORANGE]
    for i in range(n):
        (xa,ya),(xb,yb)=pts[i],pts[i+1]; mx,my=(xa+xb)/2,(ya+yb)/2
        s+=f'<polygon points="{xa+6:.0f},{ya:.0f} {xb-6:.0f},{yb:.0f} {mx:.0f},{my+62:.0f}" fill="{cols[i%7]}" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
        s+=f'<polygon points="{mx-10:.0f},{my+8:.0f} {mx+10:.0f},{my+8:.0f} {mx:.0f},{my+32:.0f}" fill="none" stroke="{INK if cols[i%7]==CREAM else CREAM}" stroke-width="3"/>'
    return s
bg+=bunting(-20,90,880,40,60,11)
bg+=bunting(0,230,640,170,50,8)
# niche en arche
ax,ay,aw=cx,20,250
arch=f'M{ax-aw},505 L{ax-aw},{ay+aw} A{aw},{aw} 0 0 1 {ax+aw},{ay+aw} L{ax+aw},505 Z'
bg+=path(arch.replace('M','M',1),fill=INK,stroke=INK,sw=4,extra='transform="translate(12,14)" opacity=".22"')
bg+=path(arch,fill=INK,stroke=INK,sw=5)
inner=f'M{ax-aw+26},505 L{ax-aw+26},{ay+aw} A{aw-26},{aw-26} 0 0 1 {ax+aw-26},{ay+aw} L{ax+aw-26},505 Z'
bg+=path(inner,fill='none',stroke=CREAM,sw=3,extra='stroke-dasharray="3 10"')
# zigzag gravure sur la niche
for k in range(12):
    y=ay+aw+40+k*30
    for sx in (-1,1):
        x=ax+sx*(aw-13)
        bg+=f'<polygon points="{x},{y} {x+sx*8},{y+10} {x},{y+20} {x-sx*8},{y+10}" fill="{SAF}"/>'
# podium : marches de bois
floor=1060
steps=[(60,850,'#9C5B35'),(360,740,'#8A4B2B'),(660,630,'#7A4126'),(960,520,'#6A361F')]
BR='#8A4B2B'
def step(x,top,w,col,idx):
    s=rect(x,top,w,floor-top,col,sw=5)
    s+=f'<rect x="{x}" y="{top}" width="{w}" height="26" fill="#C98A52" stroke="{INK}" stroke-width="5"/>'
    # planches
    for j in range(1,int((floor-top)/62)+1):
        yy=top+26+j*62-30
        if yy<floor: s+=f'<line x1="{x+4}" y1="{yy}" x2="{x+w-4}" y2="{yy}" stroke="{INK}" stroke-width="3" opacity=".55"/>'
    # veines
    for j in range(3):
        yy=top+60+j*62
        if yy<floor-20: s+=path(f'M{x+30+j*40},{yy} q40,-12 90,0 t90,0',stroke=INK,sw=2.5,extra='opacity=".4"')
    # gravure zig-zag creme
    ty=top+52
    pts=' '.join(f'{x+24+i*(w-48)/10:.0f},{ty+(0 if i%2 else 16)}' for i in range(11))
    s+=f'<polyline points="{pts}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    s+=''.join(f'<circle cx="{x+24+i*(w-48)/10:.0f}" cy="{ty+36}" r="4" fill="{CREAM}"/>' for i in range(11))
    return s
for i,(x,top,col) in enumerate(steps):
    w=300 if i<3 else 960
    bg+=step(x,top,w,col,i)
for r_ in range(3):
    yy=580+r_*110
    for i in range(16):
        xx=1010+i*56
        s_=f'<polygon points="{xx},{yy+40} {xx+28},{yy} {xx+56},{yy+40}" fill="none" stroke="{CREAM}" stroke-width="3.5"/>' if r_%2==0 else f'<polygon points="{xx+28},{yy} {xx+50},{yy+22} {xx+28},{yy+44} {xx+6},{yy+22}" fill="none" stroke="{CREAM}" stroke-width="3.5"/><circle cx="{xx+28}" cy="{yy+22}" r="4" fill="{CREAM}"/>'
        bg+=s_
for i in range(17):
    xx=1010+i*53
    bg+=f'<polygon points="{xx},{960} {xx+26},{930} {xx+52},{960} {xx+26},{990}" fill="{SAF}" opacity=".85"/><circle cx="{xx+26}" cy="960" r="5" fill="{INK}"/>'
# tapis rouge sur la marche du haut
bg+=rect(1000,498,860,26,RED,sw=4)
bg+=''.join(f'<polygon points="{1020+i*40},511 {1040+i*40},501 {1060+i*40},511 {1040+i*40},521" fill="{SAFH}"/>' for i in range(21))
# lauriers
def laurel(x,y,s,flip):
    g=f'<g transform="translate({x},{y}) scale({flip*s},{s})">'
    g+=path('M0,0 C-60,-100 -50,-230 40,-330',stroke=INK,sw=6)
    for i in range(9):
        t=i/8; px=-52*math.sin(t*2.2)*1.05-8*t; py=-34-t*290
        px=[-8,-33,-48,-52,-46,-30,-5,22,44][i]; py=[-30,-70,-115,-160,-205,-245,-280,-310,-330][i]
        g+=f'<path d="M{px},{py} C{px-48},{py-26} {px-62},{py+10} {px-30},{py+30} C{px-12},{py+24} {px-2},{py+10} {px},{py} Z" fill="{GREEN}" stroke="{INK}" stroke-width="3.5"/>'
        g+=f'<path d="M{px+2},{py+4} C{px+40},{py-34} {px+62},{py-6} {px+34},{py+22} C{px+16},{py+16} {px+6},{py+10} {px+2},{py+4} Z" fill="#2C8A3E" stroke="{INK}" stroke-width="3.5"/>'
    return g+'</g>'
bg+=laurel(cx-300,515,1,1)+laurel(cx+300,515,1,-1)
# ombre portee sous la medaille
bg+=f'<ellipse cx="{cx}" cy="520" rx="220" ry="18" fill="{INK}" opacity=".3"/>'
# cartes en eventail posees sur les marches basses
def flat_card(x,y,rot,col,k):
    return f'<g transform="translate({x},{y}) rotate({rot})">{cface(120,170,k,border=col)}</g>'
bg+=flat_card(180,720,-12,TERRA,'s')+flat_card(250,705,2,RED,'h')+flat_card(320,716,14,INK,'d')
bg+=f'<g transform="translate(540,640) rotate(-6)">{card_back(120,170,BLUE)}</g><g transform="translate(610,630) rotate(8)">{card_back(120,170,GREEN)}</g>'
bg+=f'<g transform="translate(850,528) rotate(-10)">{cface(120,170,"c",border=VIOLET)}</g>'
# confettis
cols=[RED,CREAM,GREEN,BLUE,VIOLET,TERRA,ORANGE,INK]
for i in range(120):
    x=random.uniform(0,1920); y=random.uniform(0,820)
    if (x-cx)**2/260**2+(y-260)**2/280**2<1: continue
    if y>[850,740,630,520][min(3,int(x//300)) if x<960 else 3]-20: continue
    if 90<x<920 and 420<y<830: continue
    c=cols[i%8]; r=random.uniform(0,360); k=i%4
    if k==0: bg+=f'<rect x="{x:.0f}" y="{y:.0f}" width="22" height="11" fill="{c}" stroke="{INK}" stroke-width="2" transform="rotate({r:.0f} {x:.0f} {y:.0f})"/>'
    elif k==1: bg+=f'<circle cx="{x:.0f}" cy="{y:.0f}" r="8" fill="{c}" stroke="{INK}" stroke-width="2"/>'
    elif k==2: bg+=f'<polygon points="{x:.0f},{y-11:.0f} {x+10:.0f},{y+8:.0f} {x-10:.0f},{y+8:.0f}" fill="{c}" stroke="{INK}" stroke-width="2" transform="rotate({r:.0f} {x:.0f} {y:.0f})"/>'
    else: bg+=path(f'M{x:.0f},{y:.0f} q8,-14 16,0 t16,0',stroke=c,sw=4,extra=f'transform="rotate({r:.0f} {x:.0f} {y:.0f})"')
fg=img('as-dor',cx,262,500)
build('as-dor-palmares-1988-2026',SAF,bg,fg)
