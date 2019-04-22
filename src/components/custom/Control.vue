<template>
  <div>
    <el-row
      style="margin-bottom:10px"
      v-for='(row,index) in tab.rows'
      :key='index'
      :gutter="10"
      type="flex"
      align="middle">
      <el-col v-for='(field,i) in row.controls'
      :key='i'
      :span="field.col">
        <component
          :is="field.type"
          @input="updateForm(field, $event)"
          @clickEvent="clickEvent(field)"
          @uploaded="uploaded"
          @onChange="onChange"
          v-bind="field">
        </component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BUTTON from '../base/Button'
import LABEL from '../base/Label.vue'
import TEXTBOX from '../base/Textbox.vue'
import RICHTEXTBOX from '../base/Textarea.vue'
import DATE from '../base/Datepicker.vue'
import DROPDOWNLIST from '../base/Select.vue'
import CASCADER from '../base/Cascader.vue'
import CHECKBOX from '../base/Checkbox.vue'
import FILE from '../base/FileUpload.vue'
import NUMBER from '../base/Number.vue'
import IMG from '../base/ImageUpload.vue'
export default {
  name: 'Control',
  components: {
    BUTTON,
    LABEL,
    TEXTBOX,
    RICHTEXTBOX,
    DATE,
    DROPDOWNLIST,
    CHECKBOX,
    FILE,
    IMG,
    CASCADER,
    NUMBER
  },
  props: ['tab', 'page', 'value'],
  data () {
    return {
      formData: this.value || {},
      uploadResult: []
    }
  },
  methods: {
    updateForm (field, value) {
      field.value = value
      this.$set(this.formData, field.fieldname, value)
      this.$emit('input', this.formData)
    },
    onChange (file) {
      let _this = this
      let fieldKey = 'CN_NAME'
      let fileName = file.name.substr(0, file.name.lastIndexOf('.'))
      _this.tab.rows.forEach((row) => {
        row.controls.forEach((field) => {
          if (field.type !== 'LABEL' && field.fieldname === fieldKey && field.value.length === 0) {
            field.value = fileName
            return
          }
        })
      }) 
      _this.$set(this.formData, fieldKey, fileName)
    },
    uploaded (filepath) {
      let _this = this
      _this.$emit('uploaded', filepath)
    },
    clickEvent (field) {
      let _this = this
      let api = '/action'
      let action = field.action
      if (!action) {
        return
      }
      if (action.type === 'close') {
        _this.$emit('dialogClose')
        return
      } else if (action.type === 'downfile') {
        api = '/download'
      } else if (action.type === 'ok') {
        api = '/action'
      }
      _this.$http.post(api, {
        FORMGUID: _this.page.guid,
        ACTION: action.name,
        OBJ: _this.formData
      }).then((response) => {
        if (action.type === 'downfile') {
          window.open('#/download?id=' + response.data, '_blank')
          _this.$emit('dialogClose')
        } else if (action.type === 'ok') {
          _this.$emit('dialogClose', response.data)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
