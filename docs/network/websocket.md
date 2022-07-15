---
title: WebSocket
author: RoleTang
date: '2022-07-10'
---

## WebSocket

WebSocket 是一种在单个TCP连接上进行全双工通信的协议。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，只需要一次握手便能能创建持久性的连接，允许服务端主动向客户端推送数据。

默认端口也是80（ws）和443（wss）

心跳保活机制：每隔一段固定的时间发送一次信息告诉你我还活着。

- 服务器=>客户端 pong
- 客户端=>服务器ping

解释：WebSocket也是基于Tcp的，socket是tcp连接的端点。顾名思义，WebSocket就是用于web的tcp连接，但它是长连接，同时弥补了http协议的一些不足。

`本质`：是一种`计算机网络应用层的协议`，用来弥补http协议在持久通信能力上的不足。

在建立连接的时候主要多了这么两个字段

`Upgrade: websocket`
`Connection: Upgrade`

语法：

```javascript
var aWebSocket = new WebSocket(url [, protocols]);
```

建立成功后，可以监听socket的事件

- **`open`** —— 连接已建立，
- **`message`** —— 接收到数据，
- **`error`** —— WebSocket 错误，
- **`close`** —— 连接已关闭。

应用场景：

- 即时聊天通信
- 多玩家游戏
- 在线协同编辑/编辑
- 实时数据流的拉取与推送