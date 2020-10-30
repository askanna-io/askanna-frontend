const path = require('path')
module.exports = {
  pwa: {
    name: 'AskAnna - Running Data Science Projects',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js'
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
