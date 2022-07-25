---
title: 节流防抖手写
author: RoleTang
date: '2022-07-25'
---


1. 多次执行一个事件，只会执行最后一次（输入框联想搜索）

   ```javascript
   function debounce(fn, delay) {
       let timer = null
       return function(...args) {
           if(timer) clearTimeout(timer)
           timer = setTimeout(() => {
               fn.apply(this, args)
               timer = null
           }, delay)
       }
   }
   ```

2. 手写节流

   多次执行一个事件，在一定的时间内只会执行一次

   （页面的点击，scroll，浏览器缩放操作）

   ```javascript
   function throttle(fn, delay) {
   	let timer = null
       return function(...args) {
           if(timer) return
           timer = setTimeout(() => {
               // 绑定this
               fn.apply(this, ...args)
               timer = null
           }, delay)
       }
   }
   ```

3.