// ```
// @datatype_void
// david.r.niciforovic@gmail.com
// webpack.common.js may be freely distributed under the MIT license
// ```

var webpack = require('webpack');
var helpers = require('../helpers');

//# Webpack Plugins
var CopyWebpackPlugin = (CopyWebpackPlugin = require('copy-webpack-plugin'), CopyWebpackPlugin.default || CopyWebpackPlugin);
const HtmlWebpackPlugin = require('html-webpack-plugin');

//# Webpack Constants
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'Angular 2 MEAN Webpack',
  baseUrl: '/',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
  ENV: ENV,
  HMR: HMR
};

//# Webpack Configuration
//
// See: http://webpack.github.io/docs/configuration.html#cli
module.exports = {
  entry: {

    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main': './src/main.ts',

  },

  // Options affecting the resolving of modules.
  //
  // See: http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],

    modules: ['node_modules']
  },

  module: {

    // An array of applied pre and post loaders.
    //
    // See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
    rules: [
      {
        test: /\.js$/,
        use: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular2-material'),
          helpers.root('node_modules/@angular')
        ]
      },

      {
        test: /\.ts$/,
        use:['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      // Json loader support for *.json files.
      {
        test: /\.json$/,
        use: 'json-loader'
      },

      {
        test: /\.css$/,
        use: 'raw-loader'
      },

      {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      },

      // Support for sass imports
      {
        test: /\.scss$/,
        use: 'style!css!autoprefixer-loader?browsers=last 2 versions!sass',
        exclude: [ helpers.root('node_modules') ]
      }

    ],

  },


  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),

    // Plugin: HtmlWebpackPlugin
    // Description: Simplifies creation of HTML files to serve your webpack bundles.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options:{
        metadata: METADATA,

        devtool: 'cheap-module-source-map'
      }

    })

  ],


  // Include polyfills or mocks for various node stuff
  // Description: Node configuration
  node: {
    console: false,
    global: true,
    process: true,
    __filename: "mock",
    __dirname: "mock",
    Buffer: true,
    setImmediate: true
  }
};
