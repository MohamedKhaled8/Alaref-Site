import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public"

# Let's inspect extracted/hero_illustration.png and assets/amr_master_hero.png
# Let's inspect where there are non-black, non-background features
im1 = Image.open(os.path.join(base, "extracted", "hero_illustration.png"))
print("hero_illustration.png size:", im1.size)
im2 = Image.open(os.path.join(base, "assets", "amr_master_hero.png"))
print("amr_master_hero.png size:", im2.size)

# Let's inspect what is in amr_master_hero.png around x=[100..300], y=[50..400]
# and x=[300..600], y=[50..600]
arr = np.array(im2)
print("amr_master_hero.png arr shape:", arr.shape)

# Let's check color histograms or prominent color clusters
# In the original request:
# "The current hero composite has an amateur white halo fringe around the teacher cutout, and an ugly black rectangle around the bust of Taha Hussein.
# - Fix: Clean up the cutout edge perfectly (alpha matting, no white fringe/matte lines). Remove any rectangular black bounding box around the bust.
# - Re-composite the teacher (Mr. Amr Aref) cleanly onto the signature burgundy (#753b47) circular backdrop disc with delicate concentric rings, subtle atmospheric glow, and realistic soft drop-shadow."

# Where does the bust of Taha Hussein come from?
# Let's search all files in the project, including scripts or commit history, to see how amr_master_hero.png or amr_hero_composite.png was made!
