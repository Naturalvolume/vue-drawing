## 父组件状态
我们把在线画板分成了两个组件，菜单栏和画板，菜单栏会控制在画板能够画出什么样的图案，所以菜单栏需要给画板传递控制信息，这是兄弟组件间的传值。本项目是涉及到两个兄弟组件间的通信，非常简单，所以选择“子传父，父传子”的通信策略，而不使用vuex。

菜单栏需要传递给画板的状态有：
- 颜色`colors`
- 切换画板类型`drawType`
- 清除画板`clear`
- 下载图片`download`
- 鼠标类型`curCursor`

在父组件中定义上述数据传递给画板组件，然后父组件监听菜单栏的事件改变数据，从而实现菜单栏控制画板的状态。
```html
<!-- 监听菜单栏事件 -->
<Tab @changeCursor='changeCursor' @changeColor='changeColor' @changeType='changeType' @clear='clear' @download='download'></Tab>
<!-- 给画板传值 -->
<Drawing :curCursor='curCursor' :colors="colors" :drawType='drawType' :clearType='clearType' :downLoad='downLoad'></Drawing>
```
```javascript
export default {
  data:() => {
    return {
      // 设置默认鼠标样式
      curCursor: 'default',
      // 设置默认颜色
      colors: {
        hex: '#000',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },

      // 铅笔粗细初始值
      penSize: 1,
      // 笔型，默认是铅笔
      drawType: 'pencil',
      clearType: null,
      downLoad: null,
    }
  },
  methods: {
    changeCursor(val) {
      this.curCursor = val
    },
    changeColor(val) {
      this.colors.hex = val.hex
    },
    changeType(type) {
      this.drawType = type
      // console.log(type)
    },
    clear() {
      // 每次传入一个随机数，所以每次都改变了
      this.clearType = Math.random()
    },
    download() {
      this.downLoad = Math.random()
    }
  }

}
```
## 菜单栏发送事件
给菜单栏的按钮绑定切换状态的事件
```html
<!-- 清除、下载事件 -->
<div class='button-item' @click="tab.title == '选择颜色' ? chooseColor() : tabFun(tab.fun)"><span class="iconfont">{{tab.icon}}</span></div>
<!-- 选择直线、曲线、矩形、圆形等事件 -->
<div :class="[{'selected':tool.isChoose},'button-item']"  @click='drawType(tool)'><span class="iconfont">{{tool.icon}}</span></div>
```
点击按钮向父组件发送改变状态事件
```javascript
export default {
  data() {
    return {
      // 要传给父元素的鼠标类型，作为一个中介
      curCursor: null,
    }
  }
  methods: {
    // 颜色值改变向父元素发送状态
    inputColor(val) {
      this.$emit('changeColor', val)
    },
    // 导航栏按键
    tabFun(fun) {
      if (fun === 'clear') {
        // 清除两层画板
        this.$emit('clear')
      } else if (fun === 'download') {
        // 用api下载图片
        this.$emit('download')
      }
    },
  }
  // 根据点击的按钮更改鼠标样式
    drawType(tool) {
      switch (tool.fun) {
        case 'pencil':
          // 1.改变鼠标格式
          this.curCursor ='text'
          break
        case 'rubber':
          this.curCursor = 'pointer'
          break
        case 'handwriting':
          // 十字线
          this.curCursor = 'crosshair'
          break
        // 注意把使用默认样式的放一起，因为switch没有break会继续向下执行，直到遇到break
        case 'circle':
        case 'square':
        case 'line':
        // 记得一定要设置默认值，防止没有定义可用光标
        default:
          // 浏览器默认
          this.curCursor = 'default'
          break
      }
      // 向父元素发出改变鼠标样式事件，注意这个事件要加引号
      this.$emit('changeCursor', this.curCursor)
      // 选择画笔，画画
      // this.draw_graph(tool.fun)
      this.$emit('changeType', tool.fun)
      // 更改所有tools被选择的状态
      this.chooseImg(tool)
    },
}
```
对于颜色`color`的传递，大家可能会有些疑惑，不是已经在父元素定义过`color`吗，为什么不可以直接使用父元素的，而还是要用在`vue-color`那一节定义过的`colors`呢？

这是因为`v-model='color'`双向绑定了颜色的改变，如果使用父元素中定义的`colors`，那么选择颜色就会改变父元素的状态，这是不允许的，子元素不可以改变父元素的值，所以也要在子元素设置`colors`。
## 画板接收父元素状态，监听状态的改变
父元素传过来的数据，有些是在画板中直接使用的，比如'curCursor'直接在画板区域的dom元素上使用即可实现根据按钮改变鼠标的形状。
```html
<div class="drawing-wrapper" :style="{cursor: curCursor}">
```
有些数据则是调用画板中函数的桥梁，使用watch监听父元素传过来的状态是否改变，watch是vue中常用的函数，和computed的作用有些类似，在下一章会详细讲解watch的使用。
```javascript
export default {
  props: ['curCursor','colors','drawType','clearType','down','penSize'],
  watch: {
    // 监听到样式改变，调用画图函数
    drawType: {
      handler(drawType) {
        this.draw(drawType)
      },
      // 表示一开始就执行handler方法，不等type改变
      // 这里不能一开始就调用画图函数，因为dom还没有渲染好，获取不到
      // immediate: true
    },
    // 监听到颜色改变，调用样式初始化
    // 2.以字符串的形式仅监听对象属性变化，减少性能开销
    'colors.hex': {
      handler() {
        this.changeDrawType()
      }
      // 1.使用深度监听对象属性变化，但会造成性能开销
      // deep:true
    },
    clearType: {
      handler() {
        this.clearContext('1')
      }
    },
    down: {
      handler() {
        this.downloadImage()
      }
    }
  }
}
```
