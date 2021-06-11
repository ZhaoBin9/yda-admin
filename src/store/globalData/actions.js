import { SET_APPLY_PROCESS_LIST, SET_IS_Fetch_APPLY_PROCESS } from './mutations-type'
import { getFingerProcessList } from '@/apis/businessManage'

export default {
  async [SET_APPLY_PROCESS_LIST]({ commit }, resolve) {
    const res = await getFingerProcessList()
    commit(`${SET_IS_Fetch_APPLY_PROCESS}`, true)
    commit(`${SET_APPLY_PROCESS_LIST}`, res.data)
    resolve && resolve()
  }
}
