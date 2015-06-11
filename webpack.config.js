module.exports = {
  entry: './index.js',
  output: {
    path: './public/',
    filename: 'app.js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [{
      test: /\.css$/, loader: 'style-loader!css-loader'
    }]
  }
};
