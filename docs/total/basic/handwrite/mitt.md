---
title: 事件总线实现
author: RoleTang
date: '2022-07-25'
---

   ```javascript
   class Mitt {
     constructor() {
       this.tasks = {}
     }
     // 监听
     on(eventName, callback) {
       let handlers = this.tasks[eventName]
       if (!handlers) {
         handlers = [] // 考虑到一个eventName可以有多个回调
         this.tasks[eventName] = handlers
       }
       callback && handlers.push(callback)
       console.log(handlers)
     }
     // 触发
     emit(eventName, payload) {
       const handlers = this.tasks[eventName]
       if (!handlers) return
       handlers.forEach((handler) => handler(payload))
     }
     // 取消
     off(eventName, handler) {
         const handlers = this.tasks[eventName]
         if (!handlers) return
         handlers.splice(handlers.indexOf(handler), 1)
     }
   }

   ```

