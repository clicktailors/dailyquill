// True when running as the installed Chrome extension. False when the new tab
// page is served as a regular website (Vite dev server or the Vercel preview).
export const isExtension =
	typeof chrome !== 'undefined' && !!chrome.runtime?.id && !!chrome.storage?.sync

// ZenQuotes doesn't send CORS headers, so the website version goes through a
// same-origin proxy (vite.config.ts in dev, vercel.json in the preview).
export const zenQuotesApiBase = isExtension ? 'https://zenquotes.io/api' : '/api/zenquotes'
