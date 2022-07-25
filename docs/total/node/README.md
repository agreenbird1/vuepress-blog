---
title: node知识
author: RoleTang
date: '2022-07-25'
---

## Node内置模块

1. 对process的理解

   `process` 对象是一个全局变量，提供了有关当前 `Node.js `进程的信息并对其进行控制。

   常用的属性：

   - `process.env`，环境变量，例如`process.env.NODE_ENV`可以获取不同环境下的配置信息。
   - ``process.nextTick``，类似queueMicrotask，加入微任务队列。

2. http

   http response参数

   http request参数


## npm相关

1. 版本相关：semver

   由三部分组成：[major, minor, patch]

   - `major`: 当你发了一个含有 Breaking Change 的 API
   - `minor`: 当你新增了一个向后兼容的功能时
   - `patch`: 当你修复了一个向后兼容的 Bug 时

   对于 `~1.2.3` 而言，它的版本号范围是 `>=1.2.3 <1.3.0`

   对于 `^1.2.3` 而言，它的版本号范围是 `>=1.2.3 <2.0.0`