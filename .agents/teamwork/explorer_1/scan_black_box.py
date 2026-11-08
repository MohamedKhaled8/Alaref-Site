import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
im_paths = [
    os.path.join(base, "extracted", "hero_teacher_full.png"),
    os.path.join(base, "extracted", "hero_illustration.png"),
    os.path.join(base, "extracted", "hero_composition.png"),
    os.path.join(base, "assets", "amr_master_hero.png"),
    os.path.join(base, "assets", "hero_illustration.png"),
    os.path.join(base, "assets", "amr_hero_composite.png"),
    os.path.join(base, "assets", "amr_teacher_cutout_clean.png"),
    os.path.join(base, "assets", "amr_cutout_black.png"),
    os.path.join(base, "assets", "amr_cutout_door.png"),
]

# Let's inspect where black boxes exist in each image
for p in im_paths:
    if not os.path.exists(p):
        continue
    im = Image.open(p)
    arr = np.array(im)
    name = os.path.basename(p)
    parent = os.path.basename(os.path.dirname(p))
    print(f"\nScanning {parent}/{name} ({im.size}, {im.mode})...")
    
    # Detect near-black rectangular regions
    # Convert to grayscale
    if im.mode == "RGBA":
        rgb = arr[:, :, :3]
        alpha = arr[:, :, 3]
        gray = np.mean(rgb, axis=2)
        # visible black pixels
        black_pixels = (alpha > 128) & (gray < 25)
    else:
        gray = np.mean(arr[:, :, :3], axis=2)
        black_pixels = gray < 25
        
    print(f"Total black pixels (<25): {black_pixels.sum()}")
    if black_pixels.sum() > 0:
        # Check rows and cols
        row_counts = black_pixels.sum(axis=1)
        col_counts = black_pixels.sum(axis=0)
        # find where row_counts > 20
        active_rows = np.where(row_counts > 20)[0]
        active_cols = np.where(col_counts > 20)[0]
        if len(active_rows) > 0 and len(active_cols) > 0:
            print(f"Black region y-span: [{active_rows.min()}, {active_rows.max()}], x-span: [{active_cols.min()}, {active_cols.max()}]")
            # Let's print bounding box dimensions
            print(f"Black box size: {active_cols.max() - active_cols.min() + 1}w x {active_rows.max() - active_rows.min() + 1}h")
