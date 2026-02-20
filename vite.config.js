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

// Plugin to fix Manifest V3 remote code violation from Excalidraw's twitter embed
const stripTwitterScript = () => {
  return {
    name: 'strip-twitter-script',
    enforce: 'post',
    generateBundle(options, bundle) {
      const stringToStrip = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\\/script>';
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          // Replace all occurrences of the string
          if (chunk.code.includes(stringToStrip)) {
             chunk.code = chunk.code.split(stringToStrip).join('');
          }
        }
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: finalManifest,
    }),
    stripTwitterScript(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
