## 颜色选择器
对呀一个画板，能够自由的选择和切换颜色是必须的，在这里使用`vue-color`取色器。
#### 1.安装
```
npm install --save vue-color
```
#### 2.引入
在`tab.vue`中引入取色器组件
```javascript
import {Sketch} from "vue-color"
//注册
export default {
  components: {
    'sketch-picker': Sketch
  },
}
```
#### 3.设置数据
```javascript
export default {
  data() {
    return {
      // 是否显示取色器
      isChooseColor: false,
      // 设置取色器原始颜色
      color: {
        hex: '#000',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      }
    }
  }
}
```
#### 4.页面布局
颜色选择器是点击调色盘按钮后出现的，所以将颜色选择器布局到菜单栏下方。

(1) 它的父级是导航栏
```html
<div class='tabbar'>
  <Sketch-picker class='picker'></Sketch-picker>
</div>
```
(2) 父级相对定位，颜色选择器绝对定位
```css
.tabbar {
  position: relative;
}
.picker {
  position: absolute;
  top: 50px;
  left: 15%;
  /* 注意设置堆叠层数，否则会被下面的画板根据后来原则覆盖掉 */
  z-index: 20;
}
```
这里要注意：
- 不能用标签名`Sketch-picker`设置样式，css并不能识别这个标签名
- 要设置堆叠，否则会被下面的画板覆盖

#### 5.实现点击效果
给颜色选择器绑定事件，实现
- 颜色选择双向绑定，自定义`color`，点击选择器改变`color`
- 点击按钮出现，再次点击按钮或其它地方消失
```html
<!-- 最终的颜色选择器 -->
<Sketch-picker class='picker' v-model='color' @input="inputcolor" v-show="ischoosecolor"></Sketch-picker>
```
(1) 双向绑定`v-model='color'`
监听input事件
```javascript
inputColor(val) {
  // 取色器返回来的值跟 colors 的结构是一样的
  this.color = val
},
```
(2) 点击效果
`v-show="ischoosecolor"`决定了颜色选择器是否显示
先在调色盘按钮上绑定事件，注意这里是在按钮列表中找到调色盘按钮绑定，所以要用三元选择符判断，后面的函数先空起来。
```html
<!-- 按钮点击事件 -->
<div class='button-item' @click="tab.title == '选择颜色' ? chooseColor() : "><span class="iconfont">{{tab.icon}}</span></div>
```
还要在页面上添加点击事件，实现点击任意地方都可以关闭颜色选择器，这时候就要用到生命周期函数mounted了，它表示vue实例初始化完成，可以操作dom节点了。
```javascript
export default {
  mounted() {
    // 给body添加监听事件
    document.body.addEventListener('click', this.chooseColorBody)
    // 给选择器添加事件，是为了阻止点击颜色选择器冒泡，否则点击选择器也会作用到body.click上，从而关闭颜色选择器
    let sketch = document.getElementsByClassName('picker')[0]
    sketch.addEventListener('click', this.stop)
  },
  methods: {
    // 点击之后发出改变父元素状态的事件
    chooseColor(e) {
      e = e || window.event
      this.isChooseColor = this.isChooseColor ? false : true
      // 必须要阻止事件冒泡，才能实现跟文档主页的交替
      e.stopPropagation()
    },
    stop() {
      let e = e || window.event
      e.stopPropagation()
    },
    chooseColorBody() {
      if(this.isChooseColor) this.isChooseColor = false
    }
  }
}
```
注意：
- 阻止冒泡非常重要，尤其是在上层元素绑定的有点击事件时
- 颜色选择器sketch在0级事件中已经绑定了`input`，还想绑定`click`事件，需要使用`addEventListener`添加多个事件
