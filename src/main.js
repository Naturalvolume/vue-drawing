// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入全局样式
import '../src/assets/global-style.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
// 新建唯一vue实例
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
