<template>
  <div class="text-left">
    <el-upload
      :limit="1"
      :headers="headers"
      :action="url"
      :on-change="onChange"
      :on-success="onSuccess"
      :on-error="onError"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-alert
      class="alert-msgbox"
      show-icon
      @close="closeAlert"
      :style="{display: showMsg ? '' : 'none'}"
      :title="msg"
      type="error">
    </el-alert>
  </div>
</template>
<script>
export default {
  name: 'Uploader',
  props: ['value'],
  data () {
    let auth = 'Bearer '
    let user = this.$store.getters['user/getUser']
    if (user) {
      auth = auth + user.token
    }
    return {
      showMsg: false,
      msg: '',
      fileList: [],
      headers: {
        Authorization: auth
      }
    }
  },
  methods: {
    onChange (file, fileList) {
      if (file.status !== 'fail') {
        this.showMsg = false
      }
      this.$emit('onChange', file, fileList)
    },
    closeAlert () {
      this.showMsg = false
    },
    onError (err, file) {
      this.showMsg = true
      this.msg = `文件${file.name}上传失败，请联系管理员`
    },
    onSuccess (response) {
      if (response.msg) {
        this.showMsg = true
        this.msg = response.msg
      }
      this.$emit('uploaded', response.obj)
    }
  },
  computed: {
    url () {
      return process.env.VUE_APP_API_FILE
    }
  }
}
</script>

<style scoped>
  .alert-msgbox {
    margin-top: 10px
  }
</style>
