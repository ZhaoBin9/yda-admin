import { notification } from 'ant-design-vue'
// import store from '@/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '@/router/config-router'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // baseURL: 'http://ydatestapi.libawall.com',
  withCredentials: true,
  timeout: 10 * 60 * 1000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  console.warn('请求异常:' + error)
  return Promise.reject(error)
}

function objToFormData(obj) {
  const form = new FormData()
  Object.keys(obj).forEach(item => {
    obj[item] !== undefined && obj[item] !== null && form.set(item, obj[item])
  })
  return form
}

// request interceptor
request.interceptors.request.use(config => {
  const types = ['post', 'put', 'delete']
  const { params = {}, method, data } = config
  if (types.includes(method.toLowerCase())) {
    data ? null : (config.data = objToFormData(params))
    delete config.params
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  const { code, message } = response.data
  // 当code返回失败时 抛出错误提示

  if (+code === 601 || +code === 613) {
    // 登录超市 携带参数退出 跳转到登录页
    if (localStorage.getItem('yda-admin-userInfo')) {
      ;+code !== 0 &&
        notification['error']({
          message: '警告',
          description: message || '服务器未知错误'
        })
    }
    localStorage.removeItem('yda-admin-userInfo')
    router.push(`/login`)
  } else {
    ;+code !== 0 &&
      notification['error']({
        message: '警告',
        description: message || '服务器未知错误'
      })
  }

  return response.data || []
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request // 局部使用

export { installer as VueAxios, request as axios } // 全局使用
