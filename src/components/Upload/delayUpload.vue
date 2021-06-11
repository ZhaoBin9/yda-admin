<template>
  <a-upload v-model:file-list="state.fileList" :action="action" withCredentials :before-upload="beforeUpload">
    <a-button class="btn" v-if="fileList && fileList.length < count">
      <img
        style="margin-right: 4px; vertical-align: middle; transform: translateY(-1px);"
        src="@/assets/svg/download.svg"
      />
      上传附件
    </a-button>
  </a-upload>
  <p v-if="tips" class="tips">（可上传图片、文档等类型文件，单个文件大小不能超过10M）</p>
</template>

<script>
import { reactive, defineComponent, watch } from 'vue'
import { cmsNotice } from '@/utils/utils'

export default defineComponent({
  name: 'delay-upload',
  props: {
    count: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: ''
    },
    fileType: {
      type: Array,
      default: () => ['xls', 'xlsx']
    },
    size: {
      type: Number,
      default: 10
    },
    tips: {
      type: Boolean,
      default: true
    },
    callback: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const state = reactive({
      fileList: []
    })
    const beforeUpload = file => {
      emit('update:fileList', [file])
      // console.log(file)
      props.callback(file)
      return false
    }

    const validateFile = () => {
      if (state.fileList.length === 0) {
        cmsNotice('error', '请选择要导入的文件')
        return false
      }
      const suffix = state.fileList[0].name.split('.').pop()
      const size = Math.floor(state.fileList[0].size / (1024 * 1024))
      if (state.size && size >= props.size) {
        cmsNotice('warn', `大小不能超过${props.size}M`)
        // emit('update:loading', false)
        return false
      }
      if (!props.fileType.includes(suffix)) {
        cmsNotice('warn', `格式错误，仅支持${props.fileType.join(',')}格式`)
        // emit('update:loading', false)
        return false
      }

      return true
    }

    watch(
      () => state.fileList.length,
      () => emit('update:fileList', state.fileList)
    )
    watch(
      () => props.fileList.length,
      () => (state.fileList = props.fileList)
    )

    return {
      beforeUpload,
      state,
      validateFile
    }
  }
})
</script>

<style lang="scss" scoped>
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
