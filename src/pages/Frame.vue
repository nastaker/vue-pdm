<template>
  <div class="container">
    <iframe v-if="type==='other'" frameborder="0" class="iframe" :src="src">
    </iframe>
    <viewer v-else-if="type==='img'" :images="images">
       <img v-for="src in images" :src="src" :key="src">
    </viewer>
  </div>
</template>

<script>
export default {
  data: () => ({
    src: undefined,
    type: undefined,
    images: []
  }),
  mounted () {
    let _this = this
    let param = _this.$store.getters['user/getParam']
    _this.src = param
    if (_this.isPicture(_this.src)) {
      _this.images.push(_this.src)
      _this.type = 'img'
    } else {
      _this.type = 'other'
    }
  },
  methods: {
    isPicture (addr) {
      let imgType = ["jpeg","gif","jpg","png","bmp"]
      let i = addr.lastIndexOf(".")
      let isPicture = false
      if (i < 0) {
        return isPicture
      }
      let suffix = addr.substring(i+1).toLowerCase()
      for (let i = 0, j = imgType.length; i < j; i++) {
        let t = imgType[i]
        if (t === suffix) {
          isPicture = true
          break
        }
      }
      return isPicture
    }
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
  img {
    width: 100%;
  }
</style>
