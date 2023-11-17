const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    // chunkLoadTimeout: 10,
  },
  externals: {
    react: "React",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      //   minChunks: 1,
      //   minSize: 1,
      cacheGroups: {
        defaultVendors: {
          idHint: "vendors",
          test: /[\\/]node_modules[\\/]/,
          // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, // 单独打包react/reactDOM
          // 更激进的，如果生产环境已经部署 HTTP2/3 一类高性能网络协议，甚至可以考虑将每一个 NPM 包都打包成单独文件
          //   name(module) {
          //     const packageName = module.context.match(
          //       /[\\/]node_modules[\\/](.*?)([\\/]|$)/
          //     )[1];

          //     return `npm.${packageName.replace("@", "")}`;
          //   },
          chunks: "all",
          priority: -10,
        },
        default: {
          idHint: "common",
          chunks: "all",
          minChunks: 1,
          minSize: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: false,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProduction ? "[name].[contenthash].css" : "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  devServer: {
    port: 8082,
    hot: true,
    open: true,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
