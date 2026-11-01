import sys,math,random; sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img
from PIL import Image
BG='#D9DCE1'; SLATE='#3E4C63'; LIGHT='#F3EEE2'
TW,TH=170,97; CX,CY=960,560
def tc(r,c): return CX+(c-r)*TW/2, CY+(c+r-7)*TH/2
def place(g,x,base,visH,rot=0):
    im=Image.open(f'/tmp/claude-0/assets_web/{g}.png'); w0,h0=im.size; x0,y0,x1,y1=im.getchannel('A').getbbox()
    k=visH/(y1-y0); return img(g,x,base-(y1-h0/2)*k,h0*k,rot)
def rough(s): return f'<g filter="url(#rough)">{s}</g>'
d=''
# fond : losanges concentriques gravés
for k in range(1,7):
    a=760+k*170; b=a*TH/TW
    d+=f'<polygon points="{CX},{CY-b+30} {CX+a},{CY+30} {CX},{CY+b+30} {CX-a},{CY+30}" fill="none" stroke="#C7CCD5" stroke-width="{6 if k%2 else 3}"/>'
d+=f'<ellipse cx="{CX}" cy="{CY+400}" rx="860" ry="130" fill="#8F96A3" opacity=".45"/>'
# cadre et tranche
A,B,t=4*TW/2*2/2*1,0,0
A=4*TW; B=4*TH; Af=A+52; Bf=B+30; T=56
d+=f'<polygon points="{CX-Af},{CY} {CX},{CY+Bf} {CX},{CY+Bf+T} {CX-Af},{CY+T}" fill="#262B36" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
d+=f'<polygon points="{CX+Af},{CY} {CX},{CY+Bf} {CX},{CY+Bf+T} {CX+Af},{CY+T}" fill="#1B1F28" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
for sg in (-1,1):
    pts=[]
    for i in range(0,22):
        f=i/21; x=CX+sg*Af*(1-f); y=CY+Bf*f+T*0.5+(7 if i%2 else -7)
        pts.append(f'{x:.0f},{y:.0f}')
    d+=f'<polyline points="{" ".join(pts)}" fill="none" stroke="{SAF}" stroke-width="5" stroke-linejoin="round"/>'
d+=f'<polygon points="{CX},{CY-Bf} {CX+Af},{CY} {CX},{CY+Bf} {CX-Af},{CY}" fill="{TERRA}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
Ai=A+16; Bi=B+9
d+=f'<polygon points="{CX},{CY-Bi} {CX+Ai},{CY} {CX},{CY+Bi} {CX-Ai},{CY}" fill="none" stroke="{CREAM}" stroke-width="3.5" stroke-dasharray="12 8"/>'
for r in range(8):
    for c in range(8):
        x,y=tc(r,c); dark=(r+c)%2
        d+=f'<polygon points="{x},{y-TH/2} {x+TW/2},{y} {x},{y+TH/2} {x-TW/2},{y}" fill="{SLATE if dark else LIGHT}" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/>'
        if dark:
            d+=f'<polygon points="{x},{y-9} {x+16},{y} {x},{y+9} {x-16},{y}" fill="none" stroke="{CREAM}" stroke-width="2.5" opacity=".45"/>'
        else:
            d+=f'<circle cx="{x}" cy="{y}" r="3" fill="{TERRA}" opacity=".55"/>'
SK=29.7
def crown(w,col=SAF):
    return f'<polygon points="{-w/2},0 {-w/2},-30 {-w/4},-14 0,-38 {w/4},-14 {w/2},-30 {w/2},0" fill="{col}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="0" cy="-38" r="5" fill="{RED}" stroke="{INK}" stroke-width="2"/>'
def piece(r,c,kind,col,ax=1,face=False):
    x,y=tc(r,c)
    w,h={'pawn':(64,92),'knight':(78,110),'queen':(88,128),'king':(94,142),'rook':(80,100)}[kind]
    o=f'<ellipse cx="{x+4}" cy="{y+6}" rx="46" ry="21" fill="{INK}" opacity=".32"/>'
    o+=f'<ellipse cx="{x}" cy="{y+4}" rx="34" ry="16" fill="{INK}"/><ellipse cx="{x}" cy="{y+1}" rx="34" ry="16" fill="{col}" stroke="{INK}" stroke-width="3"/><ellipse cx="{x}" cy="{y+1}" rx="20" ry="9" fill="none" stroke="{CREAM}" stroke-width="2.5"/>'
    tilt=-14 if kind=='knight' else 0
    o+=f'<g transform="translate({x},{y-2}) skewY({SK*ax}) rotate({tilt})">'
    if kind=='rook':
        for k,(dx,dy) in enumerate(((-12,0),(0,-6),(12,-12))):
            o+=f'<g transform="translate({dx},{dy}) translate(0,{-h/2})">{card_back(w-16,h-8,col)}</g>'
    else:
        o+=f'<g transform="translate(0,{-h/2-8})">{card_face_spade(w,h) if face else card_back(w,h,col)}</g>'
    if kind in ('queen','king'):
        o+=f'<g transform="translate(0,{-h-6})">{crown(w*.62 if kind=="queen" else w*.7)}</g>'
    o+='</g>'
    o=f'<g transform="translate({x},{y}) scale(1.22) translate({-x},{-y})">{o}</g>'
    return (y,rough(o))
items=[]
TA=[TERRA,RED,ORANGE]; TB=[BLUE,VIOLET,GREEN]
pcs=[(7,0,'rook',TB[0],1,False),(7,2,'pawn',TB[1],1,False),(7,4,'pawn',TB[2],1,False),(7,6,'pawn',TB[0],1,False),(6,7,'rook',TB[1],1,False),
     (6,5,'king',TB[2],1,True),(7,3,'queen',TB[1],1,True),(6,1,'pawn',TB[0],1,False),
     (3,0,'pawn',TA[0],-1,False),(0,6,'rook',TA[0],-1,False),(2,7,'pawn',TA[1],-1,False),
     (5,1,'knight',TB[0],1,False),(6,6,'pawn',TA[2],1,False)]
for p in pcs: items.append(piece(*p))
BOX=[('lost-cities',(4,0),-3),('wizard',(2,2),2),('star-realms',(0,3),3),('parade',(5,3),-2),('schotten-totten',(4,6),2),('oh-hell',(1,7),-3)]
for g,(r,c),rot in BOX:
    x,y=tc(r,c)
    items.append((y+8,place(g,x,y+14,330,rot)))
items.sort(key=lambda t:t[0])
body=''.join(s for _,s in items)
s=svg('')
s=s.replace(f'<rect width="1920" height="1080" fill="{CREAM}"/>',f'<rect width="1920" height="1080" fill="{BG}"/>')
s=s.replace('<g filter="url(#rough)"></g>',f'<g filter="url(#rough)">{d}</g>{body}')
open('/tmp/claude-0/vec/jeux-strategie-legere.svg','w').write(s)
