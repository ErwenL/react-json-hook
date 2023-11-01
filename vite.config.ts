import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from "vite-plugin-dts"
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      formats: ["es", "umd"],
      name: "ReactJsonHook",
      fileName: (format) => `react-json-hook.${format}.js`
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        },
        sourcemap: true
      },
    }
  },
  plugins: [
    react(),
    dts( {rollupTypes: true, insertTypesEntry: true })
  ],
})
