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
        <router-view v-if="exam" :bill="bill" :exam="exam" :isView="true"></router-view>
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
  },
  methods: {
    getExam() {
      let _this = this
      _this.$http.get('/exam/get/' + _this.examid)
        .then(function(response) {
          _this.exam = response.data.exam
          _this.bills = response.data.bills
          _this.$emit('examInfo', _this.exam)
        })
    },
    to(menu) {
      let _this = this
      if (menu.name == '切换3D显示') {
        _this.$router.push(`/test/view/${_this.examid}/`)
      } else if (menu.name == '构件表') {
        _this.exam.pagetype = menu.name
        _this.$router.push(`/test/view/${_this.examid}/table`)
      } else if (menu.name == '测稿') {
        _this.bill = _this.bills.filter(b => b.Name === '草图绘制')[0]
        _this.exam.pagetype = menu.name
        _this.$router.push(`/test/view/${_this.examid}/picture/sketch`)
      } else if (menu.name == '虚拟照片') {
        _this.bill = _this.bills.filter(b => b.Name === '虚拟照片')[0]
        _this.exam.pagetype = menu.name
        _this.$router.push(`/test/view/${_this.examid}/picture/virtual`)
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

