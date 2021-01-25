import request from '@/utils/request'

const api = {
  qa: '/survey',
  user: '/record/answer/user'
}
// 获取用户数据
export function getQAList(id, params) {
  return request({
    url: `${api.qa}/${id}`,
    method: 'GET',
    params
  })
}
// 提交答案数据
export function getUserList(params) {
  return request({
    url: `${api.user}`,
    method: 'GET',
    params
  })
}
