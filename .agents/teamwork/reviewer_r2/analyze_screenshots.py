import os
from PIL import Image
import numpy as np

screenshot_dir = r".agents/teamwork/worker_2/verification_screenshots"
files = [
    "desktop_1440_full.png",
    "desktop_1440_hero.png",
    "desktop_1440_courses.png",
    "desktop_1440_promo.png",
    "mobile_390_full.png",
    "mobile_390_hero.png",
    "mobile_390_courses.png",
    "mobile_390_promo.png"
]

print("=== SCREENSHOT METADATA & INTEGRITY CHECK ===")
for f in files:
    p = os.path.join(screenshot_dir, f)
    if not os.path.exists(p):
        print(f"MISSING: {f}")
        continue
    img = Image.open(p)
    arr = np.array(img)
    print(f"{f:25s}: size={img.size}, mode={img.mode}, mean_rgb={arr[:,:,:3].mean(axis=(0,1)).round(1)}")

print("\n=== MOBILE 390 HERO SECTION ANALYSIS ===")
m_hero = Image.open(os.path.join(screenshot_dir, "mobile_390_hero.png"))
w, h = m_hero.size
arr_m_hero = np.array(m_hero)
# Check left and right 5px borders for cut off elements
left_border = arr_m_hero[:, :5, :3]
right_border = arr_m_hero[:, -5:, :3]
print(f"Mobile Hero image size: {w}x{h}")
print(f"Left border max RGB: {left_border.max()} (any clipping text > 180?: {(left_border > 180).any()})")
print(f"Right border max RGB: {right_border.max()} (any clipping text > 180?: {(right_border > 180).any()})")

print("\n=== MOBILE 390 PROMO BANNER ANALYSIS ===")
m_promo = Image.open(os.path.join(screenshot_dir, "mobile_390_promo.png"))
pw, ph = m_promo.size
arr_m_promo = np.array(m_promo)
print(f"Mobile Promo size: {pw}x{ph}")
# In mobile promo, let's check the top-half of the banner image:
# Mr Amr's face is typically in the upper half. Is there an amber badge overlapping?
# Amber badge has high Red and Green, low Blue: R > 200, G > 150, B < 80
amber_mask = (arr_m_promo[:, :, 0] > 200) & (arr_m_promo[:, :, 1] > 150) & (arr_m_promo[:, :, 2] < 80)
ay, ax = np.where(amber_mask)
if len(ay) > 0:
    print(f"Amber badge pixel count: {len(ay)}")
    print(f"Amber badge Y range: [{ay.min()}, {ay.max()}], X range: [{ax.min()}, {ax.max()}]")
    print(f"Relative position: Y between {ay.min()/ph:.2f} and {ay.max()/ph:.2f} of total promo container height")
else:
    print("No amber badge found")

print("\n=== COURSES SECTION ANALYSIS ===")
c_desk = Image.open(os.path.join(screenshot_dir, "desktop_1440_courses.png"))
print(f"Desktop courses screenshot size: {c_desk.size}")
c_mob = Image.open(os.path.join(screenshot_dir, "mobile_390_courses.png"))
print(f"Mobile courses screenshot size: {c_mob.size}")
