import { notification } from 'ant-design-vue'
export const cmsNotice = (type, contant, duration = 4000) => {
  notification[type]({
    message: '提示',
    description: contant,
    duration: 4
  })
}

export const throttle = (fn, delay) => {
  let start = Date.now()
  let end = null
  const self = this

  return function(...args) {
    end = Date.now()
    if (end - delay >= start) {
      start = Date.now()
      fn.apply(self, args)
    }
  }
}

export const flatLevelArrayProperty = (arr, property = 'value', childName = 'children') => {
  // 多层数字扁平为一维，拿出关键id
  const result = []
  function deepIterationArr(arr) {
    result.push(arr[property])
    if (arr[childName] && arr[childName].length) {
      arr[childName].forEach(item => deepIterationArr(item))
    }
  }
  Array.isArray(arr) ? arr.forEach(item => deepIterationArr(item)) : deepIterationArr(arr)
  return result
}

export const iterationArrayToMap = (array, map, val = true) => {
  // 用于antd 组件change或check事件
  array.forEach(item => {
    map[item] = val
  })
}
