from PIL import Image
import numpy as np

img = Image.open(r".agents/teamwork/worker_2/verification_screenshots/mobile_390_promo.png")
w, h = img.size
print(f"Mobile promo screenshot dimensions: {w}x{h}")

# Let's save slices to inspect
# The banner container has:
# 1. Image: aspect-video (16:9). If w is ~780 minus padding, say w=748, then height of image is 748 * 9 / 16 = 420px.
# 2. CTA bar below it: from y ~ 430 to 850.
# Where is Mr. Amr's face in the original amr_promo_banner.png?
orig = Image.open(r"study-buddy-sim/public/assets/amr_promo_banner.png")
ow, oh = orig.size
print(f"Original banner size: {ow}x{oh}")

# Let's check where the teacher's face is in the original banner:
# In amr_promo_banner.png, let's locate Mr. Amr's head:
# He is on the left or center or right?
# In amr_promo_banner.png, let's find skin tone pixels or inspect:
orig_arr = np.array(orig)
# Skin tone: R > 150, G > 100, B > 80, R > G, G > B
skin = (orig_arr[:,:,0] > 140) & (orig_arr[:,:,1] > 90) & (orig_arr[:,:,2] > 70) & (orig_arr[:,:,0] > orig_arr[:,:,1]) & (orig_arr[:,:,1] > orig_arr[:,:,2])
sy, sx = np.where(skin)
print(f"Teacher face/skin in original banner: X range [{sx.min()}, {sx.max()}], Y range [{sy.min()}, {sy.max()}] (out of {ow}x{oh})")
# Normalized coordinates:
print(f"Teacher normalized X: [{sx.min()/ow:.2f}, {sx.max()/ow:.2f}], Y: [{sy.min()/oh:.2f}, {sy.max()/oh:.2f}]")

# Now check in mobile_390_promo.png:
# Where is the image element located in mobile_390_promo.png?
# Let's find the border of the banner container:
arr = np.array(img)
# The image in mobile_390_promo.png:
# Find where the banner image starts and ends vertically
# Background of section is dark #111625 ~ (17, 22, 37)
# Let's find rows where width > 700 has non-background pixels
non_bg = (arr[:, :, 0] > 30) | (arr[:, :, 1] > 35) | (arr[:, :, 2] > 50)
row_counts = non_bg.sum(axis=1)
active_rows = np.where(row_counts > 100)[0]
print(f"Banner container active rows: [{active_rows.min()}, {active_rows.max()}]")

# Let's inspect the HTML DOM structure of PromoBanner.tsx:
# In PromoBanner.tsx:
# img is src="/assets/amr_promo_banner.png", className="w-full aspect-video object-cover"
# Notice: line 26: <div className="hidden sm:flex absolute top-5 left-5 items-center z-10">
# On mobile (390px viewport, which is < sm: 640px), hidden sm:flex is display: none!
# And line 43: inside the CTA bar below the image:
# <div className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black">
#   <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
#   <span>الحجز متاح الآن للفصل الدراسي الجديد</span>
# </div>
print("Checking if any overlay element is positioned over the <img> in mobile:")
# In PromoBanner.tsx, the ONLY child inside the image container other than <img> is:
# <div className="hidden sm:flex absolute top-5 left-5 items-center z-10">
# which has class 'hidden sm:flex'!
# Thus on mobile, there is ZERO overlay element over the image!
