---
title: 第二章 框架设计的核心要素
author: RoleTang
date: '2022-07-28'
---

一个框架的设计，需要有多种核心的要素。
良好的封装以及错误提示，给用户更好的开发体验，不限于

1. 良好的错误提示
2. 良好的错误处理，由框架进行提供，减少用户的心智负担
3. 框架代码的体积（引入速度更快）
4. tree  shaking
   1. 无用代码
   2. 没有副作用的代码。可以使用**/*\_\_PURE\_\_*/**这段注释代码，提示打包工具这段代码可以被看成`dead code`，同时被移除。
5. 多种构建产物，支持多种环境。比如`IIFE`格式，支持浏览器直接引入；`esm`格式，支持`es Module`模块化引入等……
6. 完善的的`Typescript`支持，更好的维护性、自动提示、类型检验等等

开发体验是衡量一个框架的重要指标之一，因为它可以让你得到更多的用户支持，更加广泛的被认可。