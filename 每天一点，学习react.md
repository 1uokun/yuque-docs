# React理念
> React是用JavaScript构建**快速响应**的大型Web应用程序的首选方式。
参考：[https://react.iamkasong.com/preparation/idea.html](https://react.iamkasong.com/preparation/idea.html)


关键是实现`快速响应`。那么制约`快速响应`的因素是什么呢？

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

1. CPU的瓶颈
2. IO的瓶颈
## CPU的瓶颈
> 将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为“`时间切片`”（time slice）

浏览器的`GUI渲染线程`和`JS线程`是互斥的，所以**JS脚本执行**和**浏览器布局、绘制**不能同时执行。
当JS执行时间过长，超出了16.6ms，这次刷新就没有时间执行样式布局和样式绘制。

浏览器**每一帧（16.6ms）**时间内，需要完成如下工作：
`**JS脚本执行（5ms） --> 样式布局 --> 样式绘制**`

在React中给JS脚本执行预留的初始时间是5ms。
```javascript
// 通过使用ReactDOM.unstable_createRoot开启Concurrent Mode 
// ReactDOM.render(<App/>, rootEl); 
ReactDOM.unstable_createRoot(rootEl).render(<App/>);
```
```javascript
// 同步更新
this.setState({})

// 异步更新
import { unstable_scheduleCallback } from "scheduler";

unstable_scheduleCallback(()=>{
  this.setState({})
})
```
## IO的瓶颈
`网络延迟`是前端开发者无法解决的。如何在`网络延迟`客观存在的情况下，减少用户对`网络延迟`的感知？

例子：ios的路由跳转
【Siri与搜索】页面需要等待请求数据后再显示界面，如果使用`loading`效果，及时请求时间很短，`loading`效果一闪而过用户也是有感知的。
而苹果的做法就是在点击【Siri与搜索】时就开始请求数据，**如果时间过长再显示loading效果，如果时间较短则先在当前页面停留一小段时间再跳转**。

为此，React实现了Suspense功能及配套hook —— useDeferredValue
```javascript
import { Suspense, useDeferredValue } from 'react'

```

# React和Vue区别

1. Vue更新是数据**原子级别**，React是**组件级别**
2. Vue对需要追踪的状态，使用`getter`和`setter`进行细粒度数据代理，一旦数据流乱了，很难从中拦截渲染
3. React则只关心setState，更加粗粒度但是更好控制

# JSX

- **什么是JSX？**

    - `JSX`全称应该翻译为`JavaScript`的`XML`
    - 仅仅是`React.createElement(component, props, ...children)`函数的`语法糖`
    - babel loader已内置支持.jsx文件
   

- **为什么使用JSX？**

    - React认为渲染逻辑本质上与其他UI逻辑内在耦合
    - 比如，在UI中需要绑定处理事件、在某些时刻状态发生变化时需要通知到UI、以及需要在UI中展示准备好的数据
    - 将JSX和UI放在一起会在视觉上有辅助作用
> 如果你不使用**JavaScript**打包工具而是直接通过**<script />**标签加载**React**的话，
> 则必须将**React**挂在到**全局变量**中。

 

- **布尔类型、Null以及Undefined将会忽略**
`false`,`null`,`undefined`和`true`是合法的子元素。
但它们并不会被渲染。
```jsx
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```


- **数字0不会被忽略**
```jsx
const arr = [];

arr.length && <div>123</div> // 0
```

# state

- **踩坑：关于state变量定义**
如果是引用类型，提前定义变量不会被创建一个新的引用；
如果是基本类型，建议使用`this.state.xx`来取值
```jsx
// bool: false
const { bool } = this.state;

this.setState({ bool: true }, () => {
  console.log(bool); // false(因为此时的bool是一个全新的变量)
  console.log(this.state.bool); // true
})
```
# Props
## props的只读性

- **纯函数**
组件无论是使用**函数声明**还是通过**class声明**，**都决不能修改自身的props**。
所以，所有React组件都必须像纯函数一样保护它们的props不被修改

## Render Props

- **术语“render props”**
是指一种在React组件之间使用一个**值为函数**的prop共享代码的简单技术
**例如**：React Router  
```jsx
    <Router>
      <Route path="/home" render={()=> <Home />} />
      <Route path="/login" component={Login} />
    </Router>
```

-  **render prop是一个用于告知组件需要渲染什么内容的函数prop**  
```jsx
    <Mouse render={mouse => (
       <Component {...this.props}  mouse={mouse} />
    )} />
```

-  `**this.props.children()**`**无法传入props的解决方案:**
参考`react-motion` 或者参考antd-rn`<Picker>`组件,
使用`React.cloneElement`添加额外参数  
```jsx
    <Motion>
       {value => <Component value={value} />}
    </Motion>
```
```jsx
{ 
  children && typeof children !== "string" &&
  React.isValidElement(children) &&
  React.cloneElement(children,props:{
      extra:... //extra props
  })
}
```

-  React Hook为其添加生命周期
使用React.Component的HOC包裹pure function 

# 生命周期

-  挂载
“mount” 
-  卸载
“unmount”，从DOM中被移除 

这些生命周期被移除：

- `componentWillMoount`
- `componentWillRecieveProps`
- `componentWillUpdate`
做出此决定的原因有两个：

1. 这三种方法经常被错误地使用，并且有更好的选择
2. 当在React中实现**异步渲染**时，滥用它们将是有问题的，错误处理的中断行为可能导致内存泄漏
新的**不安全**版本将是：

- `**UNSAFE_componentWillMount**`
生命周期执行顺序： `willMount` -> `render` -> `didMount` -> `willUnmount`

**只有在didMount调用之后React才会保证稍后调用willUnmount，
**所以在willMount中操作** 任何副作用或订阅 **都会造成** 内存溢出（此时在willUnmount执行取消订阅的行为则无法被执行）

**
- `**UNSAFE_componentWillReceiveProps**`
在`willReceivePorps`中调用父组件改变`state`的函数时会进入死循环

- `**UNSAFE_componentWillUpdate**`
当发生重新渲染时，生命周期执行顺序 `willUpdate` -> `render` -> `didUpdate`

如果在render（渲染、计算、再更新DOM元素）时发生阻塞，willUpdate和didUpdate会存在一定时间差；
willUpdate内不可以有和render相关的数据的操作，比如当前视图/滚动条位置等

**🚩React将引入一些新的生命周期：**

- `**static getDerivedStateFromProps(props, state)**`
`getDerivedStateFromProps`将处理 `willReceiveProps` 和 `didUpdate` 所做的事情；
每次re-render**之前**都会执行（setState或者forceUpdate）
它应返回一个对象来更新state，如果返回null则不更新任何内容 
   - 替代willReceiveProps的缺点是不能访问this
   - 你可能不需要derived state(useDerivedState)模式（让组件在props变化时更新state）
   - 这使得组件容易混淆，详见【完全受控组件】和【完全不受控组件】

- `**getSnapshotBeforeUpdate(prevProps, prevState)**`
`getSnapshotBeforeUpdate`将处理 `willUpdate` 和 `didUpdate` 所做的事情；
因为render只经过了更新DOM这一操作

- `**componentDidCatch(error, errorInfo)**`**打印错误信息**
会在“提交”阶段被调用，可以执行其他操作

- `**static getDerviedStateFromError(error)**`**处理错误边界
Error Boundaries：部分UI的JavaScript错误不应该导致整个应用崩溃
返回最新state（直接修改state），渲染备用IU**
渲染阶段调用，不可以执行其他操作

# React版本升级历程
## React 15早期优化
### 架构
React15架构可以分为两层：

- Reconciler（协调器）—— 负责找出变化的组建
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

缺点：
Reconciler到Renderer整个过程是同步的。由于递归执行，所以更新一旦开始中途就无法中断。
**当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿**。
```jsx
this.setState({
  count: this.state.count + 1
})

  <li>{1 * this.state.count}</li>
    <li>{2 * this.state.count}</li>
      <li>{3 * this.state.count}</li>

```
递归执行顺序：

1. Reconciler发现1需要变为2，通知Renderer
2. Renderer更新DOM，1变为2
3. Reconciler发现2需要变为4，通知Renderer
4. Renderer更新DOM，2变为4
5. Reconciler发现3需要变为6，通知Renderer
6. Renderer更新DOM，3变为6

一旦上面某一步骤被中断，后续就不再执行。比如第2步中断了，页面显示的就是`2 2 3`而不是`2 4 6`（更新不完全！）

> 优化主要侧重于JS层面


-  **virtual dom的 create/diff**
[https://github.com/Matt-Esch/virtual-dom](https://github.com/Matt-Esch/virtual-dom) 
   - `virtual-dom/h` json 2 dom tree，第3个参数为可变值
   - `virtual-dom/diff` var patches = diff(tree, newTree)
   - `virtual-dom/patch` 派送更新事件 patch(rootNode, patches)
   - `virtual-dom/create-element` rootNode = createElement(tree)
-  **减少组件的复杂度（Stateless）**
无状态组件、哑组件、纯函数 
-  **减少向下diff的规模（SCU shouldComponentUpdate）**
PureComponent 
-  **减少diff的成本（immutable.js）**
弥补JavaScript**没有不可变数据结构**的问题，
深copy的性能优化库，原理是牺牲空间换时间 

## React 16优化
### 架构
React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务先进入Reconciler
- Reconciler（协调器）—— 负责找出变化的组建
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上


### Scheduler调度器
相较于React15，新增了`**Scheduler**`（调度器）（独立于React的库），以浏览器是否有剩余时间作为任务中断的标准。
部分浏览器可以用`requestIdleCallback`,当浏览器有剩余时间时通知我们。但是由于以下因素

- 浏览器兼容性
- 触发频率不稳定。比如浏览器切换tab，之前tab注册的`requestIdleCallback`触发的频率会变得很低

所以React自行实现了polyfill。

除了在空闲时触发回调的功能外，Scheduler还提供了多种调度优先级任务设置。
```javascript
import { unstable_scheduleCallback } from "scheduler"
```

### Reconciler协调器 render阶段
从15的递归改为可以中断的循环过程（Fiber架构）
```javascript
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```
Reconciler与Renderer不再是交替工作，而是在虚拟DOM中以标记的形式存在。
当所有组件都完成Reconciler，才会统一交给Renderer。
```javascript
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

### Renderer渲染器 commit阶段
由于之前的 Scheduler -> Reconciler 都是在内存中执行，所以即使被中断

- 有其他更高优先级任务需要先更新
- 当前帧没有剩余时间

也不会更新页面上的DOM
![image.png](https://cdn.nlark.com/yuque/0/2023/png/674941/1685604822128-10be8dd6-f00f-4c9c-bd3c-82f926539ec0.png#averageHue=%23f7f7f7&clientId=u79aef8a1-19f4-4&from=paste&height=303&id=ufbcb1ab0&originHeight=986&originWidth=2290&originalType=binary&ratio=1&rotation=0&showTitle=false&size=282786&status=done&style=none&taskId=ud3f6cde1-fd5d-4d37-9e96-1bba908d5a6&title=&width=704)

### Fiber心智模型
`**心智模型**`：在现有业务代码已存在的情况下如何**实现异步可中断**

- 如果使用`async/await`会存在传染性，即之前的同步函数代码也要被迫改成async函数；
- 如果使用`Generator`，可以中断但是之前的计算需要重新计算，
如果使用`全局变量`保存之前执行的`中间状态`，又会引入新的复杂度
- 代数效应：能够将副作用从函数逻辑中分离，使函数关注点保持纯粹

在React15及以前，Reconciler采用递归的方式创建虚拟DOM，递归过程不可中断。
基于上述心智模型不如直接在React16中讲这种架构重构成`**Fiber树 + 循环Reconciler**`

1. **Fiber树相对于之前的虚拟DOM树结构上从**`**树**`**改造成了**`**链表**`**，有了上下关系，这使得可以循环遍历Fiber节点；**
2. **作为静态的数据结构，每个Fiber节点对应一个React element**
3. **作为动态的工作但愿，每个Fiber节点保存了本次更新中改组件改变的状态、要执行的工作（删除/插入/更新）**
```javascript
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```


**双缓存Fiber树**
`canvas`绘制动画，每一帧绘制前都会调用`ctx.clearRect`清除上一帧的画面，然后完全重新绘制当前帧；
如果画面计算量较大，导致清除上一帧到绘制下一阵画面之间有较长间隙，就会出现白屏。
为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，省去了两帧替换间的计算时间，就不会出现白屏再到画面出现的闪烁情况。

这种在内存中构建并直接替换的技术叫做双缓存。

> 将优化升级到浏览器渲染机制层面，在patch上取得了突破

-  **浏览器渲染机制**
浏览器是单线程的（Q:为什么是单线程的？A:想象一下，如果有两个线程，一个线程要对这节点进行移除，
一个要对它进行样式操作。线程是并发的，无法决定顺序，这样的页面是不可控的。换单线程则简单可控） 
-  **EventLoop**
在单线程中，视图渲染与资源加载、事件回调是如何调度的呢，就是依托EventLoop
浏览器的EventLoop有一个要点，如果一下子分配它许多任务，它的处理速度就下降。
如果把相同的任务放在一起，它就速度上去了（这是浏览器的底层优化JIT（just-in-time即时编译）优化）
总结为：任务分炼、时间分片（利用浏览器自带的`requestIdleCallback`）、异步渲染、节点合并 
-  **Filber调度算法**`virtual-dom/patch`
分两个阶段：第一个阶段创建DOM，执行willXXX轻量hook，并且标记它的各种可能任务（sadeEffect）
第二个阶段才执行它们。这时它会**优先**进行DOM插入或移动操作，**然后**是属性样式操作，didXXX重型hook，ref
同步模式：其中**先操作DOM，再设置属性**就是一个非常大的优化。
异步模式：时间分片。EventLoop在繁忙状态下会让页面卡顿低效，于是使用`requestIdleCallback`时间调度器自动分配。 


## React 16之前的痛点以及优化
**痛点**

- **组件不能返回数组**，常见的场合是`UL`元素下只能使用`LI`
- **弹窗问题**，之前使用`unstable_renderSubtreeIntoContainer`
- **异常处理**，`React DevTool`
- **HOC流行带来两个问题**：`ref`和`context`的向下传递
- **组件的性能优化**全靠`shouldCompoentnUpdate`SCU

**解决进度**

- 16.0
- **组件返回任意数组类型**：`React.Children.toArray()`
- **弹窗问题**：推出`ReactDOM.createPortal()`
- **异常处理**：推出`componentDidCatch`划分出错误组件与边界组件，**每个边界组件能修复下方组件错误一次**
再次出错，转交更上层的边界组件来处理，解决异常处理问题。
- 16.2
- 推出`Fragment`组件
- 16.3
- **HOC流行带来两个问题**：推出`createRef`与`forwardRef`解决Ref在HOC中的传递问题
推出new Context API解决HOC的context传递问题（[主要是SCU作祟](https://www.jianshu.com/p/e53a37ddc365)）

## React 17
可能是React15到16的不兼容变更太多，开发者们升级相当痛苦，所以很长一段时间React开发者都没有再发布新版本，而是在 v16 上集成各种新能力，16.3/16.8/16.12 几乎每隔几个版本就有一颗赛艇的新特性出现。

在长达2年半的 v16 版本后，React团队发布了 v17，**同时宣布这一版本的定位是一版技术改造的过渡版本**，主要目标是降低后续版本的升级成本。
在 v17 之前，不同版本的 React 无法混用，很重要的一个原因是之前版本中事件委托是挂在document上的，
v17 开始，事件委托挂载到了渲染 React 树的根 DOM 容器中，这使多 React 版本并存成为了可能。（意味着React 17+可混用，老页面维持 v17，新页面使用v18 v19 等）
![image.png](https://cdn.nlark.com/yuque/0/2021/png/674941/1639560993281-ca70439c-2d2c-4a06-b806-72b937a82711.png#averageHue=%23cfebf5&clientId=u52f8c7e2-4b59-4&from=paste&height=325&id=u5420b983&originHeight=650&originWidth=840&originalType=binary&ratio=1&rotation=0&showTitle=false&size=255409&status=done&style=none&taskId=ue69197a6-423c-46e2-8924-ec1dbcedc59&title=&width=420)

- 引入新概念：**fiber树
在React17中将虚拟DOM树改称为fiber树**
- 合成事件优化-更改挂载的根节点
- 移除事件池


## React 18（TODO）
> 参考：[React18 有哪些变化？-Alibaba F2E](https://mp.weixin.qq.com/s/tv_saHFtuxafzDJh25u3lg)

- React合并更新规则 点击事件会自动batching， 异步回调的不会 -- **自动Batching**



# 事件处理

React元素的事件处理和DOM元素的很相似，但是有一点语法上的不同：

-  React事件的命名采用小驼峰式(camelCase)，为不是纯小写。 
-  使用JSX语法时你需要传入一个函数作为事件处理函数，而不是一个字符串 
-  不能通过返回`false`的方式阻止默认行为。
你必须显式的使用`preventDefault`。
例如阻止链接默认打开一个新页面，  
```jsx
 // HTML
 <a href="#" onclick="console.log('The link was clicked'); return false;">
   Click me
 </a>
 
 // React
 function ActionLink(){
   function handleClick(e){
     e.preventDefault();
     console.log('The link was clicked')
   }
 }
```

# 事件代理（事件委托）

> React事件机制流程： `DOM` -> `ReactEventListener` -> `ReactEventEmitter` -> `EventPluginHub` -> `application`[【参考】](https://leo123.pub/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20react%20%E4%BA%8B%E4%BB%B6%E4%BB%A3%E7%90%86)


- `**ReactEventListener**`**只负责一件事情——封装原生浏览器事件**
DOM将浏览器的原生事件传递给ReactEventListener
- `**ReactEventEmitter**`**负责封装好的事件attach到顶层的event listener**
顶层（top level）事件类型定义在`EventConstants`模块中，
到此为止是React主线程完成的，其余的具体事件处理由plugins负责
- `**EventPluginHub**`**是事件的处理中心**
它负责接收添加好top level event listener的事件，询问各个plugin是否需要该事件，
将每个事件annotate到dispatches，然后dispatch事件。

**react的事件代理机制，它并不是把事件函数直接绑定到真实的节点上，**
**而是把所有事件绑定到结构的最外层，使用一个统一的事件监听器。**

这个事件监听器维持了一个映射来保存组件内部的事件监听与处理函数

当组件挂载或卸载时，在这个统一的事件监听器上进行删除和插入一些对象；
当事件发生的时候，首先被监听器拦截，然后在映射表中找到真正的处理函数并调用，

这样简化了事件处理和回收机制，效率上有很大的提升，也节省了内存，抹平了浏览器差异

# 合成事件（v16 -> v17）

## 由合成事件引发的"bug"(v16)

```jsx
  class extends React.Component {
    componentDidMount(){
      document.addEventListener("click",this.handleDocumentClick)
    }
    
    handleDocumentClick=()=>{
      console.log(1) //即使被阻止“冒泡”了，这里依然会被执行
    }
    
    handleButtonClick=(e)=>{
      e.nativEvent.stopPropagation();
      console.log(2)
    }
    
    render(){
      return (
        <Button title="click" onClick={this.handleButtonClick}/>
      )
    }
  }
```

上面的`e.preventDefault()`的`e`是一个**合成事件**。

1. React根据W3C规范来**自行实现**了一套事件捕获到事件冒泡的逻辑，抹平了各个浏览器之前的兼容性问题
2. 使用**对象池**来管理合成事件对象的创建和销毁，可以减少垃圾回收次数，防止内存抖动(对事件的定制化需求)
3. 事件只在`document`上绑定，并且**每种事件只绑定一次**，减少内存开销

使用React时，一般不需要使用`addEventListener`为以创建的DOM元素添加监听器。
事实上，只需要在该元素初始渲染的时候添加监听器即可。

> Q: 如何解决上述“bug”


1.  从`document.addEventListener`改成`window.addEventListener`。
冒泡顺序：document > window。阻止的是document 
2.  从`e.stopPropagation()`改成`e.stopImplementPagatoion()`
把当前事件执行后序全部阻止掉 
3.  React17修复了这个bug，
因为不再绑定到`document`上了，而是绑定到`render`函数的节点上（详见事件代理（事件委托）） 

## 合成事件优势

> Q: 为什么要自行模拟事件，而不用原生的事件来进行绑定操作呢？
A: 合成事件可以做到批量更新。
Q: 原生事件如何也做到批量更新呢？
A: 通过`batchUpdate`函数手动声明运行上下文


```jsx
    this.button.current.addEventListener(
      "click",
      this.handleClick,
      false
    );
    
    handleClick=()=>{
      this.setState((preState) => ({ count: preState.count + 1 }));
      this.setState((preState) => ({ count: preState.count + 1 }));
    }
    
<button ref="btn1"/> // 这个点击会render2次
<button onClick={this.handleClick} /> //这个点击只会render1次
```

```jsx
  import ReactDOM from "React-dom";
  
  handleNativeClickButton = () => {
    ReactDOM.unstable_batchedUpdates(() => {
      this.setState((preState) => ({ count: preState.count + 1 }));
      this.setState((preState) => ({ count: preState.count + 1 }));
    });
  };
  
  // 不想修改原代码，可以用`concurrent mode`(不推荐，未来的方案)
  import ReactDOM from "React-dom";

  const root = ReactDOM.unstable_createRoot(document.getElementById("root"));
  root.render(<App />);
```

**React17新概念：fiber树**

在React17中将虚拟DOM树改称为`fiber树`

**事件冒泡的过程**

```bash
 DOM树    fiber树

 html    FiberRootNode
  |         |
 body    rootFiber
  |         |
 div      App fiber
  |         |
  p       div fiber
            |
           p fiber
```

**合成事件在React17中的实现**

1. 在`document`绑定`event handler`,通过事件委托的方式监听事件
2. 当事件触发后，通过`e.target`获取触发事件的`DOM`，找到`DOM`对应的`fiber`
3. 从`**该fiber**`向`**根fiber**`遍历，收集遍历过程中所有绑定了`**该类型事件的fiber**`的`event handler`，保存在数组`paths`中
4. 遍历paths，依次调用event handler，模拟`捕获流程`
5. 遍历path.reverse(),依次调用event handler,模拟`冒泡流程`

**组件对应DOM响应点击事件**

向组件传递`onClick props`时，组件本身并不会绑定对应的`handler`，组件销毁后也不会有`click handler`的解绑操作
该DOM对应的fiber上的`onClick`回调在`dispatchEvent`方法中的`collectPaths`中被收集，并在`tiggerEventFlow`中被调用

## SyntheticEvent

`SyntheticEvent`（Synthetic 合成）实例将被传递给你的事件处理函数，
**它是浏览器的原生事件的跨浏览器包装器**。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，
包括`stopPropagation()`和`preventDefault()`。

如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用`nativeEvent`属性来获取即可。
每个`SyntheticEvent`对象都包含以下属性：

```java
    boolean bubbles
    boolean cancelable
    DOMEventTarget currentTarget
    boolean defaultPrevented
    number eventPhase // 表示事件流正被处理到来哪个阶段
    boolean isTrusted // 表示事件由浏览器（例如用户点击）发起的，还是由脚本（使用事件创建方法，例如Event.initEvent）发出的
    DOMEvent nativeEvent
    void preventDefault()
    boolean isDefaultPrevented()
    void stopPropagation()
    boolean isPropagationStopped()
    void persist() // 事件池中允许用户代码保留对事件的引用
    DOMEventTarget target
    number timeStamp
    string type
```

> ⚠️注意：
截止v0.14，当事件处理函数返回`false`时，不再阻止事件冒泡。你可以选择使用`e.stopPropagation()`或者`e.preventDefault()`代替
在React17中，
>  
> 1. `onScroll`事件不再冒泡，以防止出现常见的混淆；
> 2. `onFocus`和`onBlur`事件底层切换为原生的`focusin`和`focusout`
> 3. 捕获事件（例如`onClickCapture`）现在使用的是实际浏览器中的捕获监听器
> 
 


## 事件池(v16)

`SyntheticEvent`是合并而来。这意味着`SyntheticEvent`对象可能会被重用，而且在事件回调函数被调用后，
所有的属性都会无效。**出于性能考虑，你不能通过异步访问事件**

> 使用`事件池`来管理合成事件对象的创建和销毁，可以减少垃圾回收次数，防止内存抖动。
**在React17中移除了**`**event pooling**`


```javascript
  function onClick(event) {
    console.log(event); // => nullified object.
    console.log(event.type); // => "click"
    const eventType = event.type;
    
    setTimeout(function(){
      console.log(event.type); // => null
      console.log(eventType); // => "click"
    });
    
    // 不起作用，this.state.clickEvent 的值将会只包含null
    this.setState({clickEvent: event});
    
    // 你仍然可以导出事件属性
    this.setState({eventType: event.type});
  }
```

> ⚠️注意：
如果你想异步访问事件属性，你需在事件上调用`event.persist()`，
此方法会池中移除合成事件，允许用户代码保留对事件的引用。


**SyntheticEvent重用的其他方案**
> 参考：[https://medium.com/trabe/react-syntheticevent-reuse-889cd52981b6](https://medium.com/trabe/react-syntheticevent-reuse-889cd52981b6)


缓存所需的属性

```jsx
   constructor(props){
     super(props);
     this.debounceChange=debounce(this.onChange,400);
   }

   onChange=(e)=>{
        console.log(e?.target?.value)
    };

    render(){
        return (
            <Fragment>
                <input type="text" onChange={this.onChange}/>

                {/** doest work and need to add `event.persist()` **/}
                <input type="text" onChange={this.debounceChange}/>

                {/** 缓存所需的属性 **/}
                <input type="text" onChange={({target:{ value }})=>this.debounceChange({target:{ value }})}/>
            </Fragment>
        )
    }
```

## 支持的事件

React通过将事件normalize以让他们在不同浏览器中拥有一致的属性。

目前默认支持 **冒泡阶段被触发**的事件，如果需要注册捕获阶段的事件处理函数，则命名规则为
事件名加`Capture`，例如处理捕获阶段的点击事件请使用`onClickCapture`，`onClick`是冒泡阶段被触发的事件

# key（TODO）

Q：key在diff中的作用

> 在渲染列表节点中，**通过key可以在后续diff时移动节点，而不是更新节点**,尽可能地复用之前的DOM节点。
在数据变化时强制更新组件，避免原地复用元素节点带来的副作用。


> 使用key并不一定能带来性能上的提升，而是为了避免原地复用元素节点带来的影响


首先，diff算法中的handlers处理方式有

- `remove`
- `replace`
- `update`
- `insert`

所以有无key时对节点的处理是不同的

| `[1,2,3]` | 无key | 有key |
| --- | --- | --- |
| `[2,1,3]` | 1 update 2, 2 update 1，更新了两个节点 | 1 replace 2，2 replace 1,更新了两个节点 |
| `[1,3]` | 2 update 3 , remove 3,更新了一个节点，删除了一个节点 | remove 2，只删除了一个节点 |
| `[1, 4, 2, 3]` | 2 update 4, 3 update 2, insert 3 | insert 4 |


基于key可以增加一种`MOVE`的处理方式

- `move`
`[1,2,3] to [2,1,3]`只需要一个操作 1 move 2

key帮助React识别哪些元素改变了，比如被添加或删除。
因此你应当给数组中的每一个元素赋予一个确定的标识。

-  [**深度解析使用索引作为key的负面影响**](https://jsbin.com/wohima/edit?js,output)
**通常使用数据中的id来作为元素的key**
如果列表项目的顺序可能会变化，我们不建议使用索引来用作key值 
   - 例如：
删除或增加到指定位置，其他组件不变
**key为索引时或者不设置时，当新增或删除时，索引会变或所在位置变来，所以所有组件全都会刷新**
**并且特别像input内有临时值不会“移动”**
-  [**深入解析为什么key是必须的**](https://zh-hans.reactjs.org/docs/reconciliation.html#recursing-on-children) 
   - 如果使用索引index来作为key时，修改顺序会使得diff很慢
   - 插入和删除操作将会重建整个列表，而非插入和删除某一个
-  **key会传递信息给React，但不会传递给你的组件** 
-  **key值发生改变时，React会创建一个新的组件实例而不是更新当前组件** 
-  key应该是**唯一的**，**稳定的**和**可重现的** 
-  **唯一**：
元素的key在**同级元素**中应该是唯一的，（在全局中不必唯一），以便组件在更新期间保持其身份。
非唯一key可能会导致子代重复/或被忽略 
-  **稳定**：
不能用索引之类的值作为key 
-  **可重现**：
不能用`Math.random`、`new Date()`之类的值作为key 
