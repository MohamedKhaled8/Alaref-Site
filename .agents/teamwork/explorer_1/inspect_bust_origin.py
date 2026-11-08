import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
master_im = Image.open(os.path.join(base, "assets", "amr_master_hero.png"))
teacher_im = Image.open(os.path.join(base, "assets", "amr_teacher_cutout_clean.png"))
ext_im = Image.open(os.path.join(base, "extracted", "hero_illustration.png"))

master = np.array(master_im)
ext = np.array(ext_im)
teacher = np.array(teacher_im)

print("master shape:", master.shape)
print("ext shape:", ext.shape)
print("teacher shape:", teacher.shape)

# Let's inspect the rectangular edges in master
# At x=211, y in [125..711]:
# What is to the left of x=211?
print("Master RGB at x=210, y=300:", master[300, 210])
print("Master RGB at x=211, y=300:", master[300, 211])
print("Master RGB at x=212, y=300:", master[300, 212])

# Let's inspect vertical slice along x=211
slice_210 = master[150:650, 210, :3]
slice_211 = master[150:650, 211, :3]
print("Slice x=210 mean RGB:", slice_210.mean(axis=0))
print("Slice x=211 mean RGB:", slice_211.mean(axis=0))

# What is at the top border? y=125:
print("Master RGB at y=124, x=300:", master[124, 300])
print("Master RGB at y=125, x=300:", master[125, 300])

# Let's check what is in ext at the same coordinates!
# Is ext identical to this region?
# Let's compare master[125:711, 211:400, :3] with ext
# Where does it match in ext?
import cv2
patch = master[200:300, 220:320, :3]
res = cv2.matchTemplate(ext, patch, cv2.TM_SQDIFF_NORMED)
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
print(f"Match of bust in ext: {min_loc} with SQDIFF={min_val:.5f}")
print(f"Offset from ext: x={min_loc[0] - 220}, y={min_loc[1] - 200}")
