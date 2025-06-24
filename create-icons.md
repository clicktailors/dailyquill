# How to Add Icons to Your Extension

## Quick Icon Creation Options

### Option 1: Online Icon Generators
- **Favicon.io**: https://favicon.io/favicon-generator/
- **Real Favicon Generator**: https://realfavicongenerator.net/
- Upload a simple design or text and generate all sizes

### Option 2: Use Emoji as Icons
Create simple icons using emoji:

```bash
# Create the icons directory
mkdir -p dist/icons

# Use any emoji-to-image service or create simple colored squares
# For now, you can use placeholder images from online services
```

### Option 3: Simple Code-Generated Icons
```bash
# Create simple colored squares as placeholders
cd dist/icons
for size in 16 32 48 128; do
  curl -o "icon${size}.png" "https://via.placeholder.com/${size}x${size}/667eea/ffffff?text=Q"
done
```

### Option 4: Design Your Own
Use any image editor to create:
- 16x16 pixels (toolbar icon)
- 32x32 pixels (Windows)
- 48x48 pixels (extension management)
- 128x128 pixels (Chrome Web Store)

**Icon Ideas:**
- Quote bubble 💬
- Quotation marks " "
- Lightbulb 💡
- Book 📖
- Inspiration symbol ✨

## Adding Icons Back to Manifest

Once you have icon files, update `manifest.json`:

```json
{
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png", 
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "index.html",
    "default_title": "Daily Quote Generator",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png", 
      "128": "icons/icon128.png"
    }
  }
}
```

Then rebuild: `npm run build:extension`
