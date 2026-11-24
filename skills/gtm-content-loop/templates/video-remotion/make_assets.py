# Usage: python3 make_assets.py <images_dir> <public_dir>
# Cuts the persona expression sheets into 900x1200 poses and generates the sounds (ring, pop, answer, hangup).
# Requirements: pip install pillow numpy. The sheets (image grids) are not included: create them with your image generator (see README).
import sys, glob, numpy as np, wave, os
from PIL import Image
R, P = sys.argv[1], sys.argv[2]
os.makedirs(P+'/poses', exist_ok=True); os.makedirs(P+'/sfx', exist_ok=True)
def f(k): return glob.glob(R+'/*'+k+'*')[0]
def save(im,name):
    w,h=im.size; tw=int(h*3/4)
    if w>tw: im=im.crop(((w-tw)//2,0,(w-tw)//2+tw,h))
    elif w<tw: im=im.crop((0,0,w,int(w*4/3)))
    im.resize((900,1200),Image.LANCZOS).convert('RGB').save(P+'/poses/'+name+'.jpg',quality=92)
def grid(path,cols,rows,names,inset):
    im=Image.open(path); W,H=im.size
    for i,n in enumerate(names):
        c,r=i%cols,i//cols
        save(im.crop((round(c*W/cols)+inset,round(r*H/rows)+inset,round((c+1)*W/cols)-inset,round((r+1)*H/rows)-inset)),n)
grid(f('Four_Expressions'),2,2,['phone','neutral','talk','skeptic'],8)
grid(f('Reaction_Grid'),4,3,['phone_s','neutral_s','talk_s','skeptic_s','one','two','three','crossed','watch','disappointed','point','hangup'],5)
grid(f('Calculating'),3,2,['calc_tap','calc_show','pen','steeple','notepad','stopwatch'],6)
SR=44100
def w(name,x):
    d=(np.clip(x,-1,1)*32767*0.8).astype(np.int16)
    with wave.open(P+'/sfx/'+name,'wb') as fh: fh.setnchannels(1);fh.setsampwidth(2);fh.setframerate(SR);fh.writeframes(d.tobytes())
t=lambda s: np.arange(int(SR*s))/SR
def note(fr,d,dec=6):
    tt=t(d); return (np.sin(2*np.pi*fr*tt)+0.3*np.sin(2*np.pi*2*fr*tt))*np.exp(-dec*tt)
bar=np.concatenate([note(a,b) for a,b in [(988,.12),(1319,.12),(1568,.12),(1319,.12),(988,.12),(1319,.3)]]); gap=np.zeros(int(SR*.25))
w('ring.wav',np.concatenate([bar,gap,bar,gap,bar])*0.6)
pt=t(.09); w('pop.wav',np.sin(2*np.pi*(600+2500*pt)*pt)*np.exp(-45*pt))
w('answer.wav',np.concatenate([note(880,.1,20),note(1320,.15,15)]))
z=np.zeros(int(SR*.08)); w('hangup.wav',np.concatenate([note(620,.18,4),z,note(620,.18,4),z,note(620,.18,4)]))
print('assets ok')
