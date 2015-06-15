module.exports = {
  entry: './index.js',
  output: {
    path: './frontend/',
    filename: 'bundle.js'
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
