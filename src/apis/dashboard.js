import request from '@/utils/request'

// 首页统计
export function companyTotal() {
  return request({
    url: '/dataStatisticsPcController',
    method: 'GET'
  })
}
