import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Evita que avisos de variáveis não usadas travem a geração do build final
    chunkSizeWarningLimit: 1600,
  }
});
