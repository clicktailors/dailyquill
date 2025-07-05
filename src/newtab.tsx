import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { quoteService, type Quote } from './quoteService'
import { storageService } from './storageService'
import './newtab.css'

// Color theme options
const colorThemes = {
  default: {
    name: 'Classic',
    light: { primary: '#fdfdf8', secondary: '#f5f5f0' },
    dark: { primary: '#0f0f0f', secondary: '#1a1a1a' }
  },
  sepia: {
    name: 'Sepia',
    light: { primary: '#f5f1e8', secondary: '#ede4d3' },
    dark: { primary: '#2a2218', secondary: '#342b1f' }
  },
  sage: {
    name: 'Sage',
    light: { primary: '#f2f5f1', secondary: '#e6ebe4' },
    dark: { primary: '#1a2118', secondary: '#242d21' }
  },
  rose: {
    name: 'Rose',
    light: { primary: '#f5f1f2', secondary: '#ebe4e6' },
    dark: { primary: '#2a1a1c', secondary: '#342024' }
  }
}

function NewTabApp() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof colorThemes>('default')

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storageService.getSelectedTheme()
        if (savedTheme && savedTheme in colorThemes) {
          setSelectedTheme(savedTheme as keyof typeof colorThemes)
        }
      } catch (error) {
        // Silently handle theme loading errors
      }
    }
    loadTheme()
  }, [])

  // Save theme when it changes
  const handleThemeChange = async (theme: keyof typeof colorThemes) => {
    setSelectedTheme(theme)
    try {
      await storageService.saveSelectedTheme(theme)
    } catch (error) {
      // Silently handle theme saving errors
    }
  }

  const refreshQuote = async () => {
    setLoading(true)
    
    const newQuote = await quoteService.getTodaysQuote()
    
    // Always cache the new quote - this uses chrome.storage.sync
    await storageService.cacheQuote({
      text: newQuote.text,
      author: newQuote.author,
      source: newQuote.source || 'Unknown'
    })
    
    setQuote(newQuote)
    setLoading(false)
  }

  // Explicitly use storage to ensure Chrome Web Store detects it
  const testStorageUsage = async () => {
    await storageService.getSettings()
  }

  // Apply theme styles to the page
  useEffect(() => {
    const applyTheme = () => {
      const theme = colorThemes[selectedTheme]
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const colors = isDark ? theme.dark : theme.light
      
      document.documentElement.style.setProperty('--theme-primary', colors.primary)
      document.documentElement.style.setProperty('--theme-secondary', colors.secondary)
    }

    // Apply theme immediately
    applyTheme()

    // Listen for system color scheme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme()
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [selectedTheme])

  // Fetch quote on mount - use cached quote if available and fresh
  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true)
      
      // Ensure storage is used (for Chrome Web Store detection)
      await testStorageUsage()
      
      // Always try to get cached quote first
      const cachedQuote = await storageService.getCachedQuote()
      
      if (cachedQuote) {
        setQuote(cachedQuote)
        setLoading(false)
        return
      }
      
      // If no cached quote, fetch new one and cache it
      const newQuote = await quoteService.getTodaysQuote()
      
      // Cache the new quote
      await storageService.cacheQuote({
        text: newQuote.text,
        author: newQuote.author,
        source: newQuote.source || 'Unknown'
      })
      
      setQuote(newQuote)
      setLoading(false)
    }

    fetchQuote()
  }, [])

  return (
    <div className="newtab-container" data-theme={selectedTheme}>
      {/* Background gradient */}
      <div className="background-gradient"></div>
      
      {/* Settings button in bottom left */}
      <button 
        className="newtab-settings-btn"
        onClick={() => setShowSettings(!showSettings)}
        title="Settings"
        aria-label="Open settings"
      >
        ···
      </button>

      {/* Refresh button in bottom right */}
      <button 
        className="newtab-refresh-btn"
        onClick={refreshQuote}
        disabled={loading}
        title="Refresh quote"
        aria-label="Refresh quote"
      >
        ↻
      </button>
      
      {/* Main content */}
      <div className="content">
        {/* Quote section - main focus */}
        <div className="quote-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading today's inspiration...</p>
            </div>
          ) : quote ? (
            <div className="quote-display">
              <blockquote className="quote-text">
                {quote.text}
              </blockquote>
              <cite className="quote-author">
                {quote.author}
              </cite>
              {quote.source && (
                <small className="quote-source">
                  {quote.source}
                </small>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div 
          className="newtab-settings-overlay"
          onClick={(e) => {
            // Close modal if clicking on the overlay (not the panel itself)
            if (e.target === e.currentTarget) {
              setShowSettings(false);
            }
          }}
        >
          <div className="newtab-settings-panel">
            <div className="settings-header">
              <h3>Settings</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSettings(false)}
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>
            
            <div className="settings-content">
              <div className="setting-group">
                <label className="setting-label">Color Theme</label>
                <div className="theme-options">
                  {Object.entries(colorThemes).map(([key, theme]) => (
                    <button
                      key={key}
                      className={`theme-option ${selectedTheme === key ? 'active' : ''}`}
                      onClick={() => handleThemeChange(key as keyof typeof colorThemes)}
                    >
                      <div 
                        className="theme-preview"
                        style={{
                          background: `linear-gradient(135deg, ${theme.light.primary} 50%, ${theme.dark.primary} 50%)`
                        }}
                      ></div>
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('newtab-root')!).render(<NewTabApp />)
