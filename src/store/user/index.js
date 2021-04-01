import action from './action'
import getters from './getters'
import mutations from './mutations'

const user = {
  namespaced: true,
  state: {
    userInfo: {
      userName: undefined,
      enterpriseName: undefined
    }
  },
  getters,
  action,
  mutations
}

export default user
