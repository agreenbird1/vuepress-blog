---
title: 深信服一面面经
author: RoleTang
date: '2022-09-13'
---

时间： 8.25投递 => 9.1笔试 => 9.13一面 => 9.15二面

总共55min，体验很好。

1. 自我介绍

2. 一键换肤的方案，使用link加载

3. CDN的使用

4. 实现一个三角形

5. 将三角形垂直居中

6. 为这个三角形随意加一个动画

7. transform的属性

8. 点击使得三角形中的文字加一，使用闭包

9. 实现promise.all

10. 随意写一个常用的hook

11. ref和reactive最大的区别？什么时候必须用reactive而不能用ref？不知道

12. 实现pick

13. 实现一个typescript类型，没做出来，讲了下思路

    要求：将传入的类型换做required，其余的不变返回。

    ```typescript
    interface IA {
      a: number;
      b?: string;
      c?: boolean;
    }

    type requiredSome<T, U extends keyof T> = Required<Pick<T, U>> & Omit<T, U>;
    ```



14. vite与webpack的区别？

15. 反问

总结：秋招第一个面，小紧张。有些东西记混了，但还好无伤大雅。与面试官的交流是非常重要的。