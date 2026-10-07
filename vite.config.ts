import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seoFilesPlugin } from './seo/vite-plugin-seo-files.ts'
import { apiDevPlugin } from './api/vite-plugin-api.ts'

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [react(), seoFilesPlugin(), apiDevPlugin()],
})

