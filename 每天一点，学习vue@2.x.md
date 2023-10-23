# Vue代码风格指南

> 参考：[史上最全 Vue 前端代码风格指南](https://mp.weixin.qq.com/s/6dA4qvtfC8fggzW5-uP3OA)

## 自闭合组件

1.  **在单文件组件和字符串模版中**
 `<MyComponent />`

2.  **在DOM模版中**

      `<MyComponent></MyComponent>`

3. 在单文件组件、字符串模版和JSX中没有内容的组件应该是自闭合的——但在DOM模版中永远不要这样做
`<my-component></my-component>`
## 指令缩写

1. 用` : `表示` v-bind: `
2. 用` @ `表示` v-on: `
3. 用` # `表示` v-slot: `

## 自有attr用双引号
非空 HTML 特性值应该始终带双引号
```jsx
// bad
<MyComponent :style={ width: propWidth + 'px' } />

// good
<MyComponent :style="{ width: propWidth + 'px' }">
```
## 其他

1. 缩进换行请使用两个空格。 
2. 大型团队多人协作项目推荐 JavaScript 代码末尾加分号。 
3. 小型个人创新练手项目可尝试使用 JavaScript 代码末尾不加分号的风格，更加清爽简练。
# 生命周期
| 生命周期钩子 | 组件状态 | 最佳实践 |
| --- | --- | --- |
| `beforeCreate` | **实例初始化后，this指向创建的实例**，不能访问到data、computed、watch、methods上的方法和数据 | 常用于初始化**非响应式变量** |
| `created` | **实例创建完成**，可访问data、computed、watch、methods上的方法和数据，**未挂载到DOM，不能访问**`**$el**`
**属性，**`**$ref**`
**属性内容为空数组** | 常用于简单的ajax请求，页面的初始化 |
| `beforeMount` | 在挂载开始之前被调用，beforeMount之前，会找到对应的template，并编译成render函数 | - |
| `mounted` | **实例挂载到DOM上**，此时可以通过DOM API获取到DOM节点，$el、$ref属性可以访问 | 常用于获取`VNode`
信息和操作，ajax请求 |
| `beforeUpdate` | 响应式数据更新时调用，发生在虚拟DOM打补丁之前 | 适合在**更新之前访问现有的DOM**，比如手动移除已添加的事件监听器 |
| `updated` | 虚拟DOM重新渲染和打补丁之后调用，组件DOM已经更新，可执行依赖于DOM的操作     无论组件本身的数据变更，还是从父组件接收到的`props`
或者从`vuex`
里面拿到的数据有变更，都会触发虚拟DOM重新渲染和打补丁，并在之后调用`updated` | 避免在这个钩子函数中操作数据，可能陷入死循环 |
| `beforeDestory` | 实例销毁之前调用。这一步，实例仍然完全可用，this仍能获取到实例 | 常用于销毁定时器，解绑全局事件、销毁插件对象等操作 |
| `destoryed` | 实例销毁后调用，调用后，Vue实例指示的所有东西都会解除绑定，所有的事件监听器会被移除，所有的子实例也会被销毁 | - |


# 计算属性 computed

-  **1.没有计算属性的代码**
在模板中放入太多的逻辑会让模版过于难以维护  
```jsx
 <div>
   {{ message.split('').reverse().join('') }}
 </div>
```

-  **2.使用计算属性**  
```jsx
 <div>
   {{ reverseMessage }}
 </div>
 
 computed:{
   reverseMessage:function(){
     return this.message.split('').reverse().join('')
   }
 }
```

-  **3.使用计算属性 vs 使用方法**
虽然结果都一样，但是每当触发重新渲染时，调用方法将**总会**再次执行函数。
**计算属性是基于它们的响应式依赖进行缓存的**，也就是只要相关响应式依赖发生改变时才会重新求值  
```jsx
 <div>
   {{ reverseMessage() }}
 </div>
 
 methods:{
   reverseMessage:function(){
     return this.message.split('').reverse().join('')
   }
 },
 
 computed:{
   now:function(){
     return Date.now(); // 这里没有响应式依赖，那么now的值将恒定不变
   }
 }
```

-  **4.计算属性 vs 侦听属性**
如上述vs使用方法一样，计算属性自带响应式监听，watch是多余的  
```javascript
 watch: {
   message: function(val){
     this.reverseMessage2 = val.split('').reverse().join('')
   }
 }
```

-  **5.计算属性的setter**  
```javascript
 vm.reverseMessage = "" //会调用下面声明的setter方法
 computed: {
   reverseMessage:{
     get: function(){
       return ...
     },
     set:function(newValue){
       ...
     }
   }
 }
```
###### 
用一句话解释computed和watch的区别

- computed名称不能与data里对象重复，只能用同步，必须有return(有getter除外)，是多个值变化引起一个值变化（多对一）
- watch名称必须和data里对象一样，可以用异步，没有return，监听一个值变化引起多个值变化（一对多）


# 事件修饰符

-  `**.self**`
阻止事件传递  
```html
 <!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
 <!-- 即事件不是从内部元素触发的 -->
 <div v-on:click.self.prevent="onParentClick" data-name="Parent">
  <div v-on:click="onChildrenClick" data-name="Children"></div>
 </div>
```

-  `**.stop**`
阻止事件冒泡  
```html
 <!-- 阻止单击事件继续传播 -->
 <div v-on:click="onParentClick" data-name="Parent">
  <div v-on:click.stop="onChildrenClick" data-name="Children"></div>
 </div>
```

-  `**.capture**`
从事件冒泡顺序改成事件捕获顺序  
```html
 <!-- 添加事件监听器时使用事件捕获模式 -->
 <!-- 点击Children时，本来先执行onChildrenClick，现在改成先执行onParentClick -->
 <div v-on:click.capture="onParentClick" data-name="Parent">
  <div v-on:click.stop="onChildrenClick" data-name="Children"></div>
 </div>
```

-  `**.once**`
只执行一次  
```javascript
addEventListener("click",onClick, {once:true})
```

-  `**.prevent**`
取消浏览器的默认行为  
```javascript
e.preventDefault()
```

-  `**. passive**`
立即执行，而非结束后才执行  
```html
 <div v-on:scroll.passive="onScroll">...</div>
```

# 深入响应式原理

当把一个普通的JavaScript对象传入Vue实例作为`data`选项，**Vue将遍历此对象所有property**,
并使用`Object.defineProperty`把这些property全部转为`getter/setter`。

`Object.defineProperty`是ES5中一个无法shim的特性，这也就是Vue不支持IE8以及更低版本浏览器的原因。

## Object.defineProperty

- **vue2.0**
使用`Object.defineProperty`缺点是不能检测数组和对象的变化，必须**声明式响应**。
**-对象**：会递归得去循环vue每一个属性，会给每个属性增加getter和setter，当属性发生变化的时候会更新视图
**-数组**：重写了数组的方法，当调用数组方法时会触发更新，也会对数组中的每一项进行监控(但`arr[1]=xxx`这种赋值操作还是监听不到)
**-缺点**：对象只监控自带的属性，新增的属性不监控，也就不生效。
**若是后续需要这个自带属性，就要再初始化的时候给它一个undefined值，后续再改这个值** 
```javascript
class Vue2{
 constructor(data){
     this.data = data;
     for(let i in this.data){
         if(this.data.hasOwnProperty(i)){
             this.initialiseData(i)
         }
     }
 }
 initialiseData(key){
     Object.defineProperty(this, key,{
         get: () => this.data[key],
         set: (value) => {
             this.onChange(key, value)
         }
     })
 }

 onChange(key, value){}

 $set(key,value){
     this[key] = value
 }

 $get(key){
     return this[key]
 }
}

class Vue extends Vue2 {
 constructor(props){super(props)}

 onChange(key, value) {
     console.log("onChange",key,value)
 }
}

const vue = new Vue({
 name:"Niko",
 age:25
});

vue.$set("age",26);
console.log(vue.$get("age")) //26
```

## Proxy

- **vue3.0**
使用`Proxy`解决了上述缺点，
-不仅可以**监听属性的增加和删除**（属性动态响应式）、
-**数组索引和长度的变更**，
-还可以支持`Map`、`Set`、`WeakMap`和`WeakSet`！ -**-缺点**：嵌套代理的情况下，当深层的数据发生改变是会多次触发trap的情况，需要去重（这也是Proxy的缺点）
```javascript
let handler = {
 get(target,key){
     if(typeof target[key] === 'object' && target[key] !== null){
         //递归代理，只有取到相应值的时候才会代理
         return new Proxy(target[key], handler)
     }

     // return target[key]
     // Reflect反射，这个方法里面包含了很多api
     return Reflect.get(target, key)
 },
 set(target, key, value){

     let oldValue = target[key];
     if(!oldValue){
         console.log('新增属性')
     }else if(oldValue !== value){
         console.log('修改属性')
     }

     // target[key] = value
     // 这种写法设置时如果不成功也不会报错，比如这个对象默认不可配置
     Reflect.set(target, key, value);
     return true

 }
};

const obj = {
 name:'Niko',
 arr:[1,2,3]
};
let proxy = new Proxy(obj, handler);
obj.age = 25;
proxy.age++; //动态添加响应式属性
console.log(proxy.age) // 26
```

> 知识回顾--Proxy对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）


# 异步更新队列

**Vue在更新DOM时是异步执行的**。

只要侦听到数据变化，Vue将开启一个**队列**，并缓冲在同一事件循环中发生的所有数据变更。

如果同一个watcher被多次触发，只会被推入到队列中一次。
这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作是非常重要的。

然后，在下一个的事件循环“tick”中，Vue刷新队列并执行实际（**已去重的**）工作。

Vue在内部对异步队列尝试使用原生的`Promise.then`、`MutationObserver`和`setImmediate`，如果执行环境不支持，则会采用`setTimeout(fn, 0)`代替。

## 什么时候使用$nextTick

例如，当你设置`vm.someData = 'new value'`，该组件不会立即重新渲染。

当刷新队列时，组件会在下一个事件循环“tick”中更新。

多数情况我们不需要关心这个过程，但是如果**你想基于更新后的DOM状态来做点什么**，这就可能会有些棘手。

虽然Vue.js通常鼓励开发人员使用“数据驱动”的方式思考，避免直接接触DOM，但是有时我们必须要这么做。

为了在数据变化之后等待Vue完成更新DOM，可以在数据变化之后立即使用`Vue.nextTick(callback)`。这样回调函数将在DOM更新完成后被调用。

例如：

-  **直接操作DOM，立即获取DOM上的某些属性**
  
 
`**v-show=true**`**显示输入框，并紧接着获取焦点** 
  
```javascript
  vm.someData = 'new value'
  //通过DOM获取数据
  vm.$el.textContent === 'new value' // false
  Vue.nextTick(function(){
    vm.$el.textContent === 'new value' // true
  })
```
```javascript
this.show = true;
this.$nextTick(function(){
  //DOM更新了
  document.getElementById("keywords").focus()
})
```

-  **组件内通过**`**this**`**调用而不需要全局**`**Vue**`
`this.$nextTick`
  
  
```javascript
  {
    data:function(){
      return {
        message: '未更新'
      }
    },
    methods: {
      updateMessage: function(){
        this.message = '已更新'
        console.log(this.$el.textContent) // => '未更新'
        
        this.$nextTick(function(){
          console.log(this.$el.textContent) // => '已更新'
        })
      }
    }
  }
```

-  `**$nextTick**`**返回一个**`**Promise**`**对象**
  
  
```javascript
  this.$nextTick()
      .then(()=>{
        ...
      })
```

-  `**created()**`**钩子函数内操作DOM**
 
`created()`执行的时候`DOM`其实并未进行任何渲染，所以需要写在`$nextTick`内
  
-  `**mounted()**`**钩子函数不会承诺所有的子组件都一起被挂载**
 
`mounted()`内也需要`$nextTick`
  
-  `**updateed**`**钩子函数全局监听**
 
`**updated()**`**无论是组件本身的数据变更，**
**还是从父组件接收到的**`**props**`
**或者从**`**vuex**`**里面拿到的数据有变更**，
都会触发虚拟DOM重新渲染和打补丁，并在之后调用`updated()`，
所以和`$nextTick`触发时机不同
  
-  **有时用**`**setTimeout(fn, 0)**`**就可以了**
   
```diff
this.animated = true;

- this.$nextTick(()=>{
-   this.CalculationStart();
- })

+ setTimeout(()=>{
+   this.CalculationStart();
+ },0)

this.CalculationEnds();
this.animated = false;
```
# Demo收藏

## transition动画简洁写法
> demo: 列表展示排队依次进入(随着data的变化执行相关leave/enter动作)


```vue
  <transition-group tag="ul" name="list">
    <li v-for="(i,a) in data" v-bind:key="i" style="height:50px;width:100%;border:1px solid #000" v-bind:style="{background: '#f'+i+i+i+i+i, transitionDelay:a/10+'s'}"></li>
  </transition-group>
  
  <style>
    .list-enter-active, .list-leave-active {
      transition: transform .5s;
    }
    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
      transform: translateX(300px);
    }
  </style>
```

