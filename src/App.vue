<template>
  <div id="app">
    <!-- 渲染路由 -->
    <!-- <router-view/> -->
    <div class="tab-container">
      <!-- 父组件监听子组件的no事件 -->
      <Tab @changecurcor='change' @changecolor='changecolor' @changetype='changetype' @clear='clear' @download='download'></Tab>
    </div>
    <div class="drawing-container">
      <Drawing :curcursor='curcursor' :colors="colors" :drawType='pentype' :clearType='clearType' :down='down'></Drawing>
    </div>
    <!-- <div class="footer"></div> -->
  </div>
</template>

<script>
import Tab from './components/tab.vue'
import Drawing from './components/drawing'

export default {
  // name相当于一个全局ID，1.在组件的递归调用中，调用组件自己
  // 2.使用调试工具时，可以看到组件的名称，更好定位
  // 3.当使用keep-alive时可以用include和exclude指定需要缓存和不需要缓存的组件
  name: 'App',
  // 要在这里把要用的组件注册一下
  components: {
    Tab,
    Drawing
  },
  data:() => {
    return {
      // 设置默认鼠标样式
      curcursor: 'default',
      // 是否选择颜色
      ischoosecolor: false,
      //
      colors: {
        hex: '#000',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },

      toolsToggle: false,
      // 铅笔粗细初始值
      penSize: 1,
      // 虚线间隔初始值
      lineType: [0, 0],
      //
      canDraw: false,
      // 笔型，默认是铅笔
      pentype: 'pencil',
      clearType: null,
      down: null,
    }
  },
  methods: {
    change(val) {
      this.curcursor = val
    },
    changecolor(val) {
      this.colors.hex = val.hex
    },
    changetype(type) {
      this.pentype = type
      // console.log(type)
    },
    clear() {
      // 每次传入一个随机数，所以每次都改变了
      this.clearType = Math.random()
    },
    download() {
      this.down = Math.random()
    }
  }

}
</script>

<style>
#app {
  /* 在根元素中使用flex，才能在子元素中用flex:1吸收剩余元素 */
  /* display: flex; */
  /* 这个方向决定了 flex:1 吸收的方向 */
  /* flex-direction: column; */

  /* box-sizing: border-box;   根元素这里没有使用padding之类不用定义这个，这个属性并不能继承*/
  position: fixed;
  /* 这里实现占满整个视口，注意要设置width、height，只设置top left不能实现这样的效果 */
  width: 100%;
  height: 100%;
  /* top: 0;
  left: 0; */
}
.tab-container {
  height: 60px;
  width: 100%;
  /* background-color:red; */
  /* z-index: 10; */
}
.drawing-container {
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0;
  /* height: calc(100% -60px);    这个属性并没有做成占满剩下的高度 */
  /* display: flex; */
  /* flex: 1; */
}
</style>
