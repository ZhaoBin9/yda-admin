<template>
  <div class="moving-activitys-edit">
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
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
      >
        <a-form-item label="置顶" name="top">
          <a-switch v-model:checked="info.top" />
        </a-form-item>
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
        <a-form-item label="活动时间" required name="dateTime">
          <a-range-picker v-model:value="info.dateTime" />
        </a-form-item>
        <a-form-item label="活动名称" required name="name">
          <a-input v-model:value="info.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="活动标签" required name="tag" help="请以逗号隔开，末尾逗号可省略">
          <a-input v-model:value="info.tag" placeholder="请输入标签" />
        </a-form-item>
        <a-form-item label="活动简介" required name="summary">
          <a-textarea v-model:value="info.summary" placeholder="请输入简介" :rows="4" />
        </a-form-item>
        <a-form-item label="活动内容" required name="content">
          <a-input v-model:value="info.content" hidden></a-input>
          <div class="editor-style" ref="edit"></div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import E from 'wangeditor'
import upload from '@/components/Upload/index'
import { api } from '@/apis/upload'
import { postActivityData, updateActivityData } from '@/apis/moving'
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
        dateTime: [{ required: true, type: 'array', message: '请选择时间' }],
        name: [{ required: true, message: '请输入名称' }],
        tag: [{ required: true, message: '请输入标签' }],
        content: [{ required: true, message: '请输入内容' }],
        summary: [{ required: true, message: '请输入简介' }]
      },
      uploadThumbCount: 1,
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
  updated() {
    this.visible && this.editorInit()
    this.visible && this.Editor && this.setContent(this.info.content)
    !this.visible && (this.isSubmit = false) && (this.isInput = false)
  },
  methods: {
    async editorInit() {
      await this.$nextTick()
      this.Editor = null
      const self = this
      this.Editor = new E(this.$refs.edit)
      this.Editor.config.uploadImgServer = api.upload
      this.Editor.config.uploadFileName = 'file'
      this.Editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
      this.Editor.config.uploadImgMaxSize = 2 * 1024 * 1024
      this.Editor.config.focus = false
      this.Editor.config.uploadImgHooks = {
        // 图片上传并返回了结果，图片插入已成功
        customInsert(insertImgFn, result) {
          const { code, data } = result
          if (code === 0) insertImgFn(data.fullUrl)
        }
      }
      Object.assign(this.Editor.config, {
        onchange: () => self.getContent()
      })
      this.Editor.create()
      this.isInput = false
      this.setContent(this.info.content)
    },
    handleThumbUploadChange(type, info) {
      if (type === 'add') {
        Object.assign(this.info, { imageId: `${info.data.id}` })
      } else {
        Object.assign(this.info, { imageId: '' })
      }
      this.$refs.form.validateFields('imageId')
    },
    setContent(content) {
      this.Editor.txt.html(content)
    },
    getContent() {
      Object.assign(this.info, { content: this.Editor.txt.html() })
      if (this.info.content) this.isInput = true
      if (this.isSubmit || this.isInput) this.$refs.form.validateFields('content')
    },
    submit() {
      if (this.isSubmit) return
      const { id, imageId, content, name, top, online, dateTime, sortIndex, tag, summary } = this.info
      this.$refs.form.validate().then(() => {
        this.isSubmit = true
        console.log(dateTime)
        const params = {
          classId: this.classId,
          imageId,
          name,
          summary,
          top: Number(top),
          online,
          tag: tag.replace(/，/g, ','),
          sortIndex: sortIndex || 1,
          startTime: dateTime[0].format('YYYY-MM-DD'),
          endTime: dateTime[1].format('YYYY-MM-DD'),
          content
        }
        let event = postActivityData
        if (id) {
          params.id = id
          event = updateActivityData
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
  },
  unMounted() {
    this.Editor && this.Editor.destroy()
    this.Editor = null
  }
}
</script>
<style lang="scss"></style>
