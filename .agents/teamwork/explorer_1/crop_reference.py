import os
from PIL import Image
import numpy as np

p = r"C:\temp\desktop_1440.png"
if os.path.exists(p):
    im = Image.open(p)
    print("desktop_1440.png size:", im.size)
    # The hero section is usually in the upper half of the page
    # Let's crop the hero section area: top 800 pixels
    # In desktop_1440, hero image is on the left in RTL (i.e. x from 50 to 700) or right?
    # In Arabic RTL, left column is instructor portrait, right column is text.
    # Let's crop left half and inspect
    hero_crop = im.crop((50, 100, 750, 850))
    hero_crop.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\reference_hero_crop.png")
    print("Saved reference_hero_crop.png")
else:
    print("desktop_1440.png not found")
