import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:8090'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Same-origin /api in dev: forward to the Spring process (use same port as VITE_API_BASE_URL when set)
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
