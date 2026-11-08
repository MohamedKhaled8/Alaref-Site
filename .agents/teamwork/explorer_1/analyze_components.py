import os
from PIL import Image
import numpy as np

def analyze_components(image_path, out_name):
    print(f"\n==================== COMPONENTS OF {out_name} ====================")
    im = Image.open(image_path)
    w, h = im.size
    print(f"Size: {w}x{h}, Mode: {im.mode}")
    arr = np.array(im)
    
    # Let's inspect quadrants or horizontal bands
    # Let's divide into left half and right half
    # In RTL, teacher might be on right or left, Taha Hussein on the other
    left_arr = arr[:, :w//2]
    right_arr = arr[:, w//2:]
    
    print(f"Left half shape: {left_arr.shape}, Right half shape: {right_arr.shape}")
    
    # Check what objects or features exist
    # If RGBA:
    if im.mode == "RGBA":
        a = arr[:, :, 3]
        rgb = arr[:, :, :3]
        print(f"Left half opaque pixels: {(left_arr[:, :, 3] > 200).sum()}")
        print(f"Right half opaque pixels: {(right_arr[:, :, 3] > 200).sum()}")
        
        # Where are very dark pixels on left vs right?
        left_dark = (left_arr[:, :, 3] > 200) & (np.mean(left_arr[:, :, :3], axis=2) < 40)
        right_dark = (right_arr[:, :, 3] > 200) & (np.mean(right_arr[:, :, :3], axis=2) < 40)
        print(f"Left dark pixels: {left_dark.sum()}, Right dark pixels: {right_dark.sum()}")
        
        # Check coordinates of left dark pixels
        if left_dark.sum() > 0:
            ly, lx = np.where(left_dark)
            print(f"Left dark bounding box: x=[{lx.min()}, {lx.max()}], y=[{ly.min()}, {ly.max()}]")
            
        # Check coordinates of right dark pixels
        if right_dark.sum() > 0:
            ry, rx = np.where(right_dark)
            rx += w//2
            print(f"Right dark bounding box: x=[{rx.min()}, {rx.max()}], y=[{ry.min()}, {ry.max()}]")

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
analyze_components(os.path.join(base, "assets", "amr_master_hero.png"), "amr_master_hero.png")
analyze_components(os.path.join(base, "extracted", "hero_teacher_full.png"), "hero_teacher_full.png")
analyze_components(os.path.join(base, "extracted", "hero_illustration.png"), "hero_illustration.png")
