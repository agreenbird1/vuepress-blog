---
title: JavaScript设计模式
author: RoleTang
date: '2022-07-10'
---

> 此处只是记录我在读《JavaScript设计模式与实践》时候所做的笔记和感想。当然包括代码的实现。

## 什么是设计模式？
设计模式其实是一种针对特定问题的简单而优雅的解决，常用于面向对象软件设计中。通俗来说是对一个已经存在的好的方法取了一个好听的名字。

> 找出程序中变化的部分，并将它封装起来

诚然，设计模式有时候在开发时会带来很多代码上的消耗。它却能够在后期维护时更加方便。能达到高可复用性和可维护性的目的。

## 一些好听的话
1. 我不管你是不是鸭子，但我听到你在嘎嘎叫，那你就是鸭子。
2. js的数组既然有pop和push方法，那你就是一个栈。同理，你也可以是一个队列。
3. 也许对js来说，不区分类型是一种失色，也是一种解脱。
4. js是一种基于原型模式的面向对象系统的语言。
5. 原型模式不单一是一种设计模式，也被称作一种编程泛型。
6. Peter Norvig说：“在函数作为一等对象的语言中，策略模式是隐形的”。就像我们的实现一样，他可能只是对象中的一个属性。


## 面向对象三大特性
类 / 继承描述了一种代码的组织结构形式——一种在软件中对真实世界中问题领域的建模
方法。比如类就是一个设计的图纸，它对设计的东西有明确的规定。同时构造器就是建筑师，他会根据图纸建造你想要的东西，最后的成品就是实例。
### 多态
> 什么是多态？

简单的举例：
叫属于动物的基本特性。
狗是动物，狗会叫。
猫是动物，猫也会叫。
可以让猫叫，也可以让狗叫，执行同一个动作，得到不同的结果（叫声不同？）
``释义``：多态是统一操作坐用于不同的对象上可以得到不同的解释和不同的执行结果。

多态最根本的作用就是把过程化的条件分支语句转化为对象的多态性，将“做什么”与“怎么做”分开来。
而js作为动态语言，它的多态则是与生俱来的。

### 继承
面向对象编程强调的是数据和操作数据的行为本质上是互相关联的（当然，不同的数据有不同的行为），因此好的设计就是把数据以及和它相关的行为打包（或者说封装）起来。这在正式的计算机科学中有时被称为数据结构。
在面向类的语言中，你可以先定义一个类，然后定义一个继承前者的类。后者通常被称为“子类”，前者通常被称为“父类”
我们可以使用类对数据结构进行分类，可以把任意数据结构看作范围更广的定义的一种特例。
“汽车”可以被看作“交通工具”的一种特例，后者是更广泛的类。“交通工具”作为基础，“汽车”作为对其的扩展，同时又具有“交通工具”的特性，是一种更具体的表现。

### 封装
封装，就是将客观事物抽象为逻辑实体，实体的属性和功能相结合，形成一个有机的整体。并对实体的属性和功能实现进行访问控制，向信任的实体开放，对不信任的实体隐藏。，通过开放的外部接口即可访问，无需知道功能如何实现。

也就是说，封装主要有以下目的：

- 可隐藏实体实现的细节。
- 提高安全性，设定访问控制，只允许具有特定权限的使用者调用。
- 简化编程，调用方无需知道功能是怎么实现的，即可调用。


## 原型模式

js是一种基于原型模式的面向对象系统的语言。
除了基本的数据类型（严格说来只有undefined），其他的数据全是对象。
``原型模式``本身是用于创建对象的一种模式，我们不再关心对象的具体类型，而是找到一个对象，然后克隆一个一模一样的对象出来。
它并非是需要去克隆某个对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是一种手段。
它遵循以下规则：
- 所有的数据都是对象
- 要得到一个对象，不是实例化类，而是找到一个对象作为原型去克隆它
- 对象会记住它的原型
- 如果对象无法响应某个请求，它会把这个请求委托给自己的原型