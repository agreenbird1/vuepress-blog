---
title: axios问题
author: RoleTang
date: '2022-04-12'
---

`axios`是一个基于`promise`的网络请求库，可以用于nodejs和浏览器中。在`nodejs`使用的是原生`http`模块，在浏览器中使用的是`XMLHttpRequest`。

1. 拦截器

   可以设置

   1. 全局拦截器。

   2. 实例拦截器

   3. 也可以指定单个方法的请求拦截器

      即是自己配置，在发送某个请求之前查看配置中是否有interceptor，有的话调用一次

2. 如何取消请求

   `AbortController接口`

   abort（流产）

   ```js
   const controller = new AbortController();
   axios.get('/foo/bar', {
      // 需要传递一个signal
      signal: controller.signal
   }).then(function(response) {
      //...
   });
   // 取消请求
   controller.abort()
   ```

   以前使用的是`cancelToken`，现在已经废弃