import { SET_APPLY_PROCESS_LIST, SET_IS_Fetch_APPLY_PROCESS, SET_APPLY_UPDATE } from './mutations-type'
export default {
  [SET_APPLY_PROCESS_LIST](state, list) {
    state.applyProcessList = list
  },
  [SET_IS_Fetch_APPLY_PROCESS](state, result) {
    state.isFetchApplyProcess = result
  },
  [SET_APPLY_UPDATE](state, result) {
    if (Array.isArray(result)) {
      state.applyUpdate = result
    } else {
      state.applyUpdate = state.applyUpdate.filter(item => item !== result)
    }
  }
}
