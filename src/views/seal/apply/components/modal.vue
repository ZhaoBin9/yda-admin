<template>
  <div class="parent" ref="parent">
    <a-modal
      centered
      :width="786"
      title="提交申请"
      :visible="modalVisible"
      @cancel="$emit('update:modalVisible', false)"
      :footer="null"
      :getContainer="() => $refs.parent"
    >
      <a-form ref="formRef" :rules="rulesRef" :model="modelRef">
        <a-form-item
          label="文件名称"
          placeholder="请输入文件名称"
          :labelCol="{ span: 4, offset: 2 }"
          :wrapperCol="{ span: 14 }"
          name="file"
        >
          <a-input :maxlength="30" v-model:value="modelRef.file" />
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
                message: `请选择印章类型${index === 0 ? '' : index + 1}`
              }"
            >
              <a-select placeholder="请选择印章类型" @focus="focusSelectChange(index)" v-model:value="item.value">
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
              :label="'申请次数' + (index === 0 ? '' : index + 1)"
              :labelCol="{ span: 8, offset: 2 }"
              :wrapperCol="{ span: 10 }"
              :name="['countList', index, 'value']"
              :rules="[
                {
                  required: true,
                  message: `请选择印章次数${index === 0 ? '' : index + 1}`
                },
                {
                  pattern: /^[0-9]*$/,
                  message: '请输入数字'
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
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" label="用章类型" name="types">
          <a-radio-group v-model:value="modelRef.types">
            <a-radio :style="radioStyle" :value="1">单次用章</a-radio>
            <span class="radio-label">每一次用印都会回收</span>
            <br />
            <a-radio :style="radioStyle" :value="2">连续用章</a-radio>
            <span class="radio-label">适用于短时间盖大量文件的用印场景</span>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="申请流程" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" name="process">
          <a-select placeholder="请选择审批类型" v-model:value="modelRef.process" @change="handleProcessChange">
            <a-select-option v-for="item in processTypeList" :key="item.flowId" :value="item.flowId">{{
              item.flowName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="addApprovalStaff"
          label="审批人"
          :labelCol="{ span: 4, offset: 2 }"
          :wrapperCol="{ span: 14, offset: 1 }"
        >
          <div style="height: 17px"></div>
          <a-timeline>
            <a-timeline-item v-for="(item, index) in approvalStaffList" :key="item.userId" color="red">
              <template #dot>
                <div class="time-progess">{{ index + 1 }}</div>
              </template>
              <section class="time-sec">
                <p class="time-name">{{ item.name }}</p>
              </section>
            </a-timeline-item>
            <a-timeline-item color="red" v-for="(item, index) in approvalStaff" :key="item.id">
              <template #dot>
                <div class="time-progess">{{ index + 1 }}</div>
              </template>
              <section class="time-sec">
                <p class="time-name">{{ item.name || item.userName }}</p>
              </section>
            </a-timeline-item>
            <a-timeline-item color="red" key="ss" v-if="!approvalStaffList.length">
              <template #dot>
                <div class="time-progess">{{ approvalStaff.length + 1 }}</div>
              </template>
              <a-button class="add-btn" @click="approvalVisible = true">
                +
              </a-button>
            </a-timeline-item>
          </a-timeline>
        </a-form-item>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" label="申请事由">
          <a-textarea :autosize="{ minRows: 5 }" v-model:value="modelRef.mark" :maxlength="50" />
        </a-form-item>
        <a-form-item :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }" label="上传附件">
          <lineupload
            :fileList="modelRef.fileList"
            :count="10"
            :action="action"
            @fileChange="handleThumbUploadChange"
            :fileType="['xls', 'xlsx', 'jpg', 'png', 'tif', 'jpeg', 'bmp', 'pdf', 'word']"
          />
        </a-form-item>
        <a-button @click.prevent="$emit('update:modalVisible', false)" class="cancel btn">取消</a-button>
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
      <div
        style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px; max-height: 500px; overflow-y: scroll;"
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
import { defineComponent, reactive, toRefs, ref, onMounted, computed, toRaw } from 'vue'
import lineupload from '@/components/Upload/lineUpload'
import { getProcessSealList, getFingerProcessStaff, getProcessStaffList } from '@/apis/businessManage'
const action = process.env.VUE_APP_API_BASE_URL + '/file/upload'
export default defineComponent({
  components: {
    lineupload
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
      validate: undefined,
      validateInfos: undefined,
      applyTypeList: [],
      actionUrl: 'sdjkskdj',
      uploadThumbCount: 9,
      applyTypeIndex: 0,
      approvalStaffList: [],
      addApprovalStaff: false,
      searchLbwList: [],
      approvalVisible: false,
      approvalStaff: [],
      action: action
    })
    const modelRef = reactive({
      file: '',
      applyList: [{ key: 0, value: '' }],
      countList: [{ key: 0, value: '' }],
      types: undefined,
      process: undefined,
      mark: undefined,
      fileList: []
    })
    const rulesRef = reactive({
      file: [
        {
          required: true,
          message: '请输入文件名'
        }
      ],
      types: [
        {
          type: 'number',
          required: true,
          message: '请选择用章类型'
        }
      ],
      process: [
        {
          type: 'number',
          required: true,
          message: '请选择流程类型'
        }
      ]
    })
    const getSealList = async () => {
      const res = await getProcessSealList()
      state.applyTypeList = res.data
    }
    const getProcessStaff = async () => {
      const res = await getProcessStaffList()
      state.searchLbwList = res.data.map(item => ({ ...item, label: item.name, value: item.id }))
    }

    const onSubmit = () => {
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(() => {
          const params = {
            fileName: modelRef.file,
            type: modelRef.types,
            flowId: modelRef.process,
            applyText: modelRef.mark,
            documentApplyFile: modelRef.fileList,
            sealShowDTO: []
          }
          modelRef.applyList.forEach((item, index) => {
            const it = {
              sealId: item.value,
              applicationNumber: ~~modelRef.countList[index].value
            }
            params.sealShowDTO.push(it)
          })
          if (state.approvalStaff.length) {
            params.documentViceUserAddDTOS = state.approvalStaff.map(item => ({ userId: item.id }))
          }
          !params.documentApplyFile.length && delete params.documentApplyFile
          emit('modalSubmit', params)
        })
        .catch(() => emit('update:loading', false))
    }
    const addSealType = () => {
      modelRef.applyList.push({ key: modelRef.applyList.length, value: '' })
      modelRef.countList.push({ key: modelRef.countList.length, value: '' })
    }
    const removeSealType = index => {
      modelRef.applyList.splice(index, 1)
      modelRef.countList.splice(index, 1)
    }

    const handleThumbUploadChange = (type, res) => {
      if (type === 'add') {
        modelRef.fileList = res.map(item => ({ fileId: item.response.data[0].fileImageDTO.id }))
      } else {
        modelRef.fileList = res.map(item => ({ fileId: item.response.data[0].fileImageDTO.id }))
      }
    }
    const handleProcessChange = async val => {
      const res = await getFingerProcessStaff({ id: val })
      !state.addApprovalStaff ? (state.addApprovalStaff = true) : false
      state.approvalStaffList = res.data
      state.approvalStaff = []
      check.indeterminate = false
      check.checkedList = []
      check.checkAll = false
    }

    const filterSealSelectList = computed(() => {
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
      state.applyTypeIndex = index
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
      state.approvalStaff = toRaw(check.checkedList).map(item => state.searchLbwList.find(it => it.id === item))
    }

    onMounted(() => {
      getSealList()
      getProcessStaff()
    })

    return {
      ...toRefs(state),
      modelRef,
      formRef,
      rulesRef,
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
      selectApprovalFn
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
  margin-bottom: 30px;
  transform: translateY(-8px);
  .time-figure {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-bottom: 2px;
    display: block;
  }
  .time-name {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 32px;
    transform: translateY(5px);
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
.ant-checkbox-group {
  display: flex;
  flex-direction: column;
}
</style>
