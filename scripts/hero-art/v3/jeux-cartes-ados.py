import sys; sys.path.insert(0,'/tmp/claude-0/heroes/scripts')
from common_v3 import *
MAU='#8B3DF0'; MAU2='#A55BFF'; PINK='#FF4FB8'; CYAN='#3BE8F0'; LIME='#C6F23B'; DEEP='#3B1A7A'; W1='#B07B4A'; WD='#4A2C14'
defs=f'''<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A2EE0"/><stop offset="1" stop-color="#A152FA"/></linearGradient>
<linearGradient id="flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2290"/><stop offset="1" stop-color="#2A1157"/></linearGradient>
<radialGradient id="neonglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{PINK}" stop-opacity=".55"/><stop offset="1" stop-color="{PINK}" stop-opacity="0"/></radialGradient>
<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1FD6E8"/><stop offset=".5" stop-color="#7B4DFF"/><stop offset="1" stop-color="{PINK}"/></linearGradient>'''
FY=840
bg=f'<rect width="1920" height="{FY}" fill="url(#wall)"/><rect y="{FY}" width="1920" height="{1080-FY}" fill="url(#flr)"/>'
# lattes de sol
for i in range(1,6): bg+=f'<line x1="0" y1="{FY+i*46}" x2="1920" y2="{FY+i*46}" stroke="#1E0B42" stroke-width="3" opacity=".6"/>'
bg+=f'<rect y="{FY-14}" width="1920" height="22" fill="#2B1060"/>'
# papier peint : motifs gravés crème en bandes (pas de grille de points)
wall=''
for y in (300,560):
    wall+=zigband(0,1920,y,10,96,CREAM,3,.14)
wall+=lozrow(0,1920,430,24,22,CREAM,2.4,.12)
# guirlandes
gl1,g1=string_lights((0,70),(980,100),60,12,[PINK,CYAN,SAFH,LIME],13)
gl2,g2=string_lights((940,100),(1920,60),64,12,[CYAN,SAFH,PINK,LIME],13)
gl3,g3=string_lights((0,150),(700,190),40,8,[LIME,PINK,CYAN,SAFH],11)
# poster (bandes abstraites, sans texte)
px,py,pw,ph=90,200,230,290
poster=f'<rect x="{px+7}" y="{py+9}" width="{pw}" height="{ph}" fill="#000" opacity=".25"/><rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="{INK}"/><rect x="{px+12}" y="{py+12}" width="{pw-24}" height="{ph-24}" fill="none" stroke="{CREAM}" stroke-width="3"/>'
poster+=f'<circle cx="{px+pw/2}" cy="{py+110}" r="68" fill="{PINK}"/><circle cx="{px+pw/2}" cy="{py+110}" r="44" fill="{ORANGE}"/><circle cx="{px+pw/2}" cy="{py+110}" r="20" fill="{SAFH}"/>'
poster+=f'<polygon points="{px+12},{py+ph-12} {px+60},{py+ph-80} {px+105},{py+ph-12}" fill="{CYAN}"/><polygon points="{px+90},{py+ph-12} {px+150},{py+ph-110} {px+210},{py+ph-12}" fill="{LIME}"/>'
poster+=zigband(px+24,px+pw-24,py+ph-30,7,10,INK,3)
poster+=f'<rect x="{px+pw/2-18}" y="{py-8}" width="36" height="16" fill="{CREAM}" opacity=".75"/>'
# planche de skate au mur
sk=f'<g transform="translate(700,360) rotate(10)"><rect x="-44" y="-170" width="88" height="340" rx="44" fill="#000" opacity=".25" transform="translate(8,10)"/><rect x="-44" y="-170" width="88" height="340" rx="44" fill="{CYAN}" stroke="{INK}" stroke-width="5"/>'
sk+=zigband(0,0,0,0,1,INK,0)
for k in range(5): sk+=f'<polygon points="0,{-110+k*50} 18,{-90+k*50} 0,{-70+k*50} -18,{-90+k*50}" fill="none" stroke="{INK}" stroke-width="4"/>'
for yy in (-118,118):
    sk+=f'<rect x="-30" y="{yy-3}" width="60" height="8" fill="{INK}"/><circle cx="-34" cy="{yy}" r="9" fill="{PINK}" stroke="{INK}" stroke-width="3"/><circle cx="34" cy="{yy}" r="9" fill="{PINK}" stroke="{INK}" stroke-width="3"/>'
sk+='</g>'
# néon éclair
bolt='M1130,230 L1060,350 L1118,350 L1086,450 L1180,318 L1120,318 L1160,230 Z'
neon=f'<ellipse cx="1120" cy="340" rx="190" ry="200" fill="url(#neonglow)"/>'
neon_s=f'<path d="{bolt}" fill="none" stroke="{PINK}" stroke-width="22" stroke-linejoin="round" opacity=".5" filter="url(#blur12)"/><path d="{bolt}" fill="none" stroke="{PINK}" stroke-width="12" stroke-linejoin="round"/><path d="{bolt}" fill="none" stroke="#FFE3F4" stroke-width="4" stroke-linejoin="round"/>'

wx,wy,ww,wh=1330,160,300,280
window=f'<rect x="{wx-14}" y="{wy-14}" width="{ww+28}" height="{wh+28}" rx="10" fill="{W1}" stroke="{INK}" stroke-width="5"/><rect x="{wx}" y="{wy}" width="{ww}" height="{wh}" fill="#1A1245"/>'
window+=f'<path d="M{wx+210},{wy+50} A52,52 0 1 0 {wx+250},{wy+140} A40,40 0 1 1 {wx+210},{wy+50} Z" fill="{SAFH}"/>'
for (sx_,sy_,r_) in [(40,50,5),(110,110,4),(170,40,6),(60,190,4),(140,200,5),(250,215,4),(260,40,3),(90,40,3)]:
    window+=f'<polygon points="{wx+sx_},{wy+sy_-r_*2} {wx+sx_+r_*.6},{wy+sy_-r_*.6} {wx+sx_+r_*2},{wy+sy_} {wx+sx_+r_*.6},{wy+sy_+r_*.6} {wx+sx_},{wy+sy_+r_*2} {wx+sx_-r_*.6},{wy+sy_+r_*.6} {wx+sx_-r_*2},{wy+sy_} {wx+sx_-r_*.6},{wy+sy_-r_*.6}" fill="{CREAM}"/>'
window+=f'<path d="M{wx},{wy+wh} L{wx},{wy+215} L{wx+60},{wy+175} L{wx+130},{wy+225} L{wx+200},{wy+170} L{wx+ww},{wy+230} L{wx+ww},{wy+wh} Z" fill="#0C0830"/>'
window+=f'<line x1="{wx+ww/2}" y1="{wy}" x2="{wx+ww/2}" y2="{wy+wh}" stroke="{W1}" stroke-width="10"/><line x1="{wx}" y1="{wy+wh/2}" x2="{wx+ww}" y2="{wy+wh/2}" stroke="{W1}" stroke-width="10"/><rect x="{wx-30}" y="{wy+wh+12}" width="{ww+60}" height="18" rx="5" fill="{W1}" stroke="{INK}" stroke-width="5"/>'
# bureau
dk=''
dk+=f'<rect x="60" y="640" width="690" height="30" rx="6" fill="{W1}" stroke="{INK}" stroke-width="5"/>'
dk+=zigband(80,730,655,5,60,WD,2.5,.7)
for x in (90,690): dk+=f'<rect x="{x}" y="670" width="26" height="{FY+90-670}" fill="{W1}" stroke="{INK}" stroke-width="5"/>'
dk+=f'<rect x="130" y="670" width="230" height="110" rx="6" fill="#8D5D33" stroke="{INK}" stroke-width="5"/><circle cx="245" cy="725" r="9" fill="{SAFH}" stroke="{INK}" stroke-width="3"/>'
# écran
dk+=f'<rect x="440" y="600" width="130" height="40" fill="{INK}"/><rect x="400" y="630" width="210" height="14" rx="6" fill="{INK}"/>'
dk+=f'<rect x="300" y="408" width="410" height="206" rx="14" fill="{INK}" stroke="{INK}" stroke-width="5"/><rect x="314" y="422" width="382" height="178" rx="6" fill="url(#scr)"/>'
dk+=f'<path d="M314,540 C380,480 440,580 510,520 C580,460 620,560 696,500 L696,600 L314,600 Z" fill="{INK}" opacity=".35"/><circle cx="420" cy="480" r="30" fill="{SAFH}" opacity=".9"/>'
# lampe de bureau
dk+=f'<ellipse cx="170" cy="636" rx="44" ry="10" fill="{INK}"/><path d="M170,636 L170,540 L230,470" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M200,470 L262,448 L268,490 Z" fill="{LIME}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
# mug + livres
dk+=f'<rect x="618" y="592" width="42" height="48" rx="6" fill="{PINK}" stroke="{INK}" stroke-width="4"/><path d="M660,602 C684,602 684,630 660,630" fill="none" stroke="{INK}" stroke-width="6"/>'
dk+=f'<rect x="250" y="606" width="120" height="16" fill="{CREAM}" stroke="{INK}" stroke-width="4"/><rect x="262" y="590" width="100" height="16" fill="{ORANGE}" stroke="{INK}" stroke-width="4"/>'
# tabouret
dk+=f'<ellipse cx="410" cy="788" rx="86" ry="20" fill="{TERRA}" stroke="{INK}" stroke-width="5"/><rect x="396" y="800" width="28" height="100" fill="{INK}"/><ellipse cx="410" cy="905" rx="70" ry="10" fill="{INK}"/>'
hp=headphones(660,455,.55,LIME,rot=0)
# casque posé au sommet de l'écran
hp=headphones(505,360,0.62,LIME)
# lit
bed=''
bx0,bx1=640,1920
bed+=f'<rect x="{bx0}" y="780" width="{bx1-bx0}" height="76" fill="{W1}" stroke="{INK}" stroke-width="5"/>'+zigband(bx0+14,bx1,818,7,70,WD,3,.7)
for x in (bx0+20,bx1-60): bed+=f'<rect x="{x}" y="850" width="34" height="62" fill="{WD}" stroke="{INK}" stroke-width="5"/>'
bed+=f'<rect x="{bx1-70}" y="440" width="90" height="420" rx="10" fill="{W1}" stroke="{INK}" stroke-width="5"/>'+planks(bx1-70,440,90,420,W1,WD,3,vertical=True,seed=3)
# oreillers au chevet
bed+=f'<path d="M{bx1-230},760 C{bx1-236},650 {bx1-196},598 {bx1-130},604 C{bx1-66},610 {bx1-62},690 {bx1-70},760 Z" fill="{CREAM}" stroke="{INK}" stroke-width="5"/>'+zigband(bx1-196,bx1-90,690,6,8,TERRA,3)
bed+=f'<path d="M{bx1-290},760 C{bx1-298},700 {bx1-262},664 {bx1-206},670 C{bx1-160},676 {bx1-166},730 {bx1-176},760 Z" fill="{CYAN}" stroke="{INK}" stroke-width="5"/>'+lozrow(bx1-276,bx1-182,716,2,12,INK,3)
# couette (surface vue de face)
bed+=f'<path d="M{bx0-6},790 C{bx0-10},740 {bx0+10},732 {bx0+60},734 L{bx1},734 L{bx1},800 L{bx0-6},800 Z" fill="{TERRA}" stroke="{INK}" stroke-width="5"/>'
bed+=f'<path d="M{bx0-6},790 L{bx1},790 L{bx1},830 C{bx1-300},850 {bx0+300},850 {bx0-6},826 Z" fill="#D8573A" stroke="{INK}" stroke-width="5"/>'
bed+=lozrow(bx0+10,bx1-10,810,22,12,CREAM,3,.9)+zigband(bx0+10,bx1,768,6,80,CREAM,3,.6)
# tapis + baskets
rug=f'<ellipse cx="620" cy="1000" rx="470" ry="64" fill="{TERRA}" stroke="{INK}" stroke-width="5"/><ellipse cx="620" cy="1000" rx="440" ry="52" fill="none" stroke="{CREAM}" stroke-width="4"/><ellipse cx="620" cy="1000" rx="380" ry="42" fill="{INK}" opacity=".5"/>'
rug+=''.join(f'<polygon points="{620+dx},{1000-18} {620+dx+22},{1000} {620+dx},{1018} {620+dx-22},{1000}" fill="none" stroke="{CREAM}" stroke-width="3"/>' for dx in range(-340,341,68))
bean=f'<path d="M1280,1040 C1250,960 1300,900 1380,890 C1460,880 1520,900 1580,960 C1620,1000 1620,1040 1580,1054 C1480,1070 1350,1070 1280,1040 Z" fill="{ORANGE}" stroke="{INK}" stroke-width="5"/>'+zigband(1330,1560,985,10,12,CREAM,4)+zigband(1320,1570,1020,10,12,CREAM,4)+f'<path d="M1330,925 C1380,905 1440,905 1490,925" fill="none" stroke="{SAFH}" stroke-width="8" stroke-linecap="round" opacity=".7"/>'
shoes=sneaker(390,1012,.78,PINK,CREAM)+sneaker(610,1030,.78,LIME,INK,flip=True,rot=-4)
sock=''
# boîtes sur le lit
row=[(i,248) for i in ('skull','saboteur','jungle-speed','6-qui-prend','skyjo','kyran')]
xs=spread(row,bx0+20,bx1-205)
boxes=''
for (id,h),x,r in zip(row,xs,(-2,2,-1.5,2,-2,1.5)): boxes+=place(id,x,800,h,r)
parts=[(bg+wall,False),(neon,False),(poster+sk+window+neon_s+gl1+gl2,True),(g1+g2,False),('<g transform="translate(0,167) scale(.82)">'+dk+hp+'</g>',True),(rug+shoes+bed+bean,True),(boxes,False)]
if __name__=='__main__':
    build('jeux-cartes-ados',parts,defs)
