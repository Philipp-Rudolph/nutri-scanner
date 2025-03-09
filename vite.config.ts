import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import path from 'path'

import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
    },
  },
})
