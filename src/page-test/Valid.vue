<template>
  <div></div>
</template>

<script>
import login from '../libs/login'
export default {
  data() {
    return {
      msg: undefined,
      loading: undefined,
      fullscreenLoading: false
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.path !== '/valid') {
        return
      }
      this.openFullScreen()
      this.validateToken()
    }
  },
  mounted() {
    this.openFullScreen()
    this.validateToken()
  },
  methods: {
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '请稍后，正在验证登录信息',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    validateToken() {
      let token = unescape(this.$route.query.token).replace(/%/g, '').replace(/,/g, '').replace(/ /g, '+')
      let _this = this
      if (!token) {
        _this.loading.text = '未能获取到验证信息！'
        _this.loading.spinner = 'el-icon-error'
        setTimeout(function(){
          _this.loading.close()
        }, 3000)
        return
      }
      // 将token传递给后台解析
      this.$http.post('/user/valid', {
        token
      }).then(function(response){
        if (response.data.token) {
          login(_this, response.data)
          _this.$router.push('/test/select')
          _this.loading.close()
        } else {
          _this.loading.text = response.data.msg
          _this.loading.spinner = 'el-icon-error'
        }
      }).catch(function(error){
        _this.loading.text = '验证失败'
        _this.loading.spinner = 'el-icon-error'
        setTimeout(function(){
          _this.loading.close()
          window.location.href = process.env.VUE_APP_URL
        }, 3000)
      })
      this.msg = token
    }
  }
}
</script>

<style scoped>

</style>

