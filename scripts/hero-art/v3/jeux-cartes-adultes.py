import sys,math,random; sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img
BG='#0E4A5A'; WALLD='#0A3A48'; FLOOR='#071F27'; WOOD='#7A4A2B'; WOODL='#9A6238'; NAVY='#0B1D3A'
def star4(x,y,r,fill=CREAM):
    pts=[]
    for i in range(8):
        a=math.pi/4*i-math.pi/2; rr=r if i%2==0 else r*.3
        pts.append(f'{x+rr*math.cos(a):.1f},{y+rr*math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"/>'
def page(deco,imgs=''):
    s=svg('')
    s=s.replace(f'<rect width="1920" height="1080" fill="{CREAM}"/>',f'<rect width="1920" height="1080" fill="{BG}"/>')
    s=s.replace('<g filter="url(#rough)"></g>',f'<g filter="url(#rough)">{deco[0]}</g><g>{imgs}</g><g filter="url(#rough)">{deco[1]}</g>')
    return s
rng=random.Random(8)
back=''
# mur : bande haute zigzag + panneaux
back+=f'<rect x="0" y="0" width="1920" height="26" fill="{WALLD}"/>'
back+=f'<polyline points="{" ".join(f"{i*32},{58+(12 if i%2 else -12)}" for i in range(0,61))}" fill="none" stroke="{SAF}" stroke-width="5" stroke-linejoin="round" opacity=".85"/>'
back+=f'<polyline points="{" ".join(f"{i*32},{82+(8 if i%2 else -8)}" for i in range(0,61))}" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".5"/>'
# lambris bas
back+=f'<rect x="0" y="690" width="1920" height="150" fill="{WALLD}"/><rect x="0" y="684" width="1920" height="10" fill="#14606F"/>'
for i in range(0,1920,160):
    back+=f'<rect x="{i+16}" y="712" width="128" height="104" rx="6" fill="none" stroke="#14606F" stroke-width="4"/>'
# sol
back+=f'<rect x="0" y="838" width="1920" height="242" fill="{FLOOR}"/><rect x="0" y="836" width="1920" height="8" fill="{INK}"/>'
for i in range(-10,40):
    back+=f'<line x1="{i*60+500}" y1="844" x2="{i*160-1100+1000}" y2="1080" stroke="#0C2C37" stroke-width="3"/>'
# fenêtre de nuit
wx,wy,ww,wh=730,100,500,280
back+=f'<rect x="{wx-26}" y="{wy-26}" width="{ww+52}" height="{wh+52}" rx="12" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
back+=f'<rect x="{wx}" y="{wy}" width="{ww}" height="{wh}" fill="{NAVY}"/>'
back+=f'<clipPath id="win"><rect x="{wx}" y="{wy}" width="{ww}" height="{wh}"/></clipPath><g clip-path="url(#win)">'
back+=f'<rect x="{wx}" y="{wy+170}" width="{ww}" height="130" fill="#12294D"/>'
# silhouettes de toits
bx=wx
while bx<wx+ww:
    w=rng.randint(40,90); h=rng.randint(50,130)
    back+=f'<rect x="{bx}" y="{wy+wh-h}" width="{w}" height="{h}" fill="#08142A"/>'
    for k in range(rng.randint(1,3)):
        back+=f'<rect x="{bx+10+k*20}" y="{wy+wh-h+14+rng.randint(0,30)}" width="8" height="10" fill="{SAFH}"/>'
    bx+=w+6
for i in range(26):
    back+=star4(rng.uniform(wx+10,wx+ww-10),rng.uniform(wy+10,wy+130),rng.choice([4,5,7]),CREAM)
back+=f'<circle cx="{wx+390}" cy="{wy+80}" r="40" fill="{SAFH}"/><circle cx="{wx+408}" cy="{wy+70}" r="36" fill="{NAVY}"/>'
back+='</g>'
back+=f'<line x1="{wx+ww/2}" y1="{wy}" x2="{wx+ww/2}" y2="{wy+wh}" stroke="{CREAM}" stroke-width="12"/><line x1="{wx}" y1="{wy+wh/2-20}" x2="{wx+ww}" y2="{wy+wh/2-20}" stroke="{CREAM}" stroke-width="12"/>'
back+=f'<rect x="{wx-40}" y="{wy+wh+26}" width="{ww+80}" height="16" rx="5" fill="{CREAM}" stroke="{INK}" stroke-width="4"/>'
# rideaux
for sg,x0 in ((-1,wx-30),(1,wx+ww+30)):
    p=f'M{x0},{wy-40} L{x0+sg*115},{wy-40} C{x0+sg*140},{wy+150} {x0+sg*90},{wy+260} {x0+sg*125},{wy+440} L{x0},{wy+440} Z'
    back+=f'<path d="{p}" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
    for k in range(1,4):
        back+=f'<path d="M{x0+sg*k*28},{wy-30} C{x0+sg*(k*28+14)},{wy+160} {x0+sg*(k*28-8)},{wy+300} {x0+sg*(k*28+8)},{wy+430}" fill="none" stroke="#8C2F1D" stroke-width="4"/>'
    for yy in (wy+60,wy+170,wy+290):
        back+=f'<polyline points="{" ".join(f"{x0+sg*(10+i*18)},{yy+(10 if i%2 else -10)}" for i in range(6))}" fill="none" stroke="{CREAM}" stroke-width="4"/>'
back+=f'<rect x="{wx-120}" y="{wy-58}" width="{ww+240}" height="16" rx="8" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'
# tableau (motif africain)
fx,fy,fw,fh=130,130,300,230
back+=f'<rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" fill="{SAF}" stroke="{INK}" stroke-width="7"/><rect x="{fx+18}" y="{fy+18}" width="{fw-36}" height="{fh-36}" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
back+=zig(fx+fw/2,fy+fh/2,78,44,10,fill=TERRA,stroke=INK,sw=4)+f'<circle cx="{fx+fw/2}" cy="{fy+fh/2}" r="30" fill="{SAF}" stroke="{INK}" stroke-width="4"/><circle cx="{fx+fw/2}" cy="{fy+fh/2}" r="10" fill="{INK}"/>'
for i in range(5):
    back+=f'<polygon points="{fx+40+i*55},{fy+fh-30} {fx+67+i*55},{fy+fh-62} {fx+94+i*55},{fy+fh-30}" fill="{TERRA}" opacity=".0"/>'
# fauteuil club
ax=0
def chair():
    o=f'<ellipse cx="330" cy="868" rx="330" ry="26" fill="#000" opacity=".35"/>'
    for x in (150,490): o+=f'<rect x="{x}" y="820" width="26" height="54" rx="6" fill="{INK}"/>'
    o+=f'<rect x="130" y="420" width="400" height="400" rx="150" fill="#8E3A24" stroke="{INK}" stroke-width="7"/>'
    # boutons capitonnés
    for r in range(4):
        for c in range(5):
            x=190+c*70+(35 if r%2 else 0); y=500+r*62
            if x>480: continue
            o+=f'<circle cx="{x}" cy="{y}" r="7" fill="{INK}"/>'
            if c<4 and x+70<480: o+=f'<path d="M{x},{y} Q{x+35},{y+14} {x+70},{y}" fill="none" stroke="#6E2A19" stroke-width="3"/>'
    o+=f'<rect x="196" y="690" width="268" height="116" rx="34" fill="#A64A2E" stroke="{INK}" stroke-width="7"/>'
    o+=f'<path d="M222,740 Q330,762 438,740" fill="none" stroke="#7B311F" stroke-width="4"/>'
    for sx,x in ((-1,50),(1,470)):
        o+=f'<rect x="{x}" y="560" width="110" height="290" rx="55" fill="#8E3A24" stroke="{INK}" stroke-width="7"/>'
        o+=f'<rect x="{x+12}" y="574" width="86" height="40" rx="20" fill="#A64A2E" opacity=".8"/>'
    # plaid motif sur l'accoudoir gauche
    o+=f'<path d="M40,640 L170,656 L162,740 L50,720 Z" fill="{SAF}" stroke="{INK}" stroke-width="4"/>'
    o+=f'<polyline points="{" ".join(f"{58+i*20},{672+(8 if i%2 else -8)+i*3}" for i in range(6))}" fill="none" stroke="{INK}" stroke-width="3"/><polyline points="{" ".join(f"{58+i*20},{700+(8 if i%2 else -8)+i*2}" for i in range(6))}" fill="none" stroke="{CREAM}" stroke-width="3"/>'
    return o
back+=f'<g transform="translate(40,0)">{chair()}</g>'
# tapis
back+=f'<path d="M520,905 L1900,905 L1980,1040 L440,1040 Z" fill="{TERRA}" stroke="{INK}" stroke-width="6"/>'
back+=f'<path d="M550,920 L1870,920 L1930,1026 L492,1026 Z" fill="none" stroke="{CREAM}" stroke-width="4" stroke-dasharray="14 10"/>'
back+=f'<polyline points="{" ".join(f"{600+i*44},{972+(14 if i%2 else -14)}" for i in range(0,31))}" fill="none" stroke="{SAF}" stroke-width="6" stroke-linejoin="round"/>'
# table basse
def table():
    o=f'<polygon points="650,735 1680,735 1735,832 596,832" fill="{WOODL}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    o+=f'<rect x="596" y="832" width="1139" height="34" rx="6" fill="{WOOD}" stroke="{INK}" stroke-width="6"/>'
    for x in (640,1660): o+=f'<polygon points="{x},866 {x+36},866 {x+30},950 {x+6},950" fill="{WOOD}" stroke="{INK}" stroke-width="5"/>'
    o+=f'<polyline points="{" ".join(f"{630+i*34},{850+(6 if i%2 else -6)}" for i in range(0,33))}" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".7"/>'
    return o
tab=table()
# lampe de bureau + table d'appoint à droite
lamp=f'<defs><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{SAFH}" stop-opacity=".55"/><stop offset="1" stop-color="{SAFH}" stop-opacity="0"/></radialGradient></defs>'
lamp+=f'<ellipse cx="1790" cy="470" rx="330" ry="300" fill="url(#glow)"/>'
lamp+=f'<ellipse cx="1790" cy="900" rx="95" ry="14" fill="#000" opacity=".35"/>'
lamp+=f'<rect x="1700" y="820" width="180" height="24" rx="8" fill="{WOODL}" stroke="{INK}" stroke-width="5"/><rect x="1780" y="844" width="20" height="60" fill="{WOOD}" stroke="{INK}" stroke-width="4"/>'
lamp+=f'<ellipse cx="1790" cy="908" rx="62" ry="12" fill="{WOOD}" stroke="{INK}" stroke-width="4"/>'
lamp+=f'<ellipse cx="1790" cy="812" rx="44" ry="10" fill="{INK}"/><rect x="1784" y="610" width="12" height="200" fill="{INK}"/>'
lamp+=f'<path d="M1790,612 Q1790,520 1700,500" fill="none" stroke="{INK}" stroke-width="11" stroke-linecap="round"/><circle cx="1790" cy="612" r="11" fill="{SAF}" stroke="{INK}" stroke-width="3"/>'
lamp+=f'<g transform="translate(1690,500) rotate(-25)"><path d="M-62,0 L62,0 L38,-70 L-38,-70Z" fill="{GREEN}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-50,-26 L50,-26" stroke="{SAFH}" stroke-width="5"/><ellipse cx="0" cy="3" rx="52" ry="8" fill="{SAFH}"/></g>'
# livres sur l'appoint
lamp+=f'<rect x="1822" y="800" width="52" height="20" fill="{RED}" stroke="{INK}" stroke-width="3"/><rect x="1828" y="782" width="44" height="18" fill="{BLUE}" stroke="{INK}" stroke-width="3"/>'
# verre de vin + tumbler sur la table (devant)
front=''
def wine(x,y):
    o=f'<ellipse cx="{x}" cy="{y}" rx="30" ry="7" fill="#000" opacity=".3"/>'
    o+=f'<ellipse cx="{x}" cy="{y-2}" rx="26" ry="6" fill="{CREAM}" stroke="{INK}" stroke-width="3"/><rect x="{x-3}" y="{y-80}" width="6" height="78" fill="{CREAM}" stroke="{INK}" stroke-width="2.5"/>'
    o+=f'<path d="M{x-34},{y-196} C{x-40},{y-120} {x-24},{y-86} {x},{y-84} C{x+24},{y-86} {x+40},{y-120} {x+34},{y-196}Z" fill="#E9E3D8" fill-opacity=".35" stroke="{INK}" stroke-width="4"/>'
    o+=f'<path d="M{x-37},{y-140} C{x-34},{y-112} {x-22},{y-92} {x},{y-90} C{x+22},{y-92} {x+34},{y-112} {x+37},{y-140}Z" fill="#7B1530"/>'
    o+=f'<path d="M{x-22},{y-170} C{x-26},{y-130} {x-20},{y-110} {x-10},{y-104}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linecap="round" opacity=".8"/>'
    return o
front+=wine(1672,826)
front+=f'<path d="M1580,800 L1588,832 L1630,832 L1638,800Z" fill="#E9E3D8" fill-opacity=".4" stroke="{INK}" stroke-width="4"/><path d="M1583,812 L1587,830 L1631,830 L1635,812Z" fill="#C07A2B"/>'
from PIL import Image
def place(g,x,base,visH,rot=0):
    im=Image.open(f'/tmp/claude-0/assets_web/{g}.png'); w0,h0=im.size; x0,y0,x1,y1=im.getchannel('A').getbbox()
    k=visH/(y1-y0); return img(g,x,base-(y1-h0/2)*k,h0*k,rot)
bxs=''
for g,x,r in (('the-crew',690,-3),('wizard',950,2),('schotten-totten',1215,-2),('star-realms',1480,3)):
    bxs+=place(g,x,766,300,r)
for g,x,r in (('coup',825,-4),('kyran',1095,2),('skull',1345,3)):
    bxs+=place(g,x,830,250,r)
open('/tmp/claude-0/vec/jeux-cartes-adultes.svg','w').write(page((back+lamp+tab,front),bxs))
