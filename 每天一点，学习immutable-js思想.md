# 基础

## 什么是Mutable

可变是一种可以更改的变量。在JavaScript中，只有`对象`和`数组`是**可变的**，而不是基本类型（`字符串`和`数字`是**不可变的**）

## Immutability Helpers

> [https://reactjs.org/docs/update.html](https://reactjs.org/docs/update.html)


### react-addons-update

#### Usage

```javascript
 import update from 'react-addons-update'
 
 const arr = [1,2,3];
 const arr2 = update(arr,{$push: 4})
 
 console.log(arr, arr2); //[1,2,3], [1,2,3,4]
 
 const obj = {
   x:{
     y:{
       z:{}
     }
   }
 }
 const obj2 = update(obj, x2:{$set:'x2'})
 const obj3 = update(obj, {x:{y:{z:{$set:'z2'}}}})
 
 console.log(obj, obj2, obj3); 
 // {x:{y:{z:{}}}}
 // {x:{y:{z:{}}}, x2:'x2'}
 // {x:{y:{z:'z2'}}}
```

### Implementation

> shallowCopy 浅拷贝


```javascript
  function shallowCopy(x){
    if(Array.isArray(x)){
      return x.concat()
    }else if(x && typeof x === 'object'){
      return Object.assign(new x.construcotr(), x)
    }else {
      return x
    }
  }
```

# 史前

## Object.assign()

```javascript
var obj1 = { name: 'Niko', age: 24 };
var obj2 = {}
obj2.name = obj1.name;
obj2.age = obj1.age;

obj1 === obj2 // false
obj1.name ==== obj2.name // true
obj1.age === obj2.age // true
```

es6

```javascript
var obj1 = { name: 'Niko', age: 24 };
var obj2 = Object.assign({}, obj1);

obj1 === obj2 // false
```

## Object.freeze()

防止篡改


# 结构共享

# 参考

- [1] [https://segmentfault.com/a/1190000017294051](https://segmentfault.com/a/1190000017294051)
- [2] [深入探究Immutable.js的实现机制](https://juejin.im/post/5b9b30a35188255c6418e67c)
