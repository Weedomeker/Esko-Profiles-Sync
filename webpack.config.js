const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'

let config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './bundle.js',
  },
  target: ['electron-main', 'electron-renderer'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, './public'),
    },
    hot: true,
    compress: true,
    open: true,
  },
  optimization: {
    nodeEnv: isDev ? 'development' : 'production',
    minimize: true,
    minimizer: [new TerserPlugin({})],
  },
}

module.exports = config

if (process.env.NODE_ENV === 'production') {
  console.log('Production mode')
} else {
  console.log('Development mode')
}
