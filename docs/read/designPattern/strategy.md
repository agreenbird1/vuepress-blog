---
title: 策略模式
author: RoleTang
date: '2022-07-10'
---

## 策略模式
> 何为策略模式？
  定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换

设计模式的目的将不变的部分和变化的部分分隔开来，策略模式的目的便是将算法的使用和算法的实现分离

### 组成
1. 一组策略类，其中包含了对应的算法即负责计算过程。
2. ``环境类context``，接受请求，并``委托给``对应的策略类。当然其会保存策略类的引用。

但其实在前端中，策略模式并不会一直包含算法计算过程，也可以封装一些业务逻辑，比如表单校验等。

优点：
- 利用组合、委托和多态等思想，有效避免多重条件的选择语句。
- 策略模式提供了对``开放-封闭``原则的完美支持，算法独立封装在strategy中，易于切换和理解。
- 可重用性高，算法可复用。
- 利用组合和委托使得``context``也具备了执行算法的能力，这也是继承的一种替代解决方案。

缺点并不明显，使用策略模式你必须增加很多``strategy``并搞懂每一个``strategy``以及它们之间的不同点。

#### 奖金计算
```javascript
// 这是一系列的算法
// 单独封装成一个个的策略类
// 算法的实现便在其中
let performanceS = function () { }
performanceS.prototype.calculate = function (salary) {
  return salary * 4
}
let performanceA = function () { }
performanceA.prototype.calculate = function (salary) {
  return salary * 3
}
let performanceB = function () { }
performanceB.prototype.calculate = function (salary) {
  return salary * 2
}

// context
class Bonus {
  constructor(salary, strategy) {
    this.salary = salary
    this.strategy = strategy
  }
  // 这些内容都是对策略类及其算法的引用
  setSalary (salary) {
    this.salary = salary
  }
  setStrategy (strategy) {
    this.strategy = strategy
  }
  getBonus () {
    return this.strategy.calculate(this.salary)
  }
}

let bonus = new Bonus()

bonus.setSalary(1000)
bonus.setStrategy(new performanceA())
console.log(bonus.getBonus())
```

#### 表单校验

```javascript
// 尽管策略模式的定义来看
// 策略组的内容更多的是封装算法，执行算法过程
// 但也可以抽象成一些业务逻辑的处理

// 表单校验
// 策略组 - 业务逻辑
let strategies = {
  // 手机号码
  isMobile (val, errMessage) {
    if (!/^1[3|5|7|8][0-9]{9}$/.test(val))
      return errMessage
  },
  // 长度
  minLength (val, length, errMessage) {
    length = +length
    if (val.length < length) return errMessage
  }
}

// context
class Validator {
  // 保存所有的校验规则
  cache = []
  add (val, rule, errMessage) {
    const ary = rule.split(':')
    const strategy = ary.shift()
    this.cache.push(function () {
      // 整理参数的顺序
      ary.unshift(val)
      ary.push(errMessage)
      return strategies[strategy](...ary)
    })
  }
  start () {
    const errMessages = []
    this.cache.forEach(strategy => {
      let msg = strategy()
      if (msg) errMessages.push(msg)
    })
    return errMessages
  }
}

const validator = new Validator()

// 添加规则与校验
validator.add('11111111111', 'isMobile', '手机格式不正确')
validator.add('13533333333', 'isMobile', '手机格式不正确')
validator.add('13533333333', 'minLength:6', '密码长度不能少于6位！')
validator.add('3333', 'minLength:6', '密码长度不能少于6位！')

console.log(validator.start())

```