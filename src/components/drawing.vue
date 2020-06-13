<template>
  <div class="drawing-wrapper" ref='container' :style="{cursor: curcursor}">
    <canvas id="canvas" ref="canvas"></canvas>
    <canvas id="canvas_mask" ref="canvas_mask"></canvas>
  </div>
</template>

<script>
export default {
  name: 'drawing',
  props: ['curcursor','colors','type'],
  data: () => {
    return {
      container: null,
      canvas: null,
      canvas_mask: null,
      // 设置画板上下文
      context: null,
      context_mask: null,
      //
      canDraw: false,
      // 笔的粗细
      pensize: 10,
      // 虚线间隔初始值
      lineType: [0, 0],
      widthSize: 0,
      heightSize: 0
    }
  },
  // 用watch监听父组件传来的值是否发生变化
  watch: {
    type: {
      handler(type) {
        // console.log(type, 'canvas')
        this.draw(type)
      }

    }
  },
  // 注意啦! 生命周期也是用对象的形式使用
  // 这里若是箭头函数，那么this就找不到vue实例，this.widthSize的this就会一直是undefined
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
      // offset可以获取元素与左边元素的距离，这里能用是因为画板左侧没有元素
      // 这里也不能用，因为宽高不能随着浏览器的变化而变化
      // this.widthSize = canvas.offsetLeft
      // top是离上层空间的位置，这里不能用，因为上面有导航栏
      // this.heightSize = canvas.offsetTop
      // console.log(this.widthSize, this.heightSize)
    },
    // 开始画画
    draw(type) {
      console.log(type)
      // 注意啦！这里z-index转换成了驼峰式
      this.canvas_mask.style.zIndex = 1
      // 先画在蒙版上 再复制到画布上
      this.canDraw = false
      let startX, startY

      // 鼠标按下获取xy开始画图
      let mousedown = (e) => {
        // 先初始化，设置线条颜色等基本信息
        // 应该在每次移动时都更新一下线条样式
        this.context.strokeStyle = this.colors.hex
        this.context_mask.strokeStyle = this.colors.hex
        this.context_mask.fillStyle = this.colors.hex
        // 改变线条粗细
        this.context_mask.lineWidth = this.penSize
        e = e || window.event
        // clientX是相对于当前浏览器页面的横坐标，所以要减去画布左边右边
        // 后面开始画时要用到这两个数据（这里也是正确的）
         // 用了更简便的offsetX Y
        // this.widthSize = this.canvas.offsetLeft
        // this.heightSize = this.canvas.offsetTop + this.canvas.offsetParent.offsetParent.offsetTop
        // startX = e.clientX - this.widthSize
        // startY = e.clientY - this.heightSize
        startX = e.offsetX
        startY = e.offsetY

        // 开始画线，这里的x,y坐标是以画布左上角为原点的
        // 疑问：为什么这里直接使用了moveTo，明明没有beginPath()就没办法画
        // this.context_mask.moveTo(startX, startY)

        // 按下鼠标就可以画图了
        this.canDraw = true
        // 这里必须要在鼠标按下时就开辟一条路径
        if (type == 'pencil') {
          this.context_mask.beginPath()
        }
        // circle和rubber是在这里设置圆和橡皮的初始大小，实现点击即可画圆，清除画板
        // else if (type == 'circle') {
        //   // 疑问：不理解
        //   this.context.beginPath()
        //   this.context.moveTo(startX, startY)
        //   this.context.lineTo(startX + 5, startY + 5)
        //   this.context.stroke()
        // } else if (type == 'rubber') {
        //   // clearRect(height = this.heightSize,height)清除指定的矩形区域，x,y表示矩形起始坐标
        //   this.context.clearRect(
        //     startX - this.penSize * 10,
        //     startY - this.penSize * 10,
        //     this.penSize * 20,
        //     this.penSize * 20
        //   )
        // }
      }
      // 鼠标离开 把蒙版canvas的图片复制到canvas中，防止每画一个图像蒙板清空一次
      let mouseup = (e) => {
        e = e || window.event
        // 鼠标移开，不能再画了
        this.canDraw = false
        // 获取鼠标离开时的坐标
        // let x = e.clientX
        // let y = e.clientY
        // Image相当于创建了imgdom元素，作用：1.图片预加载 2.服务器统计点击量
        let image = new Image()
        if (type != 'rubber') {
          image.src = this.canvas_mask.toDataURL()
          image.onload = () => {
            console.log(image)
            this.context.drawImage(
              image,
              0,
              0,
              image.width,
              image.height,
              0,
              0,
              this.widthSize, this.heightSize
            )
            this.canvas.zIndex = 2

            // 清除mask画板
            // this.clearContext()
            // this.saveImageToAry()
          }

          // this.context.beginPath()
          // this.context.moveTo(x, y)
          // this.context.lineTo(x + 2, y + 2)
          // this.context.stroke()
        }
      }
      // 鼠标移动
      let mousemove = (e) => {
        e = e || window.event
        // 获取当前的鼠标坐标（这里也是正确的）
        // let x = e.clientX - this.widthSize
        // let y = e.clientY - this.heightSize
        let x = e.offsetX
        let y = e.offsetY
        // 设置所有线性都为虚线，包括矩形、圆、铅笔
        // this.context_mask.setLineDash(this.lineType)
        //方块  即4条直线
        if (type == 'square') {
          if (this.canDraw) {

            this.context_mask.beginPath()
            // 鼠标移动过程中边画边清除，在beginpath之前或之后清除都无所谓
            this.clearContext()
            this.context_mask.strokeRect(startX, startY, x-startX, y-startY)
            // 矩形不需要描边，strokeRect本身就有描边效果 this.context_mask.stroke()
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
            // 这里不能再加beginpath，moveto了
            // this.context_mask.moveTo(startX, startY)
            this.context_mask.lineTo(
              x,
              y
            )
            this.context_mask.stroke()
          }
          //圆 未画得时候 出现一个小圆
        } else if (type == 'circle') {
          // 这里要一直清除，因为有小圆
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
            this.context_mask.arc(x, y, 10, 0, Math.PI * 2, false)
            this.context_mask.stroke()
          }
          //涂鸦 未画得时候 出现一个小圆
          // 这个涂鸦跟我想要的不一样，看看能不能实现填充闭合图形
        } else if (type == 'handwriting') {
          if (this.canDraw) {
            this.context_mask.beginPath()
            // this.context_mask.strokeStyle = this.color.hex
            // this.context_mask.fillStyle = this.color.hex
            this.context_mask.arc(x, y, this.penSize * 10, 0, Math.PI * 2, false)
            this.context_mask.fill()
            // 直接填充就好，干嘛还要stroke
            // this.context_mask.stroke()
          } else {
            this.clearContext()
            this.context_mask.beginPath()
            // this.context_mask.fillStyle = this.color.hex
            this.context_mask.arc(x, y, this.penSize * 10, 0, Math.PI * 2, false)
            // 未填充的时候 this.context_mask.fill()
            this.context_mask.stroke()
          }
          //橡皮擦 不管有没有在画都出现小方块 按下鼠标 开始清空区域
        } else if (type == 'rubber') {
          // 橡皮擦干嘛还用虚线
          // this.context_mask.setLineDash([0, 0])
          // 线性保持为1
          this.context_mask.lineWidth = 1
          // this.clearContext()
          this.context_mask.beginPath()
          // 外框保持黑色
          this.context_mask.strokeStyle = '#000000'
          this.context_mask.strokeRect(x - this.penSize * 10, y - this.penSize * 10, this.penSize*20, this.penSize*20)

          // this.context_mask.moveTo(x - this.penSize * 10, y - this.penSize * 10)
          // this.context_mask.lineTo(x + this.penSize * 10, y - this.penSize * 10)
          // this.context_mask.lineTo(x + this.penSize * 10, y + this.penSize * 10)
          // this.context_mask.lineTo(x - this.penSize * 10, y + this.penSize * 10)
          // this.context_mask.lineTo(x - this.penSize * 10, y - this.penSize * 10)
          // this.context_mask.stroke()
          if (this.canDraw) {
            this.context.clearRect(
              x - this.penSize * 10,
              y - this.penSize * 10,
              this.penSize * 20,
              this.penSize * 20
            )
          }
          // this.context_mask.setLineDash(this.lineType)
        }
      }
      //鼠标离开区域以外 除了涂鸦 都清空
      // let mouseout = () => {
      //   if (type != 'handwriting') {
      //     this.clearContext()
      //   }
      // }

      // onmousedown onmousemove onmouseup鼠标的一系列事件
      this.canvas_mask.onmousedown = () => mousedown()
      this.canvas_mask.onmousemove = () => mousemove()
      this.canvas_mask.onmouseup = () => mouseup()
      // this.canvas_mask.onmouseout = () => mouseout()
    },
    clearContext(type) {
      if (!type) {
        this.context_mask.clearRect(0, 0, this.widthSize, this.heightSize)
        // 神奇，这里又是哪里不对了，明明一样的写法
        // this.context_mask.clearRect(
        //   0,
        //   0,
        //   this.widthSize,
        //   this.heighSize
        // )
      } else {
        this.context_mask.clearRect(0, 0, this.widthSize, this.heightSize)
        this.context.clearRect(0, 0, this.widthSize, this.heightSize)
      }
    },
    //保存历史 用于撤销
    saveImageToAry() {
      // this.cancelIndex = 0
      // let dataUrl = this.canvas.toDataURL()
      // this.cancelList.push(dataUrl)
    },
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
    /* 这里！！果然！！因为这个出错了！！所以不要在css中定义画板大小，要在行内定义 */
    /* width: 90%;
    height: 90%; */
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color:yellow;
  }
</style>
