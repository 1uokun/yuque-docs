# webpack和gulp区别

gulp、Grunt、RequireJS、Browserify等
或简单合并执行多种构建任务；
或聚焦于模块化方案的兼容处理；
或仅仅实现JavaScript层面的工程化（合并、压缩、混淆）能力。
缺乏一个能兼容所有不同类型文件的消息互通。

而Webpack则忽略具体资源类型之间的差异，将所有代码/非代码文件**统一看作Module**——
**模块对象**，以相同的加载、解析、依赖管理、优化、合并流程实现打包，
并借助**Loader、Plugin两种开放接口将资源差异处理逻辑转交由社区实现**，实现**统一资源构建模型**。

优点：

- 所有资源都是Module，所以可以用同一套代码实现诸多特性，包括：
  代码压缩、Host Module Replacement、缓存等；
- 打包时，资源与资源之间非常容易实现信息互换，例如：
  可以轻易在HTML插入Base64格式的图片；
- 借助Loader，Webpack几乎可以用任意方式处理任意类型的资源，例如：
  用Less、Stylus、Sass等预编译CSS代码。

# 为什么要学Webpack

每次遇到需要解决眼下具体问题时，翻阅资料和debug会耗费大量时间；

沉下心研读源码，才能理解内里的乾坤，通过调整配置自定义Loader/Plugin能迅速解决问题；

这种能力持续沉淀，就能逐渐成为我和其他同事非常重要的竞争力。

# webpack.config.js 配置项

> [Configuration](https://webpack.js.org/configuration/)

🚩webpack首先需要根据输入配置（`entry`/`context`）找到项目入口文件；

之后根据按模块处理（`module`/`resolve`/`externals`等）所配置的规则逐一处理模块文件，
处理过程包括转译、依赖分析等；

模块处理完毕后，最后根据后处理相关配置项（`optimization`/`target`等）合并模块资源、
注入运行时以来、优化产物结构等。🚩

![webpack.config.js](./assets/webpack.config.js.png)

# CommonJS模块打包

> 代码参考：[https://github.com/shfshanyue/node-examples/tree/master/engineering/webpack](https://github.com/shfshanyue/node-examples/tree/master/engineering/webpack)

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

只要在函数前标记`/*#__PURE__*/`（也可以写成`/*@__PURE__*/`）即可表示不被引用的话就是死代码，会被压缩工具清除。

```javascript
function withAppProvider(){
  return function(){}
}

const Button$1 = withAppProvider()(Button)
const Button$1 = /*#__PURE__*/withAppProvider()(Button) ⬅️⬅️⬅️

export {
	Button$1,
  Input,
  ...
}
```



## uglify 代码压缩

JS的代码压缩原理

1. 将code转换成AST
2. 将AST进行优化，生成一个更小的AST
3. 将新生成的AST再转化成code

分号转逗号的规则

1. **表达式语句**分号会被转换为都好
2. **声明语句**分号不会被转换



## 原理：作用域分析

> 作用域分析：分析代码里面变量所属的作用域以及他们之间的引用关系，
> 有了这些信息，就可以推导出**导出变量**和**导入变量**之间的引用关系。
>
> 相关文章：**[《webpack如何通过作用域分析消除无用代码》](https://www.diverse.space/2018/05/better-tree-shaking-with-scope-analysis/)**
> 相关插件：`webpack-deep-scope-analysis-plugin`


使用**作用域分析**优化多层级的tree-shaking
webpack可以通过`entry`和`module`之间的调用得知对于一个`module`来说，哪些变量是会被使用到的`Input{Used:{scope1}}`



## 其他

1. **引入支持Tree Shaking的Package**
    使用**`lodash-es`**替代**`lodash`**

1. **`import *`**依然有效
`import * as _ from "lodash-es";`

3. **`export default all`是不明智的**
    对于ES6模块来说，会有**_default export_**和**_named export_**的区别。
    **_default export_**在概念上仅仅把一个名字叫default的export出来，
    像上述把一切东西都塞到default里面是一个错误的选择。

2. **`JSON TreeShaking`** json未用的字段也依然有效
`import obj from "./main.json";`

5. **webpack 4之前只支持ES模块的使用，不支持CommonJS、只分析浅层模块导出和引入关系**

6. **webpack 5增加了引入模块代码时的CommonJS风格的静态分析功能**
   即`const get = require('./es_module').get` ，引入时可以用cjs风格，
   但对应包的导出依然必须是es module风格

7. **新版的Babel-loader不会造成webpack的Tree-shaking失效，**

   [因为新版的不会将es转换成cjs了](https://www.bilibili.com/video/BV1oy4y1p7CC/?vd_source=7124316d1092457c652c2689962a24c1)

   ```javascript
   presets:[
     ["@babel/preset-env", { modules: "commonjs" }] // ⚠️如果主动改为cjs的话才会导致不生效
   ]
   ```

8. **`cherry-picking`（像采摘樱桃一样摘只要的那部分）**

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



# Module Federation 模块联邦

- 应用可按需导出，这些模块最终会被打包成模块包，类似npm模块；
- 应用可在运行时基于HTTP(S)协议动态加载其他应用暴露的模块，
  且用法与动态加载普通NPM模块`import()`一样简单；
- 与其他微前端方案不同，MF的应用之间关系平等，没有主应用/子应用之分，
  每个应用都能导出/导入任意模块；

## 远程（输出方）

`exposes`曝光指定模块文件

```javascript
const { ModuleFederationPlugin } = require("webpack").container;

plugin: {
  new ModuleFederationPlugin({
    name: "app1",		// 定义import一级模块名称
    fileName: "remoteEntry.js", // 生成打包文件的名称
    exposes: {
      "./utils": "./src/utils" // 定义二级模块名称
    }
  })
}
```

## 主机（引用方）

`remotes` + `await import()`加载http模块

```javascript
// webpack.config.js
plugin: {
  new ModuleFederationPlugin({
    remotes: {
      // key还可以再自定义一级模块名称
      app1: "app1@http://localhost:8081/dist/remoteEntry.js", // 生产模式改为cdn地址
    }
  })
}

// src/index.js
const { sayHello } = await import("app1/utils");
sayHello();
```

## 依赖共享（微前端架构）

`shared`依赖共享
两边都配置shared，就可以共享一个`vendors-node_modules_xxx.js`代码
前提是版本一致（可以通过`requiredVersion`设置区间版本，这样差小版本的话也可以共享）

```javascript
const deps = require("./package.json").dependencies;

// react微前端应用——路由模块联邦
new ModuleFederationPlugin({
  // 两边都要设置相同的shared
  shared: {
    react: {
      singleton: true, // 如果版本不满足就警告
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
```

微前端的难点：

1. 多应用通信
   可以借助发布订阅模式+单例store，比如rxjs
2. MF实现的微前端架构并未提供沙箱能力，
   比如js/css未隔离

# Plugin

# Loader

> https://webpack.docschina.org/loaders/

## 样式 style-loader

- `css-loader`让webpack识别`.css`文件
  改loader会将CSS等价翻译为形如`module.exports = "${css}"`的JavaScript代码，
  使得Webpack能够如同处理JS代码一样解析CSS内容与依赖资源

- `style-loader` runtime代码注入（**运行时使用js生成style代码**）🚩，根据`injectType`决定styles插入到DOM中的方式

  ```javascript
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"], // 根据loader倒叙执行顺序，style-loader在前
          // test: /\.less$/i,
          // use: ["style-loader", "css-loader", "less-loader"] // 有预处理器的写在最后
        },
      ],
    },
  };
  ```

  上述配置语义上相当于`style-loader(css-loader(.css))`链式调用，执行后样式代码：

  ```javascript
  // Part1: css-loader 处理结果，对标到原始 CSS 代码
  const __WEBPACK_DEFAULT_EXPORT__ = (
  "body {\n    background: yellow;\n    font-weight: bold;\n}"
  );
  // Part2: style-loader 处理结果，将 CSS 代码注入到 `style` 标签
  const injectStylesIntoStyleTag = require("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
  injectStylesIntoStyleTag(
   __WEBPACK_DEFAULT_EXPORT__
  )
  ```

  

- `mini-css-extract-plugin` 
  构建期间生成CSS文件，并借助html-webpack-plugin将文件通过`<link>`标签方式插入到页面中。
  优点：

  1. JS、CSS资源分离，实现<u>**并行加载**</u>，提高页面性能； 
  2. <u>**资源缓存粒度降低**</u>，变更CSS（或内容膨胀）不影响生成的JS打包产物

  缺点：

  1. 不支持热更新🚩
     建议`production`模式时才使用
     `development`模式时使用`style-loader`以支持热更新

  ```javascript
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            (process.env.NODE_ENV === 'development' ?
               'style-loader' : // 开发阶段使用style-loader，支持hmr
               MiniCssExtractPlugin.loader // ⚠️不要和style-loader同时使用
            ),
            "css-loader"
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new HtmlWebpackPlugin(), // 必须同时使用hwp才能将产物以 link 标签方式插入到html中
    ]
  };
  ```

## PostCSS

PostCss既不是后处理器也不是预处理器，不像Less/Sass/Stylus那样定义一套超集语言，
**而是与`@babel/core`类型，实现一套将CSS源码解析为AST结构，并开发API支持编写插件来进行分析和修改，**
丰富原生CSS、支持低版本编译、支持代码压缩等。

> 预处理器之于CSS，就像 TypeScript 与JavaScript的关系；
> 而 PostCSS 之于CSS，则更像 Babel 与JavaScript。

流行的PostCSS插件

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", 
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
               plugins: [
                 require("autoprefixer"), // 自动添加浏览器前缀
                 require("cssnano"), // 压缩css
                 
                 // 预设环境集合，包含了autoprefixer
                 require("postcss-preset-env")({ stage: 1 })
               ],
              },
            },
          }
        ],
      },
    ],
  }
};
```

- `postcss-import` 允许将CSS文件导入其他文件

  ```css
  @import './theme.css'
  ```

- `autoprefixer` 自动添加浏览器前缀
  通过package.json的browserslist配置定位需要兼容的浏览器

  ```css
  // 之前
  ::placeholder {}
  
  // 之后
  ::-moz-placeholder {
    
  }
  :-ms-input-placeholder {
    
  }
  ::placeholder {
    
  }
  
  ```

  

