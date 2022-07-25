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

   2. 构造函数继承

      使用apply方法在子类中调用父类并绑定自身this，可以共有父类属性

      缺点： 不能使用父类原型的方法

   3. 组合式继承

      前两个结合在一起

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
      function copy(object) {
        function F() {}
        F.prototype = object;
        return new F();
      }

      function inheritPrototype(subClass, superClass) {
        // 复制一份父类的原型
        var p = copy(superClass.prototype);
        // 修正构造函数
        p.constructor = subClass;
        // 设置子类原型
        subClass.prototype = p;
      }

      function Parent(name, id){
        this.id = id;
        this.name = name;
        this.list = ['a'];
        this.printName = function(){
          console.log(this.name);
        }
      }
      Parent.prototype.sayName = function(){
        console.log(this.name);
      };
      function Child(name, id){
       Parent.call(this, name, id);
        // Parent.apply(this, arguments);
      }
      inheritPrototype(Child, Parent);

      ```
