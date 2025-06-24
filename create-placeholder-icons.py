#!/usr/bin/env python3
"""
Simple script to create placeholder PNG icons for the Chrome extension.
Creates simple colored squares with the quote symbol (") in white.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    # Create icons directory if it doesn't exist
    icons_dir = "dist/icons"
    os.makedirs(icons_dir, exist_ok=True)
    
    # Icon sizes
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        # Create a new image with a nice blue background
        img = Image.new('RGBA', (size, size), (70, 130, 180, 255))  # Steel blue
        draw = ImageDraw.Draw(img)
        
        # Try to add a quote symbol in the center
        try:
            # Calculate font size based on icon size
            font_size = max(8, size // 3)
            # Use default font
            font = ImageFont.load_default()
        except:
            font = None
        
        # Draw a quote symbol
        quote_text = '"'
        if font:
            # Get text dimensions
            bbox = draw.textbbox((0, 0), quote_text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Center the text
            x = (size - text_width) // 2
            y = (size - text_height) // 2
            
            draw.text((x, y), quote_text, fill='white', font=font)
        else:
            # Fallback: draw a simple circle
            margin = size // 4
            draw.ellipse([margin, margin, size-margin, size-margin], fill='white')
        
        # Save the icon
        filename = f"{icons_dir}/icon{size}.png"
        img.save(filename)
        print(f"Created {filename}")
    
    print("All placeholder icons created successfully!")
    
except ImportError:
    print("PIL (Pillow) not found. Creating simple text placeholders instead...")
    
    # Create icons directory if it doesn't exist
    icons_dir = "dist/icons"
    os.makedirs(icons_dir, exist_ok=True)
    
    # Create simple text files as placeholders
    sizes = [16, 32, 48, 128]
    for size in sizes:
        filename = f"{icons_dir}/icon{size}.png.txt"
        with open(filename, 'w') as f:
            f.write(f"Placeholder for {size}x{size} icon\n")
            f.write("Replace with actual PNG file\n")
        print(f"Created placeholder text file: {filename}")
    
    print("Text placeholders created. Install Pillow (pip install Pillow) to generate actual PNG icons.")

except Exception as e:
    print(f"Error creating icons: {e}")
