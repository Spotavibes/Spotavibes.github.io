import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'        // React support
import tailwindcss from '@tailwindcss/vite'    // Tailwind support

export default defineConfig({
  
  base: './',
  build: {
    outDir: 'docs',
  },

  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port:5173,
    strictPort:true, //will fail if port 5173 is busy instead of switching ports
  }
})
