import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
master_im = Image.open(os.path.join(base, "amr_master_hero.png"))
arr = np.array(master_im)

# Let's inspect where there are sharp transitions or near-black borders in master_hero
# Let's find all pixels in master_hero where RGB < 25 and alpha == 255
dark_mask = (arr[:, :, 0] < 25) & (arr[:, :, 1] < 25) & (arr[:, :, 2] < 25) & (arr[:, :, 3] == 255)

# Let's check gradient of darkness (so we can detect sharp rectangular edges)
# In vertical direction:
v_diff = np.abs(np.diff(dark_mask.astype(int), axis=0))
# In horizontal direction:
h_diff = np.abs(np.diff(dark_mask.astype(int), axis=1))

print("Horizontal line candidates (sudden dark on/off across width):")
for y in range(v_diff.shape[0]):
    row = v_diff[y, :]
    if row.sum() > 40:
        x_idxs = np.where(row > 0)[0]
        # check contiguous span
        print(f"y={y}: {row.sum()} transition pixels, x=[{x_idxs.min()}..{x_idxs.max()}]")

print("\nVertical line candidates (sudden dark on/off across height):")
for x in range(h_diff.shape[1]):
    col = h_diff[:, x]
    if col.sum() > 40:
        y_idxs = np.where(col > 0)[0]
        print(f"x={x}: {col.sum()} transition pixels, y=[{y_idxs.min()}..{y_idxs.max()}]")
