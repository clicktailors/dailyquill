// Storage service for Chrome extension settings and cache
export interface ExtensionSettings {
	preferredSource: 'zenquotes' | 'quotegarden' | 'random'
	showSource: boolean
	favoriteQuotes: string[]
	lastFetchTime: number
	selectedTheme: string
	cachedQuote?: {
		text: string
		author: string
		source: string
		timestamp: number
	}
}

class StorageService {
	private defaultSettings: ExtensionSettings = {
		preferredSource: 'random',
		showSource: true,
		favoriteQuotes: [],
		lastFetchTime: 0,
		selectedTheme: 'default'
	}

	async getSettings(): Promise<ExtensionSettings> {
		const result = await chrome.storage.sync.get('settings')
		return { ...this.defaultSettings, ...result.settings }
	}

	async saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
		const currentSettings = await this.getSettings()
		const newSettings = { ...currentSettings, ...settings }
		await chrome.storage.sync.set({ settings: newSettings })
	}

	async cacheQuote(quote: { text: string; author: string; source: string }): Promise<void> {
		const cachedQuote = {
			...quote,
			timestamp: Date.now()
		}
		await this.saveSettings({ cachedQuote, lastFetchTime: Date.now() })
	}

	async getCachedQuote(): Promise<{ text: string; author: string; source: string } | null> {
		const settings = await this.getSettings()
		const cached = settings.cachedQuote
		
		if (!cached) return null
		
		// Cache is valid for 24 hours (daily quotes)
		const isValid = Date.now() - cached.timestamp < 24 * 60 * 60 * 1000
		return isValid ? cached : null
	}

	async shouldFetchNewQuote(): Promise<boolean> {
		const settings = await this.getSettings()
		const timeSinceLastFetch = Date.now() - settings.lastFetchTime
		
		// Fetch new quote if more than 10 minutes have passed
		return timeSinceLastFetch > 10 * 60 * 1000
	}

	async getSelectedTheme(): Promise<string> {
		const settings = await this.getSettings()
		return settings.selectedTheme
	}

	async saveSelectedTheme(theme: string): Promise<void> {
		await this.saveSettings({ selectedTheme: theme })
	}
}

export const storageService = new StorageService()
