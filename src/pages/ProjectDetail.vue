<template>
  <div class="container">
    <el-tabs v-if="loaded" v-model="activeName" style="height: inherit;">
      <!-- 选项卡 - 注意slot="title" -->
      <el-tab-pane
      v-for="(tab, index) in page.tabs"
      :key="tab.guid"
      :name="index.toString()"
      :label="tab.name">
        <!-- 显示表格或其他控件 -->
        <n-table v-if="tab.type=='grid'" :tab="tab" :page="page" />
        <n-tree v-else-if="tab.type=='tree'" :tab="tab" :page="page" />
        <n-explorer v-else-if="tab.type=='browser'" :tab="tab" :page="page" />
        <n-control v-else-if="tab.type=='field'" ref="control" :tab="tab" :page="page" :files="files" v-model="formData" @finish="finish" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

export default {
  name: 'ProjectDetail',
  data: () => ({
    loaded: false,
    activeName: "0",
    page: {},
    formData: {},
    files: []
  }),
  mounted () {
    // 初始化页面，获取到当前需要的参数
    // 利用localstorage获取保存的参数
    let _this = this
    let param = _this.$store.getters['user/getParam']
    _this.$http.post('/action', param).then((response) => { 
      _this.page = response.data
      _this.loaded = true
    })
  },
  methods: {
    handleClose () {
      let _this = this
      _this.$emit('dialogClose')
    },
    dialogOk () {
      let _this = this
      // 调用上传，如果有返回值，则将返回值加入到form后提交form
      if (!_this.$refs.control[0].upload()) {
        // 不需要上传，手动触发finish
        _this.finish([])
      }
    },
    finish (resultArr) {
      let _this = this
      // 回调失败
      if (!resultArr) {
        _this.$emit('dialogClose')
        return
      }
      // 回调成功
      if (resultArr instanceof Array && resultArr.length > 0) {
        // 如有文件上传，则添加文件上传后的路径
        _this.formData['CN_FILEPATH'] = resultArr[0]
      }
      _this.$http.put('/data', _this.formData)
        .then((response) => {
          if (response.status === 200) {
            // 关闭弹窗
            _this.$emit('dialogClose', response.data)
          }
        })
    }
  }
}
</script>

<style scoped>
  .container {
    padding:0 10px;
    height:100%;
    border-left: 3px solid darkblue;
  }
</style>
