import re
import collections

with open('study-buddy-sim/src/data/mockData.ts', encoding='utf-8') as f:
    text = f.read()

grades = re.findall(r'gradeId:\s*"([^"]+)"', text)
names = re.findall(r'gradeName:\s*"([^"]+)"', text)
print("Total courses found:", len(grades))
print("gradeId counts:", dict(collections.Counter(grades)))
print("gradeName counts:", dict(collections.Counter(names)))

# Check for any secondary courses or mentions
secondary_terms = ["grade-1-sec", "grade-2-sec", "grade-3-sec", "648", "649", "650", "ثانوي"]
matches = {}
for term in secondary_terms:
    cnt = len(re.findall(re.escape(term), text))
    matches[term] = cnt

print("\nSecondary terms in mockData.ts:")
for k, v in matches.items():
    print(f"  {k}: {v}")
