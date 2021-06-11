<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input
        class="sec-input  table-arg-margin"
        allowClear
        v-model:value="searchVal"
        :maxlength="20"
        placeholder="请输入文件名称或申请人"
      >
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span style="margin-top: 10px" class="input-label table-arg-margin">审批状态：</span>
      <a-select
        v-model:value="applyStatus"
        allowClear
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px; margin-top: 10px;"
        placeholder="请选择"
      >
        <a-select-option v-for="(value, key) in examineStatusObj" :key="key" :value="key">{{
          value.name
        }}</a-select-option>
      </a-select>
      <span style="margin-top: 10px" class="input-label table-arg-margin">用印状态：</span>
      <a-select
        v-model:value="sealStatus"
        allowClear
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px; margin-top: 10px;"
        placeholder="请选择"
      >
        <a-select-option v-for="(value, key) in sealStatusObj" :key="key" :value="key">{{
          value.name
        }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn table-arg-margin" @click="searchList">查询</a-button>
      <a-button class="export-btn basic-btn table-arg-margin" @click="exportTable">导出</a-button>
      <a-button class="add-btn table-arg-margin" @click="openModal">添加申请</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #id="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #action="{record}">
        <a @click="$router.push(`/seal/apply/detail?documentId=${record.documentId}`)">查看</a>
        <a style="dispaly: inline-block; margin-left: 15px;" @click="fileModal(record)">{{
          record.sealStatus === 3 && record.userId === userId ? '提交归档' : ''
        }}</a>
      </template>
      <template #examineStatus="{text}">
        <span :style="{ background: examineStatusObj[text]?.color }" class="dottos"></span
        ><span>{{ examineStatusObj[text]?.name }}</span>
      </template>
      <template #sealStatus="{text}">
        <span :style="{ background: sealStatusObj[text]?.color }" class="dottos"></span
        ><span>{{ sealStatusObj[text]?.name }}</span>
      </template>
    </a-table>
    <modal
      v-model:modalVisible="modalVisible"
      @modalSubmit="modalSubmit"
      v-model:loading="loading"
      :processTypeList="processTypeList"
    />
    <archive-modal
      v-model:visible="visible"
      :processList="processList"
      v-model:loading="loading"
      :current="current"
      :type="status"
      @modalSubmit="modalArchive"
    />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { applyColumns } from './columns'
import modal from './components/modal'
import archiveModal from '../applyList/components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getApply, addApply, exportApply, sendArchived } from '@/apis/seal'
import { getSealProcessList } from '@/apis/businessManage'
import { cmsNotice } from '@/utils/utils'
import { useStore } from 'vuex'
const examineStatusObj = {
  0: {
    name: '审批中',
    color: '#5F99FF'
  },
  1: {
    name: '同意',
    color: '#43CF75'
  },
  2: {
    name: '拒绝',
    color: '#C3161C'
  },
  3: {
    name: '归档审批中',
    color: '#FF8309'
  },
  4: {
    name: '归档审批通过',
    color: '#D0D0D0'
  },
  5: {
    name: '归档审批未通过',
    color: '#ccc'
  }
}
const sealStatusObj = {
  0: {
    name: '不可用',
    color: '#C3161C'
  },
  1: {
    name: '待用印',
    color: '#FF8309'
  },
  2: {
    name: '用印中',
    color: '#5F99FF'
  },
  3: {
    name: '待归档',
    color: '#FF8309'
  },
  5: {
    name: '已归档',
    color: '#D0D0D0'
  },
  4: {
    name: '归档中',
    color: '#5F99FF'
  }
}
export default defineComponent({
  name: 'apply',
  components: {
    modal,
    'archive-modal': archiveModal,
    tableHeader
  },
  setup() {
    const store = useStore()
    const state = reactive({
      searchVal: undefined,
      applyStatus: undefined,
      sealStatus: undefined,
      columns: applyColumns,
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        'show-total': total => `总共${total}条数据`,
        index: 0
      },
      dataSource: [],
      modalVisible: false,
      visible: false,
      current: undefined,
      processTypeList: [],
      processList: [],
      loading: false,
      tableLoading: true
    })

    const getList = async () => {
      state.tableLoading = true
      const params = {
        pageSize: state.pagination.pageSize,
        pageIndex: state.pagination.current,
        sealStatus: state.sealStatus,
        examineStatus: state.applyStatus,
        search: state.searchVal
      }
      const res = await getApply(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const getSealProcess = async () => {
      const res = await getSealProcessList()
      state.processList = res.data
    }
    const getFingerProcess = () => {
      state.processTypeList = store.state.globalData.applyProcessList
    }
    const openModal = () => {
      if (state.processTypeList.length === 0) {
        cmsNotice('error', '请先添加流程')
        return
      }
      state.modalVisible = true
    }
    const exportTable = () => {
      window.location = exportApply({})
      setTimeout(() => {
        cmsNotice('success', '正在为您导出，请耐心等待...')
      }, 200)
    }
    const modalSubmit = async values => {
      const res = await addApply(values)
      if (res.success) {
        cmsNotice('success', '添加成功')
        getList()
      }
      state.loading = false
      state.modalVisible = false
    }
    const modalArchive = async values => {
      const res = await sendArchived(JSON.stringify(values))
      if (res.success) {
        cmsNotice('success', '归档成功')
        getList()
      }
      state.visible = false
      state.loading = false
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const fileModal = current => {
      state.current = current
      state.visible = true
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }

    onMounted(() => {
      getList()
      getFingerProcess()
      getSealProcess()
    })

    return {
      ...toRefs(state),
      searchList,
      exportTable,
      modalSubmit,
      openModal,
      examineStatusObj,
      sealStatusObj,
      handleTableChange,
      modalArchive,
      fileModal
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
.dottos {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>
