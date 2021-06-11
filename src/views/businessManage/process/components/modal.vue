<template>
  <div ref="parent">
    <a-modal
      centered
      :width="786"
      :title="modalTitle"
      :visible="visible"
      @cancel="handleCancel"
      :footer="null"
      :getContainer="() => $refs.parent"
      :maskClosable="false"
    >
      <a-form ref="formRef" :rules="rules" :model="modalVal">
        <div>
          <a-form-item
            label="流程名称"
            name="processName"
            :labelCol="{ span: 4, offset: 2 }"
            :wrapperCol="{ span: 14 }"
          >
            <a-input :maxlength="30" v-model:value="modalVal.processName" placeholder="请输入流程名称" />
          </a-form-item>
          <a-form-item label="业务类型" name="business" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-radio-group v-model:value="modalVal.business">
              <a-radio :value="1">
                用印审批
              </a-radio>
              <a-radio :value="2">
                归档审批
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="适用范围" name="department" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-select
              :value="modalVal.department"
              placeholder="请选择部门或员工（默认全部部门）"
              :open="isSelectopen"
              @focus="selectScopeFocus"
              @blur="selectScopeBlur"
              @click="selectScopeClick"
              :getPopupContainer="e => e.parentNode"
            >
              <template #dropdownRender>
                <scope-tab
                  :searchLbwList="check.totalSearchList"
                  :organizationalList="organizationalList"
                  v-model:departmentVal="modalVal.departmentVal"
                  v-model:department="modalVal.department"
                  @click="clickSelectTab"
                  :visible="scopeVisible"
                  :types="types"
                />
              </template>
            </a-select>
          </a-form-item>
          <a-form-item label="流程类型" name="process" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-radio-group v-model:value="modalVal.process">
              <a-radio :value="1">
                固定流程
              </a-radio>
              <a-radio :value="2">
                自由流程
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="modalVal.process === 1"
            label="审批流程"
            name="staffList"
            :labelCol="{ span: 4, offset: 2 }"
            :wrapperCol="{ span: 14 }"
          >
            <div style="height: 20px"></div>
            <a-timeline>
              <virtual-list
                :list="modalVal.staffList"
                noHeight
                :size="103"
                :remain="8"
                :isScrollTop="isVirtualListScroll2"
              >
                <template #default="{item}">
                  <approval-list-item :item="item" :isRemove="true" :deleteApprovalFn="deleteApprovalFn" />
                </template>
              </virtual-list>
              <a-timeline-item color="red" key="ss">
                <template #dot>
                  <div class="time-progess">{{ modalVal.staffList.length + 1 }}</div>
                </template>
                <a-button class="add-btn" @click="openApprovalModal">
                  +
                </a-button>
              </a-timeline-item>
            </a-timeline>
          </a-form-item>
          <section v-else class="free-tips">
            <p class="title">
              <svg>
                <use xlink:href="#iconWaring"></use></svg
              >温馨提示
            </p>
            <p class="text">
              自由流程允许员工在提交用印申请时自行选择审批人，请知晓此流程可能带来的风险，并规定好适用范围。
            </p>
          </section>
        </div>
      </a-form>

      <div class="action-box">
        <a-button class="btn close" @click="handleCancel">取消</a-button>
        <a-button class="btn comfirm" @click="comfirmAdd" :loading="loading">确定</a-button>
      </div>
    </a-modal>
    <a-modal
      centered
      title="选择审批人"
      @cancel="approvalVisible = false"
      @ok="selectApprovalFn"
      :visible="approvalVisible"
      :getContainer="() => $refs.parent"
    >
      <section style="margin-bottom: 10px" v-if="check.totalSearchList.length - modalVal.staffList.length">
        <a-input class="search-input" style="width: 250px" v-model:value="check.searchLbwVal">
          <template #prefix> <img src="@/assets/svg/search.svg" /> </template>
        </a-input>
        <a-button type="primary" class="btn search-btn" @click="searchApprovalList">查找</a-button>
      </section>
      <div style=" padding-left: 20px; padding-bottom: 20px; overflow-y: scroll;" v-show="check.searchLbwList.length">
        <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
          全选
        </a-checkbox>
        <a-checkbox-group :value="check.checkedList">
          <virtual-list :list="check.searchLbwList" :size="52" :remain="10" :isScrollTop="isVirtualListScroll">
            <template #default="{item}">
              <approval-staff-item :item="item" :onChange="onChange" />
            </template>
          </virtual-list>
        </a-checkbox-group>
      </div>
      <div style="line-height: 200px; text-align: center;" v-show="!check.searchLbwList.length">
        暂无审批人
      </div>
    </a-modal>
  </div>
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, toRaw, toRefs, watch } from 'vue'
import ScopeTab from './scopeTab'
import { getProcessStaffList, validateProcessName, getDepartmentOrganizational } from '@/apis/businessManage'
import VirtualList from '@/components/VirtualList'
import ApprovalStaffItem from '@/components/VirtualList/approvalStaffItem'
import ApprovalListItem from '@/components/VirtualList/approvalListItem'
import { useCheckStateAndEvent } from '@/utils/hooks'

export default defineComponent({
  components: {
    ScopeTab,
    VirtualList,
    ApprovalStaffItem,
    ApprovalListItem
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    loading: {
      type: Boolean,
      default: false
    },
    types: {
      type: String,
      default: 'add'
    },
    current: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const modalTitle = computed(() => (props.types === 'add' ? '添加流程' : '修改流程'))
    const formRef = ref()

    const modalVal = reactive({
      processName: undefined,
      business: 1, // 业务类型
      process: 1, // 流程类型
      department: undefined, // 适用范围
      departmentVal: {
        // 适用范围的选择值
        staff: [],
        department: []
      },
      staffList: []
    })
    const approvalFormRef = ref()
    const approvalModel = reactive({
      approvalName: undefined
    })
    const approvalRules = {
      approvalName: [
        {
          type: 'number',
          required: true,
          message: '请选择审批人'
        }
      ]
    }
    const state = reactive({
      expandedKeys: [],
      autoExpandParent: false,
      selectedKeys: [],
      approvalVisible: false,
      isSelectopen: false, // 是否打开流程范围的下拉框
      isFocus: true, // 是否流程范围获取焦点
      isClickTab: true, // 是否点的时流程范围的下拉框上
      scopeVisible: props.visible, // 流程范围下拉框的数据刷新的作用
      organizationalList: [],
      isAllFlowScope: false,
      searchLbwVal: undefined,
      isVirtualListScroll: 0,
      isVirtualListScroll2: 0
    })
    const rules = ref()
    rules.value = {
      processName: [
        {
          required: true,
          message: '请输入流程名称'
        }
      ],
      business: [
        {
          type: 'number',
          required: true,
          message: '请选择业务类型'
        }
      ],
      process: [
        {
          type: 'number',
          required: true,
          message: '请选择流程类型'
        }
      ],
      staffList: [
        {
          type: 'array',
          required: true,
          message: '请选择审批流程'
        }
      ]
    }
    const validateProcessNameFn = async () => {
      // 校验流程名字是否重复
      if (props.types === 'edit') {
        return { success: true }
      }
      const res = await validateProcessName({ flowName: modalVal.processName })
      return res
    }

    const enhancerMapFn = {
      selectApprovalFn() {
        state.approvalVisible = false
        setTimeout(() => {
          formRef.value.clearValidate('staffList')
          state.isVirtualListScroll2 += '1'
        })
      },
      deleteApprovalFn() {
        state.isVirtualListScroll2 = {}
      },
      searchApprovalList() {
        typeof state.isVirtualListScroll === 'number' ? state.isVirtualListScroll++ : (state.isVirtualListScroll = 0)
      },
      openApprovalModal() {
        state.approvalVisible = true
        setTimeout(() => {
          typeof state.isVirtualListScroll === 'number' ? state.isVirtualListScroll++ : (state.isVirtualListScroll = 0)
        })
      },
      changeStaffList() {
        modalVal.staffList = check.staffList.map(item => item)
      }
    }
    const {
      check,
      onChange,
      onCheckAllChange,
      reloadSearchLbwList,
      selectApprovalFn,
      searchApprovalList,
      deleteApprovalFn,
      openApprovalModal
    } = useCheckStateAndEvent(enhancerMapFn)

    const comfirmAdd = () => {
      // 提交函数
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(async () => {
          const params = toRaw(modalVal)
          const res = await validateProcessNameFn()
          if (!res.success) {
            emit('update:loading', false)
            // emit('update:visible', false)
            return
          }
          params.flowName = params.processName
          params.flowType = params.process
          params.businessType = params.business
          if (params.process === 1) {
            params.flowUserRelsDTO = params.staffList.map(item => ({ userId: item.id || item.userId }))
          }
          if (props.types === 'edit') {
            // 修改流程 判断流程范围
            if (
              state.isAllFlowScope &&
              params.departmentVal.department.includes('sss') &&
              !params.departmentVal.staff.length
            ) {
              params.flowScope = 1
            } else {
              iterationProcessRange(params)
            }
          } else {
            if (!params.departmentVal.staff.length && !params.departmentVal.department.length) {
              params.flowScope = 1
            } else {
              iterationProcessRange(params)
            }
          }

          delete params.processName
          delete params.process
          delete params.business
          delete params.department
          delete params.departmentVal
          delete params.staffList

          emit('modalSubmit', params)
        })
        .catch(() => emit('update:loading', false))

      function iterationProcessRange(params) {
        // 处理 选择流程范围把值提取出来的函数
        params.flowScope = 2
        params.flowScopeDTO = []
        params.departmentVal.department.length &&
          (params.departmentVal.department = params.departmentVal.department.filter(item => typeof item === 'number'))
        params.departmentVal.staff.length > params.departmentVal.department.length
          ? params.departmentVal.staff.forEach(
              (item, index) =>
                (params.flowScopeDTO[index] = {
                  userId: item,
                  departmentId: params.departmentVal.department[index]
                })
            )
          : params.departmentVal.department.forEach(
              (item, index) =>
                (params.flowScopeDTO[index] = { departmentId: item, userId: params.departmentVal.staff[index] })
            )
        !params.flowScopeDTO.length ? (params.flowScope = 1) : null
      }
    }
    const getProcessStaff = async () => {
      // 获取流程的审批人
      const res = await getProcessStaffList()
      check.searchLbwList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
      check.totalSearchList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
    }
    const getOrganizationalList = async () => {
      // 获取流程范围中部门列表的函数
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
      state.organizationalList = permissionList.length ? permissionList : []
    }
    const onExpand = expandedKeys => {
      // 部门列表的父级展开
      state.expandedKeys = expandedKeys
      state.autoExpandParent = false
    }
    const onCheck = checkedKeys => {
      // 部门列表的选择回调
      modalVal.power = checkedKeys
    }
    const selectScopeFocus = () => {
      // 处理流程范围获取焦点函数
      state.isSelectopen = true
      state.isClickTab = true
      setTimeout(() => {
        state.isFocus = false
        state.isClickTab = false
      }, 100)
    }
    const selectScopeBlur = () => {
      // 处理流程范围失去焦点函数
      setTimeout(() => {
        state.isFocus = true
      }, 20)
    }
    const selectScopeClick = () => {
      // 处理流程范围下拉框的点击
      !state.isFocus && (state.isSelectopen = !state.isSelectopen)
      state.isClickTab = true
      setTimeout(() => {
        state.isClickTab = false
      }, 80)
    }
    const clickSelectTab = () => {
      // 处理流程范围下拉框的点击
      state.isClickTab = true
      state.isFocus = true
      setTimeout(() => {
        state.isClickTab = false
      }, 100)
    }
    const clickNoTab = () => {
      // 处理点击非流程范围下拉框区域
      if (!state.isClickTab) {
        state.isSelectopen = false
        state.isClickTab = true
      }
    }

    const handleCancel = () => {
      // 取消流程弹窗
      formRef.value.resetFields()
      emit('update:visible', false)
    }
    const filterSelectProcessRange = (processType, processRangeVal) => {
      // 处理下修改时流程，赋值流程范围
      modalVal.departmentVal = {
        staff: [],
        department: []
      }
      if (processType === 2) {
        processRangeVal.forEach(item => {
          item.userId && modalVal.departmentVal.staff.push(item.userId)
          item.departmentId && modalVal.departmentVal.department.push(item.departmentId)
        })
      } else {
        modalVal.departmentVal.department.push('sss')
        state.isAllFlowScope = true
      }
    }

    onMounted(() => {
      document.body.addEventListener('click', clickNoTab, false)
      getProcessStaff()
      getOrganizationalList()
    })

    onBeforeUnmount(() => {
      document.body.removeEventListener('click', clickNoTab)
    })

    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) {
          state.scopeVisible = newVisible
          return
        }
        state.isAllFlowScope = false
        if (props.types === 'add') {
          modalVal.processName = undefined
          modalVal.business = 1
          modalVal.process = 1
          modalVal.department = undefined
          modalVal.departmentVal = {
            staff: [],
            department: []
          }
          modalVal.staffList = []
          state.expandedKeys = []
          state.autoExpandParent = false
          state.searchLbwList = state.totalSearchList
        } else if (props.types === 'edit') {
          modalVal.processName = props.current.flowName
          modalVal.business = props.current.businessType
          modalVal.process = props.current.flowType
          modalVal.department = '已选择'
          filterSelectProcessRange(props.current.flowScope, props.current.flowScopeVO)
          modalVal.staffList =
            props.current.flowUserRelsVO && props.current.flowUserRelsVO.length
              ? props.current.flowUserRelsVO.map(item => (item.id = item.userId) && item)
              : []
          state.expandedKeys = []
          state.autoExpandParent = false
          reloadSearchLbwList()
        }
        check.checkedList = []
        check.checkAll = false
        check.indeterminate = false
        state.scopeVisible = newVisible
        state.searchLbwVal = undefined
        typeof state.isVirtualListScroll2 === 'number' ? state.isVirtualListScroll2++ : (state.isVirtualListScroll2 = 0)
      }
    )

    return {
      comfirmAdd,
      formRef,
      modalVal,
      rules,
      modalTitle,
      onExpand,
      ...toRefs(state),
      onCheck,
      approvalFormRef,
      approvalModel,
      approvalRules,
      selectScopeFocus,
      selectScopeClick,
      selectScopeBlur,
      clickSelectTab,
      selectApprovalFn,
      onCheckAllChange,
      onChange,
      check,
      deleteApprovalFn,
      handleCancel,
      searchApprovalList,
      openApprovalModal
    }
  }
})
</script>

<style lang="scss" scoped>
.action-box {
  margin: 40px 0 30px;
  display: flex;
  justify-content: center;
  .btn {
    width: 100px;
    height: 38px;
    opacity: 1;
    background: #ffffff;
    border-radius: 5px;
    margin-right: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 38px;
  }
  .close {
    color: #999;
    border: 1px solid #dadada;
    &:hover {
      color: #999;
      border-color: #dadada;
    }
  }
  .comfirm {
    background: #c3161c;
    color: #fff;
    border: 1px solid transparent;
    margin-right: 0;
    &:hover {
      border-color: transparent;
    }
  }
}
.approval-img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  transform: translateY(10px);
  margin-right: 4px;
}
.approval-name {
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  display: inline-block;
  line-height: 32px;
}
.tips {
  height: 17px;
  opacity: 1;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: justify;
  color: #999999;
  line-height: 17px;
  margin-left: 142px;
  transform: translateY(-15px);
}
.search-input {
  width: 470px;
  height: 36px;
  opacity: 1;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}
::v-deep .ant-checkbox-wrapper {
  display: block;
}
.action-box {
  margin: 40px 0 30px;
  display: flex;
  justify-content: center;
  .btn {
    width: 100px;
    height: 38px;
    opacity: 1;
    background: #ffffff;
    border-radius: 5px;
    margin-right: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    line-height: 38px;
  }
  .close {
    color: #999;
    border: 1px solid #dadada;
    &:hover {
      color: #999;
      border-color: #dadada;
    }
  }
  .comfirm {
    background: #c3161c;
    color: #fff;
    border: 1px solid transparent;
    margin-right: 0;
    &:hover {
      border-color: transparent;
    }
  }
}
.tips {
  width: 400px;
  opacity: 1;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: justify;
  color: #999999;
  line-height: 17px;
}
::v-deep .ant-timeline {
  margin-left: 10px;
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
}
.time-progess {
  min-width: 20px;
  height: 20px;
  background: #c3161c;
  border-radius: 50%;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
}
.time-sec {
  padding-left: 24px;
  margin-top: 5px;
  margin-bottom: 10px;
  transform: translateY(-1px);
  display: flex;
  position: relative;
  .remove-arrow {
    width: 20px;
    height: 20px;
    margin-top: 7px;
    cursor: pointer;
  }
  .time-avatar {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 4px;
    margin: 0 auto;
  }
  .time-name {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    // text-align: center;
    color: #999999;
    // line-height: 32px;
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
::v-deep .ant-modal-title {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 25px;
  text-indent: 24px;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px dotted #c3161c;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
  padding: 0;
  color: #c3161c;
  font-weight: 600;
  margin-left: 22px;
  transform: translateY(-4px);
}
.btn {
  width: 100px;
  height: 38px;
  opacity: 1;
  border-radius: 5px;
  margin-left: 20px;
  margin-top: 40px;
  margin-bottom: 20px;
  line-height: 38px;
}
.search-btn {
  margin-top: 0;
}
.free-tips {
  margin-top: 20px;
  padding-left: 185px;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 16px;
    margin-bottom: 10px;
    text-indent: -22px;
    svg {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      transform: translateY(15px);
    }
  }
  .text {
    width: 393px;
    height: 40px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
}

::v-deep .ant-select {
  .ant-select-selection-item-remove {
    display: none;
  }
}
</style>
