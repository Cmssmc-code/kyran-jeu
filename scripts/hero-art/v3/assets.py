"""Official visuals embedded in SVG. img(id,cx,cy,h,rot=0,shadow=True) -> <g> with base64 PNG (box cut-out, transparent bg)."""
import base64, os, json
W='/tmp/claude-0/assets_web'
_cache={}
def size(id):
    from PIL import Image
    return Image.open(f'{W}/{id}.png').size
def img(id,cx,cy,h,rot=0,shadow=True,flip=False):
    if id not in _cache:
        _cache[id]=base64.b64encode(open(f'{W}/{id}.png','rb').read()).decode()
    w0,h0=size(id); w=h*w0/h0
    sh=f'<image href="data:image/png;base64,{_cache[id]}" x="{-w/2+h*0.03:.1f}" y="{-h/2+h*0.04:.1f}" width="{w:.1f}" height="{h:.1f}" opacity="0.28" style="filter:brightness(0) blur(6px)"/>' if shadow else ''
    sx=-1 if flip else 1
    return f'<g transform="translate({cx},{cy}) rotate({rot}) scale({sx},1)">{sh}<image href="data:image/png;base64,{_cache[id]}" x="{-w/2:.1f}" y="{-h/2:.1f}" width="{w:.1f}" height="{h:.1f}"/></g>'
def ids(): return sorted(f[:-4] for f in os.listdir(W) if f.endswith('.png'))
