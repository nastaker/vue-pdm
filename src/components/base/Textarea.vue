<template>
  <div class="text-left">
    <el-input
      type="textarea"
      :value="value"
      :disabled="isReadonly=='True'"
      :readonly="isReadonly=='True'"
      rows="height"
      resize="none"
      @input="$emit('input', $event)">
    </el-input>
  </div>
</template>
<script>
export default {
  name: 'Textarea',
  props: ['fieldname', 'height', 'isReadonly', 'value'],
  mounted () {
    if (this.isReadonly === 'False') {
      this.$emit('input', this.value)
    }
  }
}
</script>
