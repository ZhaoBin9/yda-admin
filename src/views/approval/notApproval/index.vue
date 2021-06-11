<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" allowClear v-model:value="searchVal" :maxlength="20" placeholder="请输入关键字查询">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span class="input-label">审批类型：</span>
      <a-select
        v-model:value="sealStatus"
        allowClear
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请选择审批类型"
      >
        <a-select-option v-for="item in examineTypeList" :key="item.id" :value="item.id">{{
          item.name
        }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="notApprovalColumns"
      :pagination="pagination"
      :dataSource="dataSource"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #fileName="{text}">{{ text ? text : '--' }}</template>
      <template #id="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #examineType="{text}">{{ text === 1 ? '用印审批' : '归档审批' }}</template>
      <template #action="{ record }"><a @click="openModal(record)">审批</a></template>
    </a-table>
    <modal
      v-model:visible="visible"
      :isApproval="true"
      @modalSubmit="modalSubmit"
      :current="current"
      :currentLoading="currentLoading"
      v-model:loading="loading"
    />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { notApprovalColumns } from '../columns'
import modal from '../components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getNotApprovalList, getApprovedDetail, sendApprovalResult } from '@/apis/approval'
import { cmsNotice } from '@/utils/utils'
import { useStore } from 'vuex'
import { SET_APPLY_UPDATE } from '@/store/globalData/mutations-type'
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
        pageSize: 10,
        total: 0,
        current: 1,
        'show-total': total => `总共${total}条数据`,
        index: 0
      },
      dataSource: [],
      visible: false,
      current: undefined,
      loading: false,
      tableLoading: true,
      currentLoading: false
    })

    const getList = async () => {
      state.tableLoading = true
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
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const openModal = async current => {
      state.visible = true
      state.currentLoading = true
      const res = await getApprovedDetail({ documentId: current.documentId })
      state.current = { ...res.data, examineType: current.examineType, documentId: current.documentId }
      state.currentLoading = false
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
      handleTableChange,
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
