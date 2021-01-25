import request from '@/utils/request'

const api = {
  suggest: '/opinion'
}
// 获取数据
export function getList(params) {
  return request({
    url: `${api.suggest}`,
    method: 'GET',
    params
  })
}
