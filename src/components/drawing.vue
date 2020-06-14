<template>
  <div class="drawing-wrapper" ref='container' :style="{cursor: curcursor}">
    <!-- 这是专门作为下载图片的连接，javascript:void(0);表示执行一个空函数，不跳转页面
      download是定义的图片名称，v-show这个连接不显示
     -->
    <a ref='download' href='javascript:void(0);' download='image.png' v-show='false'></a>
    <canvas id="canvas" ref="canvas"></canvas>
    <canvas id="canvas_mask" ref="canvas_mask"></canvas>
  </div>
</template>

<script>
export default {
  name: 'drawing',
  // 1.直接使用父组件传值时可以用数组，比较方便
  props: ['curcursor','colors','drawType','clearType','down','penSize'],
  // 2.要规定传入的需求（类型、默认值、是否必须时），用对象
  // 注意：这样写至少需要定义值的类型，否则会无法识别props
  // props: {
  //   curcursor: String,
  //   drawType: {
  //     type: String,
  //     default: 'pencil'  不需要添加默认值，一开始父组件就传递值过来了
  //   },
  //   colors: Object
  // },
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
      // penSize: 1,
      // 虚线间隔初始值
      lineType: [0, 0],
      widthSize: 0,
      heightSize: 0
    }
  },
  // 用watch监听父组件传来的值是否发生变化
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
      // 默认是铅笔
      this.draw(this.drawType)
      // offset可以获取元素与左边元素的距离，这里能用是因为画板左侧没有元素
      // 这里也不能用，因为宽高不能随着浏览器的变化而变化
      // this.widthSize = canvas.offsetLeft
      // top是离上层空间的位置，这里不能用，因为上面有导航栏
      // this.heightSize = canvas.offsetTop
      // console.log(this.widthSize, this.heightSize)
    },
    changeDrawType() {
      // 先初始化，设置线条颜色等基本信息
        // 每次切换颜色／线条／样式时更新
        this.context.strokeStyle = this.colors.hex
        this.context_mask.strokeStyle = this.colors.hex
        this.context_mask.fillStyle = this.colors.hex
        // 改变线条粗细
        this.context_mask.lineWidth = this.penSize
    },
    draw(type) {
      console.log(type)
      // 注意啦！这里z-index转换成了驼峰式
      // 不要设置堆叠！！不要设置背景颜色！！
      // this.canvas_mask.style.zIndex = 1
      // 先画在蒙版上 再复制到画布上
      this.canDraw = false
      let startX, startY
      this.changeDrawType()
      // 鼠标按下获取xy开始画图
      let mousedown = (e) => {

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
        // 这里只有橡皮需要在鼠标按下和鼠标按下且移动时都写清除逻辑
        // 圆也不用写，是因为只要有鼠标移动就一直画的有圆，不管canDraw的状态
        // 而橡皮不能只要移动就清除区域，一定要按下才可以
        else if (type == 'rubber') {
          // 实现按下鼠标就清除区域，而不是非要移动
          this.context.clearRect(
            startX - this.penSize,
            startY - this.penSize,
            this.penSize * 2,
            this.penSize * 2
          )
        }
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
            console.log(image.width, image.height)
            this.context.drawImage(image, 0, 0, image.width, image.height)

            // this.canvas.style.zIndex = 2

            // 清除mask画板
            this.clearContext()
          }
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
          // 清除画布放到哪里都可以
          this.clearContext()
          if (this.canDraw) {
            this.context_mask.beginPath()
            // 鼠标移动过程中边画边清除，在beginpath之前或之后清除都无所谓
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
            // 注意啦！铅笔和涂鸦都不用在开始画之后一直清除屏幕了！因为它们就是要连续的画的轨迹
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
            console.log(this.context_mask.strokeStyle)
            this.context_mask.arc(x, y, this.penSize * 10, 0, Math.PI * 2, false)
            this.context_mask.fill()
            // 直接填充就好，干嘛还要stroke
            // this.context_mask.stroke()
          } else {
            this.clearContext()
            this.context_mask.beginPath()
            // this.context_mask.fillStyle = this.color.hex
            this.context_mask.arc(x, y, this.penSize * 10, 0, Math.PI * 2, false)
            this.context_mask.fill()
            // this.context_mask.stroke()
          }
          //橡皮擦 不管有没有在画都出现小方块 按下鼠标 开始清空区域
        } else if (type == 'rubber') {
          // 橡皮擦干嘛还用虚线
          // this.context_mask.setLineDash([0, 0])
          // 线性保持为1
          this.context_mask.lineWidth = 1
          this.clearContext()
          this.context_mask.beginPath()
          // 外框保持黑色
          this.context_mask.strokeStyle = '#000000'
          this.context_mask.strokeRect(x - this.penSize, y - this.penSize, this.penSize*2, this.penSize*2)
          if (this.canDraw) {
            this.context.clearRect(
              x - this.penSize,
              y - this.penSize,
              this.penSize * 2,
              this.penSize * 2
            )
          }
          // this.context_mask.setLineDash(this.lineType)
        } else if (type == 'quadratic') {
          if(this.canDraw) {
            this.clearContext()
            this.context_mask.beginPath()
            this.context_mask.moveTo(startX, startY)
            let controlX = (startX + x) * 0.5
            let controlY = Math.abs(startY - y) * 0.3
            this.context_mask.quadraticCurveTo(controlX, controlY, x, y)
            this.context_mask.stroke()
          }
        }
      }
      // 鼠标离开区域以外 要清空残影，否则会有圆遗留
      let mouseout = () => {
          this.clearContext()
      }

      // onmousedown onmousemove onmouseup鼠标的一系列事件
      this.canvas_mask.onmousedown = () => mousedown()
      this.canvas_mask.onmousemove = () => mousemove()
      this.canvas_mask.onmouseup = () => mouseup()
      this.canvas_mask.onmouseout = () => mouseout()
    },
    clearContext(type) {
      if (!type) {
        this.context_mask.clearRect(0, 0, this.widthSize, this.heightSize)
      } else {
        this.context_mask.clearRect(0, 0, this.widthSize, this.heightSize)
        this.context.clearRect(0, 0, this.widthSize, this.heightSize)
      }
    },
    // 自定义下载画板图片
    downloadImage() {
      // 将连接的地址改成图片的地址
      this.$refs.download.href = this.canvas.toDataURL()
      // 再触发点击事件，连接发现不能是可以跳转的格式，就会自动下载
      this.$refs.download.click()
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
    background-color: #eceff1;
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
    border: 3px solid #90a4ae;
    border-radius: 10px;
    /* 在画板里不要设置背景颜色！！不要设置堆叠层！！ */
    /* background-color:yellow; */
  }
</style>
