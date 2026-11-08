import os
from PIL import Image
import numpy as np

base_dir = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
asset_dirs = [os.path.join(base_dir, "assets"), os.path.join(base_dir, "extracted")]

print("=== IMAGE ASSET AUDIT ===")
for ad in asset_dirs:
    if not os.path.exists(ad):
        continue
    print(f"\n--- Directory: {ad} ---")
    for f in sorted(os.listdir(ad)):
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            fp = os.path.join(ad, f)
            try:
                with Image.open(fp) as im:
                    mode = im.mode
                    size = im.size
                    has_alpha = 'A' in mode or mode == 'RGBA'
                    alpha_info = ""
                    if has_alpha:
                        a_channel = np.array(im.getchannel('A'))
                        min_a, max_a = a_channel.min(), a_channel.max()
                        opaque_pct = (a_channel == 255).mean() * 100
                        trans_pct = (a_channel == 0).mean() * 100
                        semi_pct = ((a_channel > 0) & (a_channel < 255)).mean() * 100
                        alpha_info = f"Alpha min={min_a}, max={max_a}, opaque={opaque_pct:.1f}%, transparent={trans_pct:.1f}%, semi={semi_pct:.1f}%"
                    print(f"{f:35} | {size[0]:4}x{size[1]:4} | {mode:5} | {alpha_info}")
            except Exception as e:
                print(f"{f:35} | ERROR: {e}")
