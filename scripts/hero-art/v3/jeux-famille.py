from hk_common import *
Y0='#FFC83D';Y1='#FFD866';Y2='#F5B521'
bg=f'<rect width="1920" height="1080" fill="{Y0}"/>'
# rays from sun
sx,sy=130,120
for i in range(18):
    a0=math.radians(i*10-10);a1=math.radians(i*10+0)
    bg+=poly([(sx,sy),(sx+2600*math.cos(a0),sy+2600*math.sin(a0)),(sx+2600*math.cos(a1),sy+2600*math.sin(a1))],fill=Y1,opacity=.8) if i%2==0 else ''
bg+=zig(sx,sy,150,110,16,fill=ORANGE,stroke=INK,sw=5)+f'<circle cx="{sx}" cy="{sy}" r="82" fill="{SAFH}" stroke="{INK}" stroke-width="5"/>'
# clouds-free; tree left & right
def tree(x,y,s=1,c=GREEN):
    t=f'<g transform="translate({x},{y}) scale({s})">'
    t+=f'<path d="M-16,0 L-10,-170 L10,-170 L16,0 Z" fill="{TERRA}" stroke="{INK}" stroke-width="4"/>'
    for (cx,cy,r) in [(0,-250,86),(-70,-200,62),(70,-200,62),(0,-170,70)]:
        t+=f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{c}" stroke="{INK}" stroke-width="4"/>'
    for (cx,cy) in [(-30,-260),(40,-230),(-60,-195),(60,-190),(0,-200)]:
        t+=poly([(cx,cy-12),(cx+9,cy),(cx,cy+12),(cx-9,cy)],fill=CREAM,opacity=.8)
    return t+'</g>'
bg+=tree(1840,1030,0.95,GREEN)+tree(95,1030,0.78,'#2E8A3E')
# house
HX0,HX1=220,1700
bg+=f'<rect x="{HX0}" y="395" width="{HX1-HX0}" height="640" fill="{TERRA}" stroke="{INK}" stroke-width="6"/>'
# roof slab + parapet
bg+=f'<rect x="{HX0-30}" y="338" width="{HX1-HX0+60}" height="58" rx="8" fill="{CREAM}" stroke="{INK}" stroke-width="6"/>'
for x in range(HX0-10,HX1+20,60):
    bg+=poly([(x,344),(x+14,366),(x,388),(x-14,366)],fill=SAF,stroke=INK,stroke_width=3)
# facade bands zig
for x in range(HX0,HX1,48):
    bg+=poly([(x,400),(x+24,430),(x+48,400)],fill=CREAM,opacity=.85)
for x in range(HX0,HX1,48):
    bg+=poly([(x,935),(x+24,965),(x+48,935)],fill=CREAM,opacity=.0)
# big window
WX0,WX1,WY0,WY1=500,1430,450,890
bg+=f'<rect x="{WX0-26}" y="{WY0-26}" width="{WX1-WX0+52}" height="{WY1-WY0+52}" rx="10" fill="{INK}"/>'
bg+=f'<rect x="{WX0-12}" y="{WY0-12}" width="{WX1-WX0+24}" height="{WY1-WY0+24}" rx="6" fill="{CREAM}"/>'
bg+=f'<rect x="{WX0}" y="{WY0}" width="{WX1-WX0}" height="{WY1-WY0}" fill="#FFE6A8"/>'
# interior wall: lamp glow + frames
bg+=f'<ellipse cx="965" cy="640" rx="400" ry="180" fill="#FFF4CC" opacity=".8"/>'
# pennant garland
for i in range(11):
    x=WX0+30+i*84
    bg+=poly([(x,WY0+22+8*math.sin(i)),(x+34,WY0+22+8*math.sin(i)),(x+17,WY0+62+8*math.sin(i))],fill=[RED,BLUE,GREEN,VIOLET,ORANGE][i%5],stroke=INK,stroke_width=2.5)
bg+=f'<path d="M{WX0},{WY0+20} Q{(WX0+WX1)/2},{WY0+34} {WX1},{WY0+20}" fill="none" stroke="{INK}" stroke-width="3" opacity="0"/>'
# lamp
bg+=f'<line x1="965" y1="{WY0}" x2="965" y2="{WY0+72}" stroke="{INK}" stroke-width="4"/><path d="M925,{WY0+110} L945,{WY0+70} L985,{WY0+70} L1005,{WY0+110} Z" fill="{RED}" stroke="{INK}" stroke-width="4"/>'
# left small window
bg+=f'<rect x="262" y="500" width="190" height="270" rx="10" fill="{INK}"/><rect x="274" y="512" width="166" height="246" rx="6" fill="#FFE6A8"/>'
bg+=f'<line x1="357" y1="512" x2="357" y2="758" stroke="{INK}" stroke-width="7"/><line x1="274" y1="635" x2="440" y2="635" stroke="{INK}" stroke-width="7"/>'
bg+=f'<rect x="250" y="770" width="214" height="34" rx="6" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'
for i,c in enumerate([RED,VIOLET,ORANGE,BLUE,RED]):
    bg+=f'<circle cx="{276+i*40}" cy="760" r="14" fill="{c}" stroke="{INK}" stroke-width="2.5"/><circle cx="{276+i*40}" cy="760" r="4" fill="{SAFH}"/>'
# door
bg+=f'<rect x="1500" y="640" width="170" height="395" rx="8" fill="{INK}"/><path d="M1514,1035 L1514,670 Q1514,654 1530,654 L1640,654 Q1656,654 1656,670 L1656,1035 Z" fill="{SAF}"/>'
for i in range(3):
    bg+=poly([(1585,690+i*70),(1620,725+i*70),(1585,760+i*70),(1550,725+i*70)],fill='none',stroke=INK,stroke_width=4)
bg+=f'<circle cx="1632" cy="860" r="9" fill="{INK}"/>'
bg+=zig(1585,590,40,26,8,fill=CREAM,stroke=INK,sw=3)
for r in range(2):
    for x in range(HX0+30,1480,70):
        bg+=poly([(x+(35 if r else 0),935+r*40),(x+(35 if r else 0)+22,957+r*40),(x+(35 if r else 0),979+r*40),(x+(35 if r else 0)-22,957+r*40)],fill='none',stroke=CREAM,stroke_width=4,opacity=.85)
# ground
bg+=f'<rect x="0" y="1020" width="1920" height="60" fill="{GREEN}"/><rect x="0" y="1020" width="1920" height="8" fill="{INK}"/>'
bg+=f'<path d="M1500,1080 L1540,1030 L1700,1030 L1740,1080 Z" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
bg=bg.replace('width="{HX1-HX0+60}"','')
# characters
mid=''
by=812
people=[(585,1.35,'#E8B98F',BLUE,CREAM,'#B7B7B7','bun',False),(740,1.35,'#8D5524',GREEN,SAFH,'#231F22','beard',False),
        (885,1.05,'#A8693A',RED,CREAM,'#231F22','curly',False),(1010,1.03,'#C68642',VIOLET,SAFH,'#4A2C17','pony',False),
        (1145,1.35,'#6B3E22',ORANGE,CREAM,'#231F22','long',False),(1295,1.35,'#F1C9A5',TERRA,CREAM,'#D9D9D9','bald',True)]
for x,s,sk,sh,sh2,hr,st,gl in people:
    mid+=person(x,by,s,sk,sh,sh2,hr,st,gl)
# table
mid+=f'<path d="M520,{by-16} L1410,{by-16} L1440,{by+66} L490,{by+66} Z" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
for i in range(26):
    mid+=poly([(540+i*34,by+16),(540+i*34+9,by+24),(540+i*34,by+32),(540+i*34-9,by+24)],fill=TERRA,opacity=.75)
# cards on table
def tcard(x,y,rot,c):
    return f'<g transform="translate({x},{y}) rotate({rot}) scale(.42)">{card_back(112,160,c)}</g>'
for i,(x,c) in enumerate([(660,BLUE),(690,RED),(720,GREEN)]):
    mid+=tcard(x,by-8,-20+i*20,c)
for i,(x,c) in enumerate([(1085,SAF),(1110,VIOLET)]):
    mid+=tcard(x,by-6,-10+i*20,c)
mid+=f'<path d="M930,{by-8} Q930,{by+18} 965,{by+18} Q1000,{by+18} 1000,{by-8} Z" fill="{SAFH}" stroke="{INK}" stroke-width="3.5"/>'
# front of table band darker overlay handled; roof boxes (clean)
clean=''
games=['dixit','timeline','dobble','skyjo','hanabi','llama','love-letter','kyran']
H=238
ws=[size(g)[0]/size(g)[1]*H for g in games]
gap=14; total=sum(ws)+gap*(len(ws)-1)
x=960-total/2
for g,w in zip(games,ws):
    clean+=img(g,x+w/2,338-H/2+8,H,rot=0)
    x+=w+gap
open('/tmp/claude-0/vec/jeux-famille.svg','w').write(doc(bg,mid,clean,bgcol=Y0,seed=4))
import subprocess;subprocess.run(['node','/tmp/claude-0/vec/render.js','/tmp/claude-0/vec/jeux-famille.svg','/tmp/claude-0/vec/jeux-famille.png'],check=True)
