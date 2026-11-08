import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
hero_path = os.path.join(base, "amr_master_hero.png")
im = Image.open(hero_path)
w, h = im.size
print(f"Loaded {hero_path}: {w}x{h}, mode: {im.mode}")

arr = np.array(im)
rgb = arr[:, :, :3]
alpha = arr[:, :, 3]

# 1. Let's find where the bust of Taha Hussein is located
# The bust of Taha Hussein is usually a sculpted bust/head (like a bronze, stone, or grayscale statue)
# Or in Arabic literary imagery, Taha Hussein is wearing his famous round dark sunglasses!
# Let's check grayscale-ish regions in the image that are not background!
# Grayscale means R ~ G ~ B (|R-G| < 15, |G-B| < 15, |R-B| < 15)
is_gray = (alpha > 100) & (np.abs(rgb[:, :, 0].astype(int) - rgb[:, :, 1].astype(int)) < 15) & (np.abs(rgb[:, :, 1].astype(int) - rgb[:, :, 2].astype(int)) < 15)
print(f"Total gray pixels: {is_gray.sum()}")

# Where are these gray pixels distributed?
gy, gx = np.where(is_gray)
print(f"Gray pixels span: x=[{gx.min()}, {gx.max()}], y=[{gy.min()}, {gy.max()}]")

# Let's look at the left side vs right side
# If x < 350 vs x >= 350
left_gray = is_gray[:, :350]
right_gray = is_gray[:, 350:]
print(f"Left gray pixels (<350): {left_gray.sum()}, Right gray pixels (>=350): {right_gray.sum()}")

if left_gray.sum() > 0:
    lgy, lgx = np.where(left_gray)
    print(f"Left gray bounding box: x=[{lgx.min()}, {lgx.max()}], y=[{lgy.min()}, {lgy.max()}]")

if right_gray.sum() > 0:
    rgy, rgx = np.where(right_gray)
    rgx += 350
    print(f"Right gray bounding box: x=[{rgx.min()}, {rgx.max()}], y=[{rgy.min()}, {rgy.max()}]")

# Let's inspect the black box mentioned in user request:
# "an ugly black rectangle around the bust of Taha Hussein."
# "Where does the rectangular black bounding box around the bust of Taha Hussein come from?"
# Let's check near-black pixels:
is_near_black = (alpha > 50) & (rgb[:, :, 0] < 30) & (rgb[:, :, 1] < 30) & (rgb[:, :, 2] < 30)
by, bx = np.where(is_near_black)
print(f"\nNear-black pixels (RGB < 30, alpha > 50): count = {is_near_black.sum()}")
print(f"Near-black bounds: x=[{bx.min()}, {bx.max()}], y=[{by.min()}, {by.max()}]")

# Let's check if there is a rectangular edge of black pixels!
# A black bounding box will have straight horizontal or vertical lines of black pixels!
# Let's check row by row:
print("\nChecking for straight black lines (horizontal edges):")
for y in range(h):
    row_black = is_near_black[y, :]
    # contiguous run of black pixels
    runs = []
    current_run = 0
    for x in range(w):
        if row_black[x]:
            current_run += 1
        else:
            if current_run > 0:
                runs.append((x - current_run, x - 1, current_run))
                current_run = 0
    if current_run > 0:
        runs.append((w - current_run, w - 1, current_run))
    for start, end, length in runs:
        if length > 80: # Long contiguous black segment!
            print(f"y={y:3}: long black horizontal segment from x={start} to x={end} (len={length})")

print("\nChecking for straight black lines (vertical edges):")
for x in range(w):
    col_black = is_near_black[:, x]
    runs = []
    current_run = 0
    for y in range(h):
        if col_black[y]:
            current_run += 1
        else:
            if current_run > 0:
                runs.append((y - current_run, y - 1, current_run))
                current_run = 0
    if current_run > 0:
        runs.append((h - current_run, h - 1, current_run))
    for start, end, length in runs:
        if length > 80: # Long contiguous black segment!
            print(f"x={x:3}: long black vertical segment from y={start} to y={end} (len={length})")
