import request from '@/utils/request'

const api = {
  classes: '/classes'
}
// 获取景点数据
export function getList(params) {
  return request({
    url: `${api.classes}`,
    method: 'GET',
    params
  })
}
// 提交景点数据
export function postData(params) {
  return request({
    url: `${api.classes}`,
    method: 'POST',
    params
  })
}
//更新景点数据
export function updateData(params) {
  return request({
    url: `${api.classes}`,
    method: 'PUT',
    params
  })
}
// 删除景点数据
export function deleteData(params) {
  return request({
    url: `${api.classes}/${params.id}`,
    method: 'DELETE'
  })
}
// 查询分类下到所有数据
export function getClassDataInfo(params) {
  return request({
    url: `${api.classes}/all`,
    method: 'GET',
    params
  })
}
