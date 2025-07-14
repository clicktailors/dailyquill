export const colorThemes = {
	default: {
		name: 'Classic',
		light: {
			primary: '#fdfdf8',
			secondary: '#f5f5f0',
		},
		dark: {
			primary: '#0f0f0f',
			secondary: '#1a1a1a',
		},
	},
	sepia: {
		name: 'Sepia',
		light: {
			primary: '#f5f1e8',
			secondary: '#ede4d3',
		},
		dark: {
			primary: '#2a2218',
			secondary: '#342b1f',
		},
	},
	sage: {
		name: 'Sage',
		light: {
			primary: '#f2f5f1',
			secondary: '#e6ebe4',
		},
		dark: {
			primary: '#1a2118',
			secondary: '#242d21',
		},
	},
	rose: {
		name: 'Rose',
		light: {
			primary: '#f5f1f2',
			secondary: '#ebe4e6',
		},
		dark: {
			primary: '#2a1a1c',
			secondary: '#342024',
		},
	},
};

export const baseHueMap: Record<string, number> = {
	default: 39,
	sepia: 39,
	sage: 70,
	rose: 330,
};

// DaisyUI semantic color themes for different text emphasis
export const semanticColorThemes = {
	primary: {
		name: 'Primary',
		description: 'Main brand color emphasis',
		className: 'text-primary'
	},
	secondary: {
		name: 'Secondary',
		description: 'Supporting color emphasis',
		className: 'text-secondary'
	},
	accent: {
		name: 'Accent',
		description: 'Accent color emphasis',
		className: 'text-accent'
	},
	neutral: {
		name: 'Neutral',
		description: 'Subtle text that matches main content',
		className: 'text-base-content/50'
	}
};

// DaisyUI themes organized by light/dark categories
export const daisyThemeCategories = {
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
			{ id: 'winter', name: 'Winter' }
		]
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
			{ id: 'business', name: 'Business' }
		]
	}
};

// Font system for quotes and UI
export const quoteFonts = {
	classic: {
		name: 'Classic Serif',
		family: 'Cormorant Garamond, serif',
		googleFont: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500',
		category: 'serif'
	},
	modern: {
		name: 'Modern Sans',
		family: 'Inter, sans-serif',
		googleFont: 'Inter:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400',
		category: 'sans-serif'
	},
	elegant: {
		name: 'Elegant Script',
		family: 'Playfair Display, serif',
		googleFont: 'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500',
		category: 'serif'
	},
	minimal: {
		name: 'Minimal',
		family: 'Source Sans Pro, sans-serif',
		googleFont: 'Source+Sans+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400',
		category: 'sans-serif'
	},
	poetry: {
		name: 'Poetry',
		family: 'Lora, serif',
		googleFont: 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500',
		category: 'serif'
	}
};

export const uiFonts = {
	readable: {
		name: 'Readable',
		family: 'Inter, sans-serif',
		googleFont: 'Inter:wght@300;400;500;600'
	},
	clean: {
		name: 'Clean',
		family: 'Source Sans Pro, sans-serif',
		googleFont: 'Source+Sans+Pro:wght@300;400;500;600'
	},
	system: {
		name: 'System',
		family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		googleFont: null
	}
};

// Default font selections
export const defaultFonts = {
	quote: 'classic',
	ui: 'readable'
}; 