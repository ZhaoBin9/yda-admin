<template>
  <div class="travel-raiders-edit">
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
        :model="formData"
        ref="form"
        :rules="formRule"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 22 }"
      >
        <a-form-item label="置顶" name="top">
          <a-switch v-model:checked="formData.top" />
        </a-form-item>
        <a-form-item label="排序" name="sortIndex">
          <a-input-number :min="1" :max="1000" v-model:value="formData.sortIndex" placeholder="1" />
        </a-form-item>
        <a-form-item label="状态" name="online">
          <a-radio-group v-model:value="formData.online" button-style="solid">
            <a-radio-button :value="1">上架</a-radio-button>
            <a-radio-button :value="0">下架</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="封面" required name="imageId">
          <a-input v-model:value="formData.imageId" hidden></a-input>
          <upload
            :file-list="formData.fileList || []"
            :action="actionUrl"
            :count="uploadThumbCount"
            upload-text="上传封面"
            :change="handleThumbUploadChange"
          ></upload>
        </a-form-item>
        <a-form-item label="标题" required name="title">
          <a-input v-model:value="formData.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="简介" required name="summary">
          <a-textarea v-model:value="formData.summary" placeholder="请输入简介" :rows="4" />
        </a-form-item>
        <a-form-item label="内容" required name="content">
          <a-input v-model:value="formData.content" hidden></a-input>
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
import { postArticleData, updateArticleData } from '@/apis/article'
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
        title: [{ required: true, message: '请输入标题' }],
        summary: [{ required: true, message: '请输入简介' }],
        content: [{ required: true, message: '请输入内容' }]
      },
      uploadThumbCount: 1,
      actionUrl: api.upload,
      isSubmit: false
    }
  },
  computed: {
    formData() {
      return this.info
    },
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
        this.formData.imageId = `${info.data.id}`
      } else {
        this.formData.imageId = ''
      }
      this.$refs.form.validateFields('imageId')
    },
    setContent(content) {
      this.Editor.txt.html(content)
    },
    getContent() {
      this.formData.content = this.Editor.txt.html()
      if (this.formData.content) this.isInput = true
      if (this.isSubmit || this.isInput) this.$refs.form.validateFields('content')
    },
    submit() {
      if (this.isSubmit) return
      const { id, imageId, content, title, top, online, summary, sortIndex } = this.formData
      this.$refs.form.validate().then(() => {
        this.isSubmit = true
        const params = {
          classId: this.classId,
          imageId,
          title,
          top: Number(top),
          online,
          summary,
          sortIndex: sortIndex || 1,
          content
        }
        let event = postArticleData
        if (id) {
          params.id = id
          event = updateArticleData
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
