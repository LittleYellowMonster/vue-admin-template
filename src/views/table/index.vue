<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.dataBaseName" clearable size="medium" placeholder="请输入数据库名称" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button style="margin-left: 10px;" type="warning" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
    </div>
    <!--新增/编辑 -->
    <el-dialog title="新增数据库" :visible.sync="dialogFormVisible" :show-close="false" width="30%">
      <el-form ref="addDataBase" :model="dataBase" label-width="60px" size="medium">
        <el-form-item label="名称" prop="dataBaseName">
          <el-input
            v-model="dataBase.dataBaseName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库名称"
            suffix-icon="el-icon-date"
          />
        </el-form-item>
        <el-form-item label="地址" prop="dataBaseUrl">
          <el-input
            v-model="dataBase.dataBaseUrl"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库地址"
            suffix-icon="el-icon-date"
          />
        </el-form-item>
        <el-form-item label="类型" prop="dataBaseType">
          <!-- <el-input
            v-model="dataBase.dataBaseType"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库类型"
            suffix-icon="el-icon-date"
          />-->
          <el-select
            v-model="dataBase.dataBaseType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in baseTypes"
              :key="item.index"
              :label="item"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="dataBase.userName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库用户名"
            suffix-icon="el-icon-date"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="dataBase.password"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dateBaseAdd">确定</el-button>
          <el-button @click="dateBaseCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      size="medium"
    >
      <el-table-column align="center" label="主键id" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="数据库名称" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.dataBaseName }}
        </template>
      </el-table-column>
      <el-table-column label="数据库地址" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dataBaseUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库类型" width="150" align="center">
        <template slot-scope="scope">
          {{ baseTypes[scope.row.dataBaseType] }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="400"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button style="margin-right: 10px;" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDataBaseList" />
  </div>
</template>

<script>
import { getDataBaseList } from '@/api/table'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
        dataBaseName: ''
      },
      dialogFormVisible: false,
      list: [],
      baseTypes: {
        0: 'Mysql',
        1: 'SqlServer',
        2: 'Postgresql',
        3: 'Oracle'
      },
      dataBase: {
        dataBaseName: '',
        dataBaseType: 0,
        dataBaseUrl: '',
        userName: '',
        password: ''
      }
    }
  },
  created() {
    this.getDataBaseList()
  },
  methods: {
    getDataBaseList() {
      this.listLoading = true
      getDataBaseList(this.listQuery, this.page, this.limit).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.page = 1
      this.getDataBaseList()
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleDelete(data) {
      alert('删除id' + data)
    },
    dateBaseAdd() {
      console.log(this.dataBase)
    },
    handleUpdate(data) {
      this.dialogFormVisible = true
      this.dataBase = data
    },
    handleReset() {
      this.listQuery = {}
      this.getDataBaseList()
    },
    dateBaseCancel() {
      this.dialogFormVisible = false
      this.dataBase = {}
    }
  }
}
</script>
