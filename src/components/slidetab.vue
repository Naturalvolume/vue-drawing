<template>
  <div class="wrapper">
    <div class="line-style"></div>
    <ul>
      <li><span class="iconfont"></span>铅笔</li>
      <li><span class="iconfont">&#xe7cd;</span>直线</li>
      <li><span class="iconfont">&#xe668;</span>虚线</li>
      <li><span class="iconfont">&#xe61a;</span>圆形</li>
      <li><span class="iconfont">&#xe6f0;</span>矩形</li>
      <li><span class="iconfont">&#xe611;</span>填充</li>
      <li><span class="iconfont">&#xe6c2;</span>橡皮</li>
    </ul>
  </div>
</template>

<script>
// 这里就是这个组件中要使用的数据等
export default {

}
</script>
<style scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 92px;
  bottom: 0;
}
li {
  height: 30px;
  width: 280px;
  background-color: #cfd8dc;
}
</style>
