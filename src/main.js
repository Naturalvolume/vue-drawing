// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
// 引入全局样式
import '../src/assets/global-style.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
// 新建唯一vue实例
new Vue({
  // el只在new创建实例时生效，提供一个在页面上已存在的dom元素作为vue实例的挂载目标
  el: '#app',
  // router,
  components: { App },
  // template后是一个作为vue实例标识使用的字符串模版
  // 模版会替换挂载的元素，挂载元素的内容都将被忽略
  template: '<App/>'
})
