<template>
  <div class="text-left">
    <el-checkbox
      @change="$emit('input', $event)"
      :value="value">
    </el-checkbox>
  </div>
</template>
<script>
export default {
  name: 'Checkbox',
  props: ['fieldname', 'value']
}
</script>
