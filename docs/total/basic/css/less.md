---
title: Less
author: RoleTang
date: '2022-07-25'
---

1. 变量

   比如全局的一些共用颜色，字体等

   一般使用@打头

2. 混合

        一般全局多个地方会使用到的一些`公共样式`，比如一些简单的hover显示动画

        ```less
        .hoverShadow () {
          transition: all .5s;
          &:hover {
            transform: translate3d(0,-3px,0);
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
          }
        }

        // 使用
        .hoverShadow();
        ```

3. 函数

    ```css
    @p-m: {
      pr: padding-right;
      pl: padding-left;
      pt: padding-top;
      pb: padding-bottom;
    };

    @size: {
      5: 5px;
    };

    // 相当于是遍历对应的内容，将其组合
    each(@p-m, .(@value,@key){
      each(@size,.(@pxSize,@pxKey){
        .@{key}-@{pxKey} {
          @{value}: @pxSize;
        }
      })
    });

    // 生成代码如下
    .pr-5{
      padding-right: 5px;
    }
    .pl-5{
      padding-right: 5px;
    }
    .pt-5{
      padding-right: 5px;
    }
    .pb-5{
      padding-right: 5px;
    }
    ```

4. 如何加载

   一般将它设置为公共的样式，在配置文件中使用`style-resources-loader`进行配置加载。同时要使用`less-loader`预处理。同时在`patterns`（数组）选项中添加需要处理的文件
