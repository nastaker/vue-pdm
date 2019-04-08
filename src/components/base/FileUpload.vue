<template>
  <div class="text-left">
    <el-upload
      :limit="1"
      :headers="headers"
      :action="url"
      :on-change="onChange"
      :on-success="uploaded"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'Uploader',
  props: ['value'],
  data () {
    return {
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + this.$store.getters['user/getUser'].token
      }
    }
  },
  methods: {
    onChange (file, fileList) {
      this.$emit('onChange', file, fileList)
    },
    uploaded (response, file, fileList) {
      this.$emit('uploaded', response)
    }
  },
  computed: {
    url () {
      return process.env.VUE_APP_API_FILE
    }
  }
}
</script>
<style>
</style>
