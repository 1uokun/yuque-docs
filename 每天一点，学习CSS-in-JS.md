# 每天一点，学习CSS-in-JS

简单来说 CSS-in-JS 就是将应用的CSS样式写在JavaScript文件里面，而不是独立为.css/less/scss之类的文件。
这样就可以在CSS中使用JS的模块声明、变量定义、函数调用和条件判断等语言特性来提供灵活的可拓展的样式定义。

# JSS (JavaScript Style Sheets)

> JSS 是一类具体的 `CSS-in-JS` 实现库；

## react-jss

1. 文档地址：https://cssinjs.org/react-jss/?v=v10.10.1
2. 样式通过 JavaScript 对象来定义，使用对象结构来写样式；
3.  和CSS-in-JS 一样，支持**动态样式**和**组件内样式隔离**。🚩
4. 语法风格偏向函数式，可能不如 CSS-in-JS 语法直观。

```jsx
import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  myButton: {
    padding: props=>props.spacing
  },
  myLabel: props =>({
    height: props.height
  })
})

const Button = ({children, ...props}) => {
  const class = useStyles(props);
  return (
  	<button className={class.myButton}>
    	<label className={class.myLabel}>{children}</label>
    </button>
  )
}
```

# Tailwind CSS专题

> Tailwind CSS 不是 CSS-in-JS，它是一种功能类优先(**Utility-First Fundamentals**)的 CSS 框架;提供原子化、可复用的CSS类。
> 但是在讲CSS-in-JS时，还是值得提到它，值得被一起使用。🚩

## headless UI 天然适合使用tailwind css

headless组件内部可以通过透出`className` prop 来支持

````tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

<div className={cn("flex items-center space-x-2", className)}></div>
````

但是`node_modules`三方UI库如果不透出`className` prop，就不能支持了

- 所以最好设计组件时永远透出`className`，就像`style`一样
- 对于只有`style`可以使用 `twin.macro宏来实现**【tw className 生成➡️ 内联style】**

# Styled-Component

是`css-in-js`一个设计理念分支的统称，不单独指某个库，
参考：https://heatseeker.hashnode.dev/top-css-in-js-libraries-compared

```tsx
// 同 import { styled } from 'styled-components' // 更单一纯粹 allin SC
// 同 import styled from '@emotion/styled' // 更轻，详见下
import { styled } from 'twin.macro' // 集成上面2个

// 自定义组件的话：styled(button)
const Button = styled.button`
	color: turquoise;
 `
 
{/* ⬇️ ⬇️ ⬇️ */}

<button {…props} className=“css-hashname”/>
```

## @emotion

- **@emotion/react**
  react项目专用，集成了/styled和/css包

  ```jsx
  import { css,styled } from '@emotion/react'
  ```

- **@emotion/styled**
  styled-component独立包

  ```jsx
  import styled from '@emotion/styled'
  ```

- **@emotion/css**
  书写内联style，但是生成className的基础包

  ```jsx
  /** @jsxImportSource @emotion/css */
  import { css } from '@emotion/css'
  
  const style = css`
    color: hotpink;
  `
  ```

  



## Styled-Component vs Tailwind CSS

1. 一种快速的方式快速建站或生成一个单页面（即不复杂的页面）用`tailwind`
2. 开发一个更长期的项目，并且要求容易维护 用 `styled-component`
3. **蓝湖**上UI稿给的css对于`tailwind`是不能直接拿来用的
4. `tailwind`不能**「语义化」**，即使可以合并多个classs成为单个class
5. 参考：https://juejin.cn/post/6940078983983661063

# twin.macro 

## 集成babel宏

>  是一种 **babel宏**（语法糖），集成了`styled-component`和`@emotion/styled`和`tailwindcss` 🚩🚩🚩
>  可以参考 [package.json](https://github.com/ben-rogerson/twin.macro/blob/master/package.json#L70) 得知 

- next 13支持 https://github.com/isNan909/tailwind-twin-nextjs
- nextjs14 SWC打包器不支持babel宏 https://github.com/facebook/stylex/issues/190#issuecomment-1857716016 
- 不过专门针对SWC做了一个swc宏 https://github.com/ben-rogerson/twin.examples/tree/master/next-stitches-typescript

1. **【 tw=“classname” 】➡️  className**

   > 可以直接引用tailwind类名了 🌟

   ```jsx
   import tw from "twin.macro";
   
   <Tag tw={"text-red-900"}> antd tag </Tag>
   
   {/* ⬇️ ⬇️ ⬇️ */}
   
   <Tag className="text-red-900"> antd tag </Tag>
   ```

2. **【 css={styleProps} 】➡️   className**

   ```jsx
   <Tag css={{color: "red"}}> antd tag </Tag>
   
   {/* ⬇️ ⬇️ ⬇️ */}
   
   <Tag className="css-hashxx-Home"> antd tag </Tag>
   ```

   **和 npm【@emotion/css】 混合使用**

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

## 能在styled-componet中使用tailwind 类名，各取所长

```tsx
import tw, { styled } from 'twin.macro'

const Input = styled.input`
  color: purple;
  ${tw`border rounded`}
  ${({ hasHover }) => hasHover && tw`hover:border-black`}
`
const Component = () => <Input hasHover />
```



# antd在CSS-in-JS中的实践

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



## CSS-in-JS在编译时的优势

> 「编译时」就是写代码的时候

- 零运行时消耗
  （不编译css了，但是编译js时间加长了）
- 使用 JS 书写
- 支持动态注入



# 参考

- https://www.cnblogs.com/gfhcg/p/17259022.html



## 《我们为何弃用css-in-js》

> https://cloud.tencent.cosm/developer/article/2170891 
> 个人理解：因为不支持NextJS的SSR❓

