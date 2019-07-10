<template>
  <div class="text-left">
    <el-cascader
      :props="props"
      clearable
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
  data() {
    return {
      checkList: [],
      props: {
        emitPath: this.isMulti === 'True' ? false : true,
        multiple: this.isMulti === 'True' ? true : false
      },
      loaded: false
    }
  },
  mounted () {
    this.checkList = []
    if (this.value && typeof this.value === 'string') {
      let list = []
      if (this.value.indexOf(';') < 0) {
        this.checkList = this.value.split(',')
      } else {
        list = this.value.split(';')
        for (let i = 0, j = list.length; i < j; i++) {
          this.checkList.push(list[i].split(',')[0])
        }
      }
    }
    this.$emit('input', this.checkList)
    this.loaded = true
  },
  methods: {
    change () {
      this.$emit('input', this.checkList)
    }
  }
}
</script>

<style scoped>
</style>

