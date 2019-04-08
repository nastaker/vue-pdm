<template>
  <div>
    <div style="text-align:left">
      <button-group v-if="tab.menu && tab.menu.children" :buttons="tab.menu.children" @clickEvent="clickEvent"/>
    </div>
    <el-tree
    lazy
    ref="tree"
    :expand-on-click-node="false"
    node-key="guid"
    :data="tab.tree"
    :props="defaultProps"
    :load="onLazyLoad">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <img style="vertical-align:middle;margin-right: 5px" :src="iconUrl(data)" />
          {{ node.label }}
        </span>
        <span>
          <template v-for="item in data.menu">
            <el-button :key="item.guid" plain size="mini" @click="clickEvent(item, data)">{{item.name}}</el-button>
          </template>
        </span>
      </span>
    </el-tree>
    <n-dialog @dialogClose="dialogClose" :showDialog="showDialog" :page="dialogPage" />
  </div>
</template>
<script>

export default {
  name: 'Tree',
  props: ['tab', 'page'],
  data: () => ({
    showDialog: false,
    dialogPage: undefined,
    action: undefined,
    node: undefined,
    nodeobj: undefined,
    defaultProps: {
      children: 'children',
      label: 'label',
      isLeaf: 'leaf'
    }
  }),
  methods: {
    iconUrl (item) {
      if (item) {
        return '/static/icons-app/' + item.img
      }
      return ''
    },
    onLazyLoad (node, resolve) {
      let _this = this
      if (node.level === 0) {
        _this.convertTree(this.tab.tree)
        return resolve(this.tab.tree)
      } else if (node.data.children) {
        return resolve(node.data.children)
      } else {
        _this.$http.post('/tree', {
          TREEVIEW: _this.tab.treeview,
          TREE: node.data
        }).then((response) => {
          _this.convertTree(response.data)
          return resolve(response.data)
        })
      }
    },
    convertTree (tree) {
      if (tree instanceof Array) {
        for (let i = 0, j = tree.length; i < j; i++) {
          let treenode = tree[i]
          if (treenode.hasChildren === 'False') {
            treenode.leaf = true
          } else if (treenode.children && treenode.children.length > 0) {
            this.convertTree(treenode.children)
          }
        }
      } else if (typeof tree === 'object') {
          if (tree.hasChildren === 'False') {
            tree.leaf = true
          } else if (tree.children && tree.children instanceof Array) {
            this.convertTree(tree.children)
          }
      }
    },
    clickEvent (item, node) {
      let _this = this
      if (item.action) {
        _this.beforeClickEventAction(item.action, node)
      }
    },
    beforeClickEventAction (action, data) {
      let _this = this
      if (action.msg && action.msg.length > 0) {
        _this.$confirm(action.msg)
          .then(_ => {
            _this.clickEventAction(action, data)
            done()
          })
          .catch(_ => {})
      } else {
        _this.clickEventAction(action, data)
      }
    },
    clickEventAction (action, data) {
      let _this = this
      if (data) {
        _this.node = data
        _this.nodeobj = {
          CLASSNAME: data.classname,
          GUID: data.guid
        }
      } else {
        _this.nodeobj = undefined
      }
      // 判断按钮是否有action
      if (action) {
        _this.action = action
        if (action.type === 'refresh') {
          _this.$http.post('/tree', {
            ACTION: action.name,
            TREEVIEW: _this.tab.treeview
          }).then((response) => {
            _this.convertTree(response.data)
            _this.$set(_this.tab, 'tree', response.data)
          })
        } else {
          let api = '/action'
          if (action.type === 'browser') {
            api = '/download'
          }
          _this.$http.post(api, {
            FORMGUID: _this.page.guid,
            ACTION: action.name,
            OBJ: _this.nodeobj
          }).then((response) => {
            if (action.isform === 'True') {
              _this.dialogPage = response.data
              _this.showDialog = true
            } else if (action.type === 'browser') {
              let url = process.env.API_FILE + '/' + response.data
              window.open(url, '_blank')
            } else if (action.type === 'detail') {
              // 保存参数
              _this.$store.commit('user/setParam', {
                FORMGUID: _this.page.guid,
                ACTION: action.name,
                OBJ: _this.nodeobj
              })
              // 打开新页面
              window.open('#/detail', '_blank')
            }
          })
        }
      }
    },
    dialogClose (data) {
      let _this = this
      _this.showDialog = false
      if (!data) {
        return
      }
      _this.convertTree(data.tree)
      // 拿到回调data
      // 判断是添加还是修改
      if (!_this.action) {
        return
      }
      if (_this.action.type === 'add') {
        // 刷新节点
        if (typeof _this.node === 'object') {
          if (!(_this.node.children instanceof Array)) {
            _this.$set(_this.node, 'children', [])
          }
          _this.node.children.push(data.tree)
        } else {
          _this.tab.tree.push(data.tree)
        }
      } else if (_this.action.type === 'mod') {
        Object.assign(_this.node, data.tree)
      } else if (_this.action.type === 'delete') {
        _this.$refs.tree.remove(_this.node)
      }
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    line-height: 2em;
  }
  .el-tree-node__content{
    height: 30px !important;
  }
</style>