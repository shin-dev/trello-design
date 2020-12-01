const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const path = require('path')

const outputPath = path.join(__dirname, 'dist')
const outputScriptsPath = path.join(__dirname, 'dist/scripts')
const context = 'src'
const srcScriptsContext = 'src/scripts'

module.exports = {
  entry: {
    content: `./${srcScriptsContext}/content.js`,
    options: `./${srcScriptsContext}/options.js`,
    background: `./${srcScriptsContext}/background.js`,
    popup: `./${srcScriptsContext}/popup.js`
  },
  output: {
    path: outputScriptsPath,
    filename: '[name].js'
  },
  plugins: [
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: ['content'],
        extensionPage: ['options'],
        background: 'background'
      }
    }),
    new CopyWebpackPlugin({
      patterns: [{
        context: context,
        from: 'manifest.json',
        to: outputPath
      }, {
        context: context,
        from: 'assets/**/*.*',
        to: outputPath
        // ignore: []
      }, {
        context: srcScriptsContext,
        from: 'content.css',
        to: outputScriptsPath
      }, {
        context: srcScriptsContext,
        from: 'options.html',
        to: outputScriptsPath
      }, {
        context: srcScriptsContext,
        from: 'popup.html',
        to: outputScriptsPath
      }]
    }),
    new WriteFileWebpackPlugin()
  ],
  // development settings
  mode: 'development',
  devtool: 'inline-source-map'
}
