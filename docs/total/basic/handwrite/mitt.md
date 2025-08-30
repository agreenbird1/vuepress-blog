---
title: 事件总线实现
author: RoleTang
date: '2025-08-30'
---

```javascript
class EventBus {
    constructor() {
        this.tasks = {}
    }
    $emit(eventName, payloads) {
        const events = this.tasks[eventName]
        if (events) {
            [...events].forEach((event) => {
                event.cb && event.cb(payloads)
                event.once && this.$off(eventName, event.cb)
            })
        }
    }
    $on(eventName, cb) {
        if (typeof cb !== 'function') throw new Error('cb is not a function')
        if (!this.tasks[eventName]) this.tasks[eventName] = []
        this.tasks[eventName].push({ cb })
    }
    $once(eventName, cb) {
        if (typeof cb !== 'function') throw new Error('cb is not a function')
        if (!this.tasks[eventName]) this.tasks[eventName] = []
        this.tasks[eventName].push({ cb, once: true })
    }
    $off(eventName, cb) {
        if (typeof cb !== 'function') throw new Error('cb is not a function')
        const events = this.tasks[eventName]
        if (events) {
            const index = events.findIndex((i) => i.cb === cb)
            if (index !== -1) events.splice(index, 1)
        }
    }
}

const eventBus = new EventBus()
eventBus.$on("test1", (p) => {
    console.log("test1 - 1", p)
})

const test12 = (p) => {
    console.log("test1 - 2", p)
}
eventBus.$on("test1", test12)

eventBus.$once("test1", (p) => {
    console.log("test1 - once", p)
})

eventBus.$emit("test1", {})
eventBus.$emit("test1", {})

eventBus.$off("test1", test12)

eventBus.$emit("test1", {})
// test1 - 1 {}
// test1 - 2 {}
// test1 - once {}
// test1 - 1 {}
// test1 - 2 {}
// test1 - 1 {}
```
