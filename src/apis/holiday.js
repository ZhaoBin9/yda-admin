import request from '@/utils/request'

const api = {
  hotel: '/hotel'
}
// 获取酒店数据
export function getHotelList(params) {
  return request({
    url: `${api.hotel}`,
    method: 'GET',
    params
  })
}
// 提交酒店数据
export function postHotelData(params) {
  return request({
    url: `${api.hotel}`,
    method: 'POST',
    params
  })
}
//更新酒店数据
export function updateHotelData(params) {
  return request({
    url: `${api.hotel}`,
    method: 'PUT',
    params
  })
}
// 删除酒店数据
export function deleteHotelData(params) {
  return request({
    url: `${api.hotel}/${params.id}`,
    method: 'DELETE'
  })
}
