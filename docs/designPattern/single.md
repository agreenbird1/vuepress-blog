---
title: 单例模式
author: RoleTang
date: '2022-07-10'
---

## 单例模式

简单理解单例模式就是一种类，只会生成一个对应的实例。

### 简单的单例模式
定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点

```javascript
// 单例模式的思想并不复杂
// 定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点

class Singleton {
  constructor(name) {
    this.name = name
  }
  getName () {
    return this.name
  }
  // 一个访问它的全局访问点
  static getInstance (name) {
    if (!Singleton.instance) Singleton.instance = new Singleton(name)
    return this.instance
  }
}
const s1 = Singleton.getInstance('singleton1')
const s2 = Singleton.getInstance('singleton2')
console.log(s1 == s2)

```

### 透明的单例模式
为何叫做透明的单例模式？
因为使用者是按照正常的单例模式进行使用的
缺点：使用了匿名函数和闭包
```javascript
// 为何叫做透明的单例模式？
// 因为使用者是按照正常的单例模式进行使用的
// 缺点：
// 1.使用了匿名函数和闭包

const createInstance = (function () {
  let instance = null
  const createInstance = function (name) {
    if (instance) return instance
    this.name = name
    return instance = this
  }
  return createInstance
})()
const instance1 = new createInstance('instance1')
const instance2 = new createInstance('instance2')

console.log(instance1 === instance2)


```

### 懒汉的单例模式
> 何为惰性的单例模式
  惰性是指在需要的时候才创建对象实例

其实前面的两个：简单和透明的单例模式也是类似于惰性，当需要的时候才创建

> 设计模式中统一的思想是
单一职责原则的：一个函数只做具体的一件事，多进行抽离复用。

懒汉式这里可以使创建对应的动作的实例与类抽离开来。

```javascript
// 何为惰性的单例模式
  // 惰性是指在需要的时候才创建对象实例
  // 其实前面的两个：简单和透明的单例模式也是类似于惰性，当需要的时候才创建

  // 设计模式中统一的思想是
  // 单一职责原则的：一个函数只做具体的一件事，多进行抽离复用。

  // 通用的惰性单例

  // 比如做一个可以实现元素创造器

  const createEle = function (fn) {
    let ele
    return function (...args) {
      if (ele) return ele
      return (ele = fn.call(this, ...args))
    }
  }

  const createDiv = function () {
    const div = document.createElement('div')
    div.innerHTML = 'i am div'
    return div
  }
  const createSpan = function () {
    const span = document.createElement('span')
    span.innerHTML = 'i am span'
    return span
  }

  // 将创建与单例构造分离
  const div = createEle(createDiv)
  const span = createEle(createSpan)
  // 传入不同的构造函数可以生成不同的单例
  const d1 = div()
  const d2 = div()
  console.log(d1 === d2) // true

```