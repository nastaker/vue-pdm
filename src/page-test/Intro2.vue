<template>
  <el-container>
    <el-aside width="200px">
      <ul class="pic-preview">
        <li :title="t.name" :class="{ hover: t.selected, disable: !t.enable }" v-for="(t,i) in testlist" :key="i" @click="selectTest(t)">
          <img :src="t.pic"/>
          <div>{{t.name}}</div>
        </li>
      </ul>
    </el-aside>
    <el-main>
      <div :style="{display: isSelected?'none':''}">
        <div class="title">建筑虚拟测量</div>
        <div class="info">
          <div class="info-title">实验方法：</div>
          <div class="info-content">
            <p>要求学生面对复杂多样的场景，能灵活运用测量学基本原理，选择合理的方法和工具装备，对建筑的控制性尺寸和特定节点进行虚拟测量，完成测稿，提交数据，系统将通过自动或人工在线评价等方式反馈结果，积分达到要求时通过测评。</p>
          </div>
        </div>
      </div>
      <div :style="{display: !isSelected?'none':''}">
        <div class="title">建筑虚拟测量</div>
        <div class="test-info-box">
          <div class="test-info">
            <div class="test-header">
              <span class="test-name">{{test.name}}</span>
            </div>
            <div class="test-pic-box" v-if="test.pic">
              <img class="test-pic" :src="test.pic"/>
            </div>
            <div class="test-desc">
              {{test.desc}}
            </div>
            <div class="button-list">
              <el-button type="primary" @click="enter">进入实验</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data: () => ({
    isSelected: true,
    testlist: [
      {
        id: 1,
        name: '实验方法',
        updateTime: '',
        pic: '/static/test/test1-select-pic1.jpg',
        desc: `要求学生面对复杂多样的场景，能灵活运用测量学基本原理，选择合理的方法和工具装备，对建筑的控制性尺寸和特定节点进行虚拟测量，完成测稿，提交数据，系统将通过自动或人工在线评价等方式反馈结果，积分达到要求时通过测评。`,
        enable: true
      }
    ],
    test: {}
  }),
  mounted() {
    this.test = this.testlist[0]
  },
  methods: {
    selectTest(test) {
      if (!test.enable) {
        return;
      }
      if (this.test) {
        this.test.selected = false
      }
      this.test = test;
      this.test.selected = true
      this.isSelected = true
    },
    enter() {
      this.$router.push('/test/start2')
    }
  }
}
</script>

<style scoped>
.el-aside {
  border-right: 1px solid #dedede;
}
ul.pic-preview {
  margin: 0;
  padding: 10px;
  list-style-image: none;
}
ul.pic-preview li {
  cursor: pointer;
}
ul.pic-preview li.disable {
  opacity: 0.2;
}
ul.pic-preview li img {
  width: 100%;
  box-sizing: border-box;
}
ul.pic-preview li.hover img {
  border: 1px solid blue;
}
ul.pic-preview li img:hover {
  border: 1px solid blue;
}
div.title {
  text-align: center;
  font-size: 2em;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dedede;
}
.info {
  padding: 0 30px;
}
.info-title{
  font-weight: bold;
}
.info-content{
  text-indent: 2em;
}
.test-pic-box {
  text-align: center;
  height: 200px;
  padding: 20px;
}
.test-pic {
  height: 100%;
}
.test-info-box {
  display: flex;
}
.button-list {
  text-align: center;
  margin-top: 10px;
}
.test-header {
  text-align: center;
}
.test-name {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}
</style>


