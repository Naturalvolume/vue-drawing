<template>
  <div class="drawing-wrapper">
    <canvas id="canvas" ref="canvas"></canvas>
    <!-- <canvas id="canvas_mask" ref="canvas_mask"></canvas> -->
  </div>
</template>
<script>
export default {
  name: 'drawing',
  data: () => {
    return {
      canvasSize: {
        // 应该改成屏幕宽高适应的形式
        // 注意这里不能加单位
        width: document.documentElement.clientWidth - 100,
        height: document.documentElement.clientHeight * 0.75,
      },
      // 取canvas的dom元素
      // canvas: this.$refs.canvas,
      // 取 canvas蒙板画板 dom元素
      // canvas_mask: this.$refs.canvas_mask,
    }
  },
  // 注意啦! 生命周期也是用对象的形式使用
  // 这里若是箭头函数，那么this就找不到vue实例，this.canvasSize.width中的this就会一直是undefined
  mounted: function() {
    console.log(document.documentElement.clientWidth)
    console.log(document.documentElement.clientHeight)
  console.log(this.canvasSize.width)
      console.log(this.canvasSize.height)
    // this.initCanvas()
  },
  methods: {
    // 不能使用箭头函数定义method函数，(例如 plus: () => this.a++)，这样this不能指向vue实例
    // initCanvas() {
    //   this.canvas = document.getElementById('canvas')
    //   this.canvas.width = this.canvasSize.width
    //   this.canvas.height = this.canvasSize.height
    //   console.log(this.canvasSize.width)
    //   console.log(this.canvasSize.height)
    // }
  }
}
</script>
<style scoped>
  .drawing-wrapper {
    /* position: fixed;
    top: 0;
    box-sizing: border-box; */
    position: relative;
    width: 100%;
    height: 100%;
    /* padding: 100px 5%; */
    background-color: gray;
  }
  canvas {
    /* 绝对定位元素居中，定宽、margin:auto，left right 0缺一不可 */
    position: absolute;
    width: 80%;
    height: 80%;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color:yellow;
  }
</style>
