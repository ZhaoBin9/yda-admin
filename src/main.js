import { createApp } from 'vue'
import App from './App.vue' // 入口文件
import router from './router/config-router' // 路由定义
import store from './store' // 状态管理
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'
import {
  ConfigProvider,
  Menu,
  Table,
  Button,
  Modal,
  Upload,
  Input,
  Space,
  Form,
  Switch,
  Radio,
  InputNumber,
  DatePicker,
  TimePicker,
  Checkbox,
  Tag,
  Image,
  Select,
  Row,
  Col,
  Card,
  Timeline,
  Tabs,
  Tree,
  Cascader,
  Dropdown,
  Breadcrumb
} from 'ant-design-vue'
import './permission' // 全局路由守卫 权限控制
import './global.scss' // 全局样式
// import 'ant-design-vue/dist/antd.less'

createApp(App)
  .directive('btn', {
    mounted(el, binding) {
      const { value } = binding
      if (Array.isArray(router.currentRoute.value.meta.permission)) {
        const isUnmount = router.currentRoute.value.meta.permission.find(item => item.includes(value.toUpperCase()))
        !isUnmount ? (el.parentNode ? el.parentNode.removeChild(el) : (el.style.display = 'none')) : null
      }
    }
  })
  .use(store)
  .use(ConfigProvider)
  .use(Menu)
  .use(Table)
  .use(Button)
  .use(Modal)
  .use(Upload)
  .use(Space)
  .use(Form)
  .use(Switch)
  .use(Radio)
  .use(Input)
  .use(Select)
  .use(Image)
  .use(Tag)
  .use(Checkbox)
  .use(DatePicker)
  .use(TimePicker)
  .use(InputNumber)
  .use(Row)
  .use(Col)
  .use(Card)
  .use(Timeline)
  .use(Tabs)
  .use(Tree)
  .use(Cascader)
  .use(Dropdown)
  .use(Breadcrumb)
  .use(router)
  .mount('#app')
