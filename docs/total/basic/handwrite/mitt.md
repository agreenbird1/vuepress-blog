---
title: 事件总线实现
author: RoleTang
date: '2022-07-25'
---

```javascript
class mitt {
  constructor() {
    // 一个事件名 => 多个事件
    this.tasks = {}
  }

  $emit(taskName, payload) {
    const tasks = this.tasks[taskName]
    // 存放当前一次性的 task
    const removeTasks = []
    if (tasks) {
      tasks.forEach((cb) => {
        cb(payload)
        // 如果当前是只执行一次的函数，直接在执行之后将其关闭即可
        if (cb.once) {
          // 不能在这里执行删除，如果执行了，forEach循环就直接停止了
          // this.$off(taskName, cb)
          removeTasks.push(cb)
        }
      })
    }
    // 执行完毕后再进行删除
    removeTasks.forEach((cb) => this.$off(taskName, cb))
  }

  $on(taskName, cb) {
    if (!this.tasks[taskName]) {
      this.tasks[taskName] = []
    }
    this.tasks[taskName].push(cb)
  }

  // 只执行一次
  $once(taskName, cb) {
    if (!this.tasks[taskName]) {
      this.tasks[taskName] = []
    }
    // 直接在函数上进行标记
    cb.once = true
    this.tasks[taskName].push(cb)
  }

  $off(taskName, cb) {
    const tasks = this.tasks[taskName]
    if (tasks) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i] === cb) {
          tasks.splice(i, 1)
          // 改变了自身，i自减
          i--
          // 当是once时，直接跳出，防止多删
          if (cb.once) break
        }
      }
    }
  }
}
```
