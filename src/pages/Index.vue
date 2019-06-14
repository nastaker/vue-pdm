<template>
  <el-container>
    <el-header>
      <el-menu     
        background-color="#3c8dbc"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal">
        <el-menu-item index="1" @click="toggleDrawer">
          <i style="color:#fff" class="glyphicon glyphicon-th-large" />
        </el-menu-item>
        <el-menu-item index="2">文化遗产数据管理应用系统</el-menu-item>
        <el-menu-item style="float:right" index="0" @click="logout">
          <i style="color:#fff" class="glyphicon glyphicon-log-out" />
        </el-menu-item>
        <el-submenu style="float:right" index="4" v-if="$store.getters['user/getUser']">
          <template slot="title">{{ $store.getters['user/getUser'].rolename }}</template>
          <template v-for="item in role">
            <el-menu-item
            v-if="item.name !== $store.getters['user/getUser'].rolename"
            :key="item.guid"
            :index="url(item)"
            @click="setRole(item)">
              <span style="margin-right: 10px"><img :src="iconUrl(item)" /></span>
              <span>{{item.name}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item @click="userEdit" style="float:right" index="3" v-if="$store.getters['user/getUser']">
          <div style="display: flex;align-items:center;">
            <span class="avatar-box" :style="{backgroundImage:'url(' + $store.getters['user/getUser'].avatar + ')'}"></span>
            <span>{{ $store.getters['user/getUser'].username }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside style="width: auto;">
        <el-menu
        router
        :collapse="drawer"
        :default-active="$route.path">
          <el-submenu
          v-for="item in menu"
          :index="item.guid"
          :key="item.guid">
            <template slot="title">
              <i style="margin-right: 10px"><img :src="iconUrl(item)" /></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
            v-for="child in item.children"
            :index="url(child)"
            :key="child.guid"
            :route="getRoute(child)">
              <span style="margin-right: 10px"><img :src="iconUrl(child)" /></span>
              <span>{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <n-dialog @dialogClose="dialogClose" :showDialog="showDialog" :page="dialogPage" />
  </el-container>
</template>

<script>
export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: true,
      menuData: [{"guid":"f6ced9e4-0454-4294-8e86-266a7d74595d","name":"角色切换","icon":"S_02Users.png","children":[{"guid":"F5E89968-B47E-4F05-845C-BB2EF798B3F1","name":"总工程师","icon":"S_02Users.png","action":{"name":"SetRoleMenu","hasMsg":"False","isform":"False","type":"refresh"}},{"guid":"4A3D1B11-AFB8-4112-8D35-D6BFE122E4CC","name":"总经理","icon":"S_02Users.png","action":{"name":"SetRoleMenu","hasMsg":"False","isform":"False","type":"refresh"}},{"guid":"75CC68AD-BEDA-426B-9443-AE000D0D4A53","name":"系统运维","icon":"S_02Users.png","action":{"name":"SetRoleMenu","hasMsg":"False","isform":"False","type":"refresh"}}]},{"guid":"1CF64E41-DA3A-4BA3-812B-050ACBFF01CD","name":"个人工作区","icon":"A_01MyJob.png","children":[{"guid":"F6C376E5-4857-4908-97FB-8C9B2F18C1A3","name":"我的文件","icon":"zzzA_02MyFile.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}},{"guid":"35910513-7BD6-4F43-B8A3-A96342B71482","name":"我的收藏","icon":"A_03MyFloder.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}},{"guid":"9ADDFD6B-5387-482F-A47F-C19D212CEF66","name":"我的授权","icon":"A_04MyTFile.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}}]},{"guid":"8CB37CCF-C0ED-4C21-91EB-23520A331EFA","name":"项目管理","icon":"B_01Pro.png","children":[{"guid":"41FD4381-19A2-4106-A5C8-17B4100A9075","name":"项目进度看板","icon":"B_02ProMsg.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}},{"guid":"0371E3F9-09CC-42D6-B7B0-59D90B04F9DD","name":"项目列表","icon":"B_03MyPro.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}},{"guid":"F0E39F14-A178-4EEB-86CC-3567D5935846","name":"项目归档库","icon":"B_05ProFloder.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}},{"guid":"7D2320C6-27AD-43A6-B123-0F58DEB84811","name":"文件查询","icon":"B_05File.png","action":{"name":"OpenForm","hasMsg":"False","isform":"True","type":""}}]}],
      menu: undefined,
      role: undefined,
      showDialog: false,
      action: undefined,
      dialogPage: undefined,
      date: new Date()
    }
  },
  mounted: function () {
    // 获取menu数据
    let _this = this
    _this.getMenu()
  },
  methods: {
    toggleDrawer () {
      this.drawer = !this.drawer
    },
    userEdit () {
      let _this = this
      let api = '/action'
      _this.$http.post(api, {
        ACTION: 'UserEdit'
      }).then((response) => {
        _this.dialogPage = response.data
        _this.showDialog = true
      })
    },
    dialogClose (data) {
      if (data && data.tree) {
        this.$store.commit('user/setUserAvatar', data.tree.img)
      }
      this.showDialog = false
    },
    getMenu () {
      let _this = this
      _this.$http.get('/menu')
        .then(function (response) {
          _this.convertMenu(response.data)
          if (_this.$route.path === '/') {
            _this.$router.push('/listpage/41FD4381-19A2-4106-A5C8-17B4100A9075')
          }
        })
    },
    convertMenu (data) {
      let _this = this
      _this.menu = []
      for (let i = 0, j = data.length; i < j; i++) {
        let menu = data[i]
        if (menu.name === '角色切换') {
          _this.role = menu.children
        } else {
          _this.menu.push(menu)
        }
      }
    },
    iconUrl (item) {
      return '/static/icons-app/' + item.icon
    },
    getRoute (item) {
      if (item.action && item.action.name === 'OpenForm') {
        return { path: '/listpage/' + item.guid }
      } else {
        return { path: '/listpage/' }
      }
    },
    url (item) {
      let _this = this
      return _this.getRoute(item).path
    },
    setRole (item) {
      let _this = this
      if (item.action && item.action.name === 'SetRoleMenu') {
        // 重新登录
        _this.$http.post('/menu', {
          formguid: item.guid,
          action: item.action.name
        }).then((response) => {
          if (response.status === 200) {
            _this.$router.push('/listpage/41FD4381-19A2-4106-A5C8-17B4100A9075')
            // 修改为新角色
            _this.$store.commit('user/setUserRole', item.name)
            _this.convertMenu(response.data)
          }
        })
      }
    },
    logout () {
      this.$store.commit('user/removeUser')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
  .hide {
    display: none;
  }
  .el-header {
    color: #fff;
    background-color: #3c8dbc;
    padding: 0 !important;
  }
  .el-container{
    height: 100%;
  }
  .el-aside .el-menu {
    height: 100%;
  }
  .el-aside .el-menu:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-main {
    height: 100%;
    padding: 0 10px 10px 10px;
  }
</style>
<style>
  .avatar-box {
    border-radius: 50%;
    border: 3px solid #eee;
    overflow: hidden;
    height: 36px;
    width: 36px;
    margin-right: 10px;
    background-size: contain;
  }
  .el-submenu__icon-arrow {
    color: inherit !important;
  }
</style>
