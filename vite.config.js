import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'        // React support
import tailwindcss from '@tailwindcss/vite'    // Tailwind support

export default defineConfig({
  // 1) Serve assets relatively
  base: './',

  // 2) Output build into docs/
  build: {
    outDir: 'docs',
  },

  plugins: [
    react(),
    tailwindcss(),
  ],
})
