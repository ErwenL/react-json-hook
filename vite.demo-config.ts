import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "./demos/dist"
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  plugins: [react()],
})
