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