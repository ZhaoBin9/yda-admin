import request from '@/utils/request'

const api = {
  course: '/course'
}
// 获取历程数据
export function getList(params) {
  return request({
    url: `${api.course}`,
    method: 'GET',
    params
  })
}
// 提交历程数据
export function postData(params) {
  return request({
    url: `${api.course}`,
    method: 'POST',
    params
  })
}
//更新历程数据
export function updateData(params) {
  return request({
    url: `${api.course}`,
    method: 'PUT',
    params
  })
}
// 删除历程数据
export function deleteData(params) {
  return request({
    url: `${api.course}/${params.id}`,
    method: 'DELETE'
  })
}

// 获取故事数据
export function getStoryList(params) {
  return request({
    url: `${api.course}`,
    method: 'GET',
    params
  })
}
// 提交故事数据
export function postStoryData(params) {
  return request({
    url: `${api.course}`,
    method: 'POST',
    params
  })
}
//更新故事数据
export function updateStoryData(params) {
  return request({
    url: `${api.course}`,
    method: 'PUT',
    params
  })
}
// 删除故事数据
export function deleteStoryData(params) {
  return request({
    url: `${api.course}/${params.id}`,
    method: 'DELETE'
  })
}
