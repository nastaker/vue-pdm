<template>
  <div class="container">
    <iframe v-if="loaded" frameborder="0" class="iframe" :src="src">
    </iframe>
  </div>
</template>

<script>
export default {
  data: () => ({
    src: undefined,
    loaded: false
  }),
  mounted () {
    let _this = this
    let param = _this.$store.getters['user/getParam']
    _this.src = param
    _this.loaded = true
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden !important;
  }
  .iframe {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
