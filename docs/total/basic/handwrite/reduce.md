---
title: 节流防抖手写
author: RoleTang
date: '2025-09-12'
---


1. 多次执行一个事件，只会执行最后一次（输入框联想搜索）

   ```javascript
   // 防抖，一定时间内再次触发则延后执行
    const debounce = (fn, delay, immediate = false) => {
    let timer = null
    return (...args) => {
        if (timer) clearTimeout(timer)
        if (immediate && !timer) fn(...args) // 第一次立即执行
        timer = setTimeout(() => {
        if (!immediate) fn(...args) // 延迟执行
        timer = null
        }, delay)
    }
    }
   ```

2. 手写节流

   多次执行一个事件，在一定的时间内只会执行一次

   （页面的点击，scroll，浏览器缩放操作）

   ```javascript
   // 节流，一定时间内只触发一次
    const throttle = (fn, delay, immediate = true) => {
    let timer = null
    return (...args) => {
        if (!timer) {
        if (immediate) fn(...args) // 第一次立即执行
        timer = setTimeout(() => {
            if (!immediate) fn(...args) // 延迟执行
            timer = null
        }, delay)
        }
    }
    }
   ```

3.