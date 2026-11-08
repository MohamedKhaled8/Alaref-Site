import os
from PIL import Image
import numpy as np

def describe_composition(path, name):
    print(f"\n==================== DETAIL: {name} ====================")
    im = Image.open(path)
    w, h = im.size
    print(f"Size: {w}x{h}, Mode: {im.mode}")
    arr = np.array(im)
    
    # If RGBA, where is it non-transparent?
    if im.mode == "RGBA":
        a = arr[:, :, 3]
        rows = np.where(a > 10)[0]
        cols = np.where(a > 10)[1]
        if len(rows) > 0:
            print(f"Non-transparent bounds: y=[{rows.min()}, {rows.max()}], x=[{cols.min()}, {cols.max()}]")
        else:
            print("Completely transparent!")
            return
            
        # Let's inspect where there are dark / black regions, colored regions, etc.
        rgb = arr[:, :, :3]
        # Check center region vs edges
        print(f"Sample center pixel RGBA: {arr[h//2, w//2]}")
        # Let's find dominant colors in opaque regions
        opaque = arr[a > 128]
        print(f"Opaque pixels count: {len(opaque)}")
        
    elif im.mode == "RGB":
        rgb = arr
        print(f"Sample center pixel RGB: {arr[h//2, w//2]}")

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
for f in ["assets/amr_master_hero.png", "assets/amr_hero_composite.png", "assets/amr_cutout_suit.png", "assets/amr_cutout_black.png", "assets/amr_cutout_door.png", "extracted/hero_illustration.png", "extracted/hero_composition.png", "extracted/hero_teacher_full.png"]:
    p = os.path.join(base, f.replace("/", "\\"))
    if os.path.exists(p):
        describe_composition(p, f)
