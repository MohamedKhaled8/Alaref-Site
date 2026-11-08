import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\extracted"
ext_files = ["hero_illustration.png", "hero_teacher_full.png", "hero_composition.png", "promo_banner.png", "promo_poster.png"]

for ef in ext_files:
    p = os.path.join(base, ef)
    if os.path.exists(p):
        im = Image.open(p)
        print(f"\nExtracted file: {ef}, size={im.size}, mode={im.mode}")
        arr = np.array(im)
        # Check if there are distinct elements:
        # Taha Hussein statue is usually a sculpted bust (Dean of Arabic Literature).
        # Let's inspect where grayscale statue features are:
        # Check where saturation is very low (< 0.1) but brightness is moderate (50..200)
        # Convert RGB to HSV
        import cv2
        hsv = cv2.cvtColor(arr[:, :, :3], cv2.COLOR_RGB2HSV)
        s = hsv[:, :, 1]
        v = hsv[:, :, 2]
        statue_mask = (s < 30) & (v > 40) & (v < 220)
        print(f"Low-saturation pixels (statue/bust like): {statue_mask.sum()}")
        if statue_mask.sum() > 500:
            sy, sx = np.where(statue_mask)
            print(f"Statue-like pixels bounds: x=[{sx.min()}..{sx.max()}], y=[{sy.min()}..{sy.max()}]")
