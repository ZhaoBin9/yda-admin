<template>
  <div class="login">
    <a-form layout="horizontal" :model="state.form" :wrapper-col="{ span: 24 }" @submit="handleLogin">
      <a-form-item>
        <a-input size="large" v-model:value="state.form.user" placeholder="请输入账号">
          <template #addonBefore><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input size="large" v-model:value="state.form.password" type="password" placeholder="请输入密码">
          <template #addonBefore><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" size="large" style="width: 100%" :disabled="state.loginDisable" htmlType="submit">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/apis/user'
import md5 from 'md5'
export default {
  name: '',
  props: {},
  components: {
    LockOutlined,
    UserOutlined
  },
  setup() {
    const $route = useRoute()
    const $router = useRouter()
    const state = reactive({
      form: {
        user: '',
        password: ''
      },
      loginDisable: computed(() => state.form.user === '' || state.form.password === '')
    })
    const handleLogin = () => {
      const params = {
        loginType: 3,
        json: 1,
        from: 1,
        password: md5(state.form.password),
        username: state.form.user
      }
      login(params).then(res => {
        const { code, data } = res
        if (code === 0) {
          const { redirect } = $route.query || {}
          const { search } = window.location
          localStorage.setItem('sjg-org-admin-userId', data.userId)
          $router.push({ path: redirect ? decodeURIComponent(search.split('redirect=')[1]) : '/home' })
        }
      })
    }
    return {
      state,
      handleLogin
    }
  }
}
</script>
<style lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #666;
  .ant-form {
    width: 320px;
    .ant-input-group-addon {
      font-size: 18px;
    }
  }
}
</style>
