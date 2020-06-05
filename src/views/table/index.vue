<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size="medium"
    >
      <el-table-column align="center" label="主键id" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="数据库名称" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.dataBaseName }}
        </template>
      </el-table-column>
      <el-table-column label="数据库地址" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dataBaseUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库类型" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.dataBaseType }}
        </template>
      </el-table-column>
      <el-table-column label="数据库驱动" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.dataBaseDiver }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
     <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
