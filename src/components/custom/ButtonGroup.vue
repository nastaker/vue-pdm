<template>
  <el-button-group>
    <component
    v-for="btn in buttons"
    :key="btn.guid"
    :size="size"
    :is="btn.children ? 'el-dropdown' : 'el-button'"
    @click="$emit('clickEvent', btn)"
    >
      <!-- 下拉内容 -->
      <template v-if="btn.children">
        <el-dropdown-item 
        v-for="item in btn.children"
        :key="item.guid"
        @click.native="$emit('clickEvent', item)">
          {{item.name}}
        </el-dropdown-item>
      </template>
      <span v-else>
        {{btn.name}}
      </span>
    </component>
  </el-button-group>
</template>
<script>
export default {
  name: 'ButtonGroup',
  props: {
    buttons: {
      type: Array
    }, 
    size: {
      default: () => {
        return 'medium'
      }
    }
  }
}
</script>
<style>
</style>
