<template>
  <div class="frame">
    <div class="header">
      <div>
        <img class="video-thumbnail" src="/static/test/video-thumbnail.png" @click="showVideo" />
      </div>
      <div>
        当前：{{bill.Name}}
        <el-button size="small" v-if="!isView" :disabled="disabled" @click="beforeSaveTools">保存</el-button>
      </div>
    </div>
    <div v-if="!isView" class="transfer-box">
      <el-transfer
      :titles="['工具列表','已选择工具']"
      :render-content="renderFunc"
      :props="{
        key: 'Id',
        label: 'Name'
      }"
      v-model="selected"
      :data="tools">
      </el-transfer>
    </div>
    <div v-else>
      <ul class="selected-tools">
        <li>
          已选择工具：
        </li>
        <li v-for="tool in vtools" :key="tool.Id">
          <div>
            <img class="tool-image" :src="tool.FullName" />
            {{tool.Name}}
          </div>
          <div>数量：{{tool.count}}</div>
        </li>
      </ul>
    </div>
    <el-dialog
      title="确认选择"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%">
      <div>
        <div>请输入所选工具所需的数量，默认都为1</div>
        <div v-for="tool in selectedTools" :key="tool.Id">
          <img class="tool-image" :src="tool.FullName" />
          <span>{{tool.Name}}</span>
          <el-input type="number" min="1" max="5" v-model="tool.count"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="saveTools">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="视频导航"
      :visible.sync="dialogVideoVisible"
      @close="hideVideo"
      width="50%">
      <div>
        <video ref="video" width="100%" height="100%" controls="controls">
          <source src="/static/test/mp4/01.mp4" type="video/mp4" />
        </video>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['exam', 'bill', 'selectedTools', 'tools', 'isView', 'vtools'],
  data: () => ({
    disabled: false,
    dialogVisible: false,
    dialogResult: false,
    dialogVideoVisible: false,
    selected: []
  }),
  watch: {
    exam() {
    },
    bill() {
      this.selected = []
    }
  },
  methods: {
    beforeSaveTools() {
      let _this = this
      let toolCount = _this.tools.length
      let selToolCount = _this.selected.length
      while(_this.selectedTools.length > 0) {
        _this.selectedTools.pop()
      }
      if (selToolCount == 0) {
        _this.$message({
          showClose: true,
          message: '请选择工具！',
          type: 'error'
        });
        return
      }
      for (let i = 0; i < toolCount; i++) {
        for (let j = 0; j < selToolCount; j++) {
          if (_this.tools[i].Id == _this.selected[j]) {
            _this.selectedTools.push(_this.tools[i])
            _this.tools[i].count = 1
            break
          }
        }
      }
      _this.dialogVisible = true
    },
    saveTools() {
      let _this = this
      _this.disabled = true
      _this.$http.post('/exam/saveTools', {
        examId: _this.exam.Id,
        tools: _this.selectedTools,
        bill: _this.bill
      }).then(function(response){
        let result = response.data
        _this.disabled = false
        _this.dialogVisible = false
        // 清空已选
        _this.selected = []
        if (result.ExamId) {
          _this.bill.Score = result.bill.Score
          _this.bill.GroupId = result.bill.GroupId
          // 工具选择正确
          _this.$message('工具选择正确，请在二维图中放置工具对应的位置。')
          // 播放动画
          _this.$emit('showResult')
        } else {
          // 返回的是Exam对象，判断是否通过
          if (result.Status == '不及格') {
            // 未通过
            _this.$emit('fail')
          } else {
            // 工具选择正确
            _this.$message('工具选择正确，请在二维图中放置工具对应的位置。')
            _this.bill.Score = 100
            _this.bill.GroupId = result.Id
            // 播放动画
            _this.$emit('showResult')
            _this.$emit('pass')
          }
        }
      }).catch(function(){
        _this.disabled = false
        _this.dialogVisible = false
      })
    },
    renderFunc(h, option) {
      return <div>
        <img class="tool-image" src={option.FullName} />
        <span>{option.Name}</span>
      </div>
    },
    dialogClse() {
    },
    showVideo() {
      this.dialogVideoVisible = true
      if (this.$refs.video) {
        this.$refs.video.play()
      }
    },
    hideVideo() {
      if (this.$refs.video) {
        this.$refs.video.pause()
      }
    }
  }
}
</script>

<style>
  .tool-image {
    height: 32px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .el-transfer {
    height: 100%;
  }
  .el-transfer-panel {
    width: 220px;
  }
  .el-transfer__buttons {
    padding: 0 10px;
  }
  .el-transfer-panel__body {
    height: 100%;
  }
  .el-transfer-panel__list {
    height: 400px;
  }
  .el-transfer-panel__empty {
    height: 400px !important;
  }
</style>
<style scoped>
  .selected-tools {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .selected-tools li{
    display: flex;
    margin: 10px;
    justify-content: space-between;
    align-items: baseline;
  }  
  .frame {
    width: 520px;
    border-right: 1px solid #dedede;
  }
  .header {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dedede;
  }
  .video-thumbnail {
    cursor: pointer;
    width: 100px;
  }

  .transfer-box {
    padding: 10px;
  }
</style>

