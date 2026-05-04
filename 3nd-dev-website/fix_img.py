from PIL import Image
import sys

img_path = sys.argv[1]
img = Image.open(img_path).convert('RGBA')
pixels = img.load()
width, height = img.size

# Check sample pixels to understand background color
print(f"Image size: {width}x{height}")
sample_colors = set()
for y in range(0, height, 50):
    for x in range(0, width, 50):
        r, g, b, a = pixels[x, y]
        sample_colors.add((r, g, b))

# Show some sample colors
for c in list(sample_colors)[:10]:
    print(f"  RGB{c}")

# Make dark/black backgrounds transparent
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # If pixel is dark (likely background), make transparent
        if r < 50 and g < 50 and b < 50:
            pixels[x, y] = (0, 0, 0, 0)

# Save
output = img_path.replace('.png', '-fixed.png').replace('.jpg', '-fixed.png')
img.save(output, 'PNG')
print(f"Saved: {output}")