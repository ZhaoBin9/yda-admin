import request from '@/utils/request'

const api = {
  role: '/role',
  department: '/department',
  user: '/user',
  process: '/flow'
}

// 获取角色数据
export function getRoleList(params) {
  return request({
    url: `${api.role}`,
    method: 'GET',
    params
  })
}

// 新增角色
export function addNewRole(params) {
  return request({
    url: `${api.role}`,
    method: 'POST',
    params
  })
}

// 修改角色
export function editRole(params) {
  return request({
    url: `${api.role}`,
    method: 'PUT',
    params
  })
}

// 删除角色
export function deleteRole(params) {
  return request({
    url: `${api.role}/${params.id}`,
    method: 'DELETE'
  })
}
// 获取个人权限
export function getPermissionInfo(params) {
  return request({
    url: `${api.role}/info/${params.id}`,
    method: 'GET'
  })
}

// 获取所有权限
export function getPermissionList(params) {
  return request({
    url: `${api.role}/permission/all`,
    method: 'GET',
    params
  })
}

// 获取部门列表
export function getDepartmentOrganizational(params) {
  return request({
    url: `${api.department}/getOrganizational`,
    method: 'GET',
    params
  })
}

// 获取部门列表
export function getDepartmentList(params) {
  return request({
    url: `${api.department}`,
    method: 'GET',
    params
  })
}

// 添加部门列表
export function addDepartment(params) {
  return request({
    url: `${api.department}`,
    method: 'POST',
    params
  })
}

// 修改部门列表
export function editDepartment(params) {
  return request({
    url: `${api.department}`,
    method: 'PUT',
    params
  })
}
// 批量导入员工
export function importDepartment(params) {
  return request({
    url: `${api.department}/importDepartment`,
    method: 'POST',
    data: params
  })
}

// 删除部门列表
export function deleteDepartment(params) {
  return request({
    url: `${api.department}/${params.id}`,
    method: 'DELETE'
  })
}

// 获取员工列表
export function getUserList(params) {
  return request({
    url: `${api.user}`,
    method: 'GET',
    params
  })
}

// 修改员工
export function addUser(params) {
  return request({
    url: `${api.user}`,
    method: 'POST',
    params
  })
}

// 修改员工密码
export function reUserPass(params) {
  return request({
    url: `${api.user}/rePassword`,
    method: 'POST',
    params
  })
}

// 修改员工
export function editUser(params) {
  return request({
    url: `${api.user}`,
    method: 'PUT',
    params
  })
}

// 获取员工组织架构
export function getOrganizational() {
  return request({
    url: `${api.user}/getOrganizational`,
    method: 'GET'
  })
}

// 获取员工角色类型
export function getRole() {
  return request({
    url: `${api.user}/listRole`,
    method: 'GET'
  })
}

// 批量导入员工
export function importUser(params) {
  return request({
    url: `${api.user}/importUser`,
    method: 'POST',
    data: params
  })
}

// 获取员工信息
export function getUserInfo(params) {
  return request({
    url: `${api.user}/getUserRoleAndDeptIdByUserId/${params.id}`,
    method: 'GET'
  })
}

// 删除员工
export function deleteUser(params) {
  return request({
    url: `${api.user}/${params.id}`,
    method: 'DELETE'
  })
}

// 获取篱笆墙员工
export function getLbwList() {
  return request({
    url: `${api.user}/getUserByLibawall`,
    method: 'GET'
  })
}

// 导出篱笆墙员工
export function importLbwUser(params) {
  return request({
    url: `${api.user}/importUserByLibawall`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

// 获取审批流程列表
export function getProcessList(params) {
  return request({
    url: `${api.process}`,
    method: 'GET',
    params
  })
}

// 添加流程
export function addProcess(params) {
  return request({
    url: `${api.process}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

// 修改流程
export function editProcess(params) {
  return request({
    url: `${api.process}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: params
  })
}

// 删除流程
export function deleteProcess(params) {
  return request({
    url: `${api.process}/${params.id}`,
    method: 'DELETE'
  })
}

// 获取审批流程员工
export function getProcessStaffList() {
  return request({
    url: `${api.process}/details/selectUserAll`,
    method: 'GET'
  })
}

// 获取审批所有印章
export function getProcessSealList() {
  return request({
    url: `${api.process}/details/sealShowVOResultDTO`,
    method: 'GET'
  })
}

// 获取审批所有流程
export function getFingerProcessList() {
  return request({
    url: `${api.process}/details/selectFlowDetailsVOSeal`,
    method: 'GET'
  })
}

// 获取审批流程的审批人
export function getFingerProcessStaff(params) {
  return request({
    url: `${api.process}/details/selectByIdFlowType/${params.id}`,
    method: 'GET'
  })
}

// 获取归档的所有流程
export function getSealProcessList() {
  return request({
    url: `${api.process}/details/selectFlowDetailsVOArchived`,
    method: 'GET'
  })
}

// 获取指纹管理列表
export function getFingerList(params) {
  return request({
    url: `/fingerprintPc/selectPageResultByQuery`,
    method: 'POST',
    params
  })
}
