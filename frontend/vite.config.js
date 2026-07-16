import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@tremor/react')) return 'tremor'
          if (id.includes('node_modules/recharts')) return 'recharts'
          if (id.includes('node_modules/react-router-dom')) return 'router'
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173
  }
})
