<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" v-model:value="searchVal" :maxlength="20" placeholder="请输入关键字查询 ">
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
        placeholder="请选择"
      >
        <a-select-option v-for="item in sealStatus" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <span class="input-label">审批状态：</span>
      <a-select
        v-model:value="applyStatus"
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请选择"
      >
        <a-select-option v-for="item in sealType" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table :columns="apprpvedColumns" :dataSource="dataSource">
      <template #examineType="{text}">{{ text === 1 ? '用印审批' : '归档审批' }}</template>
      <template #sealNames="{text}">
        {{ text.split(',')[0] }}
      </template>
      <template #examineStatus="{text}">
        <span class="dotted" :style="{ background: statusObj[text].color }"></span>
        <span>{{ statusObj[text].name }}</span>
      </template>
      <template #action="{record}">
        <a @click="openModal(record)">查看</a>
      </template>
    </a-table>
    <modal v-model:visible="visible" @modelSubmit="addApply" :current="current" />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { apprpvedColumns } from '../columns'
import modal from '../components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getApprovedList, getApprovedDetail, getApprovedArchive } from '@/apis/approval'
const statusObj = {
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
      sealStatus: undefined,
      apprpvedColumns,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dataSource: [],
      visible: false,
      current: undefined
    })

    const getList = async () => {
      const params = {
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize,
        search: state.searchVal,
        examineStatus: state.applyStatus,
        examineType: state.sealStatus
      }
      const res = await getApprovedList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
    }
    const getDetail = current => {
      if (current.examineType === 1)
        return getApprovedDetail({ documentId: current.documentId, examineType: current.examineType })
      return getApprovedArchive({ documentId: current.documentId, examineType: current.examineType })
    }
    const openModal = async current => {
      state.visible = true
      const res = await getDetail(current)
      state.current = res.data
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      searchList,
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
