# 加减乘除精度丢失
**小数**

解决方案：第三方库
Decimal.js
bignumber.js
big.js
mathjs
currency.js （专门处理金额显示）

```jsx
//加法
0.1 + 0.2 = 0.30000000000000004
0.7 + 0.1 = 0.7999999999999999

//减法
1.5 - 1.2 = 0.30000000000000004
0.3 - 0.2 = 0.09999999999999998

//乘法
1.1 * 100 = 110.00000000000001
0.8 * 3 = 2.4000000000000004

//除法
0.3 / 0.1 = 2.9999999999999996
0.69 / 10 = 0.06899999999999999
```
**大数显示 `Intl.NumberFormat().format()`**

```javascript
var number = 2.9364136545300044e+24;
var n = new Intl.NumberFormat().format(number); 
// 2,936,413,654,530,004,400,000,000
```

**大数相加**

```javascript
// BigInt
const z = BigInt(x) + BigInt(y);
console.log(z.toString());

// 字符串相加
let a = "90007777777";
let b = "123456789999999"

function add(){
  let maxLen = Math.max(a.length, b.length);
  
  // 第一步：用0补齐
  a = a.padStart(maxLen, 0); // "00090007777777"
  b = b.padStart(maxLen, 0);
  
  // 第二步：倒叙遍历maxLen手动进位
  let t = 0;
  let f = 0; // '进位用'
  for(let i= maxLen-1;i>0;i--){
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    f = Math.floor(t / 10);
    sum = t % 10 + sum;
  }
  if(f===1){
    sum = "1"+sum
  }
}
```

# if-else

无论多少个`if`,`if else`，必须要有一个`else {`兜底

```javascript
if(){
    
}else if(){
    
}else if(){
 ...
    
}else { // 必须要有else兜底
    
}
```

# 箭头函数返回值简写

用`,`隔开业务代码与返回值

```javascript
()=> (  ...do sth..., result ) // 返回result
```

# 10进制转换
```javascript
// 10进制转换n进制
num.toString(n)

// n进制转换10进制
parseInt(num, n)
```
# new Date().toISOString()
对`toISOString()`结果切片可以获得多种常见`日期格式`
结果案例：`2023-05-10T02:44:53.788Z`
```javascript
// 将日期转换为 YYYY-MM-DD
date.toISOString().slice(0, 10)

// 将秒数转换为h hh:mm:ss
new Date(s * 1000).toISOString().substr(11, 8)
```
# x-is-array

`Array.isArray` polyfill

```javascript
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

moudle.exports = nativeIsArray || isArray

function isArray(obj) {
  return toString.call(obj) === "[object Array]"
}
```

# obj.a = obj.b = c

```javascript
var obj = {a:1, b:2}
obj.a = obj.b = c

var c = 3;

console.log(obj); // {a:3, b:3}

// 自动提升为全局变量
(function(){
  var x = y = 1;
})()
console.log(x) // undefined
console.log(y) // 1
```

# `new Object()` vs `Object`

1. **加不加new对于_Object构造函数_，它们都是一样的**
2. **返回值是一个对象，该对象的原型由传入的值的类型决定** 
```javascript
Object('') // String{''}
Object(false) //Boolean(false)
//特殊
Object(undefined) //{}
Object(null)      //{}
```

3. 仅限于**Object.构造函数** 
```javascript
new String('') // String{''}是个对象
String('')     // '' 强制转换为字符串
```

# 断言assert
```javascript
console.assert(assertion, msg)
```
assertion：一个布尔表达式，如果为false，将会输出msg `Assertion failed: asd`

# sleep()函数
利用阻塞实现java的sleep(休眠正在执行的线程)
```javascript
function sleep(delay){
  var start = new Date().getTime();
  while(new Date().getTime() < start + delay){}
}
```

# MDN🌟

**判断是不是函数**

```javascript
Object.prototype.toString.call(callback) != "[object Function]"
```

**创建指定长度的空数组**

```javascript
new Array(10) //(10)[empty × 10]
```

**try里面放return，finally还会执行吗？**

- **从finally语句块返回**

> 如果从`finally`块中返回一个值，那么这个值将会成为整个`try-catch-finally`的返回着，
无论是否有`return`语句在`try`和`catch`中。**这包括在**`**catch**`**块里抛出的异常。**


```javascript
function foo(){
  try{
    return 1;
  }catch(e){
    return 2;
  }finally{
    return 3;
  }
}

console.log(foo()); // 3
```

- **嵌套try块**
任何给定的异常只会被离它最近的封闭catch块捕获一次。
当然，在"inner"块抛出的任何新异常（因为catch块里的代码也可以抛出异常），将会被"outer"块所捕获。

🚩**用一句话描述try catch能捕获到哪些JS异常

**
**之前**：`syntaxError`是捕获不到的，因为 **语法异常** 在语法检查阶段就报错了
**之中**：能捕获到异常
**之后**：1.**异步错误**，如`setTimeout`内的错误无法捕获 2. **函数**callback内的`Throw`无法捕获到

```javascript
try{
  a(()=>{
     Return new Error(‘’) //这个可以
     Throw “asd” //这个不能被catch到
  })
}catch(()=>{

})
```

🚩**JSON.stringfly()**

```javascript
JSON.stringify(params, function(key, value){ 
  return value
}) 
```

🚩**Object.is()**

`Object.is()`的结果与 “`===`”运算符相同，
仅有的例外是： 它会认为 “`+0`”与“`-0`”不相等， 而且“`NaN`”等于“`NaN`”

🚩**Object.create()**

创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。（继承属性） 
```javascript
const obj = Object.create({foo:1},{ // foo 是个继承属性

  bar:{ // bar 是个不可枚举属性
    value: 1
  },
  baz:{ // baz是个自身可枚举属性
    value: 2,
    enumerable: true
  }

})

console.log(obj)

// chrome
▼Object
   baz: 2, // 亮紫
   bar: 1, // 暗紫
 ▼__proto__:
     foo: 1
```
```javascript
Object.create = function(proto, propertiesObject){
  function F(){}
  F.prototype = proto;

  // return new F();
  var obj = new F();

  if(propertiesObject !== undefined){
    Object.defineProperties(obj, propertiesObject)
  }

  return obj;
}
```


🚩**Object.assign()**

1.  let to = Object(target)
console.log(to == target , to === target); // true true
也可以理解为 `return target` 
2.  for…in
首先这里简化了varArgs，假设只传了一个对象进去
其次，for…in只能遍历到对象的_可枚举属性_，即继承属性和不可枚举属性是不能拷贝的 
3.  继承属性不能拷贝 
4.  直接获取指定属性值
所以不会拷贝访问器属性，而是拷贝结果值
const obj = {
get  name(){ return “Niko” }
} 

obj[“name”]
for(var I in obj){.console.log(i) } // name
```javascript
Object.assign = function(target, varArgs){

   let to = Object(target); //[1]

    for(var i in varArgs[0]){ // [2]

       if( varArgs[0].hasOwnProperty(i) ){ // [3]  

            to[i] = varArgs[0][i] // [4]
      
       }
  
    }
  
   return to
}
```


# 闭包
**个人理解：**
概念：一个函数内返回另外一个函数
两个作用：**保护**、**保存**
**保护**：函数执行会形成一个私有作用域，不受外部干扰，
它很适合模块开发，我们在ES6 module 还是 CommonJS的地方都能看到闭包的影子

**保存**：当一个函数返回另一个引用数据类型的时候
被外界所接收了就会形成不销毁的作用域，它就会一直存在在堆内存里
但是很容易造成内存泄漏

**《Javascript高程3》内容：**

-  **1.变量的作用域**
当在函数内搜索一个变量时，如果函数内没有这个变量，那么此次搜索过程会随着代码执行环境创建的作用域链往外层逐层搜索 
-  **2.变量的生存周期**
全局变量的生命周期是**永久**的
对于函数内var声明的局部变量，当退出函数时，这些局部变量会随着函数调用结束而被摧毁 
-  **3.闭包结构**
局部变量所在的环境还能被外界访问，这个局部变量就有了不被销毁的理由 
-  **4.闭包与内存管理**
使用闭包的动机：主动将一些变量封装在闭包内，以便未来还需要使用到它们
把变量放在闭包中和放在全局作用域，对内存的影响是一致的，这里并不能说成内存泄露。
如果在将来需要回收这些变量，我们可以手动把这些变量设为null 

案例

-  **【案例1：闭包引起的内存泄漏】**
闭包可以维持函数内部局部变量，使其得不到释放
下面代码**由于是函数内定义函数，并且内部函数——事件回调的引用外爆，形成了闭包** 
解决1：将外爆的事件定义到外部，解除闭包 
解决2：手动释放内存  
```javascript
function bindEvent(){
  var obj = document.getElementById("XXX");
  obj.onclick = function(){
    ...
  }
}
```
```javascript
function onClickHandler(){}

function bindEvent(){
  ...
  obj.onclick = onClickHandler()
}
```
```javascript
function bindEvent(){
  ...
  obj.onclick = function(){}
  obj = undefined
}
```

-  **【案例2：使用闭包保存某一时间的值】** 
解决1⃣️：块级作用域 `var => let`
解决2⃣️：使用闭包存储(但是函数内创建函数是不明智的)  
```javascript
for(var i= 0; i< 5; i++){
  //setTimeout是宏任务，for循环是主线程，先主线程所以for循环结束了才是setTimeout执行
  setTimeout(function(){
    console.log(i); // 5,5,5,5,5
  })
}
```
```javascript

for(...){
  function a(item){ //最好将a()写在外面
    setTimeout(function(){
      console.log(item)
    })
  }
  a(i)
}
```

-  **【案例3:利用闭包实现单例模式】**  
```javascript
function once(fn){
  var isOnce = true;
  return function(){
    if(isOnce){
      isOnce = false;
      fn()
    }
  }
}

func = once(func)
func(); // work
isOnce = true; // 无法影响到once函数内部的isOnce
func(); // doest work
```

# Obejct[string]

**数组的定义**：一个存储元素的线性集合（collection），元素可以通过`索引`来任意存取，索引通常时数字，用来计算元素之间存储位置的偏移量。

JavaScript中的数组是一种特殊的对象，用来表示偏移量的索引是该对象的数组，即索引可以是整数也可以不是。然而，这些索引在内部被转换为`字符串类型`，因为javascript对象中的属性名必须是字符串。数组在JavaScript中只是一个特殊的对象，所以效率不如其他语言中的数组高

```javascript
var obj = {name:"asd"}
console.log(obj['name']) //asd

// 这种模式的优势
obj['rock and roll'] = 'hape'
obj['姓名'] = 'Niko'
```

变量作为key直接用到`{}`中

```javascript
var key = "name";
var obj = {
  [key]: "Niko"
}

console.log(obj); // {name:"Niko"}
```

# 基本类型

- `Undefined`
- `Null`
- `Boolean`
- `Number`
- `String`
- `Symbol`(es6新增，表示独一无二，默认为`Enumberable=false`不可被for-in遍历到)
- `BigInt`(es10新增，表示大于`2^53 - 1`的任意大的整数)

**特点**

- 基本类型的值是不可用变的
- 基本类型的比较是它们的值的比较
- 基本类型的变量是存放在栈内存（Stack）里的

**null和undefined的区别？**

-  `**null**`**定于一个空对象，是一个不存在的对象的占位符** 
   - 作为函数的参数，表示该参数不是对象
   - 作为对象原型链的终点
-  `**undefined**`**读取一个没有被赋值的变量** 
   - 调用函数时，表示提供方的参数没有提供，默认为undefined
   - 变量被声明了，但是没有赋值，默认为undefined
   - 对象没有赋值的属性，默认为undefined
   - 函数没有返回值时，默认为undefined
-  **区别：转换成**`**number**`**数据类型结果不同** 
   - `Number(null)` = 0
   - `Number(undefined)` = NaN

**内存变化？**
直接存储在栈（stack）中，**占据空间小**、**大小固定**，属于被频繁使用数据，所以放入栈中存储

# 引用类型

**引用类型**是一种数据结构，用于将数据和功能组织在一起。它也常被称为**类**。
除了基本类型外，剩下的都是引用类型，统称`Object类型`，细分的话包含在内的有

- `Object 类型`
- `Array 类型`
- `Date 类型`
- `RegExp 类型`
- `Function 类型`

**特点**

- 引用类型的值是可变的
- 引用类型的比较是引用的比较
- 引用类型的值是保存在堆内存（Heap）中的对象（Object）
与其他编程语言不同，JavaScript 不能直接操作对象的内存空间（堆内存）。

**内存变化？**
同时存储在栈（stack）和堆（heap）中，**占据空间大**、**大小不固定**。
引用数据类型**在栈中存储了指针**，该指针指向堆中该实体的起始地址。

当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

## 栈/堆

JavaScript的变量的存储方式 -- 栈（stack）和堆（heap）
**栈**： 自动分配内存空间，系统自动释放，离 main存放的是基本类型的值和引用类型的地址
**堆**： 动态分配的内存，大小不定，也不会自动释放。里面存放引用类型的值
自我理解：栈是增加一个变量就会分配一个内存空间，使用完之后自动回收；堆是增加的变量如果引用存在的引用类型的变量，就不会分配内存

## 值传递/址传递

基本类型和引用类型最大的区别实际就是传值和传址的区别
**值传递**：基本类型采用的值传递
**址传递**：引用类型则是地址传递，将存放在栈内存中的地址赋值给接收的对象

1. 案例1:利用引用传值改变原值 
```javascript
var obj = {}
var obj2 = obj;
obj2.name = "Niko";

console.log(obj); // {name:"Niko"}
```

2. 案例2:误区，新声明的址引用被自己引用时，会被精确到新引用的那一层 
```javascript
var obj = {value:1, next:{value:2,next:null}};
var obj2 = obj;

obj2 = obj2.next; // 此时obj2值引用了obj.next，则不能再影响到{value:1}这一层

obj2 = null;
console.log(obj); // {value:1,next:null} 相当于 {value:1, next:obj2}
```

## 浅拷贝/深拷贝

**浅拷贝**： **Underscore** —— `_.clone()`
```css
/* shallow-clone 就第一层*/
_.clone = function(obj){
  if(!.isObject(obj)) return obj;
  /* 遇到数组就调用slice */
  retrun _.isArray(obj) ? obj.slice() : _.extend({}, obj);
}

/* 遇到对象就_.extend() */
_.extend = function(target, source){
  // 遍历source对象的第一层属性复制给target
  return Object.assign(target, source);
}
```

**深拷贝**： 能够真正意义上的数组和对象的拷贝，（拷贝之后，任何一方修改，都不会反应给另一方）

1. 通过递归调用浅拷贝的方式（属性类型为对象时，进行遍历属性内的属性，最终都是进行基本类型的拷贝）

```javascript
	function deepCopy(obj){
  	// 定义一个对象，用来确定当前参数是数组还是对象
      var objArray = Array.isArray(obj) ? [] : {}
      // 如果obj存在，且类型为对象
      if(obj && typeof obj === 'object') {
      	for(key in obj) {
          	if(obj.hasOwnProperty(key)) {
              	//如果obj的子元素是对象，递归操作
                  if(obj[key] && typeof obj[key] === 'object') {
                  	objectArray[key] - deepCopy(obj[key])
                  } else {
                  	// 如果不是，直接赋值
                      objArray[key] = obj[key]
                  }
              }
          }
      }
      return objArray;
  }
```

2. 借用JSON全局对象
缺点是只能拷贝对象只有 Number, String, Boolean, Array, 扁平对象，即那些能够被 json 直接表示的数据结构，对象中存在**方法**是不能被拷贝过来勒

> 1.函数不能被很好地处理
2.值为undefined的key会被忽略


```javascript
	function jsonClone(obj) {
  	return JSON.parse(JSON.stringify(obj));
  }
```

3. 利用Object.defineProperty()赋值
缺点：仅IE9+支持

```javascript
	function es6DeepCopy(obj){
  	var names = Object.key(obj), 
          newObj = {}
      for(let key =0;key<names.length;key++){
      	Object.defineProperty(newObj, names[key], {
          	enumerable: false,
              configurable: true,
              writable: true,
              value : obj[names[key]]
          })
      }
      return newObj;
  }
```

4. postMessage/onmessage

```javascript
function deepClone(obj){
  return new Promise(function(resolve){
    var {port1, port2} = new MessageChannel();
    // onmessage
    port1.onmessage = function(e){
      resolve(e.data)
    };
    // postMessage
    post2.postMessage(obj)
  })
}

deepClone(obj).then(res=>{ console.log(res) })
```

5. **🚩最完整的深拷贝：lodash** —— `_.cloneDeep()`或 `_.clone(obj, true)`**1. 能够深复制**存在环的对象**
```javascript
function checktype(obj){
  return Object.prototype.toString.call(obj).slice(8,-1)
}
function cloneDeep(target, hash=new WeakMap()){
  let result = null;
  // 检查是否存在相同的对象
  if(hash.has(target)){
    return hash.get(target)
  }
  hash.set(target, result);

  for(let i in target){
    if(checktype(target[i])==="Object" || checktype(target[i]==="Array"){
      result[i] = cloneDeep(target[i], hash);
    }else {
      result[i] = target[i]
    }
  }
  return result;
}
```


2. 对**Date**，**RegExp**的深复制支持
```javascript
Date.prototype.clone = function(){
  return new Date(this.valueOf());
}

// /\w*$/ 强制匹配入参值
RegExp.prototype.clone = function(){
  return new this.constructor(this.source, /\w*$/.exec(this));
}
```


3. 对**ES6新引入的标准对象**的深复制支持

参考：[深入剖析 JavaScript 的深复制](http://jerryzou.com/posts/dive-into-deep-clone-in-javascript/)

## 浅对比/shallowequal
```javascript
function shallowequal(objA, objB, compare, compareContext){
  if(Object.is(objA, objB){
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if(keysA.length !== keysB.length){
    return false
  }

  for(var idx = 0; idx < keysA.length; idx++){
    var key = keysA[idx];
    
    if(!Object.prototype.hasOwnProperty.bind(objB, key)){
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && !Object.is(valueA, valueB))) {
      return false;
    }
  }

  return true;
}
```

# 类型判断

## typeof
可以准确判断基础类型，但无法判断出具体的引用类型
```javascript
/**
 * 支持检测以下数据类型
 * 1. number
 * 2. string
 * 3. object
 * 4. boolean
 * 5. function
 * 6. undefined
 * 7. symbol
**/
console.log(typeof null) //object
console.log(typeof undefined) //undefined
console.log(typeof isNaN) //function
// 对于引用类型，永远返回object
```

## instanceof
可以准确判断引用类型，但无法定位到原始数据类型
```javascript
function User(){/.../}
var u = new User
console.log(u instanceof User) //true
console.log(u instanceof Other) //false
console.log(u instanceof Function) // 无法判断原始数据类型无法
//判断一个值是由什么构造函数构造出来的
```

## constructor

```javascript
function User(){/.../}
var u = new User
var arr = []
console.log(u.constructor)	//User
console.log(arr.constructor)//Array
//javascript所有对象都继承Object，
//constructor是Object的一个属性，指向对象的函数的引用（指针）（或对象的构造函数）
```

## prototype
### Object.prototype.toString.call()
可以准确判断原始数据类型（通用）
```javascript
console.log(Object.prototype.toString.call(a) === '[object String]'
|| '[object Number]'
|| '[object Boolean]'
|| '[object Undefined]'
|| '[object Null]'
|| '[object Object]'
|| '[object Array]'
|| '[object Date]'
|| '[object Symbol]'
|| '[object Function]')
//胜在通用
```

# 操作符

ECMA-262描述了一组用于操作数据值的操作符，包括算数操作符（如加号和减号）、位操作符、关系操作符和相等操作符，ECMAScript操作符的与众不同之处在于，它们能够适用于很多值，例如字符串、数字值、布尔值，甚至对象。不过，在应用于对象时，相应的操作符通常都会调用对象的`valueOf()`和（或）`toString()`方法，以便取得可以操作的值。

## 规则

- 应用于`包含有效数字字符的字符串`时，先将其转换为数字值，再执行相应操作符的操作。
- 应用于`不包含数字的字符串`时，将变量的值设置为`NaN`，字符串变量变成数值变量。
- 应用于布尔值`false`时，先将其转换为`0`，再执行相应操作符的操组。
- 应用于布尔值`true`时，先将其转换为`1`，再执行相应操作符的操组。
- 应用于`对象`时，先调用对象的`valueOf()`方法以取得一个可供操作的值。然后对该值应用前述规则。如果结果是`NaN`或者没有`valueOf()`方法，则在调用`toString()`方法后再应用前述规则。对象变量变成数值变量。

**案例**

```javascript
	+"01"	//1
    
    var s1 = 1.1;
    --s1   //0.10000000000000009
    
    null == undefined	// true
    
    [] == ![]			// true
    /**
    1.右边![] 先进行Boolean转换 false，再进行Number转换 0
    2.变成 [] == 0 （即obj == number），左边对象调用valueOf()等于对象本身，继续toString() 得到 “”
    3.变成 “” == 0 （即string == number）""空字符串,进行Number转换 Number("")=0
    
    所以返回true
    **/
    
    ["x","y"] == "x,y"	// true
    
    "23" < "3"			// true
    "23" < 3			// false
    
    5 - ""				// 5 ""被转成了0
    5 - “2”				// 3
    5 - null			// 5 null被转成了0
```

## 零值相等

> **类似于同值相等，但`+0`和`-0`被视为相等：**
> `includes()` 使用的零值相等算法
>
> **严格相等：**
> `indexOf()` 使用的严格相等算法，但+0/-0又除外
> `Object.is()` 使用的严格相等算法，但NaN又除外
>
> 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness#%E9%9B%B6%E5%80%BC%E7%9B%B8%E7%AD%89

includes和indexOf区别

```javascript
NaN === NaN; 				 // false
+0 === -0;					 // true

// includes 完全零值相等
[NaN].includes(NaN); // true
[+0].includes(-0);   // true

// indexOf
[NaN].indexOf(NaN); // -1
[+0].indexOf(-0);		// 0

// Object.is
Object.is(NaN, NaN); // true
Object.is(+0, -0);   // false

// 所以超级严格相等
function is(x, y){
  return [x].indexOf(y) === 0 && Object.is(x, y)
}
```



## 双感叹号`!!`

```javascript
var a =''
  !!a 等价于 Boolean(a)
```

## 零合并操作符`??`

和`||`不同的是，只有实际值为`null`或者`undefined`时，才会返回后者

```bash
> "" ?? 123
""

> false ?? 123
false

> undefined ?? 123
123

> null ?? 123
123
```

也可以赋值`??=`

```javascript
let obj = { a: 10, b: null }
obj.a ??= 20;
obj.b ??= 20;
console.log(obj); // { a: 10, b: 20 }
```

## 逗号运算符`,`

逗号操作符对它的每个操作数求值（从左到右），并返回**最后**一个操作数的值

**连等**也颇有这种风味

```javascript
// 返回 expr3, 但逗号前面都会执行操作
return expr1, expr2, expr3...
```

```javascript
function reverse(arr){
  return [arr[0], arr[1]] = [arr[1], arr[0]+arr[1]],  arr[0]+arr[1]
}

const list = [1,2];
reverse(list) // 5,此时list为 [2, 3]
```

## 可选链操作符`?.`

可选链操作符`?.`允许读取位于连接对象链深处的属性的值，而不必验证链中的每个引用是否有效。

1.  不要过度使用可选链
只有在**不确定存不存在的地方使用**，否则会造成歧义 
2.  首部必须先声明
`user?.name` (user必须被声明过) 
3.  短路效应
`person?.getName()` 
4.  其他变体 `?.()` , `?.[]`
4.1 `person.getName?.()`
4.2 `user?.[“name”]` 
5.  还可以和`delete`一起使用
`delete user?.name` 
6.  仅限读取或删除，不能写入
`user?.name = “Niko” // Error` 
7.  只返回`null/undefined`
换言之，包括`false`、`“”`等都会返回`undefined`，`null`返回`null` 

## 私有方法/属性`#`

在一个类里面可以给属性前面增加`#`私有标记的方式来标记为**私有**，
除了属性可以被标记为私有外，`getter/setter`也可以标记为私有，方法也可以标为私有。

```javascript
class Person{
  getInfo(){
    return "name: "+this.#name +"; age: "+this.#getAge()
  }

  #age = 26; //私有属性
  #getAge(){ // 私有方法
    return this.#age
  }

  get #name(){ // 私有防蚊器
    return "Niko"
  }
}

const p = new Person();
console.log(p.age); // undefined
console.log(p.getInfo()); // "name: Niko; age: 26"


// 报错：Uncaught SyntaxError: Private field '#age' must be declared in an enclosing class
console.log(p.#age)
```

## `void`运算符

`void`运算符对给定的**表达式**进行求值，然后返回`undefined`

1.强制返回`undefined`

```javascript
let func = void function(){ return 123 };

console.log(func()) // TypeError: func is not a function
console.log(func)   // undefined

// void最好和上面的函数表达式一起使用
// 当使用函数声明时，命名的函数名称将不能被获取到
void function func2(){}

console.log(func2) // TypeError: func2 is not defined
```

2.在调用IIFE时，可以利用`void`运算符让JS引擎把一个`function`关键字识别成**函数表达式**而不是函数声明

```javascript
function a(){ console.log('foo') }() // 语法错误,因为js引擎把IIFE识别成了函数声明

void function a(){ console.log('foo') }() // 正常调用
```

## 其他

`null`为空对象，创建对象赋值前，最好用var obj = null
`valueOf()`引用类型返回本身

`num1+''`转为string
`~~double1`转为int(整数型)
`1*str1`转为float

# 运算符优先级

- `**“+”**`**优先级要比**条件运算符`condition ? val1 : val2`**的优先级高** 
```javascript
var str = "sth"
console.log("Value is" + (str === "sth") ? "Something" : "Nothing") //"Something"
// 而不是 "Value is Something"
```

- `**!**`**、**`**~**`**、**`**+**`**运算符是最高的** 
```javascript
  ~function(){
    ...
  }()

  +function(){
    ...
  }()

  !function(){
    ...
  }()

  //相当于立即执行函数
  (function(){})()
```

# 双精度浮点数格式

JavaScript和Java、Python一样采用的是双精度浮点数格式（IEEE 754），在该格式下，有些数字无法表达出来。

```javascript
var two = 0.2;
var one = 0.1;
var eight = 0.8;
var six = 0.6;
[two - one == one, eight - six == two] // [true, false]

console.log(two - one) // 0.20000000000000007

var four = 0.4
console.log(eight - four === four) // true
```

同时，大数占用过多位数时也会失去精度

```javascript
var a = 111111111111111110000;
var b = 1111;
console.log(a + b); // 111111111111111110000
console.log(a + b === a); // true
```

# this 黄金四法则

> 1.在`全局函数`中，this等于window


```javascript
var a = 3;
function foo(){
    var a = 4;
    console.log(a);           //4
    console.log(this.a);      //3
}
foo()
```

> 2.当通过call()或apply()改变函数执行环境的情况下，this指向其他对象


```javascript
var a = 3;
function foo(){
    console.log(this.a)
}
var obj = {a ：4}
foo.call(obj)                //4
```

> 3.当函数作为某个`对象的方法`调用时，this等于那个对象


```javascript
var a = 3;
var obj = {
    a : 4,
    foo : function(){
        console.log(a)       //3
        console.log(this.a)  //4
    }
}
obj.foo()
```

> 4.`匿名函数`的执行环境具有全局性，this指向window
非严格模式下才有效


```javascript
var a = 3;
(function(){
  var a = 4;
  console.log(a);        //4
  console.log(this.a)    //3
})()
```

背下这四句话，this问题引刃而解。

> 补充
5.箭头函数与this


- 全局函数

```javascript
//全局函数    this作用域不变
var a = 'Niko';
func = ()=>{
  console.log(this.a)    //Niko
}
//等同于
function func(){
  console.log(this.a)    //Niko
}
```

- 闭包函数

```javascript
var a ='Niko';
var obj = {
  a : 'Bellic',
  func : function(){
    return ()=>{console.log(this.a)}
  }()
}
obj.func()    //Bellic

//等同于
var obj = {
  a : 'Bellic',
  func : function(){
    var that = this;    //要先获得obj内的a，必须改变this指向
    return function(){
      console.log(that.a)
    }
  }()
}
obj.func()   //Bellic
```

[深入理解this机制系列第三篇——箭头函数](https://www.cnblogs.com/xiaohuochai/p/5737876.html)

# call

> `call()`方法在使用一个**指定this值**和**若干个指定的参数值**的前提下**调用**某个函数或方法


1.  参数`call(thisArg, arg1, arg2, ...)` 
2.  `**thisArg**`**参数值为null/undefined的时候，视为指向window**
其他类型时指向该类型的构造函数`Object(context)`，如`''`指向`String{''}` 
3.  **函数是可以有返回值的** 

**简单实现**

```javascript
Function.prototype.call1 = function(context){
  // 1.将函数设为对象的属性
  context.fn = this; //先不考虑context本身是否会存在fn属性
  // 2.执行该函数
  context.fn();
  // 3.删除该函数
  delete context.fn;
}
```

**完整实现**（多参数、this默认window、函数有返回值）

```javascript
Function.prototype.call2 = function(context){
  var context = Object(context)||window;
  context.fn = this;

  var args = [];
  for(var i=1,len = arguments.length;i<len;i++){
    args.push('arguments[' + i + ']');
  }

  var result = eval('context.fn(' + args +  ')')

  delete context.fn;
  return result;
}
```

**案例:获取除第一个的所有参数**

```javascript
[].concat(Array.prototype.slice.call(arguments,1))
```

# apply

- apply(thisArg, [arg1, arg2, ...])

**案例：获取数组中最大值**

```javascript
Math.max.apply(null,numberArrs)
```

# bind

> `bind()`方法会创建一个新函数。当这个新函数被调用时，`bind()`的第一个参数将作为它运行时的`this`
之后的一系列参数将会在传递的实参前传入作为它的参数


1.  **返回一个新函数** 
2.  **可以传入参数**`bind(thisArg, ...arg)`
如果`bind`传了其他参数，返回的**新函数**再传入参数将只是**对剩余参数的补充** 
3.  **如果使用**`**new**`**运算符 构造 _绑定函数_,则忽略传入的**`**thisArg**`
原被绑定函数内的`this`指向恢复原状 

**案例：**

```javascript
function func(name){
  this.name = name;
  return this;
}

var funcBind = func.bind({age: 26},'Niko');
var funcNew = new funcBind();

console.log(funcBind('Bellic')); // {age:26, name:'Niko'} ⚠️name不是Bellic
console.log(funcNew); //  {name:'Niko'} age不见了
```

**简单实现：**

```javascript
Function.prototype.bind1 = function(thisArg){
  var self = this;
  var args = [].concat(Array.prototype.slice.call(argument, 1)); //过滤第一个参数
  return function(){
    //bind返回的函数传入的参数
    var restArgs = [].concat(Array.prototype.slice.call(arguments)); //剩余参数的补充
    return self.apply(thisArg, args.concat(restArgs))
  }
}
```

**完整实现（包括第3特性）：**
new构造绑定函数时，原被绑定函数内的`this`指向恢复原状

```diff
Function.prototype.bind2 = function(context){
var self = this;
var args = [].concat(Array.prototype.slice.call(arguments, 1));

var fBound = function(){
var bindArgs = [].concat(Array.prototype.slice.call(arguments))
-    return self.apply(context, args.concat(bindArgs));
+    return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs))
}

-  fBound.prototype = this.prototype; // 如果修改绑定函数的prototype，返回的函数也会受影响
+  fBound.prototype = Object.create(this.prototype)

return fBound;
}
```

沿伸知识点1: `Object.create`

```javascript
Object.prototype.create = function(o){
  function f(){};
  f.prototype = o;
  return new f;
}
```

沿伸知识点2:`判断函数是否被new调用`

```javascript
function Person(name){
  this.name = name;

  if(this instanceof Person){
    // new调用
  }else {
    // 函数调用
  }
}
```

# 函数式编程

> Q: 为什么JavaScript的函数被称为一等公民？


在JavaScript中，函数不仅拥有一切传统函数的使用方式（声明和调用），而且可以做到像简单值一样：

- 赋值（var func = function(){}）
- 传参
- 返回

这样的函数也称之为第一级函数（First-class Function）。
不仅如此，JavaScript中的函数还充当了类的构造函数的作用，
同时又是一个Function类的实例（instance）。
这样的多重身份让JavaScript的函数变得非常重要。

## 纯函数

- 一个函数的返回结果只依赖与它的参数
- 并且在执行过程里面没有副作用（副作用：外部可观察的变化）

## 参数按值传递

-  **按值传递**  
```
var value = 1;
function foo(v){
  v = 2;
  console.log(v); //2
}
f(value);
console.log(value); //1
```

-  **按引用传递** 
**红宝书说了ECMAScript中所有函数的参数都是按值传递的**，
为什么能按“引用传递”成功呢？ 
```
var obj = {
  value: 1;
}

function foo(o){
  o.value = 2;
  console.log(o.value); //2
}
foo(obj);
console.log(obj.value); // 2
```

-  **按共享传递** 
分析：`o.value`通过引用一直找到原值，这时原值被引用了，所以原值被修改了。
但是直接修改o，就不会通过引用找这一步骤，所以不会。 
```
var obj = {
  value: 1
}
function foo(o){
  o = 2;
  console.log(o); // 2
}
foo(obj);
console.log(obj); //{value: 1}
```

⚠️**注意：按引用传递是传递对象的引用，而按共享传递是传递对象的引用的副本。**
🚩**总结：参数如果是基本类型是按值传递，如果是引用类型按共享传递。**

## 链式调用函数

```javascript
   //简单版 return
   const _a = (_b) => {
	 return (_c)=>{
       console.log(_b,_c)
     }
   }
   _a("bb")("cc")	//bb cc 柯里化
```

## 柯里化

> 在计算机科学中，柯里化（Currying）是把接收**多个参数的函数**变成接收**单一参数的函数**，并且返回接收余下的参数且返回结果的新函数的技术


**柯里化的作用**

1. **参数复用**
2. **提前返回**
3. **延迟执行**

使用方式

```javascript
var a = sum(1); // 提前返回，并 参数复用 了a

var b1 = a(2); // 延迟执行 (1)(2)
var b2 = a(3);
```

`**curry**`
🚩核心：1. **递归**；2. 最终返回一个函数
```
function curry(fn, arr = []) {
    return function(...args){ // curry(fn)(1)
        return (function(arg){ // curry(fn)(1)(2)

            if(arg.length === fn.length){
                return fn(...arg);
            }else {
                return curry(fn,arg)
            }

        })([
            ...arr,
            ...args
        ])
    }
}
```

**函数柯里化变形**：实现`sum(1)(2)(3)(4)...`**无限累加**
🚩核心：函数添加`toString`方法

```
   // 实现方式一:传入单个参数
   function add(a){
     function sum(b){
       a=b?a+b:a
       return sum // 核心：返回自身
     }
     sum.toString=function(){
       return a;
     }
     
     return sum
   }
   
   console.log(add(1)(2).toString())
```
🚩核心：参数作为数组**reduce**
```
   // 实现方式二:传入多个参数
   function add(...args1){ //...args将argument数组化
     let params = args1;
     function sum(...args2){
       params = [...params, ...args2]
     }
     
     sum.toString=function(){
       //返回值
       return params.reduce((count,cur)=>{
         return count+cur
       })
     }
     
     return sum;
   }
   
   console.log(add(1,2)(3,4)) //10
```

## 递归

### 斐波那契数列

> 自己调用自己，称为递归调用
`arguments.callee()`
argument为函数内部对象，包含传入函数的所有参数，arguments.callee代表函数名，多用于递归调用，防止函数执行与函数名紧紧耦合的现象，对于没有函数名的匿名函数也非常起作用
[斐波那契数列求和的js方案以及优化](https://segmentfault.com/a/1190000007115162)


```javascript
//斐波那契数列 
//一共10级楼梯，每次可以走一步或两步，求一共多少种走法。
//公式：f(n)=f(n-1)+f(n-2)

function f(n){
	if(n==1){
		return 1
	}else if(n==2){
		return 2
	}else {
		return f(n-1)+f(n-2)
	}
}
```

尾递归

```javascript
function fibonacci(n){
  function _fibonacci(n,n1,n2){
    if(n <=1){
      return n2
    }
    return _fibonacci(n-1,n2,n1+n2)
  }

  return _fibonacci(n,1,1)
}
```

在ES6中尾递归可以这样写，不过需要在`'use strict'`模式下

```javascript
function fibonacci(n, n1 = 1, n2 = 1){
  if(n<=1) return n2
  return fibonacci(n-1,n2,n1+n2)
}
```

ES6 解构赋值

```javascript
function fibonacci(n){
  let current = 0,
    next = 1
  for(let i=0; i<=n;i++){
    [current, next]	= [next, current+next]
  }
  return current
}
```

利用惰性单例缓存对象进行优化

```javascript
//惰性单例
let fibonacci = (function() {
  let memory = {}	//memory设定为对象
  return function(n) {
    if(memory[n] !== undefined) {
      return memory[n]
    }
    return memory[n] = (n === 0 || n === 1) ? n : fibonacci(n-1) + fibonacci(n-2)
  }
})()
```

### arguments.callee与严格模式

一个阶乘函数

```javascript
function factorial(num){
  if(num <= 1){
    return 1;
  }else {
    return num * factoial( num - 1 )
  }
}
```

这种递归函数的缺点是：
在递归过程中如果函数名的值被篡改，如：

```javascript
	var anotherFactorial = factorial; 
	factorial = null;
	alert(anotherFactorial(4)); //出错!
```

**解决方案：arguments.callee**

```javascript
function factorial(num){
  if(num <= 1){
    return num
  }else {
    return num * arguments.callee( num-1 )
  }
}
```

**严格模式：命名函数表达式**

```javascript
var factorial = (function f(num){
  if(num <= 1){
    return 1
  }else {
    return num * f(num-10)
  }
})
```

## 惰性函数

惰性函数就是解决每次都要进行判断的这个问题，解决原理很简单，重写函数。

#### 实例：兼容现代浏览器与IE的addEvent事件

一般写法

```javascript
function addEvent(type, el, fn) {
  if(window.addEventListener){
    el.addEventListener(type, fn, false)
  }
  else if(window.attachEvent){
    el.attachEvent('on'+type, fn)
  }
}
```

惰性函数写法

```javascript
function addEvent(type, el ,fn){
  if(window.addEventListener){
    addEvent = function(type, el ,fn){
      el.addEventListener(type, fn, false)
    }
  }
  else if(window.attachEvent){
    addEvent = function(type, el ,fn){
      el.attachEvent('on'+type, fn)
    }
  }
}
```

## 立即执行函数IIFE

```javascript
;(function(data){
  console.log(data)	//asd
})('asd')

;(function(global){
  console.log(global)	//window
  //构造函数
  function Set(){
    this._values = []
  }
  Set.prototype['log'] = function(){console.log(this._values)}
  global.Set = Set;
})(this)
//使用
var set = new Set()
set.log()	//[]
```

### 默认情况下：this指向Window

```javascript
var obj = {};

function func(){
  // 细节：这里要加分号
  console.log(this); // obj

  ;(function(){
    console.log(this); // Window
  })()
}

func.call(obj)
```

### 严格模式下：this为undefined

```javascript
(function(){
  "use strict";

  console.log(this); // undefined
})()
```

### 保存闭包的状态

就像当函数通过他们的名字被调用是，参数会被传递，
而当函数表达式被立即调用时，参数也会被传递。

**一个立即调用的函数表达式可以用来锁定值并且有效地保存此时的状态**，
因为任何定义在一个函数内的函数都可以使用外面函数传递进来的参数和变量（这种关系叫做闭包）

```javascript
for(var i= 0; i< 10; i++){
  setTimeout(()=>{
    console.log(i)
  })

  target.addEventListener('event',function(){
    console.log(i)
  })

  arr[i] = function(){
    reutrn i
  }
}
```

使用IIFE改进

```javascript
;(function(){
  setTimeout(()=>{
    console.log(i)
  })
})()

//同addEventListner
arr[i] = (function(j){
  return function(){
    return j
  }
})(i)
```

### 模块模式

模块模式方法最小化了全局变量的污染

```javascript
var module = (function(){
  var name = "Niko",
    age = 26;
  return {
    getName:function(){
      return name
    },
    increment: function(){
      return ++age
    }
  }
})();

//使用
module.getName(); //Niko
console.log(name); //undefined
console.log(module.name); //undefined
```

### 骚写法

```javascript
// 这也是IIFE
!function(){...}();
~function(){...}();
-function(){...}();
+function(){...}();
void function(){...}();

new function(){...} // 这样也是可以的,但严格来说不属于IIFE，this也指向Object
new function(arg){...}(val) // 这样才算IIFE，还可以传参数的值
```

## 节流&防抖
**节流：一种限制函数调用评率的技术（利用时间差）；**
不管事件触发有多频繁，都会保证在规定时间内一定只会执行一次。
常用于【搜索框】持续输入内容时每隔多少时间才会触发一次搜索
```javascript
function throttle(fn, wait=400){
  let last = 0; // 上一次执行时的时间

  return function(){
    const self = this;
    
    const current_time = +new Date();
    // 判断触发时 时间间隔是否大于wait
    if(current_time - last > wait){
      fn.apply(this, arguments);
      last = +new Date();
    }
  }
}
```
**防抖：一种延迟函数调用的技术（利用定时器延时）；**
延迟执行，你一直操作触发事件一直不执行，当你停止操作等待多少秒后才执行
常用语【按钮点击事件】，点击后过了多久才执行，防止重复点击。
```javascript
function debounce(fn, wait=400){
  let timer; // 定时器
  
  return function(){
    clearTimeout(timer); // 每次都清除定时器重新设置延迟

    const self = this;
    const args = arguments; // setTimeout是全局的，this和arg都要保存传递
    timer = setTimeout(function(){
      fn.apply(self, args);
    }, wait);
  }
}
```
# 玩具语言到底要不要加分号

参考楼上例子

```javascript
;(function(){})();


// 单函数文件需要立即执行的
// 常用于工具类、console调试
;(()=>{
  // ...
})();
```

# for循环

```javascript
for(let i = 0, a; a = A[i++]){
  console.log(a)
  //等同于for(let i=0;i<a.length;i++){console.log(a[i])}
  //等同于for(let i of a){console.log(i)}
}
```

`**i++**`与`**++i**`
```javascript
for(let i=0; i<3; i++){ // i最大为2 
}
for(let i=0; i<3; ++i){ // i最大为3
}

var i,j = 0;
console.log(i++,i); // 0 1
console.log(++j,j); // 1 1
```

**对于arr.length优化**

```javascript
for( let i= 0; len = arr.length; i< len; i++ ){
  ...
}
```


**倒叙循环**
且递减到0时自动退出循环， 因为 !!0 = false
```javascript
do{
  ... 
}while( Len-- )
```
# 在循环中使用async/await
> 参考：[https://segmentfault.com/a/1190000019357943](https://segmentfault.com/a/1190000019357943)


1. 想要连续使用`async/await`，请使用`for`循环
```javascript
const promise = (i) =>new Promise((res)=>setTimeout(()=>res(i),1000));

(async function(){
  for(let i=0;i<3;i++){
  	console.log(await promise(i)); // 每隔一秒执行一次
	}
})()
```

2. 不要在`forEach`、`filter`、`reduce`等数组方法内使用`async/await`
3. 可以使用`map`生成一个异步数组，再用`Promise.all`执行
```javascript
(async function(){
    console.log(await Promise.all(arr.map(item=>promise(item)))) // 一秒后返回全部
})()
```

4. `for await...of`循环异步可迭代生成器`Iterating Generator`
```javascript
(async function(){
	for (let iterator of arr.map(a=>promise(a))){
  	console.log(await iterator)
	}  
})()
// 简写
for await(let iterator of arr.map(a=>promise(a))){
  console.log(iterator)  // 一秒后返回全部
}


// Generator生成器迭代
function *generator(){
	let i = 0;
  while(i < 3){
    yield promise(i++)
  }
}

for await(let iterator of generator()){
  console.log(iterator)  // 每隔一秒执行一次
}
```

# ES6声明对象属性（方法）

-  声明对象属性（方法）  
```javascript
var obj = {
  mount(){
    ...
  },
  //等同于
  unmount:function(){
    ...
  }
}
```

-  解构赋值，声明变量  
```javascript
var obj = { name:"Niko", age: 25 }

// 声明变量
const {name: EnglishName, age} = obj;

console.log(EnglishName) // Niko
```

-  多key时如何命名变量  
```javascript
const {
  style,
  okText,
  dismissText,
  extra,
  ...restProps
} = this.props;

// restProps里面的key 等于 this.props在上面未声明的剩余的key
```

# Mixin 模式

`**Mixin**`**模式，就是对象继承的一种替代方案**，中文译为“混入”(min in)，意为在一个`对象之中混入另外一个对象的方法`
如维基百科中所定义的，mixin是一个包含其他类使用方法的类，而不必是其他类的父类。
换句话说，mixin提供了实现某种行为的方法，但我们不单独使用它，我们使用它来将行为添加到其他类。

```javascript
//例子
class Foo = {
  foo(){console.log('foo')}
}
class MyClass{}

object.assign(MyClass.prototype,Foo)
let obj = new MyClass()
obj.foo()	//foo
```

`@mixins(Foo)` 类的装饰器

```javascript
//通用脚本
export function mixins(...list){
  return function(target){
    object.assign(target.prototype, ...list)
  }
}
//使用 Decorator修饰器
import {mixins} from './mixins'

const Foo = {
  foo(){console.log('foo')}
}

// 🚩类的装饰器
@mixins(Foo)
class MyClass {}

let obj = new MyClass()
obj.foo()	//foo
```

**mixin - npm**
[类的装饰器：ES6 中优雅的 mixin 式继承](https://75.team/post/mixin-in-es6.html)

```javascript
var mixin = require('mixin')

function Foo(){
}

Foo.prototype = {
  t1: function(){ return 'skT1' }
}

Foo = mixin(Foo, EventEmitter)
```

this is the equivalent of:

```javascript
function Foo(){
  EventEmitter.call(this)
}

Foo.prototype = Object.create(EventEmitter.prototype)
```

# 逗号操作符

1.使用逗号操作符可以在一条语句中执行多个操作
2.逗号操作符多用于`声明多个变量`，还可以用于附值
3.用于附值时，逗号操作符总会返回表达式中的`最后一项`

```javascript
//摘自《高程3》 第3章 p.54
var num = (5, 1, 4, 8, 0)	//num的值为0
```

```javascript
//摘自https://segmentfault.com/a/1190000015809540
switch(a){
  case 1,2,3;		//case对比几？	答：3
    //...
}

var i,j,k;
for(i=0, j=0; i<10, j<6;i++, j++;){
  k = i + j
}
console.log(k)	//5+5=10

//i<6,j<10呢	9+9=18
```

# form

[取得所有表单元素的值和类型](http://www.w3school.com.cn/tiy/t.asp?f=hdom_form_elements)

# 数组

`**concat**`

`push`的不改变源数组的替代方法：`concat`。
concat(arr1,arr2) 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个**_副本_**。

# Function == Object???
Function可像Object那样添加额外属性
```javascript
function foo(){
  //...
}

// foo.getName 这里foo居然可以被视为对象？？
foo.getName = function(){
  console.log(1)
}
foo.prototype.getName = function(){
  console.log(2)
}

foo.getName()			//1
new foo().getName()		//2
```

变量提升

```javascript
var getName = function(){
  console.log(1)
}

function getName(){
  console.log(2)
}

getName()		// 1
```

变量替换

```javascript
var a = 1
a = 2
console.log(a)	//2

b = 1
var b = 2
console.log(b)	//2

function func(){
  consolel.log(c); // undefined
  var c = 3;
}
func()
```

# 如何确认一个对象是空的

`getOwnPropertyNames( obj ).length === 0`

**为什么不能用Object.keys( obj )？**

```javascript
Object.defineProperty(obj,’foo’,{
  enumerable : false,	//不可枚举的
  value : ‘bar’
})
```

**判断一个对象是否存在某个key时**

1.  用`“in”`关键字  
```javascript
if(key in object){
  return "exists"
}
```

2.  `hasOwnProperty` 

```javascript
obj.hasOwnProperty(key)
```

# new操作符都做了什么

new实例化对象

```javascript
function Person(name){
  this.name = name;
}

Person.prototype.getName = function(){
  return this.name
}

var person = new Person('Niko')
```

**《JavaScript高级程序设计（第3版）》p.145**

1. 创建一个对象
2. 将构造函数的作用域赋给新对象（因此this指向了这个新对象）
3. 执行构造函数内的代码（为这个新对象添加属性）
4. 返回这个新对象
5. 🚩如果构造函数内有返回值
5.1. return基本类型的值时，那么值会消失，
5.2. return引用类型的值时，那么new出来的实例就是return的值本身，实例的constructor指向值本身的constructor

`objectFactory` 摘自**《JavaScript设计模式与开发实践》p.19**

```javascript
var objectFactory = function(){
  //从Object.prototype上克隆一个空的对象
  var obj = new Object();

  //取得外部传入的构造器
  var Constructor = [].shift.call(arguments)

  //指向正确的原型
  obj.__proto__ = Constructor.prototype

  //借用外部传入的构造器给obj设置属性（this指向了这个对象）
  vat ret = Constructor.apply(obj, arguments);

  //确保构造器总是返回一个对象，详见5⬆️
  return ret instanceof Object ? ret : obj
}

//最后的ret是保证函数内return优先
function Person(name){
  this.name = name;

  return {age: 25}
}

new Person('Niko'); // { age: 25 }
```

# 事件委托

事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件

- 所有用到的按钮的事件（比如鼠标事件或键盘事件）都适合采用事件委托技术
- 使用事件委托可以节省内存
- 最佳实践案例 最差实践：不要为每一个li添加一个click监听事件 
```javascript
document.querySelector('ul').onclick=(event)=>{
  if(event.target...)
}
```
```javascript
ul.querySelectorAll('li').forEach((e)=>{
  e.onclick = function(){...}
})
```

# 数组去重

无非两类：

1.  两层循环法
`filter`+`findIndex` 
2.  **利用语法自身键不可重复性**
`hash Object`、`new Set` 
