import sys
sys.path.insert(0,'/tmp/claude-0/vec')
from v3m4_lib import *
BG='#6B1F33'
WOOD='#D9893A';WOODD='#A9622A'
# ---------- décor : mur bordeaux, arches gravées, frise bogolan, sol
bg=f'<rect x="0" y="0" width="1920" height="1000" fill="{BG}"/>'
bg+=f'<rect x="0" y="990" width="1920" height="90" fill="#3F1020"/>'
bg+=tri_row(0,990,40,48,fill='#3F1020',up=True)
for x in (250,700,1220,1670):
    bg+=f'<path d="M{x-110},560 V210 A110,110 0 0 1 {x+110},210 V560 Z" fill="#561628" stroke="{CREAM}" stroke-width="5" opacity=".9"/>'
    bg+=f'<path d="M{x-84},560 V215 A84,84 0 0 1 {x+84},215 V560" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".5" stroke-dasharray="10 9"/>'
    bg+=f'<path d="M{x},560 V140" stroke="{CREAM}" stroke-width="3" opacity=".35"/>'
# frise losanges/triangles
for i in range(0,40):
    x=i*48
    bg+=f'<polygon points="{x},400 {x+24},370 {x+48},400 {x+24},430" fill="none" stroke="{SAFH}" stroke-width="3.5" opacity=".55"/>'
bg+=f'<path d="M0,352 H1920 M0,448 H1920" stroke="{SAFH}" stroke-width="4" opacity=".5"/>'
for i in range(40):
    bg+=f'<circle cx="{i*48+24}" cy="400" r="4" fill="{CREAM}" opacity=".6"/>'
# lampes suspendues
for x in (560,960,1360):
    bg+=f'<path d="M{x},0 V150" stroke="{CREAM}" stroke-width="4"/>'
    bg+=f'<polygon points="{x-26},150 {x+26},150 {x+72},215 {x-72},215" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'
    bg+=f'<path d="M{x-48},180 H{x+48}" stroke="{INK}" stroke-width="3" opacity=".5"/>'
    bg+=f'<polygon points="{x-66},218 {x+66},218 {x+190},700 {x-190},700" fill="{SAFH}" opacity=".10"/>'
    bg+=f'<ellipse cx="{x}" cy="218" rx="60" ry="9" fill="{SAFH}"/>'
# ---------- comptoir rond vu de côté
cx,cy,rx,ry=960,730,700,98
bar=''
bar+=f'<polygon points="{cx-280},{cy+60} {cx+280},{cy+60} {cx+350},990 {cx-350},990" fill="{WOODD}" stroke="{INK}" stroke-width="4"/>'
for i in range(7):
    bar+=f'<polygon points="{cx-200+i*66},{cy+80} {cx-170+i*66},{cy+140} {cx-140+i*66},{cy+80}" fill="{CREAM}" opacity=".55"/>'
# plateau : bord épais
bar+=f'<path d="M{cx-rx},{cy} V{cy+46} A{rx},{ry} 0 0 0 {cx+rx},{cy+46} V{cy} Z" fill="{WOODD}" stroke="{INK}" stroke-width="4"/>'
for i in range(26):
    x=cx-rx+40+i*52
    ex=(x-cx)/rx
    if abs(ex)<1:
        yy=cy+46+ry*(1-ex*ex)**.5
        bar+=f'<polygon points="{x-12},{yy-10} {x},{yy-34} {x+12},{yy-10}" fill="{CREAM}" opacity=".7"/>' if False else ''
bar+=f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{WOOD}" stroke="{INK}" stroke-width="4"/>'
bar+=f'<ellipse cx="{cx}" cy="{cy}" rx="{rx-34}" ry="{ry-14}" fill="none" stroke="{CREAM}" stroke-width="4" opacity=".6" stroke-dasharray="14 10"/>'
# frise sur le chant du comptoir
for i in range(34):
    x=cx-rx+34+i*40
    ex=(x-cx)/rx
    yy=cy+ry*(1-ex*ex)**.5
    bar+=f'<polygon points="{x-9},{yy+8} {x},{yy+36} {x+9},{yy+8}" fill="{CREAM}" opacity=".85"/>'
# personnages
P=[]
back_l=person(690,705,.9,SKIN[2],'#1F7A6B',CREAM,1,'#3D5A80','bun',INK,pose='cards',card_color=RED)
back_r=person(1250,705,.9,SKIN[0],CREAM,RED,0,'#C9A15B','cap','#2D5FAE',pose='cards',flip=True,card_color=SAF)
end_l_far=person(140,770,.9,SKIN[3],SAF,INK,2,'#8A5A8F','afro','#1C1416',pose='rest')
end_r_far=person(1780,770,.9,SKIN[4],ORANGE,CREAM,1,'#2E6F73','braids','#2A1A12',pose='rest',flip=True,mug=True)
near_l=person(340,850,1.05,SKIN[1],VIOLET,SAFH,2,'#5B7F5E','wrap',SAF,pose='rest',mug=True)
near_r=person(1580,850,1.05,SKIN[2],GREEN,CREAM,0,'#B4552D','bald','#000',pose='rest',flip=True)
boxes=''
for id_,x,yb,h,r in [('codenames',850,738,215,-2),('skull',1000,742,215,2),('bang',1210,736,205,-3),
                     ('6-qui-prend',590,845,245,-4),('for-sale',770,852,245,3),('no-thanks',1060,862,215,-2),('saboteur',1390,846,250,4)]:
    boxes+=img(id_,x,yb-h/2,h,r)
layers=[(bg,True),(back_l+back_r,False),(bar,True),(end_l_far+end_r_far,False),(boxes,False),(near_l+near_r,False)]
open('/tmp/claude-0/vec/jeux-cartes-6-joueurs.svg','w').write(svg3(layers,BG))
