---
title: 函数柯里化
author: RoleTang
date: '2022-08-13'
---

柯里化（Currying）是一种关于函数的高阶技术。它不仅被用于 JavaScript，还被用于其他编程语言。

柯里化是一种函数的转换，它是指将一个函数从可调用的 f(a, b, c) 转换为可调用的 f(a)(b)(c)。

柯里化不会调用函数。它只是对函数进行转换。

作用：比如一个函数可以传递多个参数，那么我们可以固定前几个参数的值，返回一个新的函数。

``` js
/**
 * 1. 当参数还未达到时候，需要返回一个新的函数，这个函数能够继续接收剩余的参数
 * 2. 当参数长度满足时，则直接进行执行
 */
function rtCurrying(fn) {
    return function curried(...args) {
    	// 1.判断参数是否已经全部传递
      // 已经达到，直接执行
        if (args.length >= fn.length) return fn.apply(this, args)
    else {
            // 2.实现柯里化，
            // 未达到，需要返回一个新的函数，并递归的判断
            return function (...args2) {
                // 递归调用，若是参数达到则返回
                return curried.apply(this, [...args, ...args2])
            }
        }
    }
}
```