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
        }
      }
    }
  },
  define: {
    global: 'globalThis'
  }
})
