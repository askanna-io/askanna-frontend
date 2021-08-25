const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

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
      background_color: "#5d3eb2"
    }
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      const v = JSON.stringify(require('./package.json').version)
      args[0]['process.env']['VERSION'] = v
      return args
    })
  },
  devServer: {
    host: '0.0.0.0',
    public: process.env.NODE_ENV === 'production' ? 'askanna.127-0-0-1.nip.io' : 'localhost',
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [new handlerAfterCompilerDoneHook(createAskAnnaConfig)],
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@job': path.resolve(__dirname, 'src/features/job/'),
        '@jobs': path.resolve(__dirname, 'src/features/jobs/'),
        '@jobrun': path.resolve(__dirname, 'src/features/jobrun/'),
        '@project': path.resolve(__dirname, 'src/features/project/'),
        '@package': path.resolve(__dirname, 'src/features/package/'),
        '@packages': path.resolve(__dirname, 'src/features/packages/')
      }
    }
  }
}
