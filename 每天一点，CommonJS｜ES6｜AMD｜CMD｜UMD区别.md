> 参考文章： [https://juejin.im/post/5aaa37c8f265da23945f365c](https://juejin.im/post/5aaa37c8f265da23945f365c)
NodeJS官方文章：[https://nodejs.org/docs/latest/api/esm.html#esm_differences_between_es_modules_and_commonjs](https://nodejs.org/docs/latest/api/esm.html#esm_differences_between_es_modules_and_commonjs)
不过关注点在Node内如何使用ES6 Module,相比CommonJS有哪些没有哪些，换言之CommonJS被作为主角对比


# CommonJS

Node.js是commonJS规范的主要实践者

##### 特点

特点：1.有四个变量：`module`、`exports`、`require`、`global`。 2. 动态导入

##### 使用

输出用`module.exports = {}`
用`require`加载模块

输出

```javascript
// lib.js
module.exports = {
  add:function(){}
}

// 也可以
module.exports.add = function(){}
// 不推荐
exports.add2 = function(){}
```

引用

```javascript
// load lib
var lib = require('lib');
var add = lib.add;

// 也可以
var add2 = require('lib').add;

// 也可以 动态加载
var str = 'lib'
var add3 = require(`${str}`)
```

##### 优缺点

优点：用同步的方式加载模块。
在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。
缺点：但在浏览器端，限于网络原因，更合理的方案是使用**异步加载**。

## module.exports和exports区别

-  **exports.sth**  
```javascript
exports.a = "A"
//会被自动改写成
module.exports.a = "A"
//打印
Module {
  id: '.',
    exports: { a: 'A' }
 }
```

-  **module.exports = {}**
当`module.exports`整体被赋值时，`exports`将无效  
```javascript
module.exports = { a: 'A' }
exports.b = "B"

//打印
Module {
  id: '.',
    exports: { a: 'A' }
 }
```

## require加载原理

COmmonJS的一个模块，就是一个脚本文件。
`require`命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

```javascript
{
  id: '...',
    exports: { ... },
      loaded: true,
        ...
    }
```

`loaded`属性表示该模块的脚本是否执行完毕，`require`只有加载完成后才会继续下一步动作。
以后需要用到这个模块的时候，就会到`exports`属性上面取值。
**即使再次执行**`**require**`**命令，也不会再次执行该模块，而是到缓存中取值（全局系统下）。**

# ES6 Module

ES6在语言标准的层面上，实现来模块功能。

##### 特点

特点：有两个变量`export`和`import`

##### 使用

输出

```javascript
export function add(){}

export { add }; // 1
export defalut add; // 2
export {default as add} from '../../add'
export add; // error: 不可以直接导出变量，至少要加括号
```

引用

```javascript
import {add} from 'lib' // 对应1
import add from 'lib' // 对应2

// 也可以
import add,{add} from 'lib'

// 也可以重命名
// as 后面为自定义名称
import add, { add as sum } from 'lib'

// 引用所有
import * as lib from 'lib.js'

// 引用polyfill或shim，会执行这个module里面的代码
import "@babel/polyfill"

// 异步加载模块
import('./src/common/component').then()

// import动态路径
// 初始时会把src/common下的所有包都异步加载到chunk
// 所以尽量明确路径
import(`./src/common/${module}`)

// webpack特有的，功能同import()
require.ensure(path, callback)
```

##### 优缺点

ES6的模块不是对象，`import`命令会被JavaScript引擎静态分析，
优点：在编译时就引入模块代码，而不是在代码运行时加载

**缺点：所以无法实现条件加载。**
**🚩🚩🚩也正因为这个，使得静态分析成为可能。🚩🚩🚩**

# CommonJS和ES6 Module差异

##### CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用

- CommonJS模块输出的是值的拷贝，
也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
- ES6模块的运行机制与CommonJS不一样。
JS引擎对脚本静态分析的时候，遇到模块加载命令`import`，
就会生成一个只读引用。等到脚本真正被执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
ES6模块是动态引用，并且不会缓存值。被`import`的模块内部发生变化时，也会动态影响到引用者

##### CommonJS模块是运行时加载，ES6模块是编译时输出接口。

- 运行时加载：`module.exports`出的对象只有在脚本运行完才会生成。
- 编译时加载：ES6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段（在你敲代码的时就生成了，所以你ctrl就能定位到那里）

| **模块类型** | **关键字** | **使用：输出** | **使用：引用** | **差异点** |
| --- | --- | --- | --- | --- |
| **CommonJS** | module.exports、
require()、
global | exports.add = function(){};
module.exports = {
   add:function(){} 
} | var lib = require('lib');

var add = lib.add;

var add = require('lib').add | 1.运行时加载/**动态加载**，对模块是值的拷贝，同步加载模块。
2.对于服务器，本地文件加载速度非常快。
3.对于浏览器来说，则需要其他异步加载的模式。
4.require允许在任意位置调用 |
| **ES6 Module** | export、import | export { add }; 
export default add; | import add,{add} from 'lib' | 1.编译时加载/**静态加载**，对模式是对象引用，随时受原模块影响
2.import只能在文件顶部使用 |


##### 对差异点的补充

- **CommonJS**
对于require的模块的值可修改 
```javascript
// lib.js
var name = "Niko"
module.exports = {
   name: name
}

// 引用文件
require('lib.js').name = "Bellic"
var name2 = require('lib.js').name
console.log(name2); // Bellic
```

- **ES6 Module**
引入的模块的值**只读**，但模块内的方法可以修改 
```javascript
// lib.js
export var name = "Niko"
export function setName = function(newName){
  name = newName
}

// 引用文件
import { name, setName } from 'lib.js'
console.log(name); // Niko
setName("Bellic");
console.log(name); // Bellic

name = "Bellic";   // Error: "name" is read-only.
```

# ES6 Module循环依赖

- ES6不关心是否发生了“循环加载”（即支持循环依赖）
- 只是生成一个指向被加载模块的引用
- 需要开发者自己保证，真正取值的时候能够取到值。
```javascript
// A.js
import B from './B.js'

export default B;

// B.js
import A from './A.js'

console.log(A); // 是undefined 而不是一个函数
export function(){}
```

- **只要注意避免进入死循环调用**
```javascript
// A.js
import B from './B.js'
export function bar(){
  foo()
}

// B.js
import A from './A.js'
export function foo(){
  bar()
}
foo(); // RangeError: Maximum call stack size exceeded
```
# CommonJS循环依赖

- `require`是**同步动作**，会等待加载结果，一但加载完成
- 再次调用相同的`require`包就不会再次加载这个包，而是**取缓存**。
- **一旦出现某个模块被“循环加载”，则只输出已经执行的部分，还未执行的部分不会输出**

```javascript
// a.js
exports.done = false;
var b = require('./b.js'); //到这里执行完成后就不会继续向下执行了
console.log("a加载完成")


// b.js
exports.done = true;
var a = require('./a.js')
console.log("b加载完成")

// main.js
var a = require('./a.js')
var b = require('./b.js')

// 打印结果：b加载完成
```

# .js和.mjs区别

> 参考文章：[https://nodejs.org/docs/latest/api/esm.html](https://nodejs.org/docs/latest/api/esm.html)


- `.mjs`表示启用对ECMAScript模块的支持
- `.cjs`表示启用对CommonJS模块的支持
- `.mjs`和`.cjs`可以混用，只是加强了语义化
- `package.json`的`type`属性
不对文件后缀加以修饰但要表明对哪种模块支持时，
使用`type`进行描述： 
```json
// package.json
{
  "type": "module | commonjs | index.d.ts (typescript)"
}
```

# CommonJS导出代码兼容ES6 Module全导入代码

CommonJS风格的导出代码

```javascript
Object.defineProperty(exports, "_esModule", { value:true });

function Delay(){}

exports.Delay = Delay;
exports.default = Delay;

module.exports = Delay;
module.exports.Delay = module.exports["default"] = Delay;
```

ES6 Module风格的导入代码

```javascript
// 所有风格都能引入到Delay函数
import Delay,{Delay} from 'Delay.js'
import {default as Delay} from 'Delay.js'
```

# import按需引入(插件实现)

```bash
$ yarn add babel-plugin-component
```

```javascript
import { Toast } from 'antd-mobile'

// babel转换后
var _antdMobile = require('antd-mobile'); // 这样会把antd的所有组件都引入了
var Toast = _antdMobile.Toast;
```

基本原理：修改AST将上述代码输出为：

```javascript
import Toast from 'antd-mobile/lib/toast'
```

# import() 异步加载

- `**import()**`
`import()`返回了**Promise**
参考：[https://v8.dev/features/dynamic-import](https://v8.dev/features/dynamic-import)

```diff
-   import moduleA from "library"
    
    form.addEventListener("submit", e=>{
      e.preventDefault();
-     someFunction();
+     import("library.moduleA")
+       .then(module => module.default) // using the default export
+       .then(someFunction())
+       .catch(handleError());
    })
    
    const someFunction = () => {
      // uses moduleA
    }
```

- `**vue-plugin-load-script**`
动态引入`<script>`标签。利用了`scriptEl.addEventListener["error","abort","load"]`**资源加载错误**监听script是否加载成功 
```javascript
 let el = document.querySelector('script[src="]' + src + '"]'); //搜索指定src的script标签
 
 if(!el){
   el = document.createElement('script');
   el.type = 'text/javascript';
   el.async = true;
   el.src = src;
   
   document.head.appendChild(el); // 在head内添加
 }
 
 el.addEventListener('error', reject)
 el.addEventListener('abort', reject)
 el.addEventListener('load', resolve)
```

# CMD

CMD（Common Module Definition）是`SeaJS`在推广过程中对模块定义的规范化产出，强调在CMD规范中**一个文件就是一个模块**。

该规范解决了如何编写模块以便在**基于浏览器的环境**中_可互操作_(interoperable)的问题。

- **模块是单例的**
- **不应该在模块范围内引入新的自由变量**
- **执行必须是懒惰(lazy load / 异步)的**

```javascript
// Modal.js
define(function(require, exports, module){
  // 引入 
  var dialog = require('./dialog.js');
  
  // 输出
  exports.modal = function(){
  
  }
  // 兼容node
  module.exports = modal;
})

//main.js入口文件
seajs.use("../src/Modal.js") // 不用这行，上面的代码就不会被执行
```

除了解决命名冲突和依赖管理，使用Sea.js进行模块化开发还可以带来很多好处：

1. **模块的版本管理**
通过别名等配置，配合构建工具，可以比较轻松地实现模块的版本管理
2. **提高可维护性**
模块化可以让每个文件的职责单一，有利于代码的维护。
Sea.js还提供了`nocache`、`debug`等插件，拥有在线调试等功能
3. **前端性能优化**
Sea.js通过异步加载模块
4. **跨环境共享模块**
**CMD模块定义规范与Node.js的模块规范非常相近。**
**通过Sea.js的Node.js版本，可以很方便实现模块的跨服务器和浏览器共享。**

# AMD

AMD（Asynchronous Module Definition）是`RequireJS`在推广过程中对模块定义的规范化产出，强调RequireJS
在主文件里是将所有文件同时加载。

这种规范是异步的加载模块，先定义所有依赖，然后在加载完成后的回调函数中执行：

```javascript
require([module], callback)
```

- 案例

```javascript
require(['clock'], function(clock){
  clock.start()
})
```

# CMD和AMD区别

-  **定义**
**CMD**是SeaJS玉伯提出的，Common Module Definition
**AMD**是RequireJS提出的，Asnychronous Module Definition 
-  **代码风格**
**CMD**和**CommonJS**相通 
-  **加载时机**
**CMD**和**AMD**都是异步加载的 
-  **执行时机**
**CMD**推崇**就近依赖**，需要把模块变成为字符串解析一遍才知道依赖了哪些模块，
所以在浏览器端`require('sth')`时会出现假死（服务器端不会，因为都是本地文件，等待时间就是硬盘读取时间）
**AMD**推崇**依赖前置**，在主文件里就将所有文件同时加载好，只是暴露出一个模块的名称
要调用时，立即调用，然后在回调函数中执行 
-  **用户体验/性能**
**CMD**性能好，因为只有用户需要的时候才执行
**AMD**用户体验好，因为模块提前执行了 

# UMD

严格上说，UMD不能算是一种模块规范，因为它没有模块定义和调用
**这是AMD和CommonJS**（服务端模块化规范）的结合体，保证模块可以被amd和commonjs调用。
> 🚩我们打包一般只考虑 打包UMD还是打包ESM
