---
title: instanceOf手写
author: RoleTang
date: '2022-07-25'
---

instanceOf 实现方式

可以判断复杂数据类型,返回的是一个布尔值

但不能判断基本数据类型

首先需要了解instanceOf是干嘛的？

```javascript
/*
	instanceof运算符用于检测构造函数的prototype属性是否出现在某个实例对象的原型链上。
	再根据原型的关系得出结论 ===> 实例的`__proto__`属性指向构造函数的原型
	并且只要子对象原型链上有一个符合即可
*/
function instanceOfFn(child, parent) {
    let proto = child.__proto__
    let prototype = parent.prototype
    while (true) {
        if (proto === null) {
            return false
        } else {
            if (proto === prototype) return true
        }
        proto = proto.__proto__
    }
}
```

