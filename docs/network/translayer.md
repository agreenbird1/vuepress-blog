---
title: 运输层
author: RoleTang
date: '2022-07-10'
---

### 运输层（TCP/UDP）

#### TCP（Transmission Control Protocol：传输控制协议）

特点：`面向连接的`、`面向字节的`、`可靠的`（无差错、无乱序、无丢失、无重复）的`全双工通信`。可以进行`拥塞控制`，进行的是`一对一`的通信

`可靠传输原理`：`停止等待协议`（没有收到确认包不会进行继续发送，无差错、超时、丢失等情况）。

`滑动窗口（连续ARQ协议）`：

接收方发送的报文段会有一个`窗口`字段，相当于接收方自身还能接收的最大值，同时它说明了当前发送方能够发送的最大的数据，同时发送方的发送窗口的值不能超出这个窗口字段。

在没有接收到接收方的确认的情况下，可以将窗口内的所有数据都发送出去，凡是已经发送过去的数据，86在未接收到确认之前都需要进行保留，以便超时重传时候使用。

一般发送窗口会维护三个指针，从左到右依次对应发送窗口的最左边，中间和最右边。

1. p1：发送窗口的起始位置

2. p2：已发送未收到确认的最后位置，也是允许发送但未发送的起始位置

   ![image-20220411144722710](/network/确认ack.png)

3. p3：发送窗口的末尾位置

同时滑动窗口的移动是根据接收方的确认包来进行的。根据接收方的确认的窗口大小的收缩和确认情况控制p1、p3、（前沿、后沿）的移动以及p2的更改。

`TCP的流量控制`：所谓的流量控制就是让发送的发送速率不要太快，要让对方来得及接收。接收方的存储缓存是有限的。

就是利用TCP的滑动窗口，接收方通过序号和窗口值来控制发送方的发送窗口的大小，实现发送速率的控制。

`拥塞控制`：就是防止过多的数据注入到网络中，防止路由器和链路过载。一般也是基于窗口的。发送方会维持一个拥塞窗口的变量，其大小取决于网络的拥塞程度，且发送窗口等于拥塞窗口。

网络没有拥塞，就可以使窗口值变大一些，拥塞了就缩小一些。

需要设置一个门限值，在门限值以下才使用慢开始算法，否则使用拥塞避免算法。

具体方法：

- 慢开始：把拥塞窗口（发送窗口）设置一个值，从小到大两倍增长，一直达到设置的慢开始门限值为止。（刚开始并不知道网络拥塞程度，可以 以次进行探测）
- 拥塞避免：到达慢开始门限值之后就每次收到一个确认包后使拥塞窗口的值增加1。
- 快重传：网络出现超时时、立即开始慢开始。同时设置拥塞窗口的值为1，门限值为之前拥塞窗口值的一半。
- 快恢复：连续收到三个重复确认后将拥塞窗口的值降一半（超出一定时间没有接收到某个报文的确认包会重传报文）

`socket`：是TCP连接的端点，由 (ip地址：端口号)组成。

`TCP的三次握手`：TCP的连接过程被称作握手。

`确认ACK`

字段：SYN = 1, ACK = 0 ==> 请求连接

​			 SYN = 1, ACK = 1 ==> 同意连接

​			 `序号（seq）` `确认号（ack）`。（第一次发送没有传递数据仍需要序号）

序号：发送报文的第一个字节。

确认号：下一次发送方应该想要收到的第一个字节。

1. 第一次握手：SYN = 1, seq = x。确认接收方的发送能力。（同步已发送状态）
2. 第二次握手：SYN = 1, ACK = 1, seq = y, ack  = x + 1。确认发送方的接收发送能力。（同步收到）
3. 第三次握手：ACK = 1, seq = x + 1, ack = y + 1。确认接收方的接收能力。（已建立连接状态）

问？

1. 第一次握手可以携带数据吗？

   不可以，因为如果有人恶意攻击，尽管无法建立连接，也会带来大量垃圾数据.

2. 可以握手两次便建立连接吗？

   不可以

   1. 首先是只发送两次无法判断客户端是否接收到了第二次的确认包，也无法确认客户端是否具有接收数据的能力
   2. 同时也可能出现，第一次握手的数据包在网络中滞留的情况。当滞留后的数据包再次发送到服务器端时，服务器会误以为这是一个新的请求，就直接响应，此时若是直接成功连接的话便会大程度浪费server端资源。

3. 可以采用四次握手吗？

   可以，可以如挥手一般，第二次只发送确认ACK包，不发送SYN请求包。换成第三次发送。但会造成资源浪费，没有必要。

4. 如果客户端出现错误怎么办？

   服务器会维护一个定时器。当连续两小时没有接收到客户端的请求之后便会发送探测包，每75s发送一个，若是连续10个探测报文仍无反应，便关闭连接。

`TCP的四次挥手`：

字段：FIN = 1, seq = u(前面发送的最后的一个字节 + 1)

![image-20220304110552022](/network/四次挥手.png)

1. 第一次握手：FIN = 1, seq = u。连接释放，停止发送数据。(A --> B)
2. 第二次握手：ACK = 1, seq = v, ack = u + 1。确认释放，进入`关闭等待`状态。(B --> A)
3. 第三次握手：FIN = 1, ACK = 1, seq = w, ack = u + 1(B --> A)
4. 第四次握手：ACK = 1, ack = w + 1, seq = u + 1(A --> B)

第四次握手完毕之后A必须等待2MSL（最长报文寿命段）时间，目的有二

1. 保证确认包发送到B。若丢失，确保B收不到时候重传FIN = 1, ACK = 1确认时候A能收到，并再次发送最后一次确认。
2. 等待2MSL后，本次连接的所有报文段都会消失，即失效。

#### UDP（User Datgram Protocol：用户数据协议）

特点：`无连接`、`面向报文`、`尽最大努力交付`和`没有拥塞控制`同时支持`一对一、一对多、多对一、多对多`等多种交互通信。

常用于：电话、视频等


