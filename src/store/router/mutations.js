import { SET_ROUTER } from './mutations-type'
const mutations = {
  [SET_ROUTER](state, routers) {
    state.routers = routers
  }
}

export default mutations
