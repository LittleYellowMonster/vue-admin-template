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
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="listLoading"
      height="630px"
      :row-style="{height:'40px'}"
      :cell-style="{padding:'20px'}"
      style="font-size: 15px"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      size="medium"
    >
      <el-table-column
        label="表名称"
        width="250"
        align="center"
        fixed="left"
      >
        <template slot-scope="scope">
          {{ scope.row.tableName }}
        </template>
      </el-table-column>
      <el-table-column label="表备注" width="250" align="center" fixed="left">
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
          <el-button type="info" icon="el-icon-view" size="small" @click="handleView(scope.row)">预览</el-button>
          <el-button type="primary" icon="el-icon-box" size="small" @click="handleUpdate(scope.row)">生成</el-button>
          <el-button type="warning" icon="el-icon-download" size="small" @click="handleDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTablePage" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getTablePage } from '@/api/database'
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
        tableName: '',
        tableComment: ''
      },
      list: [],
      TableInfo: {
        tableName: '',
        tableComment: '',
        swaggerAddress: '',
        engine: '',
        tableCollation: ''
      },
      dialogStatus: '',
      textMap: {
        view: '查看项目信息',
        update: '编辑项目信息',
        create: '新增项目信息'
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getTablePage()
  },
  methods: {
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
    handleFilter() {
      this.page = 1
      this.getPage()
    }
  }
}
</script>

<style scoped>

</style>
