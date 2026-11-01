from hk_common import *
G0='#3FA845';G1='#58BD4B';G2='#2E8A3E';GD='#1E6B30'
bg=f'<rect width="1920" height="1080" fill="{G0}"/>'
rows=[(62,G1),(298,G0),(534,G1),(770,G0)]
RX=640
for y,c in rows:
    bg+=f'<rect x="{RX}" y="{y}" width="1300" height="236" fill="{c}"/>'
    # grass tufts
    random.seed(y)
    for _ in range(26):
        gx=random.randint(RX+20,1880);gy=random.randint(y+60,y+226)
        bg+=f'<path d="M{gx-8},{gy} L{gx-3},{gy-16} L{gx},{gy-4} L{gx+4},{gy-18} L{gx+9},{gy}" fill="none" stroke="{G2}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    # flowers
    for _ in range(5):
        gx=random.randint(RX+30,1870);gy=random.randint(y+80,y+220)
        bg+=f'<circle cx="{gx}" cy="{gy}" r="6" fill="{CREAM}"/><circle cx="{gx}" cy="{gy}" r="2.5" fill="{SAF}"/>'
    # fence at top
    fy=y+8
    bg+=f'<rect x="{RX}" y="{fy+8}" width="1300" height="9" rx="4" fill="{TERRA}" stroke="{INK}" stroke-width="2"/><rect x="{RX}" y="{fy+30}" width="1300" height="9" rx="4" fill="{TERRA}" stroke="{INK}" stroke-width="2"/>'
    for px in range(RX+20,1930,130):
        bg+=f'<rect x="{px}" y="{fy}" width="14" height="48" rx="5" fill="{SAF}" stroke="{INK}" stroke-width="2.5"/>'
    # separation dark band with diamonds
    bg+=f'<rect x="{RX}" y="{y+226}" width="1300" height="10" fill="{GD}"/>'
# left zone
bg+=f'<rect x="0" y="0" width="{RX-10}" height="1080" fill="{G2}"/>'
bg+=zig(330,540,300,215,14,stroke=CREAM,sw=5).replace('fill="none"','fill="none" opacity=".5"')
# vertical separator posts
bg+=f'<rect x="{RX-30}" y="0" width="40" height="1080" fill="{GD}"/>'
for y in range(30,1080,60):
    bg+=poly([(RX-10,y-14),(RX+2,y),(RX-10,y+14),(RX-22,y)],fill=CREAM)
# top zigzag
mid=''
layout=[['b','c','b','c'],['c','b','b','h'],['b','c','b','c'],['c','b','b','h']]
games=['no-thanks','llama','parade','the-game','for-sale','skull','jungle-speed','kyran']
xs=[800,1075,1355,1640]
clean=''
gi=0;ci=0
for r,((y,c),lay) in enumerate(zip(rows,layout)):
    cy=y+140
    for k,(kind,x) in enumerate(zip(lay,xs)):
        if kind=='b':
            g=games[gi];gi+=1
            clean+=img(g,x,cy+4,214,rot=[-3,2,-2,3][(gi)%4])
        elif kind=='c':
            mid+=f'<ellipse cx="{x+10}" cy="{cy+112}" rx="115" ry="14" fill="{GD}" opacity=".35"/>'
            mid+=cow(x-10,cy+32,0.92,flip=(ci in (0,3)),body=[CREAM,'#F4D9A8',CREAM][ci%3],acc=[TERRA,VIOLET,BLUE,RED,ORANGE,BLUE][ci%6]);ci+=1
        else:
            mid+=f'<ellipse cx="{x}" cy="{cy+100}" rx="80" ry="12" fill="{GD}" opacity=".35"/>'
            hx,hy=x,cy+52
            mid+=f'<rect x="{hx-90}" y="{hy-50}" width="170" height="104" rx="16" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
            mid+=''.join(f'<path d="M{hx-70+i*22},{hy-44} L{hx-70+i*22+6},{hy+48}" stroke="{SAF}" stroke-width="3"/>' for i in range(7))
            mid+=f'<ellipse cx="{hx+80}" cy="{hy+2}" rx="26" ry="52" fill="{SAF}" stroke="{INK}" stroke-width="4"/><ellipse cx="{hx+80}" cy="{hy+2}" rx="15" ry="32" fill="none" stroke="{TERRA}" stroke-width="3.5"/><ellipse cx="{hx+80}" cy="{hy+2}" rx="6" ry="13" fill="none" stroke="{TERRA}" stroke-width="3"/>'
            mid+=f'<rect x="{hx-48}" y="{hy-52}" width="12" height="108" fill="{TERRA}" stroke="{INK}" stroke-width="2.5"/><rect x="{hx+8}" y="{hy-52}" width="12" height="108" fill="{TERRA}" stroke="{INK}" stroke-width="2.5"/>'
# big 6 qui prend
clean+=img('6-qui-prend',330,540,740,rot=-3)
open('/tmp/claude-0/vec/jeux-comme-6-qui-prend.svg','w').write(doc(bg,mid,clean,bgcol=G0,seed=5))
import subprocess;subprocess.run(['node','/tmp/claude-0/vec/render.js','/tmp/claude-0/vec/jeux-comme-6-qui-prend.svg','/tmp/claude-0/vec/jeux-comme-6-qui-prend.png'],check=True)
