const path = require('path')
const webpack = require('webpack')

const __approot = __dirname // require('file-marker')('.approot')
const __src = path.resolve(__approot, 'src')
const __dist = path.resolve(__approot, 'dist')

const config = {
  stats: 'errors-only',
  target: 'node',
  devtool: 'source-map',
  externals: [
    require('webpack-node-externals')()
  ],
  entry: {
    index: path.resolve(__src, 'index.js')
  },
  output: {
    path: __dist,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.json', '.yaml'],
    alias: {
      '~': __src,
      '~paths': path.resolve(__approot, '.rootrc')
    }
  },
  module: {
    rules: [
      {
        test: /\.*\.?rc$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}

module.exports = [
  config
]
