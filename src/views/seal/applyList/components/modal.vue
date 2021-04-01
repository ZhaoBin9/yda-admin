<template>
  <div ref="parent">
    <a-modal
      title="提交归档"
      :visible="visible"
      :footer="null"
      centered
      :getContainer="() => $refs.parent"
      :width="786"
      @cancel="$emit('update:visible', false)"
    >
      <a-form ref="formRef" :rules="rules" :model="modelRef">
        <a-form-item
          label="审批流程"
          :labelCol="{ span: 4, offset: 2 }"
          :wrapperCol="{ span: 14, offset: 1 }"
          name="process"
        >
          <a-select v-model:value="modelRef.process" @change="handleProcessSelect">
            <a-select-option v-for="item in processList" :key="item.flowId" :value="item.flowId">{{
              item.flowName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-show="isSelect"
          label="审批人"
          :labelCol="{ span: 4, offset: 2 }"
          :wrapperCol="{ span: 14, offset: 1 }"
        >
          <div style="height: 17px"></div>
          <a-timeline>
            <a-timeline-item v-for="(item, index) in processStaffList" :key="item.userId" color="red">
              <template #dot>
                <div class="time-progess">{{ index + 1 }}</div>
              </template>
              <section class="time-sec">
                <p class="time-name">{{ item.name }}</p>
              </section>
            </a-timeline-item>
            <a-timeline-item color="red" v-for="(item, index) in staffList" :key="item.id">
              <template #dot>
                <div class="time-progess">{{ index + 1 }}</div>
              </template>
              <section class="time-sec">
                <p class="time-name">{{ item.name || item.userName }}</p>
              </section>
            </a-timeline-item>
            <a-timeline-item color="red" key="ss" v-if="!processStaffList.length">
              <template #dot>
                <div class="time-progess">{{ staffList.length + 1 }}</div>
              </template>
              <a-button class="add-btn" @click="approvalVisible = true">
                +
              </a-button>
            </a-timeline-item>
          </a-timeline>
        </a-form-item>
        <a-form-item label="上传附件" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14, offset: 1 }">
          <lineUpload :count="100" @fileChange="handleThumbUploadChange" :fileList="modelRef.fileList" />
        </a-form-item>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14, offset: 1 }" label="申请事由">
          <a-textarea :autosize="{ minRows: 5 }" v-model:value="modelRef.mark" :maxlength="50" />
        </a-form-item>
        <a-button @click.prevent="$emit('update:visible', false)" class="cancel btn">取消</a-button>
        <a-button @click="modalSubmit" class="primary btn" :loading="loading" type="primary">确定</a-button>
      </a-form>
    </a-modal>
    <a-modal
      centered
      title="选择审批人"
      @cancel="approvalVisible = false"
      @ok="selectApprovalFn"
      :visible="approvalVisible"
      :getContainer="() => $refs.parent"
    >
      <div
        style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px; max-height: 400px; overflow-y: scroll;"
        v-show="searchLbwList.length"
      >
        <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
          全选
        </a-checkbox>
        <a-checkbox-group v-model:value="check.checkedList" :options="searchLbwList" @change="onChange" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, toRaw, onMounted, watch } from 'vue'
import lineUpload from '@/components/Upload/lineUpload'
import { getFingerProcessStaff, getProcessStaffList } from '@/apis/businessManage'
export default defineComponent({
  components: {
    lineUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    processList: {
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
    const formRef = ref()
    const state = reactive({
      isSelect: false,
      processStaffList: [],
      staffList: [],
      approvalVisible: false,
      searchLbwList: []
    })
    const modelRef = reactive({
      mark: undefined,
      process: undefined,
      fileList: []
    })
    const rules = {
      process: [
        {
          type: 'number',
          required: true,
          message: '请选择审批流程'
        }
      ]
    }
    const getProcessStaff = async () => {
      const res = await getProcessStaffList()
      state.searchLbwList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
    }
    const handleProcessSelect = async () => {
      const res = await getFingerProcessStaff({ id: modelRef.process })
      state.isSelect = true
      state.staffList = []
      state.processStaffList = res.data
      check.indeterminate = false
      check.checkedList = []
      check.checkAll = false
    }
    const modalSubmit = () => {
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(() => {
          const params = {
            archivedText: modelRef.mark,
            flowId: modelRef.process,
            documentArchivedFileDTO: modelRef.fileList,
            id: props.current.documentId
          }
          if (state.staffList.length) {
            params.documentViceUserAddDTOS = state.staffList.map(item => ({ userId: item.id }))
          }
          emit('modalSubmit', params)
        })
        .catch(() => emit('update:loading', false))
    }

    const check = reactive({
      indeterminate: false,
      checkedList: [],
      checkAll: false
    })
    const onCheckAllChange = e => {
      check.indeterminate = e.target.checked
      check.checkedList = e.target.checked ? toRaw(state.searchLbwList).map(item => item.value) : []
      check.checkAll = e.target.checked
    }
    const onChange = checkedList => {
      check.checkAll = checkedList.length === state.searchLbwList.length
    }
    const selectApprovalFn = () => {
      state.approvalVisible = false
      state.staffList = toRaw(check.checkedList).map(item => state.searchLbwList.find(it => it.id === item))
    }
    const handleThumbUploadChange = (type, res) => {
      if (type === 'add') {
        modelRef.fileList = res.map(item => ({ fileId: item.response.data[0].fileImageDTO.id }))
      } else {
        modelRef.fileList = res.map(item => ({ fileId: item.response.data[0].fileImageDTO.id }))
      }
    }

    onMounted(() => {
      getProcessStaff()
    })

    watch(
      () => props.visible,
      visible => {
        if (visible) {
          check.indeterminate = false
          check.checkedList = []
          check.checkAll = false
          state.staffList = []
          modelRef.fileList = []
          modelRef.process = undefined
          state.isSelect = false
        }
      }
    )

    return {
      ...toRefs(state),
      formRef,
      rules,
      modalSubmit,
      modelRef,
      handleProcessSelect,
      check,
      onCheckAllChange,
      onChange,
      selectApprovalFn,
      handleThumbUploadChange
    }
  }
})
</script>

<style lang="scss" scoped>
.time-progess {
  width: 20px;
  height: 20px;
  background: #c3161c;
  border-radius: 50%;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
}
.time-sec {
  padding-left: 24px;
  margin-bottom: 30px;
  transform: translateY(-8px);
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .time-name {
    font-size: 11px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 32px;
    transform: translateY(5px);
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px dotted #c3161c;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  padding: 0;
  color: #c3161c;
  font-weight: 600;
  margin-left: 22px;
  transform: translateY(-4px);
}
.ant-checkbox-group {
  display: flex;
  flex-direction: column;
}
.btn {
  width: 100px;
  height: 38px;
  opacity: 1;
  border-radius: 5px;
  margin-left: 20px;
  margin-top: 40px;
  margin-bottom: 20px;
}
.cancel {
  border: 1px solid #dadada;
  margin-left: 260px;
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
