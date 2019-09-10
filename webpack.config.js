const path = require("path");

module.exports = {
  entry: "./app/js/application.js",
  output: {
    path: path.resolve(__dirname, "docs", "js"),
    filename: "application.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ],
  },
};
