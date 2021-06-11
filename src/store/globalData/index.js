import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const globalData = {
  namespaced: true,
  getters,
  state: {
    applyProcessList: [],
    isFetchApplyProcess: false,
    applyUpdate: [] // 让用印管理刷新
  },
  mutations,
  actions
}

export default globalData
