import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Spotavibes.github.io/', // 👈 Set to your repo name
  plugins: [react()],
});
