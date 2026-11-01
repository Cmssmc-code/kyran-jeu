import sys,math
sys.path.insert(0,'/tmp/claude-0/vec')
from v3m4_lib import *
BG='#12294F'
NAVY2='#1A3A6E'
HULL='#5B3420';HULLD='#3E2314'
# ---------- ciel : bandes bogolan faibles, étoiles
sky=f'<rect width="1920" height="1080" fill="{BG}"/>'
for k,y in enumerate((60,140)):
    for i in range(0,41):
        x=i*48
        sky+=f'<polygon points="{x},{y} {x+24},{y-30} {x+48},{y}" fill="none" stroke="{CREAM}" stroke-width="3.5" opacity=".28"/>' if k==0 else f'<polygon points="{x},{y} {x+24},{y+26} {x+48},{y}" fill="{NAVY2}" opacity=".9"/>'
for (x,y,r) in [(120,260,16),(240,420,10),(560,90,14),(900,60,10),(1180,120,18),(1480,70,12),(1750,200,16),(1830,430,10),(60,520,12),(1350,300,10)]:
    sky+=star4(x,y,r,CREAM,.9)
# grande lune en losange gravé (croissant remplacé par losanges concentriques)
for r,op in ((120,.55),(86,.4),(52,.8)):
    sky+=lozenge(1640,230,r,r,fill='none' if r!=52 else SAFH,stroke=SAFH,sw=4,op=op)
# ---------- vagues arrière
back=''
back+=wave(690,16,220,0,'#1B4F8F',stroke=None)
back+=wave(730,20,260,60,'#1D5FA6')
# ---------- navire pirate (de côté)
ship=''
# mâts
for x,top in ((420,300),(760,110),(1050,190)):
    ship+=f'<rect x="{x-9}" y="{top}" width="18" height="{560-top}" fill="{HULLD}" stroke="{INK}" stroke-width="3"/>'
# bout-dehors
ship+=f'<path d="M1330,500 L1560,430" stroke="{INK}" stroke-width="18" stroke-linecap="round"/><path d="M1330,500 L1560,430" stroke="{HULL}" stroke-width="10" stroke-linecap="round"/>'
# voile de foc
ship+=f'<path d="M1075,215 L1540,425 L1075,470 Z" fill="{CREAM}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
ship+=f'<path d="M1100,290 L1440,418 M1100,360 L1360,420" stroke="{TERRA}" stroke-width="4" stroke-dasharray="12 9" opacity=".8"/>'
# voile de misaine (haut + bas)
def square_sail(cx,ytop,w,hh,bulge=18,emblem=None,col=CREAM):
    s=f'<rect x="{cx-w/2-14}" y="{ytop-8}" width="{w+28}" height="14" rx="7" fill="{HULLD}" stroke="{INK}" stroke-width="3"/>'
    s+=f'<path d="M{cx-w/2},{ytop} L{cx+w/2},{ytop} C{cx+w/2+bulge},{ytop+hh*.4} {cx+w/2+bulge},{ytop+hh*.8} {cx+w/2-6},{ytop+hh} Q{cx},{ytop+hh+bulge} {cx-w/2+6},{ytop+hh} C{cx-w/2-bulge},{ytop+hh*.8} {cx-w/2-bulge},{ytop+hh*.4} {cx-w/2},{ytop} Z" fill="{col}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    s+=f'<path d="M{cx-w/2+16},{ytop+14} H{cx+w/2-16}" stroke="{TERRA}" stroke-width="4" stroke-dasharray="10 8"/>'
    return s
ship+=square_sail(760,168,250,120)+square_sail(760,300,360,185,22)
ship+=skull(760,395,1.55,INK,CREAM,True)
ship+=f'<path d="M600,455 q40,14 80,0 M840,455 q40,14 80,0" stroke="{TERRA}" stroke-width="4" fill="none"/>'
ship+=square_sail(1050,245,250,100)+square_sail(1050,352,300,150,18)
# zigzag gravé sur la misaine basse
ship+=f'<polyline points="{" ".join(f"{925+k*25},{(445 if k%2 else 425)}" for k in range(11))}" fill="none" stroke="{RED}" stroke-width="5" stroke-linejoin="round"/>'
ship+=skull(1050,398,.55,TERRA,CREAM,False)
# artimon : voile latine
ship+=f'<path d="M424,310 L424,520 L270,515 Z" fill="{CREAM}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
ship+=f'<path d="M424,360 L330,500 M424,420 L370,505" stroke="{TERRA}" stroke-width="4" stroke-dasharray="10 8"/>'
# pavillons noirs avec crâne
for x,y in ((760,110),(1050,190),(420,300)):
    ship+=f'<path d="M{x},{y} L{x+82},{y+8} L{x+70},{y+30} L{x+82},{y+52} L{x},{y+44} Z" fill="{INK}" stroke="{INK}" stroke-width="3"/>'
    ship+=skull(x+36,y+26,.22,CREAM,INK,True)
ship+=f'<line x1="420" y1="320" x2="280" y2="505" stroke="{INK}" stroke-width="2.5" opacity=".7"/>'
# coque
hull='M230,470 H440 V540 H1190 C1260,540 1330,520 1392,468 L1370,590 C1290,700 1120,740 900,740 H520 C390,730 290,670 232,590 Z'
ship+=f'<path d="{hull}" fill="{HULL}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
for y in (570,610,650,690):
    ship+=f'<path d="M{250+(y-570)*0.3},{y} H{1360-(y-570)*0.9}" stroke="{HULLD}" stroke-width="3" opacity=".7"/>'
ship+=f'<path d="M230,470 H440 V540 H1190 C1260,540 1330,520 1392,468" fill="none" stroke="{SAF}" stroke-width="10" stroke-linejoin="round"/>'
# frise de triangles crème sur la coque
for i in range(0,26):
    x=360+i*38
    ship+=f'<polygon points="{x},590 {x+19},558 {x+38},590" fill="{CREAM}" opacity=".85"/>' if x<1260 else ''
# sabords
for x in (520,650,780,910,1040):
    ship+=f'<rect x="{x}" y="620" width="46" height="36" rx="5" fill="{INK}"/><rect x="{x+6}" y="628" width="34" height="8" fill="{SAFH}" opacity=".8"/>'
# fenêtres du château arrière
for x in (270,330,390):
    ship+=f'<path d="M{x-16},530 V500 a16,16 0 0 1 32,0 V530 Z" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
# balustrade arrière
ship+=f'<path d="M230,470 V430 M290,470 V430 M350,470 V430 M410,470 V430 M230,430 H440" stroke="{INK}" stroke-width="9" stroke-linecap="round"/><path d="M230,470 V430 M290,470 V430 M350,470 V430 M410,470 V430 M230,430 H440" stroke="{SAF}" stroke-width="4" stroke-linecap="round"/>'
ship+=f'<polyline points="{" ".join(f"{480+k*30},{(686 if k%2 else 668)}" for k in range(18))}" fill="none" stroke="{SAFH}" stroke-width="5" stroke-linejoin="round" opacity=".85"/>'
ship+=f'<path d="M236,430 V384" stroke="{INK}" stroke-width="4"/><rect x="221" y="354" width="30" height="30" rx="6" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
# gouvernail et proue
ship+=f'<path d="M232,560 L196,640 L226,650 L262,600 Z" fill="{HULLD}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
ship+=f'<path d="M1392,468 q30,-30 48,-8 q-6,22 -40,40" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'
# ---------- vagues avant
mid=wave(735,22,240,0,'#2275BA',stroke=None)
foam=''.join(f'<path d="M{x},{735-(14 if (i%2) else 8)} q20,-12 44,0" stroke="{CREAM}" stroke-width="4" fill="none" opacity=".7"/>' for i,x in enumerate(range(0,1920,170)))
front=wave(962,20,230,40,'#3A92D0',stroke=CREAM,sw=4)
front2=wave(1035,16,200,0,'#5BB0E0',stroke=CREAM,sw=3)
# ---------- boîtes : cinq alternatives qui flottent, Skull King en grand
boxes=''
for id_,x,y,h,r in [('wizard',250,815,250,-7),('pili-pili',510,820,255,6),('oh-hell',770,815,260,-5),('cat-in-the-box',1040,825,235,5),('the-crew',1300,815,260,-6)]:
    boxes+=img(id_,x,y,h,r)
boxes+=img('skull-king',1660,680,540,-4)
ship=f'<g transform="translate(0,-45)">{ship}</g>'
for (gx,gy,gs) in ((430,180,1.2),(540,230,.8),(1330,110,1.0)):
    sky+=f'<path d="M{gx-30*gs},{gy} Q{gx-14*gs},{gy-22*gs} {gx},{gy} Q{gx+14*gs},{gy-22*gs} {gx+30*gs},{gy}" fill="none" stroke="{CREAM}" stroke-width="5" stroke-linecap="round"/>'
foamw=''.join(f'<path d="M{x},{724-(6 if i%2 else 0)} q26,-16 52,0 q-14,-4 -26,2" fill="{CREAM}" opacity=".85"/>' for i,x in enumerate(range(260,1330,110)))
layers=[(sky+back,True),(ship,True),(mid+foam+foamw,True),(boxes,False),(front+front2,True)]
open('/tmp/claude-0/vec/jeux-comme-skull-king.svg','w').write(svg3(layers,BG))
