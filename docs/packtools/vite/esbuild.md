---
title: esbuild
author: RoleTang
date: '2022-09-09'
---

1. 为什么快？

   1. **使用 Golang 开发**，构建逻辑代码直接被编译为原生机器码，而不用像 JS 一样先代码解析为字节码，然后转换为机器码，大大节省了程序运行时间。

   2. **多核并行**。内部打包算法充分利用多核 CPU 优势，所有的步骤尽可能并行，这也是得益于 Go 当中多线程共享内存的优势。

   3. **从零造轮子**。 几乎没有使用任何第三方库，所有逻辑自己编写，大到 AST 解析，小到字符串的操作，保证极致的代码性能。

   4. **高效的内存利用**。Esbuild 中从头到尾尽可能地复用一份 AST 节点数据，而不用像 JS 打包工具中频繁地解析和传递 AST 数据（如 string -> TS -> JS -> string)，造成内存的大量浪费。

2. 作为依赖预构建的工具

   见vite依赖预构建节。

   缺点：

   - 不支持降级到 `ES5` 的代码。这意味着在低端浏览器代码会跑不起来。
   - 不支持 `const enum` 等语法。这意味着单独使用这些语法在 esbuild 中会直接抛错。
   - 不提供操作打包产物的接口，像 Rollup 中灵活处理打包产物的能力(如`renderChunk`钩子)在 Esbuild 当中完全没有。
   - 不支持自定义 Code Splitting 策略。传统的 Webpack 和 Rollup 都提供了自定义拆包策略的 API，而 Esbuild 并未提供，从而降级了拆包优化的灵活性。

3. 单文件编译——作为TS和JSX的编译工具

   vite将esbuild plugin其用作编译器，但缺点便是不能进行类型检查。在使用脚本 `vite build`时候也会先执行`tsc`进行ts类型检查。

4. 代码压缩

   vite将esbuild minify其用作压缩器。

   代替terser(uglyfy-es & ulgyfy-js的合并版)，因为会做大量的`AST`生成操作，但`AST`之间却又不能共享，所以会有大量的重复操作，时间变得很长。

   而Esbuild 这种从头到尾**共享 AST** 以及**原生语言编写**的 Minifier 在性能上更优。



5. 打包API（build（主要），buildSync（同步build，不推荐），serve（开发时））

   [esbuild - build API](https://esbuild.docschina.org/api/#)

6. 单文件转译（Transform API）

   实现ts、jsx等单文件的转译

7. esbuild 插件

   插件开发其实就是基于原有的体系结构中进行`扩展`和`自定义`。`其实相当于是对符合条件的import模块进行额外的处理`。一个插件包含了如下内容

   ```js
   let rtPlugin = {
     name: "rt",
     setup(build) {
       // build中包含了
       // initialOptions 初始化esbuild 进行打包时候传入的配置
       // resolve
       // onStart（构建开启） onEnd（构建结束） onResolve（路径解析，每一个由esbuild打包模块在import的时候都会调用） onLoad（模块内容加载） 一些生命周期钩子
       // esbuild
       console.log(build);
       build.resolve(
         {
           filter: /^https?:\/\//,
           // 这里的namespace是筛选之前的钩子设置的命名空间
         },
         (args) => ({
           namespace: "http-url", // 这个是当前自己规定的命名空间
           path: args.path,
         })
       );
     },
   };
   ```

   插件实战

   ```js
   /**
    * 解决 Esbuild 原生不支持通过 HTTP 从 CDN 服务上拉取对应的第三方依赖资源
    *
    */

   // 返回一个对象
   // 包含name和setup（函数）两个属性
   module.exports = () => ({
     name: "esbuild:http",
     setup(build) {
       let https = require("https");
       let http = require("http");

       //1.拦截对应的cdn请求
       build.onResolve({ filter: /^https?:\/\// }, (args) => ({
         namespace: "http-url",
         path: args.path,
       }));

       //2.处理多重依赖的问题
       build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => {
         console.log("args.path:", args.path);
         console.log("args.importer:", args.importer);
         console.log("URL:", new URL(args.path, args.importer).toString());
         return {
           // 解析相对路径
           path: new URL(args.path, args.importer).toString(),
           namespace: "http-url",
         };
       });

       //2.请求cdn资源
       build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
         let contents = await new Promise((resolve, reject) => {
           function fetch(url) {
             console.log(`Downloading: ${url}`);
             // 根据不同的cdn类型使用不同的库进行请求
             let request = url.startsWith("https") ? https : http;
             let req = request
               .get(url, (res) => {
                 // 重定向
                 if ([301, 302, 307].includes(res.statusCode)) {
                   fetch(new URL(res.headers.location, url).toString());
                   // req.abort(); @deprecated — Since v14.1.0,v13.14.0 - Use destroy instead.
                   req.destroy();
                 } else if (res.statusCode === 200) {
                   // 流式数据接收
                   let chunks = [];
                   res.on("data", (chunk) => chunks.push(chunk));
                   // on 监听的 data 是 stream 数据
                   // 将 Buffer | Unit8Array 类型的数组合并
                   // https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html#static-method-bufferconcatlist-totallength
                   res.on("end", () => resolve(Buffer.concat(chunks)));
                 } else {
                   reject(
                     new Error(`GET ${url} failed: status ${res.statusCode}`)
                   );
                 }
               })
               // 传入的应该是一个 listener ，所以不需要 reject()
               .on("error", reject);
           }

           fetch(args.path);
         });
         return {
           contents,
         };
       });

       build.onEnd((result) => {
         for (const key in result) {
           console.log(key + ": ", result[key]);
         }
       });
     },
   });

   ```

