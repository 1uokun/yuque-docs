# 每天一点，学习CSS-in-JS

简单来说 CSS-in-JS 就是将应用的CSS样式写在JavaScript文件里面，而不是独立为.css/less/scss之类的文件。
这样就可以在CSS中使用JS的模块声明、变量定义、函数调用和条件判断等语言特性来提供灵活的可拓展的样式定义。

当听到概念性的东西，特别是简称术语，容易模糊不清；

我们只需要知道以下开源三方库，就可以立马得到具体画像，顺便看看对我们项目是否有点帮助吧。

# JSS (JavaScript Style Sheets)

> JSS 是一类具体的 `CSS-in-JS` 实现库，命名灵感来自JavaScript Style Sheets(JSSS)，
> **语法风格偏向函数式**，在CSS-in-JS可以作为一个大类以区分。

## 1. react-jss

1. 文档地址：https://cssinjs.org/react-jss?v=v10.10.1
2. 样式通过 JavaScript 对象来定义，使用对象结构来写样式；
3. 支持**动态样式**和**组件内样式隔离**。🚩
4. 样式的生成发生在**运行时**，灵活性高，但在性能上不如**静态编译**的方案; 
5. 适合复杂的、需要动态生成或修改样式的场景，但可能在某些性能敏感的场景下表现不佳。(jss系列已停止维护，不推荐使用⚠️)

```jsx
import React from 'react'
import { createUseStyles } from 'react-jss'

const Button = ({children, ...props}) => {
  const class = useStyles(props);
  return (
  	<button className={class.myButton}>
    	<label className={class.myLabel}>{children}</label>
    </button>
  )
}

const useStyles = createUseStyles({
  myButton: {
    margin: 10,
    padding: props=>props.spacing
  },
  myLabel: props =>({
    height: props.height
  })
})
```

```jsx
<Button height={10} spaceing={5}>Submit</Button>
```

上述代码将编译为 ⬇️ ⬇️ ⬇️ ; 
但当`height`或`spaceing`更新时则会重新生成classname，如`Button-myButton-1-25`➡️`Button-myButton-1-27`

```html
<button class="Button-myButton-1-25">
  <label class="Button-myLabel-1-26"> Submit </label>
</button>

<style>
.Button-myButton-1-25 {
  margin: 10px;
  padding: 5px;
}
.Button-myLabel-1-26 {
  heighte: 10px;
}
</style>
```



## 2. @stylexjs/stylex

1. 文档地址：https://stylexjs.com/docs/learn/styling-ui/defining-styles/
2. 通过静态提取的方式将**样式**转化为**类名**；**零运行时消耗**。🚩
3. 适用于渲染性能要求比较高的应用场景，特别是移动端的应用。(推荐使用✅)

```jsx
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  button: {
    backgroundColor: 'lightblue',
  }
});

<button {…stylex.props(styles.button)} />
```

4. 支持**动态注入**（将生成依赖于**CSS变量**的静态样式，并在运行时设置该变量的值）。

```jsx
import * as stylex from "@stylexjs/stylex"
const styles = stylex.create({
  button: (height) => ({
    backgroundColor: 'lightblue',
    height
  })
})

<button {...stylex.props(styles.button(19))} />
```

上述代码将编译为⬇️ ⬇️ ⬇️
```html
<button class="x1jwls1v" style="--height:19" />

<style>
  .x1jwls1v {
    background-color: lightblue;
    height: var(--height, revert);
  }
</style>
```

# Styled Component

> `Styled-Component`也是一类具体的 `CSS-in-JS` 实现库，
> 使用ES6模版字符串的形式编写强调**组件级别样式**，在CSS-in-JS也可以作为一个大类。
>
> 参考：https://heatseeker.hashnode.dev/top-css-in-js-libraries-compared （博文图片可以参考）

## 1. styled-component

1. `styled`方法可以在所有组件或任何第三方组件上完美运行，只要组件是通过`className`属性获取样式；

   > *Note: react-native组件已经默认兼容为`style`*

2. 优势是：极其简单、直观，模板字符串写法和普通的 CSS 书写基本一致，适合初次接触CSS-in-JS的开发者。 ✅

```tsx
import { styled } from 'styled-components'

const Button = styled.button`
	color: turquoise;
 `

return (
  <Button></Button>
){

 
{/*样式最终是被编译成类名 ⬇️ ⬇️ ⬇️*/}
<button {…props} className=“css-hashname”/>
```

## 2. @emotion/styled

1. 相对于`styled-component`,`@emotion/styled`是经过`@emotion`系列拆分后的**体积更小**
2. 在SSR场景下，运行时性能和编译后的代码效率更高。✅

- **@emotion/styled**
  styled-component独立包

  ```jsx
  import styled from '@emotion/styled'
  ```

- **@emotion/css**
  书写内联style生成className的基础包

  ```jsx
  /** @jsxImportSource @emotion/css */
  import { css } from '@emotion/css'
  
  const style = css`
    color: hotpink;
  `
  ```

- **@emotion/react**
  react项目专用

  ```jsx
  import { jsx, css, Global, ClassNames } from '@emotion/react'
  ```

# twin.macro 

## babel宏定义语法糖

>  **`twin.macro` 集成了 `styled-component` 和 `@emotion/styled` 和 `tailwindcss`** 🚩
>  参考 [package.json](https://github.com/ben-rogerson/twin.macro/blob/master/package.json#L70) 依赖即可得知
>
>  Note: nextjs14 SWC打包器不支持babel宏，不过最近修复了这个问题 https://github.com/ben-rogerson/twin.examples/tree/master/next-stitches-typescript

1. **【 tw=“classname” 】➡️  className**

   > 可以直接引用tailwind类名 🌟

   ```jsx
   import tw from "twin.macro";
   
   <Tag tw={"text-red-900"}> antd tag </Tag>
   
   ⬇️ ⬇️ ⬇️ 
   
   (<Tag className="text-red-900"> antd tag </Tag>)
   ```

2. **【 css={styleProps} 】➡️   className**

   ```jsx
   <Tag css={{color: "red"}}> antd tag </Tag>
   
   ⬇️ ⬇️ ⬇️
   
   (<Tag className="css-hashxx-Home"> antd tag </Tag>)
   ```

   **和 【@emotion/css】 混合使用**

   ```jsx
   import tw from "twin.macro"
   import { css } from "@emotion/css";
   
   <div className="css`font-size:50px; ${tw`text-red-900`}`"></div>
   ```

3. **tw【classname】 ➡️  css **🌟

   ```jsx
   const style = tw`text-red-900`
   ⬇️ ⬇️ ⬇️
   const style = {color:”red”}
   
   <h1 style={style}>asd</h1>
   ```

## styled-component + tailwind 各取所长

1. 单一的`styled-component`会疲于手写CSS样式；
2. 单一的`tailwind`样式类名会导致代码很长、阅读性差；
3. 各取所长，即做到组件级别的样式隔离，又能快速定义样式。

```tsx
import tw, { styled } from 'twin.macro'

const Input = styled.input`
  color: purple;
  ${tw`border rounded`}
  ${({ hasHover }) => hasHover && tw`hover:border-black`}
`
const Component = () => <Input hasHover />
```

# TODO: antd在CSS-in-JS中的实践

## 使用场景

首先，组件样式还是保持CSS架构模式；
便于：

- 修改 prefixCls
- 固定 class 便于覆盖（无样式就用傀儡class）
- 按需引入

```jsx
import { Button } from "antd"

// 编译后 ⬇️
var _button = require("antd/lib/button")
require("antd/lib/button/style/css")
```

而CSS-in-JSS的使用场景则是❓

- **组件为单位的缓存**
  上述虽有plugin自动帮我们引入css了，但是CSS-in-JS可以更好地封装组件，
  因为样式直接写在JS里了，import一个文件即可了。

- **支持动态主题/嵌套主题**❓
- **针对SSR的优化**❓
  参考 @ant-design/nextjs-registry
  https://github.com/ant-design/nextjs-registry/blob/main/src/AntdRegistry.tsx



## 为什么不用CSS变量

首先CSS变量的优势：

- 样式只生成一次
- 动态主题只修改变量
- 多主题只增加变量

但是存在浏览器兼容问题⚠️
