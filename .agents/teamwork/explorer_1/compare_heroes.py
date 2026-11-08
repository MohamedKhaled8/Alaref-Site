import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
heroes = ["amr_hero.png", "amr_hero_composite.png", "amr_hero_designed.png", "amr_hero_portrait.png", "amr_master_hero.png", "hero_illustration.png"]

for h in heroes:
    fp = os.path.join(base, h)
    if os.path.exists(fp):
        im = Image.open(fp)
        arr = np.array(im)
        print(f"\nImage: {h}, size={im.size}, mode={im.mode}")
        # check alpha
        if im.mode == "RGBA":
            a = arr[:, :, 3]
            print(f"Alpha: min={a.min()}, max={a.max()}, non-zero count={(a>0).sum()}, fully-opaque count={(a==255).sum()}")
            # Check edge fringe in this image
            # Find boundary of alpha
            from scipy.ndimage import binary_dilation
            outer = binary_dilation(a == 0, iterations=2)
            edge = (a > 10) & outer
            if edge.sum() > 0:
                edge_rgb = arr[edge, :3]
                white_edge = (edge_rgb[:, 0] > 180) & (edge_rgb[:, 1] > 180) & (edge_rgb[:, 2] > 180)
                print(f"Edge boundary pixels: {edge.sum()}, white/light fringe: {white_edge.sum()} ({white_edge.mean()*100:.1f}%)")
