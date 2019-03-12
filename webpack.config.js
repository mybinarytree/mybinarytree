'use strict'

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'src')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.scss'
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'src/*.jpg',
        to: './',
        flatten: true
      }
    ]),
    new OptimizeCSSAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new HtmlMinifierPlugin({
      collapseWhitespace: true
    })
  ],
  optimization: {
    minimize: true
  }
}
