const path = require('path')
module.exports = {
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      const v = JSON.stringify(require('./package.json').version)
      args[0]['process.env']['VERSION'] = v
      return args
    })
  },
  devServer: {
    host: '0.0.0.0',
    public: process.env.NODE_ENV === 'production' ? 'askanna.localhost' : 'localhost'
  },
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@job': path.resolve(__dirname, 'src/features/job/'),
        '@jobs': path.resolve(__dirname, 'src/features/jobs/'),
        '@project': path.resolve(__dirname, 'src/features/project/'),
        '@package': path.resolve(__dirname, 'src/features/package/'),
        '@packages': path.resolve(__dirname, 'src/features/packages/')
      }
    }
  }
}
