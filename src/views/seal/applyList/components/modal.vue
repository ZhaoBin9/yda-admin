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
          <a-select v-model:value="modelRef.process" @change="handleProcessSelect" placeholder="请选择审批流程">
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
            <virtual-list :list="processStaffList" noHeight :size="103" :remain="8" :isScrollTop="isVirtualListScroll2">
              <template #default="{item}">
                <approval-list-item :item="item" />
              </template>
            </virtual-list>
            <virtual-list
              :list="modelRef.staffList"
              noHeight
              :size="103"
              :remain="8"
              :isScrollTop="isVirtualListScroll2"
            >
              <template #default="{item}">
                <approval-list-item
                  :item="item"
                  :isRemove="true"
                  :deleteApprovalFn="index => deleteApprovalFn(index, modelRef.staffList)"
                />
              </template>
            </virtual-list>
            <a-timeline-item color="red" key="ss" v-if="!processStaffList.length">
              <template #dot>
                <div class="time-progess">{{ modelRef.staffList.length + 1 }}</div>
              </template>
              <a-button class="add-btn" @click="openApprovalModal">
                +
              </a-button>
            </a-timeline-item>
          </a-timeline>
        </a-form-item>
        <a-form-item label="上传附件" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14, offset: 1 }">
          <lineUpload
            v-if="visible"
            :count="100"
            @fileChange="handleThumbUploadChange"
            :size="10"
            :fileList="modelRef.fileList"
            :fileType="['xls', 'xlsx', 'jpg', 'png', 'tif', 'jpeg', 'bmp', 'pdf', 'word', 'webp', 'docx', 'doc', 'txt']"
          />
        </a-form-item>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14, offset: 1 }" label="归档备注">
          <a-textarea
            :autosize="{ minRows: 5 }"
            v-model:value="modelRef.mark"
            :maxlength="50"
            placeholder="请输入归档备注"
          />
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
      <section style="margin-bottom: 10px" v-if="check.totalSearchList.length - modelRef.staffList.length">
        <a-input class="search-input" style="width: 250px" v-model:value="check.searchLbwVal">
          <template #prefix> <img src="@/assets/svg/search.svg" /> </template>
        </a-input>
        <a-button type="primary" class="btn search-btn" @click="searchApprovalList">查找</a-button>
      </section>
      <div style="padding-left: 20px; padding-bottom: 20px; overflow-y: scroll;" v-show="check.searchLbwList.length">
        <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
          全选
        </a-checkbox>
        <a-checkbox-group :value="check.checkedList">
          <virtual-list :list="check.searchLbwList" :size="52" :remain="10" :isScrollTop="isVirtualListScroll">
            <template #default="{item}">
              <approval-staff-item :item="item" :onChange="onChange" />
            </template>
          </virtual-list>
        </a-checkbox-group>
      </div>
      <div style="line-height: 200px; text-align: center;" v-show="!check.searchLbwList.length">
        暂无审批人
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onMounted, watch } from 'vue'
import lineUpload from '@/components/Upload/lineUpload'
import { getFingerProcessStaff, getProcessStaffList } from '@/apis/businessManage'
import VirtualList from '@/components/VirtualList'
import ApprovalStaffItem from '@/components/VirtualList/approvalStaffItem'
import ApprovalListItem from '@/components/VirtualList/approvalListItem'
import { useCheckStateAndEvent } from '@/utils/hooks'

export default defineComponent({
  components: {
    lineUpload,
    VirtualList,
    ApprovalStaffItem,
    ApprovalListItem
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
      approvalVisible: false,
      isVirtualListScroll: 0,
      isVirtualListScroll2: 0
    })
    const modelRef = reactive({
      mark: undefined,
      process: undefined,
      fileList: [],
      staffList: [] // 自由流程选择的审批人
    })
    const rules = reactive({
      process: [
        {
          type: 'number',
          required: true,
          message: '请选择审批流程'
        }
      ]
    })
    const enhancerMapFn = {
      selectApprovalFn() {
        state.approvalVisible = false
        setTimeout(() => {
          formRef.value.clearValidate('staffList')
          state.isVirtualListScroll2 += '1'
        })
      },
      deleteApprovalFn() {
        state.isVirtualListScroll2 = {}
      },
      searchApprovalList() {
        typeof state.isVirtualListScroll === 'number' ? state.isVirtualListScroll++ : (state.isVirtualListScroll = 0)
      },
      openApprovalModal() {
        state.approvalVisible = true
        setTimeout(() => {
          typeof state.isVirtualListScroll === 'number' ? state.isVirtualListScroll++ : (state.isVirtualListScroll = 0)
        })
      },
      changeStaffList() {
        modelRef.staffList = check.staffList.map(item => item)
      }
    }
    const {
      check,
      onChange,
      onCheckAllChange,
      reloadSearchLbwList,
      selectApprovalFn,
      searchApprovalList,
      deleteApprovalFn,
      openApprovalModal
    } = useCheckStateAndEvent(enhancerMapFn)
    const getProcessStaff = async () => {
      // 获取审批人列表
      const res = await getProcessStaffList()
      check.searchLbwList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
      check.totalSearchList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
    }
    const handleProcessSelect = async () => {
      // 流程选择回调
      const res = await getFingerProcessStaff({ id: modelRef.process })
      formRef.value.clearValidate('staffList')
      state.isSelect = true
      modelRef.staffList = []
      state.processStaffList = res.data.map((item, index) => {
        item.index = index
        return item
      })
      if (state.processStaffList) {
        typeof state.isVirtualListScroll2 === 'number' ? state.isVirtualListScroll2++ : (state.isVirtualListScroll2 = 0)
      }
      check.indeterminate = false
      check.checkedList = []
      check.checkAll = false
    }
    const modalSubmit = () => {
      // 确定的回调
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
          if (modelRef.staffList.length) {
            params.documentViceUserAddDTOS = modelRef.staffList.map(item => ({ userId: item.id }))
          }
          emit('modalSubmit', params)
        })
        .catch(() => emit('update:loading', false))
    }
    const handleThumbUploadChange = (type, res) => {
      modelRef.fileList = res.map(item => ({ fileId: item.response.data[0].id }))
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
          modelRef.staffList = []
          modelRef.fileList = []
          modelRef.process = undefined
          modelRef.mark = undefined
          state.isSelect = false
          reloadSearchLbwList()
          check.searchLbwVal = undefined
          typeof state.isVirtualListScroll2 === 'number'
            ? state.isVirtualListScroll2++
            : (state.isVirtualListScroll2 = 0)
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
      handleThumbUploadChange,
      deleteApprovalFn,
      searchApprovalList,
      openApprovalModal
    }
  }
})
</script>

<style lang="scss" scoped>
.remove-arrow {
  display: block;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 288px;
  top: 12px;
  cursor: pointer;
}
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
  margin-bottom: 10px;
  transform: translateY(-8px);
  position: relative;
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
.approval-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  transform: translateY(10px);
  margin-right: 4px;
}
.approval-name {
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  display: inline-block;
  line-height: 32px;
}
</style>
