<template>
  <el-container>
    <el-aside width="200px">
      <ul class="pic-preview">
        <li :title="build.name" :class="{ hover: build.selected, disable: !build.enable }" v-for="(build,i) in builds" :key="i" @click="selectTest(build)">
          <img :src="build.pic"/>
          <div>{{build.name}}</div>
        </li>
      </ul>
    </el-aside>
    <el-main>
      <div :style="{display: ''}">
        <div class="title">建筑观察分与测稿编绘</div>
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="nav-img-box">
              <template v-for="build in builds">
                <div
                  class="nav-img"
                  v-if="build.enable"
                  @click="selectTest(build)"
                  :key="build.id" 
                  :style="{
                    left: build.left + 'px', 
                    top: build.top + 'px',
                    width: build.width + 'px',
                    height: build.height + 'px'
                  }">
                  <img :src="build.selected ? build.navselected : build.nav" />
                </div>
              </template>
            </div>
          </el-col>
          <el-col :span="8">
            <div :style="{display: !isSelected ? '': 'none'}">
            <div class="info-title">实验方法：</div>
            <div class="info-content">学生根据真实测绘任务，自主选择相近虚拟场景，运用建筑历史、传统建筑构造知识，从复杂多样的虚拟场景中认知和辨析建筑构件样式类别和结构、建造逻辑，按平立剖面视图或分部分项进行测稿初步编绘、虚拟摄影、构件表填写，系统将通过自动和人工在线评价等方式反馈结果。</div>
            <p>请从左侧或地图中选择要进行的测绘任务</p>
            </div>
            <div :style="{display: isSelected ? '': 'none'}">
            <p>当前选中：{{build.name}}</p>
            <p>{{build.desc}}</p>
            <el-button type="primary" @click="enter">进入考试</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data: () => ({
    build: {},
    isSelected: false,
    builds: undefined
  }),
  mounted() {
    this.getBuilds()
  },
  methods: {
    getBuilds() {
      let _this = this
      _this.$http.post('/exam/getTestList')
        .then(function(response){
          let builds = []
          for(let i = 0; i < response.data.length; i++) {
            let build = response.data[i]
            let top = parseInt(build.MapImgPositionLT.split(',')[0])
            let left = parseInt(build.MapImgPositionLT.split(',')[1])
            let width = parseInt(build.MapImgPositionRB.split(',')[0]) - left
            let height = parseInt(build.MapImgPositionRB.split(',')[1]) - top
            builds.push({
              id: build.Id,
              name: build.Name,
              pic: build.FaceImg,
              nav: build.MapImg,
              navselected: build.MapImgSelected,
              left: left,
              top: top,
              width: width,
              height: height,
              desc: build.Desc,
              selected: false,
              enable: build.IsEnable
            })
          }
          _this.builds = builds
        })
    },
    selectTest(build) {
      if (!build.enable) {
        return
      }
      if (this.build) {
        this.build.selected = false
      }
      this.build = build;
      this.build.selected = true
      this.isSelected = true
    },
    navHover(build) {
      build.navcurr = build.navselected
    },
    navLeave(build) {
      build.navcurr = build.nav
    },
    enter() {
      let _this = this
      _this.$router.push({
        path: '/test/start',
        query: {
          buildId: _this.build.id
        }
      })
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
  border: 2px solid #f8f546;
}
ul.pic-preview li img:hover {
  border: 2px solid #f8f546;
}
div.title {
  text-align: center;
  font-size: 1.5em;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dedede;
}
.info-title{
  font-weight: bold;
}
.info-content{
  text-indent: 2em;
}
.button-list {
  text-align: center;
  margin-top: 10px;
}
.nav-img-box {
  position: relative;
  height: 500px;
  width: 690px;
  background-image: url("/static/test/test-nav.jpg");
  background-repeat: no-repeat;
  background-size: contain;
}
.nav-img {
  position: absolute;
  cursor: pointer;
}
.nav-img img{
  width: 100%;
}
</style>


