const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {

    //Single
    app: './index.js',

    //Multiple files, bundled together
    //app: ['./home.js', './events.js', './vendor.js'],

    //Multiple files, multiple outputs
    lines: './lines.js',
    terrain: './terrain.js'
    //app: './app.js',
    //contact: './contact.js',

  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    //publicPath: '/dist',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        } 
      },

      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: 'file-loader?name=/img/[name].[ext]'
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            { loader: 'css-loader?sourceMap'},
            { loader: 'sass-loader?sourceMap'},
            { loader: 'postcss-loader?sourceMap' },
          ]
        })
      }

    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable:false,
      allChunks: true
    }),

/*    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            join_vars: true,
            if_return: true
        },
        output: {
            comments: false
        },
        sourceMap: true
    })*/

  ],


  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    publicPath: '/dist',
    compress: false,
    port: 9000
  },

  watch: true
};