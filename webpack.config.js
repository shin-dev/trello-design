const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const path = require('path')

const outputPath = path.join(__dirname, 'dist')
const outputScriptsPath = path.join(__dirname, 'dist/scripts')
const context = 'src'
const srcScriptsContext = 'src/scripts'
const environment = process.env.NODE_ENV

module.exports = {
  entry: {
    content: `./${srcScriptsContext}/content.js`,
    options: `./${srcScriptsContext}/options.js`,
    background: `./${srcScriptsContext}/background.js`,
    popup: `./${srcScriptsContext}/popup.js`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }]
      }
    ]
  },
  output: {
    path: outputScriptsPath,
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: [path.join(outputPath, '**/*')]
    }),
    new CopyWebpackPlugin({
      patterns: [{
        context: context,
        from: `manifest.${environment}.json`,
        to: `${outputPath}/manifest.json`
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
  ]
}
