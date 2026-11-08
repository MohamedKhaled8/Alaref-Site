import os
from PIL import Image
import numpy as np

base = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets"
designed = Image.open(os.path.join(base, "amr_hero_designed.png"))
hero = Image.open(os.path.join(base, "amr_hero.png"))
master = Image.open(os.path.join(base, "amr_master_hero.png"))

print("designed size:", designed.size)
print("hero size:", hero.size)
print("master size:", master.size)

# Let's save small preview copies to our folder so we can inspect them
designed.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\designed_copy.png")
hero.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\hero_copy.png")

# Let's check what each image contains:
# In designed:
d_arr = np.array(designed)
print("designed min/max/mean RGB:", d_arr[:,:,:3].min(axis=(0,1)), d_arr[:,:,:3].max(axis=(0,1)), d_arr[:,:,:3].mean(axis=(0,1)).astype(int))

# In hero:
h_arr = np.array(hero)
print("hero min/max/mean RGB:", h_arr[:,:,:3].min(axis=(0,1)), h_arr[:,:,:3].max(axis=(0,1)), h_arr[:,:,:3].mean(axis=(0,1)).astype(int))

# In master:
m_arr = np.array(master)
print("master min/max/mean RGB:", m_arr[:,:,:3].min(axis=(0,1)), m_arr[:,:,:3].max(axis=(0,1)), m_arr[:,:,:3].mean(axis=(0,1)).astype(int))
