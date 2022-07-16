---
title: 代理模式
author: RoleTang
date: '2022-07-16'
---

## 代理模式
代理模式对于前端开发者或者常使用vue框架的人来说，并不陌生。
在ES6，提供了一个``proxy`` API，可以很好的做到代理，并且几乎是一切的代理。

> 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

生活中很多代理的场景，比如明星等有经纪人作为代理等等。

例子，比如小明想追求小红，他可以直接将花送给小红。
但是比如小红是否会接受小明的花受心情的影响。但小明与小红并不熟悉，不能知道小红的心情是好是坏。同时小明的好朋友小白又是小红的好朋友，她可以很好的知道小红的心情，所以可以让小白帮小明送花，以此来提高小明成功的机率。代理模式在这种情况下便显示了作用。

代理模式的分类

**保护代理**
小白作为小红的代理人，帮她挑选花，同时小白可以帮小红过滤一些请求，比如那些年纪太大的中年人或者没有宝马的，这种就可以直接拒绝。保护代理用于控制不同权限的对象对目标对象的访问。

**虚拟代理**
上述小明让小白代他送花给小红的模式就是虚拟代理。虚拟代理可以把一些开销很大的对象，延迟到真正需要它的时候才去创建。

1. 虚拟代理实现图片预加载
2. 虚拟代理实现http请求的转发，比如连续一段时间发送多个请求可能会造成服务器的很大的压力，但是可以通过一个代理转发，它可以收集比如2s内的请求最后统一发出。
3. 虚拟代理的惰性加载中的应用。可能有一个很大的js文件，他有很多功能，但最好不去一次性加载太大的文件。我们可以暴露一个与实际操作一样接口的代理对象（只有接口并不实现），用一个操作队列来缓存你需要的操作，当真正需要时再加载较大的js文件。


```html
<script>
  // 图片的预加载
  // 创建一个 dom 对象去请求图片
  // 之后监听它的加载进行图片的显示
  // 同时可以添加加载中的 gif 作为显示

  // 其实就下列预加载的实现而言，一个函数完全可以做到
  // 但是为何需要使用到代理模式
  // 是因为这更符合单一对象职责
  // 一个进行src源的设置，一个进行预请求

  const myImage = (function () {
    const img = document.createElement('img')
    document.body.appendChild(img)
    return {
      setImage(src) {
        img.src = src
      },
    }
  })()

  // 代理真正的图片
  const proxyImage = (function () {
    // 创建另外一个图片对象，来监听图片源的加载
    const img = new Image()
    // 加载完成后实现显示
    img.onload = function () {
      myImage.setImage(this.src)
    }
    return {
      setImage: function (src) {
        img.src = src
        myImage.setImage('一个加载中的图片...')
      },
    }
  })()
</script>
```

```js
// 缓存代理
const mul = (...args) => {
  console.log('开始计算乘积')
  return args.reduce((pre, cur) => {
    return pre * cur
  }, 1)
}

// 用闭包作缓存
const proxyMul = ((...args) => {
  const cache = {}
  const arg = args.join(',')
  return function () {
    if (cache[arg]) return cache[arg]
    return (cache[arg] = mul(...args))
  }
})()

// 开始计算乘积 只打印一次，代表只做了一次计算
console.log(proxyMul(1, 2, 3))
console.log(proxyMul(1, 2, 3))


// 其实下面的代码可以一个函数就解决
// 但终究是拆成了两个函数
// 这就是坚持符合设计模式的单一职责原则
// mul => 负责计算
// proxyMul => 负责缓存

// 那这样做的好处呢？
// 就是拆分了函数的耦合性，你甚至可以通过高阶函数创建不同的缓存

const mul = (...args) => {
  console.log('开始计算乘积')
  return args.reduce((pre, cur) => {
    return pre * cur
  }, 1)
}

const increment = (...args) => {
  console.log('开始计算和')
  return args.reduce((pre, cur) => {
    return pre + cur
  }, 1)
}

// 低耦合的好处！
const createProxyFactory = (fn) =>{
  const cache = {}
  return (...args) => {
    const arg = args.join(',')
    if (cache[arg]) return cache[arg]
    return (cache[arg] = fn(...args))
  }
}
```