import request from '@/utils/request'

const api = {
  article: '/article'
}
// 获取数据
export function getArticleList(params) {
  return request({
    url: `${api.article}`,
    method: 'GET',
    params
  })
}
// 提交数据
export function postArticleData(params) {
  return request({
    url: `${api.article}`,
    method: 'POST',
    params
  })
}
//更新数据
export function updateArticleData(params) {
  return request({
    url: `${api.article}`,
    method: 'PUT',
    params
  })
}
// 删除数据
export function deleteArticleData(params) {
  return request({
    url: `${api.article}/${params.id}`,
    method: 'DELETE'
  })
}
// 获取详情
export function getArticleInfo(params) {
  return request({
    url: `${api.article}/${params.id}`,
    method: 'GET'
  })
}
