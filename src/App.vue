<template>
  <div id="app">
    <!-- 渲染路由 -->
    <!-- <router-view/> -->
    <Tab :ok='isok'></Tab>
    <div class="drawing-container">
      <Drawing></Drawing>
    </div>

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
      isok: true,
      // 是否选择颜色
      ischoosecolor: false,
      //
      toolsToggle: false,
      // 铅笔粗细初始值
      penSize: 1,
      // 虚线间隔初始值
      lineType: [0, 0],
      //
      canDraw: false,
    }

  }

}
</script>

<style>

.drawing-container {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background-color:red;
  /* width:100%;
  height:100%; */
  /* margin-top: 56px; */
}
</style>
