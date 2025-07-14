import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { quoteService, type Quote } from './quoteService'
import { storageService } from './storageService'
import { colorThemes, baseHueMap, quoteFonts, uiFonts, defaultFonts, semanticColorThemes, daisyThemeCategories } from './colors'
import { SettingsPanel } from './SettingsPanel'
import './newtab.css'

// Color theme options
const initialSaturation = 30;
const initialLightness = 95;

type ThemeMode = 'system' | 'light' | 'dark';

// Development mode detection
const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

function NewTabApp() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsPanelVisible, setSettingsPanelVisible] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof colorThemes>('default')
  const [selectedSaturation, setSelectedSaturation] = useState(initialSaturation)
  const [selectedLightness, setSelectedLightness] = useState(initialLightness)
  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>('system');
  const [selectedQuoteFont, setSelectedQuoteFont] = useState(defaultFonts.quote)
  const [selectedUIFont, setSelectedUIFont] = useState(defaultFonts.ui)
  const [selectedLightTheme, setSelectedLightTheme] = useState('light')
  const [selectedDarkTheme, setSelectedDarkTheme] = useState('dark')
  const [selectedSemanticTheme, setSelectedSemanticTheme] = useState('primary')

  // Compute the base hue for the selected theme
  const baseHue = baseHueMap[selectedTheme];
  const dynamicPrimary = `hsl(${baseHue}, ${selectedSaturation}%, ${selectedLightness}%)`;

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await storageService.getSelectedTheme()
        if (savedTheme && savedTheme in colorThemes) {
          setSelectedTheme(savedTheme as keyof typeof colorThemes)
        }
        
        const saved = await storageService.getSettings();
        if (saved) {
          if (saved.themeMode) {
            setSelectedThemeMode(saved.themeMode);
          }
          if (saved.selectedQuoteFont) {
            setSelectedQuoteFont(saved.selectedQuoteFont);
          }
          if (saved.selectedUIFont) {
            setSelectedUIFont(saved.selectedUIFont);
          }
        }
      } catch (error) {
        // Silently handle loading errors
      }
    }
    loadSettings()
  }, [])

  // Load Google Fonts
  useEffect(() => {
    const loadFonts = () => {
      const fontsToLoad = [
        quoteFonts[selectedQuoteFont as keyof typeof quoteFonts]?.googleFont,
        uiFonts[selectedUIFont as keyof typeof uiFonts]?.googleFont
      ].filter(Boolean);

      if (fontsToLoad.length > 0) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?${fontsToLoad.join('&')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    };

    loadFonts();
  }, [selectedQuoteFont, selectedUIFont]);

  // Save font preferences when they change
  useEffect(() => {
    storageService.saveSelectedQuoteFont(selectedQuoteFont);
  }, [selectedQuoteFont]);

  useEffect(() => {
    storageService.saveSelectedUIFont(selectedUIFont);
  }, [selectedUIFont]);

  // Apply fonts to CSS variables
  useEffect(() => {
    const quoteFont = quoteFonts[selectedQuoteFont as keyof typeof quoteFonts];
    const uiFont = uiFonts[selectedUIFont as keyof typeof uiFonts];
    
    if (quoteFont) {
      document.documentElement.style.setProperty('--quote-font', quoteFont.family);
    }
    if (uiFont) {
      document.documentElement.style.setProperty('--ui-font', uiFont.family);
    }
  }, [selectedQuoteFont, selectedUIFont]);

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

  // Load saved theme mode on mount
  useEffect(() => {
    const loadThemeMode = async () => {
      const saved = await storageService.getSettings();
      if (saved && saved.themeMode) {
        setSelectedThemeMode(saved.themeMode);
      }
    };
    loadThemeMode();
  }, []);

  // Save theme when it changes
  const handleThemeChange = async (theme: keyof typeof colorThemes) => {
    setSelectedTheme(theme)
    const newLightness = getDefaultLightness(theme, isDark);
    const newSaturation = getDefaultSaturation(theme, isDark);
    if (selectedLightness < lightnessRange.min || selectedLightness > lightnessRange.max) {
      setSelectedLightness(newLightness);
    }
    if (selectedSaturation < saturationRange.min || selectedSaturation > saturationRange.max) {
      setSelectedSaturation(newSaturation);
    }
    try {
      await storageService.saveSelectedTheme(theme)
      // Announce theme change to screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.style.position = 'absolute'
      announcement.style.left = '-10000px'
      announcement.style.width = '1px'
      announcement.style.height = '1px'
      announcement.style.overflow = 'hidden'
      announcement.textContent = `Theme changed to ${colorThemes[theme].name}`
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)
    } catch (error) {
      // Silently handle theme saving errors
    }
  }

  // Save theme mode when it changes
  useEffect(() => {
    storageService.saveSettings({ themeMode: selectedThemeMode });
  }, [selectedThemeMode]);

  // Cycle theme mode
  const handleThemeModeChange = () => {
    setSelectedThemeMode((prev) =>
      prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'
    );
  };

  // Apply theme mode override
  useEffect(() => {
    if (selectedThemeMode === 'system') {
      document.documentElement.removeAttribute('data-color-scheme');
    } else {
      document.documentElement.setAttribute('data-color-scheme', selectedThemeMode);
    }
  }, [selectedThemeMode]);

  // Handle saturation change
  const handleSaturationChange = (saturation: number) => {
    setSelectedSaturation(saturation)
  }

  // Handle lightness change
  const handleLightnessChange = (lightness: number) => {
    setSelectedLightness(lightness)
  }

  // Handle font changes
  const handleQuoteFontChange = (font: string) => {
    setSelectedQuoteFont(font);
  };

  const handleUIFontChange = (font: string) => {
    setSelectedUIFont(font);
  };

  // Handle light theme change
  const handleLightThemeChange = (theme: string) => {
    setSelectedLightTheme(theme);
    // Apply immediately if currently in light mode
    if (selectedThemeMode === 'light' || 
        (selectedThemeMode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    // Save to storage
    storageService.saveSettings({ selectedLightTheme: theme });
  };

  // Handle dark theme change
  const handleDarkThemeChange = (theme: string) => {
    setSelectedDarkTheme(theme);
    // Apply immediately if currently in dark mode
    if (selectedThemeMode === 'dark' || 
        (selectedThemeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    // Save to storage
    storageService.saveSettings({ selectedDarkTheme: theme });
  };

  // Handle semantic color theme change
  const handleSemanticThemeChange = (theme: string) => {
    setSelectedSemanticTheme(theme);
    // Save to storage
    storageService.saveSettings({ selectedSemanticTheme: theme });
  };

  // Apply appropriate DaisyUI theme based on mode
  useEffect(() => {
    const applyTheme = () => {
      const isDarkMode = selectedThemeMode === 'dark' || 
        (selectedThemeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const themeToApply = isDarkMode ? selectedDarkTheme : selectedLightTheme;
      document.documentElement.setAttribute('data-theme', themeToApply);
    };

    applyTheme();

    // Listen for system preference changes when in system mode
    if (selectedThemeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [selectedThemeMode, selectedLightTheme, selectedDarkTheme]);

  // Load saved themes
  useEffect(() => {
    const loadThemes = async () => {
      const saved = await storageService.getSettings();
      if (saved) {
        if (saved.selectedLightTheme) {
          setSelectedLightTheme(saved.selectedLightTheme);
        }
        if (saved.selectedDarkTheme) {
          setSelectedDarkTheme(saved.selectedDarkTheme);
        }
      }
    };
    loadThemes();
  }, []);

  // Load saved semantic theme
  useEffect(() => {
    const loadSemanticTheme = async () => {
      const saved = await storageService.getSettings();
      if (saved && saved.selectedSemanticTheme) {
        setSelectedSemanticTheme(saved.selectedSemanticTheme);
      }
    };
    loadSemanticTheme();
  }, []);

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

  // Helper to determine if dark mode is active
  const isDark = (selectedThemeMode === 'dark') ||
    (selectedThemeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const lightModeLightness = { min: 70, max: 100, default: 95 };
  const darkModeLightness = { min: 10, max: 40, default: 20 };
  const lightModeSaturation = { min: 10, max: 60, default: 30 };
  const darkModeSaturation = { min: 10, max: 60, default: 30 };

  const lightnessRange = isDark ? darkModeLightness : lightModeLightness;
  const saturationRange = isDark ? darkModeSaturation : lightModeSaturation;

  const getDefaultLightness = (theme: keyof typeof colorThemes, isDark: boolean) => {
    if (theme === 'sepia') return isDark ? 20 : 80;
    return isDark ? 20 : 95;
  };
  const getDefaultSaturation = (theme: keyof typeof colorThemes, isDark: boolean) => {
    // You can customize per-theme if desired
    return 30;
  };

  // When theme mode or theme changes, reset sliders if out of range
  useEffect(() => {
    const newLightness = getDefaultLightness(selectedTheme, isDark);
    const newSaturation = getDefaultSaturation(selectedTheme, isDark);
    if (selectedLightness < lightnessRange.min || selectedLightness > lightnessRange.max) {
      setSelectedLightness(newLightness);
    }
    if (selectedSaturation < saturationRange.min || selectedSaturation > saturationRange.max) {
      setSelectedSaturation(newSaturation);
    }
    // eslint-disable-next-line
  }, [isDark, selectedTheme]);

  // Apply theme styles to the page
  useEffect(() => {
    const applyTheme = () => {
      // Always use dynamicPrimary for both modes
      document.documentElement.style.setProperty('--theme-primary', dynamicPrimary);
      let mode: 'light' | 'dark';
      if (selectedThemeMode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        mode = selectedThemeMode;
      }
      const theme = colorThemes[selectedTheme];
      document.documentElement.style.setProperty('--theme-secondary', theme[mode].secondary);
      document.documentElement.style.setProperty('--theme-mode', mode);
      document.documentElement.style.setProperty('--theme-text', mode === 'dark' ? '#e8e8e8' : '#2c2c2c');
    };
    applyTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();
    if (selectedThemeMode === 'system') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return;
  }, [selectedTheme, selectedSaturation, selectedLightness, selectedThemeMode, dynamicPrimary]);

  // Handle escape key to close settings panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSettings) {
        setShowSettings(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSettings])

  // Open panel: show overlay and panel immediately
  useEffect(() => {
    if (showSettings) {
      setSettingsPanelVisible(true)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    } else if (settingsPanelVisible) {
      // Wait for slide-out animation before unmounting
      closeTimeoutRef.current = setTimeout(() => {
        setSettingsPanelVisible(false)
      }, 300)
    }
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    }
  }, [showSettings])

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
    <div className={
      `min-h-screen w-full flex flex-col items-center justify-center bg-base-200 transition-colors duration-300` +
      (isDark ? ' text-base-content' : '')
    }>
      {/* Settings button in bottom left */}
      <button 
        className="btn btn-circle btn-ghost fixed bottom-6 left-6 z-50"
        onClick={() => setShowSettings(!showSettings)}
        title="Settings"
        aria-label="Open settings"
        aria-expanded={showSettings}
        aria-controls="settings-panel"
      >
        <span className="text-2xl">···</span>
      </button>

      {/* Refresh button in bottom right */}
      <button 
        className="btn btn-circle btn-ghost fixed bottom-6 right-6 z-50"
        onClick={refreshQuote}
        disabled={loading}
        title="Refresh quote"
        aria-label={loading ? "Loading new quote..." : "Refresh quote"}
        aria-live="polite"
      >
        <span className="text-xl">↻</span>
      </button>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <span className="text-base opacity-70">Loading today's inspiration...</span>
              </div>
            ) : quote ? (
              <>
                <blockquote
                  className="text-center font-serif italic text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 relative"
                  style={{ fontFamily: `var(--quote-font)` }}
                >
                  <span className="opacity-30 text-5xl align-top select-none">“</span>
                  {quote.text}
                  <span className="opacity-30 text-5xl align-bottom select-none">”</span>
                </blockquote>
                <cite
                  className={`block text-lg md:text-xl font-semibold mt-2 mb-1 ${semanticColorThemes[selectedSemanticTheme as keyof typeof semanticColorThemes]?.className || 'text-primary'}`}
                  style={{ fontFamily: `var(--quote-font)` }}
                >
                  {quote.author}
                </cite>
                {quote.source && (
                  <div className="text-sm opacity-30 mb-2" style={{ fontFamily: `var(--quote-font)` }}>
                    {quote.source}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </main>

      {/* Settings panel with overlay */}
      {settingsPanelVisible && (
        <div
          className="fixed inset-0 z-[1001] bg-transparent flex"
          onClick={e => {
            if (e.target === e.currentTarget) setShowSettings(false);
          }}
          aria-label="Settings overlay"
        >
          <SettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            selectedTheme={selectedTheme}
            onThemeChange={(theme) => handleThemeChange(theme as keyof typeof colorThemes)}
            selectedSaturation={selectedSaturation}
            onSaturationChange={handleSaturationChange}
            selectedLightness={selectedLightness}
            onLightnessChange={handleLightnessChange}
            dynamicPrimary={dynamicPrimary}
            id="settings-panel"
            selectedThemeMode={selectedThemeMode}
            onThemeModeChange={handleThemeModeChange}
            lightnessMin={lightnessRange.min}
            lightnessMax={lightnessRange.max}
            saturationMin={saturationRange.min}
            saturationMax={saturationRange.max}
            selectedQuoteFont={selectedQuoteFont}
            onQuoteFontChange={handleQuoteFontChange}
            selectedUIFont={selectedUIFont}
            onUIFontChange={handleUIFontChange}
            selectedLightTheme={selectedLightTheme}
            selectedDarkTheme={selectedDarkTheme}
            onLightThemeChange={handleLightThemeChange}
            onDarkThemeChange={handleDarkThemeChange}
            selectedSemanticTheme={selectedSemanticTheme}
            onSemanticThemeChange={handleSemanticThemeChange}
          />
        </div>
      )}
    </div>
  )
}

// Development wrapper component
const DevWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div style={{
			width: '100vw',
			height: '100vh',
			background: 'linear-gradient(135deg, #fdfdf8 0%, #f5f5f0 100%)',
			position: 'relative',
			overflow: 'hidden'
		}}>
			{/* Development indicator */}
			<div style={{
				position: 'fixed',
				top: '10px',
				right: '10px',
				background: 'rgba(255, 0, 0, 0.8)',
				color: 'white',
				padding: '4px 8px',
				borderRadius: '4px',
				fontSize: '12px',
				fontFamily: 'monospace',
				zIndex: 9999
			}}>
				DEV MODE
			</div>
			{children}
		</div>
	)
}

// Main render logic
const rootElement = document.getElementById('newtab-root')
if (rootElement) {
	const root = ReactDOM.createRoot(rootElement)
	
	if (isDev) {
		// Development mode - wrap in dev container
		root.render(
			<DevWrapper>
				<NewTabApp />
			</DevWrapper>
		)
	} else {
		// Extension mode - render directly
		root.render(<NewTabApp />)
	}
}
