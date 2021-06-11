import { createStore } from 'vuex'
import router from './router'
import nav from './navigation'
import user from './user'
import globalData from './globalData'
// 非模块状态
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    router,
    nav,
    user,
    globalData
  }
})
