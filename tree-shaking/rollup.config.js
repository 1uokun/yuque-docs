import babel from "rollup-plugin-babel";
import json from '@rollup/plugin-json';

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/bundle-rollup.js",
      sourcemap: false,
      format: "umd",
    },
    plugins: [
      babel({
        babelrc: false,
        runtimeHelpers: true,
        presets: ["@babel/preset-env"],
      }),
      json()
    ],
  },
];
