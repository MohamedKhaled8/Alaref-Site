import os
import cv2
import numpy as np
from PIL import Image

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
teacher_p = os.path.join(base, "amr_teacher_cutout_clean.png")

im = Image.open(teacher_p)
arr = np.array(im)
rgb = arr[:, :, :3].copy()
alpha = arr[:, :, 3].copy()

# 1. Identify semi-transparent fringe
fringe_mask = (alpha > 0) & (alpha < 250)
print(f"Original semi-transparent fringe pixels: {fringe_mask.sum()}")

# 2. Test color bleeding / edge decontamination
# Create solid opaque mask of interior pixels
interior_mask = (alpha >= 250).astype(np.uint8)

# Use cv2.inpaint to bleed interior colors into fringe
inpainted_rgb = cv2.inpaint(rgb, 255 - (interior_mask * 255), 3, cv2.INPAINT_TELEA)

# Blend inpainted RGB for fringe pixels while keeping smooth alpha
new_arr = arr.copy()
# For fringe pixels, use the inpainted RGB so no background bleed exists
new_arr[fringe_mask, :3] = inpainted_rgb[fringe_mask]

# Also slightly tighten alpha curve (smooth step) to remove wispy faint outer halo
# alpha_cleaned = smoothstep(alpha)
alpha_float = alpha.astype(float) / 255.0
# Slight erosion of 1px on alpha to eliminate the extreme 1px boundary
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
alpha_eroded = cv2.erode(alpha, kernel, iterations=1)
# Combine: where eroded alpha is preserved, smooth transition
new_alpha = np.where(alpha < 40, 0, alpha)

new_arr[:, :, 3] = new_alpha

# Check result when composited on pure black and burgundy
test_im = Image.fromarray(new_arr)
test_im.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\teacher_defringed.png")

# Composite on dark background (#111625)
bg_dark = Image.new("RGBA", im.size, (17, 22, 37, 255))
bg_dark.alpha_composite(test_im)
bg_dark.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\teacher_on_dark.png")

# Composite on burgundy (#753b47)
bg_burg = Image.new("RGBA", im.size, (117, 59, 71, 255))
bg_burg.alpha_composite(test_im)
bg_burg.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\teacher_on_burgundy.png")

print("Defringed test images saved successfully.")
