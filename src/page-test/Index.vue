<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <img src="/static/test/icon.png" />
        <span style="font-size:1.3em">建筑遗产测绘虚拟仿真实验</span>
        <span v-if="isExaming && examParts">测验建筑部位：{{examParts}}</span>
        <span v-if="isExaming">剩余时间：{{displayCountdown}}</span>
        <span v-if="isView">
          <span style="margin-right: 10px">考生：{{exam.UserName}}</span>
          <span style="margin-right: 10px">测验部位：{{examParts}}</span>
          <span style="margin-right: 10px">分数：{{exam.Score}}</span>
        </span>
      </div>
      <el-menu
        background-color="#3c8dbc"
        text-color="#fff"
        active-text-color="#ffd04b"
        mode="horizontal"
        style="float:right">
        <el-menu-item @click="userEdit" index="1" v-if="user">
          <div style="display: flex;align-items:center;">
            <span v-if="groupUsersName">组长：</span>
            {{user.username}}
          </div>
        </el-menu-item>
        <el-menu-item index="2" v-if="groupUsersName">
          {{groupUsersName}}
        </el-menu-item>
        <el-menu-item index="3" style="padding:0;width:60px;text-align:center;">
          <a href="/index.html" @click="logout" title="退出登录" style="display:block;width:100%">
            <i style="color:#fff" class="glyphicon glyphicon-log-out" />
          </a>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-main>
        <router-view @examInfo="examInfo" @examStart="start" @examStop="stop" />
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
      isExaming: false,
      isView: false,
      exam: undefined,
      examParts: undefined,
      leftTime: undefined,
      timeEnd: undefined,
      timeStart: undefined,
      menu: undefined,
      role: undefined,
      showDialog: false,
      action: undefined,
      dialogPage: undefined,
      date: new Date()
    }
  },
  computed: {
    groupUsersName() {
      let str = ''
      let groupUsers = this.$store.getters['exam/getGroupUser']
      if (groupUsers instanceof Array && groupUsers.length > 0) {
        groupUsers.forEach(function(c){
          str = str + c.Name + ','
        })
        str = str.substr(0, str.length -1 )
        return '组员：' + str
      } else {
        return null
      }
    },
    user() {
      return this.$store.getters['user/getUser']
    },
    type() {
      return this.$route.params.type
    },
    displayCountdown() {
      return this.toHHMMSS(this.leftTime)
    }
  },
  watch: {
    '$route' () {
    }
  },
  mounted: function () {
  },
  methods: {
    toHHMMSS(secs) {
      var sec_num = parseInt(secs, 10)
      var hours   = Math.floor(sec_num / 3600)
      var minutes = Math.floor(sec_num / 60) % 60
      var seconds = sec_num % 60

      return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
    },
    examInfo(exam) {
      this.exam = exam
      this.isView = true
    },
    start(exam, examParts) {
      let _this = this
      _this.exam = exam
      _this.examParts = examParts
      _this.isExaming = true
      // 获取开始时间
      this.timeStart = new Date().getTime()
      this.timeEnd = new Date(exam.TimeEnd).getTime()
      // 剩余时间 = (结束时间 - 开始时间)
      this.leftTime = parseInt((this.timeEnd - this.timeStart)/1000)
      this.startTimer()
    },
    stop() {
      this.leftTime = 0
    },
    startTimer() {
      this.timeStart = new Date().getTime()
      this.leftTime = parseInt((this.timeEnd - this.timeStart)/1000)
      if(this.leftTime > 0){
        setTimeout(this.startTimer, 1000);
      }
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
    logout () {
      this.$store.commit('user/removeUser')
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
    background-color: rgb(60, 141, 188);
    padding: 0 !important;
  }
  .el-container{
    height: 100%;
  }
  .el-main {
    height: 100%;
    padding: 0;
  }
</style>
<style>
  .header-left {
    float: left;
    display: flex;
    align-items: center;
    height: 60px;
  }
  .header-left span {
    padding: 5px;
    display: inline-block;
    line-height: 60px;
  }
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
