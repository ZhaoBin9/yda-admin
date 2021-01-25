import { createApp } from 'vue'
import App from './App.vue' // 入口文件
import router from './router/config-router' // 路由定义
import store from './store' // 状态管理
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
  Notification,
  InputNumber,
  DatePicker,
  TimePicker,
  Checkbox,
  progress,
  Tag,
  Image,
  Select
} from 'ant-design-vue'
import './permission' // 全局路由守卫 权限控制
import './global.scss' // 全局样式

createApp(App)
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
  .use(progress)
  .use(Checkbox)
  .use(DatePicker)
  .use(TimePicker)
  .use(InputNumber)
  .use(Notification)
  .use(router)
  .mount('#app')
