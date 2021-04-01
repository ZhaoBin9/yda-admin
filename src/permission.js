// 路由守卫及权限管理
import router from '@/router/config-router'
import store from '@/store'
import asyncRouter from '@/router/async-router'
import { SET_NAV_MENU } from '@/store/navigation/mutations-type'
import { SET_ROUTER } from '@/store/router/mutations-type'

// // 白名单
const whiteList = ['/login'] // 无需登陆的页面
// // 守卫
router.beforeEach(async (to, from, next) => {
  // 判断本地缓存
  const userId = localStorage.getItem('yda-admin-userInfo')
  if (userId) {
    if (store.state.router.routers.length === 0) {
      // 动态添加路由
      const { navList, routes } = await asyncRouter()
      router.addRoute(routes)
      store.commit(`router/${SET_ROUTER}`, [routes])
      store.commit(`nav/${SET_NAV_MENU}`, navList)
      const redirect = decodeURIComponent(from.query.redirect || to.path)
      if (to.path === redirect) {
        next({ ...to, replace: true })
      } else {
        next({ path: redirect })
      }
    } else {
      if (to.path === '/login' && !to.query.switch) {
        next('/dashboard/analysis')
        return
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login', query: { redirect: '/dashboard/analysis' } })
    }
  }
})
