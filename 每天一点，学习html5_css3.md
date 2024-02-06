# 业务经验
## 引导页背景图
引导页背景图层可以使用 `box-shadow`，这样就不用再重复写高亮区块链
# 基础
## CSS加载会造成阻塞吗？
通过背诵《浏览器输入url到页面展示经历了什么？》可以得知，
先同步**解析**`DOM tree`树，和`CSS tree`树，再**渲染**DOM树，
所以如果加载CSS慢了，不会阻塞DOM树的解析，但会阻塞DOM树的**渲染**
## CSS选择符优先级
> 参考：[https://github.com/febobo/web-interview/issues/95](https://github.com/febobo/web-interview/issues/95)
> !import > id > class > tag
权重相等时，按顺序决定，最后声明的为准

1. ID选择器（#example）
2. 类选择器（.example 、 属性选择器`[type="radio"]`、 伪类`:hover`）
3. 类型选择器（元素标签、伪元素`::before`）
| 选择器 | 例子 | 例子描述 | CSS版本 |
| --- | --- | --- | --- |
| `#id` | #example | 选择id="example"的所有元素 | 1 |
| `.class` | .example | 选择class="example"的所有元素 | 1 |
| **属性选择器** |  |  |  |
| `[attribute]` | [target] | 选择带有target属性的所有元素 | 2 |
| `[attribute=value]` | [target=_blank] | 选择“target=_blank”的所有元素 | 2 |
| `[attribute~=value]` | [title~=flower] | 选择title属性**包含**单词“flower”的所有元素 | 2 |
| `[attribute/=value]` | [lang/=en] | 选择lang属性值以“en”**开头**的所有元素 | 2 |
| `[attribute^=value]` | a[src^="https"] | 选择其src属性值以“https”**开头**`**^**`
的每个`<a>`
元素 | 3 |
| `[attribute$=value]` | a[src$=".pdf"] | 选择其src属性值以“.pdf”**结尾**`**$**`
的所有`<a>`
元素 | 3 |
| `[attribute*=value]` | a[src*="abc"] | 选择其src属性值中**包含**`*****`
*abc**子串** | 3 |
| **UI伪类** |  |  |  |
| `:link` | a:link | 选择所有未被访问的链接 | 1 |
| `:visited` | a:visited | 选择所有已被访问的链接 | 1 |
| `:active` | a:active | 选择活动链接 | 1 |
| `:hover` | a:hover | 选择鼠标指针位于其上的链接 | 1 |
| `:focus` | input:focus | 选择获得焦点的input元素 | 2 |
| **input伪类** |  |  |  |
| `:enabled` |  |  |  |
| `:disabled` |  |  |  |
| `:checked` |  |  |  |
| **结构伪类** |  |  |  |
| `:first-letter` | p:first-letter | 选择每个`<p>`
元素的**首字母** | 1 |
| `:fitst-line` | p:fitst-line | 选择每个`<p>`
元素的**首行** | 1 |
| `:fitst-child` | p:first-child | 选择属于父元素的第一个子元素的每个`<p>`
元素 | 2 |
| `:first-of-type` | p:first-of-type | 选择属于其父元素的**首个**`<p>`
元素的每个`<p>`
元素 | 3 |
| `:last-of-type` |  | **最后** |  |
| `:only-of-type` |  | **唯一** |  |
| `:only-child` | p:only-child | 选择属于其父元素的唯一子元素的每个`<p>`
元素 | 3 |
| `:nth-child(n)` | p:nth-child(2) | **第二(n)个子元素** | 3 |
| `:nth-last-child(n)` |  | 同上，从最后一个元素开始计数 | 3 |
| `:nth-of-type(n)` |  |  |  |
| `:nth-last-of-type(n)` |  |  |  |
| `last-child` | p:last-child | 选择属于父元素最后一个子元素每个`<p>`
元素 | 3 |
| `:root` | :root | 选择文档的根元素 | 3 |
| `:empty` | p:empty | 选择没有子元素的每个`<p>`
元素（包括文本节点） | 3 |
| `:target` | #news:target | 选择当前活动的#news元素 | 3 |
| `:not(selector)` | :not(p) | 选择非`<p>`
元素的每个元素 | 3 |
| **元素标签** |  |  |  |
| `element` |  |  |  |
| `element, element2` |  | 所有element**和**所有elemen2 | 1 |
| `element element2` |  | element**内部**的所有element2 | 1 |
| `element > element2` |  | 必须是**父元素**element的所有element2 | 2 |
| `element + elements` |  | **紧接在**element元素之后的所有element2 | 2 |
| `element ~ elements` | p~ul | 选择前面有`<p>`
元素的每个`<ul>`
元素 | 3 |
| **伪元素** |  |  |  |
| `::before` |  |  |  |
| `::after` |  |  |  |


> 注： [attribute]可以是任何属性，如a[target]{...}, div[data-list]{...}
注：input:focus仅限input，如果 :focus 用于 IE8 ，则必须声明 <!DOCTYPE>。css3的都需要
注：[attribute~=value]和[attribute*=value]的区别：
~= 表示单词===value，除空格外，如title="tulip flower" [title~="flower"]是可以找到的，但是"tulip flowers"就找不到，而[attribute*=value]都可以找到
注： :first-of-type 每个树枝内的首个指定元素

### CSS父元素选择器`:has()`
> ⚠️目前小程序还不支持


## 行内元素和块级元素

> 参考：[https://www.cnblogs.com/yc8930143/p/7237456.html](https://www.cnblogs.com/yc8930143/p/7237456.html)


-  **行内元素 inline**
`<span>`、`<a>`、`<lable>`、`<storag>`、 `<b>` 
-  **块级元素 block**
`<div>`、`<p>`、`<li>`、`<h1>`、`<h2>`、`<h3>`、 
-  **区别** 
   1. **块级元素**会独占一行，其宽度自动填满其父元素宽度
   **行内元素**不会独占一行，相邻的行内元素会排列在同一行里，如果一行排不下才会换行
   2. **块级元素**可以设置`width`、`height`属性
   **行内元素**设置`width`、`height`**无效**
   3. **块级元素**可以设置`margin`、`padding`
   **行内元素**只有`margin-left`、`padding-right`可以产生边距效果，`margin-top`，`padding=bottom`无效（水平方向有效，竖直方向无效）
## 行内块元素

- **行内块元素 inline-block
**`<input>`、`<img>`
- 既可以像块级元素那样设置`width`、`height`、`marign`、`padding`
- 又可以像行内元素那样`**不独占整一行**`
- 🚩但是之间会有**空白间隙**
### 如何解决inline-block间隙问题？

1.  直接删除`换行符`(IE1像素残留)
2. 父元素`font-size:0`，子元素重新设置字体大小（低版本safari兼容性）
3. 父元素`font-size:0; letter-spacing: -3px;` 字元素重新设置字体大小和字间距
```html
<style>
*{
	margin: 0;
	padding: 0;
}
ul{
  list-style: none;
}
li {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: red;
}
</style>

<ul>
  <li>111</li> <!--1.换行符-->
  <li>222</li>
</ul>
```
## 
## 🌟BFC 块级格式上下文
> 块级格式上下文(Block formatting content)，是一种属性,
> 浮动元素、绝对定位元素、非块级盒子的块级容器、overflow值不为visible的块级盒子，都会为它们的内容创建新的BFC

**以下元素会触发BFC：**

- `html` 根元素
- `float`（不为 none 即可） 
- `position`: `absolute` | `fixed`
- `display`: `inline-block` | `flex` | inline-flex | grid | inline-grid 
| table | table-cell | table-caption | flow-root


**BFC渲染规则：**

- **BFC是一个独立的容器，外面的元素不会影响里面的元素**
- **计算BFC高度的时候浮动元素也会参与计算**
- BFC垂直方向边距重叠（解决塌陷问题）
- BFC的区域不会与浮动元素的box重叠

### margin塌陷问题
在父盒子中子盒子用margin会造成内部margin-top不生效，但是外部父盒子拥有margin-top问题

**解决**：解决方法就是让父元素触发BFC，这样BFC内的元素就无法影响到外面了
```css
.container {
	overflow: hidden;
}
.p1 {
	margin: 20px;
	width: 50px;
	height: 50px;
}
```
### 高度塌陷问题
高度塌陷是指父元素本来应该包括子元素的高度，但是实际上父元素比子元素的高度要小

**解决1**：`overflow: hidden` 触发BFC 
**解决2**：一般是由浮动造成的，清除浮动即可
```css
.container::after {
	content: ‘’;
	display: block; // 强制为块级元素，触发BFC
	clear: both; // 相当于添加了一个子元素，这个子元素清除了它前面的元素
}
.p1 {
	margin: 20px;
	width: 50px;
	height: 50px;
}
.p2 {
  height: 25px; // 不触发BFC实际高度只有25px
}

```
**解决3: 解决2的另一种直观写法**
```css
<container>
	<p1></p1>
  <p2></p2>
	<clear></clear>
</container>
```
#### content

- 可图片资源覆盖 `content:url('../1.png');`
- 可attr `content: attr(href);`
- 可字体标识 `content: '\e6a7';`
```jsx
<a class="baidu-link" href="https://baidu.com"> 百度一下，你就知道!</a>

.baidu-link::after {
  content: " (" attr(href) ") "
}

渲染结果⬇ ⬇ ⬇

百度一下，你就知道! (https://baidu.com) 
```

### 外边距折叠
父元素与其第一个或最后一个子元素之间 如果在**父元素与其第一个子元素之间不存在边框、内边距、行内内容**，也**没有创建块格式化上下文**、或者**清除浮动**将两者的 margin-top 分开；或者在父元素与其最后一个子元素之间不存在边框、内边距、行内内容、height、min-height、max-height 将两者的 margin-bottom 分开，那么这两对外边距之间会产生折叠。此时子元素的外边距会“溢出”到父元素的外面

解决1： 添加`border`
```css
.container {
	border: 1px solid yellow;
  padding: 1px;  // 或者
}
.p1 {
	margin: 20px;
	width: 50px;
	height: 50px;
}
```
解决2：添加`padding:1px;`
解决3：添加`&nbsp;`占位
解决4：BFC
前三种都不好，因为高度不可控
## IFC 行内格式上下文
> 与BFC对应的是IFC(Inline formatting content)

1. 框会从包含块的顶部开始，一个接一个地水平摆放
2. 水平方向摆放时，内外边距+边框 所占用的空间都会被考虑（宽度）
3. 高度由 行高决定
## white-space

`**white-space**`处理`'\n'`换行符、`'\s'`,`' '`空格符号等

- `**normal**`
连续的空白符会被合并，换行符会被当作空白符处理
- `**nowrap**`
连续的空白符会被合并，换行符无效
- `**pre**`
连续的空白符会被保留，只有遇到换行符或
才会换行，否则**不会换行**
- `**pre-wrap**`
连续的空白符/制表符会被保留，换行符有效
- `**pre-line**`
连续的空白符/制表符会被合并，换行符有效
- `**break-spaces**`
连续的空白符/制表符会被保留，换行符有效
与`pre-wrap`区别在于行尾空格会被换行

## 
## contain: paint strict content
**尽可能独立于DOM树**，使得浏览器在重新计算布局、样式、绘图时只影响有限的DOM区域，改善性能
这个属性在包含大量独立组件的页面非常实用，可以防止小部件的CSS规则改变对页面上的其他东西造成影响

## border-width:0.5px 不显示

border-width宽度低于1px时，在ios中存在随机性地不显示，
使用`transform: translateZ(0);`可以解决

```css
border: 0.5px solid #f00;
transform: translateZ(0);
```

使用 `transform: scale(1, 0.5);`可以解决
```css
height: 1px;
transform: scale(1, 0.5);
```

## input实时监听值的变化

可以**实时**监听值的变化的事件：

- keypress
- keydown
- keyup
- input

🚩事实上`onChange`并不能实时监听，只有在失去焦点的时候才会触发

```
<input onchange="onchange()" id="input"/>

function onchange(){
  console.log(input.value) //onchange也没有传参，value也是靠通过element直接获取
}
```
## flex
```css
flex: 0 0 9rem;
```

`flex`属性是`flex-grow`,`flex-shrink`和`flex-basis`的简写，
默认值为`0 1 auto`，后两个属性可选。
建议这样简写

-  `**flex-grow**`
**定义项目的放大比例**
默认为0.即如果存在剩余空间，页不放大 
-  `**flex-shrink**`
**定义项目的缩小比例**
如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小；
如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小 
-  `**flex-basis**`
定义了在分配多余空间之前，项目占据的主轴空间。
浏览器根据这个熟悉，计算主轴是否有**剩余空间**。
可以设置跟`width`属性一样的值（比如350px）,则项目将占据固定空间。 

### react-native

React-Native layout with Flexbox

-  **flexDirection** 
   - `row`
   - `column`(默认值)
   - `row-reverse`
   - `column-reverse`
-  **justifyContent**
应用于主轴 
   - `flex-start`(默认值)
   - `flex-end`
   - `center`
   - `space-between`
两边无间隙
   - `space-around`
均匀等分（子view的数量）部分，子view在各个等分的正中间
   - `space-evenly`(only RN)
与`space-around`区别在于最左边和最右边(row轴)或者最上边和最下边(column)轴
的间隔和中间的间隔相等
即子view没有撑满的情况下，他们之间的间隔都相等
-  **alignItems**
应用于横轴 
   - `stretch`(默认值)
拉伸容器的子对象以匹配容器横轴的高度
即当`flexDirection:row`且未设置子view高度`height`时，默认撑满高度
当`flexDirection:column`且未设置子view宽度`width`时，默认撑满宽度
-  **alignSelf**
和`alignItems`选项和效果相同，
但不影响容器中的子级，通过该属性可以代替父级设置的`alignItems`任何选项 
-  **alignContent**
   定义沿横轴的线分布，
   仅在使用`flexWrap`时生效 
   - `flex-start`(默认值)
   - `strctch`(在web中使用Yoga时为默认值)
-  **flexWrap** 
   - `nowrap`(默认值)
   - `wrap`
   - `wrap-reverse`
-  **flexBasis**
`:number`(px)
设置初始宽度(`row`布局时)或者初始高度(`column`布局时)
比直接设置width/height更灵活 
-  **flexGrow**
`:number`(int)
和其他同样设置了`flexGrow`的对比倍数
和`flex`不同的是，仅仅在分配剩余的空间中和设置了`flexGrow`的元素对比，没有设置该选项的不算进去 
-  **flexShrink**
`:number`(int)
只有当子级的总大小超过父级的宽度时使用，
和`flexGrow`效果一致 

### flex在CSS和React-Native的区别
|  | CSS | ReactNative |
| --- | --- | --- |
| `flexDirection` | 默认值为`row` | 默认值为`column` |
| `alignContent` | 默认值为`stretch` | 默认值为`flex-start` |
| `flexShrink` | 默认值为**1** | 默认值为**0** |


# CSS布局
## 水平垂重居中

1. `**Flex**`**方案**
2. `**Grid**`**方案**
```css
.outer {
  display: grid;
}

.inner {
  justify-self: center;
  align-self: center;
}

// 方案2
.inner2 {
  margin: auto;
}
```

3. `**absolute**`_**50%**_** + **`**transform**`
```css
.outer {
  position: relative;
}

.inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

4. `**absolute**`_**50%**_** + **`**calc**`
需要固定居中元素的宽高
```css
.outer {
  position: relative;
}

.inner {
  position: absolute;
  left: calc(50% - WIDTH/2); // 居中元素的宽度/2
  top: calc(50% - HEIGHT/2); // 居中元素的高度/2
}
```

5. `**absolute**`_**50%**_** + 负**`**margin**`
需要固定居中元素的宽高
```css
.outer {
  position: relative;
}

.inner {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -Width/2; 
  margin-top:  -Height/2;
}
```

6. `**absolute**`_**0%**_** + **`**margin:auto**`
需要固定居中元素的宽高，否则其宽高会被设为100%（副作用）
**副作用**： 
- `left:0; right:0;`相当于`width:100%;`
- `top:0; bottom:0;`相当于`height:100%;`
```css
.outer {
  position: relative;
}

.inner {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
```

7. `writing-mode: vertical-lr`
纯文本垂直显示

### 水平居中

1. `margin: auto;`
2. `text-align `+ `inline-block`
3. `fit-content` + `margin`

### 垂直居中

1. `table-cell` + `vertical-align`
2. `inline-block` + `line-height`
3. `inline-block` + `vertical-align`

## 三栏布局
三栏布局（左右固定，中间自适应布局）的实现方式有三种

1. 双飞翼布局
2. 圣杯布局
3. flex布局

### 双飞翼布局 margin+float
考察`外边距折叠`问题
```less
<style>
.left,.center, .right {
  float: left;
}


.center {
	width: 100%;
}
.center-content {
  margin-left: 123px; // 响应式center和左右固定宽度被迫耦合了
	margin-right: 45px;
	background: yellow
}


.left {
	width: 123px;
	margin-left: -100%;
	background: blue
}

.right {
	width: 45px;
	margin-left: -45px;
	background: green
}
</style>

<div class="center"><div class="center-content">center</div></div>
<div class="left">left</div>
<div class="right">right</div>
```

### 圣杯布局 padding+left+float
考察浮动`float`的使用
三栏需要被包裹，内部padding，
**解决双飞翼布局中center需要耦合左右宽度的问题，将耦合放在包裹层box**

```less
<div class="box">
	<div class="center"></div>
	<div class="right"></div>
	<div class="left"></div>
</div>
<style>
.box{
  padding-left: LEFT_WIDTH; // 解偶
  padding-right: RIGHT_WIDTH;

  &::after {
    content: "";
    display: block;
    clear: both; // 清除浮动触发BFC
  }
}


.center, .left, .right {
  float: left;
}

.left{
  width: LEFT_WIDTH;
  margin-left: -100%; // 目的是能和center保持在一行
  position: relative;
  left: -LEFT_WIDTH; // 避免遮住center
}
.right{
  width: RIGHT_WIDTH;
  margin-left: -RIGHT_WIDTH; // 目的是能和center保持在一行
  position: relative;
  left: RIGHT_WIDTH; // 避免遮住center
}
.center{
  float: left;
  width:100%;

  height:100%;
  background: yellow;
}
</style>
```

# 盒模型

每个盒子有四个边界：

- **内容区域 content area**
- **内边距区域 padding area**
- **边框区域 border area**
- **外边距区域 margin area**

## box-sizing
> box-sizing ： content-box || border-box || inherit;


- `content-box` **标准盒模型** content(**width/height**) + **margin**(左右) + **padding**(左右) + **border**(左右)
- `border-box`   **怪异盒模型** content(**width/height**) + **margin**(左右)（padding和border不会影响盒的大小）

### 如何产生一个不占空间的边框？
`box-sizing: border-box`
# 定位 position

CSS `position`属性用于指定一个元素在文档中的定位方式。

```
position = static(默认值) | relative | absolute | inherit
```

- **static**： 默认，使top,left,bottom,right,`z-index`属性无效
- **releative**：position:relative 对 table-x-group, table-row, table-column, table-cell, table-caption 元素无效。
- **absolute**
- **fixed**: 固定布局
- **sticky**: 粘性布局，，固定到screenview的当前可见屏幕的顶部
## **absolute 与 z-index**
```css
.container {
  position: relative;
}

.close {
  position: absolute;
  z-index: 1;
}

.box {
  // 不加这句话，z-index将不生效
  position: relative;
  z-index: 2;
}
```

# px/em/rem/vw/vh

🚩移动端适配方案

-  `**px**`
像素大小固定。`1px = 在计算机屏幕上的1点`，它是绝对的度量单位
优点是完美地像素级切图
缺点是不能构建自适应网站 

-  `**em**`
优点：`em`始终等于当前字体的大小，但本质上是可拓展的。
因此可以构建响应式网站
缺点：**受嵌套元素影响**，除非上一层父元素再显式重写一个具体单位
`<div style="font-size: 30px;"> <p style="font-size: 0.5em;"></p></div>`
`p的字体大小为 0.5x30 = 15px;`

-  `**rem**` 
`**rem**`**和百分比单位类似
🌟rem受浏览器自带的字体大小设置影响**
优点：**rem总考虑根的大小，而不管元素的嵌套如何**
缺点：浏览器默认大小`1rem = 16px`，导致`10px = 0.625rem`、`12px = 0.75rem`
要使用`rem`，可以将html字体设置为`62.5%`,然后`1rem=10px`，您就可以轻松记住它 
```css
html {
    font-size: 62.5%;
    /*10 ÷ 16 × 100% = 62.5%*/
}
body {
    font-size: 1.4rem;
    /*1.4 × 10px = 14px */
}
h1 {
    font-size: 2.4rem;
    /*2.4 × 10px = 24px*/
}
```

-  **vw/wh**
仅IE10支持
`1vw = 1/100 viewport width`
`1vh = 1/100 viewport height`
`100vh = 100%` 

## rem响应式布局

> 参考链接：[https://github.com/forthealllight/blog/issues/13](https://github.com/forthealllight/blog/issues/13)


-  **默认情况下**`**1 rem = 16px**`
为了凑整我们设置`html{ font-size: 62.5% }`后可以得到`1 rem = 10px` 
-  **根据视图容器大小动态改变**`**html{ font-size }**`
**但这也是缺点**，必须通过js来动态控制根元素font-size的大小  
```
(function(win, doc){
   function changeSize(){
     doc.documentElement.style.fontSize = doc.documentElement.clientWidth / 3.75 + 'px';
     // 设计图按照375px计算
     console.log(100 * doc.documentElement.clientWidth / 3.75)
   }
   changeSize();
   win.addEventListener('resize', changeSize, false)
})(window, document);
```

-  `**rem2px**`**和**`**px2rem**`
上述就是简单的`rem2px`;如果实现`px2rem`呢？ 
-  `**px2rem-loader**`   
```
npm install px2rem-loader
```
```
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'px2rem-loader',
        // options here
        options: {
          remUni: 75,
          remPrecision: 8
        }
      }]
    }]
  }
}
```

-  `**postcss-loader**`   
```
npm install postcss-loader
```
```
var px2rem = require('postcss-px2rem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function() {
    return [px2rem({remUnit: 75})];
  }
}
```

# HTML Media Capture（媒体捕获）

[http://anssiko.github.io/html-media-capture/](http://anssiko.github.io/html-media-capture/)

```html
 <input type =“file”accept =“image / *”capture>
```

# window.open 最稳妥的跳转链接

- `window.open(url, "_self")`
  **`_self`当前页面跳转**，非此种方式可能会导致当前页面不刷新
- `window.open(url, undefined, "noopener")`
  **`noopener`  **避免新页面使用同源同进程打开导致父页面卡死
- 第三方`webview`打开新页面请用这个
  如**微信公众号**、**企微侧边栏**等打开新弹窗

# 图片取消跨域

```html
<img referrerpolicy="no-referrer" />
```

# 挂载在DOM上的EventTarget

不挂载到`document`、`window`上避免污染原生事件，比如DOMContentLoaded、resize事件等
```javascript
const MY_EVENT = "my_event";

// 一般挂载到根节点上可以全页面都能使用了
document.querySelector('#root').addEventListener(MY_EVENT, listener)
document.querySelector('#root').removeEventListener(MY_EVENT, listener)

// dispatch
document.querySelector('#root').dispatchEvent(new Event(MY_EVENT))
 
// 使用CustomEvent还可以携带参数
document.querySelector('#root').dispatchEvent(
  new CustomEvent(FILTER_FLASH_TYPE_EVENT, { detail: "hello" })
)
```
# 页面生命周期

- `**DOMContentLoaded**` - 浏览器完全加载HTML，并构建DOM树，但可能尚未加载图片和样式表等外部资源。
- `**load**` - 浏览器加载了所有资源（图像，样式等）。
- `**beforeunload/unload**` - 当用户离开页面时。

## DOMContentLoaded

> document.addEventListener('DOMContentLoaded', ready)


```html
	<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
<script>
    document.addEventListener('DOMContentLoaded', function(){
        // image is not yet loaded (unless was cached), so the size is 0x0
        console.log(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
    })

    window.onload = function(){
        console.log(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
    }
</script>
```

#### **关于**`**async**`**和**`**defer**`
| . | `async` | `defer` |
| --- | --- | --- |
| 顺序order | 脚本相对于页面的其余部分异步地执行 | 页面完成解析时执行 |
| -- | -- | -- |
| `DOMContentLoad` | `saync`
文件尚未完全下载时，脚本可能就会加载并执行（如脚本很小或者缓存） |  |
| -- | -- | -- |


#### **getComputedStyle()**

DOMContentLoaded and styles
外部样式表不会影响DOM，因此DOMContentLoaded不会等待它们。
但是有一个陷阱：在加载样式表之前，脚本不会执行

```html
<link type="text/css" rel="stylesheet" href="style.css">
<script>
  // the script doesn't not execute until the stylesheet is loaded
  alert(getComputedStyle(document.body).marginTop);
</script>
```

原因是脚本可能想要获取元素的坐标和其他与样式相关的属性，如上例所示。当然，它必须等待样式加载。

在DOMContentLoaded等待脚本时，它现在也在等待它们之前的样式。

#### **内置浏览器自动填充功能**

Firefox，Chrome和Opera自动填充表格`DOMContentLoaded`。

例如，如果页面具有带登录名和密码的表单，并且浏览器记住了这些值，则`DOMContentLoaded`可以尝试自动填充它们（如果用户批准）。

因此，如果`DOMContentLoaded`被长时间加载的脚本推迟，那么自动填充也在等待。您可能在某些网站上看到过（如果您使用浏览器自动填充） - 登录/密码字段不会立即自动填充，但在页面完全加载之前会有延迟。这实际上是`DOMContentLoaded`事件发生之前的延迟。

使用`async`和`defer`外部脚本的一个小好处- 它们不会阻止`DOMContentLoaded`并且不会延迟浏览器自动填充。

## window.onload

当整个页面加载，包括样式，图像和其他资源对象加载完成后触发

## window.onunload

当访问者离开页面时触发，在此之前还会监听到`onbeforeunload`，仅iframe

## window.onbeforeunload

监听访问者关闭窗口的动作，仅iframe

## readyState

有时候脚本设置来`async`属性或者异步加载脚本之后，仍然不能通过确定整个document是否加载完成
这时候就需要使用到`document.readyState`，它会返回3个值：

- `"loading "` - 文档正在加载
- `"interactive "` - 文件已完成阅读
- `"complete "` - 王党已完全读取，所以资源（如图像）也已加载

```javascript
	function work() { /*...*/ }

	if (document.readyState == 'loading') {
  		document.addEventListener('DOMContentLoaded', work);
	} else {
  		work();
	}
```

还可以监听`readyState`更新事件

```javascript
	// current state
    console.log(document.readtState)
    
    // print state changes
    document.addEventListener('readysatetchange', ()=> console.log(document.readyState))
```

主要作用点还是在iframe

```html
<script>
  function log(text) { /* output the time and message */ }
  log('initial readyState:' + document.readyState);

  document.addEventListener('readystatechange', () => log('readyState:' + document.readyState));
  document.addEventListener('DOMContentLoaded', () => log('DOMContentLoaded'));

  window.onload = () => log('window onload');
</script>

<iframe src="iframe.html" onload="log('iframe onload')"></iframe>

<img src="http://en.js.cx/clipart/train.gif" id="img">
<script>
  img.onload = () => log('img onload');
</script>
```

## 所以完整生命周期

1. initial readyState:loading
2. readyState:interactive
3. DOMContentLoaded
4. iframe onload
5. readyState:complete
6. img onload
7. window onload

# CSS transition

**ransition 属性是一个简写属性，用于设置四个过渡属性：**

|  |  |
| --- | --- |
| transition-property | 规定设置过渡效果的 CSS 属性的名称。 |
| -- | -- |
| transition-duration | 规定完成过渡效果需要多少秒或毫秒。 |
| -- | -- |
| transition-timing-function | 规定速度效果的速度曲线。 |
| -- | -- |
| transition-delay | 定义过渡效果何时开始。 |
| -- | -- |


**transition-timing-function速度曲线类型**

|  |  |
| --- | --- |
| linear | 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。 |
| -- | -- |
| ease | 规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。 |
| -- | -- |
| ease-in | 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。 |
| -- | -- |
| ease-out | 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。 |
| -- | -- |
| ease-in-out | 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。 |
| -- | -- |
| cubic-bezier(n,n,n,n) | 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。 |
| -- | -- |


```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>css animations</title>
    <style>
        img {
            cursor: pointer;
        }
        #flyjet {
            width: 40px;
            height: 24px;
            /*transition: all 1s cubic-bezier(0.25, 1.5, 0.75, 1.5);!*回弹效果*!*/
            /*transition: all 1s; !*简写*!*/
            -moz-transition: width 2s; /* Firefox 4 */
            -webkit-transition: width 2s; /* Safari 和 Chrome */
            -o-transition: width 2s; /* Opera */
        }

        #flyjet.growing {
            width: 400px;
            height: 240px;
        }
    </style>
</head>
<body>
<img id="flyjet" src="https://en.js.cx/clipart/flyjet.jpg">
<script>
    flyjet.onclick = function() {
        // 添加clas样式
        flyjet.classList.add('growing');

        // 监听transitionend
        flyjet.addEventListener('transitionend', function(e) {
            //如果transition设置为all，则会监听所有属性的变化，有多少个属性就会监听多少次
            console.log(e.propertyName) //height,width
        });
    }
</script>
</body>
</html>
```

# JavaScript animations

JavaScript动画可以处理CSS无法处理的事情，比如，沿着复杂路径移动，具有与`贝塞尔曲线`(Bezier curves)不同的计时功能，或者画布`canvas`

## setInterval

改变style.left从0px到100px，如果使用setInterval，可以做到2px这样微小的delay,和达到每秒50次的变化。这个和电影的原理相同：每秒24帧或更多帧足以使其看起来光滑。

```javascript
	let timer = setInterval(function(){
    	if(/*animation complete*/) clearInterval(timer)
        elem.style.left = 
    })
```

## animejs.com

基本原理

```javascript
    function animate({duration, draw, timing}) {

    	let start = performance.now();

    	requestAnimationFrame(function animate(time) {
        	let timeFraction = (time - start) / duration;
        	if (timeFraction > 1) timeFraction = 1;

        	let progress = timing(timeFraction)

        	draw(progress);

        	if (timeFraction < 1) {
            	requestAnimationFrame(animate);
        	}

    	});
	}
    
    // 使用
    animate({
    	duration: 1000,						//持续事件
        timing: function(timeFraction) {	//动画类型
                return timeFraction;
        },
        draw: function(progress) {
        	elem.style.width = progress * 100 + '%';	// 运动轨迹
        }
    });
```

## querySelectorAll

```javascript
	// html代码
    // <div v-bind="asd" class="qwe"></div>
    
    document.querySelector("[v-bind]")		//<div v-bind="asd" class="qwe"></div>
    document.querySelectorAll("[v-bind]")	//NodeList [div.qwe]
```
# CSS
## 文本超出显示省略号ellipsis
```css
.line1 {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
```
## 隐藏滚动条
```css
.btnScrollX {
  white-space: nowrap;
  overflow: hidden;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
```
## css变量

```html
<style>
// 根伪类
:root {
  --main-bg-color: red;
}

.box {
  background-color: var(--main-bg-color);
}

// 上层
#container {
  --main-bg-color: green;
}
</style>

<div id="container">
  <div class="box"></div>
</div>
  
```

## css-module

css-module和Less、Sass、PostCSS编程语言不同，**只加入了局部作用域和模块依赖**，基于`css-loader`和`css-var`实现，[链接🔗](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

- `:global`
如果全局外部没有包裹，那就真的影响全局了
所以一般外部加一个包裹样式类名，这样只会影响该类名下的所有  
```less
  .box {
    :global(.ant-upload-list-item-thumbnail){
       border:1px solid red;
    }
  }
```
```jsx
 import styles from '../upload.less';

 <Upload {...} className={styles.box}/>
```

- `:local(.classname{})`
理论上所有`classname`都是local的
```css
:global {
  .a { 
    ...
  }
  :local(.b){
    ...
  }
}

// 编译后
.a {
  ...
}
.b___1bJNe {
  ...
}

```

- `:export`
> 注：CSS Modules 中没有变量的概念，这里的 CSS 变量指的是 Sass 中的变量。

```jsx
/* config.scss */
$primary-color: #f40;

:export {
  primaryColor: $primary-color;
}


/* jsx */
import styles from './config.scss'

<p className={styles.primaryColor}>
```

# web components

>  作者需要一个页面效果，最终选择了 Web 组件来实现，这样可以与任何框架匹配。否则，换了一个框架，就需要重新实现。
> https://jakelazaroff.com/words/web-components-will-outlive-your-javascript-framework/

# 参考

- [1] [animejs.com](http://animejs.com/)
- [2] [结构化动画](http://javascript.info/js-animation)
