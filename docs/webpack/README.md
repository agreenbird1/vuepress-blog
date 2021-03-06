---
title: webpack
author: RoleTang
date: '2022-07-11'
---

1. 文件监听原理

   轮询判断文件的最后编辑时间是否变化，达到一定条件之后告诉监听者此改变。

2. Webpack 的热更新原理

   Webpack 的热更新的核心就是客户端从服务端拉取更新后的文件。webpack-dev-server与浏览器维护了一个websocket链接。同时webpack会监听文件的变化，当文件变化的时候wds会向浏览器推送更新。然后浏览器便可以通过jsonp请求请求更新的资源，然后如何更新就是HotModulePlugin所决定的了。

3. 如何优化 Webpack 的构建速度？

   - 多进程打包：thread-loader
   - 图片压缩：image-webpack-loader
   - 缩小打包作用域：exclude确定loader作用范围
   - 使用cache-loader
   - 开启tree-shaking

4. 模块打包原理

   Webpack 实际上为每个模块创造了一个可以导出和导入的环境，本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。

5. 构建流程

   1. `合并参数`：将shell参数和配置文件参数进行合并
   2. 开始编译：将参数传递给compiler并加载plugin
   3. 确定入口：找到入口文件
   4. 编译模块：从入口文件开始，通过loader翻译所有模块以及他们依赖的模块
   5. 确定依赖关系：翻译完成后得到模块的最终内容以及依赖关系
   6. 根据入口和模块间的依赖，将模块组成chunk并输出

6. loader和plugin的区别

   1. loader

      loader本质上是一个函数，接收内容并转换然后输出。因为webpack只认识js，loader就是一个翻译官。

      配置在module.rules下

      loader 运行在打包文件之前

   2. plugin

      plugin就是插件，是基于事件流平台tapable的。可以扩建webpack的功能。webpack在生命周期中会广播很多事件，可以监听这些事件在合适的情况下调用不同的API实现不同的功能。

      配置在plugins

      plugins 在整个编译周期都起作用

7. 常用的plugin

   1. html-webpack-plugin

      简化html文件的构建流程

   2. mini-css-extract-plugin

      分离css样式文件

   3. css-minimizer-webpack-plugin

      压缩css文件

   4. clean-webpack-plugin

      清除打包的文件目录

8. 常见的loader

   1. file-loader：引入图片字体需要l
   2. url-loader：引入图片，可以使用base64格式
   3. image-loader：压缩处理图片
   4. css-loader：加载css，支持模块化
   5. style-loader：将css以style标签加入文件
   6. postcss-loader：添加css属性前缀
   7. less-loader：less转css
   8. babel-loader：es6转es5
   9. cache-loader：构建大文件的时候可以开启缓存

9. webpack和vite的区别

   1. webpack会先打包，然后启动开发服务器，请求服务器时直接给予打包结果。 而vite是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。
   2. 由于现代浏览器本身就支持ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像webpack那样进行打包合并。
   3. 由于vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite的优势越明显。
   4. 在HMR方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。
   5. 当需要打包到生产环境时，vite使用传统的rollup进行打包，因此，vite的主要优势在开发阶段。
   6. 另外，由于vite利用的是ES Module，因此在代码中不可以使用CommonJS
   7. ![image-20200929144416064](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fae07439b6c478f92d7033eb627c11e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
   8. ![image-20200929144957808](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/614f50eeed37481894341ade9d0802b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

10. webpack中Proxy的原理？

    通常proxy是用来做代理服务器，其基本行为就是接收到客户端的请求再转发给对应的服务器。

    因为即使是在开发环境下，也会存在跨域问题。但是跨域问题并不存在在服务器与服务器之间。

    `原理：`

    利用了`http-proxy-middleware` 这个`http`代理中间件，实现请求转发给其他服务器

11. webpack优化前端的手段

    - JS代码压缩：使用`terser-webpack-plugin`插件，在`optimization`中配置。
    - CSS代码压缩：使用``css-minimizer-webpack-plugin``插件，同样配置在`optimization`中。
    - Html文件代码压缩：使用``html-webapck-plugin``中的`minify`选项进行配置，比如`removeComments:true` 。
    - 文件大小压缩：`compression-webpack-plugin`，在`plugins`中配置
    - 图片压缩：``image-webpack-loader、``，配置在rules中，对应图片。
    - Tree Shaking

12. 文件指纹是什么？

    文件指纹是打包后输出的文件名的后缀。

    - `Hash`：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 `hash` 值就会更改
    - `Chunkhash`：和 `Webpack` 打包的 `chunk` 有关，不同的 `entry` 会产生出不同的 `chunkhash`
    - `Contenthash`：根据文件内容来定义 `hash`，文件内容不变，则 `contenthash` 不变