<template>
  <div ref="parent">
    <a-modal
      centered
      :width="786"
      title="添加流程"
      :visible="visible"
      @cancel="$emit('update:visible', false), (isSelectopen = false)"
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
            <a-input :maxlength="10" v-model:value="modalVal.processName" placeholder="请输入流程名称" />
          </a-form-item>
          <a-form-item label="业务类型" name="business" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-radio-group v-model:value="modalVal.business">
              <a-radio :value="1">
                归档审批
              </a-radio>
              <a-radio :value="2">
                用印审批
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
            >
              <template #dropdownRender>
                <scope-tab
                  :searchLbwList="searchLbwList"
                  v-model:departmentVal="modalVal.departmentVal"
                  v-model:department="modalVal.department"
                  @click="clickSelectTab"
                  :visible="scopeVisible"
                  :type="type"
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
            name="approvalStaff"
            :labelCol="{ span: 4, offset: 2 }"
            :wrapperCol="{ span: 14 }"
          >
            <div style="height: 20px"></div>
            <a-timeline>
              <a-timeline-item color="red" v-for="(item, index) in modalVal.approvalStaff" :key="item.id">
                <template #dot>
                  <div class="time-progess">{{ index + 1 }}</div>
                </template>
                <section class="time-sec">
                  <p class="time-name">{{ item.name || item.userName }}</p>
                </section>
              </a-timeline-item>
              <a-timeline-item color="red" key="ss">
                <template #dot>
                  <div class="time-progess">{{ modalVal.approvalStaff.length + 1 }}</div>
                </template>
                <a-button class="add-btn" @click="approvalVisible = true">
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
        <a-button class="btn close" @click="$emit('update:visible', false)">取消</a-button>
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
      <div
        style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px; max-height: 400px; overflow-y: scroll;"
        v-show="searchLbwList.length"
      >
        <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
          全选
        </a-checkbox>
        <a-checkbox-group v-model:value="check.checkedList" :options="searchLbwList" @change="onChange" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, toRaw, toRefs, watch } from 'vue'
import ScopeTab from './scopeTab'
import { getProcessStaffList } from '@/apis/businessManage'

export default defineComponent({
  components: {
    ScopeTab
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
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
    const formRef = ref()
    const modalVal = reactive({
      processName: undefined,
      business: 1,
      process: 1,
      department: undefined,
      departmentVal: {
        staff: [],
        department: []
      },
      approvalStaff: []
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
      isSelectopen: false,
      isFocus: true,
      isClickTab: true,
      searchLbwList: [],
      scopeVisible: props.visible
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
      approvalStaff: [
        {
          type: 'array',
          required: true,
          message: '请选择审批流程'
        }
      ]
    }
    const comfirmAdd = () => {
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(() => {
          const params = toRaw(modalVal)
          params.flowName = params.processName
          params.flowType = params.process
          params.businessType = params.business
          if (params.process === 1) {
            params.flowUserRelsDTO = params.approvalStaff.map(item => ({ userId: item.id || item.userId }))
          }
          if (!params.departmentVal.staff.length && !params.departmentVal.department.length) {
            params.flowScope = 1
          } else {
            params.flowScope = 2
            params.flowScopeDTO = []
            params.departmentVal.department.length &&
              (params.departmentVal.department = params.departmentVal.department.filter(
                item => typeof item === 'number'
              ))
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
                    (params.flowScopeDTO[index] = { department: item, userId: params.departmentVal.staff[index] })
                )
          }

          delete params.processName
          delete params.process
          delete params.business
          delete params.department
          delete params.departmentVal
          delete params.approvalStaff

          emit('modalSubmit', params)
        })
        .catch(() => emit('update:loading', false))
    }
    const getProcessStaff = async () => {
      const res = await getProcessStaffList()
      state.searchLbwList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
    }
    const onExpand = expandedKeys => {
      state.expandedKeys = expandedKeys
      state.autoExpandParent = false
    }
    const onCheck = checkedKeys => {
      modalVal.power = checkedKeys
    }
    const selectScopeFocus = () => {
      state.isSelectopen = !state.isSelectopen
      state.isClickTab = true
      setTimeout(() => {
        state.isFocus = false
        state.isClickTab = false
      }, 100)
    }
    const selectScopeBlur = () => {
      setTimeout(() => {
        state.isFocus = true
      }, 40)
    }
    const selectScopeClick = () => {
      !state.isFocus && (state.isSelectopen = !state.isSelectopen)
      state.isClickTab = true
      setTimeout(() => {
        state.isClickTab = false
      }, 80)
    }
    const clickSelectTab = () => {
      state.isClickTab = true
      setTimeout(() => {
        state.isClickTab = false
      }, 100)
    }
    const clickNoTab = () => {
      if (!state.isClickTab) {
        state.isSelectopen = false
        state.isClickTab = true
      }
    }

    const check = reactive({
      indeterminate: false,
      checkedList: [],
      checkAll: false
    })
    const onCheckAllChange = e => {
      check.indeterminate = e.target.checked
      check.checkedList = e.target.checked ? toRaw(state.searchLbwList).map(item => item.value) : []
      check.checkAll = e.target.checked
    }
    const onChange = checkedList => {
      check.checkAll = checkedList.length === state.searchLbwList.length
    }
    const selectApprovalFn = () => {
      state.approvalVisible = false
      modalVal.approvalStaff = toRaw(check.checkedList).map(item => state.searchLbwList.find(it => it.id === item))
    }

    onMounted(() => {
      document.body.addEventListener('click', clickNoTab, false)
      getProcessStaff()
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

        if (props.type === 'add') {
          modalVal.processName = undefined
          modalVal.business = 1
          modalVal.process = 1
          modalVal.department = undefined
          modalVal.departmentVal = {
            staff: [],
            department: []
          }
          modalVal.approvalStaff = []
          check.checkedList = []
          check.checkAll = false
          check.indeterminate = false
          state.expandedKeys = []
          state.autoExpandParent = false
        } else if (props.type === 'edit') {
          modalVal.processName = props.current.flowName
          modalVal.business = props.current.businessType
          modalVal.process = props.current.flowType
          modalVal.department = undefined
          modalVal.departmentVal = {
            staff: [],
            department: []
          }
          props.current.flowScopeVO.forEach(item => {
            item.userId && modalVal.departmentVal.staff.push(item.userId)
            item.departmentId && modalVal.departmentVal.department.push(item.departmentId)
          })
          modalVal.approvalStaff = props.current.flowUserRelsVO
          check.checkedList = props.current.flowUserRelsVO.map(item => item.userId)
          check.checkAll = check.checkedList.length === state.searchLbwList.length
          check.indeterminate = check.checkAll
          state.expandedKeys = []
          state.autoExpandParent = false
        }
        state.scopeVisible = newVisible
      }
    )

    return {
      comfirmAdd,
      formRef,
      modalVal,
      rules,
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
      check
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
  width: 20px;
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
  margin-bottom: 25px;
  transform: translateY(-1px);
  display: flex;
  .time-name {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 32px;
    margin: 0 30px 0 0;
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
      transform: translateY(2px);
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
