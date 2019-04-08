<template>
  <div>
    你好，世界
    <el-button @click="n">通知</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  methods: {
    n () {
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        duration: 0
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
