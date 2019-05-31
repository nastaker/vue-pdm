<template>
  <div class="text-left">
    <el-input
      :type="this.fieldname.toUpperCase().indexOf('CN_PSW') == 0?'password':'text'"
      :value="value"
      :disabled="isReadonly=='True'"
      :readonly="isReadonly=='True'"
      inverted
      @input="$emit('input', $event)" >
    </el-input>
  </div>
</template>
<script>
export default {
  name: 'Textbox',
  props: ['fieldname', 'isReadonly', 'value'],
  mounted () {
    if (this.isReadonly === 'False') {
      this.$emit('input', this.value)
    }
  }
}
</script>
