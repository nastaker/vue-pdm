<template>
  <div class="text-left">
    <el-date-picker
      style="width:100%"
      :value="value"
      @input="changeValue($event)"
      placeholder="选择时间">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  name: 'Datepicker',
  data: () => ({
  }),
  props: ['fieldname', 'value', 'isReadonly'],
  methods: {
    changeValue (date) {
      this.$emit('input', date)
    }
  }
}
</script>

<style>
</style>

