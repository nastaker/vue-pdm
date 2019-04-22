<template>
  <div class="text-left">
    <el-upload
      class="avatar-uploader"
      :limit="1"
      :headers="headers"
      :action="url"
      :show-file-list="false"
      :on-change="onChange"
      :before-upload="beforeAvatarUpload"
      :on-success="uploaded"
      :file-list="fileList">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'ImageUpload',
  props: ['value'],
  data () {
    return {
      imageUrl: undefined,
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + this.$store.getters['user/getUser'].token
      }
    }
  },
  mounted () {
    this.imageUrl = this.value
  },
  methods: {
    onChange (file, fileList) {
      this.$emit('onChange', file, fileList)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    uploaded (response, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      if (response.msg) {
        this.$message.error(response.msg);
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    color: #8c939d;
    font-size: 28px;
    width: 100px;
    height: 100px;
    line-height: 100px !important;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
