const ExtensionReloader = require('webpack-extension-reloader')
const config = require('./webpack.config')

module.exports = Object.assign({}, config, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: config.plugins.concat([
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: ['content'],
        extensionPage: ['options', 'popup'],
        background: 'background'
      }
    })
  ])
})
