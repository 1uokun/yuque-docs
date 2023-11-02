const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle-webpack.js",
    path: path.resolve(__dirname, "dist"),
  },

  // 不压缩测试代码
  // mode: "development",
  // devtool: 'cheap-module-source-map',
  // optimization: {
  //   usedExports: true,
  //   minimize: false,
  //   minimizer: [new TerserPlugin()]
  // },

  // 生产代码
  mode: "production",
};
