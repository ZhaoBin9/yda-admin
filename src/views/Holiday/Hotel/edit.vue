<template>
  <div class="holiday-hotel-edit">
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
        <a-form-item label="状态" name="online">
          <a-radio-group v-model:value="info.online" button-style="solid">
            <a-radio-button :value="1">上架</a-radio-button>
            <a-radio-button :value="0">下架</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排序" name="sortIndex">
          <a-input-number :min="1" :max="1000" v-model:value="info.sortIndex" placeholder="1" />
        </a-form-item>
        <a-form-item label="房价" required name="price">
          <a-input-number :min="1" v-model:value="info.price" />
          <span style="margin-left: 10px;">元</span>
        </a-form-item>
        <a-form-item label="封面" required name="imageId">
          <a-input v-model:value="info.imageId" hidden></a-input>
          <upload
            :file-list="info.coverList"
            :action="actionUrl"
            :count="uploadThumbCount"
            upload-text="上传封面"
            :change="handleThumbUploadChange"
          ></upload>
        </a-form-item>
        <a-form-item label="轮播图" required name="imageList">
          <a-input v-model:value="info.imageList" hidden></a-input>
          <upload
            :file-list="info.PPTList"
            :action="actionUrl"
            :count="uploadPPTCount"
            upload-text="上传图片"
            :change="handlePPTUploadChange"
          ></upload>
        </a-form-item>
        <a-form-item label="酒店名称" required name="name">
          <a-input v-model:value="info.name" placeholder="请输入酒店名称" />
        </a-form-item>
        <a-form-item label="酒店简介" required name="summary">
          <a-textarea v-model:value="info.summary" placeholder="请输入简介" :rows="4" />
        </a-form-item>
        <a-form-item label="营业时间" required name="time">
          <a-input v-model:value="info.time" hidden></a-input>
          <a-space :size="10">
            <a-select v-model:value="info.startWeek" style="width: 128px" @change="handleTimeChange">
              <a-select-option value="周一">周一</a-select-option>
              <a-select-option value="周二">周二</a-select-option>
              <a-select-option value="周三">周三</a-select-option>
              <a-select-option value="周四">周四</a-select-option>
              <a-select-option value="周五">周五</a-select-option>
              <a-select-option value="周六">周六</a-select-option>
              <a-select-option value="周日">周日</a-select-option>
            </a-select>
            <span class="to">-</span>
            <a-select v-model:value="info.endWeek" style="width: 128px" @change="handleTimeChange">
              <a-select-option value="周一">周一</a-select-option>
              <a-select-option value="周二">周二</a-select-option>
              <a-select-option value="周三">周三</a-select-option>
              <a-select-option value="周四">周四</a-select-option>
              <a-select-option value="周五">周五</a-select-option>
              <a-select-option value="周六">周六</a-select-option>
              <a-select-option value="周日">周日</a-select-option>
            </a-select>
            <a-time-picker use24-hours v-model:value="info.startTime" @change="handleTimeChange" format="HH:mm" />
            <span class="to">-</span>
            <a-time-picker use24-hours v-model:value="info.endTime" @change="handleTimeChange" format="HH:mm" />
          </a-space>
        </a-form-item>
        <a-form-item label="电话" required name="phone">
          <a-input v-model:value="info.phone" placeholder="请输入电话" />
        </a-form-item>
        <a-form-item label="地址" required name="address">
          <a-input v-model:value="info.address" placeholder="请输入地址" />
        </a-form-item>
        <a-form-item label="酒店特色" required name="features">
          <a-textarea v-model:value="info.features" placeholder="请输入酒店特色" />
        </a-form-item>
        <a-form-item label="宣传语" required name="slogan">
          <a-textarea v-model:value="info.slogan" placeholder="请输入宣传语" />
        </a-form-item>
        <a-form-item label="交通信息" required name="info">
          <a-textarea v-model:value="info.info" placeholder="请输入交通信息" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import upload from '@/components/Upload/index'
import { api } from '@/apis/upload'
import { postHotelData, updateHotelData } from '@/apis/holiday'
import { Notification } from 'ant-design-vue'

const mobileValidator = (rule, value) => {
  console.log(value)
  if (!value) return Promise.reject('请输入电话号码')
  const phone = /^1[3456789]\d{9}$/
  const tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  if (!tel.test(value) && !phone.test(value)) {
    return Promise.reject('号码格式错误')
  }
  return Promise.resolve()
}

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
        imageList: [{ required: true, message: '至少上传一张轮播图' }],
        name: [{ required: true, message: '请输入标题' }],
        summary: [{ required: true, message: '请输入简介' }],
        price: [{ required: true, type: 'number', message: '请输入内容' }],
        time: [{ required: true, message: '请输入内容' }],
        phone: [{ required: true, validator: mobileValidator }],
        address: [{ required: true, message: '请输入地址' }],
        features: [{ required: true, message: '请输入特色' }],
        slogan: [{ required: true, message: '请输入宣传语' }],
        info: [{ required: true, message: '请输入交通信息' }]
      },
      uploadThumbCount: 1,
      uploadPPTCount: 5,
      actionUrl: api.upload,
      isSumbit: false
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
    handleTimeChange() {
      const { startWeek, endWeek, startTime, endTime } = this.info
      if (startWeek && endWeek && startTime && endTime) {
        Object.assign(this.info, {
          time: `${startWeek}到${endWeek} 早${startTime.format('HH:mm')}-晚${endTime.format('HH:mm')}`
        })
      } else {
        Object.assign(this.info, { time: '' })
      }
    },
    handlePPTUploadChange(type, img) {
      const ary = this.info.imageList ? this.info.imageList.split(',') : []
      if (type === 'add') {
        ary.push(img.data.id)
      } else {
        const { uid } = img
        const index = ary.findIndex(item => item === uid)
        ary.splice(index, 1)
      }
      Object.assign(this.info, { imageList: ary.join() })
      this.$refs.form.validateFields('imageList')
    },
    handleThumbUploadChange(type, info) {
      if (type === 'add') {
        Object.assign(this.info, { imageId: `${info.data.id}` })
      } else {
        Object.assign(this.info, { imageId: '' })
      }
      this.$refs.form.validateFields('imageId')
    },
    submit() {
      if (this.isSumbit) return
      const {
        id,
        imageList,
        imageId,
        name,
        top,
        online,
        summary,
        sortIndex,
        time,
        price,
        address,
        info,
        features,
        slogan,
        phone
      } = this.info || {}
      console.log(time)
      this.$refs.form.validate().then(() => {
        this.isSumbit = true
        const params = {
          classId: this.classId,
          imageId,
          imageList,
          name,
          time,
          price,
          address,
          info,
          features,
          slogan,
          top: Number(top),
          online,
          summary,
          sortIndex: sortIndex || 1,
          phone
        }
        let event = postHotelData
        if (id) {
          params.id = id
          event = updateHotelData
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
          this.isSumbit = false
        })
      })
    }
  }
}
</script>
<style lang="scss"></style>
