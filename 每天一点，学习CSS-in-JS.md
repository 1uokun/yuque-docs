# 每天一点，学习CSS-in-JS

打破“防自学机制”，安利这几个库了解CSS-in-JS

> “CSS-in-JS是一种方案术语，方案术语的起源通常源于几个业界广泛认可的库，它们共同组成并逐渐发展出相应的方案或环境。”

简单来说 CSS-in-JS 就是将应用的CSS样式写在JavaScript文件里面，而不是独立为.css/less/scss之类的文件。
这样它们就能拥有了JS语言特性的能力：模块声明、变量定义、函数调用和条件判断等：

- 动态生成样式、包括自动添加浏览起前缀
- 不会出现类名重复问题
- 可以轻松地删除无用CSS等

如果你对CSS-in-JS的概念感到模糊，不用担心！接下来，我们将通过探索一些具有相似动机和思想的库，就能深入了解到CSS-in-JS的世界。

# JSS (JavaScript Style Sheets)

> JSS 是一类具体的 `CSS-in-JS` 实现库，命名灵感来自JavaScript Style Sheets(JSSS)，
> **语法风格偏向函数式**，在CSS-in-JS可以作为一个大类以区分。

## react-jss<sup>[1]</sup>

1. 样式通过 JavaScript 对象来定义，使用对象结构来写样式；
2. 支持**动态样式**和**组件内样式隔离**。🚩
3. 样式的生成发生在**运行时**，灵活性高，但在性能上不如**静态编译**的方案; 
4. 适合复杂的、需要动态生成或修改样式的场景，但可能在某些性能敏感的场景下表现不佳。(jss系列已停止维护，不推荐使用⚠️)

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

```html
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



## @stylexjs/stylex<sup>[2]</sup>

1. 通过静态提取的方式将**样式**转化为**类名**；**零运行时消耗**。🚩
2. 适用于渲染性能要求比较高的应用场景，特别是移动端的应用。(推荐使用✅)

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
> `styled`写法由 styled-component首创，使用ES6模版字符串的形式编写强调**组件级别样式**，在CSS-in-JS也可以作为一个大类。
>
> 参考：https://heatseeker.hashnode.dev/top-css-in-js-libraries-compared （博文图片可以参考）

## styled-component<sup>[3]</sup>

1. `styled`方法可以在所有组件或任何第三方组件上完美运行，只要组件是通过`className`属性获取样式；
   🚩*Note: react-native组件已经默认兼容为`style`*
   
2. 优势是：有着成熟的生态系统和社区支持，许多第三方库和组件也基于它，适合初次接触CSS-in-JS的开发者。 ✅

```tsx
import { styled } from 'styled-components'

const Button = styled.button`
	color: turquoise;
 `

return (
  <Button></Button>
){

 
{/*样式最终是被编译成hash类名 ⬇️ ⬇️ ⬇️*/}
<button {…props} className=“css-hashname”/>
```

## @emotion/styled & @emotion/css<sup>[4]</sup>

1. 相对于`styled-component`,`@emotion/styled`是经过`@emotion`系列拆分后的**体积更小**
2. 在 **SSR** 方面的表现更为出色，支持**静态 CSS 提取**，可以减少首次加载时的样式计算。✅
3.  `@emption/css`首次提出了**`css`模版字符串**生成classname的写法

- **@emotion/styled**
  styled-component独立包

  ```jsx
  import styled from '@emotion/styled'
  ```

- **@emotion/css**
  书写内联style生成className的基础包🌟

  ```tsx
  /** @jsxImportSource @emotion/css */
  import { css } from '@emotion/css'
  
  const className = css`
    color: hotpink;
  `
  (<div className={className} />)
  ```
  
- **@emotion/react**
  react项目专用

  ```jsx
  import { jsx, css, Global, ClassNames } from '@emotion/react'
  ```

# twin.macro

## 通过Babel宏提供简便语法糖

>  🚩**`twin.macro` <sup>[5]</sup>集成了 `styled-component` 、 `@emotion/styled` 和 `tailwindcss`** 
>  （查看 [package.json](https://github.com/ben-rogerson/twin.macro/blob/master/package.json#L70) 依赖）
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
   (<Tag css={{color: "red"}}> antd tag </Tag>)
   
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
   
   (<h1 style={style}>asd</h1>)
   ```

## 结合 Tailwind CSS 的实用性与 CSS-in-JS 的灵活性

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

# antd在CSS-in-JS中的实践

## CSS架构模式(v4.x)

在V5.0之前的组件样式设计使用CSS架构模式，便于：

1.  **修改`prefixCls`**
   ```diff
   <Button prefixCls="my" />
   <style>
    .my-btn {}
   </style>
   
     ⬇️ ⬇️ ⬇️
   - <button class="ant-btn" />
   + <button class="my-btn" />
   ```

2. **固定 class 便于覆盖**（包括傀儡class）

   > 傀儡class：本身无样式，为了单纯覆盖

3. **按需引入**

   ```js
   import {Button} from "antd"
   
   ⬇️ ⬇️ ⬇️
   import Button from 'antd/lib/button'
   import 'antd/es/button/style'
   ```

## CSS变量方案

> V4.17.0文档：https://4x.ant.design/docs/react/customize-theme-variable-cn （试验性）
> V5.0文档：https://ant.design/docs/react/css-variables-cn （融合了CSS-in-JS能力）

CSS变量的优势：

- 样式只生成一次
- 动态主题只修改变量
- 多主题只增加变量

CSS变量的劣势：

- 浏览起兼容性差（如IE）
- 动态修改 CSS 变量可能导致性能下降，尤其是在频繁更改时
- 可通过`cssVar`配置来开启/关闭CSS变量模式

## CSS-in-JS方案

> 在5.0正式版本中，除了保留之前的CSS架构模式外，还带入了Ant Design独特的CSS-in-JS 方案（我们称之为[《组件级别的CSS-in-JS》](https://ant.design/docs/blog/css-in-js-cn )）🚩
> 相关依赖库：[`@ant-design/cssinjs`](https://github.com/ant-design/cssinjs)

1. **组件为单位的缓存**
   上述虽有plugin自动帮我们引入css了，但是CSS-in-JS可以更好地封装组件，
   因为样式直接写在JS里了，import一个文件即可。

2. **支持动态主题/嵌套主题**

   > 在V5.0中`ConfigProvider`组件引入了`theme`属性，外加每个组件都细化了**足量的Design Token**，带来了无与伦比的主题自定义能力。文档链接：[《定制主题》](https://ant.design/docs/react/customize-theme-cn)

```jsx
<ConfigProvider
  theme={{
    token: {
      // Seed Token，影响范围大
      colorPrimary: '#00b96b',
      borderRadius: 2,

      // 派生变量，影响范围小
      colorBgContainer: '#f6ffed',
    },
  }}
>
   <Button type="primary">Theme 2</Button>
</ConfigProvider>
```

3. **针对SSR的优化**
   参考代码： [@ant-design/nextjs-registry](https://github.com/ant-design/nextjs-registry/blob/main/src/AntdRegistry.tsx)

# antd-style

antd内部使用的`@ant-design/cssinjs`写法极其复杂难懂，这是为了兼容历史包袱的产物，也为了换得相比 styled-component 和 emotion 都要好很多的性能。

虽然antd内部不能像JSS或者Styled Component那样的写法，因为职责和边界只在于提供高品质的基础组件；但是应用层如何使用样式方案， antd 并不限制。

🚩**为了将 v5 的 token 系统的推行变得更加顺利，ant design组织还提供了一个使用antd token系统的最佳cssinjs方案：`antd-style`<sup>[6]</sup>**。

## JSS + css模版字符串组合

`antd-style`是基于`emotion`二次封装，提供的核心api是`createStyles`，所以写法上包含了**JSS**和**css模版字符串**2种写法：

```tsx
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => ({
  // 支持 css object 的写法
  container: {
    backgroundColor: token.colorBgLayout,
    borderRadius: token.borderRadiusLG,
    maxWidth: 400,
    width: '100%',
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // 也支持通过 css 字符串模板获得和 普通 css 一致的书写体验
  card: css`
    color: ${token.colorTextTertiary};
    box-shadow: ${token.boxShadow};
    &:hover {
      color: ${token.colorTextSecondary};
      box-shadow: ${token.boxShadowSecondary};
    }

    padding: ${token.padding}px;
    border-radius: ${token.borderRadius}px;
    background: ${token.colorBgContainer};
    transition: all 100ms ${token.motionEaseInBack};

    margin-bottom: 8px;
    cursor: pointer;
  `,
}));

export default () => {
  // styles 对象在 useStyles 方法中默认会被缓存，所以不用担心 re-render 问题
  const { styles, cx, theme } = useStyles();

  return (
    // 使用 cx 可以组织 className
    <div className={cx('a-simple-create-style-demo-classname', styles.container)}>
      <div className={styles.card}>createStyles Demo</div>
      {/* theme 对象包含了所有的 token 与主题等信息 */}
      <div>当前主题模式：{theme.appearance}</div>
    </div>
  );
};
```



以上，就是CSS in JS目前所有的思想。

# Reference

- [1] **react-jss**: https://cssinjs.org/react-jss?v=v10.10.1
- [2] **@stylexjs/stylex**: https://stylexjs.com/docs/learn/styling-ui/defining-styles/
- [3] **styled-component**: https://styled-components.com/docs/basics#motivation
- [4] **@emotion/css**: https://emotion.sh/docs/css-prop
- [5] **twin.macro**: https://github.com/ben-rogerson/twin.macro
- [6] **antd-style**: https://ant-design.github.io/antd-style/zh-CN/guide
