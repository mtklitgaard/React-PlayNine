var webpack = require('webpack');  
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./app/app.jsx'],
  output: {
    path: './build',
    filename: 'app.js'
  },
  module: {
   loaders: [
              {
                  test: /\.jsx?$/,
                  exclude: /node_modules/,
                  loader: "babel"
              },
              {
                 test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style","css!sass")            
              }
            ],
        },
    plugins: [
              new ExtractTextPlugin('style.css')
          ]            
    
};