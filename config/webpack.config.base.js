const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpackNodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

const webpackBaseConfig = {
  target: 'node',
  entry: {
    main: path.join(__dirname, '../src/index.js')
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify')
    },
    alias: {
      '@': path.resolve(__dirname, '../src/')
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: [path.join(__dirname, '../node_modules')]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
     new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'prod'
            ? "'production'"
            : "'development'",
      },
    })
  ],
  externals: [ webpackNodeExternals() ],
  node: {
    __dirname: true,
    __filename: true,
    global: true
  }
}

module.exports = webpackBaseConfig