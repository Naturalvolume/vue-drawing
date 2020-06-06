import Vue from 'vue';
import Vuex from 'vuex';

// 要使用某个包，通常用 Vue.use(name) 引入包
Vue.use(Vuex);
// 这里是状态初定义
const state = {

}
// 更改状态的方法
const mutations = {
  fun(state, n) {

  }
}
// 暴露出状态实例
export default new Vuex.store({
  state,
})
