from hk_common import *
T='#17A2A0';TD='#0E7F80';TL='#4CC7C0'
bg=''
# nested triangles radiating
cx,cy=960,640
def tri(cx,cy,r,rot=-90):
    return [(cx+r*math.cos(math.radians(rot+120*i)),cy+r*math.sin(math.radians(rot+120*i))) for i in range(3)]
for i,r in enumerate(range(1500,300,-120)):
    bg+=poly(tri(cx,cy,r),fill=T if i%2 else TD,opacity=.8 if i%2 else .55)
bg+=f'<rect width="1920" height="1080" fill="{T}" opacity=".25"/>'
for r,sw,op in [(620,6,.5),(700,3,.35)]:
    bg+=poly(tri(960,720,r),fill='none',stroke=CREAM,stroke_width=sw,opacity=op,stroke_linejoin='round')
# vertices
V=[(960,585),(450,835),(1470,835)]
# engraved triangle through vertices
bg+=poly(V,fill='none',stroke=CREAM,stroke_width=10,stroke_linejoin='round')
# diamonds along edges
for i in range(3):
    a=V[i];b=V[(i+1)%3]
    for t in [0.2,0.35,0.5,0.65,0.8]:
        x=a[0]+(b[0]-a[0])*t;y=a[1]+(b[1]-a[1])*t
        r=14 if t==0.5 else 9
        bg+=poly([(x,y-r),(x+r,y),(x,y+r),(x-r,y)],fill=CREAM if t!=0.5 else SAF,stroke=INK,stroke_width=2.5)
# border of zigzag top and bottom
for x in range(0,1960,60):
    bg+=poly([(x,0),(x+30,34),(x+60,0)],fill=TD,opacity=.8)
    bg+=poly([(x,1080),(x+30,1046),(x+60,1080)],fill=TD,opacity=.8)
# small kites in side areas
for (sx,sy) in [(150,250),(1770,250),(150,560),(1770,560),(230,960),(1690,960)]:
    bg+=zig(sx,sy,46,26,8,stroke=CREAM,sw=4)+f'<circle cx="{sx}" cy="{sy}" r="9" fill="{SAF}"/>'
bg+=zig(960,855,62,38,10,fill=TD,stroke=CREAM,sw=5)+zig(960,855,26,16,8,fill=SAF,stroke=INK,sw=3)
# hands above each box
mid=''
mid+=hand(960,340,0,'#F1C9A5','#C79670',RED,CREAM,[BLUE,SAF,VIOLET],sl=260)
mid+=hand(450,560,-6,'#B87A45','#8A5530',VIOLET,SAFH,[RED,GREEN,ORANGE],sl=260)
mid+=hand(1470,560,6,'#7A4A2A','#52301A',ORANGE,CREAM,[SAF,BLUE,RED],sl=260)
# shadows pads under boxes
clean=''
H=390
for (x,y),i in zip(V,['the-crew','hanabi','love-letter']):
    clean+=img(i,x,y,H,rot={'the-crew':-2,'hanabi':3,'love-letter':-3}[i])
open('/tmp/claude-0/vec/jeux-3-joueurs.svg','w').write(doc(bg,mid,clean,bgcol=T))
import subprocess;subprocess.run(['node','/tmp/claude-0/vec/render.js','/tmp/claude-0/vec/jeux-3-joueurs.svg','/tmp/claude-0/vec/jeux-3-joueurs.png'],check=True)
