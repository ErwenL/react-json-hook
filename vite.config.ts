import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from "vite-plugin-dts"
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // entry: resolve(__dirname, "./src/index.ts"),
      // formats: ["es", "umd"],
      // name: "ReactJsonHook",
      // fileName: (format) => `index.${format}.js`
      entry: {index: resolve(__dirname, "./src/index.ts")},
      formats: ["es"],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      }
    }
  },
  plugins: [
    react(),
    dts( {rollupTypes: true, insertTypesEntry: true })
  ],
})
