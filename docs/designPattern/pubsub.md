---
title: 发布订阅模式
author: RoleTang
date: '2022-07-10'
---

优点
1. 发布订阅模式可以广泛应用于异步编程中。
2. 使对象之间松耦合的练习在一起

```html
<body>
    <div id="btn">pubsub</div>
    <script>
      // 类似订阅btn上的点击事件
      // 订阅者便是clickBtn函数

      // 不知道什么时候会点击，所以订阅即可
      function clickBtn() {
        console.log('clickBtn')
      }
      btn.addEventListener('click', clickBtn)
      // 当然还可以取消订阅
      // btn.removeEventListener('click', clickBtn)
    </script>
  </body>

```

####发布订阅的简单实现

1.首先指定谁做发布者（比如售楼处）
2.发布者添加一个缓存列表，用于存储订阅消息的订阅者（比如花名册）
3.发布消息时候需要通知订阅者（发短信）

```javascript
const salesOffice = {} // 售楼处
// salesOffice.listeners = [] // 不应使用数组，因为会所有都通知
salesOffice.listeners = {} // 花名册，使用对象。需求不同
salesOffice.listen = function (fn, square) { // 订阅
  if (!this.listeners[square]) this.listeners[square] = []
  this.listeners[square].push(fn)
}
salesOffice.unListen = function (fn, square) { // 订阅
  if (!this.listeners[square]) console.log('您暂时没有订阅此房信息！')
  this.listeners[square].splice(this.listeners[square].indexOf(fn), 1)
}
salesOffice.trigger = function (square) { // 通知
  const listeners = this.listeners[square]
  listeners.forEach(listener => listener(square))
}
const xiaoMing = function (square) {
  console.log('小明买房！+ ' + square + '平米')
}
const daFang = function (square) {
  console.log('大芳买房！' + square + '平米')
}

salesOffice.listen(xiaoMing, 80)
salesOffice.listen(daFang, 100)

salesOffice.trigger(80)

salesOffice.unListen(xiaoMing, 80)

// 已经取消订阅
salesOffice.trigger(80)

```
