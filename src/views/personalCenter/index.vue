<template>
  <section class="personal-wrap" ref="parent">
    <header>
      <div class="return-btn">
        <img src="@/assets/images/self-return.png" @click="$router.back()" alt="" />
        个人中心
      </div>
    </header>
    <section class="avatar">
      <img class="img" :src="avatar || require('@/assets/images/login-figure.png')" alt="" />
      <a-upload
        v-model:file-list="fileList"
        name="file"
        withCredentials
        accept="webp,bmp,jpg,png,tif,gif"
        :action="action"
        :headers="{
          authorization: 'authorization-text'
        }"
        :before-upload="beforeUpload"
        @change="editAvatar"
      >
        <span class="edit-text">编辑</span>
      </a-upload>
    </section>
    <section class="info-box">
      <div class="edit-item">
        <span class="label">账号：</span>
        <span class="content">{{ mobile }}</span>
        <img class="edit-icon" src="@/assets/images/edit-icon.png" @click="openModal('account')" />
      </div>
      <div class="edit-item">
        <span class="label">登录密码：</span>
        <span class="content">******</span>
        <img class="edit-icon" src="@/assets/images/edit-icon.png" @click="openModal('password')" />
      </div>
    </section>
  </section>
  <a-modal
    centered
    :width="586"
    :title="modalTitle"
    :visible="visible"
    @cancel="closeEditModal"
    :footer="null"
    :getContainer="() => $refs.parent"
  >
    <section>
      <a-form ref="formRef" :rules="rules" :model="formModel">
        <div v-if="type === 'password'">
          <a-form-item label="原密码" name="oldPassword" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-input v-model:value="formModel.oldPassword" type="password" />
          </a-form-item>
          <a-form-item label="新密码" name="newPassword" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-input v-model:value="formModel.newPassword" type="password" />
          </a-form-item>
          <a-form-item
            label="确认新密码"
            name="againPassword"
            :labelCol="{ span: 4, offset: 2 }"
            :wrapperCol="{ span: 14 }"
          >
            <a-input type="password" v-model:value="formModel.againPassword" />
          </a-form-item>
        </div>
        <div v-else>
          <a-form-item label="当前手机号" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            {{ mobile }}
          </a-form-item>
          <a-form-item label="新手机号" name="account" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-input v-model:value="formModel.account" />
          </a-form-item>
          <a-form-item label="验证码" name="captcha" :labelCol="{ span: 4, offset: 2 }" :wrapperCol="{ span: 14 }">
            <a-input v-model:value="formModel.captcha" :maxlength="6" style="width: 157px;" />
            <a-button :disabled="captchaText !== '获取验证码'" class="get-captcha" @click="getCaptcha">{{
              captchaText
            }}</a-button>
          </a-form-item>
        </div>
      </a-form>
      <a-button class="form-btn" :loading="loading" @click="modalSubmit">提交</a-button>
    </section>
  </a-modal>
</template>

<script>
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { SET_USER_INFO } from '@/store/user/mutations-type'
import { editAccountPassword, editAccount, getAccountCaptcha, editAccountAvatar } from '@/apis/user'
import { cmsNotice } from '@/utils/utils'
const action = process.env.VUE_APP_API_BASE_URL + '/file/upload/one'
export default defineComponent({
  setup() {
    const store = useStore()
    const state = reactive({
      visible: false,
      type: 'account',
      captchaText: '获取验证码',
      loading: false,
      imgLoading: false,
      timer: null,
      fileList: []
    })
    const formRef = ref()
    const formModel = reactive({
      oldPassword: undefined,
      newPassword: undefined,
      againPassword: undefined,
      account: undefined,
      captcha: undefined
    })
    if (!store.state.user.userInfo.userName)
      store.commit(`user/${SET_USER_INFO}`, JSON.parse(localStorage.getItem('yda-admin-userInfo')))
    const mobile = computed(() => store.state.user.userInfo.mobile)
    const avatar = computed(() => store.state.user.userInfo.avatar)
    const modalTitle = computed(() => (state.type === 'account' ? '更换账号' : '修改登录密码'))
    const openModal = type => {
      state.type = type
      state.visible = true
    }
    const againValidator = (rule, value) => {
      if (!value) {
        return Promise.reject('请输入确认密码')
      }
      if (value !== formModel.newPassword) {
        return Promise.reject('确定密码应和新密码一致')
      }

      return Promise.resolve()
    }
    const captchaValidator = (rule, value) => {
      if (~~value === state.captcha) {
        return Promise.resolve()
      }
      return Promise.reject('验证码错误')
    }
    const rules = {
      oldPassword: [{ required: true, message: '请输入原密码' }],
      newPassword: [{ required: true, message: '请输入新密码' }],
      againPassword: [
        { required: true, message: '请输入确认密码' },
        { validator: againValidator, trigger: 'blur' }
      ],
      account: [
        {
          required: true,
          message: '请输入手机号'
        },
        {
          pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
          message: '手机号格式不正确'
        }
      ],
      captcha: [
        { required: true, message: '请输入验证码' },
        {
          pattern: /^[0-9]*$/,
          message: '验证码格式不正确'
        }
      ]
    }

    const getCaptcha = async () => {
      if (!formModel.account) {
        cmsNotice('error', '请输入手机号')
        return
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(formModel.account)) {
        cmsNotice('error', '请输入正确的手机号')
        return
      }
      if (formModel.account === mobile.value) {
        cmsNotice('error', '修改账号不能和原来账号一样')
        state.loading = false
        return
      }
      let num = 60
      state.captchaText = `${num--}s`
      state.timer = setInterval(() => {
        if (num === -1) {
          clearInterval(state.timer)
          state.timer = null
          state.captchaText = '获取验证码'
          state.captcha = '验证码失效，请重新发送'
          return
        }
        state.captchaText = `${num--}s`
      }, 1000)
      const res = await getAccountCaptcha({ phone: formModel.account, code: 'MODIFY_MOBILE' })
      state.captcha = res.data
    }
    const modalSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          state.loading = true
          if (state.type === 'account') {
            if (formModel.account === mobile.value) {
              cmsNotice('error', '修改账号不能和原来账号一样')
              state.loading = false
              return
            }
            if (state.captcha === '验证码失效，请重新发送') {
              cmsNotice('error', state.captcha)
              state.loading = false
              formModel.captcha = undefined
              return
            }
            const res = await editAccount({
              note: formModel.captcha,
              phone: formModel.account
            })
            if (res.success) {
              const userInfo = JSON.parse(localStorage.getItem('yda-admin-userInfo'))
              userInfo.mobile = formModel.account
              localStorage.setItem('yda-admin-userInfo', JSON.stringify(userInfo))
              store.commit(`user/${SET_USER_INFO}`, userInfo)
              cmsNotice('success', '修改成功')
              state.visible = false
              state.timer && clearInterval(state.timer)
              state.captchaText = '获取验证码'
              formModel.account = undefined
            }
            state.loading = false
            formModel.captcha = undefined
          } else {
            if (formModel.newPassword === formModel.oldPassword) {
              cmsNotice('error', '新密码不能和旧密码一样')
              state.loading = false
              return
            }
            const res = await editAccountPassword({
              newPassword: formModel.newPassword,
              oldPassword: formModel.oldPassword
            })
            if (res.success) {
              cmsNotice('success', '修改成功')
              formModel.newPassword = undefined
              formModel.againPassword = undefined
              formModel.oldPassword = undefined
              state.visible = false
            }

            state.loading = false
          }
        })
        .catch(() => {})
    }
    const beforeUpload = file => {
      return new Promise((resolve, reject) => {
        const type = file.name.split('.').pop()
        const fileType = ['webp', 'bmp', 'jpg', 'png', 'tif', 'gif']
        if (!fileType.includes(type)) {
          cmsNotice('error', `请上传${fileType}格式文件`)
          return reject(false)
        }
        return resolve(true)
      })
    }
    const editAvatar = async info => {
      const {
        file: { status, response }
      } = info
      switch (status) {
        case 'uploading':
          break
        case 'done':
          // 处理上传成功
          if (response && response.code === 0) {
            const res = await editAccountAvatar({ avatarId: response.data.id })
            if (res.success) {
              cmsNotice('success', '上传成功')
              const userInfo = JSON.parse(localStorage.getItem('yda-admin-userInfo'))
              userInfo.avatar = response.data.fullUrl
              localStorage.setItem('yda-admin-userInfo', JSON.stringify(userInfo))
              store.commit(`user/${SET_USER_INFO}`, userInfo)
            }
          }
          break
      }
    }
    const closeEditModal = () => {
      state.visible = false
      if (state.type === 'account') {
        formModel.account = undefined
        formModel.captcha = undefined
        if (state.timer) {
          clearInterval(state.timer)
          state.timer = null
          state.captchaText = undefined
          state.captcha = undefined
        }
      } else {
        formModel.oldPassword = undefined
        formModel.newPassword = undefined
        formModel.againPassword = undefined
      }
    }

    return {
      mobile,
      modalTitle,
      ...toRefs(state),
      openModal,
      formRef,
      formModel,
      rules,
      getCaptcha,
      modalSubmit,
      editAvatar,
      action,
      avatar,
      closeEditModal,
      beforeUpload
    }
  }
})
</script>

<style lang="scss" scoped>
.personal-wrap {
  background-color: #f2f3f7;
  height: 100%;
  padding: 40px 40px 46px;
  display: flex;
  flex-direction: column;
  header {
    margin-bottom: 7px;
  }
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    margin-bottom: 34px;
    .img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .edit-text {
      position: absolute;
      left: 0;
      bottom: 0;
      cursor: pointer;
      width: 120px;
      height: 36px;
      background: #000000;
      opacity: 0.3;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 36px;
      text-align: center;
    }
  }
  .info-box {
    flex: 1;
    background: #ffffff;
    padding-top: 100px;
    .edit-item {
      width: 287px;
      margin: 0 auto 24px;
      overflow: hidden;
      height: 20px;
      .label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        display: inline-block;
        width: 90px;
      }
      .content {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
      .edit-icon {
        float: right;
        // width: 17px;
        height: 20px;
        cursor: pointer;
      }
    }
  }
}
.return-btn {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 33px;
  img {
    margin-right: 5px;
    cursor: pointer;
    transform: translateY(3px);
  }
}
.get-captcha {
  width: 120px;
  height: 36px;
  opacity: 1;
  background: #fff5f6;
  border-radius: 3px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #c3161c;
  text-align: left;
  line-height: 36px;
  text-align: center;
  border: none;
  margin-left: 36px;
}
.form-btn {
  width: 100px;
  height: 38px;
  background: #c3161c;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  line-height: 38px;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 205px;
  margin-bottom: 40px;
}
</style>
