<template>
  <div class="container">
    <el-alert
      title="温馨提示："
      type="info"
      description="为得到更好的体验,请使用谷歌浏览器"
      show-icon>
    </el-alert>
    <el-row>
      <el-col class="box" :span="12" v-for="(e,index) in exams" :key="index">
        <div class="inner-box">
          <div class="title">{{e.name}}</div>
          <div class="image-box">
            <img :src="e.img">
          </div>
          <div class="bottom">
            <el-button type="primary" @click="toExam(e)">进入实验</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {

    return {
      exams: [
        {
          name: '阶段一：建筑观察分析与测稿编绘',
          img: '/static/test/test1_frontpage.jpg',
          url: '/test/enter/1'
        },
        {
          name: '阶段二：建筑虚拟测量',
          img: '/static/test/test2_frontpage.jpg',
          url: '/test/enter/2'
        },
      ]
    }
  },
  methods: {
    toExam(e) {
      this.$router.push(e.url)
    }
  }
}
</script>

<style scoped>
  .container {
    padding: 20px;
  }
  
  .time {
    font-size: 13px;
    color: #999;
  }

  .box {
    margin: 20px 0;
    padding: 0 20px;
  }
  
  .inner-box {
    border: 1px solid #E4E4E4;
  }

  .title{
    padding: 20px 0;
    text-align: center;
    font-size: 20px;
    color: #666;
    font-weight: 650;
    border-bottom: 1px solid #E4E4E4;
  }

  .image-box {
    padding: 20px 40px;
  }

  .image-box img{
    width: 100%;
  }
  
  .bottom {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #E4E4E4;
  }
</style>
