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
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 21 }"
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
        <a-form-item label="图片" required name="imageId">
          <a-input v-model:value="info.imageId" hidden></a-input>
          <upload
            v-if="show"
            :file-list="info.fileList || []"
            :action="actionUrl"
            :count="uploadThumbCount"
            upload-text="上传图片"
            :change="handleUploadChange"
          ></upload>
        </a-form-item>
        <a-form-item label="选择位置" required name="type">
          <a-select label-in-value v-model:value="info.type" placeholder="请选择位置">
            <a-select-option :value="1">头部Banner</a-select-option>
            <a-select-option :value="2">中间轮播图</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="跳转链接" name="href">
          <a-input v-model:value="info.href" placeholder="请输入跳转链接" />
        </a-form-item>
        <a-form-item label="简介" name="summary">
          <a-textarea v-model:value="info.summary" placeholder="请输入简介" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import upload from '@/components/Upload/index'
import { api } from '@/apis/upload'
import { postData, updateData } from '@/apis/home'
import { Notification } from 'ant-design-vue'

export default {
  name: '',
  props: {
    title: String,
    visible: Boolean,
    handleVisible: Function,
    handleSubmit: Function,
    info: Object
  },
  data() {
    return {
      formRule: {
        imageId: [{ required: true, message: '请上传缩略图' }],
        type: [{ required: true, type: 'any', message: '请选择位置' }]
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
  methods: {
    handleUploadChange(type, info) {
      if (type === 'add') {
        Object.assign(this.info, { imageId: `${info.data.id}` })
      } else {
        Object.assign(this.info, { imageId: '' })
      }
      this.$refs.form.validateFields('imageId')
    },
    submit() {
      if (this.isSubmit) return
      const { id, imageId, type, online, summary, sortIndex, href } = this.info
      this.$refs.form.validate().then(() => {
        this.isSubmit = true
        const params = {
          imageId,
          href,
          online,
          summary,
          sortIndex: sortIndex || 1,
          type: type.value
        }
        let event = postData
        if (id) {
          params.id = id
          event = updateData
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
