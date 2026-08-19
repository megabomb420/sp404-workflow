import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Podstawa builda. Domyślnie '/', a przy deployu na GitHub Pages ustawiana
 * w workflow (np. BASE_PATH=/sp404-workflow/ — podścieżka projektu).
 */
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'SP Workflow',
        short_name: 'SP Workflow',
        description: 'Interaktywny przewodnik workflow Roland SP-404MKII — szybki dostęp do funkcji, skrótów i workflow.',
        lang: 'pl',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#121315',
        theme_color: '#121315',
        categories: ['music', 'education', 'utilities'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\.(?:woff2|woff)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      },
      devOptions: { enabled: true }
    })
  ]
})
