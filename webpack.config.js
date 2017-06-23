var webpack = require('webpack'),
  path = require('path'),
  OpenBrowserPlugin = require('open-browser-webpack-plugin')
module.exports = {
  entry: ['./script/drag.js'],
  output: {
    path: path.join(__dirname, './script'),
    filename: 'drag.bundle.js',
    publicPath: './'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // new OpenBrowserPlugin({
    //   url: 'http://localhost:9001'
    // })
  ]
}
