const WebpackZipPlugin = require('webpack-zip-plugin')
const config = require('./webpack.config')

module.exports = Object.assign({}, config, {
  mode: 'production',
  plugins: config.plugins.concat([
    new WebpackZipPlugin({
      initialFile: './dist',
      endPath: './dist',
      zipName: 'trello-design.zip',
      frontShell: 'echo "=== WebpackZipPlugin ==="'
    })
  ])
})
