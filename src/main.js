import Vue from 'vue'
import App from './App.vue'

import 'ionicons/dist/css/ionicons.min.css'
import './static/glyphicon/index.css'

import './plugins/date.js'
import './plugins/customComp.js'

import getAxios from './plugins/axios.js'
import getStore from './store'
import getRouter from './router'

import axios from 'axios'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})

import 'element-ui/lib/theme-chalk/index.css'
import { Notification, Message, MessageBox } from 'element-ui'
import { Container, Aside, Header, Main, DatePicker } from 'element-ui'
import { Row, Col } from 'element-ui'
import { Card } from 'element-ui'
import { Alert } from 'element-ui'
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'
import { Tabs, TabPane } from 'element-ui'
import { Collapse, CollapseItem } from 'element-ui'
import { Autocomplete } from 'element-ui'
import { Form, FormItem, Button, ButtonGroup, Dropdown, DropdownMenu, DropdownItem, Upload, Select, Dialog, Input, Switch } from 'element-ui'
import { Table, TableColumn, Pagination } from 'element-ui'
import { Tree, Transfer } from 'element-ui'
import { Option, Checkbox, Cascader } from 'element-ui'
import { Loading } from 'element-ui'

Vue.component(Notification.name, Notification)
Vue.component(Container.name, Container)
Vue.component(Aside.name, Aside)
Vue.component(Header.name, Header)
Vue.component(Main.name, Main)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuItemGroup.name, MenuItemGroup)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Collapse.name, Collapse)
Vue.component(CollapseItem.name, CollapseItem)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(Button.name, Button)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Select.name, Select)
Vue.component(Switch.name, Switch)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Pagination.name, Pagination)
Vue.component(Tree.name, Tree)
Vue.component(Transfer.name, Transfer)
Vue.component(Dialog.name, Dialog)
Vue.component(Input.name, Input)
Vue.component(Autocomplete.name, Autocomplete)
Vue.component(Option.name, Option)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Cascader.name, Cascader)
Vue.component(Upload.name, Upload)
Vue.component(Card.name, Card)
Vue.component(Alert.name, Alert)


let http = axios.create({
  baseURL: process.env.VUE_APP_API,
  withCredentials: true
  // timeout: 3000,
})

Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$http = http
Vue.prototype.$loading = Loading.service
Vue.config.productionTip = false



let store = getStore()
let router = getRouter({http, store, message: Message})
getAxios({http, router, store, message: Message })


new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')