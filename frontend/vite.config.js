import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/static/front/',
  build: {
    outDir: '../estoque/static/front',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'chunk-[name].js',
        assetFileNames: 'app[extname]',
      },
    },
  },
  server: { proxy: { '/api': 'http://localhost:8000' } },
})
