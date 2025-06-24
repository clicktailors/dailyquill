#!/bin/bash
# Simple script to add icons back to the extension

echo "Creating placeholder icon files..."
mkdir -p dist/icons

# Create simple placeholder files (these will work but won't be pretty)
for size in 16 32 48 128; do
  echo "Creating ${size}x${size} icon"
  # Create a minimal 1x1 pixel PNG (base64 encoded)
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAWYB+8gAAAABJRU5ErkJggg==" | base64 -d > "dist/icons/icon${size}.png"
done

echo "Icons created! You can now add them back to manifest.json"
echo "Run: npm run build:extension after updating manifest"
