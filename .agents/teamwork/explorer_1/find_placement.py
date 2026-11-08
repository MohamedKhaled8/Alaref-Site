import os
import cv2
import numpy as np
from PIL import Image

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
master_im = Image.open(os.path.join(base, "amr_master_hero.png"))
teacher_im = Image.open(os.path.join(base, "amr_teacher_cutout_clean.png"))

master_np = np.array(master_im)
teacher_np = np.array(teacher_im)

print("master_hero:", master_np.shape)
print("teacher_clean:", teacher_np.shape)

# Let's find placement of teacher_clean in master_hero using template match on opaque pixels
# crop a 100x100 patch from teacher face/suit where alpha is 255
patch = teacher_np[150:250, 150:250, :3]
res = cv2.matchTemplate(master_np[:, :, :3], patch, cv2.TM_SQDIFF_NORMED)
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
print(f"Teacher patch match at: {min_loc} with SQDIFF_NORMED={min_val:.4f}")
print(f"Teacher cutout position in master_hero: x={min_loc[0] - 150}, y={min_loc[1] - 150}")

# Now let's check extracted/hero_teacher_full.png vs master_hero
ext_path = os.path.join(r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\extracted", "hero_teacher_full.png")
if os.path.exists(ext_path):
    ext_im = Image.open(ext_path)
    ext_np = np.array(ext_im)
    print("hero_teacher_full shape:", ext_np.shape)
    patch_ext = ext_np[100:200, 100:200, :3]
    res_ext = cv2.matchTemplate(master_np[:, :, :3], patch_ext, cv2.TM_SQDIFF_NORMED)
    min_v, max_v, min_l, max_l = cv2.minMaxLoc(res_ext)
    print(f"ext patch match at: {min_l} with SQDIFF_NORMED={min_v:.4f}")

# Let's inspect the entire composition of amr_master_hero.png:
# Where does each layer lie?
# We have:
# 1. Background Burgundy Disc
# 2. Concentric Rings
# 3. Taha Hussein bust
# 4. Amr Aref cutout
# Let's detect each one!
