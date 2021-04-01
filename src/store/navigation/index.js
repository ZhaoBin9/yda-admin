import mutations from './mutations'
import actions from './actions'
import getters from './getters'
const nav = {
  namespaced: true,
  state: {
    navMenus: [],
    breakCrumb: [],
    openKeys: [],
    selectedKeys: []
  },
  mutations,
  actions,
  getters
}
export default nav
