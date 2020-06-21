<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container " style="height: 100px">
      <el-input v-model="listQuery.projectName" clearable size="medium" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.author" clearable size="medium" placeholder="请输入作者" style="width: 200px;" class="filter-item" />
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
    <!--新增/编辑/查看 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" width="45%">
      <el-form
        ref="projectInfo"
        :model="projectConfig"
        label-width="70px"
        size="medium"
        label-position="left"
      >
        <el-form-item
          label="名称"
          prop="projectName"
          :rules="[
            { required: true, message: '项目名称不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="projectConfig.projectName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请设置项目名称"
          />
        </el-form-item>
        <el-form-item label="模块名称" align="center">
          <el-input
            v-model="projectConfig.modelName"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入模块名称"
          />
        </el-form-item>
        <el-form-item label="包名" align="center">
          <el-input
            v-model="projectConfig.packageName"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入包名"
          />
        </el-form-item>
        <el-form-item label="springboot版本" align="center">
          <el-input
            v-model="projectConfig.springBootVersion"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入版本"
          />
        </el-form-item>
        <el-form-item label="添加权限" align="center">
          <el-input
            v-model="projectConfig.isRbac"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请选择rbac"
          />
        </el-form-item>
        <el-form-item label="remark" align="center">
          <el-input
            v-model="projectConfig.remark"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="项目备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogStatus==='create'?createData('projectConfig'):updateData('projectConfig')">确定</el-button>
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
      size="medium"
    >
      <el-table-column
        label="项目名称"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="模块名称" width="250" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.modelName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="包名称" width="250" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.packageName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="250" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.author }}</p>
        </template>
      </el-table-column>
      <el-table-column label="springboot版本" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.springBootVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否集成rbac" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.isRbac }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-opportunity" size="small" @click="handleView(scope.row)">查看</el-button>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getPage, create, update, deleteById } from '@/api/projectConfig'
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
        projectName: '',
        environment: ''
      },
      list: [],
      projectConfig: {
        id: undefined,
        projectName: '',
        modelName: '',
        packageName: '',
        author: '',
        springBootVersion: 2,
        isRbac: 0,
        remark: ''
      },
      dialogStatus: '',
      textMap: {
        view: '查看工程配置',
        update: '编辑工程配置',
        create: '新增工程配置'
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getPage()
  },
  methods: {
    getPage() {
      this.listLoading = true
      getPage(this.listQuery, this.page, this.limit).then(response => {
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
    },
    resetTemp() {
      this.projectConfig = {
        id: undefined,
        projectName: '',
        modelName: '',
        packageName: '',
        author: '',
        springBootVersion: 2,
        isRbac: 0,
        remark: ''
      }
    },
    resetListQuery() {
      this.listQuery = {
        projectName: '',
        environment: ''
      }
    },
    handleDelete(data) {
      deleteById(data).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getPage()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['projectConfig'].clearValidate()
      })
    },
    createData(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          create(this.projectConfig).then(response => {
            this.resetForm(data)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getPage()
          })
        } else {
          return false
        }
      })
    },
    handleUpdate(data) {
      this.dialogStatus = 'update'
      this.projectConfig = Object.assign({}, data) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['projectInfo'].clearValidate()
      })
    },
    updateData(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          update(this.projectConfig).then(response => {
            this.resetForm(data)
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getPage()
          })
        } else {
          return false
        }
      })
    },
    resetForm(data) {
      this.dialogFormVisible = false
      this.$refs[data].resetFields()
    },
    handleReset() {
      this.resetListQuery()
      this.getPage()
    }
  }
}
</script>

<style scoped>

</style>
