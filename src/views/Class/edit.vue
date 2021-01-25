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
        <a-form-item label="父级栏目" name="parentId">
          <a-select label-in-value v-model:value="info.parentId" placeholder="请选择父级栏目">
            <a-select-option v-for="(item, key) in parentName" :key="key" :value="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="栏目名称" required name="name">
          <a-input v-model:value="info.name" placeholder="请输入名称" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { postData, updateData } from '@/apis/class'
import { Notification } from 'ant-design-vue'

const parentName = [
  {
    id: 14,
    name: '商业街'
  },
  {
    id: 17,
    name: '新闻动态'
  },
  {
    id: 21,
    name: '图集'
  }
]

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
      parentName,
      formRule: {
        name: [{ required: true, message: '请输入名称' }],
        parentId: [{ required: true, type: 'any', message: '请选择父级栏目' }]
      },
      isSubmit: false
    }
  },
  computed: {
    show() {
      return this.visible
    }
  },
  methods: {
    handleThumbUploadChange(type, info) {
      if (type === 'add') {
        Object(this.info, { imageId: `${info.data.id}` })
      } else {
        Object(this.info, { imageId: '' })
      }
      this.$refs.form.validateFields('imageId')
    },
    submit() {
      if (this.isSubmit) return
      const { id, online, sortIndex, name, parentId } = this.info
      this.$refs.form.validate().then(() => {
        this.isSubmit = true
        const params = {
          parentId: parentId.value,
          name,
          online,
          sortIndex: sortIndex || 1
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
