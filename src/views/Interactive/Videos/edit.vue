<template>
  <div class="celebrity-edit">
    <a-modal
      :visible="show"
      :title="title"
      @cancel="handleVisible"
      @ok="submit"
      ok-text="确定"
      class="edit-modal"
      width="780px"
    >
      <a-form
        v-if="show"
        :model="info"
        ref="form"
        :rules="formRule"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 22 }"
      >
        <a-form-item label="排序" name="sortIndex">
          <a-input-number :min="1" :max="1000" v-model:value="info.sortIndex" placeholder="1" />
        </a-form-item>
        <a-form-item label="状态" name="online">
          <a-radio-group v-model:value="info.online" button-style="solid">
            <a-radio-button :value="1">上架</a-radio-button>
            <a-radio-button :value="0">下架</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="封面" required name="imageId">
          <a-input v-model:value="info.imageId" hidden></a-input>
          <upload
            :file-list="info.fileList || []"
            :action="actionUrl"
            :count="uploadThumbCount"
            upload-text="上传封面"
            :change="handleThumbUploadChange"
          ></upload>
        </a-form-item>
        <a-form-item label="视频" required name="videoId">
          <a-input v-model:value="info.videoId" hidden></a-input>
          <upload
            :action="actionUrl"
            :file-type="['mp4']"
            :size="500"
            :file-list="info.videoList || []"
            :count="uploadVideoCount"
            upload-text="上传视频"
            :change="handleVideoUploadChange"
          >
          </upload>
        </a-form-item>
        <a-form-item label="标题" required name="title">
          <a-input v-model:value="info.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="简介" required name="summary">
          <a-textarea :max="100" v-model:value="info.summary" placeholder="请输入简介" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import upload from '@/components/Upload/index'
import { api } from '@/apis/upload'
import { postVideoData, updateVideoData } from '@/apis/interactive'
import { Notification } from 'ant-design-vue'

export default {
  name: '',
  props: {
    title: String,
    visible: Boolean,
    classId: Number,
    handleVisible: Function,
    handleSubmit: Function,
    info: Object
  },
  data() {
    return {
      formRule: {
        imageId: [{ required: true, message: '请上传缩略图' }],
        videoId: [{ required: true, message: '请上传视频' }],
        title: [{ required: true, message: '请输入标题' }],
        summary: [{ required: true, message: '请输入简介' }]
      },
      uploadThumbCount: 1,
      uploadVideoCount: 1,
      actionUrl: api.upload,
      isSubmit: false
    }
  },
  computed: {
    show() {
      return this.visible
    }
  },
  components: {
    upload
  },
  methods: {
    handleThumbUploadChange(type, info) {
      if (type === 'add') {
        Object.assign(this.info, { imageId: `${info.data.id}` })
      } else {
        Object.assign(this.info, { imageId: '' })
      }
      this.$refs.form.validateFields('imageId')
    },
    handleVideoUploadChange(type, info) {
      if (type === 'add') {
        Object.assign(this.info, { videoId: `${info.data.id}` })
      } else {
        Object.assign(this.info, { videoId: '' })
      }
      this.$refs.form.validateFields('videoId')
    },
    submit() {
      if (this.isSubmit) return
      const { id, imageId, videoId, title, online, sortIndex, summary } = this.info
      this.$refs.form.validate().then(() => {
        this.isSubmit = true
        const params = {
          classId: this.classId,
          imageId,
          videoId,
          title,
          online,
          sortIndex,
          summary
        }
        let event = postVideoData
        if (id) {
          params.id = id
          event = updateVideoData
        }
        event(params).then(res => {
          const { code } = res
          if (code === 0) {
            this.handleSubmit()
            Notification.open({
              message: '提示',
              description: id ? '更新成功' : '新增成功'
            })
          }
          this.isSubmit = false
        })
      })
    }
  }
}
</script>
<style lang="scss"></style>
