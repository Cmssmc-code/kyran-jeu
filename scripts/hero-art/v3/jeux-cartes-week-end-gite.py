import sys;sys.path.insert(0,'/tmp/claude-0/vec')
from hv3 import *
random.seed(8)
BLUE_S='#2C6FB5';BLUE_D='#1D4F86'
bg=''
# motifs gravés sur le fond ocre
for i in range(0,1920,120):
    bg+=zigband(i,1040,120,28,'#A66F1C',1,.9)
bg+=latt(0,0,1920,1000,110,'#FBF6EC',.13,3)
for (x,y) in [(70,90),(1850,90),(70,560),(1850,560)]:
    bg+=zig(x,y,48,26,8,stroke=CREAM,sw=4)+C(x,y,8,CREAM)
bg+=R(0,1005,1920,75,'#5A3A1C')+zigband(0,990,1920,18,'#5A3A1C',96)
# toit
bg+=poly([(120,172),(960,18),(1800,172)],'#B8432A',INK,5)
for r in range(5):
    y=40+r*30
    for k in range(40):
        x0=960-(840*(y-18)/154.0)-0; 
    bg+=''
tiles=''
for r in range(1,6):
    yy=18+r*28
    half=840*(yy-18)/154
    n=int(2*half//60)
    for k in range(n+1):
        x=960-half+k*60+(30 if r%2 else 0)
        if 960-half+8<x<960+half-8:
            tiles+=f'<path d="M{x-28},{yy} q28,34 56,0" fill="none" stroke="#7E2A18" stroke-width="4"/>'
bg+=tiles
# cheminée du toit
bg+=R(330,60,86,120,'#7A6A5C',stroke=INK,sw=4)+R(320,48,106,20,'#5E5045',rx=4,stroke=INK,sw=3)
for (x,y,r) in [(380,20,18),(400,-10,24)]: bg+=C(x,y,r,CREAM,op=.0)
# murs en pierre
bg+=R(150,170,1620,840,'#8C7A66',stroke=INK,sw=5)
for r in range(0,16):
    y=170+r*52
    bg+=f'<line x1="150" y1="{y}" x2="1770" y2="{y}" stroke="#5E5045" stroke-width="3"/>'
    for c in range(0,32):
        x=150+c*60+(30 if r%2 else 0)
        if x<1770: bg+=f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+52}" stroke="#5E5045" stroke-width="3"/>'
# intérieurs
bg+=R(190,190,1540,310,'#F1DEB6')   # étage
bg+=R(190,530,1540,460,'#E6C48A')   # rez
bg+=R(190,500,1540,32,'#6B3F24')+zigband(190,508,1540,16,CREAM,77,.75)
# poutres
for x in (190,700,1210,1722): bg+=R(x,190,10,310,'#6B3F24',op=.85)+R(x,530,10,460,'#6B3F24',op=.85)
bg+=R(190,184,1540,14,'#6B3F24')
bg+=R(190,950,1540,40,'#8A5A32')
for x in range(190,1730,110): bg+=f'<line x1="{x}" y1="950" x2="{x}" y2="990" stroke="#5A331A" stroke-width="3"/>'
# lits (étage)
def bed(x,y,w,col,col2):
    s=R(x,y-150,18,190,'#6B3F24',rx=6)+R(x+w-18,y-100,18,140,'#6B3F24',rx=6)
    s+=R(x+10,y-20,w-20,56,'#6B3F24',rx=8)
    s+=R(x+22,y-70,w-44,70,CREAM,rx=14,stroke=INK,sw=3)
    s+=R(x+22,y-26,w-44,70,col,rx=10,stroke=INK,sw=3)
    s+=zigband(x+36,y-8,w-72,24,col2,max(4,int(w//34)))
    s+=loz_row(x+36,y+22,w-72,16,CREAM,max(4,int(w//40)))
    s+=R(x+30,y-92,84,40,'#FFF',rx=18,stroke=INK,sw=3)
    return s
bg+=bed(260,420,330,TERRA,SAFH)+bed(660,420,330,BLUE_S,CREAM)+bed(1330,420,330,GREEN,SAFH)
# tapis étage + fenêtre centrale
wx=1060
bg+=R(wx,260,140,190,'#7EC6E8',rx=0,stroke='#6B3F24',sw=10)+R(wx+66,260,8,190,'#6B3F24')+R(wx,350,140,8,'#6B3F24')
bg+=C(wx+40,300,22,'#FFF',op=.6)
def shutter(x,y,w,h):
    s=R(x,y,w,h,BLUE_S,rx=4,stroke=BLUE_D,sw=4)
    for k in range(1,9): s+=f'<line x1="{x+6}" y1="{y+k*h/9}" x2="{x+w-6}" y2="{y+k*h/9}" stroke="{BLUE_D}" stroke-width="4"/>'
    return s
bg+=shutter(wx-62,252,58,206)+shutter(wx+144,252,58,206)
# volets extérieurs fixés au mur
for x in (92,1770):
    for y in (230,):
        pass
# cadres / décor étage
bg+=R(360,240,80,100,'#6B3F24',rx=3)+R(370,250,60,80,SAFH)+P('M370,320 l20,-34 l16,20 l12,-14 l12,28 Z',GREEN)+C(405,274,9,CREAM)
bg+=R(1290,240,180,34,'#6B3F24',rx=4)+zigband(1296,246,168,22,CREAM,8,.9)
bg+=R(1500,250,80,100,'#6B3F24',rx=3)+R(1510,260,60,80,'#EAF1F5')+poly([(1540,285),(1556,320),(1524,320)],RED)
# nuit de pennants rez
bg+=P('M570,540 Q1150,615 1722,540','none','#6B3F24',4)
for i in range(20):
    t=(i+.6)/20;x=570+t*1152;y=540+2*t*(1-t)*75
    bg+=poly([(x-15,y),(x+15,y),(x,y+30)],[RED,SAFH,BLUE_S,GREEN,CREAM][i%5],INK,2)
# cheminée rez
bg+=R(215,560,330,430,'#7A6A5C',stroke=INK,sw=4)
for r in range(0,9):
    y=560+r*50
    bg+=f'<line x1="215" y1="{y}" x2="545" y2="{y}" stroke="#4E4137" stroke-width="3"/>'
    for c in range(0,6):
        x=215+c*60+(30 if r%2 else 0)
        if 215<x<545: bg+=f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+50}" stroke="#4E4137" stroke-width="3"/>'
bg+=R(200,548,360,24,'#6B3F24',rx=6)
bg+=f'<path d="M265,950 V760 Q265,690 380,690 Q495,690 495,760 V950 Z" fill="#160D08" stroke="#3A2E26" stroke-width="10"/>'
bg+=f'<path d="M280,950 V770 Q280,710 380,710 Q480,710 480,770 V950 Z" fill="url(#glow)"/>'
bg+=R(290,925,180,20,'#4A2A15',rx=9)+R(310,905,140,20,'#5A331A',rx=9)
bg+=flame(380,915,170,140)+flame(335,915,110,80)+flame(430,915,120,85)
bg+=R(300,560,160,14,CREAM,op=0)
# objets sur le manteau
bg+=R(238,520,26,28,'#B8432A',rx=3)+R(520,508,16,40,CREAM,rx=3)+C(528,500,6,SAFH)
# table de ferme
tx0,tx1,TY=620,1700,850
bg+=R(tx0,TY,tx1-tx0,28,'#8A5A32',rx=6,stroke=INK,sw=3)+R(tx0+20,TY+28,tx1-tx0-40,24,'#6B3F24')
bg+=zigband(tx0+30,TY+32,tx1-tx0-60,14,SAFH,50,.9)
for x in (tx0+40,tx1-90): bg+=R(x,TY+50,50,100,'#6B3F24',stroke=INK,sw=3)
# bancs
bg+=R(tx0-40,TY+78,60,16,'#6B3F24')+R(tx1-20,TY+78,60,16,'#6B3F24')
# tapis devant cheminée + chat
bg+=R(250,960,280,24,TERRA,rx=10)+zigband(262,964,256,14,CREAM,16,.85)
fg=''
# chat endormi sur la couette
fg+='<g transform="translate(470,372)">'+P('M-60,30 C-70,-20 -20,-30 20,-24 C62,-18 74,10 60,30 Z','#3B2A1E',INK,3)+C(-50,2,24,'#3B2A1E',INK,3)+poly([(-66,-14),(-60,-38),(-46,-18)],'#3B2A1E',INK,3)+poly([(-46,-20),(-32,-34),(-30,-12)],'#3B2A1E',INK,3)+P('M58,22 C86,22 92,-2 76,-8','none','#3B2A1E',12)+P('M-60,6 q7,5 14,0','none',CREAM,3)+'</g>'
# jeux sur la table
H=230
order=[('papayoo',0),('skull-king',0),('skyjo',0),('just-one',0),('flip-7',0),('jungle-speed',0)]
from assets import size
ws=[H*size(a)[0]/size(a)[1] for a,_ in order]
gap=10;x=tx0+36
for (a,_),w in zip(order,ws):
    cx=x+w/2
    fg+=shadow(cx,TY+2,w*1.0,.35)+img(a,cx,TY-H/2,H,[-1.5,1.2,-1,1.4,-1.2,1][order.index((a,_))])
    x+=w+gap
# chandelle + pichet à droite de la table
fg+=R(1668,TY-70,22,70,CREAM,rx=3,stroke=INK,sw=2)+flame(1679,TY-70,34,18,(ORANGE,SAFH,CREAM))+C(1679,TY-90,34,'url(#glow)')
# volets bleus extérieurs (premier plan)
fg+=shutter(88,230,64,240)+shutter(1768,230,64,240)+shutter(88,620,64,240)+shutter(1768,620,64,240)
# fumée
for (x,y,r) in [(375,28,16),(392,-4,20),(372,-36,24)]:
    pass
render('jeux-cartes-week-end-gite',bg,fg,OCRE)
