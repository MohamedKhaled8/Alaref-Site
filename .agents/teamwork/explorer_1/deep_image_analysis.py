import os
from PIL import Image
import numpy as np

def inspect_image_features(path, label):
    print(f"\n==========================================")
    print(f"ANALYSIS: {label}")
    print(f"Path: {path}")
    if not os.path.exists(path):
        print("DOES NOT EXIST")
        return
    im = Image.open(path)
    w, h = im.size
    print(f"Dimensions: {w} x {h}, Mode: {im.mode}")
    arr = np.array(im)
    
    # If RGBA, inspect RGB in opaque vs semi-transparent areas
    if im.mode == "RGBA":
        a = arr[:, :, 3]
        rgb = arr[:, :, :3]
        
        # 1. Check transparency
        opaque_mask = a > 250
        semi_mask = (a > 5) & (a <= 250)
        trans_mask = a <= 5
        print(f"Pixels: total={w*h}, opaque={opaque_mask.sum()} ({opaque_mask.mean()*100:.1f}%), semi={semi_mask.sum()} ({semi_mask.mean()*100:.1f}%), trans={trans_mask.sum()} ({trans_mask.mean()*100:.1f}%)")
        
        # 2. Check outer edge fringe (semi-transparent pixels right at transition)
        # Find pixels where a > 0 but neighboring a == 0
        from scipy.ndimage import binary_dilation
        trans_dilated = binary_dilation(trans_mask, iterations=2)
        edge_mask = (a > 10) & trans_dilated
        print(f"Edge transition pixels count: {edge_mask.sum()}")
        if edge_mask.sum() > 0:
            edge_rgb = rgb[edge_mask]
            print(f"Edge transition mean RGB: {edge_rgb.mean(axis=0).astype(int)}")
            # Check how many edge transition pixels are near white (R>180, G>180, B>180)
            white_fringe = (edge_rgb[:, 0] > 180) & (edge_rgb[:, 1] > 180) & (edge_rgb[:, 2] > 180)
            print(f"Edge pixels with white fringe (>180): {white_fringe.sum()} ({white_fringe.mean()*100:.1f}%)")
            # Check edge pixels with gray fringe (R>140, G>140, B>140)
            gray_fringe = (edge_rgb[:, 0] > 140) & (edge_rgb[:, 1] > 140) & (edge_rgb[:, 2] > 140)
            print(f"Edge pixels with light/gray fringe (>140): {gray_fringe.sum()} ({gray_fringe.mean()*100:.1f}%)")

        # 3. Check for rectangular bounding boxes (e.g. Taha Hussein bust or black box)
        # Where are very dark pixels (RGB < 30) with opaque alpha?
        black_opaque = opaque_mask & (rgb[:, :, 0] < 35) & (rgb[:, :, 1] < 35) & (rgb[:, :, 2] < 35)
        print(f"Opaque black pixels count (<35): {black_opaque.sum()}")
        if black_opaque.sum() > 100:
            y_indices, x_indices = np.where(black_opaque)
            print(f"Opaque black pixel bounding box: x=[{x_indices.min()}, {x_indices.max()}], y=[{y_indices.min()}, {y_indices.max()}] (size {x_indices.max()-x_indices.min()+1} x {y_indices.max()-y_indices.min()+1})")
            
        # 4. Check for Burgundy Disc (#753b47 -> RGB ~ [117, 59, 71])
        # tolerance +/- 30
        burgundy_mask = (np.abs(rgb[:, :, 0] - 117) < 35) & (np.abs(rgb[:, :, 1] - 59) < 35) & (np.abs(rgb[:, :, 2] - 71) < 35)
        print(f"Burgundy-like pixels (~#753b47): {burgundy_mask.sum()}")
        if burgundy_mask.sum() > 100:
            by, bx = np.where(burgundy_mask)
            print(f"Burgundy region bounding box: x=[{bx.min()}, {bx.max()}], y=[{by.min()}, {by.max()}] (size {bx.max()-bx.min()+1} x {by.max()-by.min()+1})")
            
    elif im.mode == "RGB":
        rgb = arr
        # Check burgundy
        burgundy_mask = (np.abs(rgb[:, :, 0] - 117) < 35) & (np.abs(rgb[:, :, 1] - 59) < 35) & (np.abs(rgb[:, :, 2] - 71) < 35)
        print(f"Burgundy-like pixels (~#753b47): {burgundy_mask.sum()}")
        if burgundy_mask.sum() > 100:
            by, bx = np.where(burgundy_mask)
            print(f"Burgundy region bounding box: x=[{bx.min()}, {bx.max()}], y=[{by.min()}, {by.max()}] (size {bx.max()-bx.min()+1} x {by.max()-by.min()+1})")

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
inspect_image_features(os.path.join(base, "assets", "amr_master_hero.png"), "amr_master_hero.png")
inspect_image_features(os.path.join(base, "assets", "amr_hero_composite.png"), "amr_hero_composite.png")
inspect_image_features(os.path.join(base, "assets", "amr_teacher_cutout_clean.png"), "amr_teacher_cutout_clean.png")
inspect_image_features(os.path.join(base, "assets", "amr_teacher_figure.png"), "amr_teacher_figure.png")
inspect_image_features(os.path.join(base, "assets", "amr_cutout_door.png"), "amr_cutout_door.png")
inspect_image_features(os.path.join(base, "extracted", "hero_teacher_full.png"), "extracted/hero_teacher_full.png")
inspect_image_features(os.path.join(base, "extracted", "hero_illustration.png"), "extracted/hero_illustration.png")
inspect_image_features(os.path.join(base, "extracted", "hero_composition.png"), "extracted/hero_composition.png")
