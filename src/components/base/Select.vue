<template>
  <div class="text-left">
    <el-select
    style="width:100%"
    :value="value"
    @change="$emit('input', $event)"
    placeholder="请选择">
      <el-option
        v-for="item in items"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'Select',
  data: () => ({ }),
  props: ['fieldname', 'value', 'items', 'isReadonly'],
  mounted () {
    if (this.isReadonly === 'False') {
      this.$emit('input', this.value)
    }
  }
}
</script>
