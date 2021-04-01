<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" :maxlength="20" v-model:value="searchVal" placeholder="请输入角色名称">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="add-btn" @click="openModal('add')" v-btn="'add'">添加角色</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table :columns="roleColumns" :dataSource="dataSource" :pagination="pagination">
      <template #name="{text}">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <template #explain="{text}">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <template #action="{record}">
        <a @click="openModal('edit', record)" style="margin-right:20px; display: inline-block;" v-btn="'update'"
          >修改</a
        >
        <a @click="openModal('delete', record)" v-btn="'delete'">删除</a>
      </template>
    </a-table>
    <modal
      v-model:visible="visible"
      v-model:loading="loading"
      :permissionList="permissionList"
      :current="current"
      @modelSubmit="addRole"
      :type="actionType"
      :reRender="reRender"
    />
  </a-card>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { roleColumns } from '../columns'
import modal from './components/modal'
import tableHeader from '@/views/components/tableHeader'
import {
  getRoleList,
  addNewRole,
  editRole,
  deleteRole,
  getPermissionList,
  getPermissionInfo
} from '@/apis/businessManage'
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
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      roleColumns,
      dataSource: [],
      visible: false,
      current: undefined,
      actionType: 'add',
      permissionList: [],
      reRender: {},
      loading: false
    })

    const getList = async () => {
      const params = {
        isSystem: true,
        searchName: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getRoleList(params)
      state.pagination.total = res.totalItem
      state.dataSource = res.data.map(item => (item.key = item.id + '' && item))
    }
    const fetchPermissionList = async () => {
      const selectedObj = {
        用印管理: true,
        用印申请: true,
        用印记录: true
      }
      function replacePermissionFeild(arr) {
        return arr.map(item => {
          const newItem = { ...item, title: item.name, key: item.id, disabled: selectedObj[item.name] ?? false }
          if (newItem.child && newItem.child.length) {
            newItem.children = replacePermissionFeild(newItem.child)
          }
          delete newItem.child
          delete newItem.name
          delete newItem.id
          return newItem
        })
      }
      const res = await getPermissionList()
      state.permissionList = replacePermissionFeild(res.data)
    }
    const openModal = async (type, current) => {
      state.current = current
      if (type === 'delete') {
        Modal.confirm({
          centered: true,
          title: '删除角色',
          content: '确定要删除该角色吗？',
          onOk: async () => {
            const res = await deleteRole({ id: current.id })
            if (res.success) {
              cmsNotice('success', '删除成功')
              getList()
            }
          }
        })
      } else if (type === 'add') {
        state.actionType = type
        state.visible = true
      } else if (type === 'edit') {
        state.visible = true
        const res = await getPermissionInfo({ id: current.id })
        state.current.selected = res.data.selected
        state.actionType = type
      }
      //
      state.reRender = {}
    }
    const addRole = async values => {
      if (state.actionType === 'add') {
        const res = await addNewRole({ explain: values.mark, name: values.roleName, permissionsIds: values.power })
        if (res.success) {
          cmsNotice('success', '添加成功')
          getList()
        }
      } else if (state.actionType === 'edit') {
        const res = await editRole({
          explain: values.mark,
          name: values.roleName,
          permissionsIds: values.power,
          id: state.current.id
        })
        if (res.success) {
          cmsNotice('success', '修改成功')
          getList()
        }
      }
      state.visible = false
    }
    const searchList = () => {
      state.pagination.current = 1
      getList()
    }
    onMounted(() => {
      getList()
      fetchPermissionList()
    })

    return {
      ...toRefs(state),
      searchList,
      openModal,
      addRole
    }
  }
})
</script>

<style lang="scss" scoped></style>
