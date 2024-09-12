# 引言

JavaScript有很多异步编程方式[ [1](https://frontendmasters.com/courses/rethinking-async-js/) ] [ [2](https://zhuanlan.zhihu.com/p/67815990) ]：

- **callback**
- **thunk**
- **promise**
- **generator**
- **async/await**
- **Observable**

# callback

## 信任问题

```javascript
// A
ajax("...", function(...){
  // C
});
// B
```

有时候像`ajax`这样并不是我们自己写的而是第三方控制下的，不在我们的直接控制下，
很可能会出现：

- 调用回调过早（在追踪之前）
- 调用回调过晚（或没有调用）
- 调用回调的次数太少或太多（重复调用回调）
- 没有把所需的环境/参数成功传给你的回调函数
- 吞掉可能出现的错误或异常

这些才是**回调地狱**。我们需要**控制反转**(inversion of control)

## 缺点

通过回调表达程序异步和管理并发的两个主要缺陷：缺乏顺序性和可信任性。

# thunk

`thunk`是什么？
0. [论文：ALGOL thunks in 1961](http://archive.computerhistory.org/resources/text/algol/ACM_Algol_bulletin/1064045/frontmatter.pdf)

1. `thunk`是一个被封装了同步或异步任务的函数
2. `thunk`有唯一一个参数`callback`，是CPS函数
3. `thunk`运行后返回新的`thunk`函数，形成链式调用
4. `thunk`自身执行完毕后，结果进入`callback`运行
5. `callback`的返回值如果是`thunk`函数，则等该`thunk`执行完毕将结果输入新`thunk`函数运行；如果有其他值，则当做正确结果进入新的`thunk`函数运行

- thunkify实现

```javascript
   /**
    * 1. thunk 是一个封装了同步或异步任务的函数
    * 2. thunk有唯一一个参数callback，是CPS函数
    * 3. thunk运行后返回新的thunk函数，形成链式调用
    * 4. thunk自身执行完毕后，结果进入callback
    * **/
   function thunkify(fn){
       //柯里化
       return function(){
           var args = new Array(arguments.length); // 保证args是数组，因为后续会有push操作
           var ctx = this;

           for(var i=0;i<arguments.length;i++){
               args[i] = arguments[i]
           }

           //偏函数 唯一一个参数done（callback），是CPS函数
           //返回新的thunk函数，形成链式调用
           return function(done){

               var called;

               args.push(function(){
                   if(called) return;
                   called = true;
                   done.apply(null, arguments); // 调用done且保证只调用一次
               });

               try{
                   fn.apply(ctx,args)
               }catch (err) {
                   done(err)
               }
           }
       }
   }
```

- usage

```javascript
   function readFile(a,b,callback){
       setTimeout(()=>{
           callback(a,b)
       },1000)
   }
   
   var read = thunkify(readFile);
   
   read("application/json", "utf-8")(function(err, str){
     console.log('...')
   })
```

> 注解： CPS函数(continuation-passing style(延续过渡风格))
是把 `f :: a->a`变换成`f_cps :: a -> ( (a->r)->r )`
和尾递归很像，**把返回值都改成callback，相应的循环就变成了递归**
>  
> -ify 使...化； thunkify 使thunk化


## thunk 并发请求、顺序输出

- 改写thunkify，将未来会调用的callback存在闭包中，以达到**时间控制**

```javascript
function thunkify(fn){
    //柯里化
    return function(){
        var called;
        var callback;
        var args = new Array(arguments.length); // 不固定参数

        for(var i = 0; i < args.length; ++i) {
            args[i] = arguments[i];
        }

        args.push(function(){
            // 回调——信任问题：只允许回调一次
            if (called) return;
            called = true;

            if (callback) callback.apply(null,arguments);
            else callback = arguments
        });

        try{
            fn.apply(null,args);
        }catch (err) {
            // error-first style
            callback = [err]
        }

        return function(done){// 偏函数，固定参数
            if (callback) done.apply(null,callback);
            else callback = done
        }
    }
}
```

- Usage

```javascript
 var a = thunkify($.get)("http://api.com/a");
 var b = thunkify($.get)("http://api.com/b");
 var c = thunkify($.get)("http://api.com/c");
 
 a(function(data,status){
   console.log('a',data,status)
   b(function(data,status){
     console.log('b',data,status)
     a(function(data,status){
       console.log('c',data,status)
     })
   })
 })
```

## thunk是什么？

- Q:所以再回头问一下，thunk是什么？
- A:Promise是围绕值的时间独立包装器(time-independent wrapper)，一个更高级的API，而thunk则是没有花哨API下对promise同样功能的实现

## 缺点

虽然异步thunk抽离出时间后，对于顺序性更好理解了。但是回调的另外一个问题——依赖反转，通过

# Promise

## Promise"事件"

我们侦听的Promise决议(resolution)“事件”严格来说并不算是事件（尽管它们实现目标的行为方式确实很像事件），
通常也不叫作"completion"或"error"。事实上，我们通过`then(..)`注册一个"then"事件。
或者可能更精确地说，`then(..)`注册"fullfillment"和/或"rejection"事件，尽管我们并不会在代码中直接使用这些术语。

## revealing constructor

revealing 揭示； revealingly 显露地；即在`constructor`中就开始执行，这样实例化时就会立即执行

```javascript
class Promise{
  constructor(func){
    func(this.resolve, this.reject)
  }
  
  resolve(){
    ...
  }
  
  reject(){
    ...
  }
}

new Promise(resolve, reject){
  resolve();//会立即执行
}
```

`new Promise(function(..){..})`模式通常称为**revealing constructor**，**传入的函数会立即执行**。

## 具有then方法的鸭子类型

> 根据一个值的形态（具有哪些属性）对这个值的类型做出一些假定。
这种**类型检查**(type check)一般用术语**鸭子类型**(duck typing)来表示————
"如果它看起来像只鸭子，叫起来像只鸭子，那么它一定就是只鸭子"


```javascript
if(
 p !== null &&
 (
   typeof p === "Object" || // 用于thenable对象
   typeof p === "function"
 ) &&
  typeof p.then === "function"
) {
  // 假定这是一个thenable！
}
else {
  // 不是thenable
}
```

导致一些著名的非Promise库恰好有名为`then(..)`的方法。这些库一部分选择了重命名自己的方法以避免冲突（这真糟糕！）。
而其他的那些库只是因为无法通过改变摆脱**这种冲突**，就很不幸地被降级进入了“与基于Promise的编码不兼容”的状态。

除了使用thenable鸭子类型检测作为Promise的识别方案，还有其他选择，比如branding，甚至anti-branding

> anti-branding:**反品牌**可以说是跨国公司掩饰其跨国方面以吸引更多本地人群的努力。


## Promise 信任问题

### 调用过早

在这类问题中，一个任务有时同步完成，有时异步完成，这可能会导致竞态条件(俗称_永远不要放出Zalgo恶魔_副作用)。
要么选**同步回调**，要么选**异步回调**，但不要两者都有[[3]](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/)。

根据定义，Promise就不必担心这种问题，因为即使是立即完成的Promise（类似于`new Promise(function(resolve){ resolve(42) })`或`Promise.resolve(42).then(res)`）也无法被同步观察到。

不再需要插入你自己的`setTimeout(..., 0)` hack，Promise会自动防止Zalgo出现。

- event loop回顾

```javascript
setTimeout(()=>{
  console.log(123)
})
Promise.resolve(456).then(res=>{
  console.log(res)
})
console.log(789)

//输出顺序：
789
456
123
```

- Promise.resolve与new Promise是相对同步的

```javascript
Promise.resolve().then(()=>{
  console.log(123)
})

let p = new Promise(resolve=>{
  console.log(456); // 这里是同步回调，会立即执行
  resolve(789)
})

p.then(res=>{ console.log(res) })

Promise.resolve().then(()=>{
  console.log(101112)
})

//输出顺序
456
123
789
101112
```

### 调用过晚

Promise创建对象调用`resolve(..)`或`reject(..)`时，这个Promise的`then(..)`注册的观察回调就会被自动调度。
可以确信，这些被调度的回调在下一个异步事件点上一定会被触发。

先注册了1和3，resolve之后执行1，1内才开始注册2，Promise是允许res之后很晚才注册的then被执行的。

```javascript
let p = new Promise(resolve=>{
  resolve()
})
p.then(function(){ // 1
  p.then(function(){ // 2
     console.log("C")
  })
  console.log("A");
})
p.then(function(){ // 3
  console.log("B");
})
//A B C
//这里“C”无法打断或抢占“B”
```

#### Promise调度技巧

两个独立Promise上链接的回调的相对顺序无法可靠预测

```javascript
var p3 = new Promise(function(resolve){
  resolve("B")
});

var p1 = new Promise(function(resolve){
  resolve(p3)
});

var p2 = new Promise(function(resolve){
  resolve("A")
});

p1.then(function(v){
  console.log(v)
});

p2.then(function(v){
  console.log(v)
});

// A B <-- 而不是像你可能认为的B A
```

### 回调未调用

如果永远不会resolve，可以用`Promise.race([p, timeout])`加一个timeout
俗称**竞态**的高级抽象机制

### 调用次数过少或过多

> 根据定义，回调被调用的正确次数应该是1。“过少”的情况就是调用0次，和“调用未被调用”是一种情况


这里的`then(..)`只里面的函数只会被调用一次，但`then(..)`注册一次就会执行一次

### 未能传递参数/环境值

Promise至多只能有一个决议值（完成或拒绝）

### 吞掉错误或异常

Promise不主动`reject()`但是内部函数还是`Error`的话也是会进入到`catch`

```javascript
// reject方式一
p.then().catch()

// reject方式二
p.then(
  function fulfilled(){},
  function rejected(err){ 
    // err
  }
)
```

### 是可信任的Promise吗

- 如果向`Promise.resolve(..)`传递一个非Promise、非thenable的立即值，就会得到一个用这个值填充的promise
- 如果向`Promise.resolve(..)`传递一个真正的Promise，就只会返回同一个（传入的这个）promise 
```javascript
var p1 = Promise.resolve(42);
var p2 = Promise.resolve( p1 );

p1 === p2; // true

var p3 = Promise.resolve(new Promise((resolve, reject)=>{ reject(42) }))
```

- 如果向`promise.resolve(..)`传递一个非promise的thenable值，前着就会试图展开这个值
而且展开过程会持续到提取出一个具体的非**类Promise**的最终值 
```javascript
var p = { // 类Promise
   then:function(cb,errcb){
     cb(42);
     errcb("evil laugh")
   }
}

p.then(
  function fulfilled(val){
     console.log(val); // 42
  },
  function rejected(err){
     // 啊，不应该运行！
     console.log(err); // evil laugh
  }
)

Promise.resolve(p).then(
  function fulfilled(val){
     console.log(val); // 42
  },
  function rejected(err){
     //永远不会到这里
     //你可以永远相信Promise
  }
)
```

- 案例：`**建立信任**`
`foo(..)`且并不确定得到的返回值是否是一个可信任的行为良好的Promise，但我们可以知道它只是是一个thenable。
`Promise.resolve(..)`提供类可信任的Promise封装工具，可以链接使用： 
```javascript
// 在不确定foo是不是一个Promise的情况下
// 不要只这么做
foo(42)
.then(function(res){ .. })

// 而要这么做：
// 保证返回的是一个promise
Promise.resolve(foo(42)).then(function(res){ .. })
```

> 总结：对于用`Promise.resolve(..)`为所有函数的返回值（不管是不是thenable）都封装一层。
另一个好处是，**这样做很容易把函数调用规范为定义良好的异步任务**。
如果`foo(42)`有时会返回一个立即值，有时会返回Promise，那么`Promise.resolve(foo(42))`就能保证总会返回一个Promise结果。
而且避免Zalgo(可以理解会可能异步可能同步)就能得到更好的代码


## 链式流

- 同步.then 
```javascript
	var p = Promise.resolve(21);
	p2 = p.then(res=>{ return res * 2 });

	p2.then(res=>{ console.log(res) }); // 42

	// 简化
	fetch().then(res=>return res.text()).then(..)
```

- 异步.then 
```javascript
	p = Promise.resolve(21);
	p.then(res=>{
 	return new Promise(resolve=>{ // 返回又一个promise
 		setTimeout(function(){
 			resolve( res * 2 )
 		},1000)
 	})
	}).then(res=>{ console.log(res) }); // 1秒后输出 42
```

## 错误处理

-  **reject捕获**
`promise-catch`和`try-catch`一样，在**异步线程**中的错误如果不使用`reject`主动捕获，是不会被`catch`到的。   
```javascript
   function foo(){
     setTimeout(function(){
       throw "异步线程中的错误"
     })
   }
   
   try{
     foo() // 抛出全局错误
   }catch(err){
     // 永远不会达到这里
   }finally {
     console.log("先执行这里再抛出错误")
   }
```
```javascript
	p = new Promise((resolve, reject)=>{
		reject("error");
     
     setTimeout(()=>{
       reject("async error")
     })
	})
 
	p.then(
		function fulfilled(){}
     function rejected(err){console.log(err)} // error
	).catch(err=>{console.log(err)}); // then内调用了rejected()就不会执行到catch这里
```

-  **绝望的陷阱**
Promise并不能捕获到所有错误，
为了避免丢失被忽略和抛弃的Promise错误，一些开发者表示，Promise链的一个最佳实践就是最后总以一个catch(..)结束：  
```javascript
	var p = Promise.resove(42)
 
	p.then(
		function fulfilled(msg){
       // 数字没有string函数，所以会抛出错误
       console.log(msg.toLowerCase())
     },
     function rejected(){
       // 即使fulfilled函数内报错，
       // 也永远不会执行到这
     }
	).catch(err=>{
   // 只有这里才能捕捉到
 })
```

-  `**.done()**`**,**`**.defer()**` 

> 术语：**决议**(resolve)、**完成**(fulfill)、**拒绝**(reject)
Promise.resolve决议() /可能返回fulfill也可能返回reject


> Promise没有采用流行的error-first回调设计风格，而是使用了分离回调（split-callback）风格。
一个回调用于完成情况，一个回调用于拒绝情况


## Promise局限性

#### 顺序错误处理

由于一个Promise链仅仅是连接到一起的成员Promise，没有把整个链标识为一个个体的实体，
**这意味着没有外部方法可以用于观察可能发生的错误。**参考上面`绝望的陷阱`

#### 单决议

Promise只能被决议一次（完成或拒绝）
在许多异步情况下，你只会获取一个值一次，所以这可以工作良好。

但是还有很多异步的情况适合另一种模式——一种类似于事件和/或数据流的模式

- 比如按钮点击
这种写法只能响应一次，要想每次都响应需要每次都实例化一次promise
不像observer，只需要注册一次就可以派送无数次 
```javascript
var p = new Promise((resolve)=>{
  click("#mybtn", resolve)
})
p.then(res=>{
  return request("url")
})
```

#### 无法取消的Promise

可以详见下面的`Promise.race`，尽管返回了最先执行的，但是其他的promise仍然在执行

## Promise.all

> 窍门：首先要记住`Promise.all`和`Promise.race`都是返回一个promise
所谓并发调用promise，不过是循环promises,然后通过resolve/reject来结束并提供返回值


```javascript
Promise.all = function(promises){
  return new Promise((resolve, reject)=>{
    let arr = [];
    let dealProcess = function(res){
      arr.push(res);
      if(arr.length === promises.length){
        resolve(arr)
      }
    };
    
    promises.forEach(a=>a.then(dealProcess, reject))
  })
}
```

## Promise.race

```javascript
Promise.race = function(promises){
  return new Promise((resolve, reject)=>{
    promises.forEach(a=>a.then(resolve, reject))
  })
}
```

# 生成器Generator

> 风格偏好问题 `function* foo(){}`、`function *foo()`、`function*foo()`
个人更喜欢`*foo()`来引用生成器的时候就会比较一致


## 使用generator+promise实现async/await

> 完整版请参考co模块：[https://github.com/tj/co](https://github.com/tj/co)


```javascript
    const run = Async(function *(){
      const data1 = yield Promise.resolve(1);
      const data2 = yield Promise.resolve(2);
      
      return [data1,data2]
    })
    
    run().then(res=>{
      console.log(res); // [1,2]
    })
```

## Promise-yielding 生成器 runner()

-  核心代码 `gen.next(value)`  
```javascript
 function *foo(){
    const a = yield Promise.resolve("a")
    console.log(a); // 1
    const b = yield Promise.resolve("b")
    
    return [a,b]
 }
 
 const it = foo();
 it.next();
 it.next(1); //a 被赋值为 1
 it.next(2); //b 被赋值为 2
```

-  run实现(简化版)
**技巧**
1.递归技巧：IIFE
2.为什么返回Promise？因为递归返回的值是异步的  
```javascript
 function run(gen){
   var it = gen();
   return new Promise((resolve)=>{
     (function handleNext(next){
        if(next.done){
           resolve(next.value)
        }else {
          //始终保证 next.value 返回promise，用于后面的生成器委托
          Promise.resolve(next.value).then(res=>{ // yield 后面是一个Promise
            handleNext(it.next(res)) //向生成器传递值
          })
          
        }
     })(it.next())
   })
 }
```

-  run完整版
内含错误处理 

```javascript
function run(gen){
    var args = [].slice.call(arguments, 1),it;
    it = gen.apply(this,args);

    // 返回一个promise用于生成器完成
    return Promise.resolve()
        .then(
            function handleNext(value){
                // 对下一个yield出的值运行
                const next = it.next(value);

                return (function handleResult(next){
                    if(next.done){
                        return next.value
                    }else {
                        return Promise.resolve(next.value)
                            .then(
                                // 成功就恢复异步循环，把决议的值发回生成器
                                handleNext,
                                // 如果value是被拒绝的promise
                                // 酒吧错误传回生成器进行出错处理
                                function handleError(err){
                                    return Promise.resolve(
                                        it.throw(err)
                                    ).then( handleResult )
                                }
                            )
                    }
                })(next)

            }
        )
}
```

## 异步迭代生成器

-  `yield`只是暂停或阻塞了生成器本身的代码  
```javascript
 function ajax(){
    setTimeout(()=>{
       return it.next("res")
    },1000)
 }
 
 function *foo(){
    console.log(yield ajax()) // 1s后输出 “res”
 }
 
 var it = foo();
 it.next()
```

-  终止代码实例  
```javascript
 function *foo(){
   const a = yield ajax("a");
   const b = yield ajax("b");
   
   console.log(a,b)
 }
 
 var it = foo();
 it.next();
 
 var time = 900; // 小于1000ms的话 ajax("a")会被终止
 var time = 1100; // 大于1000ms的话 ajax("b")会被终止
 
 setTimeout(()=>{
   it.next()
 }, time)
```

## 错误处理

`it.throw()`主动抛出错误

```javascript
    function ajax(){
       setTimeout(()=>{
          // return it.next("err".toLowerCase()) // 代码错误和 主动throw一致
          return it.throw("err")
       },1000)
    }
    
    function *foo(){
       try{
          console.log(yield ajax())
       }catch(e){
          console.log(e); // next()方法被catch-err的话 这里就不会被触发
       }
       
       console.log(yield ajax()) // 上面的异常的话 就永远不会到这
    }
    
    var it = foo();
    try{
       it.next()
    }catch(e){
       console.log(e); // "err"
    }
```

## 生成器委托

- 生成器+runner实现

```javascript
    function *foo(){
      return yield Promise.resolve("a")
    }
    
    function *bar(){
      const a = *foo();
      const b = yield Promise.resolve("b");
      
      return [a,b]
    }
    
    run(bar).then(res=>{console.log(res)}); // ["a","b"]
```

- async/await实现

```javascript
    async function foo(){
       return await Promise.resolve(1)
    }
    
    async function bar(){
       const a = await func1();
       const b = await Promise.resolve(2);
       return [a,b]
    }
    
    console.log(bar()); // Promise{<pending>}
    bar().then(res=>{console.log(res)}); // [1,2]
```

# async/await

## 使用场景-返回值

```javascript
   async function func(){
     console.log(await getFetchOrAjax())
   }
   
   async function getFetchOrAjax(){
       return await 123;
       return new Promise((resolve)=>{resolve(456)})
       
       await 123; // undefined， 必须要有return才能有返回值
       new Promise() // undefined, 必须要有return才能有返回值
   }
```

## 要想延迟，必须延续性

```javascript
   async function func(){
     await a();
     await b(); // b若想做到a执行完成后再执行，a\b都必须是async/await或者Promise
   }
   
   function a(){ // 不行，会秒过
     return setTimeout(()=>{
       ...
     })
   }
   
   function a(){ // 支持返回Promise
     return new Promise(resolve=>{
       setTimeout(()=>{
         resolve("a")
       })
     })
   }
   
   async function a(){ // async/await必须延续性
     return await getFetchOrAjax()
   }
   
   async function a(){ // 即使getFetchOrAjax执行.then/.catch也🉑️
     return await getFetchOrAjax()
                     .then(res=>{})
                     .catch(err=>{})
   }
```

## 传染性
`async await`是有`**传染性**`的，当一个函数变为`async`后，这意味着调用它的函数也需要是`async`
在代码迭代角度上，会破坏原有代码的`**同步特性**`
```javascript
function getA(){
  const b = getB();

  return b
}

// 当getB变为异步时，getA也必须是异步的了
async function getA(){
  const b = await getB();

  return b;
}
```
可以使用`**代数效应**`（hooks）（是`函数式编程`中的一个概念，用于将`副作用`从`函数`调用中分离）
```javascript
function getA(){
  const b = xxx getB();

  return b;
}

try {
  getA() // 保持了getA的调用方式，将结果用try...handle（伪代码）的形式获取
}handle(result){
  console.log(result)
}
```
或者使用 `Generator`

## 最佳实践/心智负担

`await`之后的函数**默认**要跟一个`catch`，可以防止`Uncaught (in promise) xxxxxxx`错误

```javascript
   async function func(){
     await getFetch().catch(err=>{console.log(err)})
   }
```

`**心智负担**`：有时候会纠结到底加不加`.catch`

## async/await和promise微任务

```javascript
    // async/await
    async function f(){
      await p;
      console.log('ok')
    }
    
    // 转化结果
    function f(){
      return RESOLVE(p).then(()=>{
         console.log('ok')
      })
    }
```

#### 案例

-  async/await
await只影响下面的代码，上面的代码不影响  
```javascript
 async function f(){
   await p;
   console.log("ok")
 }
 
 async function g(){
   Promise.resolve().then(()=>{ console.log("1") })
   console.log("start")
   await p;
   Promise.resolve().then(()=>{ console.log("pro") })
   console.log("end")
 }
```

-  转译成promise语法  
```javascript
 function f(){
   Promise.resolve(p).then(res=>{
     console.log("ok")
   })
 }
 
 function g(){
   Promise.resolve().then(()=>{ console.log("1") })
   console.log("start");
   Promise.resolve(p).then(res=>{
     Promise.resolve().then(()=>{ console.log("pro") });
     console.log("end");
   });
 } // start 1 p() pro end
```

## await接受"thenables"

- thenable对象结构 
```javascript
  class Thenable {
    then(resolve, reject){
       ...
    }
  }
```

## 缺点

> `redux-saga`作者明确表示不会使用`saync/await`取代`generator`来重写


- `await`关键字只能结合Promise控制异步
- 无法在外界取消一个正在运行中的async函数

## async/await在Array.prototype.map()的使用场景

> 参考：[如何在 JS 循环中正确使用 async 与 await](https://segmentfault.com/a/1190000019357943)


```javascript
  var a = [1,2,3]
  var b = a.map(i=>{return i+1})
  var c = a.map(async i=>{return i + await Promise.resolve(1)})
  
  console.log(b) // [2,3,4]
  console.log(c) // [Promise, Promise, Promise]
  
  // 因为
  async function f(){
     return 1;
  }
  
  console.log(f()); // 不等于1，而是返回一个Promise
  
  // 解决方法
  Promise.all[c]
```

# thunkify

-  callback  
```javascript
 fs.readFile("./path/file", callback)
```

-  thunkify  
```javascript
 var read = thunkify(fs.readFile)
 
 read("./path/file")(callback)
```

# promisify

- promisify 
```javascript
  var read = promisify(fs.readFile)
  
  read("./path/file").then(...)
```

# 事件循环Event Loop

> 引擎执行任务时永远不会进行渲染（render）
每个宏任务之后，引擎会立即执行微任务队列中的所有任务，然后再执行其他的宏任务，或渲染，或进行其他任何操作。


-  **Event Loop**
**执行顺序：自上而下执行**->** ** -> **主线程** -> **微任务** -> **宏任务** -> **UI线程、web work

具体执行栈逻辑：
1. 遇到宏任务，将宏任务放到宏任务队列中
2. 遇到微任务，将微任务放到微任务队列中
3. 遇到主线程任务，则立即执行
4. 自上而下主线程全部执行完毕后，再执行微任务队列的EventLoop
5. 微任务队列执行完毕后，再执行宏任务队列的EventLoop
6. 🚩由于宏任务/微任务内可以包裹一个新的EventLoop环境，轮到它们执行时再重复上述动作

**
-  **宏任务**
(macro)task主要包含：宏任务队列内的代码、`setTimeout`、`setInterval`、
I/O、UI交互事件、`postMessage`、`MessageChannel`、`setTimmediate`(Node.js环境)、 
-  **微任务**
microtask主要包含：Promise的`then()`、`MutaionObserver`、`process.nextTick`(Node.js环境) 

> 部分浏览器（如天然不支持的IE使用polyfill）将`Promise`视为new task，会在宏任务结束之后才执行
`Promise.resolve` 和 `new Promise()` 是一类的


```javascript
    console.log("task start")
    setTimeout(()=>{
       // 宏任务1
       console.log(1)
    })
    setTimeout(()=>{
       // 宏任务2
       console.log(2)
    })
    
    Promise.resolve().then(res=>{
       // 微任务1
       console.log(3)
    })
    
    new Promise(resolve => {
       // 主线程1, ⚠️.then才是异步任务
       console.log(4)
       resolve()
    }).then(res=>{
       // 微任务2
       console.log(5)
    })
    console.log("task end")
```

输出结果：`"task start"`、`4`、`task end`、`3`、`5`、`1`、`2`
### async/await微任务
```javascript
new Promise((resolve) => {
    console.log('B')
    resolve()
}).then(() => {
    console.log('C')
}).then(() => {
    console.log('D')
})

async function async1 () {
    await new Promise(resolve=>{resolve()}) // 🌟不影响下面代码的执行顺序
    // 因为返回的是undefiend
    console.log('A')
}

// 输出结果 B A C D
```
```javascript
new Promise((resolve) => {
    console.log('B')
    resolve()
}).then(() => {
    console.log('C')
}).then(() => {
    console.log('D')
}).then(() => {
    console.log('E')
}).then(() => {
    console.log('F')
})

async function async1 () {
    await async2() // 🌟影响了后续代码的执行顺序
    // 因为返回了promise，等待2个then D E（后期会减少等待的时间）
    console.log('A')
}

async function async2 () {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

async function thenable(){
  await {
      then(cb){
        cb()
      }
    }
  // 返回了thenable，等待1个then D
  console.log('thenable')
}

async1();
thenable();

// 输出结果：B C D thenable E A F
```
🌟`async`函数在抛出返回值时，会根据返回值类型开启不同数目的微任务

- return结果值：非`thenable`、非`promise`（不等待）
- return结果值：`thenable`（等待 **1 个**`then`的时间）
- return结果值：`promise`（等待 **2 个**`then`的时间）
# 参考

- [1] 网课地址：[Rethinking Asynchronous JavaScript](https://frontendmasters.com/courses/rethinking-async-js/) `凯尔·辛普森`
- [2] [JavaScript异步模式历程（中文总结）](https://zhuanlan.zhihu.com/p/67815990) `zhihu.com`
- [3] [Callbacks, synchronous and asynchronous](https://blog.ometer.com/2011/07/24/callbacks-synchronous-and-asynchronous/) `HAVOC'S BLOG`
