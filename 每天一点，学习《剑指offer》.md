> 第2章 面试需要的基础知识

# 【数据结构】
## 面试题4：【替换空格】（字符串）
> 题目：请实现一个函数，把字符串中的每个空格替换成“%20”。
例如输入“We are happy.”,则输出"We%20are%20happy."。

JS模拟C++，则需要将str改为对象
```javascript
var static_str = {
  0: "W",
  1: "e",
  2: " ",
  3: "a",
  4: "r",
  5: "e",
  6: " ",
  7: "h",
  8: "a",
  9: "p",
  10: "p",
  11: "y",
};
```

**O(n^2)的解法**
```javascript
function replaceSpace(str){
  var str = {};
  var len = Object.keys(static_str).length;
  for(let i in static_str){
    str[i] = static_str[i];
    if(static_str[i]===" "){
      for(let o=i*1+1;o<len+2;o++){
        str[o] = static_str[o-2];
      }
      str[i*1] = "%";
      str[i*1+1] = "2";
      str[i*1+2] = "0";

      static_str = str;
      a();
      break;
    }
  }
}
```

**O(n)的解法**
?解析：遍历2遍，第一遍统计空格总数算出替换后的字符串长度
第二遍**从后往前遍历替换**，每个只移动一次（不像顺序遍历遇到空格需要重新计算长度）
```java
   /**
    * 后序遍历替换空格 O(n)
    *
    * "We are happy" to "We%20are%20happy"
    * **/
   public class ReplaceBlank {
    public static void main(String[] args) {
        char[] ch = "We are happy".toCharArray();

        int len = ch.length;
        int count = 0; // 获得空格总个数

        for(int i=0;i<len;i++){
            if(ch[i] == ' '){
                count+=2;
            }
        }

        char[] result = new char[len+count]; // 静态类型需要提前定好长度（内存）
        do {
            len--;

            if(ch[len] == ' '){
                count-=2;
                result[len+count] = '%';
                result[len+count+1] = '2';
                result[len+count+2] = '0';
            }else {
                result[len+count] = ch[len];
            }

        }while (len>0);

        System.out.println(result);

    }
   }
```

## 面试题5：【从尾到头打印链表】（链表）
> 输入一个链表的头结点，从尾到头反过来打印出每个结点的值

- 1.递归：利用调用栈的调用顺序（从最底先执行）。缺点：当链表非常长时，会导致函数调用的层级很深，可能导致调用栈溢出
- 2.栈和循环：循环链表将值存在栈中，全部存储完毕之后再从栈中打印
- 3.将链表的每一个结点的头和尾调换
**在面试中如果我们打算修改输入的数据，最好先问面试官是不是允许做修改**
```javascript
// 递归
function logList(list){
	// 定义子问题
	const child=(node)=>{
		// 🌟🌟这里自顶而下执行🌟🌟
		console.log(node.value)

		// 定义边界
		if(node.next){
			child(node.next)
		}

		// 🌟🌟这里自底而上执行🌟🌟
		// 因为要等上面child执行完才能到这里
		console.log(node.value)
	}

	child(list);
}
```

## 面试题6：【重建二叉树】（树）
> 输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。

分别利用前序获得根节点
在中序中以该节点为root可以获得左右节点
在之后的左右节点数组上重复上述动作
```javascript
var preOrderSequence = [1,2,4,7,3,5,6,8];   //前序遍历序列
var inOrderSequence = [4,7,2,1,5,3,8,6];    //中序遍历序列


function ReBuildBinaryTree(preOrderSequence, inOrderSequence){
  if(!preOrderSequence[0]){
    return null
  }

  function Node(key){
    this.key = key;
    this.left =null;
    this.right =null;
  }
  var root = new Node(preOrderSequence[0]);

  for(var i=0;i<inOrderSequence.length;i++){
    if(inOrderSequence[i]===root.key){
      root.left = ReBuildBinaryTree(preOrderSequence.slice(1,i+1),inOrderSequence.slice(0,i));
      root.right = ReBuildBinaryTree(preOrderSequence.slice(i+1,preOrderSequence.length),inOrderSequence.slice(i+1,preOrderSequence.length));
      break;
    }
  }

  return root;

}

console.log(ReBuildBinaryTree(preOrderSequence, inOrderSequence))
```

## 面试题7：【用两个栈实现队列】（栈和队列）
> 用两个栈实现一个队列。
队列的声明如下，请实现它的两个函数appendTail和deleteHead，分别完成在队列尾部插入结点和在队列头部删除结点的功能

**分析**
两个栈`stack1`和`stack2`，
**队列**内部实现：`stack1`插入一个元素，再删除一个元素，被删除的元素再被插入到`stack2`中，

- `deleteHead`: 如果`stack2`里有元素，则删除`stack2`的栈顶元素；
如果`stack2`没有元素，从`stack1`内将所有元素“后进先出”的顺序插入到`stack2`中，再删除`stack2`新的栈顶元素
- `appendTail`: 将元素插入到`stack1`，根据上述操作该元素自然就成了队列的尾部元素。

**本题考点**

- 考察应聘者能否通过具体的例子分析问题，**通过画图的手段把抽象的问题形象化**。
- **用两个队列实现栈**也同理
```javascript
function Queue(){
  var stack1 = new Stack();
  var stack2 = new Stack();

  this.appendTail = function(key){
    stack1.push(key)
  };

  this.deleteHead = function(){
    if(stack2.isEmpty()){
      while(!stack1.isEmpty()){
        stack2.push(stack1.pop())
      }
    }
    return stack2.pop()
  }
}

var queue = new Queue();
queue.appendTail(1)
queue.appendTail(2)
console.log(queue.deleteHead())	//1
console.log(queue.deleteHead())	//2
console.log(queue.deleteHead())	//undefined
```

## 面试题35：【第一个只出现一次的字符】（哈希表）
# 【二叉树】
## 面试题24：【二叉搜索树的后序遍历序列】
## 面试题27：【二叉搜索树与双向链表】

> 算法和数据操作

# 【查找和排序】
?**常用查找算法**

- 顺序查找 `O(n)`
- 二分查找 `O(logn)`
- 哈希表查找 `O(1)`
- 二叉排序树查找
- 二叉平衡树`O(log2n)`
- 二叉搜索树`O(n)`（退化成近似链）
> 二叉查找树的查找速度取决于树的深度，，相同节点树深度最小的是平衡二叉树

## 【快速排序】（Partition基础）
> 三个指针：左右指针和随机主元
当【左指针】比【主元】**大** 且 【右指针】比【主元】**小**，则交换左右指针
主元的选择：最左的对于已经排好的通常是最差的，一般为中间
【时间复杂度】：最快的情况是`O(n^2)`，平均是`O(nlogn)`


## 面试题8：【旋转数组的最小数字】
**核心(**`**left**`**、**`**mid**`**、**`**right**`**)**
> 题目：把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。
例如数组[3,4,5,1,2]为[1,2,3,4,5]的一个旋转，该数组的最小值为1

?解析：从头到尾遍历数组一次时间复杂度为**O(n)**，显然不能脱颖而出。
**在排序的数组中我们可以用**`**二分查找法**`**实现O(logn)的查找**。

-  基于递归 
```javascript
var arr = [12,0,1,2,3,4,5,6,7,8,9,10,11,]

BinarySearch(arr);

function BinarySearch(arr){
  let left=0, right=arr.length-1, mid=Math.ceil((left+right)/2);
  let result;
     
  function Partition(){
      if(arr[mid] < arr[right]){ // 说明最小值在左边
          right = mid;
      }else if(arr[mid] > arr[right]){ // 说明最小值在右边
          left = mid;
      }

      mid = Math.ceil((left+right)/2);

      if(Math.abs(left-mid)<1 || Math.abs(right-mid)<1){
          result = arr[mid]
      }else {
          Partition()
      }
  }
  Partition();

  return result;
 }
```
 

-  基于循环 
```javascript
function BinarySearch(arr){
     let len = arr.length;
     let left =0,right = len-1,mid = Math.ceil((right+left)/2);
     let result;

     do{
         if(arr[mid] < arr[right]){
             right = mid;
             len = right;
         }else if(arr[mid] > arr[right]){
             left = mid;
             len = right - left;
         }

         mid = Math.ceil((left+right)/2);

         if(Math.abs(left-mid)<1 || Math.abs(right-mid)<1){
             result = arr[mid];
             break;
         }else {
             len --;
         }

     }while (len);

     return result;
}
```
 
# 【递归和循环】

- **递归**
**本质**：【函数调用自身】【把一个问题分解成两个或者多个小问题】
**优点**：【简洁】
**缺点**：【函数调用是有时间和空间的消耗的】【容易调用栈溢出】
## 面试题9:【斐波那契数列】

- **递归**
但斐波那契数列并不适合用递归来实现，会做大量重复计算。
不过某些语言比如JavaScript做了**尾递归**优化
```javascript
function Fibonacci(n){
  if(n < 2){
    return n
  }else {
    return Fibonacci(n-1) + Fibonacci(n-2);
  }
}
```
 

- **循环**
时间复杂度O(n)
```javascript
function Fibonacci(n){
  if(n < 2){
    return n
  }else {
    let fibOne = 0,
      fibTwo = 1,
      fibN   = 0;

    for(let i= 2;i<=n;i++){
      fibN = fibOne + fibTwo;
      fibOne = fibTwo;
      fibTwo = fibN;
    }

    return fibN;
  }
}
```
 

- **数学公式**
时间复杂度O(1)
```javascript
 const fibs = n =>
 	Math.round(
 		(Math.sqrt(5) / 5) *
   		(Math.pow((1 + Math.sqrt(5)) / 2, n) -
     	Math.pow((1 - Math.sqrt(5)) / 2, n)),
 );
```
## 面试题11:【数值的整数次方】
> 题目：实现函数 `double Power(double base, int exponent)`,
求base的exponent次方。不得使用库函数，同时不需要考虑大数问题。

?陷阱：自以为题目简单的解法
```javascript
result *= base
```

- 需要考虑指数(exponent)是零和负数的情况
- 循环相乘不是高效的解法，可以考虑使用平方相乘减少循环次数
```javascript
function Power(base, exponent){
  function _pow(exponent){
    if(exponent === 0){
      return 1;
    }

    var result = _pow(exponent >> 1);

    result *= result;

    //判断奇偶，如果为奇数还需要在和自身相乘
    if(exponent & 0x1 === 1){
      result *= base;
    }

    return result
  }

  if(exponent>0){
    return _pow(exponent)
  }else {
    return 1/_pow(exponent*-1)
  }
}
```

## 面试题43:【n个骰子的点数】
> 题目：把n个骰子扔在地上，所有骰子朝上一面的点数之和为s。
输入n,打印出s的所有可能的值出现的概率。

?：其本质是**求数列**`f(n)=f(n-1)+f(n-2)+...+f(n-n)`

-  所有点数的排列数为**6^n** 
-  循环过程中统计每一个点数出现的次数和指定点数出现的次数 
-  指定点数出现的次数除以6^n 就能得到概率 
-  时间效率O(slogn) 
-  递归 
```javascript
function Probability(n,s){
  let len = 0;
  const g_maxValue = 6;
  let count = 0;
  function loop(current, sum){
    len++;
    if(current === 0){
      if(sum === s){
        count++;
      }
    }else if(sum<s){//如果前面几个加起来就比s大的话提起结束
      for(let i=1;i<g_maxValue+1;i++){
        loop(current-1, i+sum)
      }
    }
  }

  loop(n,0);

  return count/Math.pow(g_maxValue,n);
}
```
 

# 【位运算】
> 利用位运算可以略过【进制转换】直接操作十进制
达到 时间复杂度O(n),空间复杂度O(1)
可以学到【 & 】、【 ｜ 】、【 >> 】、【 << 】操作符

| 与( `&` ) | 和`&&`用法一样 | 0&0=0 | 1&0=0 | 0&1=0 | 1&1=1

 |
| --- | --- | --- | --- | --- | --- |
| 或( `&#124;` ) | 和 `&#124;&#124;` 用法一样 | 0 &#124; 0=0 | 1 &#124; 0=1 | 0 &#124; 1=1

 | 1 &#124; 1=1 |
| 异或( `^` ) | 相同的反0，不相同的反1 | 0^0=0 | 1^0=1 | 0^1=1

 | 1^1=0 |
| 左移( `<<` ) | 转成二进制向左位移n位 | 001010 << 2 = 101000 前面会自动补出2位 |  |  |  |
| 右移( `>>` ) | 向右位移n位并转换回原来的进制 | 9 >> 1 = 4 | 1001 >> 1 = 0100 |  |  |


## 面试题10:【二进制中1的个数】
> 题目：请实现一个函数，输入一个整数，输出该数二进制表示中1的个数。
例如把9表示成二进制是1001，有2位是1.因此如果输入9，该函数输出2。


-  **输入的是整数**
[@step1 ](/step1 ) 最右边的数字是不是1 【 &1 十进制会比较最后一位】 
[@step2 ](/step2 ) 右移1位，返回后重复step1 【>> 右移操作n位后会返回并自动转会十进制】  
```javascript
function NumberOf1(n){
  let result = 0;

  while(n > 0){
    //@step1
    if( n & 1 === 1 ){
      result += 1;
    }

    //@step2
    n = n >> 1;
  }

  return result;
}
```
 

-  **输入的是负数**
①**负数的右移**：需要保持数为负数，所以操作是对负数的**二进制位左边补1**。
如果一直右移。最终会变成-1，即`(-1)>>1 = -1`
②**负数的左移**：和正整数左移一样，在负数的二进制位右补0。
一个数在左移的过程中会有正有负的情况，所以切记负数左移不会特殊处理符号位
如果一直左移，最终会变成0
例如： `-20 << 2 = -80` 
```bash
   -20 的二进制原码 ： 1001 0100
   -20 的二进制反码 ： 1110 1011
   -20 的二进制补码 ： 1110 1100
   左移两位后的补码  ： 1011 0000
             反码  ： 1010 1111
             原码  ： 1101 0000
             结果  ： r = -80
```
  

-  **模拟【取反】操作减少循环次数**
上述方法中循环次数等于整数二进制的位数，32位则需要循环32次
整数减一再做与运算可以所有位都能运算一次，而不只是最右边的那一位
原理: 
```bash
    9 的二进制 ： 1001
    9-1，最后一位是1，则直接减一：1000
    9 & 8 ： 1001 & 1000 = 1000
    重复上述动作
    
    8 的二进制 ： 1000
    8-1，最后一位是0，则右移1位：0100
    8 & 7 ： 1000 & 0100 = 0000
    
    因此存在几个1就只需要循环几次
```
  

## 面试题40:【数组中只出现一次的数字】
> 题目：一个整型数组里除了两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。
要求时间复杂度是**O(n)**，空间复杂度是**O(1)**

?解析：相同的两个数字异或( `^` )的结果为0，任何数字与0异或结果为当前数字
```javascript
const result = arr.reduce((accumulator, currentValue) => accumulator ^ currentValue)
```

## 面试题47:【不用加减乘除做加法】
> 题目：写一个函数，求两个整数之和，要求在函数体内不得使用`+`、`-`、`×`、`÷`四则运算符号

?解析：5+9=13

- 5的二进制是 101
- 9的二进制是 1001
- 0101和1001 `**与或**`得 1100
- 0101和1001 `**与**` 得 0001
- `**与**`的结果左移1，继续和`**与或**`的结果循环上述
- 当`**与**`的结果为0时，停止循环并返回`**与或**`的结果
```javascript
// 仅适用于正整数
function Add(num1, num2){
  let AND_OR; // 与或
  let AND_LEFT1;    // 与结果位移1

  do{
    AND_OR = num1 ^ num2;
    AND_LEFT1 = (num1 & num2) << 1;

    num1 = AND_OR;
    num2 = AND_LEFT1
  }while(AND_LEFT1 > 0);

  return AND_OR;
}
```


**附加题：不使用新的变量，交换两个变量的值**

-  **基于加减法** 
```javascript
var a = 9, b =4;

a = a + b; // 13
b = a - b; // 9
a = a - b; // 4
```
 

-  **基于异或运算** 
```javascript
a = a ^ b;
b = a ^ b;
a = a ^ b;
```

# 【高质量的代码】
## 面试题14：【调整数组顺序使奇数位于偶数前面】（拓展性、排序基础）
> 题目：输入一个整数数组，实现一个函数来调整该数组中数字的顺序，
使得所有奇数位于数组的前半部分，所有偶数位于数组的后半部分。

?：1.**排序的地基基础题** 2.双指针，前后交换 3.拓展性：**核心：**`while`内`while`

-  **不考虑拓展性** 
```javascript
var arr = [1,2,3,4,5,6,7,8,9];

var pBegin = 0; // 指针1
var pEnd = arr.length-1; // 指针2

while(pBegin < pEnd){
  // 向后移动pBegin，直到它指向偶数
  while(pBegin < pEnd && Boolean(arr[pBegin] & 1)){
    pBegin++;
  }

  // 向前移动pEnd，直到它指向奇数
  while(pBegin < pEnd && !Boolean(arr[pEnd] & 1)){
    pEnd--;
  }

  if(pBegin < pEnd){
    var temp = arr[pBegin];
    arr[pBegin] = arr[pEnd];
    arr[pEnd] = temp
  }
}

console.log(arr)
```
 

-  拓展性
`while`内`while`结束条件**核心**`**func**` 
```javascript
// Reorder Partition基础，返回值具体取决于每个元素提供的函数的真实性
// @param arr 待排序数组
// @param pBegin 指针1
// @param pEnd 指针2
// @param func Boolean

// @return arr
function Reorder(arr,pBegin,pEnd,func){
  while(pBegin < pEnd){
    // 向后移动pBegin，直到它指向偶数
    while(pBegin < pEnd && func(pBegin)){
      pBegin++;
    }

    // 向前移动pEnd，直到它指向奇数
    while(pBegin < pEnd && func(pEnd)){
      pEnd--;
    }

    if(pBegin < pEnd){
      var temp = arr[pBegin];
      arr[pBegin] = arr[pEnd];
      arr[pEnd] = temp
    }
  }

  return arr;
}

// 可以是奇偶
function ReorderOddEven(arr){
  const isEven(){...}
return Reorder(arr, 0, arr.length-1, isEven)
}

// 也可以是其他
function ReorderOther(arr){
  const isOther(){...}
return Reorder(arr, 0, arr.length-1, isOther)
}
```

# 【优化时间和空间效率】
## Partition函数

1. 随机一个主元
2. 将主元和最后一个元素互换
3. 从左向右遍历（创建一个临时索引变量）
4. 比主元小的放到左边（依靠临时索引递增）
5. 再将主元放回到左边的最后一位（和临时索引+1互换）
6. 返回临时索引（中间数）
```javascript
  function Partition(data, len, start, end){
    // 1.随机主元
    const main = RangeNum(start,end);
    
    // 2.将主元和最后一个元素互换
    [data[main], data[end]] = [data[end], data[main]];
    
    // 临时索引指针
    let small = start - 1;
    
    // 3.从左向右遍历
    for(let i=start;i<end;i++){
      // 4.比主元小的放到左边
      if(data[i] < data[end]){
        ++small;
        [data[i], data[small]] = [data[small], data[i]]
      }
    }
    
    // 5.再将主元放回到左边的最后一位
    ++small;
    [data[end], data[small]] = [data[small], data[end]];
    
    // 6.返回临时索引
    return small;
  }
```

## 面试题：基于Partition的快排
```javascript
   function QuickSort(data, start, end){
     if(start === end){
        retun;
     }
     
     const index = Partition(data, start, end)
     if(index > start){
       QuickSort(data, start, index-1)
     }else if(index < end){
       QuickSort(data, index-1, end)
     }
   }
```

## 面试题29:【数组中出现次数超过一半的数字】
?解法一：基于`Partition`函数的`O(n)`算法,

- 数组中有一个数字出现的次数超过了数组长度的一半
- 如果给这个数组基于Partition排序，那么位于中间的数字一定是那个数字
- 这个数字就是统计学上的中位数
```javascript
  function MoreThanHalfNum(data,len=data.length,start=0,end=data.length-1){
    let index = Partition(data,len,start,end);

    let middle = len >> 1;

    while(index !== middle){
        if(index > middle){
            index = Partition(data,len,start,index-1)
        }else {
            index = Partition(data,len,index+1,end)
        }
    }

    // CheckMoreThanHalf判断是否达标
    return data[middle]

  }
```
