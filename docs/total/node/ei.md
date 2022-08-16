---
title: node总结
author: RoleTang
date: '2022-08-16'
---



1. express用到了什么？

   - `express.Router`：路由
   - `express.json`：解析请求体json格式数据（内置）
   - `express.urlencoded`：解析form-urlencoded格式数据（内置）
   - `cors`：cors中间件，处理跨域

2. koa用到了什么？

   - `koa.Router`：路由（中间件）
   - `koa-static`：挂载静态资源（中间件）

3. HTTP.Request的属性有哪些（类似req）？

   `url`：请求地址

   `httpVersion`：http协议的版本

   `method`：请求方法

   `headers`：请求头部

4. node中如何开启子进程？

   通过`child_process`模块，总共有四个方法开启：

   1. spawn: 启动一个子进程来执行命令；
   2. exec:  启动一个子进程来执行命令，与 spawn 不同的是，它有一个回调函数获知子进程的状况；
   3. execFile: 启动一个子进程来执行可执行文件；
   4. fork: 与 spawn 类似，不同点在于它创建 Node 的子进程只需指定要执行的 JavaScript 文件模块即可；

5. Node下的异步I/O模型

   `阻塞式I/O调用`：调用结果返回之前，当前线程处于阻塞态（阻塞态 CPU 是不会分配时间片的），调用线程只有在得到调用结果之后才会继续执行。

   `非阻塞式调用`：调用执行之后，当前线程不会停止执行，只需要过一段时间来检查一下有没有结果返回即可。

   问题：

   1. 并没有得到完整的数据，需要频繁的轮询查询结果。

   需要一个线程去查询结果。

   libuv提供了一个线程池，由线程池中的线程负责相关的操作，并通过轮询方式等待结果。获取到结果之后会将对应的回调放到事件循环中。那么后续就可以通知JavaScript执行回调函数。

6. 阻塞、非阻塞，异步、非异步的区别

   阻塞和非阻塞是相对于被调用者的。

   异步、非异步是相对于调用者的（比如异步不会阻塞后续的脚本的执行）。

7. 如何判断是文件还是文件夹？

   ```js
   const fs = require('fs');
   var stat = fs.statSync(path); // stat为文件的统计信息
   stat.isFile() //是文件吗
   stat.isDirectory() //是文件夹吗
   ```

8. 如何实现文件监听

   使用`fs.watch`方法

9. npm发布包流程

   1. 注册一个npm账号并在本地进行登陆
   2. 初始化package.json文件，填写字段
   3. 再使用 npm publish发布即可。



10. npm install流程

    npm install -D(--save-dev) 开发环境

    npm  install -S(--save) 生产环境

    dependencies：无论开发环境还是生产环境都需要依赖的包

    devDependencies：开发环境依赖的包

    peerDenpendencies：项目依赖的对等依赖，即是你依赖的某个包是以另外一个宿主包为前提的。如element-plus依赖于vue3

    ![image](/node/install流程.png)

11. nodejs是单线程的吗？

    node并不是真正的单线程架构模型   ，它还有网络I/O、磁盘I/O等I/O线程。但是是由更底层的`libuv`处理的。JavaScript代码永远运行在v8引擎上的。

    `优势`：

    - 单线程就一个线程在玩，省去了线程间切换的开销
    - 还有线程同步的问题，线程冲突的问题的也不需要担心

12. node中的事件循环机制

    事件循环是 Node.js 处理非阻塞 I/O 操作的机制——尽管 JavaScript 是单线程处理的——当有可能的时候，它们会把操作转移到系统内核中去。

    在 node.js 中的一次事件循环中，被称作是一次 tick

    node中的宏任务：setTimeout、setInterval、setImmdiate、I/O操作等。

    微任务：Promise的方法、nextTick等。

    看图：

    ![GitHub](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709951e658af197~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

    整个阶段分为：输入数据阶段(incoming data)->轮询阶段(poll)->检查阶段(check)->关闭事件回调阶段(close callback)->定时器检测阶段(timers)->I/O事件回调阶段(I/O callbacks)->闲置阶段(idle, prepare)->轮询阶段...



    `timers`：timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。 同样，在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行。

    `poll`：

    主要操作便是poll阶段，很多异步的任务执行完后都是由poll轮询查询结果之后再去进行对应的回调的执行的。同时对应的poll阶段的这些查询过程其实就对应了这些事件循环阶段的优先级。

    1. 有定时器到时？拿出来执行，并回到timers阶段（poll阶段会计算阻塞和轮询I/O的时间）

    2. 查看轮询回调函数队列。

       `不为空`，进行回调执行，直至队列空或者到达回调执行上限。

       `为空时`

       - 有setImmediate回调，进入check阶段执行
       - 没有，便会等待回调并执行

    `check` ：执行setImmediate回调

13. node如何解决跨域

    设置cors响应头：`Access-Control-Allow-Origin`

14. require查找规则

    每次require一次其实相当于运行了一次对应的模块，但其实只有第一次会运行，然后将模块缓存（module有一个loaded属性）。后面再次运行则直接读取缓存。

    require加载是同步加载，就是说我require一个模块，当前模块require了其他模块，则直接同步执行。

    1.`是否为核心模块`

    1. 是否在核心模块缓存区
    2. 否则返回核心模块并缓存

    2.`是否以'/'、'./'、'../'等开头`=>自定义模块

    1. 查找对应文件
    2. 查找.js
    3. 查找.json
    4. 查找.node
    5. 查找是否有对应目录
       2. 查找index.js文件
       3. 查找index.json文件
       4. 查找index.node文件

    3.`否则为普通模块`

    `是否在文件缓存区`=>是则直接返回

    从node_modules下向外层查找

15. require的循环引用

    与加载机制有关：

    ![image](/node/require加载.png)

    类似于有向图，是从最开始的一个进行深度优先遍历。

    同时对于循环引用，已经引用过的模块不会重新加载

16. koa

    并不是实现了更强的功能，而是更简单的实现了功能。

    洋葱模型：那就是类似剥洋葱。从左边最外层剥到里层再剥出来。

    中间件的代码的执行被next函数分为了两部分，每个中间件又被当作洋葱的一层。最先use的中间件的next前面的代码会先执行，然后再执行下一个中间件next函数之前的代码，直到最后一个中间件执行。然后再执行next后面的代码，最终向外一直到第一个中间件的next后面的代码的执行。

    ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/461dbf9917634fe1a1b578237ad78600~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
