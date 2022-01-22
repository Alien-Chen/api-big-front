const { merge } = require('webpack-merge')
const webpackBaseConfig = require('./webpack.config.base')
const TerserPlugin = require('terser-webpack-plugin')

const webpackProdConfig = {
  mode: 'production',
  stats: { children: false, warnings: false },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: false,
            dead_code: true,
            drop_debugger: true
          }
        }
      })
    ]
  }
}

module.exports = merge(webpackBaseConfig, webpackProdConfig)