import mutations from './mutations'
import actions from './actions'
import getters from './getters'
const router = {
  namespaced: true,
  state: {
    routers: []
  },
  mutations,
  actions,
  getters
}
export default router
