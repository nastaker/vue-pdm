<template>
  <el-container>
    <el-aside width="150px">
      <div class="nav-menu" v-for="(bill,i) in bills" :key="i">
        <div class="title">{{bill.Name}}</div>
        <div :class="{'img': true, 'img_blank': bill.canClick}" @click="start(bill, i)">
          <img :src="bill.icon" />
        </div>
      </div>
      <div class="nav-menu" v-if="canExit" @click="exit">
        退出考试
      </div>
    </el-aside>
    <el-main>
      <keep-alive>
        <router-view v-if="bill" :exam="exam" :bill="bill" :selectedTools="selectedTools" :tools="tools" @showResult="showResult" @pass="pass" @fail="fail"></router-view>
      </keep-alive>
      <div class="iframe-box">
        <div v-if="bill" class="left">
          <img :src="bill.img" />
        </div>
        <iframe class="right" frameborder="0" ref="iframe" src="/static/3d/index.htm" />
      </div>
      <el-dialog
        :title="title"
        :visible.sync="dialogTip"
        :before-close="handleClose"
        width="50%">
        <span v-html="content"></span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="nextTip">{{button}}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="二维图"
        :show-close="false"
        :fullscreen="true"
        :visible.sync="dialogErwei"
        :close-on-click-modal="false">
        <el-row>
          <el-col :span="4">
            <ul class="ul-draglist">
              <li v-for="(t,index) in surveyGroupTools" :key="index">
                <img 
                  :data-index="index"
                  :draggable="true"
                  @dragstart="dragStart($event, t, index)"
                  @dragend="dragEnd"
                  :src="t.Angle == 0 ? t.Img : t.ImgRotate"
                />
                <div class="icon-rotate" @click="rotate(t)" title="旋转工具">
                  <i class="ion ion-md-refresh"></i>
                </div>
                <div>{{t.ToolName}}</div>
              </li>
            </ul>
          </el-col>
          <el-col :span="20">
            <div id="target">
              <img :src="!canShowResult?surveyGroup.ImgBefore:surveyGroup.ImgAfter" />
            </div>
            <div>{{surveyGroup.Name}}</div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <span>*请拖动工具图片到右图</span>
          <span>
            <el-button @click="showFinal">下一步</el-button>
          </span>
        </span>
      </el-dialog>
      <el-dialog
        title="结果"
        :visible.sync="dialogResult"
        :close-on-click-modal="false"
        width="50%">
        <div>
          <img style="width:100%" :src="types[type]" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogResult = false">确定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data: () => ({
    dialogTip: false,
    dialogErwei: false,
    dialogResult: false,
    canShowResult: false,
    canExit: false,
    title: '',
    content: '',
    button: '',
    currTipIndex: 0,
    exam: undefined,
    bill: undefined,
    bills: [],
    tools: [],
    surveyGroup: [],
    selectedTools: [],
    surveyGroupTools: [],
    buildSurveys: [],
    type: 0,
    types: [
      '/static/test/测量1.png',
      '/static/test/测量2.png',
      '/static/test/测量3.png'
    ],
    tips: [
      {
        title: '提示一',
        content: `
        <h3>考核要求：</h3>
        <p>（1）技术方案合理</p>
        <p>（2）工具装备选择正确并能正确使用</p>
        <p>（3）测量误差在±2mm内</p>
        `,
        button: '下一条'
      },
      {
        title: '提示二',
        content: `
        <p>本项实验，有两个建筑部位，三个考评部分：</p>
        <p>（1）柱径测量</p>
        <p>（2）台阶水平尺寸测量</p>
        <p>（3）台阶重直尺寸测量</p>
        <p>在进入正式测试环境后，在左侧的主控菜单中，按顺序完成三项测量。
        `,
        button: '下一条'
      },
      {
        title: '提示三',
        content: `
        <h3>在点击【下一步】按钮后，将正式计时开始，请注意：</h3>
        <p>实验需要在规定时间内完成，否则为不通过。</p>
        <p>注：三维模型打开需要一定时间。</p>
        `,
        button: '下一步'
      }
    ]
  }),
  mounted() {
    let _this = this
    _this.title = _this.tips[_this.currTipIndex].title
    _this.content = _this.tips[_this.currTipIndex].content
    _this.button = _this.tips[_this.currTipIndex].button
    _this.getExam()
    window.api = {}
    window.api.tool = _this.menuClick
  },
  watch: {
    '$route' (to, from) {
      if (to.path == '/test/start2') {
        this.bill = undefined
      }
    }
  },
  methods: {
    exit() {
      this.$emit('examStop')
      this.$router.push('/test/end')
    },
    _measure(val) {
      if(typeof(this.$refs.iframe.contentWindow.DoMeasure) === 'function') {
        this.$refs.iframe.contentWindow.DoMeasure(val)
      }
    },
    _showkey(i) {
      switch(i) {
        case 0:
          if(typeof(this.$refs.iframe.contentWindow.DoMeasure) === 'function') {
            this.$refs.iframe.contentWindow.showKey2()
          }
          break;
        default:
          if(typeof(this.$refs.iframe.contentWindow.DoMeasure) === 'function') {
            this.$refs.iframe.contentWindow.showKey1()
          }
          break;
      }
    },
    measure_seq(from, to, timeout = 3000) {
      let _this = this
      setTimeout(function(){
        _this._measure(from)
        if (from < to) {
          from = from + 1
          _this.measure_seq(from, to, timeout)
        }
      }, timeout)
    },
    measure(type) {
      switch(type) {
        case 1:
          this._measure(102)
          break
        case 2:
          this._measure(101)
          break
        case 6:
          this._measure(103)
          break
        case 3:
          this.measure_seq(301, 304)
          break
        case 5:
          this.measure_seq(401, 404)
          break
      }
    },
    showResult() {
      let _this = this
      _this.dialogErwei = true
      _this.getSurveyGroupTools()
      _this.getSurveyGroup()
      // 隐藏tool
      _this.$router.push('/test/start2')
    },
    getSurvey() {
      let _this = this
      _this.$http.get('/exam/getSurvey')
        .then(function(response) {
        })
    },
    getTools() {
      let _this = this
      _this.$http.get('/exam/getTools')
        .then(function(response){
          if (response.data) {
            let result = response.data
            for (let i = 0, j = result.length; i < j; i++) {
              result[i].count = 1
            }
            _this.tools = result
          }
        })
    },
    getSurveyGroup() {
      let _this = this
      _this.$http.get(`/exam/getSurveyGroup/${_this.bill.GroupId}`)
        .then(function(response){
          if (response.data) {
            _this.surveyGroup = response.data
          }
        })
    },
    getSurveyGroupTools() {
      let _this = this
      _this.$http.get(`/exam/getSurveyGroupTools/${_this.bill.GroupId}`)
        .then(function(response){
          if (response.data) {
            let groupTools = response.data
            // 处理下数据，将其中没有的从tools加入
            for (let j = 0; j < _this.selectedTools.length; j++) {
              let stool = _this.selectedTools[j]
              let isNeedAdd = true
              for (let i = 0; i < groupTools.length; i++) {
                let groupTool = groupTools[i]
                if (groupTool.ToolId == stool.Id) {
                  // 有这条，不需要加入
                  isNeedAdd = false
                  break
                }
              }
              if (isNeedAdd) {
                stool.Img = stool.FullName
                stool.ImgRotate = stool.FullName
                stool.ToolName = stool.Name
                groupTools.push(stool)
              }
            }
            _this.surveyGroupTools = groupTools
          }
        })
    },
    getExam() {
      // 获取试题，如果有
      let _this = this
      let groupUsers = _this.$store.getters['exam/getGroupUser']
      _this.$http.post('/exam/get',{
        userguid: _this.$store.getters['user/getUser'].userguid,
        groupusers: groupUsers,
        type: "虚拟测量"
      })
        .then(function(response) {
          _this.exam = response.data.exam
          _this.buildSurveys = response.data.buildSurveys
          _this.$emit('examStart', _this.exam)
          _this.bills = _this.reloadState(response.data.bills)
          _this.getTools()
          if(_this.exam.Status == "Y") {
            _this.dialogTip = true
          }
        })
    },
    reloadState(bills) {
      let lastIndex = -1
      if (!bills) {
        bills = this.bills
      }
      for (let i = 0; i < bills.length; i++) {
        let bill = bills[i]
        bill.canClick = true
        bill.dialog = true
        bill.icon = this.buildSurveys[i].Icon
        if (bill.Score) {
          lastIndex = i
          bill.dialog = false
        }
        if (i == lastIndex + 1) {
          bill.canClick = false
        }
      }
      return bills
    },
    rotate(t) {
      if (t.Angle === 0) {
        t.Angle = 90
      } else {
        t.Angle = 0
      }
    },
    dragStart(event, item, index) {
      if (this.canShowResult) {
        return
      }
      if (!item.GroupId) {
        return
      }
      if (item.Angle !== item.RightAngle) {
        return
      }
      let leftTop = item.PositionLeftTop.split(',')
      let rightBottom = item.PositionRightBottom.split(',')
      let target = document.getElementById('target')
      let mask = document.getElementById('mask' + index)
      if (!mask) {
        mask = document.createElement('div')
        mask.id = 'mask' + index
        mask.addEventListener('drop', this.drop, false)
        mask.addEventListener('dragover', function(event){
          event.preventDefault()
        }, false)
        target.appendChild(mask)
      }
      mask.style.left = leftTop[0] + 'px'
      mask.style.top = leftTop[1] + 'px'
      mask.style.height = (rightBottom[1] - leftTop[1]) + 'px'
      mask.style.width = (rightBottom[0] - leftTop[0])  + 'px'
      mask.className = 'maskCommon'
      event.dataTransfer.setData('index', index)
    },
    dragEnd(event) {
      let _this = this
      setTimeout(function(){
        let index = event.srcElement.dataset.index
        if (!_this.surveyGroupTools[index].dragged && event.dataTransfer.dropEffect === 'none') {
          let ele = document.getElementById('mask' + index)
          if (ele) {
            ele.className = 'maskCommon hide'
          }
          event.dataTransfer.clearData()
        }
      }, 100)
    },
    drop (event) {
      let data = this.surveyGroupTools[event.dataTransfer.getData('index')]
      if(data) {
        if (event.srcElement.childNodes.length == 0) {
          let child = document.createElement('img')
          child.src = data.Angle == 0 ? data.Img : data.ImgRotate
          event.srcElement.appendChild(child)
          data.dragged = true
        }
      }
    },
    showFinal() {
      if (this.canShowResult) {
        // 最后一个下一步，关闭
        this.reloadState()
        this.dialogErwei = false
        this.canShowResult = false
        this.measure(this.surveyGroupTools[0].GroupId)
        let nodes = document.getElementsByClassName('maskCommon')
        for(let i = 0, j = nodes.length-1; i <= j; j--) {
          nodes[j].remove()
        }
        return
      }
      let canShow = true
      for(let i = 0, j = this.surveyGroupTools.length; i < j; i++) {
        if(this.surveyGroupTools[i].GroupId && !this.surveyGroupTools[i].dragged) {
          canShow = false
          break
        }
      }
      if (!canShow) {
        this.$message('尚未完成，不可进行下一步操作！')
        return
      }
      let nodes = document.getElementsByClassName('maskCommon')
      for(let i = 0, j = nodes.length; i < j; i++) {
        nodes[i].className = 'maskCommon hide'
      }
      this.canShowResult = canShow
    },
    start(bill, i) {
      let _this = this
      if (bill.canClick) {
        return
      }
      _this.bill = bill
      _this.bill.img = _this.buildSurveys[i].Img
      _this._showkey(i)
    },
    menuClick() {
      // 重置测量动画
      this._measure(100)
      this.canShowResult = false
      this.$router.push('/test/start2/tool')
    },
    handleClose (done) {
      if (this.currTipIndex >= this.tips.length - 1) {
        done()
      } else {
        this.currTipIndex++
        this.title = this.tips[this.currTipIndex].title
        this.content = this.tips[this.currTipIndex].content
        this.button = this.tips[this.currTipIndex].button
      }
    },
    nextTip() {
      if (this.currTipIndex >= this.tips.length - 1) {
        this.dialogTip = false
      } else {
        this.currTipIndex++
        this.title = this.tips[this.currTipIndex].title
        this.content = this.tips[this.currTipIndex].content
        this.button = this.tips[this.currTipIndex].button
      }
    },
    pass() {
      this.canExit = true
      this.$message('恭喜您，您已完成本次考试！')
    },
    fail() {
      this.canExit = true
      this.$message({
        showClose: true,
        message: '工具选择错误，本次考试失败。请重考！',
        type: 'error'
      });
    }
  }
}
</script>
<style>
  .maskCommon {
    position: absolute;
    background-color: rgb(211, 157, 41);
    opacity: 0.5;
    text-align: center;
  }
  .hide {
    display: none;
  }
</style>

<style scoped>
  .el-menu {
    height: 100%;
  }
  .el-main {
    height: 100%;
    display: flex;
    padding: 0;
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

  .ul-draglist {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ul-draglist li {
    position: relative;
    padding: 10px;
  }
  .ul-draglist li .icon-rotate {
    font-size: 2em;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .rotate90 {
    transform:rotate(90deg);
  }
  #target {
    position: relative;
  }
  .iframe-box {
    display: flex;
    flex: 1;
  }
  .iframe-box .left {
    flex: 1;
  }
  .iframe-box .left img{
    width: 100%;
  }
  .iframe-box .right {
    flex: 1;
  }

  .nav-menu {
  }

  .nav-menu .title{
    text-align: center;
    font-size: 16px;
    color: #909399;
    padding: 5px 0;
  }

  .nav-menu .img{
    cursor: pointer;
    padding: 0px 10px;
  }

  .nav-menu .img img{
    height: 100%;
    width: 100%;
  }
  
  .nav-menu .img_blank {
    opacity: 0.1;
    cursor: auto;
  }

  .el-aside {
    background-color: #efefef;
  }
</style>

