<template>
  <div class="frame">
    <div class="header">
      <div>
        <img @click="showVideo" class="video-thumbnail" src="/static/test/video-thumbnail.png" />
      </div>
      <div>
        {{typeStr}}
      </div>
    </div>
    <div class="upload-box">
      <div v-if="!(isView || isMark)">
        <el-upload
          class="upload-demo"
          accept=".jpg,.png,.gif,.bmp,.jpeg"
          :data="data"
          :headers="headers"
          :action="url"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :show-file-list="false"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button> 请上传图片格式文件，支持：jpg、jpeg、png、gif、bmp；
        </el-upload>
      </div>
      <div v-if="isMark">
        <el-row>
          <el-col :span="20">
            {{bill.Name}}评语
          </el-col>
          <el-col :span="4">
            分数
          </el-col>
        </el-row>
        <el-row style="margin-top:10px;margin-bottom:10px;">
          <el-col :span="20" style="padding-right:10px;"> 
            <el-autocomplete
            class="textarea-remark"
            :fetch-suggestions="querySearch"
            type="textarea"
            :rows="3"
            v-model="bill.Remark"
            ></el-autocomplete>
          </el-col>
          <el-col :span="4">
            <el-input class="custom-apped" type="number" v-model="score" @change="inputScore">
              <template slot="append">/{{maxScore}}</template>
            </el-input>
            <el-button class="btnMark" size="small" type="primary" @click="preMark">评分</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-if="isView">
        <el-row>
          <el-col :span="20">
            评语：{{bill.Remark}}
          </el-col>
          <el-col :span="4">
            分数：{{score}}
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="10" v-for="(page, i) in files" :key="i">
        <el-col :span="6" v-for="(file, j) in page" :key="j">
          <div class="img-content">
            <div class="img-box">
              <img :src="file.url" />
            </div>
            <div class="img-name-box">
              <div class="img-name">{{file.name}}</div>
              <i v-if="!(isView || isMark)" @click="deletePicture(i * 4 + j)" class="img-del-icon el-icon-delete"></i>
            </div>
            <div @click="viewPicture(i * 4 + j)" class="layer">
              <i class="el-icon-view"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialogPicture">
        <div v-if="fileList && fileList.length > 0">
          <img style="width:100%" :src="fileList[imageIndex].url" />
        </div>
      </el-dialog>
      <el-dialog
        title="视频导航"
        :visible.sync="dialogVideoVisible"
        @close="hideVideo"
        width="50%">
        <div :style="{display: type=='virtual'?'':'none'}">
          <video ref="video1" width="100%" height="100%" controls="controls">
            <source src="/static/test/mp4/02.mp4" type="video/mp4" />
          </video>
        </div>
        <div :style="{display: type=='sketch'?'':'none'}">
          <video ref="video2" width="100%" height="100%" controls="controls">
            <source src="/static/test/mp4/03.mp4" type="video/mp4" />
          </video>
        </div>
      </el-dialog>
      <el-dialog
        title="评分结果"
        :visible.sync="dialogMarkVisible"
        width="50%">
        评分已完成，该学生最终得分为：{{finalScore}}
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogMarkVisible = false">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ['exam', 'bill', 'maxScore', 'isView', 'isMark'],
  data() {
    return {
      score: 0,
      finalScore: 0,
      imageIndex: 0,
      dialogPicture: false,
      dialogVideoVisible: false,
      dialogMarkVisible: false,
      headers: {
        Authorization: 'Bearer ' + this.$store.getters['user/getUser'].token
      },
      data: {
        index: 0,
        examId: 0,
        type: '',
      },
      fileList: [],
      remarklist: []
    }
  },
  mounted() {
    this.setData()
    this.getPicture()
  },
  watch: {
    '$route'(to, from) {
      if (to.path.indexOf('/picture') >= 0) {
        this.setData()
        this.getPicture()
      }
    },
    exam() {
      this.setData()
      this.getPicture()
    }
  },
  computed: {
    typeStr() {
      if (this.type == 'virtual') {
        return '虚拟照片'
      } else if (this.type == 'sketch') {
        return '测稿'
      }
    },
    type() {
      return this.$route.params.type
    },
    url () {
      return process.env.VUE_APP_API+'/exam/upload'
    },
    files () {
      let f = []
      this.fileList.forEach((item, index) => {
        let page = Math.floor(index / 4)
        if (!f[page]) {
          f[page] = []
        }
        f[page].push(item)
      })
      return f
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let _this = this
      if (_this.remarklist.length == 0) {
        _this.$http.get('/exam/getRemark')
          .then(function(response) {
            _this.remarklist = response.data
            cb(_this.remarklist)
          })
          .catch(function(error){
            cb([])
          })
      } else {
        cb(_this.remarklist)
      }
    },
    getPicture() {
      let _this = this
      _this.fileList = []
      if (!_this.exam) {
        return
      }
      _this.$http.post('/exam/getPictures', {
        examId: _this.exam.Id,
        type: _this.typeStr,
      }).then(function(response) {
        let images = response.data
        if (images instanceof Array) {
          for(let i = 0, j = images.length; i < j; i++) {
            _this.fileList.push({
              id: images[i].Id,
              name: images[i].Name,
              url: `${process.env.VUE_APP_API}/exam/picture/${images[i].Id}`
            })
          }
        }
      })
    },
    setData() {
      let _this = this
      if (_this.exam) {
        _this.remark = ''
        _this.data.examId = _this.exam.Id
        _this.data.type = _this.typeStr
      }
      if (_this.isView || _this.isMark) {
        _this.score = _this.bill.Score
      }
    },
    showVideo() {
      this.dialogVideoVisible = true
      
      if (this.type == 'virtual') {
        if (this.$refs.video1) {
          this.$refs.video1.play()
        }
      } else if (this.type == 'sketch') {
        if (this.$refs.video2) {
          this.$refs.video2.play()
        }
      }
    },
    hideVideo() {
      if (this.$refs.video1) {
        this.$refs.video1.pause()
      }
      if (this.$refs.video2) {
        this.$refs.video1.pause()
      }
    },
    beforeUpload(file)	 {
      let _this = this
      if (_this.data.index < _this.fileList.length) {
        _this.data.index = _this.fileList.length
      }
      _this.data.index++
    },
    viewPicture(imageIndex) {
      this.imageIndex = imageIndex
      this.dialogPicture = true
    },
    deletePicture(imageIndex) {
      let _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = _this.fileList[imageIndex].id
        _this.$http.get(`exam/removePicture/${id}`)
          .then(function(response){
            _this.fileList.splice(imageIndex,1)
          }).catch(function(error){
            _this.$message({
              type: 'error',
              message: '删除失败，请联系管理'
            });  
          })
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.code !== '0') {
        this.$message({
          type: 'error',
          message: response.msg
        });
      }
      file.id = file.response.obj.Id
      file.name = file.response.obj.Name
      this.fileList.push({
        id: file.id,
        name: file.name,
        url: file.url
      })
    },
    inputScore(val) {
      if (val > this.maxScore) {
          this.score = this.maxScore
      }
    },
    preMark() {
      let _this = this
      _this.$confirm('确认提交评卷信息吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function(){
        _this.bill.Score = _this.score
        _this.$http.post(`exam/preMark`, _this.bill)
          .then(function(r1){
            if (r1.data.final) {
              _this.$confirm(`实验成绩${r1.data.score}分，实验结果${r1.data.result}，是否确认结束阅卷？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(function(){
                  _this.mark()
                })
            } else {
              _this.mark()
            }
          }).catch(function(error){
            _this.$message({
              type: 'error',
              message: '评卷失败，请联系管理'
            });  
          })
      })
    },
    mark() {
      let _this = this
      _this.$http.post(`exam/mark`, _this.bill)
        .then(function(r2){
          _this.$message({
            type: 'info',
            message: r2.data.msg
          });
          if (r2.data.final) {
            _this.dialogMarkVisible = true
            _this.finalScore = r2.data.score
          }
        })
    }
  }
}
</script>

<style>
  .custom-apped .input::-webkit-outer-spin-button,
  .custom-apped input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .custom-apped input[type="number"]{
    -moz-appearance: textfield;
  }
  .custom-apped .el-input__inner{
    padding: 0 10px !important;
  }
  .custom-apped .el-input-group__append {
    padding: 0 10px !important;
  }
</style>


<style scoped>
  .frame {
    width: 600px;
    height: 100%;
    border-right: 1px solid #dedede;
  }
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dedede;
  }
  .upload-box {
    padding: 10px;
  }
  .upload-demo {
    margin: 10px 0;
  }
  .btnMark {
    width: 100%;
  }
  .textarea-remark {
    width: 100%;
  }
  .video-thumbnail {
    cursor: pointer;
    width: 100px;
  }
  .img-content{
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    border:1px solid #d1dbe5;
    border-radius:4px;
    box-shadow:0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  .img-name-box {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 5px;
  }
  .img-del-icon {
    cursor: pointer;
  }
  .img-content .img-box{
    height:130px;
    line-height: 130px;
    text-align: center;
  }
  .img-content .img-box img{
    height: 100%;
  }
  .img-content .layer{
    position:absolute;
    left: 0;
    right: 0;
    top: 0;
    cursor: pointer;
    height:130px;
    color:#fff;
    text-align:center;
    z-index:5;
    background-color:rgba(0,0,0,.4);
    opacity:0;
    transition:all .3s;
  }
  .img-content:hover .layer{
    opacity: 1;
  }
  .img-content .layer i{
    font-size:1.6em;
    line-height: 130px;
  }
</style>


