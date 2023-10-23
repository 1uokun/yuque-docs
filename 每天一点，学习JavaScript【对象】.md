# 理解对象
**面向对象**的定义：无序属性的集合，其属性可以包含基本值、对象或者函数。每个对象都是基于一个引用类型创建的。

**属性类型**
ECMAScript中有两种属性：`数据属性`和`访问器属性`
为了表示特性是内部值，ECMA-262规范把属性放在了两对儿方括号中，如[[Enumerable]]

**数据属性**

| 描述符 | 描 述 | 默认值 |
| --- | --- | --- |
| [[Configurable]] | 表示能否通过`delete`
来删除属性从而重新定义属性、能否修改属性的特性、或者能否把属性修改为访问器属性 | true |
| ---------- | --------- | ---------- |
| [[Enumerable]] | 表示能否通过`for-in`
循环返回属性 | true |
| ---------- | --------- | ---------- |
| [[Writable]] | 表示能否修改属性的值 | 调用`defineP`
定义的属性默认为false，直接定义的为true |
| ---------- | --------- | ---------- |
| [[Value]] | 表示包含这个属性的数据值 | true |
| ---------- | --------- | ---------- |
| **proto** | 代表继承属性的特性，`这个没搞懂，在高程3内没有，MDN里有` | null |
| ---------- | --------- | ---------- |


**访问器属性**
访问器属性不包含数据值，它们包含一对儿`getter`和`setter`函数（非必须）
读取访问器属性时，会调用`getter`函数；写入访问器属性时，会调用`setter`属性并传入新值

| 描述符 | 描 述 | 默认值 |
| --- | --- | --- |
| [[Configurable]] | 表示能否通过`delete`
来删除属性从而重新定义属性、能否修改属性的特性、或者能否把属性修改为访问器属性 | true |
| ---------- | --------- | ---------- |
| [[Enumerable]] | 表示能否通过`for-in`
循环返回属性 | true |
| ---------- | --------- | ---------- |
| [[Get]] | 在读取属性时调用的`函数` | undefined |
| ---------- | --------- | ---------- |
| [[Set]] | 在写入属性时调用的`函数` | undefined |
| ---------- | --------- | ---------- |


**示例**
`Object.defineProperty()`
数据属性和访问器属性可以通过Object.defineProperty进行设置。要修改属性默认的特性，必须使用这个方法，常用于DOM对象

```javascript
    var person = {}
    Object.defineProperty(person, 'name', {
    	configurable : false,
        writable: true,	// 'name'在这里默认为false
        value : 'Niko'
    })
    
    console.log(person.name)	// Niko
    delete person.name
    console.log(person.name)	// Niko
    person.name = 'Bellic'
    console.log(person.name)	//Bellic
```

```javascript
	var book = {
        _year : 2014,
        edition : 1
    }
    Object.defineProperty(book, "year", {
        get : function(){
            return this._year    //读取访问器的_year属性
        },

        set : function(newValue){
            if(newValue > 2014){
                this.edition += newValue-this._year
                this._year = newValue
            }
        }
    })

    book.year = 2015
    console.log(book.edition)    // 2
```

`Object.defineProperties()`定义多个属性

```javascript
	var person = {name:"Leo"}
    Object.defineProperties(person,{
    	name:{
    		Writable:true
    	},
    	age{
    		set:function(newValue){console.log(newValue)}
    	}
	});
```

`Object.getOwnPropertyDescriptor()`返回指定指定属性的描述对象

```javascript
	//Object.getOwnPropertyDescriptor方法。以上面的person为例来使用
	var descriptor=Object.getOwnPropertyDescriptor(person,”name”);
	console.log(descriptor.Value);
	console.log(descriptor.Writable);
```

`Object.getOwnPropertyDescriptors()` es6引入，返回对象所有属性(非继承属性)的描述对象

主要是为了解决`Object.assign()`无法正确拷贝`get`属性和`set`属性²

### ES6拓展

#### **属性的遍历**

- `for..in`
循环遍历对象自身和继承的可枚举属性（不包含Symbol属性）
- `Object.keys`(obj)
返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不包含Symbol属性）的键名
- `OBject.getOwnPropertyNames`(obj)
返回一个数组，包含对象的所有属性（包括不可枚举属性）（不包含Symbol属性）的键名
- `Object.getOwnPropertySymbols`(obj)
返回一个数组，包含对象自身的所有Symbol属性的键名
- `Reflect.ownKeys`(obj)
返回一个数组，包括对象自身的所有键名（包括不可枚举属性和Symbol属性或字符串）

#### `**Object.assign()**`

`Object.assign(target, source1, source2)`
**对象的合并**，将源对象(source)可枚举的属性，复制到目标对象(target)并返回被修改的目标对象
注意点：

1. 浅拷贝
拷贝的是源对象的引用，源对象有任何变化，都会反应到目标对象上（只复制一次）
2. 同名属性的替换
目标对象和源对象的属性名相同时，源对象会替换掉目标对象的该属性
3. 数组的处理
Object.assign([1, 2, 3],[4, 5])	// 返回[4, 5, 3]	数组被视为对象{1:1, 2:2, 3:3},{1:4, 2:5}

使用技巧

1. 为对象添加属性

```javascript
	class Person{
  	constructor(x,y){
      	return Object.assign(this, {x, y})
      }
  }
```

2. 为对象添加方法 _Mixin模式_

```javascript
	Object.assign(Obj.prototype, {
  	sayName : function(){}
  })
```

3. 克隆对象

```javascript
	// 仅克隆对象的当前属性
	function clone(origin){
  	return Object({}, origin)
  }
  
  // 克隆对象的继承值
  function clone2(origin){
  	let originProto = Obeject.getPrototypeOf(origin)
      return Object.assign(Object.create(originProto), origin);
  }
```

4. 仅拷贝属性值，如何源对象的属性值是一个对象引用，那么它也只指向那个引用。

```javascript
  var obj = {
    a: { name: 'Niko' }, // 引用类型
    b: 123
  }
  
  var b = {}
  
  Object.assign(b, obj);
  
  obj.a = 456;
  obj.b = 789;
  console.log(b); // { a: { name: 123 }, b: 789 }
  
  obj.a.name = 456;
  console.log(b); // { a: { name: 456 }, b: 789 }
  
  // 即 b.a.name 指向 obj.a.name
  // b.a是新创建的一个对象
  
  // b.b 指向 obj.b
```

5. 继承属性和不可枚举属性是不能拷贝的

```javascript
  const obj = Object.create({foo: 1}, { // foo是个继承属性（详见Object.create）
    bar: {
      value: 2 // bar 是个不可枚举属性。
    },
    baz: {
      value: 3,
      enumerable:true // baz 是个自身可枚举属性。
    }
  });
  
  const copy = Object.assign({}, obj);
  console.log(copy); // { baz: 3 }
```

### **对原型对象的操作方法**

- `__proto__`
**用来读取或设置当前对象的prototype对象**。（ps:以下划线命令的一般都是只读私有属性，所以原型对象的操作最好用下面?的方法）
- `Object.setPrototypeOf(object, prototype)`
**设置一个对象的prototype对象**
var o = Object.setPrototypeOf(new Person('niko'),Person.prototype) 替代 __proto__ : Person.prototype
- `Object.getPrototypeOf(object)`
**读取一个对象的prototype对象**
Object.getPrototypeOf(object)	替代 object.__proto__
- `super`
`this`指向当前对象，`super`**指向当前对象的原型对象**

```javascript
  const Sup = {
  	name : 'Niko',
  }
  
  const Sub = {
  	name : 'Bellic',
      sayThisName : function(){
      	console.log(this.name)
      },
      saySupName : function(){
      	console.log(super.name)
      }
  }
  
  // 设置（或称之为继承）原型对象
  Object.setPrototype(Sub, Sup)
  
  Sub.sayThisName()		// Bellic
  Sub.saySupName()		// Niko
```

ps:改变原型的向上搜索算法;super不能使用箭头函数

### `Object.create()`

警告：由于现代JavaScript引擎优化属性访问所带来的特性的关系，改变对象的`[[Prototype]]`在各个浏览器和JavaScript引擎上都是一个很慢的操作。其在更改继承的性能上的影响是微妙而又广泛的，这不仅仅限于`obj.__proto__=...`语句上的时间花费，而且可能会延伸到任何代码，那些可以访问任何`[[Prototype]]`已被更改的对象的代码。如果你关心性能，你应该避免设置一个对象的`[[Prototype]]`。相反，你应该使用`Object.create()`来创建带有你想要的`[[Prototype]]`的新对象。
```javascript
  const Sup = {
  	name : 'Niko'
  }
  
  const Sub = Object.create(Sup,{
  	age:{
      	value:23
      }
  })
  
  console.log(Sub.__proto__ === Sup )	//true
  console.log(Sub)	// {age:23,__proto__:Sup}
```
不要用`Object.create()`创建对象，

### **proto** 原型污染

#### 背景：

[Lodash 严重安全漏洞背后 你不得不知道的 JavaScript 知识 ](https://segmentfault.com/a/1190000019831564)

```javascript
	//person 是一个简单的JavaScript对象
	let person = {name:"Niko"};
    
	person.__proto__.name = "Bellic"
    
    console.log(person.name);	//Niko
    
    let person2 = {};
    //person2的原型被污染了
    console.log(person2.name);	//Bellic
    
    //扩大原型污染
    person.toString = ()=>{alert("evil")}

    person2.toString();	//alert evil 原型方法也被污染了
```

同时`Object.prototype.toString`这个方法在隐式调用时也会被污染。

#### 如何防范原型污染

- 禁止解析字符串形式的`constructor`以及`_proto_`敏感属性，如`V8,chromium`的`JSON.parse()`就忽略掉key值为`proto`。
- 冻结`Object.prototype`，使原型不能扩展属性，可以采用`Object.freeze(Object.prototye)`达到目的：
- 使用`Object.create(null)`创建清洁对象
- 采用新的`Map`数据类型，代替`Object`类型

### 其他

- `Object.keys()`
- `Object.values()`
- `Object.entries()`
- `Object.freeze()`**完全冻结**指定对象，使该对象不能被修改
- `Object.isFrozen()` 判断是否被**完全冻结**
- `Object.seal()` **封闭**指定对象，阻止添加**新属性**并将所有现有属性标记为不可配置(`Configurable=false`)，只有`Writable=true`的才能被修改值
```
 const obj = { age: 25 }
 Object.seal(obj);
 obj.age = 26
 console.log(obj.age) // 26
 delete obj.age       // cannot delete when isSealed
 console.log(obj.age) // 26
```
 

- `Object.isSealed()` 判断是否被**封闭**
- `Object.preventExtensions()`让一个对象变的**不可拓展**
```
 const obj = {};
 Object.preventExtensions(obj);
 obj.name = "Niko"; // 添加无效，也就是永远不能再添加新的属性
 Object.defineProperty(obj, "age", {value}) // 报错：Uncaught TypeError: Cannot define property age, object is not extensible
 // 需要try...catch
```
 

- `Object.isExtensible()` 判断是否**可拓展**

## delete

#### 语法

> delete expression


expression的计算结果应该是某个属性的引用，例如：

> delete object.property
delete object['property']


#### 参数

`object`
对象的名称，或计算结果为对象的表达式。

`property`
要删除的属性

#### 返回值

对于**所有情况**都是`true`，除非属性是一个**_自身的_** **_不可配置_**的属性，在这种情况下，非严格模式返回`false`

- **_自身的_**
**proto**原型链继承的属性不可被删除
- **_不可配置_**
[[Configurable]] 为false时不可被删除

```
var a = {age:1}
var b = Object.create(a)

console.log(delete b.age); // true
console.log(b.age); // 1
```

#### 异常

在**严格模式**下，如果是属性是一个自己不可配置的属性，会跑出`TypeError`

```
Object.defineProperty(b, "age", {
  value:2,
  configurable:false
})

delete b.age // Typerror: Cannot delete property 'age' of #<Object/>
```

# 创建对象

## 纯净模式

> var obj = Object.create(null)


和`{}`相比，用`Object.create(null)`创建的对象更加简介且可高度定制化
[详解Object.create(null)](https://www.imooc.com/article/26080)

#### Object.create()

- 先看案例：

```
var a = { name: 'Niko' };
var b = Object.create(a);

delete b.name;

console.log(b.name); // Niko
```

分析：

- Object.create
传入一个对象，返回一个对象，对象的**proto**指向传入的对象
- [[Configurable]]
且Configurable值为false
- delete
`delete`操作符与直接释放内存**无关**。内存管理 通过断开引用来间接完成的，

## 工厂模式

工厂模式抽象了创建具体对象的过程，用`函数`封装特定接口`创建对象`的细节（**函数内部创建对象并返回这个对象**）。缺点是无法识别对象的类型。

```javascript
	function createPerson(name, age, job){
    	var o = new Object()
        o.name = name;
        o.age = age;
        o.job = job
        o.sayNmae = function(){
        	console.log(this.name)
        }
        return o
    }
    
    // 无限次调用createPerson创建多个相似对象
    var person1 = createPerson("Niko", 23, "calaxi")
    var person2 = createPerson("Bellic", 18, "student")
```

## 构造函数模式

构造函数与工厂模式相比，

- 没有显式地创建对象
- 直接将属性和方法赋给了`this`对象
- 没有`return`语句

### new做了什么

**_要创建构造函数的新实例，必须使用_**`**_new_**`**_操作符。_**`**_new_**`**_的过程会经历以下4个步骤：_**

1.  创建一个新对象
`_var person1 = new Object();_` 
2.  **将构造函数的作用域赋给新对象（因此**`**this**`**就指向了这个新对象）** ，同时执行构造函数中的代码
`_Person.apply(person1, arguments)_` 
3.  为这个新对象添加属性和原型
`_Object.setPrototype(person1, Person.prototype)_` 
4.  返回新对象 

```javascript
	function Person(name, age, job){
    	this.name = name
        this.age = age
        this.job = job
        this.sayName = function(){
        	console.log(this.name)
        }
    }
    
    var person1 = new Person('Niko', 23, "calaxi")
    var person2 = new Person("Bellic", 18, "student")
```

#### `**constructor**`

前面例子的最后，person1和person2分别保存着Person的一个不同的实例。这两个对象都有一个`constructor`（构造函数）属性，该属性指向Person。
对象的`constructor`属性最初是用来标识对象类型的，检测对象类型时使用`instanceof`更加可靠

```javascript
	person1.constructor === Person //true
    person2.constructor === Person //true
    person1 instanceof Object //true
    person1 instanceof Person //true
```

#### **将构造函数当作函数**

任何函数，只要通过`new`操作符来调用，那它就可以作为构造函数；反之，如果不通过`new`操作符来调用，那它就和普通函数没什么两样，但是值得注意的是函数内部有些`this`指向了`window`全局。

```javascript
	// 当作构造函数使用
    var person = new Person('Niko', 23, 'calaxi')
    person.sayNmae()	// Niko
    
    // 当作普通函数调用
    Person('Niko', 23, 'calaxi')	// Person内部的this.sayName属于window对象
    window.sayName()	// Niko
    
    // 在另一个对象的作用域中调用
    var o = new Object()
    Person.call(o, "Niko", 23, 'calaxi')
    o.sayName()	// Niko
```

#### **构造函数的问题**

实例化一次对象，如`this.satName = new Function(console.log(this.name))`时，不同实例化对象上的同名函数是不相等的，即`person1.sayName == person2.sayName //false`。
解决方案是

```javascript
	function Person(name, age, job){
    	// ...
        this.sayName = sayName
    }
    
    @window
    function sayName(){
    	console.log(this.name)
    }
```

虽然这样可以让person1和person2对象共享全局作用域中的sayName()函数，但是sayName只能被指定的函数调用，这让全局作用域名不副实，还会造成全局污染。`**所以在构造函数实例化对象上的同名函数不相等问题可以交给原型模式来解决**`。

# 原型编程

原型编程遵守以下4点基本规则
1.所有的数据都是对象
2.要得到一个对象，不是通过实例化类，而是通过找到一个对象作为原型并克隆它。
3.对象会记住它的原型
4.如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

##利用原型模式模拟new运算的过程

```javascript
function Person(name){
	this.name = name;
}
Person.prototype.getName = function(){
	return this.naame
}

//模拟new
var objectFactory = function(){
	var obj = new object(),	//从Object.prototype 上克隆一个空的对象
      Constructor = [].shift.call(arguments); // 取得外部传入的构造器， 删除并返回第一个参函数，此例是Person 
      
   obj._proto_ = Constructor.apply( obj, arguments ); //指向正确的原型
   var ret = Constructor.apply( obj, arguments );	//借用外部传入的构造器给obj设置属性
   
   return typeof ret === 'object' ? ret : obj;	//确保构造器总是会返回一个对象
}

var a = objectFactory(Person, 'Niko') //same as var a = new Person('Niko');
console.log(a.name) //Niko
console.log(a.getName()) //Niko
console.log(Object.getPrototypeOf( a ) === Person.prototype)  // true
```

## 原型模式

我们创建的每个函数都有一个`prototype`（原型）属性，这个属性是一个`指针`，指向一个对象，而这个对象的用途是包含可以有特定类型的`所有实例`共享的属性和方法。换句话说，不必在构造函数中定义对象实例的信息，而是将这些信息`直接`添加到原型对象中。

```javascript
	function Person(name, age, job){
    	this.name = name
        Person.protoype.sayName = function(){
        	console.log(this.name)
        }
    }
    
    var person1 = new Person('Niko', 23, 'calaxi')
    var person2 = new Person('Bellic', 18, 'student')
    
    person1.sayName() == person2.sayName() 	//true
    person1.sayName == person2.sayName 	//true
```

> 上面的代码做了什么


- ####**原型最初只包含**`**constructor**`**属性**

```javascript
	function Person(){}
  Person.prototype.constructor == Person  //true
  console.log(Person.prototype)
```

![](/img/bVbeQiR#id=z75aS&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 

- ####**添加原型方法**
⚠️如果在函数内部进行 添加原型方法的操作，**不实例化**是看不到新增的prototype方法的

```javascript
	function Person(name){
       this.name = name
       Person.prototype.sayName = function(){
           console.log(this.name)
       }
   }
   console.log(Person.prototype)
```

要么在函数外部进行 添加原型方法的操作（这样不实例化依然能看到新增的prototype方法），要么`var person = new Person()`

![](/img/bVbeQiS#id=P9jhY&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 

- ####**实例化对象**
Person的每个实例——person1和person2都包含一个内部属性，该属性仅仅指向`Person.prototype`。换句话说，它们和构造函数没有直接关系，即都不包含属性和方法

```javascript
	function Person(name){
      this.name = name
      Person.prototype.sayName = function(){
          console.log(this.name)
      }
  }
  var person1 = new Person('Niko')
  console.log(person.constructor)		// 打印Person整个函数
  console.log(person.prototype)		// undefined
  console.log(person)		//见下图
```

![](/img/bVbeQi7#id=IoPxm&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### 

- ####**实例调用原型方法**
上述显示`person1`并没有`sayName()`方法，却能调用，这是通过查找对象属性过程来实现的。意味着先找Person对象(实例化之后person1等于一个Person对象)中有没有sayName方法，有就执行这个方法并且不再继续寻找，没有就继续向`查找对象属性`(浏览器中显示在`__proto__`)中寻找。每个实例都包含一个指向原型对象的`内部指针`

```javascript
	person1.sayName()	// Niko
```

![](/img/bVbeQjb#id=KJgaf&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

#### **对原型对象的操作方法**

- `hasOwnProperty()`
检测一个属性是存在于实例中(返回true)，还是存在于原型中(返回false)
person1.hasOwnProperty("name")	// true
person1.hasOwnProperty("sayName")	// false
- `in`操作符
通过对象能够访问给定属性时返回true,无论存在实例中还是原型中
console.log("name" in person1)	// true
console.log("sayName" in person1)	// true
console.log("favorite" in person1)// false
- `hasPrototypeProperty`
综上可以写一个判断指定属性是不是来自原型中，但不能判断是不是来自实例
function hasPrototypeProperty(obj, name){
return !obj.hasOwnProperty&&(name in obj)
}
- `Object.keys(obj)`
取得对象上所有可枚举的实例属性，返回数组

#### Person.prototype是一个对象

可以使用`对象字面量`形式创建，但是对象内的引用this.name时必须在构造函数中存在this.name，组合构造函数模式和原型模式。
**但是在构造函数中添加原型属性时不能使用字面量的写法，因为使用构造函数其实是把new出来的对象作用域绑定在构造函数上，而字面量的写法会重新生成一个新对象。**
一定要使用对象字面量创建可以使用`Object.assign()`

```javascript
	var Person = function(name){
    	this.name = name
        Person.prototype = {
    		sayName : function(){
        		console.log(this.name)
        	},
    	}
        
        //使用Object.assign替代
        Object.assign(Person.prototype, {
        	sayName1 : function(){}
            sayName2 : function(){}
        })
    }
    
    var person1 = new Person()
    person1.sayName()	// 报错
```

#### 原型对象的问题

由于原型中所有属性都被很多实例共享，实例也可以修改原型所有属性对应的值。但是当一个实例修改原型中指定的属性的值且该属性属于`引用类型`（如数组，对象），其他实例获得该属性值也会被篡改。

```javascript
	var Person = function(){}
    Person.prototype = {
    	job : ['calaxi', 'banzhuang']
    }
    var person1 = new Person()
    var person2 = new Person()
    
    person1.job.push('font-end')
    person1.job //['calaxi', 'banzhuang', 'font-end']
    person2.job //['calaxi', 'banzhuang', 'font-end']受影响了
```

#### 原型使用原则

原生原型不应该被扩展，除非它是为了与新的JavaScript特性兼容，如`Array.forEach`[链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

## 组合使用构造函数和原型模式

定义方法或者共享的属性可以放在原型上，不同实例会不同变动的放在构造属性中

```javascript
	function Person(name){
    	this.name = name
        this.job = ['calaxi', 'banzhuang']
    }
    Person.prototype.sayName = function(){
    	console.log(this.name)
    }
    
    var person1 = new Person('Niko')
    var person2 = new Person('Bellic')
    person1.job.push('student')
    console.log(person1.job)	// ['calaxi', 'banzhuang', 'student']
    console.log(person2.job)	// ['calaxi', 'banzhuang']
```

## 动态原型模式

如果不加判断，构造函数内已经添加了**sayName()**原型方法，函数外部又添加相同名字的原型方法是没有用的。换言之，修改原型方法函数需要使用到动态原型模式。
什么是`**原型的动态性**`：就是定义添加原型方法可以在函数内部定义，也可以在函数外部添加

> 不使用动态原型模式


```javascript
	function Person(name){
    	this.name = name
        Person.prototype.sayName = funtion(){
        	console.log(this.name)
        }
    }
    
    //此时我想修改sayName方法但又不动Person内部
    Person.prototype.sayName = function(){
    	console.log(111)
    }
    
    var person1 = mew Person('Niko')
    person1.sayName()	// Niko
    // 这里仍然是调用了构造函数内部的那个原型方法，外部添加的并没有顶掉它
```

> 使用动态原型模式


```javascript
	function Person(name){
    	this.name = name

        if(type this.sayName !== 'function'){
        	Person.prototype.sayName = function(){
            	console.log(this.name)
            }
        }
    }
    
    Person.prototype.sayName = function(){
        console.log(111)
    }
    
    var person1 = new Person('Niko')
    person1.sayName()	//111
```

## 寄生构造函数

这个模式和**工厂模式**类似，用`函数`封装创建对象的代码，然后返回新建的对象。（唯一不同点）使用`new`操作符并把使用的包装函数叫做构造函数。
我的理解：_对象寄生在构造函数内，并使用return将其调用出来_

```javascript
	function Person(name, job){
    	var o = new Object()
        o.name = name 
        o.job = job
        o.sayName = function(){
        	console.log(this.name)
        }
        return o
        // 构造函数如果不返回对象，默认也会返回一个新的对象，
        // 通过在构造函数的末尾添加一个return语句，可以重写调用构造函数时返回的值
    }
    
    //使用
    var person1 = new Person('Niko', 'calaxi')
```

## 稳妥构造函数模式

**所谓**`**稳妥**`**（durable），是指没有公共属性，而且其方法也不引用**`**this**`**对象**。和寄生构造函数模式类似，**需要**`**return**`**调出对象**使用稳妥构造函数模式创建的对象与构造函数之间也没有什么关系，即
**工程模式，寄生构造函数，稳妥构造函数**都不能识别对象的类型和由什么构造函数构造出来的(instanceof 不管用了)

```javascript
	function Person(name){
    	var o = new Object()
        o.name = name 
        o.sayName = functin(){
        	console.log(name)	// durable没有this也没有new
        }
        return o
    }
    
    var person1 = Person('Niko')
```

## class关键字

```javascript
	class Person {
    	constructor(name, job){
        	this.name = name
            this.job =job
        }
        
        sayName(){
        	console.log(this.name)
        }
    }
```

1.类方法是不可枚举的
2.类有默认值
constructor(){}
3.类总是use strict
4.类内部只有方法
如果想拿到属性值，可以使用getter/setter

```javascript
	class Person {
  	constructor(name, job){
      	this.name = name
          this.job = job
      }
      
      get name(){
      	return this._name
      }
      
      set name(value){
      	if(value.length < 4){
          	alert("Name is too short")
              return 
          }
          this._name = value
      }
  }
  
  var person1 = new Person('Niko')
  console.log(person1.name)	// Niko
```

或者在类外部使用prototype拓展

```javascript
	......
	Person.prototype.name = 'Bellic'
```

#### **static关键字**

类似Object.assign将**_静态_**方法添加给类，而不是通过‘prototype’。
在静态方法内`this`指向当前类

```javascript
	class Person {
    	static of(name){
        	console.log(this === Person)	// true
            //小技巧
            return new Person(name)		// 像函数式编程一样链式调用 Person.of('Niko').sayName()
        }
        
        // static也可以当作存储在类中的公用方法，避免全局变量
    }
```

#### **extends关键字**

1. extends 可以跟class类，也可以跟构造函数，但就是不能跟对象
2. 子类的方法可以覆盖父类的方法
3. 子类的静态方法可以覆盖父类的静态方法

```javascript
	class Niko extends Person {
    	// constructor(){}
    	
        introduce(){
        	console.log("I am" + this.name)	//子类继承了父类的constructor所以不需要在申明构造属性
        }
    }
```

#### **super关键字**

1. super指向父类this
2. super(...args)重写构造函数
使用extends之后要想添加构造属性，必须使用super(...args)

```
	class Niko extends Object {
  	constructor(props){
  		super(props)
      	this.name = name
  	}
  }
```

## 匿名类

类表达式可以是被命名的或**匿名**的。
继承匿名类时，`constructor`指向自己

```
let Anonymous = class {}
class SubClass extends Anonymous {}
```

除了继承匿名类，还可以通过修改`constructor`value来指向自己

```
class SubClass {}
Object.defineProperty(SubClass,"constructor",{
	value:SubClass
})
```

# 继承

## 原型链继承

#### Sub.prototype = new Sup()

实现继承的主要方法，**基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法**。
**原型和实例的关系**：每个构造函数都有一个原型对象(prototype)，原型对象都包含一个指向构造函数的指针(this)，而实例都包含一个指向原型对象的内部指针(**proto**)。下面是原型链中各个链条的关系

-  `sub`.**proto** = `Sub`.prototype 
-  `sub`.constructor = `Sup` 
-  `sub`.constructor != `Sub`
实际上，不是 SubType 的原型的 constructor 属性被重写了，而是 SubType 的原型指向了另一个对象——SuperType 的原型，而这个原型对象的 constructor 属性指向的是 SuperType 
-  Sup.prototype.constructor = Sup 
-  Sup.**proto** = Function.prototype 
-  Function.prototype.constructor = Function 
-  Function.**proto** = Function.prototype 
-  Function.prototype.**proto** = Object.prototype 
-  Object.prototype.constructor = Object 
-  Object.prototype.**proto** == null 
-  Object.**proto** = Function.prototype 

#### 原型链问题：引用类型的属性被所有实例共享

```javascript
	function Sup(){
    	this.job=['calaxi', 'student']
    }
    
    function Sub(){}
    //原型链继承
    Sub.prototype = new Sup()
	
    //实例?对象
    var sub1 = new Sub()
    sub1.job.push('farmer')
    console.log(sub1.job)	//['calaxi', 'student', 'farmer']
    var sub2 = new Sub()
    console.log(sub2.job)	//['calaxi', 'student', 'farmer']
```

#### 其他：在创建Sub的实例时，不能向Sup传参

## 借用构造函数 （经典继承）

#### function Sub( ) { Sup.call(this) }

相对于原型链而言，借用构造函数有一个很大的优势，即可以在`子类型`构造函数中向`超类型`构造函数传递参数。

```javascript
	funtion Sup(name){
    	this.name = name
    }
    
    function Sub(name){
    	/**
        * @param name 子类型参数
        **/
    	Sup.call(this, name)
    }
    
    var sub = new Sub('Niko')
    console.log(sub.name)	// Niko
    
    Sup.prototype.getName = function(){}	//getName对于Sub来说是不可见的
```

#### 借用构造函数的问题 - 函数无法复用

如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题--方法都在构造函数中定义，因此函数复用就无从谈起。而且，**在超类型的原型中定义的方法，对子类型而言也是不可见的**，结果所有类型只有使用构造函数模式。因此很少纯用借用构造函数模式。

## 组合继承 （伪经典继承）

将原型链和借用构造函数的技术组合到一块，发挥二者之长,弥补二者之短。

```javascript
	function Sup(name){
    	this.name = name
    }
    Sup.prototype.getName = function(){
    	console.log(this.name)
    }
    
    //借用构造函数（经典继承） - 继承属性
    function Sub(name){
    	Sup.call(this, name)			// 第二次调用
    }
    //原型链继承 - 继承方法
    Sup.prototype = new Sup()			// 第一次调用
```

**_缺点是无论在什么情况下，都会调用两次超类型构造函数。_**

## 原型式继承

#### Object.create( )

借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。
基本原理：对传入其中的对象执行了一次浅复制
`javascript 	function object(oj){ 	//先创建一个临时性的构造函数 function F(){} //将传入的对象作为这个构造函数的原型 F.prototype = oj //返回这个临时类型的一个新实例 return new F() }`
ECMAScript5通过新增`Object.create()`方法规范化了原型式继承。被继承的对象属性会覆盖原型对象上的同名属性，如果存在该属性，对其值的修改不会影响到原型对象。`Object.create()`相当于将原型对象的`__proto__`赋值给被继承的对象。

```javascript
	var Sup = {
    	job = ['calaxi','student']
    }
    
    var sub1 = Object.create(Sup)
    console.log(sub1)	//{__proto__:Sup}
    var sub2 = Object.create(Sup)
    sub1.job.push('framer')
    console.log(sub2) // ['calaxi','student','framer']
```

## 寄生式继承(工厂模式)

和工厂模式类似，在函数内部进行创建对象并继承指定原型对象操作并返回创建的这个对象。主要目的是**封装**继承这个过程并增强对象某些相同属性和方法以达到复用效果。

```javascript
	function createAnother(original){
    	var clone = Object.create(original)
        // 添加公用的方法或属性已到达复用createAnother函数
        clone.sayHi = function(){}
        // ...
        return clone
    }
    
    // 使用
    var sub1 = createAnother(Sup)
    var sub2 = createAnother(Sup)
```

## 寄生组合式继承`extends`

对于组合继承的调用两次超类型的缺点，寄生组合式继承在`Sub.prototype = new Sup()`上用`Object.create()`进行替换，减少了一次调用超类型的次数。

```javascript
    function Parents(name){
      this.name = name;
      this.state = {...}
    }
    Parents.prototype.getName = function(){}
    
    function Children(name){
      Parents.call(this, name)
    }
    Children.prototype = Object.create(Parents.prototype) // 核心Object.create
    Children.constructor = Children
```

## OLOO对象委托

`objects linked to other objects`链接到其他对象的对象和原型设计模式有什么不同?
相同点：都是将对象属性赋值在**proto**内
不同点[7](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)：

- 构造函数：将构造函数的属性和原型对象赋值给Sub的原型上，即直接操作原型
- OLOO ： 利用`Object.create()`进行**proto**赋值操作，避免了直接操作原型
- 但都没能解决引用类型会共享的问题[6](http://javascript.info/prototype-inheritance)

Constructor From

```javascript
	function Sup(){}
    Sup.prototype.y = 11
    
    function Sub(){}
    Sub.prototype = Object.create(Sup.prototype) // 操作原型对象并赋值，为非继承
    Sub.prototype.z = 22
    
    var sub = new Sub()
    sub.y + sub.z  // 33
```

OLOO From

```javascript
	const Sup = { y:11 }
    const Sub = Object.create(Sup)
    Sub.z = 22
    
    const sub = Object.create(Sub)
    sub.y+sub.z // 33
```

## 结论

####一句话概括
/**
工厂模式
函数内部创建对象并返回这个对象，
缺点：无法判断对象类型

```
 构造函数模式
 没有显式创建对象，将对象属性和方法赋予this，没有return，
 缺点：不同实例化对象上的同名函数不相等（即内存浪费）

 原型模式
 每一个函数都有一个prototype对象，起初这个对象只包含constructor且指向本身
 函数添加原型方法后，需要实例化才能使用，每一个实例都包含一个内部属性__proto__，该属性仅仅指向构造函数的prototype
 缺点：原型对象上的引用类型会被共享（因为原型方法是共享的）

 组合使用构造函数与原型模式
 属性放在构造函数中，方法放在原型上 如es6的class

 实例对象属性搜索算法：
 先实例对象构造函数内部搜索，再构造属性搜索，再原型对象搜索
**/

/**
 原型链继承
 Sub.prototype = new Sup()
 Sub.__proto__ = Sup
 缺点：原型链都有一个毛病，就是引用类型被共享,实例对象不能传参，只有在继承这一动作时才能

 经典继承class extends
 只能继承Sup的属性
 缺点：超类原型对象对于子类不可见

 组合继承
 经典继承 - 继承属性，原型链继承 - 继承方法
 缺点：实例化2次超类

 原型式继承
 ES6 sub.__proto__ = new Sup(param)
 ES5 Object.create()
 解决类组合继承实例超类2次
 缺点：添加额外共同方法或属性时，需要每一个实例对象都要写一遍

 寄生式继承（工厂模式）
 增强对象某些相同属性或方法
 类似工厂模式将原型式继承封装在一个函数内以重复使用

 寄生组合式继承
 解决了组合继承实例超类2次的缺点
 优点还有：继承超类的原型对象，又保证子类的constructor指向自己，确保实例对象的类型（政治）正确
 **/
```

####结论：多用组合，少用继承

# get/set

## 创建内部可控私有变量

实现类似java的provate变量

- 第一种
缺点：一旦`this._tempVar`被赋值时，外部就可以直接访问到&#95tempVar

```javascript
class SubClass {
	constructor(){
   	this._tempVar;
   }
   
   get tempVar(){
   	return this._tempVar;
   }
}
```

- 第二种
缺点：需要在类外部创建一个临时变量

```javascript
var _tempVar;
class SubClass {
	get tempVar(){
   	return tempVar;
   }
}
```

被继承的类也会被添加一个私有变量
![](/img/bVbBPSe#id=vLZbz&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```javascript
var _tempVar;
class SupClass {}
class SubClass extends SupClass{
	get tempVar(){
   	return tempVar;
   }
}

console.log(new SubClass())
```

#### getter和setter连用以创建一个伪属性。

#### 不可能在具有真实的属性上同时拥有一个setter器

```
 var obj = {
   set name(value){
     this._name = value
   }
   
   get name(){
     return this._name
   }
 }
```

# 其他

1. 打印出来的key是淡灰的，表示不可遍历`enumerable:false`
```
 var obj = {};
 Object.defineProperty(obj, "name", {
   enumerable:false,	// 默认为false
 })
```
 

2. 基本类型中打印出来的是黑色，表示`String`“字符串”
3. 基本类型中打印出来的是蓝色，表示`Number`“数字”

# 参考

- [1](http://es6.ruanyifeng.com/#docs/object) JavaScript高级程序设计（第3版）[M]
- [2](/img/bVbeQiR) [阮一峰. 对象的拓展[J]. ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/object)
- [3](/img/bVbeQiS) [Prototypal inheritance. 原型继承[J/OL]](http://javascript.info/prototype-inheritance)
- [4](/img/bVbeQi7) [Object.create() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [5](/img/bVbeQjb) [Chrome V8引擎所有API列表](https://v8.paulfryzel.com/docs/master/classv8_1_1_object.html#a684cd61c13957c5b90c0ea0a50749dd1)
- [6](http://javascript.info/prototype-inheritance) [如何正确看待OLOO？](https://www.zhihu.com/question/42199509/answer/94176744)
- [7](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) [探索OLOO（链接到其他对象的对象）模式（与相同代码的原型样式进行比较）](https://gist.github.com/getify/5572383)
