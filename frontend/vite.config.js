import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/create-farmer': 'http://127.0.0.1:5000',
      '/dashboard': 'http://127.0.0.1:5000',
      '/weather': 'http://127.0.0.1:5000',
      '/payout': 'http://127.0.0.1:5000',
      '/form-pool': 'http://127.0.0.1:5000',
    },
  },
})
