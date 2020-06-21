<template>
  <div class="tabbar">
    <div class="tab-container">
      <!-- 点击事件监听 -->
      <div class="title">
        {{title}}
      </div>
      <div class="back" v-for="tab in tabs" :key='tab.title'>
          <!-- unicode直接在标签中使用，可以识别这是unicode编码
            在对象中使用再引入，因为js只能chuliUCS-2编码，所以在遍历过程中不能识别unicode编码
            索引在使用前，要先转码
          -->
          <!-- 单独给v-for循环的某个元素绑定方法 -->
          <div class='button-item' @click="tab.title == '选择颜色' ? chooseColor() : tabFun(tab.fun)"><span class="iconfont">{{tab.icon}}</span></div>
        <!-- 别忘了用字体库时要加class -->
      </div>
    </div>
    <!-- 取色器不能用元素名称设置css，因为它会自动生成class，所以要设置class覆盖掉本来的
      取色器的input事件，点击颜色和手动填颜色都会改变input框中的值，改变本组件color，且同时可传val值
      v-model绑定color之后，就可以自动改变color的值了，这就是双向数据绑定
    -->
    <Sketch-picker class='picker' v-model='color' v-show="isChooseColor" @input="inputColor"></Sketch-picker>
    <div class="tools-container">
      <div v-for="tool in tools" :key='tool.title'>
          <!-- 点击根据元素改变事件 :style="{cursor: curCursor}" 鼠标样式只能在固定的元素中保持改变状态 -->
          <!-- 动态绑定样式，注意要加中括号 -->
          <div :class="[{'selected':tool.isChoose},'button-item']"  @click='drawType(tool)'><span class="iconfont">{{tool.icon}}</span></div>
        <!-- 别忘了用字体库时要加class -->
      </div>
    </div>
  </div>
</template>

<script>
// 引入取色器组件
import {Sketch} from "vue-color"

export default {
  name: 'tab',
  components: {
    // 注册取色器
    'Sketch-picker': Sketch
  },
  props: {

  },
  data() {
    return {
      title: 'Drawing',
      // 要传给父元素的鼠标类型
      curCursor: null,
      // 设置是否显示取色器
      isChooseColor: false,
      // 设置取色器原始颜色
      color: {
        hex: '#000',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      tabs: [
        {
          icon: '\ue67b',
          title: '清除',
          fun: 'clear'
        },
        {
          icon: '\ue6df',
          title: '保存',
          fun: 'download'
        },
        {
          icon: '\ue60a',
          title: '选择颜色',
          fun: 'select'
        }
      ],
      tools: [
      {
        icon: '\ue60a',
        title: '铅笔',
        fun: 'pencil',
        // 默认铅笔被选择
        isChoose: true
      },
      {
        icon: '\ue668',
        title: '直线',
        fun: 'line',
        isChoose: false
      },
      {
        icon: '\ue668',
        title: '曲线',
        fun: 'quadratic',
        isChoose: false
      },
      {
        icon: '\ue61a',
        title: '圆形',
        fun: 'circle',
        isChoose: false
      },
      {
        icon: '\ue6f0',
        name: '矩形',
        fun: 'square',
        isChoose: false
      },
      {
        icon: '\ue611',
        title: '填充',
        fun: 'handwriting',
        isChoose: false
      },
      {
        icon: '\ue6c2',
        title: '橡皮',
        fun: 'rubber',
        isChoose: false
      }

    ]
    }

  },
  mounted() {
    document.body.addEventListener('click', this.chooseColorBody)
    let sketch = document.getElementsByClassName('picker')[0]
    // 阻止颜色选择器冒泡，否则点击选择器也会作用到body.click上
    sketch.addEventListener('click', this.stop)
    // 疑问：为什么不能这样绑定
    // document.body.onclick=function(){
		// 	if(this.isChooseColor) this.isChooseColor = false
		// }
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
    chooseColorBody() {
      if(this.isChooseColor) this.isChooseColor = false
    },
    // 手动改变颜色值
    inputColor(val) {
      // 取色器返回来的值跟 colors 的结构是一样的
      this.$emit('changeColor', val)
    },
    // 根据点击的按钮更改鼠标样式
    drawType(tool) {
      switch (tool.fun) {
        case 'pencil':
          // 1.改变鼠标格式
          this.curCursor ="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAZ0lEQVR4AdXOrQ2AMBRF4bMc/zOUOSrYoYI5cQQwpAieQDW3qQBO7Xebxx8bWAk5/CASmRHzRHtB+d0Bkw0W5ZiT0SYbFcl6u/2eeJHbxIHOhWO6Er6/y9syXpMul5PLefAGKZ1/rwtTimwbWLpiCgAAAABJRU5ErkJggg==') 3 24,  auto"
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
    chooseImg(obj) {
      // 更改所有按钮未未选择
      for (let i = 0; i < this.tools.length; i++) {
        this.tools[i].isChoose = false
      }
      obj.isChoose = true
    },

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tabbar {
  cursor: default;
  box-sizing: border-box;
  /* position: fixed; */
  display: flex;
  position: relative;
  justify-content: space-between;
  /* align-items: center; */
  /* top: 0;
  left: 0; */
  /* 找规律：设置了box-sizing后，一定要在每一层都设置宽高 */
  width: 100%;
  height: 100%;
  padding: 10px 30px;
  background-color: #546e7a;
}
.tab-container, .tools-container {
  /* 尤其是高度，好像不设置高度占100%，它就会自由发挥，超出限制 */
  height: 100%;
  display: flex;
  align-items: center;

}
/* 点击改变样式，只改变点击时的
迷惑：为何加上伪类就不能改变整个按钮的颜色了，而只能改变图标部分的 */
/* .button-item :active {
  background-color: #757575;
} */
.tab-container :active {
  background-color: #b0bec5;
}
.title {
  font-size: 20px;
  margin-right: 10px;
  /* color就是设置成了内容物的颜色，包括字体 */
  color: #eceff1;
}
.button-item {
  border: 1px solid #cfd8dc;
  background-color: #cfd8dc;
  color:#37474f;
  font-weight: bold;
  text-align: center;
  margin-right: 2px;
}

span {
  font-size: 16px;
  /* margin: 20px;   仅仅设置margin，不设置block块盒，会导致只吸收左右margin，上下的margin不会改变，因为这是inline元素 */
  display: block;
  margin: 5px;
}
.picker {
  position: absolute;
  top: 50px;
  left: 15%;
  /* 注意设置堆叠层数，否则会被下面的画板根据后来原则覆盖掉 */
  z-index: 20;
}
.selected {
  /* 设置被选择样式，最后加 important表明优先级最高 */
  background: #90a4ae !important;
}
</style>
