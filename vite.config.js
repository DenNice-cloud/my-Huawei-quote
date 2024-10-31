import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-Huawei-quote/',
  plugins: [vue()],
  server: {
    proxy: {
      '/insult': {
        target: 'https://evilinsult.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/insult/, ''),
        secure: true,
      },
    },
  },
})
