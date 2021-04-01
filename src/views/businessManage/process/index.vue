<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" :maxlength="20" v-model:value="searchVal" placeholder="请输入流程名称">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="add-btn" @click="openModal('add')">添加流程</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table :columns="processColumns" :dataSource="dataSource" :pagination="pagination" @change="handleTanChange">
      <template #businessType="{text}">{{ text === 1 ? '归档审批' : ' 用印审批' }}</template>
      <template #action="{record}">
        <a @click="openModal('edit', record)" style="display: inline-block; margin-right: 20px">修改</a>
        <a @click="openModal('delete', record)">删除</a>
      </template>
    </a-table>
    <modal
      v-model:visible="visible"
      @modalSubmit="modalSubmit"
      :type="actionType"
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
import { getProcessList, deleteProcess, addProcess, editProcess } from '@/apis/businessManage'
import { Modal } from 'ant-design-vue'
import { cmsNotice } from '@/utils/utils'

export default defineComponent({
  components: {
    tableHeader,
    modal
  },
  setup() {
    const state = reactive({
      searchVal: undefined,
      processColumns,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      visible: false,
      current: undefined,
      loading: false,
      actionType: 'add'
    })

    const getList = async () => {
      const params = {
        searchFlowName: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getProcessList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
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
            content: '确定删除该部门吗？',
            centered: true,
            confirmLoading: state.loading,
            onOk: async () => {
              const res = await deleteProcess({ id: current.flowId })
              console.log(res)
              if (res.success) {
                cmsNotice('success', '删除成功')
                state.pagination.total % (state.pagination.current * 10 - 10) === 1 && (state.pagination.current -= 1)
                getList()
              }
              state.loading = false
            }
          })
        }
      }
      actionObjFn[type] ? actionObjFn[type]() : (state.visible = true)
    }
    const modalSubmit = val => {
      const actionObjFn = {
        add: async function() {
          const res = await addProcess(JSON.stringify(val))
          console.log(res)
          if (res.success) {
            cmsNotice('success', '添加成功')
            getList()
          }
          state.visible = false
          state.loading = false
        },
        edit: async function() {
          const res = await editProcess(JSON.stringify(val))
          if (res.success) {
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

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      searchList,
      openModal,
      modalSubmit,
      handleTanChange
    }
  }
})
</script>

<style lang="scss" scoped></style>
