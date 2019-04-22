<template>
  <div class="text-left">
    <el-button plain @click="clickEvent">
        {{value}}
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'Button',
  props: ['value'],
  methods: {
    clickEvent () {
      this.$emit('clickEvent')
    }
  }
}
</script>
