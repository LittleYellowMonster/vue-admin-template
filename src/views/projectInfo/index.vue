<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container " style="height: 100px">
      <el-input v-model="listQuery.projectName" clearable size="medium" placeholder="请输入项目名称" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.environment" placeholder="请选择环境" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in environmentTypes" :key="item.type" :label="item.envName" :value="item.type" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button style="margin-left: 10px;" type="warning" icon="el-icon-refresh" @click="handleReset">
        重置
      </el-button>
      <a href="https://fe.lai-ai.com/teamwork/project" target="_blank"><el-button style="margin-left: 10px;" type="primary" plain icon="el-icon-link"> 前端项目配置信息 </el-button></a>
    </div>
    <!--新增/编辑/查看 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" width="45%">
      <el-form
        ref="projectInfo"
        :model="projectInfo"
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
            v-model="projectInfo.projectName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请设置项目名称"
          />
        </el-form-item>
        <el-form-item
          label="swagger"
          prop="swaggerAddress"
        >
          <el-input
            v-model="projectInfo.swaggerAddress"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="输入项目swagger地址"
          />
        </el-form-item>
        <el-form-item
          label="ip端口"
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
        <el-form-item label="jenkins" align="center">
          <el-input
            v-model="projectInfo.jenkinsAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入jenkins地址"
          />
        </el-form-item>
        <el-form-item label="apollo" align="center">
          <el-input
            v-model="projectInfo.apolloAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入apollo地址"
          />
        </el-form-item>
        <el-form-item label="xx-job" align="center">
          <el-input
            v-model="projectInfo.xxjobAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入xx-job地址"
          />
        </el-form-item>
        <el-form-item label="kibana" align="center">
          <el-input
            v-model="projectInfo.kibanaAddress"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入kibana地址"
          />
        </el-form-item>
        <el-form-item label="remark" align="center">
          <el-input
            v-model="projectInfo.remark"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="项目备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="isShowBtn" type="primary" @click="dialogStatus==='create'?createData('projectInfo'):updateData('projectInfo')">确定</el-button>
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
          <span>{{ scope.row.environment | typeFilter }}</span>
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
      <el-table-column label="ip端口" width="200" align="center">
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

<script la>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getPage, create, update, deleteById } from '@/api/projectInfo'

const environmentTypes = [
  { 'type': 1, 'envName': '开发(dev)' },
  { 'type': 2, 'envName': '测试(sit)' },
  { 'type': 3, 'envName': '预发(pre)' },
  { 'type': 4, 'envName': '生产(prod)' }
]
// 查询枚举
const environmentTypeKeyValue = environmentTypes.reduce((acc, cur) => {
  acc[cur.type] = cur.envName
  return acc
}, {})
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      return environmentTypeKeyValue[type]
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
      projectInfo: {
        id: undefined,
        projectName: '',
        environment: '',
        swaggerAddress: '',
        serverPort: '',
        jenkinsAddress: '',
        apolloAddress: '',
        xxjobAddress: '',
        kibanaAddress: '',
        remark: ''
      },
      environmentTypes,
      isShowBtn: true,
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
      this.isShowBtn = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['projectInfo'].clearValidate()
      })
    },
    createData(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          create(this.projectInfo).then(response => {
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
    handleView(data) {
      this.dialogStatus = 'view'
      this.isShowBtn = false
      this.projectInfo = Object.assign({}, data) // copy obj
      this.dialogFormVisible = true
    },
    handleUpdate(data) {
      this.dialogStatus = 'update'
      this.isShowBtn = true
      this.projectInfo = Object.assign({}, data) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['projectInfo'].clearValidate()
      })
    },
    updateData(data) {
      this.$refs[data].validate((valid) => {
        if (valid) {
          update(this.projectInfo).then(response => {
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
