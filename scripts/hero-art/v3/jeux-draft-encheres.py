import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from h3lib import *
rng=random.Random(12)
BG='#9A6A47'; WL='#B58559'; WD='#6B4429'; WDD='#4B2E1B'; GOLD='#E6B34A'; SKIN1='#8A5B3C'; SKIN2='#D9A47A'; SKIN3='#5C3A27'; JACK='#2E5C94'
a=bgrect(BG)
# mur : losanges tonaux + lambris
for r in range(0,8):
    for c in range(0,14):
        x=c*150+(75 if r%2 else 0); y=r*110+30
        a+=f'<polygon points="{x},{y-30} {x+24},{y} {x},{y+30} {x-24},{y}" fill="{shade(BG,-.1)}"/>'
a+=f'<rect x="-40" y="700" width="2000" height="190" fill="{WD}"/><rect x="-40" y="690" width="2000" height="22" fill="{WL}" stroke="{INK}" stroke-width="4"/>'
for x in range(-20,1960,170):
    a+=f'<rect x="{x}" y="735" width="130" height="120" rx="10" fill="none" stroke="{WL}" stroke-width="5" opacity=".8"/>'
# sol
a+=f'<rect x="-40" y="880" width="2000" height="260" fill="{WDD}"/><rect x="-40" y="878" width="2000" height="10" fill="{INK}"/>'
for k,y in enumerate((930,990,1050)): a+=f'<line x1="-40" y1="{y}" x2="1960" y2="{y}" stroke="{INK}" stroke-width="3" opacity=".5"/>'
for k,y in enumerate((880,930,990,1050)):
    for x in range(-60+(70 if k%2 else 0),2000,260): a+=f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+55}" stroke="{INK}" stroke-width="3" opacity=".45"/>'
# rideaux
for side in (0,1):
    x0=0 if side==0 else 1920; sg=1 if side==0 else -1
    a+=f'<path d="M{x0},-10 L{x0+sg*125},-10 Q{x0+sg*90},300 {x0+sg*140},700 Q{x0+sg*100},850 {x0+sg*120},880 L{x0},880Z" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
    for k in range(1,4): a+=f'<path d="M{x0+sg*k*30},0 Q{x0+sg*(k*30-14)},400 {x0+sg*(k*30+6)},870" fill="none" stroke="{INK}" stroke-width="4" opacity=".4"/>'
    a+=diamonds(x0+sg*10,x0+sg*110,40,3,9,SAFH,.9)
# lampes suspendues
for lx in (255,600):
    a+=f'<line x1="{lx}" y1="-10" x2="{lx}" y2="105" stroke="{INK}" stroke-width="5"/><path d="M{lx-62},170 Q{lx-50},112 {lx},106 Q{lx+50},112 {lx+62},170Z" fill="{SAF}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    a+=f'<path d="M{lx-46},150 L{lx+46},150" stroke="{CREAM}" stroke-width="4"/><ellipse cx="{lx}" cy="172" rx="62" ry="10" fill="{SAFH}" stroke="{INK}" stroke-width="5"/><circle cx="{lx}" cy="176" r="14" fill="{CREAM}"/>'
a+=f'<polygon points="253,185 180,420 330,420" fill="{SAFH}" opacity=".0"/>'
# tableaux
def frame(x,y,w,h,inner,oval=False):
    s=f'<rect x="{x+10}" y="{y+12}" width="{w}" height="{h}" fill="{INK}" opacity=".3"/>'
    s+=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{GOLD}" stroke="{INK}" stroke-width="6"/><rect x="{x+16}" y="{y+16}" width="{w-32}" height="{h-32}" fill="{shade(GOLD,-.25)}" stroke="{INK}" stroke-width="4"/>'
    s+=diamonds(x+10,x+w-10,y+8,int(w/28),4,INK,.55)
    s+=f'<svg x="{x+26}" y="{y+26}" width="{w-52}" height="{h-52}" viewBox="0 0 {w-52} {h-52}">{inner(w-52,h-52)}</svg>'
    return s
def artA(w,h):
    s=f'<rect width="{w}" height="{h}" fill="{BLUE}"/><circle cx="{w*.68}" cy="{h*.32}" r="{w*.2}" fill="{ORANGE}" stroke="{INK}" stroke-width="4"/>'
    for r in (.27,.34): s+=f'<circle cx="{w*.68}" cy="{h*.32}" r="{w*r}" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".7"/>'
    s+=f'<path d="M0,{h*.7} L{w*.25},{h*.45} L{w*.5},{h*.7} L{w*.75},{h*.5} L{w},{h*.7} L{w},{h} L0,{h}Z" fill="{GREEN}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    s+=tri_band(0,w,h*.88,10,h*.08,CREAM,4)
    return s
def artB(w,h):
    s=f'<rect width="{w}" height="{h}" fill="{VIOLET}"/>'
    for r in range(20,int(h/2),22): s+=zig(w/2,h/2,r*1.3,r*1.0,10,'none',[CREAM,SAFH,ORANGE][r//22%3],4)
    s+=f'<circle cx="{w/2}" cy="{h/2}" r="14" fill="{RED}" stroke="{INK}" stroke-width="3"/>'
    return s
def artC(w,h):
    s=f'<rect width="{w}" height="{h}" fill="{SAFH}"/><path d="M{w/2},{h*.15} C{w*.95},{h*.1} {w*.95},{h*.55} {w/2},{h*.62} C{w*.05},{h*.55} {w*.05},{h*.1} {w/2},{h*.15}Z" fill="{GREEN}" stroke="{INK}" stroke-width="4"/>'
    s+=f'<rect x="{w/2-12}" y="{h*.58}" width="24" height="{h*.42}" fill="{TERRA}" stroke="{INK}" stroke-width="4"/>'
    return s
a+=frame(120,215,250,290,artA)+frame(440,230,320,210,artB)+frame(790,390,150,190,artC)
# faisceau de lumière sur le chevalet
a+=f'<polygon points="1230,-10 1330,-10 1840,900 1000,900" fill="{SAFH}" opacity=".13"/>'
# --- chevalet
bx0,bx1=1000,1810
a+=f'<rect x="1380" y="925" width="50" height="125" fill="{WD}" stroke="{INK}" stroke-width="5"/>'
a+=f'<rect x="1065" y="880" width="46" height="170" fill="{WD}" stroke="{INK}" stroke-width="5"/><rect x="1700" y="880" width="46" height="170" fill="{WD}" stroke="{INK}" stroke-width="5"/>'
a+=f'<path d="M1405,900 L1330,1050 L1480,1050Z" fill="{WD}" stroke="{INK}" stroke-width="5" stroke-linejoin="round" opacity="0"/>'
a+=f'<rect x="{bx0+14}" y="150" width="{bx1-bx0}" height="790" fill="{INK}" opacity=".28"/>'
a+=f'<rect x="{bx0}" y="135" width="{bx1-bx0}" height="790" rx="10" fill="{WL}" stroke="{INK}" stroke-width="7"/>'
a+=f'<rect x="{bx0+24}" y="159" width="{bx1-bx0-48}" height="742" rx="6" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'
a+=diamonds(bx0+40,bx1-40,148,24,6,INK,.5)
a+=tri_band(bx0+40,bx1-40,205,26,26,TERRA,5,.55)
a+=tri_band(bx0+40,bx1-40,880,26,22,TERRA,5,.55)
# tablettes
for y in (570,888):
    a+=f'<rect x="{bx0+14}" y="{y}" width="{bx1-bx0-28}" height="26" rx="4" fill="{WD}" stroke="{INK}" stroke-width="5"/><rect x="{bx0+14}" y="{y}" width="{bx1-bx0-28}" height="8" fill="{WL}"/>'
a+=f'<polygon points="{(bx0+bx1)/2-60},135 {(bx0+bx1)/2+60},135 {(bx0+bx1)/2},82" fill="{WL}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/><circle cx="{(bx0+bx1)/2}" cy="118" r="10" fill="{GOLD}" stroke="{INK}" stroke-width="4"/>'
# --- pupitre + commissaire-priseur
def head(x,y,r,skin,hair):
    s=f'<rect x="{x-16}" y="{y+r*.7}" width="32" height="{r*.7}" fill="{skin}" stroke="{INK}" stroke-width="5"/>'
    s+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="{skin}" stroke="{INK}" stroke-width="6"/>'
    s+=f'<circle cx="{x-r}" cy="{y+4}" r="{r*.2}" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    for k in range(9):
        t=math.pi*(1+k/8)
        s+=f'<circle cx="{x+(r*.92)*math.cos(t):.1f}" cy="{y+4+(r*.9)*math.sin(t):.1f}" r="{r*.26:.1f}" fill="{hair}" stroke="{INK}" stroke-width="3.5"/>'
    s+=f'<path d="M{x+r*.15},{y+r*.1} q{r*.18},{-r*.08} {r*.35},0" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
    return s
ax,ay=470,420
a+=f'<ellipse cx="460" cy="975" rx="300" ry="30" fill="{INK}" opacity=".3"/>'
# bras gauche (sur le pupitre)
a+=f'<path d="M385,545 Q340,590 380,640" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/><path d="M385,545 Q340,590 380,640" fill="none" stroke="{JACK}" stroke-width="52" stroke-linecap="round"/>'
# torse
a+=f'<path d="M345,670 L360,545 Q470,480 580,545 L595,670Z" fill="{JACK}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
a+=f'<polygon points="440,520 500,520 470,640" fill="{CREAM}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/><path d="M440,520 L470,600 L420,560Z M500,520 L470,600 L520,560Z" fill="{shade(JACK,-.2)}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
a+=f'<polygon points="470,540 440,526 440,556" fill="{RED}" stroke="{INK}" stroke-width="4"/><polygon points="470,540 500,526 500,556" fill="{RED}" stroke="{INK}" stroke-width="4"/><circle cx="470" cy="541" r="8" fill="{RED}" stroke="{INK}" stroke-width="4"/>'
a+=diamonds(365,420,615,2,8,CREAM,.9)+diamonds(520,575,615,2,8,CREAM,.9)
a+=head(ax,ay,60,SKIN1,'#1E1618')
# bras droit levé + maillet
a+=f'<path d="M570,555 Q650,540 668,450" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/><path d="M570,555 Q650,540 668,450" fill="none" stroke="{JACK}" stroke-width="52" stroke-linecap="round"/>'
a+=f'<g transform="translate(672,398) rotate(28)"><rect x="-8" y="-150" width="16" height="150" rx="6" fill="{WL}" stroke="{INK}" stroke-width="5"/><rect x="-52" y="-190" width="104" height="52" rx="14" fill="{WD}" stroke="{INK}" stroke-width="6"/><rect x="-38" y="-190" width="14" height="52" fill="{GOLD}"/><rect x="24" y="-190" width="14" height="52" fill="{GOLD}"/></g>'
a+=f'<circle cx="672" cy="404" r="27" fill="{SKIN1}" stroke="{INK}" stroke-width="5"/>'
a+=''.join(f'<path d="M{x1},{y1} L{x2},{y2}" stroke="{CREAM}" stroke-width="6" stroke-linecap="round"/>' for x1,y1,x2,y2 in ((830,250,870,232),(840,300,890,300),(820,205,850,170)))
# pupitre
a+=f'<polygon points="215,660 710,660 680,705 245,705" fill="{WL}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
a+=f'<rect x="262" y="705" width="396" height="270" fill="{WD}" stroke="{INK}" stroke-width="6"/><rect x="288" y="732" width="344" height="216" rx="8" fill="{shade(WD,.1)}" stroke="{INK}" stroke-width="5"/>'
a+=tri_band(305,615,805,12,28,CREAM,5,.85)+diamonds(305,615,850,12,9,GOLD,.95)+tri_band(305,615,915,12,28,CREAM,5,.85)
a+=f'<ellipse cx="610" cy="652" rx="46" ry="12" fill="{WDD}" stroke="{INK}" stroke-width="4"/><rect x="568" y="640" width="84" height="14" fill="{WD}" stroke="{INK}" stroke-width="4"/>'
# --- chevalet : boîtes
VH={'sushi-go':310,'for-sale':320,'no-thanks':310,'skull':310,'oh-hell':305,'star-realms':300}
def row(ids,x0,x1,base,rots):
    ws=[vw(i,VH[i]) for i in ids]; gap=(x1-x0-sum(ws))/(len(ids)-1); x=x0; o=[]
    for i,w,r in zip(ids,ws,rots):
        o.append(vimg(i,x+w/2,base-VH[i]/2,VH[i],rot=r)); x+=w+gap
    return o
b=''.join(row(['sushi-go','for-sale','no-thanks'],1075,1735,572,[-3,2,-2])+row(['skull','oh-hell','star-realms'],1065,1745,890,[2,-3,3]))
# --- enchérisseurs au premier plan
def bidder(x,y,skin,cloth,hair,paddle_dx,paddle_y,pc):
    s=f'<path d="M{x-85},1100 Q{x-90},{y+60} {x-40},{y+34} L{x+40},{y+34} Q{x+90},{y+60} {x+85},1100Z" fill="{cloth}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    s+=diamonds(x-60,x+60,y+80,4,7,CREAM,.9)+tri_band(x-70,x+70,y+130,5,16,CREAM,4,.9)
    s+=f'<rect x="{x-17}" y="{y+8}" width="34" height="34" fill="{skin}" stroke="{INK}" stroke-width="5"/>'
    s+=f'<circle cx="{x}" cy="{y-26}" r="52" fill="{hair}" stroke="{INK}" stroke-width="6"/>'
    s+=f'<path d="M{x-14},{y-70} q14,12 28,0" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".35"/>'
    px=x+paddle_dx
    s+=f'<path d="M{x+(50 if paddle_dx>0 else -50)},{y+60} Q{x+paddle_dx*1.2},{y+10} {px},{paddle_y+60}" fill="none" stroke="{INK}" stroke-width="46" stroke-linecap="round"/><path d="M{x+(50 if paddle_dx>0 else -50)},{y+60} Q{x+paddle_dx*1.2},{y+10} {px},{paddle_y+60}" fill="none" stroke="{cloth}" stroke-width="35" stroke-linecap="round"/>'
    s+=f'<rect x="{px-6}" y="{paddle_y}" width="12" height="100" fill="{WL}" stroke="{INK}" stroke-width="4"/>'
    s+=f'<circle cx="{px}" cy="{paddle_y-10}" r="62" fill="{CREAM}" stroke="{INK}" stroke-width="6"/><circle cx="{px}" cy="{paddle_y-10}" r="48" fill="{pc}" stroke="{INK}" stroke-width="4"/>'
    s+=zig(px,paddle_y-10,36,20,8,'none',CREAM,4)+f'<circle cx="{px}" cy="{paddle_y-10}" r="8" fill="{CREAM}"/>'
    s+=f'<circle cx="{px}" cy="{paddle_y+62}" r="19" fill="{skin}" stroke="{INK}" stroke-width="5"/>'
    return s
c=bidder(150,965,SKIN2,GREEN,'#2B1D14',60,700,RED)+bidder(800,985,SKIN3,VIOLET,'#171114',-70,740,BLUE)
open('/tmp/claude-0/vec/jeux-draft-encheres.svg','w').write(doc([(True,a),(False,b),(True,c)],BG))
