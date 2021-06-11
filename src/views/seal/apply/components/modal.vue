<template>
  <div class="parent" ref="parent">
    <a-modal
      centered
      :width="786"
      title="添加申请"
      :visible="modalVisible"
      @cancel="handleCancel"
      :footer="null"
      :getContainer="() => $refs.parent"
    >
      <a-form ref="formRef" :rules="rulesRef" :model="modelRef">
        <a-form-item label="文件名称" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" name="fileName">
          <a-input placeholder="请输入文件名称" :maxlength="30" v-model:value="modelRef.fileName" />
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item
              v-for="(item, index) of modelRef.applyList"
              :key="item.key"
              :label="'申请印章' + (index === 0 ? '' : index + 1)"
              :labelCol="{ span: 6, offset: 6 }"
              :wrapperCol="{ span: 12 }"
              :name="['applyList', index, 'value']"
              :rules="{
                type: 'number',
                required: true,
                message: `请选择印章名称`
              }"
            >
              <a-select placeholder="请选择申请印章" @focus="focusSelectChange(index)" v-model:value="item.value">
                <a-select-option
                  v-for="item in filterSealSelectList"
                  :disabled="item.disabled"
                  :key="item.sealId"
                  :value="item.sealId"
                  >{{ item.sealName }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              v-for="(item, index) of modelRef.countList"
              :key="item.key"
              :label="'申请次数'"
              :labelCol="{ span: 8, offset: 2 }"
              :wrapperCol="{ span: 10 }"
              :name="['countList', index, 'value']"
              :rules="[
                {
                  required: true,
                  message: `请输入印章次数`
                },
                {
                  pattern: /^[0-9]*$/,
                  message: '请输入数字'
                },
                {
                  validator: validatorSealApplyCount,
                  trigger: 'change'
                }
              ]"
              :class="{ removeType: index !== 0 }"
            >
              <a-input :maxlength="3" style="width: 117px" v-model:value="item.value" placeholder="请输入申请次数" />
              <svg class="remove-arrow" @click="removeSealType(index)">
                <use xlink:href="#iconshanchu"></use>
              </svg>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button class="add-type-btn" @click.prevent="addSealType">
          <span style="font-weight: 800; font-size: 20px; transform: translateY(-1px);">+</span>
          添加
        </a-button>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" label="用印类型" name="type">
          <a-radio-group v-model:value="modelRef.type">
            <a-radio :style="radioStyle" :value="1">单次用印</a-radio>
            <span class="radio-label">适用于一般用印场景</span>
            <br />
            <a-radio :style="radioStyle" :value="2">连续用印</a-radio>
            <span class="radio-label">适用于短时间盖大量文件的用印场景</span>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="审批流程" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" name="flowId">
          <a-select placeholder="请选择审批流程" v-model:value="modelRef.flowId" @change="handleProcessChange">
            <a-select-option v-for="item in processTypeList" :key="item.flowId" :value="item.flowId">{{
              item.flowName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="审批人"
          :labelCol="{ span: 4, offset: 2 }"
          :wrapperCol="{ span: 14, offset: 1 }"
          name="staffList"
        >
          <div style="height: 17px"></div>
          <a-timeline>
            <virtual-list
              :list="approvalStaffList"
              noHeight
              :size="103"
              :remain="8"
              :isScrollTop="isVirtualListScroll2"
            >
              <template #default="{item}">
                <approval-list-item :item="item" />
              </template>
            </virtual-list>
            <virtual-list
              :list="modelRef.staffList"
              noHeight
              :size="103"
              :remain="8"
              :isScrollTop="isVirtualListScroll2"
            >
              <template #default="{item}">
                <approval-list-item
                  :item="item"
                  :isRemove="true"
                  :deleteApprovalFn="index => deleteApprovalFn(index, modelRef.staffList)"
                />
              </template>
            </virtual-list>

            <a-timeline-item color="red" key="ss" v-if="!approvalStaffList.length">
              <template #dot>
                <div class="time-progess">{{ modelRef.staffList.length + 1 }}</div>
              </template>
              <a-button class="add-btn" @click="openApprovalModal">
                +
              </a-button>
            </a-timeline-item>
          </a-timeline>
        </a-form-item>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" label="申请事由">
          <a-textarea
            :autoSize="{ minRows: 5 }"
            v-model:value="modelRef.applyText"
            placeholder="请输入申请事由"
            :maxlength="50"
          />
        </a-form-item>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" label="上传文件" v-if="modalVisible">
          <lineupload
            :fileList="modelRef.documentApplyFile"
            :count="10"
            :action="action"
            :size="10"
            @fileChange="handleThumbUploadChange"
            :fileType="['xls', 'xlsx', 'jpg', 'png', 'tif', 'jpeg', 'bmp', 'pdf', 'word', 'webp', 'docx', 'doc', 'txt']"
          />
        </a-form-item>
        <a-button @click.prevent="handleCancel" class="cancel btn">取消</a-button>
        <a-button @click="onSubmit" class="primary btn" type="primary" :loading="loading">确定</a-button>
      </a-form>
    </a-modal>
    <a-modal
      centered
      title="选择审批人"
      @cancel="approvalVisible = false"
      @ok="selectApprovalFn"
      :visible="approvalVisible"
      :getContainer="() => $refs.parent"
    >
      <section style="margin-bottom: 10px" v-if="check.totalSearchList.length - modelRef.staffList.length">
        <a-input class="search-input" style="width: 250px" v-model:value="check.searchLbwVal">
          <template #prefix> <img src="@/assets/svg/search.svg" /> </template>
        </a-input>
        <a-button type="primary" class="btn search-btn" @click="check.searchApprovalList">查找</a-button>
      </section>
      <div style=" padding-left: 20px; padding-bottom: 20px;  overflow-y: scroll;" v-show="check.searchLbwList.length">
        <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
          全选
        </a-checkbox>
        <a-checkbox-group :value="check.checkedList">
          <virtual-list
            :list="check.searchLbwList"
            :size="52"
            :remain="10"
            :visible="approvalVisible"
            :isScrollTop="isVirtualListScroll"
          >
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
import { defineComponent, reactive, toRefs, ref, onMounted, computed, watch } from 'vue'
import lineupload from '@/components/Upload/lineUpload'
import { getProcessSealList, getFingerProcessStaff, getProcessStaffList } from '@/apis/businessManage'
import VirtualList from '@/components/VirtualList'
import ApprovalStaffItem from '@/components/VirtualList/approvalStaffItem'
import ApprovalListItem from '@/components/VirtualList/approvalListItem'
const action = process.env.VUE_APP_API_BASE_URL + '/file/upload'
import { useCheckStateAndEvent } from '@/utils/hooks'

export default defineComponent({
  components: {
    lineupload,
    VirtualList,
    ApprovalStaffItem,
    ApprovalListItem
  },
  props: {
    modalVisible: {
      type: Boolean,
      default: false
    },
    processTypeList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const formRef = ref()
    const state = reactive({
      applyTypeList: [], // 选择过的印章
      uploadThumbCount: 9,
      applyTypeIndex: 0, // 选择印章的索引
      approvalStaffList: [], // 固定流程返回的审批人列表
      approvalVisible: false,
      action: action,
      isVirtualListScroll: 0,
      isVirtualListScroll2: 0
    })
    const modelRef = reactive({
      // form表单的数据
      fileName: '',
      applyList: [{ key: 0, value: undefined }],
      countList: [{ key: 0, value: undefined }],
      type: 1,
      flowId: undefined,
      applyText: undefined,
      documentApplyFile: [],
      staffList: []
    })
    const rulesRef = reactive({
      fileName: [
        {
          required: true,
          message: '请输入文件名'
        },
        {
          pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/,
          message: '名称只能为中英文、数字、下划线组成'
        }
      ],
      type: [
        {
          type: 'number',
          required: true,
          message: '请选择用印类型'
        }
      ],
      flowId: [
        {
          type: 'number',
          required: true,
          message: '请选择审批流程'
        }
      ]
    })
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
        modelRef.staffList = check.staffList.map(item => item)
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

    const validatorSealApplyCount = (rule, value) => {
      if (value === '0' || value === '00' || value === '000') {
        return Promise.reject('申请次数最小为1')
      }
      return Promise.resolve()
    }
    const getSealList = async () => {
      // 获取可使用的印章
      const res = await getProcessSealList()
      state.applyTypeList = res.data
    }
    const getProcessStaff = async () => {
      // 获取自由流程的审批人
      const res = await getProcessStaffList()
      check.searchLbwList = res.data.map((item, index) => ({ ...item, label: item.name, value: item.id, index }))
      check.totalSearchList = res.data.map((item, index) => ({ ...item, label: item.name, value: item.id, index }))
    }
    const onSubmit = () => {
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(() => {
          const params = {
            ...modelRef,
            sealShowDTO: []
          }
          modelRef.applyList.forEach((item, index) => {
            const it = {
              sealId: item.value,
              applicationNumber: ~~modelRef.countList[index].value
            }
            params.sealShowDTO.push(it)
          })
          if (modelRef.staffList.length) {
            params.documentViceUserAddDTOS = modelRef.staffList.map(item => ({ userId: item.id }))
          }
          delete params.staffList
          delete params.countList
          delete params.applyList
          !params.documentApplyFile.length && delete params.documentApplyFile
          emit('modalSubmit', params)
        })
        .catch(() => emit('update:loading', false))
    }
    const addSealType = () => {
      // 添加使用印章及次数的函数
      modelRef.applyList.push({ key: modelRef.applyList.length, value: undefined })
      modelRef.countList.push({ key: modelRef.countList.length, value: undefined })
    }
    const removeSealType = index => {
      // 删除使用印章及次数的函数
      modelRef.applyList.splice(index, 1)
      modelRef.countList.splice(index, 1)
    }

    const handleThumbUploadChange = (type, res) => {
      // 上传附件成功后的赋值
      modelRef.documentApplyFile = res.map(item => ({ fileId: item.response.data[0].id }))
    }
    const handleProcessChange = async val => {
      // 流程选择函数
      const res = await getFingerProcessStaff({ id: val })
      formRef.value.clearValidate('staffList')
      state.approvalStaffList = res.data.map((item, index) => {
        item.index = index
        return item
      })
      modelRef.staffList = []
      check.indeterminate = false
      check.checkedList = []
      check.checkAll = false
      if (res.data.length === 0) {
        rulesRef.staffList = [{ type: 'array', required: true, message: '请选择审批人' }]
      } else {
        rulesRef.staffList = []
      }
      reloadSearchLbwList(modelRef.staffList)
      typeof state.isVirtualListScroll2 === 'number' ? state.isVirtualListScroll2++ : (state.isVirtualListScroll2 = 0)
    }
    const handleCancel = () => {
      formRef.value.resetFields()
      emit('update:modalVisible', false)
    }

    const filterSealSelectList = computed(() => {
      // 印章选择后，在其他中其他的要置灰
      const filterList = modelRef.applyList.filter((item, index) => (item ? index !== state.applyTypeIndex : false))
      const newApplyList = state.applyTypeList.map(item => ({ ...item }))
      filterList.forEach(item => {
        let isDisabled = true
        let num = 0
        while (isDisabled && newApplyList.length) {
          if (num === newApplyList.length - 1) isDisabled = false
          if (newApplyList[num].sealId === item.value) {
            isDisabled = false
            newApplyList[num].disabled = true
          }
          num++
        }
      })
      return newApplyList
    })

    const focusSelectChange = index => {
      // 印章获取焦点
      state.applyTypeIndex = index
    }

    watch(
      () => props.modalVisible,
      newVisible => {
        if (newVisible) {
          modelRef.flowId = props.processTypeList[props.processTypeList.length - 1].flowId
          handleProcessChange(props.processTypeList[props.processTypeList.length - 1].flowId)
          modelRef.fileName = ''
          modelRef.applyList = [{ key: 0, value: undefined }]
          modelRef.countList = [{ key: 0, value: undefined }]
          modelRef.type = 1
          modelRef.applyText = undefined
          modelRef.documentApplyFile = []
          modelRef.staffList = []
          state.searchLbwVal = undefined
          reloadSearchLbwList()
        }
      }
    )

    onMounted(() => {
      getSealList()
      getProcessStaff()
    })

    return {
      ...toRefs(state),
      modelRef,
      formRef,
      rulesRef,
      validatorSealApplyCount,
      onSubmit,
      addSealType,
      removeSealType,
      handleThumbUploadChange,
      filterSealSelectList,
      focusSelectChange,
      handleProcessChange,
      check,
      onCheckAllChange,
      onChange,
      selectApprovalFn,
      deleteApprovalFn,
      handleCancel,
      searchApprovalList,
      openApprovalModal
    }
  }
})
</script>

<style lang="scss" scoped>
.remove-arrow {
  display: none;
}
.removeType {
  position: relative;
  .remove-arrow {
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    right: -28px;
    top: 1px;
    cursor: pointer;
  }
}
.add-type-btn {
  width: 487px;
  height: 36px;
  opacity: 1;
  background: #ffffff;
  border: 1px dashed #c3161c;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #c3161c;
  line-height: 36px;
  margin: 0 auto;
  display: block;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  > span {
    display: block;
  }
}
::v-deep .ant-radio-wrapper {
  margin: 10px 0;
  > span {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 20px;
  }
}
.radio-label {
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  line-height: 20px;
  display: inline-block;
  margin-left: 14px;
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
  margin-bottom: 10px;
  transform: translateY(-8px);
  display: flex;
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .remove-arrow {
    width: 20px;
    height: 20px;
    // margin-top: 7px;
    transform: translateY(23px);
    cursor: pointer;
    display: block;
  }
  .time-info {
    .time-avatar {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: cover;
      margin: 0 auto;
    }
  }
  .time-name {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    // line-height: 32px;
    transform: translateY(5px);
    width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
::v-deep .ant-timeline-item-tail {
  border-left: 2px solid #c3161c;
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
.cancel {
  border: 1px solid #dadada;
  margin-left: 260px;
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
</style>
