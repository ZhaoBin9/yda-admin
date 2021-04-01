import request from '@/utils/request'

const api = {
  approval: '/examine',
  apply: '/document',
  notApproval: '/notExamine'
}

// 获取已审批列表
export function getApprovedList(params) {
  return request({
    url: `${api.approval}/selectPageResultByQuery`,
    method: 'GET',
    params
  })
}

// 获取未审批列表
export function getNotApprovalList(params) {
  return request({
    url: `${api.notApproval}/selectNotPageResultByQuery`,
    method: 'GET',
    params
  })
}

// 获取未审批用印详情
export function getNotApprovalDetail(params) {
  return request({
    url: `${api.notApproval}/notSealExamineDetails`,
    method: 'GET',
    params
  })
}

// 获取未审批归档详情
export function getNotArchivedDetail(params) {
  return request({
    url: `${api.notApproval}/notExamineArchivedDetails`,
    method: 'GET',
    params
  })
}

// 同意或拒绝审批
export function sendApprovalResult(params) {
  return request({
    url: `${api.notApproval}/sealArchivedExamine`,
    method: 'POST',
    params
  })
}

// 获取已审批用印详情
export function getApprovedDetail(params) {
  return request({
    url: `${api.approval}/SealExamineDetails`,
    method: 'GET',
    params
  })
}

// 获取已审批归档详情
export function getApprovedArchive(params) {
  return request({
    url: `${api.approval}/notExamineArchivedDetails`,
    method: 'GET',
    params
  })
}
