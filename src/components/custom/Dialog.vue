<template>
  <el-dialog
  v-if="showDialog"
  :title="page.name"
  :before-close="beforeDialogClose"
  :visible.sync="showDialog"
  :width="page.width+'px'">
    <span v-if="page.showButton == 'True'" slot="footer" class="dialog-footer">
      <el-button @click="$emit('dialogClose', false)">取 消</el-button>
      <el-button type="primary" @click="dialogOk">确 定</el-button>
    </span>
    <el-tabs v-model="activeName">
      <el-tab-pane
      v-for="(tab, index) in page.tabs"
      :key="tab.guid"
      :name="index.toString()"
      :label="tab.name">
        <!-- 显示表格或其他控件 -->
        <n-table v-if="tab.type=='grid'" :tab="tab" :page="page" />
        <n-tree v-else-if="tab.type=='tree'" :tab="tab" :page="page" />
        <n-explorer v-else-if="tab.type=='browser'" :tab="tab" :page="page" />
        <n-control v-else-if="tab.type=='field'" ref="control" :tab="tab" :page="page" :files="files" v-model="formData" @uploaded="uploaded" @dialogClose="dialogClose" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>

export default {
  name: 'Dialog',
  data: () => ({
    activeName: "0",
    formData: {},
    files: []
  }),
  props: ['showDialog', 'page'],
  methods: {
    beforeDialogClose () {
      this.dialogClose(false)
    },
    dialogClose (data) {
      let _this = this
      _this.formData = {}
      _this.$emit('dialogClose', data)
    },
    uploaded (filePath) {
      let _this = this
      // 回调成功
      if (typeof filePath === "string" && filePath.length > 0) {
        // 如有文件上传，则添加文件上传后的路径
        _this.formData['CN_FILEPATH'] = filePath
      }
    },
    dialogOk () {
      let _this = this
      _this.$http.put('/data', _this.formData)
        .then((response) => {
          if (response.status === 200) {
            // 关闭弹窗
            _this.dialogClose(response.data)
          }
        })
    }
  }
}
</script>
<style>
  .el-dialog__headerbtn {
    top: 10px !important;
    right: 20px !important;
  }
  .el-dialog__header {
    padding: 10px 20px !important;
  }
  .el-dialog__title {
      font-size: 14px !important;
  }
  .el-dialog__body {
    padding: 0 20px !important;
  }
</style>
