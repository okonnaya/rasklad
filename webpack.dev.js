const path = require('node:path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    static: false,
    hot: true,
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/(?!assets\/|images\/|fonts\/)([^.?]+)$/,
          to: ({ match }) => '/' + match[1].replace(/\/$/, '') + '.html'
        }
      ]
    }
  },
  output: {
    path: path.resolve(__dirname, 'dev_build'),
    filename: 'assets/[name].js'
  }
})
