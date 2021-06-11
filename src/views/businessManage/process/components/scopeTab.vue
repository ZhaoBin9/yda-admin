<template>
  <section class="scope-box">
    <section v-show="activeKey === 'staff'">
      <a-input class="search-input" style="width: 250px" v-model:value="check.searchLbwVal">
        <template #prefix> <img src="@/assets/svg/search.svg" /> </template>
      </a-input>
      <a-button type="primary" class="btn" @click="searchStaffList">查找</a-button>
    </section>
    <div style="height: 15px"></div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="staff" tab="员工">
        <div style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px" v-show="check.searchLbwList.length">
          <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
          <a-checkbox-group :value="check.checkedList">
            <virtual-list :list="check.searchLbwList" :size="52" :remain="4" :isScrollTop="isVirtualListScroll">
              <template #default="{item}">
                <approval-staff-item :item="item" :onChange="onChange" />
              </template>
            </virtual-list>
          </a-checkbox-group>
        </div>
        <div v-show="check.searchLbwList.length === 0" style="line-height: 200px; text-indent: 150px">
          暂无数据
        </div>
      </a-tab-pane>
      <a-tab-pane key="department" tab="部门">
        <!-- <a-tree
          v-if="organizationalList.length"
          class="draggable-tree"
          checkable
          :checkedKeys="department"
          :tree-data="organizationalList"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @expand="onExpand"
          @check="onCheck"
        >
          <template #switcherIcon>
            <img src="@/assets/svg/depart-tree-arrow.svg" />
          </template>
        </a-tree> -->
        <tree-virtual-list
          v-if="organizationalList.length"
          @onCheck="onCheck"
          :size="32"
          :remain="8"
          :list="organizationalList"
          :isShow="2"
          :department="department"
        />
        <div v-else style="line-height: 200px; text-indent: 150px">
          暂无数据
        </div>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script>
import { defineComponent, reactive, toRaw, toRefs, watch } from 'vue'
import VirtualList from '@/components/VirtualList'
import ApprovalStaffItem from '@/components/VirtualList/approvalStaffItem'
import { useCheckStateAndEvent } from '@/utils/hooks'
import TreeVirtualList from '@/components/VirtualList/treeVirtualList'

export default defineComponent({
  name: 'scope-tab',
  components: {
    VirtualList,
    ApprovalStaffItem,
    TreeVirtualList
  },
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
    types: {
      type: String,
      default: 'add'
    },
    organizationalList: {
      type: Array,
      default: () => []
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const state = reactive({
      activeKey: 'staff',
      department: [],
      departMap: new Map(),
      autoExpandParent: false,
      expandedKeys: [],
      departmentSearchList: [],
      isVirtualListScroll: 0
    })

    const enhancerMapFn = {
      onCheckAllChange() {
        emit('update:departmentVal', { ...props.departmentVal, staff: toRaw(check.checkedList) })
        emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
      },
      onChange() {
        emit('update:departmentVal', { ...props.departmentVal, staff: check.checkedList })
        emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
      }
    }
    const { check, onChange, onCheckAllChange } = useCheckStateAndEvent(enhancerMapFn)

    const onExpand = expandedKeys => {
      state.expandedKeys = expandedKeys
      state.autoExpandParent = false
    }
    const onCheck = department => {
      state.department = department
      emit('update:departmentVal', { ...props.departmentVal, department })
      emit('update:department', !check.checkedList.length && !department.length ? undefined : '已选择')
    }
    const searchStaffList = () => {
      check.searchLbwList = check.searchLbwVal
        ? props.searchLbwList.filter(item => item.name.includes(check.searchLbwVal))
        : props.searchLbwList
      check.checkedMap = {}
      props.searchLbwList.forEach(item => {
        check.checkedMap[item.value] = false
      })
      check.checkedList = []
      check.checkAll = check.indeterminate = false
      typeof state.isVirtualListScroll === 'number' ? state.isVirtualListScroll++ : (state.isVirtualListScroll = 0)
    }

    watch(
      () => props.organizationalList.length,
      () => {
        state.departMap.clear()
        function deepIteration(array) {
          array.forEach(item => {
            if (item.children && item.children.length) {
              deepIteration(item.children)
            }
            state.departMap.set(item.key, false)
          })
        }

        deepIteration(props.organizationalList)
      },
      { immediate: true }
    )

    watch(
      () => props.searchLbwList.length,
      () => {
        check.searchLbwList = props.searchLbwList.map(item => {
          check.checkedMap[item.id] = false
          return item
        })
      },
      { immediate: true }
    )

    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) return
        state.activeKey = 'staff'
        state.expandedKeys = ['sss']
        state.autoExpandParent = false
        check.searchVal = undefined
        check.checkedMap = {}
        if (props.types === 'add') {
          state.department = []
          check.checkAll = false
          check.indeterminate = false
          check.checkedList = []
        } else if (props.types === 'edit') {
          state.department = props.departmentVal.department.length ? [...props.departmentVal.department] : []
          check.checkedList = props.departmentVal.staff.map(item => {
            check.checkedMap[item] = true
            return item
          })
          check.checkAll = props.departmentVal.staff.length === check.searchLbwList.length
          check.indeterminate = check.checkAll
          emit('update:department', !check.checkedList.length && !state.department.length ? undefined : '已选择')
        }
        typeof state.isVirtualListScroll === 'number' ? state.isVirtualListScroll++ : (state.isVirtualListScroll = 0)
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
