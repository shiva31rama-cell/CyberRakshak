/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE lets the same build run at "/" (Vercel/Netlify) or "/CyberRakshak/" (GitHub Pages).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
})
