<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" v-model:value="searchVal" :maxlength="20" placeholder="请输入文件名称或申请人">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span class="input-label">审批状态：</span>
      <a-select
        v-model:value="applyStatus"
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请选择"
      >
        <a-select-option v-for="item in approvalList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <span class="input-label">用印状态：</span>
      <a-select
        v-model:value="sealStatus"
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请选择"
      >
        <a-select-option v-for="item in fingerList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="export-btn basic-btn" @click="exportTable">导出</a-button>
      <a-button class="add-btn" @click="openModal">添加申请</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table :columns="columns" :dataSource="dataSource" :pagination="pagination" @change="handleTableChange">
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
import { getApply, addApply, exportApply } from '@/apis/seal'
import { getFingerProcessList, getSealProcessList, sendArchived } from '@/apis/businessManage'
import { cmsNotice } from '@/utils/utils'
const approvalList = [
  {
    id: 1,
    name: '审批中'
  },
  {
    id: 2,
    name: '已同意'
  },
  {
    id: 3,
    name: '已拒绝'
  },
  {
    id: 4,
    name: '已回档'
  }
]
const fingerList = [
  {
    id: 1,
    name: '不可用'
  },
  {
    id: 2,
    name: '待用印'
  },
  {
    id: 3,
    name: '用印中'
  },
  {
    id: 4,
    name: '待归档'
  },
  {
    id: 5,
    name: '已归档'
  }
]
const examineStatusObj = {
  0: {
    name: '用印审批中',
    color: '#5F99FF'
  },
  1: {
    name: '用印同意',
    color: '#43CF75'
  },
  2: {
    name: '用印拒绝',
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
  components: {
    modal,
    'archive-modal': archiveModal,
    tableHeader
  },
  setup() {
    const state = reactive({
      searchVal: undefined,
      applyStatus: undefined,
      sealStatus: undefined,
      columns: applyColumns,
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1
      },
      dataSource: [],
      modalVisible: false,
      visible: false,
      current: undefined,
      processTypeList: [],
      processList: [],
      loading: false
    })

    const getList = async () => {
      const params = {
        pageSize: state.pagination.pageSize,
        pageIndex: state.pagination.current,
        sealStatus: state.sealStatus,
        searchName: state.searchVal
      }
      const res = await getApply(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
    }
    const getSealProcess = async () => {
      const res = await getSealProcessList()
      state.processList = res.data
    }
    const getFingerProcess = async () => {
      const res = await getFingerProcessList()
      state.processTypeList = res.data
      state.pagination.total = res.totalItem
    }
    const openModal = () => {
      if (state.processTypeList.length === 0) {
        cmsNotice('error', '请先上添加流程')
        return
      }
      state.modalVisible = true
    }
    const exportTable = () => {
      window.location = exportApply()
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
      approvalList,
      fingerList,
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
