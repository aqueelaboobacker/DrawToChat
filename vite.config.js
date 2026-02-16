import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from '@samrum/vite-plugin-web-extension'
import path from 'path'
import fs from 'fs'

const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'manifest.json'), 'utf-8'))
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

const finalManifest = {
  ...manifest,
  version: pkg.version,
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: finalManifest,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
