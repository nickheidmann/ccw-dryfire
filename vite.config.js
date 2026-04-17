import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
          react(),
          VitePWA({
                  registerType: 'autoUpdate',
                  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
                  manifest: {
                            name: 'CCW Dry-Fire Trainer',
                            short_name: 'DryFire',
                            description: 'Daily dry-fire practice tracker for CCW carriers',
                            theme_color: '#1a1a1a',
                            background_color: '#1a1a1a',
                            display: 'standalone',
                            orientation: 'portrait',
                            scope: '/',
                            start_url: '/',
                            icons: [
                              {
                                            src: 'icon-192.png',
                                            sizes: '192x192',
                                            type: 'image/png'
                              },
                              {
                                            src: 'icon-512.png',
                                            sizes: '512x512',
                                            type: 'image/png'
                              },
                              {
                                            src: 'icon-maskable-512.png',
                                            sizes: '512x512',
                                            type: 'image/png',
                                            purpose: 'maskable'
                              }
                                      ]
                  }
          })
        ]
})
