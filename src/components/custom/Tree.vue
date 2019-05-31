<template>
  <div>
    <div style="text-align:left">
      <button-group v-if="tab.menu && tab.menu.children" :buttons="tab.menu.children" @clickEvent="clickEvent"/>
    </div>
    <el-tree
    lazy
    ref="tree"
    node-key="guid"
    v-if="tab.tree"
    :allow-drop="allowDrop"
    @node-drag-start="handleDragStart"
    @node-drag-end="handleDragEnd"
    :draggable="tab.treeview.canDrag=='True'"
    :expand-on-click-node="false"
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
    refresh () {
      let _this = this
      let isRefreshParent = false
      let node = undefined
      if (_this.node) {
        node = _this.$refs.tree.getNode(_this.node.guid)
        if (node.level > 1) {
          node = node.parent
          isRefreshParent = true
        }
      }
      if (isRefreshParent) {
        _this.$http.post('/tree', {
          TREEVIEW: _this.tab.treeview,
          TREE: node.data
        }).then((response) => {
          // 将当前节点下所有子节点清空，并重新添加
          for (let i = node.childNodes.length - 1, j = 0; i >= j; i--) {
            let child = node.childNodes[i]
            _this.$refs.tree.remove(child)
          }
          let rawTree = response.data
          if (!(rawTree && rawTree.tree)) {
            _this.node = undefined
            return
          }
          _this.convertTree(rawTree.tree)
          for (let i = 0, j = rawTree.tree.length; i < j; i++) {
            let item = rawTree.tree[i]
            _this.$refs.tree.append(item, node)
          }
          _this.node = undefined
        })
      } else {
        _this.$http.post('/tree', {
          ACTION: _this.action ? _this.action.name : 'refresh',
          TREEVIEW: _this.tab.treeview
        }).then((response) => {
          let rawTree = response.data
          if (rawTree && rawTree.tree) {
            _this.convertTree(rawTree.tree)
            _this.$set(_this.tab, 'tree', rawTree.tree)
            _this.$set(_this.tab, 'treeview', rawTree.treeview)
          }
        })
      }
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
          let rawTree = response.data
          if (rawTree && rawTree.tree && rawTree.tree instanceof Array) {
            _this.convertTree(rawTree.tree)
            return resolve(rawTree.tree)
          }
          return resolve([])
        })
      }
    },
    allowDrop (draggingNode, dropNode) {
      if (dropNode.level < 1) {
        return false
      } else if (draggingNode.data.canDrag === 'False') {
        return false
      } else if (dropNode.data.canDragIn === 'False') {
        return false
      } else {
        return true
      }
    },
    handleDragStart (draggingNode) {
      let _this = this
      _this.parentOld = draggingNode.parent
    },
    handleDragEnd (draggingNode, dropNode, dropType) {
      let _this = this
      let node = draggingNode
      let parentOld = _this.parentOld
      let parentNew = dropNode
      let who = dropNode
      if (dropNode === null) {
        return
      }
      if (dropNode !== draggingNode) {
        dropNode.isLeaf = false
      }
      if (dropType !== 'inner') {
        parentNew = dropNode.parent
      }
      if (node) {
        node = {
          classname: node.data.classname,
          guid: node.data.guid
        }
      }
      if (who) {
        who = {
          classname: who.data.classname,
          guid: who.data.guid
        }
      }
      if (parentOld) {
        parentOld = {
          classname: parentOld.data.classname,
          guid: parentOld.data.guid
        }
      }
      if (parentNew) {
        parentNew = {
          classname: parentNew.data.classname,
          guid: parentNew.data.guid
        }
      }
      _this.$http.post('/nodemove', {
        treeview: _this.tab.treeview,
        node,
        parentOld,
        parentNew,
        dropType,
        who
      }).then(() => {
      })
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
          .then(() => {
            _this.clickEventAction(action, data)
          })
          .catch(() => {})
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
        _this.node = undefined
        _this.nodeobj = undefined
      }
      // 判断按钮是否有action
      if (action) {
        _this.action = action
        if (action.type === 'refresh') {
          _this.refresh()
        } else {
          let api = '/action'
          if (action.type === 'browser') {
            api = '/download'
          } else if (action.type === 'downfile') {
            api = '/download'
          } else if (action.type === 'URL') {
            api = '/url'
          }
          _this.$http.post(api, {
            FORMGUID: _this.page.guid,
            ACTION: action.name,
            OBJ: _this.nodeobj
          }).then((response) => {
            if (action.isform === 'True') {
              _this.dialogPage = response.data
              _this.showDialog = true
            } else if (action.type === 'downfile') {
              window.open(process.env.VUE_APP_API + '/download/' + response.data, '_blank')
            } else if (action.type === 'browser') {
              let url = process.env.VUE_APP_API_FILE + '/' + response.data
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
            } else if (_this.action.type === 'delete') {
              _this.$refs.tree.remove(_this.node)
            } else if (action.type === 'URL') {
              let url = response.data
              _this.$store.commit('user/setParam', url)
              window.open('#/view', '_blank')
            } else {
              _this.refresh()
            }
          })
        }
      }
    },
    dialogClose (data) {
      let _this = this
      _this.showDialog = false
      if (data === false) {
        return
      }
      if (!_this.action) {
        return
      }
      if (_this.action.type === 'add') {
        // 刷新节点
        _this.refresh()
        // if (typeof _this.node === 'object') {
        //   if (!(_this.node.children instanceof Array)) {
        //     _this.$set(_this.node, 'children', [])
        //   }
        //   _this.node.children.push(data.tree)
        // } else {
        //   _this.tab.tree.push(data.tree)
        // }
      } else if (_this.action.type === 'mod') {
        _this.refresh()
        // Object.assign(_this.node, data.tree)
      } else {
        _this.refresh()
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