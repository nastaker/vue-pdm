<template>
  <div class="text-left">
    <el-multi-cascader
      v-if="isMulti=='True' && loaded"
      multiple
      clearable
      style="width:100%"
      @change="change($event)" 
      v-model="checkList"
      :options="items" />
    <el-cascader
      v-if="isMulti=='False' && loaded"
      clearable
      change-on-select
      style="width:100%"
      v-model="checkList" 
      @change="change($event)" 
      :options="items" />
  </div>
</template>
<script>
export default {
  name: 'Cascader',
  props: ['items', 'value', 'isMulti'],
  data: () => ({
    checkList: [],
    loaded: false
  }),
  mounted () {
    if (this.value) {
      let list = []
      if (this.isMulti === 'False') {
        this.checkList = this.value.split(',')
      } else {
        list = this.value.split(';')
        for (let i = 0, j = list.length; i < j; i++) {
          this.checkList.push(list[i].split(','))
        }
      }
    }
    this.$emit('input', this.checkList)
    this.loaded = true
  },
  methods: {
    change (item) {
      this.$emit('input', this.checkList)
    }
  }
}
</script>

<style scoped>
</style>

