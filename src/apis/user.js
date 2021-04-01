import request from '@/utils/request'

const api = {
  user: '/user'
}

//密码登录
export function passLogin(params) {
  return request({
    url: '/login',
    method: 'POST',
    params
  })
}

// 退出登录
export function logout(params) {
  return request({
    url: '/logout',
    method: 'GET',
    params
  })
}

// 选择企业
export function switchEnterprise(params) {
  return request({
    url: '/user/switchEnterprise',
    method: 'PUT',
    params
  })
}

// 获取权限列表
export function getPermissionList() {
  return request({
    url: '/role/permission/all',
    method: 'GET'
  })
}

// 修改账号密码
export function editAccountPassword(params) {
  return request({
    url: `${api.user}/modifyPassword`,
    method: 'POST',
    params
  })
}

// 修改账号
export function editAccount(params) {
  return request({
    url: `${api.user}/modifyPhone`,
    method: 'POST',
    params
  })
}

// 获取修改账号 验证码
export function getAccountCaptcha(params) {
  return request({
    url: '/sendNote',
    method: 'GET',
    params
  })
}

// 获取修改账号 头像
export function editAccountAvatar(params) {
  return request({
    url: `${api.user}/switchAvatarId`,
    method: 'PUT',
    params
  })
}
