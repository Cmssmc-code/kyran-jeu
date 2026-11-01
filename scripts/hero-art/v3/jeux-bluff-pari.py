import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from v3common import *
random.seed(5)
DRED='#8E1B28'; SKIN='#7A4228'; SKIN2='#5E3220'
# ---------- fond : noir encre + rayons rouges ----------
bg=f'<rect width="1920" height="1080" fill="{INK}"/>'
cx0,cy0=620,560
for i in range(24):
    a0=math.radians(i*15); a1=math.radians(i*15+7.5)
    R=2400
    bg+=f'<polygon points="{cx0},{cy0} {cx0+R*math.cos(a0):.0f},{cy0+R*math.sin(a0):.0f} {cx0+R*math.cos(a1):.0f},{cy0+R*math.sin(a1):.0f}" fill="{DRED}" opacity=".55"/>'
# bandeau rouge diagonal
bg+=f'<polygon points="0,760 1920,420 1920,640 0,980" fill="{RED}" opacity=".9"/>'
def zigline(x0,y0,x1,y1,n,amp,stroke=CREAM,sw=4):
    pts=[];dx=(x1-x0)/n;dy=(y1-y0)/n
    L=math.hypot(dx,dy);nx=-dy/L;ny=dx/L
    for i in range(n+1):
        s=amp if i%2 else -amp
        pts.append(f'{x0+dx*i+nx*s:.1f},{y0+dy*i+ny*s:.1f}')
    return f'<polyline points="{" ".join(pts)}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>'
bg+=zigline(0,790,1920,448,64,12,CREAM,4)+zigline(0,950,1920,608,64,12,CREAM,4)
art=''
# cartes dos en éventail derrière les boîtes
art+=f'<g transform="translate(1340,1500)">'
for i in range(11):
    a=(i-5)*8.2
    col=RED if i%2==0 else INK
    art+=f'<g transform="rotate({a}) translate(0,-960)">{card_back(250,370,col)}</g>'
art+='</g>'
# ---------- personnage ----------
art+='<g transform="translate(-80,0)">'
# bras gauche (dessous)
art+=f'<path d="M360,1000 C290,960 270,860 290,770 C300,690 330,640 345,540 L395,555 C385,640 370,700 362,780 C370,850 420,890 480,920 Z" fill="{SKIN2}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
# épaules + vêtement
art+=f'<path d="M180,1100 C190,930 330,860 470,845 L690,845 C830,860 960,930 970,1100 Z" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
art+=zigline(250,1010,900,1010,26,14,CREAM,5)+zigline(240,1055,910,1055,28,12,SAF,4)
art+=f'<path d="M470,845 L690,845 L650,930 L510,930 Z" fill="{CREAM}" opacity=".9"/>'
# cou
art+=f'<path d="M470,780 L690,780 L700,870 C650,920 510,920 460,870 Z" fill="{SKIN2}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
# tête
art+=f'<ellipse cx="580" cy="620" rx="195" ry="240" fill="{SKIN}" stroke="{INK}" stroke-width="6"/>'
art+=f'<path d="M388,610 C370,590 350,610 358,650 C366,690 392,690 396,670" fill="{SKIN}" stroke="{INK}" stroke-width="5"/>'
art+=f'<path d="M772,610 C790,590 810,610 802,650 C794,690 768,690 764,670" fill="{SKIN}" stroke="{INK}" stroke-width="5"/>'
# boucle d'oreille safran
art+=f'<circle cx="798" cy="702" r="14" fill="none" stroke="{SAF}" stroke-width="7"/>'
# yeux malicieux, regard vers la droite (les boîtes)
for ex in (505,655):
    art+=f'<path d="M{ex-52},598 C{ex-24},566 {ex+24},566 {ex+52},598 C{ex+24},620 {ex-24},620 {ex-52},598 Z" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
    art+=f'<circle cx="{ex+22}" cy="596" r="15" fill="{INK}"/><circle cx="{ex+27}" cy="591" r="4.5" fill="{CREAM}"/>'
    art+=f'<path d="M{ex-60},590 C{ex-28},552 {ex+28},552 {ex+60},590 C{ex+28},576 {ex-28},576 {ex-60},590 Z" fill="{SKIN2}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
art+=f'<path d="M445,545 C480,520 530,520 560,538 M620,538 C650,520 700,520 735,545" stroke="{INK}" stroke-width="12" fill="none" stroke-linecap="round"/>'
# nez, bouche en coin
art+=f'<path d="M580,610 C560,670 545,700 575,716 C592,722 612,716 620,700" fill="none" stroke="{SKIN2}" stroke-width="9" stroke-linecap="round"/>'
art+=f'<path d="M500,780 C540,812 620,812 668,770 C680,762 690,772 684,782" fill="{RED}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
art+=f'<path d="M500,780 C540,790 620,790 668,770" fill="none" stroke="{INK}" stroke-width="5"/>'
# scarifications sur les joues
for sx in (-1,1):
    for k in range(3):
        art+=f'<path d="M{580+sx*(120+k*14)},{665+k*0} l{sx*26},{14+k*4}" stroke="{SKIN2}" stroke-width="6" stroke-linecap="round" fill="none" transform="translate(0,{k*18})"/>'
# ---------- masque levé ----------
def mask():
    s=''
    # crête de pointes
    for i,(x,h) in enumerate(((-110,70),(-70,110),(-30,150),(10,170),(50,140),(90,100),(125,64))):
        s+=f'<path d="M{x-20},-170 L{x},{-170-h} L{x+20},-170 Z" fill="{RED}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    s+=f'<path d="M0,-205 C140,-205 168,-90 148,26 C132,118 66,202 0,232 C-66,202 -132,118 -148,26 C-168,-90 -140,-205 0,-205 Z" fill="{SAF}" stroke="{INK}" stroke-width="7"/>'
    # bandeaux crème gravés
    s+=f'<path d="M-158,-110 C-60,-150 60,-150 158,-110 L152,-70 C60,-108 -60,-108 -152,-70 Z" fill="{INK}"/>'
    s+=zigline(-146,-92,146,-92,16,10,CREAM,4)
    # yeux : fentes
    for sx in (-1,1):
        s+=f'<path d="M{sx*30},-20 C{sx*60},-52 {sx*108},-46 {sx*118},-22 C{sx*86},-6 {sx*52},-2 {sx*30},-20 Z" fill="{INK}"/>'
        s+=f'<path d="M{sx*40},-18 C{sx*66},-34 {sx*96},-32 {sx*104},-22" stroke="{CREAM}" stroke-width="3" fill="none"/>'
        for k in range(3):
            s+=f'<circle cx="{sx*(88-k*18)}" cy="{70+k*14}" r="8" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
    # arête du nez avec triangles
    s+=f'<path d="M-14,-40 L14,-40 L22,110 L0,128 L-22,110 Z" fill="{TERRA}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    s+=f'<path d="M-9,-10 L9,-10 L0,16 Z M-12,40 L12,40 L0,70 Z" fill="{CREAM}"/>'
    # bouche
    s+=f'<rect x="-48" y="144" width="96" height="30" rx="10" fill="{INK}"/>'
    for k in range(-3,4):
        s+=f'<path d="M{k*12},148 L{k*12},170" stroke="{CREAM}" stroke-width="4"/>'
    # menton : traits de barbe
    for k in range(-3,4):
        s+=f'<path d="M{k*14},188 L{k*10},226" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    return s
art+=f'<g transform="translate(520,300) rotate(-21)">{mask()}</g>'
# main qui tient le masque
def hand():
    s=f'<g fill="{SKIN2}" stroke="{INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">'
    s+=f'<path d="M-30,60 C-50,20 -48,-30 -24,-62 C-6,-80 30,-70 40,-40 L52,40 C54,90 30,130 -4,134 C-26,130 -30,90 -30,60 Z"/>'
    for i,(x,y,l,a) in enumerate(((-34,-48,70,-14),(-6,-70,82,-4),(22,-62,76,6),(46,-30,60,16))):
        s+=f'<g transform="translate({x},{y}) rotate({a})"><rect x="-13" y="-{l}" width="26" height="{l+10}" rx="13"/></g>'
    s+='</g>'
    return s
art+=f'<g transform="translate(366,560) rotate(-8) scale(1.1)">{hand()}</g>'
art+=f'<path d="M296,840 C250,800 250,720 290,690" stroke="{INK}" stroke-width="0" fill="none"/>'
art+='</g>'
# ---------- boîtes en éventail ----------
ids=['for-sale','wizard','saboteur','skull','bang','coup','kyran']
Hc=270
imgs=''
ws=[]
for i in ids:
    (w0,h0),(x0,y0,x1,y1)=bbox(i); ws.append((x1-x0)*Hc/(y1-y0))
x=742; n=len(ids)
for k,i in enumerate(ids):
    w=ws[k]; cx=x+w/2
    t=(k-(n-1)/2)/((n-1)/2)
    cy=640+60*t*t-0
    imgs+=imgc(i,round(cx),round(cy),Hc,rot=round(8*t,1))
    x+=w*0.77
open('/tmp/claude-0/vec/_parts_bluff.txt','w').write('')
top=''
for k in range(14):
    x=980+k*62
    top+=f'<polygon points="{x},46 {x+22},70 {x},94 {x-22},70" fill="none" stroke="{CREAM}" stroke-width="4"/><circle cx="{x}" cy="70" r="5" fill="{SAF}"/>'
top+=star4(1000,180,26,CREAM)+star4(1750,160,18,CREAM)+star4(900,420,14,SAFH)
top+=''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SAF}" stroke="{INK}" stroke-width="3"/>' for x,y,r in ((120,170,30),(170,230,24),(80,250,20)))
run('jeux-bluff-pari',(bg,art,imgs,top))
