<template>
  <div ref="parent">
    <a-modal
      centered
      :width="786"
      :title="modalTitle"
      :visible="visible"
      @cancel="handleCancel"
      :footer="null"
      :getContainer="() => $refs.parent"
    >
      <section style="padding: 0 80px">
        <a-form ref="formRef" :rules="rules" :model="modalVal">
          <a-form-item label="印章名称" name="sealVal"  :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-input v-model:value="modalVal.sealVal" :maxlength="30" placeholder="请输入印章名称" />
          </a-form-item>
          <a-form-item label="保管人" name="keepName" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-select v-model:value="modalVal.keepName" placeholder="请选择" >
              <a-select-option v-for="item in staffList" :key="item.id" :value="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="印章类型" name="sealStatus"  :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-select v-model:value="modalVal.sealStatus" placeholder="请选择" >
              <a-select-option v-for="item in sealType" :key="item.id" :value="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div class="action-box">
          <a-button class="btn close" @click="handleCancel">取消</a-button>
          <a-button class="btn comfirm" @click="comfirmAdd" :loading="loading">确定</a-button>
        </div>
      </section>
    </a-modal>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref, watch } from 'vue'
const sealType = [
  {
    id: 2,
    name: '非蘸墨印章'
  },
  {
    id: 1,
    name: '蘸墨印章'
  }
]
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    staffList: {
      type: Array,
      default: () => []
    },
    current: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const modalTitle = computed(() => (props.type === 'add' ? '添加印章' : '修改印章'))
    const formRef = ref()
    const modalVal = reactive({
      sealVal: undefined,
      keepName: undefined,
      sealStatus: undefined
    })
    const rules = ref()
    rules.value = {
      sealVal: [
        {
          required: true,
          message: '请输入印章名称'
        }
      ],
      keepName: [
        {
          type: 'number',
          required: true,
          message: '请选择保管人'
        }
      ],
      sealStatus: [
        {
          type: 'number',
          required: true,
          message: '请选择印章类型'
        }
      ]
    }
    const comfirmAdd = () => {
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(() => emit('modalSubmit', modalVal))
        .catch(() => emit('update:loading', false))
    }
     const handleCancel = () => {
      formRef.value.resetFields()
      emit('update:visible', false)
    }

    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) return
        if (props.type === 'add') {
          modalVal.sealVal = undefined
          modalVal.keepName = undefined
          modalVal.sealStatus = undefined
        } else {
          modalVal.sealVal = props.current.sealName
          modalVal.keepName = props.current.custodianId
          modalVal.sealStatus = props.current.type || 1
        }
      }
    )

    return {
      comfirmAdd,
      formRef,
      modalVal,
      rules,
      modalTitle,
      sealType,
      handleCancel
    }
  }
})
</script>

<style lang="scss" scoped>
.action-box {
  margin: 40px 0 30px;
  display: flex;
  justify-content: center;
  .btn {
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
  }
  .close {
    color: #999;
    border: 1px solid #dadada;
    &:hover {
      color: #999;
      border-color: #dadada;
    }
  }
  .comfirm {
    background: #c3161c;
    color: #fff;
    border: 1px solid transparent;
    margin-right: 0;
    &:hover {
      border-color: transparent;
    }
  }
}
::v-deep .ant-modal-title {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 25px;
  text-indent: 24px;
}
</style>
