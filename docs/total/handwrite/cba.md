---
title: Call、Bind、Apply手写
author: RoleTang
date: '2022-07-25'
---

手写bind、apply、call

```javascript
// bind方法只是返回一个函数，并不执行
Function.prototype.rtBind = function (thisArg, ...argArray) {
  // argArray是绑定的时候便被预置进的参数
  thisArg =
    thisArg === null || thisArg === undefined ? window : Object(thisArg)
  thisArg.fn = this
  return function (...args) {
    // args 是调用返回函数时候传递的参数
    // 解决两次传参
    let finalArgs = [...argArray, ...args]
    return thisArg.fn(...finalArgs)
   }
}

// 注意：call与apply的区别仅是参数区别。
// call 接收参数列表
// apply接收参数数组
Function.prototype.rtApply = function (thisArg, args) {
    // null undefined => window
    // 基础类型封装对象
    thisArg =
        thisArg === null || thisArg === undefined ? window : Object(thisArg)
    // 从函数调用过来，所以this默认绑定指向函数对象
    thisArg.fn = this
    // 当没有参数传递的情况
    args = args || []
    return thisArg.fn(...args)
}

Function.prototype.rtCall = function (thisArg, ...args) {
    // null undefined => window
    // 基础类型封装对象
    thisArg =
        thisArg === null || thisArg === undefined ? window : Object(thisArg)
    // 从函数调用过来，所以this默认绑定指向函数对象
    thisArg.fn = this
    return thisArg.fn(...args)
}
```

