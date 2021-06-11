<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" allowClear v-model:value="searchVal" :maxlength="20" placeholder="请输入关键字查询 ">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span class="input-label">审批类型：</span>
      <a-select
        v-model:value="sealTypes"
        allowClear
        style="width: 220px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请选择"
      >
        <a-select-option v-for="item in sealStatus" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <span class="input-label">审批状态：</span>
      <a-select
        v-model:value="applyStatus"
        allowClear
        style="width: 220px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请选择"
      >
        <a-select-option v-for="item in sealType" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="apprpvedColumns"
      :pagination="pagination"
      :dataSource="dataSource"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #id="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #name="{text}">
        {{ text.split(',')[0] }}
      </template>
      <template #fileName="{text}">{{ text ?? '--' }}</template>
      <template #sealNames="{text}">
        <span :title="text.split(',').length > 3 ? text : null">
          {{
            text.split(',').length > 3
              ? text
                  .split(',')
                  .slice(0, 3)
                  .join(',') + '...'
              : text
          }}
        </span>
      </template>
      <template #examineType="{text}">{{ text === 1 ? '用印审批' : '归档审批' }}</template>
      <template #examineStatus="{text}">
        <span class="dotted" :style="{ background: statusObj[text].color }"></span>
        <span>{{ statusObj[text].name }}</span>
      </template>
      <template #action="{record}">
        <a @click="openModal(record)">查看</a>
      </template>
    </a-table>
    <modal v-model:visible="visible" @modelSubmit="addApply" :currentLoading="currentLoading" :current="current" />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { apprpvedColumns } from '../columns'
import modal from '../components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getApprovedList, getApprovedDetail } from '@/apis/approval'
const statusObj = {
  0: {
    name: '用印审批中',
    color: '#FF8309'
  },
  1: {
    name: '用印同意',
    color: '#5F99FF'
  },
  2: {
    name: '用印拒绝',
    color: '#C3161C'
  },
  4: {
    name: '归档审批通过',
    color: '#5F99FF'
  },
  3: {
    name: '归档审批中',
    color: '#FF8309'
  },
  5: {
    name: '归档审批未通过',
    color: '#D0D0D0'
  }
}
const sealStatus = [
  {
    id: 1,
    name: '用印审批'
  },
  {
    id: 2,
    name: '归档审批'
  }
]
const sealType = [
  {
    id: 1,
    name: '已同意'
  },
  {
    id: 2,
    name: '已拒绝'
  },
  {
    id: 4,
    name: '归档审批通过'
  },
  {
    id: 5,
    name: '归档审批未通过'
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
      sealTypes: undefined,
      apprpvedColumns,
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
        examineType: state.sealTypes
      }
      const res = await getApprovedList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const openModal = async current => {
      state.visible = true
      state.currentLoading = true
      const res = await getApprovedDetail({ documentId: current.documentId })
      state.current = { ...res.data, examineType: current.examineType }
      state.currentLoading = false
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      searchList,
      handleTableChange,
      openModal,
      statusObj,
      sealStatus,
      sealType
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
.dotted {
  width: 7px;
  height: 7px;
  margin-right: 5px;
  display: inline-block;
  border-radius: 50%;
  transform: translateY(-1px);
}
</style>
