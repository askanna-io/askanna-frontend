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
  transpileDependencies: ['vuetify']
}
