import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from "vite-plugin-eslint"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    proxy: {
      // Using the proxy object to redirect API requests to the backend server
      '/api': {
        target: 'http://localhost:9000', // The backend server's URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
