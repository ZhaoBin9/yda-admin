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
      <section v-if="types === 'add' || types === 'edit' || types === 'pass'" style="padding: 0 80px">
        <a-form ref="formRef" :rules="rules" :model="modalVal">
          <div v-if="types === 'pass'">
            <a-form-item label="新密码" name="pass" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-input placeholder="请输入新密码" v-model:value="modalVal.pass" />
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
              <a-input :maxlength="30" placeholder="请输入员工姓名" v-model:value="modalVal.staffName" />
            </a-form-item>
            <a-form-item label="账号" name="account" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-input
                v-if="types === 'edit'"
                disabled="true"
                :maxlength="30"
                placeholder="请输入员工手机号用于登录账号"
                v-model:value="modalVal.account"
              />
              <a-input
                v-else
                :maxlength="30"
                placeholder="请输入员工手机号用于登录账号"
                v-model:value="modalVal.account"
              />
            </a-form-item>
            <p class="tips">默认密码123456，如果该用户已存在其他企业，使用原密码</p>
            <a-form-item label="角色" name="role" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
              <a-select v-model:value="modalVal.role" :mode="multiple" placeholder="请选择角色">
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
                placeholder="请选择部门"
                :getPopupContainer="node => node.parentNode"
                showSearch
              />
            </a-form-item>
          </div>
        </a-form>
      </section>
      <section style="margin-left: 130px" v-else-if="types === 'lbw-import'">
        <section style="margin-bottom: 10px" v-if="state.lbwList.length">
          <a-input class="search-input" style="width: 250px" v-model:value="check.searchLbwVal">
            <template #prefix> <img src="@/assets/svg/search.svg" /> </template>
          </a-input>
          <a-button type="primary" class="btn search-btn" @click="searchLbwList">查找</a-button>
        </section>
        <div
          style=" padding-left: 20px; padding-bottom: 20px;  overflow-y: scroll;"
          v-show="check.searchLbwList.length"
        >
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
          暂无导入人
        </div>
        <!-- <a-input
          class="search-input"
          :maxlength="20"
          placeholder="请输入您要查找的姓名或手机号"
          v-model:value="state.lbwVal"
        >
          <template #prefix>
            <img src="@/assets/svg/search.svg" />
          </template>
        </a-input>
        <a-button class="search-btn" @click="searchLwbList">查询</a-button>
        <div style="margin-top: 30px; padding-left: 20px; padding-bottom: 20px; max-height: 400px; overflow-y: scroll;">
          <a-checkbox :indeterminate="check.indeterminate" :checked="check.checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
          <a-checkbox-group v-model:value="check.checkedList" :options="state.searchList" @change="onChange" />
        </div> -->
      </section>
      <section v-else>
        <a-form-item label="下载模板" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <a @click="downLoadExample">点此下载批量导入Excel模版文件</a>
        </a-form-item>
        <a-form-item label="上传附件" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
          <delay-upload
            v-model:fileList="state.fileList"
            :callback="getFile"
            :action="state.action"
            :tips="false"
            ref="uploadRef"
          />
        </a-form-item>
        <p class="tips">批量导入说明：</p>
        <br />
        <p class="tips">1.请下载模板，使用Excel等软件按模板的格式进行填写。不得删除、修改excel列顺序</p>
      </section>
      <div class="action-box">
        <a-button class="btn close" @click="handleCancel">取消</a-button>
        <a-button class="btn comfirm" :loading="loading" @click="comfirmAdd">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, computed, watch, onMounted } from 'vue'
import DelayUpload from '@/components/Upload/delayUpload'
import { getLbwList } from '@/apis/businessManage'
import { cmsNotice } from '@/utils/utils'
import VirtualList from '@/components/VirtualList'
import ApprovalStaffItem from '@/components/VirtualList/approvalStaffItem'
import { useCheckStateAndEvent } from '@/utils/hooks'

export default defineComponent({
  components: {
    DelayUpload,
    VirtualList,
    ApprovalStaffItem
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
      lbwList: []
    })
    let fileRef = ref()
    const searchLbwList = () => {
      if (!check.searchLbwVal) {
        check.searchLbwList = check.lbwList.map(item => item)
        return
      }
      const searchNameList = state.lbwList.filter(item => item.name.includes(state.searchLbwVal))
      const searchPhoneList = state.lbwList.filter(item => item.mobile.includes(state.searchLbwVal))
      const filterList = Array.from(new Set([...searchNameList, ...searchPhoneList]))
      check.searchLbwList = filterList
    }

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
          message: '请输入员工姓名'
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
          message: '请选择部门'
        }
      ],
      pass: [
        {
          required: true,
          message: '请输入新密码'
        }
      ]
    }
    const { check, onChange, onCheckAllChange } = useCheckStateAndEvent()
    const getLbwData = async () => {
      const res = await getLbwList()
      state.lbwList = res.success
        ? res.data.map(item => ({
            ...item,
            value: item.userId,
            label: item.name + `（${item.mobile}）`
          }))
        : []
      check.searchLbwList = state.lbwList.map(item => item)
    }
    const downLoadExample = () => {
      cmsNotice('success', '正在为您下载，请耐心等待...')
      window.location.href = 'https://ydatestapi.libawall.com/excel/importPersonTemplet.xls'
    }
    const getFile = file => {
      fileRef.value = file
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
        emit('modalSubmit', fileRef.value)
      } else {
        check.searchLbwList.forEach(item => {
          check.checkedMap[item.value] = item
        })
        const userList = check.checkedList.map(item => {
          const it = check.checkedMap[item]
          it.libawallId = it.userId
          delete it.userId
          return it
        })
        if (!check.checkedList.length) {
          cmsNotice('error', '请选择导入人员')
          emit('update:loading', false)
          return
        }
        emit('modalSubmit', userList)
        setTimeout(() => {
          getLbwData()
        }, 200)
      }
    }

    const handleCancel = () => {
      ;(props.types === 'add' || props.types === 'edit' || props.types === 'pass') && formRef.value.resetFields()
      emit('update:visible', false)
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
            state.lbwVal = undefined
            check.searchLbwList = state.lbwList.map(item => item)
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
      searchLbwList,
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
.search-btn {
  height: 36px;
  margin-left: 10px;
  border-radius: 4px;
  transform: translateY(2px);
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
  line-height: 30px;
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
