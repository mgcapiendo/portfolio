import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Phaser ships as one ~1.4 MB chunk (~375 KB gzipped). It is lazy-loaded
    // only when a visitor opens the park, so the warning is expected.
    chunkSizeWarningLimit: 1500,
  },
})
