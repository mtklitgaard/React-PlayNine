var webpack = require('webpack');  
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
              }
            ]
          }
};