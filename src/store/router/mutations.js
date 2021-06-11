import { SET_ROUTER } from './mutations-type'
const mutations = {
  [SET_ROUTER](state, { routers, navMenus }) {
    state.routers = routers
    state.navMenus = navMenus
  }
}

export default mutations
