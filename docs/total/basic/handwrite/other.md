---
title: 其他手写
author: RoleTang
date: '2025-09-12'
---

深拷贝

```js
// 不同的类型处理
// 循环引用处理 Map
const cloneDeep = (target, map = new Map()) => {
  // 只处理复杂类型，基础类型直接返回
  if (typeof target !== 'object' || !target) return target
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // 已处理
  if (map.has(target)) return map.get(target)
  let res
  if (Object.prototype.toString.call(target) === '[object Map]') {
    res = new Map()
    map.set(target, res)
    target.forEach((item, key) => res.set(key, cloneDeep(item, map)))
  } else if (Object.prototype.toString.call(target) === '[object Set]') {
    res = new Set()
    map.set(target, res)
    target.forEach((item) => res.add(cloneDeep(item, map)))
  } else {
    if (Array.isArray(target)) res = []
    else res = {}
    map.set(target, res)
    for (const key in target) {
      if (Object.hasOwnProperty.call(target, key)) {
        res[key] = cloneDeep(target[key], map)
      }
    }
  }
  return res
}
```

dom 转 json

```js
function convertToJson() {
    const root = document.getElementsByClassName('root')[0];
    const output = new Object();
    // 只需要这两个标签即可
    output.tagName = root.tagName;
    output.className = root.className;
    output.childs = getChilds(root);
    // 此方法非常快速
    console.log(JSON.stringify(output));
}

function getChilds(node) {
    const childs = node.children;
    const result = new Array();
    if(!childs || childs.length === 0) return result;
    for (const child of childs) {
        const childOutput = new Object();
        childOutput.tagName = child.tagName;
        childOutput.className = child.className;
        childOutput.childs = getChilds(child);
        result.push(childOutput);
    }
    return result;
}
convertToJson();
```

```js

```

```js
// 展开数组
// 会跳过稀疏数组空槽
const flatArray = (array, depth = 1) => {
  if (!Array.isArray(array) || depth === 0) return array
  return array.reduce((pre, cur) => {
    return pre.concat(flatArray(cur, depth - 1))
  }, [])
}
```

```js
// \s space \d digital \w word
// +量词，1个或者多个 {1,}
// g范围
const trim = (s) => {
  return s.replace(/^\s+|\s+$/g, '')
}
```

```js
// 深比较
const deepEqual = (a, b, visited = new WeakMap()) => {
  // 同一引用
  if (a === b) return true
  // 处理 NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true
  // 类型不同
  if (typeof a !== typeof b) return false
  // null 判断
  if (a === null || b === null) return a === b
  // 基础类型 (string, number, boolean, symbol, bigint)
  if (typeof a !== 'object' && typeof a !== 'function') return a === b
  // 循环引用检查
  if (visited.has(a)) return visited.get(a) === b
  visited.set(a, b)
  // Date
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  // RegExp
  if (a instanceof RegExp && b instanceof RegExp)
    return a.source === b.source && a.flags === b.flags
  // Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false
    for (const [key, val] of a) {
      if (!b.has(key)) return false
      if (!deepEqual(val, b.get(key), visited)) return false
    }
    return true
  }
  // Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false
    // 转换成数组逐个比较（顺序不保证）
    for (const val of a) {
      // 这里不能简单 b.has(val)，要深度比较
      let found = false
      for (const valB of b) {
        if (deepEqual(val, valB, visited)) {
          found = true
          break
        }
      }
      if (!found) return false
    }
    return true
  }
  // Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], visited)) return false
    }
    return true
  }

  // 普通对象
  const keysA = Reflect.ownKeys(a)
  const keysB = Reflect.ownKeys(b)
  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key], visited)) return false
  }

  return true
}
```

```js
const compose = (...fns) => {
  return fns.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  )
}
```

```js
// 实现并发数
Promise.map = (promises, concurrent) => {
  if (concurrent >= promises.length) return Promise.allSettled(promises)

  return new Promise((resolve) => {
    const results = new Array(promises.length)
    let remaining = promises.length
    let nextIndex = 0

    const run = (index) => {
      const p = promises[index]
      if (!p) return
      p.then(
        (value) => (results[index] = { status: 'fulfilled', value }),
        (reason) => (results[index] = { status: 'rejected', reason })
      ).finally(() => {
        remaining--
        if (remaining === 0) {
          resolve(results)
        } else if (nextIndex < promises.length) {
          run(nextIndex++)
        }
      })
    }

    // 启动前 concurrent 个任务
    for (; nextIndex < concurrent; nextIndex++) {
      run(nextIndex)
    }
  })
}

```

```js
/**
 * 参数
 * object (Object): 要检索的对象。
 * path (Array|string): 要获取属性的路径。
 * [defaultValue] (*): 如果解析值是 undefined ，这值会被返回。
 * @returns 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
 */
/**
 * 参数
 * object (Object): 要检索的对象。
 * path (Array|string): 要获取属性的路径。
 * [defaultValue] (*): 如果解析值是 undefined ，这值会被返回。
 * @returns 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
 */
const get = (context, path, defaultValue = undefined) => {
    // 把字符串路径解析成数组路径
    const parsePath = (path) => {
        if (Array.isArray(path)) return path
        const pathArr = []
        let pathStr = ''
        const pushPathStr = () => {
            if (pathStr !== '') pathArr.push(pathStr)
            pathStr = ''
        }
        for (let i = 0; i < path.length; i++) {
            const char = path[i]
            if (char === '.' || char === '[' || char === ']') pushPathStr()
            else pathStr += char
        }
        pushPathStr()
        return pathArr
    }
    // 统一为数组形式
    const pathArr = parsePath(path)
    // 遍历路径
    let res = context
    for (let i = 0; i < pathArr.length; i++) {
        if (res == null || !(pathArr[i] in res)) {
            return defaultValue
        }
        res = res[pathArr[i]]
    }
    // 区分 undefined 和 路径不存在
    return res === undefined ? defaultValue : res
}

var object = { a: [{ b: { c: 3 } }] }
console.log(get(object, 'a[0].b.c'))
console.log(get(object, 'a[0].b.c'))
// => 3
console.log(get(object, ['a', '0', 'b', 'c']))
// => 3
console.log(get(object, 'a.b.c', 'default'))
// => 'default'
```