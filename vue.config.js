const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const RobotstxtPlugin = require('robotstxt-webpack-plugin')

const defaultRobotstxtOpt = {
  policy: [
    {
      userAgent: '*',
      disallow: '/'
    }
  ],
  host: process.env.VUE_APP_URL
}

const betaRobotstxtOpt = {
  policy: [
    {
      userAgent: '*',
      allow: '/'
    }
  ],
  host: process.env.VUE_APP_URL
}

const robotstxtOpt = process.env.VUE_APP_IS_BETA === 'on' ? betaRobotstxtOpt : defaultRobotstxtOpt

const createAskAnnaConfig = () => {
  // eslint-disable-next-line no-console
  console.log('start create askanna-config.yml......')

  const data = {
    'askanna-remote': process.env.VUE_APP_API_URL
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
}

const handlerAfterCompilerDoneHook = function (cb) {
  this.apply = function (compiler) {
    if (compiler.hooks && compiler.hooks.done) {
      compiler.hooks.done.tap('webpack-arbitrary-code', cb)
    }
  }
}

module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    name: 'AskAnna',
    themeColor: '#5d3eb2',
    msTileColor: '#5d3eb2',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js'
    },
    manifestOptions: {
      background_color: '#5d3eb2'
    }
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      const v = JSON.stringify(require('./package.json').version)
      args[0]['process.env']['VERSION'] = v
      return args
    })
    config.plugin('html').tap(args => {
      args[0].siteurl = process.env.VUE_APP_URL
      return args
    })
  },
  devServer: {
    host: '0.0.0.0',
    public: process.env.NODE_ENV === 'production' ? 'askanna.127-0-0-1.nip.io' : 'localhost',
    disableHostCheck: true
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new handlerAfterCompilerDoneHook(createAskAnnaConfig),
      new RobotstxtPlugin(robotstxtOpt),
      require('unplugin-vue2-script-setup').webpack({})
    ],
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@job': path.resolve(__dirname, 'src/features/job/'),
        '@run': path.resolve(__dirname, 'src/features/run/'),
        '@jobs': path.resolve(__dirname, 'src/features/jobs/'),
        '@project': path.resolve(__dirname, 'src/features/project/'),
        '@package': path.resolve(__dirname, 'src/features/package/'),
        '@packages': path.resolve(__dirname, 'src/features/packages/')
      }
    }
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker')
  }
}
