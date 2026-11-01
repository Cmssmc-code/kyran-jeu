import sys;sys.path.insert(0,'/tmp/claude-0/vec')
from hv3 import *
from assets import size
random.seed(2)
FL=960
bg=''
# papier peint rayé + losanges gravés
for x in range(0,1920,96):
    bg+=R(x,0,48,FL,'#57264F',op=.55)
bg+=latt(0,0,1920,FL,96,CREAM,.0,2)
for x in range(48,1920,96):
    for y in (120,300,480,660,840):
        bg+=poly([(x,y-16),(x+10,y),(x,y+16),(x-10,y)],CREAM,op=.2)
bg+=R(0,FL-120,1920,120,'#2E1229')+zigband(0,FL-142,1920,24,'#2E1229',96)
bg+=R(0,FL,1920,120,'#3A1A33')
for x in range(0,1920,180): bg+=f'<line x1="{x}" y1="{FL}" x2="{x-40}" y2="1080" stroke="#241020" stroke-width="3"/>'
# lueur de bougie
bg+='<ellipse cx="960" cy="640" rx="760" ry="520" fill="url(#glow)" opacity=".55"/>'
# cadres muraux
def frame(x,y,w,h,col):
    return R(x,y,w,h,'#E6AB26',rx=4,stroke=INK,sw=4)+R(x+12,y+12,w-24,h-24,col)+zigband(x+12,y+h-48,w-24,36,CREAM,5,.85)+C(x+w/2,y+h*0.38,22,CREAM,op=.9)
bg+=frame(120,150,170,230,'#7A2E5C')+frame(1630,150,170,230,'#7A2E5C')
# appliques
for x in (420,1500):
    bg+=R(x-8,200,16,70,'#E6AB26')+P(f'M{x-34},200 L{x+34},200 L{x+20},140 L{x-20},140 Z','#F6E7B5',INK,3)+C(x,170,60,'url(#glow)')
for (x,l,c) in [(560,180,RED),(760,120,SAFH),(960,70,GREEN),(1160,120,VIOLET),(1360,180,ORANGE)]:
    bg+=f'<line x1="{x}" y1="0" x2="{x}" y2="{l}" stroke="{CREAM}" stroke-width="3" opacity=".7"/>'
    bg+=P(f'M{x-30},{l} Q{x-44},{l+40} {x-30},{l+78} L{x+30},{l+78} Q{x+44},{l+40} {x+30},{l} Z',c,INK,3)+R(x-22,l-8,44,10,INK,rx=3)+R(x-22,l+78,44,9,INK,rx=3)+zigband(x-24,l+34,48,20,CREAM,3,.9)
# tapis rectangulaire rayé
bg+=R(380,FL+28,1160,46,TERRA,rx=10,stroke=INK,sw=3)+zigband(400,FL+36,1120,26,CREAM,60,.85)
# table à deux plateaux
UY,LY=600,855
tx0,tx1=400,1520
for x in (tx0+30,tx1-54): bg+=R(x,UY,24,FL-UY,'#6B3F24',stroke=INK,sw=3)
bg+=R(tx0,UY,tx1-tx0,24,'#8A5A32',rx=6,stroke=INK,sw=3)+zigband(tx0+14,UY+4,tx1-tx0-28,14,SAFH,46,.9)
bg+=R(tx0-20,LY,tx1-tx0+40,24,'#8A5A32',rx=6,stroke=INK,sw=3)+zigband(tx0-6,LY+4,tx1-tx0+12,14,SAFH,50,.9)
# fauteuil + personnage (repère local : sol y=0, face à droite)
def armchair(col,col2,skin,hair,cloth,cloth2):
    s=''
    s+=R(-150,-6,26,36,'#3A1F10',rx=4)+R(100,-6,26,36,'#3A1F10',rx=4)
    s+=R(-175,-90,340,90,col,rx=26,stroke=INK,sw=4)                       # assise
    s+=R(-175,-400,110,330,col,rx=50,stroke=INK,sw=4)                      # dossier
    s+=zigband(-160,-300,80,26,col2,3)+zigband(-160,-240,80,26,col2,3)+zigband(-160,-180,80,26,col2,3)
    s+=P('M-175,-350 q-34,10 -22,60 q8,24 24,20',col,INK,4)               # oreille
    # personnage
    s+=P('M-60,-90 L-34,-310 Q-20,-340 20,-330 Q40,-320 44,-290 L40,-95 Z',cloth,INK,4)  # torse
    s+=zigband(-52,-205,86,26,cloth2,4)+zigband(-50,-150,84,22,cloth2,4)
    s+=R(-20,-352,40,34,skin,rx=10,stroke=INK,sw=3)                                   # cou
    s+=C(0,-395,44,skin,INK,4)
    s+=P('M-46,-398 Q-48,-452 4,-452 Q50,-450 46,-408 Q30,-430 -4,-424 Q-30,-420 -46,-398 Z',hair,INK,3)
    s+=P('M-44,-92 L72,-150 L112,-146 L112,-88 L-44,-88 Z','#2A1A3A',INK,4)
    s+=R(72,-150,40,150,'#2A1A3A',rx=12,stroke=INK,sw=4)+P('M70,-18 L132,-18 Q146,-6 140,12 L70,12Z',CREAM,INK,3)
    # bras vers la table tenant une tasse
    s+=P('M-4,-290 Q60,-250 112,-262','none',cloth,36)+P('M-4,-290 Q60,-250 112,-262','none',INK,2,0)
    s+=C(126,-264,17,skin,INK,3)
    s+=R(-120,-124,110,34,col,rx=17,stroke=INK,sw=4)
    return s
fg=''
fg+=f'<g transform="translate(205,{FL}) scale(.9)">{armchair("#E08A3C","#6B3F24","#8D5A3B","#2A1A12","#B8432A","#FBF6EC")}</g>'
fg+=f'<g transform="translate(1715,{FL}) scale(-.9,.9)">{armchair("#3FA796","#12463F","#F1C7A2","#7A3E1D","#6B45B8","#F2C14E")}</g>'
# plateau haut : 4 jeux
def row(ids,y,H,x0,x1,rots):
    ws=[H*size(a)[0]/size(a)[1] for a in ids]
    gap=(x1-x0-sum(ws))/(len(ids)+1)
    x=x0+gap;o=''
    for a,w,r in zip(ids,ws,rots):
        o+=shadow(x+w/2,y+2,w,.35)+img(a,x+w/2,y-H/2,H,r); x+=w+gap
    return o
fg+=row(['lost-cities','schotten-totten','star-realms','hanabi'],UY,245,tx0+30,tx1-30,[-1.2,1.2,-1,1])
# plateau bas : 3 jeux + 2 tasses + bougie
def cup(x,y,col):
    s=P(f'M{x-30},{y-52} L{x+30},{y-52} L{x+24},{y-6} Q{x},{y+6} {x-24},{y-6} Z',col,INK,3)+f'<path d="M{x+30},{y-42} q30,4 22,24 q-8,14 -26,10" fill="none" stroke="{INK}" stroke-width="5"/>'
    s+=R(x-44,y-4,88,8,CREAM,rx=4,stroke=INK,sw=2)+zigband(x-24,y-40,48,16,CREAM,3,.9)
    s+=P(f'M{x-8},{y-62} q-12,-18 0,-36 q12,-16 0,-34','none',CREAM,4,.5)+P(f'M{x+10},{y-62} q-12,-14 0,-28','none',CREAM,4,.4)
    return s
ids=['love-letter','the-crew','the-game']
H=195;ws=[H*size(a)[0]/size(a)[1] for a in ids]
fg+=cup(tx0+50,LY,'#E08A3C')
x=tx0+170
for a,w,r in zip(ids[:2],ws[:2],[-1.2,1.2]):
    fg+=shadow(x+w/2,LY+2,w,.35)+img(a,x+w/2,LY-H/2,H,r);x+=w+14
# bougie centre
bx=x+30
fg+=R(bx-14,LY-92,28,92,CREAM,rx=4,stroke=INK,sw=3)+R(bx-26,LY-6,52,8,'#E6AB26',rx=3)+flame(bx,LY-92,52,26,(ORANGE,SAFH,CREAM))+C(bx,LY-110,50,'url(#glow)')
x=bx+56
a,w=ids[2],ws[2]
fg+=shadow(x+w/2,LY+2,w,.35)+img(a,x+w/2,LY-H/2,H,1)
fg+=cup(tx1-70,LY,'#3FA796')
render('jeux-duo-couples',bg,fg,PRUNE)
