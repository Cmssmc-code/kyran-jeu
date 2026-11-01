import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from h4common import *
from assets import size
random.seed(2)
SEA='#2F8FD0'; SEAD='#2579B6'; SEAL='#6FB6E6'
bg=''
# vagues gravees
for k in range(11):
    y=20+k*100
    bg+=path(f'M-30,{y} '+' '.join('q45,-34 90,0 t90,0' for _ in range(12)),stroke=SEAL,sw=5,extra=f'opacity=".6" transform="translate({(k%2)*45},0)"')
bg+=''.join(f'<circle cx="{random.randint(10,1900)}" cy="{random.randint(10,1070)}" r="4" fill="{CREAM}" opacity=".5"/>' for _ in range(40))
CX,CY,CW,CH=985,540,1560,810
ROT=-3
case=f'<g transform="translate({CX},{CY}) rotate({ROT}) scale(.9)">'
# ombre
case+=f'<rect x="{-CW/2+16}" y="{-CH/2+22}" width="{CW}" height="{CH}" rx="70" fill="{INK}" opacity=".28"/>'
# coque
case+=rect(-CW/2,-CH/2,CW,CH,TERRA,sw=7,rx=70)
case+=rect(-CW/2+26,-CH/2+26,CW-52,CH-52,'none',stroke=SAFH,sw=4,rx=52,extra='stroke-dasharray="4 12"')
# interieur : deux moities
IW=(CW-110)/2; IH=CH-110
lx=-CW/2+55; rx_=lx+IW+0
case+=rect(lx,-CH/2+55,IW-6,IH,'#7A3226',sw=5,rx=26)       # couvercle (doublure)
case+=rect(lx+IW+6,-CH/2+55,IW-6,IH,'#F2DDB8',sw=5,rx=26) # base
# doublure du couvercle : motif
case+=f'<clipPath id="lidc"><rect x="{lx}" y="{-CH/2+55}" width="{IW-6}" height="{IH}" rx="26"/></clipPath><g clip-path="url(#lidc)">'
for i in range(9):
    for j in range(12):
        x=lx+30+i*80+(j%2)*40; y=-CH/2+80+j*62
        case+=f'<polygon points="{x},{y-14} {x+14},{y} {x},{y+14} {x-14},{y}" fill="none" stroke="{SAFH}" stroke-width="3" opacity=".55"/>'
case+='</g>'
# charniere
case+=rect(-14,-CH/2+40,28,IH+30,'#C9C2B6',sw=4,rx=8)
case+=''.join(f'<circle cx="0" cy="{-CH/2+80+i*120}" r="5" fill="{INK}"/>' for i in range(7))
# vetements plies dans la base (en bas)
bx=lx+IW+6+14; bw=IW-6-28
def folded(x,y,w,h,col,kind,rot=0):
    s=f'<g transform="translate({x},{y}) rotate({rot})">'
    s+=f'<rect x="6" y="8" width="{w}" height="{h}" rx="12" fill="{INK}" opacity=".22"/>'
    s+=rect(0,0,w,h,col,sw=4.5,rx=12)
    s+=f'<line x1="14" y1="{h*0.52}" x2="{w-14}" y2="{h*0.52}" stroke="{INK}" stroke-width="2.5" opacity=".4"/>'
    if kind=='stripe':
        for i in range(0,int(w),30):
            s+=f'<line x1="{i+10}" y1="8" x2="{i+10}" y2="{h-8}" stroke="{CREAM}" stroke-width="5" opacity=".75"/>'
    elif kind=='zig':
        for r in (0.28,0.76):
            pts=' '.join(f'{12+i*(w-24)/10:.0f},{h*r+(0 if i%2 else 14)}' for i in range(11))
            s+=f'<polyline points="{pts}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    elif kind=='dots':
        for i in range(int(w/36)):
            for j in range(int(h/36)):
                s+=f'<circle cx="{26+i*36}" cy="{22+j*36}" r="5" fill="{CREAM}"/>'
    elif kind=='dia':
        for i in range(int(w/50)):
            s+=f'<polygon points="{36+i*50},{h/2-18} {54+i*50},{h/2} {36+i*50},{h/2+18} {18+i*50},{h/2}" fill="{CREAM}"/>'
    return s+'</g>'
base_y=-CH/2+55+IH-250+30
case+=folded(bx,base_y+110,bw,70,BLUE,'zig',0)
case+=folded(bx+6,base_y+34,bw-12,80,GREEN,'stripe',-1)
case+=folded(bx+24,base_y-40,bw-48,80,ORANGE,'dia',1)
# serviette roulee a droite de la base
rx0=bx+bw-130
case+=f'<g transform="translate({bx+20},{base_y+190})"><rect x="6" y="8" width="{bw-40}" height="64" rx="32" fill="{INK}" opacity=".22"/><rect width="{bw-40}" height="64" rx="32" fill="{VIOLET}" stroke="{INK}" stroke-width="4.5"/><ellipse cx="32" cy="32" rx="30" ry="28" fill="none" stroke="{CREAM}" stroke-width="4"/><ellipse cx="32" cy="32" rx="16" ry="14" fill="none" stroke="{CREAM}" stroke-width="3.5"/><path d="M90,12 q30,-6 60,0 M200,50 q30,6 60,0 M320,12 q30,-6 60,0 M440,50 q30,6 60,0" stroke="{CREAM}" stroke-width="4" fill="none"/></g>'
# boites : couvercle (4 en 2x2) + base (3)
lidbox=''
def boxw(id,h): return h*size(id)[0]/size(id)[1]
lcx=lx+(IW-6)/2
r1=[('love-letter',-3),('the-mind',2)]; r2=[('skyjo',-2),('kyran',3)]
for row,yc in ((r1,-185),(r2,175)):
    hh=300 if yc<0 else 290
    ws=[boxw(i,hh) for i,_ in row]; g=60
    x0=lcx-(sum(ws)+g)/2
    for (i,r),w in zip(row,ws):
        lidbox+=img(i,x0+w/2,yc,hh,r); x0+=w+g
strap=''
for yc,hh in ((-185,300),(175,290)):
    ys=yc+hh/2-62
    strap+=f'<rect x="{lx}" y="{ys}" width="{IW-6}" height="26" fill="{INK}"/><rect x="{lx}" y="{ys+4}" width="{IW-6}" height="6" fill="{BLUE}"/>'
    strap+=''.join(f'<line x1="{lx+10+i*18}" y1="{ys}" x2="{lx+10+i*18}" y2="{ys+26}" stroke="{CREAM}" stroke-width="1.5" opacity=".35"/>' for i in range((int(IW)-6)//18))
    strap+=f'<rect x="{lx-6}" y="{ys-4}" width="14" height="34" rx="4" fill="{SAFH}" stroke="{INK}" stroke-width="3.5"/><rect x="{lx+IW-6-8}" y="{ys-4}" width="14" height="34" rx="4" fill="{SAFH}" stroke="{INK}" stroke-width="3.5"/>'
bb=''
bcx=lx+IW+6+(IW-6)/2
wd=boxw('dobble',270); wc=boxw('coup',270); g=50
x0=bcx-(wd+wc+g)/2
bb+=img('dobble',x0+wd/2,-195,270,-2)+img('coup',x0+wd+g+wc/2,-195,270,2)
bb+=img('no-thanks',bcx+170,70,230,-6)
# fermoirs
lat=''
for yy in (-CH/2+180,CH/2-180):
    lat+=f'<rect x="{-CW/2-8}" y="{yy}" width="34" height="70" rx="8" fill="{SAFH}" stroke="{INK}" stroke-width="4.5"/><circle cx="{-CW/2+9}" cy="{yy+35}" r="8" fill="{INK}"/>'
    lat+=f'<rect x="{CW/2-26}" y="{yy}" width="34" height="70" rx="8" fill="{SAFH}" stroke="{INK}" stroke-width="4.5"/><circle cx="{CW/2-9}" cy="{yy+35}" r="8" fill="{INK}"/>'
# poignee (haut)
lat+=f'<rect x="-120" y="{-CH/2-26}" width="240" height="30" rx="14" fill="{INK}"/><rect x="-100" y="{-CH/2-18}" width="200" height="12" rx="6" fill="{SAFH}"/>'
# coins renforces
for sx in (-1,1):
    for sy in (-1,1):
        lat+=f'<path d="M{sx*CW/2},{sy*(CH/2-66)} L{sx*CW/2},{sy*CH/2} L{sx*(CW/2-66)},{sy*CH/2} Q{sx*(CW/2-12)},{sy*(CH/2-12)} {sx*CW/2},{sy*(CH/2-66)} Z" fill="{SAFH}" stroke="{INK}" stroke-width="4" opacity="0"/>'
# lunettes de soleil sur les vetements
def glasses(x,y,rot,s):
    g=f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
    g+=f'<ellipse cx="6" cy="10" rx="100" ry="46" fill="{INK}" opacity="0"/>'
    for sx in (-1,1):
        g+=path(f'M{sx*100},-12 L{sx*190},-6',stroke=INK,sw=12)
        g+=path(f'M{sx*190},-6 q26,0 28,28',stroke=INK,sw=12)
    g+=path('M-30,-6 q30,-26 60,0',stroke=INK,sw=11)
    for sx in (-1,1):
        cx_=sx*72
        g+=f'<path d="M{cx_-60},-26 C{cx_-62},40 {cx_-20},62 {cx_+10},60 C{cx_+54},56 {cx_+62},10 {cx_+60},-26 Z" fill="#1B3550" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>'
        g+=path(f'M{cx_-40},-4 q4,30 20,40',stroke=SEAL,sw=6,extra='opacity=".8"')
    return g+'</g>'
case+=lidbox+strap+bb+lat+'</g>'
# decor autour : carte routiere et lunettes
def roadmap(x,y,rot,s):
    g=f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
    g+=f'<rect x="12" y="16" width="440" height="300" rx="10" fill="{INK}" opacity=".28"/>'
    for i in range(4):
        pass
    g+=rect(0,0,440,300,'#F4E9C8',sw=5,rx=10)
    g+=f'<clipPath id="mpc"><rect x="0" y="0" width="440" height="300" rx="10"/></clipPath><g clip-path="url(#mpc)">'
    g+=path('M-10,230 C80,210 120,260 200,240 C260,225 300,260 460,230 L460,310 L-10,310 Z',fill=SEAL,stroke=INK,sw=3.5)
    g+=path('M250,-10 C230,50 290,80 270,150 C260,190 300,200 330,240 L460,240 L460,-10 Z',fill='#9CCB78',stroke=INK,sw=3.5)
    g+=path('M20,60 C90,40 120,110 190,90 C250,70 270,130 330,110',stroke=ORANGE,sw=9)
    g+=path('M20,60 C90,40 120,110 190,90 C250,70 270,130 330,110',stroke=CREAM,sw=3,extra='stroke-dasharray="14 10"')
    g+=path('M40,170 C120,150 160,190 230,160',stroke=INK,sw=3,extra='stroke-dasharray="8 8"')
    g+=''.join(f'<line x1="{x_}" y1="0" x2="{x_}" y2="300" stroke="{INK}" stroke-width="2.5" opacity=".35"/>' for x_ in (146,293))
    g+='</g>'
    # epingle
    g+=f'<g transform="translate(330,100)"><path d="M0,0 C-26,-34 -26,-60 0,-66 C26,-60 26,-34 0,0 Z" fill="{RED}" stroke="{INK}" stroke-width="4.5"/><circle cy="-44" r="9" fill="{CREAM}" stroke="{INK}" stroke-width="3"/></g>'
    g+=f'<circle cx="20" cy="60" r="11" fill="{BLUE}" stroke="{INK}" stroke-width="4"/>'
    return g+'</g>'
deco=roadmap(40,800,-10,0.9)
deco+=glasses(1740,160,10,.68)
# coquillage et etoile de mer
deco+=f'<g transform="translate(1800,960) rotate(-20)">'+''.join(f'<path d="M0,0 L{math.cos(a)*70:.0f},{math.sin(a)*70:.0f} L{math.cos(a+0.6)*20:.0f},{math.sin(a+0.6)*20:.0f} Z" fill="{ORANGE}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>' for a in [i*2*math.pi/5 for i in range(5)])+f'<circle r="8" fill="{CREAM}"/></g>'
build('jeux-vacances-voyage',SEA,bg,case+deco)
