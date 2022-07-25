---
title: Html常见面试题
author: RoleTang
date: '2022-04-12'
---

1. title与h1的区别、b与strong的区别、i与em的区别？

   - title属性没有明确意义只表示是个标题（也是head标签中唯一不可或缺的标签），H1则表示层次明确的标题，对页面信息的抓取有很大的影响
   - strong标签有语义，是起到加重语气的效果（搜索引擎更侧重），而b标签是没有的，b标签只是一个简单加粗标签。
   - i为斜体，表示区分其他文本、em表示强调的文本

2. html5的离线存储

   **AppCache**

   `离线存储指的是`：在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

   `原理`：会根据cache.manifest文件指定的内容，缓存对应的文件。离线时候使用这些离线的资源。

   `<html lang="en" manifest="index.manifest">`



   **Service worker**

   `三要素`

   ![PWA配置三要素.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a05af63d9184c9d8c1a1abd644d107b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

   核心工作机制：

   一个操作依赖于另一个操作的成功执行，便是promise

3. link标签以及其优先级控制

   用于加载外部资源。

   通常用于加载css样式表

   `<link rel="stylesheet" href="./index.css">`

   `rel`属性是关系的意思，它的值是`stylesheet`表示使用的是样式表。

   `href`表示资源的地址

   `rel`的功能远不于此：

   - `preload（预加载）`：将当前的资源等级提升到最高（先于其他资源）同时将其下载，但不负责将资源嵌入到页面。会配合`as`属性使用，比如`css`文件就是`style`。

     **应用场景**：1. 字体的先加载，放置字体突然变化。

   - `prefetch（预提取）`：将当前资源优先级提至最低，浏览器认为当前资源目前不会被用到，但下一个页面可能会用到。  在其他资源加载好了之后，才下载缓存该资源。

     **应用场景**：1. 当工具类官网介绍工具时候，可以使用`prefetch`，加载相关的资源，提高页面进入速度。

   - `preconnect`：提前和目标服务器进行连接。整个连接过程包括：DNS解析、TCP三次握手、HTTP/HTTPS连接。

     **应用场景**：1. 视频不播放，但先建立好连接

   - `dnsprefetch`：预先进行DNS解析

4. label标签

   相当于页面中某个元素的说明，当点击label的时候可以转焦到表单控件上

   ```html
   <label for="mobile">Number:</label>
   <input type="text" id="mobile"/>

   <!-- 或 -->
   <label>Date:<input type="text"/></label>
   ```



5. form里常用的元素

   input：type可以为text、radio（单选）、password、checkbox（多选）、submit（提交按钮）、date等等

   select+option下拉框等

   label标签

6. 音视频标签等属性

   `video`：嵌入视频资源

   `audio`：嵌入音频资源

   其中属性大致相同

   - `autoplay`：自动播放
   - `controls`：用户是否可以控制
   - `loop`：是否循环播放
   - `src`：嵌入的视频的url

   除了使用src属性指定，还可以使用`source`标签

   `source`：可以为`video`、`audio`指定多个媒体资源，浏览器会选定第一个支持的格式和源。

7. meta标签

   表示那些不能由其它 HTML 元相关元素（link、style等）表示的任何元信息。

   可设置的属性：

   `charset`：定义文档的字符编码

   `content`：此属性包含`http-equiv`或`name`属性的值

   `content-security-policy`：指定csp安全策略

   `content-type`：值必须是`text/html; charset=utf-8`

   `keywords`：页面关键词。

   `description`：页面的描述内容

8. 以前的路由和现在的路由

   `以前`后端路由占据主导地位。无论是jsp，还是php、asp，用户能通过URL访问到的页面，大多是通过后端路由匹配之后再返回给浏览器的。浏览器在地址栏中切换不同的URL时，每次都向后台服务器发出请求，服务器响应请求，在后台拼接html文件返回给前端，并且每次切换页面时，浏览器都会刷新页面。

   `现在`：前端路由是后来发展到SPA（单页应用）时才出现的概念。主要有history 和 hash两种模式

9. iframe => 内嵌的

   ​				优点：

   1. iframe能够原封不动的把嵌入的网页展现出来。

   2. 如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。

      缺点:

   3. iframe会阻塞主页面的onload事件；

   4. 会影响页面的加载

   5. 兼容性差

10. html5新特性？

    - 新增选择器 `document.querySelector`、`document.querySelectorAll`
    - 本地存储 `localStorage` 和 `sessionStorage`
    - 媒体播放的 `video` 和 `audio`
    - 语意化标签 `article`、`footer`、`header`、`aside`、`nav`、`section`

11. Doctype的作用是是什么？

    DOCTYPE 是用来声明文档类型和 DTD 规范的。声明位于 HTML 文档中的第一行，不是一个 HTML 标签，处于 html 标签之前。告知浏览器的解析器用什么文档标准解析这个文档，是XML还是HTML文件以及版本。

12. 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

    行内元素有：a b span img input select strong  i （强调的语气）

    块级元素有：div ul ol li dl dt dd h1 h2 h3 h4…p article

    空元素：

    - 常见: br hr link meta

13. 页面导入样式时，使用 link 和@import 有什么区别？

    link 属于 XHTML 标签，除了加载 CSS 外，还能用于定义 RSS, 定义 rel 连接属性等作用；而@import 是 CSS 提供的，只能用于加载 CSS;

    页面被加载的时，link 会同时被加载，而@import 引用的 CSS 会等到页面被加载完再加载;

14. 简述一下你对 HTML 语义化的理解？

    - 用正确的标签做正确的事情。

    - html 语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析;

    - 即使在没有样式 CSS 情况下也以一种文档格式显示，并且是容易阅读的;

    - 搜索引擎的爬虫也依赖于 HTML 标记来确定上下文和各个关键字的权重，利于 SEO（搜索引擎优化）;

    - 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

15. script标签为什么要放在body标签的底部，【defer async】

    - 单线程，js下载会阻塞页面渲染
    - `defer`：下载和加载都是异步的
    - `async`：下载是异步的，加载还是同步的（而且如果存在多个 async 的时候，它们之间的**执行顺序也不确定**，完全依赖于网络传输结果，谁先到执行谁。）

16. src 和 href的区别

    - `src`：把资源下载到页面中使**浏览器解析**的方式 ，会阻塞文档。同时下载的资源会嵌入到`src`的位置。
    - `href` 是超文本引用，它指向资源的位置，建立与目标文件之间的联系）

17. DOM(0~2)级事件分别有哪些

`DOM0`:将一个函数赋值给一个事件处理程序属性

包括：onclick、onmouseover、onmouseout等

`DOM2`：包括addEventListener、removeEventListener

18. opacity、display、visibility

opacity：透明度，设置为0仍然占用空间，可以响应绑定的事件。

display: none; 元素不展示，不占用空间，会触发回流，不会响应绑定的事件。

visibility：元素隐藏，占用空间，触发重绘，不会响应绑定的事件。

19. 一个网页，发起HTTP请求有多少种方式

link

href

src

background

与后台交互

form

jsonp

a

等标签

20. 伪类和伪元素，区别

`伪类`：是添加到选择器的关键字，指定要选择的元素的特殊状态，比如hover，last-child。

`伪元素`：伪元素为DOM树没有定义的虚拟元素。

根本区别是`伪元素`会新创建一个元素，不是存在在DOM文档上的

21. 页面跳转的几种方式

    1. `window.location.href="http://www.dayanmei.com/";`
    2. `window.navigate("top.jsp");//仅支持ie`
    3. `window.location.replace("http://www.dayanmei.com");`
    4. `window.history、back、go(-1);`

22. 如何禁止页面缩放

对document添加事件

    1. wheel事件，判断是否在滑动且是否同时按下了ctrl键，此时禁止默认事件
    2. keydown事件，判断是否按下了ctrl键和+/-键来禁止默认事件

需要注意addEventListener第三个参数需要设置passive为false，因为passive默认为true，此时代表listener永远不会阻止默认事件！！！

23. 上传文件，ajax上传文件

   使用input框上传文件，同时设置type属性为file。当然可以选择多文件上传，即添加multiply属性。

   然后可以使用input.files获取当前的文件，并封装进formData对象中进行发送。

   [FormData ](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)

   ```js
   // ajax
   const req = new XMLHttpRequest()
   const formData = new FormData()
   formData.set('file', input.files[0])
   req.open(method, url)
   req.send(formData)
   ```

24. grid布局

常用属性：

grid-template-columns

grid-template-rows

grid-template-areas

grid-column/row-gap

子元素：grid-area

25. BOM

`window`：BOM的核心对象是window，即是浏览器窗口的一个接口，又是全局对象。

`location`：表示当前的url地址。

`navigator`：主要用来获取浏览器的属性，区分浏览器类型。

`history`: 主要用来操作浏览器`URL（会话）`的历史记录

26. 如何获取滚动条的百分比

以body为例

可以获取整个内容的高度：`body.clientHeight`

然后获取屏幕的高度：`screen.heighth`

再获取卷曲的高度：`body.scrollTop`

百分比 = ` body.scrollTop / (body.clientHeight - screen.heighth)`

27. 哪些事件不支持冒泡

![image](/js/不支持冒泡.png)

28. 跨站？

[理解“同站”和“同源” (web.dev)](https://web.dev/same-site-same-origin/#same-site-cross-site)