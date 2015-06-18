module.exports = {
  entry: './frontend/index.js',
  output: {
    path: './frontend/',
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [{
      test: /\.json$/, loader: 'json-loader'
    }]
  }
};
