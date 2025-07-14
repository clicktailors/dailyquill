/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./newtab.html"
	],
	theme: {
		extend: {
			boxShadow: {
				'xl': '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
				'daisy': '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			"light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
			"synthwave", "retro", "cyberpunk", "valentine", "halloween", 
			"garden", "forest", "aqua", "lofi", "pastel", "fantasy", 
			"wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
			"business", "acid", "lemonade", "night", "coffee", "winter", 
			"dim", "nord", "sunset"
		],
		base: true,
		styled: true,
		utils: true,
		logs: false,
		rtl: false,
		prefix: '',
		darkTheme: 'dark',
		// Remove glass/emboss effect globally
		// Use custom shadow for card and btn
		theme: {
			'card': {
				'box-shadow': '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
				'backdrop-blur': '0',
				'background': 'var(--fallback-b1,oklch(var(--b1)/1))',
			},
			'btn': {
				'box-shadow': '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)',
				'backdrop-blur': '0',
			},
		},
	},
} 