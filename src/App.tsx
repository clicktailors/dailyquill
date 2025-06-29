import { useState, useEffect } from 'react'
import './App.css'
import { quoteService, type Quote } from './quoteService'

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

function App() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof colorThemes>('default')

  // Apply theme styles to the app
  useEffect(() => {
    const theme = colorThemes[selectedTheme]
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const colors = isDark ? theme.dark : theme.light
    
    document.documentElement.style.setProperty('--theme-primary', colors.primary)
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary)
  }, [selectedTheme])

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const newQuote = await quoteService.getRandomQuote()
      setQuote(newQuote)
    } catch (err) {
      console.error('Error fetching quote:', err)
      setError('Unable to fetch quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your daily quote...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <p>Unable to fetch quote</p>
          <button onClick={fetchQuote}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app" data-theme={selectedTheme}>
      <header className="header">
        <h1>Daily Quote</h1>
      </header>
      
      <main className="quote-container">
        {quote && (
          <div className="quote">
            <blockquote className="quote-text">
              "{quote.text}"
            </blockquote>
            <cite className="quote-author">
              — {quote.author}
            </cite>
            {quote.source && (
              <small className="quote-source">
                via {quote.source}
              </small>
            )}
          </div>
        )}
      </main>
      
      <footer className="footer">
        <button 
          className="refresh-btn"
          onClick={fetchQuote}
          title="Get new quote"
        >
          🔄 New Quote
        </button>
        <button 
          className="settings-btn"
          onClick={() => {
            setShowSettings(!showSettings);
          }}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙️
        </button>
      </footer>

      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-panel">
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
                      onClick={() => setSelectedTheme(key as keyof typeof colorThemes)}
                    >
                      <div 
                        className="theme-preview"
                        style={{
                          background: `linear-gradient(135deg, ${theme.light.primary} 0%, ${theme.light.secondary} 50%, ${theme.dark.primary} 100%)`
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

export default App
