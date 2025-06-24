// Storage service for Chrome extension settings and cache
export interface ExtensionSettings {
  preferredSource: 'zenquotes' | 'quotegarden' | 'random'
  showSource: boolean
  favoriteQuotes: string[]
  lastFetchTime: number
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
    lastFetchTime: 0
  }

  async getSettings(): Promise<ExtensionSettings> {
    try {
      const result = await chrome.storage.sync.get('settings')
      return { ...this.defaultSettings, ...result.settings }
    } catch (error) {
      console.error('Error getting settings:', error)
      return this.defaultSettings
    }
  }

  async saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings()
      const newSettings = { ...currentSettings, ...settings }
      await chrome.storage.sync.set({ settings: newSettings })
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  async addToFavorites(quoteText: string): Promise<void> {
    const settings = await this.getSettings()
    if (!settings.favoriteQuotes.includes(quoteText)) {
      settings.favoriteQuotes.push(quoteText)
      await this.saveSettings({ favoriteQuotes: settings.favoriteQuotes })
    }
  }

  async removeFromFavorites(quoteText: string): Promise<void> {
    const settings = await this.getSettings()
    settings.favoriteQuotes = settings.favoriteQuotes.filter(q => q !== quoteText)
    await this.saveSettings({ favoriteQuotes: settings.favoriteQuotes })
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
    
    // Cache is valid for 1 hour
    const isValid = Date.now() - cached.timestamp < 60 * 60 * 1000
    return isValid ? cached : null
  }

  async shouldFetchNewQuote(): Promise<boolean> {
    const settings = await this.getSettings()
    const timeSinceLastFetch = Date.now() - settings.lastFetchTime
    
    // Fetch new quote if more than 10 minutes have passed
    return timeSinceLastFetch > 10 * 60 * 1000
  }
}

export const storageService = new StorageService()
