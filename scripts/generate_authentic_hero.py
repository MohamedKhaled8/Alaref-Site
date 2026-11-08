import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def generate_authentic_hero():
    # Resolve base directories
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, ".."))
    base_dir = os.path.join(project_root, "study-buddy-sim", "public", "assets")
    door_path = os.path.join(base_dir, "amr_cutout_door.png")

    if not os.path.exists(door_path):
        raise FileNotFoundError(f"Source asset not found: {door_path}")

    print(f"Reading source asset: {door_path}")
    im = Image.open(door_path)
    arr = np.array(im)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    print(f"Original image size: {im.size}, alpha pixels > 0: {(alpha > 0).sum()}")

    # --- 1. Non-Destructive Alpha Matting ---
    # Pure morphological alpha erosion (3.5px radius) to remove edge door bleed
    # ZERO inpainting, ZERO color-filtering over subject, 100% RGB pixel preservation
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    eroded_alpha = cv2.erode(alpha, kernel, iterations=1)

    # Smooth boundary anti-aliasing (only for edge pixels, solid interior remains 255)
    blurred_alpha = cv2.GaussianBlur(eroded_alpha, (3, 3), 0)
    final_alpha = np.where(eroded_alpha >= 240, eroded_alpha, np.minimum(eroded_alpha, blurred_alpha))
    final_alpha[final_alpha < 15] = 0

    # Combine pristine authentic RGB with cleaned alpha channel
    clean_teacher_arr = np.dstack([rgb, final_alpha])
    clean_teacher = Image.fromarray(clean_teacher_arr)

    # Crop to active bounding box
    ys, xs = np.where(final_alpha > 0)
    teacher_crop = clean_teacher.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    print(f"Cropped teacher dimensions: {teacher_crop.size}")

    # --- 2. Master Hero Canvas Compositing ---
    W, H = 760, 800
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    # Circular Backdrop Disc (#753b47 = [117, 59, 71])
    cx, cy, r = 380, 420, 255
    disc = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(disc)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(117, 59, 71, 255))

    # Delicate Concentric Rings
    draw.ellipse([cx - (r - 40), cy - (r - 40), cx + (r - 40), cy + (r - 40)], outline=(255, 255, 255, 35), width=1)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(254, 98, 87, 85), width=2)
    draw.ellipse([cx - (r + 35), cy - (r + 35), cx + (r + 35), cy + (r + 35)], outline=(255, 255, 255, 25), width=1)
    draw.ellipse([cx - (r + 65), cy - (r + 65), cx + (r + 65), cy + (r + 65)], outline=(254, 98, 87, 40), width=1)
    disc = disc.filter(ImageFilter.SMOOTH_MORE)
    canvas.alpha_composite(disc)

    # Position Teacher Figure (Head rises proudly 130px above disc top)
    tw = 450
    th = int(teacher_crop.size[1] * (tw / teacher_crop.size[0]))
    teacher_resized = teacher_crop.resize((tw, th), Image.Resampling.LANCZOS)

    tx = (W - tw) // 2
    ty = 35  # top of head at y=35; disc top edge is at cy - r = 165 -> 130px pop-out

    # Soft authentic drop shadow under teacher
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t_arr = np.array(teacher_resized)
    s_mask = (t_arr[:, :, 3] > 0).astype(np.uint8) * 140
    s_img = Image.fromarray(np.stack([np.zeros_like(s_mask), np.zeros_like(s_mask), np.zeros_like(s_mask), s_mask], axis=-1))
    shadow.paste(s_img, (tx, ty + 12), s_img)
    shadow = shadow.filter(ImageFilter.GaussianBlur(15))
    canvas.alpha_composite(shadow)

    # Composite clean teacher cutout
    canvas.alpha_composite(teacher_resized, (tx, ty))

    # Save outputs to required paths
    out_master = os.path.join(base_dir, "amr_master_hero.png")
    out_illust = os.path.join(base_dir, "hero_illustration.png")
    out_comp = os.path.join(base_dir, "amr_hero_composite.png")

    canvas.save(out_master, optimize=True)
    canvas.save(out_illust, optimize=True)
    canvas.save(out_comp, optimize=True)

    print(f"Generated successfully:\n - {out_master}\n - {out_illust}\n - {out_comp}")

if __name__ == "__main__":
    generate_authentic_hero()
