from hk_common import *
B0='#6D1A2B';B1='#822639';B2='#4A0F1E'
bg=f'<rect width="1920" height="1080" fill="{B0}"/>'
cx,cy=960,560
for i in range(36):
    a0=math.radians(i*10);a1=math.radians(i*10+5)
    R=2400
    bg+=poly([(cx,cy),(cx+R*math.cos(a0),cy+R*math.sin(a0)),(cx+R*math.cos(a1),cy+R*math.sin(a1))],fill=B1,opacity=1)
bg+=f'<ellipse cx="{cx}" cy="{cy}" rx="900" ry="560" fill="{B2}" opacity=".25"/>'
bg+=f'<ellipse cx="985" cy="560" rx="560" ry="420" fill="#9A3048" opacity=".25"/>'
# frame border cream
bg+=f'<rect x="28" y="28" width="1864" height="1024" rx="10" fill="none" stroke="{CREAM}" stroke-width="5" opacity=".8"/>'
bg+=f'<rect x="46" y="46" width="1828" height="988" rx="6" fill="none" stroke="{SAF}" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round"/>'
for (x,y) in [(28,28),(1892,28),(28,1052),(1892,1052)]:
    bg+=zig(x,y,52,32,8,fill=B2,stroke=CREAM,sw=4)+f'<circle cx="{x}" cy="{y}" r="9" fill="{SAF}"/>'
def laurel(x0,x1,y,n):
    s=''
    step=(x1-x0)/n
    for i in range(n):
        x=x0+step*(i+.5)
        for sgn in (-1,1):
            s+=f'<path d="M{x},{y} q{sgn*-7+ sgn*0},{sgn*-26} {step*0.55},{sgn*-30} q{-5},{sgn*22} {-step*0.55},{sgn*30} z" fill="{SAF}" stroke="{INK}" stroke-width="2" opacity=".95"/>'
    s+=f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{INK}" stroke-width="4"/>'
    return s
def plinth(x0,x1,y):
    s=f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="44" rx="8" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
    for x in range(int(x0)+22,int(x1)-10,34):
        s+=poly([(x,y+10),(x+10,y+22),(x,y+34),(x-10,y+22)],fill=TERRA)
    s+=f'<rect x="{x0+16}" y="{y+44}" width="{x1-x0-32}" height="14" fill="{B2}" opacity=".6"/>'
    return s
rows=[(['sdj-hase-und-igel','sdj-catan','sdj-carcassonne','sdj-zug-um-zug'],[190,262,262,262],500),
      (['sdj-hanabi','sdj-camel-up','sdj-azul','sdj-dito'],[260,260,260,260],860)]
mid='';clean=''
gap=28
for ids,Hs,base in rows:
    ws=[size(g)[0]/size(g)[1]*h for g,h in zip(ids,Hs)]
    total=sum(ws)+gap*3
    x0=985-total/2
    mid+=plinth(x0-28,x0+total+28,base)
    mid+=laurel(x0-28,x0+total+28,base+86,26) if False else ''
    x=x0
    for g,h,w in zip(ids,Hs,ws):
        clean+=img(g,x+w/2,base-h/2+2,h,rot=0)
        x+=w+gap
mid+=''.join(poly([(x,560),(x+22,584),(x+44,560)],fill='none',stroke=SAF,stroke_width=3,stroke_linejoin='round') for x in range(540,1400,44))+''.join(poly([(x,570),(x+22,590),(x+44,570)],fill='none',stroke=CREAM,stroke_width=4,stroke_linejoin='round') for x in range(540,1400,44))+f'<line x1="540" y1="570" x2="1408" y2="570" stroke="{CREAM}" stroke-width="0"/>'
# pions
clean+=img('sdj-signe',215,550,600,rot=-2)
clean+=img('sdj-kenner',1700,310,430,rot=2)
clean+=img('sdj-kinder',1700,800,430,rot=-2)
# engraved stars on sides
for (x,y) in [(600,110),(1380,110),(600,1000),(1380,1000)]:
    mid+=zig(x,y,40,24,8,fill='none',stroke=CREAM,sw=4)+f'<circle cx="{x}" cy="{y}" r="7" fill="{SAF}"/>'
open('/tmp/claude-0/vec/spiel-des-jahres-gagnants-1979-2026.svg','w').write(doc(bg,mid,clean,bgcol=B0,seed=6))
import subprocess;subprocess.run(['node','/tmp/claude-0/vec/render.js','/tmp/claude-0/vec/spiel-des-jahres-gagnants-1979-2026.svg','/tmp/claude-0/vec/spiel-des-jahres-gagnants-1979-2026.png'],check=True)
