<template>
  <el-button-group>
    <template v-for="btn in buttons">
      <el-dropdown 
        v-if="btn.children"
        :key="btn.guid">
        <el-button
          :size="size">
          {{btn.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu :key="btn.guid" slot="dropdown">
          <el-dropdown-item 
          v-for="item in btn.children"
          :key="item.guid"
          @click.native="$emit('clickEvent', item)">
            {{item.name}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-if="!btn.children"
        :key="btn.guid"
        :size="size"
        @click="$emit('clickEvent', btn)"
        >
        {{btn.name}}
      </el-button>
    </template>
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
