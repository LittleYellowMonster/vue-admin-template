<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container " style="height: 100px">
      <el-input v-model="listQuery.projectName" clearable size="medium" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.environment" clearable size="medium" placeholder="请输入环境" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button style="margin-left: 10px;" type="warning" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
      <a href="https://fe.lai-ai.com/teamwork/project" target="_blank"><el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-link" > 前端项目配置信息 </el-button></a>
    </div>
    <!--新增/编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" width="30%">
      <el-form
        ref="projectInfo"
        :model="projectInfo"
        label-width="70px"
        size="medium"
        label-position="left"
      >
        <el-form-item
          label="项目名称"
          prop="projectName"
          :rules="[
            { required: true, message: '项目名称不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="projectInfo.loginName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请设置项目名称"
          />
        </el-form-item>
        <el-form-item
          label="swagger地址"
          prop="swaggerAddress"
        >
          <el-input
            v-model="projectInfo.swaggerAddress"
            show-password
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="输入项目swagger地址"
          />
        </el-form-item>
        <el-form-item
          label="服务ip端口"
          prop="serverPort"
          :rules="[
            { required: true, message: '服务ip端口不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="projectInfo.serverPort"
            :autosize="{ minRows: 2, maxRows: 5}"
            placeholder="请输入服务ip端口"
          />
        </el-form-item>
        <el-form-item label="jenkins地址" align="center">
          <el-input
            v-model="projectInfo.jenkinsAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入jenkins地址"
          />
        </el-form-item>
        <el-form-item label="apollo地址" align="center">
          <el-input
            v-model="projectInfo.apolloAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入apollo地址"
          />
        </el-form-item>
        <el-form-item label="xx-job地址" align="center">
          <el-input
            v-model="projectInfo.xxjobAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入xx-job地址"
          />
        </el-form-item>
        <el-form-item label="日志查看地址" align="center">
          <el-input
            v-model="projectInfo.kibanaAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入kibana地址"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogStatus==='create'?createData('projectInfo'):updateData('projectInfo')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      v-loading="listLoading"
      height="600px"
      :row-style="{height:'40px'}"
      :cell-style="{padding:'20px'}"
      style="font-size: 15px"
      :data="list"
      :row-class-name="tableRowClassName"
      element-loading-text="Loading"
      fit
      border
      size="medium"
    >
      <el-table-column
        label="项目名称"
        width="150"
        align="center"
        fixed="left"
      >
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="项目环境" width="150" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{ environmentType[scope.row.environment].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="jenkins地址" width="250" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.jenkinsAddress }}</p>
            <el-button
              v-clipboard:copy="scope.row.jenkinsAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="text"
            > 复制 </el-button>
            <a :href="scope.row.jenkinsAddress" target="_blank"><el-button type="text"> 跳转 </el-button></a>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.jenkinsAddress }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="apollo地址" width="250" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.apolloAddress }}</p>
            <el-button
              v-clipboard:copy="scope.row.apolloAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="text"
            > 复制</el-button>
            <a :href="scope.row.apolloAddress" target="_blank"><el-button type="text"> 跳转</el-button></a>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.apolloAddress }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="xx-job地址" width="250" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.xxjobAddress }}</p>
            <el-button
              v-clipboard:copy="scope.row.xxjobAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="text"
            > 复制</el-button>
            <a :href="scope.row.xxjobAddress" target="_blank"><el-button type="text"> 跳转</el-button></a>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.xxjobAddress }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="ip端口" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serverPort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="kibana地址" width="300" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.kibanaAddress }}</p>
            <el-button
              v-clipboard:copy="scope.row.kibanaAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="text"
            > 复制</el-button>
            <a :href="scope.row.kibanaAddress" target="_blank"><el-button type="text"> 跳转</el-button></a>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.kibanaAddress }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="swagger地址" width="300" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.swaggerAddress }}</p>
            <el-button
              v-clipboard:copy="scope.row.swaggerAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              type="text"
            > 复制</el-button>
            <a :href="scope.row.swaggerAddress" target="_blank"><el-button type="text"> 跳转</el-button></a>
            <div slot="reference" class="name-wrapper">
              <span>{{ scope.row.swaggerAddress }}</span>
            </div>
          </el-popover>
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
        width="230"
        align="center"
        fixed="right"
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getPage, create, update, deleteById } from '@/api/projectInfo'
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
      projectInfo: {
        id: undefined,
        projectName: '',
        environment: '',
        swaggerAddress: '',
        serverPort: '',
        jenkinsAddress: '',
        apolloAddress: '',
        xxjobAddress: '',
        kibanaAddress: ''
      },
      environmentType: [
        { 'type': 0, 'name': '未知' },
        { 'type': 1, 'name': '开发(dev)' },
        { 'type': 2, 'name': '测试(sit)' },
        { 'type': 3, 'name': '预发(pre)' },
        { 'type': 4, 'name': '生产(prod)' }
      ],
      dialogStatus: '',
      textMap: {
        update: '编辑管理员',
        create: '新增管理员'
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
    tableRowClassName({ row, rowIndex }) {
      const env = row.environment
      if (env === 1) {
        return 'dev-row'
      } else if (env === 2) {
        return 'sit-row'
      } else if (env === 3) {
        return 'pre-row'
      } else if (env === 4) {
        return 'prod-row'
      } else {
        return 'dev-row'
      }
    },
    resetTemp() {
      this.projectInfo = {
        id: undefined,
        projectName: '',
        environment: '',
        swaggerAddress: '',
        serverPort: '',
        jenkinsAddress: '',
        apolloAddress: '',
        xxjobAddress: '',
        kibanaAddress: ''
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
      this.isPwdInputShow = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['adminInfo'].clearValidate()
      })
    },
    createData(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          create(this.adminInfo).then(response => {
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
      this.isPwdInputShow = false
      this.adminInfo = Object.assign({}, data) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['adminInfo'].clearValidate()
      })
    },
    updateData(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          update(this.adminInfo).then(response => {
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
      this.listQuery = {}
      this.getPage()
    },
    onCopy: function(e) {
      this.$message({ message: '复制成功', type: 'success' })
    },
    onError: function(e) {
      this.$message.error('复制失败')
    }
  }
}
</script>

<style>

.el-table .dev-row {
  background: #FFFFFF;
}
.el-table .sit-row {
  background: #cdf1ba;
}
.el-table .pre-row {
  background: #f1ca8e;
}
.el-table .prod-row {
  background: #efa8a8;
}

</style>
