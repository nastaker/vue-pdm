<template>
  <el-container>
    <el-main>
      <div class="form">
        <div class="form-title">注册新用户</div>
        <el-form status-icon ref="ruleForm" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="登录名" prop="login">
            <el-input placeholder="请输入登录名" v-model="form.login"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="username">
            <el-input placeholder="请输入昵称" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input placeholder="请再次输入密码" v-model="form.checkPass" show-password></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input placeholder="请输入内容" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input placeholder="请输入内容" v-model="form.phonenumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="form-button" :disabled="isSubmitting" type="primary" @click="onSubmit">立即注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value) {
        let regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
        if(!regEmail.test(value)){
          return callback(new Error('请输入正确的电子邮箱'))
        }
      }
      callback()
    };
    var validatePhone = (rule, value, callback) => {
      if (value) {
        let regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(!regPhone.test(value)){
          return callback(new Error('请输入正确的手机号码'))
        }
      }
      callback()
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      isSubmitting: false,
      form: {
        login: undefined,
        username: undefined,
        password: undefined,
        checkPass: undefined,
        email: undefined,
        phonenumber: undefined
      },
      rules: {
        login: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        phonenumber: [
          {validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      let _this = this
      if (_this.isSubmitting) {
        return
      }
      _this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.$http.post('/user/new', _this.form)
            .then(function(response){
              _this.isSubmitting = true
              _this.$confirm('注册成功', '提示', {
                showCancelButton: false,
                confirmButtonText: '确定',
                callback: () => {
                  _this.$router.go(-1)
                }
              });
              _this.isSubmitting = false
            })
            .catch(function (error) {
              _this.isSubmitting = false
            });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
  .form-title {
    font-size: 26px;
    border-bottom: 1px solid #dedede;
    margin-bottom: 20px;
    padding-bottom: 20px;
    text-align: center;
  }
  .form {
    left: 25%;
    width: 50%;
    position: relative;
  }
  .form-button {
    width: 100%;
  }
</style>
