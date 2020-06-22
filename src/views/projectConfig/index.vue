<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container " style="height: 100px">
      <el-input v-model="listQuery.projectName" clearable size="medium" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.author" clearable size="medium" placeholder="请输入作者" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button style="margin-left: 10px;" type="warning" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <!--新增/编辑/查看 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" width="45%">
      <el-form
        ref="projectConfig"
        :model="projectConfig"
        label-width="70px"
        size="medium"
        label-position="left"
      >
        <el-form-item
          label="项目名称"
          prop="projectName"
        >
          <el-input
            v-model="projectConfig.projectName"
            size="small"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请设置项目名称"
          />
        </el-form-item>
        <el-form-item label="项目备注" align="center">
          <el-input
            v-model="projectConfig.remark"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="项目备注"
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
        <el-form-item label="作者" align="center">
          <el-input
            v-model="projectConfig.author"
            :autosize="{ minRows: 1, maxRows: 4}"
            placeholder="请填写作者"
          />
        </el-form-item>
        <el-form-item label="springBoot版本" align="left">
          <el-select v-model="projectConfig.springBootVersion" placeholder="请选择环境">
            <el-option v-for="item in springBootVersion" :key="item.type" :label="item.version" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="添加权限" align="left">
          <el-select v-model="projectConfig.isRbac" placeholder="请选择是否生成rbac">
            <el-option v-for="item in checkRbac" :key="item.value" :label="item.statue" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isShowBtn" type="primary" @click="dialogStatus==='create'?createData('projectConfig'):updateData('projectConfig')">确定</el-button>
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
      <el-table-column align="center" label="主键id" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块名称" width="150" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.modelName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="包名称" width="200" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.packageName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="200" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.author }}</p>
        </template>
      </el-table-column>
      <el-table-column label="springboot版本" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.springBootVersion | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否集成rbac" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.isRbac | rbacFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="250">
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

// springBoot版本：1: 1.x  2: 2.x
const springBootVersion = [
  { 'type': 1, 'version': '1.x' },
  { 'type': 2, 'version': '2.x' }
]

const checkRbac = [
  { 'value': 0, 'statue': 'false' },
  { 'value': 1, 'statue': 'true' }
]

// 查询枚举
const springBootVersionKeyValue = springBootVersion.reduce((acc, cur) => {
  acc[cur.type] = cur.version
  return acc
}, {})

const checkRbacKeyValue = checkRbac.reduce((acc, cur) => {
  acc[cur.value] = cur.statue
  return acc
}, {})

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return springBootVersionKeyValue[type]
    },
    rbacFilter(type) {
      return checkRbacKeyValue[type]
    }
  },
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
        projectName: '',
        modelName: '',
        packageName: 'com.laiai',
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
      dialogFormVisible: false,
      isShowBtn: false,
      springBootVersion,
      checkRbac,
      rules: {
        projectName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { pattern: /^[a-zA-Z\d_-]+$/, message: '数字、26个英文字母或者短线组成的字符串' }
        ],
        remark: [
          { required: true, message: '项目备注不能为空', trigger: 'blur' }
        ],
        packageName: [
          { required: true, message: '包名称不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        modelName: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' }
        ],
        springBootVersion: [
          { required: true, message: '版本不能未选择', trigger: 'blur' }
        ],
        isRbac: [
          { required: true, message: '是否集成rbac未选择', trigger: 'blur' }
        ]
      }
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
        packageName: 'com.laiai',
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
    handleView(data) {
      this.dialogStatus = 'view'
      this.isShowBtn = false
      this.projectConfig = Object.assign({}, data) // copy obj
      this.dialogFormVisible = true
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.isShowBtn = true
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
      this.isShowBtn = true
      this.$nextTick(() => {
        this.$refs['projectConfig'].clearValidate()
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
