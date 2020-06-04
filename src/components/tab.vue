<template>
  <div class="tabbar">
    <div class="title">
      {{title}}
    </div>
    <div class="button">
      <button><span class="iconfont">&#xe67b;</span>清除</button>
      <button><span class="iconfont">&#xe6df;</span>保存</button>
      <button><span class="iconfont">&#xe60a;</span>选择颜色</button>
      <!-- 别忘了用字体库时要加class -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab',
  data () {
    return {
      title: 'Kathy is so beautify'

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabbar {
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #546e7a;
}
.title {
  font-size: 20px;
  margin-right: 10px;
  color: #eceff1;
}
button {
  font-size: 16px;
  padding: 5px 10px;
  margin: 0 5px;
}
span {
  margin-right: 5px;
}
</style>
