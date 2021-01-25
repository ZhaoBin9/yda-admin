<template>
  <a-modal
    :visible="show"
    :title="title"
    @cancel="handleVisible"
    @ok="submit"
    ok-text="确定"
    class="course-edit"
    width="500px"
  >
    <a-form v-if="show" :model="info" ref="form" :rules="formRule" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
      <a-form-item label="时间" required name="yearsMonths">
        <a-month-picker v-model:value="info.yearsMonths" placeholder="请选择时间" />
      </a-form-item>
      <a-form-item label="事件" required name="course">
        <a-input v-model:value="info.course" placeholder="请输入事件" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { postData, updateData } from '@/apis/scenic'
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
        yearsMonths: [{ required: true, type: 'any', message: '请输入时间' }],
        course: [{ required: true, message: '请输入事件' }]
      },
      isSumbit: false
    }
  },
  computed: {
    show() {
      return this.visible
    }
  },
  methods: {
    submit() {
      if (this.isSumbit) return
      const { id, yearsMonths, course } = this.info
      this.$refs.form.validate().then(() => {
        this.isSumbit = true
        const [years, months] = yearsMonths.format('YYYY-M').split('-')
        const params = {
          classId: this.classId,
          years: +years,
          months: +months,
          course
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
            this.isSumbit = false
          }
        })
      })
    }
  }
}
</script>
<style lang="scss"></style>
