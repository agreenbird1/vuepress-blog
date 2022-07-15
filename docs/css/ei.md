---
title: css常见面试题
author: RoleTang
date: '2022-04-12'
---

1. 层叠上下文

   使用了以下属性的元素会形成一个层叠上下文，同时会被单独提升为一个合成层。

   - `HTML`根元素
   - 普通元素设置了`z-index`属性，且其`position`属性不为`static`
   - `opacity`属性值不为1
   - 设置了`transform`属性，不为none
   - 设置了`filter`属性，不为none
   - 设置了`will-change`属性

2. [「2021」高频前端面试题汇总之CSS篇 - 掘金 (juejin.cn)](https://juejin.cn/post/6905539198107942919#heading-51)

3. clientHeight,scrollHeight,offsetHeight

   clientHeight：表示的是可视区域的高度，不包含 border 和滚动条offsetHeight： 表 示 可 视 区 域 的 高 度 ， 包 含 了 border 和 滚 动 条scrollHeight：标识元素内容顶部折叠的高度

4. 实现居中对齐的方式

   1. 定宽高

      1. 绝对定位 + margin

         ```css
         margin-top: -50px;
         margin-left: -50px;
         left: 50%;
         top: 50%;
         ```

      2. 绝对定位 + transform

         ```css
         transform: translateX(-50%) translateY(-50%);
         left: 50%;
         top: 50%;
         ```

      3. 绝对定位 + left + top + margin

         ```css
         left: 0;
         top: 0;
         right: 0;
         bottom: 0;
         margin: auto;
         ```

      4. flex

      5. grid布局

   2. 不定宽高

      1. 绝对定位 + transform

         ```css
         .f {
             width: 300px;
             height: 300px;
             background-color: aqua;
             position: relative;
         }
         .s {
             position: absolute;
             transform: translateX(-50%) translateY(-50%);
             left: 50%;
             top: 50%;
         }
         ```

      2. flex布局

      3. grid + margin

         ```css
         display:grid; // 父

         margin:auto // 子
         ```



5. css3新特性？

   `border-radius`

   `text-shadow`

   `box-shadow`

   `transition`

   `animation`

   `@keyframes`

   新增很多伪类选择器

   ​	`first-of-type` 选择每个容器下对应标签类型的第一个

   ​	`last-of-type`

   ​	`last-child`

   ​	`first-child`

6. 响应式布局：媒体查询 + 百分比布局 + rem，以及 rem 和 em 的区别

   - 媒体查询

     ```css
     @media screen and (max-width: 550px){
         body{
           background-color:#6633FF;
         }
     }
     ```

     缺陷:需要改变的样式太多的时候那么需要改变的样式会很庞大

   - 百分比布局

     子元素的`height` `width` 都是相对于自己的直接父元素

     `top`  `bottom` :相对于最近的非Static定位的父元素的高度

     `left` `right`:相对于最近的非Static定位的父元素的宽度

     `padding` `margin`:相对于直接父元素的 `width`

     ``border-radius``:相对于自身

     缺陷:计算困难;规则较多,可能搞混淆.

   - rem布局

     em:相对于父元素的font-size

     rem:相对于html的font-size

     那么可以监听视图容器大小的改变,改变rem的值

     ```javascript
     function refreshRem() {
         var docEl = doc.documentElement;
         var width = docEl.getBoundingClientRect().width;
         var rem = width / 10;
         docEl.style.fontSize = rem + 'px';
         flexible.rem = win.rem = rem;
     }
     win.addEventListener('resize', refreshRem);
     ```

     小缺陷:js会和css有一定的耦合

   - vm&vh适配

     相当于视窗的宽高.

7. 权重。

   !important > 内联样式 > id选择器 > 类选择器（属性选择器，伪类选择器） > 标签选择器（伪元素选择器after？before？）

   可继承的样式：font-size, font-family, color

   不可继承的样式：border, padding, margin, width, height

8. flex(flexible box)布局。

   是一种一维的布局模型，它给 flexbox 的子元素之间提供了强大的空间分布和对齐能力。

   1. 父元素属性设置

      ```javascript
      1. flex-direction:row | row-reverse | column | column-reverse;
      // 决定主轴的排列方向。（默认水平向左）
      2. flex-wrap: nowrap | wrap | wrap-reverse;
      }
      // 决定子元素是否换行。（默认nowrap）
      3. flex-flow: <flex-direction> <flex-wrap>;
      // 合集。默认为row nowrap
      4. justify-content: flex-start | flex-end | center | space-between | space-around;
      // 决定了项目在主轴上的对齐方式
      // 注意：space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
      5. align-items: flex-start | flex-end | center | baseline | stretch;
      // 决定项目在交叉轴的对齐方式
      6.align-content: flex-start | flex-end | center | space-between | space-around | stretch;
      // 当有多行的时候生效，类似align-items，但是是以行为基准
      // align-content: flex-start | flex-end | center | space-between | space-around | stretch;
      ```

   2. 子元素属性设置

      ```javascript
      1. order: <integer>;
      // order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。（顾名思义，决定顺序）
      2. flex-grow: <number>; /* default 0 */
      // 有剩余空间的时候是否占用剩余空间。比如剩余100px、
      // flex-grow为0.6，则占用60px
      // 如果子元素都设置值，则按此比例等分。取决于剩余空间大小和子元素数目
      3. flex-shrink: <number>; /* default 1 */
      // 与 2 相反。当空间不足时缩小的比例为多少。计算：当前宽度 = 原始宽度 X 比例。
      4. flex-basis: <length> | auto; /* default auto */
      // 设置项目占据主轴的大小，类似width，但优先级更高。
      5. flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
      // 默认值为0 1 auto
      // flex:1; ==> 1 1 0%;
      6. align-self: auto | flex-start | flex-end | center | baseline | stretch;
      // 设置单一项目覆盖align-items属性。
      ```

   ```

      flex-basis:0; => 代表当前元素的最小宽度。


   ```

9. 实现左侧固定，右侧自适应。

   1. 使用flex布局，左侧盒子固定宽度。

   2. 使用calc计算宽度。calc(100% - 左侧盒子宽度)，注意此时需要使用display:inline-block;所以需要消除间隙影响，父元素设置font-size:0;即可。

   3. 使用grid布局。

      ```css
      display: grid;
      /*
      	两列，左列固定宽度，右列自动，一般为最大（撑满）
      */
      grid-template-columns: 200px auto;
      ```



10. 双飞翼、圣杯布局

    1. 使用flex布局，对三个子元素设置order即可
    2. grid。设置`grid-template-areas:'left  main fight'`，然后子元素设置`grid-area`属性即可
    3. 左边左浮动，右边右浮动，中间自适应即可，

    4. 使用浮动布局。父盒子设置overflow:hidden;，同时设置padding预留两侧的空间。

11. `padding`和`margin`的区别

    首先一个是内边距一个是外边距。一个作用域自身，一个作用于外部。

12. 盒模型，`box-sizing`

    1. content-box：标准盒模型， `width`与 `height`只包括内容的宽和高， 不包括边框（`border`），内边距（`padding`），外边距（`margin`）。
    2. border-box： `width`与 `height` 属性包括内容，内边距和边框，但不包括外边距。注意，填充和边框将在盒子内 , 例如, `.box {width: 350px; border: 10px solid black;}` 导致在浏览器中呈现的宽度为350px的盒子。内容框不能为负，并且被分配到0，使得不可能使用border-box使元素消失。**注意：不包括`margin`！**

13. 如何实现一个三角形？

    ```css
    .triangle {
        width: 0;
        height: 0;
        border: 100px solid transparent;
        border-top: 100px solid red;
    }
    ```

14. 如何实现一个扇形？

    同上，但是需要设置`border-radius: 50%;`

15. margin塌陷问题（margin合并是类似的，但是出现在兄弟元素中，且出现在垂直方向）。

    出现在父子元素中。

    比如父级设置了`margin-top:100px;`

    子级设置了`margin-top:50px;`此时子级设置的margin便不会生效（只取了同方向上的最大值）

    解决：

    - overflow:hidden（触发BFC）
    - 设置padding

    - 利用伪元素设置overflow:hidden;

16. BFC？

    `BFC` 全称：`Block Formatting Context`， 名为 "块级格式化上下文"。简单来说就是，`BFC`是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。那么怎么使用`BFC`呢，`BFC`可以看做是一个`CSS`元素属性。可以通过以下方法触发。

    ​		1.根元素(整个页面就是一个大的BFC)；

    ​		2.float为 left | right；

    ​		3.overflow 为 hidden | auto | scroll；

    ​		4.display为 inline-block | table-cell | table-caption | flex | inline-flex；

    ​		5.position为 absolute | fixed；

    应用：

    - 解决float脱离文档流高度塌陷的问题。
    - 解决margin塌陷

17. 如何设置小于12px的字体？

    ```css
    display: block;
    /* font-size: 12px; */
    transform: scale(0.7);
    -webkit-transform: scale(0.7);
    ```

18. 为什么会出现浮动和什么时候需要清除浮动？清除浮动的方式？

    浮动元素会**脱离文档流**并向左/向右浮动，直到碰到父元素或者另一个浮动元素。之前一般用来做文字环绕图片的样式
    浮动带来的问题：

    1. 父元素的高度无法被撑开，影响与父元素同级的元素
    2. 与浮动元素同级的非浮动元素（内联元素）会跟随其后
    3. 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构。

    清除浮动的方式：

    1. 父级div定义height
    2. 最后一个浮动元素后加空div标签(或者伪元素) 并添加样式clear:both。
    3. 包含浮动元素的父标签添加样式overflow为hidden或auto。
    4. 父级div定义BFC。

19. display:inline-block 什么时候会显示间隙？

    编写代码的空格导致，设置font-size为0即可。

20. 图片格式了解

    | 图片格式         | 支持透明 | 动画支持 | 压缩方式   | 浏览器支持                     | 相对原图大小             | 适应场景                                           |
    | :--------------- | :------- | -------- | ---------- | ------------------------------ | ------------------------ | -------------------------------------------------- |
    | baseline-jpeg    | 不支持   | 不支持   | 有损       | 所有                           | 由画质决定               | 所有通用场景                                       |
    | progressive-jpeg | 不支持   | 不支持   | 有损       | 所有                           | 由画质决定               | 所有通用场景, 渐进式加载                           |
    | gif              | 支持     | 支持     | 无损       | 所有                           | 由帧数和每帧图片大小决定 | 简单颜色，动画                                     |
    | png              | 支持     | 不支持   | 无损       | 所有                           | 由png色值位数决定        | 需要透明时                                         |
    | webp             | 支持     | 不支持   | 有损和无损 | 所有(除IE、Safari和 IOS 设备 ) | 由压缩率决定             | 复杂颜色及形状，浏览器平台可预知                   |
    | svg              | 支持     | 支持     | 无损       | 所有(IE8以上)                  | 由内容和特效复杂度决定   | 简单图形，需要良好的放缩体验，需要动态控制图片特效 |
    |                  |          |          |            |                                |                          |                                                    |

21. css选择器

    `兄弟选择器`：`h1 + p`选择h1后的兄弟元素p（只有一个）；`h1 ~p`选择h1后的所有p标签

    `子元素选择器`：`p > i`选择p元素中的一级i标签

    `后代选择器`：`p i`只要是p中的i标签都会被选择

    `属性选择器`：`a[src^='https']`选择src属性为https开头的a标签

22. css3伪类选择器

    | [ :first-of-type](https://www.runoob.com/cssref/sel-first-of-type.html) | p:first-of-type       | 选择每个p元素是其父级的第一个p元素                        | 3    |
    | ------------------------------------------------------------ | --------------------- | --------------------------------------------------------- | ---- |
    | [:last-of-type](https://www.runoob.com/cssref/sel-last-of-type.html) | p:last-of-type        | 选择每个p元素是其父级的最后一个p元素                      | 3    |
    | [:only-of-type](https://www.runoob.com/cssref/sel-only-of-type.html) | p:only-of-type        | 选择每个p元素是其父级的唯一p元素                          | 3    |
    | [:only-child](https://www.runoob.com/cssref/sel-only-child.html) | p:only-child          | 选择每个p元素是其父级的唯一子元素                         | 3    |
    | [:nth-child(*n*)](https://www.runoob.com/cssref/sel-nth-child.html) | p:nth-child(2)        | 选择每个p元素是其父级的第二个子元素                       | 3    |
    | [:nth-last-child(*n*)](https://www.runoob.com/cssref/sel-nth-last-child.html) | p:nth-last-child(2)   | 选择每个p元素的是其父级的第二个子元素，从最后一个子项计数 | 3    |
    | [:nth-of-type(*n*)](https://www.runoob.com/cssref/sel-nth-of-type.html) | p:nth-of-type(2)      | 选择每个p元素是其父级的第二个p元素                        | 3    |
    | [:nth-last-of-type(*n*)](https://www.runoob.com/cssref/sel-nth-last-of-type.html) | p:nth-last-of-type(2) | 选择每个p元素的是其父级的第二个p元素，从最后一个子项计数  | 3    |
    | [:last-child](https://www.runoob.com/cssref/sel-last-child.html) | p:last-child          | 选择每个p元素是其父级的最后一个子级。                     | 3    |

23. 单行和多行文本省略号如何实现？

    ```CSS
    /* 单行 */
    .one-line {
        word-break:break-all;/*单词截断，任意都可截断*/
        overflow: hidden;  /*超出部分隐藏*/
        white-space: nowrap;  /*禁止换行*/
        text-overflow: ellipsis; /*省略号*/
    }
    /* 多行 */
    .double-line {
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2; /*行数，需指定宽度*/
        -webkit-box-orient: vertical;
      }

    ```

###