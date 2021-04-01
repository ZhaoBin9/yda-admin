<template>
  <section class="login-wrap">
    <section class="login-content">
      <img class="login-figure" src="@/assets/images/login-figure.png" />
      <section class="login-form">
        <img class="form-title" src="@/assets/images/yda-logo.png" alt="" />
        <a-form ref="formRef" :model="formModel" :rules="rules">
          <div class="form-items" v-if="state.isPassLogin">
            <a-input
              v-model:value="state.username"
              :placeholder="state.isPassLogin ? '请输入账号' : '请输入手机号'"
              class="form-input"
            />
            <a-input v-model:value="state.password" placeholder="请输入密码" class="form-input" type="password" />
          </div>
          <div class="form-items" v-else>
            <a-input v-model:value="state.username" placeholder="请输入账号" class="form-input" />
            <a-form-item name="captcha">
              <a-input
                v-model:value="formModel.captcha"
                :maxlength="6"
                placeholder="请输入验证码"
                class="form-input form-captcha"
              />
              <a-button :disabled="state.captchaText !== '获取验证码'" class="get-captcha" @click="getCaptcha">{{
                state.captchaText
              }}</a-button>
            </a-form-item>
          </div>
        </a-form>

        <a-button :disabled="state.logining" class="form-btn" @click="userLogin">{{
          state.logining ? '登录中' : '登录'
        }}</a-button>
        <p @click="switchLoginMode" class="form-switch">{{ state.isPassLogin ? '手机验证码登录' : '账号密码登录' }}</p>
      </section>
    </section>
    <company-modal
      v-model:visible="state.enterpriseVisible"
      :allEnterprise="state.allEnterprise"
      @select-enterprise="selectEnterprise"
    />
  </section>
</template>

<script>
import { reactive, defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { notification } from 'ant-design-vue'
import { passLogin, getAccountCaptcha } from '@/apis/user'
import companyModal from './components/companyModal'
import { useStore } from 'vuex'
import { SET_USER_INFO } from '@/store/user/mutations-type'
import { SET_NAV_MENU } from '@/store/navigation/mutations-type'
import { SET_ROUTER } from '@/store/router/mutations-type'
import asyncRouter from '@/router/async-router'

export default defineComponent({
  name: 'Login',
  components: {
    companyModal
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      username: undefined,
      password: undefined,
      captcha: undefined,
      isPassLogin: true,
      captchaText: '获取验证码',
      allEnterprise: [],
      enterpriseVisible: false,
      userInfo: undefined,
      logining: false,
      redirect: undefined,
      timer: null
    })
    const formRef = ref(null)
    const rules = {
      captcha: [
        {
          pattern: /^[0-9]*$/,
          message: '验证码格式不正确'
        }
      ]
    }
    const formModel = reactive({
      captcha: undefined
    })
    const handleInitFn = () => {
      if (route.fullPath.includes('switch') && localStorage.getItem('yda-admin-userInfo')) {
        !store.state.user.userInfo.userName &&
          store.commit(`user/${SET_USER_INFO}`, JSON.parse(localStorage.getItem('yda-admin-userInfo')))
        state.userInfo = store.state.user.userInfo
        state.allEnterprise = store.state.user.userInfo.allEnterprise
        state.enterpriseVisible = true
      }
      state.redirect = route.query.redirect
    }

    handleInitFn()

    const cmsNotice = (type, contant, duration = 4) => {
      notification[type]({
        message: '提示',
        description: contant,
        duration
      })
    }

    const selectEnterprise = async enterpriseInfo => {
      state.userInfo = {
        ...state.userInfo,
        enterpriseName: enterpriseInfo.name,
        enterpriseId: enterpriseInfo.id
      }
      if (!store.state.user.userInfo.userName) {
        localStorage.setItem('yda-admin-userInfo', JSON.stringify(state.userInfo))
        store.commit(`user/${SET_USER_INFO}`, state.userInfo)
      }
      const { routes, navList } = await asyncRouter()
      store.commit(`nav/${SET_NAV_MENU}`, navList)
      store.commit(`router/${SET_ROUTER}`, [routes])
      router.addRoute(routes)
      cmsNotice('success', '选择成功，即将跳转', 0.5)
      router.push(state.redirect ?? '/dashboard/ayalysis')
    }

    const setUserInfo = async res => {
      state.userInfo = {
        userName: res.userName,
        userId: res.userId,
        sexName: res.sexName,
        avatar: res.avatar,
        allEnterprise: res.result.allEnterprise,
        mobile: res.mobile,
        nickName: res.nickname,
        enterpriseBindLibawall: res.result.enterpriseBindLibawall
      }
      state.timer && clearInterval(state.timer)
      if (res.result.allEnterprise.length <= 1) {
        state.userInfo = {
          ...state.userInfo,
          enterpriseName: res.result.enterpriseName,
          enterpriseId: res.result.enterpriseId
        }
        if (!store.state.user.userInfo.userName) {
          localStorage.setItem('yda-admin-userInfo', JSON.stringify(state.userInfo))
          store.commit(`user/${SET_USER_INFO}`, state.userInfo)
        }
        const { routes, navList } = await asyncRouter()
        store.commit(`nav/${SET_NAV_MENU}`, navList)
        store.commit(`router/${SET_ROUTER}`, [routes])
        router.addRoute(routes)
        cmsNotice('success', '登录成功')
        router.push(state.redirect ?? '/dashboard/ayalysis')
      } else {
        state.allEnterprise = res.result.allEnterprise
        state.enterpriseVisible = true
      }
    }
    const loginFn = () => {
      state.logining = true
      const params = {
        username: state.username,
        json: 1,
        loginType: 3,
        from: 1,
        source: 1,
        encrypt: false
      }
      if (state.isPassLogin) {
        params.password = state.password
      } else {
        params.note = formModel.captcha
        params.loginType = 1
      }
      passLogin(params)
        .then(res => {
          if (res.success) {
            setUserInfo(res.data)
          }
        })
        .finally(() => (state.logining = false))
    }
    const pwdLogin = () => {
      // 密码登录
      if (!state.password) {
        cmsNotice('error', '请输入密码')
        return
      }
      loginFn()
    }

    const captchaLogin = () => {
      // 验证码登录
      if (!formModel.captcha) {
        cmsNotice('error', '请输入验证码')
        return
      }
      if (formModel.captcha.length !== 6) {
        cmsNotice('error', '验证码错误')
        return
      }
      if (state.captcha === '验证码失效，请重新发送') {
        cmsNotice('error', state.captcha)
        return
      }
      loginFn()
    }

    const getCaptcha = async () => {
      if (!state.username) {
        cmsNotice('error', '请输入账号')
        return
      }
      let num = 60
      state.captchaText = `${num--}s`
      state.timer = setInterval(() => {
        if (num === -1) {
          clearInterval(state.timer)
          state.captchaText = '获取验证码'
          state.captcha = '验证码失效，请重新发送'
          return
        }
        state.captchaText = `${num--}s`
      }, 1000)
      const res = await getAccountCaptcha({ phone: state.username, code: 'LOGIN_SEND' })
      state.captcha = res.data
    }

    const userLogin = () => {
      // 登录
      if (!state.username) {
        cmsNotice('error', '请输入账号')
        return
      }
      formRef.value.validate().then(() => {
        state.isPassLogin ? pwdLogin() : captchaLogin()
      })
    }
    const switchLoginMode = () => {
      if (state.isPassLogin) {
        state.username = undefined
        state.password = undefined
        state.isPassLogin = false
        if (state.timer) {
          clearInterval(state.timer)
          state.captchaText = '获取验证码'
        }
      } else {
        state.username = undefined
        state.captcha = undefined
        state.isPassLogin = true
      }
    }
    return {
      state,
      userLogin,
      pwdLogin,
      switchLoginMode,
      getCaptcha,
      selectEnterprise,
      formRef,
      rules,
      formModel
    }
  }
})
</script>

<style lang="scss" scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../assets/images/login-bg.png') 50% no-repeat;
  background-size: cover;
  .login-content {
    width: 1400px;
    height: 800px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #979797;
    border-radius: 31px;
    padding: 136px 150px 0;
    display: flex;
    justify-content: space-between;
    .login-figure {
      width: 550px;
      height: 498px;
    }
    .login-form {
      padding-top: 11px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .form-title {
        width: 228px;
        height: 80px;
        margin-bottom: 80px;
        display: block;
      }
      .form-items {
        width: 360px;
      }
      .form-input {
        width: 360px;
        height: 50px;
        margin-bottom: 40px;
        border-color: #e6e6e6;
      }
      .form-captcha {
        width: 220px;
        margin-bottom: 16px;
      }
      .get-captcha {
        width: 120px;
        height: 50px;
        opacity: 1;
        background: #fff5f6;
        border-radius: 3px;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #c3161c;
        line-height: 50px;
        text-align: center;
        border: none;
        margin-left: 20px;
      }
      .form-btn {
        width: 332px;
        height: 60px;
        opacity: 1;
        background: #c3161c;
        border-radius: 30px;
        font-size: 24px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        line-height: 60px;
        cursor: pointer;
        margin-top: 20px;
      }
      .form-switch {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: right;
        color: #c3161c;
        line-height: 20px;
        margin-top: 16px;
        width: 100%;
        text-align: right;
        padding-right: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>
