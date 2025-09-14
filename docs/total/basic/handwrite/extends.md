---
title: 继承
author: RoleTang
date: '2022-07-25'
---

1. 介绍一下原型链，从构造函数到原型，再到原型链，盗用构造函数，原型式继承，寄生式继承

   [【前端工程师面试宝典】学习说明_互联网校招面试真题面经汇总_牛客网 (nowcoder.com)](https://www.nowcoder.com/tutorial/96/1678a0fd35cd4db486af18589e34e4d4)

   1. 原型链继承

      子类的构造函数原型指向父类的实例

      缺点：多个子类公用实例，不能向父级构造函数传参

      ```js
      function Parent1(name) {
        this.parent1 = 'parent1'
        this.name = name
      }
      Parent1.prototype.say = function () {
        console.log(this.parent1)
        console.log(this.name)
      }
      function Child1() {}
      Child1.prototype = new Parent1()
      const child1 = new Child1('child1')
      child1.say()
      ```

   2. 构造函数继承

      使用apply方法在子类中调用父类并绑定自身this，可以共有父类属性

      缺点： 不能使用父类原型的方法

      ```js
      function Parent2(name) {
        this.parent2 = 'parent2'
        this.name = name
      }
      Parent2.prototype.say = function () {
        console.log(this.parent2)
        console.log(this.name)
      }
      function Child2(name) {
        Parent2.call(this, name)
      }
      const child2 = new Child2('child2')
      console.log(child2)
      //   child2.say() 无法继承
      ```

   3. 组合式继承

      前两个结合在一起

      ```js
      function Parent3(name) {
        this.Parent3 = 'Parent3'
        this.name = name
      }
      Parent3.prototype.say = function () {
        console.log(this.Parent3)
        console.log(this.name)
      }
      function Child3(name) {
        Parent3.call(this, name)
      }
      Child3.prototype = new Parent3()
      const child3 = new Child3('child3')

      console.log(child3)
      child3.say()
      ```

   4. 原型式继承

      ```javascript
      var parent = {
        names: ['a']
      }
      function copy(object) {
        function F() {}
        F.prototype = object;
        return new F();
      }
      var child = copy(parent);

      ```

   5. 寄生组合式继承

      ```javascript
      //  4. 寄生组合式继承
      //  4.1 自实现父构造函数的 prototype 的复制
      function copy(object) {
        function F() {}
        F.prototype = object
        return new F()
      }
      function inheritPrototype(subClass, superClass) {
        // 复制一份父类的原型
        var p = copy(superClass.prototype)
        // 修正构造函数
        p.constructor = subClass
        // 设置子类原型
        subClass.prototype = p
      }
      function Parent5(name, id) {
        this.id = id
        this.name = name
        this.list = ['a']
        this.printName = function () {
          console.log(this.name)
        }
      }
      Parent5.prototype.sayName = function () {
        console.log(this.name)
      }
      function Child5(name, id) {
        Parent5.call(this, name, id)
        // Parent.apply(this, arguments);
      }
      inheritPrototype(Child5, Parent5)

      console.log(Child5.prototype.constructor)

      //  4.2 使用 Object.create
      function Parent(name) {
        this.name = name
        this.colors = ['red', 'blue']
      }
      Parent.prototype.say = function () {
        console.log('hello ' + this.name)
      }

      function Child(name, age) {
        Parent.call(this, name) // 继承属性
        this.age = age
      }

      // 关键：用 Object.create 避免调用 Parent 两次
      Child.prototype = Object.create(Parent.prototype)
      Child.prototype.constructor = Child

      const c = new Child('Tom', 18)
      c.say() // hello Tom
      console.log(c.__proto__ === Child.prototype)
      console.log(Parent.prototype === Child.prototype.__proto__)

      ```
