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
        <router-view :exam="exam"></router-view>
      </keep-alive>
      <iframe frameborder="0" :src="modelSrc" />
    </el-main>
    <el-dialog
      :title="tips[tipIndex].title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="50%">
      <span v-html="tips[tipIndex].content"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="next">{{tips[tipIndex].button}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择部位"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="dialog2Visible"
      :before-close="handleClose"
      width="50%">
      <div>
        <p>系统将随机分配部位：</p>
        <el-card :class="{active: examParts.some(function(elem){ return part.Name == elem.PartName })}" shadow="hover" class="box-card" :key="i" v-for="(part,i) in parts">
          <div slot="header" class="clearfix">
            <span>{{part.Name}}</span>
          </div>
          <div class="box-card-img-box">
            <img :src="part.FullName" />
          </div>
        </el-card>
        <div style="margin-top: 10px">系统已选择：<strong>{{examPartsStr}}</strong>，计时已经开始，请点击进入实验开始考试。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog2Visible = false">开始</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data: () => ({
    dialogVisible: false,
    dialog2Visible: false,
    tipIndex: 0,
    examPartsStr: '',
    parts: [],
    examParts: [],
    modelSrc: undefined,
    buildId: undefined,
    exam: undefined,
    menu: [
      {
        icon: 'glyphicon glyphicon-list',
        name: '构件表',
        path: '/test/start/table'
      },
      {
        icon: 'glyphicon glyphicon-picture',
        name: '虚拟照片',
        path: '/test/start/picture/virtual'
      },
      {
        icon: 'glyphicon glyphicon-leaf',
        name: '测稿',
        path: '/test/start/picture/sketch'
      },
      {
        icon: 'glyphicon glyphicon-fullscreen',
        name: '切换3D显示'
      },
      {
        icon: 'glyphicon glyphicon-saved',
        name: '交卷'
      }
    ],
    tips: [
      {
        title: '提示一',
        content: `
        <h3>建筑简介：</h3>
        <p>当前所选择进行测稿绘制的建筑为<strong>鲁班庙大殿</strong>。
        鲁班庙位于天津市蓟州区渔阳镇府后街1号。
        始建年代不详，清光绪三年（1877）重修，院内存清光绪重修公输子庙碑二通。
        大殿坐北朝南，面阔三间，前出廊用六檩，檐下施一斗二升交麻叶斗栱，角科宝瓶下出单昂。
        九脊歇山顶，绿琉璃瓦剪边。
        </p>
        `,
        button: '下一条'
      },
      {
        title: '提示二',
        content: `
        <h3>考核要求：</h3>
        <p>（1）对构件分类正确，表格填写完整正确（对照系统自动生成的构件表判定）</p>
        <p>（2）符合测绘徒手草图一般要求（构图合理、形体表达准确、线条清晰肯定、可读性较强等）</p>
        <p>（3）虚拟拍照：照片内容完整、构图合理，反映主题清晰。</p>
        `,
        button: '下一条'
      },
      {
        title: '提示三',
        content: `
        <h3>准备材料：</h3>
        <p>正式实验前，请将如下工具及材料准备齐全，以免考试时间受到影响：</p>
        <p>测稿纸（A4或A3白纸）、铅笔、橡皮、画板等工具。</p>
        `,
        button: '下一条'
      },
      {
        title: '提示四',
        content: `
        <h3>本项实验，有三个考评部分：</h3>
        <p>1、构件表</p>
        <p>2、草图绘制</p>
        <p>3、虚拟照片</p>
        <p>在进入正式测试环境后，在左侧的主控菜单中，分别按这三项进行测试成果的提交，不分先后。</p>
        `,
        button: '下一条'
      },
      {
        title: '提示五',
        content: `
        <p>在点击【下一步】按钮后，将正式计时开始，请注意：</p>
        <p>实验需要在时间限制内完成，否则为不通过。</p>
        <p>注：鲁班庙大殿的三维模型打开需要一定时间。</p>
        `,
        button: '下一步'
      }
    ]
  }),
  mounted() {
    let _this = this
    // 判断是否有query
    if (!_this.$route.query || !_this.$route.query.buildId) {
      _this.$message('请选择建筑！')
      return
    }
    _this.buildId = _this.$route.query.buildId
    // 获取试题，如果有
    this.getExam()
  },
  methods: {
    getParts() {
      let _this = this
      _this.$http.post(`/exam/getParts/${_this.buildId}`)
        .then(function(response) {
          _this.parts = response.data
        })
    },
    getExam() {
      let _this = this
      _this.$http.post('/exam/get',{
        userguid: _this.$store.getters['user/getUser'].userguid,
        type: "测稿编绘",
        buildId: _this.buildId
      })
        .then(function(response) {
          _this.exam = response.data.exam
          _this.examParts = response.data.examParts
          _this.modelSrc = response.data.modelSrc
          let examPartsStr = ''
          for(let i = 0; i < _this.examParts.length; i++) {
            let examPart = _this.examParts[i]
            examPartsStr = examPartsStr + examPart.PartName + ','
          }
          examPartsStr = examPartsStr.substr(0, examPartsStr.length - 1)
          if (_this.exam.Status == 'Y') {
            _this.getParts()
            _this.examPartsStr = examPartsStr
            _this.dialogVisible = true
          }
          _this.$emit('examStart', _this.exam, examPartsStr)
        })
    },
    to(menu) {
      let _this = this
      if (!_this.exam) {
        return
      }
      if (menu.name == '交卷') {
        _this.$confirm('是否确认交卷?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          _this.$http.get(`/exam/handIn?examId=${_this.exam.Id}`)
            .then(function(response){
              _this.$message({
                type: 'success',
                message: response.data
              });
              _this.$emit('examStop')
              _this.$router.push('/test/end')
            })
        })
      } else if (menu.name == '切换3D显示') {
        _this.$router.push('/test/start')
      } else {
        _this.exam.pagetype = menu.name
        _this.$router.push(menu.path)
      }
    },
    handleClose (done) {
      if (this.tipIndex >= this.tips.length - 1) {
        this.dialog2Visible = true
        done()
      } else {
        this.tipIndex++
      }
    },
    next() {
      if (this.tipIndex >= this.tips.length - 1) {
        this.dialogVisible = false
        this.dialog2Visible = true
      } else {
        this.tipIndex++
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
  .box-card {
    display: inline-block;
    width: 190px;
    height: 150px;
    margin-right: 5px;
  }
  .box-card.active {
    box-shadow: 0 2px 12px 0 rgba(0,0,0, 1);
  }
  .box-card-img-box img {
    width: 100%;
  }
</style>

