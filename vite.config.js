import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'        // add React plugin
import tailwindcss from '@tailwindcss/vite'    // add Tailwind plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
