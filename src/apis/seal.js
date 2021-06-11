import request from '@/utils/request'

const api = {
  applyList: '/document/record',
  apply: '/document'
}

function objToString(obj) {
  let strArr = []
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      strArr.push(`${key}=${obj[key]}`)
    }
  }
  const str = strArr.length ? '?' + strArr.join('&') : ''
  return str
}

// 获取普通用印记录
export function getApplyList(params) {
  return request({
    url: `${api.applyList}/commonSelectPageResultByQuery`,
    method: 'GET',
    params
  })
}

// 获取指纹用印记录
export function getFingerList(params) {
  return request({
    url: `${api.applyList}/fingerprintSelectPageResultByQuery`,
    method: 'GET',
    params
  })
}

// 获取用印申请记录
export function getApply(params) {
  return request({
    url: `${api.apply}/apply`,
    method: 'GET',
    params
  })
}

// 添加用印申请
export function addApply(params) {
  return request({
    url: `${api.apply}/apply`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

// 获取用印详情
export function getApplyDetail(params) {
  return request({
    url: `${api.apply}/apply/getDetails/${params.documentId}`,
    method: 'GET'
  })
}

// 导出普通用印记录
export function exportBaseList(params) {
  return process.env.VUE_APP_API_BASE_URL + `${api.applyList}/deriveDocumentRecordDeriveVO${objToString(params)}`
}

// 导出指纹用印记录
export function exportFingerList(params) {
  return process.env.VUE_APP_API_BASE_URL + `${api.applyList}/deriveFingerprintSealDeriveVO${objToString(params)}`
}

// 获取普通用印记录详情
export function getApplyListDetail(params) {
  return request({
    url: `${api.apply}/record/getShow`,
    method: 'GET',
    params
  })
}

// 获取指纹用印记录详情
export function getFingerprintDetail(params) {
  return request({
    url: `${api.apply}/record/getFingerprintSealDetailsVO`,
    method: 'GET',
    params
  })
}

// 导出用印申请
export function exportApply(params) {
  return process.env.VUE_APP_API_BASE_URL + `${api.apply}/apply/deriveDocumentApplyDeriveVO${objToString(params)}`
}

// 导出用印申请
export function sendArchived(params) {
  return request({
    url: `${api.apply}/archived`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}
