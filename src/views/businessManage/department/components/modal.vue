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
    >
      <a-form ref="formRef" v-if="isAdd" :rules="rules" :model="formData">
        <a-form-item label="部门名称" name="department" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <a-input :maxlength="30" placeholder="请输入部门名称" v-model:value="formData.department" />
        </a-form-item>
        <a-form-item label="上级部门" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <a-cascader
            changeOnSelect
            v-model:value="formData.nextDepart"
            :options="realPermissionList"
            placeholder="请选择上级部门"
            :disabled="state.departDisabled"
            showSearch
          />
        </a-form-item>
      </a-form>
      <section v-else>
        <a-form-item label="下载模板" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <a @click="downLoadExample">点此下载批量导入Excel模版文件</a>
        </a-form-item>
        <a-form-item label="上传模板" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <delay-upload
            uploadText="仅支持xls,xlsx格式的文档，单个文件大小不能超过10M"
            v-model:fileList="state.fileList"
            :callback="getFile"
            ref="uploadRef"
          />
        </a-form-item>
      </section>
      <div class="action-box">
        <a-button class="btn close" @click="handleCancel">取消</a-button>
        <a-button class="btn comfirm" @click="comfirmAdd" :loading="loading">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRaw, watch } from 'vue'
import DelayUpload from '@/components/Upload/delayUpload'
import { cmsNotice } from '@/utils/utils'

export default defineComponent({
  components: {
    DelayUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    permissionList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'add'
    },
    current: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    let currentLevelId = ref()
    const formRef = ref()
    const uploadRef = ref()
    let fileRef = ref()
    const { emit } = ctx
    const modalTitle = computed(() => {
      const titleObj = {
        add: '添加部门',
        edit: '修改部门',
        export: '批量导入部门'
      }
      return titleObj[props.type]
    })
    const state = reactive({
      fileList: [],
      count: 1,
      file: null,
      size: 50,
      departDisabled: false
    })
    const realPermissionList = computed(() => {
      let newArray = props.permissionList.slice()
      function deleteDeepLevel(arr, num, disabled = false) {
        arr.forEach(item => {
          num--
          if (item.children) {
            num <= 0 ? deleteDeepLevel(item.children, num, true) : deleteDeepLevel(item.children, num)
          }

          item.disabled = disabled
          if (item.value === currentLevelId.value) {
            item.disabled = true
          }
          num++
        })
      }
      deleteDeepLevel(newArray, 2)
      return newArray
    })
    const formData = reactive({
      department: undefined,
      nextDepart: undefined
    })
    const rules = {
      department: [
        {
          required: true,
          message: '请输入部门名称'
        }
      ]
    }
    const seekParentId = (level, parentId, id) => {
      if (level === 1) {
        let isHasChildDepart = false
        props.permissionList.find(item => {
          if (item.value === id && item.children) {
            let sign = false
            item.children.forEach(it => {
              if (it.children) {
                isHasChildDepart = true
                state.departDisabled = true
                sign = true
              }
            })
            return sign
          }
          return false
        })
        return isHasChildDepart ? true : []
      }
      if (level === 2) return [parentId]
      let parentList = []
      props.permissionList.forEach(item => {
        if (item.children) {
          item.children.forEach(it => {
            if (parentId.length === 1) return false
            if (it.value === parentId) {
              return parentList.push(it.parentId)
            }
          })
        }
      })
      parentList.push(parentId)
      return parentList
    }

    const handleCancel = () => {
      formRef.value?.resetFields && formRef.value.resetFields()
      emit('update:visible', false)
    }
    const downLoadExample = () => {
      cmsNotice('success', '正在为您下载，请耐心等待...')
      window.location = 'https://ydatestapi.libawall.com/excel/importDepartmentTemplet.xls'
    }
    watch(
      () => props.visible,
      newVisible => {
        if (!newVisible) return
        state.departDisabled = false
        if (props.type === 'add') {
          formData.department = undefined
          formData.nextDepart = []
          currentLevelId.value = undefined
        } else if (props.type === 'edit') {
          formData.department = props.current.departmentName
          currentLevelId.value = props.current.id
          const depart = seekParentId(props.current.level, props.current.parentId, props.current.id)
          formData.nextDepart = Array.isArray(depart) ? depart : []
        } else if (props.type === 'export') {
          state.fileList = []
        }
      }
    )
    const comfirmAdd = () => {
      emit('update:loading', true)
      if (props.isAdd) {
        formRef.value
          .validate()
          .then(() => {
            emit('modalSubmit', toRaw(formData))
          })
          .catch(() => emit('update:loading', false))
      } else {
        const isSuccess = uploadRef.value.validateFile()
        if (!isSuccess) {
          emit('update:loading', false)
          return
        }
        emit('modalSubmit', fileRef.value)
      }
    }
    const getFile = file => {
      fileRef.value = file
    }

    return {
      formData,
      modalTitle,
      state,
      formRef,
      fileRef,
      rules,
      comfirmAdd,
      realPermissionList,
      uploadRef,
      downLoadExample,
      handleCancel,
      getFile
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
::v-deep .ant-modal-title {
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 25px;
  text-indent: 24px;
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
.tips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  width: 340px;
  margin-top: 8px;
}
</style>
