# Porting the Daily Quill Theme System

Instructions for an AI coding agent: add a theme system to this project modeled on the one in Daily Quill (a React + Vite + Tailwind v4 Chrome extension).

## What you are building

Daily Quill's themes are **DaisyUI v5 themes on Tailwind CSS v4**. They are not a custom copy of DaisyUI's palettes. DaisyUI is loaded as a Tailwind v4 plugin from CSS, and all of its themes are compiled in. Whichever theme name sits on `<html data-theme="...">` sets the semantic CSS variables (`--color-primary`, `--color-base-100`, etc.) that Tailwind utilities such as `bg-base-200` and `text-primary` read.

The behavior layered on top:

1. **Three-way mode switch:** `system` → `light` → `dark` → `system`. In `system` mode the app follows `prefers-color-scheme` and updates live when the OS setting changes.
2. **Separate theme picks for light and dark.** The user picks one light theme (e.g. `cupcake`) and one dark theme (e.g. `dracula`). The active mode decides which of the two is applied. The theme picker only lists themes for the current mode.
3. **Semantic accent choice:** the user picks which semantic color (`primary` / `secondary` / `accent` / `neutral`) to use for highlighted text. Because these are DaisyUI tokens, the choice still works in every theme.
4. **Fonts can follow the mode (optional):** one font for light, another for dark, or one fixed font. The choice is applied through a CSS variable.
5. **Background brightness slider (optional):** a slider stored separately for light and dark that adds a black or white overlay to darken or lighten the theme's base color.
6. **Noise texture (optional):** a fixed, faint SVG noise overlay on `html::before`.
7. **Persistence:** every choice is saved and restored on load.

Items 1–3 are the core. Port 4–6 only if the target project wants them.

---

## Step 0: Inspect the target project first

Before changing anything, find out:

- **Tailwind version.** Look for `tailwindcss` in `package.json` and check whether the main CSS has `@import "tailwindcss"` (v4) or `@tailwind base` (v3). This guide targets **v4**. For v3, see the appendix.
- **Whether DaisyUI is installed**, and if so its version (v4 and v5 differ; see the appendix).
- **Framework:** React, Vue, Svelte, plain HTML, or SSR (Next.js, Remix, etc.). The logic below is shown in React but is framework-agnostic: it only sets attributes on `document.documentElement`.
- **Existing dark-mode handling**, such as `dark:` variants, `class="dark"`, or `next-themes`. You must reconcile with it rather than end up with two competing systems (see "Pitfalls").
- **Where settings persist:** `localStorage`, a backend user profile, `chrome.storage`, etc. Daily Quill uses `chrome.storage.sync` with a `localStorage` mock in dev. Use whatever the target project already has.

---

## Step 1: Install and wire up DaisyUI (Tailwind v4)

```bash
npm i -D daisyui@^5   # or pnpm add / yarn add
```

The Tailwind v4 integration should already be in place, e.g. `@tailwindcss/vite` in `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

In the main CSS entry file (Daily Quill's is `src/newtab.css`):

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: all;
}
```

Notes:

- `themes: all` compiles in every built-in DaisyUI theme (~35). To save CSS, list only the themes you offer, and mark defaults: `themes: light --default, dark --prefersdark, cupcake, dracula, nord;`. Every name in the theme-catalog file (Step 2) **must** be compiled in here, or selecting it does nothing.
- Tailwind v4 does **not** read `tailwind.config.js` unless the CSS has `@config "./tailwind.config.js"`. Don't create a v3-style config for DaisyUI; the `@plugin` block replaces it.
- Any `@import url(...)` for Google Fonts must come **before** `@import "tailwindcss"`.

---

## Step 2: Create the theme catalog (`src/theme/themes.ts`)

This single file defines which themes are offered, sorts them into light and dark, and holds the semantic color options and fonts. The UI is generated from it.

```ts
// DaisyUI themes grouped by light/dark. The id must match a DaisyUI theme name.
export const themeCategories = {
  light: {
    name: 'Light Themes',
    themes: [
      { id: 'light', name: 'Light' },
      { id: 'cupcake', name: 'Cupcake' },
      { id: 'emerald', name: 'Emerald' },
      { id: 'corporate', name: 'Corporate' },
      { id: 'retro', name: 'Retro' },
      { id: 'valentine', name: 'Valentine' },
      { id: 'garden', name: 'Garden' },
      { id: 'lofi', name: 'Lo-Fi' },
      { id: 'pastel', name: 'Pastel' },
      { id: 'fantasy', name: 'Fantasy' },
      { id: 'wireframe', name: 'Wireframe' },
      { id: 'cmyk', name: 'CMYK' },
      { id: 'autumn', name: 'Autumn' },
      { id: 'nord', name: 'Nord' },
      { id: 'cyberpunk', name: 'Cyberpunk' },
      { id: 'acid', name: 'Acid' },
      { id: 'lemonade', name: 'Lemonade' },
      { id: 'winter', name: 'Winter' },
      // DaisyUI v5 also ships: 'caramellatte', 'silk'
    ],
  },
  dark: {
    name: 'Dark Themes',
    themes: [
      { id: 'dark', name: 'Dark' },
      { id: 'synthwave', name: 'Synthwave' },
      { id: 'halloween', name: 'Halloween' },
      { id: 'forest', name: 'Forest' },
      { id: 'aqua', name: 'Aqua' },
      { id: 'black', name: 'Black' },
      { id: 'luxury', name: 'Luxury' },
      { id: 'dracula', name: 'Dracula' },
      { id: 'night', name: 'Night' },
      { id: 'coffee', name: 'Coffee' },
      { id: 'dim', name: 'Dim' },
      { id: 'sunset', name: 'Sunset' },
      { id: 'business', name: 'Business' },
      // DaisyUI v5 also ships: 'abyss'
    ],
  },
} as const;

// User-selectable emphasis color. These are DaisyUI semantic tokens, so they adapt to every theme.
export const semanticColors = {
  primary:   { name: 'Primary',   className: 'text-primary',         radioClass: 'radio-primary' },
  secondary: { name: 'Secondary', className: 'text-secondary',       radioClass: 'radio-secondary' },
  accent:    { name: 'Accent',    className: 'text-accent',          radioClass: 'radio-accent' },
  neutral:   { name: 'Neutral',   className: 'text-base-content/50', radioClass: 'radio-neutral' },
} as const;
export type SemanticColor = keyof typeof semanticColors;
```

**Important for Tailwind:** class names must appear as **complete literal strings** in source files (as above) so Tailwind's scanner generates them. Never build them dynamically (e.g. `` `text-${key}` ``).

The `radioClass` field is an improvement on the original. Daily Quill used a `switch` statement in the settings panel to map keys to radio classes.

Fonts (optional, only if porting item 4):

```ts
export const fonts = {
  classic:   { name: 'Garamond',  family: 'Cormorant Garamond, serif' },
  modern:    { name: 'Inter',     family: 'Inter, sans-serif' },
  elegant:   { name: 'Playfair',  family: 'Playfair Display, serif' },
  minimal:   { name: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif' },
  poetry:    { name: 'Lora',      family: 'Lora, serif' },
  monospace: { name: 'Ubuntu',    family: 'Ubuntu Mono, monospace' },
} as const;
```

---

## Step 3: Theme state and how it is applied

### Settings shape and defaults

```ts
type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeSettings {
  themeMode: ThemeMode;          // default 'system'
  lightTheme: string;            // default 'light'
  darkTheme: string;             // default 'dark'
  semanticColor: SemanticColor;  // default 'primary'
  // optional extras
  fontFollowsTheme?: boolean;    // default true
  lightFont?: string;            // default 'elegant'
  darkFont?: string;             // default 'monospace'
  fixedFont?: string;            // used when fontFollowsTheme is false
  bgLightnessLight?: number;     // 0–100, default 50 (neutral)
  bgLightnessDark?: number;      // 0–100, default 50
}
```

Persist the whole object under one key and merge it over defaults on load (`{ ...defaults, ...saved }`). Then fields added later fall back to their defaults.

Two persistence rules (both were real bugs in Daily Quill):
- **Don't save until the load has finished.** Save effects run on mount with default state and can overwrite the user's saved values. Use a `settingsLoaded` flag, set in the load's `finally`, and skip saves until it's true.
- **Run read-merge-write saves one at a time.** If several partial saves run at once, each reads the same old object and the last write wins, so the other changes are lost. Chain them on a promise (`this.queue = this.queue.then(() => readMergeWrite(patch))`), or save the full settings object from a single effect.

### Applying the theme: the core logic

All theme behavior comes down to setting one attribute:

```ts
const isDark =
  mode === 'dark' ||
  (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

document.documentElement.setAttribute('data-theme', isDark ? darkTheme : lightTheme);
```

### Recommended React hook (`src/theme/useTheme.ts`)

Keep the system preference in **state** (not a `matchMedia` call during render). Otherwise in `system` mode, UI that depends on the mode (the picker list, the "Light/Dark Mode Font" label) won't re-render when the OS switches:

```ts
import { useEffect, useState } from 'react';

const query = '(prefers-color-scheme: dark)';

export function useSystemPrefersDark() {
  const [prefersDark, setPrefersDark] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return prefersDark;
}

export function useTheme(settings: ThemeSettings, update: (p: Partial<ThemeSettings>) => void) {
  const prefersDark = useSystemPrefersDark();
  const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && prefersDark);
  const activeTheme = isDark ? settings.darkTheme : settings.lightTheme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    // Hint native controls and scrollbars to match the mode.
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [activeTheme, isDark]);

  return {
    isDark,
    activeTheme,
    themesForMode: isDark ? themeCategories.dark.themes : themeCategories.light.themes,
    cycleMode: () =>
      update({ themeMode: settings.themeMode === 'system' ? 'light' : settings.themeMode === 'light' ? 'dark' : 'system' }),
    // Selecting a theme updates the slot for the current mode only.
    selectTheme: (id: string) => update(isDark ? { darkTheme: id } : { lightTheme: id }),
  };
}
```

For non-React projects, do the same with a small module: keep the settings, run `apply()` on load, on every settings change, and on the `matchMedia` `change` event.

### Prevent a flash of the wrong theme (recommended addition)

Daily Quill loads settings asynchronously, so the page can briefly render in DaisyUI's default theme first. If the target stores settings in `localStorage`, add a blocking inline script in `<head>` of `index.html`, before any CSS or JS:

```html
<script>
  try {
    var s = JSON.parse(localStorage.getItem('theme-settings') || '{}');
    var m = s.themeMode || 'system';
    var d = m === 'dark' || (m === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', d ? (s.darkTheme || 'dark') : (s.lightTheme || 'light'));
  } catch (e) {}
</script>
```

Make sure the key name matches the one the app persists to. For SSR frameworks, put this in the root layout's `<head>` and add `suppressHydrationWarning` on `<html>`. Chrome extensions block inline scripts under MV3 CSP, which is why Daily Quill doesn't do this.

---

## Step 4: Theme UI

All UI uses DaisyUI component classes, so it re-themes automatically.

### Mode toggle (single button cycling system → light → dark)

```tsx
<button className="btn btn-ghost btn-circle" onClick={cycleMode} title={nextLabel} aria-label={nextLabel}>
  {mode === 'light' ? <SunIcon /> : mode === 'dark' ? <MoonIcon /> : <SystemIcon />}
</button>
```

Here `nextLabel` is "Switch to Dark Mode" in light mode, "Switch to System Mode" in dark mode, and "Switch to Light Mode" in system mode.

### Theme picker: a 3-column segmented grid that shows only the current mode's themes

```tsx
<div className="grid grid-cols-3 gap-0 rounded-lg overflow-hidden border border-base-300">
  {themesForMode.map((t) => (
    <button
      key={t.id}
      className={activeTheme === t.id
        ? 'btn btn-sm btn-primary rounded-none border-0'
        : 'btn btn-sm btn-soft rounded-none border-0'}
      onClick={() => selectTheme(t.id)}
    >
      {t.name}
    </button>
  ))}
</div>
```

Showing only the current mode's themes is the key UX choice. A user in dark mode is choosing their dark theme, and switching modes shows the other list with its own saved selection.

### Semantic color picker: radio buttons colored by their own token

```tsx
<div className="flex gap-4 flex-wrap">
  {Object.entries(semanticColors).map(([key, c]) => (
    <label key={key} className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="semantic-color" aria-label={c.name}
        className={`radio ${c.radioClass}`}
        checked={semanticColor === key}
        onChange={() => update({ semanticColor: key as SemanticColor })} />
    </label>
  ))}
</div>
```

Apply the result where emphasis is wanted: `className={semanticColors[semanticColor].className}`.

### Surfaces

Use DaisyUI base tokens for layout so every theme looks right:
- Page background: `bg-base-200` (Daily Quill adds `transition-colors duration-300` for a smooth change between themes)
- Panels and headers: `bg-base-100`, dividers `border-base-300`
- Body text: `text-base-content`; muted text: `opacity-70` or `text-base-content/50`
- Never hard-code hex colors or Tailwind palette colors (`bg-gray-100`, `text-slate-800`) on themed surfaces.

---

## Step 5 (optional): Extras

### Fonts that follow the mode

```ts
const fontKey = settings.fontFollowsTheme
  ? (isDark ? settings.darkFont : settings.lightFont)
  : settings.fixedFont;
useEffect(() => {
  const f = fonts[fontKey as keyof typeof fonts];
  if (f) document.documentElement.style.setProperty('--quote-font', f.family);
}, [fontKey]);
```

Use it with `style={{ fontFamily: 'var(--quote-font)' }}`, or add `@theme { --font-quote: var(--quote-font); }` in the CSS to get a `font-quote` utility. In the UI, an Auto/Fixed `toggle` switch picks the mode. In Auto mode, clicking a font sets the light or dark slot for the current mode, and the label reads "Light Mode Font" or "Dark Mode Font". Load the fonts with a Google Fonts `@import url(...)` at the top of the CSS.

### Background brightness overlay

A 0–100 slider (`range range-primary`), stored separately for light and dark. 50 means no overlay. Above 50, a white overlay; below 50, a black one. Opacity is `|v − 50| / 50 × 0.8` (maximum 80%).

```tsx
{v !== 50 && (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundColor: v > 50
      ? `rgba(255,255,255,${((v - 50) / 50) * 0.8})`
      : `rgba(0,0,0,${((50 - v) / 50) * 0.8})`,
  }} />
)}
```

Put page content in a `relative z-10` wrapper above the overlay.

### Noise texture

```css
:root {
  --fx-noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.34' numOctaves='4' stitchTiles='stitch'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.2'%3E%3C/rect%3E%3C/svg%3E");
}
html::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.18;
  background-image: var(--fx-noise);
  background-size: cover;
}
```

---

## Pitfalls

- **Existing `dark:` variants.** In Tailwind v4, `dark:` follows `prefers-color-scheme` by default, so it would ignore a user who forces light mode on a dark OS. Prefer DaisyUI tokens over `dark:` everywhere. If `dark:` must stay, bind it to dark themes in the CSS: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *, [data-theme=dracula], [data-theme=dracula] *, ...));` and list every dark theme id. Another option is to set a `data-mode="dark"` attribute in `useTheme` and use `@custom-variant dark (&:where([data-mode=dark], [data-mode=dark] *));`.
- **`next-themes` or another theme library.** Either remove it, or configure it with `attribute="data-theme"` and drive it from this logic. Don't let two systems both write to `<html>`.
- **Themes missing from the CSS build.** If you narrow `themes:` in the `@plugin` block, keep it in sync with the catalog.
- **Category accuracy.** Some light-list themes are loud (`cyberpunk`, `acid`). That's a curation choice, not a bug. `isDark` is driven by the user's mode, not by the theme's own `color-scheme`.
- **Old DaisyUI v4 CSS variables.** Older snippets use `oklch(var(--b1))`. In v5 the variables are `--color-base-100`, etc. Use v5 names in any custom CSS.

---

## Verification checklist

1. Build passes, and the generated CSS contains `[data-theme=dracula]` (or any non-default theme you offer).
2. Light mode: picking `cupcake` changes `<html data-theme>` immediately, and the choice survives a reload.
3. Dark mode: the picker shows only dark themes; picking `dracula` and switching back to light restores `cupcake`.
4. System mode: toggling the OS appearance (or DevTools › Rendering › "Emulate prefers-color-scheme") switches themes live **and** updates the picker list without a reload.
5. Each semantic color option changes the emphasized text and still reads well in a light and a dark theme.
6. No flash of the default theme on hard reload (if the inline script was added).
7. Search the code for hard-coded colors (`#`, `bg-gray`, `text-black`, `bg-white`) on themed surfaces, and replace them with base tokens.

---

## Appendix: other stacks

- **Tailwind v3 + DaisyUI v4:** register in `tailwind.config.js` with `plugins: [require('daisyui')]` and `daisyui: { themes: [...ids] }` (or `themes: true` for all). Everything else (the `data-theme` attribute, catalog, hook, and UI) is the same. Note that `btn-soft` is v5-only; use `btn-ghost` instead.
- **No DaisyUI allowed:** the pattern still works, but you would need to define each theme yourself with `[data-theme=name] { --color-primary: ...; --color-base-100: ...; }` and map the tokens with `@theme inline { --color-primary: var(--color-primary); ... }`. That's a much bigger job, so confirm with the user before going this way.
