import BasicLayout from '@/layout/BasicLayout'
import RouteView from '@/layout/RouteView'
import { getPermissionList } from '@/apis/user'
const setRouteComponent = item => {
  let routes = {
    path: item.url,
    name: item.url.split('/')[1],
    meta: { title: item.name },
    component: () => import(`@/views${item.url}`)
  }
  if (!item.parentId && item.child) {
    if (item.child[0].type === 2) {
      routes.meta.permission = item.child.map(item => item.code)
    } else {
      routes.redirect = item.child[0].url
      routes.component = RouteView
      routes.children = []
    }
  } else if (!item.parentId && !item.child) {
    null
  } else if (item.parentId) {
    routes.meta.permission = item.child ? item.child.map(item => item.code) : null
    routes.name = item.url.split('/')[2]
    if (routes.name === 'apply' || routes.name === 'applyList') {
      return [
        routes,
        {
          path: item.url + '/detail',
          name: routes.name + 'detail',
          meta: { title: `${routes.meta.title},用印详情` },
          component: () => import(`@/views/seal/apply/detail`)
        }
      ]
    }
  } else {
    routes.redirect = item.child[0].url
    routes.component = RouteView
    routes.children = []
  }
  return [routes]
}
let navNum = 0
const deepIneratorRoutes = (ineratorArr, targetArr) => {
  ineratorArr.forEach(item => {
    const routes = setRouteComponent(item)
    if (item.child && item.child[0].type !== 2) {
      deepIneratorRoutes(item.child, routes[0].children)
    }

    targetArr.push(...routes)
  })
}
const deepIneratorNav = (ineratorArr, targetArr) => {
  ineratorArr.forEach(item => {
    navNum++
    const navItem = {}
    if (item.meta.title && item.children) {
      navItem.children = []
      deepIneratorNav(item.children, navItem.children)
    }
    navItem.key = item.name
    navItem.title = item.meta.title ? item.meta.title : item.children[0].meta.title
    navItem.path = item.path
    navItem.icon = navNum === 1 ? item.name : null
    !navItem.path.includes('detail') && targetArr.push(navItem)
    navNum--
  })
}
const asyncRouter = async () => {
  const { data } = await getPermissionList()
  const routes = {
    key: '',
    name: 'index',
    path: '/',
    component: BasicLayout,
    redirect: '/dashboard/analysis',
    meta: {
      title: null
    },
    children: []
  }
  const navList = []
  deepIneratorRoutes(data, routes.children)
  deepIneratorNav(routes.children, navList)
  return { routes, navList }
}
export default asyncRouter
