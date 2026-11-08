import os
from PIL import Image
import numpy as np

im = Image.open(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\taha_bust_crop.png")
arr = np.array(im)
w, h = im.size

# Look at the top rows, left cols, bottom rows, right cols
print("Top 10 rows mean RGB:")
for y in range(0, 35, 5):
    print(f"y={y+100}: {arr[y, :, :3].mean(axis=0).astype(int)}")

print("\nLeft 10 cols mean RGB:")
for x in range(0, 45, 5):
    print(f"x={x+180}: {arr[:, x, :3].mean(axis=0).astype(int)}")

print("\nRight cols mean RGB:")
for x in range(w-40, w, 10):
    print(f"x={x+180}: {arr[:, x, :3].mean(axis=0).astype(int)}")

print("\nBottom rows mean RGB:")
for y in range(h-40, h, 10):
    print(f"y={y+100}: {arr[y, :, :3].mean(axis=0).astype(int)}")
