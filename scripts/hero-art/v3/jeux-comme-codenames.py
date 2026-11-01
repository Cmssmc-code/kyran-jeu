import sys,math,random
sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img,size
RB='#D9323C'; BB='#2E7FD6'; RC='#8E1B26'; BC='#14407A'
def page(bg,art,fg,w=1920,h=1080):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><filter id="rough" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .13  0 0 0 .07 0"/></filter></defs>
<rect width="{w}" height="{h}" fill="{BB}"/>
<g filter="url(#rough)">{bg}{art}</g>{fg}
<rect width="{w}" height="{h}" filter="url(#grain)"/></svg>'''
bg=f'<polygon points="0,0 1260,0 860,1080 0,1080" fill="{RB}"/>'
# motifs : losanges sur le rouge, points sur le bleu
for r in range(9):
    for c in range(12):
        x=40+c*110+(55 if r%2 else 0); y=40+r*125
        if x+y*0.37<1150-y*0.0 and x<1200-y*0.37-30:
            bg+=f'<polygon points="{x},{y-16} {x+11},{y} {x},{y+16} {x-11},{y}" fill="{CREAM}" opacity=".16"/>'
        elif x>1290-y*0.37+30:
            bg+=f'<circle cx="{x}" cy="{y}" r="6" fill="{CREAM}" opacity=".22"/>'
# frontière en zigzag crème
pts=[]
for i in range(0,28):
    y=i*40; x=1260-y*400/1080+(10 if i%2 else -10)
    pts.append(f'{x:.0f},{y}')
bg+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="{CREAM}" stroke-width="7" stroke-linejoin="round" opacity=".9"/>'
# --- grille 5x5 : 9 rouges, 8 bleues, 7 neutres, 1 noire
rng=random.Random(11)
layout=['R']*9+['B']*8+['N']*7+['K']
rng.shuffle(layout)
T=108; G=14; gx0=330; gy0=108
gw=5*T+4*G
a=f'<rect x="{gx0-24+10}" y="{gy0-24+12}" width="{gw+48}" height="{gw+48}" rx="26" fill="{INK}" opacity=".3"/>'
a+=f'<rect x="{gx0-24}" y="{gy0-24}" width="{gw+48}" height="{gw+48}" rx="26" fill="{INK}"/>'
a+=f'<rect x="{gx0-14}" y="{gy0-14}" width="{gw+28}" height="{gw+28}" rx="18" fill="none" stroke="{SAF}" stroke-width="4"/>'
fills={'R':(RB,'#F3A9A9'),'B':(BB,'#A8D2F3'),'N':('#E8D8B0','#B89E68'),'K':('#2B2629',CREAM)}
for i,k in enumerate(layout):
    r,c=divmod(i,5); x=gx0+c*(T+G); y=gy0+r*(T+G)
    f,ac=fills[k]
    a+=f'<rect x="{x+4}" y="{y+5}" width="{T}" height="{T}" rx="10" fill="#000" opacity=".25"/>'
    a+=f'<rect x="{x}" y="{y}" width="{T}" height="{T}" rx="10" fill="{f}" stroke="{CREAM}" stroke-width="4"/>'
    a+=f'<rect x="{x+10}" y="{y+10}" width="{T-20}" height="{T-20}" rx="6" fill="none" stroke="{ac}" stroke-width="2.5" opacity=".9"/>'
    # barre vierge (emplacement du mot) + motif
    a+=f'<rect x="{x+22}" y="{y+T-44}" width="{T-44}" height="14" rx="7" fill="{ac}" opacity=".85"/>'
    if k=='K':
        a+=f'<polygon points="{x+T/2},{y+22} {x+T/2+20},{y+44} {x+T/2},{y+66} {x+T/2-20},{y+44}" fill="none" stroke="{CREAM}" stroke-width="4"/>'
        a+=f'<line x1="{x+T/2-12}" y1="{y+32}" x2="{x+T/2+12}" y2="{y+56}" stroke="{CREAM}" stroke-width="4"/><line x1="{x+T/2+12}" y1="{y+32}" x2="{x+T/2-12}" y2="{y+56}" stroke="{CREAM}" stroke-width="4"/>'
    else:
        pts=' '.join(f'{x+24+j*(T-48)/4:.1f},{y+34+(8 if j%2 else -8)}' for j in range(5))
        a+=f'<polyline points="{pts}" fill="none" stroke="{ac}" stroke-width="4" stroke-linejoin="round" opacity=".95"/>'
# --- espions
def spy(x,y,s,coat,hat,skin,flip=1,pose=0):
    o=f'<g transform="translate({x},{y}) scale({s*flip},{s})">'
    o+=f'<ellipse cx="6" cy="6" rx="86" ry="14" fill="#000" opacity=".25"/>'
    for sx in (-1,1):
        o+=f'<rect x="{sx*26-15}" y="-110" width="30" height="104" rx="8" fill="{INK}"/><path d="M{sx*26-22},-4 q22,-16 44,0 l0,10 l-44,0Z" fill="{INK}"/>'
    # bras gauche (au repos ou tenant carte)
    o+=f'<path d="M-52,-282 C-88,-250 -96,-210 -88,-168" fill="none" stroke="{INK}" stroke-width="40" stroke-linecap="round"/>'
    o+=f'<path d="M-52,-282 C-88,-250 -96,-210 -88,-168" fill="none" stroke="{coat}" stroke-width="30" stroke-linecap="round"/>'
    o+=f'<circle cx="-88" cy="-156" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    if pose==1:
        o+=f'<g transform="translate(-100,-190) rotate(-18)"><rect x="-22" y="-32" width="44" height="62" rx="5" fill="{CREAM}" stroke="{INK}" stroke-width="4"/><polyline points="-12,-8 -6,-18 0,-8 6,-18 12,-8" fill="none" stroke="{coat}" stroke-width="4"/><rect x="-12" y="8" width="24" height="9" rx="4" fill="{coat}"/></g>'
        o+=f'<circle cx="-88" cy="-156" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    # manteau
    body='M-58,-292 C-30,-308 30,-308 58,-292 C76,-230 86,-160 90,-92 L-90,-92 C-86,-160 -76,-230 -58,-292Z'
    o+=f'<path d="{body}" fill="{coat}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    o+=f'<line x1="0" y1="-296" x2="0" y2="-92" stroke="{INK}" stroke-width="5"/>'
    o+=''.join(f'<circle cx="{sx*14}" cy="{y0}" r="5" fill="{CREAM}"/>' for sx in (-1,1) for y0 in (-230,-190,-150))
    o+=f'<rect x="-84" y="-212" width="168" height="18" fill="{INK}"/><rect x="-14" y="-216" width="28" height="26" rx="4" fill="{SAF}" stroke="{INK}" stroke-width="3"/>'
    pts=' '.join(f'{-90+i*15},{-100+(10 if i%2 else 0)}' for i in range(13))
    o+=f'<polyline points="{pts}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    # tête
    o+=f'<rect x="-14" y="-330" width="28" height="30" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    o+=f'<circle cx="0" cy="-352" r="38" fill="{skin}" stroke="{INK}" stroke-width="5"/>'
    o+=f'<rect x="-32" y="-362" width="64" height="15" rx="7" fill="{INK}"/>'
    o+=f'<line x1="-24" y1="-358" x2="-12" y2="-358" stroke="#fff" stroke-width="3" opacity=".6"/><line x1="6" y1="-358" x2="18" y2="-358" stroke="#fff" stroke-width="3" opacity=".6"/>'
    # col relevé
    for sx in (-1,1):
        o+=f'<path d="M{sx*14},-300 L{sx*52},-292 L{sx*46},-330 Z" fill="{coat}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    # chapeau
    o+=f'<ellipse cx="0" cy="-376" rx="70" ry="13" fill="{hat}" stroke="{INK}" stroke-width="5"/>'
    o+=f'<path d="M-40,-380 C-42,-420 -30,-436 0,-436 C30,-436 42,-420 40,-380Z" fill="{hat}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    o+=f'<path d="M-40,-388 L40,-388 L40,-398 L-40,-398Z" fill="{CREAM}"/>'
    o+=''.join(f'<circle cx="{-30+i*15}" cy="-393" r="2.6" fill="{INK}"/>' for i in range(5))
    # bras droit : loupe
    if pose==0:
        o+=f'<path d="M52,-282 C92,-270 112,-250 118,-222" fill="none" stroke="{INK}" stroke-width="40" stroke-linecap="round"/>'
        o+=f'<path d="M52,-282 C92,-270 112,-250 118,-222" fill="none" stroke="{coat}" stroke-width="30" stroke-linecap="round"/>'
        o+=f'<line x1="120" y1="-224" x2="150" y2="-290" stroke="{INK}" stroke-width="12" stroke-linecap="round"/>'
        o+=f'<circle cx="164" cy="-322" r="34" fill="{CREAM}" fill-opacity=".55" stroke="{INK}" stroke-width="9"/>'
        o+=f'<path d="M145,-332 A22,22 0 0 1 163,-346" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
        o+=f'<circle cx="120" cy="-218" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    else:
        o+=f'<path d="M52,-282 C88,-250 96,-210 88,-168" fill="none" stroke="{INK}" stroke-width="40" stroke-linecap="round"/>'
        o+=f'<path d="M52,-282 C88,-250 96,-210 88,-168" fill="none" stroke="{coat}" stroke-width="30" stroke-linecap="round"/>'
        o+=f'<circle cx="88" cy="-156" r="16" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    return o+'</g>'
SK=['#F0C9A0','#8D5A3B','#C98F5E','#5A3825']
a+=spy(130,806,0.96,RC,INK,SK[1],1,1)
a+=spy(250,792,0.86,RC,'#5A0F18',SK[0],1,0)
a+=spy(1125,792,0.86,BC,'#0B2547',SK[2],-1,0)
a+=spy(1250,806,0.96,BC,INK,SK[3],-1,1)
# sol crème
fl=f'<rect x="0" y="812" width="1920" height="268" fill="{CREAM}"/><rect x="0" y="812" width="1920" height="12" fill="{INK}"/>'
pts=' '.join(f'{i*30},{846+(9 if i%2 else -9)}' for i in range(66))
fl+=f'<polyline points="{pts}" fill="none" stroke="{TERRA}" stroke-width="5" stroke-linejoin="round"/>'
fl+=''.join(f'<polygon points="{x},{1058} {x+10},{1068} {x},{1078} {x-10},{1068}" fill="{TERRA}" opacity=".7"/>' for x in range(30,1920,60))
# boîtes
fg=''
fg+=img('codenames',1630,420,590,rot=4)
ids=['just-one','dixit','letter-jam','the-mind','coup','saboteur','skull','kyran']
H=212
ws=[H*size(i)[0]/size(i)[1] for i in ids]
gap=(1920-130-sum(ws))/(len(ids)-1); x=65
rots=[-2,1.5,-1,2,-1.5,1,-2,1.5]
for i,idd in enumerate(ids):
    fg+=img(idd,x+ws[i]/2,1052-H/2-6,H,rot=rots[i]); x+=ws[i]+gap
open('/tmp/claude-0/vec/jeux-comme-codenames.svg','w').write(page(bg,a+fl,fg))
