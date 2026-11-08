import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"

files = [
    "amr_teacher_cutout_clean.png",
    "amr_teacher_figure.png",
    "amr_teacher_suit_clean.png",
    "amr_cutout_suit.png",
    "amr_cutout_black.png",
    "amr_cutout_door.png",
    "amr_hero.png",
    "amr_hero_composite.png",
    "amr_master_hero.png",
]

for f in files:
    fp = os.path.join(base, f)
    if os.path.exists(fp):
        im = Image.open(fp)
        arr = np.array(im)
        print(f"\n--- {f} ---")
        print(f"Size: {im.size}, Mode: {im.mode}")
        if im.mode == "RGBA":
            a = arr[:, :, 3]
            rgb = arr[:, :, :3]
            # bounding box of non-zero alpha
            nz_y, nz_x = np.where(a > 0)
            if len(nz_y) > 0:
                print(f"Alpha bbox: x=[{nz_x.min()}, {nz_x.max()}], y=[{nz_y.min()}, {nz_y.max()}] ({nz_x.max()-nz_x.min()+1}x{nz_y.max()-nz_y.min()+1})")
            # Mean color of opaque pixels
            op_mask = a > 200
            if op_mask.sum() > 0:
                print(f"Opaque mean RGB: {rgb[op_mask].mean(axis=0).astype(int)}")
