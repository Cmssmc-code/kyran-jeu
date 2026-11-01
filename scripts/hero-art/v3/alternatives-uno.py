import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from common_v3 import *
NAVY='#14224F'; NAVY2='#1B2F6B'; W1='#9A6334'; W2='#6B4020'; W3='#C48A4E'; WD='#3E2410'
bg=f'<rect width="1920" height="1080" fill="url(#navy)"/>'
defs=f'''<linearGradient id="navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1A42"/><stop offset=".6" stop-color="{NAVY}"/><stop offset="1" stop-color="#1D2E66"/></linearGradient>
<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD58A" stop-opacity=".85"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient>
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3A3" stop-opacity=".42"/><stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/></linearGradient>'''
wall=''
for i in range(0,11):
    wall+=f'<rect x="{i*192}" y="0" width="96" height="1080" fill="{NAVY2}" opacity=".35"/>'
for y in (110,330,550,770,990):
    wall+=lozrow(0,1920,y,20,26,CREAM,2.2,.13)
floor=planks(0,1050,1920,30,'#2A1B10','#1a0f08',2)
UX0,UX1=250,1670
unit=''
unit+=planks(UX0,250,UX1-UX0,800,'#5A361B','#47290F',14,vertical=True,seed=4)
unit+=f'<rect x="{UX0}" y="250" width="{UX1-UX0}" height="800" fill="#000" opacity=".18"/>'
for x in (UX0-34,UX1):
    unit+=planks(x,215,34,845,W1,W2,1,vertical=True,seed=5)
    for yy in range(300,1040,70): unit+=f'<polygon points="{x+17},{yy-14} {x+28},{yy} {x+17},{yy+14} {x+6},{yy}" fill="none" stroke="{CREAM}" stroke-width="2.4" opacity=".7"/>'
unit+=planks(UX0-50,205,UX1-UX0+100,44,W3,W1,2,seed=6)+zigband(UX0-30,UX1+30,227,7,70,WD,3,.6)
for yb in (640,1010):
    unit+=planks(UX0-34,yb,UX1-UX0+68,40,W3,W1,2,seed=yb)
    unit+=f'<rect x="{UX0}" y="{yb+40}" width="{UX1-UX0}" height="14" fill="#000" opacity=".35"/>'
    unit+=zigband(UX0-20,UX1+20,yb+22,6,80,WD,3,.55)
unit+=planks(UX0-34,1050,UX1-UX0+68,30,W2,WD,1,seed=9)
sign=''
sx0,sx1,sy0,sy1=620,1300,48,172
for x in (700,1220): sign+=f'<line x1="{x}" y1="0" x2="{x}" y2="{sy0+8}" stroke="{CREAM}" stroke-width="5" opacity=".8"/><circle cx="{x}" cy="{sy0+8}" r="8" fill="{WD}" stroke="{CREAM}" stroke-width="2"/>'
sign+=f'<rect x="{sx0+6}" y="{sy0+9}" width="{sx1-sx0}" height="{sy1-sy0}" rx="14" fill="#000" opacity=".3"/>'
sign+=planks(sx0,sy0,sx1-sx0,sy1-sy0,W3,W1,3,seed=11)
sign+=f'<rect x="{sx0}" y="{sy0}" width="{sx1-sx0}" height="{sy1-sy0}" rx="14" fill="none" stroke="{WD}" stroke-width="6"/>'
sign+=f'<rect x="{sx0+18}" y="{sy0+16}" width="{sx1-sx0-36}" height="{sy1-sy0-32}" rx="8" fill="none" stroke="{CREAM}" stroke-width="3" opacity=".85"/>'
sign+=zigband(sx0+34,sx1-34,sy0+30,6,40,CREAM,3,.85)+zigband(sx0+34,sx1-34,sy1-30,6,40,CREAM,3,.85)
lamps='';glows=''
for lx in (470,1450):
    lamps+=f'<line x1="{lx}" y1="0" x2="{lx}" y2="86" stroke="{CREAM}" stroke-width="4" opacity=".8"/>'
    lamps+=f'<path d="M{lx-70},150 C{lx-70},106 {lx-32},88 {lx},88 C{lx+32},88 {lx+70},106 {lx+70},150 Z" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
    lamps+=zigband(lx-58,lx+58,128,5,10,CREAM,3)
    lamps+=f'<ellipse cx="{lx}" cy="152" rx="70" ry="9" fill="{SAFH}" stroke="{INK}" stroke-width="4"/>'
    glows+=f'<polygon points="{lx-60},158 {lx+60},158 {lx+330},1040 {lx-330},1040" fill="url(#cone)"/><ellipse cx="{lx}" cy="160" rx="150" ry="70" fill="url(#warm)"/>'
deco=''
px,py=100,1050
deco+=f'<path d="M{px-60},{py-110} L{px+60},{py-110} L{px+46},{py} L{px-46},{py} Z" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'+zigband(px-52,px+52,py-70,8,8,CREAM,4)+zigband(px-48,px+48,py-36,8,8,CREAM,4)
for a,l,c in [(-58,250,'#2F9E5B'),(-28,330,'#23834A'),(0,390,'#2F9E5B'),(24,320,'#23834A'),(48,230,'#2F9E5B'),(-80,170,'#23834A')]:
    deco+=f'<g transform="translate({px},{py-108}) rotate({a})"><path d="M0,0 C-44,-{l*.35} -36,-{l*.75} 0,-{l} C36,-{l*.75} 44,-{l*.35} 0,0Z" fill="{c}" stroke="{INK}" stroke-width="4"/><line x1="0" y1="-8" x2="0" y2="-{l-24}" stroke="{INK}" stroke-width="3" opacity=".5"/></g>'
qx=1810
deco+=f'<rect x="{qx-6}" y="560" width="12" height="490" fill="{INK}"/><ellipse cx="{qx}" cy="1046" rx="56" ry="12" fill="{INK}"/>'
deco+=f'<path d="M{qx-62},640 C{qx-62},590 {qx-30},560 {qx},560 C{qx+30},560 {qx+62},590 {qx+62},640 Z" fill="{SAF}" stroke="{INK}" stroke-width="5"/>'+zigband(qx-52,qx+52,616,5,10,INK,3)
glows+=f'<ellipse cx="{qx}" cy="660" rx="170" ry="130" fill="url(#warm)" opacity=".7"/>'
tags=''
for yb in (640,1010):
    for k in range(7):
        tx=330+k*215+(40 if yb==640 else 0)
        tags+=f'<rect x="{tx}" y="{yb+8}" width="58" height="22" rx="4" fill="{CREAM}" stroke="{INK}" stroke-width="2.5"/><circle cx="{tx+8}" cy="{yb+19}" r="3" fill="{TERRA}"/><line x1="{tx+18}" y1="{yb+19}" x2="{tx+48}" y2="{yb+19}" stroke="{INK}" stroke-width="2" opacity=".4"/>'
boxes=''
up=[('jungle-speed',330),('love-letter',330),('dobble',250),('saboteur',335)]
lo=[('llama',315),('skyjo',318),('monopoly-deal',275),('kyran',315)]
for row,base in ((up,640),(lo,1010)):
    xs=spread(row,UX0+10,UX1-10)
    for (id,h),x,r in zip(row,xs,(-1.5,1.5,-1,1.5)): boxes+=place(id,x,base,h,r)
parts=[(bg+wall+floor,False),(glows,False),(unit+sign+lamps+deco,True),(boxes,False)]
if __name__=='__main__':
    build('alternatives-uno',parts,defs)
