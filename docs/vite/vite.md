---
title: vite
author: RoleTang
date: '2022-07-11'
---

``vite架构图：``

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02910cd2c6894bcdb3a9e0fc9e59f4c2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

开发环境下使用esbuild做预构建，并实现了类似rollup的插件机制，通过plugin container，实现兼容，站在rollup的肩膀上，保质（rollup已经诞生多年，上亿的下载）。

为什么学习vite？它一定程度上解决了前端开发绕不开的几个痛点

- 模块化方面，提供模块加载方案，并兼容不同的模块规范。
- 语法转译方面，配合 `Sass`、`TSC`、`Babel` 等前端工具链，完成高级语法的转译功能，同时对于静态资源也能进行处理，使之能作为一个模块正常加载。
- 产物质量方面，在生产环境中，配合 `Terser`等压缩工具进行代码压缩和混淆，通过 `Tree Shaking` 删除未使用的代码，提供对于低版本浏览器的语法降级处理等等。
- 开发效率方面，构建工具本身通过各种方式来进行性能优化，包括`使用原生语言 Go/Rust`、`no-bundle`等等思路，提高项目的启动性能和热更新的速度。

Vite 所倡导的`no-bundle`理念的真正含义: **利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载**，而不是**先整体打包再进行加载**。相比 Webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程，这也是它为什么快的一个重要原因。

对于每一个import，其就是一个网络请求。基于原生的esm，让浏览器代替打包工具做事（加载模块和依赖），也提高了构建速度。

1. 依赖预构建

   做了两件事情：

   1. 将其他格式（umd、cjs）的产物转换成esm的代码，并添加`type="module"`使之浏览器能够正常加载
   2. 二是打包第三方库的代码，将各个第三方库的分散的文件合并到一起，减少HTTP请求的数量，避免页面加载性能劣化（减少请求瀑布流的问题，因为每一个import都会发送一次请求，如果层级太深太多，会发送非常多的请求）。

   都是由`Esbuild`进行完成，而不是`Rollup`。

   ```js
   // 1 兼容cjs、umd
   import { createApp } from 'vue'
   // 本身浏览器无法识别，因为vue是node_modules下的依赖
   // 会进行预构建、转换
   import { createApp } from './node_modules/...'


   // 2 性能提升、优化
   import { _debounce } from 'lodash-es'
   // lodash_es本身有很多的文件
   // 但只会引入 _debounce
   ```

2. 自动依赖搜索以及缓存

   基于esbuild实现的依赖加载，所以当发现依赖的模块并不存在在缓存中，会自动的进行搜索。同时将依赖添加到缓存。缓存文件一般存放在

   **node_modules**下的**.vite**文件夹中

   同时，当

   - 依赖变化时候会重新预构建
   - lockfile（npm中是package-lock.json，pnpm是pnpm-lock。yaml）变化时候会重新构建
   - config文件中配置cacheDir改变后



3. 自定义行为

   其实就是指定哪些进行加载

   ```js
   optimizeDeps: {
     include: [],
     exclude: [],
   }
   ```

4. HMR

   vite中的hmr是基于ESM模块进行实现，速度相比于`parcel`、`webpack`等更加快速。

   HMR 的全称叫做`Hot Module Replacement`，即`模块热替换`或者`模块热更新`。在计算机领域当中也有一个类似的概念叫`热插拔`，我们经常使用的 USB 设备就是一个典型的代表，当我们插入 U 盘的时候，系统驱动会加载在新增的 U 盘内容，不会重启系统，也不会修改系统其它模块的内容。HMR 的作用其实一样，就是在页面模块更新的时候，直接把**页面中发生变化的模块替换为新的模块**，同时不会影响其它模块的正常运作。
   vite中共`HMR API`的使用：

基于esm模块实现的hmr，会在import.meta元信息上添加一个hot对象。

```typescript
interface ImportMeta {
  readonly hot?: {
    readonly data: any
    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: string[], cb: (mods: any[]) => void): void
    prune(cb: () => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
  }
}
```

`accept`方法即是相当于接受某一个模块的改动，将其作为边界进行模块替换。

- 自身更新
- 子模块更新
- 多个子模块更新

在接受了模块更新之后，也知晓了它们便是模块更新的边界。再进行热替换，便不会影响到其他的模块的内容。