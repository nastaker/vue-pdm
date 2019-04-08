<template>
  <div class="text-left">
    {{value}}
    <span v-if="isRequired==='True'" class="text-red">*</span>
  </div>
</template>
<script>
export default {
  name: 'Label',
  props: ['value', 'isRequired']
}
</script>
<style scoped>
.text-left {
  height: 40px;
  line-height: 40px;
}
.text-red {
  color: red
}
</style>
