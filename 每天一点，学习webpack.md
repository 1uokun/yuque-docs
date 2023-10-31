> 代码参考：[https://github.com/shfshanyue/node-examples/tree/master/engineering/webpack](https://github.com/shfshanyue/node-examples/tree/master/engineering/webpack)

# CommonJS模块打包
打包前开发代码
```javascript
// sum.js
module.exports = (...args) => args.reduce((x, y) => x + y, 0);

// entry.js
const sum = require('./sum.js');
sum(3,8);
```
打包结果:

1. `**__webpack_modules__**`: 一个数组，存储了所有模块。
将入口模块解析为AST，根据AST深度优先搜索所有的模块，并构建出这个模块数组。
每个模块都由一个包裹函数`(module, module.exports, __webpack_require__)`对模块进行包裹构成
2. `**__webpack_require__(moduleId)**`: 手动实现加载一个模块。
对已加载过的模块进行缓存，对未加载过的模块，根据id定位到`__webpack_modules__`中的包裹函数，执行并返回`module.exports`，并缓存。
```javascript
var __webpack_modules__ = [
  (module) => {
    // 业务模块代码
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);
  },
];

// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {
  // Check if module is in cache
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  } // Create a new module (and put it into the cache)
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {},
  }); // Execute the module function

  // 🌟利用包裹函数直接对参数进行赋值，确保module内部是通过module.exports来导出模块的
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__); // Return the exports of the module

  return module.exports;
}

var __webpack_exports__ = {};

// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
  const sum = __webpack_require__(1);

  sum(3, 8);
})();

```
精简版本
```javascript
const __webpack_modules__ = [
  (module, require)=> {
    // 业务模块代码
    const a = require('./a') // 递归balabala
    
    module.exports = ...
  }
];

const __webpack_require__ = (id) => {
  const module = { exports: {} };
  const m = __webpack_modules__[id](module, __webpack_require__);
  return module.exports;
};

//entry.js
const xxx = __webpack_require__(0);
```
# ESModule模块打包
打包前开发代码
```javascript
// sum.js
export const sum = (...args) => args.reduce((x, y) => x + y, 0);
export default sum;

// entry.js
const sum = require('./sum.js');
sum(3,8);
```
精简版本
```javascript
const __webpack_modules__ = [
  (__unused_webpack_module, __webpack_exports__,__webpack_require__)=> {
    
    __webpack_require__.r(__webpack_exports__);
    // esmodule 改为 commonjs 数据结构
    __webpack_require__.d(__webpack_exports__, {
      "default": () => (__WEBPACK_DEFAULT_EXPORT__), // export default
      "sum": () => (sum) // export ModuleName
    });
    
    // 业务模块代码
    // export ModuleName
    const sum = ...;
    // export default
    const __WEBPACK_DEFAULT_EXPORT__ = (sum);
  }
];

const __webpack_require__ = (id) => {
  const module = { exports: {} };
  const m = __webpack_modules__[id](module, __webpack_require__);
  return module.exports;
};

// ES6 module 对象标识占位
var __webpack_exports__ = {
  // 如果有ESM,则值被赋值为
  // __esModule: true,
  // Symbol(Symbol.toStringTag): "Module"
};

//entry.js
(()=>{
  __webpack_require__.r(__webpack_exports__);
  const xxx = __webpack_require__(0);
})

```
打包结果：

1. `__webpack_require__.d`
Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
2. `__webpack_require__.r`
Object.defineProperty(exports, '__esModule', { value: true });
## Tree Shaking
`Tree Shaking`指基于**ES Module**进行静态分析，通过AST将用不到的函数进行移除，从而减小打包体积。

1. `**import ***`**依然有效
**import * as maths from "./maths";

2. `**JSON TreeShaking**`**json未用的字段也依然有效**
import obj from "./main.json";

3. **引入支持Tree Shaking的Package
使用**`**lodash-es**`**替代**`**lodash**`**

4. **Rollup 首先提出并实现的，webpack 在2.x版本借助 UglifyJS 实现
dead-code前需要分析模块之间的依赖关系、导出的变量哪些被使用，哪些没被使用。
还要保证代码没有副作用，才能删除掉
**副作用会导致tree-shaking失败（babel转es5时会产生大量副作用的垃圾代码）
可以通过`/*@__PURE__*/`声明此函数无副作用**
参考链接：**[《你的Tree-Shaking并没什么卵用》](https://zhuanlan.zhihu.com/p/32831172)

5. **webpack 4之前只支持ES模块的使用，不支持CommonJS、只分析浅层模块导出和引入关系**
6. **webpack 5增加了CommonJS风格模块代码的静态分析功能、支持嵌套引入模块的依赖分析优化

**
# Code Spliting代码切割
打包前开发代码
```javascript
import("./sum").then((m) => {
  m.default(3, 4);
});
```
精简版本：
```javascript
/* webpack/runtime/ensure chunk */
__webpack_require__.f = {};

// JSONP chunk
__webpack_require__.f.j = (chunkId, promises) => {
  __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
}

// 动态加载script并监听onload
__webpack_require__.l = ()=> {
  script.onload
  document.head.appendChild(script)
}

__webpack_require__.e = (chunkId) => {
  return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key/*! .j */) => {
    __webpack_require__.f[key](chunkId, promises);
    return promises;
  }, []));
};

// jsonp回调
var chunkLoadingGlobal = self["webpackChunkyour_project"] = self["webpackChunkyour_project"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));

// 业务代码
__webpack_require__.e(/*! import()  */ 1)
  .then(__webpack_require__.bind(__webpack_require__, /*! ./A 自定义的module */ 2))
  .then(res=>{
    console.log(res)
  })
  
})();
```
async.js:
```javascript
(self["webpackChunkyour_project"] = self["webpackChunkyour_project"] || [])
// 这里push就会执行webpackJsonpCallback动作
  .push([[1],{
  [moduleId]: 
  (module, require)=> {
    // 业务模块代码
    const a = require('./a') // 递归balabala
    
    module.exports = ...
  }
}])
```
打包结果：

1. `__webpack_require__.e`: 异步加载 chunk。该函数将使用 `document.createElement('script')` 异步加载 chunk 并封装为 `Promise`。
2. `self["webpackChunk"].push`: JSONP cllaback，收集 modules 至 `__webpack_modules__`，并将 `__webpack_require__.e` 的 Promise 进行 resolve。
# HMR热更新
也称**热模块替换，借助**`**webpack-dev-server**`**实现**
**实现过程：**

1. 用`**memfs**`模拟node.js`**fs**`API将打包输出bundle使用内存型文件系统控制，而非真实的文件系统。
2. 用`**chokidar**`监听文件变更，告诉webpack重新编译被修改的`**module**`
3. 用`**ws**`通知浏览器，浏览器接收到hash，以JSONP的方式请求更新模块的chunk
4. 🚩🚩**核心思想**🚩🚩：runtime.js内相关代码实现替换`__webpack_modules__`内指定id的模块
粒度是module chunk，runtime.hash.js不重新请求，只变更hash
```javascript
// webpack 运行时代码
const __webpack_modules__ = [
  (module, exports, __webpack_require__) => {
    __webpack_require__(0);
  },
  ...
  // id为7
  () => {
    console.log("这是一号模块");
  },
];

// HMR Chunk 代码
// JSONP 异步加载的所需要更新的 modules，并在 __webpack_modules__ 中进行替换
self["webpackHotUpdate"](0, {
  7: () => {
    console.log("这是最新的一号模块");
  },
});
```



# 《通过Tree Shaking（摇树）来减少Javascript载荷》[1]

#### 1.什么是Tree Shaking（摇树）？

`Tree Shaking`是消除死代码的一种形式，该术语由Rollup推广

```diff
- import arrayUtils from 'array-utils';
+ import { unique, implode } from 'array-utils'
```

#### 2.防止Babel将ES6模块转换为CommonJS模块

`.babelrc`或`package.json`配置babel-preset-env不使用ES6模块,
它会自动完成ES模块转换为CommonJS模块（即最终为`require`而不是`import`）

```json
{
  "presets": [
    ["env", {
      "modules": false
    }]
  ]
}
```

#### 3.注意副作用

使用`import`引用模块可能会造成_副作用_（函数副作用）,因为`import`是值的引用，而不像`require`值的拷贝。
_副作用_也适用于ES6模块，接受可预测输入并获得同等可预测输出 而不修改其自身范围之外的任何内容的模块
它们是独立的_模块化_代码段。在`Webpack`中可以通过`"sideEffects": false`在`package.json`中进行指定暗示软件包及其依赖项没有_副作用_

```json
{
  "name": "webpack-tree-shaking-example",
  "version": "1.0.0",
  "sideEffects": false
}
```

或者指定特定文件没有副作用

```json
{
  "name": "webpack-tree-shaking-example",
  "version": "1.0.0",
  “sideEffects”: [
    "./src/utils/utils.js"
  ]
}
```

#### `/*@__PURE__*/`

由于JS语法的复杂程度，webpack没有打算给JS实现**数据流分析**，所以插件无法知道一个函数调用是否具有副作用的。
所以对于一些导出模块，如果是纯的函数调用，则需要加上`/*@__PURE__*/`注释来表明这个函数是pure的（拥有独立的域）。
这是`uglifyjs`(一个压缩工具)使用的方法。当然也可以使用相关的babel插件进行批量添加。

```javascript
var allPass = /*#__PURE__*/_curry1(function(){

})
```

#### 4.cherry-picking（像采摘樱桃一样摘只要的那部分）

由于`"sideEffects"`只适用于webpack，所以在非webpack环境下需要其他方案替代

- `babel-plugin-lodash`

```javascript
import { sortBy } from "lodash"
import sortBy from "loadsh-es/sortBy"
```

还有其他类似的摇树功能：

- `webpack-common-shake`
  删除无效代码 由UglifyJS（或其他优化程序）决定 

```javascript
 exports.used = 1;
 var tmp = exports.unused = 2;
 ↓ ↓ ↓ ↓ ↓ ↓
 exports.used = 1;
 var tmp = 2;
```

- `ant-design/babel-plugin-import` 

```javascript
 import { Button } from 'antd';
 ↓ ↓ ↓ ↓ ↓ ↓
 var _button = require('antd/lib/button');
```

# ESModule对Tree-Shaking的优势[2]

1. Webpack从2开始也支持Tree-shaking，即对于一个模块，没有被使用过的引入代码并不会被打包 

```javascript
 import {isNumber, isString} from 'loadsh-es';

 isNumber(123);

 //最总isString代码不会被打包
```

2. **原理**
   相对于CommonJS，ESModule对静态分析更友好，
   通过**作用域分析**(scope analysis)可以知道引用后的模块哪些被用了哪些没被用，从而可以忽略未被使用的。
   在2之前可以使用插件`webpack-deep-scope-analysis-plugin`
   详见 [https://segmentfault.com/n/1330000021783419#articleHeader20](https://segmentfault.com/n/1330000021783419#articleHeader20)
3. Babel不会造成webpack的Tree-shaking失效
   https://www.bilibili.com/video/BV1oy4y1p7CC/?vd_source=7124316d1092457c652c2689962a24c1

# 参考

- [1] [Reduce JavaScript Payloads with Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking)
- [2] [webpack 如何通过作用域分析消除无用代码](https://zhuanlan.zhihu.com/p/43844419)

