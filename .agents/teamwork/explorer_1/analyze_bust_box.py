import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
master_im = Image.open(os.path.join(base, "assets", "amr_master_hero.png"))
arr = np.array(master_im)

# Let's inspect the exact bounding box around the bust in amr_master_hero.png:
# In our earlier check, black pixels span x=[211..399], y=[125..711]
# Let's crop x=[180..420], y=[100..730]
bust_crop = master_im.crop((180, 100, 430, 730))
bust_crop.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\taha_bust_crop.png")

# Let's inspect where the black borders are:
# Top border: y=125, x in [211..350]?
# Left border: x=211, y in [125..711]?
# Right border: x=399 or 421?
# Bottom border: y=711?
sub = arr[100:730, 180:430]
print("Bust crop shape:", sub.shape)

# Let's find exactly why there is a black rectangle:
# In the previous run, someone took a rectangular crop of Taha Hussein's bust
# from a screenshot or black background (like extracted/hero_illustration.png or a poster)
# and pasted it or layered it with a black background!
# Because the background of that crop was black (RGB ~ [10, 8, 17] or [0, 0, 0]),
# and it was pasted with a rectangular boundary without an alpha mask cutout,
# it formed an ugly black rectangle box with hard edges cutting through the burgundy disc!
