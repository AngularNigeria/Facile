
var helpers = require('../helpers');
// Use `webpack-merge` to merge configs
var webpackMerge = require('webpack-merge');
// Common `webpack` configuration for `dev` and `prod`
var commonConfig = require('./webpack.common.js');

// Webpack Plugins
var DefinePlugin = require('webpack/lib/DefinePlugin');
var HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
var NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');

//# Webpack Constants
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
  ENV: ENV,
  HMR: HMR
};

//# Environment Config Object
var envConfig = require('../config.json');

module.exports = webpackMerge(commonConfig, {

  output: {

    path: '/',

    filename: '[name].bundle.js',

    sourceMapFilename: '[name].map',

    chunkFilename: '[id].chunk.js',

    publicPath:'/'
  },


  plugins: [

    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin(),

    new DefinePlugin({
      'ENV': JSON.stringify(METADATA.ENV),
      'HMR': HMR,
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'NODE_ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR
      }
    })
  ],

  devServer: {
    // Proxy requests to our `Express` server
    proxy: {
      '*': {
        target: 'http://localhost:' + envConfig.PORT,
        secure: false
      },
    },
    port: METADATA.port,
    host: METADATA.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    outputPath: '/'
  }

});
