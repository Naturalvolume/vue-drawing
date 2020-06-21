## computed和watch
computed和watch都是当值发生改变时被触发，但是两者的使用场景不同
- computed：只有当被计算的值（可能多个值的联合）发生改变时被触发，适用于计算已有的值并返回结果
- watch：监听某个值，当它变化时，执行对应的操作（触发函数），[watch的深度监听](https://www.cnblogs.com/yesu/p/9546458.html)
