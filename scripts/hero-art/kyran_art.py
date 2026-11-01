import math,random
INK='#231F22';SAF='#E6AB26';SAFH='#F2C14E';TERRA='#B8432A';CREAM='#FBF6EC';RED='#E0303F';ORANGE='#EE7D1F';GREEN='#22A34A';BLUE='#1D96DB';VIOLET='#6B45B8'
def zig(cx,cy,r1,r2,n,fill='none',stroke=CREAM,sw=5):
    pts=[]
    for i in range(n*2):
        r=r1 if i%2==0 else r2; a=math.pi*2*i/(n*2)
        pts.append(f'{cx+r*math.cos(a):.1f},{cy+r*math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
def dots(cx,cy,r,n,dr,fill=CREAM):
    return ''.join(f'<circle cx="{cx+r*math.cos(2*math.pi*i/n):.1f}" cy="{cy+r*math.sin(2*math.pi*i/n):.1f}" r="{dr}" fill="{fill}"/>' for i in range(n))
def arcs(cx,cy,r0,r1,step,stroke=CREAM,sw=3,op=.45):
    return ''.join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{stroke}" stroke-width="{sw}" opacity="{op}"/>' for r in range(r0,r1,step))
def spade(x,y,s,fill=INK):
    return f'<g transform="translate({x},{y}) scale({s})"><path d="M0,-40 C-48,-2 -46,30 -20,30 C-10,30 -4,26 0,19 C4,26 10,30 20,30 C46,30 48,-2 0,-40 Z" fill="{fill}"/><polygon points="-6,24 6,24 13,52 -13,52" fill="{fill}"/></g>'
def card_back(w,h,color):
    rx=10
    s=f'<rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="{rx}" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
    s+=f'<rect x="{-w/2+9}" y="{-h/2+9}" width="{w-18}" height="{h-18}" rx="6" fill="{color}"/>'
    s+=f'<rect x="{-w/2+17}" y="{-h/2+17}" width="{w-34}" height="{h-34}" rx="4" fill="none" stroke="{CREAM}" stroke-width="2.5" stroke-dasharray="7 6"/>'
    s+=f'<polygon points="0,{-h*0.26} {w*0.30},0 0,{h*0.26} {-w*0.30},0" fill="none" stroke="{CREAM}" stroke-width="3.5"/>'
    s+=f'<polygon points="0,{-h*0.14} {w*0.16},0 0,{h*0.14} {-w*0.16},0" fill="{CREAM}" opacity=".9"/>'
    for sx in (-1,1):
        for sy in (-1,1):
            s+=f'<circle cx="{sx*w*0.30}" cy="{sy*h*0.36}" r="4" fill="{CREAM}"/>'
    return s
def card_face_spade(w,h):
    s=f'<rect x="{-w/2}" y="{-h/2}" width="{w}" height="{h}" rx="10" fill="{CREAM}" stroke="{INK}" stroke-width="3"/>'
    s+=f'<rect x="{-w/2+9}" y="{-h/2+9}" width="{w-18}" height="{h-18}" rx="6" fill="none" stroke="{TERRA}" stroke-width="3"/>'
    s+=spade(0,-8,.95)
    s+=spade(-w/2+24,-h/2+30,.28)+spade(w/2-24,h/2-34,.28)
    return s
def fan(px,py,base,n,step,R,w,h,color):
    out=f'<g transform="translate({px},{py}) rotate({base})">'
    for i in range(n):
        a=(i-(n-1)/2)*step
        out+=f'<g transform="rotate({a}) translate(0,{-R})">{card_back(w,h,color)}</g>'
    return out+'</g>'
def svg(body,w=1920,h=1080,seed=3):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs><filter id="rough" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="{seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .14  0 0 0 0 .12  0 0 0 0 .13  0 0 0 .07 0"/></filter></defs>
<rect width="{w}" height="{h}" fill="{CREAM}"/>
<g filter="url(#rough)">{body}</g>
<rect width="{w}" height="{h}" filter="url(#grain)"/>
</svg>'''
