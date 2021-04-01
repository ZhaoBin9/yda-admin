<template>
  <div ref="parent">
    <a-modal
      centered
      :width="786"
      :title="modalTitle"
      :visible="visible"
      @cancel="$emit('update:visible', false)"
      :footer="null"
      :getContainer="() => $refs.parent"
    >
      <section v-if="types === 'add' || types === 'edit' || types === 'pass'" style="padding: 0 80px">
        <a-form ref="formRef" :rules="rules" :model="modalVal">
          <div v-if="types === 'pass'">
            <a-form-item label="新密码" name="pass" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-input v-model:value="modalVal.pass" />
            </a-form-item>
            <p class="tips">
              温馨提示：重置密码后请告知员工，以确保其正常登录
            </p>
          </div>

          <div v-else>
            <a-form-item
              label="员工姓名"
              name="staffName"
              :labelCol="{ span: 4, offset: 2 }"
              :wrapperCol="{ span: 14 }"
            >
              <a-input :maxlength="10" v-model:value="modalVal.staffName" />
            </a-form-item>
            <a-form-item label="账号" name="account" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-input :maxlength="30" v-model:value="modalVal.account" />
            </a-form-item>
            <p class="tips">默认密码123456，如果该用户已存在其他企业，使用原密码</p>
            <a-form-item label="角色" name="role" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-select v-model:value="modalVal.role" mode="multiple" placeholder="选择角色">
                <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item name="department" label="部门" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-cascader
                changeOnSelect
                v-model:value="modalVal.department"
                :options="organizationalList"
                placeholder="选择部门"
              />
            </a-form-item>
          </div>
        </a-form>
      </section>
      <section style="margin-left: 130px" v-else-if="types === 'lbw-import'">
        <a-input class="search-input" placeholder="请输入您要查找的姓名或手机号" v-model:value.lazy="state.lbwVal">
          <template #prefix>
            <img src="@/assets/svg/search.svg" />
          </template>
        </a-input>
        <div style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px; max-height: 400px; overflow-y: scroll;">
          <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
          <a-checkbox-group v-model:value="check.checkedList" :options="state.lbwList" @change="onChange" />
        </div>
      </section>
      <section v-else>
        <a-form-item label="下载模板" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <a>点此下载批量导入Excel模版文件</a>
        </a-form-item>
        <a-form-item label="上传附件" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <delay-upload v-model:fileList="state.fileList" :action="state.action" :tips="false" ref="uploadRef" />
        </a-form-item>
        <p class="tips">批量导入说明：</p>
        <br />
        <p class="tips">1.请下载模板，使用Excel等软件按模板的格式进行填写。不得删除、修改excel列顺序</p>
        <p class="tips">2.密码长度为6-16个字符</p>
      </section>
      <div class="action-box">
        <a-button class="btn close" @click="$emit('update:visible', false)">取消</a-button>
        <a-button class="btn comfirm" :loading="loading" @click="comfirmAdd">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, computed, watch, onMounted } from 'vue'
import DelayUpload from '@/components/Upload/delayUpload'
import { getLbwList } from '@/apis/businessManage'
export default defineComponent({
  components: {
    DelayUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    types: {
      type: String,
      default: ''
    },
    current: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    reRender: {
      type: Object,
      default: () => {}
    },
    organizationalList: {
      type: Array,
      default: () => []
    },
    roleList: {
      type: Array,
      default: () => []
    },
    isBindLbw: {
      type: Number,
      default: 0
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const uploadRef = ref()
    const titleObj = {
      pass: '重置密码',
      'lbw-import': '篱笆墙导入',
      import: '批量导入',
      add: '添加员工',
      edit: '修改员工信息'
    }
    const state = reactive({
      fileList: [],
      lbwList: [],
      lbwVal: undefined
    })
    const searchLwbList = computed(() => state.lbwList.filter(item => item.includes(state.lbwVal)))

    const modalTitle = computed(() => titleObj[props.types])
    const formRef = ref()
    const modalVal = reactive({
      staffName: undefined,
      account: undefined,
      role: undefined,
      department: undefined,
      pass: undefined
    })
    const rules = ref()
    rules.value = {
      staffName: [
        {
          required: true,
          message: '请输入员工'
        }
      ],
      account: [
        {
          required: true,
          message: '请输入账号'
        }
      ],
      department: [
        {
          type: 'array',
          required: true,
          message: '请输入部门'
        }
      ],
      pass: [
        {
          required: true,
          message: '请输入新密码'
        }
      ]
    }
    const getLbwData = async () => {
      const res = await getLbwList()
      state.lbwList = res.data.map((item, index) => ({ ...item, value: index, label: item.name }))
    }
    const comfirmAdd = () => {
      emit('update:loading', true)
      if (props.types === 'add' || props.types === 'pass' || props.types === 'edit') {
        formRef.value
          .validate()
          .then(() => {
            emit('modalSubmit', modalVal)
          })
          .catch(() => emit('update:loading', false))
      } else if (props.types === 'import') {
        const isSuccess = uploadRef.value.validateFile()
        if (!isSuccess) {
          emit('update:loading', false)
          return
        }
        emit('modalSubmit', state.fileList[0])
      } else {
        const userList = check.checkedList.map(item => {
          const it = state.lbwList[item]
          it.libawallId = it.userId
          delete it.label
          delete it.value
          delete it.userId
          return it
        })
        emit('modalSubmit', userList)
      }
    }

    const check = reactive({
      indeterminate: false,
      checkedList: [],
      checkAll: false
    })
    const onCheckAllChange = e => {
      check.indeterminate = e.target.checked
      check.checkedList = e.target.checked ? state.lbwList.map((item, index) => index) : []
      check.checkAll = e.target.checked
    }
    const onChange = checkedList => {
      check.checkAll = checkedList.length === state.lbwList.length
    }
    watch(
      () => props.reRender,
      newVisble => {
        if (!newVisble) return
        const typeObjFn = {
          add() {
            modalVal.staffName = undefined
            modalVal.account = undefined
            modalVal.role = undefined
            modalVal.department = undefined
          },
          edit() {
            modalVal.staffName = props.current.name
            modalVal.account = props.current.mobile
            modalVal.role = props.current.role
            modalVal.department = props.current.department
          },
          pass() {
            modalVal.pass = undefined
          },
          import() {
            state.fileList = []
          },
          'lbw-import'() {
            check.indeterminate = false
            check.checkedList = []
            check.checkAll = false
          }
        }
        typeObjFn[props.types] && typeObjFn[props.types]()
      }
    )
    onMounted(() => {
      props.isBindLbw && getLbwData()
    })

    return {
      comfirmAdd,
      formRef,
      modalVal,
      rules,
      modalTitle,
      onCheckAllChange,
      onChange,
      check,
      uploadRef,
      state,
      searchLwbList
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
    // height: 36px;
    border-radius: 4px;
    line-height: 36px;
  }
}
</style>
