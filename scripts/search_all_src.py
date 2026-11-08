import os
import re

src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "study-buddy-sim", "src"))

terms = ["grade-1-sec", "grade-2-sec", "grade-3-sec", "ثانوي"]
found_matches = []

for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith((".ts", ".tsx")):
            file_path = os.path.join(root, f)
            rel_path = os.path.relpath(file_path, src_dir)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
                lines = fh.readlines()
            for line_idx, line in enumerate(lines, 1):
                for t in terms:
                    if t in line:
                        found_matches.append((rel_path, line_idx, t, line.strip()))

print(f"Scanned {src_dir} for terms: {terms}")
print(f"Total matches found: {len(found_matches)}")
for m in found_matches:
    print(f"  {m[0]}:{m[1]} [{m[2]}] -> {m[3]}")
