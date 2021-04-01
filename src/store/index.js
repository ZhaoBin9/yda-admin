import { createStore } from 'vuex'
import router from './router/index'
import nav from './navigation/index'
import user from './user'
// 非模块状态
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    router,
    nav,
    user
  }
})
