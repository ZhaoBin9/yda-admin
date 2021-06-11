import mutations from './mutations'
import actions from './actions'
import getters from './getters'
const router = {
  namespaced: true,
  state: {
    routers: [], // 路由权限
    navMenus: [] // 菜单
  },
  mutations,
  actions,
  getters
}
export default router
