import os
from PIL import Image
import numpy as np

def analyze_image(path, name):
    print(f"\n==================== {name} ====================")
    if not os.path.exists(path):
        print(f"Path does not exist: {path}")
        return
    im = Image.open(path)
    print(f"Format: {im.format}, Mode: {im.mode}, Size: {im.size}")
    arr = np.array(im)
    print(f"Shape: {arr.shape}, Dtype: {arr.dtype}")
    
    if im.mode == "RGBA":
        alpha = arr[:, :, 3]
        rgb = arr[:, :, :3]
        print(f"Alpha range: [{alpha.min()}, {alpha.max()}]")
        
        # Check edges of non-zero alpha
        # Find semi-transparent pixels
        semi_mask = (alpha > 0) & (alpha < 255)
        print(f"Semi-transparent pixel count: {semi_mask.sum()}")
        if semi_mask.sum() > 0:
            semi_rgb = rgb[semi_mask]
            print(f"Semi-trans pixels mean RGB: {semi_rgb.mean(axis=0)}")
            # How many semi-transparent pixels are bright white (e.g. > 200)?
            bright_white = (semi_rgb[:, 0] > 200) & (semi_rgb[:, 1] > 200) & (semi_rgb[:, 2] > 200)
            print(f"Bright white (>200) in semi-trans pixels: {bright_white.sum()} ({bright_white.mean()*100:.1f}%)")
            
        # Check near-black pixels with full or near-full alpha
        black_box_mask = (alpha > 200) & (rgb[:, :, 0] < 20) & (rgb[:, :, 1] < 20) & (rgb[:, :, 2] < 20)
        print(f"Near-black pixels with high alpha count: {black_box_mask.sum()}")
        
    elif im.mode == "RGB":
        rgb = arr
        print(f"RGB min: {rgb.min(axis=(0,1))}, max: {rgb.max(axis=(0,1))}, mean: {rgb.mean(axis=(0,1))}")

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
imgs_to_check = [
    (os.path.join(base, "assets", "amr_master_hero.png"), "assets/amr_master_hero.png"),
    (os.path.join(base, "assets", "hero_illustration.png"), "assets/hero_illustration.png"),
    (os.path.join(base, "assets", "amr_hero_composite.png"), "assets/amr_hero_composite.png"),
    (os.path.join(base, "assets", "amr_hero.png"), "assets/amr_hero.png"),
    (os.path.join(base, "assets", "amr_hero_designed.png"), "assets/amr_hero_designed.png"),
    (os.path.join(base, "assets", "amr_teacher_cutout_clean.png"), "assets/amr_teacher_cutout_clean.png"),
    (os.path.join(base, "assets", "amr_teacher_figure.png"), "assets/amr_teacher_figure.png"),
    (os.path.join(base, "assets", "amr_teacher_suit_clean.png"), "assets/amr_teacher_suit_clean.png"),
    (os.path.join(base, "extracted", "hero_illustration.png"), "extracted/hero_illustration.png"),
    (os.path.join(base, "extracted", "hero_composition.png"), "extracted/hero_composition.png"),
    (os.path.join(base, "extracted", "hero_teacher_full.png"), "extracted/hero_teacher_full.png"),
]

for p, n in imgs_to_check:
    analyze_image(p, n)
