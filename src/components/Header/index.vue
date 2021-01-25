<template>
  <div class="header">
    <a-button class="logout" @click="handleLogout">退出</a-button>
  </div>
</template>

<script>
import { logout } from '@/apis/user'
import { Modal } from 'ant-design-vue'

export default {
  data() {
    return {}
  },
  methods: {
    handleLogout() {
      Modal.confirm({
        title: '提示',
        content: '确定退出吗？',
        onOk: () => this.logout()
      })
    },
    logout() {
      logout().then(res => {
        const { code } = res
        if (code === 0) {
          const { pathname, search } = location
          localStorage.removeItem('sjg-org-admin-userId')
          window.location.href = `/login?redirect=${pathname}${search}`
        }
      })
    }
  }
}
</script>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 256px;
  right: 0;
  height: 65px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  .logout {
    margin-right: 40px;
  }
}
</style>
