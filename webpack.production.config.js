const path = require('path');
const webpack = require('webpack');

const entry = path.resolve(__dirname, 'src', 'index');
const output = path.resolve(__dirname, 'build');

const config = {
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  entry,
  output: {
    path: output,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
    }, {
      test: /\.scss$/,
      loaders: ['style',
                'css?modules&localIdentName=[name]_[local]_[hash:base64:5]',
                'sass',
                'toolbox'],
    }],
  },
  toolbox: {
    theme: 'src/components/themes/theme.scss'
  },
};

module.exports = config;
