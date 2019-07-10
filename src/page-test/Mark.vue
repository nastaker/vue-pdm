<template>
  <el-container>
    <el-aside width="150px">
      <el-menu
        background-color="#E7EFF3"
        text-color="#333">
        <el-menu-item v-for="(m,i) in menu" :key="i" @click="to(m)">
          <i style="margin-right: 10px" :class="m.icon"></i>
          <span>{{m.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <keep-alive>
        <router-view :exam="exam" :maxScore="maxScore" :bill="bill" :isMark="true"></router-view>
      </keep-alive>
      <iframe frameborder="0" src="/static/v101/index.htm" />
    </el-main>
  </el-container>
</template>

<script>
export default {
  data: () => ({
    exam: undefined,
    bills: [],
    bill: undefined,
    maxScore: 0,
    maxScoreList: [],
    menu: [
      {
        icon: 'glyphicon glyphicon-list',
        name: '构件表'
      },
      {
        icon: 'glyphicon glyphicon-picture',
        name: '虚拟照片'
      },
      {
        icon: 'glyphicon glyphicon-leaf',
        name: '测稿'
      },
      {
        icon: 'glyphicon glyphicon-fullscreen',
        name: '切换3D显示'
      },
      {
        icon: 'glyphicon glyphicon-exit',
        name: '退出'
      }
    ]
  }),
  computed: {
    examid() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.getExam()
    this.getMaxScore()
  },
  methods: {
    getExam() {
      let _this = this
      _this.$http.get('/exam/get/' + _this.examid)
        .then(function(response) {
          _this.exam = response.data.exam
          _this.$emit('examInfo', _this.exam)
          for(let i = 0; i < response.data.bills.length; i++) {
            if (!response.data.bills[i].Score) {
              response.data.bills[i].Score = 0.00
            }
          }
          _this.bills = response.data.bills
        })
    },
    getMaxScore() {
      let _this = this
      _this.$http.get('/exam/getExamScore')
        .then(function(response) {
          _this.maxScoreList = response.data
        })
    },
    to(menu) {
      let _this = this
      if (menu.name == '切换3D显示') {
        _this.$router.push(`/test/mark/${_this.examid}/`)
      } else if (menu.name == '构件表') {
        _this.exam.pagetype = menu.name
        _this.$router.push(`/test/mark/${_this.examid}/table`)
      } else if (menu.name == '测稿') {
        _this.exam.pagetype = menu.name
        _this.bill = _this.bills.filter(a => a.Name === '草图绘制')[0]
        _this.maxScore = parseInt(_this.maxScoreList.filter(a => a.Key === 'EXAM_SCORE_SKETCH')[0].Value)
        _this.$router.push(`/test/mark/${_this.examid}/picture/sketch`)
      } else if (menu.name == '虚拟照片') {
        _this.exam.pagetype = menu.name
        _this.bill = _this.bills.filter(a => a.Name === '虚拟照片')[0]
        _this.maxScore = parseInt(_this.maxScoreList.filter(a => a.Key === 'EXAM_SCORE_VIRTUAL')[0].Value)
        _this.$router.push(`/test/mark/${_this.examid}/picture/virtual`)
      }
    }
  }
}
</script>

<style scoped>
  .el-menu {
    height: 100%;
  }
  .el-main {
    height: 100%;
    display: flex;
    padding: 0;
  }
  .el-main iframe{
    flex: 1
  }
</style>