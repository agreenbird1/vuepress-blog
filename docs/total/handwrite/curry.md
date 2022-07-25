---
title: 函数柯里化
author: RoleTang
date: '2022-07-25'
---

``` js
function rtCurrying(fn) {
    return function curried(...args) {
    	// 1.判断参数是否已经全部传递
        if (args.length >= fn.length) return fn.apply(this, args)
    else {
            // 2.实现柯里化
            return function (...args2) {
                // 递归调用，若是参数达到则返回
                return curried.apply(this, [...args, ...args2])
            }
        }
    }
}
```