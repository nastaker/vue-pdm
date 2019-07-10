<template>
  <el-container>
    <el-main>
      <div class="left-aside">
        <img src='/static/test/left_side.png' />
      </div>
      <div class="content">
        <div class="info-title">进入实验前请认真阅读说明</div>
        <div class="info-content">
          <h3>1、硬件要求：</h3>
          <p>本实验对电脑配置有一定要求，请保证当前电脑8G以上内存，并有2G以上显存独立显卡。</p>
          <p>英特尔 I5 CPU，系统盘保留1G以上的硬盘空间。如果配置不达标，实验效果会受到影响，特别是模型加载及虚拟漫游方面。</p>
          <h3>2、实验阶段：</h3>
          <p>实验分为“建筑观察分析与测稿编绘”和“建筑虚拟测量”两个阶段。</p>
          <h3>3、实验目的：</h3>
          <p>本实验是学生进入实测现场前重要培训测评考核环节，从学生后续学习需求和创新能力培养出发，其目的如下：</p>
          <p>1）通过对虚拟场景中建筑对象的测稿编绘，包括徒手草图、图表分析、虚拟摄影等手段的综合运用，训练考核学生对建筑学基础知识技能综合运用和观察分析的能力，包括空间认知、建筑历史、建筑构造、制图表达、徒手绘图等，让学生进一步理解测稿编绘的一般方法和要求，为后续现场工作中的测稿编绘奠定基础。</p>
          <p>2）通过对虚拟场景中常见节点的虚拟测量，加深学生对测量学原理的认识，并训练考核学生对测量学原理和基本方法的灵活运用，加深学生对测量方法和技术要求的理解，提高后续实测工作效率，少走弯路。</p>
          <p>3）通过虚拟仿真综合训练，促进学生自主学习、独立思考习惯的养成，培养探索发现新事物的创新能力，使学生初步理解材料、构造、工艺、审美、历史文化与空间、造型之间相互关联又相互制约的复杂关系，激发对中国传统建筑文化的兴趣和情感，增强文化自信，培养爱国主义情怀。</p>
        </div>
        <div class="readme">
          <el-checkbox :disabled="isReadDisabled" v-model="isRead" border>我已阅读实验说明（{{timer}}）</el-checkbox>
        </div>
      </div>
      <div class="login-box">
        <div class="header">
          <span class="title">
            <span v-if="isTeam">组长登录</span>
            <span v-else>用户登录</span>
          </span>
        </div>
        <el-form class="form" status-icon ref="ruleForm" :rules="rules" :model="form">
          <template v-if="isLogined">
            <el-form-item>
              当前已登录用户：{{user.username}}
            </el-form-item>
          </template>
          <template v-if="!isLogined">
            <el-form-item prop="username">
              <el-input prefix-icon="el-icon-user" v-model="form.username" class="input" type="text" placeholder="请输入登录名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-lock" v-model="form.password" class="input" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </template>
          <el-form-item v-if="type==2">
            <el-checkbox v-model="isTeam">是否组队登录</el-checkbox>
          </el-form-item>
          <el-form-item  :style="{ display: isLogined && isTeam ? 'block':'none' }">
            <el-select value-key="Id" v-model="selectedUsers" multiple placeholder="请选择组内人员">
              <el-option
                v-for="user in users"
                :key="user.Id"
                :label="user.Name"
                :value="user">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :style="{ display: isLogined ? 'block':'none' }">
            <el-button type="primary" @click="enter">进入考试</el-button>
          </el-form-item>
          <el-form-item :style="{ display: !isLogined ? 'block':'none', textAlign: 'right' }">
            <el-button type="primary" @click="$router.push('/register')">新用户注册</el-button>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="guestlogin(1)">专家通道1</el-button>
            <el-button type="primary" @click="guestlogin(2)">专家通道2</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import login from '../libs/login'

export default {
  data: () => ({
    isReadDisabled: true,
    isRead: false,
    isTeam: false,
    callback: undefined,
    countdown: 30,
    type: 0,
    start: 0,
    timer: 0,
    selectedUsers: [],
    users: [],
    form: {
      username: '',
      password: ''
    },
    rules: {
      username: [
        { required: true, message: '请输入登录名', trigger: 'blur' },
        { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
      ],
    }
  }),
  watch: {
    '$route'() {
      this.type = this.$route.params.id
    }
  },
  computed: {
    user() {
      return this.$store.getters['user/getUser']
    },
    isLogined() {
      return this.user !== null
    }
  },
  mounted() {
    let _this = this
    // 获取考试类型
    _this.type = _this.$route.params.id
    // 如果没登录，计时器开启
    // 记录下开始计时器的时间，随时修正
    _this.start = new Date().getTime()
    // Update the count down every 1 second
    _this.timer = _this.countdown
    _this.callback = function(){
      _this.isRead = true
      _this.isReadDisabled = false
    }
    _this.timerStart()
    _this.getGroupUsers()
  },
  methods: {
    enter() {
      let _this = this
      _this.$store.commit('exam/setGroupUser', _this.selectedUsers)
      if (_this.type == 2) {
        _this.$router.push('/test/intro2')
      } else {
        _this.$router.push('/test/intro')
      }
    },
    login() {
      let _this = this
      _this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 先清空队友
          _this.$store.commit('exam/clearGroupUser')
          _this.$store.commit('user/removeUser')
          _this.$http.post('/Authorize', _this.form)
            .then(function (response) {
              if (response.data.token) {
                login(_this, response.data)
                _this.getGroupUsers()
              }
            })
        }
      })
    },
    guestlogin(type) {
      if (!type) {
        type = 1
      }
      let _this = this
      _this.form.password = '123'
      _this.form.username = 'zjzh' + type
      // 先清空队友
      _this.$store.commit('exam/clearGroupUser')
      _this.$store.commit('user/removeUser')
      _this.$http.post('/Authorize', _this.form)
        .then(function (response) {
          if (response.data.token) {
            login(_this, response.data)
            _this.getGroupUsers()
          }
        })
    },
    getGroupUsers() {
      let _this = this
      if (!(_this.user || _this.user.userguid)) {
        return
      }
      _this.$http.get(`exam/getGroupUser/${_this.user.userguid}`)
        .then(function(response){
            // 获取人员数据
            _this.users = response.data
        })
    },
    timerStart() {
      let _this = this
      if (_this.timer > 1) {
        _this.timer = parseInt(_this.countdown - (new Date().getTime() - this.start)/1000)
        setTimeout(_this.timerStart, 1000)
      } else {
        _this.timer = 0
        this.callback()
      }
    }
  }
}
</script>

<style scoped>
  .el-main {
    padding: 0;
    height: 100%;
    display: flex;
  }
  .left-aside {
    flex: 2;
    padding-top: 20px;
    text-align: center;
  }
  .content {
    flex: 8;
    padding: 2em 4em 0;
    border-left: 1px solid #dedede;
    border-right: 1px solid #dedede;
  }
  .info-title {
    font-size: 1.5em;
    font-weight: bold;
  }
  .info-content p{
    margin: 0.5em 0;
    text-indent: 2em;
  }
  .readme {
    text-align: right;
  }
  .login-box {
    flex: 4;
  }
  .login-box .header{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dedede;
  }
  .login-box .header .title{
    padding: 5px;
  }
  .login-box .header .forgot{
    padding: 5px;
    border-left: 1px solid #dedede;
  }
  .login-box .form {
    padding: 10px;
  }
  .login-box .form .qrow{
    margin-bottom: 10px;
  }
</style>

