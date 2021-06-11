import { reactive, toRaw } from 'vue'
import { cmsNotice } from './utils'

export const useCheckStateAndEvent = (enhancerMap = {}) => {
  const check = reactive({
    // 这里是选择审批人的数据
    indeterminate: false,
    checkedList: [],
    checkedMap: {},
    checkAll: false,
    searchLbwList: [], // 展示的审批人
    totalSearchList: [], // 全部的审批人，做个备份
    searchLbwVal: undefined,
    staffList: []
  })
  const onCheckAllChange = e => {
    // 审批人全选回调
    check.indeterminate = check.checkAll = e.target.checked
    if (e.target.checked) {
      check.checkedList = toRaw(check.searchLbwList).map(item => {
        check.checkedMap[item.value] = true
        return item.value
      })
    } else {
      check.checkedList = []
      check.checkedMap = {}
    }
    enhancerMap.onCheckAllChange && enhancerMap.onCheckAllChange()
  }
  const onChange = e => {
    // 审批人单个选择的回调
    const target = e.target
    check.checkedMap[target.value] = target.checked
    check.checkedList = []
    for (const key in check.checkedMap) {
      check.checkedMap[key] && check.checkedList.push(~~key)
    }
    check.checkAll = check.checkedList.length === check.searchLbwList.length
  }
  const reloadSearchLbwList = () => {
    // 重置选择审批人的列表
    const approvalStaff = toRaw(check.staffList)
    if (approvalStaff.length) {
      const approvalMap = {}
      approvalStaff.forEach(item => {
        approvalMap[item.id] = item
      })
      check.searchLbwList = check.totalSearchList.filter(item => {
        return !approvalMap[item.id]
      })
    } else {
      check.searchLbwList = check.totalSearchList.map(item => item)
    }
  }
  const selectApprovalFn = () => {
    // 选择审批人，确定的回调
    if (!check.checkedList.length) {
      cmsNotice('error', '请选择审批人')
      return
    }
    enhancerMap.selectApprovalFn && enhancerMap.selectApprovalFn()
    const approvalMap = {}
    check.searchLbwList.forEach(item => {
      approvalMap[item.id] = item
    })
    check.staffList = [...check.staffList, ...check.checkedList.map(item => approvalMap[item])].map((item, index) => {
      item.index = index
      return item
    })
    enhancerMap.changeStaffList && enhancerMap.changeStaffList()
    check.indeterminate = false
    check.checkedList = []
    check.checkAll = false
    check.searchLbwVal = undefined
    reloadSearchLbwList()
  }

  const deleteApprovalFn = index => {
    // 删除选择的审批人
    const approvalMap = {}
    check.searchLbwList.forEach(item => {
      approvalMap[item.id] = item
    })
    check.staffList.splice(index, 1)
    check.staffList = [...check.staffList, ...check.checkedList.map(item => approvalMap[item])].map((item, index) => {
      item.index = index
      return item
    })
    enhancerMap.changeStaffList && enhancerMap.changeStaffList()
    enhancerMap.deleteApprovalFn && enhancerMap.deleteApprovalFn()
    reloadSearchLbwList()
  }
  const searchApprovalList = () => {
    // 查找审批人
    reloadSearchLbwList()
    if (check.searchLbwVal) {
      check.searchLbwList = check.searchLbwList.filter(item => item.name.includes(check.searchLbwVal))
    }
    check.checkedMap = {}
    check.searchLbwList.forEach(item => {
      check.checkedMap[item.value] = false
    })
    check.checkedList = []
    check.checkAll = check.indeterminate = false
    enhancerMap.searchApprovalList && enhancerMap.searchApprovalList()
  }

  const openApprovalModal = () => {
    enhancerMap.openApprovalModal && enhancerMap.openApprovalModal()
    check.checkedMap = {}
    check.searchLbwList.forEach(item => {
      check.checkedMap[item.value] = false
    })
  }

  return {
    check,
    onChange,
    onCheckAllChange,
    reloadSearchLbwList,
    selectApprovalFn,
    searchApprovalList,
    deleteApprovalFn,
    openApprovalModal
  }
}
