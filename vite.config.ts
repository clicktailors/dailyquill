import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => {
	const isDev = command === 'serve'
	
	return {
		plugins: [react(), tailwindcss()],
		root: '.',
		server: {
			port: 3000,
			open: '/newtab.html',
			host: true
		},
		build: {
			modulePreload: { polyfill: false },
			rollupOptions: {
				input: {
					newtab: './newtab.html',
					background: './src/background.ts'
				},
				output: {
					entryFileNames: (chunkInfo) => {
						return chunkInfo.name === 'background' ? 'background.js' : '[name]-[hash].js'
					},
					format: 'es',
					// Bundle background script dependencies into a single file
					manualChunks: (id) => {
						if (id.includes('background') || id.includes('quoteService') || id.includes('storageService')) {
							return 'background'
						}
					}
				}
			}
		},
		define: {
			global: 'globalThis',
			// Add environment variable for development mode
			__DEV__: isDev
		}
	}
})
