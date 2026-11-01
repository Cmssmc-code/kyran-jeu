import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from common_v3 import *
W1='#A5622F'; W2='#6E3A18'; WD='#3C1E0C'
defs=f'''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8531B"/><stop offset=".55" stop-color="#FF8A2B"/><stop offset="1" stop-color="#FFC247"/></linearGradient>
<linearGradient id="deck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9B5429"/><stop offset="1" stop-color="#5E2F14"/></linearGradient>
<radialGradient id="lg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE08A" stop-opacity=".8"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient>'''
HZ=540
sky=f'<rect width="1920" height="{HZ+60}" fill="url(#sky)"/>'
# soleil rétro
sunx,suny,sr=960,HZ-10,230
sun=f'<clipPath id="sc"><rect x="{sunx-sr}" y="{suny-sr}" width="{2*sr}" height="{sr+10}"/></clipPath><g clip-path="url(#sc)"><circle cx="{sunx}" cy="{suny}" r="{sr}" fill="#FFE08A"/>'
for i,hh in enumerate((6,10,15,21,28)): sun+=f'<rect x="{sunx-sr}" y="{suny-160+i*38}" width="{2*sr}" height="{hh}" fill="#FFA02F"/>'
sun+='</g>'
# nuages allongés
clouds=''
for x,y,w in ((260,300,260),(1560,260,300),(1250,400,200),(560,420,190)):
    clouds+=f'<path d="M{x-w/2},{y} C{x-w/2},{y-22} {x-w/4},{y-30} {x-w/6},{y-14} C{x},{y-40} {x+w/4},{y-32} {x+w/3},{y-12} C{x+w/2},{y-14} {x+w/2},{y+6} {x+w/3},{y+8} L{x-w/2+10},{y+8} Z" fill="#FFD27A" opacity=".75"/>'
# collines + acacias
hills=f'<path d="M0,{HZ} C200,{HZ-90} 380,{HZ-60} 560,{HZ-20} C760,{HZ-80} 1000,{HZ-30} 1200,{HZ-60} C1450,{HZ-110} 1700,{HZ-50} 1920,{HZ-80} L1920,{HZ+60} L0,{HZ+60} Z" fill="#C9461E"/>'
hills+=f'<path d="M0,{HZ+20} C300,{HZ-30} 600,{HZ+10} 900,{HZ} C1200,{HZ-20} 1600,{HZ+20} 1920,{HZ-10} L1920,{HZ+60} L0,{HZ+60} Z" fill="#9C2F15"/>'
def acacia(x,y,s):
    return f'<g transform="translate({x},{y}) scale({s})"><path d="M-6,0 C-4,-40 -16,-70 -30,-96 L-20,-98 C-10,-80 -4,-70 0,-60 C6,-76 16,-92 30,-100 L36,-92 C20,-76 10,-56 8,0 Z" fill="#4A1608"/><path d="M-120,-100 C-100,-134 -40,-142 0,-126 C40,-148 110,-140 130,-104 C90,-112 40,-106 0,-110 C-40,-106 -80,-112 -120,-100 Z" fill="#4A1608"/></g>'
trees=acacia(250,HZ-8,1.1)+acacia(1650,HZ-30,.9)+acacia(1380,HZ-20,.55)
birds=''.join(f'<path d="M{x},{y} q14,-14 28,0 q14,-14 28,0" fill="none" stroke="#4A1608" stroke-width="4" stroke-linecap="round"/>' for x,y in ((420,210),(500,250),(1100,190),(1170,226)))
# terrasse
deck=f'<rect y="{HZ+40}" width="1920" height="{1080-HZ+20}" fill="url(#deck)"/>'
for i,y in enumerate((600,640,690,750,820,900,990)): deck+=f'<line x1="0" y1="{y}" x2="1920" y2="{y}" stroke="{WD}" stroke-width="{3+i*.7}" opacity=".7"/>'
# garde-corps
rail=f'<rect x="0" y="{HZ+8}" width="1920" height="26" fill="{W1}" stroke="{INK}" stroke-width="4"/>'+zigband(0,1920,HZ+21,5,150,WD,2.5,.7)
rail+=f'<rect x="0" y="{HZ+58}" width="1920" height="14" fill="{W2}" stroke="{INK}" stroke-width="3"/>'
for x in range(40,1920,170): rail+=f'<rect x="{x}" y="{HZ+34}" width="22" height="66" fill="{W1}" stroke="{INK}" stroke-width="3"/>'
# guirlandes
gl1,g1=string_lights((0,40),(640,110),55,9,[SAFH,RED,CREAM,ORANGE],13,glow=True)
gl2,g2=string_lights((620,110),(1300,110),70,9,[RED,SAFH,CREAM,'#FF8FB0'],13)
gl3,g3=string_lights((1280,110),(1920,40),55,9,[SAFH,ORANGE,CREAM,RED],13)
# lanternes en papier
lan=''
for x,y,c in ((330,230,RED),(1590,240,SAFH),(790,235,SAFH),(1140,230,RED)):
    lan+=f'<line x1="{x}" y1="{y-110}" x2="{x}" y2="{y-30}" stroke="{INK}" stroke-width="3"/>'
    lan+=f'<rect x="{x-14}" y="{y-34}" width="28" height="12" rx="3" fill="{INK}"/>'
    lan+=f'<path d="M{x-12},{y-22} C{x-62},{y-6} {x-62},{y+70} {x-12},{y+88} L{x+12},{y+88} C{x+62},{y+70} {x+62},{y-6} {x+12},{y-22} Z" fill="{c}" stroke="{INK}" stroke-width="4"/>'
    for k in (-26,0,26): lan+=f'<path d="M{x+k*.2},{y-22} C{x+k*2.2},{y+8} {x+k*2.2},{y+60} {x+k*.2},{y+88}" fill="none" stroke="{INK}" stroke-width="2.5" opacity=".6"/>'
    lan+=zigband(x-44,x+44,y+33,6,8,CREAM,3,.9)
    lan+=f'<rect x="{x-14}" y="{y+88}" width="28" height="10" rx="3" fill="{INK}"/><line x1="{x}" y1="{y+98}" x2="{x}" y2="{y+130}" stroke="{INK}" stroke-width="3"/><circle cx="{x}" cy="{y+134}" r="6" fill="{c}" stroke="{INK}" stroke-width="2"/>'
glow=''.join(f'<circle cx="{x}" cy="{y+34}" r="130" fill="url(#lg)"/>' for x,y in ((330,230),(1590,240),(790,235),(1140,230)))
glow+=f'<ellipse cx="960" cy="640" rx="620" ry="260" fill="url(#lg)" opacity=".55"/>'
# estrade en deux paliers
CX0,CX1=470,1450
crate=''
crate+=f'<rect x="{CX0+30}" y="610" width="{CX1-CX0-60}" height="200" fill="{W2}" stroke="{INK}" stroke-width="5"/>'+planks(CX0+30,610,CX1-CX0-60,200,W2,WD,5,seed=3)+f'<rect x="{CX0+24}" y="602" width="{CX1-CX0-48}" height="16" fill="{W1}" stroke="{INK}" stroke-width="4"/>'
crate+=f'<rect x="{CX0}" y="800" width="{CX1-CX0}" height="100" fill="{W1}" stroke="{INK}" stroke-width="5"/>'+planks(CX0,800,CX1-CX0,100,W1,W2,3,seed=5)+f'<rect x="{CX0-8}" y="792" width="{CX1-CX0+16}" height="16" fill="{W1}" stroke="{INK}" stroke-width="4"/>'
crate+=zigband(CX0+20,CX1-20,856,7,70,CREAM,3,.8)
crate+=f'<ellipse cx="960" cy="915" rx="520" ry="16" fill="{INK}" opacity=".3"/>'
# boîtes
back=[(i,225) for i in ('codenames','just-one','saboteur','skull','kyran')]
front=[(i,158) for i in ('dobble','dixit','coup','bang','colt-express')]
boxes=''
for row,base,rots in ((back,606,(-1.5,1,-1,1.5,-1)),(front,796,(1,-1.5,1,-1,1.5))):
    xs=spread(row,CX0+40,CX1-40)
    for (id,h),x,r in zip(row,xs,rots): boxes+=place(id,x,base,h,r)
# coussins + convives
skins=['#7A4A2B','#C98E5B','#F1CBA3','#5A351C','#A86B41','#E3B088']
people=''
cush=''
spec=[ # x, flip, skin, shirt, pants, hair, style, pattern, accent, cardcol
 (150,False,skins[0],'#2E8B57',INK,INK,'afro','zig',CREAM,TERRA),
 (300,False,skins[2],'#E0303F','#1D5FA8','#7A3E1A','short','stripe',CREAM,BLUE),
 (440,False,skins[4],SAFH,'#5A2A6B',INK,'bun','loz',INK,GREEN),
 (1780,True,skins[1],'#3A7BD5','#8A3B1E',INK,'wrap','dots',CREAM,RED),
 (1630,True,skins[3],CREAM,'#2D6A4F',INK,'cap','zig',TERRA,VIOLET),
 (1490,True,skins[5],'#B8432A','#222A5E','#C2A02A','short','dots',CREAM,ORANGE)]
cols=[RED,BLUE,GREEN,VIOLET,TERRA,SAFH]
for i,(x,fl,sk,sh,pa,ha,st,pt,ac,cc) in enumerate(spec):
    y=905-(i%3)*18 if True else 905
    cush+=f'<ellipse cx="{x+(8 if not fl else -8)}" cy="{y+24}" rx="104" ry="30" fill="{cols[i]}" stroke="{INK}" stroke-width="5"/>'+zigband(x-70,x+80,y+22,5,10,CREAM,3,.9)
    people+=person(x,y,.95,sk,sh,pa,ha,st,flip=fl,accent=ac,pattern=pt,cardcol=cc)
parts=[(sky+sun+clouds,False),(hills+trees+birds+deck+rail,True),(glow,False),(crate+cush+people,True),(boxes,False),(lan+gl1+gl2+gl3,True),(g1+g2+g3,False)]
if __name__=='__main__':
    build('jeux-soiree-amis',parts,defs)
