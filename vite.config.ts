import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ command }) => {
	const isDev = command === 'serve'
	const projectRoot = fileURLToPath(new URL('.', import.meta.url))
	
	const copyManifestPlugin = () => {
		let outDir = 'dist'
		
		return {
			name: 'copy-manifest',
			apply: 'build',
			configResolved(config) {
				outDir = config.build.outDir
			},
			closeBundle() {
				const outputDir = resolve(projectRoot, outDir)
				mkdirSync(outputDir, { recursive: true })
				copyFileSync(resolve(projectRoot, 'manifest.json'), resolve(outputDir, 'manifest.json'))
			}
		}
	}
	
	return {
		plugins: [react(), tailwindcss(), copyManifestPlugin()],
		root: '.',
		server: {
			port: 3000,
			open: '/newtab.html',
			host: true,
			// Same-origin proxy for ZenQuotes, which doesn't send CORS headers
			proxy: {
				'/api/zenquotes': {
					target: 'https://zenquotes.io',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/zenquotes/, '/api')
				}
			}
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
					// Code shared by the background worker and the new tab page lives in
					// its own chunk, so the new tab page never runs background.ts itself
					manualChunks: (id) => {
						if (/src\/(quoteService|storageService|runtime|sources\/)/.test(id)) {
							return 'shared'
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
