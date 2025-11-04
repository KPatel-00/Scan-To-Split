import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large dependencies into separate chunks (lazy-loaded only when needed)
          'pdf-export': ['jspdf'],
          'image-export': ['html2canvas', 'html-to-image'],
          'ai-scanning': ['@google/generative-ai'],
          // Keep React/Router in main bundle (needed everywhere)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Framer Motion separate (used across many pages)
          'motion': ['framer-motion'],
          // UI components separate
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase to 600kB (we're splitting manually now)
  },
})
