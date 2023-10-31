import babel from "rollup-plugin-babel";

export default [
  {
    input: "main.js",
    output: {
      file: "bundle.js",
      sourcemap: false,
      format: "umd",
    },
    plugins: [
      babel({
        babelrc: false,
        runtimeHelpers: true,
        presets: ["@babel/preset-env"],
      }),
    ],
  },
];
