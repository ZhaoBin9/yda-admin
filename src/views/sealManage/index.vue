<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" allowClear :maxlength="20" v-model:value="searchVal" placeholder="输入印章名称">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <span class="input-label">印章状态：</span>
      <a-select
        v-model:value="applyStatus"
        allowClear
        placeholder="选择印章状态"
        style="width: 240px;height: 36px;
        background: #ffffff;
        border-radius: 4px;"
      >
        <a-select-option v-for="item in sealType" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="add-btn" v-btn="'add'" @click="openModal('add')">添加印章</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="managementColumns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #id="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #number="{text, record}">
        {{ record.status === 0 ? '未装在设备上' : text ? text : '' }}
      </template>
      <template #status="{text}">
        {{ text === 0 ? '停用' : '启用' }}
      </template>
      <template #action="{record}">
        <a @click="openModal('edit', record)" v-btn="'update'" style="display: inline-block; margin-right: 20px"
          >修改</a
        >
        <a @click="openModal('delete', record)" v-btn="'delete'">删除</a>
      </template>
    </a-table>
    <modal
      v-model:visible="visible"
      :type="actionType"
      :staffList="staffList"
      v-model:loading="loading"
      :current="current"
      @modalSubmit="modalSubmit"
    />
  </a-card>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { managementColumns } from './columns'
import modal from './components/modal'
import tableHeader from '@/views/components/tableHeader'
import { getSealList, deleteSeal, editSeal, addSeal, getStaffList } from '@/apis/sealManage'
import { Modal } from 'ant-design-vue'
import { cmsNotice } from '@/utils/utils'
const sealType = [
  {
    id: 0,
    name: '停用'
  },
  {
    id: 1,
    name: '启用'
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
      managementColumns,
      dataSource: [],
      visible: false,
      current: undefined,
      pagination: {
        pageSize: 10,
        total: 0,
        current: 1,
        'show-total': total => `总共${total}条数据`,
        index: 0
      },
      actionType: 'add',
      loading: false,
      staffList: [],
      tableLoading: true
    })

    const getList = async () => {
      state.tableLoading = true
      const params = {
        status: state.applyStatus,
        searchName: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getSealList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const getStaffData = async () => {
      const res = await getStaffList()
      state.staffList = res.data
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const openModal = (type, current) => {
      const actionObjFn = {
        delete() {
          Modal.confirm({
            title: '提示',
            content: '确定删除该印章吗？',
            centered: true,
            confirmLoading: state.loading,
            onOk: async () => {
              const res = await deleteSeal({ id: current.id })
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
      if (actionObjFn[type]) {
        actionObjFn[type]()
      } else {
        state.actionType = type
        state.current = current
        state.visible = true
      }
    }
    const modalSubmit = value => {
      const actionTypeFn = {
        add: async function() {
          const res = await addSeal({ custodianId: value.keepName, sealName: value.sealVal, type: value.sealStatus })
          if (res.success) {
            cmsNotice('success', '添加成功')
            getList()
          }
          state.loading = false
          state.visible = false
        },
        edit: async function() {
          const res = await editSeal({
            id: state.current.id,
            custodianId: value.keepName,
            sealName: value.sealVal,
            type: value.sealStatus
          })
          if (res.success) {
            cmsNotice('success', '修改成功')
            getList()
          }
          state.loading = false
          state.visible = false
        }
      }
      actionTypeFn[state.actionType]()
    }
    onMounted(() => {
      getList()
      getStaffData()
    })

    return {
      ...toRefs(state),
      openModal,
      searchList,
      modalSubmit,
      sealType,
      handleTableChange
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
