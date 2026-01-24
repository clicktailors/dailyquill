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
