// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const config = () => ({
  entry: "./src/index.ts",
  output: {
    path: path.resolve("./", "build"),
    filename: "index.cjs",
  },
  devtool: "inline-source-map",
  externalsPresets: { node: true },
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        use: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
});

module.exports = config;
