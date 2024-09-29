# 打破“防自学机制”，安利这几个库了解CSS-in-JS



> “CSS-in-JS是一种方案术语，方案术语的起源通常源于几个业界广泛认可的库，它们共同组成并逐渐发展出相应的方案或环境。”

简单来说 CSS-in-JS 就是将应用的CSS样式写在JavaScript文件里面，而不是独立为.css/less/scss之类的文件。
这样它们就能拥有了JS语言特性的能力：模块声明、变量定义、函数调用和条件判断等：

- 动态生成样式、包括自动添加浏览起前缀
- 不会出现类名重复问题
- 可以轻松地删除无用CSS等

如果你对CSS-in-JS的概念感到模糊，不用担心！接下来，我们将通过探索一些具有相似动机和思想的库，就能深入了解到CSS-in-JS的世界。

# JSS (JavaScript Style Sheets)

> JSS 是一类具体的 CSS-in-JS 实现库，命名灵感来自 JavaScript Style Sheets (JSSS)。**其语法风格偏向函数式**。

## react-jss<sup>[1]</sup>

1. 样式通过 JavaScript 对象来定义，返回样式类名的对象集合，保持原生`className`引用；🚩
2. 支持**动态样式**和**组件内样式隔离**。
3. 样式的生成发生在**运行时**，灵活性高，但在性能上不如**静态编译**的方案; 
4. 适合复杂且需要动态生成或修改样式的场景，但可能在性能敏感的情况下表现不佳。(jss系列已停止维护，不推荐使用⚠️)

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

> `Styled-Components` 是一类具体的 CSS-in-JS 实现库，`styled` 写法由 styled-components 首创，使用 ES6 模板字符串的形式编写，强调**组件级别样式**。

## styled-component<sup>[3]</sup>

1. `styled`方法可以在所有组件或任何第三方组件上完美运行，只要组件是通过`className`属性获取样式。
   🚩*Note: react-native组件已经默认兼容为`style`*
   
2. 具有成熟的生态系统和社区支持，适合初次接触 CSS-in-JS 的开发者。✅

```tsx
import { styled } from 'styled-components'

const Button = styled.button`
	color: turquoise;
 `

return (
  <Button></Button>
)

 
{/*样式最终是被编译成hash类名 ⬇️ ⬇️ ⬇️*/}
<button {…props} className=“css-hashname”/>
```

## @emotion/styled<sup>[4]</sup>

1. 相对于 `styled-components`，`@emotion/styled` 体积更小。
2. 在 **SSR** 方面表现更为出色，支持**静态 CSS 提取**，减少首次加载时的样式计算。✅

```jsx
import styled from '@emotion/styled'
```

# css props

## @emotion/css<sup>[5]</sup>

> `@emption/css`首次提出了**`css props`**作为className的写法，这种独特的写法也可以作为一个大类。

styled component组件式的写法就避免不了**组件命名负担**，因此出现一种重新定义DOM的类名接收方式`css props`，
并提供了对象和模板字符串2种**内联**写法：

```jsx
// 通过@emotion/react的"jsx"来实现props注入的
import { jsx, css, Global, ClassNames } from '@emotion/react'

// css对象
(<div
   css={{
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'lightgreen'
      }
    }}
  >
    This has a hotpink background.
</div>)

// css模板字符串
(<div
   css={css`
     background-color: hotpink;
     &:hover {
      color: ${color};
     }
   `}
  >
    This has a hotpink background.
</div>)
```

## twin.macro 宏<sup>[6]</sup>

>  🚩 **`twin.macro` 集成了 `styled-components`、`@emotion/styled` 和 `tailwindcss`**，通过 Babel 宏提供简便语法糖。

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

### 结合 Tailwind CSS 的实用性与 CSS-in-JS 的灵活性

1. 单一的`styled-component`/`css props`会疲于手写CSS样式；
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

## CSS架构模式

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

## CSS变量方案

CSS变量的优势：

- 样式只生成一次
- 动态主题只修改变量
- 多主题只增加变量

CSS变量的劣势：

- 浏览起兼容性差（如IE）
- 动态修改 CSS 变量可能导致性能下降，尤其是在频繁更改时

因此自V4.17.0开始只是尝试[试验性](https://4x.ant.design/docs/react/customize-theme-variable-cn )引入；
而在V5.0中随着**天量的Design Token主题变量**，决定正式拥抱CSS变量方案，并且融合了CSS-in-JS能力解决了性能问题（文档：https://ant.design/docs/react/css-variables-cn ），兼容性问题将交给用户通过`cssVar`配置是否开启/关闭CSS变量模式。

# antd-style

antd内部使用的`@ant-design/cssinjs`写法极其复杂难懂，这是为了兼容历史包袱的产物，也为了换得相比 styled-component 和 emotion 都要好很多的性能。

虽然antd内部不能像JSS或者Styled Component那样的写法，因为职责和边界只在于提供高品质的基础组件；但是应用层如何使用样式方案， antd 并不限制。

🚩**因此为了将 v5 的 token 系统的推行变得更加顺利，ant design组织便提供了一个使用antd token系统的最佳cssinjs方案：`antd-style`<sup>[7]</sup>**。

## 结合 JSS 的函数特性 + css props快捷书写组合

`antd-style`是基于`emotion`二次封装，提供的核心api是`createStyles`，所以写法上包含了**JSS**和**css模板字符串**2种写法：

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

- 大量使用css props写法会导致：1)样式代码耦合 ，2）re-render性能缺陷
  *详见：[《Why We're Breaking Up with CSS-in-JS》](https://dev.to/srmagura/why-were-breaking-up-wiht-css-in-js-4g9b)*
- JSS的写法可以将Design Token变量很好地融入进去并得到缓存
- 两者的结合各取所长，非常适合业务应用和基于 antd 二次封装的组件库。



以上，就是CSS in JS目前所有的思想。

# Reference

- [1] **react-jss**: https://cssinjs.org/react-jss?v=v10.10.1
- [2] **@stylexjs/stylex**: https://stylexjs.com/docs/learn/styling-ui/defining-styles/
- [3] **styled-component**: https://styled-components.com/docs/basics#motivation
- [4]**@emotion/styled**: https://emotion.sh/docs/styled
- [5] **@emotion/css**: https://emotion.sh/docs/css-prop
- [6] **twin.macro**: https://github.com/ben-rogerson/twin.macro
- [7] **antd-style**: https://ant-design.github.io/antd-style/zh-CN/guide
