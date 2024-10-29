## 代理加速

> 网络代理：https://www.jianshu.com/p/709c6853cc42
> npm换源：https://juejin.cn/post/7054747440032776199

```bash
# 淘宝镜像
npm config set registry https://registry.npmmirror.com
# 原始地址
npm config set registry https://www.npmjs.com/


# 设置代理
npm config set proxy=http://127.0.0.1:7890
#删除代理
npm config delete proxy
```



# 重命名npm包

```json
"dependencies": {
  "@ant-design/react-native": "npm:@react-sextant/react-native-test@5.2.4",
}
```



# 依赖管理

> 参考链接：[https://mp.weixin.qq.com/s/9JCs3rCmVuGT3FvKxXMJwg](https://mp.weixin.qq.com/s/9JCs3rCmVuGT3FvKxXMJwg)

- npm v2/v3
- yarn
- pnpm

## npm2
**npm2安装依赖步骤：**

1. 发布npm install命令
2. npm向registry查询模块压缩包的网址
3. 下载压缩包，存放在`~/.npm`目录
4. 将压缩包解压到当前项目的node_modules目录

npm2存在问题：

1. **嵌套地狱
**初期npm对依赖树不做任何去重合并，导致相同依赖重复安装
```javascript
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
└── C@1.0.0
    └── node_modules
        └── B@1.0.0
        └── D@1.0.0
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/674941/1683790279763-e2e3b369-e067-477b-8b30-e71e79ff192c.png#averageHue=%23f9f8f7&clientId=u856b947f-c016-4&from=paste&height=246&id=svSgM&originHeight=500&originWidth=1000&originalType=binary&ratio=1&rotation=0&showTitle=false&size=128545&status=done&style=none&taskId=u3445d378-2e3e-4420-b358-3b47f97de02&title=&width=491)
## npm3
**npm3安装依赖步骤：**

1. **检查配置：读取**`**npm config**`**和**`**.npmrc**`**配置**
比如配置镜像源`registry = 'https://bnpm.byted.org/'`

2. **确定依赖版本、构建依赖树**：检查`package-lock.json`
若存在，根据`lockfileVersion`字段值确定`~`、`>`、`^`前缀版本是否需要更新
若不存在，根据`packge.json`版本和当前`npm`版本重新安装node_modules和生成lock文件

3. **并行安装：**npm2还是按顺序逐个安装的

4. **检查缓存或下载**：根目录node_modules包中查看有没有缓存，没有就下载。
更新`package-lock.json`

npm3存在的问题：

1. **扁平化嵌套
**针对npm2的嵌套地狱，npm3将子依赖「提升」（`hoist`），
相同子依赖尽量合并平铺安装在依赖树上一层。
```javascript
node_modules
├── A@1.0.0
├── B@1.0.0
└── C@1.0.0
     └── node_modules
          └── B@2.0.0
```
```javascript
node_modules
├── A@1.0.0
│   └── node_modules
│       └── B@1.0.0
├── B@2.0.0
└── C@1.0.0
```

2. **hoist提升哪个包？扁平具体算法**
网上说的会根据package.json里面的顺序决定谁会被提出来，放在前面的包依赖内容会被先提出来
看源码后，npm会调用一个叫做`localeCompare`待验证❓的方法对依赖进行排序
**实际上就是字典序在前面的npm包的底层依赖会被优先提出来，**上面例子会先提升A包里的子依赖。
具体过程：借助“**最大子树优化**（Maximal Shrinkwrap）”算法，将依赖树优化为**最小化的子树**。
从而达到尽可能减少冗余和重复的模块安装、减小项目打包提及、提高根目录node_modules缓存命中率
****最大子树优化+localeCompare衍生算法题：**[https://juejin.cn/post/7083423385899761700](https://juejin.cn/post/7083423385899761700)

3. **幽灵依赖 （隐式依赖）**
不在package.json里显性依赖的子依赖包，但在项目代码中引用了这个包，也就是**非法访问。**
特别是在monorepo模式，eslint静态代码检测工作也做不了，目前只有靠编辑器自己实现（IDEA）

**解决幽灵依赖问题**，1.尽量不要引用package.json中没有显性声明的依赖
2. 使用幽灵依赖扫描工具 [https://www.npmjs.com/package/@sugarat/ghost](https://www.npmjs.com/package/@sugarat/ghost)

4. **依赖分身**`doppelganger`
一个包名只能提升1次，后面依赖相同包名相同版本，依然会重复安装。
看起来C和E都引用了B2，但不是同一个B2。如果B2 module存在一些副作用或缓存，可能会出错。
```javascript
node_modules
├── A@1.0.0
├── B@1.0.0
├── D@1.0.0
├── C@1.0.0
│    └── node_modules
│         └── B@2.0.0
└── E@1.0.0
      └── node_modules
           └── B@2.0.0
```
## npm5、npm7
npm跳过了v4/v6版本，直接从npm v2 -> v3 -> v5 -> v7;

**npm5**对于npm3做了哪些优化：

1. 本地node_modules缓存目录结构完全扁平化
npm3的还是嵌套目录结构（同项目）
不过npmv5在package-lock.json文件里，依赖关系树仍然保留

2. **支持了package.json的scripts脚本命令**

**npm7**对于npm5做了哪些优化：

1. **自动安装**`**peerDependencies**`**这就对npm包的peer依赖版本需要重新重视起来(对版本尽可能广泛，而不是某一特定版本)，否则自动安装某些包会和项目中存在版本冲突导致整个安装进程停止

具体案例：[https://github.com/ant-design/ant-design-mobile-rn/issues/1284#issuecomment-1434030736](https://github.com/ant-design/ant-design-mobile-rn/issues/1284#issuecomment-1434030736)
2. **引入**`**workspaces**`**概念**
首个官方支持Monorepo的版本

3. **引入“安装快照（install-time snapshot）”机制**优化安装速度，减少磁盘和网络的使用

## node与npm版本映射关系
| `**Nodejs**`**版本** | `**npm**`**版本** |
| --- | --- |
| 4.x | 2.x |
| 6.x | 3.x |
| 8.x | 5.x |
| 10.x | 6.x |
| 12.x | 6.x或7.x |
| 14.x | 6.x或7.x |
| 16.x | 7.x |
| 18.x | 9.x |

## package.json❓


`**peerDependencies**`
从npm v7开始默认安装`**peerDependencies**`内的包
如果同一包名指定的版本与当前本地package.json内的版本不同会报错。
解决：
1.重新制定版本，尽量宽松不要特定某一个（前提确实是支持多版本）
2.或者`**peerDependenciesMeta**`内允许标记为可选。
```diff
// package.json
{
  "dependencies":{
  	"react": "18.x.x",
    "react-yyy": "1.0.0"
  } 
}

// react-yyy@1.0.0
{
  "peerDependencies":{
-    "node": "16 || 17"
+		 "node": ">= 16"
  }
}

// 或者peerDependenciesMeta标记为可选
+ {
+		"peerDependenciesMeta":{
+ 		"node":{
+ 			"optionall": true
+ 		}
+  	}
+ }

```
当然也有好处，我们可以利用这一特性，强制使用者升级。比如曾经为react-native低版本做过一些三方包，在react-native新版本不适用了，也需要为新版本做新的适配。这时老的peer依赖可以帮助我们强制用户更新。

## package-lock.json❓
> 参考：[https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json)

我们知道npm中的package.json安装的包结构或者版本并不是一定一致的，
因为package.json写法是根据 **语义版本控制（**`semver`）[https://semver.org/](https://semver.org/)

**具体作用**：

- 描述依赖关系树的单一表示，这样可以**保证队友、部署和持续集成安装完全相同的依赖关系**
- 对node_modules快照作用，可以随意穿越之前的状态
- 提高依赖树差异的可读性
- 允许npm跳过扁平化嵌套和hoist重复解析过程
- 从npm v7开始还能减少对package.json文件的读取次数

`**version**`

- `5.0.3` 表示安装指定的`5.0.3`版本
- `～5.0.3` 表示安装`5.0.X`中最新的版本 （增加**修补版本**）
- `^5.0.3` 表示安装`5.X.X`中最新的版本 （增加**次要版本**）

`**lockfileVersion**`
**表示用的什么版本的npm进行安装包的。**
因为不同npm版本生成的lock文件格式不一样，比如npm v7做了较大的更新`**dependencies**`字段下的结构重构了，可能导致重新拉取包的结果不一致。
**高版本node兼容低版本node，但是低版本node不兼容高版本**，导致lockfileVersion高于当前node版本时将直接忽略lock文件重新拉取和生成。

| **npm版本** | **生成**`**lockfileVersion**` | 向后兼容 |
| --- | --- | --- |
| v5 、v6 | 1 | 
 |
| v7、v8 | 2 | {lockfileVersion:1}  |
| v9 | 3 | npm v7 |




## yarn
yarn安装依赖步骤:

1. **检查系统运行环境**，包括OS、CPU、engines等信息
2. **解析包**：
2.1. **收集首层依赖**：根据 `dependencies`、`devDxx`、`optionalDxx`形成首层依赖集合
之后对嵌套依赖逐级进行递归解析（将解析过和正在解析的包用一个`Set`数据结构存储，保重同一版本范围内的包不会被重复解析）
2.2. **首层依赖集合**：合并「`@`前缀的包名」包含npm的Organizations和`workspaces`的顶级packages列表
3. **获取包**：缓存 ?? `Registry`下载
4. **链接包**：解析`peerDependencies`信息，之后基于**扁平化原则**（不同于npm的hoist，使用频率较大的版本会安装到顶层目录，这个过程称为`dedupe`）
5. **构建包**：依赖包存在二进制文件进行构建。
这个过程会执行install相关钩子（package.json的`scripts`配置项），
包括`preinstall`、`install`、`postinstall`。

yarn对于npm的优势：

1. **并行安装 🚩**
npm按包顺序执行下载，即一个包安装完，才会安装下一个⚠️
而yarn通过并行操作下载安装（`npm3`之后也实现了并行安装）

## pnpm
`pnpm`代表performant（高性能的）`npm`。

pnpm的优势：

1. **link机制**
从npm和yarn的安装依赖步骤中可以看出，虽然有缓存但还是会复制一份到项目的node_modules文件夹。

而pnpm通过`hard link`（硬链接，源文件的副本）在全局store里存储项目node_modules文件的hard link硬链接，不同项目可以从全局store寻找到同一个依赖，大大节省了磁盘空间。

项目中 node_modules里则生成一份 `.pnpm` 里面存储`symbolic link`（软链接，快捷方式）
2. 最大优点是**节省磁盘空间，特别是多项目复用**
本地文件也不存在幽灵依赖、依赖分身
![image.png](https://cdn.nlark.com/yuque/0/2023/png/674941/1683864026431-c0de4575-8502-48c8-b9b0-aa38ea633923.png#averageHue=%2326292d&clientId=ud141085a-e520-4&from=paste&height=385&id=u70cb3908&originHeight=385&originWidth=317&originalType=binary&ratio=1&rotation=0&showTitle=false&size=36650&status=done&style=none&taskId=ud8e67553-24e9-448e-8440-8bf58c497b6&title=&width=317)

pnpm的不足之处：

1. 全局hardlink导致`postinstall`**修改依赖代码**，会生效到其他所有引用过它的项目导致出现不可控问题。
2. **软链接兼容性：**不支持软链接的环境就无法使用pnpm，比如Electron应用
3. 非扁平化破坏性的结构和必须使用自身锁文件`pnpm-lock.yaml`，给**迁移带来成本**

如何迁移：

1. 删除node_modules
2. 直接执行`pnpm i`
3. 执行 `pnpm dev`，看控制台报错哪个包缺失，再补给package.json（解决幽灵依赖）
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
> **如果是你在开发npm包**，不要去“帮用户”安装peer依赖，而是在自己的package.json中加上相同的peerDependencies,
> **如果你用别人的包碰到这种问题** ,请安装最新版本的npm 7.x / yarn[@latest ](/latest ) 


## semver 语义化版本 

semver，Semantic Versioning 语义化版本的缩写，文档可见 [https://semver.org/(opens new window)](https://semver.org/)，它由 [`major`, `minor`, `patch`] 三部分组成，其中

- `major`: 当你发了一个含有 Breaking Change 的 API
- `minor`: 当你新增了一个向后兼容的功能时
- `patch`: 当你修复了一个向后兼容的 Bug 时

| 代码状态                 | 阶段            | 实例版本 |
| ------------------------ | --------------- | -------- |
| 初版Release              | 新产品请从1开始 | `1.0.0`  |
| 向后兼容的**错误修复**   | 补丁发布        | `1.0.1`  |
| 向后兼容的**新功能**     | 轻微释放        | `1.1.0`  |
| 更改会**破坏**向后兼容性 | 主要发行        | `2.0.0`  |


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
> 如果您编写`0.0.x`将得到`0.0.3`，但是如果有一个包必须需要`0.0.2`
> 如果您编写`<0.0.2`将得到`0.0.1`不会冲突但不是我们想要的
> 所以`~0.0.2`可以帮助到我们


# 
