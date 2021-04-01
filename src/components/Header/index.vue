<template>
  <section class="header">
    <div class="header-box">
      <h3 class="title">印章管理系统</h3>
      <section class="action-module">
        <section class="avtar">
          <img :src="avatar || require('@/assets/images/login-figure.png')" alt="" />
          {{ userName || 'aslsk' }}
        </section>
        |
        <scetion class="company">{{ enterpriseName || 'dsjdskjjdksjkd' }}</scetion>
        |
        <section class="action-btns">
          <a-button class="btn self-btn" @click="actionBtn('self')">个人中心</a-button>
          <a-button class="btn switchcom-btn" @click="actionBtn('switch')">切换企业</a-button>
          <a-button class="btn logout-btn" @click="actionBtn('logout')">
            <img src="@/assets/svg/logout.svg" />退出</a-button
          >
        </section>
      </section>
    </div>
    <div class="bread-crumb">
      <bread-crumb />
    </div>
  </section>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { logout } from '@/apis/user'
import { SET_USER_INFO } from '@/store/user/mutations-type'
import BreadCrumb from '@/components/BreadCrumb'
import { cmsNotice } from '@/utils/utils'

export default defineComponent({
  components: {
    BreadCrumb
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    if (!store.state.user.userInfo.userName)
      store.commit(`user/${SET_USER_INFO}`, JSON.parse(localStorage.getItem('yda-admin-userInfo')))
    const userName = computed(() => store.state.user.userInfo.userName)
    const avatar = computed(() => store.state.user.userInfo?.avatar)
    const enterpriseName = computed(() => store.state.user.userInfo.enterpriseName)
    const actionBtn = type => {
      const actionObj = {
        self: '/personalCenter',
        switch() {
          const { pathname, search } = location
          router.push({
            path: '/login',
            query: {
              redirect: pathname + search,
              switch: true
            }
          })
        },
        logout() {
          Modal.confirm({
            title: '提示',
            content: '确定退出吗？',
            centered: true,
            onOk: async () => {
              const res = await logout({ json: 1 })
              if (res.success) {
                cmsNotice('success', '退出成功', 1000)
                const { pathname, search } = location
                store.commit(`user/${SET_USER_INFO}`, {
                  userName: undefined,
                  enterpriseName: undefined
                })
                localStorage.removeItem('yda-admin-userInfo')
                router.push(`/login?redirect=${pathname}${search}`)
              }
            }
          })
        }
      }
      typeof actionObj[type] === 'string' ? router.push(actionObj[type]) : actionObj[type]()
    }
    return {
      actionBtn,
      userName,
      enterpriseName,
      avatar
    }
  }
})
</script>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 240px;
  width: calc(100% - 240px);
  background: #f2f3f7;
}
.bread-crumb {
  padding-left: 24px;
}
.header-box {
  height: 80px;
  width: 100%;
  // border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 24px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 33px;
    line-height: 80px;
    margin-left: 24px;
  }
  .action-module {
    padding-top: 18px;
    color: #8b92b8;
    display: flex;
    line-height: 44px;
    .avtar {
      display: flex;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      margin-right: 20px;
      > img {
        width: 44px;
        height: 44px;
        margin-right: 10px;
        border-radius: 50%;
      }
    }
    .company {
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #8b92b8;
      padding: 0 20px;
    }
    .action-btns {
      padding-left: 20px;
      .btn {
        padding: 0 16px;
        height: 40px;
        opacity: 1;
        border: 1px solid #8b92b8;
        border-radius: 23px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: right;
        color: #8b92b8;
        margin-right: 14px;
      }
      .logout-btn {
        > img {
          vertical-align: middle;
          width: 13px;
          margin-right: 3px;
          transform: translateY(-1px);
        }
      }
    }
  }
}
</style>
