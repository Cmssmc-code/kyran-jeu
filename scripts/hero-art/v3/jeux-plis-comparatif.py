import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from hvx_a import *
FELT='#1B7A4A'
art=bg(FELT)
# feutre : treillis de losanges gravés (très discret) + liseré cousu
for i in range(-4,26):
    x=i*120
    art+=f'<line x1="{x}" y1="0" x2="{x+700}" y2="840" stroke="{CREAM}" stroke-width="2.5" opacity=".13"/><line x1="{x+700}" y1="0" x2="{x}" y2="840" stroke="{CREAM}" stroke-width="2.5" opacity=".13"/>'
art+=f'<rect x="-10" y="-10" width="1940" height="52" fill="{INK}"/><rect x="-10" y="34" width="1940" height="14" fill="{TERRA}"/>'
art+=zigline(0,1920,20,8,80,CREAM,3.5)
# étoile de feutre sous le pli : grand motif en étoile à 10 pointes, gravé
cx,cy=900,400
art+=zig(cx,cy,350,255,10,fill='#17683F',stroke=CREAM,sw=3).replace('stroke-linejoin','opacity=".9" stroke-linejoin')
for k in range(10):
    a=2*math.pi*k/10+math.pi/10
    art+=f'<circle cx="{cx+390*math.cos(a):.0f}" cy="{cy+390*math.sin(a):.0f}" r="7" fill="{SAF}"/>'
# étagère en bois en bas
art+=f'<rect x="-10" y="812" width="1940" height="280" fill="{INK}"/><rect x="-10" y="826" width="1940" height="260" fill="{TERRA}"/><rect x="-10" y="826" width="1940" height="16" fill="{SAFH}" opacity=".6"/>'
for y in (900,1000):
    art+=zigline(0,1920,y,10,96,CREAM,3.5)
for x in range(20,1920,80):
    art+=f'<polygon points="{x},{948} {x+14},{958} {x},{968} {x-14},{958}" fill="{SAF}"/>'
art+=f'<rect x="-10" y="1060" width="1940" height="30" fill="{INK}"/>'
# --- le pli : 5 cartes en étoile
syms=[spade(0,-6,.95),heart(0,0,.98,RED),diamond(0,0,.95,BLUE),club(0,-6,.9,GREEN),
      zig(0,0,44,26,8,fill=ORANGE,stroke=INK,sw=3)+f'<circle r="9" fill="{INK}"/>']
cols=[INK,RED,BLUE,GREEN,VIOLET]
W,H=176,264
for k in range(5):
    ang=-90+72*k
    x=cx+196*math.cos(math.radians(ang)); y=cy+196*math.sin(math.radians(ang))
    rot=ang+90+(5 if k%2 else -4)
    art+=f'<g transform="translate({x+10:.0f},{y+14:.0f}) rotate({rot})" opacity=".28"><rect x="{-W/2}" y="{-H/2}" width="{W}" height="{H}" rx="12" fill="{INK}"/></g>'
    art+=f'<g transform="translate({x:.0f},{y:.0f}) rotate({rot})">{face(W,H,cols[k],"<g transform=%sscale(1.12)%s>"%(chr(34),chr(34))+syms[k]+"</g>")}</g>'
# --- main qui ramasse le pli (arrive de la droite)
SK='#8D5524';SKD='#5C3A21'
def finger(pts,w=34):
    d='M'+' L'.join(f'{x},{y}' for x,y in pts)
    s=f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w+9}" stroke-linecap="round" stroke-linejoin="round"/>'
    return s
def finger_fill(pts,w=34):
    d='M'+' L'.join(f'{x},{y}' for x,y in pts)
    return f'<path d="{d}" fill="none" stroke="{SK}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
hand=''
# ombre
hand+=f'<ellipse cx="1370" cy="520" rx="200" ry="70" fill="{INK}" opacity=".2"/>'
fingers=[[(1400,372),(1290,350),(1226,370)],[(1410,404),(1280,392),(1204,418)],[(1410,438),(1286,438),(1212,462)],[(1400,470),(1300,478),(1244,500)]]
thumb=[(1420,500),(1350,552),(1290,556)]
arm=[(1740,448),(1520,430)]
hand+=finger(arm,110)
for f in fingers: hand+=finger(f)
hand+=finger(thumb,36)
hand+=f'<ellipse cx="1440" cy="432" rx="92" ry="82" fill="{INK}"/>'
hand+=finger_fill(arm,100)
hand+=f'<ellipse cx="1440" cy="432" rx="84" ry="74" fill="{SK}"/>'
for f in fingers: hand+=finger_fill(f)
hand+=finger_fill(thumb,36)
# ongles
for f in fingers:
    x,y=f[-1]
    hand+=f'<ellipse cx="{x+8}" cy="{y-2}" rx="11" ry="9" fill="#F4D7B8" opacity=".85"/>'
# phalanges
for f in fingers:
    x,y=f[1]
    hand+=f'<path d="M{x-4},{y-14} q-6,14 0,28" fill="none" stroke="{SKD}" stroke-width="3" stroke-linecap="round"/>'
# manchette à motifs (sleeve) 
hand+=f'<clipPath id="sl"><rect x="1640" y="360" width="300" height="190"/></clipPath>'
hand+=f'<g transform="rotate(-6 1700 450)"><rect x="1600" y="352" width="440" height="200" rx="10" fill="{INK}"/><rect x="1610" y="362" width="430" height="180" rx="6" fill="{SAF}"/>'
hand+=''.join(zigline(1610,2040,y,10,21,TERRA,5) for y in (392,432,472,512))
hand+=f'<rect x="1596" y="346" width="26" height="212" rx="8" fill="{RED}" stroke="{INK}" stroke-width="5"/></g>'
art+=f'<g transform="translate(-140,-70) rotate(0) translate(1440,432) scale(1.18) translate(-1440,-432)">{hand}</g>'
# deux piles de plis gagnés (dos de cartes) à gauche
for (px,py,rot) in [(250,300,-6),(430,520,5)]:
    for k in range(7):
        art+=f'<g transform="translate({px+k*-1.5},{py-k*5}) rotate({rot})">{card_back(150,225,[TERRA,VIOLET][(px>300)])}</g>'
layers=[('r',art)]
ims=''
H2=280
ims+=img('oh-hell',330,935,H2,rot=-3)
ims+=img('the-crew',650,935,H2,rot=2)
ims+=img('wizard',990,935,H2,rot=-2)
ims+=img('6-qui-prend',1330,935,H2,rot=3)
ims+=img('parade',1620,935,H2,rot=-3)
layers.append(('p',ims))
render_layers('jeux-plis-comparatif',layers)
