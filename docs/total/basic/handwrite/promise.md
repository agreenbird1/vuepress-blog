---
title: Promise手写
author: RoleTang
date: '2022-07-25'
---

手写promise，promise.all等方法

promise又被称作期约，通常用来描述一个异步操作是否成功或者失败以及其结果值。它拥有三种状态：

- `pending`：待定，暂时未知结果，既未兑现，也未失败。
- `fulfilled`：已兑现，表示成功
- `rejected`：已拒绝，代表失败

通常我们在创建一个`promise`对象的时候会传入一个回调函数。其参数便是对应成功和失败的回调。当使用`resolve`后即成功，`reject`即失败。`promise`对象的状态一经确认不会改变。

同时我们可以调用then方法获取promise对象的结果，同时then方法也是返回一个promise对象，所以可以采用链式调用的方法.

同时promise也有几个静态方法比如

- `all`：接收一个iterable类型（数组、map），返回所有成功的promise的结果，如果有一个失败，就立即返回失败的结果

- `any`：接收同上，返回第一个执行成功的结果，若是全部失败则报错

- `allSettled`：接收同上，返回所有的结果，会包含状态和结果，结果类似如下

  ```js
  [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: 2 }
  ]
  ```

- `race`：接收同上，返回第一个执行的结果

- `resolve`：返回一个带有拒原因的`Promise`对象

- `reject`：返回一个带有成功结果的`Promise`对象

```javascript
class RTPromise {
  // 三种状态
  status = 'pending'
  // 成功失败的回调
  successCbs = []
  errorCbs = []
  constructor(executor) {
    let resolve = (value) => {
      if (this.status === 'pending') {
        // 添加到异步任务
        queueMicrotask(() => {
          // 状态一经确定不可再改变
          if (this.status === 'pending') {
            this.status = 'fulfilled'
            this.value = value
            this.successCbs.forEach((cb) => cb())
          }
        })
      }
    }
    let reject = (err) => {
      if (this.status === 'pending') {
        queueMicrotask(() => {
          if (this.status === 'pending') {
            this.status = 'rejected'
            this.err = err
            this.errorCbs.forEach((cb) => cb())
          }
        })
      }
    }
    executor(resolve, reject)
  }
  then(onFulfilled, onRejected) {
    // 解决没有参数的情况
    onFulfilled = onFulfilled || ((v) => v)
    onRejected =
      onRejected ||
      ((err) => {
        throw err
      })
    return new RTPromise((resolve, reject) => {
      // 同步时
      if (this.status === 'fulfilled') {
        resolve(onFulfilled(this.value)) // 将上一个then函数的值返回
      }

      if (this.status === 'rejected') {
        reject(onRejected(this.err)) // 将上一个then函数的值返回
      }
      // 异步时候
      if (this.status === 'pending') {
        this.successCbs.push(() => {
          resolve(onFulfilled(this.value))
        })
        this.errorCbs.push(() => {
          reject(onRejected(this.err))
        })
      }
    })
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
  finally(onFinally) {
    // 不论成功失败都执行
    return this.then(
      () => onFinally(),
      () => onFinally()
    )
  }
  static resolve(value) {
    return new RTPromise((resolve) => resolve(value))
  }
  static reject(err) {
    return new RTPromise((undefined, reject) => reject(err))
  }
  static all(RTPromises) {
    return new RTPromise((resolve, reject) => {
      const values = []
      RTPromises.forEach((RTPromise) => {
        RTPromise.then(
          // 全部正确才返回
          (res) => {
            values.push(res)
            if (values.length === RTPromises.length) resolve(values)
          },
          // 有一个错误就抛出错误
          (err) => reject(err)
        )
      })
    })
  }
  static race(RTPromises) {
    return new RTPromise((resolve, reject) => {
      RTPromises.forEach((RTPromise) => {
        RTPromise.then(
          // 谁先谁出
          (res) => resolve(res),
          (err) => reject(err)
        )
      })
    })
  }
}

```

race：返回第一个被返回的值（成功、失败都可）