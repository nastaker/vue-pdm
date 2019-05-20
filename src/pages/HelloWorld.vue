<template>
  <div>
    <el-button @click="viewBigPic">查看大图效果</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data: () => ({
  }),
  methods: {
    viewBigPic () {
      let url = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557992835&di=8a381e8c7ef1bb7719e7f960337bc7d0&imgtype=jpg&er=1&src=http%3A%2F%2Fimg1.ph.126.net%2FfwfA0WxnnetptmeflJm9gA%3D%3D%2F6597667900983768826.jpg"
      this.$store.commit('user/setParam', url)
      window.open('#/view', '_blank')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
