module.exports = {
  // options...
  devServer: {
    host: '0.0.0.0',
    public: process.env.NODE_ENV === 'production' ? 'askanna.localhost' : 'localhost'
  }
}
