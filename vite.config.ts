import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

import type { Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import HtmlPlugin from 'vite-plugin-html-config'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import { loadEnv, defineConfig, splitVendorChunkPlugin } from 'vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

function CreateAskAnnaConfig() {
  return <Plugin>{
    name: 'create-askanna-config',
    apply: 'build',

    async closeBundle() {
      // eslint-disable-next-line no-console
      console.log('start create askanna-config.yml......')
      console.log(process.env.VITE_APP_API_URL)

      const data = {
        'askanna-remote': process.env.VITE_APP_API_URL
      }
      try {
        const yamlStr = yaml.dump(data)
        fs.writeFileSync('./dist/askanna-config.yml', yamlStr, 'utf8')

        // eslint-disable-next-line no-console
        console.log('finish create askanna-config.yml.')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error on create askanna-config.yml.:', error)
      }

      try {
        const host = process.env.VITE_APP_URL

        let robotsContent = `User-agent: *\n`
        if (process.env.VITE_APP_ALLOW_ROBOTS === 'on') {
          robotsContent += `Allow: /\n`
        } else {
          robotsContent += `Disallow: /\n`
        }
        robotsContent += `Host: ${host}\n`

        fs.writeFileSync('./dist/robots.txt', robotsContent, 'utf8')

        // eslint-disable-next-line no-console
        console.log('finish create robots.txt')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error on create robots.txt:', error)
      }
    }
  }
}

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    base: '/',
    esbuild: {},
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6'
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        }
      }
    },
    plugins: [
      splitVendorChunkPlugin(),
      HtmlPlugin({
        metas: [
          {
            property: 'og:url',
            content: process.env.VITE_APP_URL
          }
        ],
        links: [
          {
            rel: 'canonical',
            href: process.env.VITE_APP_URL
          }
        ]
      }),

      Vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Vuetify({ autoImport: true }),
      AutoImport({
        vueTemplate: true,
        dirs: [
          'src/composables',
          'src/composables/store',
          'src/components/snackBar',
          'src/components/highlight',
          'src/composables/resumable',
          'src/components/uploadStatus',
          'src/features/**',
        ],
        dts: 'src/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', '@vueuse/core', { 'vuetify': ['useDisplay'] }],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        transformer: 'vue3',
        dts: 'src/components.d.ts',
        resolvers: [
          // Vuetify
          VuetifyResolver()
        ],
        dirs: [
          'src/layouts',
          'src/components',
          'src/features/**/components',
        ]
      }),
      VitePWA({
        workbox: {
          skipWaiting: true,
          cleanupOutdatedCaches: true,
        },
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'AskAnna',
          short_name: 'AskAnna',
          description:
            'Kickstart your next Data Science project with AskAnna. We make complex matters simple and intuitive to use. AskAnna empowers you to be in control of your data science project. Time is valuable. With our platform you can use more to tune your data and models.',
          theme_color: '#5d3eb2',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      CreateAskAnnaConfig()
    ],
    build: {
      commonjsOptions: {
        esmExternals: true,
      },
      sourcemap: true
    }
  })
}
