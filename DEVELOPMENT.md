# Chrome Extension Commands & Development Tips

## Build Commands

```bash
# Install dependencies
npm install

# Development build (watch mode)
npm run dev

# Production build for extension
npm run build:extension

# Preview the built extension
npm run preview
```

## VS Code Tasks

You can also use VS Code tasks:
- **Ctrl/Cmd + Shift + P** → "Tasks: Run Task" → "Build Chrome Extension"

## Development Workflow

1. **Make changes** to your code
2. **Build** the extension: `npm run build:extension`  
3. **Reload** the extension in Chrome (`chrome://extensions/`)
4. **Test** by clicking the extension icon

## File Structure

```
quote-extension/
├── manifest.json          # Chrome extension manifest
├── index.html             # Popup HTML
├── src/
│   ├── main.tsx          # React entry point
│   ├── App.tsx           # Main React component
│   ├── App.css           # Styling
│   ├── background.ts     # Background service worker
│   ├── quoteService.ts   # Quote fetching logic
│   └── storageService.ts # Chrome storage utilities
├── dist/                 # Built extension (load this in Chrome)
└── icons/                # Extension icons
```

## Chrome Extension APIs Used

- **chrome.storage.sync** - For saving user preferences
- **chrome.alarms** - For scheduling quote updates
- **chrome.action** - For popup and icon management
- **fetch()** - For API calls to quote services

## Debugging

### Popup Debugging
1. Right-click extension icon → "Inspect popup"
2. Chrome DevTools will open for the popup

### Background Script Debugging  
1. Go to `chrome://extensions/`
2. Click "Inspect views: background page" on your extension

### Console Logs
- Check browser console for API errors
- Check extension popup console for UI errors

## API Endpoints

### ZenQuotes (Primary)
- **Random**: `https://zenquotes.io/api/random`
- **Today**: `https://zenquotes.io/api/today`
- **By Author**: `https://zenquotes.io/api/quotes/[author]`

### Quote Garden (Secondary)
- **Random**: `https://quote-garden.herokuapp.com/api/v3/quotes/random`

## Extension Features

### Current ✅
- Beautiful popup UI
- Quote fetching with fallbacks
- Loading states
- Error handling
- Multiple API sources
- Modular code structure

### Planned 🚧
- Favorite quotes
- Quote categories
- Daily notifications
- Quote sharing
- Settings page
- Dark mode
- Quote history

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup opens and displays quotes
- [ ] "New Quote" button works
- [ ] Loading spinner appears
- [ ] Error states work
- [ ] Fallback quotes appear when APIs fail
- [ ] Extension icon is visible in toolbar

## Publishing to Chrome Web Store

When ready to publish:

1. **Create a developer account** at https://chrome.google.com/webstore/devconsole/
2. **Zip the dist folder** contents
3. **Upload** to Chrome Web Store
4. **Fill out** store listing details
5. **Submit** for review

## Security Notes

- Only HTTPS APIs allowed in Manifest V3
- CSP (Content Security Policy) prevents inline scripts
- Host permissions required for external API calls
