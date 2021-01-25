import { createStore } from 'vuex'
import router from './router/index'
import nav from './navigation/index'
// 非模块状态
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    router,
    nav
  }
})
