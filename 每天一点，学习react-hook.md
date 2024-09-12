# React Hook的体系设计之一 - 分层

- 第一层：**基础底层
-  **`useState` 是基于 `useReducer`的简化版
- `useMemo`和`useCallback`事实上可以基于`useRef`实现
- ⚠️如果在实际的应用开发中，单纯地在组件里组合使用内置的hook，无疑是一种不分层的粗暴使用形式
- 仅仅在表象上使用hook，而无法基于hook达到逻辑复用的目标。
- 第二层：**状态的分层设计
- **`useImmerState`使用`immer`更新状态
- `useImmerReducer`替代`useReducer`
- **状态与行为的封装
- **`useMethods`封装`useState/useCallback`避免“一个状态加一个系列行为”
- **数据结构的抽象
- **`useArray`
- **通用场景封装
- **`useVirtualList` @umijs/hooks

# 自定义Hook

关于自定义hook内部的`useEffect`执行经过：
当Component组件deps更新了，那么就会

1. 执行清理函数，输出“===卸载===”;
2. 然后应用新的副作用，输出"===挂载==="

自定义hook不能保证外部不必要的re-render的情况下，内部依赖的就是会重复经历生命周期；

```jsx
function useHook(deps){
  useEffect(()=>{
    console.log("===挂载===");
    return ()=>{
      console.log("===卸载===")
    }
  },[deps])
}
```

优化：

1. 使用空依赖数组

2. 使用useRef存储值

   ```jsx
   import React, { useEffect, useRef, useState } from 'react'
   
   function useCustomHook(count) {
     const countRef = useRef(count)
   
     useEffect(() => {
       countRef.current = count
     }, [count])
   
     useEffect(() => {
       // 这是副作用
       console.log('Effect is applied')
   
       // 返回清理函数
       return () => {
         console.log('Cleaning up')
         func(countRef.current)
       }
     }, []) // 空依赖数组
   
     return countRef.current
   }
   
   function func(count) {
     console.log('func is called with count:', count)
   }
   
   function MyComponent() {
     const [count, setCount] = useState(0)
   
     console.log('qwe')
     const a = useCustomHook(count)
     console.log('xzc', a)
   
     return (
       <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount(count + 1)}>Increment</button>
       </div>
     )
   }
   
   export default MyComponent
   ```

3. 条件执行副作用

   

   

# Hook规则

-  **ESlint插件**
`eslint-plugin-react-hooks` 
-  **只在最顶层使用HooK**
不要在循环、条件或嵌套函数中调用Hook ，因为hooks是通过数组实现的
比如使用setState时，有两个数组去存放state和setState方法，在函数组件重新渲染后，state重新设初始值是从数组中读取缓存值，所以不能改变hooks顺序，否则读取数组顺序会有误
-  **Hook调用顺序**
React依靠Hook声明的顺序调用，所以不要将Hook写在条件语句内  
```javascript
  const [name, setName] = useState("")
  
  // 如果name不为空，此Hook将被忽略，react执行下一句
  // 并报错：React检测到YourComponent调用的钩子的顺序发生了变化
  if(name !== ""){
    useEffect(()=>{ .. })
  }
  
  const [age, setAge] = useState(0)
  useEffect(()=>{ console.log(age) })
```

-  **只在React函数中调用Hook** 
- 在React的函数组件中调用Hook 
- 也可以在自定义Hook中**调用其他Hook** 
-  **关于第三个参数依赖数组**
数组内的变量存在**条件或**关系，即只要满足其中一个变量即可。
如果数组为空，即都不满足，则最多创建1次，执行2次  
```javascript
 useEffect(
   ()=>{
     ...
   },
   [🌟, 🌟]
 )
```

# useState

-  单一变量  
```javascript
 const [name, setName] = useState("")
```


- 多个变量  
```javascript
 const [person, setPerson] = useState({name:"", age:0})
```

- 🚩`**useState**`**不会自动合并更新对象** 
```diff
  person.name = "Niko"; // 直接修改state对象
-  setPerson(person); // 不会更新
+  setPerson({ ...person }) // 🚩会更新
```
      或者  
```javascript
  setPerson(prevState => {
    // 也可以使用Object.assign
    return {...prevState, ...updateValues}
  })
```

- **🚩注意对象mutable引用**

     ⚠️同props对象，不要直接对state的属性进行值的修改
```diff
const obj = {name:"Niko"};
const [state, setState] = React.useState(obj);

const handleName = function(){
-  state.name = "Bellic"; // 传入的obj的name值也会被修改
-  setState({...state})
+  setState({...state, name:"Bellic})
}
```

- **惰性初始state** 
之所以成为“惰性”，是因为这样的方式**只会执行一次**  
```javascript
 const [state, setState] = useState(()=>{
   const initialState = function(){...};
   return initialState
 })
```
      注意优化的点
```javascript
 //⚠️createRows() 每次渲染都会被调用
 const [rows, setRows] = useState(createRows(props, count));
 
 //✅ createRows() 只会被调用一次，对于createRows需要复杂计算的将得到优化
 const [rows, setRows] = useState(()=>{return createRows(props, count)});
```


- `**setState**`**什么时候是同步的？什么时候是异步的？
执行的方法是同步的，但是值的更新是会被合并（**`**batchingUpdate**`**）延迟执行的，所以看起来像异步的**
```javascript
 const [count, setCount] = useState(1);
 
 setCount(++count);
 setCount(++count); 
 console.log(count); // 还是1
 // 注意视图会更新到最新的3，但渲染层和数据层是分开的，数据层立刻获取时，值仍为1

 // 要想获取最新的值，需要用
 useEffect(()=>{
   console.log(count); // 3； 并且因为合并更新的缘故，只会打印一次
 }, [count])
```


- **🚩**`**setState**`**不依赖外部变量的写法** 
```diff
+    setCount(c => c + 1) //✅这里不依赖外部的`count`变量
-    setCount(count + 1)
```

# useEffect
## 模拟生命周期

- **componentWillReceive**，监听更新后的值
```javascript
useEffect(() => {
  console.log("data updated")
},[props.data])
```

- componentWillUpdate不支持⚠️

-  **componentDidUpdate**,即`useEffect(didUpdate)`
与`didMount`和`didUpdate`比较，使用`useEffect`调度的effect不会阻塞浏览器更新屏幕。
大多数情况下，effect不需要同步地执行。在个别情况下（如测量布局），有单独的`useLayoutEffect`  
```javascript
 useEffect(() => {
   document.title = `You clickedd ${count} thimes`
 })

 // 第一个参数也可以直接传函数的引用名
 function functionName(){
    ...
    return async function unmount(){} // 这里的函数无所谓
 }
 useEffect(functionName)
```

- **shouldComponentUpdate **使用`useMemo()`模拟实现
- **componentDidCatch** 使用`try...catch`模拟实现

## 第一个参数为纯函数

    ⚠️⚠️⚠️`**useEffect**`第一个参数必须是一个纯函数， `**useCallback**`同理
```javascript
useEffect(async ()=>{ ... }) //❌

const asyncFetch = async function(){...}
useEffect(asyncFetch)       // ❌
```

- **componentWillUnmount**，即清除effect  
```javascript
 useEffect(function(){
   function listen(){}
   
   //订阅
   Event.addListener(listen)
   
   //取消订阅
   return function(){
     Evemt.removeListener(listen)
   }
 })
```

- **componentDidMount** 
   1. 和`componentDidMount`、`componentDidUpdate`不同的是，在浏览器完成布局与绘制**之后**，传给`useEffect`的函数会延迟调用。
   2. 如果要在浏览器执行下一次绘制前，用户可见的DOM变更就必须同步执行时，可以使用`useLayoutEffect`
   3. 虽然`useEffect`会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。
   4. **React将在组件更新前刷新上一轮渲染的effect**



## 第二个参数不能变量提升

-  第二个参数不能为使用变量提升 - 特别是基础类型
```javascript

useEffect(()=>{
  if(visible){
    ...
  }
}, [ visible ]) 

const {visible: boolean} = props; // ❌ 必须在useEffect之前
```

- **effect**的条件执行
给`useEffect`传递第二个参数，它是effect所**依赖的值数组（deps）**。只有这些数据变化了才会执行.
_未来编译器会更加智能，届时**自动创建数组**将称为可能_ ❓ 
⚠️某些需求下是不需要创建依赖数组的
```javascript
  useEffect(
    () => {
      setPerson(name)
    },
    [name, obj.name, obj.name.age]
  )
  
  //优化案例：如果我的 effect 的依赖频繁变化，我该怎么办？
  const [count, setCount] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>{
      setCount(c => c + 1);
      // setCount(count + 1); //这里依赖了count,会造成重复渲染
    },1000)
    
    return ()=>{
      clearInterval(id)
    }
  },[]); //不依赖任何外部变量
```

-  **每一次渲染都有它自己的**`**Effect**`**(Capture Value)**  
```javascript
function SetCounter(){
  useEffect(()=>{
    setTimeout(()=>{
      alert(counter) // 会弹出每一次点击的值
    },3000)
  },[counter])
}

//如果想要弹出最终（新）值
useEffect(()=>{
  ref.current = counter;
  setTimeout(()=>{
    alert(ref.current)
  },3000)
},[counter])
```

## exhaustive-deps 更新依赖
关于`eslint-pluign-react-hooks`的`exhaustive-deps`规则（在添加错误依赖时发出警告并给出修复建议）的说明:
如果按照规范，我们必须把所有依赖项都要加到依赖数组中，但是有时不希望监听某个依赖项的变化怎么办？
⚠️要么**学院派**思维老老实实优化`state`转`ref`，
⚠️要么**实用派**思维，直接ignore lint
相关链接讨论

- **《React Hooks使用误区，驳官方文档》**
[https://zhuanlan.zhihu.com/p/450513902](https://zhuanlan.zhihu.com/p/450513902)

关于第一条“**不是所有的依赖都必须放到依赖数组中**”的建议，

1. 我认为有些`state`可以用`ref`来替换  
2. 如果是引入了`props`的变量，则在`useEffect`内的函数用`useMemo`包一层，
在**memo函数**内重新引用不想被监听的`props`变量

- **如何看待《React Hooks使用误区，驳官方文档》**
[https://www.zhihu.com/question/508780830](https://www.zhihu.com/question/508780830) 
从评论中很明显的看出React的使用者分成了两个阵营： 
【实用派】和【学院派】  

只有菜鸡才会互啄，而高手们都是以学院派的思维做实用派的事

## 终止异步函数

> 使用`setTimeout`、`setInterval`、`Promise**.**then`等在卸载组件时容易产生闭包陷阱

```jsx
// isUnmount ref
const isUnmount = React.useRef(false)
useEffect(()=>{
  isUnmount.current = false
  return ()=>{
      isUnmount.current = true
  }
},[])


// 更新前判断isUnmount
const fetchAPI = async()=>{
  const res = await api();
  if(isUnmount.current === false){
    // update state
  }
}
```



# useContext

> `createContenxt`+`useContext`


-  **在class中的最佳实践**
不同点：1.动态Context`static contextType = ConfigureContext` + `this.context`
2.在嵌套组件中更新Context`<Context.Consumer>`
**缺点：不能消费多个Context**
**但是当你多个context经常被一起使用，那可以考虑将这几个context合并并返回一个新的Context**[**链接**](https://stackoverflow.com/questions/53988193/how-to-get-multiple-static-contexts-in-new-context-api-in-react-v16-6)  
```jsx
 const ConfigureContext = React.createContext(initialValue)
 class Provider extends React.Component {
   <ConfigureContext value={...}>
    <Child />
   </ConfigureContext>
 }
 
 class Child extends React.Compoment {
   static contextType = ConfigureContext; //核心
   
   //正常该咋咋的
   <...>
   //获取context的方式： 
   const {context} = this;
 }
```

-  **在Hook中使用**
**不同点：**`useContext` + `createContext`
因为function中没法使用`static contextType`  
```javascript
function Child(){
  const context = useContext(ConfigureContext)
}
```

-  **Provider hoc**
将`Context.Provider`封装成hoc组件，传`this.props.children`
可以避免未注册context的组件不必要的渲染。渲染原因是`React.createElement`在父组件下会重新创建新的Children 
-  **多个Context嵌套使用时** 
   1. 关注在应用中使用的Context顺序，让不变的在外层，多变的在内层(里变外不变，变的放里面)
   2. Context中的内容可以按使用场景和变与不变来拆分成多个更细粒度，以减少渲染
   3. Q:组件如何使用多个Context?
   4. A: 可以用多次执行`useContext`或者`<Context.Consumer>`多层嵌套
   5. 优化：多个Context合并成一个Context时，也要保证输出时的最终形态是“组件+children”模式
   6. 否则每次渲染时，所有的Context内部都会不必要的重新渲染(当然这是React.createElement与层级造成的，Context不背锅)
```javascript
    const A = useContext(ContextA)
    const B = useContext(ContextB)

    //或者
    function ContextMultipl = 
    <ContextA.Consumer>
      {A=>{
         <ContextB.Consumer>
           {B=>{
             ....
           }}
         </ContextB.Consumer>
      }} 
    </ContextA.Consumer>
    
    //输出时也要封装一层，保证传入的只是一层props.children
    export const ConfigureProvider = (props) => {
      return (
        <ContextMultipl>
          {props.children}
        </ContextMultipl>
      )
    }
```

-  **useContext组件不必要的重新渲染** 
   1. Provider实现组件内 将contextValue进行memo化
   2. 给Provider传的value如果是常量的话，也需要用memo或者存在ref内，不能直接写在组件上
```diff
    //ConfigureProvider
    function ConfigureProvider(props){
      const {theme} = props;
      const memoedConfig = React.useMemo(
        ()=>{
          return {theme:props.theme}
        },
        [theme]
      )
      return (
+       <Context.Provider value={memoedConfig}/>
-       <Context.Provider value={{thmem: props.theme}}> //不要这么做
          {props.children}
        </Context.Provider>
      )
    }
 
    //使用
    function App(){
      //存在state里没什么问题
      const [theme, setTheme] = React.useState({color:'red'});
   
      //常量必须memo或者存在ref里
      const theme = React.useMemo(()=>{
        return {color:'green'}
      },[]);
      const theme = React.useRef({color:'purple'}).current;
   
      return (
+       <ConfigureProvider  value={theme} />
-       <ConfigureProvider value={{color:"red"}}> //不要这么做
     
        </ConfigureProvider>
      )
    }
```

- **useContext不代表全局属性，因为context只能影响子组件，影响不了父组件
**[https://mp.weixin.qq.com/s/l6-DWRzUwDoWzwrM7uZlPQ](https://mp.weixin.qq.com/s/l6-DWRzUwDoWzwrM7uZlPQ) React Context实现原理
createContext就是创建了一个 `_currentValue`、`Provider`、`Consumer`的对象，
- `_currentValue` 就是保存值的地方
- `Provder`是一种单独的jsx类型（和普通vdom不同），转为不一样的fiber类型（目的就是不走很长的vdom树，一次commit直接精准定位更新）
- `Consumer`和`useContext`就是读取_currentValue，也就是context值

唯一要注意的是Provider处理每个节点之前会入栈context，处理完会出栈，这样能保证context只影响子组件。
所以不是全局属性能模拟实现的（全局属性一个是diff过长、一个是影响父组件）
```jsx
import {createContext, useContent} from 'react'

const countContext = createContext(111);

function AAA(){
  const count = useContext(countContext);

  return (
    <>
      <h1>父组件中context值为： {count}</h1> // 111
      <BBB></BBB>
    </>
  )
}


function BBB(){
  return (
    <>
      <countContext.Provider value={222}>
        <CCC></CCC>
      </countContext.Provider>
    </>
  )
}

function CCC() {
  const count = useContext(countContext);
  return <h2>子组件中context值为：{count}</h2> // 222
}
```
# useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialState, init)
```

`useState`的替代方案，

-  **目的1：多个**`**state**`**/**`**setState**`**放在一个**`**reducer**`**内**  
```javascript
//仿照redux的写法
const initialState = {count:0}
const reducer = function(state, action){
  switch(action.type){
    case 'increment':
      return {...state, count:state.count+1};
      // return action.payload
    case 'decrement':
      return {...state, count:state.count-1};
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState)
```

-  **目的2:通过**`**context**`**+**`**dispatch**`**方案可忽略层级地执行渲染**  
```jsx
    <MyContext.Provider value={{state, dispatch}}>
    </MyContext.Provider>

    //Subcomponent useContext
    function Sub(){
      const {state, dispatch} = useContext(MyContext) // state,dispatch命名来自Provier的value
      
      dispatch(...)
    }
```

-  **惰性初始化**
你可以选择惰性地创建初始state。执行第三个参数`init`函数，函数内参数为`initialState`  
```javascript
const initialArg = {count: 0}
function init(arg){
  console.log(arg) // {count: 0}
  return {count: 1}
}
const [state, dispatch] = useReducer(reducer, initialArg，init)
```

-  **模拟forceUpdate**  
```javascript
const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
```

# useCallback

```javascript
const memoizeCallback = useCallback(
  ()=>{
    doSomething(a,b);
  },
  [a,b]
)
```

返回一个memoized回调函数，**和useMemo的却别在于一个memo组件，一个memo hook**
例如：监听ref的改变

```javascript
   const measuredRef = useCallback(node => {
     if(node !== null) {
       //do some dom thing
     }
   })
   <h1 ref={measuredRef}>Hello, world</h1>
```

function组件每一次re-render都会顺序执行函数内的函数和hook
那么什么时候需要用到useCallback呢？

1. 引用相等 
```javascript
const list = useRef(new Set())
const increment = useCallback(()=>{
  //do sth
})
//如果不使用callback，increment将被重复声明，list也无法自动去重

list.add(increment)
```

2. 昂贵的计算

## 建议使用useMemo
相较于`useCallback`而言，`useMemo`的收益是显而易见的。
`useCallback`就是基于`useMemo`来实现的。。。。。。
```jsx
export function useCallback<T>(
  callback: T,
  deps: Array<mixed> | void | null,
): T {
  return useMemo(() => callback, deps);
}
```
源代码链接：[https://github.com/facebook/react/blob/3dc41d8a2590768a6ac906cd1f4c11ca00417eee/packages/react-dom/src/server/ReactPartialRendererHooks.js#L466-L471](https://github.com/facebook/react/blob/3dc41d8a2590768a6ac906cd1f4c11ca00417eee/packages/react-dom/src/server/ReactPartialRendererHooks.js#L466-L471)
# useMemo

返回一个memoized值，专门为了保存**对象和数组的引用**的存在

```javascript
const memoizedValue = useMemo(()=>computeExpensiveValue(a,b), [a,b]);
```

**常常和**`**useEffect**`**，**`**useLayoutEffect**`**配合使用**

```javascript
//useEffect第二个参数用于判断指定的更新元素
//除了原始值（不可变值），对象和数组以及函数在每一次的re-render都会返回一个新的引用
//所以需要useMemo保存对象和数组
//useCallback保存函数

function Sup(){
  const bar = function(){}
  const baz = [1,2,3]
  
  const bar2 = useCallback(bar)
  const baz2 = useMemo(baz)
  
  const primitiveValue = 1
  
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
  
  return (
    <div>
     <Sub bar={bar} baz={baz} name={"1"} />
     <Sub bar={bar2} baz={baz2} name={"2"}/>
     <button onClick={forceUpdate}>forceUpdate</button>
    </div>
  )
}

function Sub({bar, baz, name}){
  useEffect(()=>{
    console.log("re-render",name) // re-render 1
  },[bar, baz]);
}
```

# useRef

-  **绑定ref**  
```jsx
    const inputEl = useRef(null);

    <input ref={inputEl}/>
```

-  **模拟**`**class**`**的实例属性**`**this.xx**`
存储一个初始值 
存储一个setInterval id  
```javascript
const person = useRef({name:"Niko", age: 25})
console.log(person); // {current: {name, age}}
```
```javascript
   const intervalRef = useRef(null);
   useEffect(() => {
     const id = setInterval(() => {
         // ...
     });
     intervalRef.current = id;
     return () => {
         clearInterval(intervalRef.current);
     };
   });
```

-  获得`prevState`或`prevProps`  
```javascript
const prevState = useRef(state)

useEffect(()=>{
  prevState.current = state
},[state])

Now:{state}, before:prevState
```

-  **惰性初始**  
```javascript
//⚠️ createRows() 每次渲染都会被调用
 const ref = useRef(createRows());
 
 //✅ createRows() 只会被调用一次
 // useRef不能和useState一样接受一个特殊的函数重载
 // 但是ref值会被存储，因此
 const ref = useRef(null);
 function getRef(){
   if(ref.current == null){
     ref.current = createrows()
   }
   return ref.current
 }
 
 // 当你需要ref时，调用getRef即可
```

-  `**useRef**`**和**`**createRef**`**的区别** 
-  相同点：都有一个`{current:undefined}`默认对象 
-  不同点：在`function`使用的话，每一次re-render，都会重新`createRef`但不会`useRef`，因此`createRef`的`current`值就会被重置,而`useRef`的不会。 

# useImperativeHandle

> 配合`forwardRef`使用，为自定义组件添加可访问的ref对象


```jsx
const Listview = forwardRef((props,ref)=>{

  useImperativeHandle(ref, ()=>{
    // 供外部ref访问的对象,比如
    dataSource,
      refresh
  });

  return (
    ...
  )

})


//调用：
const ListViewRef = useRef()
<ListView ref={listViewRef}/>

listViewRef.refresh();
console.log(listViewRef.dataSource)
```

# useLayoutEffect

使用`useLayoutEffect + useRef`模拟实现`useCallback(ref)`

```javascript
const root = useRef(null);

useLayoutEffect(()=>{
  if(root.current){
    // ...
  }
},[root.current]) //必须添加监听root.current，否则当Layout注销时无法监听

//等价于
const refCallback = useCallback(
  (node)=>{
    if(node !== null){
      // ...
    }
  }
)

visible?<div ref={root}></div>:<div ref={refCallback}></div>
```

# useDebugValue

# 闭包陷阱

> 闭包陷阱就是通过useState定义的值拿到的都不是最新的


**在延迟调用的场景下，一定会存在闭包问题

**

1. 使用`setTimeout`、`setInterval`、`Promise**.**then`等
2. `useEffect`的卸载函数

```jsx
// useEffect 写在函数会造成闭包问题
useEffect(()=>{
  return ()=>{
    console.log(count);
  }
}, [])
```

解决方案：

1. **在异步/订阅事件中获取最新值时**
使用`useRef`存储最新值
2. **调用方法时不使用外部依赖** 
```diff
// useState
- setCount(count+1)
+ setCount(pre=>pre+1)

// useReducer的dispatch是最稳定的
dispatch({type,state})
```

3. 变量写到函数外面（不推荐，不优雅）
# 
# 「面向上层框架」的元框架
文档中新出的特性普通开发者很少会用到，这些特性都是作为元框架，给上层框架（或库）使用的。
甚至在React文档中根本不提及，相反，Next.js文档中却可以看到使用介绍。
## useTransition
## useId
## useMutableSource
## useOptimistic
## useFormStatus
