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
- 对于只有`style`可以使用 `twin.macro`宏来实现**【tw className 生成➡️ 内联style】**