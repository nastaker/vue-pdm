<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    let _this = this
    setTimeout(_this.getNotifications, 1000 * 60)
  },
  methods: {
    getNotifications () {
      let _this = this
      setTimeout(_this.getNotifications, 1000 * 60)
      if (_this.$route.path === '/login'
        || _this.$route.path === '/detail'
        || _this.$route.path === '/view') {
        return
      }
      _this.$http.get('/message')
        .then((response) => {
          let result = response.data
          if (result && result.messages) {
            result = result.messages
            for (let i = 0, j = result.length; i < j; i++) {
              _this.$notify({
                title: result[i].title,
                message: result[i].msg.replace('\n', '<br/>'),
                dangerouslyUseHTMLString: true,
                position: 'bottom-right',
                duration: 0
              })
            }
          }
        })
    }
  }
}
</script>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
</style>
