import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log('Listening at http://localhost:3000');
  }
});
