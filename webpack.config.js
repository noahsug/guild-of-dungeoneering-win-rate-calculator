import path from 'path';
import webpack from 'webpack';

module.exports = {
  devtool: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src'),
    }, {
      test: /\.scss$/,
      loaders: ['style',
                'css?modules&localIdentName=[name]_[local]_[hash:base64:5]',
                'sass',
                'toolbox']
    }],
  },
  toolbox: {
    theme: 'src/components/themes/theme.scss'
  },
};
