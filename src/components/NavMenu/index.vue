<script>
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { computed, reactive, watch } from 'vue'
import Menu from 'ant-design-vue/es/menu'
const { Item, SubMenu } = Menu
const iconPathObj = {
  dashboard: 'iconshouyeweixuan',
  approval: 'iconshenpiweixuan',
  businessManage: 'iconqiyeweixuan',
  seal: 'iconyinzhangweixuan',
  sealManage: 'iconyongyinweixuan'
}
export default {
  data() {
    return {}
  },
  setup() {
    const $store = useStore()
    const $router = useRouter()
    const $route = useRoute()
    const state = reactive({
      navData: computed(() => $store.state.router.navMenus),
      openKeys: [],
      selectedKeys: []
    })

    const openChange = keys => {
      state.openKeys = keys[keys.length - 1] === state.openKeys[0] ? [] : [keys[keys.length - 1]]
    }
    const select = item => {
      state.selectedKeys = [item.key]
      const path =
        item.domEvent.target.tagName === 'SPAN'
          ? item.domEvent.target.parentNode.dataset['path']
          : item.domEvent.target.dataset['path']
      path !== $route.path && $router.push({ path })
    }
    const renderMenu = item => {
      const slots = {
        title: () => (
          <span>
            {item.icon && <i class={['iconfont svg', iconPathObj[item.icon]].join(' ')}></i>}
            {item.title}
          </span>
        ),
        default: () => item.children.map(it => renderMenu(it))
      }
      if (item.children) {
        return <SubMenu v-slots={slots} key={item.key}></SubMenu>
      }
      return (
        <Item key={item.key} data-path={item.path}>
          <span>
            {item.icon && <i class={['iconfont svg', iconPathObj[item.icon]].join(' ')}></i>}
            {item.title}
          </span>
        </Item>
      )
    }

    watch(
      () => $route.fullPath,
      () => {
        if ($route.matched.length === 0) return []
        if ($route.matched[$route.matched.length - 1].name !== state.selectedKeys[0]) {
          // 点击历史返回的情况
          if ($route.matched.length === 2) {
            state.selectedKeys = [$route.matched[1].name]
          } else if ($route.matched.length === 3) {
            state.openKeys = [$route.matched[1].name]
            state.selectedKeys = [
              $route.matched[2].name.includes('detail')
                ? $route.matched[2].name.replace(/detail/, '')
                : $route.matched[2].name
            ]
          }
        }
      },
      { immediate: true }
    )

    return () => (
      <div class="nav-menu">
        <div class="title">
          <img class="nav-title" src={require('@/assets/images/yda-logo.png')} alt="" />
        </div>
        <Menu
          class="scroll-bar-hide"
          openKeys={state.openKeys}
          selectedKeys={state.selectedKeys}
          onOpenChange={openChange}
          onClick={select}
          mode="inline"
        >
          {state.navData.map(item => renderMenu(item))}
        </Menu>
      </div>
    )
  }
}
</script>

<style lang="scss">
.nav-menu {
  position: fixed;
  width: 240px;
  height: 100%;
  border-right: 1px solid #f0f0f0;
  z-index: 100;
  box-shadow: 0px 0px 8px 1px #bbb;
  background-color: #fff;
  .title {
    margin: 26px auto;
    width: 120px;
    .nav-title {
      display: block;
      width: 120px;
      height: 56px;
    }
  }
  .ant-menu-root {
    position: absolute;
    top: 128px;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 40px;
    border: none;
    width: 240px;
    // & > li {
    //   .ant-menu-submenu-title {
    //     border-bottom: 1px solid #f0f0f0;
    //   }
    // }
    .ant-menu-item,
    .ant-menu-submenu-title {
      width: 240px;
      margin: 0;
      line-height: 54px;
      height: 54px;
      box-sizing: border-box;
    }
    .ant-menu-submenu {
      .ant-menu-item {
        padding-left: 75px !important;
      }
    }

    .svg {
      font-size: 20px;
      padding-right: 16px;
      display: inline-block;
      transform: translateY(2px);
    }
    .ant-menu-item-selected::after {
      border-right: none;
    }
  }
}
</style>
