<template>
  <div id="app">
    <!-- 渲染路由 -->
    <!-- <router-view/> -->
    <Tab></Tab>
    <SlideTab></SlideTab>
  </div>
</template>

<script>
import Tab from './components/tab.vue'
import SlideTab from './components/slidetab.vue'

export default {
  name: 'App',
  // 要在这里把要用的组件注册一下
  components: {
    Tab,
    SlideTab
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
