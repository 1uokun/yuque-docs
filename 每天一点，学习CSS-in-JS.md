# JSS (CSS-in-JS)

> JSS（CSS-in-JS）是一种技术，而不是一个具体的库实现。
>
> 简单来说 CSS-in-JS 就是将应用的CSS样式写在JavaScript文件里面，而不是独立为.css/less/scss之类的文件。
> 这样就可以在CSS中使用JS的模块声明、变量定义、函数调用和条件判断等语言特性来提供灵活的可拓展的样式定义。

## JSS

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



## Handless UI

✅交互
❌样式

```jsx
import {Dialog} from '@headlessui/react'


<Dialog open={true} onClose={} className="relative z-50">
</Dialog>
```



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

# 课外题

## 参考

- https://www.cnblogs.com/gfhcg/p/17259022.html



## 《我们为何弃用css-in-js》

> https://cloud.tencent.cosm/developer/article/2170891 
> 个人理解：因为不支持NextJS的SSR❓



## tailwindcss 原理

>  https://tailwindcss.com/docs/installation