import { get } from "./es_module";

// import * as _ from "./es_module";
// 🚩_.get 这样也是生效的

// import _ from "./es_module"
// 🚩default导出方式，这样也是生效的

// const has = require("./cjs_module").has
// 🚩rollup/webpack都不支持commonjs的tree-shaking
// 这种引入方式打包后，rollup依然是require(xxx)，而不是对应源代码
// webpack会把整个文件打包进去

// import {get} from 'lodash' ❌
// import {get} from 'lodash-es' ✅
// 🚩请尽可能使用es模块

import json from "./data.json";
// 🚩json也是支持tree-shaking的

// const get = require('./es_module').get
// 🚩webpack5支持cjs风格的引入，但是对应模块依然必须是es module导出方式

class A {
  constructor() {
    console.log(get)
    // console.log(_.get);
    // console.log(_)
    // console.log(has);
    console.log(json.used)
  }
}

class C {
  constructor() {}
}

new A();
