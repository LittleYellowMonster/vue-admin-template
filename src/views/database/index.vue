<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container" style="height: 100px">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" width="30%">
      <el-form
        ref="dataBase"
        :rules="rules"
        :model="dataBase"
        label-width="70px"
        size="medium"
        label-position="left"
      >
        <el-form-item label="名称" prop="dataBaseName">
          <el-input
            v-model="dataBase.dataBaseName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库名称"
          />
        </el-form-item>
        <el-form-item label="地址" prop="dataBaseUrl">
          <el-input
            v-model="dataBase.dataBaseUrl"
            style="width: 300px"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入数据库地址"
          />
          <el-button :loading="loading" type="success" @click="testConnectDatabase">测试</el-button>
        </el-form-item>
        <el-form-item label="类型" prop="dataBaseType">
          <el-select
            v-model="dataBase.dataBaseType"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dataBaseTypes"
              :key="item.dataBaseType"
              :label="item.baseTypeName"
              :value="item.dataBaseType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="userName" align="center">
          <el-input
            v-model="dataBase.userName"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入数据库用户名"
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
          <el-button type="primary" @click="dialogStatus==='create'?createData('dataBase'):updateData('dataBase')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
          {{ dataBaseTypes[scope.row.dataBaseType].baseTypeName }}
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
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row.id)"
          >
            <el-button slot="reference" style="margin-right: 10px;" type="danger" size="small" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDataBaseList" />
  </div>
</template>

<script>
import { getDataBaseList, createDataBase, updateDataBase, deleteDataBase, testDbConnect } from '@/api/database'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const dataBaseTypes = [
  { 'dataBaseType': 0, 'baseTypeName': 'Mysql' },
  { 'dataBaseType': 1, 'baseTypeName': 'SqlServer' },
  { 'dataBaseType': 2, 'baseTypeName': 'Postgresql' },
  { 'dataBaseType': 3, 'baseTypeName': 'Oracle' }
]

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
      loading: false,
      dialogFormVisible: false,
      list: [],
      dataBaseTypes,
      dataBase: {
        dataBaseName: '',
        dataBaseType: 0,
        dataBaseUrl: 'jdbc:mysql://',
        userName: '',
        password: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑数据库',
        create: '新增数据库'
      },
      rules: {
        dataBaseName: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 2, max: 9, message: '长度在 2 到 9 个字符', trigger: 'blur' }
        ],
        dataBaseUrl: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        dataBaseType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
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
        // debugger;
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
    resetTemp() {
      this.dataBase = {
        dataBaseName: '',
        dataBaseType: 0,
        dataBaseUrl: 'jdbc:mysql://',
        userName: '',
        password: ''
      }
    },
    testConnectDatabase() {
      this.$refs['dataBase'].validate((valid) => {
        if (valid) {
          this.loading = true
          testDbConnect(this.dataBase).then((res) => {
            this.loading = false
            console.log('连接结果如下===>' + res)
            this.$notify({
              title: '成功',
              message: '链接成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataBase'].clearValidate()
      })
    },
    handleDelete(data) {
      deleteDataBase(data).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getDataBaseList()
      })
    },
    createData(dataBase) {
      this.$refs[dataBase].validate((valid) => {
        if (valid) {
          createDataBase(this.dataBase).then(response => {
            this.resetForm(dataBase)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getDataBaseList()
          })
        } else {
          return false
        }
      })
    },
    updateData(dataBase) {
      this.$refs[dataBase].validate((valid) => {
        if (valid) {
          updateDataBase(this.dataBase).then(response => {
            this.resetForm(dataBase)
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getDataBaseList()
          })
        } else {
          return false
        }
      })
    },
    resetForm(dataBase) {
      this.dialogFormVisible = false
      this.$refs[dataBase].resetFields()
    },
    handleUpdate(dataBase) {
      this.dialogStatus = 'update'
      this.dataBase = Object.assign({}, dataBase) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataBase'].clearValidate()
      })
    },
    handleReset() {
      this.listQuery = {}
      this.getDataBaseList()
    }
  }
}
</script>
