from PIL import Image
import numpy as np

im = Image.open(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\reference_hero_crop.png")
print("Reference crop size:", im.size)
arr = np.array(im)

# Let's inspect the prominent color zones in this crop
# 1. Background color:
bg_sample = arr[10, 10]
print("Top-left sample RGB:", bg_sample)

# 2. Burgundy disc: where is #753b47 or #6d3d48?
# Let's find coordinates of burgundy circle
mask_burgundy = (np.abs(arr[:, :, 0] - 109) < 25) & (np.abs(arr[:, :, 1] - 61) < 25) & (np.abs(arr[:, :, 2] - 72) < 25)
print("Burgundy pixel count in reference:", mask_burgundy.sum())
if mask_burgundy.sum() > 0:
    by, bx = np.where(mask_burgundy)
    print(f"Burgundy disc center ~ ({int(bx.mean())}, {int(by.mean())}), radius ~ {int((bx.max()-bx.min())/2)}")

# 3. What objects are on top of the burgundy disc?
# Let's inspect where there is a teacher and where there is a bust
# In El-Ameed:
# Mr. Mohamed El-Ameed / Amr Aref is the teacher in a suit.
# Next to him is the bust of Taha Hussein!
