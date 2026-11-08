import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
master_im = Image.open(os.path.join(base, "amr_master_hero.png"))
arr = np.array(master_im)
rgb = arr[:, :, :3]
alpha = arr[:, :, 3]

# Where is the burgundy disc?
# Let's find pixels close to #753b47 (RGB: 117, 59, 71) or #6d3d48 (RGB: 109, 61, 72)
# Distance in RGB space:
dist = np.sqrt(np.sum((rgb.astype(float) - np.array([117, 59, 71]))**2, axis=2))
disc_pixels = (dist < 40) & (alpha > 150)
print(f"Total disc pixels: {disc_pixels.sum()}")

if disc_pixels.sum() > 0:
    dy, dx = np.where(disc_pixels)
    cx = (dx.max() + dx.min()) / 2
    cy = (dy.max() + dy.min()) / 2
    rx = (dx.max() - dx.min()) / 2
    ry = (dy.max() - dy.min()) / 2
    print(f"Disc estimated center: ({cx:.1f}, {cy:.1f}), rx={rx:.1f}, ry={ry:.1f}")

# Let's check concentric rings:
# Concentric rings are typically thin circular lines (white or light coral with low opacity, like rgba(255,255,255,0.15))
# Let's check for ring radii by looking at radial distance from disc center:
if disc_pixels.sum() > 0:
    Y, X = np.ogrid[:arr.shape[0], :arr.shape[1]]
    R = np.sqrt((X - cx)**2 + (Y - cy)**2)
    # Check max radius of disc
    print(f"Max visible disc radius: {R[alpha > 100].max():.1f}")
