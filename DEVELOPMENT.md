# Development Guide

## Quick Start

### For Live Development (Recommended)
Run the development server for live reload and instant feedback:

```bash
npm run dev
```

This will:
- Start a development server at `http://localhost:3000`
- Open your browser automatically
- Provide hot module replacement (HMR) for instant changes
- Show a "DEV MODE" indicator in the top-right corner
- Simulate the extension environment

### For Extension Development
If you need to test the actual extension:

```bash
npm run dev:extension
```

This will:
- Watch for file changes and rebuild automatically
- Output files to the `dist/` directory
- You'll need to reload the extension in Chrome after changes

## Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to your React components, CSS, or TypeScript files
3. **See changes instantly** in the browser without reloading
4. **Test extension features** like theme switching, sliders, etc.
5. **When ready to test in extension**: Use `npm run build:extension` and reload the extension

## Key Features

- **Hot Module Replacement**: Changes to React components update instantly
- **CSS Live Reload**: Style changes are applied immediately
- **TypeScript Support**: Full type checking and IntelliSense
- **Extension Simulation**: The dev environment simulates the extension context
- **Visual Indicator**: "DEV MODE" badge shows you're in development

## File Structure

- `src/newtab.tsx` - Main React component
- `src/SettingsPanel.tsx` - Settings panel component
- `src/newtab.css` - Styles for the new tab page
- `src/colors.ts` - Theme color definitions
- `newtab.html` - HTML template for development

## Tips

- The development server runs on `localhost:3000` by default
- Chrome extension APIs are simulated in development mode
- Use browser dev tools to inspect and debug your components
- The "DEV MODE" indicator helps distinguish between dev and extension environments
