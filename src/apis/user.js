import request from '@/utils/request'

const api = {
  Login: '/login',
  Logout: '/sjg/logout'
}
// 登陆
export function login(params) {
  return request({
    url: api.Login,
    method: 'POST',
    params
  })
}
// 退出登陆
export function logout(params = {}) {
  return request({
    url: api.Logout,
    method: 'GET',
    params
  })
}
