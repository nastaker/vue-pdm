<template>
  <div class="body">
    <div class="login-box-bg"></div>
    <div class="login-box">
      <el-row type="flex" justify="center">
        <el-col>
          <div class="title">北京国文琰文化遗产数据管理应用系统</div>
        </el-col>
      </el-row>
      <el-form @submit.native.prevent ref="form" :rules="rules" :model="form">
        <el-form-item prop="username">
          <el-input id="name" v-model="form.username" placeholder="请输入帐号">
            <template slot="prepend">
              <i class="icon ion-md-person"></i>
            </template>
          </el-input> 
        </el-form-item>
        <el-form-item prop="password">
          <el-input id="password" v-model="form.password" type="password" placeholder="请输入密码">
            <template slot="prepend">
              <i class="icon ion-md-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button id="login" native-type="submit" @click="submit" style="width:100%" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      username: '',
      password: ''
    },
    rules: {
      username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 2, message: '账号名称不符合规范，请输入至少 2 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, message: '密码不符合规范，请输入至少 3 个字符', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    setCookie: function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    submit () {
      let _this = this
      _this.$refs['form'].validate((valid) => {
        if (valid) {
        // 验证成功后，修改$http.defaults.headers.common['Authorization'] = 'bearer ' + AUTH_TOKEN
        // 使每次使用webapi时都携带验证信息
        _this.$http.post('/Authorize', _this.form)
          .then(function (response) {
            let user = _this.form.username
            let token = response.data.token
            let username = response.data.username
            let rolename = response.data.rolename
            let avatar = response.data.avatar
            if (token) {
              _this.$http.defaults.headers.common['Authorization'] = 'bearer ' + token
              _this.$store.commit('user/setUser', {
                user,
                avatar,
                username,
                rolename,
                token
              })
              _this.setCookie('loginguid', response.data.loginguid, 1)
              _this.$router.push('/')
            }
          })
        }
      });
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
  .login-box-bg {
    position: absolute;
    width: 380px;
    height: 250px;
    top: 50%;
    left: 50%;
    margin-left: -190px;
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
    width: 380px;
    height: 250px;
    top: 50%;
    left: 50%;
    margin-left: -190px;
    margin-top: -125px;
    border-width: 1px;
    border-color: #cdcdcd;
    border-style: solid;
    border-radius: 5px;
    padding: 20px;
  }
  .title {
    color: #000;
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dedede;
  }
</style>
