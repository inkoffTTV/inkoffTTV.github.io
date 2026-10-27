import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: a user site (inkoffTTV.github.io) is served from '/',
// a project site from '/<repo>/'. The deploy workflow passes VITE_BASE.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: { target: 'es2022', sourcemap: false },
})
