<template>
  <el-container>
    <el-main>
      <div ref="img" class="img">
        <div class="img-adress-1">
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  name: 'HelloWorld',
  data: () => ({
    height: 0,
    timer: false
  }),
  mounted() {
    let _this = this
    window.api = {}
    window.api.test = _this.test

    _this.$refs.img.style.height = document.body.clientHeight + 'px'
    window.onresize = function(e) {
      _this.height = document.body.clientHeight + 'px'
    }
  },
  watch :{
    height() {
      let _this = this
      if(!_this.timer) {
        _this.timer = true
        setTimeout(function(){
          _this.$refs.img.style.height = _this.height
          _this.timer = false
        }, 300)
      }
    }
  },
  methods: {
    test(event, p) {
      let _this = this
      _this.$message('测试一下' + p)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main {
    padding: 0;
  }
  .img {
    position: relative;
    background-image: url(/static/test/test-nav.jpg);
    background-repeat: no-repeat;
    background-size: contain;
  }
  .img-adress-1 {
    position: fixed;
    top: 30px;
    left: 25px;
    width: 100px;
    height: 100px;
    border: 1px solid red;
  }
</style>
