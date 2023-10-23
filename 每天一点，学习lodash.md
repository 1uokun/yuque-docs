
> ###### 在线Lodash代码测试：[https://jsrun.net/X9gKp/edit](https://jsrun.net/X9gKp/edit)

# 语言

1. `_.castArray()`
如果value不是数组，则强制转换为数组
```javascript
_.castArray(null) // [null]

var arr = [1,2,3];
_.caseArray(arr) === arr // true
```

2. `_.clone()`
浅拷贝对象（对象内的key-value）
```javascript
var obj = {list:[1,2,3]};

var obj2 = _.clone(obj);
console.log(obj2 === obj); // false
console.log(obj2.list ==== obj.list); // true

var arr = [{name:"Niko", age:26}];
var arr2 = _.clone(arr);
console.log(arr[0] === arr2[0]); // true
```

3. `_.cloneDeep()`🌟
深拷贝(递归拷贝`_.clone()`)
`_.cloneDeepWith()`自定义拷贝用的函数
```javascript
var obj = {list:[1,2,3]};

var obj2 = _.cloneDeep(obj);
console.log(obj2.list ==== obj.list); // false

var arr = [{name:"Niko", age:26}];
var arr2 = _.cloneDeep(arr);
console.log(arr[0] === arr2[0]); // false
```
# 安全取值

4. `_.get()`
安全取值 `_.get(obj, 'a.b.c.d')`
缺点：	1.属性路径被写成字符串，不能借住编辑器自动补全与智能纠错
		2. 不能使用便捷的解构语法
替换方案：[**safe-touch**](https://juejin.cn/post/6844903697432969230 )
```javascript
var object = { 'a': [{ 'b': { 'c': 3 } }] };

_.get(object, 'a[0].b.c');
// => 3

_.get(object, ['a', '0', 'b', 'c']);
// => 3

_.get(object, 'a.b.c', 'default');
// => 'default' 如果解析值为undefined，第三个参数值会被返回

const $obj = safeTouch(obj);
$obj.a.b.c // => 3
```
# 节流
`_.debounce()`
```jsx
class extends React.Component {
  constructor(props){
    super(props);
    this.handleDebounceChange = debounce(this.handleChange, 500)
  }

  render(){
    return (
      <Input
        onChange={this.handleDebounceChange}
        placeholder="搜索订单"
      />
    )
  }
}


```
