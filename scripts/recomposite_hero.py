import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

base_dir = r"study-buddy-sim/public/assets"
teacher_path = os.path.join(base_dir, "amr_teacher_cutout_clean.png")

# --- 1. Clean Teacher Cutout & Eliminate Sky-Blue Wedge & Fringe ---
t_im = Image.open(teacher_path)
t_arr = np.array(t_im).copy()

# A. Mask out the unmasked sky-blue wedge between right arm and torso (x=40..150, y=155..300)
wedge_mask = np.zeros(t_arr.shape[:2], dtype=bool)
wedge_mask[155:300, 40:150] = True
is_wedge_sky = wedge_mask & (t_arr[:, :, 2] > 95) & (t_arr[:, :, 2].astype(int) > t_arr[:, :, 0].astype(int) + 10)
t_arr[is_wedge_sky, 3] = 0

# B. Inpaint interior foreground outward to kill steel-blue / white halo fringe along the entire perimeter
alpha = t_arr[:, :, 3]
is_fg = (alpha >= 240) & ~((t_arr[:, :, 2] > 125) & (t_arr[:, :, 2].astype(int) > t_arr[:, :, 0].astype(int) + 10))
inpainted = cv2.inpaint(t_arr[:, :, :3], (~is_fg).astype(np.uint8) * 255, 6, cv2.INPAINT_TELEA)

fringe = (alpha > 0) & ((alpha < 245) | (t_arr[:, :, 2] > 120) & (t_arr[:, :, 2].astype(int) > t_arr[:, :, 0].astype(int) + 10))
t_arr[fringe, :3] = inpainted[fringe]

# C. Anti-aliased alpha smoothing to eliminate raw staircase edges
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
eroded_alpha = cv2.erode((alpha > 30).astype(np.uint8) * 255, kernel, iterations=1)
smooth_alpha = cv2.GaussianBlur(eroded_alpha, (3, 3), 0)
t_arr[:, :, 3] = np.where(alpha >= 240, alpha, np.minimum(alpha, smooth_alpha))
t_arr[t_arr[:, :, 3] < 30, 3] = 0

teacher_clean = Image.fromarray(t_arr)

# --- 2. Re-composite Master Hero Canvas ---
W, H = 760, 800
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

# Circular Backdrop Disc (#753b47) centered on canvas
cx, cy, r = 380, 400, 260
disc = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(disc)
# Base solid disc #753b47 = (117, 59, 71)
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(117, 59, 71, 255))
# Concentric Rings
draw.ellipse([cx - (r - 40), cy - (r - 40), cx + (r - 40), cy + (r - 40)], outline=(255, 255, 255, 35), width=1)
draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(254, 98, 87, 85), width=2)
draw.ellipse([cx - (r + 35), cy - (r + 35), cx + (r + 35), cy + (r + 35)], outline=(255, 255, 255, 25), width=1)
draw.ellipse([cx - (r + 65), cy - (r + 65), cx + (r + 65), cy + (r + 65)], outline=(254, 98, 87, 40), width=1)
disc = disc.filter(ImageFilter.SMOOTH_MORE)
canvas.alpha_composite(disc)

# Center Mr. Amr Aref on the disc
tw = 450
th = int(teacher_clean.size[1] * (tw / teacher_clean.size[0]))
teacher_resized = teacher_clean.resize((tw, th), Image.Resampling.LANCZOS)
tx = (W - tw) // 2
ty = 30

# Realistic soft drop shadow under teacher
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
t_resized_arr = np.array(teacher_resized)
s_mask = (t_resized_arr[:, :, 3] > 0).astype(np.uint8) * 140
s_img = Image.fromarray(np.stack([np.zeros_like(s_mask), np.zeros_like(s_mask), np.zeros_like(s_mask), s_mask], axis=-1))
shadow.paste(s_img, (tx, ty + 12), s_img)
shadow = shadow.filter(ImageFilter.GaussianBlur(15))
canvas.alpha_composite(shadow)

# Composite clean teacher cutout (no anomalous secondary figure)
canvas.alpha_composite(teacher_resized, (tx, ty))

# Save outputs to assets
canvas.save(os.path.join(base_dir, "amr_master_hero.png"), optimize=True)
canvas.save(os.path.join(base_dir, "hero_illustration.png"), optimize=True)
canvas.save(os.path.join(base_dir, "amr_hero_composite.png"), optimize=True)
print("Hero composite generation complete with clean disc and zero secondary figure.")
