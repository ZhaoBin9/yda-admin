<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" allowClear :maxlength="20" v-model:value="searchVal" placeholder="请输入流程名称">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="add-btn" @click="openModal('add')">添加流程</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="processColumns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTanChange"
      :loading="tableLoading"
    >
      <template #id="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #businessType="{text}">{{ text === 2 ? '归档审批' : ' 用印审批' }}</template>
      <template #flowScope="{text, record}"
        ><span class="process-range" :title="processRangeFilterFn(record.flowScopeVO, 1)">
          {{ text === 1 ? '全部员工' : record.flowScopeVO ? processRangeFilterFn(record.flowScopeVO) : '--' }}
        </span></template
      >
      <template #action="{record}">
        <a @click="openModal('edit', record)" style="display: inline-block; margin-right: 20px">修改</a>
        <a @click="openModal('delete', record)">删除</a>
      </template>
    </a-table>
    <modal
      v-model:visible="visible"
      @modalSubmit="modalSubmit"
      :types="actionType"
      :current="current"
      v-model:loading="loading"
    />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { processColumns } from '../columns'
import modal from './components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getProcessList, deleteProcess, addProcess, editProcess, getFingerProcessStaff } from '@/apis/businessManage'
import { Modal } from 'ant-design-vue'
import { cmsNotice } from '@/utils/utils'
import { SET_APPLY_PROCESS_LIST } from '@/store/globalData/mutations-type'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    tableHeader,
    modal
  },
  setup() {
    const store = useStore()
    const state = reactive({
      searchVal: undefined,
      processColumns,
      dataSource: [],
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        'show-total': total => `总共${total}条数据`,
        index: 0
      },
      visible: false,
      current: undefined,
      loading: false,
      actionType: 'add',
      tableLoading: true
    })

    const getList = async () => {
      state.tableLoading = true
      const params = {
        searchFlowName: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getProcessList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const handleTanChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const openModal = (type, current) => {
      state.actionType = type
      state.current = current
      const actionObjFn = {
        delete() {
          state.loading = true
          Modal.confirm({
            title: '提示',
            content: '确定删除该审批流程吗？',
            centered: true,
            confirmLoading: state.loading,
            onOk: async () => {
              const res = await deleteProcess({ id: current.flowId })
              if (res.success) {
                cmsNotice('success', '删除成功')
                state.pagination.total % (state.pagination.current * 10 - 10) === 1 && (state.pagination.current -= 1)
                getList()
              }
              state.loading = false
            }
          })
        },
        async edit() {
          const res = await getFingerProcessStaff({ id: current.flowId })
          state.current.flowUserRelsVO = res.data.map((item, index) => {
            item.index = index
            return item
          })
          state.visible = true
        }
      }
      actionObjFn[type] ? actionObjFn[type]() : (state.visible = true)
    }
    const modalSubmit = val => {
      const actionObjFn = {
        add: async function() {
          const res = await addProcess(JSON.stringify(val))
          if (res.success) {
            store.dispatch(`globalData/${SET_APPLY_PROCESS_LIST}`)
            cmsNotice('success', '添加成功')
            getList()
          }
          state.visible = false
          state.loading = false
        },
        edit: async function() {
          const res = await editProcess(JSON.stringify({ ...val, flowId: state.current.flowId }))
          if (res.success) {
            store.dispatch(`globalData/${SET_APPLY_PROCESS_LIST}`)
            cmsNotice('success', '修改成功')
            getList()
          }
          state.visible = false
          state.loading = false
        }
      }
      actionObjFn[state.actionType]()
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }

    const processRangeFilterFn = (list, type) => {
      if (!list) return type ? '' : '--'
      const rangeList = list
        .map(item =>
          item.departmentName && item.name ? item.departmentName + ',' + item.name : item.departmentName || item.name
        )
        .toString()
        .split(',')
      if (type) return rangeList.length > 3 ? rangeList.toString() : ''
      return rangeList.length > 3 ? rangeList.slice(0, 3).toString() + '...' : rangeList.toString()
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      searchList,
      openModal,
      modalSubmit,
      handleTanChange,
      processRangeFilterFn
    }
  }
})
</script>

<style lang="scss" scoped>
.process-range {
  max-width: 250px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
}
</style>
