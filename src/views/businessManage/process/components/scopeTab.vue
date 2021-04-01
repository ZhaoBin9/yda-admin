<template>
  <section class="scope-box">
    <section v-show="activeKey === 'staff'">
      <a-input class="search-input" style="width: 250px" v-model:value="searchVal">
        <template #prefix> <img src="@/assets/svg/search.svg" /> </template>
      </a-input>
      <a-button type="primary" class="btn" @click="searchStaffList">查找</a-button>
    </section>
    <div style="height: 15px"></div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="staff" tab="员工">
        <div style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px" v-show="searchList.length">
          <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
          <a-checkbox-group v-model:value="check.checkedList" :options="searchList" @change="onChange" />
        </div>
        <div v-show="searchList.length === 0" style="line-height: 200px; text-indent: 150px">
          暂无数据
        </div>
      </a-tab-pane>
      <a-tab-pane key="department" tab="部门">
        <a-tree
          v-if="organizationalList.length"
          class="draggable-tree"
          checkable
          v-model:checkedKeys="department"
          :tree-data="organizationalList"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @expand="onExpand"
          @check="onCheck"
        >
          <template #switcherIcon>
            <img src="@/assets/svg/depart-tree-arrow.svg" />
          </template>
        </a-tree>
        <div v-else style="line-height: 200px; text-indent: 150px">
          暂无数据
        </div>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script>
import { defineComponent, onMounted, reactive, toRaw, toRefs, watch } from 'vue'
import { getDepartmentOrganizational } from '@/apis/businessManage'
export default defineComponent({
  name: 'scope-tab',
  props: {
    searchLbwList: {
      type: Array,
      default: () => []
    },
    departmentVal: {
      type: Object,
      defalut: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const state = reactive({
      activeKey: 'staff',
      organizationalList: [],
      department: [],
      autoExpandParent: false,
      expandedKeys: [],
      searchVal: undefined,
      searchList: []
    })
    const getOrganizationalList = async () => {
      function replacePermissionFeild(arr) {
        return arr.map(item => {
          const newItem = { ...item, title: item.departmentName, key: item.id }
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
      const permissionList = replacePermissionFeild(res.data)
      state.organizationalList = permissionList.length
        ? [
            {
              children: permissionList,
              title: '全部部门',
              key: 'sss'
            }
          ]
        : []
    }

    const check = reactive({
      indeterminate: false,
      checkedList: [],
      checkAll: false
    })
    const onCheckAllChange = e => {
      check.indeterminate = e.target.checked
      check.checkedList = e.target.checked ? state.searchList.map(item => item.id) : []
      check.checkAll = e.target.checked
      emit('update:departmentVal', { ...props.departmentVal, staff: toRaw(check.checkedList) })
      emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
    }
    const onChange = checkedList => {
      check.checkAll = checkedList.length === state.searchList.length
      emit('update:departmentVal', { ...props.departmentVal, staff: checkedList })
      emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
    }
    const onExpand = expandedKeys => {
      state.expandedKeys = expandedKeys
      state.autoExpandParent = false
    }
    const onCheck = checkedKeys => {
      emit('update:departmentVal', { ...props.departmentVal, department: checkedKeys })
      emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
    }
    const searchStaffList = () => {
      state.searchList = props.searchLbwList.filter(item => item.name.includes(state.searchVal))
      check.indeterminate = false
      check.checkedList = []
      onChange([])
    }

    onMounted(() => {
      getOrganizationalList()
    })

    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) return
        state.activeKey = 'staff'
        state.expandedKeys = ['sss']
        state.autoExpandParent = false
        state.searchVal = undefined
        if (props.type === 'add') {
          state.department = []
          check.checkAll = false
          check.indeterminate = false
          check.checkedList = []
        } else if (props.type === 'edit') {
          state.department = ['sss', ...props.departmentVal.department]
          check.checkedList = props.departmentVal.staff
          check.checkAll = props.departmentVal.staff.length === state.searchList.length
          check.indeterminate = check.checkAll
          emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
        }
      },
      { immediate: true }
    )

    watch(
      () => props.searchLbwList.length,
      () => {
        state.searchList = props.searchLbwList
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      onCheckAllChange,
      onChange,
      check,
      onExpand,
      onCheck,
      searchStaffList
    }
  }
})
</script>

<style lang="scss" scoped>
.scope-box {
  width: 415px;
  height: 400px;
  background: #ffffff;
  // box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 20px;
}
.search-input {
  width: 275px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #d6d8df;
}
.btn {
  height: 36px;
  border-radius: 3px;
  margin-left: 20px;
}
::v-deep .ant-tree-switcher {
  width: 24px !important;
  height: 24px !important;
  transition: 0.3s;
  transform: rotateZ(-90deg);
}
::v-deep .ant-tree-switcher_open {
  transform: rotateZ(0deg);
}
::v-deep .ant-tabs-tabpane {
  overflow-y: auto;
  height: 288px;
}
</style>
