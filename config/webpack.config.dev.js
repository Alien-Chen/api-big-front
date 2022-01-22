const { merge } = require('webpack-merge')
const webpackBaseConfig = require('./webpack.config.base')

const webpackDevConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  stats: { children: false }
}

module.exports = merge(webpackBaseConfig, webpackDevConfig)