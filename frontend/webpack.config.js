const webpack = require("webpack");
const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "path": require.resolve("path-browserify"),
      "fs": false,
      "querystring": require.resolve("querystring-es3"),
    },
    alias: {
      '@/components': path.resolve(__dirname, 'src/components/'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};