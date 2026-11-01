import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from hvx_a import *
SKY='#86CDF0'
art=bg(SKY)
# --- fond : bandes gravées crème, côtés gauche et droit + soleil de coin évité
def band(x0,w):
    s=f'<rect x="{x0}" y="-10" width="{w}" height="1100" fill="#6DBBE4"/>'
    for y in range(40,1080,90):
        s+=f'<polygon points="{x0+w/2},{y-34} {x0+w-12},{y} {x0+w/2},{y+34} {x0+12},{y}" fill="none" stroke="{CREAM}" stroke-width="4"/>'
        s+=f'<polygon points="{x0+w/2},{y-14} {x0+w/2+12},{y} {x0+w/2},{y+14} {x0+w/2-12},{y}" fill="{CREAM}"/>'
        s+=zigline(x0+14,x0+w-14,y+45,7,6,CREAM,3.5)
    return s
art+=band(30,110)+band(1780,110)
# nuages à motifs
def cloud(x,y,s):
    return f'<g transform="translate({x},{y}) scale({s})" opacity=".9"><ellipse cx="0" cy="0" rx="90" ry="26" fill="{CREAM}"/><circle cx="-30" cy="-22" r="30" fill="{CREAM}"/><circle cx="20" cy="-30" r="38" fill="{CREAM}"/><path d="M-70,6 q35,-14 70,0 t70,0" fill="none" stroke="#9AD6F2" stroke-width="4"/></g>'
art+=cloud(300,170,1.1)+cloud(1560,900,1.2)+cloud(250,920,.8)+cloud(1620,160,.9)
# --- table carrée
tx,ty,T=960,540,700
art+=f'<rect x="{tx-T/2+14}" y="{ty-T/2+18}" width="{T}" height="{T}" rx="26" fill="{INK}" opacity=".22"/>'
art+=f'<rect x="{tx-T/2}" y="{ty-T/2}" width="{T}" height="{T}" rx="26" fill="{INK}"/>'
art+=f'<rect x="{tx-T/2+12}" y="{ty-T/2+12}" width="{T-24}" height="{T-24}" rx="18" fill="{TERRA}"/>'
art+=f'<rect x="{tx-T/2+34}" y="{ty-T/2+34}" width="{T-68}" height="{T-68}" rx="10" fill="{SAF}"/>'
# bordure zig gravée
m=ty-T/2+23
for (x0,x1,y) in [(tx-T/2+60,tx+T/2-60,ty-T/2+23),(tx-T/2+60,tx+T/2-60,ty+T/2-23)]:
    art+=zigline(x0,x1,y,6,32,CREAM,3)
for (y0,y1,x) in [(ty-T/2+60,ty+T/2-60,tx-T/2+23),(ty-T/2+60,ty+T/2-60,tx+T/2-23)]:
    pts=' '.join(f'{x+(6 if i%2 else -6)},{y0+(y1-y0)*i/32:.1f}' for i in range(33))
    art+=f'<polyline points="{pts}" fill="none" stroke="{CREAM}" stroke-width="3" stroke-linejoin="round"/>'
# motif central gravé sur le feutre (losanges entrelacés)
for k in range(5):
    r=285-k*48
    art+=f'<polygon points="{tx},{ty-r} {tx+r},{ty} {tx},{ty+r} {tx-r},{ty}" fill="none" stroke="{TERRA}" stroke-width="2.5" opacity=".38"/>'
for sx,sy in [(-1,-1),(1,-1),(-1,1),(1,1)]:
    art+=f'<circle cx="{tx+sx*270}" cy="{ty+sy*270}" r="14" fill="none" stroke="{TERRA}" stroke-width="3"/><circle cx="{tx+sx*270}" cy="{ty+sy*270}" r="5" fill="{TERRA}"/>'

# --- personnages vus de dessus (local : joueur en (0,0), la table est vers +y)
cid=[0]
def person(x,y,rot,skin,shirt,pat,hair,team,wrap=None):
    cid[0]+=1; i=cid[0]
    s=f'<g transform="translate({x},{y}) rotate({rot})">'
    # ombre
    s+=f'<ellipse cx="8" cy="22" rx="128" ry="58" fill="{INK}" opacity=".18"/>'
    # bras
    for sx in (-1,1):
        s+=f'<path d="M{sx*92},10 C{sx*104},60 {sx*84},104 {sx*58},132" fill="none" stroke="{INK}" stroke-width="50" stroke-linecap="round"/>'
        s+=f'<path d="M{sx*92},10 C{sx*104},60 {sx*84},104 {sx*58},132" fill="none" stroke="{shirt}" stroke-width="40" stroke-linecap="round"/>'
        s+=f'<circle cx="{sx*58}" cy="140" r="21" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    # épaules
    s+=f'<clipPath id="c{i}"><ellipse cx="0" cy="0" rx="124" ry="54"/></clipPath>'
    s+=f'<ellipse cx="0" cy="0" rx="130" ry="60" fill="{INK}"/><ellipse cx="0" cy="0" rx="124" ry="54" fill="{shirt}"/>'
    s+=f'<g clip-path="url(#c{i})">{pat}</g>'
    # cou + tête
    s+=f'<circle cx="0" cy="-16" r="26" fill="{skin}"/>'
    s+=f'<circle cx="0" cy="-48" r="47" fill="{INK}"/>'
    if wrap:  # gèle / foulard
        s+=f'<circle cx="0" cy="-48" r="42" fill="{wrap}"/>'
        s+=f'<path d="M-42,-48 C-30,-20 30,-20 42,-48" fill="none" stroke="{CREAM}" stroke-width="4"/>'
        s+=f'<path d="M-26,-72 C-8,-90 20,-84 34,-62" fill="none" stroke="{CREAM}" stroke-width="4"/>'
        s+=f'<path d="M-34,-40 C-30,-14 -6,-2 14,-8 C-6,-8 -22,-20 -34,-40Z" fill="{wrap}" stroke="{INK}" stroke-width="3"/>'
        s+=f'<circle cx="0" cy="-48" r="9" fill="{CREAM}"/>'
    else:
        s+=f'<circle cx="0" cy="-48" r="42" fill="{hair}"/>'
        s+=f'<path d="M-30,-70 q30,-22 60,0" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".5"/>'
        for a in range(0,360,45):
            s+=f'<circle cx="{math.cos(math.radians(a))*28:.1f}" cy="{-48+math.sin(math.radians(a))*28:.1f}" r="3" fill="{INK}" opacity=".55"/>'
    # oreilles
    for sx in (-1,1): s+=f'<ellipse cx="{sx*45}" cy="-44" rx="7" ry="11" fill="{skin}" stroke="{INK}" stroke-width="3"/>'
    # éventail de cartes tenu à deux mains
    s+=f'<g transform="translate(0,150)">'
    for k in range(5):
        a=(k-2)*11
        s+=f'<g transform="rotate({a}) translate(0,34)">{card_back(64,96,team)}</g>'
    s+='</g>'
    # mains par-dessus
    for sx in (-1,1):
        s+=f'<circle cx="{sx*58}" cy="140" r="21" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    s+='</g>'
    return s
def zpat(col,gap=22): 
    return ''.join(zigline(-130,130,y,7,18,col,3.5) for y in range(-60,70,gap))
def dpat(col):
    s=''
    for x in range(-120,140,34):
        s+=f'<polygon points="{x},-18 {x+14},0 {x},18 {x-14},0" fill="none" stroke="{col}" stroke-width="3.5"/>'
    return s+f'<line x1="-130" y1="-34" x2="130" y2="-34" stroke="{col}" stroke-width="4"/><line x1="-130" y1="34" x2="130" y2="34" stroke="{col}" stroke-width="4"/>'
def cpat(col):
    return ''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="none" stroke="{col}" stroke-width="3"/>' for x in range(-120,140,30) for y in (-30,0,30))
def tpat(col):
    s=''
    for x in range(-130,140,30):
        s+=f'<polygon points="{x},-50 {x+15},-20 {x-15},-20" fill="{col}"/><polygon points="{x},50 {x+15},20 {x-15},20" fill="{col}"/>'
    return s
TA,TB=RED,'#16688F'   # équipe A (haut/bas), équipe B (gauche/droite)
art+=person(960,108,0,'#8D5524',TA,zpat(CREAM),INK,TA,wrap=SAF)
art+=person(960,972,180,'#F0C9A0',TA,dpat(CREAM),'#6B3F1D',TA)
art+=person(410,540,-90,'#C68642',TB,tpat(CREAM),INK,TB)
art+=person(1510,540,90,'#5C3A21',TB,cpat(CREAM),INK,TB,wrap=ORANGE)
# --- liens d'équipe : fanions discrets près de chaque joueur
def pennant(x,y,rot,col):
    return f'<g transform="translate({x},{y}) rotate({rot})"><line x1="0" y1="0" x2="0" y2="-70" stroke="{INK}" stroke-width="5" stroke-linecap="round"/><polygon points="0,-70 46,-52 0,-34" fill="{col}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="14" cy="-52" r="5" fill="{CREAM}"/></g>'
for bx,by,bs in [(430,330,1),(1480,330,1.2),(380,780,.9),(1650,520,.8)]:
    art+=f'<path d="M{bx-30*bs},{by} q{15*bs},{-18*bs} {30*bs},0 q{15*bs},{-18*bs} {30*bs},0" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
layers=[('r',art)]
# --- boîtes au centre, en croix (6) : haut, bas, gauche, droite, deux au centre
ims=''
H=232
ims+=img('skull',960,322,H,rot=-3)
ims+=img('wizard',960,762,H,rot=3)
ims+=img('codenames',722,545,H,rot=-5)
ims+=img('skyjo',862,540,H,rot=4)
ims+=img('the-crew',1006,548,H,rot=-4)
ims+=img('love-letter',1182,540,H,rot=5)
layers.append(('p',ims))
render_layers('jeux-cartes-4-joueurs',layers)
