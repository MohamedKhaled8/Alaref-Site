import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"
im_extracted = Image.open(os.path.join(base, "extracted", "hero_illustration.png"))
im_master = Image.open(os.path.join(base, "assets", "amr_master_hero.png"))

print("Extracted size:", im_extracted.size)
print("Master size:", im_master.size)

# Let's inspect extracted image corners and center
arr_ext = np.array(im_extracted)
print("Extracted top-left (0,0):", arr_ext[0, 0])
print("Extracted top-right (0, 599):", arr_ext[0, -1])
print("Extracted bottom-left (749, 0):", arr_ext[-1, 0])
print("Extracted bottom-right (749, 599):", arr_ext[-1, -1])

# Is the background dark or black?
print("Extracted min RGB:", arr_ext.min(axis=(0,1)))
print("Extracted max RGB:", arr_ext.max(axis=(0,1)))

# Let's look at what is in extracted/hero_illustration.png:
# Is it the full original composite from the reference website?
# Let's find out!
