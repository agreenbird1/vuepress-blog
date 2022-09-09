---
title: rollup
author: RoleTang
date: '2022-09-09'
---

1. 生产环境bundle

   基于ESM下仍然难以做到完全`no-bundle`，会造成网络性能问题。

   优点：

   1. css代码分割。如果某个异步模块中引入了一些 CSS 代码，Vite 就会自动将这些 CSS 抽取出来生成单独的文件，提高线上产物的`缓存复用率`。
   2. 自动预加载。Vite 会自动为入口 chunk 的依赖自动生成预加载标签``<link rel="moduelpreload">``就是提前映射js模块。
   3. 异步 Chunk 加载优化。

2. 兼容插件机制

   无论是开发阶段还是生产环境，Vite 都根植于 Rollup 的插件机制和生态，如下面的架构图所示:![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db5342d894e649ca8a953e3880fc96fb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

   vite自己实现了一个 `Plugin Container`，用来模拟 Rollup 调度各个 Vite 插件的执行逻辑，而 Vite 的插件写法完全兼容 Rollup，因此在生产环境中将所有的 Vite 插件传入 Rollup 也没有问题。

3. 构建流程

    主要经历两个流程 `Build` 和 `Output`

    1. Build

       创建模块依赖图，初始化各个模块的AST以及各个模块之间的依赖关系。在这个阶段，并没有对模块进行打包，主要是存储模块间的依赖关系，同时暴露 generate 和 write 方法（都是进行打包的方法，区别在于后者会将打包后的产物写入磁盘）。此时便进入下一个阶段

    2. Output

       根据不同的依赖关系，以及自定义的拆包的策略。调用 generate 或者 write 方法进行产物的打包和输出即可。
