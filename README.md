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
### 2.flex:1 真的很好用
两种方式实现自适应的 导航栏－内容 布局
```
方式一：固定定位＋flex
#app {
  /* 在根元素中使用flex，才能在子元素中用flex:1吸收剩余元素 */
  display: flex;
  /* 这个方向决定了 flex:1 吸收的方向 */
  flex-direction: column;
  /* 这里实现占满整个视口，一定要设置width、height，否则不能占满视口 */
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: blue;

}
.tab-container {
  height: 60px;
  width: 100%;
  background-color:red;
}
.drawing-container {
  width: 100%;
  /* flex:1 的妙用，相当于 flex-grow:1 元素自适应吸收剩余空间; flex-shrink:1 空间不够时缩小元素； flex-basis：0 不设置元素固定占据的位置 */
  flex: 1;
  background-color: aqua;
}
方式二：固定定位＋绝对定位
#app {
  position: fixed;
  background-color: blue;
  /* 这里实现占满整个视口，注意要加width、height，仅靠top left不能实现这样的效果 */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.tab-container {
  /* 顶部栏定高 */
  height: 60px;
  width: 100%;
  background-color:red;
}
.drawing-container {
  /* 内容区域绝对定位，设置top、bottom */
  position: absolute;
  width: 100%;
  top: 60px;
  bottom: 0;

  background-color: aqua;
}
```
