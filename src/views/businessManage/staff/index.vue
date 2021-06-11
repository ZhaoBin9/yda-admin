<template>
  <a-card style="margin: 40px">
    <tableHeader>
      <a-input class="sec-input" allowClear :maxlength="20" v-model:value="searchVal" placeholder="请输入名字或账号">
        <template #prefix>
          <img src="@/assets/svg/search.svg" />
        </template>
      </a-input>
      <a-button class="search-btn basic-btn" @click="searchList">查询</a-button>
      <a-button class="search-btn basic-btn" v-if="isBindLbw" @click="openModal('lbw-import')">由篱笆墙导入</a-button>
      <a-button class="add-btn" @click="openModal('import')" v-btn="'IMPORTUSER'">批量导入</a-button>
      <a-button class="add-btn" @click="openModal('add')" v-btn="'add'">添加员工</a-button>
    </tableHeader>
    <div style="height: 40px"></div>
    <a-table
      :columns="staffColumns"
      :dataSource="dataSource"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="tableLoading"
    >
      <template #id1="{index}">{{ pagination.index * 10 + index - 9 }}</template>
      <template #action="{record}">
        <span v-if="record.identity === 2">
          <a @click="openModal('edit', record)" style="display: inline-block; margin-right: 20px" v-btn="'update'"
            >修改</a
          >
          <a @click="openModal('delete', record)" style="display: inline-block; margin-right: 20px" v-btn="'delete'"
            >删除</a
          >
          <a @click="openModal('pass', record)" v-btn="'repassword'">重置密码</a>
        </span>
        <img v-else class="admin-sign" src="@/assets/images/admin-sign.png" />
      </template>
    </a-table>
    <modal
      v-model:visible="visible"
      v-model:loading="loading"
      :types="types"
      :current="current"
      @modalSubmit="modalSubmit"
      :reRender="reRender"
      :organizationalList="organizationalList"
      :roleList="roleList"
      :isBindLbw="isBindLbw"
    />
  </a-card>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { staffColumns } from '../columns'
import modal from './components/modal'
import tableHeader from '@/views/components/tableHeader'
import {
  getUserList,
  deleteUser,
  addUser,
  editUser,
  getUserInfo,
  getOrganizational,
  getRole,
  reUserPass,
  importLbwUser,
  importUser
} from '@/apis/businessManage'
import { Modal } from 'ant-design-vue'
import { cmsNotice } from '@/utils/utils'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    tableHeader,
    modal
  },
  setup() {
    const store = useStore()
    const isBindLbw = computed(() => store.state.user.userInfo.enterpriseBindLibawall)
    const state = reactive({
      searchVal: undefined,
      staffColumns,
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
      types: 'add',
      loading: false,
      reRender: {},
      organizationalList: [],
      roleList: [],
      lbwList: [],
      lbwSearch: undefined,
      tableLoading: true
    })

    const getList = async () => {
      state.tableLoading = true
      const params = {
        search: state.searchVal,
        pageIndex: state.pagination.current,
        pageSize: state.pagination.pageSize
      }
      const res = await getUserList(params)
      state.dataSource = res.data.map(item => {
        item.id = item.id + ''
        return item
      })
      state.pagination.total = res.totalItem
      state.pagination.index = res.pageIndex
      state.tableLoading = false
    }
    const getOrganizationalList = async () => {
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
      const res = await getOrganizational()
      state.organizationalList = replacePermissionFeild(res.data)
    }
    const getRoleList = async () => {
      const res = await getRole()
      state.roleList = res.data
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
      state.types = type
      state.current = current
      const openObjFn = {
        delete() {
          state.loading = true
          Modal.confirm({
            title: '提示',
            content: '确定删除该员工吗？',
            centered: true,
            confirmLoading: state.loading,
            onOk: async () => {
              const res = await deleteUser({ id: current.id })
              if (res.success) {
                cmsNotice('success', '删除成功')
                state.pagination.total % (state.pagination.current * 10 - 10) === 1 && (state.pagination.current -= 1)
                getList()
              }
            }
          })
          state.loading = false
        },
        edit: async function() {
          state.visible = true
          const res = await getUserInfo({ id: current.id })
          function findSelectItem(arr, ids) {
            const item = arr.find(item => item.select)
            if (item) {
              ids.push(item.id)
              if (item.departmentDTOList.length) return findSelectItem(item.departmentDTOList, ids)
            }
            return ids
          }
          const department = findSelectItem(res.data.list, [])
          let filterRoleId = undefined
          if (Object.keys(res.data.roleId).length) {
            const filterList = Object.keys(res.data.roleId).filter(key => !res.data.roleId[key])
            filterList.length && (filterRoleId = ~~filterList[0])
          }
          const role = filterRoleId
          state.current.role = role
          state.current.department = department
          state.reRender = {}
        }
      }
      openObjFn[type] ? openObjFn[type]() : ((state.visible = true), (state.reRender = {}))
    }
    const modalSubmit = value => {
      const actionObjFn = {
        add: async function() {
          const params = {
            roleId: [value.role],
            name: value.staffName,
            mobile: value.account,
            deptId: value.department[value.department.length - 1]
          }
          const res = await addUser(params)
          if (res.success) {
            cmsNotice('success', '添加成功')
            getList()
          }
          state.loading = false
          state.visible = false
        },
        edit: async function() {
          const params = {
            id: state.current.id,
            roleId: [value.role],
            name: value.staffName,
            mobile: value.account,
            deptId: value.department[value.department.length - 1]
          }
          const res = await editUser(params)
          if (res.success) {
            cmsNotice('success', '修改成功')
            getList()
          }
          state.loading = false
          state.visible = false
        },
        pass: async function() {
          const res = await reUserPass({ newPassword: value.pass, userId: state.current.id })
          if (res.success) cmsNotice('success', '修改员工密码成功')
          state.loading = false
          state.visible = false
        },
        import: async function() {
          const res = await importUser({ file: value })
          if (res.success) {
            cmsNotice('success', '上传成功')
            getList()
          }
          state.loading = false
          state.visible = false
        },
        'lbw-import': async function() {
          const res = await importLbwUser(JSON.stringify(value))
          if (res.success) cmsNotice('success', '导入成功')
          getList()
          state.loading = false
          state.visible = false
        }
      }
      actionObjFn[state.types] && actionObjFn[state.types]()
    }
    onMounted(() => {
      getList()
      getOrganizationalList()
      getRoleList()
    })

    return {
      ...toRefs(state),
      searchList,
      openModal,
      modalSubmit,
      handleTableChange,
      isBindLbw
    }
  }
})
</script>

<style lang="scss" scoped>
// .admin-sign {
//   w
// }
</style>
