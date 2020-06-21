## vue的组件间传值
组件间的传值有以下几种情况：
- 父子组件间
- 兄弟组件间
#### 父子组件间的传值方式
父组件通过prop给子组件下发数据，子组件通过事件给父组件发送信息。
1. 父组件中定义数据
```javascript
export default {
  data() {
    return {
      width: 5px;
    }
  }
}
```
2. 父组件传递给子组件
`width`是在父组件中的名称，`wid`是传给子组件的名称
```html
<Tab :width="wid"></Tab>
```

3. 子组件用props接收数据
``` javascript
export default {
  props: ['wid']
}
```
4. 子组件向父组件发送改变宽度为20px事件
```html
<div @click="change"></div>
```
``` javascript
methods() {
  change() {
    this.$emit('changeWid', 20px)
  }
}
```
5. 父组件监听子组件事件
```html
<Tab :width="wid" @changeWid='changeWidth'></Tab>
```
``` javascript
export default {
  export default {
  data() {
    return {
      width: 5px;
    }
  },
  methods: {
    changeWidth(val) {
      this.width = val
    }
  }
}
}
```
#### 兄弟组件间的传值方式
1. 子传父，父传子
使用父子传值的方式
2. [eventBus](https://www.cnblogs.com/zmyxixihaha/p/11340450.html)
3. vuex
