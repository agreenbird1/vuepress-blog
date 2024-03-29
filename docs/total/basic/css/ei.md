---
title: css基础
author: RoleTang
date: '2022-09-14'
---

1. 层叠上下文

  我们假定用户正面向（浏览器）视窗或网页，而 HTML 元素沿着其相对于用户的一条虚构的 z 轴排开，层叠上下文就是对这些 HTML 元素的一个三维构想。

   使用了以下属性的元素会形成一个层叠上下文，同时会被单独提升为一个合成层。

   - `HTML`根元素
   - 普通元素设置了`z-index`属性，且其`position`属性不为`static`
   - `opacity`属性值不为1
   - 设置了`transform`属性，不为none
   - 设置了`filter`属性，不为none
   - 设置了`will-change`属性

  总结：

    层叠上下文可以包含在其他层叠上下文中，并且一起创建一个层叠上下文的层级。
    每个层叠上下文都完全独立于它的兄弟元素：当处理层叠时只考虑子元素。
    每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

2. [「2021」高频前端面试题汇总之CSS篇 - 掘金 (juejin.cn)](https://juejin.cn/post/6905539198107942919#heading-51)

3. clientHeight,scrollHeight,offsetHeight

   clientHeight：表示的是可视区域的高度，包含内边距

   offsetHeight：包括元素的边框、内边距和元素的水平滚动条

   scrollHeight：包含元素被折叠的高度，包括内边距

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
          与flex写法一致，但是 display:grid;

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

     ``border-radius``:相对于自身。[百分比时](https://www.runoob.com/css3/css3-border-radius.html)

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

   ```css

      flex-basis:0; // => 代表当前元素的最小宽度。

      flex: 1; =>  flex-grow: 1; flex-shrink: 1; flex-basis: 0%;
      // 只改变第一个 flex-grow
      flex: 2; =>  flex-grow: 2; flex-shrink: 1; flex-basis: 0%;

      flex: auto; =>  flex-grow: 1; flex-shrink: 1; flex-basis: auto;

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

    4. 使用定位，左侧盒子定位。右侧盒子设置margin-left的值

    5. 使用浮动。两个盒子均左浮动，父盒子设置左侧padding，右子盒子设置margin-left值并采用相对定位移动，类似三栏布局。



10. 三栏布局

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

15. margin塌陷问题与margin合并。

      - margin塌陷

        出现在父子元素中，且只有垂直方向。比如父级设置了`margin-top:100px;`子级设置了`margin-top:50px;`此时子级设置的margin便不会生效

        总结：父子嵌套的垂直方向的margin值只取了同方向上的最大值

        解决：

          - `overflow:hidden`（触发BFC）
          - 设置padding
          - 利用伪元素设置`overflow:hidden;`

      - margin合并

        出现在兄弟元素中，且只有垂直方向。比如上兄弟设置下边距为100px，下兄弟设置上边距值为100px。本应该200px的间距但只会有100px。

        解决：

          - 进行计算，直接设置为200px
          - 包裹一个外层元素设置`overflow:hidden;`触发bfc，但是会更改页面结构


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
    2. 最后一个浮动元素后加空div标签(或者伪元素，为元素需要设置为块级) 并添加样式clear:both。意思是可以在父级元素最后添加了一个块级元素同时清除了浮动。
    3. 父级div定义触发BFC。

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

    hover也是伪类选择器

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

24. css可以继承的属性

font系列：font-size、font-weight、font-style等

text系列:   text-align line-height等

25. css动画

@keyframes和animation配合使用

通过在动画序列中定义关键帧（或 waypoints）的样式来控制 CSS 动画序列中的中间步骤。和 转换 transition 相比，关键帧 keyframes 可以控制动画序列的中间步骤。

26. 如何更好的写css？

    1. 比如多用多重选择器，而不是分开写。
        ```css
        h1,
        h2 {
            font-size: 16px;
        }

        // 而不是
        h1 {
           font-size: 16px;
        }
        h2 {
           font-size: 16px;
        }
        ```
    2. 对于单个的独特的样式，可以采用id选择器而不是类选择器。
    3. 多使用简写属性，而不是分开写。
    4. 写`color`的时候直接写对应的十六进制而不是写`red`之类；比如写`font-weight`直接使用`700`而不是`bold`。
    5. 合理的使用`will-change`属性，因为它可以更好的利用`gpu`的性能；但也不能过度，因为会有较多的计算。


27. CSS关键字：initial、inherit、unset、revert

  - initial：初始值，也就是该属性的定义的值。取决于该属性是否被继承，因为可以继承的属性的值会将初始值覆盖。`当css属性使用该值的时候代表使该元素为其初始值。`

  - inherit：从父元素继承该属性的值，没有就一层一层向上直到根元素。如果仍然没有就会使用浏览器的默认样式，如果还没有那么就是使用初始值。

  - unset：1. 如果是继承属性，且父级有定义，则将属性值重设为继承属性；2. 如果不是继承属性，则将属性值设为初始值

  - revert：和unset类似，但是对于第二种情况，是将属性值设为浏览器默认样式。

28. nth-child()的用法

  :nth-child() 选择器，该选择器选取父元素的第 N 个子元素，与类型无关。

  - 一、选择列表中的偶数标签:nth-child(2n)

  - 二、选择列表中的奇数标签 :nth-child(2n-1)

  - 三、选择从第6个开始的，直到最后:nth-child(n+6)

  - 四、选择第1个到第6个 :nth-child(-n+6）

  - 五、两者结合使用，可以限制选择某一个范围，选择第6个到第9个 :nth-child(n+6):nth-child(-n+9)

29. position

  - static

    该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 top, right, bottom, left 和 z-index 属性无效。

  - relative

    该关键字下，元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。position:relative 对 table-*-group, table-row, table-column, table-cell, table-caption 元素无效。

  - absolute

    元素会被移出正常文档流，并不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。

  - fixed

    元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform, perspective 或 filter 属性非 none 时，容器由视口改为该祖先。

  - sticky

    元素根据正常文档流进行定位，然后相对它的*最近滚动祖先（nearest scrolling ancestor）*和 containing block (最近块级祖先 nearest block-level ancestor)，包括 table-related 元素，基于top, right, bottom, 和 left的值进行偏移。偏移值不会影响任何其他元素的位置。 该值总是创建一个新的层叠上下文（stacking context）。注意，一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的overflow 是 hidden, scroll, auto, 或 overlay时），即便这个祖先不是最近的真实可滚动祖先。这有效地抑制了任何“sticky”行为（详情见Github issue on W3C CSSWG）。