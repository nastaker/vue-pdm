<template>
  <el-container>
    <el-aside width="150px">
      <el-menu
        background-color="#E7EFF3"
        text-color="#333">
        <el-menu-item-group v-for="(bill,i) in bills" :key="i">
          <template slot="title">{{bill.Name}}</template>
          <el-menu-item :disabled="bill.tool" @click="menuClick(bill, 'tool', i)">
            <i style="margin-right: 10px" class="glyphicon glyphicon-wrench"></i>
            <span>工具选择</span>
          </el-menu-item>
          <el-menu-item :disabled="bill.dialog" @click="menuClick(bill, 'label', i)">
            <i style="margin-right: 10px" class="glyphicon glyphicon-pencil"></i>
            <span>断面标注</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-aside>
    <el-main>
      <keep-alive>
        <router-view v-if="bill" :isView="true" :exam="exam" :bill="bill" :tools="tools" :vtools="vtools" @showResult="showResult" @measure="measure"></router-view>
      </keep-alive>
      <iframe frameborder="0" ref="iframe" src="/static/v101/index.htm" />
      
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
    exam: undefined,
    bill: undefined,
    dialogResult: false,
    type: 0,
    types: [
      '/static/test/测量1.png',
      '/static/test/测量2.png',
      '/static/test/测量3.png'
    ],
    timer: undefined,
    bills: [],
    tools: [],
    selectedTools: [],
    vtools: [],
    buildSurvey: [ ]
  }),
  computed: {
    examid() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.getSurvey()
    this.getExam()
    this.getTools()
  },
  methods: {
    getSurvey() {
      let _this = this
      _this.$http.get('/exam/getSurvey')
        .then(function(response) {
          _this.buildSurvey = response.data
        })
    },
    getExam() {
      let _this = this
      _this.$http.get('/exam/get/' + _this.examid)
        .then(function(response) {
          _this.exam = response.data.exam
          _this.bills = response.data.bills
          _this.selectedTools = response.data.tools
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
    getToolArr() {
      let _this = this
      let bill = _this.bill
      let tools = _this.tools
      let selectedTools = _this.selectedTools
      _this.vtools = []
      for(let i = 0; i < selectedTools.length; i++) {
        if(selectedTools[i].BillId === bill.Id) {
          for(let j = 0; j < tools.length; j++) {
            if (tools[j].Id === selectedTools[i].ToolId) {
              tools[j].count = selectedTools[i].Count
              _this.vtools.push(tools[j])
            }
          }
        }
      }
    },
    measure(val) {
      clearTimeout(this.timer)
      if(typeof(this.$refs.iframe.contentWindow.DoMeasure) === 'function') {
        this.$refs.iframe.contentWindow.DoMeasure(val)
      }
    },
    playAnim(type, to) {
      let _this = this
      _this.measure(type)
      if (typeof(to) == 'number' && type < to) {
        _this.timer = setTimeout(function(){
          _this.playAnim(type+1, to)
        }, 2500)
      }
    },
    showResult(type, timeout) {
      let _this = this
      let bill = _this.bill
      _this.type = type
      let toolName = ''
      if (_this.vtools.length > 0) {
        toolName = _this.vtools[0].Name
      }
      if (bill.Name == '柱径测量') {
        if(toolName == '直角尺') {
          _this.playAnim(102)
        } else if(toolName.indexOf('小钢尺') > -1 && _this.vtools.length == 1) {
          _this.playAnim(103)
        } else {
          _this.playAnim(101)
        }
      } else if (bill.Name == '台阶水平测量') {
        // 要播放4次
        _this.playAnim(301, 304)
      } else if (bill.Name == '台阶垂直测量') {
        _this.playAnim(401, 404)
      }
      if (!timeout) {
        _this.dialogResult = true
      } else {
        setTimeout(function(){
          _this.dialogResult = true
        }, timeout)
      }
      // 隐藏tool
      _this.$router.push('/test/view2/' + _this.examid)
    },
    menuClick(bill, type, i) {
      this.measure(100)
      this.bill = bill
      this.getToolArr()
      switch(type) {
        case 'tool':
          this.$router.push('/test/view2/' + this.examid + '/tool')
          break;
        case 'label':
          this.showResult(i)
          break;
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

