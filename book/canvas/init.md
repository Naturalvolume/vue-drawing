## 画板初始化
画板初始化包括画板宽高的设置、获取画板上下文等操作，其中画板的宽高要设置成自适应浏览器的形式。
#### 获取canvas元素
vue中获取元素的dom节点有两种方式：
- 原生`getElementById`、`getElementsByClassName`、`getElementsByTagName`
- ref
在本项目中使用ref，它比原生的方式减少渲染次数，性能更好
```html
<div class="drawing-wrapper" ref='container' :style="{cursor: curCursor}">
  <canvas id="canvas" ref="canvas"></canvas>
  <canvas id="canvas_mask" ref="canvas_mask"></canvas>
</div>
```
#### 设置画板宽高
有几个注意的点：
- 宽高要设置成行内style，防止画板变形
- 通过canvas包围盒的宽高设置canvas的宽高，包围盒的宽高通过`clientWidth`获取
- 通过监听窗口尺寸的变化使画板大小自适应改变
- 通过ref获取dom元素和监听浏览器窗口大小的变化都要定义在`mounted`生命周期函数中，因为这个时候dom元素渲染完成
```javascript
export default {
  mounted: function() {
    // 包围盒的上下文，用来设置canvas的宽高
    this.container = this.$refs.container
    this.initCanvas()
    // 监听浏览器大小变化，画板大小自适应
    window.onresize = () => {
      this.initSize()
    }
  },
  methods: {
    // 不能使用箭头函数定义method函数，(例如 plus: () => this.a++)，这样this不能指向vue实例
    initSize() {
      this.widthSize = this.container.clientWidth * 0.9
      this.heightSize = this.container.clientHeight * 0.9
      this.canvas.width = this.widthSize
      this.canvas.height = this.heightSize
      this.canvas_mask.width = this.widthSize
      this.canvas_mask.height = this.heightSize
    },
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.canvas_mask = this.$refs.canvas_mask
      this.context = this.canvas.getContext('2d')
      this.context_mask = this.canvas_mask.getContext('2d')
      this.initSize()
      // 默认是铅笔
      this.draw(this.drawType)
    }
}
```

