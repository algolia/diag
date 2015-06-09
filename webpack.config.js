module.exports = {
  // add sourcemap
  devtool: 'eval',
  entry: {
    app: './example/app.js'
  },
  output: {
    path: './dist/',
    publicPath: '/',
    filename: 'diag.js'
  },
  devServer: {
    contentBase: './example/',
    inline: true
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
