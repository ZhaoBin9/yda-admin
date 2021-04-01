import request from '@/utils/request'

const api = {
  seal: '/seal'
}

// 获取印章列表
export function getSealList(params) {
  return request({
    url: `${api.seal}`,
    method: 'GET',
    params
  })
}

// 添加印章
export function addSeal(params) {
  return request({
    url: `${api.seal}`,
    method: 'POST',
    params
  })
}

// 修改印章
export function editSeal(params) {
  return request({
    url: `${api.seal}`,
    method: 'PUT',
    params
  })
}

// 删除印章
export function deleteSeal(params) {
  return request({
    url: `${api.seal}/${params.id}`,
    method: 'DELETE'
  })
}

// 获取印章全部员工
export function getStaffList() {
  return request({
    url: `${api.seal}/allStaff`,
    method: 'GET'
  })
}
