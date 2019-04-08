import Vue from 'vue'
import App from './App.vue'

import 'ionicons/dist/css/ionicons.min.css'
import './static/glyphicon/index.css'

import './plugins/element.js'
import './plugins/createScript.js'
import registComp from './plugins/customComp.js'
import './plugins/date.js'

import getAxios from './plugins/axios.js'
import getStore from './store'
import getRouter from './router'

import 'element-ui/lib/theme-chalk/index.css'
import { Notification, Message, MessageBox } from 'element-ui'
import { Container, Aside, Header, Main, DatePicker } from 'element-ui'
import { Row, Col } from 'element-ui'
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'
import { Tabs, TabPane } from 'element-ui'
import { Collapse, CollapseItem } from 'element-ui'
import { Button, ButtonGroup, Dropdown, DropdownItem, Upload, Select, Dialog, Input, Switch } from 'element-ui'
import { Table, TableColumn, Pagination } from 'element-ui'
import { Tree } from 'element-ui'
import { Option, Checkbox, Cascader } from 'element-ui'

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
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(Button.name, Button)
Vue.component(Dropdown.name, Dropdown)
Vue.component(DropdownItem.name, DropdownItem)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Select.name, Select)
Vue.component(Switch.name, Switch)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Pagination.name, Pagination)
Vue.component(Tree.name, Tree)
Vue.component(Dialog.name, Dialog)
Vue.component(Input.name, Input)
Vue.component(Option.name, Option)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Cascader.name, Cascader)
Vue.component(Upload.name, Upload)


Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.config.productionTip = false

let store = getStore()
let router = getRouter({store})
getAxios({Vue, store, message: Message })
registComp({ Vue })


new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')