import { notification } from 'ant-design-vue'
export const cmsNotice = (type, contant, duration = 4000) => {
  notification[type]({
    message: '提示',
    description: contant,
    duration: 4
  })
}
