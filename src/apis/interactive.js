import request from '@/utils/request'

const api = {
  ppt: '/picture',
  pptList: '/picture/set/pictureId',
  video: '/video'
}
// 获取图集数据
export function getPPTList(params) {
  return request({
    url: `${api.ppt}/all`,
    method: 'GET',
    params
  })
}
// 提交图集数据
export function postPPTData(params) {
  return request({
    url: `${api.ppt}`,
    method: 'POST',
    params
  })
}
// 获取图集详情
export function getPPTInfo(params) {
  return request({
    url: `${api.pptList}/${params.id}`,
    method: 'GET'
  })
}
//更新图集数据
export function updatePPTData(params) {
  return request({
    url: `${api.ppt}`,
    method: 'PUT',
    params
  })
}
// 删除图集数据
export function deletePPTData(params) {
  return request({
    url: `${api.ppt}/${params.id}`,
    method: 'DELETE'
  })
}

// 获取视频数据
export function getVideoList(params) {
  return request({
    url: `${api.video}`,
    method: 'GET',
    params
  })
}
// 提交视频数据
export function postVideoData(params) {
  return request({
    url: `${api.video}`,
    method: 'POST',
    params
  })
}
//更新视频数据
export function updateVideoData(params) {
  return request({
    url: `${api.video}`,
    method: 'PUT',
    params
  })
}
// 删除视频数据
export function deleteVideoData(params) {
  return request({
    url: `${api.video}/${params.id}`,
    method: 'DELETE'
  })
}
