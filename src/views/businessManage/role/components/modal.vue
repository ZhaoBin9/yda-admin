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
      <a-form ref="formRef" :rules="rules" :model="modalVal">
        <div>
          <a-form-item label="角色名称" name="roleName" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-input :maxlength="20" placeholder="请输入角色名称" v-model:value="modalVal.roleName" />
          </a-form-item>
          <a-form-item label="角色说明" name="mark" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-textarea
              v-model:value="modalVal.mark"
              placeholder="请输入角色说明"
              :maxlength="30"
              :autoSize="{ minRows: 5 }"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="菜单权限" name="power" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-tree
              v-model:checkedKeys="modalVal.power"
              checkable
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selected-keys="selectedKeys"
              :tree-data="permissionList"
              @expand="onExpand"
              @check="onCheck"
            >
              <template #switcherIcon>
                <span
                  class="tree-arrow"
                  style=" width: 7px; background: transparent; height: 7px;
                  transform: rotateZ(225deg); 
                  border-left: 1px solid #333333;
                  border-top: 1px solid #333333;"
                ></span>
              </template>
            </a-tree>
          </a-form-item>
        </div>
      </a-form>

      <div class="action-box">
        <a-button class="btn close" @click="handleCancel">取消</a-button>
        <a-button class="btn comfirm" @click="comfirmAdd" :loading="loading">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, toRaw, watch, computed } from 'vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    permissionList: {
      type: Array,
      default: () => []
    },
    current: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'add'
    },
    reRender: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { emit } = ctx
    const formRef = ref()
    const titleObj = {
      add: '添加角色',
      edit: '修改角色'
    }
    const modalTitle = computed(() => titleObj[props.type])
    const modalVal = reactive({
      roleName: undefined,
      mark: undefined,
      power: [48, 49, 50, 51, 52, 53]
    })
    const state = reactive({
      expandedKeys: [],
      autoExpandParent: false,
      selectedKeys: []
    })
    const rules = ref()
    rules.value = {
      roleName: [
        {
          required: true,
          message: '请输入角色名称'
        }
      ],
      power: [
        {
          type: 'array',
          required: true,
          message: '请输入权限'
        }
      ]
    }
    const comfirmAdd = () => {
      emit('update:loading', true)
      formRef.value
        .validate()
        .then(() => {
          emit('modelSubmit', toRaw(modalVal))
        })
        .catch(() => emit('update:loading', false))
    }
    const onExpand = expandedKeys => {
      state.expandedKeys = expandedKeys
      state.autoExpandParent = false
    }
    const handleCancel = () => {
      formRef.value.resetFields()
      emit('update:visible', false)
    }
    const onCheck = checkedKeys => {
      modalVal.power = checkedKeys
    }

    watch(
      () => props.reRender,
      () => {
        if (props.type === 'add') {
          modalVal.roleName = undefined
          modalVal.mark = undefined
          modalVal.power = [48, 49, 50, 51, 52, 53]
        } else if (props.type === 'edit') {
          modalVal.roleName = props.current.name
          modalVal.mark = props.current.roleExplain
          modalVal.power = props.current.selected.map(item => item.permissionsId)
        }
        state.expandedKeys = []
        state.autoExpandParent = false
        state.selectedKeys = []
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
      modalTitle,
      handleCancel
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
::v-deep .ant-tree-switcher {
  position: absolute;
  left: 115px;
  top: 0;
  transition: 0.3s;
}
::v-deep .ant-tree-switcher_open {
  transform: rotateX(180deg);
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
