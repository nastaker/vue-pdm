var copyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, {
        limit: 10240 
      }))

      

    config
    .plugin('copy')
    .use(copyWebpackPlugin, [
      [{
        from: 'src/static',
        to: 'static',
        
      }]
    ])
  }
}