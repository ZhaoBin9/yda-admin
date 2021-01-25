export const api = {
  upload: process.env.VUE_APP_API_BASE_URL + '/file/upload/one'
}
// 登陆
export function upload(file) {
  const _formData = new FormData()
  _formData.append('file', file)
  return new Promise(resolve => resolve(_formData))
}
