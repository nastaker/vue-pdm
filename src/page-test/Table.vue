<template>
  <div class="frame">
    <div class="table-box">
      <div v-if="isView || isMark" class="view-header">
        <div>测验项目：{{exam.BuildPartName}}</div>
        <div>得分：{{exam.Score}}</div>
      </div>
      <div v-if="!(isView || isMark)" class="table-header">
        <div class="img-box">
          <img class="video-thumbnail" src="/static/test/video-thumbnail.png" @click="showVideo" />
        </div>
        <div class="button-box">
          <el-button size="small" @click="addRow">
            增加一行
          </el-button>
          <el-button size="small" @click="beforeRemoveRow">
            删除选中行
          </el-button>
          <el-button size="small" @click="linkPicture('测稿')">
            关联测稿
          </el-button>
          <el-button size="small" @click="linkPicture('虚拟照片')">
            关联照片
          </el-button>
          <el-button size="small" @click="saveTable">
            保存
          </el-button>
        </div>
      </div>
      <el-table
        border
        :height="height"
        :data="data"
        :row-class-name="tableRowClassName"
        @row-click="rowClick">
        <el-table-column 
          fixed
          type="index">
        </el-table-column>
        <el-table-column
          fixed
          label="构件组合"
          width="120">
          <template slot-scope="scope">
            <input v-if="scope.row.status" v-model="scope.row.part" class="input" />
            <span v-else>{{scope.row.part}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          label="构件"
          width="120">
          <template slot-scope="scope">
            <input v-if="scope.row.status" v-model="scope.row.item" class="input" />
            <span v-else>{{scope.row.item}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="式样说明"
          width="180">
          <template slot-scope="scope">
            <input v-if="scope.row.status" v-model="scope.row.desc1" class="input" />
            <span v-else>{{scope.row.desc1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="规格说明"
          width="180">
          <template slot-scope="scope">
            <input v-if="scope.row.status" v-model="scope.row.desc2" class="input" />
            <span v-else>{{scope.row.desc2}}</span>
          </template>
        </el-table-column>
        <el-table-column label="测稿编号">
          <template slot-scope="scope">
            <span>{{ getPictureName(scope.row.picture, '测稿') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="照片编号">
          <template slot-scope="scope">
            <span>{{ getPictureName(scope.row.picture, '虚拟照片') }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="(isView || isMark)" label="扣分">
          <template slot-scope="scope">
            <span>{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="(isView || isMark)" label="原因">
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="30%">
      <span>{{tip}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogPictureVisible"
      width="50%">
      <div v-if="dialogPictureVisible">
        <template v-for="pic in pictures">
          <el-checkbox v-if="pic.Type == type" :checked="isChecked(pic)" :key="pic.Id" @change="changePicture($event, pic)">
            <div>
              <img class="pic" :src="getPictureUrl(pic)" />
            </div>
            <div>{{pic.Name}}</div>
          </el-checkbox>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPictureVisible = false">确定</el-button>
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
  props: ['exam', 'isView', 'isMark'],
  data: () => ({
    height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 130,
    dialogVideoVisible: false,
    dialogVisible: false,
    dialogPictureVisible: false,
    currSelect: undefined,
    dialogConfirmFunc: undefined,
    dialogTitle: undefined,
    pictures: [],
    type: undefined,
    tip: '',
    data: [

    ]
  }),
  mounted() {
    let _this = this
    let h = 130
    if(this.exam){
      this.getTable()
      this.getPictures()
    }
    if (_this.isView || _this.isMark) {
      h = 100
    }
    window.onresize = () => {
      window.fullHeight = document.documentElement.clientHeight
      _this.height = window.fullHeight - h
    }
  },
  watch: {
    '$route'(to, from) {
      if (this.isView || this.isMark) {
        return
      }
      if (to.path.indexOf('/table')) {
        if(this.exam){
          this.getTable()
          this.getPictures()
        }
      }
    },
    height(val) {
      // 这里的定时器是为了优化，如果频繁调用window.onresize方法会造成页面卡顿，增加定时器会避免频繁调用window.onresize方法
      if (!this.timer) {
        this.height = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    }
  },
  methods: {
    dialogConfirm() {
      this.dialogConfirmFunc()
    },
    tableRowClassName({row, rowIndex}) {
      if (row.order > 1000) {
        return 'noinput-row'
      } else if (row.score < 0) {
        return 'error-row'
      }
      return ''
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
    },
    rowClick(row, column, event) {
      if (this.isView || this.isMark) {
        return
      }
      if (this.currSelect == row) {
        return
      }
      if (this.currSelect) {
        this.currSelect.status = false
      }
      if (!row.status) {
        row.status = true
        this.currSelect = row
      }
    },
    addRow() {
      let part = ''
      if (this.currSelect) {
        this.currSelect.status = false
      }
      this.currSelect = {
        status: true,
        part: part,
        item: '',
        desc1: '',
        desc2: '',
        picture: []
      }
      this.data.push(this.currSelect)
    },
    beforeRemoveRow() {
      let _this = this
      _this.data = _this.data.filter(d => d !== _this.currSelect)
    },
    isChecked(pic) {
      let _this = this
      let isChecked = false
      for (let i = 0, j = _this.currSelect.picture.length; i < j; i++) {
        if (pic.Id === _this.currSelect.picture[i]) {
          isChecked = true
          break
        }
      }
      return isChecked
    },
    changePicture(val, pic) {
      let _this = this
      let data = _this.currSelect.picture
      if (val) {
        data.push(pic.Id)
      } else {
        for(let i = 0, j = data.length; i < j; i++) {
          if(data[i] == pic.Id) {
            data.splice(i, 1)
            break
          }
        }
      }
    },
    linkPicture(type) {
      let _this = this
      if (!_this.currSelect) {
        return
      }
      _this.type = type
      _this.dialogTitle = '关联' + type
      _this.dialogPictureVisible = true
    },
    getPictures() {
      let _this = this
      _this.$http.post('/exam/getPictures', {
        examId: _this.exam.Id
      }).then(function(response){
        if (response.data) {
          _this.pictures = response.data
        }
      })
    },
    getPictureName(pics, type) {
      let str = ''
      if (pics && pics.length > 0) {
        for (let a = 0, b = pics.length; a < b; a++) {
          for (let i = 0, j = this.pictures.length; i < j; i++) {
            let pic = this.pictures[i]
            if (pics[a] == pic.Id && type == pic.Type) {
              str = str + pic.Name + ','
            }
          }
        }
      }
      return str
    },
    getPictureUrl(pic) {
      return `${process.env.VUE_APP_API}/exam/picture/${pic.Id}`
    },
    getTable() {
      let _this = this
      _this.$http.get(`/exam/getTable?examId=${_this.exam.Id}`)
        .then(function(response){
          if (response.data) {
            let result = response.data
            for(let i = 0; i < result.length; i++) {
              if(!(result[i].picture instanceof Array)) {
                result[i].picture = []
              }
              result[i].status = false
            }
            _this.data = result
          }
        })
    },
    saveTable() {
      let _this = this
      if (_this.data.length == 0) {
        _this.$message('没有数据需要保存！')
        return
      }
      _this.$http.post('/exam/saveTable', {
        examId: _this.exam.Id,
        boms: _this.data
      }).then(function(response){
        let result = response.data
        if (result && result.length > 0) {
          _this.data = []
          for(let i = 0, j = result.length; i < j; i++) {
            _this.data.push({
              status: false,
              part: result[i].Part,
              item: result[i].Item,
              desc1: result[i].Desc1,
              desc2: result[i].Desc2,
              picture: result[i].PictureIds
            })
          }
          _this.$message('保存成功')
        }
      })
    }
  }
}
</script>

<style>
  .el-table .noinput-row {
    background-color: #e9cba8;
  }
  .el-table .error-row {
    background-color: oldlace;
  }
</style>
<style scoped>
  .frame {
    flex: 1;
    width: 60%;
  }
  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px;
  }
  .table-header {
    display: flex;
    align-items: center;
  }
  .table-header .img-box {
    padding: 10px;
    border-right: 1px solid #dedede;
  }
  .table-header .button-box {
    padding: 10px;
  }
  .input {
    outline: 0;
    font-size: 16px;
    line-height: 30px;
    width: 100%;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    border-collapse: collapse;
    border-color: #dedede;
    padding: 0 5px;
    box-sizing: border-box;
  }
  .video-thumbnail {
    cursor: pointer;
    width: 100px;
  }
  .pic {
    width: 100px;
  }
</style>

