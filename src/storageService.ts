// Storage service for Chrome extension settings and cache
export interface ExtensionSettings {
	preferredSource: 'zenquotes' | 'quotegarden' | 'random'
	showSource: boolean
	favoriteQuotes: string[]
	lastFetchTime: number
	selectedTheme: string
	themeMode?: 'system' | 'light' | 'dark'
	selectedQuoteFont?: string
	selectedUIFont?: string
	cachedQuote?: {
		text: string
		author: string
		source: string
		timestamp: number
	}
}

// Development mode detection
const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

// Mock Chrome storage for development
const mockChromeStorage = {
	sync: {
		get: async (key: string) => {
			const stored = localStorage.getItem(`chrome.storage.sync.${key}`);
			return stored ? JSON.parse(stored) : {};
		},
		set: async (data: any) => {
			Object.entries(data).forEach(([key, value]) => {
				localStorage.setItem(`chrome.storage.sync.${key}`, JSON.stringify(value));
			});
		}
	}
};

// Use mock storage in development, real Chrome storage in extension
const storage = isDev ? mockChromeStorage : chrome.storage;

class StorageService {
	private defaultSettings: ExtensionSettings = {
		preferredSource: 'random',
		showSource: true,
		favoriteQuotes: [],
		lastFetchTime: 0,
		selectedTheme: 'default',
		themeMode: 'system'
	}

	async getSettings(): Promise<ExtensionSettings> {
		try {
			const result = await storage.sync.get('settings')
			return { ...this.defaultSettings, ...result.settings }
		} catch (error) {
			console.warn('Storage service error:', error);
			return this.defaultSettings;
		}
	}

	async saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
		try {
			const currentSettings = await this.getSettings()
			const newSettings = { ...currentSettings, ...settings }
			await storage.sync.set({ settings: newSettings })
		} catch (error) {
			console.warn('Storage service error:', error);
		}
	}

	async cacheQuote(quote: { text: string; author: string; source: string }): Promise<void> {
		try {
			const cachedQuote = {
				...quote,
				timestamp: Date.now()
			}
			await this.saveSettings({ cachedQuote, lastFetchTime: Date.now() })
		} catch (error) {
			console.warn('Cache quote error:', error);
		}
	}

	async getCachedQuote(): Promise<{ text: string; author: string; source: string } | null> {
		try {
			const settings = await this.getSettings()
			const cached = settings.cachedQuote
			
			if (!cached) return null
			
			// Cache is valid for 24 hours (daily quotes)
			const isValid = Date.now() - cached.timestamp < 24 * 60 * 60 * 1000
			return isValid ? cached : null
		} catch (error) {
			console.warn('Get cached quote error:', error);
			return null;
		}
	}

	async shouldFetchNewQuote(): Promise<boolean> {
		try {
			const settings = await this.getSettings()
			const timeSinceLastFetch = Date.now() - settings.lastFetchTime
			
			// Fetch new quote if more than 10 minutes have passed
			return timeSinceLastFetch > 10 * 60 * 1000
		} catch (error) {
			console.warn('Should fetch new quote error:', error);
			return true; // Default to fetching new quote on error
		}
	}

	async getSelectedTheme(): Promise<string> {
		try {
			const settings = await this.getSettings()
			return settings.selectedTheme
		} catch (error) {
			console.warn('Get selected theme error:', error);
			return 'default';
		}
	}

	async saveSelectedTheme(theme: string): Promise<void> {
		try {
			await this.saveSettings({ selectedTheme: theme })
		} catch (error) {
			console.warn('Save selected theme error:', error);
		}
	}

	async getSelectedQuoteFont(): Promise<string> {
		try {
			const settings = await this.getSettings()
			return settings.selectedQuoteFont || 'classic'
		} catch (error) {
			console.warn('Get selected quote font error:', error);
			return 'classic';
		}
	}

	async saveSelectedQuoteFont(font: string): Promise<void> {
		try {
			await this.saveSettings({ selectedQuoteFont: font })
		} catch (error) {
			console.warn('Save selected quote font error:', error);
		}
	}

	async getSelectedUIFont(): Promise<string> {
		try {
			const settings = await this.getSettings()
			return settings.selectedUIFont || 'readable'
		} catch (error) {
			console.warn('Get selected UI font error:', error);
			return 'readable';
		}
	}

	async saveSelectedUIFont(font: string): Promise<void> {
		try {
			await this.saveSettings({ selectedUIFont: font })
		} catch (error) {
			console.warn('Save selected UI font error:', error);
		}
	}
}

export const storageService = new StorageService()
