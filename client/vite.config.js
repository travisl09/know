import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-embedder-policy': 'require-corp'
    }
  },
  plugins: [
    vue(),
    // basicSsl({
    //   name: 'test'
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  envDir: './env'
})
