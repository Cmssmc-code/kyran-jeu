import sys
sys.path.insert(0,'/tmp/claude-0/vec')
from v3m4_lib import *
BG='#B8432A'
CX,CY=770,500
# ---------- fond : terracotta, bogolan de losanges et chevrons gravés crème
bg=''
for r in range(1,5):
    bg+=lozenge(CX,CY,170*r+60,150*r+50,stroke=CREAM,sw=4,op=.75-.12*r)
for j in range(-3,16):
    y=j*90
    pts=' '.join(f'{x},{y+(26 if (x//60)%2 else 0)}' for x in range(0,1981,60))
    bg+=f'<polyline points="{pts}" fill="none" stroke="#9E341F" stroke-width="5" opacity=".55"/>'
for gx in range(30,1920,120):
    for gy in range(40,1080,180):
        bg+=f'<g transform="translate({gx+(60 if (gy//180)%2 else 0)},{gy+45})" opacity=".4"><path d="M-9,0H9M0,-9V9" stroke="{CREAM}" stroke-width="3.5" stroke-linecap="round"/></g>'
for (x,y,r1,r2,n) in [(1560,230,190,130,12),(230,200,120,84,10),(250,860,140,98,10)]:
    bg+=zig(x,y,r1,r2,n,fill='none',stroke=CREAM,sw=5).replace('<polygon','<polygon opacity=".7"')
    bg+=zig(x,y,r2*0.7,r2*0.4,n,fill='none',stroke=CREAM,sw=4).replace('<polygon','<polygon opacity=".7"')
    bg+=lozenge(x,y,r2*0.28,r2*0.28,fill=CREAM,stroke=CREAM,sw=2,op=.8)
bg+=tri_row(0,1080,32,60,fill='#8E2D1A',op=.9)
bg+=tri_row(0,60,32,60,fill='#8E2D1A',op=.9,up=False)

def hand(px,py,base,skin,sleeve,acc,style,back=INK):
    s=f'<g transform="translate({px},{py}) rotate({base}) scale(.85)">'
    s+=f'<g transform="translate(0,590)">{sleeve_pattern(150,900,sleeve,acc,CREAM,style)}</g>'
    s+=f'<rect x="-62" y="100" width="124" height="34" rx="8" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
    s+=f'<rect x="-48" y="50" width="96" height="70" fill="{skin}" stroke="{INK}" stroke-width="3"/>'
    s+=fan(0,0,0,5,14,135,150,215,back)
    for i in range(4):
        y=-18+i*24
        s+=cap(2+(i-1.5)*3,y,112-abs(i-1.5)*6,26,skin,INK,3)
    s+=cap(-64,22,28,56,skin,INK,3,rot=-18)
    return s+'</g>'
hands=''
hands+=hand(CX,CY-345,180,SKIN[0],SAF,INK,0)
hands+=hand(CX-385,CY,90,SKIN[3],'#1F7A6B',CREAM,1)
hands+=hand(CX,CY+345,0,SKIN[1],CREAM,RED,2)
hands+=hand(CX+385,CY,-90,SKIN[2],VIOLET,SAFH,2)
centre=''
for dx,dy,r in [(14,12,9),(8,6,5),(3,2,2)]:
    centre+=f'<g transform="translate({CX+dx},{CY+dy}) rotate({r})">{card_back(140,205,INK)}</g>'
centre+=f'<g transform="translate({CX-6},{CY-8}) rotate(-6)">{card_face_spade(140,205)}</g>'
boxes=''
for id_,x,y,h,r in [('schotten-totten',1400,820,290,-8),('skull',1600,800,300,5),('the-crew',1790,810,300,-5),
                    ('oh-hell',1500,925,260,7),('wizard',1720,935,250,-6)]:
    boxes+=img(id_,x,y,h,r)
open('/tmp/claude-0/vec/alternatives-belote-coinche.svg','w').write(svg3([(bg,True),(hands+centre,False),(boxes,False)],BG))
