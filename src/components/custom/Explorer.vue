<template>
  <div ref="body">
    <el-row style="padding-bottom: 10px;border-bottom: 1px solid #ccc;">
      <el-col :span="12">
        <button-group v-if="tab.menu && tab.menu.children" :buttons="tab.menu.children" @clickEvent="clickEvent"/>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button-group>
          <el-button size="medium" @click="isIcon=true" :type="isIcon?'':'primary'">
            <i class="icon ion-md-grid el-icon--left"></i>
            图标
          </el-button>
          <el-button size="medium" @click="isIcon=false" :type="isIcon?'primary':''">
            <i class="icon ion-md-list el-icon--left"></i>
            列表
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-container>
      <el-aside>
        <div class="tree" :style="{ height: height + 'px' }">
          <el-tree
            lazy
            ref="tree"
            node-key="guid"
            @current-change="nodeSelect"
            :expand-on-click-node="false"
            :data="tab.tree"
            :props="defaultProps"
            :load="onLazyLoad">
            <div slot-scope="{ node, data }">
              <div @contextmenu.prevent="showMenu($event, data)">
                <span style="margin-right: 5px"><img style="vertical-align:middle" :src="iconUrl(data)" /></span>
                <span :style="{color: data.color, backgroundColor: data.bgColor}">{{ node.label }}</span>
              </div>
            </div>
          </el-tree>
        </div>
      </el-aside>
      <el-main>
        <div v-if="fileCount > 0 && isIcon">
        <el-row v-for="row in rowCount" :key="row">
          <template v-for="(col,index) in colCount">
            <el-col v-if="(row-1)*rowCount+col <= fileCount" :key="index" :span="24 / colCount">
              <div class="file" @contextmenu.prevent="showMenu($event, currFolder[(row-1)*rowCount+col-1])">
                <img :src="iconUrl(currFolder[(row-1)*rowCount+col-1])" />
                <div class="file-text">{{currFolder[(row-1)*rowCount+col-1].label}}</div>
              </div>
            </el-col>
          </template>
        </el-row>
        </div>
        <div v-else-if="fileCount > 0 && !isIcon">
          <el-row class="colHeaderBox">
            <el-col :span="colHeader.width" class="colHeader" v-for="(colHeader,index) in colHeaders" :key="index">{{colHeader.name}}</el-col>
          </el-row>
          <el-row
            v-for="(row,index) in currFolder"
            :key="index">
            <div class="row" @contextmenu.prevent="showMenu($event, row)">
              <el-col class="col" :span="colHeaders[0].width">
                <img style="vertical-align:middle" :src="iconUrl(row)" />
                {{row.label}}
              </el-col>
              <el-col class="col" :span="colHeaders[1].width">{{row.modDate}}</el-col>
              <el-col class="col" :span="colHeaders[2].width">{{row.type}}</el-col>
              <el-col class="col" :span="colHeaders[3].width">{{row.size}}</el-col>
              <div style="clear:both"></div>
            </div>
          </el-row>
        </div>
        <div v-else>
          文件夹为空
        </div>
        <div ref="list" class="list">
        </div>
        <n-dialog @dialogClose="dialogClose" :showDialog="showDialog" :page="dialogPage" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Expolrer',
  props: ['tab', 'page'],
  data: () => ({
    colCount: 6,
    isIcon: true,
    action: undefined,
    currFolder: [],
    colHeaders: [
      {
        name: '名称',
        width: 12 
      },
      {
        name: '修改日期',
        width: 4 
      },
      {
        name: '类型',
        width: 4 
      },
      {
        name: '大小',
        width: 4 
      }
    ],
    height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 105,
    showDialog: false,
    dialogPage: undefined,
    node: undefined,
    nodeobj: undefined,
    defaultProps: {
      children: 'children',
      label: 'label',
      isLeaf: 'leaf'
    }
  }),
  computed: {
    rowCount () {
      let _this = this
      let colCount = _this.colCount
      let rowCount = parseInt(_this.currFolder.length / colCount)
      if (_this.currFolder.length % colCount > 0) {
        rowCount = rowCount + 1
      }
      return rowCount
    },
    fileCount () {
      return this.currFolder.length
    }
  },
  mounted () {
    let _this = this
    document.body.addEventListener('click', function(event) {
      let list = document.getElementById('menu')
      if (list && list.style.display === 'block') {
        list.style.display = 'none'
      }
    })
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        _this.height = window.fullHeight - 105
      })()
    }
  },
  watch: {
    // 这里的定时器是为了优化，如果频繁调用window.onresize方法会造成页面卡顿，增加定时器会避免频繁调用window.onresize方法
    height(val) {
      if (!this.timer) {
        this.height = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    }
  },
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
        _this.currFolder = node.data.children
        return resolve(node.data.children)
      } else {
        _this.$http.post('/tree', {
          TREEVIEW: _this.tab.treeview,
          TREE: node.data
        }).then((response) => {
          _this.convertTree(response.data)
          _this.currFolder = response.data
          return resolve(response.data)
        })
      }
    },
    convertTree (tree) {
      if(tree){
        for (let i = 0, j = tree.length; i < j; i++) {
          let treenode = tree[i]
          if (treenode.hasChildren === 'False') {
            treenode.leaf = true
          } else if (treenode.children && treenode.children.length > 0) {
            this.convertTree(treenode.children)
          }
        }
      }
    },
    nodeSelect (data, node, obj) {
      let _this = this
      let children = []
      if ( node.childNodes.length > 0 ) {
        for (let i = 0, j = node.childNodes.length; i < j; i++) {
          children.push(node.childNodes[i].data)
        }
      }
      _this.currFolder = children
    },
    clickEvent (item, node) {
      let _this = this
      if (item.action) {
        _this.beforeClickEventAction(item.action, node)
      }
    },
    beforeClickEventAction  (action, data) {
      let _this = this
      if (action.msg && action.msg.length > 0) {
        _this.$confirm(action.msg)
          .then(_ => {
            _this.clickEventAction(action, data)
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
    showMenu (event, node) {
      let _this = this
      let list = document.getElementById('menu') || document.createElement('ul')
      if (!document.getElementById('menu')) {
        _this.$refs.body.appendChild(list)
      }
      list.id = 'menu'
      list.className = 'menu'
      list.style.display = 'block'
      list.innerHTML = ''
      if (!node.menu) {
        return
      }
      for ( let i = 0, j = node.menu.length; i < j; i++) {
        let menu = node.menu[i]
        let listitem = document.createElement('li')
        listitem.className = 'menu-item'
        listitem.innerText = menu.name
        listitem.addEventListener('click', function() {
          _this.clickEvent(menu, node)
        })
        list.appendChild(listitem)
      }
      let pnode = _this.$refs.body
      let position = ''
      while (position !== 'relative' && position !== 'absolute' && pnode.tagName !== 'BODY') {
        pnode = pnode.parentNode
        position = window.getComputedStyle(pnode, null).position
      }
      let listWidth = parseInt(window.getComputedStyle(list, null).width)
      let listHeight = parseInt(window.getComputedStyle(list, null).height)
      let boxWidth = parseInt(window.getComputedStyle(pnode, null).width)
      let boxHeight = parseInt(window.getComputedStyle(pnode, null).height)
      if ((event.clientY - pnode.offsetTop) + listHeight > boxHeight) {
        list.style.top = (event.clientY - pnode.offsetTop) - listHeight + 'px'
      } else {
        list.style.top = (event.clientY - pnode.offsetTop) + 'px'
      }
      if ((event.clientX - pnode.offsetLeft) + listWidth > boxWidth) {
        list.style.left = (event.clientX - pnode.offsetLeft) - listWidth + 'px'
      } else {
        list.style.left = (event.clientX - pnode.offsetLeft) + 'px'
      }
    },
    dialogClose (data) {
      let _this = this
      _this.showDialog = false
      if (!data) {
        return
      }
      if (!_this.action) {
        return
      }
      if (data && typeof data.tree === 'object') {
        _this.convertTree(data.tree)
        if (_this.action.type === 'add') {
          // 刷新节点
          if (typeof _this.node === 'object') {
            if (!(_this.node.children instanceof Array)) {
              _this.$set(_this.node, 'children', []);
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
      } else if (_this.action.type === 'browser') {
        let url = process.env.API_FILE + '/' + data
        window.open(url, '_blank')
      } else if (_this.action.type === 'detail') {
        // 保存参数
        _this.$store.commit('user/setParam', {
          FORMGUID: _this.page.guid,
          ACTION: _this.action.name,
          OBJ: _this.nodeobj
        })
        // 打开新页面
        window.open('#/detail', '_blank')
      }
    }
  }
}
</script>
<style scoped>
  .sub {
    color: black;
    background-color: white;
  }
  .tree {
    overflow: auto;
    background-color: #ffffff;
  }
  .el-tree {
    min-width: 100%;
    font-size: 14px;
    display: inline-block !important;
  }
  .el-aside {
    border-right: 1px solid #ccc;
  }
  .file {
    text-align: center;
    cursor: pointer;
  }
  .file-text {
    font-size: 14px;
  }
  .file:hover {
    background-color: #dedede;
    color: darkblue;
  }
  .el-container{
    height: 100%;
  }
  .el-main {
    position: relative;
    padding: 10px 10px;
  }
</style>
<style>
  .menu {
    position: absolute;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid #9c9c9c;
    border-radius: 5px;
    background-color: #efefef;
  }
  .menu-item {
    cursor: pointer;
    line-height: 25px;
    padding: 5px 15px;
  }
  .menu-item:not(:last-child) {
    border-bottom: 1px solid #9c9c9c;
  }
  .menu-item:hover {
    color: #dedede;
    background-color: #6d6d6d;
  }
  .colHeaderBox {
    background-color: #f5f7fa;
    border: 1px solid #dedede;
  }
  .row {
  }
  .row:hover {
    background-color: #dedede;
  }
  .colHeader, .col {
    padding: 5px 10px;
  }
  .colHeader {
    border-right: 1px solid #dedede;
  }
</style>
