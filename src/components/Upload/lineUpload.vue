<template>
  <a-upload
    v-model:file-list="state.fileList"
    name="file"
    :multiple="true"
    :action="state.action"
    withCredentials
    :headers="{
      authorization: 'authorization-text'
    }"
    :before-upload="beforeUpload"
    @change="handleChange"
    @preview="handleRemove"
  >
    <a-button class="btn" v-if="state.fileList && state.fileList.length < state.count">
      <img
        style="margin-right: 4px; vertical-align: middle; transform: translateY(-1px);"
        src="@/assets/svg/download.svg"
      />
      上传附件
    </a-button>
  </a-upload>
  <p class="tips">（可上传图片、文档等类型文件，单个文件大小不能超过50M）</p>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
import { Notification } from 'ant-design-vue'
const action = process.env.VUE_APP_API_BASE_URL + '/file/upload'
export default defineComponent({
  props: {
    fileList: Array,
    count: Number,
    fileType: {
      type: Array,
      default: () => ['jpg', 'png', 'tif', 'jpeg', 'bmp']
    },
    action: {
      type: String,
      default: action
    },
    size: Number,
    uploadText: String
  },
  setup(props, ctx) {
    const { emit } = ctx
    const state = reactive({
      fileList: props.fileList, // 图片list
      label: computed(() => props.label),
      action: computed(() => props.action), // 伤处路径
      count: computed(() => props.count), // 最大上传几个
      uploadText: computed(() => props.uploadText),
      size: computed(() => props.size), // 最大尺寸
      fileType: computed(() => props.fileType) // 上传文件类型
    })
    const beforeUpload = file => {
      return new Promise((resolve, reject) => {
        const suffix = file.name.split('.').pop()
        const size = Math.floor(file.size / (1024 * 1024))
        let type = state.fileType
        if (!state.fileType) type = ['jpg', 'png', 'tif', 'jpeg', 'bmp']
        if (state.size && size >= state.size) {
          Notification['error']({
            message: '警告',
            description: `大小不能超过${state.size}M`
          })
          return reject(false)
        }
        if (!type.includes(suffix)) {
          Notification['error']({
            message: '警告',
            description: `格式错误，仅支持${type.join(',')}格式`
          })
          return reject(false)
        }
        return resolve(true)
      })
    }
    const handleChange = info => {
      const {
        file: { status, response }
      } = info
      switch (status) {
        case 'uploading':
          break
        case 'done':
          // 处理上传成功

          if (response && response.code === 0) {
            emit('fileChange', 'add', state.fileList)
          }
          break
        case 'removed':
          // 处理错误
          emit('fileChange', 'remove', state.fileList)
          break
      }
    }
    const handleRemove = info => {
      const index = state.fileList.findIndex(item => item.uid === info.uid)
      const list = state.fileList
      list.splice(index, 1)
      Object.assign(state.fileList, list)
      emit('change', 'remove', info)
    }

    return {
      beforeUpload,
      handleChange,
      handleRemove,
      state
    }
  }
})
</script>

<style lang="scss" scoped>
.btn {
  height: 36px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  color: #666666;
  &:hover {
    color: #666666;
  }
}
.tips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  width: 340px;
  margin-top: 8px;
}
</style>
