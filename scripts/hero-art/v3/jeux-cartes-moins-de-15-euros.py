import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from h4common import *
random.seed(5)
MINT='#9ADBB6'; MINTD='#7FC9A0'; MINTL='#C4EED6'
bg=''
# vagues douces / collines gravees
for k in range(6):
    y=60+k*190
    bg+=path('M-20,%d '%y+' '.join(f'q60,-26 120,0 t120,0' for _ in range(17)),stroke=MINTD,sw=5,extra='opacity=".7"')
bg+=''.join(f'<circle cx="{random.randint(20,1900)}" cy="{random.randint(20,1060)}" r="5" fill="{MINTL}"/>' for _ in range(60))
# sol
bg+=rect(-10,960,1940,130,'#6BB88C',sw=5)
for i in range(40):
    xx=i*52
    bg+=f'<polygon points="{xx},1020 {xx+26},990 {xx+52},1020 {xx+26},1050" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".8"/>'
# portants
def rail(y,x0,x1):
    s=''
    for x in (x0+40,x1-40):
        s+=f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+(960-y if y>400 else 0)}" stroke="{INK}" stroke-width="12" stroke-linecap="round"/>'
    s+=rect(x0,y-14,x1-x0,28,SAFH,sw=5,rx=14)
    s+=''.join(f'<circle cx="{x}" cy="{y}" r="4" fill="{INK}"/>' for x in range(x0+30,x1-20,60))
    return s
bg+=rail(80,0,1920)
bg+=rail(560,40,1340)
# pieds de portant bas
bg+=rect(80,950,140,22,INK,sw=2,rx=8)+rect(1170,950,140,22,INK,sw=2,rx=8)
def tag(x,y,rot,col):
    return f'<g transform="translate({x},{y}) rotate({rot})"><circle r="26" fill="{col}" stroke="{INK}" stroke-width="4"/><circle r="9" fill="{MINT}" stroke="{INK}" stroke-width="3"/><circle cy="0" r="17" fill="none" stroke="{CREAM}" stroke-width="2.5" stroke-dasharray="4 4"/></g>'
fg=''
def hang(id,x,rail_y,h,drop,rot,tagcol=None,tx=None):
    from assets import size
    w0,h0=size(id); w=h*w0/h0
    cy=rail_y+drop+h/2
    top=cy-h/2+h*0.07
    s=''
    for dx in (-w*0.28,w*0.28):
        s+=f'<path d="M{x+dx*0.2:.0f},{rail_y+10} L{x+dx:.0f},{top:.0f}" stroke="{INK}" stroke-width="3.5" fill="none"/>'
    s+=f'<circle cx="{x+dx*0.2:.0f}" cy="{rail_y+10}" r="8" fill="none" stroke="{INK}" stroke-width="4"/>'
    s+=f'<circle cx="{x-w*0.28:.0f}" cy="{top:.0f}" r="5" fill="{INK}"/><circle cx="{x+w*0.28:.0f}" cy="{top:.0f}" r="5" fill="{INK}"/>'
    return s, img(id,x,cy,h,rot)
row1=[('trio',200,300,-2),('hanabi',560,300,2),('the-mind',900,300,-2),('flip-7',1220,330,2),('skull-king',1520,300,-2)]
row2=[('papayoo',230,280,2),('dekal',520,310,-2),('cabanga',860,290,3),('kyran',1170,310,-2)]
back='';front=''
for id,x,h,r in row1:
    a,b=hang(id,x,80,h,70+ (id=='flip-7')*-10,r); back+=a; front+=b
for id,x,h,r in row2:
    a,b=hang(id,x,560,h,60,r); back+=a; front+=b
# etiquettes rondes vides pendues aux fils
tags=[(380,330,-12,RED),(740,330,10,BLUE),(1050,300,-8,VIOLET),(1380,330,12,ORANGE),(1700,330,-10,TERRA),(375,800,8,ORANGE),(690,830,-10,RED),(1010,800,10,VIOLET)]
for x,y,r,c in tags:
    back+=f'<path d="M{x},{80 if y<500 else 560} L{x},{y-26}" stroke="{INK}" stroke-width="3"/>'+tag(x,y,r,c)
# TIRELIRE SINGE
def piggy(x,y,s):
    g=f'<g transform="translate({x},{y}) scale({s})">'
    g+=f'<ellipse cx="10" cy="262" rx="260" ry="24" fill="{INK}" opacity=".25"/>'
    BR='#8A4B2B'; BRL='#B8703F'; SK='#F0C8A0'
    # queue
    g+=path('M150,120 C260,110 300,10 250,-40 C220,-70 180,-40 205,-10 C220,10 245,-4 238,-20',stroke=INK,sw=22)
    g+=path('M150,120 C260,110 300,10 250,-40 C220,-70 180,-40 205,-10 C220,10 245,-4 238,-20',stroke=BR,sw=12)
    # jambes
    for lx in (-100,70):
        g+=path(f'M{lx},150 C{lx-12},220 {lx-20},240 {lx-22},250 L{lx+70},250 C{lx+66},230 {lx+60},200 {lx+64},150 Z',fill=BR,sw=5)
        g+=path(f'M{lx-24},250 C{lx-26},232 {lx+74},232 {lx+72},250 C{lx+74},268 {lx-26},268 {lx-24},250 Z',fill=BRL,sw=5)
    # corps
    g+=path('M-170,20 C-170,-110 -60,-150 40,-148 C160,-146 215,-70 205,40 C196,150 100,190 -10,190 C-110,190 -170,130 -170,20 Z',fill=BR,sw=6)
    # ventre
    g+=path('M-120,40 C-122,-30 -60,-70 0,-68 C70,-66 120,-20 118,50 C116,120 60,160 -2,160 C-70,160 -118,120 -120,40 Z',fill=SK,sw=4)
    g+=''.join(f'<circle cx="{-70+(i%4)*46}" cy="{10+(i//4)*40}" r="3.5" fill="{BR}" opacity=".6"/>' for i in range(12))
    # fente
    g+=path('M-20,-146 C10,-158 70,-158 100,-146',stroke=INK,sw=14)
    g+=path('M-14,-148 C12,-157 66,-157 94,-148',stroke='#1B1316',sw=6)
    # tete
    g+=path('M-250,-120 C-250,-220 -170,-262 -100,-262 C-20,-262 30,-210 28,-140 C26,-60 -30,-18 -100,-18 C-190,-18 -250,-50 -250,-120 Z',fill=BR,sw=6)
    # oreilles
    for ex,side in ((-262,-1),(40,1)):
        g+=f'<circle cx="{ex+(0 if side<0 else -12)}" cy="-140" r="52" fill="{BR}" stroke="{INK}" stroke-width="6"/><circle cx="{ex+(0 if side<0 else -12)}" cy="-140" r="30" fill="{SK}" stroke="{INK}" stroke-width="4"/>'
    # tete par dessus oreilles
    g+=path('M-250,-120 C-250,-220 -170,-262 -100,-262 C-20,-262 30,-210 28,-140 C26,-60 -30,-18 -100,-18 C-190,-18 -250,-50 -250,-120 Z',fill=BR,sw=6)
    # masque visage
    g+=path('M-210,-140 C-190,-190 -150,-190 -125,-165 C-108,-182 -62,-190 -40,-165 C0,-185 -4,-120 -30,-78 C-60,-30 -170,-30 -200,-80 C-216,-100 -216,-125 -210,-140 Z',fill=SK,sw=4)
    g+=f'<circle cx="-155" cy="-135" r="13" fill="{INK}"/><circle cx="-80" cy="-135" r="13" fill="{INK}"/><circle cx="-151" cy="-139" r="4" fill="{CREAM}"/><circle cx="-76" cy="-139" r="4" fill="{CREAM}"/>'
    g+=path('M-170,-165 q15,-14 32,-4 M-96,-168 q16,-12 32,3',stroke=INK,sw=5)
    # museau
    g+=f'<ellipse cx="-118" cy="-82" rx="46" ry="30" fill="#FBE0BF" stroke="{INK}" stroke-width="4"/><circle cx="-134" cy="-92" r="4.5" fill="{INK}"/><circle cx="-102" cy="-92" r="4.5" fill="{INK}"/>'
    g+=path('M-146,-72 Q-118,-52 -90,-72',stroke=INK,sw=4)
    # bras tenant piece
    g+=path('M-110,20 C-170,40 -200,10 -190,-30 C-186,-40 -170,-36 -168,-24 C-166,0 -150,10 -110,-10 Z',fill=BR,sw=5)
    g+=f'<circle cx="-186" cy="-26" r="22" fill="{SK}" stroke="{INK}" stroke-width="4"/>'
    # motifs graves sur le corps
    g+=path('M60,-100 q40,10 60,50',stroke=CREAM,sw=4,extra='opacity=".7"')
    g+=''.join(f'<circle cx="{150+i*0}" cy="{-40+i*30}" r="4" fill="{CREAM}"/>' for i in range(4))
    return g+'</g>'
back+=piggy(1665,775,0.75)
# piece qui tombe + pieces
def coin(x,y,r,rot=0):
    return f'<g transform="translate({x},{y}) rotate({rot})"><ellipse cx="4" cy="6" rx="{r}" ry="{r}" fill="{INK}" opacity=".25"/><circle r="{r}" fill="{SAFH}" stroke="{INK}" stroke-width="4"/><circle r="{r*0.68}" fill="none" stroke="{INK}" stroke-width="2.5"/><polygon points="0,{-r*.4} {r*.3},0 0,{r*.4} {-r*.3},0" fill="{INK}"/></g>'
back+=coin(1717,560,34,12)+path('M1717,606 v26',stroke=INK,sw=4,extra='opacity=".4"')
back+=coin(1330,945,30)+coin(1380,962,26)+coin(1850,975,30)+coin(1480,990,26)
build('jeux-cartes-moins-de-15-euros',MINT,bg+back,front)
