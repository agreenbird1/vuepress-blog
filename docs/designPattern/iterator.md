---
title: 迭代器模式
author: RoleTang
date: '2022-07-16'
---

## 迭代器模式
迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

其实就是循环访问聚合对象中的各个元素，JavaScript中的遍历对象的方法就是属于迭代器模式。

```js
// 实现一个迭代器的比较
// 手动实现一个迭代器
// 可以实现遍历
const Iterator = (obj) => {
  let current = 0
  const next = () => current++
  const isDone = () => current > obj.length
  const getCurItem = () => obj[current]
  return {
    next,
    isDone,
    getCurItem,
    length: obj.length,
  }
}

const compare = (iterator1, iterator2) => {
  if (iterator1.length !== iterator2.length) return 'not match'
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurItem() !== iterator2.getCurItem()) return 'not match'
    iterator1.next()
    iterator2.next()
  }
  return 'match'
}

```