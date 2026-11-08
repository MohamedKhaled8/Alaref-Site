import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
out_dir = r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1"

# 1. Canvas Dimensions
W, H = 760, 800
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

# 2. Draw Signature Burgundy Disc (#753b47)
# Center slightly offset: cx ~ 380, cy ~ 380, radius ~ 260
cx, cy, r = 370, 390, 260
disc = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(disc)

# Fill burgundy disc with subtle gradient / lighting
# #753b47 = (117, 59, 71)
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(117, 59, 71, 245))

# Concentric Rings: delicate thin circles
# Ring 1 (inner): r - 40
draw.ellipse([cx - (r - 40), cy - (r - 40), cx + (r - 40), cy + (r - 40)], outline=(255, 255, 255, 30), width=1)
# Ring 2 (outer border): r
draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(254, 98, 87, 80), width=2)
# Ring 3 (outer halo ring): r + 35
draw.ellipse([cx - (r + 35), cy - (r + 35), cx + (r + 35), cy + (r + 35)], outline=(255, 255, 255, 20), width=1)
# Ring 4 (dashed/distant ring): r + 65
draw.ellipse([cx - (r + 65), cy - (r + 65), cx + (r + 65), cy + (r + 65)], outline=(254, 98, 87, 35), width=1)

# Subtle inner rim highlight
disc = disc.filter(ImageFilter.SMOOTH_MORE)
canvas.alpha_composite(disc)

# 3. Load & Clean Bust of Taha Hussein
bust_im = Image.open(os.path.join(out_dir, "taha_bust_cleaned.png"))
# Resize bust appropriately: width ~ 200, height proportional
bust_w = 210
bust_h = int(bust_im.size[1] * (bust_w / bust_im.size[0]))
bust_resized = bust_im.resize((bust_w, bust_h), Image.Resampling.LANCZOS)
# Position bust on the left of disc (behind teacher):
# x: ~140, y: ~220
canvas.alpha_composite(bust_resized, (150, 230))

# 4. Load & Defringe Teacher Cutout (Mr. Amr Aref)
teacher_im = Image.open(os.path.join(out_dir, "teacher_defringed.png"))
# Teacher dimensions: width ~ 420, height proportional
t_w = 430
t_h = int(teacher_im.size[1] * (t_w / teacher_im.size[0]))
teacher_resized = teacher_im.resize((t_w, t_h), Image.Resampling.LANCZOS)
# Position teacher in front, standing prominently:
# x: ~260, y: ~50
canvas.alpha_composite(teacher_resized, (250, 40))

# 5. Save verified composite
canvas.save(os.path.join(out_dir, "verified_hero_composite.png"))
print("Saved verified_hero_composite.png")

# Composite on dark background to check contrast
bg_dark = Image.new("RGBA", (W, H), (17, 22, 37, 255))
bg_dark.alpha_composite(canvas)
bg_dark.save(os.path.join(out_dir, "verified_hero_on_dark.png"))
print("Saved verified_hero_on_dark.png")
