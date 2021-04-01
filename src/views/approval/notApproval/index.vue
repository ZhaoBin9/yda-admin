<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" v-model:value="searchVal" :maxlength="20" placeholder="输入关键字查询">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span class="input-label">审批类型：</span>
      <a-select
        v-model:value="applyStatus"
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="选择审批类型"
      >
        <a-select-option v-for="item in examineTypeList" :key="item.id" :value="item.id">{{
          item.name
        }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table :columns="notApprovalColumns" :dataSource="dataSource">
      <template #examineType="{text}">{{ text === 1 ? '用印审批' : '归档审批' }}</template>
      <template #action="{ record }"><a @click="openModal(record)">审批</a></template>
    </a-table>
    <modal
      v-model:visible="visible"
      :isApproval="true"
      @modalSubmit="modalSubmit"
      :current="current"
      v-model:loading="loading"
    />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { notApprovalColumns } from '../columns'
import modal from '../components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getNotApprovalList, getNotApprovalDetail, sendApprovalResult, getNotArchivedDetail } from '@/apis/approval'
import { cmsNotice } from '@/utils/utils'
const examineTypeList = [
  {
    id: 1,
    name: '用印审批'
  },
  {
    id: 2,
    name: '归档审批'
  }
]
export default defineComponent({
  components: {
    modal,
    tableHeader
  },
  setup() {
    const state = reactive({
      searchVal: undefined,
      applyStatus: undefined,
      sealStatus: undefined,
      notApprovalColumns,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dataSource: [],
      visible: false,
      current: undefined,
      loading: false
    })

    const getList = async () => {
      const params = {
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize,
        search: state.searchVal,
        examineStatus: state.applyStatus,
        examineType: state.sealStatus
      }
      const res = await getNotApprovalList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }
    const getApprovalDetailType = current => {
      if (current.examineType === 1)
        return getNotApprovalDetail({ documentId: current.documentId, examineType: current.examineType })
      return getNotArchivedDetail({ documentId: current.documentId, examineType: current.examineType })
    }
    const openModal = async current => {
      state.visible = true
      const res = await getApprovalDetailType(current)
      state.current = res.data
    }
    const modalSubmit = async (status, opinion) => {
      const res = await sendApprovalResult({
        documentId: state.current.documentId,
        examineType: state.current.examineType,
        state: status,
        opinion
      })
      if (res.success) {
        cmsNotice('success', '审批成功')
        getList()
      }
      state.visible = false
      state.loading = false
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      getList,
      openModal,
      examineTypeList,
      searchList,
      modalSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .ant-select {
  .ant-select-selector {
    height: 36px;
    border-radius: 4px;
    line-height: 36px;
  }
  .ant-select-selection-placeholder {
    line-height: 36px;
  }
  .ant-select-selection-item {
    line-height: 36px;
  }
}
</style>
