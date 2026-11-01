import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from v3common import *
random.seed(8)
G1='#A9BDCB'; G2='#8DA3B4'; G3='#7D95A8'; G4='#6C859A'; GROUND='#566E83'
ELE='#4B6075'; ELEd='#394B5D'; ELEl='#6A8197'
bg=f'''<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{G1}"/><stop offset="1" stop-color="{G2}"/></linearGradient></defs>
<rect width="1920" height="1080" fill="url(#sk)"/>'''
def hill(y,fill,seed,amp=90):
    random.seed(seed); d=f'M0,{y}'; x=0
    while x<1920:
        w=random.randint(300,520); h=random.randint(30,amp)
        d+=f' q{w/2},{-h*2} {w},0'; x+=w
    return f'<path d="{d} L{x},1080 L0,1080 Z" fill="{fill}"/>'
bg+=hill(760,G3,2,110)+hill(850,G4,5,80)
bg+=f'<rect y="930" width="1920" height="150" fill="{GROUND}"/>'
# nuages
def cloud(x,y,s=1,fill=CREAM,op=.8):
    d='M-190,0 C-230,0 -236,-70 -170,-76 C-166,-150 -50,-170 -14,-104 C20,-176 160,-160 164,-70 C240,-76 250,0 196,0 Z'
    return f'<g transform="translate({x},{y}) scale({s})" opacity="{op}"><path d="{d}" fill="{fill}"/></g>'
bg+=cloud(260,170,.8)+cloud(1500,120,.9)+cloud(1050,250,.5,CREAM,.6)
# oiseaux
for x,y,s in ((620,150,1),(700,200,.7),(1250,190,.8),(1330,140,1.1),(1710,300,.8)):
    bg+=f'<path d="M{x-26*s},{y} q{13*s},{-16*s} {26*s},0 q{13*s},{-16*s} {26*s},0" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>'
# acacia à droite
def acacia(x,y,s):
    t=f'<g transform="translate({x},{y}) scale({s})"><path d="M-14,0 C-10,-80 -30,-150 -70,-210 L-50,-218 C-20,-170 0,-140 6,-110 C14,-150 40,-190 80,-226 L96,-212 C58,-170 30,-120 22,-60 C20,-30 22,-10 26,0 Z" fill="{INK}"/>'
    t+=f'<path d="M-210,-220 C-190,-290 -80,-300 -20,-270 C40,-310 190,-300 220,-236 C160,-206 40,-214 0,-224 C-70,-204 -170,-196 -210,-220 Z" fill="#3F5D4B"/>'
    t+=f'<path d="M-150,-250 q40,-24 80,-6 M20,-270 q50,-26 100,0" stroke="#5F8A70" stroke-width="6" fill="none" opacity=".8" stroke-linecap="round"/></g>'
    return t
art=acacia(1760,935,1.0)+acacia(110,925,.7)
# herbe
for x in range(0,1920,34):
    h=random.randint(18,38); art+=f'<path d="M{x},960 q{random.randint(-6,6)},{-h} {random.randint(-10,10)},{-h-8}" stroke="#3F5D4B" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>'
# ---------- éléphant ----------
EX,EY,S=800,1010,1.3
def leg(x0,x1,top,fill,anklet=True):
    p=f'<path d="M{x0},{top} L{x1},{top} L{x1-5},-26 Q{x1-5},0 {x1-26},0 L{x0+26},0 Q{x0+3},0 {x0+3},-26 Z" fill="{fill}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    # ongles
    for k in range(3):
        cx=x0+14+k*((x1-x0-28)/2)
        p+=f'<path d="M{cx-9},-2 a9,9 0 0,1 18,0 Z" fill="{CREAM}" stroke="{INK}" stroke-width="2.5"/>'
    if anklet:
        p+=f'<path d="M{x0+2},-62 L{x1-2},-62 L{x1-3},-34 L{x0+3},-34 Z" fill="{SAF}" stroke="{INK}" stroke-width="3.5"/>'
        p+=''.join(f'<circle cx="{x0+14+k*((x1-x0-28)/3)}" cy="-48" r="4.5" fill="{TERRA}"/>' for k in range(4))
    return p
e=f'<g transform="translate({EX},{EY}) scale({S})">'
# ombre au sol
e+=f'<ellipse cx="0" cy="6" rx="560" ry="22" fill="{INK}" opacity=".25"/>'
# queue
e+='<g transform="translate(0,90)">'
e+=f'<path d="M-420,-350 C-480,-330 -495,-250 -478,-170" stroke="{ELEd}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-478,-170 C-500,-150 -490,-110 -470,-100 C-455,-120 -450,-150 -462,-172 Z" fill="{INK}"/>'
e+='</g>'
# jambes lointaines
e+=leg(-290,-196,-170,ELEd,False)+leg(110,204,-170,ELEd,False)
e+='<g transform="translate(0,90)">'
# corps
e+=f'<path d="M-440,-300 C-455,-440 -330,-530 -150,-534 C0,-537 150,-524 250,-474 C320,-440 350,-380 345,-300 C340,-230 310,-196 250,-186 L-380,-186 C-425,-196 -438,-250 -440,-300 Z" fill="{ELE}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
# plis de peau
e+=''.join(f'<path d="{d}" stroke="{ELEd}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>' for d in ("M-380,-250 q30,-20 70,-12","M-300,-215 q36,-14 80,-6","M90,-230 q36,-18 80,-8","M-420,-330 q16,16 10,44"))
e+='</g>'
# jambes proches
e+=leg(-400,-296,-170,ELE)+leg(150,254,-170,ELE)
# couverture (tapis de selle)
e+='<g transform="translate(0,90)">'
cloth='M-330,-532 C-200,-545 60,-545 200,-520 L214,-330 '
cloth+=''.join(f'q-24,36 -48,0 ' for _ in range(1))
x=214; d=''
pts=[]
n=13; wdt=(288+410)/n
path=f'M-410,-520 C-250,-540 80,-540 280,-512 L288,-330'
for i in range(n):
    xs=288-i*wdt
    path+=f' Q{xs-wdt/2},{-262} {xs-wdt},-330'
path+=' Z'
e+=f'<path d="{path}" fill="{TERRA}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
e+=f'<path d="M-406,-466 C-250,-486 80,-486 284,-456" stroke="{SAF}" stroke-width="12" fill="none"/>'
e+=''.join(f'<polygon points="{-390+k*34},-436 {-373+k*34},-410 {-356+k*34},-436" fill="{CREAM}" stroke="{INK}" stroke-width="2.5"/>' for k in range(18))
e+=''.join(f'<path d="M{-380+k*49},-322 l0,26" stroke="{SAF}" stroke-width="3.5"/><circle cx="{-380+k*49}" cy="-290" r="5.5" fill="{SAF}" stroke="{INK}" stroke-width="2"/>' for k in range(14))
# plateforme du palanquin
e+=f'<path d="M-440,-546 L318,-530 L320,-508 L-442,-524 Z" fill="#8A5A2B" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
e+=''.join(f'<path d="M{-426+k*28},-532 l10,-8 l10,8" stroke="{CREAM}" stroke-width="3.5" fill="none"/>' for k in range(27))
e+='</g>'
# tête
e+='<g transform="translate(0,90)">'
e+=f'<path d="M230,-520 C300,-575 420,-570 460,-500 C492,-445 488,-370 452,-318 C420,-272 350,-246 296,-258 L240,-300 Z" fill="{ELE}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
# trompe
e+=f'<path d="M440,-430 C528,-430 598,-360 598,-250 C598,-182 608,-144 646,-142 C672,-141 684,-164 676,-188 L704,-198 C720,-162 708,-112 654,-96 C592,-80 542,-136 542,-246 C542,-316 506,-336 446,-326 Z" fill="{ELE}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
e+=''.join(f'<path d="M{x},{y} q18,-6 36,2" stroke="{ELEd}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>' for x,y in ((548,-280),(552,-240),(556,-200),(552,-330),(528,-372)))
# défense
e+=f'<path d="M410,-330 C466,-322 532,-296 568,-236 C524,-262 468,-274 414,-276 Z" fill="{CREAM}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
# oreille
e+=f'<path d="M286,-500 C190,-575 62,-505 76,-390 C90,-285 196,-228 292,-290 C326,-360 326,-444 286,-500 Z" fill="{ELEl}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
e+=f'<path d="M270,-458 C204,-504 128,-460 136,-386 C144,-318 210,-282 270,-322 C292,-370 292,-420 270,-458 Z" fill="none" stroke="{CREAM}" stroke-width="4" stroke-dasharray="3 9" stroke-linecap="round"/>'
e+=''.join(f'<polygon points="{x},{y-16} {x+14},{y} {x},{y+16} {x-14},{y}" fill="{SAF}" stroke="{INK}" stroke-width="2.5"/>' for x,y in ((186,-420),(226,-380),(190,-350),(236,-446)))
# bandeau de front
e+=f'<path d="M300,-545 C350,-566 420,-556 452,-506 L430,-478 C400,-520 340,-526 290,-500 Z" fill="{RED}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
e+=''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="{CREAM}"/>' for x,y in ((330,-534),(368,-540),(406,-528),(436,-508)))
# œil
e+=f'<circle cx="392" cy="-440" r="11" fill="{INK}"/><circle cx="395" cy="-444" r="3.6" fill="{CREAM}"/>'
e+=f'<path d="M366,-462 q26,-18 52,0" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>'
e+='</g></g>'
art+=e
# poteaux + guirlande de fanions
PX0,PX1=EX-440*S,EX+262*S
PYp=EY+(-546+90)*S
art+=f'<path d="M{PX0},{PYp} L{PX0},70 M{PX1},{PYp+20} L{PX1},70" stroke="#8A5A2B" stroke-width="13" stroke-linecap="round"/>'
art+=f'<path d="M{PX0},78 Q{(PX0+PX1)/2},150 {PX1},78" stroke="{INK}" stroke-width="3.5" fill="none"/>'
cols=[RED,SAFH,CREAM,GREEN,ORANGE,BLUE]
for k in range(15):
    t=(k+.5)/15; x=PX0+(PX1-PX0)*t; y=78+(1-(2*t-1)**2)*36
    art+=f'<polygon points="{x-17},{y} {x+17},{y} {x},{y+42}" fill="{cols[k%6]}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
art+=f'<circle cx="{PX0}" cy="62" r="13" fill="{SAF}" stroke="{INK}" stroke-width="4"/><circle cx="{PX1}" cy="62" r="13" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'
# ---------- boîtes ----------
imgs=''
PYb=EY+(-532+90)*S
top_row=[('hanabi',360,270,-2),('skyjo',573,270,2),('the-mind',763,270,-2),('kyran',972,270,2)]
for id,cx,H,rot in top_row:
    imgs+=imgc(id,cx,PYb-H/2+4,H,rot=rot)
pann=[('no-thanks',480,640,270,-4),('dobble',735,650,270,3)]
top=''
for id,cx,cy,H,rot in pann:
    imgs+=imgc(id,cx,cy,H,rot=rot)
    (w0,h0),(x0,y0,x1,y1)=bbox(id); wc=(x1-x0)*H/(y1-y0)
    ty=cy-H/2+8
    for sx in (-1,1):
        px=cx+sx*wc*0.34
        top+=f'<path d="M{px},{PYb+14} L{px},{ty}" stroke="{INK}" stroke-width="7" stroke-linecap="round"/><path d="M{px},{PYb+14} L{px},{ty}" stroke="{SAFH}" stroke-width="3.5" stroke-dasharray="6 5" stroke-linecap="round"/>'
        top+=f'<circle cx="{px}" cy="{PYb+14}" r="9" fill="{SAF}" stroke="{INK}" stroke-width="3.5"/><circle cx="{px}" cy="{ty}" r="8" fill="{SAF}" stroke="{INK}" stroke-width="3.5"/>'
run('jeux-memoire-concentration',(bg,art,imgs,top))
