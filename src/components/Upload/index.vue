<template>
  <div class="upload-container">
    <div class="img-list">
      <div class="img-item" v-for="item in state.fileList" :key="item.uid">
        <a-button v-if="item.url" class="delete" type="danger" shape="circle" size="small" @click="handleRemove(item)">
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>
        <template v-if="item.url">
          <div v-if="item.url.includes('.mp4')" class="video" @click="handleVideoView">
            <VideoCameraOutlined />
          </div>
          <a-image v-else :width="104" :height="104" :src="`${item.url}?uploadFile=500x500`"></a-image>
        </template>
        <div v-else class="loading">
          <a-progress type="circle" :percent="item.percent" :width="60" />
        </div>
      </div>
      <a-upload
        name="file"
        class="upload-style"
        :show-upload-list="false"
        list-type="picture-card"
        :action="state.action"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <div v-if="state.fileList && state.fileList.length < state.count">
          <PlusOutlined />
          <div class="ant-upload-text">{{ state.uploadText }}</div>
        </div>
      </a-upload>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import { PlusOutlined, CloseOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'
import { Notification } from 'ant-design-vue'

export default {
  name: '',
  props: {
    fileList: Array,
    count: Number,
    fileType: Array,
    action: String,
    change: Function,
    size: Number,
    uploadText: String
  },
  components: {
    PlusOutlined,
    CloseOutlined,
    VideoCameraOutlined
  },
  setup(props) {
    const state = reactive({
      fileList: props.fileList,
      label: computed(() => props.label),
      action: computed(() => props.action),
      count: computed(() => props.count),
      uploadText: computed(() => props.uploadText)
    })
    return {
      state
    }
  },
  methods: {
    beforeUpload(file) {
      const suffix = file.name.split('.').pop()
      const size = Math.floor(file.size / (1024 * 1024))
      let type = this.fileType
      if (!this.fileType) type = ['jpg', 'png', 'tif', 'jpeg', 'bmp']
      if (this.size && size >= this.size) {
        Notification['warn']({
          message: '警告',
          description: `大小不能超过${this.size}M`
        })
        return false
      }
      if (!type.includes(suffix)) {
        Notification['warn']({
          message: '警告',
          description: `格式错误，仅支持${type.join(',')}格式`
        })
        return false
      }
      return true
    },
    handleChange(info) {
      const {
        file: { status, response }
      } = info
      const image = this.state.fileList.find(item => item.uidName === info.file.uid)
      switch (status) {
        case 'uploading':
          // 处理上传中
          if (!image) {
            const file = {
              uid: '',
              uidName: info.file.uid,
              url: '',
              percent: 0
            }
            this.state.fileList.push(file)
          } else {
            image.percent = Math.ceil(info?.file.percent) - 1
          }
          break
        case 'done':
          // 处理上传成功
          if (response && response.code === 0) {
            image.uid = response.data.id
            image.url = response.data.fullUrl
            this.change('add', response)
          }
          break
        case 'error':
          // 处理错误
          break
      }
    },
    handleVideoView() {
      Notification.open({
        message: '提示',
        description: '请前往详情页查看'
      })
    },
    handleRemove(info) {
      const index = this.state.fileList.findIndex(item => item.uid === info.uid)
      const list = this.state.fileList
      list.splice(index, 1)
      Object.assign(this.state.fileList, list)
      this.change('remove', info)
    }
  }
}
</script>
<style lang="scss">
.upload-container {
  .img-list {
    display: flex;
    flex-wrap: wrap;
    min-height: 104px;
    .img-item {
      cursor: pointer;
      margin-right: 15px;
      margin-bottom: 15px;
      position: relative;
      width: 104px;
      height: 104px;
      background-color: #ececec;
      .loading {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .video {
        width: 104px;
        height: 104px;
        font-size: 30px;
        background-color: #ddd;
        text-align: center;
        line-height: 104px;
      }
      .delete {
        position: absolute;
        z-index: 1;
        right: -8px;
        top: -8px;
      }
      .ant-image {
        border: 1px solid #ccc;
        img {
          position: static;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .upload-style {
    min-height: 104px;
    width: auto;
    vertical-align: top;
    .ant-upload {
      margin: 0;
      .anticon {
        font-size: 20px;
      }
      .ant-upload-text {
        margin-top: 5px;
        font-size: 12px;
      }
    }
    .ant-upload-list {
      float: left;
      & > div {
        margin: 0;
        margin-right: 8px;
      }
    }
  }
}
.preview-modal {
  .ant-modal-body {
    padding: 50px 20px;
    .video {
      width: 100%;
    }
  }
}
</style>
