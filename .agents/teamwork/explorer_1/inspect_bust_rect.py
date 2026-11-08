import os
from PIL import Image
import numpy as np

p = r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\crop_bust.png"
im = Image.open(p)
arr = np.array(im)
w, h = im.size
print("crop_bust size:", w, h)

# What are the pixel values?
rgb = arr[:, :, :3]
alpha = arr[:, :, 3]

# In crop_bust.png, what is the image content?
# Let's inspect rows and columns of black rectangle:
# Note that crop_bust was taken from x=[100..400], y=[50..750] of amr_master_hero.png
# Let's find exactly the rectangle corners in crop_bust:
is_black = (alpha > 200) & (rgb[:, :, 0] < 20) & (rgb[:, :, 1] < 20) & (rgb[:, :, 2] < 20)
print(f"Total black pixels in bust crop: {is_black.sum()}")

# Where is this black block?
by, bx = np.where(is_black)
if len(by) > 0:
    print(f"Black block in bust crop: x=[{bx.min()}, {bx.max()}], y=[{by.min()}, {by.max()}]")
    print(f"Corresponds in master_hero to: x=[{bx.min()+100}, {bx.max()+100}], y=[{by.min()+50}, {by.max()+50}]")

# Let's check what is INSIDE or SURROUNDING this black block:
# What are the non-black pixels inside x=[bx.min()..bx.max()], y=[by.min()..by.max()]?
sub = arr[by.min():by.max()+1, bx.min():bx.max()+1]
sub_rgb = sub[:, :, :3]
sub_a = sub[:, :, 3]
non_black = (sub_rgb[:, :, 0] > 30) | (sub_rgb[:, :, 1] > 30) | (sub_rgb[:, :, 2] > 30)
print(f"Non-black pixels within the bounding box: {non_black.sum()} out of {sub.shape[0]*sub.shape[1]}")

# What does the content inside look like?
if non_black.sum() > 0:
    nb_rgb = sub_rgb[non_black]
    print(f"Non-black mean RGB: {nb_rgb.mean(axis=0).astype(int)}")
    print(f"Non-black min RGB: {nb_rgb.min(axis=0)}, max RGB: {nb_rgb.max(axis=0)}")
