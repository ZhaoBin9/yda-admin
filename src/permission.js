// 路由守卫及权限管理
import router from '@/router/config-router'
import store from '@/store'
import asyncRouter from '@/router/async-router'
// 控制面包屑
const handleBreakCrumb = to => {
  const ary = to.meta.pids ? [...to.meta.pids] : []
  const breakCrumb = []
  while (ary.length) {
    const id = ary.pop()
    const item = mapTree(id)
    item && breakCrumb.push(item)
  }
  // 控制导航刷新
  breakCrumb[1] && store.commit('nav/set_open_keys', [breakCrumb[1].id])
  breakCrumb[0] && store.commit('nav/set_selected_keys', [breakCrumb[0].id])
  store.commit(`nav/set_breakcrumb`, breakCrumb)
}
// 查找相关节点
const mapTree = id => {
  let result = null
  const fn = list => {
    for (const key in list) {
      if (list[key].id === id) {
        result = list[key]
        break
      }
      if (list[key].children && list[key].children.length) fn(list[key].children)
    }
  }
  fn(store.state.nav.navMenus)
  return result
}
// 白名单
const whiteList = ['login'] // 无需登陆的页面
// 守卫
router.beforeEach((to, from, next) => {
  // 判断本地缓存
  const userId = localStorage.getItem('sjg-org-admin-userId')
  if (userId) {
    if (store.state.router.routers.length === 0) {
      // 动态添加路由
      asyncRouter().then(res => {
        const { navMenus, routers } = res
        for (const key in routers) {
          router.addRoute(routers[key])
        }
        store.commit(`router/set_router`, routers)
        store.commit(`nav/set_nav_menu`, navMenus)
        next(to.path)
      })
    } else {
      handleBreakCrumb(to)
      if (to.path === '/login') {
        next('/home')
        return
      }
      next()
    }
  } else {
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({ path: '/login', query: { redirect: '/home' } })
    }
  }
})
