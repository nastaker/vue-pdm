<template>
  <div class="text-left">
    <el-button v-if="value" plain size="small" @click="clickEvent">
        {{value}}
    </el-button>
    <el-button v-else type="success" icon="el-icon-check" circle @click="clickEvent"></el-button>
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
