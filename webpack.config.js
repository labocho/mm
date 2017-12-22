const path = require("path");

module.exports = {
  entry: "./app/js/application.js",
  output: {
    path: path.resolve(__dirname, "docs", "js"),
    filename: "application.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ],
  },
};
