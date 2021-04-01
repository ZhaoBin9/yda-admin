import { SET_NAV_MENU, SET_BREAKCRUMB, SET_OPENKEYS, SET_SELECTEDKEYS } from './mutations-type'
const mutations = {
  [SET_NAV_MENU](state, navMenus) {
    state.navMenus = navMenus
  },
  [SET_BREAKCRUMB](state, breakCrumb) {
    state.breakCrumb = breakCrumb
  },
  [SET_OPENKEYS](state, openKeys) {
    state.openKeys = openKeys
  },
  [SET_SELECTEDKEYS](state, selectedKeys) {
    state.selectedKeys = selectedKeys
  }
}

export default mutations
