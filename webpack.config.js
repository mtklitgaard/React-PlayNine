module.exports = {
  entry: ['./app/script.jsx'],
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