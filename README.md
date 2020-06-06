# vue-drawing
一个简单的用vue和canvas实现的网页画板
> A Vue.js project
# 组件间传值
### 1.单向数据流：父组件向子组件传值
父组件的prop更新会下流到子组件中，但是反过来不行，防止子组件变更父组件状态。同时，注意
- 不该在子组件内部改变prop
- 需要在子组件中将prop转换成需要的格式时，由于对象和数组是通过引用传入的，所以在子组件中改变对象或数组本身将会影响到父组件的状态。
# 遇到的问题
### 1.unicode编码问题
在标签中可以直接使用unicode字符，如`<span class="iconfont">&#xe7cd;</span>`，但是在`v-for`循环中用对象取unicode编码时就不能在页面中显示出正确的图标了，这是因为：只能在标签中才能使用unicode，而javascript只能处理UCS-2编码。
```
一个unicode为e70b
那么它在标签中的输入方式为:&#xe70b;（unicode的前缀 &#x）

let obj = {icon: '&#xe70b;'}
假如在对象中用unicode，那么就在标签中使用{{String.fromCharCode(parseInt(e70b,16))}}这种写法让其转码（在v-for循环中使用麻烦，还需用正则去除前缀）

或者换一种写法:
let obj = { icon: '\ue70b'}   （UCS-2编码前缀 \u ）
```
