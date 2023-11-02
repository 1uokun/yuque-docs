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

# Tree Shaking

`Tree Shaking`是一个术语，通常用于描述移除JavaScript上下文中的未引用代码(`dead-code`)。
它依赖于ES Module语法`import`和`export`的静态结构特性，由`rollup`普及起来的。

webpack在**压缩阶段**借助`UglifyJS`移除dead-code的。

## usedExports 标记死代码

**收集无用代码并标记，压缩工具借助该标记进行清除。**
`usedExports`依赖于[terser](https://github.com/terser/terser)（webpack5内置插件`terser-webpack-plugin`）去检测语句中的**“副作用”**。

```javascript
module.exports = {
  mode: "development",
  devtool: 'cheap-module-source-map',  // 想看到标记的无用代码，必须设值
  optimization: {
    usedExports: true,
    minimize: false, // 不压缩
  },
};
```

打包结果，无用代码会被标记`unused harmony export has`🚩，但是仍然会被保留。
后续通过压缩代码才能真正将无用代码删除。

```javascript
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./es_module.js":
/*!**********************!*\
  !*** ./es_module.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   get: () => (/* binding */ get)
/* harmony export */ });
/* unused harmony export has */ ⬅️⬅️⬅️
// es_module get
const get = function () {
    console.log('get');
};

// es_module has
const has = function () {
    console.log('has');
};
  
  
/***/ })
```



## sideEffects 标记不要删

> “副作用”的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个export或多个export。
>
> 例如`polyfill`，它影响全局作用域但不提供export。
> 例如全局`css`，只要是被import的都会被检测。

```json
{
  "name": "package.json文件",
  "sideEffects": false
}
```

如果所有代码都不包含副作用，我们就可以在`package.json`中设置属性`sideEffects: false`。
但是对于存在副作用的也会被删除，所以我们需要告知webpack不要删除：

```javascript
// package.json
{
  "name": "package.json文件",
  "sideEffects": ["./src/polyfill-file.js", "./theme.css"]
}

// 也可以配置在webpack.config.js的module.rules中
{
  module: {
    // ...
    rules:[
      // ...
      {
        sideEffects: ["*.css"]
      }
    ]  
  }
}
```



## `__PURE__` 标记可以删

terser很难评估函数是否有副作用，比如包内存在`iife`、`闭包`或者export出的值是通过执行了某个函数而获得的(HOC)。
如下代码，即使不引用Button，但是`withAppProvider`也会自动执行，webpack不得不保留它。

只要在函数前标记`/*#__PURE__*/`即可表示不被引用的话就是死代码，会被压缩工具清除。

```javascript
const Button$1 = withAppProvider()(Button)
const Button$1 = /*#__PURE__*/withAppProvider()(Button) ⬅️⬅️⬅️

export {
	Button$1,
  Input,
  ...
}
```



## 其他 / 原理

1. **引入支持Tree Shaking的Package**
  使用**`lodash-es`**替代**`lodash`**

1. **`import *`**依然有效
`import * as _ from "lodash-es";`

2. **`JSON TreeShaking`** json未用的字段也依然有效
`import obj from "./main.json";`

4. **webpack 4之前只支持ES模块的使用，不支持CommonJS、只分析浅层模块导出和引入关系**

5. **webpack 5增加了引入模块代码时的CommonJS风格的静态分析功能**
   即`const get = require('./es_module').get` ，引入时可以用cjs风格，
   但对应包的导出依然必须是es module风格

6. **新版的Babel-loader不会造成webpack的Tree-shaking失效，**

   [因为新版的不会将es转换成cjs了](https://www.bilibili.com/video/BV1oy4y1p7CC/?vd_source=7124316d1092457c652c2689962a24c1)

   ```javascript
   presets:[
     ["@babel/preset-env", { modules: "commonjs" }] // ⚠️如果主动改为cjs的话才会导致不生效
   ]
   ```

7. **`cherry-picking`（像采摘樱桃一样摘只要的那部分）**

   业务代码已经成型，没法大动全改为esm，或者包是cjs的，可以借助babel等工具修改引入方式

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

8. **原理：[《webpack如何通过作用域分析消除无用代码》](https://www.diverse.space/2018/05/better-tree-shaking-with-scope-analysis/)**
   相关插件：`webpack-deep-scope-analysis-plugin`

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
