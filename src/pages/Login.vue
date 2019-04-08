<template>
  <div class="body">
    <img src="/static/images/title.png" class="pic_title"/>
    <img src="/static/images/footer.png" class="pic_footer" />
    <div class="login-box-bg"></div>
    <div class="login-box">
      <el-row type="flex" justify="center">
        <el-col>
          <div class="title">用户登录</div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col>
          <el-input id="name" v-model="username" placeholder="请输入帐号">
            <template slot="prepend">
              <i class="icon ion-md-person"></i>
            </template>
          </el-input> 
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col>
          <el-input id="password" v-model="password" type="password" placeholder="请输入密码">
            <template slot="prepend">
              <i class="icon ion-md-lock"></i>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col style="margin-bottom:40px">
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col>
          <el-button id="login" v-on:click="submit" style="width:100%" type="primary">登录</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: 'cyx',
    password: '123',
    error: false,
    errMsg: null
  }),
  methods: {
    setCookie: function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    submit () {
      if (!this.username) {
        this.error = true
        this.errMsg = '请输入用户名'
      } else if (!this.password) {
        this.error = true
        this.errMsg = '请输入密码'
      } else {
        this.error = false
        let _this = this
        let user = _this.username
        let password = _this.password
        // 登录
        // 验证成功后，修改$http.defaults.headers.common['Authorization'] = 'bearer ' + AUTH_TOKEN
        // 使每次使用webapi时都携带验证信息
        _this.$http.post('/Authorize', {
          user,
          password
        })
          .then(function (response) {
            let token = response.data.token
            let username = response.data.username
            let rolename = response.data.rolename
            if (token) {
              _this.$http.defaults.headers.common['Authorization'] = 'bearer ' + token
              _this.$store.commit('user/setUser', {
                user,
                username,
                rolename,
                token
              })
              _this.setCookie('loginguid', response.data.loginguid, 1)
              _this.$router.push('/')
            } else {
              _this.error = true
              _this.errMsg = response.data
            }
          })
      }
    }
  }
}
</script>

<style scoped>
  .body{
    height: 100%;
    width: 100%;
    background-image: url(/static/images/login-bg.jpg);
    background-size:cover;
    background-repeat: no-repeat;
  }
  .pic_title {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .pic_footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .login-box-bg {
    position: absolute;
    width: 360px;
    height: 250px;
    top: 50%;
    left: 50%;
    margin-left: -180px;
    margin-top: -125px;
    border-width: 1px;
    border-color: #cdcdcd;
    border-style: solid;
    border-radius: 5px;
    padding: 20px;
    background-color: #fff;
    opacity: 0.5;
  }
  .login-box {
    position: absolute;
    width: 360px;
    height: 250px;
    top: 50%;
    left: 50%;
    margin-left: -180px;
    margin-top: -125px;
    border-width: 1px;
    border-color: #cdcdcd;
    border-style: solid;
    border-radius: 5px;
    padding: 20px;
  }
  .title {
    color: #333;
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dedede;
  }
  .el-col {
    margin-bottom: 10px;
  }
</style>
