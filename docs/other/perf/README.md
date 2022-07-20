---
title: 项目性能优化
author: RoleTang
date: '2022-07-15'
---

## 常见的性能指标
需要衡量的重要指标 #
[Time to First Byte (TTFB)](https://web.dev/ttfb/)
[First Contentful Paint 首次内容绘制 (FCP)](https://web.dev/fcp/)
[Largest Contentful Paint 最大内容绘制 (LCP)](https://web.dev/lcp/)
[First Input Delay 首次输入延迟 (FID)](https://web.dev/fid/)
[Time to Interactive 可交互时间 (TTI)](https://web.dev/tti/)
[Total Blocking Time 总阻塞时间 (TBT)](https://web.dev/tbt/)
[Cumulative Layout Shift 累积布局偏移 (CLS)](https://web.dev/cls/)
[Interaction to Next Paint (INP)](https://web.dev/inp/)


## seo优化

1. SSR服务端渲染
    对于`vue`项目，完全可以使用`nuxtjs`框架进行渲染，通过其`API`便能实现一个首屏渲染的`web`应用

**权衡之处**：

- 开发条件所限，浏览器特定的代码，只能在某些生命周期钩子函数（lifecycle hook）中使用；一些外部扩展库（external library）可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 环境和部署要求更高，需要Node.js server运行环境；
- 高流量的情况下，需要准备相应的服务器负载，并明智地采用缓存策略。

2. 预渲染（推荐）
如果你只是用来改善少数营销页面（例如： /，/about,/contact等=）的SEO，那么你可能需要预渲染。无需使用Web服务器实时动态编译HTML，而是使用预渲染方式，在构建时（build time）简单地生成针对特定路由等静态HTML文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。


## 网络优化。包括 HTTP2、DNS 预解析、Preload、Prefetch等手段。

1. 懒加载：图片懒加载、路由懒加载？

2. CDN优化。（如何配置？`external`配置）

3. `http`缓存，响应头配置

4. `preload`当前页面马上就会需要的内容，会尽早的请求该资源。`prefetch`当前页面不会需要但下个页面需要的内容，它的请求级别会降低到最低

5. 服务端压缩，或则开启`gzip`压缩减小产物体积，加快请求速度

## 资源优化。包括构建产物分析、资源压缩、产物拆包、按需加载等优化方式。

1. `tree-shrinking`：移除dead-code，缩小代码体积。

    `tree-shaking原理`：基于esm进行静态分析，通过AST将不需要的函数进行移除，从而减小打包体积。因为esm要求导入都需要写在模块的顶层，那么就能够快速的确定所依赖的模块。
    1. 先收集模块并导出依赖关系图。
    2. 遍历依赖关系图标记导出的变量是否被使用。
    3. 生成产物时候若是没有被使用则删除代码（terser）。

开启：

```js
// webpack 中
module.exports = {
    optimization: {
        usedExports: true, // 识别无用代码
        minimize: true,    // 将无用代码在打包中删除
        concatenateModules: true, // 尽可能将所有模块合并输出到一个函数中
    }
}

// vite2 中
// 因为 vite 基于 rollup 实现，默认就开启了 tree shaking
```
2. 如何优化 Webpack 的构建速度？

    - 多进程打包：thread-loader
    - 图片压缩：image-webpack-loader
    - 缩小打包作用域：exclude确定loader作用范围
    - 使用cache-loader
    - 开启tree-shaking

3. `压缩`：gizp压缩（webpack、vite等开启的方式）

4. 如何优化 Webpack 的打包？

    - JS代码压缩：使用`terser-webpack-plugin`插件，在`optimization`中配置。（webpack4开始只要切换模式到production就可以开启压缩（内部使用UglifyJsPlugin））
    - CSS代码压缩：使用``css-minimizer-webpack-plugin``插件，同样配置在`optimization`中。
    - Html文件代码压缩：使用``html-webapck-plugin``中的`minify`选项进行配置，比如`removeComments:true` 。
    - 文件大小压缩：`compression-webpack-plugin`，在`plugins`中配置
    - 图片压缩：``image-webpack-loader、``，配置在rules中，对应图片。
    - Tree Shaking
        webpack开启压缩css、js、html的方法

压缩文件,去除多余的空格等

5. 小图片使用base64格式（url-loader）

## 性能、项目优化：js计算，书写规范，vue项目api使用等

### js性能优化
1. 尽量避免对`dom`频繁的操作，比如删除增加移动。因为会触发回流和重绘。
2. 如果需要操作`dom`，可以`createDocumentFragment`创建一个虚拟节点
3. 当有很复杂大量的数据进行计算的话，可以单独开一个`worker`线程进行计算。
4. 慎用全局变量，会造成空间浪费。同时作用域链查找的时候会增加性能开销。
5. 比如`for`循环的时候将数组的`length`属性进行保存，而不是一直进行访问。
6. 当`if-else`嵌套过多时候可以选择使用`switch`而不是多个`if-else`
7. dom操作方面：尽量少操作、使用事件委托
8. 当涉及到大量复杂的计算的时候，可以考虑使用`web worker`进行优化，在音视频中比较常用


### vue优化

1. 在合适的使用使用shallowRef和shallowReactive进行响应式数据

2. 减少不必要的组件抽离：比如一个for循环中本来需要渲染的东西是很少的，只是展示一些单纯的数据，就不需要再将其进行组件抽离。可以减少很多次组件实例的渲染。

3. v-once渲染只需要渲染一次的元素

4. 合理的使用生命周期，使用场景

5. 过滤api接口的数据，object.freeze()（引出vue的数据劫持原理，为什么要过滤掉没用的数据）

6. 那如果是静态展示居多的话可以使用SSR进行渲染

7. 适当采用 keep-alive 缓存组件

8. 防抖、节流运用

9. 防止内部泄漏，组件销毁后需要把全局变量和事件销毁

10. 对象层级不要过深，否则性能就会差

11. 不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）

12. v-if 和 v-show 区分使用场景

13. computed 和 watch 区分使用场景

14. v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if


### 特定项目场景优化
1. 长列表渲染优化

    1. 虚拟列表
    2. 无限加载
    3. 滑动过快时候不显示