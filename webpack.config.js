'use strict';

var autoprefixer = require('autoprefixer');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './js/app.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },

  target: 'web',

  devServer: {
    port: 8080
  },

  devtool: '#inline-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.html$/, loader: 'html' },
      { test: /\.css$/, loaders: ['style', 'css', 'postcss'] }
    ]
  },
  postcss: function() {
    return [autoprefixer];
  }
};
