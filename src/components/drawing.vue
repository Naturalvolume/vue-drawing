<template>
  <div class="drawing-wrapper" :style="{cursor: curcursor}">
    <canvas id="canvas" ref="canvas"></canvas>
    <canvas id="canvas_mask" ref="canvas_mask"></canvas>
  </div>
</template>
<script>

export default {
  name: 'drawing',
  props: ['curcursor','colors'],
  data: () => {
    return {
      canvas: null,
      canvas_mask: null,
      // 设置画板上下文
      context: null,
      context_mask: null,
      //
      canDraw: false,
      // 笔的粗细
      pensize: 1
    }
  },
  // 注意啦! 生命周期也是用对象的形式使用
  // 这里若是箭头函数，那么this就找不到vue实例，this.canvasSize.width中的this就会一直是undefined
  mounted: function() {
    this.initCanvas()
    console.log(this.colors.hex)
  },
  methods: {
    // 不能使用箭头函数定义method函数，(例如 plus: () => this.a++)，这样this不能指向vue实例
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.canvas_mask = this.$refs.canvas_mask
      this.context = this.canvas.getContext('2d')
      this.context_mask = this.canvas_mask.getContext('2d')

      // this.context.beginPath()
      //     this.context.moveTo(200, 200)
      //     this.context.lineTo(300, 300)
      //     this.context.stroke()

    },
    // 开始画画
    draw(type) {
      this.canvas_mask.style.zIndex = 1
      // 先画在蒙版上 再复制到画布上
      this.canDraw = false
      let startX, startY
      // 鼠标按下获取 获取xy开始画图
      let mousedown = (e) => {
        // 设置线条颜色
        this.context.strokeStyle = this.colors.hex
        this.context_mask.strokeStyle = this.colors.hex
        // 改变线条粗细
        this.context_mask.lineWidth = this.penSize
        e = e || window.event
        // clientX是相对于当前浏览器页面的横坐标，所以要减去画布左边
        startX = e.clientX
        startY = e.clientY
        // 开始画线，这里的x,y坐标是以画布左上角为原点的
        this.context_mask.moveTo(startX, startY)
        this.canDraw = true
        // 搞不明白为什么一会儿在画布上画，一会儿在蒙板上画
        if (type == 'pencil') {
          this.context_mask.beginPath()
        } else if (type == 'circle') {
          this.context.beginPath()
          this.context.moveTo(startX, startY)
          this.context.lineTo(startX + 2, startY + 2)
          this.context.stroke()
        } else if (type == 'rubber') {
          this.context.clearRect(
            startX - this.penSize * 10,
            startY - this.penSize * 10,
            this.penSize * 20,
            this.penSize * 20
          )
        }
      }
      // 鼠标离开 把蒙版canvas的图片生成到canvas中
      let mouseup = (e) => {
        e = e || window.event
        this.canDraw = false
        // 新建Image对象，这个对象是在哪儿定义的
        let image = new Image()
        if (type != 'rubber') {
          image.src = this.canvas_mask.toDataURL()
          image.onload = () => {
            this.context.drawImage(
              image,
              0,
              0,
              image.width,
              image.height,
              0,
              0,
              this.canvasSize.width,
              this.canvasSize.height
            )
            this.clearContext()
            this.saveImageToAry()
          }
          let x = e.clientX
          let y = e.clientY
          this.context.beginPath()
          this.context.moveTo(x, y)
          this.context.lineTo(x + 2, y + 2)
          this.context.stroke()
        }
      }
      // 鼠标移动
      let mousemove = (e) => {
        e = e || window.event
        let x = e.clientX
        let y = e.clientY
        this.context_mask.setLineDash(this.lineType)
        //方块  即4条直线
        if (type == 'square') {
          if (this.canDraw) {
            this.context_mask.beginPath()
            this.clearContext()
            this.context_mask.moveTo(startX, startY)
            this.context_mask.lineTo(x, startY)
            this.context_mask.lineTo(x, y)
            this.context_mask.lineTo(startX, y)
            this.context_mask.lineTo(startX, startY)
            this.context_mask.stroke()
          }
          //直线
        } else if (type == 'line') {
          if (this.canDraw) {
            this.context_mask.beginPath()
            this.clearContext()
            this.context_mask.moveTo(startX, startY)
            this.context_mask.lineTo(x, y)
            this.context_mask.stroke()
          }
          //画笔
        } else if (type == 'pencil') {
          if (this.canDraw) {
            this.context_mask.lineTo(
              e.clientX - this.canvasLeft,
              e.clientY - this.canvasTop
            )
            this.context_mask.stroke()
          }
          //圆 未画得时候 出现一个小圆
        } else if (type == 'circle') {
          this.clearContext()
          if (this.canDraw) {
            this.context_mask.beginPath()
            let radii = Math.sqrt(
              (startX - x) * (startX - x) + (startY - y) * (startY - y)
            )
            this.context_mask.arc(startX, startY, radii, 0, Math.PI * 2, false)
            this.context_mask.stroke()
          } else {
            this.context_mask.beginPath()
            this.context_mask.arc(x, y, 20, 0, Math.PI * 2, false)
            this.context_mask.stroke()
          }
          //涂鸦 未画得时候 出现一个小圆
        } else if (type == 'handwriting') {
          if (this.canDraw) {
            this.context_mask.beginPath()
            this.context_mask.strokeStyle = this.color.hex
            this.context_mask.fillStyle = this.color.hex
            this.context_mask.arc(x, y, this.penSize * 10, 0, Math.PI * 2, false)
            this.context_mask.fill()
            this.context_mask.stroke()
          } else {
            this.clearContext()
            this.context_mask.beginPath()
            this.context_mask.fillStyle = this.color.hex
            this.context_mask.arc(x, y, this.penSize * 10, 0, Math.PI * 2, false)
            this.context_mask.fill()
            this.context_mask.stroke()
          }
          //橡皮擦 不管有没有在画都出现小方块 按下鼠标 开始清空区域
        } else if (type == 'rubber') {
          this.context_mask.setLineDash([0, 0])
          this.context_mask.lineWidth = 1
          this.clearContext()
          this.context_mask.beginPath()
          this.context_mask.strokeStyle = '#000000'
          this.context_mask.moveTo(x - this.penSize * 10, y - this.penSize * 10)
          this.context_mask.lineTo(x + this.penSize * 10, y - this.penSize * 10)
          this.context_mask.lineTo(x + this.penSize * 10, y + this.penSize * 10)
          this.context_mask.lineTo(x - this.penSize * 10, y + this.penSize * 10)
          this.context_mask.lineTo(x - this.penSize * 10, y - this.penSize * 10)
          this.context_mask.stroke()
          if (this.canDraw) {
            this.context.clearRect(
              x - this.penSize * 10,
              y - this.penSize * 10,
              this.penSize * 20,
              this.penSize * 20
            )
          }
          this.context_mask.setLineDash(this.lineType)
        }
      }
      //鼠标离开区域以外 除了涂鸦 都清空
      let mouseout = () => {
        if (type != 'handwriting') {
          this.clearContext()
        }
      }
    }
  }
}
</script>
<style scoped>
  .drawing-wrapper {
    /* 用绝对定位的优势出来了，完全不用设置margin padding */
    position: relative;
    width: 100%;
    height: 100%;
    background-color: gray;
  }
  canvas {
    /* 绝对定位元素居中，定宽、margin:auto，left right 0缺一不可 */
    position: absolute;
    width: 90%;
    height: 90%;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color:yellow;
  }
</style>
