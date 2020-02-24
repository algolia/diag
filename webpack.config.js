var path = require('path');

module.exports = {
  entry: './frontend/index.js',
  output: {
    path: path.resolve(__dirname, "./frontend/"),
    filename: 'bundle.js'
  },
  node: {
    fs: 'empty'
  }
};
