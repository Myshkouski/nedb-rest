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

const server = Object.assign({
  target: 'node',
  node: {
    __dirname: false
  },
  externals: [
    require('webpack-node-externals')()
  ],
  entry: {
    server: path.resolve(__src, 'server.js')
  }
}, config)

const client = Object.assign({
  entry: {
    client: path.resolve(__src, 'client.js')
  }
}, config)

module.exports = [
  server,
  client
]
