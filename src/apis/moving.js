import request from '@/utils/request'

const api = {
  activity: '/activity'
}
// 获取活动数据
export function getActivityList(params) {
  return request({
    url: `${api.activity}`,
    method: 'GET',
    params
  })
}
// 提交活动数据
export function postActivityData(params) {
  return request({
    url: `${api.activity}`,
    method: 'POST',
    params
  })
}
// 更新活动数据
export function updateActivityData(params) {
  return request({
    url: `${api.activity}`,
    method: 'PUT',
    params
  })
}
// 获取活动详情
export function getActivityInfo(params) {
  return request({
    url: `${api.activity}/${params.id}`,
    method: 'GET'
  })
}
// 删除活动数据
export function deleteActivityData(params) {
  return request({
    url: `${api.activity}/${params.id}`,
    method: 'DELETE'
  })
}
