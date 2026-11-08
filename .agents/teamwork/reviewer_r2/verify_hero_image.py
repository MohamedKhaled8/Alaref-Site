import numpy as np
from PIL import Image

path = r"study-buddy-sim/public/assets/amr_master_hero.png"
img = Image.open(path)
arr = np.array(img)
h, w, c = arr.shape
print(f"Hero Image: shape={arr.shape}, mode={img.mode}")

# 1. Check sky blue pixels
# Sky blue characteristic: high Blue, noticeably higher than Red
sky_blue = (arr[:, :, 2] > 140) & (arr[:, :, 2].astype(int) > arr[:, :, 0].astype(int) + 25) & (arr[:, :, 3] > 30)
sky_count = np.sum(sky_blue)
print(f"Sky blue pixels (B>140, B>R+25, A>30): {sky_count}")

# 2. Check transition zone fringe
trans = (arr[:, :, 3] > 0) & (arr[:, :, 3] < 240)
steel_blue_fringe = trans & sky_blue
white_fringe = trans & (arr[:, :, 0] > 180) & (arr[:, :, 1] > 180) & (arr[:, :, 2] > 180)
print(f"Steel-blue fringe pixels: {np.sum(steel_blue_fringe)}")
print(f"White fringe pixels: {np.sum(white_fringe)}")

# 3. Check armpit region (around x=240..270, y=230..270)
armpit = arr[230:270, 240:270]
print(f"Armpit box mean RGB: {armpit[:, :, :3].mean(axis=(0, 1))}")
print(f"Armpit box min/max B: min={armpit[:, :, 2].min()}, max={armpit[:, :, 2].max()}")

# 4. Check burgundy disc color
# #753b47 is hex(117, 59, 71)
disc_sample = arr[150:180, 360:400]
print(f"Disc sample mean RGB: {disc_sample[:, :, :3].mean(axis=(0, 1))}")

# 5. Check disc geometry and centering
# Find disc pixels (alpha > 0 outside cutout, or burgundy color)
burgundy_mask = (arr[:, :, 0] > 80) & (arr[:, :, 0] < 150) & (arr[:, :, 1] > 40) & (arr[:, :, 1] < 85) & (arr[:, :, 2] > 50) & (arr[:, :, 2] < 95)
by, bx = np.where(burgundy_mask)
print(f"Burgundy disc x range: [{bx.min()}, {bx.max()}], center_x = {(bx.min() + bx.max())/2:.1f} (canvas width is {w}, center is {w/2})")
print(f"Burgundy disc y range: [{by.min()}, {by.max()}], center_y = {(by.min() + by.max())/2:.1f}")

# 6. Check concentric rings
# Concentric rings are thin brighter/semi-transparent circles on or outside the disc
outer_rings = (arr[:, :, 3] > 0) & ~burgundy_mask & (arr[:, :, 0] > 70) & (arr[:, :, 1] > 30)
print(f"Ring / peripheral decorative alpha pixels: {np.sum(outer_rings)}")

# 7. Check for secondary ghost figures
# Search for any discolored face or silhouette behind teacher
# In worker 1's flawed composite, a second face was visible to the right or left of Mr. Amr
# Let's inspect the bounding box of high-alpha pixels and slices across the canvas
alpha_mask = arr[:, :, 3] > 50
ay, ax = np.where(alpha_mask)
print(f"Overall composite bounding box: x in [{ax.min()}, {ax.max()}], y in [{ay.min()}, {ay.max()}]")
