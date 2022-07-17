---
title: 命令模式
author: RoleTang
date: '2022-07-17'
---

设计模式的主题永远是把不变的事物和变化的事物分离开来，命令模式也不例外。

> 一个快餐店，顾客向快餐店中的点餐服务员进行点餐，那么顾客的需求会被写在订单上。顾客不需要关心如何炒菜的，也不用关心是哪一个厨师炒菜。只要订单还在，那么厨师就会完成订单。同时，顾客也可以很方便的撤销订单。而这些记录的订单，就是命令模式中的命令对象。

命令模式是最简单的和最优雅的模式之一，命令模式中的命令（command）指的是一个执行某些特定事情的指令。

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

拿订餐来说，客人需要向厨师发送请求，但是完全不知道这些厨师的名字和联系方式，也不知道厨师炒菜的方式和步骤。命令模式把客人订餐的请求封装成 command 对象，也就是订餐中的订单对象。这个对象可以在程序中被四处传递，就像订单可以从服务员手中传到厨师的手中。这样一来，客人不需要知道厨师的名字，从而解开了请求调用者和请求接收者之间的耦合关系。

同时，命令对象也有了更长的生命周期，同时支持撤销排队等操作。


### JavaScript 中的命令模式
`JavaScript` 作为将函数作为一等对象的语言，跟策略模式一样，命令模式也早已融入到了`JavaScript` 语言之中。运算块不一定要封装在 `command` 对象中，也可以封装在普通函数中。函数作为一等对象，本身就可以被四处传递。即使我们依然需要请求“接收者”，那也未必使用面向对象的方式，闭包可以完成同样的功能。

命令模式的作用不仅是封装运算块，而且可以很方便地给命令对象增加撤销操作。就像订餐时客人可以通过电话来取消订单一样。

### 命令队列
在订餐的故事中，如果订单的数量过多而厨师的人手不够，则可以让这些订单进行排队处理。第一个订单完成之后，再开始执行跟第二个订单有关的操作。

把请求封装成命令对象的优点在这里再次体现了出来，对象的生命周期几乎是永久的，除非我们主动去回收它。也就是说，命令对象的生命周期跟初始请求发生的时间无关，command对象的 execute 方法可以在程序运行的任何时刻执行，即使点击按钮的请求早已发生，但我们的命令对象仍然是有生命的。