import sys,math,random; sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img
from PIL import Image
BG='#9ED2EA'; FAR='#86BADA'; MID='#5E9CC4'; ROCK='#3F6F94'; ROCKD='#2E5877'; SNOW='#F6FBFE'; SNOWS='#CFE5F1'
def page(deco,imgs=''):
    s=svg('')
    s=s.replace(f'<rect width="1920" height="1080" fill="{CREAM}"/>',f'<rect width="1920" height="1080" fill="{BG}"/>')
    s=s.replace('<g filter="url(#rough)"></g>',f'<g filter="url(#rough)">{deco[0]}</g><g>{imgs}</g><g filter="url(#rough)">{deco[1]}</g>')
    return s
def ramp(x): return 990-0.27*(x-100)+7*math.sin(x/110)
def place(g,x,base,visH,rot=0):
    im=Image.open(f'/tmp/claude-0/assets_web/{g}.png'); w0,h0=im.size; x0,y0,x1,y1=im.getchannel('A').getbbox()
    k=visH/(y1-y0); cy=base-(y1-h0/2)*k
    back=''
    if g=='letter-jam':  # la boîte est blanche : fond blanc exact sous le détourage
        back=f'<g transform="translate({x},{cy}) rotate({rot})"><rect x="{(x0-w0/2)*k:.1f}" y="{(y0-h0/2)*k:.1f}" width="{(x1-x0)*k:.1f}" height="{(y1-y0)*k:.1f}" fill="#FFFFFF"/></g>'
    return back+img(g,x,cy,h0*k,rot)
def mountain(cx,peak,base,hw,color,capcol=SNOW,capfrac=.36,stripe=None):
    pts=[(cx-hw,base),(cx-hw*.32,peak+70),(cx-hw*.12,peak+25),(cx,peak),(cx+hw*.2,peak+55),(cx+hw*.28,peak+40),(cx+hw,base)]
    o=f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x,y in pts)}" fill="{color}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    cy=peak+(base-peak)*capfrac
    def edge(p0,p1,y):
        t=(y-p0[1])/(p1[1]-p0[1]); return p0[0]+t*(p1[0]-p0[0])
    xl=edge(pts[1],pts[0],cy); xr=edge(pts[5],pts[6],cy)
    zz=[]
    n=9
    for i in range(n+1):
        x=xr+(xl-xr)*i/n; y=cy+(26 if i%2 else -10)
        zz.append((x,y))
    cap=pts[1:6]+[(xr,cy)]+zz[1:-1]+[(xl,cy)]
    o+=f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x,y in cap)}" fill="{capcol}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    o+=f'<polygon points="{cx:.0f},{peak} {cx+hw*.2:.0f},{peak+55} {xr:.0f},{cy:.0f} {cx+8:.0f},{cy-30:.0f}" fill="{SNOWS}" opacity=".9"/>'
    if stripe:
        for k in range(3):
            y=cy+60+k*46
            if y>base-20: break
            o+=f'<polyline points="{" ".join(f"{cx-hw*.45+i*34},{y+(9 if i%2 else -9)}" for i in range(int(hw*.9/34)))}" fill="none" stroke="{stripe}" stroke-width="4" opacity=".7"/>'
    return o
def cloud(x,y,s,op=1):
    o=f'<g transform="translate({x},{y}) scale({s})" opacity="{op}">'
    o+=f'<path d="M-120,30 C-170,30 -170,-30 -115,-30 C-110,-80 -30,-90 -10,-50 C20,-95 100,-70 95,-20 C150,-25 170,30 120,30 Z" fill="{SNOW}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    o+=f'<path d="M-90,8 h60 M10,8 h70" stroke="{SNOWS}" stroke-width="6" stroke-linecap="round"/></g>'
    return o
b=''
b+=zig(250,230,210,128,16,fill=SAFH,stroke=INK,sw=5)+f'<circle cx="250" cy="230" r="86" fill="{SAF}" stroke="{INK}" stroke-width="5"/>'
b+=f'<circle cx="250" cy="230" r="44" fill="none" stroke="{CREAM}" stroke-width="5"/>'
b+=mountain(560,300,780,520,FAR,stripe=MID)+mountain(1250,200,800,640,FAR,stripe=MID)+mountain(1780,330,800,420,FAR,stripe=MID)
b+=mountain(120,420,860,430,MID,stripe=ROCK)+mountain(900,420,880,520,MID,stripe=ROCK)
b+=cloud(900,170,1.1)+cloud(1580,110,.8)+cloud(560,420,.7,.95)+cloud(1280,330,.6,.9)
XS=[300,680,1050,1420,1770]
BOXH=275
for x in XS:
    base=ramp(x)-175
    hw=140
    b+=f'<polygon points="{x-hw},{base+14} {x+hw},{base+14} {x+hw+40},{ramp(x+hw+40)+30} {x-hw-40},{ramp(x-hw-40)+30}" fill="{ROCK}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    b+=f'<polygon points="{x+30},{base+14} {x+hw},{base+14} {x+hw+40},{ramp(x+hw+40)+30} {x+60},{ramp(x+60)+30}" fill="{ROCKD}" opacity=".8"/>'
    b+=f'<polyline points="{" ".join(f"{x-hw+8+i*28},{base+40+(8 if i%2 else -8)}" for i in range(10))}" fill="none" stroke="{CREAM}" stroke-width="3.5" opacity=".6"/>'
    b+=f'<path d="M{x-hw-14},{base+16} L{x-hw+6},{base-6} L{x+hw-6},{base-6} L{x+hw+14},{base+16} Z" fill="{SNOW}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
pts=[(x,ramp(x)) for x in range(-20,1961,20)]
b+=f'<polygon points="{" ".join(f"{x},{y:.0f}" for x,y in pts)} 1960,1100 -20,1100" fill="{SNOW}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
pts2=[(x,ramp(x)+120+14*math.sin(x/70)) for x in range(-20,1961,20)]
b+=f'<polygon points="{" ".join(f"{x},{y:.0f}" for x,y in pts2)} 1960,1100 -20,1100" fill="{SNOWS}"/>'
for off in (190,262):
    b+=f'<polyline points="{" ".join(f"{x},{ramp(x)+off+(9 if (x//36)%2 else -9):.0f}" for x in range(-20,1961,36))}" fill="none" stroke="{MID}" stroke-width="5" stroke-linejoin="round" opacity=".75"/>'
b+=f'<polyline points="{" ".join(f"{x},{ramp(x)+330+(7 if (x//28)%2 else -7):.0f}" for x in range(-20,1961,28))}" fill="none" stroke="{ROCK}" stroke-width="4" opacity=".5"/>'

def tent(x,y,w,col):
    h=w*.7
    o=f'<ellipse cx="{x+8}" cy="{y+4}" rx="{w*.62}" ry="12" fill="{ROCKD}" opacity=".3"/>'
    o+=f'<polygon points="{x-w/2},{y} {x},{y-h} {x+w/2},{y}" fill="{col}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    o+=f'<polygon points="{x},{y-h} {x+w/2},{y} {x+w*.12},{y}" fill="{INK}" opacity=".18"/>'
    o+=f'<polygon points="{x-w*.14},{y} {x},{y-h*.55} {x+w*.14},{y}" fill="{INK}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    o+=f'<polyline points="{" ".join(f"{x-w*.4+i*w*.1},{y-h*.2+(9 if i%2 else -9)}" for i in range(9))}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    o+=f'<line x1="{x}" y1="{y-h}" x2="{x}" y2="{y-h-60}" stroke="{INK}" stroke-width="5"/><polygon points="{x},{y-h-60} {x+44},{y-h-46} {x},{y-h-32}" fill="{SAF}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    return o
def rock(x,y,w):
    return f'<polygon points="{x-w/2},{y} {x-w*.3},{y-w*.4} {x+w*.1},{y-w*.5} {x+w*.5},{y-w*.15} {x+w*.55},{y}" fill="{ROCK}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/><polygon points="{x+w*.1},{y-w*.5} {x+w*.5},{y-w*.15} {x+w*.55},{y} {x+w*.1},{y}" fill="{ROCKD}" opacity=".7"/>'
b+=tent(1540,900,220,TERRA)+rock(1760,980,150)+rock(1290,960,90)+tent(1010,1000,120,BLUE)
SKINS=['#7A4A2E','#D69B6E','#F1CBA6','#4B2B1B']; JK=[RED,ORANGE,GREEN,VIOLET]; PT=['#2A3F5F',INK,'#3B3F66','#5A2E22']; HT=[SAF,BLUE,TERRA,CREAM]
def climber(x,y,i,phase):
    sk,jk,pt,ht=SKINS[i],JK[i],PT[i],HT[i]
    o=f'<g transform="translate({x},{y})">'
    o+=f'<ellipse cx="2" cy="4" rx="48" ry="9" fill="{ROCKD}" opacity=".35"/>'
    if phase==0: legs=((-2,-86,-20,-48,-34,-6),(2,-86,24,-52,32,-8))
    else: legs=((-2,-86,10,-46,-4,-8),(2,-86,34,-60,48,-24))
    for hx,hy,kx,ky,fx,fy in legs:
        o+=f'<path d="M{hx},{hy} L{kx},{ky} L{fx},{fy}" fill="none" stroke="{INK}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>'
        o+=f'<path d="M{hx},{hy} L{kx},{ky} L{fx},{fy}" fill="none" stroke="{pt}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>'
        o+=f'<ellipse cx="{fx+7}" cy="{fy+2}" rx="14" ry="8" fill="{INK}"/>'
    o+=f'<rect x="-46" y="-150" width="30" height="64" rx="12" fill="{ht}" stroke="{INK}" stroke-width="4" transform="rotate(8 -30 -118)"/>'
    o+=f'<rect x="-50" y="-162" width="38" height="18" rx="9" fill="{CREAM}" stroke="{INK}" stroke-width="3.5" transform="rotate(8 -30 -118)"/>'
    o+=f'<g transform="rotate(9 0 -86)"><rect x="-20" y="-150" width="40" height="72" rx="17" fill="{jk}" stroke="{INK}" stroke-width="5"/>'
    o+=f'<polyline points="-20,-122 -10,-130 0,-122 10,-130 20,-122" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/><polyline points="-20,-108 -10,-116 0,-108 10,-116 20,-108" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    o+=f'<rect x="-21" y="-92" width="42" height="12" rx="5" fill="{INK}"/><rect x="-6" y="-95" width="12" height="18" rx="3" fill="{SAF}"/></g>'
    o+=f'<path d="M-4,-138 L-14,-114 L-6,-94" fill="none" stroke="{INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M-4,-138 L-14,-114 L-6,-94" fill="none" stroke="{jk}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-6" cy="-93" r="7" fill="{sk}" stroke="{INK}" stroke-width="3"/>'
    o+=f'<line x1="42" y1="-146" x2="34" y2="-6" stroke="{INK}" stroke-width="7" stroke-linecap="round"/><line x1="42" y1="-146" x2="34" y2="-6" stroke="{SAF}" stroke-width="3.5" stroke-linecap="round"/>'
    o+=f'<path d="M24,-150 Q42,-164 62,-146" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/><path d="M24,-150 Q42,-164 62,-146" fill="none" stroke="#C9D3DA" stroke-width="5" stroke-linecap="round"/>'
    o+=f'<path d="M14,-136 L36,-118 L42,-134" fill="none" stroke="{INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M14,-136 L36,-118 L42,-134" fill="none" stroke="{jk}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>'
    o+=f'<circle cx="42" cy="-134" r="7.5" fill="{sk}" stroke="{INK}" stroke-width="3"/>'
    o+=f'<rect x="3" y="-162" width="14" height="16" rx="5" fill="{sk}" stroke="{INK}" stroke-width="3"/>'
    o+=f'<circle cx="12" cy="-176" r="19" fill="{sk}" stroke="{INK}" stroke-width="5"/>'
    o+=f'<path d="M-8,-184 C-8,-212 34,-214 32,-184 L-8,-184Z" fill="{ht}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    o+=f'<rect x="-9" y="-193" width="42" height="9" rx="4" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
    o+=f'<circle cx="12" cy="-215" r="7" fill="{ht}" stroke="{INK}" stroke-width="3.5"/>'
    o+=f'<path d="M21,-178 q10,0 12,8" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round"/>'
    return o+'</g>'
CX=[500,870,1240,1590]
waist=[(x+1,ramp(x)-88) for x in CX]
rope=''
def rp(d):
    return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/><path d="{d}" fill="none" stroke="{SAF}" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="14 5"/>'
for (x0,y0),(x1,y1) in zip(waist[:-1],waist[1:]):
    rope+=rp(f'M{x0},{y0} Q{(x0+x1)/2},{(y0+y1)/2+70} {x1},{y1}')
x0,y0=waist[0]; rope+=rp(f'M{x0},{y0} Q{x0-120},{y0+70} {x0-240},{ramp(x0-240)-14}')
fr=''
for i,x in enumerate(CX): fr+=climber(x,ramp(x),i,i%2)
for x in range(60,300,48):
    fr+=f'<ellipse cx="{x}" cy="{ramp(x)+14}" rx="14" ry="5" fill="{SNOWS}" stroke="{MID}" stroke-width="2.5"/>'
bx=''
for x,g,r in zip(XS,['the-game','letter-jam','hanabi','the-crew','the-mind'],[-2,2,-1,2,-2]):
    bx+=place(g,x,ramp(x)-175-6,BOXH,r)
open('/tmp/claude-0/vec/jeux-coop-cartes.svg','w').write(page((b,rope+fr),bx))
