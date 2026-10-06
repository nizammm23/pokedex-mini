import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pokedex-mini/', // ganti sesuai nama repo kamu
  plugins: [react()],
})
