const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: './src/app.ts',
  externals: [webpackNodeExternals()],
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  }
};
