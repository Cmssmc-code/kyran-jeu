import sys; sys.path.insert(0,'/tmp/claude-0/vec')
from v3common import *
random.seed(21)
NIGHT='#0E1B4D'; NIGHT2='#1B2E7A'; NIGHT3='#2B45A3'; MOON='#F6D77A'
bg=f'''<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#091340"/><stop offset=".6" stop-color="{NIGHT2}"/><stop offset="1" stop-color="#3A4FB0"/></linearGradient>
<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{MOON}" stop-opacity=".55"/><stop offset="1" stop-color="{MOON}" stop-opacity="0"/></radialGradient>
<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{VIOLET}"/><stop offset="1" stop-color="{BLUE}"/></linearGradient>
<linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{ORANGE}"/><stop offset="1" stop-color="{RED}"/></linearGradient>
<linearGradient id="g3" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="{GREEN}"/><stop offset="1" stop-color="#1C6E8C"/></linearGradient>
<linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{SAFH}"/><stop offset="1" stop-color="{TERRA}"/></linearGradient>
<linearGradient id="g5" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E96BA8"/><stop offset="1" stop-color="{VIOLET}"/></linearGradient></defs>
<rect width="1920" height="1080" fill="url(#sky)"/>'''
bg+=f'<circle cx="900" cy="300" r="520" fill="url(#halo)"/>'
# étoiles
for i in range(130):
    x=random.randint(10,1910); y=random.randint(10,800); r=random.choice((1.8,2.4,3,3.6))
    bg+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="{CREAM}" opacity="{random.choice((.5,.7,.9))}"/>'
for i in range(16):
    bg+=star4(random.randint(40,1880),random.randint(30,760),random.choice((9,12,16,20)),CREAM)
# grande lune croissant
def crescent(x,y,r,fill=MOON,rot=0):
    return f'<g transform="translate({x},{y}) rotate({rot})"><path d="M0,{-r} A{r},{r} 0 1,0 0,{r} A{r*.74},{r*.9} 0 1,1 0,{-r} Z" fill="{fill}"/></g>'
bg+='<mask id="mm"><rect width="1920" height="1080" fill="#fff"/><circle cx="1075" cy="235" r="205" fill="#000"/></mask>'
bg+=f'<circle cx="940" cy="300" r="235" fill="{MOON}" mask="url(#mm)"/>'
bg+=''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#E3BE5E"/>' for x,y,r in ((790,300,26),(830,410,16),(850,230,12),(800,200,8)))
bg+=zig(940,300,262,276,48,fill='none',stroke=MOON,sw=3).replace('<polygon','<polygon opacity=".0"')
def cloud(x,y,s=1,fill=NIGHT3,hl=CREAM):
    d='M-190,0 C-230,0 -236,-70 -170,-76 C-166,-150 -50,-170 -14,-104 C20,-176 160,-160 164,-70 C240,-76 250,0 196,0 Z'
    return f'<g transform="translate({x},{y}) scale({s})"><path d="{d}" fill="{fill}"/><path d="M-140,-40 q24,-26 52,-6 M-30,-78 q26,-30 58,-4 M80,-60 q22,-20 46,-2" fill="none" stroke="{hl}" stroke-width="4" opacity=".55" stroke-linecap="round"/></g>'
bg+=cloud(300,330,.5,'#2A3F96')+cloud(1650,330,.55,'#2A3F96')+cloud(1180,90,.35,'#30479F')
art=''
# ---------- cartes-tableaux (abstraites) ----------
def dcard(shape,w,h,grad,motif,x,y,rot):
    s=f'<g transform="translate({x},{y}) rotate({rot})">'
    if shape=='arch':
        p=f'M{-w/2},{h/2} L{-w/2},{-h/2+w/2} A{w/2},{w/2} 0 0,1 {w/2},{-h/2+w/2} L{w/2},{h/2} Z'
    elif shape=='rect':
        p=f'M{-w/2+16},{-h/2} L{w/2-16},{-h/2} Q{w/2},{-h/2} {w/2},{-h/2+16} L{w/2},{h/2-16} Q{w/2},{h/2} {w/2-16},{h/2} L{-w/2+16},{h/2} Q{-w/2},{h/2} {-w/2},{h/2-16} L{-w/2},{-h/2+16} Q{-w/2},{-h/2} {-w/2+16},{-h/2} Z'
    elif shape=='leaf':
        p=f'M0,{-h/2} C{w*.7},{-h*.2} {w*.6},{h*.35} 0,{h/2} C{-w*.6},{h*.35} {-w*.7},{-h*.2} 0,{-h/2} Z'
    elif shape=='hex':
        p=f'M0,{-h/2} L{w/2},{-h/4} L{w/2},{h/4} L0,{h/2} L{-w/2},{h/4} L{-w/2},{-h/4} Z'
    elif shape=='tab':   # onglet : rectangle avec un coin coupé
        p=f'M{-w/2},{-h/2+40} L{-w/2+40},{-h/2} L{w/2},{-h/2} L{w/2},{h/2-30} Q{w/2},{h/2} {w/2-30},{h/2} L{-w/2+30},{h/2} Q{-w/2},{h/2} {-w/2},{h/2-30} Z'
    s+=f'<path d="{p}" fill="rgba(0,0,0,.35)" transform="translate(10,14)"/>'
    s+=f'<path d="{p}" fill="url(#{grad})" stroke="{CREAM}" stroke-width="9" stroke-linejoin="round"/>'
    s+=f'<clipPath id="c{x}{y}"><path d="{p}"/></clipPath><g clip-path="url(#c{x}{y})">{motif(w,h)}</g>'
    s+=f'<path d="{p}" fill="none" stroke="{INK}" stroke-width="3" opacity=".5" transform="scale(.9)"/>'
    return s+'</g>'
def m_waves(w,h):
    t=''
    for i in range(7):
        y=-h/2+30+i*(h/6.5)
        t+=f'<path d="M{-w},{y} '+''.join(f'q{w/6},-26 {w/3},0 t{w/3},0 ' for _ in range(2))+f'" fill="none" stroke="{CREAM}" stroke-width="5" opacity="{.8-i*.07}"/>'
    t+=f'<circle cx="{w*.12}" cy="{-h*.22}" r="{w*.17}" fill="{SAFH}"/>'
    return t
def m_lozenges(w,h):
    t=''
    for r in range(5):
        for c in range(3):
            x=-w/3+c*w/3+(r%2)*w/6; y=-h/2+40+r*h/5.2
            t+=f'<polygon points="{x},{y-26} {x+20},{y} {x},{y+26} {x-20},{y}" fill="{CREAM}" opacity=".85"/>'
    t+=f'<polygon points="0,{-h*.1} {w*.3},{h*.12} 0,{h*.34} {-w*.3},{h*.12}" fill="none" stroke="{INK}" stroke-width="6"/>'
    return t
def m_orbs(w,h):
    t=''
    for (x,y,r,c) in ((-w*.18,-h*.12,w*.3,CREAM),(w*.14,h*.02,w*.24,SAFH),(-w*.02,h*.2,w*.18,INK),(w*.2,-h*.26,w*.1,CREAM)):
        t+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity=".88"/>'
    t+=f'<path d="M{-w/2},{h*.34} q{w*.25},-60 {w*.5},0 t{w*.5},0" fill="{INK}" opacity=".55"/>'
    return t
def m_zig(w,h):
    t=''
    for i in range(6):
        y=-h/2+34+i*(h/6)
        pts=' '.join(f'{-w/2+k*w/8},{y+(16 if k%2 else -16)}' for k in range(9))
        t+=f'<polyline points="{pts}" fill="none" stroke="{CREAM if i%2 else INK}" stroke-width="6" opacity=".9"/>'
    t+=star4(0,0,w*.2,CREAM)
    return t
def m_const(w,h):
    pts=[(-w*.28,-h*.25),(w*.05,-h*.32),(w*.26,-h*.08),(-w*.05,h*.08),(-w*.24,h*.28),(w*.2,h*.3)]
    t=f'<polyline points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="none" stroke="{CREAM}" stroke-width="3.5" stroke-dasharray="8 8"/>'
    for x,y in pts: t+=star4(x,y,18,CREAM)
    t+=f'<path d="M{-w/2},{h*.38} Q0,{h*.2} {w/2},{h*.4} L{w/2},{h/2} L{-w/2},{h/2} Z" fill="{INK}" opacity=".5"/>'
    return t
cards=[('arch',210,330,'g1',m_waves,640,470,-12),('rect',200,300,'g2',m_lozenges,1290,440,11),
       ('leaf',210,330,'g3',m_orbs,660,760,-14),('hex',240,280,'g5',m_zig,1280,760,13),
       ('tab',160,240,'g4',m_const,760,160,-8),('arch',150,230,'g3',m_zig,1150,150,9)]
# nuages derrière les cartes et boîtes
for c in cards[:4]: art+=dcard(*c)
# nuages de premier plan
def bank(y,fill,amp,seed):
    random.seed(seed); d=f'M0,{y}'; x=0
    while x<1920:
        wv=random.randint(150,230); h=random.randint(40,amp)
        d+=f' q{wv/2},{-h*2} {wv},0'; x+=wv
    return f'<path d="{d} L{x},1080 L0,1080 Z" fill="{fill}"/>'
art+=bank(950,'#6F86E0',70,1)+bank(985,'#4D66C8',60,2)+bank(1025,'#2E4596',50,3)
art+=f'<path d="M80,975 q30,-26 60,0 M520,970 q30,-26 60,0 M1300,972 q30,-26 60,0 M1700,968 q30,-26 60,0" stroke="{CREAM}" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>'
# traînées d'étoiles
art+=''.join(star4(x,y,r,SAFH) for x,y,r in ((880,520,12),(1060,560,10),(700,600,8),(1250,600,9),(790,860,9),(1180,880,11)))
# ---------- boîtes ----------
imgs=''
put=[('just-one',200,270,310,-9),('codenames',470,170,300,7),('timeline',190,590,290,8),
     ('the-mind',1590,190,320,9),('skull',1760,480,310,-7),('the-crew',1490,640,300,-5),('sushi-go',1760,800,290,8),('coup',360,880,280,-8)]
for id,x,y,H,rot in put:
    imgs+=imgc(id,x,y,H,rot=rot)
imgs+=imgc('dixit',960,760,470,rot=0)
top=''

# petits nuages sous les boîtes flottantes
top+=''.join(cloud(x,y,s,'#6F86E0') for x,y,s in ((205,430,.4),(470,320,.38),(190,745,.42),(1590,350,.4),(1760,640,.42),(1490,800,.38),(1760,950,.4),(360,1030,.38)))
run('jeux-comme-dixit',(bg,art,imgs,top))
