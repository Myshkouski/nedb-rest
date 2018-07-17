const path = require('path')
const webpack = require('webpack')

const __approot = __dirname
const __src = path.resolve(__approot, 'src')
const __dist = path.resolve(__approot, 'dist')

const config = {
  devtool: 'source-map',
  output: {
    path: __dist,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}

const node = Object.assign({
  target: 'node',
  node: {
    __dirname: false
  },
  externals: [
    require('webpack-node-externals')()
  ],
  entry: {
    server: path.resolve(__src, 'server'),
    'client.node': path.resolve(__src, 'client')
  }
}, config)

const browser = Object.assign({
  entry: {
    'client.browser': path.resolve(__src, 'client')
  }
}, config)

module.exports = [
  node,
  browser
]
