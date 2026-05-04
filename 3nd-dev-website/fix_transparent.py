from PIL import Image
import os

# Process each founder image
for name in ['dan', 'ryan', 'jay']:
    img_path = f'/home/pi/.openclaw/workspace/3nd-dev-website/founder-{name}.png'
    img = Image.open(img_path).convert('RGBA')
    
    # Get pixels
    pixels = img.load()
    width, height = img.size
    
    # Make dark pixels transparent
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # If background is dark (nearly black), make transparent
            if r < 40 and g < 40 and b < 40:
                pixels[x, y] = (0, 0, 0, 0)
    
    # Save as proper PNG with alpha
    output_path = f'/home/pi/.openclaw/workspace/3nd-dev-website/founder-{name}-fixed.png'
    img.save(output_path, 'PNG')
    print(f'Processed {name}: {img.size}')