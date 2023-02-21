const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.json', '.js'],
    symlinks: false,
    cacheWithContext: false,
    plugins: [],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [],
  },
};