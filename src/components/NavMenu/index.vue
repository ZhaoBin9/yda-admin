<template>
  <div class="nav-menu">
    <div class="title">上金谷官网管理后台</div>
    <a-menu
      class="scroll-bar-hide"
      :openKeys="state.openKeys"
      :selectedKeys="state.selectedKeys"
      @openChange="openChange"
      @select="select"
      mode="inline"
    >
      <template v-for="pt in state.navData">
        <a-menu-item v-if="!pt.children.length" :key="pt.id" :data-path="pt.path">{{ pt.title }}</a-menu-item>
        <a-sub-menu v-else :key="pt.id" :title="pt.title">
          <a-menu-item v-for="cd in pt.children" :key="cd.id" :data-path="cd.path">{{ cd.title }}</a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, reactive } from 'vue'
export default {
  data() {
    return {}
  },
  setup() {
    const $store = useStore()
    const $router = useRouter()
    const state = reactive({
      navData: computed(() => $store.state.nav.navMenus),
      openKeys: computed(() => $store.state.nav.openKeys),
      selectedKeys: computed(() => $store.state.nav.selectedKeys)
    })

    const setOpenKeys = keys => $store.commit('nav/set_open_keys', keys)
    const setSelectedKeys = keys => $store.commit('nav/set_selected_keys', keys)

    const openChange = keys => {
      const lastKey = keys[keys.length - 1]
      setOpenKeys(lastKey ? [lastKey] : [])
    }
    const select = item => {
      setSelectedKeys([item.key])
      const path = item.domEvent.target.dataset['path']
      $router.push(path)
    }
    return {
      state,
      setOpenKeys,
      setSelectedKeys,
      select,
      openChange
    }
  }
}
</script>

<style lang="scss">
.nav-menu {
  position: fixed;
  width: 256px;
  height: 100%;
  border-right: 1px solid #f0f0f0;
  .title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 65px;
    font-size: 18px;
    color: #444;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-menu-root {
    position: absolute;
    top: 65px;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 40px;
    border: none;
    & > li {
      .ant-menu-submenu-title {
        border-bottom: 1px solid #f0f0f0;
      }
    }
    .ant-menu-item,
    .ant-menu-submenu-title {
      width: 255px;
      margin: 0;
      line-height: 54px;
      height: 54px;
      &::after {
        display: none;
      }
      &:hover {
        width: 255px;
        background-color: #e6f7ff;
      }
    }
  }
}
</style>
