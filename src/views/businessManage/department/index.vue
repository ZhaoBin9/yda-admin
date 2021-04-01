<template>
  <div class="wrap">
    <section class="tree-box">
      <h3 class="company-title">{{ companyName }}</h3>
      <a-tree
        class="draggable-tree"
        v-model:selectedKeys="selectedKeys"
        :default-expanded-keys="[]"
        :tree-data="permissionList"
      >
        <template #switcherIcon>
          <img src="@/assets/svg/depart-tree-arrow.svg" />
        </template>
      </a-tree>
    </section>
    <section class="table-box">
      <tableHeader>
        <a-input class="sec-input" :maxlength="20" v-model:value="searchVal" placeholder="请输入部门名称">
          <template #prefix>
            <img src="@/assets/svg/search.svg" />
          </template>
        </a-input>
        <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
        <a-button class="add-btn" @click="openModal('export')" v-btn="'import'">批量导入</a-button>
        <a-button class="add-btn" @click="openModal('add')" v-btn="'add'">添加部门</a-button>
      </tableHeader>
      <div style="height: 40px"></div>
      <a-table
        :columns="departmentColumns"
        :dataSource="dataSource"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #parentDeptName="{text}">{{ text ? text : '--' }}</template>
        <template #level="{text}">{{ text }}级</template>
        <template #action="{record}">
          <a @click="openModal('edit', record)" v-btn="'update'">修改</a>
          <a @click="openModal('delete', record)" v-btn="'delete'" style="margin-left: 20px">删除</a>
        </template>
      </a-table>
    </section>
    <modal
      :isAdd="isAdd"
      v-model:visible="visible"
      v-model:loading="loading"
      :type="actionType"
      :permissionList="copyList"
      :current="current"
      @modalSubmit="modalSubmit"
    />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { Modal } from 'ant-design-vue'
import tableHeader from '@/views/components/tableHeader'
import { departmentColumns } from '../columns'
import modal from './components/modal'
import {
  getDepartmentOrganizational,
  getDepartmentList,
  addDepartment,
  deleteDepartment,
  editDepartment,
  importDepartment
} from '@/apis/businessManage'
import { cmsNotice } from '@/utils/utils'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    tableHeader,
    modal
  },
  setup() {
    const store = useStore()
    const companyName = computed(() => store.state.user.userInfo.enterpriseName)
    const state = reactive({
      visible: false,
      searchVal: undefined,
      selectedKeys: undefined,
      departmentColumns,
      isAdd: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dataSource: [],
      permissionList: [],
      copyList: [],
      actionType: 'add',
      current: undefined,
      loading: false
    })
    const getList = async () => {
      const params = {
        searchDepartmentName: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getDepartmentList(params)
      state.dataSource = res.data
      state.pagination.total = res.totalItem
    }
    const fetchPermissionList = async () => {
      function replacePermissionFeild(arr) {
        return arr.map(item => {
          const newItem = {
            ...item,
            title: item.departmentName,
            key: item.id,
            value: item.id,
            label: item.departmentName
          }
          if (newItem.departmentDTOList && newItem.departmentDTOList.length) {
            newItem.children = replacePermissionFeild(newItem.departmentDTOList)
          }
          delete newItem.departmentDTOList
          delete newItem.departmentName
          delete newItem.id
          return newItem
        })
      }
      const res = await getDepartmentOrganizational()
      state.permissionList = replacePermissionFeild(res.data)
      state.copyList = replacePermissionFeild(res.data)
    }
    const handleTableChange = ({ current }) => {
      state.pagination.current = current
      getList()
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }
    const openModal = (type, current) => {
      const actionObjFn = {
        delete() {
          Modal.confirm({
            title: '提示',
            content: '确定删除该部门吗？',
            centered: true,
            onOk: async () => {
              const res = await deleteDepartment({ id: current.id })
              if (res.success) {
                cmsNotice('success', '删除成功')
                state.pagination.total % (state.pagination.current * 10 - 10) === 1 && (state.pagination.current -= 1)
                getList()
                fetchPermissionList()
              }
              state.visible = false
            }
          })
        }
      }
      state.actionType = type
      state.current = current
      if (type !== 'export') {
        state.isAdd = true
      } else {
        state.isAdd = false
      }
      actionObjFn[type] ? actionObjFn[type]() : (state.visible = true)
    }
    const modalSubmit = async value => {
      if (state.actionType === 'export') {
        const res = await importDepartment(value)
        if (res.success) cmsNotice('success', '上传成功')
      } else if (state.actionType === 'add') {
        const res = await addDepartment({
          departmentName: value.department,
          parentId: value.nextDepart[value.nextDepart.length - 1] || 0
        })
        if (res.success) cmsNotice('success', '添加成功')
      } else if (state.actionType === 'edit') {
        const res = await editDepartment({
          departmentName: value.department,
          parentId: value.nextDepart[value.nextDepart.length - 1] || 0,
          id: state.current.id
        })
        if (res.success) cmsNotice('success', '修改成功')
      }
      state.loading = false
      getList()
      fetchPermissionList()
      state.visible = false
    }
    onMounted(() => {
      getList()
      fetchPermissionList()
    })

    return {
      ...toRefs(state),
      handleTableChange,
      searchList,
      openModal,
      modalSubmit,
      companyName
    }
  }
})
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  .tree-box {
    width: 304px;
    padding-left: 34px;
    .company-title {
      height: 22px;
      opacity: 1;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin-bottom: 20px;
    }
  }
  .table-box {
    flex: 1;
    background-color: #fff;
    padding: 40px;
    margin-right: 40px;
  }
}
::v-deep .ant-tree-title {
  display: inline-block;
  width: 100px;
  height: 35px;
  background: #ffffff;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #333333;
  line-height: 35px;
}
::v-deep .ant-tree-switcher {
  width: 36px !important;
  height: 36px !important;
  transition: 0.3s;
  transform: rotateZ(-90deg);
}
::v-deep .ant-tree-switcher_open {
  transform: rotateZ(0deg);
}
::v-deep .ant-tree-node-content-wrapper {
  height: 38px !important;
  padding: 0 !important;
  border-radius: 6px !important;
  border: 1px solid transparent;
}
::v-deep .ant-tree-node-selected {
  background: transparent !important;
  border: 1px solid #c3161c;
}
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
