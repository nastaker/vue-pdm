<template>
  <el-container>
    <el-header>
      <el-menu
        style="float:left;"
        background-color="#3c8dbc"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal">
        <el-menu-item index="1" @click="toggleDrawer">
          <i style="color:#fff" class="glyphicon glyphicon-th-large" />
        </el-menu-item>
        <el-menu-item index="2">建筑遗产测绘虚拟仿真实验</el-menu-item>
      </el-menu>
      <el-menu
        style="float:right;"
        background-color="#3c8dbc"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal">
        <el-menu-item @click="userEdit" index="3" v-if="$store.getters['user/getUser']">
          <div style="display: flex;align-items:center;">
            <span>{{ $store.getters['user/getUser'].username }}</span>
          </div>
        </el-menu-item>
        <el-menu-item index="3" style="padding:0;width:60px;text-align:center;">
          <a href="/index.html" title="退出登录" style="display:block;width:100%">
            <i style="color:#fff" class="glyphicon glyphicon-log-out" />
          </a>
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
      menuData: [],
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
      return { path: '/listpage/' + item.guid }
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
