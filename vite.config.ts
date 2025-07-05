import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
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
    global: 'globalThis'
  }
})
