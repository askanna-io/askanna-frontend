import path from 'path'
const fs = require('fs')
import Robots from './robots'
const yaml = require('js-yaml')
import type { Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue2'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv } from 'vite'
import htmlPlugin from 'vite-plugin-html-config'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

function createAskAnnaConfig() {
  return <Plugin>{
    name: 'create-ask-anna-config',
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
        const robotstxtOpt = process.env.VITE_APP_IS_BETA === 'on' ? Robots.beta : Robots.default

        fs.writeFileSync('./dist/robots.txt', robotstxtOpt, 'utf8')

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
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true
          }),
          NodeModulesPolyfillPlugin()
        ]
      }
    },
    plugins: [
      htmlPlugin({
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
      VitePWA({
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'AskAnna - Kickstart your Data Science project!',
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
      Vue(),
      AutoImport({
        vueTemplate: true,
        dirs: [
          'src/composables',
          'src/composables/store',
          'src/components/snackBar',
          'src/components/highlight',
          'src/composables/resumable',
          'src/components/uploadStatus',

          'src/features/job',
          'src/features/run',
          'src/features/runs',
          'src/features/jobs',
          'src/features/auth',
          'src/features/file',
          'src/features/user',
          'src/features/charts',
          'src/features/metric',
          'src/features/people',
          'src/features/project',
          'src/features/package',
          'src/features/packages',
          'src/features/projects',
          'src/features/variables',
          'src/features/workspace',
          'src/features/workspaces',
          'src/features/compare-runs',
          'src/features/run-variables'
        ],
        dts: 'src/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router']
      }),
      Components({
        transformer: 'vue2',
        dts: 'src/components.d.ts',
        resolvers: [
          // Vuetify
          VuetifyResolver()
        ],
        dirs: [
          'src/components',
          'src/features/job/components',
          'src/features/run/components',
          'src/features/runs/components',
          'src/features/jobs/components',
          'src/features/auth/components',
          'src/features/file/components',
          'src/features/user/components',
          'src/features/charts/components',
          'src/features/metric/components',
          'src/features/people/components',
          'src/features/package/components',
          'src/features/project/components',
          'src/features/packages/components',
          'src/features/projects/components',
          'src/features/variables/components',
          'src/features/workspace/components',
          'src/features/workspaces/components',
          'src/features/compare-runs/components',
          'src/features/run-variables/components'
        ]
      }),
      createAskAnnaConfig()
    ],
    build: {
      sourcemap: true,
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          rollupNodePolyFill()
        ]
      }
    }
  })
}
