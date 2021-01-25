<template>
  <div class="ppt-edit">
    <a-modal
      :visible="show"
      :title="title"
      @cancel="handleVisible"
      @ok="submit"
      ok-text="确定"
      class="ppt-edit"
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
        <a-form-item label="分类" required name="classId">
          <a-select label-in-value v-model:value="info.classId" placeholder="请选择分类">
            <a-select-option v-for="(item, key) in info.classes" :key="key" :value="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="图集" required name="list">
          <a-checkbox-group v-model:value="info.list" />
          <a-upload
            name="file"
            :show-upload-list="false"
            :action="actionUrl"
            :before-upload="beforeListUpload"
            @change="handlListUploadChange"
          >
            <a-button>{{ imageListButtonText }}</a-button>
          </a-upload>
          <div class="image-list">
            <div v-for="item in info.list" :key="item.id" class="item">
              <a-checkbox v-model:checked="item.checked" @change="item.fullImage ? onListSelectChange(item) : null">
              </a-checkbox>
              <a-image class="img" v-if="item.fullImage" :src="`${item.fullImage}?uploadFile=500x500`"></a-image>
              <div v-else class="loading">
                <a-progress type="circle" :percent="item.percent" :width="30" />
              </div>
              <a-textarea :rows="2" v-model:value="item.summary" placeholder="请输入简介"></a-textarea>
              <a-button
                class="delete-btn"
                type="danger"
                shape="circle"
                @click="item.fullImage ? handleListRemove(item.id) : null"
              >
                <template #icon>
                  <MinusOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="标题" required name="title">
          <a-input v-model:value="info.title" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="简介" required name="summary">
          <a-textarea v-model:value="info.summary" placeholder="请输入简介" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import upload from '@/components/Upload/index'
import { api } from '@/apis/upload'
import { postPPTData, updatePPTData } from '@/apis/interactive'
import { Notification } from 'ant-design-vue'
import { MinusOutlined } from '@ant-design/icons-vue'

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
        classId: [{ required: true, type: 'any', message: '请选择分类' }],
        title: [{ required: true, message: '请输入标题' }],
        summary: [{ required: true, message: '请输入简介' }],
        list: [{ required: true, type: 'array', message: '至少上传一张图片' }]
      },
      imageListButtonText: '添加图片',
      listSelectId: null,
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
    upload,
    MinusOutlined
  },
  updated() {
    this.listSelectId = null
    this.imageListButtonText = '添加图片'
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
    beforeListUpload(file) {
      const suffix = file.name.split('.').pop()
      if (!['jpg', 'png', 'tif', 'jpeg', 'bmp'].includes(suffix)) {
        Notification['warn']({
          message: '警告',
          description: '图片格式错误，仅支持jpg/png/tif/jpeg/bmp格式'
        })
        return false
      }
      return true
    },
    handleListRemove(id) {
      const index = this.info.list.findIndex(item => item.id === id)
      const list = this.info.list
      list.splice(index, 1)
      Object.assign(this.info, { list })
      const select = this.info.list.find(item => item.id === this.listSelectId)
      if (!select) {
        this.listSelectId = null
        this.imageListButtonText = '添加图片'
      }
    },
    onListSelectChange(item) {
      this.info.list.forEach(c => {
        if (item.id === c.id) {
          typeof c.checked === 'undefined' ? true : !c.checked
          if (c.checked) {
            this.listSelectId = c.id
            this.imageListButtonText = '修改当前图片'
          } else {
            this.listSelectId = null
            this.imageListButtonText = '添加图片'
          }
        } else {
          c.checked = false
        }
      })
    },
    handlListUploadChange(info) {
      const {
        file: { status, response }
      } = info
      const list = this.info.list
      const image = list.find(item => item.name === info.file.name)
      switch (status) {
        case 'uploading':
          // 处理上传中
          if (!image) {
            const file = {
              id: '',
              checked: false,
              imageId: '',
              name: info.file.name,
              fullImage: '',
              summary: '',
              percent: 0
            }
            list.push(file)
          } else {
            image.percent = Math.ceil(info?.file.percent) - 1
          }
          break
        case 'done':
          // 处理上传成功
          if (response?.code !== 0) return
          if (this.listSelectId) {
            const now = list.find(item => item.id === this.listSelectId)
            now.imageId = response?.data.id
            now.fullImage = response?.data.fullUrl
          } else {
            image.id = response?.data.id
            image.imageId = response?.data.id
            image.fullImage = response?.data.fullUrl
          }
          Object.assign(this.info, { list })
          this.$refs.form.validateFields('list')
          break
        case 'error':
          // 处理错误
          break
      }
    },
    submit() {
      if (this.isSubmit) return
      const { id, imageId, title, online, summary, sortIndex, classId, top } = this.info
      this.$refs.form.validate().then(() => {
        this.isSubmit = true
        const list = this.info.list.map(item => {
          const newItem = {}
          newItem.imageId = item.imageId
          newItem.summary = item.summary
          return newItem
        })
        const params = {
          classId: classId.value,
          top: Number(top),
          imageId,
          title,
          stringList: JSON.stringify({ data: list }),
          online,
          summary,
          sortIndex: sortIndex || 1
        }
        let event = postPPTData
        if (id) {
          params.id = id
          event = updatePPTData
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
<style lang="scss">
.ppt-edit {
  .image-list {
    margin-top: 10px;
    .ant-checkbox-wrapper {
      margin-right: 15px;
    }
    .item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 80px;
      .ant-image {
        cursor: pointer;
        flex: 0 0 92px;
        height: 53px;
        background-color: #ccc;
        img {
          height: 53px;
          display: block;
          object-fit: cover;
        }
      }
      .loading {
        flex: 0 0 92px;
        height: 53px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ccc;
      }
      .ant-input {
        flex: 1 1 auto;
        margin-bottom: 0;
        margin-left: 15px;
      }
      .delete-btn {
        margin-left: 15px;
      }
    }
  }
}
</style>
