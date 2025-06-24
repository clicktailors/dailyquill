# How to Test Your Chrome Extension

## Loading the Extension in Chrome

1. **Open Chrome** and navigate to `chrome://extensions/`

2. **Enable Developer Mode** by clicking the toggle in the top-right corner

3. **Click "Load unpacked"** button

4. **Select the `dist` folder** from your project directory:
   ```
   /Users/tatiaburdett/github-local/quote-extension/dist
   ```

5. The extension should now appear in your extensions list and in the Chrome toolbar

## Testing the Extension

1. **Open a new tab** - The extension automatically replaces Chrome's new tab page
2. **Look for the settings button** - A subtle "···" button in the bottom left corner
3. **Test theme switching** - Click the settings button and try different color themes
4. **Test modal interactions** - Click outside the settings panel or use the X button to close
5. **Test system theme switching** - Change your system between light/dark mode
6. **Verify quote loading** - Each new tab should show a daily quote

## Development Workflow

When you make changes to your code:

1. Run the build command:
   ```bash
   npm run build:extension
   ```

2. Go to `chrome://extensions/`

3. Click the **refresh button** on your extension card

4. Test your changes by clicking the extension icon

## Current Features

✅ **Working Features:**
- Beautiful popup UI (400x300px)
- New tab page with full-screen quotes
- Quote fetching from ZenQuotes API
- Loading states with spinner
- Error handling with fallback quotes
- System-aware light/dark mode
- Literature-inspired design with Cormorant Garamond font
- Paper-like textures and subtle gradients
- Manual quote refresh

## Testing System-Aware Design

### Light/Dark Mode Testing

1. **Test Light Mode:**
   - Ensure your system is in light mode
   - Open the extension popup or new tab
   - Should display paper-like whites (#fdfdf8 to #f5f5f0)

2. **Test Dark Mode:**
   - Switch your system to dark mode (System Preferences → General → Appearance → Dark)
   - Open the extension popup or new tab
   - Should display deep charcoal grays (#0f0f0f to #1a1a1a)

3. **Test Automatic Switching:**
   - With the extension open, switch between light/dark modes in System Preferences
   - The interface should update automatically while preserving your selected theme
   - Typography and contrast should remain readable in both modes
   - Selected theme (Classic, Sepia, Sage, or Rose) should maintain its character in both light and dark variants

### Design Elements to Verify

- **Typography**: Cormorant Garamond font loading correctly
- **Textures**: Subtle dot pattern overlay visible
- **Gradients**: Smooth background transitions
- **Contrast**: Text remains readable in both themes
- **Minimalism**: No clocks, dates, or unnecessary elements

## Troubleshooting

**Extension won't load?**
- Make sure you selected the `dist` folder, not the root project folder
- Verify that `manifest.json` exists in the `dist` folder (run `npm run build` if missing)
- Check that all icon files exist in `dist/icons/` and are valid PNG files
- If you see "Manifest file is missing or unreadable", the `manifest.json` wasn't copied - ensure the `public/` folder contains `manifest.json` and rebuild
- If you see "Could not load icon", the PNG files may be corrupted - they should be recreated automatically during build

**Icons are placeholder files:**
- The current icons are transparent placeholders for development
- For production, replace the PNG files in `public/icons/` with your custom icons
- Icon sizes needed: 16x16, 32x32, 48x48, and 128x128 pixels

**Quotes not loading?**
- Check the browser console for CORS errors
- The extension currently uses ZenQuotes API which should work

**Need to see errors?**
- Right-click the extension icon → "Inspect popup"
- This opens DevTools for debugging

## Next Steps

1. **Test the current functionality**
2. **Add proper icons** (replace the placeholder files in `dist/icons/`)
3. **Enhance features** (favorites, categories, etc.)
4. **Improve the API integration**
