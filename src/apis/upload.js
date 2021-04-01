import request from '@/utils/request'

const api = {
  file: '/file'
}
// 获取数据
export function getArticleList(params) {
  return request({
    url: `${api.file}/upload`,
    method: 'GET',
    params
  })
}
