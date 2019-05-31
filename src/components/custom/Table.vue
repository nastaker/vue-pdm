<template>
  <div v-if="tab.tableDef.guid">
    <el-row type="flex" justify="space-between" style="margin-bottom: 10px">
      <el-col :span="20">
        <button-group :buttons="tab.menu.children" @clickEvent="clickEvent"/>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-switch v-model="toggleSearch"></el-switch>
      </el-col>
    </el-row>
    <div :class="[{'hide': !toggleSearch}]" style="margin:10px 0">
      <el-row style="margin-bottom:0">
        <template v-for="col in tab.tableDef.cols">
          <el-col style="margin-bottom:5px;" :span="24 / colCount" v-if="col.isQuery==='True'" :key="col.guid">
            <el-row type="flex" style="align-items:center" :key="col.guid" v-if="col.type==='text'">
              <el-col :span="labelSpan">
                <div style="color:#606266;text-align:center">{{col.label}}<span :style="{color:'#f00', visibility: col.isRequired=='True'?'visible':'hidden'}">*</span></div>
              </el-col>
              <el-col :span="inputSpan">
                <el-input v-model="queryFields[col.field]" :placeholder="col.label" />
              </el-col>
            </el-row>
            <el-row type="flex" style="align-items:center" :key="col.guid" v-else-if="col.type==='dropdownlist'">
              <el-col :span="labelSpan">
                <div style="color:#606266;text-align:center">{{col.label}}</div>
              </el-col>
              <el-col :span="inputSpan">
                <el-select style="width:100%" v-model="queryFields[col.field]" :placeholder="col.label">
                  <el-option
                    v-for="item in col.items"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :key="col.guid" v-else-if="col.fieldType==='date'">
              <el-col style="padding: 0 0 0 10px" :span="12">
                <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="queryFields[col.field+'_BEGIN']" :placeholder="col.label+'开始'" />
              </el-col>
              <el-col style="padding: 0 0 0 10px" :span="12">
                <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="queryFields[col.field+'_END']" :placeholder="col.label+'结束'" />
              </el-col>
            </el-row>
            <el-row :key="col.guid" v-else-if="col.fieldType==='datetime'">
              <el-col style="padding: 0 10px 0 0" :span="12">
                <el-date-picker style="width:100%" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryFields[col.field+'_BEGIN']" :placeholder="col.label+'开始'" />
              </el-col>
              <el-col style="padding: 0 0 0 10px" :span="12">
                <el-date-picker style="width:100%" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryFields[col.field+'_END']" :placeholder="col.label+'结束'" />
              </el-col>
            </el-row>
          </el-col>
        </template>
      </el-row>
      <el-row>
        <el-col style="text-align:right">
          <el-button :class="[{'hide': !toggleSearch}]" @click="clearQuery()">重置</el-button>
          <el-button :class="[{'hide': !toggleSearch}]" @click="pagenumber=1;refresh()" type="primary">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :height="height"
      :data="data"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      :cell-style="getCellClass"
      :header-cell-style="getCellClass"
      stripe
      border>
      <el-table-column
      type="selection"
      align="center">
      </el-table-column>
      <el-table-column
        fixed
        align="center"
        type="index"
        width="50">
      </el-table-column>
      <template v-for="(item,index) in tab.tableDef.cols">
        <el-table-column
          v-if="item.type==='action'"
          :key="index"
          :fixed="item.isFixed=='True'"
          :width="item.width"
          :prop="item.field"
          :align="item.align"
          :label="item.label">
          <template slot-scope="scope">
            <template v-for="action in scope.row.actions">
              <el-button 
              size="small"
              type="text"
              style="padding: 0"
              @click="colAction(action, scope.row)" 
              :key="action.name">{{action.name}}</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.isDisplay=='True'"
          sortable="custom"
          :key="index"
          :fixed="item.isFixed=='True'"
          :width="item.width"
          :prop="item.field"
          :align="item.align"
          :label="item.label">
        </el-table-column>
      </template>
    </el-table>
    <div class="footer">
      <el-select v-model="pagesize" @change="pagenumber=1;refresh()" size="small" style="width: 130px">
        <el-option
          v-for="item in pageSplit"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-pagination
        layout="prev, pager, next"
        @current-change="refresh"
        :current-page.sync="pagenumber"
        :page-size="pagesize"
        :total="total">
      </el-pagination>
      <div style="font-size:12px">
       第 {{pagenumber}} 页 / 每页 {{pagesize}} 条 / 共计 {{total}} 条数据
      </div>
    </div>
    <n-dialog @dialogClose="dialogClose" :showDialog="showDialog" :page="dialogPage" />
  </div>
</template>
<script>
export default {
  name: 'Table',
  props: ['tab', 'page'],
  data: () => ({
    loading: true,
    toggleSearch: false,
    showQuery: false,
    queryFields: {},
    rawData: {"guid":"B1FF6A99-48E2-4938-B370-7E6944197E24","page":"1","pagesize":"10","order":"CN_ID DESC","tabcount":"7","rows":[{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"F5108F78-9BBE-442F-B550-5CF8FF40A0EF"},{"name":"CN_CODE","value":"XM201902133"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"本地项目目录测试"},{"name":"CN_PROLEADER","value":""},{"name":"CN_MANAGER","value":""},{"name":"CN_TYPE","value":""},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":"北京龙睿鑫业科技有限公司"},{"name":"CN_SIGN","value":""},{"name":"CN_FINISH","value":""},{"name":"CN_CREA","value":"林丫丫"},{"name":"CN_CREA_DATE","value":"2019/3/11 23:29:11"},{"name":"CN_MOD","value":""},{"name":"CN_MOD_DATE","value":""}]},{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"02814B6B-4401-4C0D-B833-F9C5FF5E8EDB"},{"name":"CN_CODE","value":"XM20190213"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"国文琰文化保护项目测试"},{"name":"CN_PROLEADER","value":""},{"name":"CN_MANAGER","value":""},{"name":"CN_TYPE","value":"数字化勘察测绘"},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":"北京龙睿鑫业科技有限公司"},{"name":"CN_SIGN","value":"2019/2/1 0:00:00"},{"name":"CN_FINISH","value":"2019/2/27 0:00:00"},{"name":"CN_CREA","value":"林丫丫"},{"name":"CN_CREA_DATE","value":"2019/3/7 12:18:48"},{"name":"CN_MOD","value":"测试账号"},{"name":"CN_MOD_DATE","value":"2019/3/9 16:55:14"}]},{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"AEC8EECD-9B20-4A70-9D74-DDC0748807A8"},{"name":"CN_CODE","value":"XM2019030701"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"国文琰文物保护项目"},{"name":"CN_PROLEADER","value":""},{"name":"CN_MANAGER","value":""},{"name":"CN_TYPE","value":"研究课题"},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":"北京龙睿鑫业科技有限公司"},{"name":"CN_SIGN","value":"2019/2/1 0:00:00"},{"name":"CN_FINISH","value":"2019/2/27 0:00:00"},{"name":"CN_CREA","value":"林丫丫"},{"name":"CN_CREA_DATE","value":"2019/3/7 12:08:40"},{"name":"CN_MOD","value":"测试账号"},{"name":"CN_MOD_DATE","value":"2019/3/9 16:55:19"}]},{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"69A6707A-D197-4877-BABF-A033A6D49973"},{"name":"CN_CODE","value":"GWY-2019-02"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"国文琰003"},{"name":"CN_PROLEADER","value":""},{"name":"CN_MANAGER","value":""},{"name":"CN_TYPE","value":"科技保护"},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":""},{"name":"CN_SIGN","value":"2019/2/27 0:00:00"},{"name":"CN_FINISH","value":"2019/2/19 0:00:00"},{"name":"CN_CREA","value":"祁娜"},{"name":"CN_CREA_DATE","value":"2019/2/22 9:46:12"},{"name":"CN_MOD","value":"测试账号"},{"name":"CN_MOD_DATE","value":"2019/3/9 16:55:24"}]},{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"19E0EDF6-04F0-4167-BF03-B3133F979FFB"},{"name":"CN_CODE","value":"XM201904"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"测试项目4"},{"name":"CN_PROLEADER","value":"数字化部/杨晨"},{"name":"CN_MANAGER","value":"杨晨"},{"name":"CN_TYPE","value":"数字化勘察测绘"},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":""},{"name":"CN_SIGN","value":""},{"name":"CN_FINISH","value":""},{"name":"CN_CREA","value":"测试账号"},{"name":"CN_CREA_DATE","value":"2019/2/21 20:28:07"},{"name":"CN_MOD","value":"测试账号"},{"name":"CN_MOD_DATE","value":"2019/3/9 16:55:29"}]},{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"AF6D25BC-53F0-4C81-94F5-63F61BA8DAED"},{"name":"CN_CODE","value":"XM2019002"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"数字化测试项目"},{"name":"CN_PROLEADER","value":"数字化部/王沫沫"},{"name":"CN_MANAGER","value":"王沫沫"},{"name":"CN_TYPE","value":"数字化勘察测绘"},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":"1"},{"name":"CN_SIGN","value":"2019/2/1 0:00:00"},{"name":"CN_FINISH","value":"2019/2/19 0:00:00"},{"name":"CN_CREA","value":"程异新"},{"name":"CN_CREA_DATE","value":"2019/2/21 20:24:06"},{"name":"CN_MOD","value":"测试账号"},{"name":"CN_MOD_DATE","value":"2019/3/9 16:55:34"}]},{"rowdata":[{"name":"CLASSNAME","value":"project"},{"name":"GUID","value":"4830B2EC-2C27-4535-A66C-6D6933004E3E"},{"name":"CN_CODE","value":"XM201901"},{"name":"查看","value":"","actions":[{"name":"项目查看","hasMsg":"False","isform":"True","type":""}]},{"name":"CN_NAME","value":"某地测试项目"},{"name":"CN_PROLEADER","value":"数字化部/蔡萌萌"},{"name":"CN_MANAGER","value":"蔡萌萌"},{"name":"CN_TYPE","value":"05"},{"name":"CN_STAGE","value":""},{"name":"CN_CUSTOMER","value":"北京龙睿鑫业"},{"name":"CN_SIGN","value":"2019/2/1 0:00:00"},{"name":"CN_FINISH","value":"2019/2/27 0:00:00"},{"name":"CN_CREA","value":"测试账号"},{"name":"CN_CREA_DATE","value":"2019/2/21 20:14:52"},{"name":"CN_MOD","value":"测试账号"},{"name":"CN_MOD_DATE","value":"2019/3/9 16:55:40"}]}]},
    data: [],
    selected: [],
    currSelected: undefined,
    timer: false,
    height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 220,
    stickyHeader: true,
    showDialog: false,
    action: undefined,
    dialogPage: undefined,
    dialogPage1: {"guid":"0FFAA5BB-3107-4BB2-A728-E917BF8C4882","type":"FunForm","name":"项目查看","show":"False","width":"800","height":"500","tabs":[{"guid":"EC4F5704-8966-477C-9364-4CEFF3314BC0","type":"tree","name":"项目文档","show":"True","menu":{"children":[{"guid":"85526098-CF23-430D-A3D6-B8D484C275D9","name":"在我的文件夹生成目录","icon":"","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"D787F80E-192F-43D4-B763-396E58736076","name":"刷新","icon":"","action":{"name":"刷新项目列表","hasMsg":"False","isform":"False","type":"refresh"}}]},"treeview":{"guid":"9A6359BF-CF46-4FEC-B5E8-BA8F26AB21E0","name":"项目文档树","con":"F5108F78-9BBE-442F-B550-5CF8FF40A0EF|myNode"},"tree":[{"classname":"fileFolder","guid":"7;7875c22d-0341-46bb-b4c0-793b8dde12a0","label":"项目前期","img":"A_03MyFloder.png","hasChildren":"True","color":"#0000EE","menu":[{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"新建目录","icon":"A_03MyFloder.png","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"上传文件","icon":"A_03MyFloder.png","action":{"name":"上传文件","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"生成目录","icon":"A_FilesUp.png","action":{"name":"生成目录","hasMsg":"False","isform":"True","type":"add"}}],"children":[{"classname":"File","guid":"7;9aa4054c-92ac-4a4a-ad47-9072d5a8624b","label":"《项目承接申请表》","img":"A_02MyFile.png","hasChildren":"False","menu":[{"guid":"4AC19221-D777-4D2C-8626-F04F27317BC7","name":"修改文件","icon":"A_03MyFloder.png","action":{"name":"修改","hasMsg":"False","isform":"True","type":"mod"}},{"guid":"FF14915A-5A22-435E-ACAF-541CD6968A77","name":"下载文件","icon":"A_03MyFloder.png","action":{"name":"下载","hasMsg":"False","isform":"True","type":"downfile"}},{"guid":"FF14915A-5A22-435E-ACAF-541CD6968A77","name":"浏览","icon":"A_03MyFloder.png","action":{"name":"浏览","hasMsg":"False","isform":"True","type":"browser"}},{"guid":"BB79DDDA-1704-46ED-BA85-BE86D699E798","name":"删除文件","icon":"A_03MyFloder.png","action":{"name":"删除","hasMsg":"False","isform":"True","type":"delete"}}]}]},{"classname":"fileFolder","guid":"7;04f17051-57d1-4a59-aa0f-8c583669b0e5","label":"项目实施","img":"A_03MyFloder.png","hasChildren":"False","color":"#0000EE","menu":[{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"新建目录","icon":"A_03MyFloder.png","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"上传文件","icon":"A_03MyFloder.png","action":{"name":"上传文件","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"生成目录","icon":"A_FilesUp.png","action":{"name":"生成目录","hasMsg":"False","isform":"True","type":"add"}}]},{"classname":"fileFolder","guid":"7;501a467b-1ad4-4353-a97f-c4087cc0ca51","label":"项目报审","img":"A_03MyFloder.png","hasChildren":"True","color":"#0000EE","menu":[{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"新建目录","icon":"A_03MyFloder.png","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"上传文件","icon":"A_03MyFloder.png","action":{"name":"上传文件","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"生成目录","icon":"A_FilesUp.png","action":{"name":"生成目录","hasMsg":"False","isform":"True","type":"add"}}]},{"classname":"fileFolder","guid":"7;bb8cac3e-dd17-499f-bfdb-d94d948114fb","label":"成果交付","img":"A_03MyFloder.png","hasChildren":"True","color":"#0000EE","menu":[{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"新建目录","icon":"A_03MyFloder.png","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"上传文件","icon":"A_03MyFloder.png","action":{"name":"上传文件","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"生成目录","icon":"A_FilesUp.png","action":{"name":"生成目录","hasMsg":"False","isform":"True","type":"add"}}]},{"classname":"fileFolder","guid":"7;db9063bd-a7a1-4c9c-8d43-7eda5fdc1283","label":"施工配合","img":"A_03MyFloder.png","hasChildren":"True","color":"#0000EE","menu":[{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"新建目录","icon":"A_03MyFloder.png","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"上传文件","icon":"A_03MyFloder.png","action":{"name":"上传文件","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"生成目录","icon":"A_FilesUp.png","action":{"name":"生成目录","hasMsg":"False","isform":"True","type":"add"}}]},{"classname":"fileFolder","guid":"7;758f0a00-b9e4-4f2f-b0f6-5dcbdcadae91","label":"项目后续","img":"A_03MyFloder.png","hasChildren":"True","color":"#0000EE","menu":[{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"新建目录","icon":"A_03MyFloder.png","action":{"name":"新建目录","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"上传文件","icon":"A_03MyFloder.png","action":{"name":"上传文件","hasMsg":"False","isform":"True","type":"add"}},{"guid":"5A5F55E4-0FB4-4FEF-8791-CE73F8421667","name":"生成目录","icon":"A_FilesUp.png","action":{"name":"生成目录","hasMsg":"False","isform":"True","type":"add"}}]}]},{"guid":"5BBDE9C3-4000-46D3-BBB1-DFB63E5ACD64","type":"field","name":"项目概况","show":"True","rows":[{"controls":[{"guid":"CDB06A2D-9298-4319-B461-6C5AF6D8BF8B","type":"LABEL","value":"项目编号","fieldname":"CN_CODE","length":0,"isRequired":"False","col":2,"height":0},{"guid":"64324A3C-4F6E-4810-B990-742320125B12","type":"TEXTBOX","value":"","fieldname":"CN_CODE","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":14,"height":0},{"guid":"6657C9F2-9922-4B49-92FD-44E640ADC233","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"87EC74BF-13E6-41AC-B14E-59F1F8C4DC6D","type":"LABEL","value":"项目名称","fieldname":"CN_NAME","length":0,"isRequired":"True","col":2,"height":0},{"guid":"3F90C051-1097-44FC-A3D0-BFDEA370734A","type":"TEXTBOX","value":"","fieldname":"CN_NAME","fieldtype":"varchar","length":128,"isRequired":"True","isReadonly":"False","col":14,"height":0},{"guid":"79B50574-4590-4169-B857-252D674407A5","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"2348A4E1-11E6-4059-9070-313F91B85845","type":"LABEL","value":"所属部门","fieldname":"CN_DEPART","length":0,"isRequired":"False","col":2,"height":0},{"guid":"71CD04B9-AD80-4630-BEE2-02143414B41A","type":"TEXTBOX","value":"","fieldname":"CN_DEPART","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":8,"height":0},{"guid":"AD8257F0-74FE-4145-9D95-C92D8EF186E9","type":"LABEL","value":"负责人","fieldname":"CN_MANAGER","length":0,"isRequired":"False","col":2,"height":0},{"guid":"9D07F1ED-778E-451E-88CB-C32AC845F48C","type":"TEXTBOX","value":"","fieldname":"CN_MANAGER","fieldtype":"varchar","length":32,"isRequired":"False","isReadonly":"False","col":4,"height":0},{"guid":"88D26D57-64DC-427E-A4BD-9A27BACE20EE","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"4B131C26-4EFD-4BE3-977F-C4B9A6CF5F6D","type":"LABEL","value":"项目类型","fieldname":"CN_TYPE","length":0,"isRequired":"False","col":2,"height":0},{"guid":"7178C45C-40B2-4C14-93F4-EE37ADCA0A46","type":"TEXTBOX","value":"","fieldname":"CN_TYPE","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":6,"height":0},{"guid":"AE975C4E-25DD-4855-A3D4-B5D26EE30D63","type":"LABEL","value":"项目阶段","fieldname":"CN_STAGE","length":0,"isRequired":"False","col":2,"height":0},{"guid":"468B4559-5804-47C8-91DF-C4C94C485109","type":"TEXTBOX","value":"","fieldname":"CN_STAGE","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"True","col":6,"height":0},{"guid":"644D6B61-11B7-49DC-8C5F-4DD9B104B117","type":"","value":"","fieldname":"272e95d6-a439-413a-b7b7-8ff04ae29dfe","length":0,"isRequired":"False","isReadonly":"False","col":8,"height":0}]},{"controls":[{"guid":"0F66DEB8-355C-490F-81CC-82A0C0664F48","type":"LABEL","value":"委托单位","fieldname":"CN_CUSTOMER","length":0,"isRequired":"False","col":2,"height":0},{"guid":"C5523654-A60C-4282-8FBE-EF783A73ED1E","type":"TEXTBOX","value":"","fieldname":"CN_CUSTOMER","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":14,"height":0},{"guid":"2AC799CF-D23D-4220-9715-A0EBB32277D8","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"AAA6AB1A-3E72-44D0-BAE3-DCB0691FA691","type":"LABEL","value":"签订日期","fieldname":"CN_SIGN","length":0,"isRequired":"False","col":2,"height":0},{"guid":"102064E2-4A97-4358-9DCC-F66C6CE0E37B","type":"TEXTBOX","value":"","fieldname":"CN_SIGN","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"False","col":6,"height":0},{"guid":"309F647C-AC42-40BB-BD9B-3E48D65D8F96","type":"LABEL","value":"结项日期","fieldname":"CN_FINISH","length":0,"isRequired":"False","col":2,"height":0},{"guid":"431C163E-93FE-422E-86F5-494B2D8EA8D2","type":"TEXTBOX","value":"","fieldname":"CN_FINISH","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"False","col":6,"height":0},{"guid":"F790A8A1-0622-464E-8382-B279592D0ED9","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"94F30D7D-FD98-4465-81AD-E4FFE8A46BC8","type":"LABEL","value":"备注","fieldname":"CN_DESC","length":0,"isRequired":"False","col":2,"height":0},{"guid":"0301C490-9D98-4124-AA1F-23156EED099B","type":"RICHTEXTBOX","value":"","fieldname":"CN_DESC","fieldtype":"varchar","length":256,"isRequired":"False","isReadonly":"False","col":14,"height":40},{"guid":"B7635319-A7A7-4005-B981-9DF40D0F2F55","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"BBC579E5-3ECE-4BEA-9421-4EF1E6ECDD15","type":"LABEL","value":"创建者","fieldname":"CN_CREA","length":0,"isRequired":"False","col":2,"height":0},{"guid":"B5616680-AB39-4B5F-B766-115D6C9B5CDF","type":"TEXTBOX","value":"","fieldname":"CN_CREA","fieldtype":"varchar","length":32,"isRequired":"False","isReadonly":"True","col":6,"height":0},{"guid":"3F468DEE-E157-481D-9D2F-1A4678348E21","type":"LABEL","value":"创建日期","fieldname":"CN_CREA_DATE","length":0,"isRequired":"False","col":2,"height":0},{"guid":"7C17E990-1736-4918-B824-102B23DD37A3","type":"TEXTBOX","value":"","fieldname":"CN_CREA_DATE","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"True","col":6,"height":0},{"guid":"90FAE583-7BDE-405B-B5F8-49E4A659F5C5","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]},{"controls":[{"guid":"E22191B9-C5AF-42BB-B0C1-6A9CC115CE15","type":"LABEL","value":"修改者","fieldname":"CN_MOD","length":0,"isRequired":"False","col":2,"height":0},{"guid":"F2CD46EA-79B8-4468-9C1B-53BDF3D5F714","type":"TEXTBOX","value":"","fieldname":"CN_MOD","fieldtype":"varchar","length":32,"isRequired":"False","isReadonly":"True","col":6,"height":0},{"guid":"51B2759B-6E83-4A3C-8939-EF2CDD521286","type":"LABEL","value":"修改日期","fieldname":"CN_MOD_DATE","length":0,"isRequired":"False","col":2,"height":0},{"guid":"4CE48615-CBD3-44E0-BD2A-23C0BC740C08","type":"TEXTBOX","value":"","fieldname":"CN_MOD_DATE","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"True","col":6,"height":0},{"guid":"FA4E3E25-E364-439D-9198-C65AFF7FE739","type":"LABEL","value":"","fieldname":"","length":0,"col":8,"height":0}]}]},{"guid":"8F6CBDFD-E5F4-4AC5-BF71-DF7263A90351","type":"grid","name":"项目进度","show":"True","menu":{},"tableDef":{"guid":"CF2658E5-6876-49F5-A8C4-D696D740E674","rownumber":"True","checkbox":"True","defquery":" AND CN_LOG_TYPE='进度' AND CN_PRO_GUID ='F5108F78-9BBE-442F-B550-5CF8FF40A0EF' ","cols":[{"guid":"F5C8EB0A-7D3A-40E5-AF2E-62D344D99BA8","field":"CLASSNAME","label":"CLASSNAME","type":"text","isDisplay":"False","order":"5","isQuery":"False","isFixed":"False","fieldType":"","width":"45"},{"guid":"0F61DB80-C01D-4338-BE86-4EAB5046E086","field":"GUID","label":"GUID","type":"text","isDisplay":"False","order":"10","isQuery":"False","isFixed":"False","fieldType":"","width":"45"},{"guid":"33A0BDE5-3184-4931-B1C5-86733D364287","field":"CN_D_CREA","label":"发生日期","type":"text","isDisplay":"True","order":"15","isQuery":"False","isFixed":"False","fieldType":"datetime","width":"45"},{"guid":"49ACBADD-1DDF-4776-91DB-4FE72BAC0D31","field":"CN_USER","label":"维护人","type":"text","isDisplay":"True","order":"20","isQuery":"False","isFixed":"False","fieldType":"varchar","width":"45"},{"guid":"105CF654-2B3C-4E90-AD2F-B1D710C46F9A","field":"CN_TYPE","label":"日志类型","type":"text","isDisplay":"True","order":"25","isQuery":"False","isFixed":"False","fieldType":"varchar","width":"45"},{"guid":"41AA84D7-6713-4898-85F5-D48C7E2E1845","field":"CN_DESC","label":"日志描述","type":"text","isDisplay":"True","order":"30","isQuery":"False","isFixed":"False","fieldType":"varchar","width":"45"}]}},{"guid":"BCE9F186-7835-41F7-9F30-502FE4AE7BD2","type":"grid","name":"项目日志","show":"True","menu":{},"tableDef":{"guid":"A9FD7E70-03D1-4FCD-B6E1-F938EB7DD55A","rownumber":"True","checkbox":"True","defquery":" AND CN_LOG_TYPE!='进度' AND CN_PRO_GUID ='F5108F78-9BBE-442F-B550-5CF8FF40A0EF' ","cols":[{"guid":"398E0FF3-26BD-4D31-9C5D-BD648DAA6BC9","field":"CLASSNAME","label":"CLASSNAME","type":"text","isDisplay":"False","order":"5","isQuery":"False","isFixed":"False","fieldType":"","width":"45"},{"guid":"17F2F9E8-5901-472B-BE17-4B12C25199CB","field":"GUID","label":"GUID","type":"text","isDisplay":"False","order":"10","isQuery":"False","isFixed":"False","fieldType":"","width":"45"},{"guid":"F172FBB0-7463-468C-B740-5B3669636A2D","field":"CN_D_CREA","label":"发生日期","type":"text","isDisplay":"True","order":"15","isQuery":"False","isFixed":"False","fieldType":"datetime","width":"45"},{"guid":"36976802-34F5-4CF5-B547-1A93B54F67A3","field":"CN_USER","label":"维护人","type":"text","isDisplay":"True","order":"20","isQuery":"False","isFixed":"False","fieldType":"varchar","width":"45"},{"guid":"D0A6A74B-F396-47A4-A9B8-6A49661488D4","field":"CN_TYPE","label":"日志类型","type":"text","isDisplay":"True","order":"25","isQuery":"False","isFixed":"False","fieldType":"varchar","width":"45"},{"guid":"F788A8A4-118D-4B9E-9991-79F1CE42C80F","field":"CN_DESC","label":"日志描述","type":"text","isDisplay":"True","order":"30","isQuery":"False","isFixed":"False","fieldType":"varchar","width":"45"}]}}]},
    dialogPage2: {"guid":"9432D2FC-C30E-4029-952A-62EF12A91BB2","type":"DataForm","name":"项目立项","show":"False","width":"650","height":"550","tabs":[{"guid":"BB68571C-C902-485A-98D4-FF977E706E58","type":"field","name":"项目立项","show":"False","rows":[{"controls":[{"guid":"3331431c-8e32-41d6-a1aa-b9ed1db18e58","type":"TEXTBOX","value":"project","fieldname":"CLASSNAME","fieldtype":"varchar","length":64,"isRequired":"True","isReadonly":"False","col":0,"height":0},{"guid":"e3f5e160-b876-46ef-a7e3-78e4e471f72d","type":"TEXTBOX","value":"","fieldname":"GUID","fieldtype":"varchar","length":40,"isRequired":"True","isReadonly":"False","col":0,"height":0}]},{"controls":[{"guid":"513AFCB6-420A-452C-A2C0-5E512F1D025F","type":"TEXTBOX","value":"F5E89968-B47E-4F05-845C-BB2EF798B3F1","fieldname":"CN_ROLE_GUID","fieldtype":"varchar","length":40,"isRequired":"False","isReadonly":"False","col":0,"height":0},{"guid":"E43CCC92-67DC-447A-9D2B-A06286D00049","type":"TEXTBOX","value":"","fieldname":"CN_DEPART_GUID","fieldtype":"varchar","length":40,"isRequired":"False","isReadonly":"False","col":0,"height":0},{"guid":"6C91FB55-633A-49FB-A6AE-B6817967FB41","type":"LABEL","value":"项目编号","fieldname":"CN_CODE","length":0,"isRequired":"False","col":4,"height":0},{"guid":"921340E8-22BF-4F0F-91D9-CC7421A945CE","type":"TEXTBOX","value":"","fieldname":"CN_CODE","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":20,"height":0}]},{"controls":[{"guid":"AA93B175-7497-4B73-9D0C-BE30526346AD","type":"LABEL","value":"项目名称","fieldname":"CN_NAME","length":0,"isRequired":"True","col":4,"height":0},{"guid":"1EDDD486-C278-4076-97A6-0DCC868B4012","type":"TEXTBOX","value":"","fieldname":"CN_NAME","fieldtype":"varchar","length":128,"isRequired":"True","isReadonly":"False","col":20,"height":0}]},{"controls":[{"guid":"EADDFB67-4A3F-445C-B91A-31A42C91A96A","type":"LABEL","value":"负责人","fieldname":"CN_PROLEADER","length":0,"isRequired":"False","col":4,"height":0},{"guid":"645EE2D0-B872-42CA-BF66-2242EC69D8F4","type":"CASCADER","value":"","fieldname":"CN_PROLEADER","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"True","isMulti":"False","col":20,"height":0,"items":[{"value":"","label":""}]}]},{"controls":[{"guid":"A743F7C3-B7AF-4CBD-9FA3-17A1D890BA2D","type":"LABEL","value":"项目组成员","fieldname":"CN_GROUP_USER","length":0,"isRequired":"False","col":4,"height":0},{"guid":"976F52CD-30DD-4556-B1A8-C8E551966729","type":"CASCADER","value":"","fieldname":"CN_GROUP_USER","fieldtype":"varchar","length":32,"isRequired":"False","isReadonly":"False","isMulti":"True","col":20,"height":0,"items":[{"value":"","label":""}]}]},{"controls":[{"guid":"10B9CABC-6D1A-47EA-9621-7D8FBC1C6B29","type":"LABEL","value":"项目类型","fieldname":"CN_TYPE","length":0,"isRequired":"False","col":4,"height":0},{"guid":"18544C68-89FB-4B64-B099-0BD0DE59B74C","type":"DROPDOWNLIST","value":"","fieldname":"CN_TYPE","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":8,"height":0,"items":[{"value":"","label":""},{"value":"数字化勘察测绘","label":"数字化勘察测绘"},{"value":"文物保护工程前期勘察","label":"文物保护工程前期勘察"},{"value":"综合勘察设计","label":"综合勘察设计"},{"value":"科技保护","label":"科技保护"},{"value":"展示应用","label":"展示应用"},{"value":"研究课题","label":"研究课题"},{"value":"出版","label":"出版"},{"value":"模型制作","label":"模型制作"},{"value":"信息软件","label":"信息软件"},{"value":"其他","label":"其他"}]},{"guid":"C43BC7A6-7408-42E1-8621-DED35B4D5171","type":"LABEL","value":"项目阶段","fieldname":"CN_STAGE","length":0,"isRequired":"False","col":4,"height":0},{"guid":"E96FACF4-7B4A-472B-BB1A-D5833A8DDFA7","type":"TEXTBOX","value":"","fieldname":"CN_STAGE","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"True","col":8,"height":0}]},{"controls":[{"guid":"08D26BCB-FFBD-4243-903C-3B43BDB257B6","type":"LABEL","value":"委托单位","fieldname":"CN_CUSTOMER","length":0,"isRequired":"False","col":4,"height":0},{"guid":"A62B9960-CC10-4DBD-8511-CED87003F44F","type":"TEXTBOX","value":"","fieldname":"CN_CUSTOMER","fieldtype":"varchar","length":64,"isRequired":"False","isReadonly":"False","col":20,"height":0}]},{"controls":[{"guid":"7C95B1EA-EB24-431D-AD59-7E8E46831D1A","type":"LABEL","value":"签订日期","fieldname":"CN_SIGN","length":0,"isRequired":"False","col":4,"height":0},{"guid":"6CC56EBD-7ED3-49B5-A6F1-BC2F76B98CA5","type":"DATE","value":"","fieldname":"CN_SIGN","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"False","col":8,"height":0},{"guid":"95978F44-339C-455C-8B2D-FA3DEB68EC16","type":"LABEL","value":"结项日期","fieldname":"CN_FINISH","length":0,"isRequired":"False","col":4,"height":0},{"guid":"6ADC944F-7C29-4A06-B950-FCF0DB61A342","type":"DATE","value":"","fieldname":"CN_FINISH","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"False","col":8,"height":0}]},{"controls":[{"guid":"893C1835-A66C-4054-952F-2A4D4C1E7023","type":"LABEL","value":"备注","fieldname":"CN_DESC","length":0,"isRequired":"False","col":4,"height":120},{"guid":"9FC65113-064D-4064-A81A-BC3FC6C00C30","type":"RICHTEXTBOX","value":"","fieldname":"CN_DESC","fieldtype":"varchar","length":256,"isRequired":"False","isReadonly":"False","col":20,"height":120}]},{"controls":[{"guid":"4835454A-7375-4AB8-A1CE-600CEDAB8384","type":"LABEL","value":"创建者","fieldname":"CN_CREA","length":0,"isRequired":"False","col":4,"height":1},{"guid":"08F7E11F-60E1-460C-83B9-141FDDFB79EA","type":"TEXTBOX","value":"程异新","fieldname":"CN_CREA","fieldtype":"varchar","length":32,"isRequired":"False","isReadonly":"True","col":8,"height":1},{"guid":"D2202E16-ACC4-48CC-8DBF-F72A5FE87291","type":"LABEL","value":"创建日期","fieldname":"CN_CREA_DATE","length":0,"isRequired":"False","col":4,"height":1},{"guid":"0FA4A7F7-BEB4-49D2-B792-6600F4382307","type":"TEXTBOX","value":"2019-03-14","fieldname":"CN_CREA_DATE","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"True","col":8,"height":1}]},{"controls":[{"guid":"B7CBFB2F-B78D-4A31-A17D-DEFC88CA54F7","type":"LABEL","value":"修改者","fieldname":"CN_MOD","length":0,"isRequired":"False","col":4,"height":1},{"guid":"FEFCB8AA-A009-4998-B9E9-35A732D4D014","type":"TEXTBOX","value":"","fieldname":"CN_MOD","fieldtype":"varchar","length":32,"isRequired":"False","isReadonly":"True","col":8,"height":1},{"guid":"F982DC27-71FB-4C17-BAB4-B62DF25B16B6","type":"LABEL","value":"修改日期","fieldname":"CN_MOD_DATE","length":0,"isRequired":"False","col":4,"height":1},{"guid":"3319516F-910D-4153-B368-46F6E72AFFD1","type":"TEXTBOX","value":"","fieldname":"CN_MOD_DATE","fieldtype":"date","length":32,"isRequired":"False","isReadonly":"True","col":8,"height":1}]}]}]},
    colCount: 3,
    labelSpan: 6,
    inputSpan: 18,
    pageSplit: [
      10,
      30,
      50,
      100,
      200
    ],
    total: 0,
    pagenumber: 1,
    pagesize: 10,
    sortBy: null,
    descending: false,
  }),
  computed: {
    rowCount () {
      if (this.tab && this.tab.tableDef) {
        let rowCount = parseInt(this.tab.tableDef.cols.length / this.colCount)
        if (rowCount % this.colCount > 0) {
          rowCount = rowCount + 1
        }
        return rowCount
      }
      return 0
    }
  },
  mounted () {
    let _this = this
    // _this.data = _this.getTableData()
    // _this.loading = false
    // 一旦挂载，需要触发初始服务器数据获取
    _this.refresh()
    // 初始值
    _this.clearQuery()
    window.onresize = () => {
      window.fullHeight = document.documentElement.clientHeight
      _this.height = window.fullHeight - 220
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
    handleSelectionChange (val) {
      this.selected = val
    },
    sortChange({ prop, order}) {
      let _this = this
      _this.sortBy = prop
      _this.descending = (order === 'ascending') ? 'ASC' : 'DESC'
      _this.refresh()
    },
    getCellClass () {
      return 'padding: 5px 0'
    },
    export () {
      let _this = this
      let order = ''
      _this.data = []
      _this.loading = true
      if (_this.sortBy) {
        order = _this.sortBy + ' ' + _this.descending
      }
      _this.$http.post('/export', {
        action: _this.action ? _this.action.name : 'refresh',
        GUID: _this.tab.tableDef.guid,
        PAGE: _this.pagenumber,
        PAGECOUNT: _this.pagesize,
        DEFQUERY: _this.tab.tableDef.defquery,
        QUERY: _this.queryFields,
        ORDER: order
      })
        .then(({ data }) => {
          if (data) {
            window.open(process.env.VUE_APP_API + '/download/' + data, '_blank')
          }
        })
    },
    refresh () {
      let _this = this
      let order = ''
      _this.data = []
      _this.loading = true
      if (_this.sortBy) {
        order = _this.sortBy + ' ' + _this.descending
      }
      _this.$http.post('/data', {
        action: _this.action ? _this.action.name : 'refresh',
        GUID: _this.tab.tableDef.guid,
        PAGE: _this.pagenumber,
        PAGECOUNT: _this.pagesize,
        DEFQUERY: _this.tab.tableDef.defquery,
        QUERY: _this.queryFields,
        ORDER: order
      })
        .then(({ data }) => {
          _this.rawData = data
          // 设置（或更新）rowsNumber
          _this.pagesize = parseInt(data.pagesize)
          _this.total = parseInt(data.tabcount)
          // 然后更新提取的行
          _this.data = _this.getTableData()
          _this.loading = false
        })
    },
    getColumns (cols) {
      // 将属性转换下
      if (this.columns.length === 0) {
        for (let i = 0, j = cols.length; i < j; i++) {
          let col = cols[i]
          if (col.isDisplay === 'True') {
            col.name = col.field
            if (col.field && col.field.indexOf('CN_') === 0) {
              col.sortable = true
            } else {
              col.sortable = false
            }
            this.columns.push(col)
          }
        }
      }
      return this.columns
    },
    clearQuery () {
      let _this = this
      for (let i = 0, j = _this.tab.tableDef.cols.length; i < j; i++) {
        let col = _this.tab.tableDef.cols[i]
        if (col.defValue) {
          _this.$set(_this.queryFields, col.field, col.defValue)
        } else {
          _this.$set(_this.queryFields, col.field, null)
        }
      }
    },
    getTableData () {
      // 获取
      let rows = this.rawData.rows
      if (!rows) {
        return []
      }
      this.convertRows(rows)
      return rows
    },
    colAction (action, row) {
      let _this = this
      _this.beforeClickEventAction(action, row)
    },
    clickEvent (menu) {
      let _this = this
      if (menu.action) {
        _this.currSelected = _this.selected[0]
        _this.beforeClickEventAction(menu.action, _this.selected)
      }
    },
    beforeClickEventAction  (action, data) {
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
      _this.action = action
      let api = '/action'
      if (action.type === 'downfile') {
        api = '/download'
      } else if (action.type === 'browser') {
        api = '/download'
      } else if (action.type === 'URL') {
        api = '/url'
      } else if (action.type === 'dataout') {
        this.export()
        return
      } else if (action.type === 'refresh') {
        this.clearQuery()
        this.refresh()
        return
      } else if (action.type === 'detail') {
        // 保存参数
        _this.$store.commit('user/setParam', {
          FORMGUID: _this.page.guid,
          ACTION: action.name,
          OBJ: data
        })
        if (data) {
          // 打开新页面
          window.open('#/detail', '_blank')
        } else {
          _this.$message.error('未选择数据')
        }
      }
      _this.$http.post(api, {
        FORMGUID: _this.page.guid,
        ACTION: action.name,
        OBJ: data
      }).then((response) => {
        if (action.isform === 'True') {
          _this.dialogPage = response.data
          _this.showDialog = true
        } else if (action.type === 'downfile') {
          window.open(process.env.VUE_APP_API + '/download/' + response.data, '_blank')
        } else if (action.type === 'browser') {
          let url = process.env.VUE_APP_API_FILE + '/' + response.data
          window.open(url, '_blank')
        } else if (action.type === 'URL') {
          let url = response.data
          _this.$store.commit('user/setParam', url)
          window.open('#/view', '_blank')
        } else {
          _this.refresh()
        }
      })
    },
    dialogClose (data) {
      let _this = this
      _this.showDialog = false
      if (_this.action.type === 'delete') {
        _this.refresh()
        // let guid = _this.currSelected.guid
        // for (let i = 0, j = _this.data.length; i < j; i++) {
        //   let r = _this.data[i]
        //   if (r.guid === guid) {
        //     _this.data.splice(i, 1)
        //     break
        //   }
        // }
      }
      if (!data) {
        return
      }
      if (!_this.action) {
        return
      }
      if (data && typeof data.row === 'object') {
        _this.convertRow(data.row, data.row.rowdata)
        if (_this.action.type === 'add') {
          _this.pagenumber = 1
          _this.refresh()
          // _this.data.unshift(data.row)
        } else if (_this.action.type === 'mod') {
          _this.refresh()
          // Object.assign(_this.currSelected, data.row)
        }
      } else if (_this.action.type === 'detail') {
        // 保存参数
        _this.$store.commit('user/setParam', {
          FORMGUID: _this.page.guid,
          ACTION: _this.action.name,
          OBJ: data
        })
        // 打开新页面
        window.open('#/detail', '_blank')
      } else if (_this.action.type === 'URL') {
        let url = data
        _this.$store.commit('user/setParam', url)
        window.open('#/view', '_blank')
      }
    },
    convertRows (rows, key = 'name', value = 'value') {
      for (let i = 0, j = rows.length; i < j; i++) {
        let row = rows[i]
        let rowdata = row.rowdata
        this.convertRow(row, rowdata, key, value)
        delete row.rowdata
      }
      return rows
    },
    convertRow (row, rowdef, key = 'name', value = 'value') {
      for (let x = 0, y = rowdef.length; x < y; x++) {
        row[rowdef[x][key]] = rowdef[x][value]
        if (rowdef[x]['actions'] && rowdef[x]['actions'].length > 0) {
          row['actions'] = rowdef[x]['actions']
          row['actionRowKey'] = rowdef[x][key]
        }
      }
    }
  }
}
</script>
<style>
  .el-table th {
    background-color: #f5f7fa !important;
  }
</style>

<style scoped>
  .hide {
    display: none;
  }
  .footer {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
</style>
