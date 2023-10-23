# externals
[https://webpack.docschina.org/configuration/externals/](https://webpack.docschina.org/configuration/externals/)
> 防止将某些 import 的包(package)打包到 bundle 中，
> 而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

例如：从CDN引入jQuery，而不是把它打包：
```jsx
// HTML
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
/>

// webpack.config.js
module.exports = {
  // ...
  externals: {
    jquery: 'jQuery'
  }
}
```
# dependencies

- `**dependencies**`
- A包 
```
 {
  "name":"react-native-aaa",
  "dependencies": {
    "aaa": "2.x",
  }
 }
```

- 我的package.json 
```
 {
  "dependencies": {
    "react-native-aaa": "latest",
    "aaa": "1.x" //或者3.x
  }
 }
```

- **结果：** 
```
 ｜--- aaa@1.x|或者3.x
 ｜--- react-native-aaa@latest
   ｜--- aaa@2.x
```

一切以用户自己的`package.json`优先

-  `**devDependencies**` 
   - “dependencies”:生产环境依赖包
   - “devDependencies”:仅本地开发和测试依赖包
```
 {
   "dependencies": {
     "my-dep": "^1.0.0",
     "another-dep": "~2.2.0"
   },
   "devDependencies" : {
     "my-test-framework": "^3.1.0".
     "another-dev-dep": "1.0.0 - 1.2.0"
   }
 }
```

-  `**peerDependencies**`
针对`dependencies`可能会出现以下问题：
1.依赖相同的包导致重复加载(这是主要的，特别是在RN里的viewmanager会重复注册导致报错)
2.在npm1和2的版本中，peerDependencies是会被自动安装的，但是在3的版本中只会有警告  
```
 {
   "name": "react-native-aaa",
   "peerDependencies": {
     "aaa": "2.x"
   }
 }
```

## **yarn与npm的hoist逻辑**

> `hoist`：版本不冲突的包会被尽可能地移到上层


-  **less-loader**
在peerDependencies中依赖了less[@3.x ](/3.x )   
```
{
  name:"less-loader",
  "peerDependencies":{
    "less":"3.x"
  }
}
```

-  **self-webpack-config**
我们自己去搞了一个npm包,需要依赖了`less-loader`，由于`leass-loader`内部的peerDependencies有`less`，
我们有2种方式来让node下载 
   1. **由peerDependencies自带的提示警告安装（这种提示会增加使用成本）** 
```
{
  name:"self-webpack-config",
  "dependencies":{
    "less-loader":"latest"
  }
}
```

   2. **在dependencies中主动替用户去显式安装**`**less@3.x**` 
```diff
{
  name:"self-webpack-config",
  "dependencies":{
    "less-loader":"latest",
+    "less":"3.x" //显式安装
  }     
}
```

-  **package.json**用户端
因为用户用你的`self-webpack-config`不知道依赖了`less-loader`，
由于其他业务需要安装`less`，版本还比较低  
```
{
  "dependcies":{
    "self-webpack-config":"latest",
    "less":"2.x" //但是没想到用户也安装了less，版本还比较低
  }
}
```

-  **node-modules**
结果导致`less-loader`内引用的是`less@2.x` 而不是self-webpack-config里的`less@3.x`  
```
｜--- less@2.x    //用户自己安装的less@2.x
｜--- less-loader //self-webpack-config里的显式包less-loader会被提上来(正常)
｜--- self-webpack-config
   ｜--- less@3.x  //由于less与用户自己安装的冲突，所以被放在这里
```

-  **🚩如何解决？** 
   1. **如果是你在开发npm包**

回到self-webpack-config，不要去“帮用户”安装peer依赖，而是在自己的package.json中加上相同的peerDependencies,
利用terminal弹警告请最终用户来满足这些依赖
`{ name:"self-webpack-config", "dependencies":{ "less-loader":"latest" }, "peerDependencies":{ "less":"3.x.x" } }`2.**如果你用别人的包碰到这种问题**安装最新版本的npm 7.x / yarn[@latest ](/latest )

> 结论：
**如果是你在开发npm包**，不要去“帮用户”安装peer依赖，而是在自己的package.json中加上相同的peerDependencies,
**如果你用别人的包碰到这种问题** ,请安装最新版本的npm 7.x / yarn[@latest ](/latest ) 


## semver 语义化版本 
semver，Semantic Versioning 语义化版本的缩写，文档可见 [https://semver.org/(opens new window)](https://semver.org/)，它由 [`major`, `minor`, `patch`] 三部分组成，其中

- `major`: 当你发了一个含有 Breaking Change 的 API
- `minor`: 当你新增了一个向后兼容的功能时
- `patch`: 当你修复了一个向后兼容的 Bug 时
| 代码状态 | 阶段 | 实例版本 |
| --- | --- | --- |
| 初版Release | 新产品请从1开始 | `1.0.0` |
| 向后兼容的**错误修复** | 补丁发布 | `1.0.1` |
| 向后兼容的**新功能** | 轻微释放 | `1.1.0` |
| 更改会**破坏**向后兼容性 | 主要发行 | `2.0.0` |


## version

```json
  {
    "dependencies": {
      "chai": "~version",
      "chai": "^version",
      "chai": "<version"
    }
  }
```

-  `～version`**大约等效于版本**
将在**不增加次要版本**的情况下将更新所有将来的修补程序版本。例如：`**~1.2.3**`将使用从`1.2.3`到`<1.3.0`的发行版本 
-  `^version`**与版本兼容**
更新到**所有**将来的次要/补丁版本，而无需增加主要版本。例如:`**^2.3.4**`将使用从`2.3.4`到`<3.0.0`的发行版 
-  `<version`**小于当前版本** 

> 举个例子：假如你有一个包3个版本`0.0.1`,`0.0.2`和`0.0.3`。`0.0.1`有一个bug,因此需要至少`0.0.2`版本。
如果您编写`0.0.x`将得到`0.0.3`，但是如果有一个包必须需要`0.0.2`
如果您编写`<0.0.2`将得到`0.0.1`不会冲突但不是我们想要的
所以`~0.0.2`可以帮助到我们


# webpack.config.js

## Alias
别名，将引入的包自动更名
## Entry

一个**入口点**表示 module webpack应该从哪个点开始,
进入入口起点后，webpack将弄清楚有哪些modules和libraries的入口起点（直接和间接）依赖的。

默认值是`./src/index.js`，也可以通过webpack configuration中
配置entey属性：

**webpack.config.js**

```javascript
 module.exports = {
   entry: './path/to/my/entry/file.js'
 }
```

## Output

**Output**属性告诉webpack定义生成的_bundles_文件的名称是什么，

默认名称是`./dist/main.js`以及默认将其他所有生成的文件
放在`./dist`文件夹内，也可以自定义：

**webpack.config.js**

```javascript
 const path = require('path');
 
 module.exports = {
   entry: '...',
   output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'my-first-weback.bundle.js'
   }
 }
```

## Loaders

Webpack本身只能理解JavaScript和JSON文件。
**Loaders**允许webpack去处理其他类型的文件并将它们转换为有效模块

> **注意**⚠️：_loader_能够_import_导入任何类型的模块（例如`.css`文件）


比如：

1. `css-loader`帮助webpack将所有的css文件打包生成一个**字符串**，
2. `style-loader`将`css-loader`生成的字符串放入index.html文件的<style>标签中
3. `vue-loader`加载和编译Vue组件
4. react通过`@babel`来实现webpack支持JSX语法
```javascript
{
 "presets": ["react", "stage-0"],
}

// package.json
{
  "babel-preset-react": "6.x.x",
  "@babel/preset-react": "7.x.x",
  
  "babel-preset-stage-0": "x"
}
```


**loaders**有2个属性

1. `test`：用于标识出应该被对应的loader进行转换的某个或某些文件
2. `use`：表示进行转换时，应该使用哪个loader

**webpack.config.js**

```javascript
 module.exports = {
   module:{
     rules: [
       { test: /\.txt$/, use: 'raw-loader' }
     ]
   }
 }
```

## Plugins

loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括
**打包优化**，**资源管理**，**注入环境变量**。

> 插件接口(plugin interface) 功能极其强大，可以用来处理各种各样的任务。


想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。

**webpack.config.js**

```javascript
  const HtmlWebpackPlugin = require('html-webpack-plugin'); // install via npm
  const webpack = require('webpack'); // 用于访问内置插件

  module.exports = {
    plugins: [
      new HtmlWebpackPlugin({template: './src/index.html'}),
      new HtmlWebpackPlugin({template: './src/other.html'}),
    ]
  }
```

## loader和plugin的区别

> loader,它是一个转换器，将A文件进行**编译**成B文件。比如`.less`转换为`.css`
>  
> plugin，它是一个扩展器，它丰富了webpack本身，针对的是**loader**结束后，webpack打包的整个过程，
它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务


#### loader案例

- 写一个为await自动加上catch的loader[[🔗](https://juejin.cn/post/6905619006238621703)] loader是一个纯函数。babel处理js的三个过程：**解析（parse）**、**转换（transform）**、**生成（generator）** 
```
const res = await ajax({...})

// 如果ajax返回reject，那么会直接报错并不继续向下执行
// 所以需要给await加上catch执行报错，此时res值为undefined
const res = await ajax({...}).catch(err=>{/* ...do you want todo */})
console.log(res) // undefined
```

   - `@babel/parse`:解析js代码生成ast
   - `babel-traverse`:遍历ast
   - `babel-types`:判断一个节点的类型
   - `@babel/template`:将代码段转为ast节点
   - `@babel/core`:代码生成，将ast转为js

#### plugin案例

- webpack通过ESModule作用域分析消除无用代码（tree-shaking）[[🔗](https://diverse.space/2018/05/better-tree-shaking-with-scope-analysis)] 
```
import {isNumber, isString} from "lodash-es"

isNumber(1)
// isString没有被使用，按理是不应该被打包进的
```

   - **不要给变量重新赋值** 
```
import { isNull } from 'lodash-es'

var fun = 1;

//这个动作其实就是在额外执行了
fun = function scope(...args){
  return isNull(...args)
}

export {func}


// 当你import func时，不管你使不使用，isNull都被打包进去了
```

   - **纯函数调用**
添加`/*#__PURE__*/`表明是纯函数（拥有独立的域）
   - **必须使用ESModule**

## Mode

```
  module.exports = {
    mode: 'production(默认值) | development | none'
  }
```

## devServer 开发服务器
package.json需要安装`webpack-dev-server`依赖包（虽然可以全局安装和运行，但还是建议本地安装），
提供实时重新加载的开发服务器。
```javascript
devServer: {
  host: '0.0.0.0',
    port: 8000,
    devMiddleware: { // webpack-dev-middleware
    publicPath: '/'
  },
  compress: true, // 代码压缩
    hot: true, 			// HMR
    open: true, 		// 启动时自动打开浏览器并载入host:port

    historyApiFallback: { // 浏览器返回上一页时使spa保持同h5 history api一致，
    index: 'index.html' // 设置false会导致返回上一页404
  }, 

  headers: { 			// 为所有相应添加headers
    'Access-Control-Allow-Origin': '*',
      },
  proxy: {				// http-proxy-middleware 服务器代理
    '/japi': 'http://localhost:3000'
  },
  onBeforeSetupMiddleware: ({ app }) => { // 执行其他中间件前执行，常用于配置mock
    if (process.env.MOCK) {apiMocker(app, root('mock/filesIndex.js'));               }
  },
}
```
## optimization 优化bundle代码
## 
## 
## 浏览器兼容性

webpack支持所有符合`ES5标准`的浏览器（不支持IE8及以下版本）。
webpack的`import()`和`require.ensure()`需要`Promise()`。
如果你想要支持旧版本浏览器，在使用这些表达式之前，还需要**提前加载polyfill**。

**entry.js**

```
import 'es6-promise'
import 'isomorphic-fetch'
```
# 
# 热更新

> `Hot Module Replacement`，简称`HMR`，无需完全刷新整个页面的同时，更新模块。


刷新我们一般分为两种：

-  一种是页面刷新`windown.localtion.reload()`，不保留页面状态，简单粗暴 
-  另一种是基于WDS(Webpack-dev-server)的模块热替换，只需要局部刷新页面上发生变化的模块，同时可以保留当前的页面状态 

HRM作为一个Webpack内置的功能，可以通过`HotModuleReplacementPlugin`或`--hot`开启。

项目启动后，进行构建打包，控制台会输出构建过程，我们可以观察到生成了一个Hash值

- a1b2c3d4

然后我们每次修改代码保存后，控制台都会出现Compiling...字样，触发新的编译中...

- 新的Hash值: e1f2g3h4
- 新的json文件：ee1fas2.hot-update.json
- 新的js文件：index.ee1fas2.hot-update.js

每一次热更新，浏览器中的Source都会多一个`hash.hot-update.js`
例如vue-cli的目录结构：

```
top
└── 127.0.0.1
    ├── js
    │   ├── app.js
    │   └── chunk-vendors.js
    │
    └── index.html
    │
    └── hashxxx.hot-update.js //每一次热更新都会生成一个这样的文件
```

## 优化

#### 命令行分析

随着项目的界面越来越多，webpack的热更新越来越慢，有时会达到5,7s之久

Q：如果分析热更新慢的原因？
A：首先在package中的启动命令加上

```
--progress --watch --colors --profile
```

- --progress 构建进度
- --watch实时检测
- --profile 编译过程中的步骤消耗时间

#### 热更新指定模块

每人负责的都是一部分模块或者组件，所以热更新可以只编译自己当前需要的页面，而没必要把所有的页面全部编译。

#### vue-cli现有脚手架

1.  动态路由使用require方式代替import方式 
2.  规划多页面
react使用`npm run eject`暴露配置文件（一旦暴露就不可还回原来的结构）
[vue.config.js](https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE)
vue `[@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app)`[文档](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app) 

# babel.config.js
## Plugins

将import动作 别名

- babel-plugin-import
- babel-plugin-module-import
# babel工具篇

#### webpack/Babel的关系
> [https://juejin.cn/post/6844904098303574023](https://juejin.cn/post/6844904098303574023)

1. `Babel`是**编译工具**，把高版本语法编译成低版本语法，或者讲文件按照自定义规则转换成js语法
2. `webpack`是**打包工具**，定义入口文件将所有模块引入整理后通过`loader`和`plugin`处理后打包输出
3. `webpack`通过`babel-loader`使用`Babel`

```javascript
module.exports = {
  // ...
  module: {
    rules:[
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
}
```


# vue.config.js

#### - transpileDependencies

Type: `Array<string | RegExp>`
Default: `[]`
默认情况下`babel-loader`会忽略所有`node_modules`中的文件。
如何你想通过Babel显示转译一个依赖，可以在这个选项中列出来。
**注意**⚠️：必须和 `'@vue/cli-plugin-babel/preset'`一起使用：

```
 // [babel.config.js](http://npm.taobao.org/package/@vue/cli-plugin-babel)
 module.exports = {
   presets: [
     '@vue/cli-plugin-babel/preset'
   ]
 }
```

#### - productionSourceMap

Type: `boolean`
Default: `true`
如果你不需要生产环境的source map，可以将其设置为`false`以加速生产环境的构建。

# @babel/plugin-transform-runtime

对`@babel/preset-env`的插件扩展功能

转换器的另一个目的是为您的代码创建一个沙盒环境。
如果直接`import core-js`或者`import @babel/polyfill`的内置插件会全局污染`Promise`，`Set`和`Map`等命名
如果您的代码是要发布供他人使用的库，请不要使用`@babel/polyfill`
而使用`@babel/plugin-transform-runtime`，转换器会将这些内置别名，利用`core-js`

要使用`@babel/plugin-transform-runtime`时，必须安装`@babel/runtime`作为编译后的基础依赖

- 编译前 
```javascript
class Foo {
 method() {}
}
```

- 编译后
`require("@babel/runtime/*")` 
```javascript
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Foo = /*#__PURE__*/function () {
  function Foo() {
    (0, _classCallCheck2["default"])(this, Foo);
  }

  (0, _createClass2["default"])(Foo, [{
    key: "method",
    value: function method() {}
  }]);
  return Foo;
}();
```

## Babel polyfill知多少

> [https://zhuanlan.zhihu.com/p/29058936](https://zhuanlan.zhihu.com/p/29058936)


- `babel-polyfill`

```javascript
 // entry.js
 import "babel-polyfill"
```

```
1. 需要在业务代码中手动引入（最好放在vendor里）
   会以**全局变量污染**的方式polyfill**内建类**（如Map、Set、Promise等）
   同时也会通过修改Array、String、Object等**原型**的方法（如Array.rpototype.includes()）
   以及内建类的静态方法（如Array.from()等）
   
2. babel-polyfill适合于开发独立的业务应用
   即使全局污染、prototype被修改也不会受太大的影响
   **babel-polyfill不适合开发第三方类库**
```

- `@babel/plugin-transform-runtime`

```javascript
 //.babelrc
       
 {
   "presets": [...],
   "plugins": ["@babel/plugin-transform-runtime"]
 }
```

1. 需要在`.babelrc`或`*.config.js`Babel编译选项中
将该插件添加到`plugins`中，插件只会polyfill你用到的类或方法。
由于采用了沙盒（Sandbox）机制，它不会污染全局变量，同时也不会去修改内建类的原型，
带来的坏处是它不会polyfill原型上的扩展（例如Array.prototype.includes()不会被polyfill，
Array.from()静态方法（类方法）则会被polyfill）
2. **插件的方式适合于开发第三方类库，**
**不适合开发需要大量使用Array等原型链扩展方法的应用。**

#### 使用

#### 通过CLI

```bash
$ babel --plugin @babel/plugin-transform-runtime entry.js
```

#### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["@babel/plugin-transform-runtime"]
})
```

#### options

```
plugins:[
 [
  "@babel/plugin-transform-runtime",
  {
    "corejs": false | 2 | 3 | { version:2 | 3, proposals: boolean }
  }
 ]
]
```

#### corejs
| **corejs options** | **description** | **npm install CLI** |
| --- | --- | --- |
| `false` | 默认 | `npm install --save @babel/runtime` |
| `2` | 支持全局变量（例如`Promise`
）和静态属性（例如`Array.from`
） | `npm install --save @babel/runtime-corejs2` |
| `3` | 还增加支持实例属性（例如`[].includes`
） | `npm install --save @babe;/runtime-corejs3` |


#### helpers

`boolean`，默认为`true`
切换Babel helpers(`classCallCheck`，`extends`)替换为`moduleName`调用

#### regenerator

`boolean`，默认为`true`
是否将`generator functions`转换为不污染全局范围的`regenerator runtime`

#### useESModules

`boolean` 默认为`false`

为true时，将不会使用`@babel/plugin-transform-modules-commonjs`
即不保留`commonjs`语义

- `false` 
```
exports.__esModule = true;
export.default = function(){}
```

- `true` 
```
export default function(){}
```

#### absoluteRuntime

`boolean`或`string`，默认为`false`

引用module是相对引用还是绝对引用

- `false` 
```
require("@babel/runtime")
```

- `true` 
```
require("../../node_module/@babel/runtime")
```

#### polyfill和runtime差别

> [https://zhuanlan.zhihu.com/p/58624930](https://zhuanlan.zhihu.com/p/58624930)


1. `Babel`只是转换`syntax`层语法，所以需要`@babel/polyfill`来处理API兼容，
2. 又因为`polyfill`体积太大，所以需要通过`preset`的`useBuiltIns:usage`(现已强制为usage)来实现按需加载，
3. 再接着为了满足npm组建开发的需要出现了`@babel/runtime`来做隔离

```
// .babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": true,
                "useBuiltIns": "usage",
                "targets":{
                    "browsers":["> 1%", "last 2 versions", "not ie <= 8"]
                }
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 2 // 仅支持全局变量（例如`Promise`）和类的静态属性（例如`Array.from()`）
              }
        ]
    ],
}

npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime // 总是在一起安装
npm install --save @babel/runtime-corejs2 --save  // 官方文档 说这个可以不加，我试了不加，没起作用
```

# 兼容ES5踩坑记录

#### - babe-cli 和 @babel/cli

一个是7.0版本之前，一个是7.0版本之后
不能同时使用，只能选择其中一个
包括`babel-core`&`@babel/core`

#### babel-loader

- `手动额外loder指定module`

```javascript
 module:{
   rules: [
     {
        test: /\.js$/,
        exclude:function(modulePath) {
          return /node_modules/.test(modulePath) &&
            !/node_modules\/指定module名/.test(modulePath);
        },
        use: {
          loader: 'babel-loader'
        }
     }
   ]
 }
```

- 如果没有其他`.babelrc`或者`*.config.js`仍然需要`options`时，

## es6 转 es5

```
$ npm install @babel/plugin-transform-runtime -D
```

```
// .babelrc 
// @babel >= 7.0
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

## async/await & yeild function

只有先`regenerator`之后再去`@babel/preset-env`

```
$ npm install regenerator -D

$ regenerator --include-runtime ./entry.mjs > entry.mjs
```

# Tree-shaking

> Tree Shaking是一个通常用于描述移除JavaScript上下文中的未引用代码（dead-code）行为的术语。
它依赖与ES2015中的import和export语句，用来检测代码模块是否被
**导出**、**导入**、**且被JavaScript文件使用**


Tree Shaking的概念早在1990年代就已经被提出。
但当真正作用到JavaSCript中，是在ES6模块规范被提出之后，
因为只有模块是通过`static`方式引用时，Tree Shaking才会起作用（静态分析法）（提外话：动态数据流分析法）

在ES6模块规范之前，使用`require()`语法的CommonJS规范，这些模块都是`dynamic`动态加载的
这意味着我们可以根据代码中的条件导入新模块。

```
var dynamicModule;
if(true){
  dynamicModule = require("./foo")
}else {
  dynamicModule = require("./bar")
}
```

CommonJS模块的这种`dynamic`性质意味着无法应用`Tree-Shaking`，
**因为在实际运行代码之前无法确定需要哪些模块**

在ES6中，引入了模块的新语法，这是`static`的，使用`import`语法，我们不再能够动态导入模块

```
//语法错误
if(true){
  import foo from "./foo"
}else {
  import bar from "./bar"
}
```

## Webpack Tree-shaking深度优化

> 作用域分析：分析代码里面变量所属的作用域以及他们之间的引用关系，
有了这些信息，就可以推导出**导出变量**和**导入变量**之间的引用关系


使用**作用域分析**优化多层级的tree-shaking
webpack可以通过`entry`和`module`之间的调用得知对于一个`module`来说，哪些变量是会被使用到的`Input{Used:{scope1}}`

对于ES6模块来说，会有**_default export_**和**_named export_**的区别

```
export default all
```

**_default export_**在概念上仅仅把一个名字叫default的export出来。
像上述把一切东西都塞到default里面是一个错误的选择

另一方面，tree-shaking本身还需要注意许多事项：

- **使用ES6 Module**
不仅是项目本身，引入的库最好也是es版本，比如lodash-es代替lodash。
另外注意TypeScript和Babel的配置是否会把代码编译成非es module版本
- **对纯函数调用使用PURE注释**
由于无法判断副作用，所以对于导出的函数调用最好使用`/*__PURE__*/`注释，
不过一般来说有相关的babel插件自动添加

# uglify

JS的代码压缩原理

1. 将code转换成AST
2. 将AST进行优化，生成一个更小的AST
3. 将新生成的AST再转化成code

分号转逗号的规则

1. **表达式语句**分号会被转换为都好
2. **声明语句**分号不会被转换

# 三方库
## cross-env
自定义设置（环境）变量，在`webpack server`之前使用
例如： `cross-env CUSTOM_ENV=development webpack server --config webpack.dev.js`
在`webpack.dev.js`中读取 `process.env.CUSTOM_ENV`
