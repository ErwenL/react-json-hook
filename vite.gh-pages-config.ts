import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./dist",
  },
  base: "/react-json-hook/",
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  plugins: [react()]
})
