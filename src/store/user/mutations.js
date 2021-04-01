import { SET_USER_INFO } from './mutations-type'
const mutations = {
  [SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo
  }
}

export default mutations
