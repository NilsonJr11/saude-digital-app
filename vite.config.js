import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Força o Vite a usar o esbuild (muito mais tolerante) em vez do lightningcss
    cssMinify: 'esbuild',
    chunkSizeWarningLimit: 1600,
  }
});