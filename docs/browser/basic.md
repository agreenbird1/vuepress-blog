---
title: 浏览器基础概念
author: RoleTang
date: '2022-07-26'
---

## 常见概念

1. URI&URL

   URI:统一资源标识符(uniform resource identifier URI)。

   Web上可用的每种资源（ HTML文档、图像、音频、视频片段、程序等）都由一个通用资源标识符进行定位。

    URI的格式由三部分组成：

      1. 访问资源的命名机制。
      2. 存放资源的主机名。
      3. 资源自身的名称，由路径表示。


   URL:统一资源定位符(uniform resource location URL)，是URI的特例。相当于是网络标准资源的地址。

   它是对可以从互联网上得到的资源的位置和访问方法的一种简洁的表示，是互联网上标准资源的地址。

   URL的格式一般也由下列三部分组成：

    1. 协议(或称为服务方式);
    2. 存有该资源所在的服务器的名称或IP地址(包括端口号);
    3. 主机资源的具体地址。


3. 回流(重排)

   当我们对 DOM 结构的修改引发 DOM 几何尺寸变化的时候，会发生`回流`的过程。

   - 一个 DOM 元素的几何属性变化，常见的几何属性有`width`、`height`、`padding`、`margin`、`left`、`top`、`border` 等等, 这个很好理解。
   - 使 DOM 节点发生`增减`或者`移动`。
   - 读写 `offset`族、`scroll`族和`client`族属性的时候，浏览器为了获取这些值，需要进行回流操作。
   - 调用 `window.getComputedStyle` 方法。

   当触发上述条件,会重新执行渲染过程

   ![image-20220305160003430](/browser/image-20220305160003430.png)

4. 重绘

   当 DOM 的修改导致了样式的变化，并且没有影响几何属性的时候，会导致`重绘`(`repaint`)。

   ![image-20220305160043510](/browser/image-20220305160043510.png)

5. GPU加速

   在知道了回流和重绘了之后,可以多使用如利用 CSS3 的`transform`、`opacity`、`filter`这些属性就可以实现合成的效果，也就是大家常说的**GPU加速**。能够跳过布局和绘制流程.

6. 实践意义

   - 避免频繁使用 style，而是采用修改`class`的方式。
   - 使用`createDocumentFragment`进行批量的 DOM 操作。
   - 对于 resize、scroll等事件进行防抖/节流处理。
   - 添加 will-change: tranform ，让渲染引擎为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。当然这个变化不限于`tranform`, 任何可以实现合成效果的 CSS 属性都能用`will-change(减少不必要的使用,因为会多大量计算)`来声明。


7. 浏览器内核

| 浏览器名称 | 内核                  | 补充                                                         |
| ---------- | --------------------- | ------------------------------------------------------------ |
| IE         | Trident               | 主要包含在 window操作系统的 IE浏览器中                       |
| firefox    | Gecko                 | Gecko的特点是代码完全公开，因此，其可开发程度很高            |
| Safari     | webkit                | 苹果公司自己的内核，包含WebCore排版引擎及JavaScriptCore解析引擎 |
| chrome     | Chromium/Blink/webkit | Blink是开源引擎WebKit中WebCore组件的一个分支                 |
| Opera      | blink/Webkit/Presto   | 现在跟随chrome的步伐，同时参与开发                           |

**浏览器内核常常也是我们说的浏览器引擎(排版引擎,页面渲染引擎)**

8. 浏览器线程

- GUI 渲染线程

  负责渲染浏览器界面HTML元素，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等。

  当界面需要重绘(Repaint)或由于某种操作引发回流(重排)(reflow)时,该线程就会执行。

- JavaScript引擎线程

  也称为JS内核,负责处理JavaScript脚本程序，例如V8引擎。

  由于JavaScript是可操纵DOM的，如果在修改这些元素属性同时渲染界面（即JavaScript线程和UI线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。

  所以GUI渲染线程与JavaScript引擎为互斥的关系.

- 事件触发线程

- 定时触发器线程

  `setInterval`与`setTimeout`所在线程

- 异步http请求线程