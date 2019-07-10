<template>
  <div class="container">
    <uploader>
    </uploader>
  </div>
</template>

<script>
import Uploader from "../components/base/FileUpload.vue";

export default {
  name: 'HelloWorld',
  components: {
    Uploader
  },
  data: () => ({
  }),
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{
    padding: 20px;
  }
</style>
