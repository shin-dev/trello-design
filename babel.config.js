module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        chrome: '80'
      },
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ]
}
