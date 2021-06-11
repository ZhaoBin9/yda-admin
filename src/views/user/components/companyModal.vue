<template>
  <div ref="parent">
    <a-modal
      centered
      :width="786"
      title="选择企业"
      :visible="visible"
      @cancel="$emit('update:visible', false)"
      :footer="null"
      :closable="false"
      :maskClosable="false"
    >
      <a-form ref="formRef" :model="modalVal" :rules="rules">
        <a-form-item label="选择企业" name="enterprise" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <a-select v-model:value="modalVal.enterprise" placeholder="请选择企业">
            <a-select-option v-for="item in allEnterprise" :key="item.id" :value="item.id">{{
              item.company
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="action-box">
        <a-button class="comfirm-btn" :loading="loading" @click="handleEnterprise">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { switchEnterprise } from '@/apis/user'
export default defineComponent({
  name: 'company-modal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    allEnterprise: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const loading = ref(false)
    const formRef = ref()
    const rules = {
      enterprise: [
        {
          type: 'number',
          required: true,
          message: '请选择企业'
        }
      ]
    }
    const modalVal = reactive({
      enterprise: props.allEnterprise[0] ? props.allEnterprise[0].id : undefined
    })
    watch(
      () => props.allEnterprise,
      newVal => {
        modalVal.enterprise = newVal[0].id
      }
    )
    const handleEnterprise = () => {
      loading.value = true
      formRef.value
        .validate()
        .then(async () => {
          const enterprise = props.allEnterprise.find(item => item.id === modalVal.enterprise)
          const res = await switchEnterprise({ enterpriseId: enterprise.id })
          if (res.success) {
            emit('select-enterprise', {
              enterpriseId: res.data.result.enterpriseId,
              enterpriseName: res.data.result.enterpriseName,
              avatar: res.data.avatar,
              enterpriseBindLibawall: res.data.result.enterpriseBindLibawall,
              userName: res.data.userName,
              userId: res.data.userId
            })
          }
          loading.value = false
        })
        .catch(() => (loading.value = false))
    }

    return { formRef, rules, modalVal, handleEnterprise, loading }
  }
})
</script>

<style lang="scss" scoped>
.action-box {
  display: flex;
  justify-content: center;
  margin: 40px 0 30px;
  .comfirm-btn {
    width: 100px;
    height: 38px;
    opacity: 1;
    background: #ffffff;
    border-radius: 5px;
    margin-right: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 38px;
    background: #c3161c;
    color: #fff;
    border: 1px solid transparent;
    margin-right: 0;
    &:hover {
      border-color: transparent;
    }
  }
}
</style>
