import NTable from '@/components/custom/Table.vue'
import NTree from '@/components/custom/Tree.vue'
import NExplorer from '@/components/custom/Explorer.vue'
import NControl from '@/components/custom/Control.vue'
import NDialog from '@/components/custom/Dialog.vue'
import NButtonGroup from '@/components/custom/ButtonGroup.vue'
import elCascaderMulti from "multi-cascader-base-ele"

export default ({ Vue }) => {
  Vue.use(elCascaderMulti)
  Vue.component('n-table', NTable)
  Vue.component('n-tree', NTree)
  Vue.component('n-explorer', NExplorer)
  Vue.component('n-control', NControl)
  Vue.component('n-dialog', NDialog)
  Vue.component('button-group', NButtonGroup)
}
