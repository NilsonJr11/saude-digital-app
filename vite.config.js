import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // O base deve ser apenas o nome do projeto no GitHub
  base: "/saude-digital-app/", 
})
