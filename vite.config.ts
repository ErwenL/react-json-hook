import { defineConfig, resolveBaseUrl } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "./src/index.ts",
      },
      formats: ["es"],
    }
  },
  plugins: [react()],
})
