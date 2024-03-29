---
title: 计算机操作系统
author: RoleTang
date: '2022-07-15'
---
## 常见面试题以及概念

### 进程和线程的区别

- 进程（Process）是系统进行资源分配和调度的基本单位，线程（Thread）是CPU调度和分派的基本单位；
- 线程依赖于进程而存在，一个进程至少有一个线程；
- 进程有自己的独立地址空间，线程共享所属进程的地址空间；
- 进程是拥有系统资源的一个独立单位，而线程自己基本上不拥有系统资源，只拥有一点在运行中必不可少的资源(如程序计数器,一组寄存器和栈)，和其他线程共享本进程的相关资源如内存、I/O、cpu等；
- 在进程切换时，涉及到整个当前进程CPU环境的保存环境的设置以及新被调度运行的CPU环境的设置，而线程切换只需保存和设置少量的寄存器的内容，并不涉及存储器管理方面的操作，可见，**进程切换的开销远大于线程切换的开销**
-  线程之间的通信更方便，同一进程下的线程共享全局变量等数据，而进程之间的通信需要以进程间通信(IPC)的方式进行；
- 多线程程序只要有一个线程崩溃，整个程序就崩溃了，但多进程程序中一个进程崩溃并不会对其它进程造成影响，因为进程有自己的独立地址空间，因此多进程更加健壮

### 进程间通信有哪些方式

- 管道(Pipe)
  - 管道是半双工的，数据只能向一个方向流动；需要双方通信时，需要建立起两个管道；
  - 一个进程向管道中写的内容被管道另一端的进程读出。写入的内容每次都添加在管道缓冲区的末尾，并且每次都是从缓冲区的头部读出数据；
  - 只能用于父子进程或者兄弟进程之间(具有亲缘关系的进程)
- 命名管道
- 消息队列
- 信号(Signal)
- 共享内存
- 信号量(Semaphore)：初始化操作、P操作、V操作；P操作：信号量-1，检测是否小于0，小于则进程进入阻塞状态；V操作：信号量+1，若小于等于0，则从队列中唤醒一个等待的进程进入就绪态
- 套接字(Socket)



### 进程同步问题

> 进程的同步是目的，而进程间通信是实现进程同步的手段

1. 临界区

   各个进程中对临界资源（互斥资源/共享变量，一次只能给一个进程使用）进行操作的程序片段

2. 同步：多个进程因为合作而使得进程的执行有一定的先后顺序。比如某个进程需要另一个进程提供的消息，获得消息之前进入阻塞态；

3. 互斥：多个进程在同一时刻只有一个进程能进入临界区

4. 并发：在一个时间段中同时有多个程序在运行，但其实任一时刻，只有一个程序在CPU上运行，宏观上的并发是通过不断的切换实现的；

5. 多线程：并发运行的一段代码。是实现异步的手段

6. 并行（和串行相比）：在多CPU系统中，多个程序无论宏观还是微观上都是同时执行的

7. 异步（和同步相比）：同步是顺序执行，异步是在等待某个资源的时候继续做自己的事

8. 进程的状态

   ![](/os/进程状态.png)

   - 就绪状态：进程已获得除处理机以外的所需资源，等待分配处理机资源
   - 运行状态：占用处理机资源运行，处于此状态的进程数小于等于CPU数
   - 阻塞状态： 进程等待某种条件，在条件满足之前无法执行



### 线程同步有哪些方式？

> 为什么需要线程同步：线程有时候会和其他线程共享一些资源，比如内存、数据库等。当多个线程同时读写同一份共享资源的时候，可能会发生冲突。因此需要线程的同步，多个线程按顺序访问资源。

- **互斥量** Mutex：互斥量是内核对象，只有拥有互斥对象的线程才有访问互斥资源的权限。因为互斥对象只有一个，所以可以保证互斥资源不会被多个线程同时访问；当前拥有互斥对象的线程处理完任务后必须将互斥对象交出，以便其他线程访问该资源；
- **信号量** Semaphore：信号量是内核对象，它允许同一时刻多个线程访问同一资源，但是需要控制同一时刻访问此资源的最大线程数量。信号量对象保存了**最大资源计数**和**当前可用资源计数**，每增加一个线程对共享资源的访问，当前可用资源计数就减1，只要当前可用资源计数大于0，就可以发出信号量信号，如果为0，则将线程放入一个队列中等待。线程处理完共享资源后，应在离开的同时通过`ReleaseSemaphore`函数将当前可用资源数加1。如果信号量的取值只能为0或1，那么信号量就成为了互斥量；
- **事件** Event：允许一个线程在处理完一个任务后，主动唤醒另外一个线程执行任务。事件分为手动重置事件和自动重置事件。手动重置事件被设置为激发状态后，会唤醒所有等待的线程，而且一直保持为激发状态，直到程序重新把它设置为未激发状态。自动重置事件被设置为激发状态后，会唤醒**一个**等待中的线程，然后自动恢复为未激发状态。
- **临界区** Critical Section：任意时刻只允许一个线程对临界资源进行访问。拥有临界区对象的线程可以访问该临界资源，其它试图访问该资源的线程将被挂起，直到临界区对象被释放。

**互斥量和临界区有什么区别？**

互斥量是可以命名的，可以用于不同进程之间的同步；而临界区只能用于同一进程中线程的同步。创建互斥量需要的资源更多，因此临界区的优势是速度快，节省资源。



### 什么是用户态和内核态？

为了限制不同程序的访问能力，防止一些程序访问其它程序的内存数据，CPU划分了用户态和内核态两个权限等级。

- 用户态只能受限地访问内存，且不允许访问外围设备，没有占用CPU的能力，CPU资源可以被其它程序获取；
- 内核态可以访问内存所有数据以及外围设备，也可以进行程序的切换。

所有用户程序都运行在用户态，但有时需要进行一些内核态的操作，比如从硬盘或者键盘读数据，这时就需要进行系统调用，使用**陷阱指令**，CPU切换到内核态，执行相应的服务，再切换为用户态并返回系统调用的结果。



### 什么是死锁？

> 所谓死锁，则是指多个进程在并发执行过程中因争夺不可抢占资源而造成的一种僵局。当这种僵局出现时会使得这一组进程都处于永远等待（阻塞）的状态。

### 死锁产生的必要条件？

- **互斥**：一个资源一次只能被一个进程使用；
- **请求和保持**：一个进程因得不到需要的资源而阻塞自己时，并不释放已分配给它的资源；
- **非抢占**：已经分配给一个进程的资源不能被强制性抢占，只能由进程完成任务之后自愿释放；
- **循环等待**：若干进程之间形成一种头尾相接的环形等待资源关系，该环路中的每个进程都在等待下一个进程所占有的资源。

### 死锁有哪些处理方法？

1. 鸵鸟策略：直接忽略死锁。因为解决死锁问题的代价很高，因此鸵鸟策略这种不采取任务措施的方案会获得更高的性能。当发生死锁时不会对用户造成多大影响，或发生死锁的概率很低，可以采用鸵鸟策略。

2. 死锁的预防：

   - 破坏互斥条件
   - 破坏占有并等待条件
   - 破坏非抢占条件
   - 破坏循环等待条件源

3. 死锁的避免：动态地检测资源分配状态，以确保系统处于安全状态，只有处于安全状态时才会进行资源的分配。所谓安全状态是指：即使所有进程突然请求需要的所有资源，也能存在某种对进程的资源分配顺序，使得每一个进程运行完毕。

   > 银行家算法

4. 死锁解除

   > 如何检测死锁：检测有向图是否存在环；或者使用类似死锁避免的检测算法。

   死锁解除的方法：

   - 利用抢占：挂起某些进程，并抢占它的资源。但应防止某些进程被长时间挂起而处于饥饿状态；
   - 利用回滚：让某些进程回退到足以解除死锁的地步，进程回退时自愿释放资源。要求系统保持进程的历史信息，设置还原点；
   - 利用杀死进程：强制杀死某些进程直到死锁解除为止，可以按照优先级进行。




