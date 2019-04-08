<template>
  <el-tabs v-model="activeName"  v-if="!loading">
    <el-tab-pane
    v-for="(tab, index) in page.tabs"
    :key="tab.guid"
    :name="index.toString()"
    :label="tab.name">
      <!-- 显示表格或其他控件 -->
      <n-table v-if="tab.type=='grid'" :tab="tab" :page="page" />
      <n-tree v-else-if="tab.type=='tree'" :tab="tab" :page="page" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>

export default {
  data: () => ({
    loading: true,
    activeName: "0",
    pageData: {"guid":"0FF10BBC-C9E4-4DD1-AA4C-608BBE531C35","type":"FunForm","name":"项目列表","show":"False","width":"400","height":"500","tabs":[{"guid":"B41492B1-EAB4-42BA-B806-271AB2F9B081","type":"grid","name":"项目列表","show":"False","menu":{"children":[{"guid":"379DEFA9-707B-4C06-A558-046DF0F9EEF0","name":"立项","icon":"","action":{"name":"项目立项","hasMsg":"False","isform":"True","type":"add"}},{"guid":"DB0DB745-DA3B-4D72-9656-C397A1785AF7","name":"修改","icon":"","action":{"name":"修改项目","hasMsg":"False","isform":"True","type":"mod"}},{"guid":"B9998A59-C810-4B32-BEA5-7A4A655C74B6","name":"冻结","icon":""},{"guid":"8E0FBB22-86B8-4F4E-933E-73ACC4B34FD3","name":"查看","icon":"","action":{"name":"项目查看","hasMsg":"False","isform":"True","type":""}},{"guid":"D818B737-DE5B-4C4B-A57C-078AD2BF0010","name":"隐藏","icon":""},{"guid":"B111E2C4-7A06-4EC2-AE30-D3F0FFFD1D5D","name":"置顶","icon":""},{"guid":"7A62054C-D8DF-44CF-85BC-E2182019426C","name":"刷新","icon":"","action":{"name":"刷新项目列表","hasMsg":"False","isform":"False","type":"refresh"}}]},"tableDef":{"guid":"B1FF6A99-48E2-4938-B370-7E6944197E24","rownumber":"True","checkbox":"True","defquery":"","cols":[{"guid":"AE1708E2-B066-45A6-A07E-70B9E2FC3C11","field":"CLASSNAME","label":"CLASSNAME","type":"text","isDisplay":"False","order":"5","isQuery":"False","isFixed":"True","fieldType":"","align":"center","width":"45"},{"guid":"FD1020ED-D87D-4E0D-B4E6-B58479BDCDD9","field":"GUID","label":"GUID","type":"text","isDisplay":"False","order":"10","isQuery":"False","isFixed":"True","fieldType":"","align":"center","width":"45"},{"guid":"2E023A7B-7E22-41E4-89FA-EEDFA83A79D9","field":"CN_CODE","label":"项目编号","type":"text","isDisplay":"True","order":"15","isQuery":"True","isFixed":"True","fieldType":"varchar","align":"center","width":"100"},{"guid":"B7B928D5-4723-4F53-862C-FDDECB3BF80C","field":"查看","label":"查看","type":"action","isDisplay":"True","order":"17","isQuery":"False","isFixed":"False","fieldType":"","align":"center","width":"45"},{"guid":"9FF9D094-FD6B-459D-B96A-1C9F43BF7C24","field":"CN_NAME","label":"项目名称","type":"text","isDisplay":"True","order":"20","isQuery":"True","isFixed":"True","fieldType":"varchar","align":"left","width":"120"},{"guid":"EF3280A8-DFE9-4907-9117-8492B58B12CC","field":"CN_PROLEADER","label":"负责人","type":"text","isDisplay":"True","order":"30","isQuery":"True","isFixed":"False","fieldType":"varchar","align":"center","width":"50"},{"guid":"A1A8E161-A708-4311-892A-A802E232BD42","field":"CN_MANAGER","label":"负责人","type":"text","isDisplay":"True","order":"35","isQuery":"True","isFixed":"True","fieldType":"varchar","align":"center","width":"90"},{"guid":"8AB2E203-8940-4BB1-A6EA-25008EA7D924","field":"CN_TYPE","label":"项目类型","type":"text","isDisplay":"True","order":"40","isQuery":"True","isFixed":"False","fieldType":"varchar","align":"center","width":"100"},{"guid":"3DC93B31-6529-488E-96E6-A07AE1902EB6","field":"CN_STAGE","label":"项目阶段","type":"text","isDisplay":"True","order":"45","isQuery":"True","isFixed":"False","fieldType":"varchar","align":"center","width":"50"},{"guid":"D3274980-E965-4FDE-97E1-6B1868892610","field":"CN_CUSTOMER","label":"委托单位","type":"text","isDisplay":"True","order":"50","isQuery":"False","isFixed":"False","fieldType":"varchar","align":"left","width":"200"},{"guid":"8860E32A-936C-4EDA-ABF8-772DA8D116F0","field":"CN_SIGN","label":"签订日期","type":"text","isDisplay":"True","order":"55","isQuery":"True","isFixed":"False","fieldType":"date","align":"center","width":"300"},{"guid":"2281D250-9E49-402C-B177-12A2EF60FFDE","field":"CN_FINISH","label":"结项日期","type":"text","isDisplay":"True","order":"60","isQuery":"True","isFixed":"False","fieldType":"date","align":"center","width":"100"},{"guid":"02720155-AEE1-432C-A24A-C66A687BB334","field":"CN_CREA","label":"创建者","type":"text","isDisplay":"True","order":"65","isQuery":"False","isFixed":"False","fieldType":"varchar","align":"center","width":"50"},{"guid":"AD5AA466-4EF0-441A-81E8-EC03EE1A0494","field":"CN_CREA_DATE","label":"创建日期","type":"text","isDisplay":"True","order":"70","isQuery":"False","isFixed":"False","fieldType":"date","align":"center","width":"45"},{"guid":"E120FB1E-1A40-4775-9301-E820A72CD783","field":"CN_MOD","label":"修改者","type":"text","isDisplay":"True","order":"75","isQuery":"False","isFixed":"False","fieldType":"varchar","align":"center","width":"45"},{"guid":"8AF92E2C-A1CF-42CA-BCAD-BA4130B20C5C","field":"CN_MOD_DATE","label":"修改日期","type":"text","isDisplay":"True","order":"80","isQuery":"False","isFixed":"False","fieldType":"date","align":"center","width":"45"}]}}]},
    page: {},
  }),
  mounted () {
    // 一旦挂载，需要触发初始服务器数据获取
    this.loading = false
    this.load()
  },
  watch: {
    '$route' (from, to) {
      this.load()
    }
  },
  methods: {
    load () {
      let _this = this
      this.loading = true
      _this.$http.post('/page', {
        formguid: _this.$route.params.pageid,
        action: 'OpenForm'
      })
        .then((response) => {
          if (response.status === 200) {
            _this.page = response.data
            _this.loading = false
          }
        })
    }
  }
}
</script>

<style>
</style>
