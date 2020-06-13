import Vue from 'vue';
import Vuex from 'vuex';

// 要使用某个包，通常用 Vue.use(name) 引入包
Vue.use(Vuex);

// 这里是状态初定义
const state = {

}
// 实时监听state的变化（最新状态），可看作获取数据之前的一种再编辑，相当于对数据的一个过滤和加工
// getter相当于computed计算属性，返回值会根据依赖被缓存起来，只有依赖值发生改变才会被重新计算
// getters可用于监听state中值的变化，返回计算结果
const getters = {

}
// 更改状态的方法
const mutations = {
  
}
// 触发更改的动作（异步）
const actions = {

}
// 暴露出状态实例
export default new Vuex.store({
  state,

})
