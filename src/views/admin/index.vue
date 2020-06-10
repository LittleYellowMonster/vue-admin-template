<template>
  <div class="app-container">
    <!--搜索栏-->
    <div class="filter-container">
      <el-input v-model="listQuery.loginName" clearable size="medium" placeholder="请输入账户名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.realName" clearable size="medium" placeholder="请输入真实姓名" style="width: 200px;" class="filter-item" />
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
        ref="adminInfo"
        :model="adminInfo"
        label-width="70px"
        size="medium"
        label-position="left"
      >
        <el-form-item
          ref="uploadElement"
          label="头像"
          prop="avatar"
          :rules="[
            { required: true, message: '头像不能为空', trigger: 'blur' }
          ]"
        >
          <el-upload
            class="avatar-uploader"
            :action="imagesUploadApi"
            :data="fileData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="adminInfo.avatar" :src="adminInfo.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item
          label="账户"
          prop="loginName"
          :rules="[
            { required: true, message: '账户不能为空', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9]+$/, message: '只允许英文和数字' }
          ]"
        >
          <el-input
            v-model="adminInfo.loginName"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请设置登录账户"
          />
        </el-form-item>
        <el-form-item
          v-if="isPwdInputShow"
          label="密码"
          prop="password"
          :rules="[
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
             { pattern: /^[A-Za-z0-9]+$/, message: '只允许英文和数字' }
          ]"
        >
          <el-input
            v-model="adminInfo.password"
            show-password
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请设置密码"
          />
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="realName"
          :rules="[
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="adminInfo.realName"
            :autosize="{ minRows: 2, maxRows: 5}"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item label="个人简介" align="center">
          <el-input
            v-model="adminInfo.introduction"
            :autosize="{ minRows: 1, maxRows: 3}"
            placeholder="请输入简单个人介绍"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogStatus==='create'?createData('adminInfo'):updateData('adminInfo')">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
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
      <el-table-column label="头像" width="150" align="center">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatar" style="width: 20px; height:20px" />
        </template>
      </el-table-column>
      <el-table-column label="账户" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.loginName }}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.introduction }}
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getList, create, update, deleteById } from '@/api/admin'
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
        loginName: '',
        realName: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑管理员',
        create: '新增管理员'
      },
      dialogFormVisible: false,
      adminInfo: {
        avatar: '',
        loginName: '',
        password: '',
        realName: '',
        introduction: ''
      },
      list: [],
      isPwdInputShow: false,
      fileData: {
        folderName: 'laiaiTest',
        time: '1526712575167',
        cipher: '338D36C27ECF4FBE302F2B2C42A6F1BF1213'
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery, this.page, this.limit).then(response => {
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
      this.getList()
    },
    resetTemp() {
      this.adminInfo = {
        id: undefined,
        loginName: '',
        password: '',
        realName: ''
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
        this.getList()
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
            this.getList()
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
            this.getList()
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
      this.getList()
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.adminInfo = { ...this.adminInfo, avatar: res.ImgUrl }
    }
  }
}

</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
