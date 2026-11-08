import os
import cv2
import numpy as np
from PIL import Image

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
black_p = os.path.join(base, "amr_cutout_black.png")
im = Image.open(black_p)
arr = np.array(im)
w, h = im.size

# Let's crop just the non-zero area
a = arr[:, :, 3]
y_idx, x_idx = np.where(a > 0)
crop = arr[y_idx.min():y_idx.max()+1, x_idx.min():x_idx.max()+1].copy()

crop_a = crop[:, :, 3]
crop_rgb = crop[:, :, :3]

# The bust is bronze/terracotta/tan:
# Let's inspect where the bust pixels are:
# Bronze bust: R > 50, G > 35, B > 25, R > G and G > B (warm bronze tone)
# Near black pixels: RGB < 25
# Let's check:
is_black = (crop_rgb[:, :, 0] < 30) & (crop_rgb[:, :, 1] < 30) & (crop_rgb[:, :, 2] < 30)
print(f"Bust crop size: {crop.shape[1]}x{crop.shape[0]}")
print(f"Black pixels in bust crop: {is_black.sum()}")

# Mask out black pixels: set alpha = 0 where is_black is True!
cleaned_crop = crop.copy()
# Smooth feathering:
# Alpha becomes 0 for black pixels, with a soft transition
dist_from_black = cv2.distanceTransform((~is_black).astype(np.uint8), cv2.DIST_L2, 3)
# Where dist is 0 -> alpha = 0
# Where dist is 1..3 -> soft blend
feathered_alpha = np.clip(dist_from_black * 85, 0, 255).astype(np.uint8)
cleaned_crop[:, :, 3] = np.minimum(crop_a, feathered_alpha)

# Save cleaned bust
out_im = Image.fromarray(cleaned_crop)
out_im.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\taha_bust_cleaned.png")
print("Saved taha_bust_cleaned.png")

# Composite on burgundy
bg = Image.new("RGBA", out_im.size, (117, 59, 71, 255))
bg.alpha_composite(out_im)
bg.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\taha_bust_on_burgundy.png")
print("Saved taha_bust_on_burgundy.png")
