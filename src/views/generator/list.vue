<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container " style="height: 100px">
      <el-input v-model="listQuery.tableName" clearable size="medium" placeholder="请输入表名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.tableComment" clearable size="medium" placeholder="请输入表备注" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button style="margin-left: 10px;" type="warning" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-sort" @click="handleSyc">
        同步
      </el-button>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-s-tools" @click="handleProjecConfig">
        工程配置
      </el-button>
      <el-select v-model="dataBaseId" placeholder="请选择数据库" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in dataBaseList" :key="item.id" :label="item.dataBaseName" :value="item.id" />
      </el-select>
    </div>
    <!--按钮-->
    <div style="height: 60px">
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-box" @click="handleBatchCreate">
        批量生成
      </el-button>
    </div>
    <!--表格渲染-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      height="630px"
      :row-style="{height:'40px'}"
      :cell-style="{padding:'20px'}"
      style="font-size: 15px"
      :data="list"
      tooltip-effect="dark"
      element-loading-text="Loading"
      size="medium"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="200"
      >
        <el-table-column
          label="表名称"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.tableName }}
          </template>
        </el-table-column>
        <el-table-column label="表备注" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tableComment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据库引擎" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.engine }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字符集编码" width="300" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tableCollation }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="300">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="350"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-view" size="small">
              <router-link :to="'/generator/preview/'+scope.row.tableName">
                预览
              </router-link>
            </el-button>
            <el-button type="primary" icon="el-icon-box" size="small" @click="handleCreate(scope.row.tableName)">生成</el-button>
            <el-button type="warning" icon="el-icon-download" size="small" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table-column></el-table>
    <!-- 分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTablePage" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getDataBaseList } from '@/api/database'
import { getTablePage } from '@/api/table'
import { createCode } from '@/api/autoCode'
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total: 0,
      listLoading: true,
      page: 1,
      limit: 10,
      listQuery: {
        dataBaseId: '1',
        tableName: '',
        tableComment: ''
      },
      list: [],
      dataBaseId: undefined,
      dataBaseList: [],
      TableInfo: {
        tableName: '',
        tableComment: '',
        swaggerAddress: '',
        engine: '',
        tableCollation: ''
      },
      tableCode: {
        projectConfigId: 1,
        dataBaseId: 1,
        tableName: ''
      },
      downLoadUrl: '',
      dialogStatus: '',
      textMap: {
        view: '查看项目信息',
        update: '编辑项目信息',
        create: '新增项目信息'
      },
      dialogFormVisible: false,
      multipleSelection: []
    }
  },
  created() {
    // this.getDataBaseList()
    this.getTablePage()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      const tableNames = this.multipleSelection.map(item => item.tableName)
      console.log(tableNames)
    },
    getTablePage() {
      this.listLoading = true
      getTablePage(this.listQuery, this.page, this.limit).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // debugger;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getDataBaseList() {
      getDataBaseList().then(response => {
        this.dataBaseList = response.data
      })
    },
    handleFilter() {
      this.page = 1
      this.getPage()
    },
    handleReset() {

    },
    handleSyc() {},
    handleProjecConfig() {},
    handleCreate(tableName) {
      this.tableCode.tableName = tableName
      createCode(this.tableCode).then(response => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.downLoadUrl = response.data.data
      })
    },
    handleBatchCreate() {
      console.log('批量生成')
    },
    handleDownload() {}
  }
}
</script>

<style scoped>

</style>
