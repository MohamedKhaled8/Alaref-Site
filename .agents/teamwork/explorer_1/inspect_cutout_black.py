import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
black_p = os.path.join(base, "amr_cutout_black.png")
im = Image.open(black_p)
arr = np.array(im)
print("amr_cutout_black.png size:", im.size)
a = arr[:, :, 3]
rgb = arr[:, :, :3]

# Where is alpha > 0?
y_idx, x_idx = np.where(a > 0)
print(f"Alpha > 0 span: x=[{x_idx.min()}..{x_idx.max()}], y=[{y_idx.min()}..{y_idx.max()}]")

# What is inside this region?
crop = im.crop((x_idx.min(), y_idx.min(), x_idx.max()+1, y_idx.max()+1))
crop.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\cutout_black_crop.png")
print("Saved cutout_black_crop.png")

# Let's inspect non-black pixels in this region
sub = arr[y_idx.min():y_idx.max()+1, x_idx.min():x_idx.max()+1]
sub_a = sub[:, :, 3]
sub_rgb = sub[:, :, :3]

is_opaque = sub_a > 100
is_black = is_opaque & (sub_rgb[:, :, 0] < 25) & (sub_rgb[:, :, 1] < 25) & (sub_rgb[:, :, 2] < 25)
is_bright = is_opaque & ((sub_rgb[:, :, 0] > 60) | (sub_rgb[:, :, 1] > 60) | (sub_rgb[:, :, 2] > 60))
print(f"Total opaque in cutout_black: {is_opaque.sum()}")
print(f"Black pixels: {is_black.sum()} ({is_black.mean()*100:.1f}%)")
print(f"Bright pixels: {is_bright.sum()} ({is_bright.mean()*100:.1f}%)")
if is_bright.sum() > 0:
    print(f"Bright mean RGB: {sub_rgb[is_bright].mean(axis=0).astype(int)}")
