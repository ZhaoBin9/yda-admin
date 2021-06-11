import { SET_ROUTER } from './mutations-type'
import asyncRouter from '@/router/async-router'
import router from '@/router/config-router'

const actions = {
  async [SET_ROUTER]({ commit }, resolve) {
    const { navList, routes } = await asyncRouter()
    router.addRoute(routes)
    commit(`${SET_ROUTER}`, { routers: [routes], navMenus: navList })
    resolve && resolve()
  }
}

export default actions
