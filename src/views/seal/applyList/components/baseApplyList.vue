<template>
  <a-card>
    <tableHeader class="table-header">
      <a-input
        class="sec-input"
        allowClear
        :maxlength="20"
        v-model:value="searchVal"
        placeholder="请输入文件名称或申请人"
      >
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span class="input-label">用印状态：</span>
      <a-select
        v-model:value="sealStatus"
        allowClear
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
        placeholder="请输入"
      >
        <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="export-btn basic-btn" @click="exportTable">导出</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="baseColumns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #id="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #count>1</template>
      <template #examineStatus="{text}">
        <span v-if="text" :style="{ background: examineStatusObj[text]?.color }" class="dottos"></span
        ><span>{{ text ? examineStatusObj[text]?.name : '--' }}</span>
      </template>
      <template #sealStatus="{text}">
        <span :style="{ background: sealStatusObj[text]?.color }" class="dottos"></span
        ><span>{{ sealStatusObj[text]?.name }}</span>
      </template>
      <template #action="{record}">
        <a @click="$router.push(`/seal/applyList/detail?id=${record.documentId}`)">查看</a>
        <a style="dispaly: inline-block; margin-left: 15px;" @click="$emit('file-modal', record, 'send')">{{
          record.sealStatus === 3 && record.userId === userId ? '提交归档' : ''
        }}</a>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import { baseColumns } from '../columns'
import tableHeader from '@/views/components/tableHeader'
import { getApplyList, exportBaseList } from '@/apis/seal'
import { cmsNotice } from '@/utils/utils'
const typeList = [
  {
    id: 3,
    name: '待归档'
  },
  {
    id: 4,
    name: '归档中'
  },
  {
    id: 5,
    name: '已归档'
  }
]
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
  name: 'base-apply-list',
  props: {
    userId: {
      type: Number,
      default: 1
    },
    reload: {
      type: Boolean,
      default: false
    },
    status: {
      default: undefined
    }
  },
  components: {
    tableHeader
  },
  setup(props) {
    const state = reactive({
      searchVal: undefined,
      sealStatus: props.status,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        'show-total': total => `总共${total}条数据`,
        index: 0
      },
      dataSource: [],
      baseColumns,
      tableLoading: true
    })
    const getList = async () => {
      state.tableLoading = true
      const params = {
        sealStatus: state.sealStatus,
        search: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getApplyList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const exportTable = () => {
      window.location = exportBaseList({})
      setTimeout(() => {
        cmsNotice('success', '正在为您导出，请耐心等待...')
      }, 200)
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }

    onMounted(() => {
      getList()
    })

    watch(
      () => props.reload,
      () => {
        getList()
      }
    )

    return {
      ...toRefs(state),
      searchList,
      exportTable,
      typeList,
      handleTableChange,
      statusObj,
      sealStatusObj,
      examineStatusObj
    }
  }
})
</script>
<style lang="scss" scoped>
.dottos {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>
