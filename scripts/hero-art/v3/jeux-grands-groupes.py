import sys,math,random
sys.path.insert(0,'/tmp/claude-0/vec')
from kyran_art import *
from assets import img,size
BRICK='#A63D2F'; BRICK2='#8E3226'; FLOOR='#7A281F'
def page(bg,art,fg,w=1920,h=1080):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><filter id="rough" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .13  0 0 0 .07 0"/></filter></defs>
<rect width="{w}" height="{h}" fill="{BRICK}"/>
<g filter="url(#rough)">{bg}{art}</g>{fg}
<rect width="{w}" height="{h}" filter="url(#grain)"/></svg>'''
rnd=random.Random(4)
HOR=410; VX=960
bg=''
# briques
for r in range(0,12):
    y=r*36
    if y>HOR: break
    bg+=f'<line x1="0" y1="{y}" x2="1920" y2="{y}" stroke="{INK}" stroke-width="2" opacity=".18"/>'
    off=0 if r%2 else 60
    for x in range(off,1920,120):
        bg+=f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+36}" stroke="{INK}" stroke-width="2" opacity=".14"/>'
# fenêtres en arc
for x in (330,960,1590):
    bg+=f'<path d="M{x-90},{HOR-20} L{x-90},170 A90,90 0 0 1 {x+90},170 L{x+90},{HOR-20}Z" fill="{CREAM}"/>'
    bg+=f'<path d="M{x-74},{HOR-20} L{x-74},172 A74,74 0 0 1 {x+74},172 L{x+74},{HOR-20}Z" fill="#1F2A5A"/>'
    bg+=f'<line x1="{x}" y1="98" x2="{x}" y2="{HOR-20}" stroke="{CREAM}" stroke-width="6"/><line x1="{x-74}" y1="230" x2="{x+74}" y2="230" stroke="{CREAM}" stroke-width="6"/>'
    for k in range(5):
        bg+=f'<circle cx="{x+rnd.uniform(-55,55):.0f}" cy="{rnd.uniform(120,380):.0f}" r="{rnd.choice([2,3,4])}" fill="{SAFH}"/>'
    bg+=f'<rect x="{x-104}" y="{HOR-20}" width="208" height="16" rx="4" fill="{CREAM}"/>'
# sol
bg+=f'<rect x="0" y="{HOR}" width="1920" height="{1080-HOR}" fill="{FLOOR}"/><rect x="0" y="{HOR-6}" width="1920" height="10" fill="{INK}" opacity=".6"/>'
for k in range(-14,15):
    bg+=f'<line x1="{VX}" y1="{HOR}" x2="{VX+k*260}" y2="1080" stroke="{INK}" stroke-width="2" opacity=".2"/>'
for y in (440,490,560,650,770,930):
    bg+=f'<line x1="0" y1="{y}" x2="1920" y2="{y}" stroke="{INK}" stroke-width="2" opacity=".16"/>'
# guirlandes de fanions
flag=[CREAM,SAF,BLUE,GREEN,ORANGE,CREAM,SAF,VIOLET]
def swag(x0,y0,x1,y1,sag,n):
    s=f'<path d="M{x0},{y0} Q{(x0+x1)/2},{y0+sag*2} {x1},{y1}" fill="none" stroke="{INK}" stroke-width="4"/>'
    for i in range(1,n):
        t=i/n
        x=(1-t)**2*x0+2*(1-t)*t*(x0+x1)/2+t*t*x1; y=(1-t)**2*y0+2*(1-t)*t*(y0+sag*2)+t*t*y1
        c=flag[i%len(flag)]
        s+=f'<polygon points="{x-20:.0f},{y:.0f} {x+20:.0f},{y:.0f} {x:.0f},{y+46:.0f}" fill="{c}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
    return s
bg+=swag(-20,40,970,36,70,22)+swag(950,36,1940,40,70,22)
# lanternes
def lantern(x,y,c):
    return (f'<line x1="{x}" y1="{y-60}" x2="{x}" y2="{y}" stroke="{INK}" stroke-width="3"/>'
            f'<ellipse cx="{x}" cy="{y+34}" rx="34" ry="42" fill="{c}" stroke="{INK}" stroke-width="5"/>'
            f'<rect x="{x-14}" y="{y-6}" width="28" height="12" rx="3" fill="{INK}"/><rect x="{x-12}" y="{y+72}" width="24" height="10" rx="3" fill="{INK}"/>'
            +zig(x,y+34,22,12,6,stroke=CREAM,sw=3)+f'<circle cx="{x}" cy="{y+34}" r="7" fill="{CREAM}"/>')
for x,y,c in ((200,180,SAF),(640,205,ORANGE),(1280,205,SAF),(1720,180,ORANGE)):
    bg+=lantern(x,y,c)
# --- table
L0=600;R0=1320;TY=HOR+20;sl=.85
def ex(y,side): return (L0-(y-TY)*sl) if side<0 else (R0+(y-TY)*sl)
yb=1080
tbl=f'<polygon points="{L0+14},{TY+14} {R0+14},{TY+14} {ex(yb,1)+30},{yb} {ex(yb,-1)+30},{yb}" fill="#000" opacity=".28"/>'
tbl+=f'<polygon points="{L0},{TY} {R0},{TY} {ex(yb,1)},{yb} {ex(yb,-1)},{yb}" fill="{SAF}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
# veinures convergentes
for k in range(-9,10):
    tbl+=f'<line x1="{VX+k*30}" y1="{TY+4}" x2="{VX+k*115}" y2="{yb}" stroke="{TERRA}" stroke-width="3" opacity=".35"/>'
# bandes de nappe crème (bords) + zigzag
def edge_band(side):
    w0=40
    p=[(ex(TY,side),TY),(ex(TY,side)-side*w0*.35,TY),(ex(yb,side)-side*w0*1.6,yb),(ex(yb,side),yb)]
    s=f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x,y in p)}" fill="{CREAM}" stroke="{INK}" stroke-width="4"/>'
    for i in range(0,26):
        t=i/25; y=TY+30+(yb-TY-60)*t**1.0
        x=ex(y,side)-side*(8+22*(y-TY)/(yb-TY))
        r=2+7*(y-TY)/(yb-TY)
        s+=f'<polygon points="{x:.0f},{y-r*1.4:.0f} {x+r:.0f},{y:.0f} {x:.0f},{y+r*1.4:.0f} {x-r:.0f},{y:.0f}" fill="{TERRA}"/>'
    return s
tbl+=edge_band(-1)+edge_band(1)
# --- convives de dos
SKIN=['#F0C9A0','#8D5A3B','#C98F5E','#5A3825','#E3AE82','#74482C']
def diner(x,y,s,side,skin,hair,shirt,pat,hairstyle):
    o=f'<g transform="translate({x},{y}) scale({s*side},{s})">'
    o+=f'<ellipse cx="0" cy="2" rx="90" ry="14" fill="#000" opacity=".3"/>'
    # chaise (dossier)
    o+=f'<rect x="-66" y="-250" width="132" height="190" rx="14" fill="{TERRA}" stroke="{INK}" stroke-width="6"/>'
    for i in range(4):
        o+=f'<line x1="{-40+i*27}" y1="-236" x2="{-40+i*27}" y2="-74" stroke="{INK}" stroke-width="4" opacity=".55"/>'
    for sx in (-1,1):
        o+=f'<rect x="{sx*58-6}" y="-60" width="12" height="60" fill="{INK}"/>'
    o+=f'<rect x="-72" y="-74" width="144" height="18" rx="6" fill="{BRICK2}" stroke="{INK}" stroke-width="5"/>'
    # torse (de dos)
    o+=f'<path d="M-62,-98 C-66,-170 -58,-216 -30,-234 L30,-234 C58,-216 66,-170 62,-98Z" fill="{shirt}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    if pat==0:
        for r in range(4):
            o+=f'<polyline points="{" ".join(f"{-52+i*13},{-196+r*26+(7 if i%2 else 0)}" for i in range(9))}" fill="none" stroke="{CREAM}" stroke-width="4" stroke-linejoin="round"/>'
    elif pat==1:
        for r in range(4):
            for c in range(5):
                o+=f'<circle cx="{-40+c*20+(10 if r%2 else 0)}" cy="{-206+r*28}" r="5" fill="{CREAM}"/>'
    elif pat==2:
        o+=''.join(f'<line x1="{-60+i*20}" y1="-232" x2="{-60+i*20}" y2="-100" stroke="{CREAM}" stroke-width="5"/>' for i in range(7))
    else:
        for r in range(3):
            for c in range(4):
                x0=-36+c*24+(12 if r%2 else 0); y0=-208+r*36
                o+=f'<polygon points="{x0},{y0-11} {x0+9},{y0} {x0},{y0+11} {x0-9},{y0}" fill="{CREAM}"/>'
    # bras vers la table
    o+=f'<path d="M50,-218 C92,-200 108,-170 122,-132" fill="none" stroke="{INK}" stroke-width="38" stroke-linecap="round"/>'
    o+=f'<path d="M50,-218 C92,-200 108,-170 122,-132" fill="none" stroke="{shirt}" stroke-width="28" stroke-linecap="round"/>'
    o+=f'<circle cx="126" cy="-122" r="15" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    # cou et tête
    o+=f'<rect x="-15" y="-262" width="30" height="34" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    o+=f'<circle cx="0" cy="-292" r="40" fill="{skin}" stroke="{INK}" stroke-width="5"/>'
    for sx in (-1,1):
        o+=f'<ellipse cx="{sx*40}" cy="-290" rx="7" ry="11" fill="{skin}" stroke="{INK}" stroke-width="4"/>'
    hb=f'<path d="M-42,-286 C-48,-346 48,-346 42,-286 C42,-268 30,-258 0,-256 C-30,-258 -42,-268 -42,-286Z" fill="{hair}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    if hairstyle=='short':
        o+=hb
        o+=''.join(f'<path d="M{-26+i*17},-322 C{-24+i*17},-300 {-24+i*17},-284 {-26+i*17},-270" fill="none" stroke="{CREAM}" stroke-width="2.5" opacity=".28"/>' for i in range(4))
    elif hairstyle=='afro':
        o+=f'<circle cx="0" cy="-306" r="60" fill="{hair}" stroke="{INK}" stroke-width="5"/>'
        o+=''.join(f'<circle cx="{-38+i*19}" cy="{-312+(12 if i%2 else -6)}" r="3" fill="{CREAM}" opacity=".35"/>' for i in range(5))
    elif hairstyle=='wrap':
        o+=hb
        o+=f'<path d="M-22,-340 C-34,-394 34,-394 22,-340 C10,-352 -10,-352 -22,-340Z" fill="{hair}" stroke="{INK}" stroke-width="5"/>'
        for k,c in enumerate((CREAM,SAF,CREAM)):
            o+=f'<path d="M-42,{-300+k*14} C-14,{-314+k*14} 14,{-314+k*14} 42,{-300+k*14}" fill="none" stroke="{c}" stroke-width="5"/>'
    elif hairstyle=='braids':
        o+=hb
        for i in range(6):
            x0=-34+i*13.6
            o+=f'<path d="M{x0},-272 C{x0+5},-250 {x0-5},-232 {x0},-208" fill="none" stroke="{hair}" stroke-width="9" stroke-linecap="round"/>'
            o+=f'<circle cx="{x0}" cy="-206" r="5" fill="{SAF}"/>'
    else:
        o+=hb
        o+=f'<circle cx="0" cy="-348" r="24" fill="{hair}" stroke="{INK}" stroke-width="5"/><circle cx="0" cy="-348" r="9" fill="{ORANGE}"/>'
    return o+'</g>'
cfg_l=[('afro',1,SKIN[1],INK,BLUE,0),('wrap',0,SKIN[3],VIOLET,ORANGE,3),('short',0,SKIN[0],'#6B3A1E',GREEN,1),('braids',1,SKIN[5],INK,RED,2),('bun',0,SKIN[2],INK,CREAM,0)]
cfg_r=[('short',0,SKIN[4],INK,ORANGE,2),('bun',1,SKIN[1],INK,VIOLET,1),('afro',0,SKIN[3],INK,CREAM,3),('wrap',1,SKIN[2],GREEN,BLUE,0),('braids',0,SKIN[0],'#8A4B2A',RED,3)]
ys=[960,825,712,625,558]; ss=[1.08,.88,.72,.58,.47]
dn=''
for i in reversed(range(5)):
    y=ys[i]; s=ss[i]
    hs,_,sk,hc,sh,pt=cfg_l[i]; dn+=diner(ex(y,-1)-92*s,y,s,1,sk,hc,sh,pt,hs)
    hs,_,sk,hc,sh,pt=cfg_r[i]; dn+=diner(ex(y,1)+92*s,y,s,-1,sk,hc,sh,pt,hs)
open('/tmp/claude-0/vec/_gg_tbl.txt','w').write('')
art=tbl+dn
# --- boîtes sur la table (3 rangées)
fg=''
rows=[(('jungle-speed','just-one','timeline'),490,172),(('saboteur','dobble','6-qui-prend'),662,212),(('uno','codenames','kyran'),922,288)]
for ids,yc,H in rows:
    xs_l=ex(yc,-1)+110; xs_r=ex(yc,1)-110
    ws=[H*size(i)[0]/size(i)[1] for i in ids]
    n=len(ids); slot=(xs_r-xs_l)/n
    for k,(i,w) in enumerate(zip(ids,ws)):
        xc=xs_l+slot*(k+.5)
        fg+=img(i,xc,yc,H,rot=[-3,2,-1][k] if yc<800 else [-2,0,2][k])
# cartes éparses sur la table
sc=''
for (x,y,r,c,w) in ((760,590,18,RED,40),(1180,585,-14,BLUE,40),(900,742,-20,GREEN,58),(1070,748,12,ORANGE,58),(560,980,-12,VIOLET,76),(1370,985,16,RED,76),(1150,560,8,GREEN,34),(790,560,-10,ORANGE,34)):
    sc+=f'<g transform="translate({x},{y}) rotate({r})">{card_back(w,w*1.42,c)}</g>'
open('/tmp/claude-0/vec/jeux-grands-groupes.svg','w').write(page(bg,art+sc,fg))
