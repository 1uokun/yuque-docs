const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    // 必须指定产物的完整路径，否则使用方无法正确加载产物资源
    publicPath: "http://localhost:8081/dist/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "utils",
      filename: "esmJs.js",
      exposes: {
        "./utils": "./src/esm/utils",
      },
    }),
    new ModuleFederationPlugin({
      name: "routes",
      filename: "reactRoutes.js",
      exposes: {
        "./routes": "./src/react/routes",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        },
      },
    }),
  ],
  // 应用资源必须以 http(s) 形式提供服务
  // 所以这里需要使用 devServer 提供 http(s) server 能力
  devServer: {
    port: 8081,
    hot: true,
  },
};
