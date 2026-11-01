import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from common_v3 import *
TURQ='#7EE3D8'; TURQ2='#5CCBC4'; TEAL='#136E78'; TEAL2='#0E5560'
defs=f'''<linearGradient id="tq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CF0E6"/><stop offset="1" stop-color="{TURQ2}"/></linearGradient>'''
# --- homographie carré -> quad
Q=[(790,62),(1740,52),(1885,718),(640,732)]  # TL TR BR BL
PW,PH=466.0,494.0
def homog():
    (x0,y0),(x1,y1),(x2,y2),(x3,y3)=Q
    dx1,dx2,dx3=x1-x2,x3-x2,x0-x1+x2-x3; dy1,dy2,dy3=y1-y2,y3-y2,y0-y1+y2-y3
    den=dx1*dy2-dx2*dy1
    g=(dx3*dy2-dx2*dy3)/den; h=(dx1*dy3-dx3*dy1)/den
    a=x1-x0+g*x1; b=x3-x0+h*x3; c=x0; d=y1-y0+g*y1; e=y3-y0+h*y3; f=y0
    return a,b,c,d,e,f,g,h
A=homog()
def P(x,y):
    a,b,c,d,e,f,g,h=A; u=x/PW; v=y/PH; w=g*u+h*v+1
    return ((a*u+b*v+c)/w,(d*u+e*v+f)/w)
def poly(pts,fill='none',stroke='none',sw=0,op=1):
    p=' '.join(f'{X:.1f},{Y:.1f}' for X,Y in (P(*q) for q in pts))
    return f'<polygon points="{p}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" opacity="{op}"/>'
def rr(x,y,w,h,r,n=6):
    pts=[]
    for cx,cy,a0 in ((x+w-r,y+r,-90),(x+w-r,y+h-r,0),(x+r,y+h-r,90),(x+r,y+r,180)):
        for i in range(n+1):
            a=math.radians(a0+90*i/n); pts.append((cx+r*math.cos(a),cy+r*math.sin(a)))
    return pts
def circ(cx,cy,r,n=24): return [(cx+r*math.cos(2*math.pi*i/n),cy+r*math.sin(2*math.pi*i/n)) for i in range(n)]
def line(pts,stroke,sw,op=1):
    p=' '.join(f'{X:.1f},{Y:.1f}' for X,Y in (P(*q) for q in pts))
    return f'<polyline points="{p}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" opacity="{op}"/>'
CW,CH,GAP=100,150,22
def card(ci,ri,kind,col):
    x=ci*(CW+GAP); y=ri*(CH+GAP); s=''
    # ombre portée
    s+=poly([(px+8,py+10) for px,py in rr(x,y,CW,CH,9)],INK,'none',0,.22)
    s+=poly(rr(x,y,CW,CH,9),CREAM,INK,3.5)
    if kind=='back':
        s+=poly(rr(x+8,y+8,CW-16,CH-16,6),col)
        s+=poly(rr(x+15,y+15,CW-30,CH-30,4),'none',CREAM,2)
        s+=poly([(x+CW/2,y+CH*.25),(x+CW*.78,y+CH/2),(x+CW/2,y+CH*.75),(x+CW*.22,y+CH/2)],'none',CREAM,3)
        s+=poly([(x+CW/2,y+CH*.38),(x+CW*.62,y+CH/2),(x+CW/2,y+CH*.62),(x+CW*.38,y+CH/2)],CREAM,'none',0)
        for dx,dy in ((.22,.2),(.78,.2),(.22,.8),(.78,.8)): s+=poly(circ(x+CW*dx,y+CH*dy,3.5,10),CREAM)
    else:
        s+=poly(rr(x+8,y+8,CW-16,CH-16,6),col)
        s+=poly(rr(x+14,y+14,CW-28,CH-28,4),'none',CREAM,2)
        s+=poly(circ(x+CW/2,y+CH/2,31,28),CREAM,'none',0,.95)
        s+=poly(circ(x+CW/2,y+CH/2,22,28),col)
        s+=poly([(x+CW/2,y+CH/2-12),(x+CW/2+10,y+CH/2),(x+CW/2,y+CH/2+12),(x+CW/2-10,y+CH/2)],CREAM)
        for dx,dy in ((.22,.17),(.78,.83)): s+=poly(circ(x+CW*dx,y+CH*dy,5,10),CREAM)
        for dx,dy in ((.78,.17),(.22,.83)): s+=poly([(x+CW*dx,y+CH*dy-6),(x+CW*dx+6,y+CH*dy),(x+CW*dx,y+CH*dy+6),(x+CW*dx-6,y+CH*dy)],CREAM)
    return s
BLU='#2B3A8C';LB='#4FB4E8';GR='#3FAE5A';YE='#F2BE2B';RE='#E0443B'
layout=[('face',YE),('back',TEAL),('face',GR),('face',RE),
        ('back',TEAL),('face',LB),('face',BLU),('back',TEAL),
        ('face',GR),('face',RE),('back',TEAL),('face',YE)]
cards=''
for i,(k,c) in enumerate(layout): cards+=card(i%4,i//4,k,c)
# fond
bg=f'<rect width="1920" height="1080" fill="url(#tq)"/>'
deco=''
for y in (70,120,360,600,740): deco+=lozrow(0,640,y,5,24,CREAM,2.6,.45)
deco+=zigband(30,610,20,8,22,CREAM,3,.5)
deco+=zigband(0,1920,770,0,1,CREAM,0)
# dalle du plateau : liseré gravé sous le tapis de cartes
mat=poly([(-30,-30),(PW+30,-30),(PW+30,PH+30),(-30,PH+30)],TURQ,CREAM,5,.55)
mat+=poly([(-14,-14),(PW+14,-14),(PW+14,PH+14),(-14,PH+14)],'none',CREAM,3,.8)
# table (bord proche)
table=planks(0,775,1920,305,TEAL,TEAL2,6,seed=2)+f'<rect y="775" width="1920" height="20" fill="#0A4048"/>'
table+=zigband(0,1920,806,7,110,CREAM,3.5,.6)
# boîte Skyjo
sk=f'<ellipse cx="340" cy="700" rx="190" ry="22" fill="{INK}" opacity=".22" filter="url(#blur12)"/>'+img('skyjo',330,390,560,-3)
# rangée 10 boîtes
row=[('llama',232),('no-thanks',200),('6-qui-prend',236),('parade',236),('love-letter',236),('uno',236),('cabo',200),('papayoo',200),('lost-cities',200),('kyran',236)]
xs=spread(row,50,1870)
boxes=''
for (id,h),x,r in zip(row,xs,(-1,1.5,-1,1,-1.5,1,-1,1.5,-1,1)): boxes+=place(id,x,1030,h,r)
if __name__=='__main__':
    build('jeux-comme-skyjo',[(bg+deco,False),(mat+cards,True),(table,True),(sk,False),(boxes,False)],defs)
