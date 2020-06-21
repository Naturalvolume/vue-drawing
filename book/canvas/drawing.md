## 开始画图
画图时需要考虑这些逻辑问题：
- 画图函数是`draw(type)`，参数`type`是从导航栏传递过来的画图类型参数。
- 按下鼠标时决定了所画图形的起始位置，鼠标移动时会在这个过程中画无数个图形的终止位置（鼠标每移动一个位置就对应一个终止位置），鼠标抬起，移动到的最后一个位置就是终止位置。在这过程中，需要`canDraw`参数控制是否可以画图，需要`startX, startY`存储图形起始位置。
- 画板上的坐标是以左上为原点的，向下是y的正轴，向右是x的正轴，所以鼠标点击后需要实时获取鼠标相对于画板原点的坐标。
- 在html中定义了两层`canvas`，在掩码画板`canvas_mask`中每次画完图形就以图片的形式把图形画到真正的画板上，这是因为在鼠标移动的过程中是一直在画图的，所以在画图过程中要一直清除掩码画板，若是不把图形存到真正的画板上，每次就只能显示一个图形。
- 鼠标离开画板区域以外，要清空掩码画板，因为圆是一直有显示一个小圆的，在画圆的模式下，鼠标离开区域而不清除就会留下圆的残影。
`draw()`函数的框架如下：
```javascript
export default {
  methods: {
    draw(type) {
      // 鼠标抬起落下时控制是否可以画图
      this.canDraw = false
      // 图形的起始位置
      let startX, startY
      this.changeDrawType()
      // 1.鼠标按下
      let mouseDown = (e) => {
        e = e || window.event
        // （1）点击事件的 offset 偏移量就是鼠标相当于元素的位置
        startX = e.offsetX
        startY = e.offsetY

        // （2）可以画图
        this.canDraw = true
      }

      // 2. 鼠标移动
      let mouseMove = (e) => {
        e = e || window.event
        // （1）获取当前的鼠标坐标
        let x = e.offsetX
        let y = e.offsetY

      }

      // 3.鼠标离开 把蒙版canvas的图片复制到canvas中，防止每画一个图像蒙板清空一次
      let mouseUp = (e) => {
        e = e || window.event
        // （1）鼠标移开，不能再画了
        this.canDraw = false
        // （2）新建图片存储canvas_mask图形
        let image = new Image()
        // （3）只要不是橡皮擦模式，就要保存图形
        if (type != 'rubber') {
          // （4）得到图形的编码
          image.src = this.canvas_mask.toDataURL()
          // （5）在 Image 加载完成后才可以画到画板上
          image.onload = () => {
            //console.log(image.width, image.height)
            this.context.drawImage(image, 0, 0, image.width, image.height)

            // （6）清除mask画板
            this.clearContext()
          }
        }
      }

      // 4. 鼠标离开画板区域以外
      let mouseOut = () => {
          // 要清空残影，否则会有圆遗留
          this.clearContext()
      }

      // 5. 给鼠标的一系列事件绑定函数
      this.canvas_mask.onmousedown = () => mouseDown()
      this.canvas_mask.onmousemove = () => mouseMove()
      this.canvas_mask.onmouseup = () => mouseUp()
      this.canvas_mask.onmouseout = () => mouseOut()
    }
  }
}
```
#### 直线、矩形、曲线
直线、矩形、曲线是最简单的形式，只需要写鼠标移动的逻辑就可。
1. 判断类型
2. 判断是否可以画图
3. 清除画布（边画边清除）
4. 开辟路径`beginPath()`
5. 根据起始点`(startX, startY)`终止点`(x, y)`画图
其中曲线是使用的贝塞尔曲线，不是标准意义上的曲线。
```javascript
let mouseMove = (e) => {
  //方块  即4条直线
  if (type == 'square') {
    if (this.canDraw) {
      this.clearContext()
      this.context_mask.beginPath()
      this.context_mask.strokeRect(startX, startY, x-startX, y-startY)
    }
  } else if (type == 'quadratic') {
    if(this.canDraw) {
      this.clearContext()
      this.context_mask.beginPath()
      // 从起始点开始画
      this.context_mask.moveTo(startX, startY)
      // 设置二次贝塞尔曲线的控制点
      let controlX = (startX + x) * 0.5
      let controlY = Math.abs(startY - y) * 0.3
      // 画线
      this.context_mask.quadraticCurveTo(controlX, controlY, x, y)
      // 描边
      this.context_mask.stroke()
    }
  } else if (type == 'line') {
    if (this.canDraw) {
      this.context_mask.beginPath()
      this.clearContext()
      this.context_mask.moveTo(startX, startY)
      this.context_mask.lineTo(x, y)
      this.context_mask.stroke()
    }
  }
}
```
#### 铅笔
铅笔是用无数个连续的直线组成的，所以铅笔不能在鼠标移动的过程中一直清除画布，铅笔要在按下鼠标之后开辟路径，移到起始点，在鼠标移动时不断画直线。
```javascript
let mouseDown = (e) => {
  // 前面的省略
  if (type == 'pencil') {
    this.context_mask.beginPath()
    this.context_mask.moveTo(startX, startY)
  }
}
let mouseMove = (e) => {
  // 省略
  if (type == 'pencil') {
    if (this.canDraw) {
      // 不断画线
      this.context_mask.lineTo(x, y)
      this.context_mask.stroke()
    }
  }
}
```
#### 圆形
圆形与直线的不同在于，圆形要在还没有画图时在鼠标位置显示小圆，表示是画圆。
```javascript
let mouseMove = (e) => {
  // 省略
  if (type == 'circle') {
    // 这里要一直清除，因为有小圆
    this.clearContext()
    // 可以画图
    if (this.canDraw) {
      this.context_mask.beginPath()
      // 根据坐标求半径
      let radii = Math.sqrt((startX - x) * (startX - x) + (startY - y) * (startY - y))
      this.context_mask.arc(startX, startY, radii, 0, Math.PI * 2, false)
      this.context_mask.stroke()
    } else {
      // 不能画图，以鼠标为中心显示小圆
      this.context_mask.beginPath()
      this.context_mask.arc(x, y, 10, 0, Math.PI * 2, false)
      this.context_mask.stroke()
    }
}
```
#### 橡皮
橡皮是唯一一个不需要一直清除画布的，但它需要具备在鼠标按下也可以清除画布的功能，并且要一直显示清除区域的矩形。
```javascript
let mouseDown = (e) => {
  // 省略
  if (type == 'rubber') {
    // 按下鼠标就清除区域，而不用非要移动
    this.context.clearRect(
      startX - this.penSize,
      startY - this.penSize,
      this.penSize * 2,
      this.penSize * 2
    )
  }
}
let mouseMove = (e) => {
  // 省略
  if (type == 'rubber') {
    // 橡皮一直保持线型为1
    this.context_mask.lineWidth = 1
    // 橡皮也要一直清除！！它也是一直在画正方形框的
    this.clearContext()
    this.context_mask.beginPath()
    // 外框保持黑色
    this.context_mask.strokeStyle = '#000000'
    this.context_mask.strokeRect(
      x - this.penSize,
      y - this.penSize,
      this.penSize*2,
      this.penSize*2
    )
    if (this.canDraw) {
      this.context.clearRect(
        x - this.penSize,
        y - this.penSize,
        this.penSize * 2,
        this.penSize * 2
      )
    }
  }
}
```
