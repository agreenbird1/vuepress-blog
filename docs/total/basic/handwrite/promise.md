---
title: Promise手写
author: RoleTang
date: '2022-07-25'
---

手写 promise，promise.all 等方法

promise 又被称作期约，通常用来描述一个异步操作是否成功或者失败以及其结果值。它拥有三种状态：

- `pending`：待定，暂时未知结果，既未兑现，也未失败。
- `fulfilled`：已兑现，表示成功
- `rejected`：已拒绝，代表失败

通常我们在创建一个`promise`对象的时候会传入一个回调函数。其参数便是对应成功和失败的回调。当使用`resolve`后即成功，`reject`即失败。`promise`对象的状态一经确认不会改变。

同时我们可以调用 then 方法获取 promise 对象的结果，同时 then 方法也是返回一个 promise 对象，所以可以采用链式调用的方法.

同时 promise 也有几个静态方法比如

- `all`：接收一个 iterable 类型（数组、map），返回所有成功的 promise 的结果，如果有一个失败，就立即返回失败的结果

- `any`：接收同上，返回第一个执行成功的结果，若是全部失败则报错

- `allSettled`：接收同上，返回所有的结果，会包含状态和结果，结果类似如下

  ```js
  ;[
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: 2 },
  ]
  ```

- `race`：接收同上，返回第一个执行的结果

- `resolve`：返回一个带有拒原因的`Promise`对象

- `reject`：返回一个带有成功结果的`Promise`对象

```javascript
class RtPromise {
  // promise 的参数是传入一个有 resolve 和 reject 的回调函数
  constructor(executer) {
    this._state = 'pending' // fulFiled | rejected
    this._value = undefined // 成功的返回值
    this._reason = undefined // 失败的原因
    this._onFulFiled = [] // 成功的回调函数
    this._onRejected = [] // 失败的回调函数

    const resolve = (value) => {
      // 状态只设置一次
      if (this._state === 'pending') {
        // 如果指向本身，报错
        if (value === this)
          return reject(new Error('Chaining cycle detected for promise'))
        // 如果是一个 promise，直接返回
        if (value instanceof RtPromise)
          return value.then(
            (v) => resolve(v),
            (r) => reject(r)
          )
        // thenable 对象没有处理
        // 之前的调用也是在微任务队列里，所以执行前也还需要再次判定
        queueMicrotask(() => {
          if (this._state === 'pending') {
            this._state = 'fulFiled'
            this._value = value
            // resolve执行后链式执行 then 的内容
            this._onFulFiled.forEach((fn) => fn())
            this._onFulFiled = []
          }
        })
      }
    }
    const reject = (reason) => {
      if (this._state === 'pending') {
        queueMicrotask(() => {
          if (this._state === 'pending') {
            this._state = 'rejected'
            this._reason = reason
            this._onRejected.forEach((fn) => fn())
            this._onRejected = []
          }
        })
      }
    }

    try {
      executer(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulFiled, onRejected) {
    onFulFiled = onFulFiled || ((v) => v)
    onRejected =
      onRejected ||
      ((err) => {
        throw err
      })
    // then 返回一个新的 promise
    return new RtPromise((resolve, reject) => {
      console.log(this._state)
      // then 总是在 微任务 队列中执行
      // 如果这里不加 queueMicrotask 包裹的话, executor 则是同步执行了
      if (this._state === 'fulFiled') {
        queueMicrotask(() => {
          resolve(onFulFiled(this._value))
        })
      } else if (this._state === 'rejected')
        queueMicrotask(() => {
          reject(onRejected(this._reason))
        })
      else {
        this._onFulFiled.push(() => {
          queueMicrotask(() => {
            resolve(onFulFiled(this._value))
          })
        })
        this._onRejected.push(() => {
          queueMicrotask(() => {
            resolve(onFulFiled(this._value))
          })
        })
      }
    })
  }
  // 简写的 then
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  // 简写的 then
  finally(onFinally) {
    return this.then(
      () => onFinally(),
      () => onFinally()
    )
  }
  static resolve(val) {
    // 如果是一个promise，直接返回
    if (val instanceof RtPromise) return val
    return new RtPromise((resolve) => resolve(val))
  }
  static reject(reason) {
    return new RtPromise((resolve, reject) => reject(reason))
  }
  // 返回所有成功的结果
  // 否则返回第一个失败的结果
  static all(iterable) {
    return new RtPromise((resolve, reject) => {
      let remaining = 0
      let index = 0
      let res = []
      for (const promise of iterable) {
        const i = index++
        remaining++
        promise.then(
          (val) => {
            res[i] = val
            if (--remaining === 0) resolve(new AggregateError(res))
          },
          reject
        )
      }
      if (index === 0) resolve(res)
    })
  }
  // 返回第一个成功的结果
  // 如果所有都被拒绝，返回被拒绝的数组
  static any(iterable) {
    return new RtPromise((resolve, reject) => {
      const reasons = []
      let remaining = 0
      let index = 0
      let res = []
      for (const promise of iterable) {
        const i = index++
        remaining++
        promise.then(
          resolve,
          (reason) => {
            reasons[i] = reason
            if (--remaining === 0) reject(reasons)
          }
        )
      }
    })
  }
  // 返回所有结果
  static allSettled(iterable) {
    return new RtPromise((resolve, reject) => {
      const res = []
      let remaining = 0
      let index = 0
      for (const promise of iterable) {
        const i = index++
        remaining++
        promise.then(
          (value) => {
            res[i] = {
                value,
                status: "fulfilled"
            }
            if (--remaining === 0) resolve(res)
          },
          (reason) => {
            res[i] = {
                reason,
                status: "rejected"
            }
            if (--remaining === 0) resolve(res)
          }
        )
      }
      if (index === 0) resolve([]);
    })
  }
  // 返回第一个结果
  static race(iterable) {
    return new RtPromise((resolve, reject) => {
      for (const promise of iterable) {
        promise.then(
          resolve,
          reject
        )
      }
    })
  }
}
```

race：返回第一个被返回的值（成功、失败都可）
