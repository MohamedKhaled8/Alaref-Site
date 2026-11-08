from PIL import Image
im = Image.open(r"C:\temp\local_test.png")
# In 1280x720, the hero left column is x: 50 to 600, y: 50 to 700
crop = im.crop((50, 50, 650, 700))
crop.save(r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_1\local_hero_crop.png")
print("Saved local_hero_crop.png")
