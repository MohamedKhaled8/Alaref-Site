import os
import sys
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
out_dir = r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1"

im = Image.open(os.path.join(base, "amr_master_hero.png"))
w, h = im.size
print(f"Loaded amr_master_hero.png: {w}x{h}, mode={im.mode}")

# Let's save crops to analyze
# 1. Left side (Taha Hussein bust & black box)
# In our earlier scan:
# Left dark bounding box: x=[135, 374], y=[67, 710]
bust_crop = im.crop((100, 50, 400, 750))
bust_crop.save(os.path.join(out_dir, "crop_bust.png"))
print("Saved crop_bust.png")

# 2. Right side (Teacher cutout)
# In our earlier scan:
# Teacher cutout positioned at x=154, y=53; teacher_clean size: 439x811
# In master_hero (751x785):
# teacher span x ~ [154..593], y ~ [53..785]
teacher_crop = im.crop((300, 40, 720, 780))
teacher_crop.save(os.path.join(out_dir, "crop_teacher.png"))
print("Saved crop_teacher.png")

# 3. Whole composite saved as non-transparent over white and over dark background
# To see exactly what the user sees!
# Composite over white:
bg_white = Image.new("RGB", (w, h), (255, 255, 255))
bg_white.paste(im, (0, 0), im)
bg_white.save(os.path.join(out_dir, "composite_on_white.png"))

# Composite over dark theme background (#111625 / RGB: 17, 22, 37)
bg_dark = Image.new("RGB", (w, h), (17, 22, 37))
bg_dark.paste(im, (0, 0), im)
bg_dark.save(os.path.join(out_dir, "composite_on_dark.png"))
print("Saved composite_on_white.png and composite_on_dark.png")
