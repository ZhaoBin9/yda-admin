import request from '@/utils/request'

const api = {
  carousel: '/carousel'
}
// 获取数据
export function getList(params) {
  return request({
    url: `${api.carousel}`,
    method: 'GET',
    params
  })
}
// 提交数据
export function postData(params) {
  return request({
    url: `${api.carousel}`,
    method: 'POST',
    params
  })
}
//更新数据
export function updateData(params) {
  return request({
    url: `${api.carousel}`,
    method: 'PUT',
    params
  })
}
// 删除数据
export function deleteData(params) {
  return request({
    url: `${api.carousel}/${params.id}`,
    method: 'DELETE'
  })
}
